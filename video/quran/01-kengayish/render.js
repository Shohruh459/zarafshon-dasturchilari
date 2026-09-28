#!/usr/bin/env node
/**
 * Renders "Kengayib borayotgan koinot" (Qur'on va ilm, 1-qism), 1080x1920, 30s.
 *
 * Usage:
 *   node video/quran/01-kengayish/render.js [output.mp4]
 *   node video/quran/01-kengayish/render.js --stills 1,6,12,16,24,29
 */
const path = require('path');
const { renderScene, renderStills } = require('../../lib/render');
const { generateAudio, DURATION } = require('./audio');

const page = 'quran/01-kengayish/scene.html';
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
    out: path.resolve(file || path.join(__dirname, 'kengayish.mp4')),
    audio: generateAudio(path.join(__dirname, 'audio.wav')),
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
