#!/usr/bin/env node
/**
 * Calm instrumental bed for the REGISTON hotel ad: soft piano arpeggios over a
 * slow string-like pad in D major, a chord every two seconds so the harmony
 * turns with the scenes, two airy swells for the dissolves and a light chime
 * when the name card appears. Synthesised from code, so it is royalty-free.
 *
 * Usage:  node video/registon/audio.js [out.wav]
 */
const path = require('path');
const { createSynth } = require('../lib/synth');

const DURATION = 15;

// Timeline, kept in sync with plate.py and overlay.html.
const T = { room: 4.0, bed: 8.0, end: 12.0, card: 12.3 };

const synth = createSynth(DURATION);
const { music, fx, note, noiseHit, bells } = synth;

/** Soft felt-piano tone: a filtered triangle that darkens as it decays, plus a faint octave. */
function piano(midi, t0, vel = 1, pan = 0) {
  note(music, midi, t0, 0.01, { type: 'tri', gain: 0.24 * vel, a: 0.004, d: 2.4, s: 0, r: 0.9, cutoff: 2600, cutoffEnd: 500, pan, sendAmt: 0.55 });
  note(music, midi + 12, t0, 0.01, { type: 'sine', gain: 0.04 * vel, a: 0.002, d: 0.9, s: 0, r: 0.5, pan, sendAmt: 0.45 });
}

/** Airy swell for a dissolve: filtered noise that rises and falls. */
function swell(tMid, len = 1.2, gain = 0.07) {
  noiseHit(fx, tMid - len / 2, len / 2, { gain, rise: true, hp: 500, lp: 1200, lpEnd: 5000, sendAmt: 0.6 });
  noiseHit(fx, tMid, len / 2, { gain, a: 0.01, decay: len / 5, hp: 500, lp: 5000, lpEnd: 1500, sendAmt: 0.6 });
}

// [start, bass root, chord tones] — D major: Dmaj7 Bm7 Gmaj7 A | D/F# Gmaj7 A D
const CHORDS = [
  [0, 38, [62, 66, 69, 73]],
  [2, 35, [59, 62, 66, 69]],
  [4, 43, [55, 59, 62, 66]],
  [6, 45, [57, 61, 64, 69]],
  [8, 42, [62, 66, 69, 73]],
  [10, 43, [55, 59, 62, 66]],
  [12, 45, [57, 61, 64, 69]],
  [13.5, 38, [62, 66, 69, 74]],
];

CHORDS.forEach(([t0, root, tones], c) => {
  const next = c + 1 < CHORDS.length ? CHORDS[c + 1][0] : DURATION;
  const len = next - t0;
  const last = c === CHORDS.length - 1;
  // string-like pad, slow attack so chord changes glide rather than jump
  tones.slice(0, 3).forEach((m) => note(music, m - 12, t0, len, {
    type: 'saw', gain: 0.017, a: 0.9, s: 1, r: 0.8, voices: 3, detune: 0.08, cutoff: 900, sendAmt: 0.5,
  }));
  note(music, root, t0, len, { type: 'sine', gain: 0.07, a: 0.3, s: 1, r: 0.8 });
  // piano: a gentle rising figure on the half-beats (60 BPM feel)
  const figure = last ? [0, 1, 2, 3] : [0, 2, 3, 1];
  const step = last ? 0.25 : 0.5;
  figure.forEach((k, i) => {
    if (i * step >= len) return;
    piano(tones[k], t0 + i * step, i === 0 ? 1 : 0.75, (k - 1.5) * 0.25);
  });
  if (last) piano(tones[0] + 12, t0 + 1.0, 0.6); // final high D, let it ring
});
// a few melody notes over the room scenes
[[4.9, 74], [5.9, 73], [6.9, 71], [8.9, 73], [9.9, 76], [10.9, 74]].forEach(([t, m]) => piano(m, t, 0.55, 0.2));

// transitions and the name card
swell(T.room);
swell(T.end, 1.2, 0.06);
bells(T.card, [86, 90, 93], 0.09, 0.05);

function generateAudio(file) {
  synth.writeWav(file, synth.mixdown([], 1.4));
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
