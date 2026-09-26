#!/usr/bin/env node
/**
 * Synthesises an original 11s soundtrack for the promo, scored to the
 * animation timeline in scene.html (message pops, taps, transitions, success
 * chime). No samples or third-party audio: everything is generated here, so
 * the track is free to use.
 *
 * Usage:  node video/promo/music.js [out.wav]
 */
const path = require('path');
const { createSynth } = require('../lib/synth');

const DURATION = 11;
const BEAT = 0.5; // 120 BPM

// Timeline, kept in sync with scene.html.
const T1 = 3.0; // hook -> offer
const T2 = 8.0; // offer -> CTA
const MSG_TIMES = [0.35, 0.6, 0.85, 1.1, 1.3, 1.5, 1.68, 1.85, 2.0, 2.15, 2.3, 2.45];
const NOTIF_TIMES = [0.95, 1.3, 1.65, 2.0];
const TAPS = [T1 + 2.35, T1 + 2.85, T1 + 3.85, T2 + 2.35];

const synth = createSynth(DURATION);
const { music, fx, note, kick, clap, hat, impact, riser, whoosh, pop, click, bells } = synth;

// ---------- score ----------
// Scene 1: tense A-minor pad with a pulsing, slowly opening bass.
[57, 60, 64].forEach((m) => note(music, m, 0, T1 - 0.1, { type: 'saw', gain: 0.1, a: 0.6, s: 1, r: 0.2, voices: 3, detune: 0.12, cutoff: 500, cutoffEnd: 2500, sendAmt: 0.4 }));
for (let t = 0; t < T1 - 0.2; t += BEAT / 2) {
  note(music, 33, t, 0.18, { type: 'saw', gain: 0.25, a: 0.005, d: 0.15, s: 0.3, r: 0.05, cutoff: 200 + t * 350 });
}
for (let t = 0; t < T1 - 0.5; t += BEAT) kick(t, 0.55);
for (let t = BEAT / 2; t < T1 - 0.5; t += BEAT) hat(t);
MSG_TIMES.forEach((t, k) => pop(t, k));
NOTIF_TIMES.forEach((t) => bells(t, [88, 95], 0.06, 0.08));
riser(T1 - 0.9, T1);

// Scene 2: four-on-the-floor groove, F - G - Am - F - G.
impact(T1); whoosh(T1 - 0.3);
const CHORDS2 = [[41, [53, 57, 60]], [43, [55, 59, 62]], [45, [57, 60, 64]], [41, [53, 57, 60]], [43, [55, 59, 62]]];
function groove(tStart, chords, secPerChord) {
  chords.forEach(([root, tones], c) => {
    const t0 = tStart + c * secPerChord;
    tones.forEach((m) => note(music, m, t0, secPerChord - 0.05, { type: 'saw', gain: 0.09, a: 0.05, s: 0.8, r: 0.15, voices: 3, detune: 0.15, cutoff: 2600, sendAmt: 0.35 }));
    for (let k = 0; k < secPerChord / (BEAT / 2); k++) {
      note(music, root - 12 + (k % 2 ? 12 : 0), t0 + k * BEAT / 2, 0.2, { type: 'square', gain: 0.16, a: 0.004, d: 0.12, s: 0.4, r: 0.05, cutoff: 700 });
    }
    const arp = [tones[0] + 12, tones[1] + 12, tones[2] + 12, tones[0] + 24];
    for (let k = 0; k < secPerChord / (BEAT / 4); k++) {
      note(music, arp[k % 4], t0 + k * BEAT / 4, 0.06, { type: 'saw', gain: 0.1, a: 0.002, d: 0.1, s: 0, r: 0.08, cutoff: 3500, pan: (k % 2 ? 0.35 : -0.35), sendAmt: 0.3 });
    }
  });
}
groove(T1, CHORDS2, 1);
for (let t = T1; t < T2 - 0.5; t += BEAT) kick(t);
for (let t = T1 + BEAT; t < T2 - 0.5; t += BEAT * 2) clap(t);
for (let t = T1 + BEAT / 2; t < T2 - 0.5; t += BEAT) hat(t, true);
for (let t = T1; t < T2 - 0.5; t += BEAT) hat(t);
TAPS.forEach(click);
pop(T1 + 2.45, 0); // added to cart
whoosh(T1 + 2.95); // payment sheet
bells(T1 + 4.1, [72, 76, 79, 84, 88], 0.07, 0.22); // payment success
riser(T2 - 0.8, T2);

// Scene 3: IV - V - I cadence into a resolved ending.
impact(T2); whoosh(T2 - 0.3);
bells(T2 + 0.2, [96, 91, 88, 84], 0.05, 0.1); // logo sparkle
groove(T2, [[41, [53, 57, 60]], [43, [55, 59, 62]]], 1);
[48, 55, 60, 64, 67].forEach((m) => note(music, m, T2 + 2, 0.6, { type: 'saw', gain: 0.08, a: 0.01, d: 0.3, s: 0.6, r: 0.4, voices: 3, detune: 0.15, cutoff: 3000, sendAmt: 0.5 }));
for (let t = T2; t < T2 + 2; t += BEAT) kick(t);
for (let t = T2 + BEAT; t < T2 + 2; t += BEAT * 2) clap(t);
for (let t = T2 + BEAT / 2; t < T2 + 2; t += BEAT) hat(t, true);
kick(T2 + 2); impact(T2 + 2);
bells(T2 + 2, [84, 88, 91, 96], 0.06, 0.12);

// ---------- mix ----------
function generateMusic(file) {
  // Side-chain the music bus on every groove kick.
  const kicks = [];
  for (let t = T1; t < T2 + 2.01; t += BEAT) kicks.push(t);
  synth.writeWav(file, synth.mixdown(kicks));
  return file;
}

module.exports = { generateMusic, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'music.wav'));
  console.log('wrote', generateMusic(out));
}
