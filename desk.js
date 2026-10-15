// Buffadamus Trading Desk v2. Reads data/plays.json, data/desk.json, data/croissant.json. No tracking.
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const get = u => fetch(u, { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null);
  const nf = (n, d = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const money = (n, d = 2) => '$' + nf(n, d);
  const cro = n => Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
  const sgn = (n, d = 2) => n == null ? '-' : (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(d) + '%';
  const sgnC = n => n == null ? '-' : (n > 0 ? '+' : n < 0 ? '−' : '') + cro(Math.abs(n)) + ' 🥐';
  const cls = n => n > 0 ? 'up' : n < 0 ? 'down' : '';
  const fmtD = (d, o = { weekday: 'short', month: 'short', day: 'numeric' }) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', o);
  const lv = (p, v) => '$' + nf(v);
  const statusLabel = p => ({ pending: 'Fills at the open, ' + fmtD(p.session), open: 'Open', closed: 'Closed', void: 'Void, no trade' }[p.status] || p.status);
  const VERD = '#4fa38a', CINN = '#c4553b', BRASS = '#c9a24e';

  function spark(series, w = 160, h = 30) {
    if (!series || series.length < 2) return '';
    const v = series.map(x => x[1]).slice(-60), mn = Math.min(...v), mx = Math.max(...v), r = mx - mn || 1;
    const pts = v.map((y, i) => `${(i / (v.length - 1) * w).toFixed(1)},${(h - 2 - (y - mn) / r * (h - 4)).toFixed(1)}`).join(' ');
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline class="line" points="${pts}" stroke="${v[v.length - 1] >= v[0] ? VERD : CINN}"/></svg>`;
  }

  function playChart(p, series) {
    const s = (series || []).slice(-60);
    if (s.length < 5) return '';
    const W = 640, H = 210, L = 8, R = 92, T = 10, B = 22;
    const vals = s.map(x => x[1]).concat([p.stop, p.target]);
    const mn = Math.min(...vals), mx = Math.max(...vals), pad = (mx - mn) * 0.06, lo = mn - pad, hi = mx + pad;
    const X = i => L + i * (W - L - R) / (s.length - 1), Y = v => T + (hi - v) / (hi - lo) * (H - T - B);
    const line = s.map((x, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(x[1]).toFixed(1)}`).join(' ');
    const area = line + ` L${X(s.length - 1).toFixed(1)},${H - B} L${L},${H - B} Z`;
    const lvl = (v, c, t) => `<line class="lv ${c}" x1="${L}" x2="${W - R + 4}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${W - R + 8}" y="${Y(v) + 4}">${t} ${nf(v)}</text>`;
    const first = fmtD(s[0][0], { month: 'short', day: 'numeric' }), last = fmtD(s[s.length - 1][0], { month: 'short', day: 'numeric' });
    return `<div class="pchart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(p.ticker)} closing prices with the stop and target"><path class="area" d="${area}"/><path class="px" d="${line}"/>
      ${lvl(p.target, 'tgt', 'Target')}${lvl(p.stop, 'stop', 'Stop')}${lvl(p.ref_price, 'ref', 'Ref')}
      <text x="${L}" y="${H - 6}">${first}</text><text x="${W - R}" y="${H - 6}" text-anchor="end">${last}</text></svg></div>`;
  }

  function playCard(p, bank, series) {
    const stake = p.stake || (p.kind === 'option' ? bank.stake_option : bank.stake_shares);
    const what = p.kind === 'option' ? `Buy ${p.option.type}s, ${money(p.option.strike)} strike, expiring ${fmtD(p.option.expiry, { month: 'short', day: 'numeric' })}` : (p.side === 'short' ? 'Short the shares' : 'Buy the shares');
    const res = p.status === 'pending' ? '' : `<div class="res"><span>${p.status === 'open' ? 'Open so far' : 'Result'}</span><b class="${cls(p.ret_pct)}">${sgn(p.ret_pct)}</b><b class="${cls(p.croissants)}">${sgnC(p.croissants)}</b>
      ${p.entry ? `<small>Entered ${lv(p, p.entry.price)} on ${fmtD(p.entry.date)}${p.exit ? `. Exited ${lv(p, p.exit.price)} on ${fmtD(p.exit.date)}: ${esc(p.exit.reason)}` : p.mark ? `. Last ${lv(p, p.mark.price)}, session ${p.mark.session} of ${p.max_days}` : ''}${p.spy_ret_pct != null ? `. The S&P over the same days: ${sgn(p.spy_ret_pct)}` : ''}.</small>` : ''}</div>`;
    const share = `https://x.com/intent/post?text=${encodeURIComponent(`Buffadamus play ${p.id}: ${p.side === 'short' ? 'short' : 'long'} $${p.ticker}. Stop ${lv(p, p.stop)}, target ${lv(p, p.target)}. Paper trade, not advice.`)}&url=${encodeURIComponent('https://buffadamus.com/desk.html')}&via=Buffadamus`;
    return `<article class="play">
      <div class="top"><span class="seal s-${esc(p.status)}">${esc(statusLabel(p))}</span><span>Play ${esc(p.id)}, published ${esc(p.published)}</span></div>
      <div class="head"><span class="tick">$${esc(p.ticker)}</span><span class="what">${esc(what)}</span></div>
      <p class="hl">${esc(p.headline)}</p>
      <div class="bracket2">
        <div><i>Entry</i><b>${esc(p.entry_rule)}</b></div>
        <div class="stop"><i>Stop loss</i><b>${lv(p, p.stop)}</b></div>
        <div class="tgt"><i>Take profit</i><b>${lv(p, p.target)}</b></div>
        <div><i>Stake</i><b>${cro(stake)} 🥐</b></div>
      </div>
      ${playChart(p, series)}
      ${res}
      <div class="cols">
        <div><h4>Why</h4><ul>${(p.thesis || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
          <h4>What could go wrong</h4><ul>${(p.risks || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
        <div><h4>Key numbers</h4><dl>
          <dt>Reward to risk</dt><dd>${Number(p.rr).toFixed(2)} to 1</dd><dt>Most it can lose</dt><dd>${p.risk_at_stop != null ? cro(p.risk_at_stop) + ' 🥐 at the stop' : '-'}</dd><dt>Time limit</dt><dd>${p.max_days} sessions</dd>
          ${Object.entries(p.facts || {}).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
          ${p.dog ? `<p class="dog">🐕 ${esc(p.dog)}</p>` : ''}</div>
      </div>
      <p class="fine">Paper trade for entertainment, not financial advice. Sources: ${esc((p.sources || []).join('; '))}. ${p.x_url ? `<a href="${esc(p.x_url)}" target="_blank" rel="noopener">See the post on X</a> or ` : ''}<a href="${share}" target="_blank" rel="noopener">share it</a></p>
    </article>`;
  }

  // Astrolabe: semicircle 0-100, five bands, engraved ticks, needle.
  function astrolabe(score) {
    const cx = 200, cy = 190, R = 160, r0 = 118;
    const pt = (v, rad) => { const a = Math.PI * (1 - v / 100); return [cx + rad * Math.cos(a), cy - rad * Math.sin(a)]; };
    const arc = (a, b, ro, ri, fill) => { const [x1, y1] = pt(a, ro), [x2, y2] = pt(b, ro), [x3, y3] = pt(b, ri), [x4, y4] = pt(a, ri);
      return `<path d="M${x1},${y1} A${ro},${ro} 0 0 1 ${x2},${y2} L${x3},${y3} A${ri},${ri} 0 0 0 ${x4},${y4} Z" fill="${fill}"/>`; };
    const bands = [[0, 25, '#a23d26'], [25, 45, '#c4553b99'], [45, 55, '#c9a24e88'], [55, 76, '#4fa38a99'], [76, 100, '#2f7a63']];
    const names = [[12, 'Extreme fear'], [35, 'Fear'], [50, 'Neutral'], [65, 'Greed'], [88, 'Extreme greed']];
    let ticks = '';
    for (let v = 0; v <= 100; v += 2.5) { const big = v % 25 === 0, [a, b] = pt(v, R + 2), [c, d] = pt(v, R + (big ? 14 : v % 5 === 0 ? 9 : 5));
      ticks += `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${BRASS}" stroke-width="${big ? 2 : 1}"/>`; }
    const lbls = names.map(([v, t]) => { const [x, y] = pt(v, (R + r0) / 2); return `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="${t.length > 8 ? 10 : 12}" fill="#efe4c8" font-style="italic" font-family="EB Garamond, Georgia, serif">${t}</text>`; }).join('');
    const nums = [0, 25, 50, 75, 100].map(v => { const [x, y] = pt(v, R + 24); return `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="12" fill="#b3a589" font-family="Cinzel, serif">${v}</text>`; }).join('');
    const ang = score == null ? 0 : (score / 100) * 180 - 90;
    return `<svg viewBox="0 0 400 230" role="img" aria-label="Fear and greed reading ${score}">
      <g class="gauge-bands">${bands.map(([a, b, c]) => arc(a, b, R, r0, c)).join('')}</g>
      <path d="M${cx - R - 2},${cy} A${R + 2},${R + 2} 0 0 1 ${cx + R + 2},${cy}" fill="none" stroke="${BRASS}" stroke-width="1.5"/>
      <path d="M${cx - r0},${cy} A${r0},${r0} 0 0 1 ${cx + r0},${cy}" fill="none" stroke="${BRASS}" stroke-width="1"/>
      ${ticks}${lbls}${nums}
      <circle cx="${cx}" cy="${cy}" r="${r0 - 26}" fill="none" stroke="#3a2d22" stroke-dasharray="2 5"/>
      <g class="needle" style="transform-origin:${cx}px ${cy}px;transform:rotate(${ang}deg)">
        <path d="M${cx - 6},${cy} L${cx},${cy - R + 8} L${cx + 6},${cy} Z" fill="#e8cf8a"/>
        <path d="M${cx},${cy - R + 30} l7,10 l-7,10 l-7,-10 Z" fill="#120d0a" stroke="#e8cf8a" stroke-width="1.5"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="12" fill="#221a14" stroke="${BRASS}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="4" fill="${BRASS}"/>
    </svg>`;
  }

  function ring(pct, label) {
    const r = 42, c = 2 * Math.PI * r, f = Math.max(0, Math.min(100, pct || 0)) / 100 * c;
    return `<div><svg viewBox="0 0 110 110" role="img" aria-label="${esc(label)} ${pct}%"><circle class="bg" cx="55" cy="55" r="${r}" fill="none" stroke-width="9"/>
      <circle class="fg" cx="55" cy="55" r="${r}" fill="none" stroke-width="9" stroke-dasharray="${f} ${c}" transform="rotate(-90 55 55)" stroke="${pct >= 50 ? VERD : CINN}"/>
      <text x="55" y="62" text-anchor="middle">${Math.round(pct)}%</text></svg><div class="lbl">${esc(label)}</div></div>`;
  }

  function split(title, a, b, la, lb, fmt = x => x) {
    const t = (a + b) || 1, pa = a / t * 100;
    return `<div class="split"><div class="row"><span>${esc(title)}</span><span class="lbl">${Math.round(pa)}% up</span></div>
      <div class="track"><span class="a" style="width:${pa}%"></span><span class="d" style="width:${100 - pa}%"></span></div>
      <div class="row" style="margin-top:4px"><span class="up">${fmt(a)} ${la}</span><span class="down">${fmt(b)} ${lb}</span></div></div>`;
  }

  function equityChart(daily, start) {
    const pts = [{ d: '', bank: start }].concat(daily || []);
    if (pts.length < 2) return `<p class="lbl">The curve begins after the first session closes.</p>`;
    const W = 640, H = 220, L = 8, R = 60, T = 12, B = 22, ys = pts.map(x => x.bank), mn = Math.min(...ys), mx = Math.max(...ys), pad = Math.max((mx - mn) * 0.15, start * 0.005);
    const lo = mn - pad, hi = mx + pad, X = i => L + i * (W - L - R) / (pts.length - 1), Y = v => T + (hi - v) / (hi - lo) * (H - T - B);
    const line = pts.map((x, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(x.bank).toFixed(1)}`).join(' ');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Croissant Bank, daily"><line class="base" x1="${L}" x2="${W - R}" y1="${Y(start)}" y2="${Y(start)}"/><text x="${W - R + 6}" y="${Y(start) + 4}">${cro(start)}</text>
      <path class="ar" d="${line} L${X(pts.length - 1)},${Y(start)} L${L},${Y(start)} Z"/><path class="ln" d="${line}"/>
      <text x="${W - R + 6}" y="${Y(ys[ys.length - 1]) + 4}" fill="#e8cf8a">${cro(ys[ys.length - 1])}</text></svg>`;
  }

  function heatColor(p) {
    const a = Math.min(Math.abs(p) / 3, 1) * 0.85 + 0.08;
    return p >= 0 ? `rgba(79,163,138,${a})` : `rgba(196,85,59,${a})`;
  }

  function curveSVG(pts) {
    const W = 520, H = 200, L = 56, R = 18, T = 18, B = 30, ys = pts.map(p => p.y), mn = Math.min(...ys) - 0.15, mx = Math.max(...ys) + 0.15;
    const X = i => L + i * (W - L - R) / (pts.length - 1), Y = v => T + (mx - v) / (mx - mn) * (H - T - B);
    let g = '';
    for (let v = Math.ceil(mn * 4) / 4; v <= mx; v += 0.25) g += `<line class="gl" x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}"/><text x="2" y="${Y(v) + 4}">${v.toFixed(2)}</text>`;
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${X(i)},${Y(p.y)}`).join(' ');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Treasury yield curve">${g}<path class="ln" d="${line}"/>
      ${pts.map((p, i) => `<circle cx="${X(i)}" cy="${Y(p.y)}" r="4"/><text x="${X(i)}" y="${H - 10}" text-anchor="middle">${esc(p.m)}</text><text class="yv" x="${X(i)}" y="${Y(p.y) - 10}" text-anchor="middle">${p.y.toFixed(2)}</text>`).join('')}</svg>`;
  }

  Promise.all([get('data/plays.json'), get('data/desk.json'), get('data/croissant.json')]).then(([P, D, C]) => {
    const series = (D && D.series) || {};
    // ----- the play -----
    if (P) {
      const bank = P.bank, S = P.summary || {}, plays = P.plays || [];
      const today = plays.slice().reverse().find(p => p.status === 'pending') || plays[plays.length - 1];
      const tp = $('#todays-play');
      if (tp) tp.innerHTML = today ? playCard(today, bank, series[today.ticker]) : '<p class="lbl">The first play is being prophesied.</p>';
      const teaser = $('#play-teaser');
      if (teaser && today) teaser.innerHTML = `<p class="kicker" style="color:#8a6a28">Today's play: ${esc(statusLabel(today))}</p>
        <h2 style="margin:0 0 4px">$${esc(today.ticker)}</h2><p style="margin:0 0 10px">${esc(today.headline)}</p>
        <div class="levels mini"><div><span>Stop</span><b class="down">${lv(today, today.stop)}</b></div><div><span>Target</span><b class="up">${lv(today, today.target)}</b></div><div><span>Bank</span><b>${cro(S.bank != null ? S.bank : bank.start)} 🥐</b></div></div>`;
      const daily = P.equity_daily || [], nowBank = daily.length ? daily[daily.length - 1].bank : (S.bank != null ? S.bank : bank.start);
      const g = P.guard || { status: 'ok' };
      const gtxt = { ok: 'Treasury guard: all clear. New plays allowed.', paused: 'Treasury guard: paused. ' + (g.reason || ''), halted: 'Treasury guard: halted. ' + (g.reason || '') }[g.status] || '';
      const bc = $('#bank-card');
      if (bc) bc.innerHTML = `<div class="lbl">Bank today, open plays marked at the close</div><div class="big">${cro(nowBank)} 🥐</div>
        <div class="usd">${money(nowBank * bank.croissant_usd, 0)} of paper money, <span class="${cls(nowBank - bank.start)}">${sgnC(nowBank - bank.start)} since the start</span></div>
        <div class="kv"><div><i>Win rate</i><b>${S.win_rate != null ? S.win_rate + '%' : '-'}</b></div><div><i>Against the S&amp;P</i><b class="${cls(S.vs_spy)}">${sgnC(S.vs_spy)}</b></div>
          <div><i>Average win</i><b>${S.avg_win != null ? sgnC(S.avg_win) : '-'}</b></div><div><i>Average loss</i><b>${S.avg_loss != null ? sgnC(S.avg_loss) : '-'}</b></div>
          <div><i>Plays</i><b>${plays.length}</b></div><div><i>Open or waiting</i><b>${(S.open || 0) + (S.pending || 0)}</b></div></div>
        <div class="guard ${esc(g.status)}"><i></i><span>${esc(gtxt)}</span></div>`;
      const eq = $('#equity'); if (eq) eq.innerHTML = `<div class="lbl" style="margin-bottom:6px">The bank, every session</div>` + equityChart(daily, bank.start);
      const lg = $('#ledger');
      if (lg) lg.innerHTML = plays.length ? plays.slice().reverse().map(p => `<tr><td>${esc(p.id)}</td><td>${fmtD(p.session, { month: 'short', day: 'numeric' })}</td>
        <td><b>$${esc(p.ticker)}</b> <small>${p.kind === 'option' ? esc(p.option.type) + ' ' + money(p.option.strike, 0) : esc(p.side)}</small></td>
        <td>${cro(p.stake || 0)} 🥐</td><td>${p.entry ? lv(p, p.entry.price) : '-'}</td><td>${p.exit ? lv(p, p.exit.price) : p.mark ? lv(p, p.mark.price) + ' <small>now</small>' : '-'}</td>
        <td class="${cls(p.ret_pct)}">${p.ret_pct != null ? sgn(p.ret_pct) : '-'}</td><td class="${cls(p.croissants)}">${p.croissants != null ? sgnC(p.croissants) : '-'}</td>
        <td class="${cls(p.vs_spy_croissants)}">${p.vs_spy_croissants != null ? sgnC(p.vs_spy_croissants) : '-'}</td>
        <td>${esc(statusLabel(p))}${p.exit ? `<br><small>${esc(p.exit.reason)}</small>` : ''}</td></tr>`).join('') : '<tr><td colspan="10" class="lbl">No plays yet.</td></tr>';
    }
    // ----- market -----
    if (D) {
      const asof = $('#asof'); if (asof) asof.textContent = `Market close, ${fmtD(D.asof, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}. ${D.headline || ''}`;
      const tape = $('#tape');
      if (tape) tape.innerHTML = (D.indices || []).map(i => `<div class="tk"><div class="n">${esc(i.name)}</div><div class="v">${i.level != null ? nf(i.level, i.level > 1000 ? 0 : 2) : money(i.etf_close)}</div>
        <div class="c ${cls(i.pct)}">${sgn(i.pct)}</div>${spark(series[i.etf])}</div>`).join('') +
        (D.vix ? `<div class="tk"><div class="n">Volatility (VIX)</div><div class="v">${nf(D.vix.value)}</div><div class="c ${cls(-(D.vix.pct || 0))}">${D.vix.pct != null ? sgn(D.vix.pct) : '&nbsp;'}</div>${spark(series.VIXY)}</div>` : '') +
        (D.curve ? `<div class="tk"><div class="n">10-year yield</div><div class="v">${nf(D.curve.points.find(p => p.m === '10Y').y)}%</div><div class="c lbl">${esc(D.curve.date_label || '')}</div>${spark(series.TLT)}</div>` : '');
      const f = D.fng || {}, o = f.oracle || {}, astro = $('#astro');
      if (astro) astro.innerHTML = `<div class="lbl">The Oracle's fear and greed reading</div>${astrolabe(o.score)}
        <div class="score">${o.score != null ? o.score : '-'}</div><div class="rating">${esc(o.rating || '')}</div>
        ${f.cnn ? `<div class="cnn">CNN Fear &amp; Greed: ${Math.round(f.cnn.score)}, ${esc(f.cnn.rating)} <a class="src" href="${esc(f.cnn.src)}" target="_blank" rel="noopener">source</a></div>` : ''}
        <div class="comps">${(o.components || []).map(c => `<div class="comp"><span>${esc(c.name)}</span><span class="s">${c.score}</span><div class="bar"><span style="width:${c.score}%"></span></div><small>${esc(c.value)}</small></div>`).join('')}</div>
        <p class="fine">${esc(o.method || '')}</p>`;
      const b = D.breadth || {};
      const bs = $('#breadth-split');
      if (bs && b.adv != null) bs.innerHTML = split('Stocks rising vs falling', b.adv, b.dec, 'up', 'down', x => cro(x)) +
        split('Money in rising vs falling stocks', b.upvol_b, b.downvol_b, 'up', 'down', x => '$' + nf(x, 0) + 'B') +
        `<p class="fine">${esc(b.adv_universe || '')}</p>`;
      const br = $('#breadth-rings');
      if (br && b.pct50 != null) br.innerHTML = `<div class="lbl" style="margin-bottom:10px">Share of S&amp;P 500 stocks above their average price</div>
        <div class="rings">${ring(b.pct20, '20-day')}${ring(b.pct50, '50-day')}${ring(b.pct200, '200-day')}</div>
        <div class="hilo"><span><b class="up">${b.highs}</b>new 52-week highs</span><span><b class="down">${b.lows}</b>new 52-week lows</span></div>
        <p class="fine">${esc(b.universe || '')}</p>`;
      const inst = $('#inst');
      if (inst && D.indicators) inst.innerHTML = D.indicators.map(i => {
        const dot = v => `<i class="${v != null && i.close > v ? 'on' : ''}" title="${v != null ? (i.close > v ? 'above ' : 'below ') + nf(v) : ''}"></i>`;
        const hw = Math.min(Math.abs(i.macd_hist) / (i.close * 0.004) * 40, 40);
        const adxT = i.adx == null ? '' : i.adx >= 25 ? 'strong trend' : i.adx >= 18 ? 'trend forming' : 'no trend';
        return `<tr><td class="sym">${esc(i.t)}</td><td>${money(i.close)}</td><td class="${cls(i.chg)}">${sgn(i.chg)}</td>
          <td><span class="dots">${dot(i.sma20)}${dot(i.sma50)}${dot(i.sma200)}</span></td>
          <td><span class="meter" title="RSI ${i.rsi}"><i style="left:calc(${i.rsi}% - 1px)"></i></span> ${nf(i.rsi, 0)}</td>
          <td><span class="hist" style="width:${hw}px;background:${i.macd_hist >= 0 ? VERD : CINN}"></span>${i.macd_hist >= 0 ? 'rising' : 'falling'}</td>
          <td>${i.adx != null ? nf(i.adx, 0) : '-'} <span class="lbl">${adxT}</span></td><td>${i.pct_b != null ? nf(i.pct_b) : '-'}</td>
          <td>${i.atr_pct != null ? nf(i.atr_pct) + '%' : '-'}</td><td class="${cls(i.from_hi)}">${sgn(i.from_hi)}</td></tr>`; }).join('');
      const heat = $('#heat');
      if (heat) heat.innerHTML = (D.sectors || []).map(s => `<div style="background:${heatColor(s.pct)}" title="${esc(s.etf)}"><b>${sgn(s.pct)}</b><span>${esc(s.name)}</span></div>`).join('');
      const cv = $('#curve');
      if (cv && D.curve) { cv.innerHTML = curveSVG(D.curve.points); const cs = $('#curve-sub'); if (cs) cs.textContent = D.curve.note || ''; }
      const mc = $('#macro');
      if (mc) mc.innerHTML = (D.macro || []).map(m => `<div><span>${esc(m.name)}</span><span>${esc(m.value)} ${m.pct != null ? `<span class="${cls(m.pct)}">${sgn(m.pct)}</span>` : ''}</span></div>`).join('');
      const nt = $('#notes');
      if (nt) nt.innerHTML = (D.notes || []).map(n => `<li>${esc(n.text)}${/^https?:/.test(n.src) ? ` <a class="src" href="${esc(n.src)}" target="_blank" rel="noopener">source</a>` : ` <span class="src">${esc(n.src)}</span>`}</li>`).join('');
      const mv = $('#movers');
      if (mv && D.movers) { const col = (t, a) => `<div><div class="lbl">${t}</div><table><tbody>${a.map(m => `<tr><td><b>${esc(m.t)}</b></td><td>${money(m.close)}</td><td class="${cls(m.pct)}">${sgn(m.pct)}</td></tr>`).join('')}</tbody></table></div>`;
        mv.innerHTML = col('Rose most', D.movers.up) + col('Fell most', D.movers.down); const mn = $('#movers-note'); if (mn) mn.textContent = D.movers.note; }
      const cal = $('#cal');
      if (cal) {
        const ev = {}, er = {};
        (D.econ || []).forEach(e => (ev[e.date] = ev[e.date] || []).push(e));
        ((D.earnings || {}).items || []).forEach(e => (er[e.date] = er[e.date] || []).push(e));
        const days = []; let d = new Date(D.asof + 'T12:00:00'); d.setDate(d.getDate() + 1);
        while (days.length < 10) { if (d.getDay() % 6) days.push(d.toISOString().slice(0, 10)); d.setDate(d.getDate() + 1); }
        cal.innerHTML = days.map((k, i) => `<div class="day${i === 0 ? ' today' : ''}"><div class="dname">${fmtD(k)}</div>
          ${(ev[k] || []).map(e => `<div class="ev ${esc(e.importance)}"><em>${esc(e.time_pt)}</em> ${esc(e.event)}</div>`).join('')}
          ${(er[k] || []).length ? `<div class="er">${er[k].map(x => `<span class="${esc(x.when)}" title="${esc(x.name)}, ${x.when === 'am' ? 'before the open' : 'after the close'}, EPS est. ${x.eps_est}">${esc(x.t)}</span>`).join('')}</div>` : ''}
          ${!(ev[k] || []).length && !(er[k] || []).length ? '<div class="lbl" style="font-size:14px">Quiet</div>' : ''}</div>`).join('');
        const cs = $('#cal-src'); if (cs) cs.textContent = ((D.earnings || {}).note || '') + ' Sources: ' + (D.sources || []).join('; ') + '. Updated ' + (D.updated || '') + '.';
      }
    }
    const ci = $('#ci-tile');
    if (ci && C && C.readings && C.readings.length) {
      const r = C.readings.slice().sort((a, b) => b.date.localeCompare(a.date))[0], a = Math.abs(r.pct).toFixed(2);
      ci.innerHTML = `<p class="kicker">The Croissant Index, ${fmtD(r.date)}</p><p style="font-size:20px;margin:0">The stock market ${r.pct >= 0 ? 'gained' : 'lost'} ${a}% today. That's ${a}% ${r.pct >= 0 ? 'more' : 'less'} croissants.</p>`;
    }
  });
})();
