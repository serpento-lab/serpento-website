/*
  Contact page: the copy-email button and the form.
  The form sends to SITE.formEndpoint (content/site.js) when one is set, for example a Formspree form.
  Without one, it asks people to email instead.
*/
(() => {
  const S = window.SITE || {};
  const mail = document.getElementById('mail'), copy = document.getElementById('copy');
  if (mail && copy) copy.addEventListener('click', () => {
    const sel = () => { const r = document.createRange(); r.selectNodeContents(mail); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(mail.textContent).then(() => { copy.textContent = 'Copied'; }, () => { sel(); copy.textContent = 'Press Ctrl+C'; }); }
    catch (_) { sel(); copy.textContent = 'Press Ctrl+C'; }
    setTimeout(() => copy.textContent = 'Copy', 2000);
  });

  const form = document.getElementById('form'), note = document.getElementById('note');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { note.textContent = 'Please add your name, a valid email and a message.'; return; }
    if (!S.formEndpoint) { note.textContent = `Thanks. This form is not connected yet, so please email ${S.email} directly.`; return; }
    const btn = form.querySelector('button[type="submit"]'); btn.disabled = true; note.textContent = 'Sending…';
    try {
      const r = await fetch(S.formEndpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(r.status);
      form.reset(); note.textContent = 'Thank you. Your message has been sent and we will reply by email.';
    } catch (_) {
      note.textContent = `Sorry, the message could not be sent. Please email ${S.email} directly.`;
    } finally { btn.disabled = false; }
  });
})();
