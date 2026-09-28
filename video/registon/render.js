#!/usr/bin/env node
/**
 * Builds the REGISTON hotel ad (1080x1920, 15s):
 *   1. plate.py   -> plate.mp4  (camera moves over the real photos)
 *   2. audio.js   -> audio.wav  (calm instrumental bed)
 *   3. overlay.html rendered frame by frame with a transparent background in
 *      headless Chromium, composited over the plate by FFmpeg.
 *
 * Usage:
 *   node video/registon/render.js [output.mp4]
 *   node video/registon/render.js --stills 2,6,10,14   # PNG previews (plate + text)
 *   node video/registon/render.js --reuse-plate        # skip re-rendering plate.mp4
 */
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { generateAudio } = require('./audio');

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 15;

const dir = __dirname;
const args = process.argv.slice(2);
const stillsIdx = args.indexOf('--stills');

function python(...pyArgs) {
  const r = spawnSync('python3', ['plate.py', ...pyArgs], { cwd: dir, stdio: 'inherit' });
  if (r.status !== 0) throw new Error('plate.py failed');
}

async function openOverlay() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(dir, 'overlay.html'));
  await page.evaluate(() => document.fonts.ready);
  return { browser, page };
}

async function renderStills(times) {
  python('--stills', times.join(','));
  const { browser, page } = await openOverlay();
  for (const t of times) {
    // Preview only: show the plate still behind the text layer.
    await page.evaluate(([t, bg]) => {
      document.body.style.background = `url("${bg}") center / cover`;
      window.renderFrame(t);
    }, [t, `plate-${t}s.png`]);
    const file = path.join(dir, `still-${t}s.png`);
    await page.screenshot({ path: file });
    console.log('wrote', file);
  }
  await browser.close();
}

async function renderVideo(output) {
  if (!args.includes('--reuse-plate') || !fs.existsSync(path.join(dir, 'plate.mp4'))) python();
  const audio = generateAudio(path.join(dir, 'audio.wav'));
  const { browser, page } = await openOverlay();

  const ff = spawn(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-i', path.join(dir, 'plate.mp4'),
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-i', audio,
    '-filter_complex', '[0:v][1:v]overlay=0:0:format=auto,format=yuv420p[v]',
    '-map', '[v]', '-map', '2:a',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
    '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-16:TP=-1.5',
    '-t', String(DURATION), '-movflags', '+faststart',
    output,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => {
    ff.on('error', reject);
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}`))));
  });

  const total = DURATION * FPS;
  console.log(`Compositing ${total} frames -> ${output}`);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.renderFrame(t), i / FPS);
    const png = await page.screenshot({ type: 'png', omitBackground: true });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % FPS === 0) process.stdout.write(`\r  text ${Math.round((i / total) * 100)}%`);
  }
  ff.stdin.end();
  await done;
  await browser.close();
  console.log('\r  text 100%\nDone.');
}

(async () => {
  if (stillsIdx !== -1) {
    await renderStills(args[stillsIdx + 1].split(',').map(Number));
  } else {
    const file = args.find((a) => !a.startsWith('--'));
    await renderVideo(path.resolve(file || path.join(dir, 'registon.mp4')));
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
