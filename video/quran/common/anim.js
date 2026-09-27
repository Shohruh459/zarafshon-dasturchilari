// Shared timing and text-reveal helpers for the "Qur'on va ilm" episodes (ES module).

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const lerp = (a, b, p) => a + (b - a) * p;
export const eOut = (x) => 1 - Math.pow(1 - x, 3);
export const eInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/**
 * Wraps every word of an element's text in a clipping mask so it can slide up
 * into place. Arabic blocks, `.big` numerals and <em> notes are left whole.
 * Returns the inner spans to animate.
 */
export function maskWords(el) {
  const walk = (node) => {
    for (const n of [...node.childNodes]) {
      if (n.nodeType === 3 && n.textContent.trim()) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => {
          if (!w.trim()) { f.append(w); return; }
          const m = document.createElement('span'); m.className = 'mask';
          const s = document.createElement('span'); s.textContent = w; m.append(s); f.append(m);
        });
        n.replaceWith(f);
      } else if (n.nodeType === 1 && !n.classList.contains('arabic') && !n.classList.contains('big') && n.tagName !== 'EM') walk(n);
    }
  };
  walk(el);
  return [...el.querySelectorAll('.mask > span')];
}

/**
 * Returns show(id, t, tin, tout, stagger): fades a text block in at `tin` and out
 * by `tout`, sliding its words up one after another; Arabic is revealed right
 * to left and `.big` numerals slide in.
 */
export function textAnimator(ids) {
  const words = {};
  for (const id of ids) words[id] = maskWords(document.getElementById(id));
  return function show(id, t, tin, tout, stagger = 0.05) {
    const el = document.getElementById(id);
    const o = prog(t, tin, tin + 0.05) * (1 - prog(t, tout - 0.3, tout));
    el.style.opacity = o;
    if (o <= 0) return;
    words[id].forEach((w, i) => {
      const p = eOut(prog(t, tin + 0.1 + i * stagger, tin + 0.6 + i * stagger));
      w.style.transform = `translateY(${(1 - p) * 110}%)`;
    });
    const ar = el.querySelector('.arabic');
    if (ar) { const p = eInOut(prog(t, tin, tin + 1.6)); ar.style.clipPath = `inset(0 0 0 ${(1 - p) * 100}%)`; }
    const big = el.querySelector('.big');
    if (big) { const p = eOut(prog(t, tin, tin + 0.5)); big.style.transform = `translateX(${(1 - p) * -40}px)`; big.style.opacity = p; }
  };
}

/** Loads the verse texts built by ../build_ayat.py. */
export async function loadAyat() {
  return (await (await fetch('../ayat.json')).json()).ayat;
}
