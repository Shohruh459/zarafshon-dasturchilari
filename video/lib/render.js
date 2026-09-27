/**
 * Shared frame-by-frame renderer for scene pages that expose
 * `window.sceneReady` and `window.renderFrame(t)` (sync or async).
 *
 * The page is served from video/ over a local HTTP server (ES modules,
 * textures and fetch() do not load from file://) and rendered in headless
 * Chromium with software WebGL; frames are piped into FFmpeg together with
 * an optional WAV soundtrack.
 *
 *   const { renderScene } = require('../../lib/render');
 *   renderScene({ page: 'quran/01-kengayish/scene.html', duration: 30, out, audio });
 */
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };

function serve() {
  const server = http.createServer((req, res) => {
    const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function open(page) {
  const server = await serve();
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const tab = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  tab.on('pageerror', (e) => console.error('page error:', e.message));
  await tab.goto(`http://127.0.0.1:${server.address().port}/${page}`);
  await tab.waitForFunction(() => window.sceneReady === true, null, { timeout: 120000 });
  await tab.evaluate(() => document.fonts.ready);
  return { server, browser, tab, close: async () => { await browser.close(); server.close(); } };
}

/** Writes PNG previews next to `outDir`/still-<t>s.png. */
async function renderStills({ page, times, outDir }) {
  const s = await open(page);
  for (const t of times) {
    await s.tab.evaluate((t) => window.renderFrame(t), t);
    const file = path.join(outDir, `still-${t}s.png`);
    await s.tab.screenshot({ path: file });
    console.log('wrote', file);
  }
  await s.close();
}

/** Renders `duration` seconds of `page` to `out` (MP4), muxing `audio` (WAV path) if given. */
async function renderScene({ page, duration, out, audio = null, loudness = -15 }) {
  const s = await open(page);
  const audioArgs = audio
    ? ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-af', `loudnorm=I=${loudness}:TP=-1.5,aresample=48000`, '-shortest']
    : [];
  const ff = spawn(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    ...audioArgs,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => {
    ff.on('error', reject);
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}`))));
  });
  const total = Math.round(duration * FPS);
  console.log(`Rendering ${total} frames -> ${out}`);
  for (let i = 0; i < total; i++) {
    await s.tab.evaluate((t) => window.renderFrame(t), i / FPS);
    const png = await s.tab.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % FPS === 0) process.stdout.write(`\r  ${Math.round((i / total) * 100)}%`);
  }
  ff.stdin.end();
  await done;
  await s.close();
  console.log('\r  100%\nDone.');
}

module.exports = { renderScene, renderStills, FPS };
