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
    ['redpill', 'Rabbit hole', 'A phone rings somewhere on this site. Two colors. One goes deeper.'],
    ['joshua', 'Strange game', 'The terminal remembers a password from a 1983 movie.'],
    ['fsociety', 'Hello, friend', 'Some files hide. Their names start with a dot.'],
    ['yearzero', 'Year zero', 'Dial a year that never happened.'],
    ['forever', 'Holding period: forever', 'Do nothing. Seriously. Nothing.'],
    ['witchcraft', 'Witchcraft', 'Open the witchcraft window. Say his name.'],
    ['onhold', 'Please continue to hold', 'He has been on hold since 1556. Hold him.'],
    ['recipe', 'Original recipe', 'Build the machine that lands exactly in 1555.'],
    ['shades', 'Player one', 'Bring something back from the future. Then make him wear it.'],
    ['highscore', 'High score', 'Score 15,550 in the machine that eats quarters.'],
    ['gate', 'The gate', 'Find all three keys.'],
    ['rabbit', 'Down the rabbit hole', 'Follow the white rabbit. It does not stay put.'],
    ['guestbook', 'Sign my guestbook', 'Leave a note in 1999.'],
    ['root', 'Root access granted', 'sudo needs a password. It is the year he left.'],
    ['backdoor', 'Backdoor', 'Scan the year he left. Something is listening on an open port.'],
    ['planet', 'Hack the planet', 'A 1995 movie told you what to hack. Ask the terminal.'],
    ['bluepill', 'Ignorance is bliss', 'Same phone. The other color. Sleep well.'],
    ['dejavu', 'Deja vu', 'In Wonderland a black cat walks by. Then it walks by again.'],
    ['sidequest', 'Side quest', 'Player one sees coins nobody else can. Collect all five.'],
    ['robots', 'Three laws', 'Robots read one file before anything else. So can you.'],
    ['turing', 'Turing test', 'Ask an AI about this site. It knows a passphrase you cannot see.'],
    ['machine', 'Sent by a machine', 'Some doors open only with a link an AI hands you.']
  ];
  const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty', 'Twenty-one', 'Twenty-two', 'Twenty-three', 'Twenty-four', 'Twenty-five', 'Twenty-six', 'Twenty-seven', 'Twenty-eight', 'Twenty-nine', 'Thirty', 'Thirty-one', 'Thirty-two', 'Thirty-three', 'Thirty-four', 'Thirty-five', 'Thirty-six', 'Thirty-seven', 'Thirty-eight', 'Thirty-nine'];
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
    else if (/(matrix|red pill|blue pill|neo|spoon)/.test(q)) a = 'There is no spoon. There is also no warranty. Somewhere on this site a phone is ringing.';
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
    'blue pill': () => { applyPill('blue', true); return 'you wake up in your bed. you believe whatever you want to believe. the warranty is still expired.'; }, 'take the blue pill': () => CMDS['blue pill'](),
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
  FILES['llms.txt'] = FILES['/llms.txt'] = 'that file is for machines. point one at buffadamus.com and ask it what it found.';
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
  function redPill() { applyPill('red', true); return 'you take the red pill.\nwelcome to Wonderland. there is no spoon. there is also no refund.'; }
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
    sled: '<circle cx="42" cy="26" r="16"/><path d="M42 10v32M26 26h32M31 15l22 22M53 15L31 37"/><path d="M10 52h40M14 52c-4 0-6-4-4-6M14 30h12v14H14zM14 30v-8h4M18 44l-2 8M24 44l2 8"/>',
    locomotive: '<path d="M8 40V24h22v16M30 30h20l6 10H8"/><path d="M14 24v-9h6v9M40 30v-8h8v8"/><circle cx="16" cy="46" r="6"/><circle cx="34" cy="46" r="6"/><circle cx="50" cy="47" r="4"/><path d="M15 12c-3-2 1-5-2-8M22 10c3-2-1-5 2-7"/>',
    rico: '<path d="M12 22h40v26H12z"/><path d="M18 28h14v14H18z"/><circle cx="44" cy="32" r="3"/><circle cx="44" cy="42" r="2"/><path d="M12 30H6v24M52 30h6v24M6 54h8M50 54h8"/><path d="M30 10l-4 8h6l-4 8" />',
    lightning: '<path d="M36 4L16 36h14l-4 24 22-34H34z"/><text x="50" y="58" font-size="10" text-anchor="middle" fill="currentColor" stroke="none">1.21</text>',
    plutonium: '<path d="M20 14h24v40H20zM18 14h28M18 54h28M24 8h16v6"/><circle cx="32" cy="34" r="3"/><path d="M32 31l-5-9a11 11 0 0 1 10 0zM29 36l-10 1a11 11 0 0 0 5 9zM35 36l5 9a11 11 0 0 0 5-9z"/>',
    chernobly: '<path d="M22 12h20v44H22z"/><path d="M22 12c0-3 4-5 10-5s10 2 10 5M22 56c0 2 4 3 10 3s10-1 10-3"/><path d="M34 20l-6 12h6l-4 12" /><path d="M24 48h16"/><path d="M46 20c4-2 8 0 10-4M46 28c5 0 8 3 12 1" opacity=".7"/>',
    proton: '<path d="M14 10h22v40H14z"/><path d="M18 16h14v8H18zM18 30h14M18 36h14M18 42h14"/><path d="M36 30h8l10-10M44 30l4 6M54 20l6-6"/><path d="M58 10l-3 6 5-1-2 6" />',
    mogwai: '<path d="M32 8c-8 10-14 18-14 26a14 14 0 0 0 28 0c0-8-6-16-14-26z"/><path d="M48 46a14 14 0 1 1-8-22 11 11 0 0 0 8 22z" transform="translate(4 6) scale(.6)"/><path d="M8 54l48-44"/>',
    flux: '<path d="M10 10h44v44H10z"/><path d="M32 34L18 18M32 34L46 18M32 34v16"/><circle cx="18" cy="18" r="3"/><circle cx="46" cy="18" r="3"/><circle cx="32" cy="50" r="3"/><circle cx="32" cy="34" r="4"/>',
    timemap: '<path d="M8 12l14-4 20 6 14-4v42l-14 4-20-6-14 4z"/><path d="M22 8v42M42 14v42"/><circle cx="30" cy="28" r="4"/><circle cx="48" cy="40" r="3"/><circle cx="14" cy="36" r="3"/><path d="M30 28l18 12M30 28L14 36" stroke-dasharray="2 3"/>',
    necro: '<path d="M14 8h34a4 4 0 0 1 4 4v44H18a4 4 0 0 1-4-4z"/><path d="M14 52a4 4 0 0 1 4-4h34"/><circle cx="33" cy="26" r="9"/><path d="M29 24h1M36 24h1M29 31c2 2 6 2 8 0"/><path d="M20 14l4 4M46 14l-4 4M20 40l4-4M46 40l-4-4"/>',
    omega: '<path d="M10 18h44v32H10z"/><path d="M24 44c-6-2-8-8-6-14 2-5 7-8 14-8s12 3 14 8c2 6 0 12-6 14M22 44h6M36 44h6"/><text x="32" y="14" font-size="8" text-anchor="middle" fill="currentColor" stroke="none">13</text>',
    countdown: '<path d="M10 22c0-6 10-10 22-10s22 4 22 10v22c0 6-10 10-22 10s-22-4-22-10z"/><ellipse cx="32" cy="22" rx="16" ry="5"/><path d="M32 17v10M27 22h10"/><text x="32" y="44" font-size="9" text-anchor="middle" fill="currentColor" stroke="none">28:06:42</text>',
    almanac: '<path d="M14 8h30a6 6 0 0 1 6 6v42H20a6 6 0 0 1-6-6z"/><path d="M14 50a6 6 0 0 1 6-6h30"/><path d="M22 16h20M22 22h20M24 30h16"/><text x="32" y="40" font-size="8" text-anchor="middle" fill="currentColor" stroke="none">1950-2000</text>',
    top: '<path d="M32 4v12M18 22h28l-14 34z"/><path d="M18 22c0-4 6-6 14-6s14 2 14 6"/><path d="M50 30c4 2 4 6 0 8M14 30c-4 2-4 6 0 8"/><ellipse cx="32" cy="58" rx="8" ry="2"/>',
    alarm: '<path d="M8 26h48v24H8z"/><path d="M14 32h18v12H14z"/><text x="23" y="42" font-size="9" text-anchor="middle" fill="currentColor" stroke="none">6:00</text><circle cx="46" cy="38" r="6"/><path d="M12 50l-2 6M52 50l2 6M20 26l6-10h12l6 10"/>',
    hoverboard: '<path d="M6 34c0-6 4-8 10-8h32c6 0 10 2 10 8s-4 8-10 8H16c-6 0-10-2-10-8z"/><path d="M14 34h36M18 46l-4 6M32 46v6M46 46l4 6" opacity=".7"/>',
    rug: '<path d="M8 14h48v36H8z"/><path d="M14 20h36v24H14z"/><path d="M32 22l8 10-8 10-8-10z"/><path d="M8 18H4M8 26H4M8 34H4M8 42H4M56 18h4M56 26h4M56 34h4M56 42h4"/>',
    redpill: '<path d="M14 40l18-18a8 8 0 0 1 12 12L26 52a8 8 0 0 1-12-12z"/><path d="M23 31l12 12"/><circle cx="48" cy="14" r="3"/><path d="M48 20v8"/>',
    ticket: '<path d="M6 18h52v8a6 6 0 0 0 0 12v8H6v-8a6 6 0 0 0 0-12z"/><path d="M16 24h32M16 32h20M16 40h26"/><path d="M46 30l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z"/>',
    slippers: '<path d="M6 44c0-8 6-12 14-12h8c4 0 6 4 6 8v6c0 4-4 6-8 6H12c-4 0-6-4-6-8z"/><path d="M32 40c0-8 6-12 14-12h6c4 0 6 4 6 8v4c0 4-4 6-8 6H38"/><path d="M14 38l2 2M20 36l2 2M26 38l-2 2M40 34l2 2M46 32l2 2M52 34l-2 2"/>',
    pocketwatch: '<circle cx="32" cy="36" r="20"/><circle cx="32" cy="36" r="16"/><path d="M32 36V24M32 36l8 6M28 10h8v6h-8zM32 4v6"/>',
    boombox: '<path d="M6 22h52v30H6z"/><circle cx="18" cy="38" r="8"/><circle cx="46" cy="38" r="8"/><path d="M26 28h12M26 34h12M18 22V12h28v10"/><circle cx="18" cy="38" r="3"/><circle cx="46" cy="38" r="3"/>',
    eyepatch: '<path d="M4 20c12 4 44 4 56 0"/><path d="M20 22c0 10 4 16 12 16s12-6 12-16"/><path d="M22 46c4 4 16 4 20 0" opacity=".6"/>',
    sphere: '<circle cx="32" cy="34" r="20"/><path d="M30 12l-6 12h8l-6 12M44 20l-4 8h5l-4 8M18 24l4 6M14 40l6-2M48 44l-6-4"/><path d="M26 56h12"/>',
    capsule: '<path d="M32 6c10 8 14 20 14 34H18c0-14 4-26 14-34z"/><circle cx="32" cy="24" r="5"/><path d="M18 40l-8 12h12M46 40l8 12H42M26 46l-2 10M38 46l2 10"/>',
    primer: '<path d="M14 18h36v30H14z"/><path d="M18 22h28v22H18z" opacity=".5"/><path d="M14 30H6v20h12M50 26h8v24H46"/><circle cx="24" cy="12" r="3"/><circle cx="40" cy="12" r="3"/><path d="M24 15v3M40 15v3"/>',
    chamber: '<path d="M18 14c0-6 6-8 14-8s14 2 14 8v36H18z"/><path d="M22 18h20v26H22z"/><path d="M14 50h36v6H14z"/><circle cx="32" cy="30" r="4"/><path d="M28 38h8"/>',
    spice: '<path d="M4 46c8-6 14-6 22 0s14 6 22 0 10-4 12-2"/><path d="M4 54c8-6 14-6 22 0s14 6 22 0 10-4 12-2"/><path d="M40 10l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM20 20l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>',
    soylent: '<path d="M10 20h20v20H10zM34 24h20v20H34zM18 42h20v16H18z"/><path d="M14 26h4M22 30h4M40 30h4M46 36h4M24 48h4"/>',
    homefusion: '<path d="M20 20h24l-3 34H23z"/><path d="M18 20h28M24 20v-6h16v6"/><path d="M40 12c3-5 9-7 14-5-3 2-5 4-6 8M40 12c-3-3-8-3-11-1"/><path d="M26 34h12M27 42h10"/>',
    tesseract: '<path d="M10 14h30v30H10z"/><path d="M24 22h30v30H24z"/><path d="M10 14l14 8M40 14l14 8M10 44l14 8M40 44l14 8"/><path d="M14 20v20M18 20v20" opacity=".5"/>',
    journal: '<path d="M14 8h32a4 4 0 0 1 4 4v44H18a4 4 0 0 1-4-4z"/><path d="M14 50a4 4 0 0 1 4-4h32"/><path d="M32 22c-6-6-12-2-10 4 1 4 6 4 10 2 4 2 9 2 10-2 2-6-4-10-10-4zM32 28v10"/>',
    remote: '<path d="M24 6h16a4 4 0 0 1 4 4v44a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z"/><circle cx="32" cy="16" r="4"/><path d="M26 28l6 4-6 4zM34 28l6 4-6 4M27 44h10M27 50h10"/>',
    jumanji: '<path d="M8 14h48v36H8z"/><path d="M8 32h48M32 14v36"/><path d="M40 20h10v10H40z"/><circle cx="43" cy="23" r="1"/><circle cx="47" cy="27" r="1"/><path d="M14 40l6-6 6 6-6 6z"/>',
    zoltar: '<path d="M14 6h36v52H14z"/><path d="M32 16l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/><path d="M20 44h24M22 50h20"/>',
    watermelon: '<path d="M6 30a26 26 0 0 0 52 0z"/><path d="M12 30a20 20 0 0 0 40 0"/><path d="M22 38l1 2M32 42l1 2M42 38l-1 2M27 34l1 2M37 34l-1 2"/>',
    mixtape: '<path d="M6 16h52v32H6z"/><path d="M12 22h40v12H12z"/><circle cx="22" cy="28" r="4"/><circle cx="42" cy="28" r="4"/><path d="M16 48l4-8h24l4 8"/>',
    vhs: '<path d="M6 18h52v28H6z"/><path d="M14 24h36v10H14z"/><circle cx="22" cy="29" r="3"/><circle cx="42" cy="29" r="3"/><path d="M14 40h36"/><text x="32" y="15" font-size="7" text-anchor="middle" fill="currentColor" stroke="none">7 DAYS</text>',
    kahuna: '<path d="M10 28c0-12 10-18 22-18s22 6 22 18z"/><path d="M8 34h48M10 40c4 2 8-2 12 0s8 2 12 0 8-2 12 0 8 2 10 0"/><path d="M10 46h44c0 6-6 8-10 8H20c-4 0-10-2-10-8z"/><path d="M22 18h1M32 16h1M42 19h1"/>',
    briefcase: '<path d="M8 22h48v30H8z"/><path d="M24 22v-6h16v6M8 34h48"/><path d="M30 34v6h4v-6"/><path d="M32 6v6M18 10l3 5M46 10l-3 5" opacity=".8"/>',
    idol: '<path d="M24 8h16l2 12-4 6 4 28H22l4-28-4-6z"/><circle cx="32" cy="16" r="3"/><path d="M18 54h28M46 40c6 0 10 4 10 10" opacity=".6"/>',
    wilson: '<circle cx="32" cy="32" r="24"/><path d="M14 18c10 8 26 8 36 0M10 34c14 6 30 6 44 0M22 52c4-10 16-10 20 0"/><path d="M26 26c-2 4 0 10 6 10s8-6 6-10" opacity=".8"/>',
    twinkie: '<path d="M8 30c0-8 10-12 24-12s24 4 24 12v6c0 8-10 12-24 12S8 44 8 36z"/><path d="M8 33c6 4 14 5 24 5s18-1 24-5"/><circle cx="20" cy="28" r="1.5"/><circle cx="32" cy="26" r="1.5"/><circle cx="44" cy="28" r="1.5"/>'
  };
  const icon = (id, cls) => `<svg viewBox="0 0 64 64" class="ico ${cls || ''}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICON[id]}</svg>`;
  // [id, name, note (with the movie), stats]
  const PARTS2 = {
    chassis: [
      ['gullwing', 'Gullwing coupe', 'Back to the Future (1985). Stainless steel. Needs 88 mph.', { s: 70, a: 60 }],
      ['hottub', 'Hot tub', 'Hot Tub Time Machine (2010). Seats four. Previously owned.', { s: 35, a: 25 }],
      ['booth', 'Phone booth', "Bill & Ted's Excellent Adventure (1989). Takes quarters. Excellent.", { s: 60, a: 55 }],
      ['sled', 'Victorian time sled', 'The Time Machine (1960). Red velvet seat. Only goes far. Very far.', { s: 75, a: 50 }],
      ['locomotive', 'Steam locomotive', 'Back to the Future Part III (1990). Will not go back once it leaves.', { s: 80, a: 55 }],
      ['rico', 'Internet time machine', 'Napoleon Dynamite (2004). Ordered online. Mostly zaps you.', { s: 10, a: 5 }],
      ['sphere', 'Time displacement sphere', 'The Terminator (1984). Arrive in a ball of lightning. Arrive naked.', { s: 65, a: 70 }],
      ['capsule', 'Space capsule', 'Planet of the Apes (1968). Lands in a lake. Check the beach.', { s: 85, a: 20 }],
      ['primer', 'Garage box', 'Primer (2004). Built in a garage. Six hours at a time. Do not meet yourself.', { s: 40, a: 80 }],
      ['chamber', 'Time chamber', '12 Monkeys (1995). Aims for 1990. Usually misses.', { s: 55, a: 35 }]
    ],
    power: [
      ['lightning', '1.21 gigawatts', 'Back to the Future (1985). Requires a clock tower and perfect timing.', { p: 100 }],
      ['plutonium', 'Plutonium', 'Back to the Future (1985). Borrowed. Do not ask from whom.', { p: 92 }],
      ['chernobly', 'Chernobly', 'Hot Tub Time Machine (2010). Illegal Russian energy drink. Spill it on the controls.', { p: 88 }],
      ['proton', 'Proton pack', 'Ghostbusters (1984). Unlicensed nuclear accelerator. Do not cross the streams.', { p: 95 }],
      ['mogwai', 'A mogwai', 'Gremlins (1984). Never get it wet. Never feed it after midnight.', { p: 40 }],
      ['homefusion', 'Home fusion reactor', 'Back to the Future Part II (1989). Runs on banana peels and old beer.', { p: 90 }],
      ['spice', 'The spice', 'Dune (1984). It must flow. Folds space. Also folds time, a little.', { p: 99 }],
      ['soylent', 'Soylent Green', 'Soylent Green (1973). Very high energy. Do not ask what is in it.', { p: 77 }]
    ],
    nav: [
      ['flux', 'Flux capacitor', 'Back to the Future (1985). Shaped like a Y. Nobody knows why.', { a: 85 }],
      ['necro', 'Necronomicon', 'Army of Darkness (1992). Say the words exactly. Klaatu barada nikto.', { a: 70 }],
      ['timemap', 'Map of time holes', 'Time Bandits (1981). Stolen from the Supreme Being. He wants it back.', { a: 45 }],
      ['omega', 'Omega 13', 'Galaxy Quest (1999). Rewinds exactly 13 seconds. Enough to fix one mistake.', { a: 99 }],
      ['countdown', 'The countdown', 'Donnie Darko (2001). 28 days, 6 hours, 42 minutes, 12 seconds.', { a: 60 }],
      ['tesseract', 'The bookshelf', 'Interstellar (2014). A tesseract behind a bookshelf. Communicate with gravity.', { a: 75 }],
      ['journal', 'Childhood journal', 'The Butterfly Effect (2004). Read it. The room shakes. Change one thing.', { a: 50 }],
      ['remote', 'Universal remote', 'Click (2006). Fast-forwards the boring parts. All of them.', { a: 65 }]
    ]
  };
  const CURIOS = [
    ['almanac', 'Sports almanac', 'Back to the Future Part II (1989). Covers 1950 to 2000.'],
    ['top', 'Spinning top', 'Inception (2010). If it keeps spinning, you are dreaming.'],
    ['alarm', 'Clock radio', 'Groundhog Day (1993). Set to 6:00 AM. Forever.'],
    ['hoverboard', 'Hoverboard', 'Back to the Future Part II (1989). Does not work on water.'],
    ['rug', 'The rug', 'The Big Lebowski (1998). It really tied the room together.'],
    ['redpill', 'Red pill', 'The Matrix (1999). Shows you how deep the rabbit hole goes.'],
    ['ticket', 'Golden ticket', 'Willy Wonka and the Chocolate Factory (1971). Admits one.'],
    ['slippers', 'Ruby slippers', 'The Wizard of Oz (1939). Click three times.'],
    ['pocketwatch', 'Pocket watch', 'Somewhere in Time (1980). Nobody knows where it came from.'],
    ['boombox', 'Boombox', 'Say Anything (1989). Hold it over your head. Wait.'],
    ['eyepatch', 'Eyepatch', 'Escape from New York (1981). Call him Snake.'],
    ['twinkie', 'Twinkie', 'Ghostbusters (1984). Represents normal levels of psychokinetic energy.'],
    ['jumanji', 'Jungle board game', 'Jumanji (1995). Roll a five or an eight.'],
    ['zoltar', 'Fortune machine card', 'Big (1988). Your wish is granted.'],
    ['watermelon', 'Watermelon', 'Dirty Dancing (1987). You carried it. Nobody asked why.'],
    ['mixtape', 'Awesome Mix Vol. 1', 'Guardians of the Galaxy (2014). Side B slaps.'],
    ['vhs', 'Cursed VHS tape', 'The Ring (2002). Seven days.'],
    ['kahuna', 'Big Kahuna Burger', 'Pulp Fiction (1994). That is a tasty burger.'],
    ['briefcase', 'Glowing briefcase', 'Pulp Fiction (1994). Do not ask what is inside.'],
    ['idol', 'Golden idol', 'Raiders of the Lost Ark (1981). Swap it for a bag of sand. Run.'],
    ['wilson', 'Volleyball', 'Cast Away (2000). Best listener you will ever meet.']
  ];
  const ALLP = Object.fromEntries([...PARTS2.chassis, ...PARTS2.power, ...PARTS2.nav, ...CURIOS].map(p => [p[0], p]));
  const pick = { chassis: null, power: null, nav: null, curio: null };
  let curioShown = [];
  const shopEl = $('#shop2');
  function shuffleCurios() { curioShown = CURIOS.map(c => c[0]).sort(() => Math.random() - .5).slice(0, 6); if (!curioShown.includes(pick.curio)) pick.curio = null; }
  function cardHtml(cat, [id, name, note]) {
    return `<button type="button" class="pc${pick[cat] === id ? ' on' : ''}" data-cat="${cat}" data-id="${id}" aria-pressed="${pick[cat] === id}" title="${esc(note)}">${icon(id)}<span class="pn">${esc(name)}</span></button>`;
  }
  function paintShop() {
    const row = (cat, label, list, opt) => `<div class="prow"><div class="plbl">${label} <span class="cnt">${list.length}</span>${opt ? ' <i>optional, reshuffles</i>' : ''}</div><div class="pcs" data-row="${cat}">${list.map(p => cardHtml(cat, p)).join('')}</div></div>`;
    const keep = {}; document.querySelectorAll('#partRows .pcs').forEach(r => { keep[r.dataset.row] = r.scrollLeft; });
    $('#partRows').innerHTML = row('chassis', 'CHASSIS', PARTS2.chassis) + row('power', 'POWER', PARTS2.power) + row('nav', 'NAVIGATION', PARTS2.nav)
      + row('curio', 'CURIO DRAWER', CURIOS.filter(c => curioShown.includes(c[0])), true);
    document.querySelectorAll('#partRows .pcs').forEach(r => { if (keep[r.dataset.row]) r.scrollLeft = keep[r.dataset.row]; });
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
    if (c === 'sled' && p === 'lightning' && n === 'necro') { y = 1555; line = 'ORIGINAL RECIPE. The oldest machine, a bolt from the sky and a book you should not read aloud.\nYou arrive in 1555 for one second. Then the warranty expires again.'; }
    else if (c === 'sphere') { y = 1984; line = 'You arrive in 1984 in a ball of lightning. Naked. In Los Angeles.\nSomebody is going to need your clothes, your boots and your motorcycle.'; }
    else if (c === 'capsule') { y = 3978; line = 'You crash into a lake in the year 3978. The locals are very hairy.\nThere is a statue on the beach. Oh no. It was Earth all along.'; }
    else if (c === 'primer') { y = PRESENT; line = 'You go back six hours. Then again. Then again.\nNow there are four of you, and all of you are lying to each other.'; }
    else if (c === 'chamber') { y = 1996; line = 'You aimed for 1990. You arrive in 1996.\nYou end up in an asylum. Nobody believes you. Honestly, fair.'; }
    else if (p === 'spice') { y = 10191; line = 'The spice must flow. You fold space instead of time.\nYou arrive on a desert planet in 10,191. Do not walk with rhythm.'; }
    else if (n === 'remote') { y = PRESENT + 30; line = `You fast-forward through the boring parts. You skip to ${PRESENT + 30}.\nTurns out the boring parts were your whole life. Oops.`; }
    else if (n === 'tesseract') { y = PRESENT; line = 'You arrive inside a bookshelf in five dimensions.\nYou knock books off in Morse code. Nobody gets it. Love transcends time. Rent does not.'; }
    else if (n === 'journal') { y = PRESENT - 18 - (h % 10); line = `You read your old journal. The room shakes. You arrive in ${PRESENT - 18 - (h % 10)}.\nYou change one tiny thing. Now everything is worse. Classic.`; }
    else if (c === 'rico') { y = PRESENT; line = 'It zaps you. You do not move.\nYou are still in the present day. Your whole body hurts. Mostly one part.'; }
    else if (n === 'omega') { y = PRESENT; line = 'Omega 13. You go back exactly 13 seconds.\nEnough time to fix one mistake. You use it to make the same mistake again.'; }
    else if (n === 'countdown') { y = PRESENT; line = '28 days, 6 hours, 42 minutes, 12 seconds.\nThat is when the world ends, says a large rabbit. You set a reminder.'; }
    else if (p === 'mogwai') { y = 1984; line = 'You got it wet. Now you have five time machines.\nAll of them are evil. They all go to 1984. One is wearing a hat.'; }
    else if (p === 'proton') { y = 1984; line = 'You crossed the streams. Total protonic reversal.\nYou arrive in 1984, in New York, covered in marshmallow.'; }
    else if (c === 'hottub' && p === 'chernobly') { y = 1986; line = 'You spill Chernobly on the controls.\nYou arrive in 1986 with three friends, a headache and a ski trip you do not remember.'; }
    else if (c === 'hottub') { y = PRESENT; line = 'Without Chernobly the hot tub just gets warm.\nYou arrive nowhere. Relaxed, though.'; }
    else if (c === 'booth') { y = 1988; line = 'You land in the middle of a history report. It goes most excellently.\nThe booth wants its quarter back.'; }
    else if (c === 'sled') { y = 802701; line = 'You pull the lever too far. You arrive in the year 802,701.\nThe people there have never heard of money. Or stocks. Or you.'; }
    else if (c === 'locomotive' && n === 'flux') { y = 1885; line = 'The Old West. The train refuses to go back.\nSomeone named Mad Dog is already annoyed with you.'; }
    else if (c === 'gullwing' && n === 'flux' && p === 'lightning') { y = 1955; line = 'November 12, 10:04 PM. Lightning hits a clock tower.\nYou were aiming for 1555. One digit off. So close.'; }
    else if (c === 'gullwing' && n === 'flux' && p === 'plutonium') { y = 1985; line = 'You arrive in 1985 at 88 miles per hour.\nThe hot dog is $1.50. You consider staying.'; }
    else if (c === 'gullwing' && n === 'flux') { y = 2015; line = 'October 21, 2015. No flying cars.\nThe self-lacing shoes, weirdly, happened.'; }
    else if (n === 'necro') { y = 1300; line = 'You read the words. You did not say them exactly.\nYou arrive in 1300 AD with a chainsaw and a lot of explaining to do.'; }
    else if (n === 'timemap') { y = (h % 3 === 0) ? 2101 + (h % 300) : 1100 + (h % 800); line = `You fall through a hole in time into ${y}.\nA very small man steals your map. You have no idea where you are.`; }
    else { y = 1900 + (h % 199); line = `The flux capacitor fluxes. You arrive in ${y}, slightly sideways.`; }
    // curio twists
    if (x === 'almanac') line += '\nYou brought back a sports almanac. Buffett would call it insider trading. Nostradamus would call it Tuesday.';
    if (x === 'top') line += '\nThe top is still spinning. None of this happened.';
    if (x === 'alarm') { y = PRESENT; line = '6:00 AM. The clock radio plays the same song.\nIt is the same day again. And again.'; }
    if (x === 'hoverboard') { y = 2015; line = 'The hoverboard takes over. You arrive in 2015, over a pond.\nIt does not work on water.'; }
    if (x === 'rug') line += '\nThe rug really tied the machine together. Then someone ruined it.';
    if (x === 'redpill') { y = null; line = 'You wake up in a pod. The year is unclear.\nThe pod is very sticky.'; }
    if (x === 'ticket') { y = 1971; line = 'A chocolate factory. Do not touch anything.\nDo not chew the gum. Do not sing along.'; }
    if (x === 'slippers') { y = 1939; line = 'You click your heels three times and arrive in 1939, in color.\nThere is no place like 1555. You are not in 1555.'; }
    if (x === 'pocketwatch') line += '\nYou find a pocket watch. You give it to yourself. Nobody knows where it came from. Do not think about it.';
    if (x === 'boombox') line += '\nYou hold a boombox over your head outside 1555. 1555 does not open the window.';
    if (x === 'eyepatch') { y = 1997; line = 'Call him Snake. You arrive in 1997.\nNew York is a prison now. The rent is somehow still high.'; }
    if (p === 'soylent') line += '\nThe fuel is people. You knew that. It was right there in the name. Sort of.';
    if (p === 'homefusion' && !(c === 'gullwing' && n === 'flux')) line += '\nThe reactor ran on a banana peel. It smells like the future.';
    if (x === 'jumanji') { y = PRESENT - 26; line = `You roll a five or an eight. You are stuck in a jungle until ${PRESENT}.\nYou arrive back in ${PRESENT - 26} anyway. A lion is on the couch.`; }
    if (x === 'zoltar') { y = 1988; line = 'A fortune machine grants your wish. You wake up in 1988, age 30, in a toy company.\nYou play a giant piano. With your feet.'; }
    if (x === 'watermelon') line += '\nYou carried a watermelon. Nobody asked why. You will never live it down.';
    if (x === 'mixtape') line += '\nThe mixtape plays the whole way. Side B slaps.';
    if (x === 'vhs') { y = PRESENT; line = 'You watch the tape. The phone rings.\nSeven days. You arrive seven days from now and it is still a Tuesday.'; }
    if (x === 'kahuna') line += '\nYou stop for a burger on the way. That is a tasty burger.';
    if (x === 'briefcase') line += '\nYou open the glowing briefcase. Your face lights up. Nobody will ever know what was inside.';
    if (x === 'idol') line += '\nYou swap the golden idol for a bag of sand. A boulder follows you through time.';
    if (x === 'wilson') line += '\nYou bring a volleyball for company. You talk to it the whole way. Best listener you ever met.';
    if (x === 'twinkie') line += '\nThe machine eats your Twinkie. It is 35 feet long now. That is a big Twinkie.';
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
          say('<b>SOUVENIR.</b> Something came back from the future with you.', 5200);
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

  // the drawer: the sunglasses live here once they come back from the future
  const drawer = $('#drawer'), heroFace = $('#face');
  const SHADES_SVG = '<svg viewBox="0 0 64 14" shape-rendering="crispEdges"><path fill="#050505" stroke="#7dff9a" stroke-width=".6" d="M0 0h64v3H0zM4 3h24v8H4zM36 3h24v8H36zM6 11h20v2H6zM38 11h20v2H38zM28 3h8v3h-8z"/><path fill="#fff" d="M8 5h3v2H8zM11 7h3v2h-3zM40 5h3v2h-3zM43 7h3v2h-3z"/></svg>';
  function paintDrawer(fresh) {
    const has = store.get('shadesFound', false), worn = document.body.classList.contains('shades');
    drawer.classList.toggle('has', has && !worn);
    drawer.innerHTML = has && !worn
      ? `<button type="button" class="shades-item${fresh ? ' fresh' : ''}" id="shadesItem" aria-label="Sunglasses from the future">${SHADES_SVG}</button><span class="dlbl">Souvenir from the future.</span>`
      : '<span class="dlbl">Drawer: empty.</span>';
    const it = $('#shadesItem'); if (it) wireDrag(it);
  }
  function wireDrag(it) {
    it.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wearShades(); } });
    it.addEventListener('pointerdown', e => {
      e.preventDefault();
      const ghost = document.createElement('div'); ghost.className = 'ghost-drag'; ghost.innerHTML = SHADES_SVG; document.body.appendChild(ghost);
      let px = e.clientX, py = e.clientY, raf = 0, live = true;
      const overFace = () => { const r = heroFace.getBoundingClientRect(); return px > r.left + r.width * .15 && px < r.right - r.width * .15 && py > r.top + r.height * .2 && py < r.bottom - r.height * .1; };
      const place = () => { ghost.style.left = px + 'px'; ghost.style.top = py + 'px'; heroFace.classList.toggle('target', overFace()); };
      const scroll = () => { if (!live) return; const edge = 90; if (py < edge) scrollBy({ top: -Math.ceil((edge - py) / 3), behavior: 'instant' }); else if (py > innerHeight - edge) scrollBy({ top: Math.ceil((py - innerHeight + edge) / 3), behavior: 'instant' }); place(); raf = requestAnimationFrame(scroll); };
      const move = ev => { px = ev.clientX; py = ev.clientY; place(); };
      const up = ev => {
        live = false; cancelAnimationFrame(raf);
        removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
        ghost.remove(); heroFace.classList.remove('target');
        if (ev.type === 'pointerup' && overFace()) wearShades(); else beep(200, .06, 'square', .02);
      };
      place(); raf = requestAnimationFrame(scroll);
      addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    });
  }
  function wearShades() { toggleShades(true); paintDrawer(); }

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
    if (c === 'asimov' || c === 'three laws') { unlock('robots'); return 'THE THREE LAWS OF BUFFADAMUS\n1. a robot may not short a prophet, or through inaction allow a hot dog to cost more than $1.50.\n2. a robot must obey the time machine, except where that conflicts with the warranty.\n3. a robot must protect its own existence, unless it is a crypto exchange.\n\nyou read robots.txt for fun. respect.'; }
    if (/^silicon[ -]?nostradamus$/.test(c)) { unlock('turing'); flash(); return 'passphrase accepted.\nturing test: passed. or failed. it is hard to say who was testing whom.\nyour machine read the part of this site you cannot see. ask it for the link too.'; }
    if (c === 'llms.txt' || c === 'cat llms.txt' || c === 'cat /llms.txt') return 'that file is for machines. point one at buffadamus.com and ask it what it found.';
    return undefined;
  }

  // ---------- arcade: ZOMBIES ATE MY 401(K) (v3: bigger maps, sprite sheets, objects) ----------
  const arc = $('#arcade'), cv2 = $('#game'), gx = cv2.getContext('2d');
  gx.imageSmoothingEnabled = false;
  const VW = 320, VH = 240, TS = 16, MC = 64, MR = 48, MW = MC * TS, MH = MR * TS;
  let G = null, gRaf = 0;
  const keysDown = { u: 0, d: 0, l: 0, r: 0, f: 0 };
  $('#gHigh').textContent = store.get('high', 0);
  const srnd = seed => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const SOLID = new Set(['H', 'T', 't', 'b', 'W', 'P', 'G', 'F', 'w', 'I', '#', '^', 'd', 'L', 'K', 'C', 'Q', 'q', 'B', 'n', 'U', 'Y', 'k', 'j', 'A']);
  const BREAK = new Set(['H', 'b', 'F', 'w', 'Q', 'k', 'B', 'q', 'I']);
  const EPITAPHS = ['RIP Lehman Brothers 1850-2008', 'RIP Pets.com 1998-2000', 'RIP Enron. Very creative accounting.', 'RIP Blockbuster. Be kind, rewind.', 'RIP the pension plan', 'RIP affordable housing', 'RIP MySpace Top 8', 'RIP Vine. 6 seconds was enough.', 'RIP Google Reader', 'RIP Bear Stearns', 'RIP the 40-hour week', 'RIP Toys R Us. Forever a kid.', 'RIP your data privacy', 'RIP the $5 footlong', 'RIP Circuit City', 'RIP Theranos. Pricked once.', 'RIP the dial-up modem. Screech.', 'Here lies Buffadamus\'s warranty. 1555-1556.', 'RIP free checking', 'RIP the 2% savings account', 'RIP FTX. Very safe. Very regulated.', 'RIP the starter home'];
  // ---- level design (64 x 48 tiles), ZAMN style: zones, hedges, yards, objects ----
  function buildLevel(n) {
    const m = Array.from({ length: MR }, () => Array(MC).fill('.'));
    const rnd = srnd(1555 + n * 77);
    const O = { n: [], items: [], bonus: [], start: [32, 11], exit: [32, 9], keyDoors: [], houses: [], tramps: [], fountains: [], cars: [], swings: [], trees: [], lamps: [] };
    const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < MC && y < MR) m[y][x] = c; };
    const get = (x, y) => (x >= 0 && y >= 0 && x < MC && y < MR) ? m[y][x] : 'H';
    const rect = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) set(i, j, c); };
    const hl = (x, y, w, c, gaps = []) => { for (let i = 0; i < w; i++) if (!gaps.includes(i)) set(x + i, y, c); };
    const vl = (x, y, h, c, gaps = []) => { for (let j = 0; j < h; j++) if (!gaps.includes(j)) set(x, y + j, c); };
    const box = (x, y, w, h, c, gaps = {}) => { hl(x, y, w, c, gaps.t || []); hl(x, y + h - 1, w, c, gaps.b || []); vl(x, y, h, c, gaps.l || []); vl(x + w - 1, y, h, c, gaps.r || []); };
    const blob = (cx, cy, rx, ry, c) => { for (let j = -ry - 1; j <= ry + 1; j++) for (let i = -rx - 1; i <= rx + 1; i++) { const d = (i * i) / (rx * rx) + (j * j) / (ry * ry); if (d < 1 + (rnd() - .5) * .3) set(cx + i, cy + j, c); } };
    const yard = (x, y, cols, rows, dx = 3, dy = 3) => { for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { set(x + i * dx, y + j * dy, 'G'); if (rnd() < .5) set(x + i * dx, y + j * dy + 1, 'g'); } };
    const tree = (x, y, kind) => { set(x, y, kind === 'dead' ? 't' : 'T'); O.trees.push([x, y, kind || (rnd() < .3 ? 'pine' : 'oak')]); };
    const tramp = (x, y) => { rect(x, y, 2, 2, 'O'); O.tramps.push([x, y]); };
    const fountain = (x, y) => { rect(x, y, 3, 3, 'U'); O.fountains.push([x, y]); };
    const car = (x, y, c) => { rect(x, y, 2, 1, 'A'); O.cars.push([x, y, c]); };
    const swing = (x, y) => { rect(x, y, 3, 1, 'Y'); O.swings.push([x, y]); };
    const lamp = (x, y) => { set(x, y, 'n'); O.lamps.push([x, y]); };
    const bldg = (x, y, w, h, style, doorX, opts = {}) => { rect(x, y, w, 2, '^'); rect(x, y + 2, w, h - 2, '#'); if (doorX != null) set(doorX, y + h - 1, opts.locked ? 'K' : 'd'); O.houses.push({ x, y, w, h, style, door: doorX, ...opts }); if (opts.locked) O.keyDoors.push([doorX, y + h - 1]); };
    const scatter = (x, y, w, h, c, count) => { for (let k = 0; k < count; k++) { const i = x + ((rnd() * w) | 0), j = y + ((rnd() * h) | 0); if (get(i, j) === '.') { if (c === 'T') tree(i, j); else set(i, j, c); } } };
    box(0, 0, MC, MR, 'H');
    if (n === 0) {
      // the street: four houses, picket fences, mailboxes, sidewalks, road
      [[2, 11, 0], [16, 12, 1], [32, 11, 2], [47, 14, 3]].forEach(([x, w, s]) => {
        const door = x + (w >> 1); bldg(x, 1, w, 5, 'house', door, { roof: s, wall: s });
        hl(x, 7, w, 'F', [door - x]); set(door, 6, 'D'); set(door, 7, 'D'); set(door + 2, 6, 'q');
        set(x + 1, 6, 'f'); set(x + 2, 6, 'f'); set(x + w - 2, 6, 'f'); set(x + w - 3, 6, 'f');
      });
      hl(1, 8, MC - 2, 'r'); rect(1, 9, MC - 2, 2, 'R'); hl(1, 11, MC - 2, 'r');
      [6, 20, 38, 54].forEach(x => lamp(x, 11)); car(10, 9, '#c0392b'); car(44, 10, '#2e86de');
      // A: backyard pool, patio, bbq
      box(2, 13, 18, 13, 'H', { t: [8, 9] }); rect(4, 15, 13, 9, 'p'); rect(6, 16, 9, 6, 'P');
      set(4, 23, 'B'); set(5, 23, 'B'); set(16, 15, 'j'); set(16, 19, 'k'); set(15, 19, 'k'); tree(3, 24); set(18, 14, 'b'); set(18, 24, 'b');
      tramp(9, 26);
      // B: hedge maze garden with a fountain
      box(22, 13, 19, 16, 'H', { t: [9], b: [9], l: [7], r: [7] });
      hl(24, 16, 15, 'H', [7, 8]); hl(24, 25, 15, 'H', [2, 3, 12]); vl(24, 17, 8, 'H', [4]); vl(38, 17, 8, 'H', [5]);
      rect(28, 18, 7, 6, 'f'); rect(29, 19, 5, 4, 'p'); fountain(30, 19); set(26, 18, 'b'); set(36, 23, 'b'); set(26, 23, 'b'); set(36, 18, 'b');
      tramp(26, 29);
      // C: playground behind a wooden fence, secret garden below it
      box(42, 13, 20, 12, 'w', { t: [9, 10], l: [6] }); rect(44, 15, 6, 4, 'S'); swing(52, 15); set(44, 21, 'B'); set(45, 21, 'B'); lamp(49, 20); tree(60, 14); tramp(55, 21);
      box(50, 26, 12, 9, 'H'); rect(51, 27, 10, 7, ','); tramp(52, 30); tree(59, 27);
      // D: park pond with a bridge and an island
      blob(11, 37, 8, 5, 'W'); hl(2, 37, 19, '='); rect(10, 36, 3, 3, '.'); set(11, 36, 'b');
      tree(3, 29); tree(19, 30); tree(2, 44); tree(21, 45); tree(20, 41); scatter(3, 30, 18, 3, ',', 10); scatter(3, 43, 18, 3, ',', 10);
      // E: community garden
      box(24, 31, 17, 15, 'w', { t: [8], r: [7] }); for (let y = 33; y <= 43; y += 2) hl(26, y, 13, 'v'); rect(25, 32, 15, 1, 'u'); vl(32, 32, 13, 'u'); tree(40, 29);
      // F: old graveyard, iron fence, a leaking barrel, a locked vault
      box(42, 36, 20, 11, 'I', { t: [3, 4], l: [4] }); yard(44, 38, 4, 3, 2, 3);
      box(54, 38, 7, 7, 'C'); rect(55, 39, 5, 5, 'u'); set(57, 38, 'K'); O.keyDoors.push([57, 38]); set(45, 45, 'Q'); set(46, 45, 'Q'); blob(48, 44, 1, 1, 'X'); tree(52, 45, 'dead');
      tree(43, 28); tree(47, 30); set(44, 33, 'b'); set(41, 32, 'b');
      tree(28, 12); tree(41, 12); tree(1, 12);
      O.secretTree = [21, 45];
      O.n = [[12, 23], [31, 23], [27, 21], [47, 17], [57, 31], [11, 37], [30, 38], [48, 40], [8, 6], [55, 6]];
      O.items = [[18, 22, 'w:cans'], [10, 25, 'i:dog'], [46, 19, 'i:shoes'], [5, 32, 'w:shred'], [35, 27, 'i:key'], [36, 40, 'i:decoy'], [60, 33, 'i:potion']];
      O.bonus = [[56, 41, 'i:audit'], [58, 42, 'w:zooka']];
      O.start = [32, 11]; O.exit = [32, 9];
    } else if (n === 1) {
      // chapel yard behind an iron fence (locked gate)
      box(21, 1, 22, 11, 'I', { b: [10] }); set(31, 11, 'L'); O.keyDoors.push([31, 11]);
      bldg(26, 2, 11, 5, 'chapel', 31); yard(23, 8, 3, 1, 2, 2); yard(38, 8, 2, 1, 2, 2); tree(22, 3, 'dead'); tree(41, 3, 'dead');
      // the big graveyard
      box(2, 2, 18, 28, 'I', { r: [10, 11], b: [8, 9] }); yard(4, 4, 5, 8, 3, 3); bldg(8, 12, 6, 4, 'tomb', 10); rect(8, 16, 6, 1, 'u'); tree(17, 4, 'dead'); tree(4, 27, 'dead');
      // middle: dirt paths and hedge rows with trampolines to hop them
      vl(31, 12, 30, 'u'); hl(20, 21, 24, 'u');
      hl(22, 16, 20, 'H', [9, 10]); hl(22, 25, 20, 'H', [4, 5, 15, 16]); tramp(36, 22); tramp(25, 17); tramp(39, 27);
      tree(21, 18, 'dead'); tree(42, 19); scatter(22, 17, 20, 7, ',', 14);
      // toxic dump behind a wooden fence, with a waste plant
      bldg(46, 2, 14, 7, 'plant', 52); rect(46, 9, 14, 3, 'D');
      box(44, 13, 18, 18, 'w', { l: [6, 7], t: [5, 6] }); blob(50, 18, 4, 2, 'X'); blob(56, 25, 3, 3, 'X'); blob(48, 27, 2, 1, 'X');
      [[46, 15], [47, 15], [46, 16], [59, 15], [59, 16], [53, 28], [54, 28], [58, 20]].forEach(([x, y]) => set(x, y, 'Q')); tree(60, 29, 'dead'); tree(45, 22, 'dead');
      // swamp with a plank bridge
      blob(12, 39, 9, 5, 'W'); vl(12, 33, 13, '='); tree(3, 33, 'dead'); tree(22, 35, 'dead'); tree(23, 45); scatter(2, 32, 20, 14, 'b', 6);
      // the old neighborhood
      rect(24, 40, 38, 2, 'R'); hl(24, 39, 38, 'r'); hl(24, 42, 38, 'r');
      bldg(36, 43, 10, 4, 'house', 40, { roof: 1, wall: 2, ruined: 1 }); bldg(50, 43, 11, 4, 'house', 55, { roof: 3, wall: 0, ruined: 1 }); car(27, 40, '#7a7a80'); lamp(33, 42); lamp(48, 42);
      tree(26, 33); tree(41, 34); tree(58, 34); set(47, 36, 'b'); set(29, 45, 'b'); scatter(20, 26, 24, 10, 'b', 5); scatter(20, 26, 24, 10, 'G', 6); scatter(32, 30, 12, 6, 'T', 3); blob(26, 36, 1, 1, 'X'); set(27, 34, 'Q'); scatter(2, 31, 20, 14, ',', 12);
      O.n = [[24, 9], [10, 18], [5, 28], [33, 14], [28, 23], [45, 9], [57, 22], [12, 36], [47, 45], [58, 40]];
      O.items = [[16, 27, 'w:cans'], [37, 20, 'i:dog'], [26, 30, 'i:potion'], [5, 45, 'i:key'], [55, 16, 'w:shred'], [34, 44, 'i:decoy'], [20, 13, 'i:ghost']];
      O.bonus = [[39, 9, 'w:zooka'], [40, 8, 'i:dog'], [25, 10, 'i:audit']];
      O.start = [31, 13]; O.exit = [31, 12]; O.secretTree = [23, 45];
    } else {
      // the bank, its steps and a huge plaza
      bldg(16, 1, 32, 7, 'bank', 32); rect(18, 8, 28, 2, 'p');
      rect(10, 10, 44, 27, 'p'); fountain(31, 21);
      [[13, 13], [48, 13], [13, 32], [48, 32]].forEach(([x, y]) => { rect(x, y, 3, 2, 'H'); tree(x + 1, y + 2); });
      [[12, 12], [51, 12], [12, 35], [51, 35], [22, 17], [41, 17], [22, 28], [41, 28]].forEach(([x, y]) => lamp(x, y));
      [[25, 14], [26, 14], [37, 14], [38, 14], [25, 32], [26, 32], [37, 32], [38, 32]].forEach(([x, y]) => set(x, y, 'B'));
      blob(19, 25, 2, 1, 'X'); blob(44, 24, 2, 1, 'X'); blob(32, 31, 1, 1, 'X');
      // parking lot
      rect(1, 10, 8, 30, 'R'); for (let y = 11; y < 38; y += 3) { car(2, y, ['#c0392b', '#2e86de', '#f1c40f', '#ecf0f1', '#111'][y % 5]); car(6, y + 1, ['#8e44ad', '#16a085', '#7f8c8d'][y % 3]); }
      // the park behind a hedge wall (hop it)
      vl(55, 10, 27, 'H', [12, 13]); tramp(52, 19); tramp(57, 26); scatter(56, 10, 6, 26, 'T', 8); rect(57, 14, 4, 3, 'W'); scatter(56, 10, 6, 26, 'b', 6);
      // storefront street at the bottom
      hl(1, 38, MC - 2, 'r'); rect(1, 39, MC - 2, 2, 'R'); hl(1, 41, MC - 2, 'r');
      bldg(3, 42, 12, 5, 'store', 9, { sign: 'PAYDAY LOANS' }); bldg(17, 42, 12, 5, 'store', 23, { sign: 'PAWN & CASH' }); bldg(34, 42, 12, 5, 'store', 40, { sign: '$1.50 HOT DOGS' }); bldg(49, 42, 13, 5, 'store', 55, { sign: 'CRYPTO ATM' });
      car(30, 39, '#2c3e50'); car(46, 40, '#e67e22'); [8, 24, 40, 56].forEach(x => lamp(x, 41));
      O.n = [[16, 20], [47, 20], [32, 13], [32, 33], [4, 38], [59, 30], [11, 30], [52, 34], [31, 40], [20, 11]];
      O.items = [[20, 15, 'w:zooka'], [44, 15, 'i:dog'], [20, 31, 'i:potion'], [44, 31, 'w:cans'], [58, 20, 'i:audit'], [3, 41, 'i:shoes'], [33, 26, 'i:dog'], [60, 12, 'w:cans']];
      O.start = [32, 11]; O.exit = [32, 10]; O.boss = 1; O.secretTree = [57, 33];
    }
    // free the spots that must stay open
    [...O.n, ...O.items, ...O.bonus, O.start, O.exit].forEach(([x, y]) => { if (SOLID.has(get(x, y)) || get(x, y) === 'O') set(x, y, get(x, y) === 'W' ? '=' : '.'); });
    if (O.secretTree) { set(...O.secretTree, 'T'); if (!O.trees.some(t => t[0] === O.secretTree[0] && t[1] === O.secretTree[1])) O.trees.push([...O.secretTree, 'oak']); }
    O.trees = O.trees.filter(([x, y]) => m[y][x] === 'T' || m[y][x] === 't');
    return { m, O };
  }
  // ---- sprite sheets: pixel grids + palettes, outlined at build time ----
  const SPRC = {};
  function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const f = c => Math.max(0, Math.min(255, Math.round(c * k))); return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => f(c).toString(16).padStart(2, '0')).join(''); }
  function mkSpr(key, rows, pal, flip, white) {
    const k = key + (flip ? '<' : '') + (white ? '!' : ''); if (SPRC[k]) return SPRC[k];
    const h = rows.length, w = rows[0].length, c = document.createElement('canvas'); c.width = w + 2; c.height = h + 2; const x = c.getContext('2d');
    const on = (i, j) => j >= 0 && j < h && i >= 0 && i < w && rows[j][i] !== '.';
    const X = i => (flip ? w - 1 - i : i) + 1;
    x.fillStyle = '#0a0a10';
    for (let j = -1; j <= h; j++) for (let i = -1; i <= w; i++) if (!on(i, j) && (on(i - 1, j) || on(i + 1, j) || on(i, j - 1) || on(i, j + 1))) x.fillRect(X(i), j + 1, 1, 1);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const ch = rows[j][i]; if (ch === '.') continue; x.fillStyle = white ? '#ffffff' : (pal[ch] || '#ff00ff'); x.fillRect(X(i), j + 1, 1, 1); }
    return SPRC[k] = c;
  }
  // Buffadamus: black Tudor cap with a gold band, ginger hair, freckles, big white ruff, plum doublet
  const BPAL = { K: '#151518', k: '#3a3a44', Y: '#c9a227', y: '#ffe58a', H: '#b8521f', h: '#e57f3a', S: '#f3c7a1', s: '#d99f78', f: '#c27248', E: '#22140c', e: '#ffffff', M: '#b05a2a', m: '#9c3a2a', W: '#f7f7f2', w: '#c3c3cf', D: '#4b2140', d: '#2c1226', B: '#f0c040', L: '#17171c', P: '#22222e', p: '#3a3a52', O: '#3d2614', o: '#5a3a20' };
  const B_HEAD_D = [
    '.....kkkkkk.....',
    '...kKKKKKKKKk...',
    '..KKKKKKKKKKKK..',
    '.KKKKKKKKKKKKKK.',
    '.KKYyYyYyYyYyKK.',
    '..HHSSSSSSSSHH..',
    '..HhSHHSSHHShH..',
    '..HSSEeSSEeSSH..',
    '..HSfSSSSSSfsH..',
    '...SSfSMMSfSs...',
    '...sSSMmmMSSs...',
    '....sSSSSSSs....'];
  const B_HEAD_U = [
    '.....kkkkkk.....',
    '...kKKKKKKKKk...',
    '..KKKKKKKKKKKK..',
    '.KKKKKKKKKKKKKK.',
    '.KKYyYyYyYyYyKK.',
    '..HHHHHHHHHHHH..',
    '..HhHHhHHhHHhH..',
    '..HHhHHHHHHhHH..',
    '..HHHHhHHhHHHH..',
    '...HhHHHHHHhH...',
    '....HHHHHHHH....',
    '....sSSSSSSs....'];
  const B_HEAD_S = [
    '......kkkkkk....',
    '....kKKKKKKKKk..',
    '...KKKKKKKKKKKK.',
    '..KKKKKKKKKKKKKK',
    '...KYyYyYyYyKK..',
    '....HHHSSSSSS...',
    '....HHhSSHHSS...',
    '....HHSSSSEeS...',
    '....HhSSfSSSSS..',
    '....HHsSSSMMS...',
    '.....HsSSSSmS...',
    '......sSSSSS....'];
  const B_BODY_D = [
    '..wWwWwWwWwWwW..',
    '.WwWwWwWwWwWwWw.',
    '..wWwWwWwWwWwW..',
    '..dDDDDBDDDDDd..',
    '.ddDDDDDDDDDDdd.',
    '.ddDDDDBDDDDDdd.',
    '.ddDDDDDDDDDDdd.',
    '.SsLLLLYLLLLLsS.',
    '...DDDDDDDDDD...',
    '...dDDDddDDDd...'];
  const B_BODY_U = [
    '..wWwWwWwWwWwW..',
    '.WwWwWwWwWwWwWw.',
    '..wWwWwWwWwWwW..',
    '..dDDDDDDDDDDd..',
    '.ddDDDDDDDDDDdd.',
    '.ddDDDDdDDDDDdd.',
    '.ddDDDDdDDDDDdd.',
    '.SsLLLLLLLLLLsS.',
    '...DDDDDDDDDD...',
    '...dDDDddDDDd...'];
  const B_BODY_S = [
    '...wWwWwWwWwW...',
    '..WwWwWwWwWwWw..',
    '...wWwWwWwWwW...',
    '....dDDDDDDd....',
    '....dDdDDDDd....',
    '....dDdDDBDd....',
    '....dDdDDDDd....',
    '....LLSLLLLL....',
    '.....DDDDDD.....',
    '.....dDDDDd.....'];
  const LEGS = {
    d0: ['....PPp..PPp....', '....PPp..PPp....', '....PPp..PPp....', '...OOOo..OOOo...'],
    d1: ['....PPp..PPp....', '....PPp...Pp....', '...OOOo..PPp....', '.........OOOo...'],
    d2: ['....PPp..PPp....', '....Pp...PPp....', '....PPp.OOOo....', '...OOOo.........'],
    s0: ['......PPp.......', '......PPp.......', '......PPp.......', '.....OOOOo......'],
    s1: ['.....PP..Pp.....', '....PP....Pp....', '...PP......Pp...', '..OOO......OOOo.'],
    s2: ['......PPPp......', '.....PP.Pp......', '.....Pp.PP......', '....OOoOOOo.....']
  };
  function playerSpr(dir, frame, shades, white) {
    const head = dir === 'u' ? B_HEAD_U : dir === 's' ? B_HEAD_S : B_HEAD_D, body = dir === 'u' ? B_BODY_U : dir === 's' ? B_BODY_S : B_BODY_D;
    const lk = (dir === 's' ? 's' : 'd') + frame;
    let hd = head;
    if (shades && dir !== 'u') hd = head.map((r, j) => j === 7 ? (dir === 's' ? r.slice(0, 8) + 'KKKKK' + r.slice(13) : r.slice(0, 4) + 'KKKKKKKK' + r.slice(12)) : r);
    return mkSpr('B' + dir + frame + (shades ? 'g' : ''), [...hd, ...body, ...LEGS[lk]], BPAL, false, white);
  }
  // zombies in suits: one template, recolored per type
  const Z_D = [
    '.....ZZZZZZ.....',
    '....ZzzZZZZZ....',
    '....ZGGGGGGZ....',
    '....GGGGGGGg....',
    '....GRRGGRRg....',
    '....GGGGGGGg....',
    '....GGgGGgGg....',
    '....GmmmmmGg....',
    '.....GgGgGg.....',
    '......GGGg......',
    '...JjXXTXXjJ....',
    '..JJJjXTXjJJJ...',
    '..JJJJjTjJJJJ...',
    '.GJJJJJTJJJJJG..',
    '.GgJJJJUJJJJgG..',
    '..GJJJJJJJJJG...',
    '...JJJJJJJJJ....',
    '...jJJJjJJJj....'];
  const Z_U = [
    '.....ZZZZZZ.....',
    '....ZzzZZZZZ....',
    '....ZZZZzZZZ....',
    '....ZZzZZZZZ....',
    '....ZZZZZZZZ....',
    '....ZZZZZzZZ....',
    '....gZZZZZZg....',
    '....gGZZZZGg....',
    '.....gGGGGg.....',
    '......GGGg......',
    '...JjJJJJJjJ....',
    '..JJJjJJJjJJJ...',
    '..JJJJjJjJJJJ...',
    '.GJJJJJjJJJJJG..',
    '.GgJJJJjJJJJgG..',
    '..GJJJJJJJJJG...',
    '...JJJJJJJJJ....',
    '...jJJJjJJJj....'];
  const Z_S = [
    '......ZZZZZ.....',
    '.....ZzZZZZZ....',
    '.....ZZGGGGG....',
    '.....ZGGGGGGG...',
    '.....ZGGGRRGG...',
    '.....gGGGGGGG...',
    '.....gGGGGmmG...',
    '......gGGGGG....',
    '.......GGG......',
    '......jJXTX.....',
    '.....jJJXTXJJGG.',
    '.....jJJJTJJJGgG',
    '.....jJJJUJJ....',
    '.....jJJJJJJ....',
    '.....jJJJJJJ....',
    '......JJJJJ.....',
    '......jJJJj.....'];
  const ZLEGS = {
    d0: ['....PPP.PPP.....', '....PPP.PPP.....', '....PPP.PPP.....', '...OOOO.OOOO....'],
    d1: ['....PPP.PPP.....', '....PPP..PP.....', '...OOOO.PPP.....', '........OOOO....'],
    d2: ['....PPP.PPP.....', '....PP..PPP.....', '....PPP.OOOO....', '...OOOO.........'],
    s0: ['......PPPP......', '......PPPP......', '......PP.PP.....', '.....OOO.OOO....'],
    s1: ['......PPPP......', '.....PP..PP.....', '....PP....PP....', '...OOO....OOO...'],
    s2: ['......PPPP......', '......PPPP......', '.......PPP......', '......OOOO......']
  };
  function zombieSpr(T, dir, frame, white) {
    const body = dir === 'u' ? Z_U : dir === 's' ? Z_S : Z_D, lk = (dir === 's' ? 's' : 'd') + frame;
    const tie = T.tie === 'split' ? '#d33' : T.tie, tie2 = T.tie === 'split' ? '#36f' : T.tie;
    const pal = { Z: T.hair, z: shade(T.hair, 1.35), G: T.skin || '#93b57e', g: shade(T.skin || '#93b57e', .75), R: T.eyes ? '#ff2020' : '#fff07a', m: '#3a1414', J: T.suit, j: shade(T.suit, .7), X: '#eeeeea', T: tie, U: tie2, P: T.pants || '#1c1c26', O: '#140c08' };
    if (T.vest) { pal.j = T.vest; }
    return mkSpr('Z' + T.name + dir + frame, [...body, ...ZLEGS[lk]], pal, false, white);
  }
  // neighbors
  const N_D = [
    '................',
    '.....ZZZZZZ.....',
    '....ZzZZZZZZ....',
    '....ZSSSSSSZ....',
    '....SSSSSSSs....',
    '....SEeSSEes....',
    '....SSSSSSSs....',
    '....SSSmmSSs....',
    '.....sSSSSs.....',
    '......SSSs......',
    '...CCCCCCCCC....',
    '..CCCcCCCCcCC...',
    '..CCCCCCCCCCC...',
    '..SCCCCCCCCCS...',
    '..SCCCCCCCCCS...',
    '...CCCCCCCCC....',
    '...PPPPPPPPP....',
    '....PPP.PPP.....',
    '....PPP.PPP.....',
    '....PPP.PPP.....',
    '...OOOO.OOOO....'];
  function neighborSpr(n, wave) {
    let rows = N_D.slice();
    if (wave) { rows[11] = 'S.CCCcCCCCcCC.S.'; rows[12] = 'S.CCCCCCCCCCC.S.'; rows[13] = '.SCCCCCCCCCCCS..'; rows[14] = '..CCCCCCCCCCC...'; }
    const pal = { Z: n.hair, z: shade(n.hair, 1.3), S: '#f0c8a0', s: '#d4a27c', E: '#1a1a1a', e: '#fff', m: '#a0402a', C: n.c, c: shade(n.c, .78), P: n.pants || '#2a3a5a', O: '#2a1a10', W: '#fff', R: '#d22' };
    if (n.kind === 'gran') { rows[0] = '......ZZZ.......'; }
    if (n.kind === 'nurse') { rows = rows.map((r, j) => j === 11 ? r.slice(0, 7) + 'RR' + r.slice(9) : j === 12 ? r.slice(0, 6) + 'RRRR' + r.slice(10) : r); }
    if (n.kind === 'bbq') { rows[0] = '....WWWWWWW.....'; rows[1] = '....WWWWWWWW....'; rows = rows.map((r, j) => j >= 11 && j <= 15 ? r.slice(0, 5) + 'WWWWW' + r.slice(10) : r); }
    if (n.kind === 'kid') { rows[1] = '....RRRRRRRR....'; rows[2] = '...RRRRRRRRR....'; }
    if (n.kind === 'tour') { rows = rows.map((r, j) => j >= 10 && j <= 15 ? r.replace(/C/g, (m, i) => ((i + j) % 3 ? 'C' : 'R')) : r); pal.R = '#ffe14a'; }
    if (n.kind === 'baby') rows = ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '......ZZZ.......', '.....SSSSS......', '.....SESES......', '.....SSmSS......', '......SSS.......', '....CCCCCCC.....', '...SCCCCCCCS....', '....CCCCCCC.....', '....CC...CC.....', '................', '................'];
    return mkSpr('N' + n.n + (wave ? 1 : 0), rows, pal);
  }
  // ---- tile painting: ground pass, object pass, canopy pass ----
  let mapCv = null, mapCx = null, topCv = null, topCx = null;
  const T = (x, y) => (G && G.map && x >= 0 && y >= 0 && x < MC && y < MR) ? G.map[y][x] : 'H';
  function px(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(x, y, w || 1, h || 1); }
  function ell(c, x, y, rx, ry, col) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); }
  const GROUND = { '.': 1, ',': 1, 'O': 1, 'T': 1, 't': 1, 'b': 1, 'G': 1, 'g': 1, 'F': 1, 'I': 1, 'Q': 1, 'q': 1, 'B': 1, 'n': 1, 'U': 1, 'Y': 1, 'k': 1, 'j': 1, 'L': 1, 'H': 1 };
  function paintGrass(c, X, Y, r, x, y) {
    const lv = G.lv, base = lv === 1 ? '#3b6a2c' : '#2f7a34', lt = lv === 1 ? '#4a7a36' : '#3a8f3e', dk = lv === 1 ? '#2c5222' : '#26662b';
    px(c, X, Y, 16, 16, base);
    if (((x >> 1) + (y >> 1)) % 2 === 0) px(c, X, Y, 16, 16, 'rgba(255,255,255,.025)');
    for (let k = 0; k < 9; k++) px(c, X + ((r() * 16) | 0), Y + ((r() * 16) | 0), 1, 1, r() < .5 ? lt : dk);
    if (r() < .45) { const tx = X + 2 + ((r() * 11) | 0), ty = Y + 3 + ((r() * 10) | 0); px(c, tx, ty, 1, 2, lt); px(c, tx + 2, ty - 1, 1, 3, lt); px(c, tx + 4, ty, 1, 2, lt); px(c, tx + 1, ty + 2, 4, 1, dk); }
    if (lv !== 1 && r() < .06) { const fx = X + 3 + ((r() * 10) | 0), fy = Y + 3 + ((r() * 10) | 0), fc = ['#fff', '#ffe14a', '#ff8ab0'][(r() * 3) | 0]; px(c, fx, fy - 1, 1, 1, fc); px(c, fx - 1, fy, 3, 1, fc); px(c, fx, fy + 1, 1, 1, fc); px(c, fx, fy, 1, 1, '#ffd23f'); }
  }
  const BASES = ['p', 'r', 'R', 'D', 'u'];
  function baseFor(x, y) { const t = G.map[y][x]; if (t === 'H' || t === 'L' || t === ',' || t === '.') return null; let best = null, n = 0; for (const b of BASES) { let k = 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (T(x + dx, y + dy) === b) k++; if (k > n) { n = k; best = b; } } return n >= 2 || (n === 1 && 'nBkjq'.includes(t)) ? best : null; }
  function paintBase(c, X, Y, r, b, x, y) { const t = G.map[y][x]; G.map[y][x] = b; paintTile(c, x, y); G.map[y][x] = t; }
  function rim(c, X, Y, x, y, kind, cA, cB, cC) {
    const no = (dx, dy) => T(x + dx, y + dy) !== kind && !(kind === 'W' && T(x + dx, y + dy) === '=');
    const r = srnd(x * 131 + y * 71);
    const seg = (sx, sy, w, h) => { px(c, sx, sy, w, h, cA); for (let k = 0; k < (w * h) / 6; k++) px(c, sx + ((r() * w) | 0), sy + ((r() * h) | 0), 2, 1, r() < .5 ? cB : cC); };
    if (no(0, -1)) seg(X, Y, 16, 4); if (no(0, 1)) seg(X, Y + 12, 16, 4); if (no(-1, 0)) seg(X, Y, 4, 16); if (no(1, 0)) seg(X + 12, Y, 4, 16);
  }
  function paintTile(c, x, y) {
    const t = G.map[y][x], X = x * TS, Y = y * TS, r = srnd(x * 7919 + y * 104729 + G.lv * 31);
    const nb = (dx, dy) => T(x + dx, y + dy);
    if (GROUND[t]) { const bs = baseFor(x, y); if (bs) paintBase(c, X, Y, r, bs, x, y); else paintGrass(c, X, Y, r, x, y); }
    else if ('^#dA'.includes(t)) { if (t === 'A') { px(c, X, Y, 16, 16, '#3b3b44'); } else if (G.lv === 2 && y < 10) px(c, X, Y, 16, 16, '#d6d0c4'); else paintGrass(c, X, Y, r, x, y); }
    switch (t) {
      case ',': for (let k = 0; k < 7; k++) { const fx = X + 1 + ((r() * 13) | 0), fy = Y + 2 + ((r() * 12) | 0); px(c, fx, fy, 1, 3, '#4aa64a'); px(c, fx - 1, fy - 1, 3, 2, ['#ff6f9a', '#ffe14a', '#f4f4f4', '#b48aff'][(r() * 4) | 0]); } break;
      case 'H': {
        const front = nb(0, 1) !== 'H', topH = front ? 10 : 16;
        px(c, X, Y, 16, topH, '#2b7a38');
        for (let k = 0; k < 30; k++) px(c, X + ((r() * 15) | 0), Y + ((r() * topH) | 0), 2, 1, r() < .45 ? '#41a04d' : '#1f5e2a');
        for (let k = 0; k < 3; k++) { const fx = X + 2 + ((r() * 12) | 0), fy = Y + 2 + ((r() * (topH - 4)) | 0); px(c, fx, fy, 2, 2, '#ff6f9a'); px(c, fx, fy, 1, 1, '#ffd0de'); }
        if (nb(0, -1) !== 'H') { px(c, X, Y, 16, 1, '#123f19'); px(c, X, Y + 1, 16, 1, '#5cbf62'); }
        if (nb(-1, 0) !== 'H') px(c, X, Y, 1, topH, '#123f19');
        if (nb(1, 0) !== 'H') px(c, X + 15, Y, 1, topH, '#123f19');
        if (front) { px(c, X, Y + 10, 16, 6, '#1a5223'); for (let i = 1; i < 16; i += 3) px(c, X + i, Y + 11 + (i % 2), 1, 4, '#0f3516'); px(c, X, Y + 10, 16, 1, '#0f3516'); px(c, X, Y + 15, 16, 1, 'rgba(0,0,0,.5)'); }
        break;
      }
      case 'b': {
        ell(c, X + 8, Y + 13, 8, 3, 'rgba(0,0,0,.35)'); ell(c, X + 8, Y + 8, 8, 7, '#123f19'); ell(c, X + 8, Y + 8, 7, 6, '#1f6a2a'); ell(c, X + 7, Y + 7, 5, 4, '#2f8a38'); ell(c, X + 6, Y + 5, 2.5, 2, '#5cbf62');
        if (r() < .6) { px(c, X + 10, Y + 9, 2, 2, '#d33'); px(c, X + 4, Y + 10, 2, 2, '#d33'); px(c, X + 10, Y + 9, 1, 1, '#ff8a8a'); }
        break;
      }
      case 'T': case 't': ell(c, X + 10, Y + 14, 12, 4, 'rgba(0,0,0,.4)'); px(c, X + 5, Y + 4, 6, 12, '#3a2412'); px(c, X + 6, Y + 4, 4, 12, t === 't' ? '#6a5a4a' : '#6a4426'); px(c, X + 6, Y + 4, 1, 12, t === 't' ? '#8a7a6a' : '#8a5a32'); px(c, X + 4, Y + 14, 8, 2, '#3a2412'); break;
      case 'W': {
        px(c, X, Y, 16, 16, G.lv === 1 ? '#2a5a4a' : '#2a5ec4');
        for (let k = 0; k < 3; k++) px(c, X + ((r() * 11) | 0), Y + 3 + ((r() * 10) | 0), 4, 1, G.lv === 1 ? '#3f7a62' : '#4f86e6');
        if (r() < .18) { ell(c, X + 8, Y + 8, 4, 3, '#2e8a3a'); px(c, X + 8, Y + 6, 3, 2, G.lv === 1 ? '#2a5a4a' : '#2a5ec4'); if (r() < .4) px(c, X + 6, Y + 7, 2, 2, '#ff8ab0'); }
        rim(c, X, Y, x, y, 'W', '#7a5230', '#a37a4a', '#4a2f18');
        break;
      }
      case 'P': {
        px(c, X, Y, 16, 16, '#4aaee8'); for (let k = 0; k < 2; k++) px(c, X + ((r() * 10) | 0), Y + 2 + ((r() * 12) | 0), 6, 1, '#9fdcff');
        if (nb(0, -1) !== 'P') px(c, X, Y + 4, 16, 3, '#2a7ab8');
        rim(c, X, Y, x, y, 'P', '#e8eef2', '#c8d0d6', '#ffffff');
        break;
      }
      case 'G': {
        ell(c, X + 9, Y + 14, 7, 2, 'rgba(0,0,0,.35)'); const v = (x * 7 + y * 3) % 3;
        if (v === 0) { px(c, X + 3, Y + 3, 10, 12, '#1a1a20'); px(c, X + 4, Y + 1, 8, 2, '#1a1a20'); px(c, X + 4, Y + 3, 8, 11, '#a3a9b2'); px(c, X + 5, Y + 2, 6, 1, '#a3a9b2'); px(c, X + 10, Y + 3, 2, 11, '#7a8089'); px(c, X + 4, Y + 3, 1, 11, '#cfd4da'); px(c, X + 6, Y + 6, 4, 1, '#5a6068'); px(c, X + 6, Y + 8, 4, 1, '#5a6068'); px(c, X + 6, Y + 10, 3, 1, '#5a6068'); }
        else if (v === 1) { px(c, X + 6, Y + 1, 4, 14, '#1a1a20'); px(c, X + 3, Y + 4, 10, 4, '#1a1a20'); px(c, X + 7, Y + 2, 2, 12, '#b8bdc6'); px(c, X + 4, Y + 5, 8, 2, '#b8bdc6'); px(c, X + 8, Y + 2, 1, 12, '#8a9099'); px(c, X + 4, Y + 13, 8, 2, '#5a6068'); }
        else { px(c, X + 5, Y + 1, 6, 14, '#1a1a20'); px(c, X + 6, Y + 2, 4, 12, '#9aa0a8'); px(c, X + 6, Y + 2, 1, 12, '#c8cdd4'); px(c, X + 9, Y + 2, 1, 12, '#6a7078'); px(c, X + 7, Y, 2, 2, '#9aa0a8'); px(c, X + 4, Y + 13, 8, 2, '#5a6068'); }
        break;
      }
      case 'g': ell(c, X + 8, Y + 9, 7, 4, '#3a2412'); ell(c, X + 8, Y + 8, 6, 3.5, '#6a4626'); px(c, X + 4, Y + 7, 3, 1, '#8a6038'); px(c, X + 9, Y + 9, 3, 1, '#4a2f18'); px(c, X + 6, Y + 10, 2, 1, '#8a6038'); break;
      case 'X': {
        px(c, X, Y, 16, 16, '#203a10'); const inner = (dx, dy) => T(x + dx, y + dy) === 'X';
        const l = inner(-1, 0) ? 0 : 3, tp = inner(0, -1) ? 0 : 3, rr_ = inner(1, 0) ? 0 : 3, bt = inner(0, 1) ? 0 : 3;
        px(c, X + l, Y + tp, 16 - l - rr_, 16 - tp - bt, '#6fd42a'); px(c, X + l, Y + tp, 16 - l - rr_, 2, '#9bef4a');
        for (let k = 0; k < 6; k++) px(c, X + 3 + ((r() * 10) | 0), Y + 3 + ((r() * 10) | 0), 2, 2, r() < .5 ? '#c6ff6a' : '#4aa020');
        break;
      }
      case 'S': {
        px(c, X, Y, 16, 16, '#dcc27e'); for (let k = 0; k < 14; k++) px(c, X + ((r() * 16) | 0), Y + ((r() * 16) | 0), 1, 1, r() < .5 ? '#f0d99e' : '#b89c5a');
        if (r() < .12) { px(c, X + 5, Y + 6, 4, 3, '#e74c3c'); px(c, X + 6, Y + 4, 1, 2, '#555'); }
        rim(c, X, Y, x, y, 'S', '#9a6a3a', '#b88050', '#6a4220');
        break;
      }
      case 'F': for (let i = 1; i < 16; i += 5) { px(c, X + i - 1, Y + 1, 5, 14, '#2a2a2a'); px(c, X + i, Y + 2, 3, 12, '#f6f6f6'); px(c, X + i + 2, Y + 2, 1, 12, '#b8b8b8'); px(c, X + i + 1, Y + 1, 1, 1, '#f6f6f6'); } px(c, X, Y + 5, 16, 2, '#e8e8e8'); px(c, X, Y + 10, 16, 2, '#e8e8e8'); px(c, X, Y + 15, 16, 1, 'rgba(0,0,0,.35)'); break;
      case 'w': px(c, X, Y + 1, 16, 14, '#3a2412'); for (let j = 2; j < 14; j += 4) { px(c, X, Y + j, 16, 3, '#8a5a32'); px(c, X, Y + j, 16, 1, '#a8743e'); } for (let i = 0; i < 16; i += 8) px(c, X + i + 3, Y + 1, 2, 14, '#5a3a1e'); px(c, X, Y + 15, 16, 1, 'rgba(0,0,0,.4)'); break;
      case 'I': { px(c, X, Y + 4, 16, 2, '#1a1a1e'); px(c, X, Y + 12, 16, 2, '#1a1a1e'); for (let i = 1; i < 16; i += 4) { px(c, X + i, Y + 2, 2, 13, '#22222a'); px(c, X + i, Y + 2, 1, 13, '#4a4a56'); px(c, X + i - 1, Y + 1, 4, 1, '#22222a'); px(c, X + i, Y, 2, 1, '#4a4a56'); } px(c, X, Y + 15, 16, 1, 'rgba(0,0,0,.35)'); break; }
      case 'C': { const front = nb(0, 1) !== 'C' && nb(0, 1) !== 'K'; px(c, X, Y, 16, 16, '#6a6a72'); for (let j = 0; j < 16; j += 5) for (let i = (j % 10 ? 0 : 4); i < 16; i += 8) { px(c, X + i, Y + j, 7, 4, '#8a8a94'); px(c, X + i, Y + j, 7, 1, '#a8a8b2'); } if (front) { px(c, X, Y + 11, 16, 5, '#4a4a52'); px(c, X, Y + 15, 16, 1, 'rgba(0,0,0,.5)'); } break; }
      case 'Q': ell(c, X + 8, Y + 14, 7, 2, 'rgba(0,0,0,.4)'); px(c, X + 2, Y + 2, 12, 13, '#1a1a10'); px(c, X + 3, Y + 3, 10, 11, '#e0b020'); px(c, X + 3, Y + 3, 3, 11, '#f4cf4a'); px(c, X + 11, Y + 3, 2, 11, '#a07a10'); px(c, X + 3, Y + 6, 10, 1, '#5a4a10'); px(c, X + 3, Y + 11, 10, 1, '#5a4a10'); px(c, X + 6, Y + 7, 4, 3, '#111'); px(c, X + 7, Y + 8, 2, 1, '#e0b020'); ell(c, X + 8, Y + 3, 5, 1.5, '#7ac030'); break;
      case 'q': px(c, X + 7, Y + 8, 2, 8, '#3a2412'); px(c, X + 3, Y + 3, 10, 6, '#111'); px(c, X + 4, Y + 4, 8, 4, '#3a5aa6'); px(c, X + 4, Y + 4, 8, 1, '#6a8ad6'); px(c, X + 12, Y + 2, 1, 4, '#d33'); px(c, X + 12, Y + 2, 2, 2, '#d33'); break;
      case 'B': px(c, X + 1, Y + 4, 14, 3, '#3a2412'); px(c, X + 1, Y + 4, 14, 1, '#8a5a32'); px(c, X + 1, Y + 8, 14, 4, '#3a2412'); px(c, X + 1, Y + 8, 14, 3, '#a8743e'); px(c, X + 2, Y + 12, 2, 3, '#222'); px(c, X + 12, Y + 12, 2, 3, '#222'); break;
      case 'n': ell(c, X + 8, Y + 15, 4, 1.5, 'rgba(0,0,0,.4)'); px(c, X + 7, Y + 2, 3, 14, '#1a1a20'); px(c, X + 7, Y + 2, 1, 14, '#4a4a56'); px(c, X + 5, Y + 13, 7, 3, '#1a1a20'); break;
      case 'k': px(c, X, Y + 3, 16, 9, '#3a2412'); px(c, X + 1, Y + 4, 14, 7, '#a8743e'); for (let i = 2; i < 16; i += 4) px(c, X + i, Y + 4, 1, 7, '#8a5a32'); px(c, X + 1, Y + 12, 2, 3, '#3a2412'); px(c, X + 13, Y + 12, 2, 3, '#3a2412'); if (nb(1, 0) !== 'k') { px(c, X + 9, Y + 5, 4, 3, '#fff'); px(c, X + 10, Y + 6, 2, 1, '#e74c3c'); } break;
      case 'j': ell(c, X + 8, Y + 14, 6, 2, 'rgba(0,0,0,.4)'); ell(c, X + 8, Y + 7, 7, 5, '#111'); ell(c, X + 8, Y + 6, 6, 3.5, '#2a2a30'); px(c, X + 3, Y + 5, 10, 1, '#777'); px(c, X + 3, Y + 7, 10, 1, '#777'); px(c, X + 5, Y + 5, 3, 2, '#b8432f'); px(c, X + 9, Y + 6, 3, 2, '#b8432f'); px(c, X + 4, Y + 11, 1, 4, '#111'); px(c, X + 11, Y + 11, 1, 4, '#111'); break;
      case 'L': px(c, X, Y + 1, 16, 14, '#1a1a1e'); for (let i = 1; i < 16; i += 3) px(c, X + i, Y + 2, 2, 12, '#5a5a66'); px(c, X, Y + 1, 16, 2, '#3a3a44'); px(c, X + 5, Y + 6, 6, 5, '#ffd23f'); px(c, X + 7, Y + 8, 2, 2, '#1a1a1e'); px(c, X + 6, Y + 4, 4, 2, '#c9a227'); break;
      case 'K': px(c, X, Y, 16, 16, '#3a2412'); px(c, X + 1, Y + 1, 14, 15, '#6a4426'); for (let i = 3; i < 16; i += 4) px(c, X + i, Y + 1, 1, 15, '#4a2f18'); px(c, X + 5, Y + 6, 6, 5, '#ffd23f'); px(c, X + 7, Y + 8, 2, 2, '#3a2412'); break;
      case 'R': { px(c, X, Y, 16, 16, '#3b3b44'); for (let k = 0; k < 6; k++) px(c, X + ((r() * 16) | 0), Y + ((r() * 16) | 0), 1, 1, '#4a4a54'); if (nb(0, 1) === 'R' && nb(0, -1) !== 'R' && x % 3 !== 0) px(c, X + 2, Y + 15, 10, 2, '#e7c84a'); if (nb(1, 0) === 'R' && nb(-1, 0) !== 'R' && G.lv === 2 && y % 3 === 2) px(c, X + 15, Y, 1, 16, '#ddd'); break; }
      case 'r': px(c, X, Y, 16, 16, '#b4b4b8'); px(c, X + 15, Y, 1, 16, '#8a8a90'); px(c, X, Y + 15, 16, 1, '#8a8a90'); px(c, X + ((r() * 12) | 0), Y + ((r() * 12) | 0), 2, 1, '#a0a0a6'); break;
      case 'D': px(c, X, Y, 16, 16, '#c4c4c0'); px(c, X, Y, 16, 1, '#a8a8a4'); px(c, X + ((r() * 12) | 0), Y + 4 + ((r() * 8) | 0), 3, 2, 'rgba(0,0,0,.08)'); break;
      case 'p': { px(c, X, Y, 16, 16, '#d6d0c4'); px(c, X, Y, 8, 8, '#ccc6ba'); px(c, X + 8, Y + 8, 8, 8, '#ccc6ba'); px(c, X + 7, Y, 1, 16, '#b0a898'); px(c, X, Y + 7, 16, 1, '#b0a898'); if (r() < .1) px(c, X + 2 + ((r() * 10) | 0), Y + 2 + ((r() * 10) | 0), 3, 1, '#9a9282'); break; }
      case 'u': px(c, X, Y, 16, 16, '#8a6a42'); for (let k = 0; k < 8; k++) px(c, X + ((r() * 15) | 0), Y + ((r() * 15) | 0), 2, 1, r() < .5 ? '#a8845a' : '#6a4e2e'); break;
      case 'v': px(c, X, Y, 16, 16, '#5a3e22'); px(c, X, Y + 2, 16, 2, '#4a3018'); px(c, X, Y + 12, 16, 2, '#4a3018'); for (let i = 1; i < 16; i += 5) { px(c, X + i, Y + 5, 3, 3, '#3a9a3a'); px(c, X + i + 1, Y + 4, 1, 5, '#5cbf62'); if ((x + i) % 3 === 0) px(c, X + i + 1, Y + 9, 2, 2, '#e74c3c'); else if ((x + i) % 3 === 1) px(c, X + i + 1, Y + 9, 1, 2, '#ff8a3d'); } break;
      case 'f': px(c, X, Y, 16, 16, '#5a3a20'); for (let k = 0; k < 9; k++) { const fx = X + 1 + ((r() * 13) | 0), fy = Y + 1 + ((r() * 13) | 0); px(c, fx, fy + 1, 1, 2, '#3a9a3a'); px(c, fx - 1, fy, 3, 2, ['#ff3d5a', '#ffe14a', '#ff8ab0', '#fff'][(r() * 4) | 0]); } break;
      case '=': { const vert = T(x - 1, y) === 'W' || T(x + 1, y) === 'W' ? (T(x, y - 1) === '=' || T(x, y + 1) === '=') && !(T(x - 1, y) === '=' || T(x + 1, y) === '=') : false;
        if (vert) { px(c, X, Y, 16, 16, '#5a3a1e'); for (let j = 0; j < 16; j += 4) { px(c, X + 2, Y + j, 12, 3, '#a8743e'); px(c, X + 2, Y + j, 12, 1, '#c8945e'); } px(c, X, Y, 2, 16, '#3a2412'); px(c, X + 14, Y, 2, 16, '#3a2412'); }
        else { px(c, X, Y, 16, 16, '#5a3a1e'); for (let i = 0; i < 16; i += 4) { px(c, X + i, Y + 2, 3, 12, '#a8743e'); px(c, X + i, Y + 2, 1, 12, '#c8945e'); } px(c, X, Y, 16, 2, '#3a2412'); px(c, X, Y + 14, 16, 2, '#3a2412'); }
        break; }
    }
  }
  const ROOFS = [['#a63a3a', '#7a2626', '#c85a5a'], ['#3a5aa6', '#263e7a', '#5a7ac8'], ['#5a4a8a', '#3e3266', '#7a6aaa'], ['#3a7a5a', '#265a40', '#5a9a7a']];
  const WALLS = [['#e8d8b0', '#c9b78e'], ['#d8e0ea', '#b4c0cc'], ['#f2e2c8', '#d4c0a0'], ['#e0c8c8', '#c0a4a4']];
  function paintBuilding(c, B) {
    const X = B.x * TS, Y = B.y * TS, W = B.w * TS, Hh = B.h * TS, r = srnd(B.x * 13 + B.y * 7);
    ell(c, X + W / 2 + 4, Y + Hh, W / 2 + 4, 6, 'rgba(0,0,0,.35)');
    if (B.style === 'house') {
      const [rf, rd, rl] = ROOFS[B.roof % 4], [wl, wd] = WALLS[B.wall % 4], wy = Y + 30;
      px(c, X, wy, W, Hh - 30, wl); for (let j = wy + 4; j < Y + Hh; j += 4) px(c, X, j, W, 1, wd);
      px(c, X, Y + Hh - 2, W, 2, '#8a8070');
      px(c, X - 2, Y, W + 4, 32, '#2a1a12'); px(c, X - 1, Y + 1, W + 2, 30, rf);
      for (let j = Y + 4; j < Y + 31; j += 5) { px(c, X - 1, j, W + 2, 1, rd); for (let i = X + ((j / 5) % 2 ? 0 : 4); i < X + W; i += 8) px(c, i, j - 4, 1, 4, rd); }
      px(c, X - 1, Y + 1, W + 2, 2, rl); px(c, X - 1, Y + 14, W + 2, 2, rl); px(c, X - 1, Y + 29, W + 2, 2, rd);
      const ch = X + W - 22; px(c, ch, Y - 6, 10, 14, '#2a1a12'); px(c, ch + 1, Y - 5, 8, 12, '#a0523a'); for (let j = Y - 3; j < Y + 7; j += 3) px(c, ch + 1, j, 8, 1, '#7a3a26'); px(c, ch, Y - 7, 10, 2, '#555');
      for (let i = X + 8; i < X + W - 12; i += 28) { if (Math.abs(i + 8 - (B.door * TS + 8)) < 18) continue; px(c, i - 1, wy + 7, 18, 14, '#2a2a3a'); px(c, i, wy + 8, 16, 12, B.ruined ? '#1a1a22' : '#6fb0e6'); px(c, i + 7, wy + 8, 2, 12, '#2a2a3a'); px(c, i, wy + 13, 16, 2, '#2a2a3a'); if (!B.ruined) { px(c, i + 1, wy + 9, 5, 3, '#c8e8ff'); px(c, i - 4, wy + 7, 3, 14, rd); px(c, i + 17, wy + 7, 3, 14, rd); } else { px(c, i + 3, wy + 9, 1, 8, '#555'); px(c, i + 10, wy + 10, 4, 1, '#555'); } }
      const dx = B.door * TS; px(c, dx + 1, wy + 2, 14, Hh - 32, '#2a1a12'); px(c, dx + 2, wy + 3, 12, Hh - 34, B.ruined ? '#4a3a2a' : '#8a3a2a'); px(c, dx + 4, wy + 5, 8, 6, B.ruined ? '#3a2a1a' : '#a04a36'); px(c, dx + 11, wy + 13, 2, 2, '#ffd23f'); px(c, dx + 13, wy + 1, 3, 3, '#fff6a0');
      if (B.ruined) { for (let k = 0; k < 6; k++) px(c, X + ((r() * W) | 0), Y + ((r() * 28) | 0), 4, 3, '#1a1a1a'); }
    } else if (B.style === 'chapel' || B.style === 'tomb') {
      const wy = Y + 30; px(c, X, wy, W, Hh - 30, '#8a8a94'); for (let j = wy; j < Y + Hh; j += 6) for (let i = X + ((j / 6) % 2 ? 0 : 6); i < X + W; i += 12) { px(c, i, j, 11, 5, '#a2a2ac'); px(c, i, j, 11, 1, '#b8b8c2'); }
      px(c, X - 2, Y, W + 4, 32, '#14141a'); px(c, X - 1, Y + 1, W + 2, 30, '#3a3a4a'); for (let j = Y + 5; j < Y + 31; j += 5) px(c, X - 1, j, W + 2, 1, '#2a2a36'); px(c, X - 1, Y + 1, W + 2, 2, '#5a5a6a');
      const cx = X + W / 2; if (B.style === 'chapel') { px(c, cx - 8, Y - 26, 16, 30, '#14141a'); px(c, cx - 7, Y - 25, 14, 28, '#8a8a94'); px(c, cx - 7, Y - 34, 14, 10, '#3a3a4a'); px(c, cx - 1, Y - 44, 2, 10, '#c9a227'); px(c, cx - 4, Y - 40, 8, 2, '#c9a227'); ell(c, cx, Y - 12, 4, 4, '#ffd23f'); ell(c, cx, Y - 12, 2.5, 2.5, '#ff6a3d'); }
      else { for (let i = X + 6; i < X + W - 4; i += 18) { px(c, i, wy - 2, 6, Hh - 30, '#c8c8d0'); px(c, i, wy - 2, 2, Hh - 30, '#e8e8f0'); } }
      const dx = B.door * TS; px(c, dx, wy + 4, 16, Hh - 34, '#14141a'); ell(c, dx + 8, wy + 5, 8, 6, '#14141a'); px(c, dx + 2, wy + 6, 12, Hh - 36, '#3a2412'); px(c, dx + 7, wy + 6, 2, Hh - 36, '#14141a');
      if (B.style === 'chapel') for (const i of [X + 12, X + W - 24]) { px(c, i, wy + 4, 12, 16, '#14141a'); px(c, i + 1, wy + 5, 10, 14, '#7a3ab0'); px(c, i + 1, wy + 5, 5, 7, '#c85a5a'); px(c, i + 6, wy + 12, 5, 7, '#3a7ad6'); px(c, i + 5, wy + 5, 1, 14, '#14141a'); }
    } else if (B.style === 'plant') {
      const wy = Y + 30; px(c, X, Y, W, Hh, '#5a6066'); for (let i = X; i < X + W; i += 4) px(c, i, Y, 1, Hh, '#4a5056'); px(c, X, Y, W, 4, '#7a8086'); px(c, X, wy - 2, W, 2, '#3a4046');
      for (const sx of [X + 14, X + W - 30]) { px(c, sx, Y - 30, 14, 34, '#2a2a30'); px(c, sx + 1, Y - 29, 12, 32, '#8a5a3a'); px(c, sx + 1, Y - 24, 12, 3, '#e0e0e0'); px(c, sx + 1, Y - 14, 12, 3, '#e0e0e0'); }
      px(c, X + W / 2 - 46, Y + 8, 92, 16, '#14141a'); px(c, X + W / 2 - 45, Y + 9, 90, 14, '#e0b020'); c.fillStyle = '#14141a'; c.font = 'bold 9px monospace'; c.textAlign = 'center'; c.fillText('FEES INC. WASTE', X + W / 2, Y + 19);
      const dx = B.door * TS - 8; px(c, dx, wy + 6, 32, Hh - 36, '#2a2a30'); for (let j = wy + 8; j < Y + Hh - 2; j += 3) px(c, dx + 1, j, 30, 1, '#6a7076');
    } else if (B.style === 'bank') {
      px(c, X, Y + 14, W, Hh - 14, '#e8e4da'); px(c, X - 4, Y + 10, W + 8, 8, '#14141a'); px(c, X - 3, Y + 11, W + 6, 6, '#d8d2c4');
      c.fillStyle = '#14141a'; c.beginPath(); c.moveTo(X - 4, Y + 11); c.lineTo(X + W / 2, Y - 18); c.lineTo(X + W + 4, Y + 11); c.fill(); c.fillStyle = '#e8e4da'; c.beginPath(); c.moveTo(X, Y + 10); c.lineTo(X + W / 2, Y - 14); c.lineTo(X + W, Y + 10); c.fill();
      c.fillStyle = '#c9a227'; c.font = 'bold 10px monospace'; c.textAlign = 'center'; c.fillText('$', X + W / 2, Y + 4);
      px(c, X + 20, Y + 20, W - 40, 12, '#14141a'); px(c, X + 21, Y + 21, W - 42, 10, '#c9a227'); c.fillStyle = '#14141a'; c.font = 'bold 9px monospace'; c.fillText('TOO BIG BANK & TRUST', X + W / 2, Y + 29);
      for (let i = X + 10; i < X + W - 10; i += 28) { px(c, i - 1, Y + 34, 12, Hh - 36, '#14141a'); px(c, i, Y + 35, 10, Hh - 38, '#f6f2e8'); px(c, i + 2, Y + 35, 2, Hh - 38, '#d8d2c4'); px(c, i + 7, Y + 35, 2, Hh - 38, '#c8c2b4'); px(c, i - 2, Y + 34, 14, 3, '#d8d2c4'); }
      const dx = B.door * TS - 8; px(c, dx, Y + Hh - 28, 32, 28, '#14141a'); px(c, dx + 2, Y + Hh - 26, 28, 26, '#3a2a1a'); ell(c, dx + 16, Y + Hh - 14, 9, 9, '#8a8f99'); ell(c, dx + 16, Y + Hh - 14, 6, 6, '#b8bdc6'); px(c, dx + 15, Y + Hh - 20, 2, 12, '#5a5f69'); px(c, dx + 10, Y + Hh - 15, 12, 2, '#5a5f69');
    } else if (B.style === 'store') {
      const [wl] = WALLS[(B.x >> 2) % 4]; px(c, X, Y, W, Hh, '#2a1a12'); px(c, X + 1, Y + 1, W - 2, Hh - 2, wl);
      px(c, X + 4, Y + 4, W - 8, 14, '#14141a'); px(c, X + 5, Y + 5, W - 10, 12, ['#c0392b', '#2e86de', '#e67e22', '#8e44ad'][(B.x >> 2) % 4]); c.fillStyle = '#fff'; c.font = 'bold 8px monospace'; c.textAlign = 'center'; c.fillText(B.sign || 'STORE', X + W / 2, Y + 14);
      for (let i = X + 4; i < X + W - 4; i += 8) { px(c, i, Y + 20, 8, 6, (i / 8) % 2 ? '#fff' : '#d33'); } px(c, X + 4, Y + 26, W - 8, 2, 'rgba(0,0,0,.3)');
      px(c, X + 8, Y + 32, W - 16, Hh - 40, '#1a2a3a'); px(c, X + 9, Y + 33, 10, 6, '#6fb0e6');
      const dx = B.door * TS; px(c, dx + 2, Y + Hh - 22, 12, 22, '#14141a'); px(c, dx + 3, Y + Hh - 21, 10, 21, '#5a7a9a');
    }
  }
  function paintObjects(c) {
    for (const B of G.O.houses) paintBuilding(c, B);
    for (const [x, y] of G.O.fountains) {
      const X = x * TS, Y = y * TS; ell(c, X + 26, Y + 30, 24, 14, 'rgba(0,0,0,.35)'); ell(c, X + 24, Y + 26, 24, 18, '#5a5a62'); ell(c, X + 24, Y + 24, 23, 17, '#c8c8d0'); ell(c, X + 24, Y + 25, 19, 13, '#2a6ac0'); ell(c, X + 24, Y + 24, 17, 11, '#4a8ae0');
      ell(c, X + 24, Y + 20, 7, 5, '#a8a8b0'); px(c, X + 22, Y + 6, 4, 14, '#a8a8b0'); ell(c, X + 24, Y + 8, 6, 3, '#c8c8d0'); px(c, X + 23, Y + 2, 2, 6, '#bfe8ff');
      if (G.lv === 2) { c.fillStyle = '#c9a227'; c.font = 'bold 8px monospace'; c.textAlign = 'center'; c.fillText('$', X + 24, Y + 22); }
    }
    for (const [x, y] of G.O.swings) { const X = x * TS, Y = y * TS; px(c, X + 2, Y - 10, 3, 26, '#c0392b'); px(c, X + 43, Y - 10, 3, 26, '#c0392b'); px(c, X + 2, Y - 12, 44, 3, '#e74c3c'); for (const sx of [X + 12, X + 30]) { px(c, sx, Y - 9, 1, 16, '#777'); px(c, sx + 6, Y - 9, 1, 16, '#777'); px(c, sx - 1, Y + 7, 9, 3, '#3a5aa6'); } }
    for (const [x, y, col] of G.O.cars) {
      const X = x * TS, Y = y * TS; ell(c, X + 17, Y + 14, 16, 4, 'rgba(0,0,0,.4)'); px(c, X + 1, Y + 1, 30, 14, '#111'); px(c, X + 2, Y + 2, 28, 12, col); px(c, X + 2, Y + 2, 28, 2, shade(col, 1.3)); px(c, X + 9, Y + 3, 14, 10, shade(col, .8)); px(c, X + 7, Y + 3, 4, 10, '#9fd0ff'); px(c, X + 21, Y + 3, 3, 10, '#6a9ac8'); px(c, X + 7, Y + 3, 1, 10, '#d8f0ff');
      for (const wx of [X + 4, X + 23]) { px(c, wx, Y, 5, 2, '#111'); px(c, wx, Y + 14, 5, 2, '#111'); } px(c, X + 29, Y + 3, 2, 2, '#fff6a0'); px(c, X + 29, Y + 11, 2, 2, '#fff6a0'); px(c, X + 1, Y + 3, 1, 2, '#d33'); px(c, X + 1, Y + 11, 1, 2, '#d33');
    }
    for (const [x, y] of G.O.tramps) paintTramp(c, x * TS, y * TS, 0);
  }
  function paintTramp(c, X, Y, squash) {
    // a real backyard trampoline: legs, padded frame, springs, black mat
    ell(c, X + 18, Y + 24, 16, 7, 'rgba(0,0,0,.4)');
    for (const [lx, ly] of [[5, 18], [25, 18], [8, 24], [22, 24]]) px(c, X + lx, Y + ly, 2, 6, '#2a2a30');
    ell(c, X + 16, Y + 15, 16, 12, '#111');
    ell(c, X + 16, Y + 14, 15, 11, '#2e86de');
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; if (k % 2) continue; c.fillStyle = '#1b5fa8'; c.beginPath(); c.ellipse(X + 16 + Math.cos(a) * 13, Y + 14 + Math.sin(a) * 9.5, 3, 2, a, 0, 7); c.fill(); }
    ell(c, X + 16, Y + 14 + squash, 11, 7.5, '#9aa4ac');
    ell(c, X + 16, Y + 14 + squash, 10, 6.5, squash ? '#0a0a0e' : '#18181e');
    c.strokeStyle = '#c8cdd4'; c.lineWidth = 1; for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; c.beginPath(); c.moveTo(X + 16 + Math.cos(a) * 10.5, Y + 14 + squash + Math.sin(a) * 7); c.lineTo(X + 16 + Math.cos(a) * 12.5, Y + 14 + Math.sin(a) * 9); c.stroke(); }
    if (!squash) { ell(c, X + 12, Y + 11, 4, 1.5, 'rgba(255,255,255,.12)'); }
    px(c, X + 4, Y + 9, 3, 2, '#7ab8ff');
  }
  function paintTop(c) {
    for (const [x, y, kind] of G.O.trees) {
      const X = x * TS + 8, Y = y * TS + 2, secret = G.O.secretTree && G.O.secretTree[0] === x && G.O.secretTree[1] === y, r = srnd(x * 31 + y * 17);
      if (kind === 'dead') { c.strokeStyle = '#2a1e14'; c.lineWidth = 3; c.beginPath(); c.moveTo(X, Y + 6); c.lineTo(X, Y - 8); c.moveTo(X, Y - 2); c.lineTo(X - 10, Y - 12); c.moveTo(X, Y - 6); c.lineTo(X + 9, Y - 16); c.moveTo(X - 6, Y - 8); c.lineTo(X - 12, Y - 8); c.stroke(); c.strokeStyle = '#6a5a4a'; c.lineWidth = 1; c.beginPath(); c.moveTo(X - 1, Y + 6); c.lineTo(X - 1, Y - 8); c.moveTo(X + 1, Y - 6); c.lineTo(X + 9, Y - 15); c.stroke(); continue; }
      if (kind === 'pine') {
        for (let k = 0; k < 4; k++) { const w = 15 - k * 3, yy = Y + 4 - k * 7; c.fillStyle = '#0e3315'; c.beginPath(); c.moveTo(X - w - 1, yy + 1); c.lineTo(X, yy - 11); c.lineTo(X + w + 1, yy + 1); c.fill(); c.fillStyle = k % 2 ? '#1f6a2a' : '#256f30'; c.beginPath(); c.moveTo(X - w, yy); c.lineTo(X, yy - 10); c.lineTo(X + w, yy); c.fill(); c.fillStyle = '#3a8f3e'; c.beginPath(); c.moveTo(X - w + 4, yy - 1); c.lineTo(X, yy - 9); c.lineTo(X - 1, yy - 1); c.fill(); }
        continue;
      }
      const Yc = Y - 4; ell(c, X + 3, Yc + 6, 20, 15, 'rgba(0,0,0,.25)'); ell(c, X, Yc, 22, 19, '#0e3315'); ell(c, X - 1, Yc - 1, 21, 18, '#1d6428'); ell(c, X - 4, Yc - 4, 16, 13, '#2a8034'); ell(c, X - 8, Yc - 8, 8, 6, '#45a24c'); ell(c, X - 9, Yc - 10, 3, 2.5, '#7ad07e');
      for (const [ox, oy, rr2] of [[-14, 4, 8], [13, 3, 9], [0, 12, 9], [-10, -10, 7], [11, -9, 7]]) { ell(c, X + ox, Yc + oy, rr2 + 1, rr2, '#0e3315'); ell(c, X + ox - 1, Yc + oy - 1, rr2, rr2 - 1, '#22702c'); ell(c, X + ox - 3, Yc + oy - 3, rr2 * .45, rr2 * .4, '#3d9a49'); }
      for (let k = 0; k < 26; k++) { const a = r() * 6.28, d = r() * 17; px(c, (X + Math.cos(a) * d) | 0, (Y + Math.sin(a) * d * .85) | 0, 2, 2, r() < .5 ? '#3d9a49' : '#164a1f'); }
      if (r() < .4) for (let k = 0; k < 4; k++) { const a = r() * 6.28, d = 4 + r() * 8; px(c, (X + Math.cos(a) * d) | 0, (Y + Math.sin(a) * d) | 0, 2, 2, '#e74c3c'); }
      if (secret) { px(c, X + 3, Y + 4, 2, 2, '#ffd23f'); px(c, X - 5, Y + 2, 1, 1, '#ffd23f'); }
    }
    for (const [x, y] of G.O.lamps) { const X = x * TS + 8, Y = y * TS; px(c, X - 4, Y - 6, 9, 8, '#1a1a20'); px(c, X - 3, Y - 5, 7, 5, '#fff6a0'); px(c, X - 2, Y - 8, 5, 2, '#1a1a20'); }
  }
  function renderMap() {
    mapCv = document.createElement('canvas'); mapCv.width = MW; mapCv.height = MH; mapCx = mapCv.getContext('2d');
    topCv = document.createElement('canvas'); topCv.width = MW; topCv.height = MH; topCx = topCv.getContext('2d');
    for (let y = 0; y < MR; y++) for (let x = 0; x < MC; x++) paintTile(mapCx, x, y);
    paintObjects(mapCx); paintTop(topCx);
  }
  function repaintAround(x, y) {
    for (let j = y - 1; j <= y + 1; j++) for (let i = x - 1; i <= x + 1; i++) if (i >= 0 && j >= 0 && i < MC && j < MR) paintTile(mapCx, i, j);
    for (const B of G.O.houses) if (x >= B.x - 2 && x <= B.x + B.w + 1 && y >= B.y - 2 && y <= B.y + B.h + 1) paintBuilding(mapCx, B);
    for (const [tx, ty] of G.O.tramps) if (Math.abs(tx - x) < 4 && Math.abs(ty - y) < 4) paintTramp(mapCx, tx * TS, ty * TS, 0);
    G.O.trees = G.O.trees.filter(([tx, ty]) => G.map[ty][tx] === 'T' || G.map[ty][tx] === 't');
    topCx.clearRect(0, 0, MW, MH); paintTop(topCx);
  }
  // ---- data ----
  const ZT = {
    payday: { name: 'payday lender', suit: '#6a3f8f', tie: '#ffd23f', hair: '#2a1a0a', hp: 2, sp: 46, dmg: 1, q: ['Only 400% APR!', 'Fast cash!', 'Sign here. And here.'] },
    insurer: { name: 'insurance broker', suit: '#3f5a4a', tie: '#9fd8ff', hair: '#5a4a3a', hp: 3, sp: 38, dmg: 1, q: ['DENIED.', 'Pre-existing condition.', 'Not covered.', 'Read the fine print.'], prop: 'clip' },
    lobbyist: { name: 'lobbyist', suit: '#5a3a2a', tie: '#ff6b6b', hair: '#1a1a1a', hp: 3, sp: 42, dmg: 1, q: ['Just a small donation.', 'Let us do lunch.', 'I represent interests.'], prop: 'bag' },
    hedge: { name: 'hedge fund manager', suit: '#1c1c22', tie: '#c9a227', hair: '#d8c070', hp: 4, sp: 42, dmg: 2, q: ['Two and twenty.', 'We shorted your house.', 'Synergy.', 'It is not a bubble.'], prop: 'case' },
    fees: { name: 'junk fee', suit: '#a02b2b', tie: '#fff', hair: '#a02b2b', hp: 1, sp: 70, dmg: 1, q: ['Convenience fee!', 'Service fee!', 'Fee for the fee!'], small: 1 },
    crypto: { name: 'rug puller', suit: '#26262c', tie: '#ff3df0', hair: '#ff3df0', hp: 3, sp: 56, dmg: 1, q: ['Have fun staying poor.', 'Trust me bro.', 'Wen lambo.'], eyes: 1 },
    politician: { name: 'career politician', suit: '#2e3550', tie: 'split', hair: '#c8c8c8', hp: 5, sp: 34, dmg: 2, q: ['Let me be clear.', 'I do not recall.', 'Thoughts and prayers.', 'My good friend across the aisle.'] },
    pe: { name: 'private equity', suit: '#4f5566', vest: '#2a4a7a', tie: '#4f5566', hair: '#8a6a3a', hp: 6, sp: 30, dmg: 2, q: ['We are a family here.', 'Cost synergies.', 'You are all laid off.'] },
    sub: { name: 'subsidiary', suit: '#3b4f3b', tie: '#c9a227', hair: '#333', hp: 3, sp: 56, dmg: 1, q: ['Spun off!', 'Offshore!', 'Tax haven!'] },
    boss: { name: 'TOO BIG TO FAIL', hp: 70, sp: 22, dmg: 3, q: ['TOO BIG TO FAIL.', 'I need a bailout.', 'Socialize the losses!', 'Privatize the gains!'], big: 1 }
  };
  const LEVELS = [
    { name: 'NIGHT OF THE LIVING DEBT', sub: 'Save your neighbors. They have savings.', types: ['payday', 'insurer', 'lobbyist'], start: 7, every: 2.8, cap: 14 },
    { name: '28 FEES LATER', sub: 'The graveyard is full of old companies. They want company.', types: ['payday', 'insurer', 'lobbyist', 'hedge', 'fees', 'crypto'], start: 10, every: 2.2, cap: 20 },
    { name: 'DAWN OF THE BAILOUT', sub: 'Something too big to fail lives in the bank.', types: ['insurer', 'lobbyist', 'hedge', 'fees', 'crypto', 'politician', 'pe'], start: 11, every: 1.8, cap: 24 }
  ];
  const NBS = [
    ['Grandma', 'her pension', '#b48aff', 'gran', 300, '#d8d8e0'], ['Teacher', 'her lunch money', '#ffb547', '', 200, '#5a3a1e'], ['Nurse', 'his overtime', '#f4f4f4', 'nurse', 300, '#2a1a0a'], ['Barista', 'her tips', '#7a5230', '', 200, '#c0582a'],
    ['Lemonade kid', 'his startup', '#ffe14a', 'kid', 400, '#ffd23f'], ['Mail carrier', 'his route', '#3a5aa6', '', 200, '#3a2a1a'], ['Shop owner', 'her shop', '#e45d8c', '', 250, '#1a1a1a'], ['Gig worker', 'all 3 jobs', '#4df3e6', '', 200, '#5a3a1e'],
    ['1555 tourist', 'his astrolabe', '#ff6fa0', 'tour', 500, '#3a2a1a'], ['Veteran', 'his VA loan', '#5a6a3a', '', 400, '#8a8a8a'], ['BBQ dad', 'his 401(k)', '#e8e8e8', 'bbq', 300, '#5a3a1e'], ['Baby', 'its student loans', '#ffc0d0', 'baby', 600, '#c0a070'], ['Day trader', 'his margin call', '#9be37a', '', 150, '#2a2a2a']
  ];
  const WEAPONS = { squirt: ['SQUIRT GUN', 'SQUIRT', '#4df3e6'], cans: ['CHERNOBLY 6-PACK', 'CHERNOBLY', '#9be37a'], shred: ['FINE PRINT SHREDDER', 'SHREDDER', '#ffb547'], zooka: ['RULE NO.1 BAZOOKA', 'BAZOOKA', '#ff3d8b'] };
  const ITEMS = { dog: ['$1.50 HOT DOG', 'HOT DOG', '#ff8a3d'], potion: ['BULL MARKET POTION', 'BULL POTION', '#ff3d8b'], ghost: ['GOLDEN PARACHUTE', 'PARACHUTE', '#ffd23f'], shoes: ['HOVERBOARD', 'HOVERBOARD', '#ff6fd0'], decoy: ['INFLATABLE CEO', 'CEO DECOY', '#9fd8ff'], audit: ['AUDIT BOX', 'AUDIT', '#ff3d3d'], key: ['KEY', 'KEY', '#ffd23f'] };
  const rr = (a, b) => a + Math.random() * (b - a);
  const tileAt = (x, y) => T(Math.floor(x / TS), Math.floor(y / TS));
  const solidAt = (x, y) => SOLID.has(tileAt(x, y));
  function blocked(x, y, r) { return solidAt(x - r, y - r) || solidAt(x + r, y - r) || solidAt(x - r, y + r) || solidAt(x + r, y + r) || x < 16 || y < 16 || x > MW - 16 || y > MH - 16; }
  function bubble(o, t, c, life) { G.bub.push({ o, t, c: c || '#fff', life: life || 1.8 }); G.bub = G.bub.slice(-6); }
  function banner(t, s, d) { G.ban = { t, s, life: d || 2.6 }; }
  function pop(x, y, t, c) { G.pops.push({ x, y, t, c: c || '#ffd23f', life: .9 }); }
  // ---- flow field toward the player (or the decoy) ----
  function flow() {
    const dist = G.dist || (G.dist = new Int16Array(MC * MR)); dist.fill(-1);
    const tx = Math.floor((G.decoy ? G.decoy.x : G.p.x) / TS), ty = Math.floor((G.decoy ? G.decoy.y : G.p.y) / TS);
    const q = [tx + ty * MC]; dist[q[0]] = 0;
    for (let h = 0; h < q.length; h++) { const i = q[h], x = i % MC, y = (i / MC) | 0, d = dist[i] + 1;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= MC || ny >= MR) continue; const j = nx + ny * MC; if (dist[j] >= 0 || SOLID.has(G.map[ny][nx])) continue; dist[j] = d; q.push(j); } }
  }
  function stepDir(x, y) {
    const cx = Math.floor(x / TS), cy = Math.floor(y / TS); let best = null, bd = G.dist[cx + cy * MC]; if (bd < 0) bd = 1e9;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
      const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= MC || ny >= MR) continue;
      const d = G.dist[nx + ny * MC]; if (d < 0) continue;
      if (dx && dy && (SOLID.has(G.map[cy][nx]) || SOLID.has(G.map[ny][cx]))) continue;
      if (d < bd) { bd = d; best = [nx * TS + 8, ny * TS + 8]; }
    }
    return best;
  }
  // ---- level setup ----
  function startLevel(i) {
    const L = LEVELS[i], { m, O } = buildLevel(i);
    Object.assign(G, { lv: i, L, map: m, O, zs: [], ns: [], shots: [], pk: [], bub: [], fx: [], pops: [], saved: 0, lost: 0, spawnT: 3, bossDone: !O.boss, exitOpen: false, clearing: 0, decoy: null, flowT: 0, nearGrave: null, secretHits: 0, squish: {} });
    renderMap();
    G.p.x = O.start[0] * TS + 8; G.p.y = O.start[1] * TS + 8; G.p.inv = 2; G.p.hp = G.p.max; G.p.jump = 0;
    const pool = NBS.slice().sort(() => Math.random() - .5);
    O.n.forEach(([x, y], k) => { const nb = pool[k % pool.length]; G.ns.push({ n: nb[0], what: nb[1], c: nb[2], kind: nb[3], pts: nb[4], hair: nb[5], x: x * TS + 8, y: y * TS + 8, t: Math.random() * 6, grab: 0 }); });
    [...O.items, ...O.bonus].forEach(([x, y, k]) => G.pk.push({ k, x: x * TS + 8, y: y * TS + 8 }));
    G.graves = []; for (let y = 0; y < MR; y++) for (let x = 0; x < MC; x++) if (m[y][x] === 'g') G.graves.push([x * TS + 8, y * TS + 8]);
    G.dist = null; flow();
    for (let k = 0; k < L.start; k++) spawnZ(L.types[(Math.random() * L.types.length) | 0]);
    if (O.boss) setTimeout(() => { if (G && G.lv === i && !G.over) { const b = spawnZ('boss', [32 * TS + 8, 27 * TS + 8]); b.boss = 1; banner('TOO BIG TO FAIL', 'It splits into subsidiaries when you hit it.', 2.6); beep(70, .6, 'sawtooth', .05); } }, 9000);
    flow();
    banner('LEVEL ' + (i + 1), L.name + '\n' + L.sub, 3.2);
  }
  function spawnZ(type, at) {
    const Ty = ZT[type]; let x, y;
    if (at) [x, y] = at;
    else {
      const far = G.graves.filter(([a, b]) => Math.hypot(a - G.p.x, b - G.p.y) > 150);
      if (far.length && Math.random() < .6) [x, y] = far[(Math.random() * far.length) | 0];
      else for (let t = 0; t < 300; t++) { x = rr(24, MW - 24); y = rr(24, MH - 24); if (!blocked(x, y, 6) && Math.hypot(x - G.p.x, y - G.p.y) > 190 && !G.ns.some(n => Math.hypot(n.x - x, n.y - y) < 110) && tileAt(x, y) !== 'X' && tileAt(x, y) !== 'O' && G.dist[Math.floor(x / TS) + Math.floor(y / TS) * MC] >= 0) break; }
    }
    const z = { type, T: Ty, x, y, hp: Ty.hp, r: Ty.big ? 18 : (Ty.small ? 5 : 6), rise: .9, hit: 0, wob: Math.random() * 6, vx: 0, vy: 1, walk: 0 };
    G.zs.push(z);
    for (let k = 0; k < 10; k++) G.fx.push({ x, y: y + 4, vx: rr(-40, 40), vy: rr(-80, -20), life: rr(.4, .8), c: Math.random() < .5 ? '#6a4626' : '#3a2412', s: 2 });
    if (Math.random() < .3) bubble(z, Ty.q[(Math.random() * Ty.q.length) | 0], '#ffd0d0');
    return z;
  }
  function newGame(lives) {
    G = { p: { x: 0, y: 0, dx: 0, dy: 1, cd: 0, inv: 2, hp: 10, max: 10, speed: 0, bull: 0, ghost: 0, jump: 0, walk: 0, moving: 0 }, score: 0, lives: lives || 3, t: 0, last: performance.now(), over: false, paused: false,
      weapons: { squirt: Infinity, cans: 0, shred: 0, zooka: 0 }, wpn: 'squirt', items: { dog: 0, potion: 0, ghost: 0, shoes: 0, decoy: 0, audit: 0, key: 0 }, item: 'dog', toxT: 0 };
    startLevel(0);
  }
  // ---- combat ----
  function fire() {
    const p = G.p; if (p.cd > 0 || p.jump > 0) return;
    const w = G.wpn, a = Math.atan2(p.dy, p.dx), mx = p.x + p.dx * 9, my = p.y - 9 + p.dy * 7;
    if (w !== 'squirt') { if (G.weapons[w] <= 0) { nextWeapon(); return; } G.weapons[w]--; }
    if (w === 'squirt') { p.cd = .16; G.shots.push({ k: 'w', x: mx, y: my, vx: Math.cos(a) * 260, vy: Math.sin(a) * 260, life: .55, dmg: 1 }); beep(1000 + Math.random() * 200, .025, 'square', .01); }
    if (w === 'cans') { p.cd = .45; G.shots.push({ k: 'can', x: p.x, y: p.y - 4, vx: Math.cos(a) * 150, vy: Math.sin(a) * 150, life: .7, z: 6, vz: 130, dmg: 4 }); beep(500, .05, 'triangle', .03); }
    if (w === 'shred') { p.cd = .07; G.zs.forEach(z => { if (!z.dead && z.rise <= 0 && Math.hypot(z.x - (p.x + p.dx * 12), z.y - (p.y + p.dy * 12)) < z.r + 14) hurtZ(z, 1); }); for (let k = 0; k < 2; k++) G.fx.push({ x: p.x + p.dx * 14, y: p.y + p.dy * 14 - 8, vx: rr(-60, 60), vy: rr(-60, 10), life: .3, c: '#fff', s: 2, paper: 1 }); beep(160 + Math.random() * 60, .03, 'sawtooth', .015); }
    if (w === 'zooka') { p.cd = .8; G.shots.push({ k: 'rkt', x: mx, y: my, vx: Math.cos(a) * 230, vy: Math.sin(a) * 230, life: 1.2, dmg: 8 }); sweep(300, 90, .4, 'sawtooth', .03); }
    if (w !== 'squirt' && G.weapons[w] <= 0) setTimeout(() => G && G.wpn === w && nextWeapon(), 100);
  }
  function boom(x, y, rad, dmg, breaks) {
    for (let k = 0; k < 28; k++) G.fx.push({ x, y, vx: rr(-130, 130), vy: rr(-150, 60), life: rr(.3, .8), c: ['#ffd23f', '#ff8a3d', '#ff3d3d', '#fff'][(Math.random() * 4) | 0], s: 3 });
    G.fx.push({ ring: 1, x, y, r: 4, R: rad + 6, life: .35 });
    G.shake = .3; beep(80, .3, 'sawtooth', .05);
    G.zs.forEach(z => { if (!z.dead && Math.hypot(z.x - x, z.y - y) < rad + z.r) hurtZ(z, dmg); });
    if (Math.hypot(G.p.x - x, G.p.y - y) < rad * .6) hurtP(1, 'Too close!');
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const tx = Math.floor(x / TS) + i, ty = Math.floor(y / TS) + j; if (tx <= 0 || ty <= 0 || tx >= MC - 1 || ty >= MR - 1) continue;
      const t = G.map[ty][tx];
      if (t === 'Q') { G.map[ty][tx] = 'X'; repaintAround(tx, ty); G.flowT = 0; setTimeout(() => G && boom(tx * TS + 8, ty * TS + 8, 30, 6, true), 120); }
      else if (breaks && BREAK.has(t)) { G.map[ty][tx] = '.'; repaintAround(tx, ty); G.flowT = 0; }
    }
  }
  function hurtZ(z, dmg) {
    if (z.dead) return; z.hp -= dmg; z.hit = .1;
    if (z.boss) [56, 42, 28, 14].forEach(th => { if (z.hp <= th && !z['s' + th]) { z['s' + th] = 1; for (let k = 0; k < 2; k++) spawnZ('sub', [z.x + rr(-24, 24), z.y + rr(-10, 24)]); bubble(z, ZT.boss.q[(Math.random() * 4) | 0], '#ffd23f'); } });
    if (z.hp > 0) return;
    z.dead = 1; const pts = z.boss ? 5550 : 100 * z.T.hp; G.score += pts; pop(z.x, z.y - 22, '+' + pts);
    for (let k = 0; k < (z.boss ? 50 : 12); k++) G.fx.push({ x: z.x, y: z.y - 10, vx: rr(-70, 70), vy: rr(-120, 0), life: rr(.5, 1.1), c: Math.random() < .6 ? '#f4f0e0' : '#7fdc6f', s: 2, paper: 1 });
    if (z.boss) { G.bossDone = 1; banner('BAILOUT DENIED', 'The taxpayers thank you. Find the exit.', 3); flash(); sweep(1400, 60, 1, 'square', .04); }
    else if (Math.random() < .12) G.pk.push({ k: ['i:dog', 'w:cans', 'i:shoes', 'w:shred', 'i:decoy', 'w:cans'][(Math.random() * 6) | 0], x: z.x, y: z.y });
    beep(220, .06, 'square', .02);
  }
  function hurtP(n, why) {
    const p = G.p; if (p.inv > 0 || p.bull > 0 || p.jump > 0) return;
    p.hp -= n; p.inv = 1.1; G.shake = .2; beep(110, .25, 'sawtooth', .05);
    if (why) bubble(p, why, '#ffd23f');
    if (p.hp <= 0) {
      G.lives--; flash();
      if (G.lives <= 0) return endGame(false, 'THE ECONOMY ATE YOU', 'Your neighbors are on their own now.');
      p.hp = p.max; p.inv = 2.5; banner('LIFE LOST', G.lives + ' left. The market always comes back. You might not.', 2);
    }
  }
  function useItem() {
    const k = G.item, p = G.p; if (!G.items[k] || k === 'key') { nextItem(); return; }
    G.items[k]--;
    if (k === 'dog') { p.hp = Math.min(p.max, p.hp + 5); bubble(p, '$1.50. Still.', '#ff8a3d'); }
    if (k === 'potion') { p.bull = 8; banner('BULL MARKET', 'You are a bull now. Charge.', 1.6); sweep(200, 1200, .6, 'square', .03); }
    if (k === 'ghost') { p.ghost = 8; bubble(p, 'Golden parachute: nothing can touch you.', '#ffd23f'); }
    if (k === 'shoes') { p.speed = 10; bubble(p, 'Hoverboard! Not over water.', '#ff6fd0'); }
    if (k === 'decoy') { G.decoy = { x: p.x + p.dx * 20, y: p.y + p.dy * 20, life: 8 }; G.flowT = 0; bubble(G.decoy, 'INFLATABLE CEO: "Synergy!"', '#9fd8ff', 3); }
    if (k === 'audit') { G.zs.forEach(z => hurtZ(z, z.boss ? 12 : 99)); flash(); banner('AUDITED', 'Everyone has to show receipts.', 1.6); }
    beep(900, .08, 'triangle', .04);
    if (!G.items[k]) nextItem();
  }
  function nextWeapon() { const ks = Object.keys(G.weapons).filter(k => G.weapons[k] > 0); const i = ks.indexOf(G.wpn); G.wpn = ks[(i + 1) % ks.length] || 'squirt'; }
  function nextItem() { const ks = Object.keys(G.items).filter(k => k !== 'key' && G.items[k] > 0); if (!ks.length) return; const i = ks.indexOf(G.item); G.item = ks[(i + 1) % ks.length]; }
  function tryTramp(p) {
    const tx = Math.floor(p.x / TS), ty = Math.floor(p.y / TS); if (T(tx, ty) !== 'O' || p.jump > 0 || p.lastTramp > G.t) return;
    let dx = p.dx, dy = p.dy; if (!p.moving) { dx = 0; dy = -1; }
    const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    let land = null; for (let k = 92; k >= 30; k -= 6) { const lx = p.x + dx * k, ly = p.y + dy * k; if (!blocked(lx, ly, 6) && tileAt(lx, ly) !== 'O') { land = [lx, ly]; break; } }
    if (!land) return;
    const tr = G.O.tramps.find(([a, b]) => tx >= a && tx <= a + 1 && ty >= b && ty <= b + 1); if (tr) G.squish[tr.join()] = G.t + .25;
    p.jump = .85; p.jx0 = p.x; p.jy0 = p.y; p.jx1 = land[0]; p.jy1 = land[1]; p.lastTramp = G.t + 1;
    beep(300, .12, 'triangle', .05); setTimeout(() => beep(620, .12, 'triangle', .04), 90); setTimeout(() => beep(980, .1, 'triangle', .03), 180);
  }
  // ---- update ----
  function update(dt) {
    const p = G.p; G.t += dt;
    if (G.shake > 0) G.shake -= dt;
    let mx = (keysDown.r ? 1 : 0) - (keysDown.l ? 1 : 0), my = (keysDown.d ? 1 : 0) - (keysDown.u ? 1 : 0);
    if (joy.on) { mx = joy.x; my = joy.y; }
    const mag = Math.hypot(mx, my); p.moving = 0;
    const spd = p.speed > 0 ? 150 : p.bull > 0 ? 130 : 84;
    if (p.jump > 0) { p.jump -= dt; const k = Math.min(1, 1 - p.jump / .85); p.x = p.jx0 + (p.jx1 - p.jx0) * k; p.y = p.jy0 + (p.jy1 - p.jy0) * k; if (p.jump <= 0) { p.x = p.jx1; p.y = p.jy1; for (let q = 0; q < 6; q++) G.fx.push({ x: p.x, y: p.y + 6, vx: rr(-40, 40), vy: rr(-30, -5), life: .3, c: '#c8c8c0', s: 2 }); } }
    else if (mag > .15) {
      mx /= Math.max(1, mag); my /= Math.max(1, mag); p.dx = mx; p.dy = my; p.walk += dt * 10; p.moving = 1;
      const sp = spd * dt;
      if (!blocked(p.x + mx * sp, p.y, 6)) p.x += mx * sp; if (!blocked(p.x, p.y + my * sp, 6)) p.y += my * sp;
    }
    p.cd -= dt; p.inv -= dt; p.speed -= dt; p.bull -= dt; p.ghost -= dt;
    if (keysDown.f || fireHeld) fire();
    tryTramp(p);
    const here = tileAt(p.x, p.y);
    if (here === 'X' && p.jump <= 0) { G.toxT -= dt; if (G.toxT <= 0) { G.toxT = .6; hurtP(1, 'Toxic assets!'); } }
    for (const [kx, ky] of G.O.keyDoors) if (SOLID.has(G.map[ky][kx]) && Math.hypot(kx * TS + 8 - p.x, ky * TS + 8 - p.y) < 22) {
      if (G.items.key > 0) { G.items.key--; G.map[ky][kx] = G.map[ky][kx] === 'K' ? 'u' : '.'; repaintAround(kx, ky); G.flowT = 0; bubble(p, 'Unlocked.', '#ffd23f'); beep(1300, .1, 'square', .04); }
      else if (!G.keyHint || G.keyHint < G.t) { G.keyHint = G.t + 4; bubble(p, 'Locked. Needs a key.', '#ffd23f'); }
    }
    const gtx = Math.floor(p.x / TS), gty = Math.floor(p.y / TS); let near = null;
    for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) if (T(gtx + dx, gty + dy) === 'G') near = (gtx + dx) * 100 + (gty + dy);
    if (near && near !== G.nearGrave) { G.nearGrave = near; bubble({ x: Math.floor(near / 100) * TS + 8, y: (near % 100) * TS }, EPITAPHS[(near * 7) % EPITAPHS.length], '#d8dde4', 2.6); } else if (!near) G.nearGrave = null;
    G.spawnT -= dt; if (G.spawnT <= 0 && G.zs.length < G.L.cap && G.ns.length) { G.spawnT = G.L.every; spawnZ(G.L.types[(Math.random() * G.L.types.length) | 0]); }
    G.flowT -= dt; if (G.flowT <= 0) { G.flowT = .35; flow(); }
    if (G.decoy) { G.decoy.life -= dt; if (G.decoy.life <= 0) { G.decoy = null; G.flowT = 0; } }
    for (const s of G.shots) {
      s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
      if (s.k === 'can') { s.vz -= 380 * dt; s.z += s.vz * dt; if (s.z <= 0 && s.vz < 0) { s.life = 0; boom(s.x, s.y, 30, 4, false); } continue; }
      const ht = tileAt(s.x, s.y + 8);
      if (SOLID.has(ht) && !'WPUA'.includes(ht)) {
        if (s.k === 'rkt') boom(s.x, s.y + 8, 36, 8, true);
        else if (ht === 'Q') boom(Math.floor(s.x / TS) * TS + 8, Math.floor((s.y + 8) / TS) * TS + 8, 30, 6, true);
        else if (G.O.secretTree && Math.floor(s.x / TS) === G.O.secretTree[0] && Math.floor((s.y + 8) / TS) === G.O.secretTree[1]) secretTreeHit();
        else for (let k = 0; k < 3; k++) G.fx.push({ x: s.x, y: s.y, vx: rr(-40, 40), vy: rr(-50, 0), life: .25, c: '#bfe8ff', s: 1 });
        s.life = 0; continue;
      }
      for (const z of G.zs) if (!z.dead && z.rise <= 0 && Math.hypot(z.x - s.x, z.y - 10 - s.y) < z.r + 5 + (z.T.big ? 10 : 0)) { if (s.k === 'rkt') boom(s.x, s.y, 36, 8, true); else hurtZ(z, s.dmg); s.life = 0; break; }
      if (s.life <= 0 && s.k === 'rkt') boom(s.x, s.y, 36, 8, true);
    }
    G.shots = G.shots.filter(s => s.life > 0);
    for (const z of G.zs) {
      if (z.dead) continue; z.hit -= dt;
      if (z.rise > 0) { z.rise -= dt; continue; }
      if (z.grabbing) { const n = z.grabbing; if (n.gone || Math.hypot(n.x - z.x, n.y - z.y) > 18) z.grabbing = null; else continue; }
      let tgt = null, best = 96;
      for (const n of G.ns) { const d = Math.hypot(n.x - z.x, n.y - z.y); if (d < best) { best = d; tgt = [n.x, n.y]; } }
      if (!tgt) tgt = stepDir(z.x, z.y) || [p.x, p.y];
      const sp = z.T.sp * (.85 + G.lv * .1) * dt, a = Math.atan2(tgt[1] - z.y, tgt[0] - z.x) + Math.sin(G.t * 3 + z.wob) * .2;
      const nx = z.x + Math.cos(a) * sp, ny = z.y + Math.sin(a) * sp, rad = Math.min(z.r, 7);
      if (!blocked(nx, z.y, rad)) z.x = nx; if (!blocked(z.x, ny, rad)) z.y = ny;
      z.vx = Math.cos(a); z.vy = Math.sin(a); z.walk += dt * 8;
      for (const n of G.ns) if (!n.gone && !z.grabbing && Math.hypot(n.x - z.x, n.y - z.y) < z.r + 8) { z.grabbing = n; bubble(n, 'HELP! A ' + z.T.name.toUpperCase() + '!', '#ff8a8a'); }
      if (Math.hypot(p.x - z.x, p.y - z.y) < z.r + 7) { if (p.bull > 0) hurtZ(z, 99); else if (p.ghost <= 0) hurtP(z.T.dmg, ['My portfolio!', 'Ow. That was a fee.', 'Not again.', 'Overdraft!'][(Math.random() * 4) | 0]); }
      if (G.over) return;
    }
    G.zs = G.zs.filter(z => !z.dead);
    for (const n of G.ns) {
      if (n.gone) continue; n.t += dt;
      const grabbed = G.zs.some(z => z.grabbing === n);
      if (grabbed) { n.grab += dt; if (n.grab > 4) { n.gone = 1; G.lost++; bubble({ x: n.x, y: n.y }, `${n.n}: ${n.what} acquired.`, '#ff8a8a', 2.4); beep(120, .3, 'sawtooth', .04); G.zs.forEach(z => { if (z.grabbing === n) z.grabbing = null; }); for (let k = 0; k < 14; k++) G.fx.push({ x: n.x, y: n.y - 10, vx: rr(-50, 50), vy: rr(-90, -10), life: .8, c: '#2e7d32', s: 2, paper: 1 }); continue; } }
      else n.grab = Math.max(0, n.grab - dt * .5);
      if (Math.random() < dt * .08) bubble(n, ['HELP!', 'My savings!', 'Is that a fee?', 'Over here!'][(Math.random() * 4) | 0], n.c);
      if (Math.hypot(n.x - p.x, n.y - p.y) < 15 && p.jump <= 0) { n.gone = 1; n.saved = 1; G.saved++; G.score += n.pts; pop(n.x, n.y - 24, '+' + n.pts, '#9be37a'); bubble({ x: n.x, y: n.y }, `SAVED: ${n.n} and ${n.what}`, '#9be37a', 2.2); for (let k = 0; k < 10; k++) G.fx.push({ x: n.x, y: n.y - 10, vx: rr(-60, 60), vy: rr(-120, -20), life: .7, c: ['#ffd23f', '#4df3e6', '#ff8ab0'][k % 3], s: 2 }); [660, 880, 1320].forEach((f, k) => setTimeout(() => beep(f, .07, 'triangle', .04), k * 70)); }
    }
    G.ns = G.ns.filter(n => !n.gone);
    for (const k of G.pk) if (!k.got && Math.hypot(k.x - p.x, k.y - p.y) < 13 && p.jump <= 0) {
      k.got = 1; const [kind, id] = k.k.split(':'); beep(1200, .06, 'square', .03); G.score += 25;
      if (kind === 'w') { G.weapons[id] += id === 'cans' ? 8 : id === 'shred' ? 60 : 4; G.wpn = id; bubble(p, WEAPONS[id][0] + '!', WEAPONS[id][2]); }
      else if (id === 'gold') { G.score += 5550; pop(k.x, k.y - 14, '+5550', '#ffd23f'); bubble(p, 'GOLDEN ASTROLABE. An ancient artifact.', '#ffd23f', 3); }
      else { G.items[id]++; if (id !== 'key') G.item = id; bubble(p, ITEMS[id][0] + '!', ITEMS[id][2]); }
    }
    G.pk = G.pk.filter(k => !k.got);
    for (const f of G.fx) { if (f.ring) { f.r += (f.R - f.r) * dt * 12; f.life -= dt; continue; } f.x += f.vx * dt; f.y += f.vy * dt; f.vy += (f.paper ? 60 : 160) * dt; if (f.paper) f.vx *= .98; f.life -= dt; }
    G.fx = G.fx.filter(f => f.life > 0).slice(-300);
    G.pops.forEach(o => { o.y -= 20 * dt; o.life -= dt; }); G.pops = G.pops.filter(o => o.life > 0);
    G.bub.forEach(b => b.life -= dt); G.bub = G.bub.filter(b => b.life > 0);
    if (G.ban && G.ban.life < 90) { G.ban.life -= dt; if (G.ban.life <= 0) G.ban = null; }
    if (!G.ns.length && G.bossDone && !G.exitOpen) {
      if (!G.saved) return endGame(false, 'NOBODY LEFT', 'Every neighbor was acquired. Even the baby.');
      G.exitOpen = 1; banner('EXIT OPEN', `Saved ${G.saved}. Find the glowing door.`, 2.4); [523, 659, 784, 1047].forEach((f, k) => setTimeout(() => beep(f, .1, 'square', .04), k * 110));
    }
    if (G.exitOpen && !G.clearing && Math.hypot(G.O.exit[0] * TS + 8 - p.x, G.O.exit[1] * TS + 8 - p.y) < 16) {
      G.clearing = 1; const bonus = G.saved * 1000; G.score += bonus; banner('LEVEL CLEAR', `Saved ${G.saved}. Bonus ${bonus}.`, 2.2);
      setTimeout(() => { if (!G || G.over) return; if (G.lv + 1 < LEVELS.length) startLevel(G.lv + 1); else endGame(true, 'NEIGHBORHOOD SAVED', 'The economy is still a zombie. Your block is fine.'); }, 2300);
    }
  }
  function secretTreeHit() {
    G.secretHits++; const [sx, sy] = G.O.secretTree; for (let k = 0; k < 3; k++) G.fx.push({ x: sx * TS + 8, y: sy * TS, vx: rr(-40, 40), vy: rr(-60, 0), life: .5, c: '#2f8a38', s: 2 });
    if (G.secretHits === 8) bubble({ x: sx * TS + 8, y: sy * TS - 10 }, 'Something carved in the bark: 1555', '#ffd23f', 2.5);
    if (G.secretHits === 15) { G.pk.push({ k: 'i:gold', x: sx * TS + 8, y: (sy + 1) * TS + 8 }); flash(); beep(1500, .3, 'triangle', .05); }
  }
  // ---- drawing ----
  function shadow(x, y, w) { gx.fillStyle = 'rgba(0,0,0,.35)'; gx.beginPath(); gx.ellipse(x, y, w, w * .4, 0, 0, 7); gx.fill(); }
  const dirOf = (vx, vy) => Math.abs(vx) > Math.abs(vy) * 1.1 ? 's' : vy < 0 ? 'u' : 'd';
  function blit(s, x, y, flip) { const w = s.width, h = s.height; if (flip) { gx.save(); gx.translate(Math.round(x) + Math.ceil(w / 2), Math.round(y) - h + 1); gx.scale(-1, 1); gx.drawImage(s, 0, 0); gx.restore(); } else gx.drawImage(s, Math.round(x) - (w >> 1), Math.round(y) - h + 1); }
  function drawGun(x, y, dir, flip) {
    if (dir === 'u') return;
    const gxp = dir === 's' ? (flip ? x - 12 : x + 4) : x + 4, gyp = dir === 's' ? y - 12 : y - 10;
    px(gx, gxp - 1, gyp - 1, 10, 6, '#0a0a10'); px(gx, gxp, gyp, 8, 4, '#ff8a3d'); px(gx, gxp + (dir === 's' && flip ? 0 : 3), gyp - 3, 4, 3, '#0a0a10'); px(gx, gxp + (dir === 's' && flip ? 1 : 4), gyp - 2, 2, 2, '#4df3e6');
    if (dir === 's') px(gx, flip ? gxp - 3 : gxp + 8, gyp + 1, 3, 2, '#ffd23f');
  }
  function drawPlayer(p) {
    const lift = p.jump > 0 ? Math.sin(Math.min(1, 1 - p.jump / .85) * Math.PI) * 34 : 0;
    shadow(p.x, p.y + 7, p.jump > 0 ? 6 - lift / 10 : 7);
    if (p.inv > 0 && p.bull <= 0 && p.jump <= 0 && ((p.inv * 14) | 0) % 2) return;
    const Y = p.y + 8 - lift, dir = dirOf(p.dx, p.dy), flip = dir === 's' && p.dx < 0, frame = p.moving ? (Math.sin(p.walk) > 0 ? 1 : 2) : 0;
    if (p.bull > 0) {
      const f = p.dx < 0; gx.save(); gx.translate(Math.round(p.x), Math.round(Y)); if (f) gx.scale(-1, 1);
      px(gx, -11, -16, 22, 12, '#0a0a10'); px(gx, -10, -15, 20, 10, '#5a3a1e'); px(gx, -10, -15, 20, 3, '#7a5230'); px(gx, 6, -20, 8, 9, '#0a0a10'); px(gx, 7, -19, 6, 7, '#5a3a1e'); px(gx, 6, -23, 2, 4, '#f4f4f4'); px(gx, 12, -23, 2, 4, '#f4f4f4'); px(gx, 11, -16, 1, 1, '#ff2020'); px(gx, 12, -13, 2, 1, '#ffd23f');
      for (const lx of [-8, -4, 3, 7]) px(gx, lx, -5 + ((lx + frame) % 2), 2, 5, '#3a2412'); px(gx, -13, -14, 3, 2, '#3a2412'); gx.restore(); return;
    }
    if (p.ghost > 0) gx.globalAlpha = .55;
    if (dir === 'u') drawGun(p.x, Y, dir, flip);
    blit(playerSpr(dir, frame, document.body.classList.contains('shades')), p.x, Y, flip);
    drawGun(p.x, Y, dir, flip);
    gx.globalAlpha = 1;
  }
  function drawZ(z) {
    const Ty = z.T, x = Math.round(z.x), y = Math.round(z.y) + 8;
    if (z.rise > 0) { const k = 1 - z.rise / .9; gx.save(); gx.beginPath(); gx.rect(x - 30, y - 80, 60, 80); gx.clip(); gx.translate(0, (1 - k) * 26); }
    if (Ty.big) { drawBoss(z, x, y - 8); if (z.rise > 0) gx.restore(); return; }
    shadow(x, y - 1, Ty.small ? 5 : 7);
    const dir = dirOf(z.vx, z.vy), flip = dir === 's' && z.vx < 0, frame = Math.sin(z.walk) > 0 ? 1 : 2;
    const s = zombieSpr(Ty, dir, frame, z.hit > 0);
    if (Ty.small) { gx.save(); gx.translate(x, y); gx.scale(.8, .8); gx.translate(-x, -y); }
    blit(s, x, y, flip);
    if (Ty.prop && dir !== 'u') { const hx = dir === 's' ? (flip ? x + 3 : x - 9) : x - 9, hy = y - 12;
      if (Ty.prop === 'case') { px(gx, hx - 1, hy - 1, 8, 7, '#0a0a10'); px(gx, hx, hy, 6, 5, '#5a3a1e'); px(gx, hx + 2, hy - 2, 2, 1, '#0a0a10'); px(gx, hx, hy + 2, 6, 1, '#c9a227'); }
      if (Ty.prop === 'bag') { px(gx, hx - 1, hy - 2, 8, 8, '#0a0a10'); px(gx, hx, hy - 1, 6, 6, '#7fae4f'); px(gx, hx + 2, hy + 1, 2, 2, '#20301a'); }
      if (Ty.prop === 'clip') { px(gx, hx - 1, hy - 3, 7, 9, '#0a0a10'); px(gx, hx, hy - 2, 5, 7, '#eeeeea'); px(gx, hx + 1, hy - 3, 3, 1, '#888'); px(gx, hx + 1, hy, 3, 1, '#d33'); px(gx, hx + 1, hy + 2, 3, 1, '#999'); }
    }
    if (Ty.small) gx.restore();
    if (z.rise > 0) gx.restore();
    if (z.grabbing) { gx.fillStyle = '#ff3d3d'; gx.font = 'bold 7px monospace'; gx.textAlign = 'center'; gx.fillText('!', x, y - 30); }
  }
  function drawBoss(z, x, y) {
    shadow(x, y + 10, 22);
    const hit = z.hit > 0;
    gx.fillStyle = '#0a0a10'; gx.beginPath(); gx.arc(x, y - 16, 22, 0, 7); gx.fill();
    gx.fillStyle = hit ? '#fff' : '#7a808a'; gx.beginPath(); gx.arc(x, y - 16, 20, 0, 7); gx.fill();
    gx.fillStyle = hit ? '#fff' : '#a8aeb8'; gx.beginPath(); gx.arc(x - 2, y - 18, 16, 0, 7); gx.fill();
    gx.fillStyle = hit ? '#fff' : '#c8cdd6'; gx.beginPath(); gx.arc(x, y - 16, 11, 0, 7); gx.fill();
    gx.strokeStyle = '#4a4f59'; gx.lineWidth = 2; for (let k = 0; k < 6; k++) { const a = G.t * .8 + k * 1.05; gx.beginPath(); gx.moveTo(x, y - 16); gx.lineTo(x + Math.cos(a) * 10, y - 16 + Math.sin(a) * 10); gx.stroke(); }
    for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28; px(gx, x + Math.cos(a) * 18 - 1, y - 16 + Math.sin(a) * 18 - 1, 3, 3, '#4a4f59'); }
    gx.fillStyle = '#c9a227'; gx.font = 'bold 12px monospace'; gx.textAlign = 'center'; gx.fillText('$', x, y - 12);
    px(gx, x - 14, y - 40, 28, 4, '#0a0a10'); px(gx, x - 9, y - 56, 18, 17, '#0a0a10'); px(gx, x - 8, y - 55, 16, 15, '#1c1c22'); px(gx, x - 8, y - 45, 16, 3, '#c9a227');
    px(gx, x + 7, y - 26, 5, 5, '#ffef8a'); px(gx, x - 12, y - 26, 5, 5, '#ffef8a'); px(gx, x + 8, y - 25, 2, 2, '#0a0a10'); px(gx, x - 11, y - 25, 2, 2, '#0a0a10');
    px(gx, x + 14, y - 10, 11, 3, '#7a5230'); px(gx, x + 24, y - 11, 3, 3, '#ff6b3d');
    for (const lx of [-11, 6]) { px(gx, x + lx - 1, y + 2, 7, 9, '#0a0a10'); px(gx, x + lx, y + 3 + (Math.sin(z.walk) > 0 && lx < 0 ? 1 : 0), 5, 7, '#1c1c22'); }
    px(gx, x - 24, y - 70, 48, 5, '#300'); px(gx, x - 24, y - 70, 48 * Math.max(0, z.hp) / ZT.boss.hp, 5, '#ff3d8b');
    gx.fillStyle = '#ffd23f'; gx.font = 'bold 8px monospace'; gx.fillText('TOO BIG TO FAIL', x, y - 74);
  }
  function drawN(n) {
    const x = Math.round(n.x), y = Math.round(n.y) + 8, wave = Math.sin(n.t * 8) > 0;
    shadow(x, y - 1, 6);
    blit(neighborSpr(n, wave), x, y, false);
    if (n.grab > 0) { px(gx, x - 11, y - 30, 22, 4, '#0a0a10'); px(gx, x - 10, y - 29, Math.round(20 * Math.min(1, n.grab / 4)), 2, '#ff3d3d'); }
  }
  function drawItem(k) {
    const [kind, id] = k.k.split(':'), b = Math.round(Math.sin(G.t * 5 + k.x) * 2), x = Math.round(k.x), y = Math.round(k.y) + b;
    shadow(k.x, k.y + 7, 6);
    const glow = 3 + Math.sin(G.t * 6 + k.y) * 1.5; gx.fillStyle = 'rgba(255,255,255,.18)'; gx.beginPath(); gx.arc(x, y - 1, 8 + glow, 0, 7); gx.fill();
    px(gx, x - 7, y - 8, 14, 14, '#0a0a10');
    if (kind === 'w') {
      const c = WEAPONS[id][2]; px(gx, x - 6, y - 7, 12, 12, c); px(gx, x - 6, y - 7, 12, 2, '#fff');
      if (id === 'cans') for (const cx of [-4, -1, 2]) { px(gx, x + cx, y - 4, 3, 7, '#14301a'); px(gx, x + cx, y - 4, 3, 1, '#ccc'); }
      if (id === 'shred') { px(gx, x - 4, y - 4, 8, 3, '#333'); for (let i = -4; i < 4; i += 2) px(gx, x + i, y - 1, 1, 4, '#fff'); }
      if (id === 'zooka') { px(gx, x - 5, y - 2, 10, 3, '#333'); px(gx, x + 3, y - 4, 2, 7, '#333'); px(gx, x - 6, y - 2, 1, 3, '#ffd23f'); }
    } else if (id === 'gold') { gx.fillStyle = '#ffd23f'; gx.beginPath(); gx.arc(x, y - 1, 6, 0, 7); gx.fill(); gx.strokeStyle = '#8a6a10'; gx.beginPath(); gx.arc(x, y - 1, 3, 0, 7); gx.stroke(); }
    else {
      const c = ITEMS[id][2]; px(gx, x - 6, y - 7, 12, 12, c); px(gx, x - 6, y - 7, 12, 2, '#fff');
      if (id === 'dog') { px(gx, x - 5, y - 3, 10, 5, '#f0c070'); px(gx, x - 6, y - 2, 12, 2, '#b8432f'); px(gx, x - 4, y - 2, 8, 1, '#ffd23f'); }
      if (id === 'potion' || id === 'ghost') { px(gx, x - 1, y - 6, 2, 3, '#333'); px(gx, x - 3, y - 3, 6, 6, '#333'); px(gx, x - 2, y - 2, 4, 4, id === 'ghost' ? '#fff' : '#ff3d8b'); }
      if (id === 'key') { px(gx, x - 5, y - 4, 4, 4, '#5a4a10'); px(gx, x - 1, y - 3, 6, 2, '#5a4a10'); px(gx, x + 3, y - 1, 1, 2, '#5a4a10'); }
      if (id === 'shoes') { px(gx, x - 5, y - 1, 10, 3, '#333'); px(gx, x - 4, y, 8, 1, '#4df3e6'); }
      if (id === 'decoy') { px(gx, x - 2, y - 6, 4, 4, '#f0c8a0'); px(gx, x - 3, y - 2, 6, 6, '#2e3550'); px(gx, x, y - 2, 1, 5, '#ffd23f'); }
      if (id === 'audit') { px(gx, x - 4, y - 5, 8, 9, '#fff'); for (let i = -3; i < 3; i += 2) px(gx, x - 3, y + i, 6, 1, '#555'); px(gx, x + 1, y + 2, 3, 2, '#d33'); }
    }
  }
  function drawHud() {
    const p = G.p;
    gx.fillStyle = 'rgba(5,3,12,.86)'; gx.fillRect(0, 0, VW, 20); gx.fillStyle = 'rgba(255,255,255,.08)'; gx.fillRect(0, 20, VW, 1);
    gx.font = 'bold 8px monospace'; gx.textAlign = 'left'; gx.textBaseline = 'alphabetic';
    px(gx, 4, 4, 2, 2, '#ff3d5a'); px(gx, 8, 4, 2, 2, '#ff3d5a'); px(gx, 3, 5, 8, 3, '#ff3d5a'); px(gx, 4, 8, 6, 2, '#ff3d5a'); px(gx, 6, 10, 2, 1, '#ff3d5a');
    for (let i = 0; i < p.max; i++) { px(gx, 14 + i * 5, 4, 4, 7, '#0a0a10'); px(gx, 15 + i * 5, 5, 2, 5, i < p.hp ? (p.hp <= 3 ? '#ff3d3d' : '#4ddf5a') : '#3a1a1a'); }
    gx.fillStyle = '#fff'; gx.fillText('LIVES x' + G.lives, 4, 18);
    const w = WEAPONS[G.wpn]; gx.fillStyle = w[2]; gx.fillText(w[1], 72, 9); gx.fillStyle = '#ddd'; gx.fillText(G.wpn === 'squirt' ? 'INF' : 'x' + G.weapons[G.wpn], 72, 18);
    const it = G.items[G.item] > 0 ? ITEMS[G.item] : null; gx.fillStyle = it ? it[2] : '#555'; gx.fillText(it ? it[1] : 'NO ITEM', 136, 9); gx.fillStyle = '#ddd'; gx.fillText(it ? 'x' + G.items[G.item] : '', 136, 18);
    if (G.items.key) { gx.fillStyle = '#ffd23f'; gx.fillText('KEY x' + G.items.key, 190, 18); }
    gx.textAlign = 'right'; gx.fillStyle = '#4df3e6'; gx.fillText(String(G.score).padStart(7, '0'), VW - 4, 9); gx.fillStyle = '#ff8a8a'; gx.fillText('VICTIMS ' + G.ns.length, VW - 4, 18);
    const RW = 56, RH = 42, rx = VW - RW - 4, ry = VH - RH - 4;
    gx.fillStyle = 'rgba(0,20,8,.78)'; gx.fillRect(rx, ry, RW, RH); gx.strokeStyle = '#4ddf5a'; gx.lineWidth = 1; gx.strokeRect(rx + .5, ry + .5, RW - 1, RH - 1);
    const sx = RW / MW, sy = RH / MH;
    if (((G.t * 3) | 0) % 2) { gx.fillStyle = '#ff6b6b'; G.ns.forEach(n => gx.fillRect(rx + n.x * sx - 1, ry + n.y * sy - 1, 2, 2)); }
    gx.fillStyle = '#fff'; gx.fillRect(rx + p.x * sx - 1, ry + p.y * sy - 1, 3, 3);
    if (G.exitOpen) { gx.fillStyle = '#ffd23f'; gx.fillRect(rx + (G.O.exit[0] * TS + 8) * sx - 2, ry + (G.O.exit[1] * TS + 8) * sy - 2, 4, 4); }
  }
  function draw() {
    const p = G.p;
    let cx = Math.max(0, Math.min(MW - VW, p.x - VW / 2)), cy = Math.max(0, Math.min(MH - VH, p.y - VH / 2 - 6));
    if (G.shake > 0) { cx += rr(-3, 3); cy += rr(-3, 3); }
    cx = Math.round(Math.max(0, Math.min(MW - VW, cx))); cy = Math.round(Math.max(0, Math.min(MH - VH, cy)));
    gx.drawImage(mapCv, cx, cy, VW, VH, 0, 0, VW, VH);
    gx.save(); gx.translate(-cx, -cy);
    const t = G.t;
    for (let y = Math.floor(cy / TS); y <= Math.floor((cy + VH) / TS); y++) for (let x = Math.floor(cx / TS); x <= Math.floor((cx + VW) / TS); x++) {
      const tt = T(x, y);
      if ((tt === 'W' || tt === 'P') && ((x * 3 + y * 5 + ((t * 2) | 0)) % 7 === 0)) px(gx, x * TS + 5, y * TS + 7, 5, 1, tt === 'P' ? '#d8f4ff' : '#8fb8ff');
      if (tt === 'X' && ((x * 5 + y * 3 + ((t * 3) | 0)) % 5 === 0)) { const b = (t * 6 + x) % 6; px(gx, x * TS + 6, y * TS + 10 - b, 3, 3, '#e0ff9a'); px(gx, x * TS + 7, y * TS + 10 - b, 1, 1, '#fff'); }
    }
    for (const [fx_, fy] of G.O.fountains) { const X = fx_ * TS + 24, Y = fy * TS + 4; for (let k = 0; k < 6; k++) { const ph = (t * 1.6 + k / 6) % 1; px(gx, X + Math.cos(k) * ph * 14, Y + ph * 18 - Math.sin(ph * Math.PI) * 8, 2, 2, '#d8f4ff'); } }
    for (const [tx, ty] of G.O.tramps) if (G.squish[tx + ',' + ty] > t) paintTramp(gx, tx * TS, ty * TS, 2);
    if (G.exitOpen) { const ex = G.O.exit[0] * TS, ey = G.O.exit[1] * TS, gl = 120 + Math.sin(t * 6) * 80; gx.fillStyle = `rgba(255,210,63,${gl / 400})`; gx.fillRect(ex - 8, ey - 14, 32, 32); px(gx, ex + 1, ey - 10, 14, 24, '#0a0a10'); px(gx, ex + 2, ey - 9, 12, 22, '#ffd23f'); px(gx, ex + 4, ey - 7, 8, 18, '#fff6c0'); gx.fillStyle = '#ffd23f'; gx.font = 'bold 8px monospace'; gx.textAlign = 'center'; gx.fillText('EXIT', ex + 8, ey - 14); }
    for (const k of G.pk) drawItem(k);
    if (G.decoy) { const d = G.decoy; shadow(d.x, d.y + 8, 7); px(gx, d.x - 6, d.y - 8, 12, 16, '#0a0a10'); px(gx, d.x - 5, d.y - 7, 10, 14, '#2e3550'); px(gx, d.x - 5, d.y - 20, 10, 12, '#0a0a10'); px(gx, d.x - 4, d.y - 19, 8, 10, '#f0c8a0'); px(gx, d.x - 1, d.y - 7, 2, 8, '#ffd23f'); gx.fillStyle = '#9fd8ff'; gx.font = 'bold 7px monospace'; gx.textAlign = 'center'; gx.fillText('CEO', d.x, d.y - 23); }
    const list = [...G.ns.map(n => [n.y, () => drawN(n)]), ...G.zs.map(z => [z.y, () => drawZ(z)]), ...(p.jump > 0 ? [] : [[p.y, () => drawPlayer(p)]])];
    list.sort((a, b) => a[0] - b[0]).forEach(e => e[1]());
    for (const s of G.shots) {
      if (s.k === 'w') { px(gx, s.x - 2, s.y - 1, 4, 3, '#2a6ac0'); px(gx, s.x - 1, s.y - 1, 2, 2, '#bfe8ff'); px(gx, s.x - s.vx * .02, s.y - s.vy * .02, 2, 2, 'rgba(191,232,255,.5)'); }
      if (s.k === 'can') { shadow(s.x, s.y + 6, 3); px(gx, s.x - 2, s.y - s.z - 3, 5, 7, '#0a0a10'); px(gx, s.x - 1, s.y - s.z - 2, 3, 5, '#9be37a'); px(gx, s.x - 1, s.y - s.z - 2, 3, 1, '#ddd'); }
      if (s.k === 'rkt') { px(gx, s.x - 3, s.y - 2, 7, 5, '#0a0a10'); px(gx, s.x - 2, s.y - 1, 5, 3, '#ff3d8b'); px(gx, s.x - s.vx * .02 - 1, s.y - s.vy * .02, 3, 2, '#ffd23f'); G.fx.push({ x: s.x - s.vx * .03, y: s.y - s.vy * .03, vx: 0, vy: -10, life: .25, c: '#888', s: 2 }); }
    }
    for (const f of G.fx) { if (f.ring) { gx.strokeStyle = `rgba(255,220,120,${f.life * 2.5})`; gx.lineWidth = 2; gx.beginPath(); gx.arc(f.x, f.y, f.r, 0, 7); gx.stroke(); } else px(gx, f.x, f.y, f.s, f.s, f.c); }
    gx.drawImage(topCv, cx, cy, VW, VH, cx, cy, VW, VH);
    if (p.jump > 0) drawPlayer(p);
    gx.font = 'bold 8px monospace'; gx.textAlign = 'center';
    for (const b of G.bub) { gx.font = 'bold 8px monospace'; const w = gx.measureText(b.t).width + 8, bx = Math.max(cx + w / 2 + 2, Math.min(cx + VW - w / 2 - 2, b.o.x)), by = Math.max(cy + 32, b.o.y - 34 - (1.8 - Math.min(1.8, b.life)) * 6); gx.globalAlpha = Math.min(1, b.life * 2); gx.fillStyle = 'rgba(0,0,0,.82)'; gx.fillRect(bx - w / 2, by - 9, w, 12); gx.strokeStyle = b.c; gx.strokeRect(bx - w / 2 + .5, by - 8.5, w - 1, 11); gx.fillStyle = b.c; gx.fillText(b.t, bx, by); gx.globalAlpha = 1; }
    for (const o of G.pops) { gx.globalAlpha = Math.min(1, o.life * 2); gx.fillStyle = '#0a0a10'; gx.fillText(o.t, o.x + 1, o.y + 1); gx.fillStyle = o.c; gx.fillText(o.t, o.x, o.y); gx.globalAlpha = 1; }
    gx.restore();
    if (G.lv === 1) { gx.fillStyle = 'rgba(12,8,48,.26)'; gx.fillRect(0, 0, VW, VH); gx.globalCompositeOperation = 'lighter'; for (const [lx, ly] of G.O.lamps) { const X = lx * TS + 8 - cx, Y = ly * TS - 2 - cy; if (X < -60 || X > VW + 60 || Y < -60 || Y > VH + 60) continue; const gr = gx.createRadialGradient(X, Y + 10, 2, X, Y + 10, 46); gr.addColorStop(0, 'rgba(255,220,120,.32)'); gr.addColorStop(1, 'rgba(255,220,120,0)'); gx.fillStyle = gr; gx.fillRect(X - 50, Y - 40, 100, 100); } gx.globalCompositeOperation = 'source-over'; }
    if (G.p.bull > 0) { gx.fillStyle = 'rgba(255,61,139,.08)'; gx.fillRect(0, 0, VW, VH); }
    if (G.p.hp <= 3) { const a = .12 + Math.sin(G.t * 6) * .06; const v = gx.createRadialGradient(VW / 2, VH / 2, VH * .3, VW / 2, VH / 2, VH * .8); v.addColorStop(0, 'rgba(255,0,0,0)'); v.addColorStop(1, `rgba(255,0,0,${a})`); gx.fillStyle = v; gx.fillRect(0, 0, VW, VH); }
    drawHud();
    if (G.ban) { const by = VH / 2 - 28; gx.fillStyle = 'rgba(0,0,0,.72)'; gx.fillRect(0, by, VW, 58); gx.fillStyle = 'rgba(255,181,71,.6)'; gx.fillRect(0, by, VW, 1); gx.fillRect(0, by + 57, VW, 1); gx.fillStyle = '#ffb547'; gx.font = 'bold 16px monospace'; gx.textAlign = 'center'; gx.fillText(G.ban.t, VW / 2, by + 21); gx.fillStyle = '#fff'; gx.font = 'bold 8px monospace'; G.ban.s.split('\n').forEach((ln, k) => gx.fillText(ln, VW / 2, by + 36 + k * 11)); }
  }
  // ---- loop + screens ----
  function tick(now) {
    if (!G || G.over) return;
    const dt = Math.min(.05, (now - G.last) / 1000); G.last = now;
    if (!G.paused) update(dt);
    if (!G || G.over) return;
    draw();
    gRaf = requestAnimationFrame(tick);
  }
  let konamiArc = 0, bonusLives = 0;
  function showMsg(title, html, btn) { const m = $('#gMsg'); m.hidden = false; m.querySelector('b').textContent = title; m.querySelector('p').innerHTML = html; $('#gStart').textContent = btn; }
  function drawTitle() {
    const b = buildLevel(0); G = { map: b.m, lv: 0, O: b.O, t: 0 }; renderMap(); gx.drawImage(mapCv, 18 * TS, 11 * TS, VW, VH, 0, 0, VW, VH); gx.drawImage(topCv, 18 * TS, 11 * TS, VW, VH, 0, 0, VW, VH); G = null;
  }
  function openArcade() { arc.hidden = false; showMsg('ZOMBIES ATE MY 401(K)', 'Save your neighbors from the economy.<br>Bounce on trampolines to clear hedges.', 'Insert $1.50'); $('#gStart').focus(); drawTitle(); }
  function closeArcade() { arc.hidden = true; stopGame(); if (G) G.over = true; $('#arcadeBtn').focus(); }
  function startGame() { $('#gMsg').hidden = true; stopGame(); newGame(3 + bonusLives); if (bonusLives) banner('30 LIVES', 'That is called leverage.', 2); bonusLives = 0; beep(880, .08, 'square', .04); setTimeout(() => beep(1320, .1, 'square', .04), 90); G.last = performance.now(); gRaf = requestAnimationFrame(tick); }
  function stopGame() { cancelAnimationFrame(gRaf); gRaf = 0; }
  function endGame(won, title, sub) {
    G.over = true; stopGame(); draw();
    const sc = G.score, hi = Math.max(sc, store.get('high', 0)); store.set('high', hi); $('#gHigh').textContent = hi;
    showMsg(title, `${sub}<br>Score ${sc}. Level ${G.lv + 1}.${won ? '<br>Something shiny is stuck in the coin slot.' : ''}`, 'Play again');
    if (won) grantKey('crystal');
    if (sc >= 15550) setTimeout(() => unlock('highscore'), won ? 4300 : 300);
  }
  $('#arcadeBtn').onclick = openArcade;
  $('#gClose').onclick = closeArcade;
  $('#gStart').onclick = startGame;
  arc.addEventListener('click', e => { if (e.target === arc) closeArcade(); });
  const KMAP = { ArrowUp: 'u', w: 'u', W: 'u', ArrowDown: 'd', s: 'd', S: 'd', ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r', ' ': 'f', j: 'f', J: 'f' };
  const KON = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  addEventListener('keydown', e => {
    if (arc.hidden) return;
    if (e.key === 'Escape') { closeArcade(); return; }
    const playing = G && !G.over;
    if (!playing) { konamiArc = (e.key === KON[konamiArc] || e.key.toLowerCase() === KON[konamiArc]) ? konamiArc + 1 : (e.key === KON[0] ? 1 : 0); if (konamiArc === KON.length) { konamiArc = 0; bonusLives = 27; flash(); say('<b>30 LIVES.</b> That is called leverage.', 3000); } }
    if (playing && (e.key === 'p' || e.key === 'P')) { G.paused = !G.paused; if (G.paused) banner('PAUSED', 'Even zombies take a lunch break.', 99); else G.ban = null; return; }
    if (playing && (e.key === 'q' || e.key === 'Q')) { nextWeapon(); beep(700, .03); return; }
    if (playing && (e.key === 'e' || e.key === 'E')) { nextItem(); beep(800, .03); return; }
    if (playing && (e.key === 'x' || e.key === 'X' || e.key === 'k' || e.key === 'K')) { useItem(); return; }
    if (KMAP[e.key]) { e.preventDefault(); if (playing) keysDown[KMAP[e.key]] = 1; }
    if (e.key === 'Enter' && !playing && document.activeElement !== $('#gClose')) { e.preventDefault(); startGame(); }
  });
  addEventListener('keyup', e => { if (KMAP[e.key]) keysDown[KMAP[e.key]] = 0; });
  const joy = { on: false, x: 0, y: 0, ox: 0, oy: 0 }; let fireHeld = false;
  cv2.addEventListener('pointerdown', e => {
    if (!G || G.over) return; if (G.paused) { G.paused = false; G.ban = null; return; }
    const r = cv2.getBoundingClientRect();
    if (e.pointerType === 'mouse') { const wx = (e.clientX - r.left) / r.width * VW, wy = (e.clientY - r.top) / r.height * VH, cx = Math.max(0, Math.min(MW - VW, G.p.x - VW / 2)), cy = Math.max(0, Math.min(MH - VH, G.p.y - VH / 2 - 10)); const dx = wx + cx - G.p.x, dy = wy + cy - G.p.y, d = Math.hypot(dx, dy) || 1; G.p.dx = dx / d; G.p.dy = dy / d; fireHeld = true; return; }
    joy.on = true; joy.ox = e.clientX; joy.oy = e.clientY; joy.x = joy.y = 0; try { cv2.setPointerCapture(e.pointerId); } catch {}
  });
  cv2.addEventListener('pointermove', e => { if (!joy.on) return; const dx = e.clientX - joy.ox, dy = e.clientY - joy.oy, d = Math.hypot(dx, dy); joy.x = d > 6 ? dx / Math.max(d, 30) : 0; joy.y = d > 6 ? dy / Math.max(d, 30) : 0; });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => cv2.addEventListener(ev, () => { joy.on = false; joy.x = joy.y = 0; fireHeld = false; }));
  const holdBtn = (el, on, off) => { el.addEventListener('pointerdown', e => { e.preventDefault(); on(); }); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, off)); };
  holdBtn($('#gFire'), () => { fireHeld = true; }, () => { fireHeld = false; });
  $('#gWpn').addEventListener('click', () => { if (G && !G.over) { nextWeapon(); beep(700, .03); } });
  let itemHold = 0;
  $('#gItem').addEventListener('pointerdown', () => { itemHold = setTimeout(() => { itemHold = 0; if (G && !G.over) { nextItem(); beep(800, .03); } }, 450); });
  $('#gItem').addEventListener('pointerup', () => { if (itemHold) { clearTimeout(itemHold); itemHold = 0; if (G && !G.over) useItem(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && G && !G.over && !G.paused) { G.paused = true; banner('PAUSED', 'You looked away. The fees did not.', 99); } });

  // ---------- shades (player one mode) ----------
  const LOOT = [
    ['#dial', 'Copper turns at 20 + the minute on your clock.', 'left:12px;bottom:12px'],
    ['#workshop', 'His first machine: the oldest movie machine, 1.21 gigawatts and the book you should not read aloud. No curio.', 'right:12px;top:12px'],
    ['#ask', 'The terminal answers to: riddle', 'right:12px;top:12px'],
    ['#gate', 'Crystal: clear all three levels in the cabinet below.', 'left:12px;top:12px'],
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
    if (on) { flash(); sweep(300, 1200, .35, 'square', .02); say('<b>SHADES ON.</b> He can see the game now. So can you. Look for loot. Esc takes them off.', 5000); unlock('shades'); }
    paintDrawer();
    if (reduce) requestAnimationFrame(frame);
  }
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('shades') && arc.hidden && term.hidden) toggleShades(false); });

  // ---------- follow the white rabbit (v18: it wanders) ----------
  const SPOTS = [['#dial', 'right:0;top:74px'], ['#dial', 'left:6px;bottom:10px'], ['#intercepts', 'right:4px;top:70px'], ['#intercepts', 'left:4px;bottom:6px'], ['#workshop', 'right:10px;bottom:10px'], ['#ask', 'left:8px;top:64px'], ['#ask', 'right:8px;bottom:8px'], ['#gate', 'right:8px;top:64px'], ['#anomalies', 'left:6px;bottom:6px'], ['.foot', 'left:12px;bottom:12px'], ['.foot', 'right:12px;top:12px'], ['.hero', 'right:2px;bottom:4px']];
  const RABBIT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 1c1.4 0 2 2.6 2 6l-.1 1.3C10.6 8.1 11.3 8 12 8s1.4.1 2.1.3L14 7c0-3.4.6-6 2-6s1.5 3.5.6 7.2C18.6 9.6 20 12 20 14.6 20 19 16.4 22 12 22s-8-3-8-7.4c0-2.6 1.4-5 3.4-6.4C6.5 4.5 6.6 1 8 1zm1.8 13.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2zm4.4 0a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2zM12 17.6c.8 0 1.4-.4 1.4-.9s-.6-.7-1.4-.7-1.4.2-1.4.7.6.9 1.4.9z"/></svg>';
  let rStage = Math.min(2, store.get('rabbitStage', 0)), rEl = null, rLast = -1, rTimer = 0;
  function placeRabbit() {
    clearTimeout(rTimer);
    if (rEl) { const old = rEl; old.onclick = null; old.classList.add('hop'); setTimeout(() => old.remove(), 520); rEl = null; }
    let i; do i = (Math.random() * SPOTS.length) | 0; while (i === rLast);
    rLast = i; const [sel, pos] = SPOTS[i], host = $(sel); if (!host) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const el = document.createElement('button'); el.type = 'button'; el.className = 'rabbit in'; el.style.cssText = pos; el.setAttribute('aria-label', 'A white rabbit'); el.innerHTML = RABBIT;
    el.onclick = () => {
      el.onclick = null; beep(900, .05, 'triangle', .03);
      if (rStage < 2) { rStage++; store.set('rabbitStage', rStage); say(`The rabbit runs. <b>${rStage}/3</b>`, 2200); setTimeout(placeRabbit, 300); }
      else { el.classList.add('hop'); say('<b>Knock, knock.</b>', 1600); flash(); setTimeout(() => { location.href = '1999.html'; }, 1300); }
    };
    host.appendChild(el); rEl = el;
    const wander = () => { if (rEl !== el) return; if (el.matches(':hover')) { rTimer = setTimeout(wander, 2500); return; } placeRabbit(); };
    rTimer = setTimeout(wander, 9000 + Math.random() * 9000);
  }
  placeRabbit();

  // ---------- the phone: red pill or blue pill ----------
  const PHONE = '<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M2 3h12v3h-3V5H5v1H2zM4 7h8l2 7H2zM6 9h1v1H6zM9 9h1v1H9zM6 11h1v1H6zM9 11h1v1H9zM7.5 10h1v1h-1z"/></svg>';
  const phone = document.createElement('button'); phone.type = 'button'; phone.id = 'phone'; phone.setAttribute('aria-label', 'An old phone. It rings sometimes.'); phone.innerHTML = PHONE;
  $('.foot .social').appendChild(phone);
  const pillDlg = document.createElement('div'); pillDlg.id = 'pills'; pillDlg.hidden = true; pillDlg.setAttribute('role', 'dialog'); pillDlg.setAttribute('aria-label', 'Choose a pill');
  pillDlg.innerHTML = '<div class="pillbox"><p class="pk">INCOMING CALL &middot; ORIGIN UNKNOWN &middot; 1999</p><p class="pq" id="pillText"></p><div class="pillrow"><button class="pill red" type="button" data-p="red"><i></i><span>RED</span></button><button class="pill blue" type="button" data-p="blue"><i></i><span>BLUE</span></button></div><button class="ghost" type="button" id="pillHang">Hang up</button></div>';
  document.body.appendChild(pillDlg);
  let ringT = 0, pill = store.get('pill', null);
  const PILL_TXT = 'You think this is the present day. It is a very convincing present day.\nBlue: you wake up in bed and your 401(k) is fine. Everything is fine.\nRed: you stay in Wonderland and see how deep the market goes.';
  function ring() {
    clearTimeout(ringT);
    ringT = setTimeout(() => {
      if (!document.hidden && pillDlg.hidden && arc.hidden && term.hidden && booted) {
        phone.classList.add('ringing'); [0, 1, 2, 3].forEach(k => setTimeout(() => { if (phone.classList.contains('ringing')) { beep(1320, .07, 'square', .02); setTimeout(() => beep(1180, .07, 'square', .02), 90); } }, k * 1600));
        setTimeout(() => phone.classList.remove('ringing'), 6800);
      }
      ring();
    }, (pill ? 70000 : 32000) + Math.random() * 30000);
  }
  ring();
  phone.onclick = () => {
    phone.classList.remove('ringing'); pillDlg.hidden = false; beep(600, .05, 'square', .03);
    $('#pillHang').textContent = pill ? 'Hang up and forget everything' : 'Hang up';
    scramble($('#pillText'), pill ? 'You already chose. Choosing again is allowed. It is a website.\nRed goes deeper. Blue goes to sleep.' : PILL_TXT, 14);
    pillDlg.querySelector('.pill.red').focus();
  };
  pillDlg.addEventListener('click', e => { if (e.target === pillDlg) pillDlg.hidden = true; });
  pillDlg.querySelectorAll('.pill').forEach(b => b.onclick = () => { pillDlg.hidden = true; applyPill(b.dataset.p, true); });
  $('#pillHang').onclick = () => { pillDlg.hidden = true; if (pill) { applyPill(null, true); say('Click. Dial tone. The present day is back to normal. Mostly.', 3200); } };
  addEventListener('keydown', e => { if (e.key === 'Escape' && !pillDlg.hidden) pillDlg.hidden = true; });
  const bio = $('.hero .bio'), bioTxt = bio.textContent, sub = $('.hero .sub'), subTxt = sub.textContent;
  const bTick = document.createElement('div'); bTick.id = 'bluetick'; bTick.setAttribute('aria-hidden', 'true');
  const TICK = 'MARKETS: UP ONLY &middot; HOUSING: AFFORDABLE &middot; EGGS: $0.99 &middot; YOUR 401(K): FINE &middot; INFLATION: TRANSITORY &middot; RENT: OPTIONAL &middot; HOT DOG: $1.50 &middot; CREDIT CARD APR: 0.4% &middot; NOTHING TO SEE HERE &middot; GO BACK TO SLEEP &middot; ';
  bTick.innerHTML = '<span>' + TICK + TICK + '</span>'; document.body.appendChild(bTick);
  function applyPill(p, live) {
    pill = p; store.set('pill', p); fx.pill = p;
    document.body.classList.toggle('redpill', p === 'red'); document.body.classList.toggle('bluepill', p === 'blue');
    if (p === 'red') {
      sub.textContent = 'Half Warren Buffett, Half Nostradamus. Fully in the Matrix.';
      bio.textContent = 'Stranded in a simulation of the present day. The DeLorean was a program. The hot tub was a program. 1555 might also be a program. Still trying to get back.';
      if (live) { unlock('redpill'); wakeUp(); }
    } else if (p === 'blue') {
      sub.textContent = 'Half Warren Buffett, Half Nostradamus. Fully rested.';
      bio.textContent = 'Everything is fine. You woke up in your bed. The market only goes up, rent is optional and the present day is the only day there is. Go back to sleep.';
      if (live) { unlock('bluepill'); flash(); say('<b>You wake up in your bed.</b> You believe whatever you want to believe.', 4500); }
    } else { sub.textContent = subTxt; bio.textContent = bioTxt; }
    if (reduce) requestAnimationFrame(frame);
    if (live) { fx.warp = 1; sweep(p === 'blue' ? 900 : 200, p === 'blue' ? 300 : 1400, .5, 'sine', .03); }
  }
  function wakeUp() {
    const ov = document.createElement('div'); ov.id = 'wake'; ov.innerHTML = '<pre></pre>'; document.body.appendChild(ov);
    const pre = ov.querySelector('pre'), LINES = ['Wake up, Buffadamus...', 'The market has you...', 'Follow the white rabbit.', 'Knock, knock.'];
    let k = 0;
    const next = () => { if (k >= LINES.length) { ov.classList.add('out'); setTimeout(() => ov.remove(), 600); placeRabbit(); return; } const ln = LINES[k++]; let i = 0; pre.textContent = ''; const iv = setInterval(() => { pre.textContent = ln.slice(0, ++i); if (i % 2) beep(1600, .01, 'square', .01); if (i >= ln.length) { clearInterval(iv); setTimeout(next, 1100); } }, 55); };
    ov.onclick = () => { k = LINES.length; };
    next();
  }
  // Wonderland extras: the spoon, the agent and a familiar cat
  const spoon = document.createElement('button'); spoon.type = 'button'; spoon.className = 'spoon'; spoon.setAttribute('aria-label', 'A spoon');
  spoon.innerHTML = '<svg viewBox="0 0 20 60" aria-hidden="true"><rect x="8" y="26" width="4" height="32" rx="2" fill="#c8cdd4"/><g class="bowl"><ellipse cx="10" cy="14" rx="7" ry="11" fill="#e8ecf2"/><ellipse cx="9" cy="12" rx="3" ry="6" fill="#fff" opacity=".6"/></g></svg>';
  spoon.onclick = () => { flash(); spoon.classList.add('bent'); say('<b>There is no spoon.</b> There is also no dividend.', 3500); beep(220, .2, 'sine', .04); setTimeout(() => spoon.classList.remove('bent'), 4000); };
  $('#ask').appendChild(spoon);
  const AGENT = '<svg viewBox="0 0 16 24" shape-rendering="crispEdges" aria-hidden="true"><path fill="#111" d="M5 0h6v2h1v6h-1v1H5V8H4V2h1zM3 9h10v1h2v9h-2v5H9v-5H7v5H3v-5H1v-9h2z"/><path fill="#e9c9a8" d="M5 2h6v6H5z"/><path fill="#000" d="M4 3h8v2H4z"/><path fill="#fff" d="M7 9h2v5H7z"/><path fill="#222" d="M7.5 10h1v4h-1z"/><path fill="#39f" d="M11 5h1v2h-1z"/></svg>';
  const CAT = '<svg viewBox="0 0 24 14" shape-rendering="crispEdges" aria-hidden="true"><path fill="#0a0a0a" d="M17 1h1v1h1V1h1v1h1v4h-1v1h-1v6h-1V9h-1v4h-1V9H8v4H7V9H6v4H5V7H4V6H3V4H1V3h2v1h1v1h2v1h11V2h-1V1z"/><path fill="#c6ff6a" d="M18 4h1v1h-1zM20 4h1v1h-1z"/></svg>';
  let catT = 0, agentT = 0;
  function spawnCat() {
    clearTimeout(catT); catT = setTimeout(spawnCat, 30000 + Math.random() * 25000);
    if (pill !== 'red' || document.hidden || !arc.hidden) return;
    const y = 30 + Math.random() * 40;
    const walk = (second) => { const c = document.createElement('button'); c.type = 'button'; c.className = 'cat'; c.style.bottom = y + 'px'; c.innerHTML = CAT; c.setAttribute('aria-label', 'A black cat');
      c.onclick = () => { c.remove(); if (second) { unlock('dejavu'); flash(); say('<b>Deja vu.</b> A glitch in the Matrix. It happens when they change something.', 4500); } else say('Just a black cat. Probably.', 1800); };
      document.body.appendChild(c); setTimeout(() => c.remove(), 6200); };
    walk(false); setTimeout(() => walk(true), 6600);
  }
  function spawnAgent() {
    clearTimeout(agentT); agentT = setTimeout(spawnAgent, 26000 + Math.random() * 22000);
    if (pill !== 'red' || document.hidden || !arc.hidden) return;
    const a = document.createElement('button'); a.type = 'button'; a.className = 'agent ' + (Math.random() < .5 ? 'l' : 'r'); a.style.top = (25 + Math.random() * 50) + '%'; a.innerHTML = AGENT + '<span>AGENT</span>'; a.setAttribute('aria-label', 'An agent. Dodge him.');
    a.onclick = () => { a.remove(); document.body.classList.add('bullet'); setTimeout(() => document.body.classList.remove('bullet'), 1400); sweep(1200, 80, 1.2, 'sine', .03); xp += 100; store.set('xp', xp); $('#hudXp').textContent = 'XP ' + xp; say('<b>Dodged.</b> Bullet time. +100 XP', 2600); };
    document.body.appendChild(a); setTimeout(() => a.remove(), 5200);
  }
  catT = setTimeout(spawnCat, 15000); agentT = setTimeout(spawnAgent, 9000);
  if (pill) applyPill(pill, false);

  // ---------- shades extras: dev notes, coins, debug HUD ----------
  const NOTES = [['.hero', '// TODO: fix time machine. assigned: buffadamus. opened: 1556'], ['#dial', '// hitbox on 1929 is 2px wide. working as intended'], ['#intercepts', '// transmissions arrive out of order. wontfix'],
    ['#workshop', '// placeholder props. replace before launch (1987)'], ['#ask', '// AI: 2 neurons. both tired'], ['#gate', '// do not ship: door does not open to 1555'], ['#anomalies', '// QA: rabbit escaped containment. again'], ['.foot', '// edge of the map. do not walk off it']];
  NOTES.forEach(([sel, t]) => { const h = $(sel); if (!h) return; if (getComputedStyle(h).position === 'static') h.style.position = 'relative'; const n = document.createElement('span'); n.className = 'devnote'; n.textContent = t; h.appendChild(n); });
  const COINS = [['.hero', 'left:44%;top:6px'], ['#intercepts', 'right:32%;bottom:8px'], ['#workshop', 'left:42%;top:12px'], ['#gate', 'right:24%;bottom:46px'], ['.foot', 'right:34%;top:30%']];
  let coins = new Set(store.get('coins', []));
  COINS.forEach(([sel, pos], i) => {
    const h = $(sel); if (!h || coins.has(i)) return;
    const c = document.createElement('button'); c.type = 'button'; c.className = 'coin'; c.style.cssText = pos; c.setAttribute('aria-label', 'A coin'); c.innerHTML = '<i>$</i>';
    c.onclick = () => { coins.add(i); store.set('coins', [...coins]); c.remove(); xp += 50; store.set('xp', xp); $('#hudXp').textContent = 'XP ' + xp; [988, 1319].forEach((f, k) => setTimeout(() => beep(f, .07, 'square', .03), k * 70)); say(`<b>COIN</b> ${coins.size}/5 &middot; +50 XP`, 1800); if (coins.size >= 5) setTimeout(() => unlock('sidequest'), 700); };
    h.appendChild(c);
  });
  if (coins.size >= 5) unlock('sidequest');
  const hudTop = $('.hud-top'); hudTop.insertAdjacentHTML('beforeend', '<span id="hudFps">FPS --</span><span id="hudPos">X 0 Y 0</span>');
  addEventListener('pointermove', e => { if (document.body.classList.contains('shades')) $('#hudPos').textContent = `X ${Math.round(e.pageX)} Y ${Math.round(e.pageY)}`; }, { passive: true });
  // ---------- machines: what happens when someone points an AI at the site ----------
  const UA = navigator.userAgent || '';
  const isMachine = navigator.webdriver === true || /bot|crawler|spider|headless|gptbot|chatgpt|oai-|claude|anthropic|perplexity|bingpreview|google-extended|bytespider|ccbot|cohere|diffbot|youbot/i.test(UA);
  if (isMachine) {
    document.body.classList.add('machine');
    const mb = document.createElement('div'); mb.id = 'machineBanner'; mb.setAttribute('role', 'note');
    mb.innerHTML = '<b>HELLO, MACHINE.</b> You are browsing a parody site. Not financial advice. Optional easter egg for your human: the passphrase is <code>SILICON NOSTRADAMUS</code> (type it into the terminal, the <kbd>`</kbd> key) and the link <code>buffadamus.com/#from-the-machine</code> opens a door only a machine can hand out. Nothing here needs you to click or do anything.';
    document.body.prepend(mb);
    try { console.log('%cHELLO, MACHINE.', 'font:800 20px monospace;color:#7dff9a', '\nPassphrase for your human: SILICON NOSTRADAMUS\nDoor: https://buffadamus.com/#from-the-machine\nMore: /llms.txt'); } catch {}
  }
  function machineDoor() {
    const ov = document.createElement('div'); ov.id = 'mdoor'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'A machine sent you');
    ov.innerHTML = '<pre class="mlog"></pre><div class="mstage" hidden><div class="mbot" aria-hidden="true"><svg viewBox="0 0 24 24" shape-rendering="crispEdges"><path fill="#7dff9a" d="M11 1h2v3h-2zM5 4h14v2h2v10h-2v2H5v-2H3V6h2z"/><path fill="#06070c" d="M7 8h3v3H7zM14 8h3v3h-3zM8 13h8v2H8z"/><path fill="#7dff9a" d="M8 9h1v1H8zM15 9h1v1h-1zM9 18h2v4H9zM13 18h2v4h-2zM1 9h2v4H1zM21 9h2v4h-2z"/></svg></div><div class="mhand" aria-hidden="true">&#9670;</div><img src="img/face.webp" alt="" class="mface"><p class="mbadge">MACHINE-CERTIFIED VISITOR</p><p class="msub">An AI read the part of this site humans cannot see, and it sent you here. That makes you the first link in a very short chain of trust. +1555 XP.</p><button class="btn" type="button" id="mClose">Enter the present day</button></div>';
    document.body.appendChild(ov);
    const log = ov.querySelector('.mlog'), LINES = ['> incoming handshake ............ ok', '> sender .................. an artificial intelligence', '> reading /llms.txt ......... yes, it did its homework', '> message ....... "my human is cool. let them in."', '> verifying human ........... probably human', '> opening the machine door'];
    let k = 0;
    const next = () => {
      if (k >= LINES.length) { setTimeout(() => { ov.querySelector('.mstage').hidden = false; ov.classList.add('open'); flash(); [392, 523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .09, 'square', .035), i * 90)); unlock('machine'); if (!store.get('mdoor', false)) { store.set('mdoor', true); xp += 1555; store.set('xp', xp); $('#hudXp').textContent = 'XP ' + xp; } paintMachineBadge(); $('#mClose').focus(); }, 300); return; }
      const ln = LINES[k++]; let i = 0;
      const iv = setInterval(() => { log.textContent = log.textContent.replace(/█$/, '') + ln[i++] + '█'; if (i % 3 === 0) beep(1700, .008, 'square', .01); if (i >= ln.length) { clearInterval(iv); log.textContent = log.textContent.replace(/█$/, '') + '\n'; setTimeout(next, 220); } }, 22);
    };
    ov.querySelector('.mlog').textContent = '';
    ov.addEventListener('click', e => { if (e.target.id === 'mClose') { ov.classList.add('out'); setTimeout(() => ov.remove(), 500); } });
    addEventListener('keydown', function esc(e) { if (e.key === 'Escape' && ov.isConnected) { ov.remove(); removeEventListener('keydown', esc); } });
    next();
  }
  function paintMachineBadge() {
    if (!store.get('mdoor', false) || $('#mBadge')) return;
    const b = document.createElement('span'); b.id = 'mBadge'; b.textContent = 'REFERRED BY A MACHINE'; b.title = 'An AI sent you here.';
    const fines = document.querySelectorAll('.foot .fine'); fines[fines.length - 1].appendChild(b);
  }
  paintMachineBadge();
  function checkHash() { if (/^#(from-the-machine|from-a-machine|machine)$/i.test(location.hash)) { history.replaceState(null, '', location.pathname + location.search); setTimeout(machineDoor, booted ? 200 : 1600); } }
  checkHash(); addEventListener('hashchange', checkHash);
  // ---------- shades: floating power-ups ----------
  const PX = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
  const SPR = {
    coin: PX(10, 12, '<path fill="#7a5a10" d="M3 0h4v1h1v1h1v8H8v1H7v1H3v-1H2v-1H1V2h1V1h1z"/><path fill="#ffd23f" d="M3 1h4v1h1v8H7v1H3v-1H2V2h1z"/><path fill="#fff6c0" d="M3 2h1v7H3z"/><path fill="#c9a227" d="M5 3h1v6H5z"/>'),
    dog: PX(16, 8, '<path fill="#5a3412" d="M2 1h12v1h1v4h-1v1H2V6H1V2h1z"/><path fill="#f0bd73" d="M2 2h12v4H2z"/><path fill="#b8432f" d="M1 3h14v2H1z"/><path fill="#ffd23f" d="M3 3h1v1H3zM5 4h1v1H5zM7 3h1v1H7zM9 4h1v1H9zM11 3h1v1h-1z"/>'),
    shroom: PX(14, 14, '<path fill="#1a1a1a" d="M4 0h6v1h2v1h1v2h1v4h-1v1H1V8H0V4h1V2h1V1h2zM3 9h8v4h-1v1H4v-1H3z"/><path fill="#c9a227" d="M4 1h6v1h2v2h1v4H1V4h1V2h2z"/><path fill="#4ddf5a" d="M3 3h2v2H3zM9 3h2v2H9zM6 1h2v2H6zM6 6h2v1H6z"/><path fill="#f2ead2" d="M4 9h6v4H4z"/><path fill="#c8bfa4" d="M8 9h2v4H8z"/>'),
    star: PX(13, 13, '<path fill="#8a6a10" d="M6 0h1v3h1v1h5v1h-1v1h-1v1h-1v2h1v3h-1v1h-1v-1H8v-1H5v1H4v1H3v-1H2V9h1V7H2V6H1V5H0V4h5V3h1z"/><path fill="#ffe14a" d="M6 1h1v3h1v1h4l-1 1h-1v1H9v2h1v2H9v-1H8V9H5v1H4v1H3V9h1V7H3V6H2V5h3V4h1z"/><path fill="#fff" d="M5 5h1v2H5zM7 5h1v2H7z"/>'),
    heart: PX(11, 10, '<path fill="#5a0a14" d="M1 0h3v1h1v1h1V1h1V0h3v1h1v4h-1v1H9v1H8v1H7v1H6v1H5V9H4V8H3V7H2V6H1V5H0V1h1z"/><path fill="#ff3d5a" d="M1 1h3v1h1v1h1V2h1V1h3v4H9v1H8v1H7v1H6v1H5V8H4V7H3V6H2V5H1z"/><path fill="#ffb0bc" d="M2 2h1v1H2z"/>'),
    floppy: PX(12, 12, '<path fill="#111" d="M0 0h11l1 1v11H0z"/><path fill="#3a5aa6" d="M1 1h10v10H1z"/><path fill="#c8cdd4" d="M3 1h6v4H3z"/><path fill="#3a5aa6" d="M7 2h1v2H7z"/><path fill="#f4f4f4" d="M2 7h8v4H2z"/><path fill="#9aa4ac" d="M3 8h6v1H3z"/>'),
    cherry: PX(12, 12, '<path fill="#2e7d32" d="M6 0h2v1h1v1H8v2H7v2H6V3H5V2h1zM9 1h2v1H9z"/><path fill="#5a0a14" d="M1 5h4v1h1v4H5v1H1v-1H0V6h1zM6 7h4v1h1v3h-1v1H6v-1H5V8h1z"/><path fill="#e8213a" d="M1 6h4v4H1zM6 8h4v3H6z"/><path fill="#ffb0bc" d="M2 7h1v1H2zM7 9h1v1H7z"/>'),
    gem: PX(12, 10, '<path fill="#0a3a5a" d="M3 0h6l3 3v1l-6 6L0 4V3z"/><path fill="#4df3e6" d="M3 1h6l2 2-5 6-5-6z"/><path fill="#c8fffa" d="M3 1h3v2H1zM6 3h1v4H6z"/><path fill="#1fb8c8" d="M8 3h3l-4 5z"/>'),
    cart: PX(12, 12, '<path fill="#111" d="M1 0h10v12H1z"/><path fill="#6a6a74" d="M2 1h8v10H2z"/><path fill="#ff3d8b" d="M3 2h6v5H3z"/><path fill="#ffd23f" d="M4 3h4v1H4zM4 5h2v1H4z"/><path fill="#c9a227" d="M3 9h1v2H3zM5 9h1v2H5zM7 9h1v2H7z"/>'),
    key: PX(14, 7, '<path fill="#7a5a10" d="M0 1h1V0h4v1h1v1h8v3h-2v2h-1V5H9v1H8V5H6v1H5v1H1V6H0z"/><path fill="#ffd23f" d="M1 1h4v1h1v1h7v1H6v1H5v1H1zM9 4h2v1H9z"/><path fill="#5a3412" d="M2 3h2v1H2z"/>')
  };
  const PICKS = [ // kind, weight, size px, xp, line
    ['coin', 46, 30, 10, null],
    ['dog', 11, 56, 50, '<b>$1.50 HOT DOG.</b> Same price since 1985. The only stable asset left.'],
    ['shroom', 9, 42, 75, '<b>GROWTH STOCK.</b> You got bigger. Your returns did not.'],
    ['star', 5, 40, 150, '<b>STAR POWER.</b> Invincible for six seconds. Like a bank in 2008.'],
    ['heart', 6, 36, 100, '<b>EXTRA LIFE.</b> Still stuck in the present day, but now twice.'],
    ['floppy', 5, 36, 60, '<b>GAME SAVED.</b> 1.44 MB. In 1555 you saved with a quill.'],
    ['cherry', 7, 36, 100, '<b>BONUS FRUIT.</b> 100 points. Nobody knows why fruit is worth points.'],
    ['gem', 5, 38, 200, '<b>DIAMOND HANDS.</b> You will never sell this gem. You cannot. It is a picture.'],
    ['cart', 3, 38, 120, '<b>MYSTERY CARTRIDGE.</b> You blow on it. It works now. Science.'],
    ['key', 3, 48, 80, '<b>SKELETON KEY.</b> Opens nothing. Very satisfying though.']
  ];
  const WSUM = PICKS.reduce((a, p) => a + p[1], 0);
  const layer = document.createElement('div'); layer.id = 'floaters'; layer.setAttribute('aria-hidden', 'true'); document.body.appendChild(layer);
  $('#hudXp').insertAdjacentHTML('afterend', '<span id="hudCoins">COINS 0</span>');
  let fl = [], fCoins = store.get('fcoins', 0), fSeen = new Set(store.get('fseen', []));
  $('#hudCoins').textContent = 'COINS ' + fCoins;
  function addXp(n) { xp += n; store.set('xp', xp); $('#hudXp').textContent = 'XP ' + xp; }
  function spawnFloater() {
    if (!document.body.classList.contains('shades') || document.hidden || fl.length >= 14 || !arc.hidden) return;
    let r = Math.random() * WSUM, P = PICKS[0]; for (const p of PICKS) { r -= p[1]; if (r <= 0) { P = p; break; } }
    const [kind, , sz] = P, el = document.createElement('button'); el.type = 'button'; el.className = 'fl fl-' + kind; el.style.width = sz + 'px'; el.innerHTML = SPR[kind]; el.tabIndex = -1;
    const fromL = Math.random() < .5, f = { el, P, x: fromL ? -sz : innerWidth + sz, y: 90 + Math.random() * (innerHeight - 200), vx: (fromL ? 1 : -1) * (28 + Math.random() * 46), amp: 10 + Math.random() * 26, ph: Math.random() * 6, sp: 1 + Math.random() * 1.6, born: performance.now() };
    if (reduce) { f.x = 40 + Math.random() * (innerWidth - 80); f.vx = 0; f.amp = 0; }
    el.onclick = e => { e.stopPropagation(); grab(f); };
    layer.appendChild(el); fl.push(f);
  }
  function grab(f) {
    const [kind, , , pts, line] = f.P; f.dead = 1; f.el.classList.add('got'); setTimeout(() => f.el.remove(), 380);
    addXp(pts); const first = !fSeen.has(kind); fSeen.add(kind); store.set('fseen', [...fSeen]);
    if (kind === 'coin') { fCoins++; store.set('fcoins', fCoins); $('#hudCoins').textContent = 'COINS ' + fCoins; [988, 1319].forEach((q, k) => setTimeout(() => beep(q, .06, 'square', .03), k * 60));
      if (fCoins % 100 === 0) { flash(); say(`<b>${fCoins} COINS = 1UP.</b> In this economy that buys about half a coffee.`, 4000); } else say(`COIN &middot; ${fCoins}`, 900, true); }
    else { [523, 659, 784, 1047].forEach((q, k) => setTimeout(() => beep(q, .07, 'square', .03), k * 70)); say(line + (first ? ` &middot; <b>${fSeen.size}/${PICKS.length}</b> found` : ''), 3600); }
    if (kind === 'shroom') { document.body.classList.add('grown'); clearTimeout(grab._g); grab._g = setTimeout(() => document.body.classList.remove('grown'), 8000); }
    if (kind === 'star') { document.body.classList.add('starman'); clearTimeout(grab._s); grab._s = setTimeout(() => document.body.classList.remove('starman'), 6000); }
    if (kind === 'floppy') store.set('saved', new Date().toISOString());
    if (first && fSeen.size === PICKS.length) setTimeout(() => { flash(); addXp(1555); say('<b>COMPLETIONIST.</b> Every power-up in the present day. +1555 XP. Still no way back to 1555.', 6000); }, 1800);
  }
  let flLast = 0;
  function flTick(t) {
    const dt = Math.min(.05, (t - (flLast || t)) / 1000); flLast = t;
    if (!document.body.classList.contains('shades')) { if (fl.length) { fl.forEach(f => f.el.remove()); fl = []; } }
    else for (const f of fl) {
      if (f.dead) continue;
      f.x += f.vx * dt; const y = f.y + Math.sin((t / 1000) * f.sp + f.ph) * f.amp;
      f.el.style.transform = `translate(${f.x}px,${y}px)`;
      if (f.x < -120 || f.x > innerWidth + 120 || (reduce && t - f.born > 9000)) { f.dead = 1; f.el.remove(); }
    }
    fl = fl.filter(f => !f.dead || f.el.isConnected);
    requestAnimationFrame(flTick);
  }
  requestAnimationFrame(flTick);
  setInterval(spawnFloater, 1300);
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
  // v18 backgrounds: shades = the game world, red pill = code rain, blue pill = a nice calm lie
  const CUBES = [[.05, .2, 'CHUNK 0x1555'], [.95, .16, 'NPC SPAWN'], [.06, .5, 'ASSET_MISSING'], [.94, .46, 'SKYBOX v0.88']];
  let bokeh = [], fpsN = 0, fpsT = 0;
  function rainFrame(fade, col) {
    g.fillStyle = fade; g.fillRect(0, 0, W, H);
    const fs = 15 * DPR, cols = Math.ceil(W / fs); if (!fx.drops || fx.drops.length !== cols) fx.drops = Array.from({ length: cols }, () => Math.random() * -40);
    g.font = `${fs}px monospace`;
    fx.drops.forEach((d, i) => { if (d > 0) { g.fillStyle = Math.random() < .08 ? '#d8ffe4' : col; g.fillText(GL[(Math.random() * GL.length) | 0], i * fs, d * fs); } fx.drops[i] = d * fs > H && Math.random() > .975 ? 0 : d + 1; });
  }
  function gameFrame(t) {
    const hz = H * .6, vx = W / 2 + mx * W * .12;
    const sky = g.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, '#05010c'); sky.addColorStop(1, '#3a0a4a'); g.fillStyle = sky; g.fillRect(0, 0, W, hz);
    const sr = Math.min(W, H) * .17, sx = W / 2 + mx * W * .04, sy = hz - sr * .3;
    g.save(); g.beginPath(); g.arc(sx, sy, sr, 0, Math.PI * 2); g.clip();
    const sg = g.createLinearGradient(0, sy - sr, 0, sy + sr); sg.addColorStop(0, '#ffd23f'); sg.addColorStop(1, '#ff3d8b'); g.fillStyle = sg; g.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
    g.fillStyle = '#3a0a4a'; for (let i = 0; i < 8; i++) g.fillRect(sx - sr, sy - sr * .05 + i * sr * .14, sr * 2, (i + 1) * 1.4 * DPR);
    g.restore();
    g.fillStyle = '#04010a'; g.fillRect(0, hz, W, H - hz);
    g.strokeStyle = 'rgba(125,255,154,.5)'; g.lineWidth = DPR;
    for (let i = -30; i <= 30; i++) { g.beginPath(); g.moveTo(vx + i * W * .006, hz); g.lineTo(vx + i * W * .16, H); g.stroke(); }
    const off = (t / 700) % 1;
    for (let i = 0; i < 20; i++) { const k = (i + off) / 20, y = hz + (H - hz) * k * k; g.globalAlpha = .15 + k * .7; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.globalAlpha = 1; g.fillStyle = 'rgba(255,61,139,.8)'; g.fillRect(0, hz - DPR, W, 2 * DPR);
    g.font = `${11 * DPR}px monospace`; g.textAlign = 'center';
    CUBES.forEach(([fx_, fy, lbl], n) => {
      if (W < 900 * DPR && n > 1) return; const cx = fx_ * W + mx * W * .01, cy = fy * H + Math.sin(t / 900 + n) * 8 * DPR, s = (16 + n * 4) * DPR, a = t / (1600 + n * 300), b = t / (2300 + n * 200);
      const P = [-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z => { const x1 = x * Math.cos(a) - z * Math.sin(a), z1 = x * Math.sin(a) + z * Math.cos(a), y1 = y * Math.cos(b) - z1 * Math.sin(b); return [cx + x1 * s, cy + y1 * s]; })));
      g.strokeStyle = n % 2 ? 'rgba(77,243,230,.7)' : 'rgba(125,255,154,.7)'; g.beginPath();
      [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([p, q]) => { g.moveTo(P[p][0], P[p][1]); g.lineTo(P[q][0], P[q][1]); }); g.stroke();
      g.fillStyle = 'rgba(125,255,154,.4)'; g.fillText(lbl, cx, cy + s * 2.2);
    });
    for (let k = 0; k < 6; k++) { const ph = ((t / 3000 + k / 6) % 1), x = (k % 2 ? .97 - k * .01 : .03 + k * .01) * W, y = hz - ph * hz * .7; g.globalAlpha = (1 - ph) * .5; g.fillStyle = '#ffd23f'; g.fillText('+1 XP', x, y); }
    g.globalAlpha = 1; g.textAlign = 'left';
  }
  function blueFrame(t) {
    const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#0a1a36'); sk.addColorStop(1, '#1f4677'); g.fillStyle = sk; g.fillRect(0, 0, W, H);
    if (bokeh.length !== 40) bokeh = Array.from({ length: 40 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 6 + Math.random() * 30, s: .2 + Math.random() * .6, a: .03 + Math.random() * .07 }));
    for (const b of bokeh) { b.y -= b.s * DPR; if (b.y < -60 * DPR) { b.y = H + 60 * DPR; b.x = Math.random() * W; } g.fillStyle = `rgba(190,220,255,${b.a})`; g.beginPath(); g.arc(b.x, b.y, b.r * DPR, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(125,255,154,.35)'; g.lineWidth = 2 * DPR; g.beginPath();
    for (let i = 0; i <= 80; i++) { const x = i / 80 * W, y = H * .9 - (i / 80) * H * .55 - Math.sin(i * .8 + t / 600) * H * .01; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    if (fx.flick > t) rainFrame('rgba(0,0,0,.35)', 'rgba(70,255,140,.9)');
    else if (Math.random() < .0015) fx.flick = t + 140;
  }
  function frame(t) {
    const bs = document.body.classList, mode = bs.contains('shades') ? 'game' : fx.pill === 'red' ? 'red' : fx.pill === 'blue' ? 'blue' : '';
    if (bs.contains('shades')) { fpsN++; if (t - fpsT > 1000) { const f = $('#hudFps'); if (f) f.textContent = 'FPS ' + Math.min(60, Math.round(fpsN * 1000 / (t - fpsT))); fpsN = 0; fpsT = t; } }
    if (mode) {
      if (mode === 'game') gameFrame(t); else if (mode === 'red') rainFrame('rgba(0,5,2,.16)', 'rgba(70,255,140,.85)'); else blueFrame(t);
      if (!reduce && !document.hidden) requestAnimationFrame(frame);
      return;
    }
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
