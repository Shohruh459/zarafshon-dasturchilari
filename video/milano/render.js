#!/usr/bin/env node
/**
 * Renders the Milano Foods ad, 1080x1920, 24s.
 * Run `python3 video/milano/prep.py` first to build assets/ from src/.
 *
 * Usage:
 *   node video/milano/render.js [output.mp4]
 *   node video/milano/render.js --stills 1,3.5,6,9,12,16,21
 */
const path = require('path');
const { renderScene, renderStills } = require('../lib/render');
const { generateAudio, DURATION } = require('./audio');

const page = 'milano/scene.html';
const args = process.argv.slice(2);
const si = args.indexOf('--stills');

(async () => {
  if (si !== -1) {
    await renderStills({ page, times: args[si + 1].split(',').map(Number), outDir: __dirname });
    return;
  }
  const file = args.find((a, i) => !a.startsWith('--') && (si === -1 || i !== si + 1));
  await renderScene({
    page,
    duration: DURATION,
    out: path.resolve(file || path.join(__dirname, 'milano.mp4')),
    audio: generateAudio(path.join(__dirname, 'audio.wav')),
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
