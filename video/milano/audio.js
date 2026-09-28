#!/usr/bin/env node
/**
 * Original soundtrack for the Milano Foods ad, scored to scene.html: a sizzling
 * pan under the burger, a hit on the logo, a warm 120 BPM groove through the
 * menu with whooshes and pops for each dish, and a resolved ending on the call
 * to action; the Madina voice-over (voice/) sits on top and the music ducks
 * under it.
 *
 * Usage:  node video/milano/audio.js [out.wav]
 */
const fs = require('fs');
const path = require('path');
const { createSynth } = require('../lib/synth');
const { mixVoice } = require('../lib/voiceover');

const DURATION = 24;
const BEAT = 0.5; // 120 BPM
// Timeline, kept in sync with scene.html.
const T = { logo: 2.5, pizza: 4.5, sushi: 7.5, combo: 10.5, reviews: 14.5, cta: 18.5 };
const VOICE = { hook: 0.3, logo: T.logo + 0.4, combo: T.combo + 0.4, reviews: T.reviews + 0.3, cta: T.cta + 0.4 };

const synth = createSynth(DURATION);
const { music, fx, drums, note, noiseHit, kick, clap, hat, impact, riser, whoosh, pop, bells } = synth;

let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/** Mandolin-like pluck: bright saw, fast decay, doubled an octave up quietly. */
function pluck(midi, t0, gain = 0.12, pan = 0) {
  note(music, midi, t0, 0.02, { type: 'saw', gain, a: 0.002, d: 0.18, s: 0, r: 0.1, pan, cutoff: 4200, cutoffEnd: 1200, sendAmt: 0.25 });
  note(music, midi + 12, t0, 0.01, { type: 'sine', gain: gain * 0.3, a: 0.001, d: 0.08, s: 0, r: 0.05, pan, sendAmt: 0.15 });
}

// ---------- hook: sizzle and a low pad (0 - 2.5) ----------
for (let t = 0; t < T.logo - 0.05; ) {                       // fat crackling in a hot pan
  noiseHit(fx, t, 0.012, { gain: 0.06 + rnd() * 0.08, decay: 0.003, hp: 3500, pan: rnd() * 1.4 - 0.7 });
  t += 0.008 + rnd() * 0.03;
}
noiseHit(fx, 0, T.logo, { gain: 0.08, a: 0.3, decay: 1e6, hp: 5000, lp: 10000, sendAmt: 0.2 }); // hiss
[57, 60, 64].forEach((m) => note(music, m, 0, T.logo - 0.2, { type: 'tri', gain: 0.07, a: 0.4, s: 1, r: 0.2, voices: 3, detune: 0.1, cutoff: 1400, sendAmt: 0.5 }));
kick(0, 0.7);
riser(T.logo - 0.8, T.logo);

// ---------- logo hit (2.5) ----------
impact(T.logo);
whoosh(T.logo - 0.3);
bells(T.logo + 0.35, [84, 88, 91, 96], 0.06, 0.1);

// ---------- groove (2.5 - 18.5): A - F#m - D - E, a sunny Italian-pop feel ----------
const CHORDS = [[45, [57, 61, 64, 69]], [42, [57, 61, 66, 69]], [38, [57, 62, 66, 69]], [40, [56, 59, 64, 68]]];
const kicks = [];
for (let t = T.logo, c = 0; t < T.cta - 0.01; t += 2, c++) {
  const [root, tones] = CHORDS[c % 4];
  tones.slice(0, 3).forEach((m) => note(music, m, t, 1.95, { type: 'saw', gain: 0.03, a: 0.08, s: 0.8, r: 0.1, voices: 3, detune: 0.12, cutoff: 1600, sendAmt: 0.35 }));
  for (let b = 0; b < 4; b++) {
    note(music, root, t + b * BEAT, 0.18, { type: 'tri', gain: 0.28, a: 0.004, d: 0.12, s: 0.4, r: 0.05 });
    note(music, root + 12, t + b * BEAT + 0.25, 0.1, { type: 'tri', gain: 0.14, a: 0.004, d: 0.08, s: 0.3, r: 0.04 });
  }
  // tremolo-ish plucked arpeggio in eighths
  for (let e = 0; e < 8; e++) pluck(tones[(e + c) % 4] + 12, t + e * 0.25, e % 2 ? 0.07 : 0.1, e % 2 ? 0.3 : -0.3);
}
for (let t = T.logo; t < T.cta - 0.01; t += BEAT) { kick(t, 0.55); kicks.push(t); }
for (let t = T.logo + BEAT; t < T.cta; t += BEAT * 2) clap(t);
for (let t = T.logo + BEAT / 2; t < T.cta; t += BEAT) hat(t, false);

// ---------- dishes ----------
whoosh(T.pizza - 0.2); pop(T.pizza + 0.5, 0);
whoosh(T.sushi - 0.2); [0.5, 0.8, 1.1].forEach((d, i) => pop(T.sushi + d, i));
whoosh(T.combo - 0.2); impact(T.combo + 0.2);
noiseHit(fx, T.combo + 1.2, 1.0, { gain: 0.12, a: 0.4, decay: 0.2, hp: 3000, lp: 6000, lpEnd: 12000, sendAmt: 0.4 }); // shine sweep
whoosh(T.reviews - 0.2); pop(T.reviews + 0.7, 1); pop(T.reviews + 1.7, 2);
riser(T.cta - 0.8, T.cta);

// ---------- call to action (18.5 - 24): resolve on A ----------
impact(T.cta);
note(fx, 79, T.cta + 0.9, 0.05, { type: 'sine', gain: 0.18, a: 0.002, d: 0.2, s: 0, r: 0.3, sendAmt: 0.4 }); // pin lands
[45, 57, 61, 64, 69].forEach((m) => note(music, m, T.cta, 4.5, { type: 'tri', gain: 0.07, a: 0.05, d: 0.8, s: 0.6, r: 1, voices: 3, detune: 0.1, cutoff: 2800, sendAmt: 0.5 }));
for (let t = T.cta; t < T.cta + 4; t += BEAT) { kick(t, 0.5); kicks.push(t); }
for (let t = T.cta + BEAT; t < T.cta + 4; t += BEAT * 2) clap(t);
[0, 0.25, 0.5, 1, 1.25, 1.5, 2].forEach((o, k) => pluck([69, 73, 76, 81, 76, 73, 81][k] + 12, T.cta + 1.4 + o, 0.09, k % 2 ? 0.3 : -0.3));
bells(T.cta + 4.2, [81, 85, 88, 93], 0.07, 0.1);

function generateAudio(file) {
  const sfx = file.replace(/\.wav$/, '-music.wav');
  synth.writeWav(sfx, synth.mixdown(kicks, 1.2));
  mixVoice({ sfx, out: file, dir: path.join(__dirname, 'voice'), starts: VOICE, duration: DURATION });
  fs.unlinkSync(sfx);
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
