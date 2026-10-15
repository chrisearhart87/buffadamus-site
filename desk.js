// Buffadamus Trading Desk. Reads data/plays.json, data/desk.json, data/croissant.json. No tracking.
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const get = u => fetch(u, { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null);
  const money = (n, d = 2) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const cro = n => Number(n).toLocaleString('en-US', { maximumFractionDigits: 1 });
  const sgn = (n, unit = '%') => (n > 0 ? '+' : n < 0 ? '-' : '') + Math.abs(n).toFixed(2) + unit;
  const sgnC = n => (n > 0 ? '+' : n < 0 ? '-' : '') + cro(Math.abs(n)) + ' 🥐';
  const cls = n => n > 0 ? 'up' : n < 0 ? 'down' : '';
  const fmtD = (d, o = { weekday: 'short', month: 'short', day: 'numeric' }) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', o);
  const statusLabel = p => ({
    pending: `Fills at the open, ${fmtD(p.session)}`, open: 'Open', closed: 'Closed', void: 'Void - no trade'
  }[p.status] || p.status);
  const levelFmt = (p, v) => (p.kind === 'option' ? '$' + Number(v).toFixed(2) : money(v));

  function bracketBar(p) {
    const lo = Math.min(p.stop, p.target), hi = Math.max(p.stop, p.target), pad = (hi - lo) * 0.08;
    const pos = v => Math.max(0, Math.min(100, (v - (lo - pad)) / (hi - lo + 2 * pad) * 100));
    const cur = p.mark ? p.mark.price : p.exit ? p.exit.price : p.entry ? p.entry.price : p.ref_price;
    return `<div class="bracket" aria-hidden="true">
      <div class="zone loss" style="left:${pos(lo)}%;width:${pos(p.ref_price) - pos(lo)}%"></div>
      <div class="zone gain" style="left:${pos(p.ref_price)}%;width:${pos(hi) - pos(p.ref_price)}%"></div>
      ${[['Stop', p.stop], ['Ref', p.ref_price], ['Target', p.target]].map(([k, v]) => `<span class="tick" style="left:${pos(v)}%"><b>${k}</b>${levelFmt(p, v)}</span>`).join('')}
      <span class="now" style="left:${pos(cur)}%" title="Latest ${levelFmt(p, cur)}"></span></div>`;
  }

  function playCard(p, bank) {
    const stake = p.kind === 'option' ? bank.stake_option : bank.stake_shares;
    const what = p.kind === 'option' ? `Buy ${p.option.type}s · ${money(p.option.strike)} strike · exp ${fmtD(p.option.expiry, { month: 'short', day: 'numeric', year: 'numeric' })}` : `${p.side === 'short' ? 'Short' : 'Long'} shares`;
    const result = p.status === 'pending' ? '' : `<div class="result ${cls(p.croissants)}">
        <span>${p.status === 'open' ? 'Open P&L' : 'Result'}</span><b>${sgn(p.ret_pct || 0)}</b><b>${sgnC(p.croissants || 0)}</b>
        ${p.entry ? `<small>Entry ${levelFmt(p, p.entry.price)} on ${fmtD(p.entry.date)}${p.exit ? ` · Exit ${levelFmt(p, p.exit.price)} on ${fmtD(p.exit.date)}: ${esc(p.exit.reason)}` : p.mark ? ` · Last ${levelFmt(p, p.mark.price)} (session ${p.mark.session} of ${p.max_days})` : ''}</small>` : ''}
        ${p.spy_ret_pct != null ? `<small>SPY over the same days: ${sgn(p.spy_ret_pct)} · vs SPY ${sgnC(p.vs_spy_croissants)}</small>` : ''}</div>`;
    const share = `https://x.com/intent/post?text=${encodeURIComponent(`Buffadamus play ${p.id}: ${p.side === 'short' ? 'short' : 'long'} $${p.ticker}. Stop ${levelFmt(p, p.stop)}, target ${levelFmt(p, p.target)}. Paper trade, not advice.`)}&url=${encodeURIComponent('https://buffadamus.com/desk.html')}&via=Buffadamus`;
    return `<article class="card parch play">
      <div class="play-top"><span class="pill s-${esc(p.status)}">${esc(statusLabel(p))}</span><span class="muted">Play ${esc(p.id)} · published ${esc(p.published)}</span></div>
      <div class="play-head"><div><h2 class="tk">$${esc(p.ticker)}</h2><p class="muted" style="margin:0">${esc(p.name || '')}</p></div>
        <div class="play-hl"><p class="kicker" style="color:#8a6a28;margin:0">${esc(what)}</p><h3 style="margin:2px 0 0">${esc(p.headline)}</h3></div></div>
      <div class="levels">
        <div><span>Entry</span><b>${esc(p.entry_rule)}</b></div>
        <div><span>Stop loss</span><b class="down">${levelFmt(p, p.stop)}</b></div>
        <div><span>Take profit</span><b class="up">${levelFmt(p, p.target)}</b></div>
        <div><span>Reward : risk</span><b>${Number(p.rr).toFixed(2)} : 1</b></div>
        <div><span>Max hold</span><b>${p.max_days} sessions</b></div>
        <div><span>Stake</span><b>${cro(stake)} 🥐 <small>(${money(stake * bank.croissant_usd, 0)} paper)</small></b></div>
      </div>
      ${bracketBar(p)}
      ${result}
      <div class="grid2" style="gap:18px;margin-top:8px">
        <div><h4>Why</h4><ul>${(p.thesis || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
          <h4>What could go wrong</h4><ul>${(p.risks || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
        <div><h4>Key numbers</h4><dl class="facts">${Object.entries(p.facts || {}).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
          ${p.dog ? `<p class="dogline">🐕 ${esc(p.dog)}</p>` : ''}</div>
      </div>
      <p class="fineprint">The stop and target are written in before the open, so the result depends on prices, not timing. Paper trade for entertainment, not financial advice. Sources: ${esc((p.sources || []).join('; '))}.
        <a href="${share}" target="_blank" rel="noopener">Share on X</a></p>
    </article>`;
  }

  function equitySVG(eq, start) {
    const pts = [{ d: 'start', bank: start }].concat(eq || []);
    if (pts.length < 2) return '<p class="empty">The curve starts when the first play closes.</p>';
    const W = 640, H = 170, p = 14, ys = pts.map(x => x.bank), mn = Math.min(...ys, start), mx = Math.max(...ys, start), rg = mx - mn || 1;
    const X = i => p + i * (W - 2 * p) / (pts.length - 1), Y = v => H - p - (v - mn) / rg * (H - 2 * p);
    const line = pts.map((x, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(x.bank).toFixed(1)}`).join(' ');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Croissant Bank over time"><line x1="${p}" x2="${W - p}" y1="${Y(start)}" y2="${Y(start)}" class="axis"/><path d="${line}" class="eq ${ys[ys.length - 1] >= start ? 'up' : 'down'}"/>${pts.map((x, i) => `<circle cx="${X(i)}" cy="${Y(x.bank)}" r="3" class="dot"><title>${x.d}: ${cro(x.bank)} croissants</title></circle>`).join('')}</svg>`;
  }

  function ledger(plays) {
    if (!plays.length) return '<tr><td colspan="8" class="empty">No plays yet.</td></tr>';
    return plays.slice().reverse().map(p => `<tr>
      <td>${esc(p.id)}</td><td>${fmtD(p.session, { month: 'short', day: 'numeric' })}</td>
      <td><b>$${esc(p.ticker)}</b> <small>${p.kind === 'option' ? esc(p.option.type) + ' ' + money(p.option.strike, 0) : esc(p.side)}</small></td>
      <td>${p.entry ? levelFmt(p, p.entry.price) : '-'}</td>
      <td>${p.exit ? levelFmt(p, p.exit.price) : p.mark ? levelFmt(p, p.mark.price) + ' <small>now</small>' : '-'}</td>
      <td class="${cls(p.ret_pct)}">${p.ret_pct != null ? sgn(p.ret_pct) : '-'}</td>
      <td class="${cls(p.croissants)}">${p.croissants != null ? sgnC(p.croissants) : '-'}</td>
      <td><span class="pill s-${esc(p.status)}">${esc(p.status)}</span>${p.exit ? `<br><small>${esc(p.exit.reason)}</small>` : ''}</td></tr>`).join('');
  }

  const tile = (k, v, s, c = '') => `<div class="stat"><span class="k">${k}</span><span class="v ${c}">${v}</span>${s ? `<span class="s">${s}</span>` : ''}</div>`;

  Promise.all([get('data/plays.json'), get('data/desk.json'), get('data/croissant.json')]).then(([P, D, C]) => {
    // ----- plays -----
    if (P) {
      const bank = P.bank, S = P.summary || {}, plays = P.plays || [];
      const today = plays.slice().reverse().find(p => p.status === 'pending') || plays[plays.length - 1];
      const tp = $('#todays-play');
      if (tp) tp.innerHTML = today ? playCard(today, bank) : '<p class="empty">The first play is being prophesied.</p>';
      const teaser = $('#play-teaser');
      if (teaser && today) teaser.innerHTML = `<p class="kicker" style="color:#8a6a28">Today's play · ${esc(statusLabel(today))}</p>
        <h2 style="margin:0 0 4px">$${esc(today.ticker)} <small class="muted" style="font-size:18px">${today.kind === 'option' ? 'option' : esc(today.side)}</small></h2>
        <p style="margin:0 0 10px">${esc(today.headline)}</p>
        <div class="levels mini"><div><span>Stop</span><b class="down">${levelFmt(today, today.stop)}</b></div><div><span>Target</span><b class="up">${levelFmt(today, today.target)}</b></div><div><span>Bank</span><b>${cro(S.bank != null ? S.bank : bank.start)} 🥐</b></div></div>`;
      const st = $('#bank-stats');
      if (st) st.innerHTML =
        tile('Croissant Bank', cro(S.bank != null ? S.bank : bank.start), `${money((S.bank != null ? S.bank : bank.start) * bank.croissant_usd, 0)} paper · started ${cro(bank.start)}`) +
        tile('Realized P&L', sgnC(S.realized || 0), `open plays ${sgnC(S.unrealized || 0)}`, cls(S.realized)) +
        tile('Win rate', S.win_rate != null ? S.win_rate + '%' : '-', `${S.wins || 0} wins · ${S.losses || 0} losses`) +
        tile('vs the S&P 500', S.vs_spy != null ? sgnC(S.vs_spy) : '-', 'same days, same stake in SPY', cls(S.vs_spy)) +
        tile('Avg win / loss', S.avg_win != null || S.avg_loss != null ? `${S.avg_win != null ? '+' + cro(S.avg_win) : '-'} / ${S.avg_loss != null ? cro(S.avg_loss) : '-'}` : '-', 'croissants per play') +
        tile('Plays', `${S.plays || plays.length}`, `${S.open || 0} open · ${S.pending || 0} waiting · ${S.void || 0} void`);
      const eq = $('#equity'); if (eq) eq.innerHTML = equitySVG(P.equity, bank.start);
      const lg = $('#ledger'); if (lg) lg.innerHTML = ledger(plays);
      const upd = $('#bank-updated'); if (upd && S.updated) upd.textContent = 'Ledger updated ' + S.updated;
    }
    // ----- market -----
    if (D) {
      const h = $('#mkt-head'); if (h) h.innerHTML = `<p class="kicker">Market close · ${fmtD(D.asof, { weekday: 'long', month: 'long', day: 'numeric' })}</p><h2>${esc(D.headline)}</h2>`;
      const ix = $('#mkt-indices');
      if (ix) ix.innerHTML = D.indices.map(i => tile(esc(i.name), i.level.toLocaleString('en-US', { maximumFractionDigits: 2 }), `<span class="${cls(i.pct)}">${sgn(i.pct)}</span> · ${esc(i.etf)} ${money(i.etf_close)}`)).join('');
      const mc = $('#mkt-macro');
      if (mc) mc.innerHTML = D.macro.map(m => tile(esc(m.name), esc(m.value), m.pct != null ? `<span class="${cls(m.pct)}">${sgn(m.pct)}</span>` : esc(m.note || ''))).join('');
      const sc = $('#mkt-sectors');
      if (sc) { const mx = Math.max(...D.sectors.map(s => Math.abs(s.pct)), 0.5);
        sc.innerHTML = D.sectors.map(s => `<div class="sbar"><span class="n">${esc(s.name)} <small>${esc(s.etf)}</small></span><span class="track"><span class="fill ${s.pct < 0 ? 'down' : 'up'}" style="width:${Math.abs(s.pct) / mx * 50}%;${s.pct < 0 ? 'right:50%' : 'left:50%'}"></span></span><span class="p ${cls(s.pct)}">${sgn(s.pct)}</span></div>`).join(''); }
      const mv = $('#mkt-movers');
      if (mv) { const col = (t, a) => `<div><h4>${t}</h4><table class="log mini"><tbody>${a.map(m => `<tr><td><b>${esc(m.t)}</b></td><td>${money(m.close)}</td><td class="${cls(m.pct)}">${sgn(m.pct)}</td></tr>`).join('')}</tbody></table></div>`;
        mv.innerHTML = col('Top gainers', D.movers.up) + col('Top losers', D.movers.down) + `<p class="fineprint" style="grid-column:1/-1">${esc(D.movers.note)}</p>`; }
      const nt = $('#mkt-notes');
      if (nt) nt.innerHTML = D.notes.map(n => `<li>${esc(n.text)} ${/^https?:/.test(n.src) ? `<a class="src" href="${esc(n.src)}" target="_blank" rel="noopener">source</a>` : `<span class="src">${esc(n.src)}</span>`}</li>`).join('');
      const ec = $('#econ');
      if (ec) { let last = '';
        ec.innerHTML = D.econ.map(e => { const day = e.date !== last ? `<tr class="day"><td colspan="3">${fmtD(e.date, { weekday: 'long', month: 'short', day: 'numeric' })}</td></tr>` : ''; last = e.date;
          return day + `<tr><td class="t">${esc(e.time_pt)} PT</td><td><span class="imp i-${esc(e.importance)}" title="${esc(e.importance)} impact"></span>${esc(e.event)}${e.detail ? `<br><small>${esc(e.detail)}</small>` : ''}</td><td><a class="src" href="${esc(e.src)}" target="_blank" rel="noopener">source</a></td></tr>`; }).join(''); }
      const er = $('#earnings');
      if (er) { const by = {}; D.earnings.items.forEach(x => (by[x.date] = by[x.date] || []).push(x));
        er.innerHTML = Object.keys(by).sort().map(dte => `<div class="eday"><h4>${fmtD(dte, { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
          ${['am', 'pm'].map(w => { const a = by[dte].filter(x => x.when === w); return a.length ? `<p><span class="when">${w === 'am' ? 'Before open' : 'After close'}</span>${a.map(x => `<span class="etk" title="${esc(x.name)} · EPS est. ${x.eps_est}">${esc(x.t)}</span>`).join('')}</p>` : ''; }).join('')}</div>`).join('') +
          `<p class="fineprint">${esc(D.earnings.note)} Hover a ticker for the company and EPS estimate.</p>`; }
      const srcs = $('#mkt-sources'); if (srcs) srcs.textContent = 'Sources: ' + D.sources.join('; ') + '. Updated ' + D.updated + '.';
    }
    // ----- croissant index tile -----
    const ci = $('#ci-tile');
    if (ci && C && C.readings && C.readings.length) {
      const r = C.readings.slice().sort((a, b) => b.date.localeCompare(a.date))[0], a = Math.abs(r.pct).toFixed(2);
      ci.innerHTML = `<p class="kicker">The Croissant Index · ${fmtD(r.date)}</p><p style="font-size:20px;margin:0">The stock market ${r.pct >= 0 ? 'gained' : 'lost'} ${a}% today. That's ${a}% ${r.pct >= 0 ? 'more' : 'less'} croissants.</p>`;
    }
  });
})();
