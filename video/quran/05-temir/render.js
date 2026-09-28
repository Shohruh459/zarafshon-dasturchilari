#!/usr/bin/env node
/**
 * Renders "Temir" (Qur'on va ilm, 5-qism), 1080x1920, 52s.
 *
 * Usage:
 *   node video/quran/05-temir/render.js [output.mp4]
 *   node video/quran/05-temir/render.js --stills 2,8,15,25,31,38,44,50
 */
const path = require('path');
const { renderScene, renderStills } = require('../../lib/render');
const { generateAudio, DURATION } = require('./audio');

const page = 'quran/05-temir/scene.html';
const args = process.argv.slice(2);
const si = args.indexOf('--stills');

(async () => {
  if (si !== -1) {
    await renderStills({ page, times: args[si + 1].split(',').map(Number), outDir: __dirname });
    return;
  }
  const file = args.find((a) => !a.startsWith('--'));
  await renderScene({
    page,
    duration: DURATION,
    out: path.resolve(file || path.join(__dirname, 'temir.mp4')),
    audio: generateAudio(path.join(__dirname, 'audio.wav')),
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
