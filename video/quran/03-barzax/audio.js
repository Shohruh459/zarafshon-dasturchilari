#!/usr/bin/env node
/**
 * Sound design for "Ikki dengiz orasidagi to'siq". No musical instruments or
 * melodies: wind and surf over the coast, then muffled underwater flow for the
 * cross-sections, whooshes on scene changes and a soft air swell for text.
 *
 * Usage:  node video/quran/03-barzax/audio.js [out.wav]
 */
const path = require('path');
const { createSynth } = require('../../lib/synth');

const DURATION = 30;
// Timeline, kept in sync with scene.html.
const T = { ayah: 3.5, estuary: 10.5, gib: 17.5, meddy: 21.5, close: 25.5 };

const synth = createSynth(DURATION);
const { fx, music, noiseHit, whoosh } = synth;

let seed = 17;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const bed = (t0, dur, o) => noiseHit(music, t0, dur, { a: 0.5, decay: 1e6, ...o });
function air(t0, len = 1.6, gain = 0.12) {
  noiseHit(fx, t0, len * 0.5, { gain, rise: true, hp: 3000, lp: 8000, sendAmt: 0.5 });
  noiseHit(fx, t0 + len * 0.5, len * 0.5, { gain, a: 0.01, decay: len / 5, hp: 3000, lp: 8000, sendAmt: 0.5 });
}
/** Distant surf: a wave rolling onto the beach and hissing back. */
function surf(t0, len, gain) {
  noiseHit(fx, t0, len * 0.5, { gain, rise: true, hp: 200, lp: 600, lpEnd: 3000, sendAmt: 0.4, pan: rnd() - 0.5 });
  noiseHit(fx, t0 + len * 0.5, len * 0.5, { gain, a: 0.01, decay: len * 0.25, hp: 500, lp: 5000, lpEnd: 1200, sendAmt: 0.4 });
}
/** Slow flowing water: a band of noise that swells and ebbs. */
function flow(t0, len, gain, lp) {
  for (let t = t0; t < t0 + len - 0.5; t += 1.4) {
    noiseHit(music, t, 0.9, { gain, rise: true, hp: 120, lp, sendAmt: 0.3 });
    noiseHit(music, t + 0.9, 0.9, { gain, a: 0.01, decay: 0.35, hp: 120, lp, sendAmt: 0.3 });
  }
}

// ---------- above the coast ----------
bed(0, T.estuary, { gain: 0.22, hp: 400, lp: 2200, sendAmt: 0.3 });      // wind at altitude
bed(0, T.estuary, { gain: 1.4, lp: 110 });                               // low sea roar
for (let t = 0.2; t < T.estuary - 0.8; t += 1.8 + rnd() * 0.8) surf(t, 2.2, 0.22);
air(0.4, 1.4, 0.1);
air(T.ayah + 0.3, 2.0, 0.12);

// ---------- estuary cross-section ----------
whoosh(T.estuary - 0.25);
bed(T.estuary, T.gib - T.estuary, { gain: 1.8, lp: 240 });              // underwater
flow(T.estuary + 0.3, T.gib - T.estuary - 0.3, 0.35, 900);                // the river running out on top
[0.8, 1.2, 1.8].forEach((o) => air(T.estuary + o, 1.0, 0.06));

// ---------- Gibraltar ----------
whoosh(T.gib - 0.25);
bed(T.gib, T.close - T.gib, { gain: 2.0, lp: 180 });
flow(T.gib + 0.3, T.close - T.gib - 0.3, 0.28, 600);
air(T.gib + 1.4, 1.4, 0.08);
noiseHit(fx, T.meddy, 2.2, { gain: 0.25, rise: true, hp: 300, lp: 900, lpEnd: 2500, sendAmt: 0.5 }); // the eddy spins up
air(T.meddy + 0.3, 1.4, 0.08);

// ---------- close ----------
whoosh(T.close - 0.25);
bed(T.close, DURATION - T.close, { gain: 1.2, lp: 110 });
bed(T.close, DURATION - T.close, { gain: 0.15, hp: 400, lp: 2000 });
surf(T.close + 0.4, 2.4, 0.18);
air(T.close + 0.4, 1.8, 0.12);

function generateAudio(file) {
  synth.writeWav(file, synth.mixdown([], 1.8));
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
