#!/usr/bin/env node
/**
 * Original soundtrack for the "Achchiq burger" reel, scored to scene.html: a
 * whoosh and a thump for every layer flying in on the eighth notes, a riser into
 * a heavy slam when the burger assembles (twice), a punchy 120 BPM beat, pops for
 * the ingredient labels and a sizzle under everything. No voice-over.
 *
 * Usage:  node video/milano-burger/audio.js [out.wav]
 */
const path = require('path');
const { createSynth } = require('../lib/synth');

const DURATION = 13;
const BEAT = 0.5; // 120 BPM
// Timeline, kept in sync with scene.html.
const T = { fly: 0.25, slam1: 3.0, explode: 5.5, slam2: 8.5, pack: 9.0 };
const HIT = 0.35;

const synth = createSynth(DURATION);
const { music, fx, drums, note, noiseHit, kick, clap, hat, impact, riser, whoosh, pop, bells } = synth;

let seed = 3;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/** Sub drop: a sine that falls in pitch, for the slams. */
const drop = (t0, gain = 0.5) => note(fx, 40, t0, 0.5, { type: 'sine', gain, a: 0.003, d: 0.4, s: 0.3, r: 0.4, glideFrom: 52 });
/** Crunch: a burst of crackly high noise, like biting a crisp bun. */
function crunch(t0, len = 0.25) {
  for (let t = t0; t < t0 + len; t += 0.004 + rnd() * 0.012) noiseHit(fx, t, 0.01, { gain: 0.1 + rnd() * 0.12, decay: 0.003, hp: 2500, pan: rnd() - 0.5 });
}

// sizzle bed through the whole reel
for (let t = 0.1; t < DURATION - 0.4; ) { noiseHit(fx, t, 0.01, { gain: 0.02 + rnd() * 0.04, decay: 0.003, hp: 4000, pan: rnd() * 1.4 - 0.7 }); t += 0.01 + rnd() * 0.04; }

// ---------- fly-in: eight layers on the eighth notes, rising pitch ----------
for (let k = 0; k < 8; k++) {
  const tin = T.fly + k * 0.25;
  noiseHit(fx, tin - 0.3, 0.32, { gain: 0.16, a: 0.25, decay: 0.05, hp: 500, lp: 1500 + k * 600, lpEnd: 8000, pan: k % 2 ? 0.5 : -0.5, sendAmt: 0.2 });
  note(fx, 43 + k * 2, tin, 0.06, { type: 'sine', gain: 0.28, a: 0.002, d: 0.08, s: 0, r: 0.08 });   // soft thump as it lands
  hat(tin + 0.125, false);
}
note(music, 33, T.fly, T.slam1 - T.fly, { type: 'saw', gain: 0.08, a: 1.2, s: 1, r: 0.05, cutoff: 200, cutoffEnd: 900 });
riser(T.slam1 - 0.9, T.slam1 + HIT);

// ---------- slams ----------
const kicks = [];
for (const s of [T.slam1, T.slam2]) {
  impact(s + HIT); drop(s + HIT); crunch(s + HIT); kick(s + HIT, 0.9); kicks.push(s + HIT);
  noiseHit(fx, s + HIT, 1.2, { gain: 0.3, a: 0.005, decay: 0.3, hp: 150, lp: 4000, lpEnd: 400, sendAmt: 0.5 });
}

// ---------- beat after the first slam: Am - F - C - G on a trap-ish kit ----------
const CH = [[45, [57, 60, 64]], [41, [57, 60, 65]], [36, [55, 60, 64]], [43, [55, 59, 62]]];
function groove(t0, t1) {
  for (let t = t0, c = 0; t < t1 - 0.01; t += 1, c++) {
    const [root, tones] = CH[c % 4];
    tones.forEach((m) => note(music, m, t, 0.95, { type: 'saw', gain: 0.028, a: 0.02, s: 0.7, r: 0.1, voices: 3, detune: 0.14, cutoff: 1500, sendAmt: 0.35 }));
    note(music, root - 12, t, 0.45, { type: 'sine', gain: 0.45, a: 0.004, d: 0.3, s: 0.5, r: 0.1 });            // 808-ish bass
    note(music, root - 12, t + 0.75, 0.2, { type: 'sine', gain: 0.35, a: 0.004, d: 0.15, s: 0.4, r: 0.08 });
  }
  for (let t = t0; t < t1 - 0.01; t += BEAT * 2) { kick(t, 0.7); kicks.push(t); kick(t + 0.75, 0.45); kicks.push(t + 0.75); }
  for (let t = t0 + BEAT; t < t1; t += BEAT * 2) clap(t);
  for (let t = t0; t < t1; t += BEAT / 4) noiseHit(drums, t, 0.04, { gain: Math.round(t / (BEAT / 4)) % 2 ? 0.05 : 0.09, decay: 0.012, hp: 7500, pan: 0.25 });
}
groove(T.slam1 + HIT + 0.15, T.explode);

// ---------- explode, labels ----------
whoosh(T.explode - 0.05);
noiseHit(fx, T.explode, 0.6, { gain: 0.25, a: 0.01, decay: 0.2, hp: 300, lp: 6000, lpEnd: 1500, sendAmt: 0.4 });
for (let i = 0; i < 6; i++) pop(T.explode + 0.6 + i * 0.28, i);
for (let t = T.explode + 0.5; t < T.slam2; t += BEAT) hat(t, true);
note(music, 33, T.explode + 0.5, T.slam2 - T.explode - 0.5, { type: 'saw', gain: 0.07, a: 1, s: 1, r: 0.05, cutoff: 250, cutoffEnd: 1100 });
riser(T.slam2 - 1.0, T.slam2 + HIT);

// ---------- pack shot ----------
groove(T.slam2 + HIT + 0.15, DURATION - 1.2);
pop(T.pack + 0.55, 2);        // price sticker
bells(T.pack + 1.3, [81, 84, 88, 93], 0.07, 0.1);
[45, 57, 60, 64, 69].forEach((m) => note(music, m, DURATION - 1.2, 1.1, { type: 'tri', gain: 0.07, a: 0.02, d: 0.5, s: 0.5, r: 0.6, voices: 3, detune: 0.1, cutoff: 2600, sendAmt: 0.5 }));
kick(DURATION - 1.2, 0.8); kicks.push(DURATION - 1.2);

function generateAudio(file) {
  synth.writeWav(file, synth.mixdown(kicks, 0.8));
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
