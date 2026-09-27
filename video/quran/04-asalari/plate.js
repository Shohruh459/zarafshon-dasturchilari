#!/usr/bin/env node
/**
 * Cuts the stock footage in clips/ into the 1080x1920 background plate that
 * scene.html is laid over. HD shots are cropped to 9:16 with a slow pan that
 * follows the bee; the 480p shots are shown whole as a 16:9 "card" over a
 * blurred copy of themselves (a 4x upscale would look soft).
 *
 * Clips (free stock footage from Pexels / Pixabay, downloaded by the channel):
 *   bee-blossom   honeybee on hawthorn blossom (1920x1080)
 *   hive-entrance bees at a red hive entrance (1280x720, trimmed from 1s)
 *   field         yellow flower field (1920x1080, trimmed from 2s)
 *   comb          bees covering a honeycomb frame (852x480)
 *   bee-flower    bee on an orange flower (852x480)
 *
 * Usage:  node video/quran/04-asalari/plate.js [out.mp4]
 */
const { execFileSync } = require('child_process');
const path = require('path');

// Kept in sync with the timeline T in scene.html. x0/x1: horizontal centre of
// the 9:16 crop at the start/end of the shot, in source pixels.
const SHOTS = [
  { clip: 'bee-blossom', ss: 0, dur: 3.5, x0: 950, x1: 780 },  // hook
  { clip: 'hive-entrance', ss: 1, dur: 5, x0: 600, x1: 680 },  // 16:68, "houses"
  { clip: 'field', ss: 1, dur: 4, x0: 800, x1: 1100 },         // 16:69, "eat of all fruits"
  { clip: 'comb', ss: 0, dur: 6.5, card: true, pre: 'crop=796:448:28:16' }, // letterboxed source; feminine verbs
  { clip: 'bee-flower', ss: 2, dur: 5.5, card: true },         // colours of honey
  { clip: 'hive-entrance', ss: 10, dur: 5, x0: 700, x1: 640 }, // healing
  { clip: 'bee-blossom', ss: 6, dur: 4.5, x0: 400, x1: 560 },  // closing ayah
];
const DURATION = SHOTS.reduce((s, x) => s + x.dur, 0);
const CARD_Y = 620;
const GRADE = 'eq=contrast=1.06:saturation=1.1:gamma=0.97';

function buildPlate(out) {
  const inputs = [], filters = [];
  SHOTS.forEach((s, i) => {
    inputs.push('-ss', String(s.ss), '-t', String(s.dur), '-i', path.join(__dirname, 'clips', `${s.clip}.mp4`));
    const head = `[${i}:v]fps=30,setpts=PTS-STARTPTS${s.pre ? `,${s.pre}` : ''}`;
    if (s.card) {
      filters.push(
        `${head},split[a${i}][b${i}]`,
        `[a${i}]scale=-2:1920,crop=1080:1920,boxblur=40:2,eq=brightness=-0.14:saturation=0.8[bg${i}]`,
        `[b${i}]scale=1080:608:flags=lanczos,unsharp=5:5:0.6,${GRADE}[fg${i}]`,
        `[bg${i}][fg${i}]overlay=0:${CARD_Y},setsar=1[v${i}]`,
      );
    } else {
      // crop width for 9:16 at the source height; ih*9/16 evaluated by ffmpeg
      const x = `min(max(${s.x0}+(${s.x1 - s.x0})*t/${s.dur}-ih*9/32\\,0)\\,iw-ih*9/16)`;
      filters.push(`${head},crop=ih*9/16:ih:${x}:0,scale=1080:1920:flags=lanczos,unsharp=5:5:0.4,${GRADE},setsar=1[v${i}]`);
    }
  });
  filters.push(`${SHOTS.map((_, i) => `[v${i}]`).join('')}concat=n=${SHOTS.length}:v=1:a=0,format=yuv420p[out]`);
  execFileSync(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error', ...inputs,
    '-filter_complex', filters.join(';'), '-map', '[out]', '-r', '30',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', out,
  ], { stdio: 'inherit' });
  return out;
}

module.exports = { buildPlate, SHOTS, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'plate.mp4'));
  console.log('wrote', buildPlate(out), `(${DURATION}s)`);
}
