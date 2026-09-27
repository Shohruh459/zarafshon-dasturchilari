#!/usr/bin/env node
/**
 * Sound design for "Dengiz tubidagi zulmatlar". No musical instruments or
 * melodies: storm wind, breaking waves and thunder above the surface, a
 * splash, then muffled underwater ambience that darkens with depth.
 *
 * Usage:  node video/quran/02-zulmatlar/audio.js [out.wav]
 */
const path = require('path');
const { createSynth } = require('../../lib/synth');

const DURATION = 32;
// Timeline, kept in sync with scene.html.
const T = { dive: 3.2, ayah: 3.6, descend: 10.5, dark: 19.5, section: 21.5, close: 27.5 };
const LIGHTNING = [0.9, 2.35];
const timeAtDepth = (d) => T.descend + (Math.log(d / 5) / Math.log(240)) * (T.dark - T.descend);

const synth = createSynth(DURATION);
const { fx, music, note, noiseHit, whoosh } = synth;

let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const bed = (t0, dur, o) => noiseHit(music, t0, dur, { a: 0.4, decay: 1e6, ...o });
function air(t0, len = 1.6, gain = 0.12) {
  noiseHit(fx, t0, len * 0.5, { gain, rise: true, hp: 3000, lp: 8000, sendAmt: 0.5 });
  noiseHit(fx, t0 + len * 0.5, len * 0.5, { gain, a: 0.01, decay: len / 5, hp: 3000, lp: 8000, sendAmt: 0.5 });
}
/** A wave rolling in and breaking: filtered noise that swells and hisses away. */
function surge(t0, len, gain) {
  noiseHit(fx, t0, len * 0.55, { gain, rise: true, hp: 150, lp: 500, lpEnd: 2500, sendAmt: 0.3, pan: rnd() - 0.5 });
  noiseHit(fx, t0 + len * 0.55, len * 0.45, { gain, a: 0.01, decay: len * 0.2, hp: 400, lp: 4000, lpEnd: 900, sendAmt: 0.3 });
}
/** A bubble: short upward-gliding blip. */
const bubble = (t0, g = 0.05) => note(fx, 74 + rnd() * 16, t0, 0.02, { type: 'sine', gain: g, a: 0.002, d: 0.04, s: 0, r: 0.03, glideFrom: 66, pan: rnd() - 0.5 });

// ---------- storm above the sea (0 - 3.3) ----------
bed(0, T.dive + 0.2, { gain: 0.35, hp: 300, lp: 1600, sendAmt: 0.3 });   // wind
bed(0, T.dive + 0.2, { gain: 2.2, lp: 120 });                            // sea roar
for (let t = -0.4; t < T.dive; t += 1.1 + rnd() * 0.4) surge(Math.max(0, t), 1.6, 0.45);
LIGHTNING.forEach((t, i) => {
  noiseHit(fx, t + 0.02, 0.25, { gain: 0.5, a: 0.002, decay: 0.05, hp: 2500, sendAmt: 0.5 }); // crack
  noiseHit(music, t + 0.1, 2.2, { gain: 3.5 - i, a: 0.05, decay: 0.7, lp: 140, lpEnd: 60, sendAmt: 0.4 }); // rolling thunder
});

// ---------- the dive ----------
noiseHit(fx, T.dive + 0.1, 0.9, { gain: 0.7, a: 0.004, decay: 0.2, hp: 200, lp: 7000, lpEnd: 600, sendAmt: 0.4 }); // splash
whoosh(T.dive - 0.2);
for (let i = 0; i < 30; i++) bubble(T.dive + 0.2 + rnd() * 1.4, 0.06);

// ---------- underwater: muffled, darker with depth ----------
bed(T.dive + 0.2, T.descend - T.dive, { gain: 1.6, lp: 260 });
bed(T.dive + 0.2, T.descend - T.dive, { gain: 0.05, hp: 800, lp: 2000 });   // faint surface noise from above
for (let t = T.ayah; t < T.descend; t += 0.6 + rnd() * 1.2) bubble(t, 0.03);
air(T.ayah + 0.3, 2.0, 0.1);
bed(T.descend, T.dark - T.descend, { gain: 2.2, a: 1.5, lp: 200, lpEnd: 70 }); // pressure deepening
[10, 200, 1000].forEach((d) => air(timeAtDepth(d) - 0.1, 1.2, 0.09));
bed(T.dark, T.section - T.dark, { gain: 1.2, a: 0.5, lp: 60 });            // near silence in the deep

// ---------- layers of darkness (cross-section) ----------
whoosh(T.section - 0.25);
bed(T.section, T.close - T.section, { gain: 1.4, a: 0.6, lp: 180 });
for (let t = T.section + 0.3; t < T.close - 0.5; t += 1.5) surge(t, 1.8, 0.12);
air(T.section + 0.8, 1.6, 0.08);

// ---------- close ----------
bed(T.close, DURATION - T.close, { gain: 1.3, a: 1, lp: 70 });
air(T.close + 0.5, 1.8, 0.1);

function generateAudio(file) {
  synth.writeWav(file, synth.mixdown([], 1.8));
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
