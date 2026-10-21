// Buffadamus v2 - transmissions from 1555. No tracking. Easter eggs stored only in this browser.
(() => {
  const $ = s => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('bfd.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('bfd.' + k, JSON.stringify(v)); } catch {} }
  };
  const GL = '!<>-_\\/[]{}=+*^?#%&@$01';

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
  function say(html, ms = 3200) { toast.innerHTML = html; toast.hidden = false; clearTimeout(say._t); say._t = setTimeout(() => toast.hidden = true, ms); }
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
    ['lost', 'Page from no year', 'Visit a page that does not exist.']
  ];
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
    say(`ANOMALY FOUND: <b>${a ? a[1] : id}</b> (${found.size}/9)`);
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

  // ---------- chrono dial ----------
  const TX = {
    1555: 'ORIGIN. Built a time machine out of an astrolabe, two candles and confidence. The confidence was load-bearing.',
    1637: 'Tulip bulbs sell for the price of a canal house. I bought the canal house. It was full of tulips.',
    1666: 'London catches fire. Fire insurance is invented the next year. I am always one year early or one year late. Never on time.',
    1720: 'South Sea stock: BUY. [SIGNAL LOST] ...SELL. SELL. Why does nobody ever receive the second half.',
    1849: 'Gold in California. I arrive in 1852 with a shovel and a strong opinion.',
    1903: 'Two brothers fly for twelve seconds. I have been flying through time for 471 years. Nobody gives me a museum.',
    1929: 'OCTOBER. I warned them on the 23rd. They said it was different this time.\nIt was not different this time.',
    1969: 'A man walks on the moon. My time machine still cannot parallel park.',
    1985: '88 miles per hour. That is the speed. I was going 87. That is why I am stuck here.',
    1987: 'A Monday. A black one. Do not check the numbers. Do not check anything. Go outside.',
    1999: 'Every computer resets to 1900 at midnight. I fill a bunker with canned beans.\nJanuary 1st: the beans and I have a lot to talk about.',
    2000: 'Every company adds .com to its name and doubles. I add .com to mine.\nBUFFADAMUS.COM. Wait. That one worked.',
    2008: 'The houses are made of cards. The cards are made of houses. Nobody can explain it. Everybody signs.',
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
  const yr = $('#year'), out = $('#yearOut'), body = $('#txBody'), st = $('#txState'), tid = $('#txId');
  let tm = null, lastV = +yr.value, lastT = performance.now(), fastShown = 0;
  function tune(v, instant) {
    out.textContent = v;
    tid.textContent = 'TX-' + v.toString(16).toUpperCase().padStart(4, '0');
    const txt = TX[v] || FILL[(v * 7919) % FILL.length];
    st.textContent = TX[v] ? (ANOM_YEARS[v] ? 'ANOMALY' : 'LIVE') : 'STATIC';
    st.className = TX[v] ? (ANOM_YEARS[v] ? 'anom' : 'live') : '';
    clearTimeout(tm);
    tm = setTimeout(() => { scramble(body, txt, instant ? 6 : 16); if (ANOM_YEARS[v]) unlock(ANOM_YEARS[v]); }, instant ? 0 : 140);
    beep(200 + (v - 1555) * 1.2, .02, 'sawtooth', .012);
  }
  yr.addEventListener('input', () => {
    const v = +yr.value, now = performance.now();
    const speed = Math.abs(v - lastV) / Math.max(1, now - lastT) * 1000; // years per second
    if (speed > 1400 && now - fastShown > 5000) { fastShown = now; flash(); say('<b>88 MPH.</b> Nothing happens. You need a DeLorean for that.'); }
    lastV = v; lastT = now; tune(v);
  });
  document.querySelectorAll('.jump button[data-y]').forEach(b => b.onclick = () => { yr.value = b.dataset.y; tune(+b.dataset.y, true); });
  $('#randYear').onclick = () => { const v = 1555 + ((Math.random() * 545) | 0); yr.value = v; tune(v, true); };
  tune(+yr.value, true);

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
      typed = (typed + e.key.toLowerCase()).slice(-12);
      if (typed.endsWith('1555')) { unlock('origin'); say('<b>ORIGIN PING.</b> 1555 answers: "who is this".'); }
      if (typed.endsWith('buffett')) { unlock('oracle'); say('<b>RULE NO. 1:</b> never lose money. <b>RULE NO. 2:</b> never trust a time machine.'); }
    }
  });
  function toggle1555() {
    flash(); const on = document.body.classList.toggle('y1555');
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
  }
  $('#termBtn').onclick = () => toggleTerm(true);
  $('#termClose').onclick = () => toggleTerm(false);
  const CMDS = {
    help: () => 'commands: whoami, date, year <n>, ls, cat <file>, prophesy, sudo prophesy, konami, sound, anomalies, clear, exit',
    whoami: () => 'buffadamus. half warren buffett, half nostradamus. currently: stuck.',
    date: () => `local: ${new Date().toString().slice(0, 24)}\norigin: 1555 (approx. the warranty says 1556)`,
    ls: () => 'transmissions.log  warranty.pdf  secret.txt  beans.txt',
    prophesy: () => ANS[(Math.random() * ANS.length) | 0],
    'sudo prophesy': () => 'permission granted. prophecy: you will type another command. [FULFILLED]',
    konami: () => { toggle1555(); return 'overdrive toggled.'; },
    sound: () => { sb.click(); return 'sound ' + (soundOn ? 'on' : 'off'); },
    anomalies: () => ANOMS.map(([id, n]) => (found.has(id) ? '[x] ' + n : '[ ] ??? ???')).join('\n'),
    clear: () => { tout.textContent = ''; return null; },
    exit: () => { toggleTerm(false); return null; }
  };
  const FILES = {
    'transmissions.log': Object.keys(TX).map(y => y + '  ' + TX[y].split('\n')[0].slice(0, 54)).join('\n'),
    'warranty.pdf': 'binary file. it says "VOID IF USED FOR TIME TRAVEL".',
    'secret.txt': 'the dial has three loud years nobody tunes to. one of them ends in 29.',
    'beans.txt': 'still here. still waiting for y2k.'
  };
  $('#termForm').addEventListener('submit', e => {
    e.preventDefault(); const raw = tin.value.trim(); tin.value = ''; if (!raw) return;
    tprint('buff@1555:~$ ' + raw);
    const c = raw.toLowerCase();
    let r;
    if (CMDS[c]) r = CMDS[c]();
    else if (c.startsWith('year ')) { const v = Math.max(1555, Math.min(2099, parseInt(c.slice(5), 10) || 2026)); yr.value = v; tune(v, true); r = 'tuned to ' + v + '. ' + (TX[v] ? 'live signal.' : 'static.'); }
    else if (c.startsWith('cat ')) r = FILES[c.slice(4).trim()] || 'cat: no such file. or not yet.';
    else if (c === '1555') { unlock('origin'); r = 'origin ping returned: "who is this"'; }
    else if (c === 'buffett') { unlock('oracle'); r = 'rule no. 1: never lose money. rule no. 2: never trust a time machine.'; }
    else if (c.startsWith('rm ')) r = 'nice try. the timeline is read-only.';
    else r = 'command not found. it may not be invented yet.';
    if (r) tprint(r);
    beep(700, .03);
  });

  // ---------- console egg ----------
  try {
    console.log('%cBUFFADAMUS', 'font:800 28px sans-serif;color:#4df3e6;text-shadow:2px 0 #ff3d8b');
    console.log('%cYou opened the console. In 1555 this was called "witchcraft". Try typing ` on the page.', 'color:#ffb547');
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
  let mx = 0, my = 0, warp = 0;
  addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5); });
  addEventListener('scroll', () => { warp = Math.min(1, warp + .08); }, { passive: true });
  function frame(t) {
    const cx = W / 2 + mx * W * .08, cy = H * .42 + my * H * .08;
    g.fillStyle = document.body.classList.contains('y1555') ? 'rgba(239,228,200,.35)' : 'rgba(6,7,12,.28)';
    g.fillRect(0, 0, W, H);
    // rings
    const R = Math.max(W, H);
    for (let i = 0; i < 6; i++) {
      const k = ((t / 6000 + i / 6) % 1); const r = k * k * R * .9;
      g.strokeStyle = i % 2 ? `rgba(255,61,139,${.10 * (1 - k)})` : `rgba(77,243,230,${.12 * (1 - k)})`;
      g.lineWidth = DPR; g.beginPath(); g.ellipse(cx, cy, r * 1.15, r * .8, 0, 0, Math.PI * 2); g.stroke();
    }
    const sp = .0026 + warp * .02; warp *= .96;
    for (const s of stars) {
      s.z -= sp * s.s * (1 + s.z); if (s.z <= .02) Object.assign(s, newStar(false));
      const d = (1 / s.z) * 22 * DPR, x = cx + Math.cos(s.a) * d * 1.15, y = cy + Math.sin(s.a) * d * .8;
      if (x < -50 || x > W + 50 || y < -50 || y > H + 50) { Object.assign(s, newStar(false)); continue; }
      const sz = (1 - s.z) * 2.2 * DPR;
      g.fillStyle = s.h ? 'rgba(77,243,230,.85)' : 'rgba(255,181,71,.8)';
      g.fillRect(x, y, sz, sz * (1 + warp * 6));
    }
    if (!reduce && !document.hidden) requestAnimationFrame(frame);
  }
  size(); addEventListener('resize', size);
  if (reduce) { g.fillStyle = '#06070c'; g.fillRect(0, 0, W, H); frame(0); }
  else { requestAnimationFrame(frame); document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(frame); }); }
})();
