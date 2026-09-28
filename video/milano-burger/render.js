#!/usr/bin/env node
/**
 * Renders the Milano Foods "Achchiq burger" reel, 1080x1920, 13s.
 * Run `python3 video/milano-burger/layers.py` first to cut the layers into assets/.
 *
 * Usage:
 *   node video/milano-burger/render.js [output.mp4]
 *   node video/milano-burger/render.js --stills 1,2.5,3.5,5,7,9.5,12
 */
const path = require('path');
const { renderScene, renderStills } = require('../lib/render');
const { generateAudio, DURATION } = require('./audio');

const page = 'milano-burger/scene.html';
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
    out: path.resolve(file || path.join(__dirname, 'achchiq-burger.mp4')),
    audio: generateAudio(path.join(__dirname, 'audio.wav')),
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
