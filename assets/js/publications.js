/*
  Builds the publication list on the Research page from content/publications.js.
  To add a paper, edit content/publications.js, not this file.
*/
(() => {
  const list = document.getElementById('pub-list');
  if (!list) return;
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pubs = (window.PUBLICATIONS || []).slice().sort((a, b) => (+b.year || 0) - (+a.year || 0));
  const html = pubs.map(p => {
    const title = p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title);
    const by = [p.authors, p.venue].filter(Boolean).map(esc).join(' · ');
    return `<article class="pub rv"><span class="yr">${esc(p.year)}</span><div><h3>${title}</h3>${by ? `<p class="by">${by}</p>` : ''}</div>${p.type ? `<span class="chip">${esc(p.type)}</span>` : '<span></span>'}</article>`;
  });
  if (window.PUBLICATIONS_NOTE) html.push(`<article class="pub soon rv"><span class="yr">Upcoming</span><div><p>${esc(window.PUBLICATIONS_NOTE)}</p></div></article>`);
  list.innerHTML = html.join('');
})();
