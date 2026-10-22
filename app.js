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
    ['onhold', 'Please continue to hold', 'He has been on hold since 1556. Hold him.'],
    ['recipe', 'Original recipe', 'Build the first machine he ever built.'],
    ['shades', 'Player one', 'Bring something back from the future. Then make him wear it.'],
    ['highscore', 'High score', 'Score 1555 in the machine that eats quarters.'],
    ['gate', 'The gate', 'Find all three keys.'],
    ['rabbit', 'Down the rabbit hole', 'Follow the white rabbit. It does not stay put.'],
    ['guestbook', 'Sign my guestbook', 'Leave a note in 1999.'],
    ['root', 'Root access granted', 'sudo needs a password. It is the year he left.'],
    ['backdoor', 'Backdoor', 'Scan the year he left. Something is listening on an open port.'],
    ['planet', 'Hack the planet', 'A 1995 movie told you what to hack. Ask the terminal.']
  ];
  const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty', 'Twenty-one', 'Twenty-two', 'Twenty-three', 'Twenty-four', 'Twenty-five', 'Twenty-six', 'Twenty-seven', 'Twenty-eight', 'Twenty-nine', 'Thirty', 'Thirty-one', 'Thirty-two', 'Thirty-three'];
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
    1602: 'Amsterdam invents the stock market: shares in ships that may or may not come back.\nI ask when my ship comes back. They say that is the fun part.',
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
    // no station markers on the dial: the signal meter is the only guide
    $('#trackArc').setAttribute('d', arcPath(-SWEEP / 2, SWEEP / 2, 150));
  })();
  const dots = [];

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
    if (dots.length) STATIONS.forEach((y, i) => {
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
    const changed = y !== cur; cur = y; copperCheck(y, settled);
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
    el.innerHTML = ps.map((p, i) => `<article class="card" tabindex="0"><div class="meta"><span>TX-${(0xA1 + i).toString(16).toUpperCase()}</span><span>${esc(p.date)}</span></div><p data-text="${esc(p.text)}"></p><a href="${esc(p.url)}" target="_blank" rel="noopener">${/\/status\//.test(p.url) ? 'View on X' : 'Follow on X'}</a></article>`).join('');
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
    'Yes. The no arrives separately, in about 400 years.',
    'My visions say yes. My accountant says to stop listening to my visions.',
    'The answer arrived corrupted: Y#$S. Possibly YES. Possibly YIKES.',
    'Ask again in 1556. I will be in a better mood. The plague will be over. Mostly.',
    'The stars say hold. The stars are also not licensed.',
    'Absolutely not. Unless it works. Then I said yes, in a different timeline.',
    'Prophecy pending. Estimated delivery: 3 to 400 years. Tracking number: [SIGNAL LOST]',
    'The candle flickered twice. That is either yes or a draft.',
    'I looked into the future. It looked back and asked me the same question.',
    'Error 1555: optimism not found.',
    'Every timeline I checked, you did it anyway. Some of them went great.',
    'Yes, but only in the timeline where you wore a hat. Find the hat.',
    'In 1555 we would have asked a goat. The goat said no. The goat was right.',
    'My crystal ball says yes. My crystal ball is a fishbowl.'
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
    else if (/(sunglasses|shades)/.test(q)) a = 'He does not own any. Yet. Things sometimes come back from the future.';
    else if (/time machine/.test(q)) a = 'Build one in the workshop. Then send it to me. The DeLorean and the hot tub did not work.';
    else if (/\bkeys?\b|gate/.test(q)) a = 'Three keys. Copper, jade, crystal. The gate does not take cards.';
    else if (/white rabbit|rabbit/.test(q)) a = 'It hides in corners. It does not like being looked at directly.';
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
    if (open) { if (!tout.textContent) tprint('chrono-terminal v2.0 (TimeOS 1555.2026)\ntype "help". tab completes. arrow keys remember.'); tin.focus(); unlock('terminal'); }
    else tin.blur();
  }
  $('#termBtn').onclick = () => toggleTerm(true);
  $('#termClose').onclick = () => toggleTerm(false);
  const CMDS = {
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
  // ---------- terminal v2: history, tab completion, sudo, fake hacking tools ----------
  const hist = store.get('termHist', []).slice(-50); let hIdx = hist.length, tBusy = false, isRoot = false, pw = null, sudoOk = false;
  const promptEl = $('#termForm span[aria-hidden]');
  const prompt = () => isRoot ? 'root@1555:~#' : 'buff@1555:~$';
  const setPrompt = () => { promptEl.textContent = prompt(); term.classList.toggle('root', isRoot); };
  function emit(r) {
    if (r == null) return Promise.resolve();
    if (!Array.isArray(r)) { tprint(r); return Promise.resolve(); }
    tBusy = true; tin.disabled = true;
    return new Promise(res => {
      let i = 0;
      const next = () => {
        if (i >= r.length) { tBusy = false; tin.disabled = false; tin.focus(); res(); return; }
        const ln = r[i++];
        if (typeof ln === 'function') { const v = ln(); if (v) tprint(v); } else tprint(ln);
        if (i % 2) beep(1500 + Math.random() * 500, .01, 'square', .008);
        setTimeout(next, reduce ? 0 : (typeof ln === 'string' && ln.startsWith('~') ? 400 : 70));
      };
      next();
    });
  }
  const hex = n => Array.from({ length: n }, () => '0123456789abcdef'[(Math.random() * 16) | 0]).join('');
  const PROCS = [
    ['1', 'root', '0.1', 'chronos --init', ''], ['42', 'buff', '99.9', 'prophecy.exe --corrupted', ''], ['88', 'buff', '12.0', 'flux_capacitor', ''],
    ['1555', 'root', '0.0', 'astrolabe.d', ''], ['1983', 'buff', '33.3', 'hold_music.mp3 --loop', ''], ['1999', 'root', '7.0', 'y2k_bunker --beans', ''],
    ['2008', 'buff', '0.0', 'housing_market (zombie)', ''], ['2026', 'buff', '5.5', 'doomscroll', ''], ['6000', 'goat', '61.0', 'goat --in-charge', '']
  ];
  const KILL = { '42': 'prophecy.exe restarted. it always restarts.', '1983': 'hold music stopped. it started again. you are still on hold.', '2008': 'cannot kill zombie process. it got bailed out.', '6000': 'permission denied. the goat outranks you.', '1': 'you cannot kill time. it kills you.' };
  function cal1752() { return ['   September 1752', 'Su Mo Tu We Th Fr Sa', '       1  2 14 15 16', '17 18 19 20 21 22 23', '24 25 26 27 28 29 30', '', 'eleven days were deleted. not by me. this time.']; }
  function calNow() {
    const d = new Date(), y = d.getFullYear(), m = d.getMonth(), first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    const L = ['    ' + d.toLocaleString('en-US', { month: 'long' }) + ' ' + y, 'Su Mo Tu We Th Fr Sa']; let row = '   '.repeat(first);
    for (let i = 1; i <= days; i++) { row += String(i).padStart(2, ' ') + ' '; if ((first + i) % 7 === 0 || i === days) { L.push(row.trimEnd()); row = ''; } }
    return L;
  }
  const MAN = {
    nmap: 'nmap - network mapper. scans hosts for open ports. try a year.', nc: 'nc - netcat. connects to a host and port. pairs well with nmap.',
    sudo: 'sudo - do something as root. needs a password. the password is not "password".', ping: 'ping - checks if a year is still there.',
    traceroute: 'traceroute - shows every year between here and there.', ssh: 'ssh - secure shell. not invented in 1555.', hack: 'hack - see: a 1995 movie.',
    cowsay: 'cowsay - a cow says things. a goat was unavailable.', neofetch: 'neofetch - system info, for showing off.', man: 'man - manual. you are reading it. hello.'
  };
  const COMMANDS = ['help', 'man', 'whoami', 'date', 'cal', 'year', 'scan', 'stations', 'ls', 'cd', 'pwd', 'cat', 'echo', 'history', 'clear', 'exit', 'uname', 'neofetch', 'uptime', 'ps', 'top', 'kill', 'free', 'df',
    'ifconfig', 'ping', 'traceroute', 'nmap', 'nc', 'telnet', 'ssh', 'whois', 'dig', 'curl', 'wget', 'git', 'sudo', 'su', 'crontab', 'cowsay', 'fortune', 'sl', 'vim', 'emacs', 'cmatrix', 'hack', 'mine', 'tree',
    'prophesy', 'riddle', 'answer', 'keys', 'arcade', 'konami', 'sound', 'anomalies', 'xyzzy'];
  function termPlus(raw, c) {
    const [cmd, ...args] = c.split(/\s+/), a = args.join(' ');
    if (isRoot && c === 'whoami') return 'root. drunk with power. still stuck in 2026.';
    if (isRoot && c === 'exit') { isRoot = false; setPrompt(); return 'logout. back to being a regular prophet.'; }
    switch (cmd) {
      case 'help': return ['chrono-terminal help', '  basics    whoami date cal year <n> ls cd pwd cat <file> echo history clear exit', '  system    uname -a neofetch uptime ps aux top kill <pid> free -h df -h crontab -l', '  network   ifconfig ping <host> traceroute <host> nmap <host> nc <host> <port> ssh whois dig curl wget', '  dev       git log git blame vim emacs sudo su', '  fun       prophesy fortune cowsay <text> sl cmatrix hack mine scan stations konami sound anomalies', '  man <command> explains things. some commands are not listed. obviously.'];
      case 'man': return a ? (MAN[a] || `no manual entry for ${a}. it may not be invented yet.`) : 'what manual page do you want? (try: man nmap)';
      case 'pwd': return '/home/buff/2026  (should be /home/buff/1555)';
      case 'cd': return !a || a === '~' ? '' : a === '..' ? 'you are already at the bottom of history.' : /^\/?(past|1555)/.test(a) ? 'cd: permission denied: time machine required' : `cd: ${a}: no such era`;
      case 'echo': return a === '$path' ? '/usr/bin:/bin:/past:/future:/dev/null/1556' : a === '$home' ? '/home/buff/1555 (unreachable)' : raw.slice(5);
      case 'history': return hist.slice(-15).map((h, i) => String(i + 1).padStart(4) + '  ' + h).concat(['   --  1555  built time machine', '   --  1555  sudo trust confidence', '   --  2026  why']);
      case 'uname': return 'TimeOS 1555.2026-glitch #1 SMP PREEMPT Sat Nov 12 22:04:00 1955 astrolabe GNU/Nostradamus';
      case 'neofetch': return ['        .-"""-.         buff@1555', '       /  _ _  \\        ---------', '      |  (o o)  |       OS: TimeOS 1555.2026 (glitched)', '      |   ___   |       Host: astrolabe (refurbished)', '       \\  \\_/  /        Kernel: 1555.2026-corrupted', "     ___'-...-'___      Uptime: 471 years", '    /  ruff ruff  \\     Shell: buffsh 0.1', '   |  ~~~~~~~~~~~  |    CPU: 2x candle @ 0.0001 GHz', '   |   1555-2026   |    Memory: ??? / 1555 MB (corrupted)', '                        Warranty: expired (1556)'];
      case 'uptime': return ` ${new Date().toTimeString().slice(0, 8)} up 471 years, 2 users (you, the goat), load average: 15.55, 20.26, 0.00`;
      case 'ps': case 'top': case 'htop': return ['  PID USER   %CPU COMMAND'].concat(PROCS.map(p => p[0].padStart(5) + ' ' + p[1].padEnd(6) + ' ' + p[2].padStart(4) + ' ' + p[3]));
      case 'kill': { const pid = args.filter(x => !x.startsWith('-'))[0]; return !pid ? 'kill: usage: kill <pid> (try ps aux)' : KILL[pid] || (PROCS.some(p => p[0] === pid) ? `killed ${pid}. it was not important. probably.` : `kill: (${pid}): no such process. lucky it.`); }
      case 'free': return ['              total     used     free', 'Mem:           1555     1555        0', 'Swap:          2026     2026        0', 'all memory is being used by the hold music.'];
      case 'df': return ['Filesystem   Size  Used Avail Mounted on', '/dev/past     545y  471y   74y /past', '/dev/future   ???   ???   ??? /future', '/dev/beans    1.2T  1.2T     0 /bunker'];
      case 'crontab': return '0 8 * * * /usr/bin/prophesy --corrupted --post-to-x\n@yearly /usr/bin/renew-warranty  # failing since 1556';
      case 'ifconfig': case 'ip': return ['astrolabe0: flags=4163<UP,BROADCAST,RUNNING,TEMPORAL>  mtu 1555', '        inet 15.55.20.26  netmask 255.255.0.0', 'flux0: flags=88<UP,88MPH>  mtu 121', '        inet 19.55.10.04', 'lo: flags=73<UP,LOOPBACK>  loops through 2026 forever'];
      case 'ping': { const h = a || '1555'; return [`PING ${h} (15.55.20.26): 56 data bytes`, `64 bytes from ${h}: icmp_seq=0 ttl=1555 time=471 years`, `Request timeout for icmp_seq 1`, `64 bytes from ${h}: icmp_seq=2 ttl=1555 time=471 years (corrupted)`, `Request timeout for icmp_seq 3`, `--- ${h} ping statistics ---`, '4 packets transmitted, 2 received, 50% packet loss. the other half arrived in 1720.']; }
      case 'traceroute': case 'tracert': { const h = a || '1555'; return [`traceroute to ${h}, 30 hops max`, ' 1  2026.local      0.1 ms', ' 2  2008.crash       * * *  (housing market down)', ' 3  1999.y2k         2 ms   (beans detected)', ' 4  1987.monday      * * *', ' 5  1929.crash       * * *', ' 6  1720.southsea    BUY... [signal lost]', ' 7  1637.tulips      1 ms   (overvalued)', h.includes('1555') ? ' 8  1555.origin      reply: "who is this"' : ` 8  ${h}  unreachable from this timeline`]; }
      case 'nmap': { const h = a.replace(/-\S+\s*/g, '') || ''; if (!h) return 'nmap: usage: nmap <host>  (try a year)';
        if (!/1555/.test(h)) return [`Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleString('sv-SE').slice(0, 16)} local`, `Nmap scan report for ${h}`, 'All 1000 scanned ports are filtered (mostly by the present).', 'Nmap done: 1 IP address (1 host up). nothing interesting. try the year he left.'];
        return [`Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleString('sv-SE').slice(0, 16)} local`, 'Nmap scan report for 1555.origin (15.55.20.26)', 'Host is up (471y latency).', 'PORT      STATE     SERVICE', '22/tcp    closed    ssh (not invented yet)', '80/tcp    filtered  http (filtered by the church)', '1555/tcp  open      astrolabe', '8888/tcp  open      prophecy-backdoor', '', 'Nmap done: 1 IP address (1 host up) scanned in 471.00 years'];
      }
      case 'nc': case 'netcat': case 'telnet': {
        if (/1555/.test(a) && /8888/.test(a)) return ['Connection to 1555 port 8888 [tcp/prophecy-backdoor] succeeded!', '~', '<1555> who is this', '<1555> how are you using my astrolabe', '<1555> if you are reading this, i am stuck in your year. send help. or a better time machine.', '<1555> also: did the tulips work out?', () => { setTimeout(() => unlock('backdoor'), 300); return 'Connection closed by foreign host (it is 1555, they do not have hosts).'; }];
        if (/towel\.blinkenlights/.test(a)) return 'connecting to a galaxy far away... the episode is still buffering since 1977.';
        return a ? `nc: connect to ${a} failed: connection refused. try a port that is actually open.` : 'usage: nc <host> <port>';
      }
      case 'ssh': return a ? `ssh: connect to host ${a.split('@').pop()} port 22: connection refused (ssh will not be invented for 440 years). try a port that is open.` : 'usage: ssh user@host';
      case 'whois': return ['Domain Name: BUFFADAMUS.COM', 'Registrant: Buffadamus, Salon-de-Provence, 1555', 'Registrar: probably a guy with a quill', 'Creation Date: 1555-01-01 (approx.)', 'Expiry Date: 1556 (like everything else)'];
      case 'dig': case 'nslookup': return [`;; ANSWER SECTION:`, `${a || '1555'}.  471  IN  A  15.55.20.26`, ';; SERVER: astrolabe#53 (it guessed)'];
      case 'curl': return /wttr/.test(a) ? 'Weather for 1555: cloudy, 9 C, chance of plague 40%.' : /buffadamus/.test(a) ? '<!doctype html><title>Buffadamus</title><!-- you are already here. -->' : a ? `curl: (6) could not resolve host: ${a}. it does not exist yet.` : 'curl: try "curl wttr.in"';
      case 'wget': { const f = a || 'time_machine.zip'; return [`--${new Date().toLocaleString('sv-SE').slice(0, 19)}--  https://1555.origin/${f}`, 'Connecting to 1555.origin|15.55.20.26|:1555... connected.', () => '[=====>              ] 31%  carrier pigeon', () => '[=============>      ] 72%  carrier pigeon (tired)', () => '[===================] 100%', `saved: '${f}' (0 bytes). corrupted, as expected.`]; }
      case 'git': return /blame/.test(a) ? 'git blame: every line was written by the goat.' : /log/.test(a) || !a ? ['commit 1555a  fix: time machine (did not fix)', 'commit 1556b  chore: warranty expired', 'commit 1955c  feat: add 1.21 gigawatts', 'commit 2026d  revert: confidence', 'commit 2026e  wip: get home'] : /push/.test(a) ? 'git push: rejected. the past is read-only.' : `git: '${a}' is not a git command. neither is time travel.`;
      case 'su': if (isRoot) return 'you are already root.'; pw = { cmd: 'su', tries: 0 }; tin.type = 'password'; return 'Password:';
      case 'sudo': {
        if (!a) return 'usage: sudo <command>';
        if (a === 'make me a sandwich') return sudoOk || isRoot ? 'okay.' : (pw = { cmd: a, tries: 0 }, tin.type = 'password', '[sudo] password for buff:');
        if (isRoot || sudoOk) return runSudo(a);
        pw = { cmd: a, tries: 0 }; tin.type = 'password'; return '[sudo] password for buff:';
      }
      case 'make': return a === 'me a sandwich' ? 'what? make it yourself.' : /coffee/.test(a) ? '418 I\'m a teapot.' : `make: *** no rule to make target '${a}'. stop.`;
      case 'cowsay': { const t = (raw.slice(7) || 'moo. buy low.').slice(0, 40), l = t.length + 2; return [' ' + '_'.repeat(l), `< ${t} >`, ' ' + '-'.repeat(l), '        \\   ^__^', '         \\  (oo)\\_______', '            (__)\\       )\\/\\', '                ||----w |', '                ||     ||']; }
      case 'fortune': return ANS[(Math.random() * ANS.length) | 0];
      case 'sl': return ['      ====        ________', '  _D _|  |_______/        \\__I_I_____', '   |(_)---  |   H\\________/ |   |', '   /     |  |   H  |  |     |   |', '  |      |  |   H  |__-----------------|', '  | ________|___H__/__|_____/[][]~\\_______|', '  |/ |   |-----------I_____I [][] []  D   |', '__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___', '   you meant ls. the train does not care.'];
      case 'vim': case 'vi': case 'nano': vimMode = true; return 'you are now stuck in vim. like me in 2026. type :q to escape.';
      case ':q': case ':q!': case ':wq': case ':x': if (vimMode) { vimMode = false; return 'you escaped vim. that is harder than time travel. respect.'; } return 'not in vim. nobody knows how they got here though.';
      case 'emacs': return 'emacs is still loading. it started in 1976.';
      case 'cmatrix': fx.rain = performance.now() + 7000; return 'wake up, user.';
      case 'hack': return a === 'the planet' ? ['initializing...', ...Array.from({ length: 10 }, () => () => hex(8) + ' ' + hex(8) + ' ' + hex(8) + ' ' + hex(8)), '~', 'ACCESS GRANTED', 'HACK THE PLANET!', () => { flash(); setTimeout(() => unlock('planet'), 400); return '(1995 called. it is proud of you.)'; }] : 'hack what? be specific. a 1995 movie had a suggestion.';
      case 'mine': return ['mining with 2x candle @ 0.0001 GHz...', () => 'hashrate: 0.000002 H/s', () => 'hashrate: 0.000001 H/s (one candle went out)', 'found: 0.00000001 BTC. electricity cost: one candle. net: -1 candle.'];
      case 'tree': return ['/', '|-- past', '|   |-- 1555 (home, unreachable)', '|   |-- 1929 (do not open)', '|   `-- 1999 (beans)', '|-- present', '|   `-- 2026 (you are here. so is he.)', '`-- future', '    `-- 2099 (last clean signal)'];
      case 'xyzzy': return 'Nothing happens.';
      case 'hello': case 'hi': return 'hello, user. it is the present day. do you know where your prophecies are?';
      case 'cal': return /1752/.test(a) ? cal1752() : calNow();
      case 'ls': if (a === '/') return 'bin  dev  etc  home  past  present  future  tmp  bunker'; if (/past/.test(a)) return '1555  1637  1666  1720  1849  1929  1999  ...'; if (/future/.test(a)) return 'permission denied: you have to wait like everyone else.'; return undefined;
      case 'cat': if (a === '/etc/passwd') return ['root:x:0:0:Nostradamus:/root:/bin/prophesy', 'buff:x:1555:1555:Buffadamus:/home/buff:/bin/buffsh', 'warren:x:1930:1930:Rule No. 1:/omaha:/bin/never-lose-money', 'goat:x:6000:6000:in charge:/barn:/bin/no', '# the password is not in here. it never is.'];
        if (a === '/etc/shadow') return isRoot ? 'root:$1555$astrolabe$:the year he left (you already know)' : 'cat: /etc/shadow: permission denied. nice try.';
        return undefined;
      default: return undefined;
    }
  }
  let vimMode = false;
  function runSudo(cmd) {
    if (/^(su|-i|su -|-s)$/.test(cmd)) { isRoot = true; setPrompt(); flash(); setTimeout(() => unlock('root'), 300); return 'root shell granted. with great power comes great nothing, the timeline is still read-only.'; }
    if (/^rm\s+-rf\s+\/\*?$/.test(cmd) || cmd === 'rm -rf --no-preserve-root /') return ['removing /past/1929 ...', 'removing /past/2008 ...', 'removing /bunker/beans ...', 'removing /present/mondays ...', '~', 'just kidding. the timeline is read-only. you monster.'];
    if (cmd === 'make me a sandwich') return 'okay.';
    const r = termPlus(cmd, cmd); if (r !== undefined) return r;
    if (CMDS[cmd]) return CMDS[cmd]();
    return `sudo: ${cmd}: command not found, even with power.`;
  }
  function handlePassword(raw) {
    tin.type = 'text';
    const p = pw;
    if (raw === '1555') {
      pw = null; sudoOk = true;
      if (p.cmd === 'su') { isRoot = true; setPrompt(); flash(); setTimeout(() => unlock('root'), 300); emit('root shell granted.'); return; }
      emit(runSudo(p.cmd)); return;
    }
    p.tries++;
    if (p.tries >= 3) { pw = null; emit(['sudo: 3 incorrect password attempts', 'this incident will be reported. to Nostradamus. he already knew.']); return; }
    tin.type = 'password'; emit(['Sorry, try again.', p.cmd === 'su' ? 'Password:' : '[sudo] password for buff:']);
  }
  tin.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && hist.length && !pw) { e.preventDefault(); hIdx = Math.max(0, hIdx - 1); tin.value = hist[hIdx] || ''; }
    else if (e.key === 'ArrowDown' && !pw) { e.preventDefault(); hIdx = Math.min(hist.length, hIdx + 1); tin.value = hist[hIdx] || ''; }
    else if (e.key === 'Tab') {
      e.preventDefault(); const v = tin.value.toLowerCase(); if (!v || v.includes(' ')) return;
      const m = COMMANDS.filter(x => x.startsWith(v));
      if (m.length === 1) tin.value = m[0] + ' '; else if (m.length > 1) tprint(m.join('  '));
    }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); tout.textContent = ''; }
    else if (e.key === 'c' && e.ctrlKey && !window.getSelection().toString()) { e.preventDefault(); tprint(prompt() + ' ' + tin.value + '^C'); tin.value = ''; if (pw) { pw = null; tin.type = 'text'; } }
  });
  $('#termForm').addEventListener('submit', e => {
    e.preventDefault(); const raw = tin.value.trim(); tin.value = '';
    if (pw) { tprint(''); handlePassword(raw); return; }
    if (!raw || tBusy) return;
    hist.push(raw); if (hist.length > 50) hist.shift(); hIdx = hist.length; store.set('termHist', hist);
    tprint(prompt() + ' ' + raw);
    const c = raw.toLowerCase().replace(/\s+/g, ' ');
    let r;
    if (CMDS[c] && !(isRoot && (c === 'exit' || c === 'whoami'))) r = CMDS[c]();
    else if ((r = termPlus(raw, c)) !== undefined) { /* handled */ }
    else if (/^year\s+0+$/.test(c)) { toggleTerm(false); yearZero(); r = 'year 0000 requested. that is a problem.'; }
    else if (c.startsWith('year ')) { const v = Math.max(1555, Math.min(2099, parseInt(c.slice(5), 10) || 2026)); stopScan(); jumpTo(v); r = 'tuning to ' + v + '. ' + (TX[v] ? 'live signal detected.' : 'expect static.'); }
    else if (c.startsWith('cat ')) { const f = FILES[c.slice(4).trim()]; r = typeof f === 'function' ? f() : f || 'cat: no such file. or not yet.'; }
    else if (c === '1555') { unlock('origin'); r = 'origin ping returned: "who is this"'; }
    else if (c === 'buffett') { unlock('oracle'); r = 'rule no. 1: never lose money. rule no. 2: never trust a time machine.'; }
    else if (c.startsWith('rm ')) r = 'nice try. the timeline is read-only.';
    else { const x = termExtra(c); r = x === undefined ? `${c.split(' ')[0]}: command not found. it may not be invented yet.` : x; }
    emit(r); beep(700, .03);
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

  // ================= v10: workshop, three keys, arcade, shades, rabbit =================
  var v10 = false;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const hashStr = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  // ---------- time machine workshop v2: chassis + power + navigation + a curio ----------
  // line-art icons, 64x64, stroke = currentColor
  const ICON = {
    gullwing: '<path d="M4 44h56l-3-9-13-5H23l-12 6-7 2z"/><circle cx="17" cy="45" r="6"/><circle cx="47" cy="45" r="6"/><path d="M26 30l6-16 11 4-4 12M8 40h8M50 36h6"/>',
    hottub: '<path d="M7 30h50v15a7 7 0 0 1-7 7H14a7 7 0 0 1-7-7z"/><path d="M7 36h50M14 52v5M50 52v5"/><circle cx="20" cy="24" r="3"/><circle cx="31" cy="18" r="4"/><circle cx="43" cy="24" r="3"/><path d="M24 12c-2-3 2-5 0-8M38 12c-2-3 2-5 0-8"/>',
    booth: '<path d="M18 10h28v48H18zM16 10h32M24 6h16v4M18 18h28"/><path d="M22 22h9v12h-9zM33 22h9v12h-9zM22 38h9v12h-9zM33 38h9v12h-9z"/><path d="M27 14h10"/>',
    policebox: '<path d="M16 16h32v42H16zM14 16h36M20 11h24v5M30 4h4v7h-4z"/><path d="M20 22h24M32 22v36M21 27h9v8h-9zM34 27h9v8h-9zM21 39h9v8h-9zM34 39h9v8h-9z"/>',
    locomotive: '<path d="M8 40V24h22v16M30 30h20l6 10H8"/><path d="M14 24v-9h6v9M40 30v-8h8v8"/><circle cx="16" cy="46" r="6"/><circle cx="34" cy="46" r="6"/><circle cx="50" cy="47" r="4"/><path d="M15 12c-3-2 1-5-2-8M22 10c3-2-1-5 2-7"/>',
    chair: '<path d="M20 6v52M20 32h24v26M20 32h26M44 32v-4M20 12h4M20 20h4M20 26h4"/><path d="M46 14l4-4M50 18l5-2" opacity=".6"/>',
    lightning: '<path d="M36 4L16 36h14l-4 24 22-34H34z"/><text x="50" y="58" font-size="10" text-anchor="middle" fill="currentColor" stroke="none">1.21</text>',
    plutonium: '<path d="M20 14h24v40H20zM18 14h28M18 54h28M24 8h16v6"/><circle cx="32" cy="34" r="3"/><path d="M32 31l-5-9a11 11 0 0 1 10 0zM29 36l-10 1a11 11 0 0 0 5 9zM35 36l5 9a11 11 0 0 0 5-9z"/>',
    candles: '<path d="M18 26h10v30H18zM36 22h10v34H36zM14 56h36"/><path d="M23 26v-4M41 22v-4"/><path d="M23 20c-4-4 0-9 0-12 2 4 4 7 0 12zM41 16c-4-4 0-9 0-12 2 4 4 7 0 12z"/>',
    fusion: '<path d="M20 22h24l-2 34H22zM18 22h28M26 22v-6h12v6"/><path d="M38 16c2-6 8-9 14-8-3 2-6 4-8 8M38 16c-2-3-6-4-10-3"/><circle cx="32" cy="40" r="5"/>',
    hamster: '<circle cx="30" cy="32" r="22"/><circle cx="30" cy="32" r="3"/><path d="M30 10v44M8 32h44M14 16l32 32M46 16L14 48"/><path d="M40 46c2-5 9-5 11 0 1 4-3 6-6 6s-6-2-5-6z"/><path d="M30 54l-6 6M30 54l6 6"/>',
    astrolabe: '<circle cx="32" cy="34" r="22"/><circle cx="32" cy="34" r="14"/><path d="M32 4v8M10 34h44M32 12v44M18 20l28 28"/><circle cx="32" cy="8" r="3"/>',
    flux: '<path d="M10 10h44v44H10z"/><path d="M32 34L18 18M32 34L46 18M32 34v16"/><circle cx="18" cy="18" r="3"/><circle cx="46" cy="18" r="3"/><circle cx="32" cy="50" r="3"/><circle cx="32" cy="34" r="4"/>',
    sundial: '<ellipse cx="32" cy="46" rx="26" ry="10"/><path d="M32 46L32 14 50 46"/><path d="M10 44l-2 2M16 39l-2-2M24 37v-2M40 37v-2M48 39l2-2M54 44l2 2"/><path d="M6 46v6c0 6 12 10 26 10s26-4 26-10v-6"/>',
    crystal: '<circle cx="32" cy="28" r="18"/><path d="M18 50h28l4 8H14zM22 44l-4 6M42 44l4 6"/><path d="M24 20c3-4 7-5 11-4M44 26l3-1M42 14l2-3M47 20l3-1"/>',
    gps: '<path d="M14 8h36v48H14z"/><path d="M18 14h28v24H18z"/><path d="M32 18l6 14-6-3-6 3z"/><path d="M20 44h24M20 50h14"/>',
    almanac: '<path d="M14 8h30a6 6 0 0 1 6 6v42H20a6 6 0 0 1-6-6z"/><path d="M14 50a6 6 0 0 1 6-6h30"/><path d="M22 16h20M22 22h20M24 30h16"/><text x="32" y="40" font-size="8" text-anchor="middle" fill="currentColor" stroke="none">1950-2000</text>',
    top: '<path d="M32 4v12M18 22h28l-14 34z"/><path d="M18 22c0-4 6-6 14-6s14 2 14 6"/><path d="M50 30c4 2 4 6 0 8M14 30c-4 2-4 6 0 8"/><ellipse cx="32" cy="58" rx="8" ry="2"/>',
    alarm: '<path d="M8 26h48v24H8z"/><path d="M14 32h18v12H14z"/><text x="23" y="42" font-size="9" text-anchor="middle" fill="currentColor" stroke="none">6:00</text><circle cx="46" cy="38" r="6"/><path d="M12 50l-2 6M52 50l2 6M20 26l6-10h12l6 10"/>',
    hoverboard: '<path d="M6 34c0-6 4-8 10-8h32c6 0 10 2 10 8s-4 8-10 8H16c-6 0-10-2-10-8z"/><path d="M14 34h36M18 46l-4 6M32 46v6M46 46l4 6" opacity=".7"/>',
    hourglass: '<path d="M20 10h24M20 54h24M22 10c0 14 20 16 20 22s-20 8-20 22M42 10c0 14-20 16-20 22s20 8 20 22"/><path d="M32 4c-4 0-8 3-8 6M32 4c4 0 8 3 8 6"/><path d="M28 50h8"/>',
    redpill: '<path d="M14 40l18-18a8 8 0 0 1 12 12L26 52a8 8 0 0 1-12-12z"/><path d="M23 31l12 12"/><circle cx="48" cy="14" r="3"/><path d="M48 20v8"/>',
    ticket: '<path d="M6 18h52v8a6 6 0 0 0 0 12v8H6v-8a6 6 0 0 0 0-12z"/><path d="M16 24h32M16 32h20M16 40h26"/><path d="M46 30l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z"/>',
    slippers: '<path d="M6 44c0-8 6-12 14-12h8c4 0 6 4 6 8v6c0 4-4 6-8 6H12c-4 0-6-4-6-8z"/><path d="M32 40c0-8 6-12 14-12h6c4 0 6 4 6 8v4c0 4-4 6-8 6H38"/><path d="M14 38l2 2M20 36l2 2M26 38l-2 2M40 34l2 2M46 32l2 2M52 34l-2 2"/>',
    pocketwatch: '<circle cx="32" cy="36" r="20"/><circle cx="32" cy="36" r="16"/><path d="M32 36V24M32 36l8 6M28 10h8v6h-8zM32 4v6"/>'
  };
  const icon = (id, cls) => `<svg viewBox="0 0 64 64" class="ico ${cls || ''}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICON[id]}</svg>`;
  // [id, name, note, stats]
  const PARTS2 = {
    chassis: [
      ['gullwing', 'Gullwing coupe', 'Stainless steel. Doors open up, like your expectations.', { s: 70, a: 60 }],
      ['hottub', 'Hot tub', 'Seats four. Previously owned. Do not ask.', { s: 35, a: 25 }],
      ['booth', 'Phone booth', 'Takes quarters. Historians love it.', { s: 60, a: 55 }],
      ['policebox', 'Blue police box', 'Bigger on the inside. So is the rent.', { s: 90, a: 40 }],
      ['locomotive', 'Steam locomotive', 'Will not go back once it leaves.', { s: 80, a: 55 }],
      ['chair', 'Wooden chair', 'His original chassis. Mostly confidence.', { s: 15, a: 95 }]
    ],
    power: [
      ['lightning', '1.21 gigawatts', 'Requires a clock tower and perfect timing.', { p: 100 }],
      ['plutonium', 'Plutonium', 'Borrowed. Do not ask from whom.', { p: 92 }],
      ['fusion', 'Kitchen fusion', 'Runs on banana peels and old coffee.', { p: 85 }],
      ['candles', 'Two candles', 'The 1555 standard. Bring a spare.', { p: 8 }],
      ['hamster', 'Hamster wheel', 'One hamster. Unionized.', { p: 3 }]
    ],
    nav: [
      ['flux', 'Flux capacitor', 'Shaped like a Y. Nobody knows why.', { a: 85 }],
      ['astrolabe', 'Astrolabe', 'Points at the stars. Mostly the past.', { a: 92 }],
      ['sundial', 'Sundial', 'Accurate on sunny days. Oregon: not accurate.', { a: 30 }],
      ['crystal', 'Crystal ball', 'Foggy. Leans toward the future.', { a: 25 }],
      ['gps', 'GPS from 2009', 'Recalculating. Recalculating.', { a: 35 }]
    ]
  };
  const CURIOS = [
    ['almanac', 'Sports almanac', 'Covers 1950 to 2000. Do not tell the SEC.'],
    ['top', 'Spinning top', 'If it keeps spinning, you are dreaming.'],
    ['alarm', 'Clock radio', 'Set to 6:00 AM. Forever.'],
    ['hoverboard', 'Hoverboard', 'Pink. Does not work on water.'],
    ['hourglass', 'Hourglass necklace', 'Three turns. Three hours. No more.'],
    ['redpill', 'Red pill', 'Or was it blue. It was red.'],
    ['ticket', 'Golden ticket', 'Admits one. Tour includes a river of chocolate.'],
    ['slippers', 'Ruby slippers', 'Click three times. Results vary.'],
    ['pocketwatch', 'Pocket watch', 'Perfect time. Wrong year.']
  ];
  const ALLP = Object.fromEntries([...PARTS2.chassis, ...PARTS2.power, ...PARTS2.nav, ...CURIOS].map(p => [p[0], p]));
  const pick = { chassis: null, power: null, nav: null, curio: null };
  let curioShown = [];
  const shopEl = $('#shop2');
  function shuffleCurios() { curioShown = CURIOS.map(c => c[0]).sort(() => Math.random() - .5).slice(0, 4); if (!curioShown.includes(pick.curio)) pick.curio = null; }
  function cardHtml(cat, [id, name, note]) {
    return `<button type="button" class="pc${pick[cat] === id ? ' on' : ''}" data-cat="${cat}" data-id="${id}" aria-pressed="${pick[cat] === id}" title="${esc(note)}">${icon(id)}<span class="pn">${esc(name)}</span></button>`;
  }
  function paintShop() {
    const row = (cat, label, list, opt) => `<div class="prow"><div class="plbl">${label}${opt ? ' <i>optional</i>' : ''}</div><div class="pcs">${list.map(p => cardHtml(cat, p)).join('')}</div></div>`;
    $('#partRows').innerHTML = row('chassis', 'CHASSIS', PARTS2.chassis) + row('power', 'POWER', PARTS2.power) + row('nav', 'NAVIGATION', PARTS2.nav)
      + row('curio', 'CURIO DRAWER', CURIOS.filter(c => curioShown.includes(c[0])), true);
    const slots = ['chassis', 'power', 'nav', 'curio'].map(cat => {
      const id = pick[cat];
      return `<div class="bp-slot${id ? ' full' : ''}">${id ? icon(id, 'big') : '<span class="q">?</span>'}<span class="bp-lbl">${cat === 'nav' ? 'NAV' : cat.toUpperCase()}</span></div>`;
    }).join('<span class="bp-plus">+</span>');
    $('#blueprint').innerHTML = slots;
    const c = pick.chassis && PARTS2.chassis.find(x => x[0] === pick.chassis)[3], pw = pick.power && PARTS2.power.find(x => x[0] === pick.power)[3], nv = pick.nav && PARTS2.nav.find(x => x[0] === pick.nav)[3];
    const bar = (n, v) => `<div class="stat"><span>${n}</span><i><b style="width:${v || 0}%"></b></i><em>${v == null ? '--' : v}</em></div>`;
    $('#stats').innerHTML = bar('POWER', pw ? pw.p : null) + bar('STABILITY', c ? c.s : null) + bar('ACCURACY', c && nv ? Math.round((c.a + nv.a) / 2) : null);
    const note = pick.curio || pick.nav || pick.power || pick.chassis;
    $('#partNote').textContent = note ? ALLP[note][1] + ': ' + ALLP[note][2] : 'Pick a chassis, a power source and a way to steer. The curio is optional and usually a mistake.';
    $('#launch').disabled = !(pick.chassis && pick.power && pick.nav);
  }
  $('#partRows').addEventListener('click', e => {
    const b = e.target.closest('.pc'); if (!b) return;
    const { cat, id } = b.dataset; pick[cat] = pick[cat] === id ? null : id;
    beep(420 + Object.keys(pick).indexOf(cat) * 140, .05, 'triangle', .03); paintShop();
  });
  const PRESENT = new Date().getFullYear();
  function machineRun() {
    const { chassis: c, power: p, nav: n, curio: x } = pick, h = hashStr(c + p + n + (x || ''));
    let y, line;
    if (c === 'chair' && p === 'candles' && n === 'astrolabe') { y = 1555; line = 'ORIGINAL RECIPE. A wooden chair, two candles, an astrolabe and a lot of confidence.\nYou arrive in 1555 for one second. Then the warranty expires again.'; }
    else if (p === 'hamster') { y = PRESENT; line = 'The hamster gives it everything. You arrive last Tuesday.\nThe hamster demands a pension.'; }
    else if (c === 'hottub') { y = 1986; line = 'You arrive in 1986 with three friends, a headache and no memory of the trip.'; }
    else if (c === 'booth') { y = 1988; line = 'You land in the middle of a history report. It goes most excellently.\nThe booth wants its quarter back.'; }
    else if (c === 'policebox') { y = 2077; line = 'Bigger on the inside. So is the rent.\nYou arrive in 2077 and still cannot afford it.'; }
    else if (c === 'locomotive' && n === 'flux') { y = 1885; line = 'The Old West. The train refuses to go back.\nSomeone named Mad Dog is already annoyed with you.'; }
    else if (c === 'gullwing' && n === 'flux' && p === 'lightning') { y = 1955; line = 'November 12, 10:04 PM. Lightning hits a clock tower.\nYou were aiming for 1555. One digit off. So close.'; }
    else if (c === 'gullwing' && n === 'flux' && p === 'plutonium') { y = 1985; line = 'You arrive in 1985 at 88 miles per hour.\nThe hot dog is $1.50. You consider staying.'; }
    else if (c === 'gullwing' && n === 'flux' && p === 'fusion') { y = 2015; line = 'October 21, 2015. No flying cars.\nThe self-lacing shoes, weirdly, happened.'; }
    else if (p === 'candles') { y = PRESENT - 1 - (h % 30); line = `Two candles get you as far as ${y}. One of them goes out.\nYou walk the rest of the way.`; }
    else if (n === 'gps') { y = 2009; line = 'Recalculating. Recalculating.\nYou arrive in 2009 in a parking lot behind a video store.'; }
    else if (n === 'crystal') { y = 2050 + (h % 49); line = `The crystal ball clears for one second. You arrive in ${y}.\nEverything is very shiny.`; }
    else if (n === 'sundial') { y = 1600 + (h % 200); line = `It was cloudy. The sundial guessed. You arrive in ${y}, damp.`; }
    else if (n === 'astrolabe') { y = 1556 + (h % 120); line = `The astrolabe points you toward home and misses by ${y - 1555} years.\nCloser than the DeLorean.`; }
    else { y = 1900 + (h % 199); line = `The flux capacitor fluxes. You arrive in ${y}, slightly sideways.`; }
    // curio twists
    if (x === 'almanac') line += '\nYou brought back a sports almanac. Buffett would call it insider trading. Nostradamus would call it Tuesday.';
    if (x === 'top') line += '\nThe top is still spinning. None of this happened.';
    if (x === 'alarm') { y = PRESENT; line = '6:00 AM. The clock radio plays the same song.\nIt is the same day again. And again.'; }
    if (x === 'hoverboard') { y = 2015; line = 'The hoverboard takes over. You arrive in 2015, over a pond.\nIt does not work on water.'; }
    if (x === 'hourglass') { y = PRESENT; line = 'Three turns. You arrive three hours ago and watch yourself build this machine.\nYou both pretend not to notice.'; }
    if (x === 'redpill') { y = null; line = 'You wake up in a pod. The year is unclear.\nThe pod is very sticky.'; }
    if (x === 'ticket') { y = 1971; line = 'A chocolate factory. Do not touch anything.\nDo not chew the gum. Do not sing along.'; }
    if (x === 'slippers') { y = 1939; line = 'You click your heels three times and arrive in 1939, in color.\nThere is no place like 1555. You are not in 1555.'; }
    if (x === 'pocketwatch') line += '\nThe pocket watch kept perfect time. The wrong time.';
    return { y, line, recipe: y === 1555 && !x };
  }
  let lastRig = null;
  $('#launch').onclick = () => {
    if ($('#launch').disabled) return;
    const r = machineRun(); lastRig = { ...r, parts: ['chassis', 'power', 'nav', 'curio'].map(k => pick[k]).filter(Boolean) };
    const rigEl = $('#rig2'), gauge = $('#charge'), yb = $('#rigYear');
    $('#rigAct').hidden = true; $('#launch').disabled = true;
    rigEl.classList.remove('go'); void rigEl.offsetWidth; rigEl.classList.add('go');
    sweep(90, 1800, 1.1, 'sawtooth', .025);
    let k = 0; const total = reduce ? 1 : 22;
    const t = setInterval(() => {
      k++; gauge.style.width = Math.min(100, k / total * 100) + '%'; yb.textContent = 1555 + ((Math.random() * 545) | 0);
      if (k >= total) {
        clearInterval(t); flash(); fx.warp = 1; gauge.style.width = '0%';
        yb.textContent = r.y == null ? '????' : r.y; scramble($('#rigLine'), r.line, 9);
        $('#rigAct').hidden = false; $('#rigTune').hidden = r.y == null; $('#launch').disabled = false;
        if (r.recipe) setTimeout(() => unlock('recipe'), 1800);
        if (r.y != null && r.y >= 2050 && !store.get('shadesFound', false)) setTimeout(() => {
          store.set('shadesFound', true); paintDrawer(true);
          say('<b>SOUVENIR.</b> Something came back from the future with you. It is in the drawer under the test pilot.', 5200);
        }, 2600);
        shuffleCurios(); paintShop();
      }
    }, 55);
  };
  $('#clearRig').onclick = () => { Object.keys(pick).forEach(k => pick[k] = null); paintShop(); };
  $('#rigShare').onclick = () => {
    if (!lastRig) return;
    let t = `I built @Buffadamus a time machine: ${lastRig.parts.map(id => ALLP[id][1]).join(' + ')}.\nResult: ${lastRig.line.replace(/\n/g, ' ')}`;
    if (t.length > 230) t = t.slice(0, 227) + '...';
    window.open('https://x.com/intent/post?text=' + encodeURIComponent(t + '\n#TimeMachineTips') + '&url=' + encodeURIComponent('https://buffadamus.com/#workshop'), '_blank', 'noopener');
  };
  $('#rigTune').onclick = () => { if (!lastRig || lastRig.y == null) return; $('#dial').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); setTimeout(() => jumpTo(lastRig.y), reduce ? 0 : 500); };

  // test pilot + the drawer (the sunglasses live here once you bring them back)
  const drawer = $('#drawer'), pilot = $('#pilot');
  function paintDrawer(fresh) {
    const has = store.get('shadesFound', false), worn = document.body.classList.contains('shades');
    drawer.classList.toggle('has', has && !worn);
    drawer.innerHTML = has && !worn
      ? `<button type="button" class="shades-item${fresh ? ' fresh' : ''}" id="shadesItem" aria-label="Sunglasses from the future. Drag them onto the test pilot's face, or press Enter to put them on him."><svg viewBox="0 0 64 14" shape-rendering="crispEdges"><path fill="#050505" stroke="#7dff9a" stroke-width=".6" d="M0 0h64v3H0zM4 3h24v8H4zM36 3h24v8H36zM6 11h20v2H6zM38 11h20v2H38zM28 3h8v3h-8z"/><path fill="#fff" d="M8 5h3v2H8zM11 7h3v2h-3zM40 5h3v2h-3zM43 7h3v2h-3z"/></svg></button><span class="dlbl">From the future. Drag them onto his face.</span>`
      : `<span class="dlbl">${worn ? 'Drawer empty. He is wearing them.' : 'Drawer: empty. Bring something back from the future.'}</span>`;
    pilot.classList.toggle('worn', worn);
    const it = $('#shadesItem'); if (it) wireDrag(it);
  }
  function wireDrag(it) {
    it.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wearShades(); } });
    it.addEventListener('pointerdown', e => {
      e.preventDefault();
      const ghost = it.cloneNode(true); ghost.classList.add('ghost-drag'); document.body.appendChild(ghost);
      const move = ev => { ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px'; pilot.classList.toggle('target', overFace(ev)); };
      const overFace = ev => { const r = pilot.querySelector('.pface').getBoundingClientRect(); return ev.clientX > r.left && ev.clientX < r.right && ev.clientY > r.top && ev.clientY < r.bottom; };
      const up = ev => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); ghost.remove(); pilot.classList.remove('target'); if (ev.type === 'pointerup' && overFace(ev)) wearShades(); else beep(200, .06, 'square', .02); };
      move(e); addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    });
  }
  function wearShades() { toggleShades(true); paintDrawer(); }
  pilot.addEventListener('click', () => { if (document.body.classList.contains('shades')) { toggleShades(false); paintDrawer(); } });

  shuffleCurios(); paintShop(); paintDrawer();

  // ---------- the three keys + the gate ----------
  const KEYS = ['copper', 'jade', 'crystal'];
  let keys = new Set(store.get('keys', []).filter(k => KEYS.includes(k)));
  function paintKeys(opening) {
    document.querySelectorAll('.key').forEach(k => k.classList.toggle('got', keys.has(k.dataset.key)));
    $('#hudKeys').textContent = `KEYS ${keys.size}/3`;
    $('#doorLbl').textContent = `LOCKED. ${keys.size} OF 3 KEYS.`;
    if (keys.size === 3) {
      let code = store.get('escCode', null);
      if (!code) { const r = new Uint32Array(1); (crypto.getRandomValues ? crypto.getRandomValues(r) : (r[0] = Math.random() * 4294967295)); code = 'BFD-' + (r[0] >>> 0).toString(16).toUpperCase().padStart(8, '0').replace(/(.{4})/, '$1-'); store.set('escCode', code); }
      $('#escCode').textContent = code;
      const d = $('#door');
      if (opening && !reduce) setTimeout(() => d.classList.add('open'), 400); else d.classList.add('open');
    }
  }
  function grantKey(k) {
    if (keys.has(k)) return;
    keys.add(k); store.set('keys', [...keys]);
    const name = k[0].toUpperCase() + k.slice(1);
    flash(); beep(660, .1, 'triangle', .05); setTimeout(() => beep(990, .16, 'triangle', .05), 110);
    say(`<b>${name.toUpperCase()} KEY.</b> ${keys.size} of 3. The gate to 1555 heard that.`, 4000);
    paintKeys(true);
    if (keys.size === 3) setTimeout(() => { $('#gate').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); sweep(80, 900, 1.4, 'sawtooth', .03); unlock('gate'); }, 2200);
  }
  $('#gateShare').onclick = () => {
    const code = $('#escCode').textContent;
    window.open('https://x.com/intent/post?text=' + encodeURIComponent(`I found all three keys on buffadamus.com and opened the gate to 1555.\nEscape code: ${code}\n@Buffadamus`) + '&url=' + encodeURIComponent('https://buffadamus.com/#gate'), '_blank', 'noopener');
  };
  $('#gateCopy').onclick = () => { const c = $('#escCode').textContent; (navigator.clipboard ? navigator.clipboard.writeText(c) : Promise.reject()).then(() => say('Copied: <b>' + c + '</b>'), () => say(c, 6000)); };
  // copper: tune to 20 + the current minute, in that minute
  let copperT = 0;
  function copperCheck(y, settled) {
    if (!v10) return;
    clearTimeout(copperT);
    if (keys.has('copper') || y !== 2000 + new Date().getMinutes()) return;
    copperT = setTimeout(() => { if (cur === y && !anim && y === 2000 + new Date().getMinutes()) { setState('KEY', 'anom'); body.textContent = 'A copper key falls out of the static.\nThe clock and the dial agree, for one minute.'; grantKey('copper'); } }, settled ? 350 : 900);
  }
  // jade: three riddles in the terminal
  const RIDDLES = [
    ['I have hands but hold nothing, a face but never smile, and I run all day without legs.', /^(a )?clocks?$/],
    ['I bloomed in 1637 and cost more than a canal house. By spring I was worth nothing.', /^(a )?tulips?( bulbs?)?$/],
    ['I expired in 1556 and nobody has renewed me since.', /^(the |a )?warrant(y|ies)$/]
  ];
  function termExtra(c) {
    let st = store.get('jade', 0);
    if (c === 'riddle' || c === 'riddles') {
      if (keys.has('jade')) return 'you already hold the jade key. the terminal has no more riddles. it is a little sad about it.';
      return `riddle ${st + 1} of 3:\n${RIDDLES[st][0]}\nreply with: answer <word>`;
    }
    if (c.startsWith('answer ')) {
      if (keys.has('jade')) return 'the jade key is already yours.';
      const a = c.slice(7).trim();
      if (!RIDDLES[st][1].test(a)) { beep(140, .2, 'square', .03); return 'wrong. the terminal sighs in binary. type riddle to hear it again.'; }
      st++; store.set('jade', st);
      if (st >= 3) { grantKey('jade'); return 'correct. a jade key slides out of the disk drive.'; }
      return `correct.\nriddle ${st + 1} of 3:\n${RIDDLES[st][0]}`;
    }
    if (c === 'arcade' || c === 'insert coin') { toggleTerm(false); openArcade(); return null; }
    if (c === 'sunglasses' || c === 'shades') return 'nice try. you have to find them. try the future.';
    if (c === 'keys') return KEYS.map(k => (keys.has(k) ? '[x] ' : '[ ] ') + k).join('\n');
    if (c === 'follow the white rabbit' || c === 'white rabbit') return 'it does not come when called. watch the corners.';
    return undefined;
  }

  // ---------- arcade: Escape 2026 ----------
  const arc = $('#arcade'), cv2 = $('#game'), gx = cv2.getContext('2d');
  const GW = 320, GH = 400;
  let game = null, gRaf = 0, keysDown = { l: false, r: false };
  $('#gHigh').textContent = store.get('high', 0);
  function openArcade() { arc.hidden = false; $('#gMsg').hidden = false; $('#gStart').focus(); drawIdle(); }
  function closeArcade() { arc.hidden = true; stopGame(); $('#arcadeBtn').focus(); }
  $('#arcadeBtn').onclick = openArcade;
  $('#gClose').onclick = closeArcade;
  arc.addEventListener('click', e => { if (e.target === arc) closeArcade(); });
  function drawIdle() {
    gx.fillStyle = '#05030c'; gx.fillRect(0, 0, GW, GH);
    for (let i = 0; i < 60; i++) { gx.fillStyle = i % 3 ? '#2a2050' : '#4df3e6'; gx.fillRect((i * 97) % GW, (i * 53) % GH, 2, 2); }
  }
  const CRASH = ['1929', '1637', '1720', '1987', '2000', '2008', 'Y2K', '2038'];
  const PICK = [['⚙', '#4df3e6', 100], ['⚡', '#ffb547', 100], ['\u{1F32D}', '#ff7a59', 150]];
  function startGame() {
    $('#gMsg').hidden = true; stopGame();
    game = { x: GW / 2, items: [], t0: performance.now(), last: performance.now(), spawn: 0, score: 0, lives: 3, hurt: 0, over: false, won: false, stars: Array.from({ length: 50 }, (_, i) => ({ x: (i * 97) % GW, y: (i * 53) % GH, s: 1 + (i % 3) })) };
    beep(880, .08, 'square', .04); setTimeout(() => beep(1320, .1, 'square', .04), 90);
    gRaf = requestAnimationFrame(tick);
  }
  function stopGame() { cancelAnimationFrame(gRaf); gRaf = 0; }
  function endGame(won) {
    game.over = true; stopGame();
    const sc = Math.round(game.score), hi = Math.max(sc, store.get('high', 0)); store.set('high', hi); $('#gHigh').textContent = hi;
    const m = $('#gMsg'); m.hidden = false;
    m.querySelector('b').textContent = won ? 'ESCAPED' : 'GAME OVER';
    m.querySelector('p').innerHTML = won ? `Score ${sc}. You escaped 2026 for 0.4 seconds.<br>Something shiny is stuck in the coin slot.` : `Score ${sc}. Crushed by ${game.killer || 'history'}.<br>Survive 60 seconds to escape.`;
    $('#gStart').textContent = 'Play again';
    if (won) { grantKey('crystal'); }
    if (sc >= 1555) setTimeout(() => unlock('highscore'), won ? 4200 : 300);
  }
  function tick(now) {
    const g = game; if (!g || g.over) return;
    const dt = Math.min(50, now - g.last) / 1000; g.last = now;
    const el = (now - g.t0) / 1000, left = Math.max(0, 60 - el), speed = 140 + el * 5.5;
    if (keysDown.l) g.x -= 230 * dt; if (keysDown.r) g.x += 230 * dt; g.x = Math.max(16, Math.min(GW - 16, g.x));
    g.spawn -= dt;
    if (g.spawn <= 0) {
      g.spawn = Math.max(.19, .5 - el * .0055);
      const bad = Math.random() < .68;
      g.items.push(bad ? { bad: true, x: 20 + Math.random() * (GW - 40), y: -20, w: 44 + ((Math.random() * 3) | 0) * 10, vx: el > 25 && Math.random() < .45 ? (Math.random() < .5 ? -1 : 1) * (40 + el) : 0, t: CRASH[(Math.random() * CRASH.length) | 0] } : { bad: false, x: 14 + Math.random() * (GW - 28), y: -16, p: PICK[Math.random() < .15 ? 2 : (Math.random() * 2) | 0] });
    }
    g.score += dt * 10;
    // draw
    gx.fillStyle = '#05030c'; gx.fillRect(0, 0, GW, GH);
    for (const s of g.stars) { s.y += s.s * speed * dt * .25; if (s.y > GH) s.y = 0; gx.fillStyle = s.s === 3 ? '#4df3e6' : '#3a2f6a'; gx.fillRect(s.x, s.y, s.s, s.s * 2); }
    gx.font = 'bold 14px monospace'; gx.textAlign = 'center'; gx.textBaseline = 'middle';
    const py = GH - 34;
    for (const it of g.items) {
      it.y += speed * dt; if (it.vx) { it.x += it.vx * dt; if (it.x < it.w / 2 || it.x > GW - it.w / 2) it.vx = -it.vx; }
      if (it.bad) { gx.fillStyle = '#ff3d8b'; gx.fillRect(it.x - it.w / 2, it.y - 10, it.w, 20); gx.fillStyle = '#05030c'; gx.fillText(it.t, it.x, it.y + 1); }
      else { gx.font = '20px serif'; gx.fillText(it.p[0], it.x, it.y); gx.font = 'bold 14px monospace'; }
      const hit = it.bad ? Math.abs(it.x - g.x) < it.w / 2 + 12 && Math.abs(it.y - py) < 20 : Math.abs(it.x - g.x) < 22 && Math.abs(it.y - py) < 22;
      if (hit && !it.gone) {
        it.gone = true;
        if (it.bad) { if (g.hurt <= 0) { g.lives--; g.hurt = 1; g.killer = it.t; beep(110, .25, 'sawtooth', .05); if (g.lives <= 0) { drawShip(g, py); return endGame(false); } } }
        else { g.score += it.p[2]; beep(1200, .05, 'square', .03); }
      }
    }
    g.items = g.items.filter(it => it.y < GH + 30 && !it.gone);
    g.hurt -= dt;
    drawShip(g, py);
    $('#gScore').textContent = Math.round(g.score); $('#gTime').textContent = Math.ceil(left); $('#gLives').innerHTML = '&#9829;'.repeat(Math.max(0, g.lives));
    if (left <= 0) { g.won = true; return endGame(true); }
    gRaf = requestAnimationFrame(tick);
  }
  function drawShip(g, py) {
    if (g.hurt > 0 && ((g.hurt * 10) | 0) % 2) return;
    gx.strokeStyle = '#ffb547'; gx.lineWidth = 2; gx.beginPath(); gx.arc(g.x, py, 13, 0, Math.PI * 2); gx.stroke();
    gx.beginPath(); gx.ellipse(g.x, py, 13, 5, .6, 0, Math.PI * 2); gx.stroke();
    gx.fillStyle = '#4df3e6'; gx.fillRect(g.x - 3, py - 3, 6, 6);
  }
  $('#gStart').onclick = startGame;
  const hold = (el, k) => { const on = e => { e.preventDefault(); keysDown[k] = true; }, off = () => { keysDown[k] = false; }; el.addEventListener('pointerdown', on); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, off)); };
  hold($('#gLeft'), 'l'); hold($('#gRight'), 'r');
  cv2.addEventListener('pointermove', e => { if (!game || game.over || e.pointerType === 'mouse' && !e.buttons) return; const r = cv2.getBoundingClientRect(); game.x = (e.clientX - r.left) / r.width * GW; });
  cv2.addEventListener('pointerdown', e => { if (!game || game.over) return; const r = cv2.getBoundingClientRect(); game.x = (e.clientX - r.left) / r.width * GW; });
  addEventListener('keydown', e => {
    if (arc.hidden) return;
    if (e.key === 'Escape') { closeArcade(); return; }
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) { keysDown.l = true; e.preventDefault(); }
    if (['ArrowRight', 'd', 'D'].includes(e.key)) { keysDown.r = true; e.preventDefault(); }
    if ((e.key === ' ' || e.key === 'Enter') && (!game || game.over) && document.activeElement !== $('#gClose')) { e.preventDefault(); startGame(); }
  });
  addEventListener('keyup', e => { if (['ArrowLeft', 'a', 'A'].includes(e.key)) keysDown.l = false; if (['ArrowRight', 'd', 'D'].includes(e.key)) keysDown.r = false; });
  document.addEventListener('visibilitychange', () => { if (document.hidden && game && !game.over) { stopGame(); game.over = true; $('#gMsg').hidden = false; $('#gMsg').querySelector('b').textContent = 'PAUSED'; $('#gMsg').querySelector('p').textContent = 'You looked away. History did not.'; $('#gStart').textContent = 'Start over'; } });

  // ---------- shades (player one mode) ----------
  const LOOT = [
    ['#dial', 'Copper turns at 20 + the minute on your clock.', 'left:12px;bottom:12px'],
    ['#workshop', 'His first machine: a wooden chair, two candles and an astrolabe. No curio.', 'right:12px;top:12px'],
    ['#ask', 'The terminal answers to: riddle', 'right:12px;top:12px'],
    ['#gate', 'Crystal: survive 60 seconds in the cabinet below.', 'left:12px;top:12px'],
    ['#anomalies', 'A white rabbit hides in a corner. It moves.', 'right:12px;top:12px']
  ];
  let xp = store.get('xp', 0), lootTaken = new Set(store.get('loot', []));
  LOOT.forEach(([sel, hint, pos], i) => {
    const sec = $(sel); if (!sec) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'loot' + (lootTaken.has(i) ? ' taken' : ''); b.style.cssText = pos; b.textContent = '+100 XP';
    b.onclick = () => { lootTaken.add(i); store.set('loot', [...lootTaken]); xp += 100; store.set('xp', xp); $('#hudXp').textContent = 'XP ' + xp; b.classList.add('taken'); beep(1400, .06, 'square', .04); say('<b>LOOT:</b> ' + esc(hint), 5000); };
    sec.appendChild(b);
  });
  const npc = document.createElement('span'); npc.className = 'npc'; npc.textContent = 'NPC: BUFFADAMUS  LVL 471  STATUS: STUCK'; $('#face').appendChild(npc);
  $('#hudXp').textContent = 'XP ' + xp;
  function toggleShades(force) {
    const on = document.body.classList.toggle('shades', force);
    document.querySelectorAll('#wheel, #partRows, .door, #askForm, #anomList').forEach(el => el.classList.toggle('tagged', on));
    if (on) { flash(); sweep(300, 1200, .35, 'square', .02); say('<b>SHADES ON.</b> He can see the game now. So can you. Look for loot. Esc or tap the test pilot to take them off.', 5000); unlock('shades'); }
    paintDrawer();
  }
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('shades') && arc.hidden && term.hidden) toggleShades(false); });

  // ---------- follow the white rabbit ----------
  const SPOTS = [['#dial', 'right:0;top:74px'], ['#intercepts', 'right:4px;top:70px'], ['.foot', 'left:12px;bottom:12px']];
  const RABBIT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 1c1.4 0 2 2.6 2 6l-.1 1.3C10.6 8.1 11.3 8 12 8s1.4.1 2.1.3L14 7c0-3.4.6-6 2-6s1.5 3.5.6 7.2C18.6 9.6 20 12 20 14.6 20 19 16.4 22 12 22s-8-3-8-7.4c0-2.6 1.4-5 3.4-6.4C6.5 4.5 6.6 1 8 1zm1.8 13.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2zm4.4 0a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2zM12 17.6c.8 0 1.4-.4 1.4-.9s-.6-.7-1.4-.7-1.4.2-1.4.7.6.9 1.4.9z"/></svg>';
  let rStage = Math.min(2, store.get('rabbitStage', 0)), rEl = null;
  function placeRabbit() {
    if (rEl) rEl.remove();
    const [sel, pos] = SPOTS[rStage], host = $(sel); if (!host) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    rEl = document.createElement('button'); rEl.type = 'button'; rEl.className = 'rabbit'; rEl.style.cssText = pos; rEl.setAttribute('aria-label', 'A white rabbit'); rEl.innerHTML = RABBIT;
    rEl.onclick = () => {
      rEl.classList.add('hop'); beep(900, .05, 'triangle', .03);
      if (rStage < 2) { rStage++; store.set('rabbitStage', rStage); say(`The rabbit runs. <b>${rStage}/3</b>`, 2200); setTimeout(placeRabbit, 550); }
      else { say('<b>Knock, knock.</b>', 1600); flash(); setTimeout(() => { location.href = '1999.html'; }, 1300); }
    };
    host.appendChild(rEl);
  }
  placeRabbit();
  if (store.get('rabbit', false)) unlock('rabbit');
  if (store.get('guestbook', false)) unlock('guestbook');
  paintKeys(false);
  v10 = true;

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
