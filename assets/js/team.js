/*
  Builds the Team page from content/team.js. To change people, edit content/team.js, not this file.
*/
(() => {
  const T = window.TEAM; if (!T) return;
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const EXT = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 11l6-6M6 5h5v5"/></svg>';
  const initials = n => n.replace(/^(Dr|Prof)\.?\s+/i, '').split(/\s+/).map(w => w[0]).slice(0, 2).join('');

  const person = p => {
    const img = p.photo
      ? `<img src="assets/img/team/${esc(p.photo)}" alt="Portrait of ${esc(p.name)}" loading="lazy">`
      : `<span class="mono">${esc(initials(p.name))}</span>`;
    const ph = p.link
      ? `<a class="ph" href="${esc(p.link)}" target="_blank" rel="noopener" aria-label="${esc(p.name)}, ${esc(p.linkLabel || 'profile')}">${img}<span class="ext">${EXT}</span></a>`
      : `<div class="ph">${img}</div>`;
    const lnk = p.link ? `<a class="lnk" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.linkLabel || 'Profile')} ${EXT}</a>` : '';
    return `<div class="person rv">${ph}<h4>${esc(p.name)}</h4><p class="role">${esc(p.role)}</p>${p.focus ? `<p class="focus">${esc(p.focus)}</p>` : ''}${lnk}</div>`;
  };
  const layout = n => n === 3 ? ' three' : n === 5 ? ' five' : '';

  const groups = document.getElementById('team-groups');
  if (groups) groups.innerHTML = T.groups.map((g, i) => `
    <div class="group"${i === 0 ? ' style="margin-top:0"' : ''}>
      <h3>${esc(g.title)}</h3>
      <div class="people${layout(g.people.length)}">${g.people.map(person).join('')}</div>
    </div>`).join('');

  const count = T.groups.reduce((n, g) => n + g.people.length, 0);
  const s = T.stats || {};
  const stats = document.getElementById('team-stats');
  if (stats) stats.innerHTML = `
    <p class="k rv">${esc(s.summary)}</p>
    <div class="num rv"><b data-count="${count}">${count}</b><span>People on the team</span></div>
    <div class="num rv"><b data-count="${+s.institutions || 0}">${+s.institutions || 0}</b><span>Partner institutions</span></div>
    <div class="num rv"><b data-count="${+s.countries || 0}">${+s.countries || 0}</b><span>Countries</span></div>`;
})();
