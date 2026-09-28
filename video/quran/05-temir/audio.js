#!/usr/bin/env node
/**
 * Sound design for "Temir". No musical instruments or melodies: the rumble
 * of space and of a star's plasma, the collapse and blast of a supernova, the
 * deep groan of the Earth and a heartbeat with flowing blood, all from
 * filtered noise and low thuds, with the Uzbek voice-over (Madina, voice/) on
 * top; the effects duck under the voice.
 *
 * Usage:  node video/quran/05-temir/audio.js [out.wav]
 */
const fs = require('fs');
const path = require('path');
const { createSynth } = require('../../lib/synth');
const { mixVoice } = require('../../lib/voiceover');

const DURATION = 52;
// Timeline, kept in sync with scene.html.
const T = { ayah: 5.4, core: 12.0, heat: 21.8, nova: 28.6, earth: 34.2, blood: 41.8, close: 47.0 };
// Voice-over line -> start time.
const VOICE = {
  hook: 0.3, ayah: T.ayah + 0.3, core: T.core + 0.3, heat: T.heat + 0.3, nova: T.nova + 0.3,
  earth: T.earth + 0.3, blood: T.blood + 0.3, close: T.close + 3.0,
};

const synth = createSynth(DURATION);
const { SR, fx, music, put, noiseHit, impact, whoosh } = synth;

const bed = (t0, dur, o) => noiseHit(music, t0, dur, { a: 0.8, decay: 1e6, ...o });
function air(t0, len = 1.4, gain = 0.04) {
  noiseHit(fx, t0, len * 0.5, { gain, rise: true, hp: 4500, lp: 9000, sendAmt: 0.5 });
  noiseHit(fx, t0 + len * 0.5, len * 0.5, { gain, a: 0.01, decay: len / 5, hp: 4500, lp: 9000, sendAmt: 0.5 });
}
/** A low thud with a falling pitch (heartbeat, distant blast). */
function thud(t0, { f = 55, gain = 0.5, len = 0.25 } = {}) {
  const start = Math.round(t0 * SR), n = Math.round(len * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (f * (1 + 0.6 * Math.exp(-t / 0.03))) / SR;
    put(fx, start + i, Math.sin(2 * Math.PI * ph) * Math.exp(-t / (len / 4)) * Math.min(1, t / 0.004) * gain);
  }
}

// ---------- space ----------
bed(0, T.core, { gain: 2.6, lp: 70, sendAmt: 0.2 });
bed(0.3, T.core - 0.3, { gain: 0.08, hp: 2500, lp: 7000, sendAmt: 0.5 });
noiseHit(fx, 0, 1.8, { gain: 0.25, rise: true, hp: 200, lp: 500, lpEnd: 3000, sendAmt: 0.4 });
air(0.6, 1.8, 0.06);
air(T.ayah + 0.4, 1.8, 0.06);

// ---------- inside the star: roaring plasma, a layer appears every ~1 s ----------
whoosh(T.core - 0.3);
bed(T.core, T.nova - T.core, { gain: 2.8, a: 1.2, lp: 180, lpEnd: 320, sendAmt: 0.3 });
bed(T.core, T.nova - T.core, { gain: 0.25, a: 1.5, hp: 300, lp: 1200, sendAmt: 0.3 });
for (let k = 0; k < 6; k++) {
  const t = T.core + 0.3 + (6.2 / 6) * k;
  noiseHit(fx, t, 0.9, { gain: 0.16 + k * 0.02, a: 0.01, decay: 0.25, hp: 150, lp: 900 - k * 80, sendAmt: 0.5 });
}
air(T.core + 5.2, 1.4, 0.05);
whoosh(T.heat - 0.2);
noiseHit(fx, T.heat + 1.6, 1.4, { gain: 0.25, rise: true, hp: 400, lp: 1500, lpEnd: 7000, sendAmt: 0.3 }); // the iron bar climbs
air(T.heat + 3.0, 1.4, 0.05);

// ---------- collapse and supernova ----------
noiseHit(fx, T.nova - 0.2, 0.95, { gain: 0.6, rise: true, hp: 100, lp: 300, lpEnd: 4000, sendAmt: 0.3 }); // implosion
impact(T.nova + 0.7);
thud(T.nova + 0.7, { f: 38, gain: 0.9, len: 1.2 });
noiseHit(fx, T.nova + 0.7, 4.5, { gain: 0.8, a: 0.01, decay: 1.4, hp: 60, lp: 3000, lpEnd: 250, sendAmt: 0.6 }); // blast rolling away
bed(T.nova + 1, T.earth - T.nova - 1, { gain: 1.6, a: 1, lp: 90, sendAmt: 0.3 });

// ---------- the Earth: a deep groan from the core ----------
whoosh(T.earth - 0.25);
bed(T.earth, T.blood - T.earth, { gain: 3.0, a: 0.8, lp: 60, sendAmt: 0.2 });
bed(T.earth, T.blood - T.earth, { gain: 0.3, a: 1.5, hp: 120, lp: 400, sendAmt: 0.3 });
air(T.earth + 0.4, 1.8, 0.05);

// ---------- blood: a heartbeat and the rush of flow ----------
whoosh(T.blood - 0.25);
bed(T.blood, T.close - T.blood, { gain: 0.5, a: 0.5, hp: 80, lp: 450, sendAmt: 0.3 });
for (let t = T.blood + 0.2; t < T.close - 0.3; t += 0.9) {        // ~67 beats per minute: lub-dub
  thud(t, { f: 52, gain: 0.55, len: 0.22 });
  thud(t + 0.24, { f: 64, gain: 0.35, len: 0.18 });
}

// ---------- close ----------
bed(T.close, DURATION - T.close, { gain: 2.2, a: 1, lp: 70, sendAmt: 0.2 });
noiseHit(fx, T.close, 2.5, { gain: 0.2, a: 0.01, decay: 0.8, hp: 300, lp: 6000, lpEnd: 800, sendAmt: 0.6 });
air(T.close + 0.4, 1.8, 0.06);

function generateAudio(file) {
  const sfx = file.replace(/\.wav$/, '-sfx.wav');
  synth.writeWav(sfx, synth.mixdown([], 1.8));
  mixVoice({ sfx, out: file, dir: path.join(__dirname, 'voice'), starts: VOICE, duration: DURATION });
  fs.unlinkSync(sfx);
  return file;
}

module.exports = { generateAudio, DURATION };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'audio.wav'));
  console.log('wrote', generateAudio(out));
}
