#!/usr/bin/env node
/**
 * Sound design for "Kengayib borayotgan koinot". No musical instruments or
 * melodies: only filtered noise (space ambience, air, whooshes, projector
 * clatter) and low thuds, timed to scene.html.
 *
 * Usage:  node video/quran/01-kengayish/audio.js [out.wav]
 */
const path = require('path');
const { createSynth } = require('../../lib/synth');

const DURATION = 30;
// Timeline, kept in sync with scene.html.
const T = { burst: 0.5, ayah: 3.5, archive: 10.5, lemaitre: 14, hubble: 18, accel: 22, close: 26 };

const synth = createSynth(DURATION);
const { fx, music, noiseHit, impact, whoosh } = synth;

/** Sustained filtered-noise bed; `decay` large enough that it barely fades. */
const bed = (t0, dur, o) => noiseHit(music, t0, dur, { a: 0.8, decay: 1e6, ...o });
/** Airy shimmer for a line of text appearing: noise that swells and settles. */
function air(t0, len = 1.6, gain = 0.06) {
  noiseHit(fx, t0, len * 0.5, { gain, rise: true, hp: 4500, lp: 9000, sendAmt: 0.6 });
  noiseHit(fx, t0 + len * 0.5, len * 0.5, { gain, a: 0.01, decay: len / 5, hp: 4500, lp: 9000, sendAmt: 0.6 });
}

// ---------- ambience of space, the whole film ----------
bed(0, DURATION, { gain: 3.2, lp: 70, sendAmt: 0.2 });                 // deep rumble
bed(0.3, DURATION - 0.3, { gain: 0.1, hp: 2500, lp: 7000, sendAmt: 0.5 }); // faint hiss of "air"

// ---------- opening burst ----------
impact(T.burst);
noiseHit(fx, T.burst - 0.05, 1.6, { gain: 0.35, a: 0.02, decay: 0.45, hp: 400, lp: 1200, lpEnd: 9000, sendAmt: 0.5 });
whoosh(T.ayah - 0.3);
air(T.ayah + 0.4, 1.8, 0.16);           // the ayah is written on
air(T.ayah + 1.9, 1.4, 0.1);           // its meaning appears

// ---------- 1917: projector clatter over sepia ----------
noiseHit(fx, T.archive - 0.1, 0.4, { gain: 0.25, a: 0.005, decay: 0.12, hp: 800, lp: 5000 });
for (let t = T.archive; t < T.lemaitre - 0.1; t += 1 / 24) {
  noiseHit(fx, t, 0.012, { gain: 0.22, decay: 0.003, hp: 1800, lp: 6000, pan: 0.15 });
}
bed(T.archive, T.lemaitre - T.archive, { gain: 0.14, a: 0.1, hp: 1000, lp: 3000 }); // film hiss

// ---------- 1927 / 1929: space starts to stretch ----------
impact(T.lemaitre);
whoosh(T.lemaitre - 0.2);
bed(T.lemaitre, T.accel - T.lemaitre, { gain: 2.0, a: 2, lp: 160, lpEnd: 260, sendAmt: 0.3 });
whoosh(T.hubble - 0.2);

// ---------- 1998: acceleration ----------
noiseHit(fx, T.accel, T.close - T.accel, { gain: 0.7, rise: true, hp: 200, lp: 400, lpEnd: 6000, sendAmt: 0.4 });
bed(T.accel, T.close - T.accel, { gain: 2.6, a: 3, lp: 120, sendAmt: 0.3 });

// ---------- close: calm, the second ayah ----------
noiseHit(fx, T.close, 2.5, { gain: 0.25, a: 0.01, decay: 0.8, hp: 300, lp: 6000, lpEnd: 800, sendAmt: 0.6 });
air(T.close + 0.3, 1.8, 0.16);
air(T.close + 2.0, 1.6, 0.1);

function generateAudio(file) {
  synth.writeWav(file, synth.mixdown([], 1.8));
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
