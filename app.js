// Buffadamus site scripts. No tracking, no cookies.
(function () {
  const $ = (s, r = document) => r.querySelector(s);

  // ---------- Next Hotdog Index reading: next weekday 1:00 pm Pacific (US market close) ----------
  function nextCloseUTC(now) {
    // Find "now" in America/Los_Angeles, step to the next weekday 13:00 PT.
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, weekday: 'short' });
    const parts = Object.fromEntries(fmt.formatToParts(now).map(p => [p.type, p.value]));
    const ptNow = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute, +parts.second);
    const offset = ptNow - now.getTime(); // PT wall clock minus real UTC
    let d = new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day, 13, 0, 0));
    const isWeekend = x => [0, 6].includes(x.getUTCDay());
    if (ptNow >= d.getTime() || isWeekend(d)) {
      do { d = new Date(d.getTime() + 864e5); } while (isWeekend(d));
    }
    return new Date(d.getTime() - offset);
  }
  const cd = $('#countdown');
  if (cd) {
    const tick = () => {
      const now = new Date(), t = nextCloseUTC(now), ms = t - now;
      const h = Math.floor(ms / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3);
      cd.textContent = `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
      const when = $('#countdown-when');
      if (when) when.textContent = t.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' PT';
    };
    tick(); setInterval(tick, 1000);
  }

  // ---------- Hotdog Index data ----------
  const phrase = pct => pct >= 0
    ? `The stock market gained ${Math.abs(pct)}% today. That's ${Math.abs(pct)}% more hotdogs.`
    : `The stock market lost ${Math.abs(pct)}% today. That's ${Math.abs(pct)}% less hotdogs.`;

  async function loadJSON(url) {
    try { const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) throw 0; return await r.json(); }
    catch { return null; }
  }

  const latest = $('#hd-latest'), log = $('#hd-log');
  if (latest || log) loadJSON('data/hotdog.json').then(data => {
    const rows = (data && data.readings || []).slice().sort((a, b) => b.date.localeCompare(a.date));
    if (latest) {
      if (!rows.length) {
        latest.innerHTML = '<p class="muted">The first official reading arrives after the next market close. The Oracle is warming up the grill.</p>';
      } else {
        const r = rows[0], cls = r.pct >= 0 ? 'up' : 'down';
        latest.innerHTML = `<div class="hd-big"><span class="hd-num ${cls}">${r.pct >= 0 ? '+' : '-'}${Math.abs(r.pct)}%</span><span class="muted">${new Date(r.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
          <p style="font-size:21px;margin:6px 0">${phrase(r.pct)}</p>
          ${r.url ? `<p class="muted" style="font-size:15px"><a href="${r.url}" style="color:inherit">See the post on X</a> · Source: ${r.source || 'S&P 500 close-to-close'}</p>` : ''}`;
      }
    }
    if (log) {
      if (!rows.length) { log.innerHTML = '<tr><td colspan="3" class="empty">No readings yet. History begins with the first post.</td></tr>'; return; }
      const max = Math.max(...rows.map(r => Math.abs(r.pct)), 1);
      log.innerHTML = rows.map(r => `<tr>
        <td>${new Date(r.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
        <td style="width:45%"><div class="bar ${r.pct < 0 ? 'down' : ''}" style="width:${Math.abs(r.pct) / max * 100}%"></div></td>
        <td>${r.url ? `<a href="${r.url}">` : ''}${r.pct >= 0 ? '+' : '-'}${Math.abs(r.pct)}% ${r.pct >= 0 ? 'more' : 'less'} hotdogs${r.url ? '</a>' : ''}</td></tr>`).join('');
    }
  });

  // ---------- Prophecy archive ----------
  const roman = n => { const m = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]; let s=''; for (const [v,r] of m) while (n >= v) { s += r; n -= v; } return s; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const arch = $('#prophecies'), teaser = $('#prophecy-teaser');
  if (arch || teaser) loadJSON('data/prophecies.json').then(data => {
    const items = (data && data.prophecies || []).slice().sort((a, b) => b.n - a.n);
    const card = p => `<article class="card prophecy"><span class="num">${roman(p.n)}</span>
      <blockquote>${esc(p.text).replace(/ \/ /g, '<br>')}</blockquote>
      <div class="meta">${new Date(p.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}${p.context ? ' · ' + esc(p.context) : ''}${p.url ? ` · <a href="${p.url}">View on X</a>` : ''}</div></article>`;
    if (arch) arch.innerHTML = items.length ? items.map(card).join('') : '<p class="empty">The scrolls are blank. For now.</p>';
    if (teaser) teaser.innerHTML = items.slice(0, 3).map(card).join('') || '<p class="empty">The first prophecies are being inked.</p>';
  });

  // ---------- Ask the Oracle ----------
  const answers = [
    'The signs are clear. Unfortunately I am reading them upside down.',
    'Yes. Or no. The hotdog has not decided.',
    'I foresee great fortune. For someone. Possibly not you.',
    'Ask again after the market closes. I am on lunch.',
    'The stars say hold. My dog says sell. I trust the dog.',
    'In 1555 I would have said yes. A lot has changed.',
    'This is not financial advice. It is barely advice.',
    'The candle flickered. That means something. I will think about it.',
    'Buy the dip. Unless it dips more. Then buy that dip.',
    'The future is uncertain. My past is also uncertain. I lost my notes.',
    'My crystal ball shows a hotdog. It always shows a hotdog.',
    'Absolutely. I am wrong about 80% of the time, so this is exciting.',
    'The quill wrote "maybe" and then fell asleep.',
    'Patience. The prophecy is still loading.',
  ];
  const form = $('#oracle-form');
  if (form) {
    const out = $('#oracle-answer'), share = $('#oracle-share');
    let last = -1;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const q = $('#oracle-q').value.trim();
      let i; do { i = Math.floor(Math.random() * answers.length); } while (i === last && answers.length > 1); last = i;
      out.classList.remove('show');
      setTimeout(() => {
        out.textContent = answers[i];
        out.classList.add('show');
        const text = (q ? `I asked Buffadamus: "${q.slice(0, 90)}"\nHe said: ` : 'Buffadamus has spoken: ') + `"${answers[i]}"`;
        share.href = 'https://x.com/intent/post?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent('https://buffadamus.com');
        share.hidden = false;
      }, 250);
    });
  }

  // footer year
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
