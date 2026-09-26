#!/usr/bin/env node
/**
 * Original 12s soundtrack for the MOXITO ad, scored to scene.html: a lazy
 * heat-haze intro with thermometer ticks, an ice-cube crash, a bright tropical
 * groove, whooshes for the ingredients, a splash and fizz for the glass, and a
 * resolved ending for the pack shot.
 *
 * Usage:  node video/moxito/audio.js [out.wav]
 */
const path = require('path');
const { createSynth } = require('../lib/synth');

const DURATION = 12;
const BEAT = 0.5; // 120 BPM

// Timeline, kept in sync with scene.html.
const T = { cool: 2.8, glass: 6.0, pack: 9.2 };
const ING = [3.05, 3.85, 4.65];
const CHIPS = [6.9, 7.35, 7.8];

const synth = createSynth(DURATION);
const { SR, music, fx, drums, note, noiseHit, kick, clap, hat, impact, riser, whoosh, pop, bells } = synth;

// Deterministic "random" so every render sounds the same.
let seed = 5;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/** Marimba-like pluck: sine plus a quiet 4th harmonic, fast decay. */
function marimba(midi, t0, gain = 0.16, pan = 0) {
  note(music, midi, t0, 0.02, { type: 'sine', gain, a: 0.002, d: 0.25, s: 0, r: 0.15, pan, sendAmt: 0.25 });
  note(music, midi + 24, t0, 0.01, { type: 'sine', gain: gain * 0.25, a: 0.001, d: 0.06, s: 0, r: 0.05, pan, sendAmt: 0.1 });
}
/** Glassy ice clink: two inharmonic high partials with a short crack of noise. */
function clink(t0, k) {
  const base = 95 + (k % 4) * 2;
  note(fx, base, t0, 0.01, { type: 'sine', gain: 0.12, a: 0.001, d: 0.18, s: 0, r: 0.2, pan: (k % 2 ? 0.5 : -0.5), sendAmt: 0.4 });
  note(fx, base + 6.3, t0, 0.01, { type: 'sine', gain: 0.07, a: 0.001, d: 0.1, s: 0, r: 0.12, pan: (k % 2 ? 0.5 : -0.5), sendAmt: 0.4 });
  noiseHit(fx, t0, 0.05, { gain: 0.25, decay: 0.012, hp: 4000 });
}
/** Rising bubble blip. */
const bubble = (t0, pan = 0) => note(fx, 80 + rnd() * 12, t0, 0.03, { type: 'sine', gain: 0.07, a: 0.002, d: 0.05, s: 0, r: 0.04, pan, glideFrom: 70 });

// ---------- scene 1: heat (0 - 2.8) ----------
[53, 57, 60, 64].forEach((m) => note(music, m, 0, T.cool - 0.1, { type: 'tri', gain: 0.13, a: 0.5, s: 1, r: 0.2, voices: 3, detune: 0.1, cutoff: 900, cutoffEnd: 2200, sendAmt: 0.5 }));
note(music, 29, 0, T.cool - 0.1, { type: 'sine', gain: 0.18, a: 0.4, s: 1, r: 0.2 });
for (let t = 0.25; t < T.cool - 0.3; t += BEAT / 2) noiseHit(drums, t, 0.08, { gain: 0.09, a: 0.02, decay: 0.03, hp: 6000, pan: 0.3 }); // lazy shaker
// Thermometer tick every time the counter in scene.html (30 -> 42 over 0.5-2.2s, eased) changes.
{
  const eInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  let prev = 30;
  for (let t = 0.5; t <= 2.2; t += 1 / SR * 64) {
    const deg = Math.round(30 + 12 * eInOut((t - 0.5) / 1.7));
    if (deg !== prev) { note(fx, 76 + (deg - 30), t, 0.02, { type: 'sine', gain: 0.1, a: 0.001, d: 0.04, s: 0, r: 0.03 }); prev = deg; }
  }
}
riser(T.cool - 0.7, T.cool);

// ---------- ice crash (2.8) ----------
impact(T.cool);
for (let k = 0; k < 9; k++) clink(T.cool - 0.08 + k * 0.045 + rnd() * 0.03, k);
bells(T.cool + 0.05, [100, 96, 93, 88], 0.05, 0.08); // frost shimmer

