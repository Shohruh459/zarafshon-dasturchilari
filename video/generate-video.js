#!/usr/bin/env node
/**
 * Generates a vertical (1080x1920) MP4 with an animated gradient background
 * and centered text, using FFmpeg's `gradients` source and `drawtext` filter.
 *
 * Usage:
 *   node video/generate-video.js [text] [output.mp4]
 *
 * Environment:
 *   FFMPEG_PATH  path to the ffmpeg binary (default: "ffmpeg" on PATH)
 *   FONT_FILE    path to a .ttf font (default: first common system font found)
 */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const WIDTH = 1080;
const HEIGHT = 1920;
const DURATION = 5; // seconds
const FPS = 30;

const text = process.argv[2] || 'Zarafshon Dasturchilari';
const output = path.resolve(process.argv[3] || path.join(__dirname, 'output.mp4'));
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';

function findFont() {
  const candidates = [
    process.env.FONT_FILE,
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/TTF/DejaVuSans-Bold.ttf',
    '/Library/Fonts/Arial Bold.ttf',
    '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
    'C:/Windows/Fonts/arialbd.ttf',
  ].filter(Boolean);
  const font = candidates.find((f) => fs.existsSync(f));
  if (!font) {
    throw new Error('No font found. Set FONT_FILE to a .ttf file.');
  }
  return font;
}

// drawtext option values need ':' , '\' and "'" escaped.
function escapeFilterPath(p) {
  return p.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'");
}

// Greedy word wrap so long text stays inside the frame.
function wrap(str, maxChars) {
  const lines = [];
  let line = '';
  for (const word of str.split(/\s+/).filter(Boolean)) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function run() {
  const font = findFont();
  const lines = wrap(text, 14);

  // Size the font so the longest line fills at most ~85% of the width
  // (bold sans glyphs average roughly 0.62em wide).
  const longest = Math.max(...lines.map((l) => l.length));
  const fontSize = Math.min(140, Math.floor((WIDTH * 0.85) / (longest * 0.62)));
  const lineHeight = Math.round(fontSize * 1.25);
  const blockHeight = lineHeight * lines.length;

  // Each line is read from its own file (avoids drawtext's special-character
  // escaping) and centered horizontally with its own drawtext instance.
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vid-'));
  const drawTexts = lines.map((line, i) => {
    const textFile = path.join(tmpDir, `line${i}.txt`);
    fs.writeFileSync(textFile, line);
    const offset = i * lineHeight - blockHeight / 2;
    // Text fades in over the first 0.8s and gently floats up and down.
    return 'drawtext=' + [
      `fontfile='${escapeFilterPath(font)}'`,
      `textfile='${escapeFilterPath(textFile)}'`,
      `fontsize=${fontSize}`,
      'fontcolor=white',
      'shadowcolor=black@0.45:shadowx=4:shadowy=6',
      'x=(w-text_w)/2',
      `y=h/2+(${offset})+20*sin(2*PI*t/2.5)`,
      "alpha='min(t/0.8,1)'",
    ].join(':');
  });

  const background = [
    `gradients=s=${WIDTH}x${HEIGHT}:r=${FPS}:d=${DURATION}`,
    'c0=0x6a11cb:c1=0x2575fc:c2=0xff6a88:c3=0xffc371',
    'nb_colors=4:speed=0.015:seed=42',
  ].join(':');

  const args = [
    '-y',
    '-hide_banner',
    '-loglevel', 'error',
    '-f', 'lavfi',
    '-i', background,
    '-vf', [...drawTexts, 'format=yuv420p'].join(','),
    '-t', String(DURATION),
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '20',
    '-movflags', '+faststart',
    output,
  ];

  console.log(`Rendering ${WIDTH}x${HEIGHT}, ${DURATION}s -> ${output}`);
  const proc = spawn(ffmpeg, args, { stdio: 'inherit' });

  proc.on('error', (err) => {
    console.error(`Failed to start ffmpeg (${ffmpeg}): ${err.message}`);
    process.exit(1);
  });
  proc.on('close', (code) => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (code !== 0) {
      console.error(`ffmpeg exited with code ${code}`);
      process.exit(code);
    }
    console.log('Done.');
  });
}

run();
