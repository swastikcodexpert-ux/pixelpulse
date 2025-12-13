document.addEventListener('DOMContentLoaded', async () => {
  const includeEls = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(includeEls.map(async el => {
    const src = el.getAttribute('data-include');
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const html = await res.text();
      el.innerHTML = html;
      // execute scripts inside included content
      el.querySelectorAll('script').forEach(s => {
        const ns = document.createElement('script');
        if (s.src) ns.src = s.src;
        ns.textContent = s.textContent;
        document.body.appendChild(ns);
        ns.parentNode.removeChild(ns);
      });
    } catch (err) {
      console.error('Include failed:', src, err);
    }
  }));

  // Set year placeholders
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

  // Highlight current nav item if present
  try {
    const path = location.pathname.replace(/\\/g, '/');
    const current = path.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.endsWith(current) || (current === 'index.html' && href === '/index.html')) {
        a.classList.add('bg-slate-800');
      }
    });
  } catch (e) {
    // ignore
  }
});
