/**
 * Lays voice-over MP3s (see video/quran/common/tts.py) over a sound-effects
 * WAV: each line starts at its time in `starts`, and the effects duck under
 * the voice with a side-chain compressor.
 *
 *   mixVoice({ sfx, out, dir, starts: { hook: 0.3, ayah: 5.3 }, duration });
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function mixVoice({ sfx, out, dir, starts, duration }) {
  const keys = Object.keys(starts).filter((k) => fs.existsSync(path.join(dir, `${k}.mp3`)));
  if (!keys.length) { fs.copyFileSync(sfx, out); return out; }
  const inputs = keys.flatMap((k) => ['-i', path.join(dir, `${k}.mp3`)]);
  const lines = keys.map((k, i) => `[${i + 1}:a]aresample=44100,aformat=channel_layouts=stereo,adelay=${Math.round(starts[k] * 1000)}:all=1[l${i}]`);
  execFileSync(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error', '-i', sfx, ...inputs,
    '-filter_complex', [
      ...lines,
      `${keys.map((_, i) => `[l${i}]`).join('')}amix=inputs=${keys.length}:normalize=0,apad,atrim=0:${duration},highpass=f=70,volume=1.6,asplit[vo][key]`,
      '[0:a][key]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=350[duck]',
      '[duck]volume=0.6[bg]',
      '[bg][vo]amix=inputs=2:normalize=0,alimiter=limit=0.9[out]',
    ].join(';'),
    '-map', '[out]', '-ar', '44100', out,
  ], { stdio: 'inherit' });
  return out;
}

module.exports = { mixVoice };
