#!/usr/bin/env node
/**
 * Original soundtrack for the Milano Foods sushi reel, scored to scene.html: a
 * deep space rumble and a rushing dive down to Zarafshon, a rising whoosh over the map and a thud when the pin lands, a whip into a
 * punchy 120 BPM beat, coin clinks, a blade swish and slice, bouncing pops for
 * the raining pieces, sparkles for the stars and a resolved ending. The
 * restaurant's own voice-over lines (voice/*.wav) sit on top when present.
 *
 * Usage:  node video/milano-sushi/audio.js [out.wav]
 */
const fs = require('fs');
const path = require('path');
const { createSynth } = require('../lib/synth');
const { mixVoice } = require('../lib/voiceover');

const DURATION = 16.4;
const BEAT = 0.5;
// Timeline, kept in sync with scene.html.
const G = 1.4;   // the globe dive at the start; the rest is shifted by G
const T = { map: G, rolls: G + 2.0, cut: G + 4.0, set: G + 6.5, review: G + 9.0, cta: G + 11.5 };
// voice-over line -> start time (files recorded by the restaurant, voice/<key>.wav)
const VOICE = { zarafshon: 0.15, sushi: T.rolls + 0.15, milano: T.set + 0.35, order: T.cta + 0.35 };

const synth = createSynth(DURATION);
const { music, fx, drums, note, noiseHit, kick, clap, hat, impact, riser, whoosh, pop, bells } = synth;
let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/** Coin-like clink: two inharmonic partials. */
function clink(t0, k = 0) {
  note(fx, 96 + k, t0, 0.01, { type: 'sine', gain: 0.1, a: 0.001, d: 0.2, s: 0, r: 0.25, pan: k % 2 ? 0.4 : -0.4, sendAmt: 0.4 });
  note(fx, 102.3 + k, t0, 0.01, { type: 'sine', gain: 0.06, a: 0.001, d: 0.12, s: 0, r: 0.15, pan: k % 2 ? 0.4 : -0.4, sendAmt: 0.4 });
}

// ---------- 0: the globe dive ----------
noiseHit(music, 0, G, { gain: 2.2, a: 0.1, decay: 1e6, lp: 70, sendAmt: 0.2 });                              // space rumble
noiseHit(fx, 0.2, G - 0.2, { gain: 0.45, rise: true, hp: 150, lp: 500, lpEnd: 9000, sendAmt: 0.3 });      // rushing down through the air
for (let i = 0; i < 6; i++) note(fx, 84 + i * 2, 0.4 + i * 0.08, 0.02, { type: 'sine', gain: 0.05, a: 0.001, d: 0.05, s: 0, r: 0.05, sendAmt: 0.4 }); // border drawn on
impact(T.map);

// ---------- 1: map fly-over ----------
noiseHit(fx, T.map, 1.3, { gain: 0.35, a: 0.02, decay: 0.6, hp: 200, lp: 3000, lpEnd: 600, sendAmt: 0.3 });   // air rushing past
note(fx, 38, T.map + 1.2, 0.3, { type: 'sine', gain: 0.6, a: 0.002, d: 0.25, s: 0, r: 0.2, glideFrom: 50 });        // pin lands
noiseHit(fx, T.map + 1.2, 0.2, { gain: 0.2, decay: 0.05, hp: 800, lp: 5000 });
for (let i = 0; i < 9; i++) note(fx, 72 + i, T.map + 0.1 + i * 0.05, 0.02, { type: 'sine', gain: 0.07, a: 0.001, d: 0.05, s: 0, r: 0.04, pan: (i / 8) - 0.5 }); // letters drop
riser(T.map + 1.45, T.rolls);
whoosh(T.rolls - 0.35);

