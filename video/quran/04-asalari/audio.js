#!/usr/bin/env node
/**
 * Sound design for "Asalari". No musical instruments or melodies: bee wing
 * buzz (a ~200-260 Hz wingbeat whose pitch wanders like a real bee's), the hum
 * of a hive, outdoor air and rustling leaves, timed to scene.html / plate.js,
 * with the Uzbek voice-over from voice/ (see voice.py) laid on top; the
 * nature sounds duck under the voice.
 *
 * Usage:  node video/quran/04-asalari/audio.js [out.wav]
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createSynth } = require('../../lib/synth');

const DURATION = 40.6;
// Timeline, kept in sync with scene.html.
const T = { ayah68: 5, ayah69: 10.5, fem: 15.1, colors: 23.9, shifo: 30.1, close: 35.6 };
// Voice-over line -> start time; each line begins just after its shot's cut.
// Directory of the voice-over MP3s (VOICE_DIR=voice-madina for the female voice).
const VOICE_DIR = path.join(__dirname, process.env.VOICE_DIR || 'voice');
const VOICE = { hook: 0.3, a68: T.ayah68 + 0.3, a69: T.ayah69 + 0.3, fem: T.fem + 0.3, colors: T.colors + 0.3, shifo: T.shifo + 0.3, close: T.close + 0.3 };

const synth = createSynth(DURATION);
const { SR, fx, music, noise, put, noiseHit, whoosh } = synth;

/**
 * One bee: a buzzy wingbeat tone (saw + wing-flutter noise) whose pitch and
 * loudness drift, panned from pan0 to pan1. `near` shapes a fly-by swell.
 */
function buzz(b, t0, dur, o = {}) {
  const { f = 230, gain = 0.1, pan0 = 0, pan1 = pan0, a = 0.3, r = 0.4, lp = 2600, sendAmt = 0.08, near = null } = o;
  const start = Math.round(t0 * SR), len = Math.round(dur * SR);
  const seed = f * 0.173;
  let ph = 0, y1 = 0, y2 = 0, hp = 0, xp = 0, drift = 0;
  const kLp = 1 - Math.exp(-2 * Math.PI * lp / SR), aHp = Math.exp(-2 * Math.PI * 140 / SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    drift += (noise() * 0.002 - drift * 0.0004);                   // slow random walk of the pitch
    const fr = f * (1 + 0.035 * Math.sin(2 * Math.PI * 0.8 * t + seed) + drift);
    ph += fr / SR;
    const p = ph % 1;
    const x = (2 * p - 1) * 0.8 + noise() * 0.35 * (0.6 + 0.4 * Math.sin(2 * Math.PI * p));
    y1 += kLp * (x - y1); y2 += kLp * (y1 - y2);
    hp = aHp * (hp + y2 - xp); xp = y2;
    let env = Math.min(1, t / a) * Math.min(1, (dur - t) / r) * (1 + 0.25 * Math.sin(2 * Math.PI * 1.1 * t + seed * 3));
    if (near) env *= Math.exp(-Math.pow((t - near.t) / near.w, 2)) * (1 - near.floor) + near.floor;
    const k = t / dur;
    put(b, start + i, hp * env * gain, pan0 + (pan1 - pan0) * k, sendAmt);
  }
}

/** A hive: many bees at slightly different pitches around the listener. */
function swarm(t0, dur, { gain = 0.03, n = 12, lp = 1800, fBase = 215 } = {}) {
  for (let k = 0; k < n; k++) {
    const f = fBase + ((k * 37) % 50), pan = ((k * 0.61) % 1.6) - 0.8;
    buzz(music, t0, dur, { f, gain, pan0: pan, pan1: -pan * 0.5, a: 0.6, r: 0.6, lp, sendAmt: 0.15 });
  }
}

/** Sustained filtered-noise bed; `decay` large enough that it barely fades. */
const bed = (t0, dur, o) => noiseHit(music, t0, dur, { a: 0.8, decay: 1e6, ...o });
/** Leaves stirring in a gust. */
const rustle = (t0, dur, gain = 0.05, pan = 0) =>
  noiseHit(fx, t0, dur, { gain, a: dur * 0.4, decay: dur * 0.5, hp: 1800, lp: 6500, pan, sendAmt: 0.3 });
/** Airy shimmer for a line of text appearing. */
function air(t0, len = 1.4, gain = 0.04) {
  noiseHit(fx, t0, len * 0.5, { gain, rise: true, hp: 5000, lp: 9500, sendAmt: 0.5 });
  noiseHit(fx, t0 + len * 0.5, len * 0.5, { gain, a: 0.01, decay: len / 5, hp: 5000, lp: 9500, sendAmt: 0.5 });
}

