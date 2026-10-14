/*
  Home page only:
  - the hero film (frames rendered in Blender, scrubbed as you scroll)
  - the mission statement whose words brighten as you read
  - the "approach" list that highlights the stage you are reading
  Film frames live in assets/film/desktop and assets/film/mobile; assets/film/film.js says how many there are.
*/
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k, ease = k => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };

  /* ---------- mission statement ---------- */
  const st = document.getElementById('statement');
  if (st) {
    st.innerHTML = st.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    const words = [...st.querySelectorAll('.w')];
    const readWords = () => {
      const r = st.getBoundingClientRect(), vh = innerHeight;
      const k = clamp((vh * .82 - r.top) / (r.height + vh * .35), 0, 1) * words.length;
      words.forEach((w, i) => w.style.opacity = reduce ? 1 : clamp(k - i + 1, .2, 1));
    };
    addEventListener('scroll', readWords, { passive: true }); readWords();
  }

  /* ---------- approach stages ---------- */
  const stages = [...document.querySelectorAll('.stage')], bar = document.getElementById('apBar'), cnt = document.getElementById('apCount');
  if (stages.length) {
    const total = String(stages.length).padStart(2, '0');
    const stageState = () => {
      const line = innerHeight * .55; let idx = 0;
      stages.forEach((s, i) => { if (s.getBoundingClientRect().top < line) idx = i; });
      stages.forEach((s, i) => s.classList.toggle('on', i === idx));
      bar.style.setProperty('--p', ((idx + 1) / stages.length * 100) + '%');
      cnt.textContent = `Stage ${String(idx + 1).padStart(2, '0')} of ${total}`;
    };
    addEventListener('scroll', stageState, { passive: true }); stageState();
  }

  /* ---------- hero film ---------- */
  const hero = document.querySelector('.hero'), pin = hero && hero.querySelector('.hero-pin');
  const film = document.getElementById('film');
  if (!hero || !film) return;
  const progress = () => { if (reduce) return 1; const r = hero.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
  const setP = () => { const p = progress(); pin.style.setProperty('--p', p.toFixed(3)); pin.classList.toggle('pre', p < .42); };
  addEventListener('scroll', setP, { passive: true }); setP();

  const FILM = window.FILM || {};
  const portrait = innerWidth / innerHeight < .9 && FILM.mobile;
  const variant = portrait ? 'mobile' : 'desktop';
  const N = FILM[variant] || 0;
  if (!N) return;
  const src = i => `assets/film/${variant}/f_${String(i).padStart(3, '0')}.webp`;
  const fx = film.getContext('2d');
  const imgs = new Array(N);
  const load = i => { if (imgs[i] !== undefined) return; imgs[i] = null; const im = new Image(); im.decoding = 'async'; im.onload = () => { imgs[i] = im; }; im.src = src(i); };
  // first and last frame, then a coarse pass across the whole film, then fill in the gaps
  load(0); load(N - 1);
  const order = [];
  for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < N; i += step) order.push(i);
  let qi = 0; const pump = () => { for (let k = 0; k < 6 && qi < order.length; k++) load(order[qi++]); if (qi < order.length) setTimeout(pump, 40); };
  pump();

  let fp = progress(), fW = 0, fH = 0;
  const size = () => { const d = Math.min(devicePixelRatio || 1, 2); fW = film.clientWidth; fH = film.clientHeight; film.width = fW * d; film.height = fH * d; fx.setTransform(d, 0, 0, d, 0, 0); };
  size(); addEventListener('resize', size);
  const nearest = i => { if (imgs[i]) return imgs[i]; for (let d = 1; d < N; d++) { if (imgs[i - d]) return imgs[i - d]; if (imgs[i + d]) return imgs[i + d]; } return null; };
  const draw = (im, a) => {
    const s = Math.max(fW / im.naturalWidth, fH / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
    const ax = !portrait && fW / fH < 1 ? .62 : .5; // keep the table in view on narrow windows
    fx.globalAlpha = a; fx.drawImage(im, (fW - w) * ax, (fH - h) / 2, w, h);
  };
  const frame = () => {
    if (hero.getBoundingClientRect().bottom > 0) {
      fp += (progress() - fp) * .14;
      const f = fp * (N - 1), i0 = Math.floor(f), i1 = Math.min(N - 1, i0 + 1), t = f - i0;
      const a = nearest(i0), b = nearest(i1);
      fx.globalAlpha = 1; fx.fillStyle = '#05080c'; fx.fillRect(0, 0, fW, fH);
      if (a) draw(a, 1);
      if (b && b !== a && t > .01) draw(b, t);
      fx.globalAlpha = 1;
      film.style.opacity = lerp(1, fW / fH < 1 ? .45 : .55, ease((fp - .45) / .35)).toFixed(3);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
