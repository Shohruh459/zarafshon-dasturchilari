#!/usr/bin/env node
/**
 * Soundtrack for the REGISTON v2 ad, scored to scene.html on a 120 BPM grid:
 * a deep space intro that swells as the globe turns, a ping when the pin lands
 * on Karmana, a rising dive, a drop into an elegant piano/strings groove whose
 * accents fall on every cut, and a resolved chord under the contact card.
 * Synthesised from code, so it is royalty-free.
 *
 * Usage:  node video/registon2/audio.js [out.wav]
 */
const path = require('path');
const { createSynth } = require('../lib/synth');

const DURATION = 15;
const BEAT = 0.5; // 120 BPM

// Timeline, kept in sync with scene.html.
const T = { pin: 2.2, dive: 3.0, land: 3.5, room: 7.0, end: 12.0 };
const CUTS = [5.0, 6.0, 8.5, 9.5, 10.5];

const synth = createSynth(DURATION);
const { music, fx, drums, note, noiseHit, kick, clap, impact, riser, whoosh, bells } = synth;

/** Soft felt-piano tone: a filtered triangle that darkens as it decays, plus a faint octave. */
function piano(midi, t0, vel = 1, pan = 0) {
  note(music, midi, t0, 0.01, { type: 'tri', gain: 0.2 * vel, a: 0.004, d: 1.8, s: 0, r: 0.7, cutoff: 2800, cutoffEnd: 600, pan, sendAmt: 0.45 });
  note(music, midi + 12, t0, 0.01, { type: 'sine', gain: 0.035 * vel, a: 0.002, d: 0.7, s: 0, r: 0.4, pan, sendAmt: 0.4 });
}
const pad = (tones, t0, len, gain = 0.02, cutoff = 1400) => tones.forEach((m) => note(music, m, t0, len, {
  type: 'saw', gain, a: 0.6, s: 1, r: 0.8, voices: 3, detune: 0.1, cutoff, sendAmt: 0.55,
}));
const shaker = (t0, g) => noiseHit(drums, t0, 0.06, { gain: g, a: 0.01, decay: 0.02, hp: 6500, pan: 0.2 });

// ---------- space intro (0 - 3.5) ----------
impact(0.02);
note(music, 26, 0, T.dive + 0.3, { type: 'sine', gain: 0.22, a: 0.8, s: 1, r: 0.4 });             // sub drone
pad([50, 57, 62, 64, 69], 0, T.dive + 0.4, 0.018, 700);                                           // Dsus9, opening slowly
note(music, 74, 0.4, T.dive, { type: 'saw', gain: 0.012, a: 1.8, s: 1, r: 0.3, voices: 3, detune: 0.2, cutoff: 900, cutoffEnd: 5000, sendAmt: 0.7 });
[0.6, 1.1, 1.6].forEach((t, i) => bells(t, [93 + i * 2, 98 + i * 2], 0.12, 0.035));                // distant stars
bells(T.pin + 0.32, [86, 93], 0.05, 0.12);                                                         // pin lands
note(fx, 38, T.pin + 0.3, 0.05, { type: 'sine', gain: 0.25, a: 0.002, d: 0.25, s: 0, r: 0.2 });    // soft thud
riser(1.6, T.land - 0.08);
whoosh(T.dive + 0.1);

// ---------- groove (3.5 - 12): D - Bm - G - A, a chord every two beats ----------
impact(T.land);
const CHORDS = [[38, [62, 66, 69, 73]], [35, [59, 62, 66, 69]], [43, [59, 62, 67, 71]], [45, [61, 64, 69, 73]]];
const kicks = [];
for (let t = T.land, c = 0; t < T.end - 0.01; t += 2 * BEAT, c++) {
  const [root, tones] = CHORDS[c % 4];
  pad(tones.slice(0, 3).map((m) => m - 12), t, 2 * BEAT, 0.016);
  note(music, root, t, 0.9, { type: 'tri', gain: 0.22, a: 0.01, d: 0.4, s: 0.6, r: 0.2 });
  // piano ostinato in eighths: root-5th-3rd-5th, top note an octave up on the last one
  [0, 2, 1, 3].forEach((k, i) => piano(tones[k] + (i === 3 ? 12 : 0), t + i * BEAT / 2, i === 0 ? 1 : 0.7, (k - 1.5) * 0.25));
}
for (let t = T.land; t < T.end - 0.01; t += BEAT) { kick(t, 0.5); kicks.push(t); }
for (let t = T.land + BEAT; t < T.end; t += 2 * BEAT) clap(t);
for (let t = T.land; t < T.end; t += BEAT / 2) shaker(t, (Math.round(t / (BEAT / 2)) % 2) ? 0.07 : 0.035);
// accents on every cut, a bigger whip into the room
CUTS.forEach((t) => { noiseHit(fx, t - 0.12, 0.2, { gain: 0.12, a: 0.1, decay: 0.05, hp: 1200, lp: 2500, lpEnd: 9000 }); bells(t, [81], 0.01, 0.05); });
whoosh(T.room - 0.2);
riser(T.end - 0.8, T.end - 0.02);

// ---------- contact card (12 - 15): resolve on D ----------
impact(T.end);
kick(T.end, 0.6); kicks.push(T.end);
pad([50, 57, 62, 66, 69], T.end, DURATION - T.end, 0.02, 1800);
note(music, 38, T.end, DURATION - T.end, { type: 'sine', gain: 0.16, a: 0.05, s: 1, r: 0.8 });
bells(T.end + 0.3, [86, 90, 93, 98], 0.07, 0.06);                                                  // name appears
[[0.9, 74], [1.15, 78], [1.4, 81], [1.65, 86], [2.2, 81]].forEach(([o, m], i) => piano(m, T.end + o, 0.7, i % 2 ? 0.2 : -0.2));

function generateAudio(file) {
  synth.writeWav(file, synth.mixdown(kicks, 1.2));
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
