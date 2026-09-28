#!/usr/bin/env node
/**
 * Renders the REGISTON v2 ad (globe intro + beat-cut photo montage), 1080x1920, 15s.
 * scene.html is served over a local HTTP server (ES modules, textures and
 * fetch() do not load from file://), rendered frame by frame in headless
 * Chromium with software WebGL, and piped into FFmpeg with the soundtrack.
 *
 * Usage:
 *   node video/registon2/render.js [output.mp4]
 *   node video/registon2/render.js --stills 1,2.8,4,9,13   # PNG previews
 *   node video/registon2/render.js --no-audio
 *
 * Run `python3 video/registon2/frames.py` first to export the photo sequences.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { generateAudio } = require('./audio');

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 15;

const root = path.join(__dirname, '..'); // serve video/ so ../registon/fonts resolves
const args = process.argv.slice(2);
const stillsIdx = args.indexOf('--stills');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };

function serve() {
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function openPage() {
  if (!fs.existsSync(path.join(__dirname, 'assets', 'seq', 'room_149.jpg'))) {
    throw new Error('Photo sequences missing: run python3 video/registon2/frames.py first');
  }
  const server = await serve();
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/registon2/scene.html`);
  await page.waitForFunction(() => window.sceneReady === true, null, { timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  return { server, browser, page };
}

async function renderStills(times) {
  const { server, browser, page } = await openPage();
  for (const t of times) {
    await page.evaluate((t) => window.renderFrame(t), t);
    const file = path.join(__dirname, `still-${t}s.png`);
    await page.screenshot({ path: file });
    console.log('wrote', file);
  }
  await browser.close();
  server.close();
}

async function renderVideo(output, withAudio) {
  const audio = withAudio ? generateAudio(path.join(__dirname, 'audio.wav')) : null;
  const { server, browser, page } = await openPage();
  const audioArgs = audio
    ? ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-15:TP=-1.5', '-shortest']
    : [];
  const ff = spawn(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    ...audioArgs,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    output,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => {
    ff.on('error', reject);
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}`))));
  });

  const total = DURATION * FPS;
  console.log(`Rendering ${total} frames -> ${output}`);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.renderFrame(t), i / FPS);
    const png = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % FPS === 0) process.stdout.write(`\r  ${Math.round((i / total) * 100)}%`);
  }
  ff.stdin.end();
  await done;
  await browser.close();
  server.close();
  console.log('\r  100%\nDone.');
}

(async () => {
  if (stillsIdx !== -1) {
    await renderStills(args[stillsIdx + 1].split(',').map(Number));
  } else {
    const file = args.find((a) => !a.startsWith('--'));
    await renderVideo(path.resolve(file || path.join(__dirname, 'registon2.mp4')), !args.includes('--no-audio'));
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
