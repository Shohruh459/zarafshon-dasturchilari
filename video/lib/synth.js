/**
 * Tiny offline synthesiser shared by the video soundtracks: oscillator notes,
 * filtered noise, drums, transition FX, a Schroeder reverb and a WAV writer.
 * Everything is generated from code, so the audio is original and free to use.
 *
 *   const s = createSynth(seconds);
 *   s.kick(0); s.note(s.music, 60, 0, 1);
 *   s.writeWav('out.wav', s.mixdown(kickTimes));
 */
const fs = require('fs');

const SR = 44100;

function createSynth(DURATION) {
  const N = Math.round(SR * DURATION);

  // ---------- buses ----------
  const bus = () => ({ L: new Float32Array(N), R: new Float32Array(N) });
  const drums = bus(), music = bus(), fx = bus(), send = bus();

  const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
  let noiseSeed = 1;
  const noise = () => ((noiseSeed = (noiseSeed * 16807) % 2147483647) / 1073741823.5) - 1;

  function put(b, i, v, pan = 0, sendAmt = 0) {
    if (i < 0 || i >= N) return;
    const l = v * Math.cos((pan + 1) * Math.PI / 4), r = v * Math.sin((pan + 1) * Math.PI / 4);
    b.L[i] += l; b.R[i] += r;
    if (sendAmt) { send.L[i] += l * sendAmt; send.R[i] += r * sendAmt; }
  }

  const wave = {
    sine: (p) => Math.sin(2 * Math.PI * p),
    saw: (p) => 2 * (p - Math.floor(p + 0.5)),
    square: (p) => (p % 1 < 0.5 ? 1 : -1),
    tri: (p) => 1 - 4 * Math.abs((p % 1) - 0.5),
  };

  /** Oscillator note with ADSR, unison detune and a (optionally sweeping) low-pass filter. */
  function note(b, midi, t0, dur, o = {}) {
    const { type = 'saw', gain = 0.2, a = 0.01, d = 0.1, s = 0.7, r = 0.2, pan = 0, voices = 1, detune = 0.1,
            cutoff = 20000, cutoffEnd = cutoff, sendAmt = 0, glideFrom = null } = o;
    const f = hz(midi), start = Math.round(t0 * SR), len = Math.round((dur + r) * SR);
    for (let v = 0; v < voices; v++) {
      const cents = voices > 1 ? (v / (voices - 1) - 0.5) * 2 * detune : 0;
      const vf = f * Math.pow(2, cents / 12);
      const vpan = voices > 1 ? pan + (v / (voices - 1) - 0.5) * 0.8 : pan;
      let phase = (v * 0.37 + midi * 0.013) % 1, y = 0; // deterministic
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        let env;
        if (t < a) env = t / a;
        else if (t < a + d) env = 1 - (1 - s) * (t - a) / d;
        else if (t < dur) env = s;
        else env = s * Math.max(0, 1 - (t - dur) / r);
        const freq = glideFrom ? hz(glideFrom) + (vf - hz(glideFrom)) * Math.min(1, t / 0.08) : vf;
        phase += freq / SR;
        const fc = cutoff + (cutoffEnd - cutoff) * Math.min(1, t / (dur + r));
        y += (1 - Math.exp(-2 * Math.PI * fc / SR)) * (wave[type](phase) - y);
        put(b, start + i, y * env * gain / Math.sqrt(voices), vpan, sendAmt);
      }
    }
  }

  /** Filtered noise burst (hats, claps, whooshes, risers). */
  function noiseHit(b, t0, dur, o = {}) {
    const { gain = 0.3, a = 0.001, decay = 0.1, hp = 0, lp = 20000, lpEnd = lp, pan = 0, sendAmt = 0, rise = false } = o;
    const start = Math.round(t0 * SR), len = Math.round(dur * SR);
    const ah = hp ? Math.exp(-2 * Math.PI * hp / SR) : 0;
    let yl = 0, yh = 0, xp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / SR;
      const env = rise ? Math.pow(t / dur, 2.2) : Math.min(1, t / a) * Math.exp(-t / decay);
      const x = noise();
      yh = hp ? ah * (yh + x - xp) : x; xp = x;
      const fc = lp + (lpEnd - lp) * (t / dur);
      yl += (1 - Math.exp(-2 * Math.PI * fc / SR)) * (yh - yl);
      put(b, start + i, yl * env * gain, pan, sendAmt);
    }
  }

  function kick(t0, gain = 0.7) {
    const start = Math.round(t0 * SR), len = Math.round(0.4 * SR);
    let ph = 0;
    for (let i = 0; i < len; i++) {
      const t = i / SR;
      ph += (45 + 110 * Math.exp(-t / 0.03)) / SR;
      put(drums, start + i, Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.16) * gain);
    }
    noiseHit(drums, t0, 0.01, { gain: 0.25, decay: 0.003, hp: 2000 });
  }
  const clap = (t0) => [0, 0.012, 0.024].forEach((o, k) =>
    noiseHit(drums, t0 + o, 0.25, { gain: k === 2 ? 0.35 : 0.2, decay: k === 2 ? 0.09 : 0.01, hp: 900, lp: 5000, sendAmt: 0.25 }));
  const hat = (t0, open = false) => noiseHit(drums, t0, open ? 0.2 : 0.06, { gain: 0.14, decay: open ? 0.07 : 0.018, hp: 7000, pan: 0.25 });

  function impact(t0) {
    const start = Math.round(t0 * SR), len = Math.round(1.4 * SR);
    let ph = 0;
    for (let i = 0; i < len; i++) {
      const t = i / SR;
      ph += (32 + 60 * Math.exp(-t / 0.08)) / SR;
      put(fx, start + i, Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.45) * 0.8);
    }
    noiseHit(fx, t0, 1.6, { gain: 0.35, decay: 0.5, hp: 3000, sendAmt: 0.5 }); // crash
  }
  const riser = (t0, t1) => {
    noiseHit(fx, t0, t1 - t0, { gain: 0.35, rise: true, hp: 400, lp: 800, lpEnd: 12000, sendAmt: 0.3 });
    note(fx, 60, t0, t1 - t0, { type: 'sine', gain: 0.08, a: t1 - t0, r: 0.02, glideFrom: null });
  };
  const whoosh = (t0) => noiseHit(fx, t0, 0.45, { gain: 0.3, a: 0.2, decay: 0.12, hp: 600, lp: 1500, lpEnd: 9000, sendAmt: 0.3 });
  const pop = (t0, k) => {
    note(fx, 84 + (k % 3) * 2, t0, 0.04, { type: 'sine', gain: 0.22, a: 0.002, d: 0.04, s: 0, r: 0.05, pan: (k % 2 ? 0.4 : -0.4), sendAmt: 0.2 });
    note(fx, 91 + (k % 3) * 2, t0 + 0.05, 0.05, { type: 'sine', gain: 0.18, a: 0.002, d: 0.05, s: 0, r: 0.08, pan: (k % 2 ? 0.4 : -0.4), sendAmt: 0.2 });
  };
  const click = (t0) => { noiseHit(fx, t0, 0.03, { gain: 0.5, decay: 0.006, hp: 1500, lp: 8000 }); note(fx, 76, t0, 0.02, { type: 'sine', gain: 0.2, a: 0.001, d: 0.02, s: 0, r: 0.03 }); };
  const bells = (t0, notes, step = 0.07, gain = 0.2) => notes.forEach((m, i) =>
    note(fx, m, t0 + i * step, 0.05, { type: 'sine', gain, a: 0.002, d: 0.3, s: 0.2, r: 0.6, pan: (i % 2 ? 0.3 : -0.3), sendAmt: 0.45 }));

  // ---------- mix ----------
  function reverb(inp) {
    const out = bus();
    const combs = [1557, 1617, 1491, 1422], aps = [225, 556];
    for (const ch of ['L', 'R']) {
      const x = inp[ch], y = out[ch], off = ch === 'R' ? 23 : 0;
      for (const dl of combs) {
        const d = dl + off, buf = new Float32Array(d);
        let idx = 0, lp = 0;
        for (let i = 0; i < N; i++) {
          const o = buf[idx];
          lp = o * 0.7 + lp * 0.3; // damping
          buf[idx] = x[i] + lp * 0.82;
          y[i] += o / combs.length;
          idx = (idx + 1) % d;
        }
      }
      for (const d of aps) {
        const buf = new Float32Array(d);
        let idx = 0;
        for (let i = 0; i < N; i++) {
          const b = buf[idx], v = y[i] + b * 0.5;
          buf[idx] = v; y[i] = b - v * 0.5; idx = (idx + 1) % d;
        }
      }
    }
    return out;
  }

  function mixdown(kicks = []) {
    const wet = reverb(send);
    // Side-chain style ducking of the music bus on every kick time passed in.
    const L = new Float32Array(N), R = new Float32Array(N);
    let k = 0;
    for (let i = 0; i < N; i++) {
      const t = i / SR;
      while (k + 1 < kicks.length && kicks[k + 1] <= t) k++;
      const since = kicks.length ? t - kicks[k] : -1;
      const duck = since >= 0 ? 1 - 0.55 * Math.exp(-since / 0.09) : 1;
      const fade = Math.min(1, (DURATION - t) / 0.35);
      L[i] = (drums.L[i] + music.L[i] * duck + fx.L[i] + wet.L[i] * 0.6) * fade;
      R[i] = (drums.R[i] + music.R[i] * duck + fx.R[i] + wet.R[i] * 0.6) * fade;
    }
    let peak = 0;
    for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.2); R[i] = Math.tanh(R[i] * 1.2); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
    const g = 0.89 / peak; // -1 dBFS
    for (let i = 0; i < N; i++) { L[i] *= g; R[i] *= g; }
    return { L, R };
  }

  function writeWav(file, { L, R }) {
    const buf = Buffer.alloc(44 + N * 4);
    buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
    buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
    buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
    buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
    for (let i = 0; i < N; i++) {
      buf.writeInt16LE(Math.round(L[i] * 32767), 44 + i * 4);
      buf.writeInt16LE(Math.round(R[i] * 32767), 46 + i * 4);
    }
    fs.writeFileSync(file, buf);
  }

  return { SR, N, drums, music, fx, send, hz, noise, put, note, noiseHit, kick, clap, hat, impact, riser, whoosh, pop, click, bells, mixdown, writeWav };
}

module.exports = { createSynth, SR };
