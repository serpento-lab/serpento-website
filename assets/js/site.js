/*
  Shared by every page: builds the menu and footer from content/site.js,
  then runs the small scroll effects (solid menu bar, fade-ins, counters).
  You should not need to edit this file to change text; edit content/site.js instead.
*/
(() => {
  const S = window.SITE || {};
  const page = document.body.dataset.page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const LOGO = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M23 9.2A7 7 0 1 0 16 16a7 7 0 1 1-7 6.8" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="23" cy="9.2" r="2.2" fill="var(--glow)"/></svg>';
  const nav = S.nav || [];
  const cur = item => item.page === page ? ' aria-current="page"' : '';

  /* ---------- menu ---------- */
  const navEl = document.getElementById('site-nav');
  if (navEl) {
    navEl.outerHTML = `
<nav class="nav" id="nav" aria-label="Main">
  <div class="wrap">
    <a class="logo" href="index.html" aria-label="${esc(S.name)} home">${LOGO}${esc(S.name)}</a>
    <div class="links">
      ${nav.map(n => n.button
        ? `<a class="btn" href="${n.href}"${cur(n)}><span>${esc(n.label)}</span></a>`
        : `<a href="${n.href}"${cur(n)}>${esc(n.label)}</a>`).join('\n      ')}
    </div>
    <button class="menu-btn" id="menuOpen" aria-label="Open menu" aria-expanded="false" aria-controls="menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8h18M3 16h18"/></svg>
    </button>
  </div>
</nav>
<div class="sheet" id="menu" hidden>
  <div class="row"><span class="logo">${esc(S.name)}</span>
    <button class="menu-btn" id="menuClose" aria-label="Close menu" style="display:block"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>
  ${nav.map(n => `<a class="big" href="${n.href}"${cur(n)}>${esc(n.label)}</a>`).join('')}
</div>`;
    const menu = document.getElementById('menu'), openB = document.getElementById('menuOpen');
    openB.onclick = () => { menu.hidden = false; openB.setAttribute('aria-expanded', 'true'); };
    const closeMenu = () => { menu.hidden = true; openB.setAttribute('aria-expanded', 'false'); };
    document.getElementById('menuClose').onclick = closeMenu;
    addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- footer ---------- */
  const footEl = document.getElementById('site-footer');
  if (footEl) {
    footEl.outerHTML = `
<footer>
  <div class="wrap">
    <div class="ft">
      <div><span class="logo">${LOGO}${esc(S.name)}</span><p>${esc(S.tagline || '')}</p></div>
      <div><h5>Explore</h5><ul>${nav.map(n => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}</ul></div>
      <div><h5>Contact</h5><ul><li><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></li><li>${esc(S.location || '')}</li></ul></div>
    </div>
    <div class="legal">
      <span>© ${new Date().getFullYear()} ${esc(S.legalName || S.name)}. All rights reserved.</span>
      <span>${esc(S.disclaimer || '')}</span>
    </div>
  </div>
</footer>`;
  }

  /* ---------- fill [data-site="email"] etc. anywhere on a page ---------- */
  document.querySelectorAll('[data-site]').forEach(el => { el.textContent = S[el.dataset.site] || ''; });

  /* ---------- menu bar turns solid once the dark top area has scrolled away ---------- */
  const navBar = document.getElementById('nav');
  const top = document.querySelector('[data-dark-top]');
  const navState = () => navBar && navBar.classList.toggle('solid', !top || top.getBoundingClientRect().bottom < 80);
  addEventListener('scroll', navState, { passive: true }); navState();

  /* ---------- fade-ins ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });

  /* ---------- counters ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count; if (reduce) return;
    const t0 = performance.now(); el.textContent = '0';
    const step = t => { const p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* ---------- in-page jump links (e.g. the research sub-menu) ---------- */
  document.addEventListener('click', e => {
    const j = e.target.closest('[data-jump]');
    if (!j) return;
    const el = document.getElementById(j.dataset.jump); if (!el) return;
    e.preventDefault();
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - 150, behavior: reduce ? 'instant' : 'smooth' });
  });
})();