// ---------- groove (2.8 - 9.2): F - C - Dm - Bb ----------
const CHORDS = [[41, [60, 64, 65, 69]], [36, [60, 64, 67, 72]], [38, [62, 65, 69, 74]], [34, [62, 65, 70, 74]]];
const kicks = [];
for (let t = T.cool, c = 0; t < T.pack - 0.01; t += 1, c++) {
  const [root, tones] = CHORDS[c % CHORDS.length];
  tones.slice(0, 3).forEach((m) => note(music, m - 12, t, 0.95, { type: 'saw', gain: 0.045, a: 0.05, s: 0.8, r: 0.1, voices: 3, detune: 0.12, cutoff: 1800, sendAmt: 0.35 }));
  // bouncy bass: root on beats, octave on the "and"
  [0, 0.375, 0.5, 0.875].forEach((o, k) => note(music, root + (k % 2 ? 12 : 0), t + o, 0.12, { type: 'tri', gain: 0.3, a: 0.004, d: 0.1, s: 0.5, r: 0.05 }));
  // syncopated marimba (3-3-2 pattern) over the chord tones
  [0, 0.375, 0.75].forEach((o, k) => marimba(tones[(k + c) % 4] + 12, t + o, 0.15, k % 2 ? 0.35 : -0.35));
}
for (let t = T.cool; t < T.pack - 0.01; t += BEAT) { kick(t, 0.6); kicks.push(t); }
for (let t = T.cool + BEAT; t < T.pack; t += BEAT * 2) clap(t);
for (let t = T.cool; t < T.pack; t += BEAT / 4) noiseHit(drums, t, 0.05, { gain: (Math.round(t / (BEAT / 4)) % 2 ? 0.05 : 0.09), decay: 0.015, hp: 7000, pan: -0.25 }); // shaker 16ths
for (let t = T.cool + BEAT / 2; t < T.pack; t += BEAT) hat(t, true);

// ---------- ingredients ----------
ING.forEach((t, i) => {
  whoosh(t - 0.15);
  pop(t + 0.35, i);
  noiseHit(fx, t + 0.8, 0.3, { gain: 0.12, a: 0.1, decay: 0.08, hp: 1500, lp: 3000, lpEnd: 8000 }); // park swish
});
whoosh(T.glass - 0.4); // all swept into the glass

// ---------- glass hero (6.0 - 9.2) ----------
whoosh(T.glass - 0.1);
noiseHit(fx, T.glass + 0.45, 0.7, { gain: 0.5, a: 0.005, decay: 0.18, hp: 300, lp: 5000, lpEnd: 1200, sendAmt: 0.35 }); // splash
for (let k = 0; k < 14; k++) bubble(T.glass + 0.5 + rnd() * 0.8, rnd() * 1.2 - 0.6);
// fizz: sparse tiny crackles, denser right after the splash
for (let t = T.glass + 0.4; t < DURATION - 0.3; ) {
  noiseHit(fx, t, 0.01, { gain: 0.05 + rnd() * 0.06, decay: 0.002, hp: 6000, pan: rnd() * 1.6 - 0.8 });
  t += 0.01 + rnd() * (0.02 + (t - T.glass) * 0.012);
}
CHIPS.forEach((t, i) => pop(t + 0.1, i + 1));
riser(T.pack - 0.6, T.pack);

// ---------- pack shot (9.2 - 12): resolve on F ----------
impact(T.pack);
bells(T.pack + 0.3, [89, 93, 96, 101], 0.06, 0.1); // logo sparkle
for (let k = 0; k < 4; k++) clink(T.pack + 0.9 + k * 0.08, k); // coaster spinning in
[41, 53, 57, 60, 64, 69].forEach((m) => note(music, m, T.pack, 2.2, { type: 'tri', gain: 0.08, a: 0.05, d: 0.6, s: 0.6, r: 0.6, voices: 3, detune: 0.1, cutoff: 3000, sendAmt: 0.5 }));
for (let t = T.pack; t < T.pack + 2; t += BEAT) { kick(t, 0.55); kicks.push(t); }
for (let t = T.pack + BEAT; t < T.pack + 2; t += BEAT * 2) clap(t);
[0, 0.25, 0.5, 0.75, 1.0, 1.5].forEach((o, k) => marimba([72, 77, 81, 84, 81, 89][k], T.pack + 0.5 + o, 0.13, k % 2 ? 0.3 : -0.3));
pop(T.pack + 1.1, 2); // CTA button
bells(T.pack + 2.2, [77, 81, 84, 89], 0.07, 0.12);

function generateAudio(file) {
  synth.writeWav(file, synth.mixdown(kicks));
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
