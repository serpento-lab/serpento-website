/*
  Home page: "the access problem" scroll animation.
  Three instruments try to reach the same target through packed tissue:
    01 a rigid instrument (straight line, pushes tissue aside),
    02 a passive flexible instrument (buckles, cannot hold a path),
    03 Serpento (follows a curved path around tissue and holds steady).
  Concept only: no mechanism or geometry of the device is shown.
  Drawn in the same lit-dot style as the hero film. Scene units: 1000 x 900.
*/
(() => {
  const sec = document.getElementById('s-concept');
  const cv = document.getElementById('concept');
  if (!sec || !cv) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = cv.getContext('2d');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
  const ease = k => k * k * (3 - 2 * k);
  const lerp = (a, b, k) => a + (b - a) * k;

  /* ---------- scene ---------- */
  const P0 = [500, 40], T = [650, 760];
  const BLOBS = [[368,666,89],[629,508,90],[255,521,74],[427,391,54],[511,302,63],[262,299,73],[532,693,50],[708,667,58],[370,205,54],[711,222,59],[863,206,50],[763,367,76],[770,792,64],[128,648,64],[451,495,48],[826,538,92],[119,815,49],[483,793,50],[870,688,47],[294,797,47],[92,307,50],[573,192,48],[131,463,56],[892,797,54],[908,353,49],[626,323,50],[144,210,50]];
  const TINTS = [[226,221,214],[221,206,203],[208,213,224],[230,219,204],[214,222,226],[218,210,220]];
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const blobs = BLOBS.map(([x, y, r], i) => ({
    x, y, r, dx: 0, dy: 0, red: 0,
    a1: .05 + rnd() * .06, a2: .03 + rnd() * .05, p1: rnd() * 6.28, p2: rnd() * 6.28, sq: .9 + rnd() * .18, rot: rnd() * 3.14,
    tint: TINTS[i % TINTS.length], spr: null, sprRed: null,
  }));
  const shapeR = (b, ang) => b.r * (1 + b.a1 * Math.sin(2 * ang + b.p1) + b.a2 * Math.sin(3 * ang + b.p2));

  // Serpento path (Catmull-Rom through these points), sampled by arc length
  const SPTS = [[500,40],[500,170],[390,300],[330,430],[420,560],[580,620],[650,760]];
  const catmull = (pts, n) => {
    const P = [pts[0], ...pts, pts[pts.length - 1]], out = [];
    for (let i = 1; i < P.length - 2; i++) for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t, p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
      out.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
    out.push(pts[pts.length - 1]); return out;
  };
  const withLen = pts => { const c = [0]; for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, c, L: c[c.length - 1] }; };
  const SERP = withLen(catmull(SPTS, 24));
  const prefix = (path, L) => {
    const { pts, c } = path; if (L <= 0) return [pts[0]];
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      if (c[i] <= L) { out.push(pts[i]); continue; }
      const k = (L - c[i - 1]) / (c[i] - c[i - 1]); out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]); break;
    }
    return out;
  };

  // passive flexible instrument: drops straight down until it meets tissue, then buckles sideways
  const CONTACT = 196, EXTRA = 64, WALL = 126;
  const passive = (L, t) => {
    const pts = [], D = Math.min(L, CONTACT), e = Math.max(0, L - CONTACT), span = CONTACT - (WALL - P0[1]);
    const A = Math.sqrt(4 * span * e) / Math.PI;               // half-sine bow (inside the body) whose length matches the extra pushed in
    const shake = e > 0 ? Math.sin(t * 7.3) * 4 + Math.sin(t * 3.1) * 3 : 0;
    for (let i = 0; i <= 48; i++) {
      const y = P0[1] + D * i / 48;
      const s = clamp((y - WALL) / span, 0, 1);
      const bow = -A * Math.sin(Math.PI * s) * (1 + .15 * Math.sin(Math.PI * 2 * s + t * 2.2)) + A * .35 * Math.sin(Math.PI * 2 * s) ;
      pts.push([P0[0] + bow + shake * s * s, y]);
    }
    return pts;
  };

  /* ---------- sizing + sprites ---------- */
  let W = 0, H = 0, S = 1, OX = 0, OY = 0, DPR = 1;
  const X = x => OX + x * S, Y = y => OY + y * S;
  const makeSprite = (b, red) => {
    const pad = 1.3, size = Math.ceil(b.r * 2 * pad * S * DPR) + 4, c = document.createElement('canvas');
    c.width = c.height = size; const g = c.getContext('2d'), mid = size / 2, k = S * DPR;
    const L = [-.45, -.58, .68], step = 8.6;
    for (let gy = -b.r * pad; gy <= b.r * pad; gy += step) for (let gx = -b.r * pad; gx <= b.r * pad; gx += step) {
      const j = Math.sin(gx * 12.9898 + gy * 78.233 + b.x) * 43758.5453, jx = (j - Math.floor(j) - .5) * 3.4, jy = (Math.sin(j) * .5) * 3.4;
      let x = gx + jx, y = gy + jy;
      const xr = (x * Math.cos(b.rot) + y * Math.sin(b.rot)) / b.sq, yr = (-x * Math.sin(b.rot) + y * Math.cos(b.rot));
      const ang = Math.atan2(yr, xr), d = Math.hypot(xr, yr), rr = shapeR(b, ang);
      if (d > rr) continue;
      const nd = d / rr, z = Math.sqrt(Math.max(0, 1 - nd * nd)), nx = x / rr, ny = y / rr;
      const lam = Math.max(0, nx * L[0] + ny * L[1] + z * L[2]);
      const br = .16 + .84 * lam, rim = Math.pow(nd, 6) * .25;
      const col = red ? [255, 92 + 40 * br, 74 + 30 * br] : b.tint;
      g.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${clamp(br + rim, .1, 1).toFixed(3)})`;
      g.beginPath(); g.arc(mid + x * k, mid + y * k, (.55 + 1.45 * br) * k, 0, 6.2832); g.fill();
    }
    return c;
  };
  const resize = () => {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight; cv.width = W * DPR; cv.height = H * DPR;
    S = Math.min(W / 1000, H / 900); OX = (W - 1000 * S) / 2; OY = (H - 900 * S) / 2;
    blobs.forEach(b => { b.spr = makeSprite(b, false); b.sprRed = makeSprite(b, true); });
    // body wall as a dotted line, with the entry port
    wallDots = [];
    for (let x = 30; x <= 970; x += 9) if (Math.abs(x - 500) > 16) wallDots.push([x, 112 + 6 * Math.sin(x * .011) + 2 * Math.sin(x * .05)]);
  };
  let wallDots = [];

  /* ---------- drawing ---------- */
  const nearest = (pts, px, py) => {
    let best = 1e9, bx = 0, by = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [cx, cy] = pts[i + 1], dx = cx - ax, dy = cy - ay, l2 = dx * dx + dy * dy || 1e-9;
      const t = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1), qx = ax + t * dx, qy = ay + t * dy, d = Math.hypot(px - qx, py - qy);
      if (d < best) { best = d; bx = qx; by = qy; }
    }
    if (pts.length === 1) { bx = pts[0][0]; by = pts[0][1]; best = Math.hypot(px - bx, py - by); }
    return [best, bx, by];
  };
  const tool = (pts, col, glow, width = 10) => {
    if (pts.length < 2) return;
    ctx.lineCap = ctx.lineJoin = 'round';
    const path = () => { ctx.beginPath(); ctx.moveTo(X(pts[0][0]), Y(pts[0][1])); for (let i = 1; i < pts.length; i++) ctx.lineTo(X(pts[i][0]), Y(pts[i][1])); };
    ctx.save();
    path(); ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = (width + 5) * S; ctx.stroke();
    if (glow > 0) { ctx.shadowColor = `rgba(94,208,216,${.85 * glow})`; ctx.shadowBlur = 26 * S * glow; }
    path(); ctx.strokeStyle = col; ctx.lineWidth = width * S; ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.translate(-1.6 * S, -1.6 * S); path(); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2.2 * S; ctx.stroke();
    ctx.restore();
    const [tx, ty] = pts[pts.length - 1];
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X(tx), Y(ty), width * .62 * S, 0, 6.2832); ctx.fill();
  };
  const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`;

  let sp = 0, t0 = performance.now();
  const progress = () => { if (reduce) return 1; const r = sec.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
  const steps = [...sec.querySelectorAll('.cstage')], tag = document.getElementById('conceptTag'), bar = document.getElementById('cBar');
  const TAGS = ['01 · Rigid instrument', '02 · Flexible instrument', '03 · Serpento'];
  let lastStep = -1;

  const draw = now => {
    const t = (now - t0) / 1000;
    sp += (progress() - sp) * (reduce ? 1 : .12);
    const p = sp;
    // timeline
    const rigidF = ease(seg(p, .06, .27)) * (1 - ease(seg(p, .33, .38)));
    const passL = (CONTACT + EXTRA) * ease(seg(p, .41, .61)) * (1 - ease(seg(p, .64, .69)));
    const serpF = ease(seg(p, .72, .9)), lock = ease(seg(p, .9, .97));
    const step = p < .395 ? 0 : p < .705 ? 1 : 2;
    if (step !== lastStep) {
      lastStep = step; steps.forEach((s, i) => s.classList.toggle('on', i === step));
      if (tag) tag.textContent = TAGS[step];
    }
    if (bar) bar.style.setProperty('--p', (p * 100).toFixed(1) + '%');

    // current instrument
    let pts = null, kind = 0;
    if (rigidF > .001) { pts = [P0, [lerp(P0[0], T[0], rigidF), lerp(P0[1], T[1], rigidF)]]; kind = 1; }
    else if (passL > 1) { pts = passive(passL, t); kind = 2; }
    else if (serpF > .001) { pts = prefix(SERP, SERP.L * serpF); kind = 3; }

    // tissue response
    blobs.forEach(b => {
      let tx = 0, ty = 0, tr = 0;
      if (pts && kind !== 3) {
        const [d, qx, qy] = nearest(pts, b.x, b.y), pen = b.r * 1.04 + 7 - d;
        if (pen > 0) {
          const ux = (b.x - qx) / (d || 1), uy = (b.y - qy) / (d || 1), k = kind === 1 ? 1.02 : .55;
          tx = ux * pen * k; ty = uy * pen * k; if (kind === 1) tr = clamp(pen / 20, 0, 1);
        }
      }
      b.dx += (tx - b.dx) * .22; b.dy += (ty - b.dy) * .22; b.red += (tr - b.red) * (tr > b.red ? .3 : .06);
    });

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const fade = reduce ? 1 : ease(seg(p, 0, .05)) * .7 + .3;

    // body wall + port
    ctx.fillStyle = 'rgba(140,151,166,.55)';
    wallDots.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(X(x), Y(y), 1.6 * S, 0, 6.2832); ctx.fill(); });
    ctx.strokeStyle = 'rgba(140,151,166,.8)'; ctx.lineWidth = 2 * S;
    ctx.strokeRect(X(489), Y(70), 22 * S, 54 * S);

    // tissue
    ctx.globalAlpha = fade;
    blobs.forEach(b => {
      const w = b.spr.width / DPR, x = X(b.x + b.dx) - w / 2, y = Y(b.y + b.dy) - w / 2;
      ctx.globalAlpha = fade * .92; ctx.drawImage(b.spr, x, y, w, w);
      if (b.red > .01) { ctx.globalAlpha = fade * b.red; ctx.drawImage(b.sprRed, x, y, w, w); }
    });
    ctx.globalAlpha = 1;

    // target
    const reached = kind === 3 ? lock : 0, pulse = .5 + .5 * Math.sin(t * 2.4);
    const tg = ctx.createRadialGradient(X(T[0]), Y(T[1]), 0, X(T[0]), Y(T[1]), (34 + 26 * reached) * S);
    tg.addColorStop(0, `rgba(94,208,216,${.55 + .45 * reached})`); tg.addColorStop(1, 'rgba(94,208,216,0)');
    ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(X(T[0]), Y(T[1]), (34 + 26 * reached) * S, 0, 6.2832); ctx.fill();
    ctx.fillStyle = `rgba(94,208,216,${.75 + .25 * reached})`;
    for (let i = 0; i < 16; i++) { const a = i / 16 * 6.2832 + t * .4; ctx.beginPath(); ctx.arc(X(T[0] + Math.cos(a) * 17), Y(T[1] + Math.sin(a) * 17), 1.7 * S, 0, 6.2832); ctx.fill(); }
    if (reached > .05) for (let k = 0; k < 2; k++) {
      const ph = (t * .6 + k * .5) % 1;
      ctx.strokeStyle = `rgba(94,208,216,${(1 - ph) * .7 * reached})`; ctx.lineWidth = 1.5 * S;
      ctx.beginPath(); ctx.arc(X(T[0]), Y(T[1]), (20 + ph * 46) * S, 0, 6.2832); ctx.stroke();
    }
    ctx.font = `500 ${Math.max(10, 13 * S)}px "Red Hat Mono", ui-monospace, monospace`;
    ctx.fillStyle = 'rgba(140,151,166,.9)'; ctx.textAlign = 'center'; ctx.fillText('TARGET', X(T[0]), Y(T[1] + 44)); ctx.textAlign = 'start';

    // instrument
    if (kind === 1) tool(pts, 'rgb(214,221,229)', 0);
    if (kind === 2) tool(pts, 'rgb(214,221,229)', 0, 8);
    if (kind === 3) tool(pts, mix([214, 221, 229], [94, 208, 216], lock), lock);
    if (kind === 1 && rigidF > .97) { // impact mark at the target
      ctx.strokeStyle = `rgba(255,92,74,${.6 + .3 * pulse})`; ctx.lineWidth = 1.5 * S;
      ctx.beginPath(); ctx.arc(X(T[0]), Y(T[1]), 24 * S, 0, 6.2832); ctx.stroke();
    }
  };

  const loop = now => {
    const r = sec.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) draw(now);
    requestAnimationFrame(loop);
  };
  resize(); addEventListener('resize', resize);
  if (reduce) { draw(performance.now()); steps.forEach(s => s.classList.add('on')); }
  else requestAnimationFrame(loop);
})();
