/**
 * Sound design for the three brand intros in intro.html, one short track each:
 *   A (build):  key clicks, rising progress blips, glitch zaps, a bass slam
 *   B (splash): ice falling and clinking, a splash, bubbles, a pop for the logo
 *   C (cinema): low boom, gold shimmer while the monogram draws, soft swell
 * Timings mirror intro.html. Synthesised from code, so it is royalty-free.
 */
const { createSynth } = require('../lib/synth');

const LENGTH = { A: 2.4, B: 2.4, C: 2.6 };

function scoreA(s) {
  const { fx, music, note, noiseHit, impact, whoosh, bells } = s;
  // typing the command (0.05-0.45s)
  for (let i = 0; i < 12; i++) {
    const t = 0.05 + i * 0.034;
    noiseHit(fx, t, 0.02, { gain: 0.35, decay: 0.004, hp: 2500, lp: 9000, pan: (i % 3 - 1) * 0.3 });
    note(fx, 60 + (i % 4), t, 0.005, { type: 'square', gain: 0.03, a: 0.001, d: 0.01, s: 0, r: 0.01, cutoff: 3000 });
  }
  // [ok] lines and the progress bar
  [0.5, 0.62, 0.74].forEach((t, i) => note(fx, 84 + i * 3, t, 0.03, { type: 'square', gain: 0.07, a: 0.002, d: 0.05, s: 0, r: 0.04, cutoff: 5000 }));
  for (let i = 0; i < 10; i++) note(fx, 72 + i * 2, 0.55 + i * 0.05, 0.02, { type: 'sine', gain: 0.06, a: 0.002, d: 0.03, s: 0, r: 0.02 });
  note(music, 38, 0.1, 1.0, { type: 'saw', gain: 0.12, a: 0.3, s: 1, r: 0.05, cutoff: 200, cutoffEnd: 1800 }); // tension bed
  // glitch zaps (1.05-1.3s)
  for (let i = 0; i < 6; i++) {
    const t = 1.05 + i * 0.04;
    note(fx, 40 + ((i * 7) % 24), t, 0.03, { type: 'square', gain: 0.12, a: 0.001, d: 0.03, s: 0, r: 0.01, cutoff: 4000, pan: i % 2 ? 0.6 : -0.6 });
    noiseHit(fx, t, 0.03, { gain: 0.2, decay: 0.01, hp: 3000 });
  }
  whoosh(1.0);
  // logo slam
  impact(1.45);
  [38, 50, 57, 62].forEach((m) => note(music, m, 1.45, 0.7, { type: 'saw', gain: 0.07, a: 0.005, d: 0.4, s: 0.4, r: 0.3, voices: 3, detune: 0.15, cutoff: 2500, sendAmt: 0.4 }));
  bells(1.6, [86, 90, 93], 0.06, 0.08);
}

function scoreB(s) {
  const { fx, music, note, noiseHit, whoosh, pop, bells } = s;
  whoosh(0.0);                                                                                          // cube falling
  [96, 102, 99].forEach((m, i) => note(fx, m, 0.45 + i * 0.03, 0.01, { type: 'sine', gain: 0.12, a: 0.001, d: 0.2, s: 0, r: 0.2, sendAmt: 0.4 }));
  noiseHit(fx, 0.45, 0.6, { gain: 0.55, a: 0.004, decay: 0.16, hp: 300, lp: 6000, lpEnd: 1200, sendAmt: 0.35 }); // splash
  note(fx, 45, 0.45, 0.3, { type: 'sine', gain: 0.3, a: 0.005, d: 0.25, s: 0, r: 0.1, glideFrom: 57 });         // body of the splash
  let k = 7;
  const r = () => ((k = (k * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 22; i++) {                                                                         // bubbles
    const t = 0.6 + r() * 1.6;
    note(fx, 78 + r() * 14, t, 0.03, { type: 'sine', gain: 0.06, a: 0.002, d: 0.05, s: 0, r: 0.04, pan: r() * 1.2 - 0.6, glideFrom: 70 });
  }
  pop(1.05, 0);                                                                                          // logo surfaces
  [53, 57, 60, 64].forEach((m) => note(music, m, 1.0, 1.2, { type: 'tri', gain: 0.08, a: 0.05, d: 0.5, s: 0.5, r: 0.3, cutoff: 3000, sendAmt: 0.4 }));
  bells(1.3, [77, 81, 84, 89], 0.07, 0.07);
  whoosh(2.05);                                                                                          // liquid fills the frame
}

function scoreC(s) {
  const { fx, music, note, noiseHit, impact, bells } = s;
  impact(0.08);
  note(music, 26, 0, 2.4, { type: 'sine', gain: 0.2, a: 0.3, s: 1, r: 0.3 });
  [50, 57, 62, 66].forEach((m) => note(music, m, 0.5, 1.9, { type: 'saw', gain: 0.018, a: 0.7, s: 1, r: 0.4, voices: 3, detune: 0.1, cutoff: 1200, sendAmt: 0.6 }));
  noiseHit(fx, 0.55, 0.6, { gain: 0.1, rise: true, hp: 800, lp: 2000, lpEnd: 7000, sendAmt: 0.5 });     // bars open
  noiseHit(fx, 1.15, 0.5, { gain: 0.1, a: 0.01, decay: 0.15, hp: 800, lp: 7000, lpEnd: 2000, sendAmt: 0.5 });
  bells(1.0, [86, 90], 0.2, 0.05);                                                                     // Z, D strokes
  bells(1.45, [93], 0.01, 0.05);
  bells(1.65, [81, 86, 90, 93], 0.08, 0.06);                                                           // name appears
}

/** Writes the intro's track to `file` and returns the path. */
function generateIntroAudio(kind, file) {
  const s = createSynth(LENGTH[kind]);
  ({ A: scoreA, B: scoreB, C: scoreC })[kind](s);
  s.writeWav(file, s.mixdown([], 0.3));
  return file;
}

module.exports = { generateIntroAudio, LENGTH };
