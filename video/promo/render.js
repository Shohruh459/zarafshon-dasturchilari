#!/usr/bin/env node
/**
 * Renders scene.html frame by frame in headless Chromium and pipes the frames
 * into FFmpeg, producing a vertical 1080x1920 promo video.
 *
 * Usage:
 *   node video/promo/render.js [output.mp4]
 *   node video/promo/render.js --stills 1.5,5,10   # PNG previews at given seconds
 *   node video/promo/render.js --no-audio          # skip the soundtrack
 *
 * Environment:
 *   FFMPEG_PATH  path to the ffmpeg binary (default: "ffmpeg" on PATH)
 */
const { spawn } = require('child_process');
const path = require('path');
const { chromium } = require('playwright');
const { generateMusic } = require('./music');

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 11; // seconds: hook 0-3, offer 3-8, CTA 8-11

const ffmpegBin = process.env.FFMPEG_PATH || 'ffmpeg';
const scene = 'file://' + path.join(__dirname, 'scene.html');
const args = process.argv.slice(2);
const stillsIdx = args.indexOf('--stills');

async function openPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  await page.goto(scene);
  await page.evaluate(() => document.fonts.ready);
  return { browser, page };
}

async function renderStills(times) {
  const { browser, page } = await openPage();
  for (const t of times) {
    await page.evaluate((t) => window.renderFrame(t), t);
    const file = path.join(__dirname, `still-${t}s.png`);
    await page.screenshot({ path: file });
    console.log('wrote', file);
  }
  await browser.close();
}

function startFfmpeg(output, audio) {
  const audioArgs = audio
    ? ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-14:TP=-1.5', '-shortest']
    : [];
  const proc = spawn(ffmpegBin, [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    ...audioArgs,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    output,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => {
    proc.on('error', reject);
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}`))));
  });
  return { proc, done };
}

async function renderVideo(output, withAudio) {
  const audio = withAudio ? generateMusic(path.join(__dirname, 'music.wav')) : null;
  const { browser, page } = await openPage();
  const { proc, done } = startFfmpeg(output, audio);
  const total = Math.round(DURATION * FPS);

  console.log(`Rendering ${total} frames (${WIDTH}x${HEIGHT} @ ${FPS}fps) -> ${output}`);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.renderFrame(t), i / FPS);
    const png = await page.screenshot({ type: 'png' });
    if (!proc.stdin.write(png)) {
      await new Promise((r) => proc.stdin.once('drain', r));
    }
    if (i % FPS === 0) process.stdout.write(`\r  ${Math.round((i / total) * 100)}%`);
  }
  proc.stdin.end();
  await done;
  await browser.close();
  console.log('\r  100%\nDone.');
}

(async () => {
  if (stillsIdx !== -1) {
    await renderStills(args[stillsIdx + 1].split(',').map(Number));
  } else {
    const file = args.find((a) => !a.startsWith('--'));
    await renderVideo(path.resolve(file || path.join(__dirname, 'promo.mp4')), !args.includes('--no-audio'));
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
