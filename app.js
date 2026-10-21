// Buffadamus v2 - transmissions from 1555. No tracking. Easter eggs stored only in this browser.
(() => {
  const $ = s => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('bfd.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('bfd.' + k, JSON.stringify(v)); } catch {} }
  };
  const GL = '!<>-_\\/[]{}=+*^?#%&@$01';
  const fx = { warp: 0, acc: 'rgba(77,243,230,' }; // shared with the time tunnel

  // ---------- sound (off by default) ----------
  let ctx = null, soundOn = store.get('sound', false);
  function beep(f = 660, d = 0.06, type = 'square', vol = 0.035) {
    if (!soundOn) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = f; g.gain.value = vol;
      o.connect(g); g.connect(ctx.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + d); o.stop(ctx.currentTime + d);
    } catch {}
  }
  function sweep(f0, f1, d, type = 'sawtooth', vol = .02) {
    if (!soundOn) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain(), n = ctx.currentTime;
      o.type = type; o.frequency.setValueAtTime(f0, n); o.frequency.exponentialRampToValueAtTime(f1, n + d);
      g.gain.value = vol; g.gain.exponentialRampToValueAtTime(.0001, n + d); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(n + d);
    } catch {}
  }
  const sb = $('#soundBtn');
  const paintSound = () => { sb.setAttribute('aria-pressed', soundOn); sb.textContent = soundOn ? 'SND ON' : 'SND OFF'; sb.setAttribute('aria-label', soundOn ? 'Sound on' : 'Sound off'); };
  sb.onclick = () => { soundOn = !soundOn; store.set('sound', soundOn); paintSound(); beep(880, .08); };
  paintSound();

  // ---------- text scramble ----------
  function scramble(el, text, speed = 18) {
    if (reduce) { el.textContent = text; return Promise.resolve(); }
    return new Promise(res => {
      let frame = 0; const total = Math.min(60, 12 + text.length / 3);
      clearInterval(el._t);
      el._t = setInterval(() => {
        frame++;
        const p = frame / total, n = Math.floor(text.length * p);
        let out = text.slice(0, n);
        for (let i = n; i < text.length; i++) out += text[i] === '\n' || text[i] === ' ' ? text[i] : GL[(Math.random() * GL.length) | 0];
        el.textContent = out;
        if (frame % 3 === 0) beep(300 + Math.random() * 600, .02, 'square', .015);
        if (frame >= total) { clearInterval(el._t); el.textContent = text; res(); }
      }, speed);
    });
  }

  // ---------- toast + flash ----------
  const toast = $('#toast');
  function say(html, ms = 3200, low) { if (low && !toast.hidden) return; toast.innerHTML = html; toast.hidden = false; clearTimeout(say._t); say._t = setTimeout(() => toast.hidden = true, ms); }
  function flash() { const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }

  // ---------- anomalies ----------
  const ANOMS = [
    ['y1929', 'Black October', 'A year when the floor fell out. Tune the dial.'],
    ['y1999', 'The bug that never bit', 'The year every clock was supposed to die.'],
    ['y2038', 'Integer overflow', 'When the old computers run out of seconds.'],
    ['konami', 'Temporal overdrive', 'An old cheat code. Up, up...'],
    ['terminal', 'Root access', 'There is a terminal. The key is under Esc.'],
    ['poke', 'Do not poke the prophet', 'He really does not like being poked.'],
    ['origin', 'Origin ping', 'Type the year he came from. Anywhere.'],
    ['oracle', 'Rule No. 1', 'Type the name of the other half.'],
    ['lost', 'Page from no year', 'Visit a page that does not exist.'],
    ['mph88', 'Eighty-seven point nine', 'Spin the dial faster than any time machine should go.'],
    ['paradox', 'Grandfather clause', 'Shake the dial back and forth. Hard.'],
    ['stations', 'Station master', 'Log every live station on the dial.'],
    ['hotdog', 'Price stability', 'One thing has cost $1.50 since 1985. Catch it.'],
    ['trilogy', 'Great Scott', 'Three films, three years. Lock them in order.'],
    ['deepthought', 'Deep thought', 'Ask the machine the ultimate question.'],
    ['groundhog', 'Same day again', 'Relive the present. Again. And again.'],
    ['barrel', 'Aerial maneuver', 'Some machines do a trick if you ask. It rolls.'],
    ['redpill', 'Rabbit hole', 'The terminal offers two colors. One goes deeper.'],
    ['joshua', 'Strange game', 'The terminal remembers a password from a 1983 movie.'],
    ['fsociety', 'Hello, friend', 'Some files hide. Their names start with a dot.'],
    ['yearzero', 'Year zero', 'Dial a year that never happened.'],
    ['forever', 'Holding period: forever', 'Do nothing. Seriously. Nothing.'],
    ['witchcraft', 'Witchcraft', 'Open the witchcraft window. Say his name.'],
    ['onhold', 'Please continue to hold', 'He has been on hold since 1556. Hold him.']
  ];
  const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty', 'Twenty-one', 'Twenty-two', 'Twenty-three', 'Twenty-four', 'Twenty-five'];
  $('#anomTotal').textContent = ANOMS.length;
  $('#anomHint').textContent = `${WORDS[ANOMS.length] || ANOMS.length} are hidden on this site. Find them all to repair the timeline.`;
  let found = new Set(store.get('anoms', []));
  const list = $('#anomList');
  function paintAnoms() {
    list.innerHTML = ANOMS.map(([id, name, hint]) => found.has(id)
      ? `<li class="found"><span class="n">${name}</span><span class="h">${hint}</span></li>`
      : `<li><span class="n">??? ??? ???</span><span class="h">${hint}</span></li>`).join('');
    $('#anomCount').textContent = found.size;
    document.body.classList.toggle('restored', found.size === ANOMS.length);
  }
  function unlock(id) {
    if (found.has(id)) return;
    found.add(id); store.set('anoms', [...found]); paintAnoms();
    const a = ANOMS.find(x => x[0] === id);
    beep(523, .09, 'triangle', .05); setTimeout(() => beep(784, .12, 'triangle', .05), 90);
    say(`ANOMALY FOUND: <b>${a ? a[1] : id}</b> (${found.size}/${ANOMS.length})`);
    if (found.size === ANOMS.length) setTimeout(() => { flash(); say('<b>TIMELINE REPAIRED.</b> The signal is clean for one second. Then it breaks again. Follow @Buffadamus for the next leak.', 7000); }, 1200);
  }
  $('#anomBtn').onclick = () => $('#anomalies').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  paintAnoms();
  if (store.get('lost', false)) unlock('lost');

  // ---------- boot sequence ----------
  const boot = $('#boot'), log = $('#bootlog');
  const lines = [
    ['> CHRONO-LINK v1555.2026', ''],
    ['> locating origin ........ 1555 AD, Salon-de-Provence', 'ok'],
    ['> locating present ....... ' + new Date().getFullYear() + ' AD, your device', 'ok'],
    ['> calibrating astrolabe .. done', 'ok'],
    ['> warranty check ......... EXPIRED (1556)', 'err'],
    ['> signal integrity ....... 71%', ''],
    ['> decrypting prophet ..... BUFFADAMUS', 'ok'],
    ['> WARNING: transmissions may arrive corrupted. read them anyway.', 'err']
  ];
  { const d = new Date(); if (d.getMonth() === 9 && d.getDate() === 21) lines.splice(5, 0, ['> calendar check ......... OCTOBER 21. a DeLorean is due today. it is late.', 'ok']); }
  if (found.has('fsociety')) lines.unshift(['> Hello, friend.', 'err']);
  let booted = false;
  function endBoot() { if (booted) return; booted = true; boot.classList.add('gone'); setTimeout(() => boot.remove(), 600); try { sessionStorage.setItem('bfd.booted', '1'); } catch {} }
  let seen = false; try { seen = sessionStorage.getItem('bfd.booted') === '1'; } catch {}
  if (seen || reduce) { boot.remove(); booted = true; }
  else {
    let i = 0;
    const next = () => {
      if (booted) return;
      if (i >= lines.length) { setTimeout(endBoot, 700); return; }
      const [t, c] = lines[i++]; const span = document.createElement('span'); if (c) span.className = c;
      log.appendChild(span); log.appendChild(document.createTextNode('\n'));
      let k = 0; const ty = setInterval(() => { span.textContent = t.slice(0, ++k); if (k % 2) beep(1200, .01, 'square', .01); if (k >= t.length) { clearInterval(ty); setTimeout(next, 120); } }, 14);
    };
    next();
    $('#skip').onclick = endBoot; boot.onclick = endBoot;
  }

  // ---------- signal readout ----------
  const sig = $('#signal');
  setInterval(() => { const v = 58 + ((Math.random() * 30) | 0); sig.textContent = 'SIGNAL ' + v + '%'; }, 2400);
  $('#nowyear').textContent = new Date().getFullYear();

  // ---------- chrono dial v3: a rotary tuner for time ----------
  const TX = {
    1555: 'ORIGIN. Built a time machine out of an astrolabe, two candles and confidence. The confidence was load-bearing.',
    1600: 'A new company is founded to sell pepper. I put everything into salt.\nSalt and pepper are not the same trade. I learned this in 1601.',
    1637: 'Tulip bulbs sell for the price of a canal house. I bought the canal house. It was full of tulips.',
    1666: 'London catches fire. Fire insurance is invented the next year. I am always one year early or one year late. Never on time.',
    1720: 'South Sea stock: BUY. [SIGNAL LOST] ...SELL. SELL. Why does nobody ever receive the second half.',
    1792: 'Twenty-four men sign a trading agreement under a buttonwood tree. I am the twenty-fifth. I signed the tree.',
    1849: 'Gold in California. I arrive in 1852 with a shovel and a strong opinion.',
    1903: 'Two brothers fly for twelve seconds. I have been flying through time for 471 years. Nobody gives me a museum.',
    1955: 'November 12. Lightning hits a clock tower at 10:04 PM.\nI had money on 10:05.',
    1929: 'OCTOBER. I warned them on the 23rd. They said it was different this time.\nIt was not different this time.',
    1969: 'A man walks on the moon. My time machine still cannot parallel park.',
    1971: 'The dollar leaves the gold standard. I leave the room.\nNobody notices either of us.',
    1983: 'A computer nearly starts a war over a game, then decides the only winning move is not to play.\nBest trader of the decade.',
    1984: 'This transmission is being monitored.\nSo is this one. Hello to whoever is in the other room.',
    1985: '88 miles per hour. That is the speed. I was going 87. That is why I am stuck here.\nAlso the hot dog costs $1.50. Remember that.',
    1997: 'August 29. The machines become self-aware. They check the stock market.\nThey go back to sleep.',
    1987: 'A Monday. A black one. Do not check the numbers. Do not check anything. Go outside.',
    1999: 'Every computer resets to 1900 at midnight. I fill a bunker with canned beans.\nJanuary 1st: the beans and I have a lot to talk about.',
    2000: 'Every company adds .com to its name and doubles. I add .com to mine.\nBUFFADAMUS.COM. Wait. That one worked.',
    2008: 'The houses are made of cards. The cards are made of houses. Nobody can explain it. Everybody signs.',
    2010: 'A man buys two pizzas for 10,000 bitcoin. I was the delivery driver.\nI asked for cash.',
    2012: 'December 21. The calendar ends. The world does not.\nI had already sold everything. Again.',
    2015: 'October 21. Flying cars were promised. We got phones that are mostly ads.\nThe self-lacing shoes, weirdly, happened.',
    2021: 'A picture of a monkey sells for the price of a castle. I sell my castle. For a different monkey.',
    2026: 'PRESENT DAY. Stranded. The warranty on the time machine expired in 1556.\nCustomer support has me on hold. The hold music is from 1983.',
    2038: 'January 19, 03:14:07. Every old computer runs out of seconds and decides it is 1901.\nFinally. Someone who understands me.',
    2049: '[CORRUPTED] ...the robots pay rent. They ask where the money comes from. We do not know either. [CORRUPTED]',
    2077: 'Everything is chrome. The chrome is a subscription. Missing a payment makes it beige.',
    2099: 'LAST CLEAN SIGNAL. Everything works out.\nExcept for one thing. You will know it when you see it.'
  };
  const FILL = [
    'No clear signal. Static shaped like a bull market.',
    'Faint fragment: "...prices up again..." The rest is wind.',
    'Silence. Even the future takes weekends.',
    'Signal blocked by a very large cloud. Possibly a cloud provider.',
    'Fragment: "...this time is different..." (it is not).',
    'Nothing happens. Historians will later call it "nothing happened".',
    'A transmission arrives. It is an ad. Even the future has ads.',
    'Someone, somewhere, buys the top. Again.'
  ];
  const ANOM_YEARS = { 1929: 'y1929', 1999: 'y1999', 2038: 'y2038' };
  const MIN = 1555, MAX = 2099, SPAN = MAX - MIN, SWEEP = 300, C = 200, SIG = 2.5;
  const STATIONS = Object.keys(TX).map(Number).sort((a, b) => a - b);
  const ERAS = [[1699, 'renaissance', 'RENAISSANCE', '234,220,187'], [1899, 'steam', 'STEAM AGE', '224,148,90'], [1979, 'analog', 'ANALOG', '214,219,227'], [2029, 'digital', 'DIGITAL', '77,243,230'], [MAX, 'post', 'POST-HUMAN', '197,139,255']];
  const clampY = v => Math.max(MIN, Math.min(MAX, v));
  const angOf = v => -SWEEP / 2 + (v - MIN) / SPAN * SWEEP;
  const P = (a, r) => { const t = a * Math.PI / 180; return [(C + r * Math.sin(t)).toFixed(1), (C - r * Math.cos(t)).toFixed(1)]; };
  const arcPath = (a0, a1, r) => { const [x0, y0] = P(a0, r), [x1, y1] = P(a1, r); return `M${x0} ${y0}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  const nearest = v => STATIONS.reduce((b, s) => Math.abs(s - v) < Math.abs(b - v) ? s : b, STATIONS[0]);
  const strength = d => Math.exp(-(d * d) / (2 * SIG * SIG));
  const hexId = y => 'TX-' + y.toString(16).toUpperCase().padStart(4, '0');
  const dialEl = $('.dial'), wheel = $('#wheel'), needle = $('#needle'), arcFill = $('#arcFill');
  const out = $('#yearOut'), eraName = $('#eraName'), lockLbl = $('#lockLbl'), freqEl = $('#freq'), sigPct = $('#sigPct');
  const body = $('#txBody'), st = $('#txState'), tid = $('#txId'), live = $('#txLive'), yr = $('#year');
  const barsEl = $('#bars'); barsEl.innerHTML = '<i></i>'.repeat(12);
  const bars = [...barsEl.children]; bars.forEach((b, i) => b.style.height = (22 + i * 7) + '%');

  // build the face: ticks, labels, station dots
  (() => {
    let h = '';
    for (let y = MIN; y <= MAX; y += 5) { const maj = y % 50 === 0 || y === MIN; const [x0, y0] = P(angOf(y), maj ? 157 : 165), [x1, y1] = P(angOf(y), 174); h += `<line${maj ? ' class="maj"' : ''} x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`; }
    { const [x0, y0] = P(angOf(MAX), 157), [x1, y1] = P(angOf(MAX), 174); h += `<line class="maj" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`; }
    for (const y of [1555, 1600, 1700, 1800, 1900, 2000, 2099]) { const [x, yy] = P(angOf(y), 124); h += `<text x="${x}" y="${yy}">${y}</text>`; }
    $('#tickG').innerHTML = h;
    $('#dotG').innerHTML = STATIONS.map(y => { const [x, yy] = P(angOf(y), 187); return `<circle class="st" data-y="${y}" cx="${x}" cy="${yy}" r="6"><title>Unknown signal</title></circle>`; }).join('');
    $('#trackArc').setAttribute('d', arcPath(-SWEEP / 2, SWEEP / 2, 150));
  })();
  const dots = [...$('#dotG').children];

  // station logbook
  let logged = new Set(store.get('stations', []).filter(y => TX[y]));
  const strip = $('#logStrip');
  strip.innerHTML = STATIONS.map(() => '<button type="button" disabled>????</button>').join('');
  const cells = [...strip.children];
  $('#logTotal').textContent = STATIONS.length;
  function paintLog() {
    // logged stations first, in year order; unknown ones give away nothing about where they are
    const ys = STATIONS.filter(y => logged.has(y));
    cells.forEach((c, i) => {
      const y = ys[i], on = y != null;
      c.disabled = !on; c.textContent = on ? y : '????'; if (on) c.dataset.y = y; else delete c.dataset.y;
      c.className = (on ? 'on' : '') + (on && ANOM_YEARS[y] ? ' a' : '') + (on && y === cur ? ' cur' : '');
      c.setAttribute('aria-label', on ? 'Tune to ' + y : 'Station not logged yet');
    });
    STATIONS.forEach((y, i) => {
      const on = logged.has(y), d = dots[i], an = !!ANOM_YEARS[y];
      d.classList.toggle('on', on); d.classList.toggle('a', on && an);
      d.style.display = an && !on ? 'none' : ''; // anomalies have no marker until found
      d.firstChild.textContent = on ? y + ' (logged)' : 'Unknown signal';
    });
    $('#logCount').textContent = logged.size;
  }
  let booting = true;
  function logStation(y) {
    if (logged.has(y)) return;
    logged.add(y); store.set('stations', [...logged]); paintLog();
    if (booting) return;
    if (!ANOM_YEARS[y]) say(`STATION LOGGED: <b>${y}</b> (${logged.size}/${STATIONS.length})`, 2200, true);
    if (logged.size === STATIONS.length) setTimeout(() => { flash(); unlock('stations'); }, 2400);
  }

  // state
  let val = 2026, cur = null, locked = null, dirty = true, anim = 0, animRaf = 0, spinRaf = 0, lockT = 0, shimT = 0, lastMove = 0, lblNow = '', pad = '';
  const setLbl = t => { lblNow = t; if (!pad) lockLbl.textContent = t; };
  const setState = (t, cls) => { st.textContent = t; st.className = cls; wheel.setAttribute('aria-valuetext', cur + ', ' + t.toLowerCase()); };
  function setEra(y) {
    const e = ERAS.find(x => y <= x[0]);
    if (dialEl.dataset.era === e[1]) return;
    dialEl.dataset.era = e[1]; eraName.textContent = e[2]; fx.acc = `rgba(${e[3]},`; accCss = null;
  }

  // partial decode: the closer you tune, the more of the nearest station leaks through
  const hash = (i, n) => { let x = (i * 374761393 + n * 668265263) | 0; x = Math.imul(x ^ (x >>> 13), 1274126177); return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };
  let pN = 0, pP = 0;
  const glyph = () => GL[(Math.random() * GL.length) | 0];
  function partialText() { const t = TX[pN]; let o = ''; for (let i = 0; i < t.length; i++) { const ch = t[i]; o += ch === ' ' || ch === '\n' || hash(i, pN) < pP ? ch : glyph(); } return o; }
  function partial(n, p) { clearInterval(body._t); pN = n; pP = p; body.textContent = partialText(); if (!reduce && !shimT) shimT = setInterval(() => { body.textContent = partialText(); }, 90); }
  function stopShim() { clearInterval(shimT); shimT = 0; }
  const glitchLine = () => Array.from({ length: 96 }, (_, i) => i % 8 === 7 ? ' ' : glyph()).join('');

  function onYear(y, settled) {
    if (y === cur && (!settled || locked === y)) return;
    const changed = y !== cur; cur = y;
    if (changed) {
      if (!anim && !booting) beep(180 + (y - MIN) * 1.1, .015, 'sawtooth', .008);
      if (+yr.value !== y) yr.value = y;
      if (!pad) out.textContent = y;
      wheel.setAttribute('aria-valuenow', y);
      setEra(y);
      freqEl.textContent = (88 + (y - MIN) / SPAN * 20).toFixed(1) + ' MHz';
      tid.textContent = hexId(y);
      paintLog();
    }
    clearTimeout(lockT);
    if (locked !== y) { locked = null; wheel.classList.remove('locked'); }
    if (TX[y]) { setState('ACQUIRING', 'tune'); setLbl('ACQUIRING'); partial(y, .9); if (settled) lock(y); else lockT = setTimeout(() => lock(y), 380); return; }
    const n = nearest(y), s = strength(Math.abs(n - y));
    if (s > .04) { setState('TUNING ' + (y < n ? '>>' : '<<'), 'tune'); setLbl('TUNING'); partial(n, s * .8); }
    else {
      stopShim(); setState('STATIC', ''); setLbl('NO SIGNAL');
      const f = FILL[(y * 7919) % FILL.length];
      if (settled) { scramble(body, f, 8); live.textContent = y + '. Static. ' + f; } else { clearInterval(body._t); body.textContent = f; }
    }
  }
  function lock(y) {
    if (cur !== y || locked === y) return;
    locked = y; stopShim();
    wheel.classList.remove('locked'); void wheel.getBoundingClientRect(); wheel.classList.add('locked');
    const an = ANOM_YEARS[y];
    setState(an ? 'ANOMALY' : 'LIVE', an ? 'anom' : 'live'); setLbl('LOCKED');
    scramble(body, TX[y], 8); live.textContent = y + '. ' + TX[y];
    logStation(y);
    if (booting) return;
    beep(988, .07, 'triangle', .04); setTimeout(() => beep(1480, .1, 'triangle', .035), 70);
    fx.warp = Math.min(1, fx.warp + .35);
    if (an) unlock(an);
    seq = seq.concat(y).slice(-3);
    if (seq.join() === '1955,1985,2015') setTimeout(() => { flash(); sweep(80, 2400, .9, 'square', .03); say('<b>GREAT SCOTT.</b> Trilogy complete. 1.21 jigawatts of nostalgia, fully discharged.', 4200); setTimeout(() => unlock('trilogy'), 4300); }, 900);
    if (y === 1985) setTimeout(hotdogRun, 1100);
  }
  let seq = [];
  // year zero: the year historians skipped
  function yearZero() {
    stopAnim(); stopSpin(); stopShim(); clearInterval(body._t); clearTimeout(lockT); locked = null;
    flash(); sweep(900, 40, .8, 'square', .03);
    out.textContent = '0000'; tid.textContent = 'TX-0000'; setState('ERROR', 'anom'); setLbl('ERROR');
    scramble(body, 'ERROR 0000: YEAR NOT FOUND.\nHistorians went straight from 1 BC to AD 1. I have been to both. Nobody remembers a year zero. I remember it. That is the problem.', 10);
    unlock('yearzero');
  }
  function setVal(v) { val = clampY(v); dirty = true; lastMove = performance.now(); if (!anim) onYear(Math.round(val), false); }

  // warp jump: needle spins, counter rolls, tunnel surges
  function stopAnim() { if (animRaf) cancelAnimationFrame(animRaf); animRaf = 0; if (anim) { anim = 0; dialEl.classList.remove('warping'); } }
  function jumpTo(t, o = {}) {
    t = clampY(Math.round(t)); stopAnim(); stopSpin();
    const from = val, dist = Math.abs(t - from);
    if (reduce || dist < .5) { val = t; dirty = true; onYear(t, true); return; }
    const dur = o.ms || Math.min(1200, 320 + dist * 2.4), t0 = performance.now();
    anim = 1; stopShim(); clearTimeout(lockT); locked = null; wheel.classList.remove('locked');
    if (o.warp !== false && dist > 30) { fx.warp = 1; dialEl.classList.add('warping'); sweep(t > from ? 220 : 1400, t > from ? 1400 : 220, dur / 1000); }
    setState('IN TRANSIT', 'tune'); setLbl('IN TRANSIT');
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      val = from + (t - from) * e; dirty = true;
      if (k < 1) { animRaf = requestAnimationFrame(step); return; }
      animRaf = 0; anim = 0; dialEl.classList.remove('warping'); val = t; onYear(t, true);
    };
    animRaf = requestAnimationFrame(step);
  }

  // inertia + magnetic settle
  let vel = 0;
  function stopSpin() { if (spinRaf) cancelAnimationFrame(spinRaf); spinRaf = 0; }
  function spin() {
    let last = performance.now();
    const step = t => {
      const dt = Math.min(48, t - last); last = t;
      vel *= Math.pow(.93, dt / 16.7); setVal(val + vel * dt);
      if (Math.abs(vel) < .006 || val <= MIN || val >= MAX) { spinRaf = 0; settle(); return; }
      spinRaf = requestAnimationFrame(step);
    };
    spinRaf = requestAnimationFrame(step);
  }
  function settle() {
    const y = Math.round(val), n = nearest(val);
    if (n !== y && Math.abs(n - val) <= 1.4) jumpTo(n, { warp: false, ms: 260 });
    else { val = y; dirty = true; onYear(y, true); }
  }

  // eggs: 88 mph and the paradox
  let fastShown = 0;
  function speedEgg(ys) {
    const now = performance.now();
    if (ys > 1500 && now - fastShown > 6000) { fastShown = now; flash(); say('<b>88 MPH.</b> Nothing happens. I was going 87.'); setTimeout(() => unlock('mph88'), 2600); }
  }
  let pdir = 0, prun = 0, flips = [];
  function paradoxCheck(dv) {
    if (!dv) return; const dir = Math.sign(dv);
    if (dir === pdir) { prun += Math.abs(dv); return; }
    if (pdir && prun > 4) { const now = performance.now(); flips = flips.filter(t => now - t < 2200); flips.push(now); if (flips.length >= 6) { flips = []; paradox(); } }
    pdir = dir; prun = Math.abs(dv);
  }
  function paradox() {
    const b = document.body; if (b.classList.contains('paradox')) return;
    b.classList.add('paradox'); flash(); sweep(1600, 60, .7, 'square', .02);
    say(`<b>PARADOX.</b> You met yourself in ${cur}. You both pretended not to notice.`, 3000);
    setTimeout(() => { b.classList.remove('paradox'); unlock('paradox'); }, reduce ? 1200 : 2600);
  }

  // static noise while tuning (only with sound on)
  let noise = null;
  function noiseOn() {
    if (!soundOn || noise) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = buf; src.loop = true; bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = .6; g.gain.value = 0;
      src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(); noise = { g, bp };
    } catch {}
  }
  const quiet = () => { if (noise) noise.g.gain.setTargetAtTime(0, ctx.currentTime, .05); };
  const busy = () => { stopScan(); stopAnim(); stopSpin(); noiseOn(); };

  // pointer: drag the ring, flick it, tap a logged station or a spot on the ring
  const angAt = e => { const r = wheel.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * 400 - C, y = (e.clientY - r.top) / r.height * 400 - C; return { a: Math.atan2(x, -y) * 180 / Math.PI, r: Math.hypot(x, y) }; };
  let drag = null;
  wheel.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    busy();
    const dot = e.target.closest && e.target.closest('.st.on');
    if (dot) { e.preventDefault(); jumpTo(+dot.dataset.y); return; }
    e.preventDefault(); wheel.focus({ preventScroll: true });
    try { wheel.setPointerCapture(e.pointerId); } catch {}
    drag = { a: angAt(e).a, moved: 0, t: performance.now() }; vel = 0; pdir = 0; prun = 0;
  });
  wheel.addEventListener('pointermove', e => {
    if (!drag) return;
    const a = angAt(e).a; let da = a - drag.a; if (da > 180) da -= 360; else if (da < -180) da += 360;
    drag.a = a; drag.moved += Math.abs(da);
    const now = performance.now(), dt = Math.max(8, now - drag.t); drag.t = now;
    const dv = da * SPAN / SWEEP; vel = vel * .5 + (dv / dt) * .5;
    speedEgg(Math.abs(vel) * 1000); paradoxCheck(dv);
    setVal(val + dv);
  });
  wheel.addEventListener('pointerup', e => {
    if (!drag) return; const d = drag; drag = null;
    if (d.moved < 2.5) { const p = angAt(e); if (p.r > 100 && Math.abs(p.a) <= 165) { jumpTo(MIN + (Math.max(-150, Math.min(150, p.a)) + 150) / SWEEP * SPAN); return; } settle(); return; }
    if (performance.now() - d.t > 90) vel = 0;
    if (Math.abs(vel) > .03 && !reduce) spin(); else settle();
  });
  wheel.addEventListener('pointercancel', () => { if (drag) { drag = null; settle(); } });

  // keyboard: arrows, shift, page keys, home/end, and a 4-digit keypad
  let padT = 0, keyT = 0, wAcc = 0;
  const endPad = () => { pad = ''; out.classList.remove('typing'); out.textContent = cur; lockLbl.textContent = lblNow; };
  wheel.addEventListener('keydown', e => {
    const k = e.key;
    if (/^[0-9]$/.test(k)) {
      e.preventDefault(); busy(); pad += k; clearTimeout(padT);
      out.textContent = (pad + '____').slice(0, 4); out.classList.add('typing'); lockLbl.textContent = 'KEYPAD';
      if (pad.length === 4) { const v = +pad; endPad(); if (v === 0) yearZero(); else if (v < MIN || v > MAX) say(`<b>${v}</b> is outside the warranty. Try 1555 to 2099.`); else jumpTo(v); }
      else padT = setTimeout(endPad, 2200);
      return;
    }
    if (k === 'Escape' && pad) { clearTimeout(padT); endPad(); return; }
    let d = 0;
    if (k === 'ArrowRight' || k === 'ArrowUp') d = 1; else if (k === 'ArrowLeft' || k === 'ArrowDown') d = -1;
    else if (k === 'PageUp') d = 10; else if (k === 'PageDown') d = -10;
    else if (k === 'Home' || k === 'End') { e.preventDefault(); busy(); jumpTo(k === 'Home' ? MIN : MAX); return; }
    if (!d) return;
    e.preventDefault(); busy(); if (e.shiftKey) d *= 10;
    setVal(Math.round(val) + d);
    clearTimeout(keyT); keyT = setTimeout(quiet, 300);
  });
  wheel.addEventListener('wheel', e => {
    if (document.activeElement !== wheel) return;
    e.preventDefault(); busy(); wAcc += e.deltaY || e.deltaX;
    while (Math.abs(wAcc) >= 40) { const s = Math.sign(wAcc); wAcc -= s * 40; setVal(Math.round(val) + s * (e.shiftKey ? 10 : 1)); }
  }, { passive: false });

  // fine-tune slider, presets, random, logbook
  let lastV = +yr.value, lastT = performance.now();
  yr.addEventListener('input', () => {
    busy(); const v = +yr.value, now = performance.now();
    speedEgg(Math.abs(v - lastV) / Math.max(8, now - lastT) * 1000); lastV = v; lastT = now;
    setVal(v);
  });
  document.querySelectorAll('.jump button[data-y]').forEach(b => b.onclick = () => { busy(); jumpTo(+b.dataset.y); });
  let nowHits = [];
  $('.jump button[data-y="2026"]').addEventListener('click', () => {
    const t = performance.now(); nowHits = nowHits.filter(x => t - x < 7000).concat(t);
    if (nowHits.length >= 5) { nowHits = []; say('<b>SAME DAY AGAIN.</b> It is 2026. It is still 2026. Tomorrow, it will be 2026.', 3600); setTimeout(() => unlock('groundhog'), 3700); }
  });
  $('#randYear').onclick = () => { busy(); jumpTo(MIN + Math.random() * SPAN); };
  strip.addEventListener('click', e => { const b = e.target.closest('button[data-y]'); if (b && !b.disabled) { busy(); jumpTo(+b.dataset.y); } });

  // autoscan, like a 1983 police scanner
  const scanBtn = $('#scanBtn'); let scanning = false, scanT = 0;
  function scanNext() {
    if (!scanning) return;
    const ok = STATIONS.filter(s => !ANOM_YEARS[s] || logged.has(s)); // the scanner never finds an anomaly for you
    const n = ok.find(s => s > cur) ?? ok[0];
    jumpTo(n, { warp: n < cur, ms: 650 }); scanT = setTimeout(scanNext, (reduce ? 0 : 650) + 2800);
  }
  function stopScan() { if (!scanning) return; scanning = false; clearTimeout(scanT); scanBtn.setAttribute('aria-pressed', 'false'); scanBtn.textContent = 'SCAN'; }
  scanBtn.onclick = () => { if (scanning) { stopScan(); return; } stopAnim(); stopSpin(); noiseOn(); scanning = true; scanBtn.setAttribute('aria-pressed', 'true'); scanBtn.textContent = 'STOP SCAN'; scanNext(); };

  // leak + coordinates
  const shareUrl = () => 'https://buffadamus.com/#y' + cur;
  $('#leakBtn').onclick = () => {
    let t = body.textContent.replace(/\s+/g, ' ').trim(); if (t.length > 200) t = t.slice(0, 197) + '...';
    const head = (locked === cur ? 'TRANSMISSION' : st.className === 'tune' ? 'PARTIAL TRANSMISSION' : 'STATIC') + ' // ' + cur;
    window.open('https://x.com/intent/post?text=' + encodeURIComponent(head + '\n' + t) + '&url=' + encodeURIComponent(shareUrl()), '_blank', 'noopener');
  };
  $('#copyBtn').onclick = () => {
    const u = shareUrl();
    (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => say('Coordinates copied: <b>' + u.replace('https://', '') + '</b>'), () => say(u, 6000));
  };

  // oscilloscope + render loop (runs only while the dial is on screen)
  const sc = $('#scope'), sg = sc.getContext('2d'); let accCss = null;
  function sizeScope() { const d = Math.min(2, devicePixelRatio || 1); sc.width = Math.round(sc.clientWidth * d); sc.height = Math.round(sc.clientHeight * d); }
  function drawScope(t) {
    const w = sc.width, h = sc.height; if (!w || !h) return;
    if (!accCss) { const cs = getComputedStyle(dialEl); accCss = cs.getPropertyValue('--acc').trim() || '#4df3e6'; }
    sg.clearRect(0, 0, w, h);
    sg.strokeStyle = 'rgba(151,161,179,.16)'; sg.lineWidth = 1; sg.beginPath();
    for (let i = 1; i < 10; i++) { const x = Math.round(i * w / 10) + .5; sg.moveTo(x, 0); sg.lineTo(x, h); }
    sg.moveTo(0, h / 2 + .5); sg.lineTo(w, h / 2 + .5); sg.stroke();
    const n = nearest(val), s = anim ? .15 : strength(Math.abs(n - val)), f = 2 + (n - MIN) / SPAN * 9, mid = h / 2, A = h * .36, lk = s > .97;
    sg.lineWidth = Math.max(1.5, h / 45); sg.strokeStyle = lk ? accCss : s > .04 ? '#ffb547' : 'rgba(151,161,179,.75)';
    sg.shadowColor = sg.strokeStyle; sg.shadowBlur = lk ? 10 : 0; sg.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const p = x / w; let y = s * Math.sin(p * Math.PI * 2 * f + t * .005);
      if (lk && ANOM_YEARS[n]) y *= .6 + .4 * Math.sin(p * 37 + t * .02);
      y += (1 - s) * (Math.random() - .5) * 1.7;
      const yy = mid + y * A; x ? sg.lineTo(x, yy) : sg.moveTo(x, yy);
    }
    sg.stroke(); sg.shadowBlur = 0;
  }
  function render() {
    const a = angOf(val);
    needle.setAttribute('transform', `rotate(${a.toFixed(2)} ${C} ${C})`);
    arcFill.setAttribute('d', val - MIN < .3 ? '' : arcPath(-SWEEP / 2, a, 150));
    const s = strength(Math.abs(nearest(val) - val)), lit = Math.round(s * 12);
    for (let i = 0; i < 12; i++) bars[i].classList.toggle('on', i < lit);
    sigPct.textContent = Math.round(s * 100) + '%';
    if (anim) { const y = Math.round(val); out.textContent = y; tid.textContent = hexId(y); setEra(y); if (Math.random() < .5) body.textContent = glitchLine(); }
    if (noise) {
      const moving = drag || spinRaf || anim || performance.now() - lastMove < 250;
      noise.g.gain.setTargetAtTime(soundOn && moving ? (1 - s) * .045 + .004 : 0, ctx.currentTime, .04);
      noise.bp.frequency.setTargetAtTime(700 + s * 2600, ctx.currentTime, .05);
    }
  }
  let dialVis = false, looping = false;
  function loop(t) {
    render();
    if (!reduce || dirty) drawScope(t);
    dirty = false;
    if (dialVis && !document.hidden) requestAnimationFrame(loop); else { looping = false; quiet(); }
  }
  const kick = () => { if (!looping && dialVis && !document.hidden) { looping = true; requestAnimationFrame(loop); } };
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { dialVis = es[0].isIntersecting; if (dialVis) { sizeScope(); dirty = true; kick(); } }).observe(dialEl);
  else { dialVis = true; sizeScope(); kick(); }
  document.addEventListener('visibilitychange', kick);
  addEventListener('resize', () => { sizeScope(); dirty = true; });

  // deep link: buffadamus.com/#y1929 tunes the dial
  function fromHash() {
    const m = /^#y(\d{4})$/.exec(location.hash); if (!m) return;
    const v = clampY(+m[1]);
    const go = () => { if (!booted) { setTimeout(go, 200); return; } $('#dial').scrollIntoView({ behavior: 'auto', block: 'start' }); setTimeout(() => jumpTo(v), 250); };
    go();
  }
  addEventListener('hashchange', fromHash);

  paintLog();
  onYear(2026, true); booting = false; dirty = true;
  if (logged.size === STATIONS.length) unlock('stations');
  fromHash();

  // ---------- intercepted posts ----------
  fetch('data/posts.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null).then(d => {
    const el = $('#posts'); const ps = (d && d.posts || []).slice(0, 3);
    if (!ps.length) { el.innerHTML = '<p class="hint">No transmissions intercepted yet. Check X.</p>'; return; }
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    el.innerHTML = ps.map((p, i) => `<article class="card" tabindex="0"><div class="meta"><span>TX-${(0xA1 + i).toString(16).toUpperCase()}</span><span>${esc(p.date)}</span></div><p data-text="${esc(p.text)}"></p><a href="${esc(p.url)}" target="_blank" rel="noopener">View on X</a></article>`).join('');
    el.querySelectorAll('.card').forEach(c => {
      const p = c.querySelector('p'), t = p.dataset.text;
      p.textContent = t.replace(/[^\s]/g, () => GL[(Math.random() * GL.length) | 0]);
      const go = () => { if (!c._done) { c._done = true; scramble(p, t, 14); } };
      c.addEventListener('mouseenter', go); c.addEventListener('focus', go); c.addEventListener('click', go);
      if ('IntersectionObserver' in window && matchMedia('(hover: none)').matches) {
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { go(); io.disconnect(); } }), { threshold: .6 }); io.observe(c);
      }
    });
  });

  // ---------- ask the machine ----------
  const ANS = [
    'Signal says yes. Signal also says the signal is broken.',
    'I have seen your future. You are reading this on a screen. Accurate so far.',
    'The answer arrived corrupted: YE#@!S. Or NO. One of those.',
    'Ask again in 1556.',
    'The stars say hold. The time machine says it needs an update.',
    'Absolutely not. Unless it works. Then I said yes.',
    'Prophecy pending. Estimated delivery: 3 to 400 years.',
    'The candle flickered twice. That is either yes or a draft.',
    'I looked into the future. It looked back and asked me the same question.',
    'Error 1555: optimism not found.',
    'Every timeline I checked, you did it anyway.',
    'Yes, but in the timeline where you wore a hat.'
  ];
  let lastA = -1;
  $('#askForm').addEventListener('submit', e => {
    e.preventDefault();
    const q = $('#q').value.trim().toLowerCase();
    let a;
    if (/buffett/.test(q)) { a = 'Rule No. 1: never lose money. Rule No. 2: never trust a time machine.'; unlock('oracle'); }
    else if (/1555/.test(q)) { a = 'Origin confirmed. Salon-de-Provence sends its regards.'; unlock('origin'); }
    else if (/(lottery|numbers|powerball)/.test(q)) a = 'I saw the numbers. I wrote them down in Latin. The Latin did not survive the trip.';
    else if (/(meaning of life|ultimate question|life, the universe)/.test(q)) { a = '42. Adjusted for inflation since 1979, about 180.'; unlock('deepthought'); }
    else if (/barrel roll/.test(q)) { a = 'Rolling. Please keep your arms inside the timeline.'; barrelRoll(); }
    else if (/hot ?dog/.test(q)) a = '$1.50. It has been $1.50 since 1985. The only thing in any timeline that never moves. Best value I have ever seen.';
    else if (/(great scott|delorean|flux|88 ?mph|doc brown|marty)/.test(q)) a = 'Roads? Where I am going, I need a warranty.';
    else if (/(hello,? friend|fsociety|elliot|mr\.? ?robot|evil ?corp)/.test(q)) a = 'Hello, friend. The interesting files are the ones you cannot see. Try the terminal.';
    else if (/(matrix|red pill|blue pill|neo|spoon)/.test(q)) a = 'There is no spoon. There is also no warranty. Ask the terminal about pills.';
    else if (/(wen moon|to the moon|wen lambo|lambo)/.test(q)) a = 'The moon was 1969. Check the dial. You missed it by a little.';
    else if (/stonks/.test(q)) a = 'Stonks only go up. In exactly one timeline. Not this one.';
    else if (/(skynet|terminator|judgment day)/.test(q)) a = 'August 29, 1997. Tune there. The machines were very relaxed about it.';
    else if (/(wargames|joshua|tic.?tac.?toe|global thermonuclear)/.test(q)) a = 'A strange game. The terminal still remembers his name.';
    else { let i; do { i = (Math.random() * ANS.length) | 0; } while (i === lastA); lastA = i; a = ANS[i]; }
    scramble($('#answer'), a, 16);
  });

  // ---------- poke the prophet ----------
  const face = $('#face'), speech = $('#speech'); let pokes = 0, pokeT = 0;
  const LINES = ['Hey.', 'Please.', 'I am working.', 'That is my timeline.', 'Sir.', 'STOP POKING THE TIMELINE'];
  face.addEventListener('click', () => {
    const now = Date.now(); pokes = now - pokeT < 1500 ? pokes + 1 : 1; pokeT = now;
    speech.textContent = LINES[Math.min(pokes - 1, LINES.length - 1)]; speech.classList.add('on');
    clearTimeout(face._t); face._t = setTimeout(() => speech.classList.remove('on'), 1400);
    face.classList.add('poked'); setTimeout(() => face.classList.remove('poked'), 600);
    beep(180 + pokes * 60, .05, 'square', .03);
    if (pokes >= 6) { flash(); unlock('poke'); pokes = 0; }
  });
  // press and hold the prophet: he is on hold too
  let holdT = 0;
  const holdOff = () => clearTimeout(holdT);
  face.addEventListener('pointerdown', () => {
    holdOff();
    holdT = setTimeout(() => {
      speech.textContent = '\u266A hold music, 1983 \u266A'; speech.classList.add('on');
      clearTimeout(face._t); face._t = setTimeout(() => speech.classList.remove('on'), 4200);
      [523, 659, 784, 659, 587, 698, 880, 698, 523].forEach((f, i) => setTimeout(() => beep(f, .16, 'triangle', .03), i * 190));
      say('<b>PLEASE CONTINUE TO HOLD.</b> Your call is important to us. Estimated wait: 471 years.', 4000);
      setTimeout(() => unlock('onhold'), 4100); pokes = 0;
    }, 2500);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => face.addEventListener(ev, holdOff));
  face.addEventListener('contextmenu', e => e.preventDefault());
  // face follows the mouse a little
  if (!reduce) addEventListener('pointermove', e => {
    const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
    face.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
  });

  // ---------- typed secrets + Konami ----------
  const K = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kpos = 0, typed = '';
  addEventListener('keydown', e => {
    if (!booted && e.key === 'Escape') { endBoot(); return; }
    const ae = document.activeElement; const inField = !!ae && (ae.tagName === 'TEXTAREA' || (ae.tagName === 'INPUT' && ae.type !== 'range'));
    if (e.key === '`' || e.key === '~') { if (!inField || document.activeElement.id === 'termIn') { e.preventDefault(); toggleTerm(); } return; }
    if (inField) return;
    kpos = (e.key === K[kpos] || e.key.toLowerCase() === K[kpos]) ? kpos + 1 : (e.key === K[0] ? 1 : 0);
    if (kpos === K.length) { kpos = 0; toggle1555(); }
    if (e.key.length === 1) {
      typed = (typed + e.key.toLowerCase()).slice(-20);
      if (typed.endsWith('barrel roll')) barrelRoll();
      if (typed.endsWith('great scott')) { flash(); say('<b>GREAT SCOTT.</b> Wrong movie, right energy. Try 1955, 1985, 2015.'); }
      if (typed.endsWith('hello friend')) say('Hello, friend. <b>ls -a</b>');
      if (typed.endsWith('1555')) { unlock('origin'); say('<b>ORIGIN PING.</b> 1555 answers: "who is this".'); }
      if (typed.endsWith('buffett')) { unlock('oracle'); say('<b>RULE NO. 1:</b> never lose money. <b>RULE NO. 2:</b> never trust a time machine.'); }
    }
  });
  function toggle1555() {
    flash(); const on = document.body.classList.toggle('y1555'); accCss = null; dirty = true;
    say(on ? '<b>TEMPORAL OVERDRIVE.</b> Welcome to 1555. Mind the plague.' : 'Back to the present. Wash your hands.');
    unlock('konami');
  }

  // ---------- terminal ----------
  const term = $('#term'), tout = $('#termOut'), tin = $('#termIn');
  const tprint = s => { tout.textContent += s + '\n'; tout.scrollTop = tout.scrollHeight; };
  function toggleTerm(force) {
    const open = force != null ? force : term.hidden;
    term.hidden = !open;
    if (open) { if (!tout.textContent) tprint('chrono-terminal. type "help".'); tin.focus(); unlock('terminal'); }
    else tin.blur();
  }
  $('#termBtn').onclick = () => toggleTerm(true);
  $('#termClose').onclick = () => toggleTerm(false);
  const CMDS = {
    help: () => 'commands: whoami, date, year <n>, scan, stations, ls, cat <file>, prophesy, sudo prophesy, konami, sound, anomalies, clear, exit',
    whoami: () => 'buffadamus. half warren buffett, half nostradamus. currently: stuck.',
    date: () => `local: ${new Date().toString().slice(0, 24)}\norigin: 1555 (approx. the warranty says 1556)`,
    ls: () => 'transmissions.log  warranty.pdf  secret.txt  beans.txt',
    'ls -a': () => '.  ..  .fsociety00.dat  .hotdog  transmissions.log  warranty.pdf  secret.txt  beans.txt',
    'ls -la': () => CMDS['ls -a'](),
    joshua: () => { unlock('joshua'); return 'GREETINGS, PROFESSOR.\nSHALL WE PLAY A GAME?\n> global thermonuclear day trading\n...\nA STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO DAY TRADE.\n(not financial advice. not a professor.)'; },
    'red pill': () => redPill(), 'take the red pill': () => redPill(), 'redpill': () => redPill(),
    'blue pill': () => 'you wake up in 2026. you believe whatever you want to believe. the warranty is still expired.', 'take the blue pill': () => CMDS['blue pill'](),
    'hello friend': () => 'hello, friend. you already know where to look. ls -a', 'hello, friend': () => CMDS['hello friend'](),
    fsociety: () => 'we are... not allowed to say. the timeline is read-only. mostly.',
    delorean: () => 'parked in 1985. the meter is running. it is now worth more than the house.',
    'great scott': () => 'trilogy order: 1955, 1985, 2015. lock all three. no skipping.',
    hotdog: () => '$1.50. since 1985. do not ask how. catch one when it flies by.',
    42: () => 'correct answer. what was the question?',
    prophesy: () => ANS[(Math.random() * ANS.length) | 0],
    'sudo prophesy': () => 'permission granted. prophecy: you will type another command. [FULFILLED]',
    konami: () => { toggle1555(); return 'overdrive toggled.'; },
    sound: () => { sb.click(); return 'sound ' + (soundOn ? 'on' : 'off'); },
    scan: () => { scanBtn.click(); return scanning ? 'scanner on. touch any dial control to stop it.' : 'scanner off.'; },
    stations: () => STATIONS.filter(y => logged.has(y)).map(y => '[x] ' + y).concat(Array(STATIONS.length - logged.size).fill('[ ] ????')).join('  ') + '\n' + logged.size + '/' + STATIONS.length + ' logged',
    anomalies: () => ANOMS.map(([id, n]) => (found.has(id) ? '[x] ' + n : '[ ] ??? ???')).join('\n'),
    clear: () => { tout.textContent = ''; return null; },
    exit: () => { toggleTerm(false); return null; }
  };
  const FILES = {
    'transmissions.log': () => STATIONS.filter(y => logged.has(y)).map(y => y + '  ' + TX[y].split('\n')[0].slice(0, 54)).concat(Array(STATIONS.length - logged.size).fill('????  [not yet received]')).join('\n'),
    'warranty.pdf': 'binary file. it says "VOID IF USED FOR TIME TRAVEL".',
    'secret.txt': 'the dial is a radio. stations hide between the years. the meter gets louder when you are close.\nthree of them are anomalies. one of them ends in 29. shaking the dial is not recommended.',
    'beans.txt': 'still here. still waiting for y2k.',
    '.hotdog': '$1.50\nsince 1985\nsighted near the 1985 station. it does not stay long.',
    '.fsociety00.dat': () => { unlock('fsociety'); fsocietyHack(); return 'hello, friend.\n> loading ledger: EVIL CORP global debt database...\n> rewriting balances to 0.00 ............ DONE\n> verifying ...\n> ERROR: timeline is read-only. all debts restored. sorry.\n> they will never know we were here. (they know.)'; }
  };
  $('#termForm').addEventListener('submit', e => {
    e.preventDefault(); const raw = tin.value.trim(); tin.value = ''; if (!raw) return;
    tprint('buff@1555:~$ ' + raw);
    const c = raw.toLowerCase();
    let r;
    if (CMDS[c]) r = CMDS[c]();
    else if (/^year\s+0+$/.test(c)) { toggleTerm(false); yearZero(); r = 'year 0000 requested. that is a problem.'; }
    else if (c.startsWith('year ')) { const v = Math.max(1555, Math.min(2099, parseInt(c.slice(5), 10) || 2026)); stopScan(); jumpTo(v); r = 'tuning to ' + v + '. ' + (TX[v] ? 'live signal detected.' : 'expect static.'); }
    else if (c.startsWith('cat ')) { const f = FILES[c.slice(4).trim()]; r = typeof f === 'function' ? f() : f || 'cat: no such file. or not yet.'; }
    else if (c === '1555') { unlock('origin'); r = 'origin ping returned: "who is this"'; }
    else if (c === 'buffett') { unlock('oracle'); r = 'rule no. 1: never lose money. rule no. 2: never trust a time machine.'; }
    else if (c.startsWith('rm ')) r = 'nice try. the timeline is read-only.';
    else r = 'command not found. it may not be invented yet.';
    if (r) tprint(r);
    beep(700, .03);
  });

  // ---------- more eggs ----------
  // barrel roll
  function barrelRoll() {
    const m = $('main'); unlock('barrel');
    if (reduce || m.classList.contains('roll')) return;
    m.style.transformOrigin = `50% ${scrollY + innerHeight / 2}px`; m.classList.add('roll'); sweep(300, 900, 1.1, 'triangle', .03);
    setTimeout(() => m.classList.remove('roll'), 1300);
  }
  // red pill: digital rain in the tunnel
  function redPill() { fx.rain = performance.now() + 8000; flash(); unlock('redpill'); return 'you take the red pill.\nthe tunnel turns green. there is no spoon. there is also no refund.'; }
  // mr. robot: the screen gets owned for a second
  function fsocietyHack() {
    if (reduce) return;
    document.body.classList.add('owned'); sweep(2000, 100, .5, 'square', .02);
    setTimeout(() => document.body.classList.remove('owned'), 1600);
  }
  // the $1.50 hot dog drifts through the timeline
  const dog = $('#hotdog'); let dogT = 0;
  function hotdogRun() {
    if (!dog || !dog.hidden) return;
    const fromLeft = Math.random() < .5, y = 90 + Math.random() * Math.max(80, innerHeight - 260);
    dog.style.top = y + 'px'; dog.classList.toggle('rtl', !fromLeft); dog.hidden = false;
    dog.style.animation = 'none'; void dog.offsetWidth; dog.style.animation = '';
    clearTimeout(dogT); dogT = setTimeout(() => { dog.hidden = true; }, reduce ? 7000 : 9000);
  }
  if (dog) {
    dog.addEventListener('click', () => {
      dog.hidden = true; clearTimeout(dogT); flash(); beep(660, .08, 'triangle', .05);
      say('<b>PRICE STABILITY.</b> $1.50 since 1985. The only thing in any timeline that never moves.', 3800);
      setTimeout(() => unlock('hotdog'), 3900);
    });
  }
  // holding period: forever (no input for 75 seconds)
  let lastInput = Date.now();
  ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(ev => addEventListener(ev, () => { lastInput = Date.now(); }, { passive: true }));
  document.addEventListener('visibilitychange', () => { lastInput = Date.now(); });
  setInterval(() => {
    if (document.hidden || !booted || found.has('forever') || Date.now() - lastInput < 75000) return;
    speech.textContent = 'Holding period: forever.'; speech.classList.add('on'); setTimeout(() => speech.classList.remove('on'), 4000);
    say('<b>RULE NO. 3:</b> our favorite holding period is forever. You held for 75 seconds. Close enough.', 4200);
    setTimeout(() => unlock('forever'), 4300);
  }, 5000);

  // ---------- console egg ----------
  try {
    console.log('%cBUFFADAMUS', 'font:800 28px sans-serif;color:#4df3e6;text-shadow:2px 0 #ff3d8b');
    console.log('%cYou opened the console. In 1555 this was called "witchcraft". Try typing ` on the page.', 'color:#ffb547');
    console.log('%cHe also answers to his name in here.', 'color:#97a1b3');
    Object.defineProperty(window, 'buffadamus', { configurable: true, get() { unlock('witchcraft'); flash(); return 'You called? Witchcraft confirmed. In 1555 this would have ended badly for both of us.'; } });
  } catch {}

  // ---------- time tunnel ----------
  const cv = $('#tunnel'), g = cv.getContext('2d');
  let W, H, DPR, stars = [];
  function size() {
    DPR = Math.min(2, devicePixelRatio || 1); W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    stars = Array.from({ length: Math.min(420, (innerWidth * innerHeight) / 3000 | 0) }, () => newStar(true));
  }
  function newStar(any) { return { a: Math.random() * Math.PI * 2, z: any ? Math.random() : 1, s: .2 + Math.random() * .8, h: Math.random() < .5 ? 0 : 1 }; }
  let mx = 0, my = 0;
  addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5); });
  addEventListener('scroll', () => { fx.warp = Math.min(1, fx.warp + .08); }, { passive: true });
  function frame(t) {
    const cx = W / 2 + mx * W * .08, cy = H * .42 + my * H * .08;
    g.fillStyle = document.body.classList.contains('y1555') ? 'rgba(239,228,200,.35)' : 'rgba(6,7,12,.28)';
    g.fillRect(0, 0, W, H);
    if (fx.rain && t < fx.rain) {
      const fs = 15 * DPR, cols = Math.ceil(W / fs); if (!fx.drops || fx.drops.length !== cols) fx.drops = Array.from({ length: cols }, () => Math.random() * -40);
      g.font = `${fs}px monospace`; g.fillStyle = 'rgba(70,255,140,.85)';
      fx.drops.forEach((d, i) => { if (d > 0) g.fillText(GL[(Math.random() * GL.length) | 0], i * fs, d * fs); fx.drops[i] = d * fs > H && Math.random() > .96 ? 0 : d + 1; });
    }
    // rings
    const R = Math.max(W, H);
    for (let i = 0; i < 6; i++) {
      const k = ((t / 6000 + i / 6) % 1); const r = k * k * R * .9;
      g.strokeStyle = i % 2 ? `rgba(255,61,139,${.10 * (1 - k)})` : `rgba(77,243,230,${.12 * (1 - k)})`;
      g.lineWidth = DPR; g.beginPath(); g.ellipse(cx, cy, r * 1.15, r * .8, 0, 0, Math.PI * 2); g.stroke();
    }
    const warp = fx.warp, sp = .0026 + warp * .02; fx.warp *= .96;
    for (const s of stars) {
      s.z -= sp * s.s * (1 + s.z); if (s.z <= .02) Object.assign(s, newStar(false));
      const d = (1 / s.z) * 22 * DPR, x = cx + Math.cos(s.a) * d * 1.15, y = cy + Math.sin(s.a) * d * .8;
      if (x < -50 || x > W + 50 || y < -50 || y > H + 50) { Object.assign(s, newStar(false)); continue; }
      const sz = (1 - s.z) * 2.2 * DPR;
      g.fillStyle = s.h ? fx.acc + '.85)' : 'rgba(255,181,71,.8)';
      g.fillRect(x, y, sz, sz * (1 + warp * 6));
    }
    if (!reduce && !document.hidden) requestAnimationFrame(frame);
  }
  size(); addEventListener('resize', size);
  if (reduce) { g.fillStyle = '#06070c'; g.fillRect(0, 0, W, H); frame(0); }
  else { requestAnimationFrame(frame); document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(frame); }); }
})();