// ---------- beat from the first cut to the call to action ----------
const CH = [[45, [57, 60, 64]], [41, [57, 60, 65]], [43, [55, 59, 62]], [40, [55, 59, 64]]];
const kicks = [];
impact(T.rolls);
for (let t = T.rolls, c = 0; t < T.cta - 0.01; t += 1, c++) {
  const [root, tones] = CH[c % 4];
  tones.forEach((m) => note(music, m + 12, t, 0.2, { type: 'saw', gain: 0.03, a: 0.005, d: 0.15, s: 0.3, r: 0.1, voices: 3, detune: 0.15, cutoff: 3000, sendAmt: 0.3 }));
  tones.forEach((m) => note(music, m + 12, t + 0.75, 0.15, { type: 'saw', gain: 0.022, a: 0.005, d: 0.1, s: 0.2, r: 0.08, voices: 3, detune: 0.15, cutoff: 3000, sendAmt: 0.3 }));
  note(music, root - 12, t, 0.4, { type: 'sine', gain: 0.45, a: 0.004, d: 0.3, s: 0.4, r: 0.1 });
  note(music, root - 12, t + 0.5, 0.2, { type: 'sine', gain: 0.3, a: 0.004, d: 0.15, s: 0.3, r: 0.08 });
}
for (let t = T.rolls; t < T.cta - 0.01; t += BEAT) { kick(t, 0.6); kicks.push(t); }
for (let t = T.rolls + BEAT; t < T.cta; t += BEAT * 2) clap(t);
for (let t = T.rolls; t < T.cta; t += BEAT / 4) noiseHit(drums, t, 0.04, { gain: Math.round(t / (BEAT / 4)) % 2 ? 0.05 : 0.09, decay: 0.012, hp: 7500, pan: 0.25 });

// ---------- 2: coins ----------
[0, 1, 2].forEach((i) => { clink(T.rolls + 0.55 + i * 0.25, i); whoosh(T.rolls + 0.05 + i * 0.25); });

// ---------- 3: the cut ----------
whoosh(T.cut - 0.3); impact(T.cut);
noiseHit(fx, T.cut + 0.45, 0.22, { gain: 0.45, a: 0.18, decay: 0.03, hp: 2500, lp: 6000, lpEnd: 14000, pan: -0.3, sendAmt: 0.4 }); // blade swish
noiseHit(fx, T.cut + 0.64, 0.25, { gain: 0.5, decay: 0.05, hp: 1500, lp: 12000, sendAmt: 0.5 });                               // slice
note(fx, 100, T.cut + 0.64, 0.02, { type: 'sine', gain: 0.1, a: 0.001, d: 0.4, s: 0, r: 0.5, sendAmt: 0.6 });                   // ring of the blade
for (let i = 0; i < 6; i++) pop(T.cut + 1.6 + i * 0.1, i);

// ---------- 4: set and orbit ----------
whoosh(T.set - 0.3); impact(T.set);
noiseHit(fx, T.set + 0.2, 2.0, { gain: 0.12, a: 0.8, decay: 0.6, hp: 1500, lp: 4000, lpEnd: 9000, sendAmt: 0.5 });

// ---------- 5: stars ----------
whoosh(T.review - 0.3);
for (let i = 0; i < 5; i++) note(fx, 84 + [0, 4, 7, 12, 16][i], T.review + 0.2 + i * 0.1, 0.05, { type: 'sine', gain: 0.1, a: 0.002, d: 0.2, s: 0, r: 0.3, sendAmt: 0.5 });
pop(T.review + 0.85, 1);
riser(T.cta - 0.8, T.cta);

// ---------- 6: call to action ----------
impact(T.cta); kick(T.cta, 0.8); kicks.push(T.cta);
[45, 57, 61, 64, 69].forEach((m) => note(music, m, T.cta, 3.2, { type: 'tri', gain: 0.07, a: 0.05, d: 0.8, s: 0.6, r: 0.8, voices: 3, detune: 0.1, cutoff: 2600, sendAmt: 0.5 }));
pop(T.cta + 0.45, 0);
bells(T.cta + 1.0, [81, 85, 88, 93], 0.07, 0.1);

function generateAudio(file) {
  const sfx = file.replace(/\.wav$/, '-music.wav');
  synth.writeWav(sfx, synth.mixdown(kicks, 1.0));
  mixVoice({ sfx, out: file, dir: path.join(__dirname, 'voice'), starts: VOICE, duration: DURATION, ext: 'wav' });
  fs.unlinkSync(sfx);
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
