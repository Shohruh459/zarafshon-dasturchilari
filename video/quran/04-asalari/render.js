#!/usr/bin/env node
/**
 * Renders "Asalari" (Qur'on va ilm, 4-qism), 1080x1920, 34s: the text layer
 * of scene.html over the stock-footage plate built by plate.js.
 *
 * Usage:
 *   node video/quran/04-asalari/render.js [output.mp4]
 *   node video/quran/04-asalari/render.js --stills 1,6,12,16,24,29
 */
const fs = require('fs');
const path = require('path');
const { renderScene, renderStills } = require('../../lib/render');
const { generateAudio, DURATION } = require('./audio');
const { buildPlate } = require('./plate');

const page = 'quran/04-asalari/scene.html';
const plate = path.join(__dirname, 'plate.mp4');
const args = process.argv.slice(2);
const si = args.indexOf('--stills');

(async () => {
  if (!fs.existsSync(plate) || args.includes('--plate')) buildPlate(plate);
  if (si !== -1) {
    await renderStills({ page, times: args[si + 1].split(',').map(Number), outDir: __dirname, background: plate });
    return;
  }
  const file = args.find((a) => !a.startsWith('--') && a !== args[si + 1]);
  await renderScene({
    page,
    duration: DURATION,
    out: path.resolve(file || path.join(__dirname, 'asalari.mp4')),
    audio: generateAudio(path.join(__dirname, 'audio.wav')),
    background: plate,
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
