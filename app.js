// Buffadamus site scripts. No tracking, no cookies.
(function () {
  const $ = (s, r = document) => r.querySelector(s);

  // ---------- mobile menu ----------
  const nt = $('.navtoggle'), nv = $('#sitenav');
  if (nt && nv) {
    nt.addEventListener('click', () => { const o = nv.classList.toggle('open'); nt.setAttribute('aria-expanded', o); });
    nv.addEventListener('click', e => { if (e.target.tagName === 'A') { nv.classList.remove('open'); nt.setAttribute('aria-expanded', false); } });
  }

  // ---------- gentle fade-ins (content stays visible without JS) ----------
  const rv = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('in'));

  // ---------- Next Croissant Index reading: next weekday 1:00 pm Pacific (US market close) ----------
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

  // ---------- Croissant Index data ----------
  const phrase = pct => { const a = Math.abs(pct).toFixed(2); return pct >= 0
    ? `The stock market gained ${a}% today. That's ${a}% more croissants.`
    : `The stock market lost ${a}% today. That's ${a}% less croissants.`; };

  async function loadJSON(url) {
    try { const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) throw 0; return await r.json(); }
    catch { return null; }
  }

  const fmtD = (d, o) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', o);
  const latest = $('#hd-latest'), log = $('#hd-log'), chart = $('#ci-chart'), stats = $('#ci-stats');
  if (latest || log || chart || stats) loadJSON('data/croissant.json').then(data => {
    const asc = (data && data.readings || []).slice().sort((a, b) => a.date.localeCompare(b.date));
    // Croissant Basket: 100 croissants held at the base close, compounded daily.
    let basket = (data && data.base && data.base.croissants) || 100;
    asc.forEach(r => { basket = basket * (1 + r.pct / 100); r.basket = basket; });
    const rows = asc.slice().reverse();
    const sign = p => (p >= 0 ? '+' : '-') + Math.abs(p).toFixed(2) + '%';
    if (latest) {
      if (!rows.length) {
        latest.innerHTML = '<p class="muted">The first official reading arrives after the next market close. The oven is warming up.</p>';
      } else {
        const r = rows[0], cls = r.pct >= 0 ? 'up' : 'down';
        latest.innerHTML = `<div class="hd-big"><span class="hd-num ${cls}">${sign(r.pct)}</span><span class="muted">${fmtD(r.date, { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
          <p style="font-size:21px;margin:6px 0">${phrase(r.pct)}</p>
          <p class="muted" style="font-size:15px;margin:0">Croissant Basket: <b>${r.basket.toFixed(2)}</b> croissants${r.url ? ` · <a href="${r.url}" style="color:inherit">See the post on X</a>` : ''}</p>`;
      }
    }
    if (stats && asc.length) {
      const ups = asc.filter(r => r.pct >= 0).length, best = asc.reduce((a, b) => b.pct > a.pct ? b : a), worst = asc.reduce((a, b) => b.pct < a.pct ? b : a);
      let streak = 0; const dir = rows[0].pct >= 0; for (const r of rows) { if ((r.pct >= 0) === dir) streak++; else break; }
      const cell = (k, v, s) => `<div class="stat"><span class="k">${k}</span><span class="v">${v}</span><span class="s">${s}</span></div>`;
      stats.innerHTML = cell('Croissant Basket', rows[0].basket.toFixed(2), 'from 100 on Sep 30') +
        cell('Streak', `${streak} ${dir ? 'up' : 'down'}`, streak > 1 ? 'days in a row' : 'day') +
        cell('Best day', sign(best.pct), fmtD(best.date, { month: 'short', day: 'numeric' })) +
        cell('Worst day', sign(worst.pct), fmtD(worst.date, { month: 'short', day: 'numeric' })) +
        cell('Days up', `${ups} of ${asc.length}`, 'the dog takes credit');
    }
    if (chart && asc.length) {
      const W = 640, H = 150, pad = 12, n = asc.length, max = Math.max(...asc.map(r => Math.abs(r.pct)), 0.5);
      const bw = Math.max(4, (W - pad * 2) / n - 4), mid = H / 2;
      const bars = asc.map((r, i) => {
        const h = Math.abs(r.pct) / max * (mid - pad), x = pad + i * ((W - pad * 2) / n) + 2, y = r.pct >= 0 ? mid - h : mid;
        return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 1.5).toFixed(1)}" rx="2" class="${r.pct >= 0 ? 'b-up' : 'b-down'}"><title>${fmtD(r.date, { month: 'short', day: 'numeric' })}: ${sign(r.pct)}</title></rect>`;
      }).join('');
      chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Daily Croissant Index moves"><line x1="${pad}" x2="${W - pad}" y1="${mid}" y2="${mid}" class="axis"/>${bars}</svg>`;
    }
    if (log) {
      if (!rows.length) { log.innerHTML = '<tr><td colspan="4" class="empty">No readings yet. History begins with the first post.</td></tr>'; return; }
      const max = Math.max(...rows.map(r => Math.abs(r.pct)), 0.5);
      log.innerHTML = rows.map(r => `<tr>
        <td>${fmtD(r.date, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
        <td style="width:34%"><div class="bar ${r.pct < 0 ? 'down' : ''}" style="width:${Math.abs(r.pct) / max * 100}%"></div></td>
        <td>${r.url ? `<a href="${r.url}">` : ''}${sign(r.pct)} ${r.pct >= 0 ? 'more' : 'less'} croissants${r.url ? '</a>' : ''}</td>
        <td>${r.basket.toFixed(2)}</td></tr>`).join('');
    }
  });

  // ---------- Prophecy archive ----------
  const roman = n => { const m = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]; let s=''; for (const [v,r] of m) while (n >= v) { s += r; n -= v; } return s; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const arch = $('#prophecies'), teaser = $('#prophecy-teaser');
  if (arch || teaser) loadJSON('data/prophecies.json').then(data => {
    // Original quatrains only (never X posts or reposts). Schema: see docs/PROPHECY-STYLE.md
    const items = (data && data.prophecies || []).slice().sort((a, b) => (b.century - a.century) || (b.number - a.number));
    const verdicts = { pending: 'Pending', fulfilled: 'Fulfilled', muffed: 'Muffed it'};
    const fmtDate = d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const card = p => `<article class="card prophecy"><span class="num">${roman(p.century)}.${p.number}</span>
      ${p.title ? `<h3 style="margin-bottom:10px">${esc(p.title)}</h3>` : ''}
      <blockquote>${(p.lines || []).map(esc).join('<br>')}</blockquote>
      <div class="meta"><span class="verdict v-${esc(p.verdict || 'pending')}">${verdicts[p.verdict] || 'Pending'}</span>
        Prophesied ${fmtDate(p.date)}${p.resolves ? ` · Judged ${fmtDate(p.resolves)}` : ''}${p.about ? ` · ${esc(p.about)}` : ''}${p.verdict_note ? `<br><em>${esc(p.verdict_note)}</em>` : ''}
        <br><a class="share" target="_blank" rel="noopener" href="https://x.com/intent/post?text=${encodeURIComponent(`Prophecy ${roman(p.century)}.${p.number}${p.title ? ', ' + p.title : ''}:\n` + (p.lines || []).join('\n'))}&url=${encodeURIComponent('https://buffadamus.com/prophecies.html')}&via=Buffadamus">Share this prophecy on X</a></div></article>`;
    const sb = $('#scoreboard');
    if (sb) {
      const c = v => items.filter(p => (p.verdict || 'pending') === v).length, f = c('fulfilled'), m = c('muffed'), judged = f + m;
      const acc = judged ? Math.round(f / judged * 100) + '%' : 'TBD';
      sb.innerHTML = [['Fulfilled', f], ['Muffed it', m], ['Pending', c('pending')], ['Accuracy', acc]].map(([k, v]) => `<div class="stat"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('') +
        `<p class="muted sbnote">${judged ? `Sample size: ${judged}. Statisticians call this "not a sample". Buffadamus calls it a perfect record.` : 'No verdicts yet.'}</p>`;
    }
    if (arch) arch.innerHTML = items.length ? items.map(card).join('') : '<p class="empty">The scrolls are blank. For now.</p>';
    if (teaser) teaser.innerHTML = [...items.filter(p => (p.verdict || 'pending') !== 'pending').slice(0, 1), ...items.filter(p => (p.verdict || 'pending') === 'pending').slice(0, 1)].map(card).join('') || '<p class="empty">The first prophecies are being inked.</p>';
  });

  // ---------- Ask the Oracle ----------
  const answers = [
    'The signs are clear. Unfortunately I am reading them upside down.',
    'Yes. Or no. The croissant has not decided.',
    'I foresee great fortune. For someone. Possibly not you.',
    'Ask again after the market closes. I am on lunch.',
    'The stars say hold. My dog says sell. I trust the dog.',
    'In 1555 I would have said yes. A lot has changed.',
    'This is not financial advice. It is barely advice.',
    'The candle flickered. That means something. I will think about it.',
    'Buy the dip. Unless it dips more. Then buy that dip.',
    'The future is uncertain. My past is also uncertain. I lost my notes.',
    'My crystal ball shows a croissant. It always shows a croissant.',
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
        out.classList.remove('idle'); out.classList.add('show');
        const text = (q ? `I asked Buffadamus: "${q.slice(0, 90)}"\nHe said: ` : 'Buffadamus has spoken: ') + `"${answers[i]}"`;
        share.href = 'https://x.com/intent/post?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent('https://buffadamus.com') + '&via=Buffadamus';
        share.textContent = 'Share this prophecy on X';
      }, 250);
    });
  }


  // ---------- Ask the Dog ----------
  const dogs = [
    ['The dog barked twice.', 'Two barks. A strong yes. Or the mailman.'],
    ['The dog sat on the business section.', 'He is bearish on reading.'],
    ['The dog ate the croissant.', 'The Croissant Index has fallen 100%.'],
    ['The dog rolled over.', 'A reversal. Analysts will call it the Dog Roll.'],
    ['The dog stared at the wall for nine minutes.', 'He is also waiting for the Fed.'],
    ['The dog brought me one sock.', 'Half a position. He is hedging.'],
    ['The dog wagged at the green candles.', 'He likes the green ones. He is colorblind.'],
    ['The dog yawned.', 'Low volatility expected.'],
    ['The dog chased his own tail.', 'This is what day trading looks like.'],
    ['The dog fell asleep.', 'Hold.'],
    ['The dog buried something in the garden.', 'Gold, or a sandwich. Both are stores of value.'],
    ['The dog sneezed.', 'Bless him. The prophecy is unclear.'],
    ['The dog walked out of the room.', 'He does not answer questions about crypto.'],
    ['The dog looked at me, then at the treat jar.', 'There is a fee for this service.'],
    ['The dog howled at the screen.', 'Someone bought the top. It was me.'],
  ];
  const dform = $('#dog-form');
  if (dform) {
    const act = $('#dog-act'), read = $('#dog-read'), share = $('#dog-share'), face = $('#dog-face');
    let last = -1;
    dform.addEventListener('submit', e => {
      e.preventDefault();
      const q = $('#dog-q').value.trim();
      let i; do { i = Math.floor(Math.random() * dogs.length); } while (i === last && dogs.length > 1); last = i;
      act.classList.remove('show'); read.classList.remove('show'); face && face.classList.add('think');
      setTimeout(() => { face && face.classList.remove('think'); act.textContent = dogs[i][0]; act.classList.remove('idle'); act.classList.add('show'); }, 700);
      setTimeout(() => {
        read.textContent = 'Buffadamus reads it: ' + dogs[i][1]; read.classList.add('show');
        const text = (q ? `I asked Buffadamus's dog: "${q.slice(0, 80)}"\n` : '') + `${dogs[i][0]} ${dogs[i][1]}`;
        share.href = 'https://x.com/intent/post?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent('https://buffadamus.com/dog.html') + '&via=Buffadamus';
        share.textContent = "Share the dog's call on X";
      }, 1500);
    });
  }

  // ---------- Latest posts (static copies of live X posts) ----------
  const pl = $('#posts');
  if (pl) loadJSON('data/posts.json').then(data => {
    const ps = (data && data.posts || []).slice(0, 4);
    pl.innerHTML = ps.length ? ps.map(p => `<article class="post"><div class="who"><img src="avatar-engraved.jpg" alt="" width="40" height="40"><span><b>Buffadamus</b><br>@Buffadamus · ${fmtD(p.date, { month: 'short', day: 'numeric' })}</span></div>
      <p>${esc(p.text)}</p><a class="view" href="${esc(p.url)}" target="_blank" rel="noopener">View on X</a></article>`).join('')
      : '<p class="empty">The town crier is resting his voice. <a href="https://x.com/Buffadamus">See @Buffadamus on X</a>.</p>';
  });

  // ---------- Glossary ----------
  const gl = $('#glossary');
  if (gl) loadJSON('data/glossary.json').then(data => {
    const terms = (data && data.terms || []).slice().sort((a, b) => a.term.localeCompare(b.term));
    const draw = f => {
      const list = terms.filter(t => !f || (t.term + ' ' + t.def).toLowerCase().includes(f));
      gl.innerHTML = list.length ? list.map(t => `<div class="card term" id="${esc(t.term.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}"><h3>${esc(t.term)}</h3><p>${esc(t.def)}</p>
        <a class="share" target="_blank" rel="noopener" href="https://x.com/intent/post?text=${encodeURIComponent(t.term + ': ' + t.def)}&url=${encodeURIComponent('https://buffadamus.com/glossary.html')}&via=Buffadamus">Share</a></div>`).join('') : '<p class="empty">That word has not been invented yet.</p>';
    };
    draw('');
    const gq = $('#gloss-q'); if (gq) gq.addEventListener('input', () => draw(gq.value.trim().toLowerCase()));
  });

  // footer year
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
