#!/usr/bin/env node
/**
 * Renders the three brand intros (intro.html, kinds A/B/C) and joins each one
 * onto the front of its film with a short cross-transition, writing the
 * Instagram-ready files to video/final/.
 *
 * Usage:
 *   node video/intros/render.js                   # intros + final videos
 *   node video/intros/render.js --stills A:0.3,1.5 B:0.6 C:1.8
 */
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { generateIntroAudio, LENGTH } = require('./audio');

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const XFADE = 0.3; // seconds of overlap between intro and film

const video = path.join(__dirname, '..');
const ffmpegBin = process.env.FFMPEG_PATH || 'ffmpeg';
// intro kind -> film it opens, FFmpeg xfade transition, output name
const FINALS = [
  { kind: 'A', film: 'promo/promo.mp4', transition: 'pixelize', out: '01-online-dokon.mp4' },
  { kind: 'B', film: 'moxito/moxito.mp4', transition: 'wipeup', out: '02-moxito.mp4' },
  { kind: 'C', film: 'registon2/registon2.mp4', transition: 'fade', out: '03-registon.mp4' },
];

async function withPage(fn) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('page error:', e.message));
  try {
    return await fn(page);
  } finally {
    await browser.close();
  }
}

async function load(page, kind) {
  await page.goto('file://' + path.join(__dirname, 'intro.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((k) => window.setup(k), kind);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
}

async function renderIntro(page, kind) {
  await load(page, kind);
  const wav = generateIntroAudio(kind, path.join(__dirname, `intro_${kind}.wav`));
  const out = path.join(__dirname, `intro_${kind}.mp4`);
  const ff = spawn(ffmpegBin, [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', wav,
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-15:TP=-1.5,aresample=48000', '-shortest', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg ${c}`)))));
  const total = Math.round(LENGTH[kind] * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.renderFrame(t), i / FPS);
    const png = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  console.log('wrote', out);
  return out;
}

function joinFinal({ kind, film, transition, out }) {
  const intro = path.join(__dirname, `intro_${kind}.mp4`);
  const dest = path.join(video, 'final', out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const offset = (LENGTH[kind] - XFADE).toFixed(3);
  const r = spawnSync(ffmpegBin, [
    '-y', '-hide_banner', '-loglevel', 'error', '-i', intro, '-i', path.join(video, film),
    '-filter_complex',
    `[0:v][1:v]xfade=transition=${transition}:duration=${XFADE}:offset=${offset},format=yuv420p[v];` +
    `[0:a]aresample=48000[a0];[1:a]aresample=48000[a1];[a0][a1]acrossfade=d=${XFADE}[a]`,
    '-map', '[v]', '-map', '[a]', '-r', String(FPS),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-level', '4.1',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', dest,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`joining ${out} failed`);
  console.log('wrote', dest);
}

(async () => {
  const si = process.argv.indexOf('--stills');
  if (si !== -1) {
    await withPage(async (page) => {
      for (const spec of process.argv.slice(si + 1)) {
        const [kind, list] = spec.split(':');
        await load(page, kind);
        for (const t of list.split(',').map(Number)) {
          await page.evaluate((t) => window.renderFrame(t), t);
          const file = path.join(__dirname, `still-${kind}-${t}s.png`);
          await page.screenshot({ path: file });
          console.log('wrote', file);
        }
      }
    });
    return;
  }
  await withPage(async (page) => { for (const { kind } of FINALS) await renderIntro(page, kind); });
  FINALS.forEach(joinFinal);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
