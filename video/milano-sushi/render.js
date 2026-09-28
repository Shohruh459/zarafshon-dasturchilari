#!/usr/bin/env node
/**
 * Renders the Milano Foods sushi reel, 1080x1920, 15s.
 * Run `python3 video/milano/prep.py` and `python3 video/milano-sushi/pieces.py` first.
 *
 * Usage:
 *   node video/milano-sushi/render.js [output.mp4]
 *   node video/milano-sushi/render.js --stills 0.5,1.3,2.8,4.8,5.8,7.5,10,13
 */
const path = require('path');
const { renderScene, renderStills } = require('../lib/render');
const { generateAudio, DURATION } = require('./audio');

const page = 'milano-sushi/scene.html';
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
    out: path.resolve(file || path.join(__dirname, 'milano-sushi.mp4')),
    audio: generateAudio(path.join(__dirname, 'audio.wav')),
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