// ---------- outdoor air, the whole film ----------
bed(0, DURATION, { gain: 0.4, hp: 50, lp: 300, sendAmt: 0.1 });
bed(0, DURATION, { gain: 0.035, hp: 3000, lp: 8000, sendAmt: 0.3 });
[1.2, 7.4, 11.0, 13.6, 25.5, 32.4, 37.0].forEach((t, i) => rustle(t, 1.8 + (i % 3) * 0.5, 0.05, i % 2 ? 0.5 : -0.5));

// ---------- hook: a bee on the blossom takes off to the left ----------
buzz(fx, 0, 5.2, { f: 238, gain: 0.16, pan0: 0.15, pan1: -0.85, a: 0.25, r: 0.5, near: { t: 4.2, w: 1.2, floor: 0.45 } });
air(0.5, 1.4, 0.05);

// ---------- 16:68: hive entrance ----------
whoosh(T.ayah68 - 0.25);
swarm(T.ayah68, T.ayah69 - T.ayah68 + 0.3, { gain: 0.035 });
air(T.ayah68 + 0.3, 1.8, 0.05);

// ---------- 16:69: flower field, wind and a distant bee ----------
whoosh(T.ayah69 - 0.25);
bed(T.ayah69, T.fem - T.ayah69, { gain: 0.3, a: 0.4, hp: 60, lp: 600, sendAmt: 0.2 });
buzz(fx, T.ayah69 + 0.4, 3.8, { f: 226, gain: 0.05, pan0: 0.7, pan1: -0.3, a: 0.8, r: 0.8, lp: 1600 });
air(T.ayah69 + 0.3, 1.6, 0.05);

// ---------- inside the hive: comb covered in worker bees ----------
whoosh(T.fem - 0.25);
swarm(T.fem, T.colors - T.fem + 0.3, { gain: 0.04, n: 16, lp: 1100, fBase: 205 });
air(T.fem + 0.3, 1.4, 0.05);
air(T.fem + 3.6, 1.4, 0.04);

// ---------- bee on an orange flower ----------
whoosh(T.colors - 0.25);
buzz(fx, T.colors + 0.2, 1.8, { f: 244, gain: 0.12, pan0: -0.2, pan1: 0.1, a: 0.2, r: 0.4 });
buzz(fx, T.colors + 3.3, 2.6, { f: 232, gain: 0.1, pan0: 0.1, pan1: 0.3, a: 0.3, r: 0.5 });
air(T.colors + 0.3, 1.4, 0.05);
[0, 1, 2, 3, 4, 5].forEach((i) => noiseHit(fx, T.colors + 3.2 + i * 0.12, 0.08, { gain: 0.05, decay: 0.03, hp: 3000, lp: 9000, pan: -0.5 + i * 0.2, sendAmt: 0.4 }));

// ---------- healing: back at the hive entrance ----------
whoosh(T.shifo - 0.25);
swarm(T.shifo, T.close - T.shifo + 0.3, { gain: 0.035 });
air(T.shifo + 0.3, 1.8, 0.05);
air(T.shifo + 2.6, 1.4, 0.04);

// ---------- close: a bee flies in with pollen ----------
whoosh(T.close - 0.25);
buzz(fx, T.close, DURATION - T.close, { f: 234, gain: 0.13, pan0: -0.7, pan1: 0.2, a: 0.4, r: 1.6, near: { t: 2.0, w: 1.6, floor: 0.5 } });
air(T.close + 0.4, 1.8, 0.05);

/** Writes the soundtrack: nature sounds, ducked under the voice-over lines. */
function generateAudio(file) {
  const sfx = file.replace(/\.wav$/, '-sfx.wav');
  synth.writeWav(sfx, synth.mixdown([], 1.6));
  const keys = Object.keys(VOICE).filter((k) => fs.existsSync(path.join(VOICE_DIR, `${k}.mp3`)));
  if (!keys.length) { fs.renameSync(sfx, file); return file; }
  const inputs = keys.flatMap((k) => ['-i', path.join(VOICE_DIR, `${k}.mp3`)]);
  const lines = keys.map((k, i) => `[${i + 1}:a]aresample=44100,aformat=channel_layouts=stereo,adelay=${Math.round(VOICE[k] * 1000)}:all=1[l${i}]`);
  execFileSync(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error', '-i', sfx, ...inputs,
    '-filter_complex', [
      ...lines,
      `${keys.map((_, i) => `[l${i}]`).join('')}amix=inputs=${keys.length}:normalize=0,apad,atrim=0:${DURATION},highpass=f=70,volume=1.6,asplit[vo][key]`,
      '[0:a][key]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=350[duck]',
      '[duck]volume=0.6[bg]',
      '[bg][vo]amix=inputs=2:normalize=0,alimiter=limit=0.9[out]',
    ].join(';'),
    '-map', '[out]', '-ar', '44100', file,
  ], { stdio: 'inherit' });
  fs.unlinkSync(sfx);
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
