/*
  Czat na nakładce: dymki (wyskakują i znikają) albo panel (czat na stałe).
  Każdy widz może wybrać styl swoich wiadomości (!styl pixel) i kolor (!kolor turkus) – wybór pamięta wykrywacz.
  Styl widza łączy się z aktywnym motywem: ramka/akcent w kolorach motywu (i gry przy fuzji).
*/
(function () {
  const EMOTE = id => `https://static-cdn.jtvnw.net/emoticons/v2/${encodeURIComponent(id)}/default/dark/2.0`;
  const BADGES = { broadcaster: 'HOST', moderator: 'MOD', vip: 'VIP', subscriber: 'SUB', founder: 'SUB' };
  const STYLES = ['neon', 'szklo', 'pixel', 'komiks', 'terminal', 'papier', 'holo', 'sakura', 'ogien', 'lod'];

  function hashColor(name) {
    let h = 0; for (const c of String(name)) h = (h * 31 + c.codePointAt(0)) >>> 0;
    return `hsl(${h % 360} 85% 65%)`;
  }

  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  // słowa zakazane (themes/wordfilter.js): zakryte ▇▇▇ albo cała wiadomość ukryta (panel → Czat → Słowa zakazane)
  function words(ev) {
    if (ev._w !== undefined || !window.VMWords) return ev._w || null;
    const s = window.VMWords.settings();
    ev._w = s.mode === 'off' ? null : window.VMWords.check(ev.text || '');
    if (ev._w && !ev._w.level) ev._w = null;
    return ev._w;
  }
  function render(ev) {
    const style = STYLES.includes(ev.style) ? ev.style : 'theme';
    const color = ev.color || hashColor(ev.user || '?');
    const m = el('div', `cmsg cs-${style}` + (ev.command ? ' cmsg-sys' : ''));
    m.style.setProperty('--uc', color);
    if (ev.command) {
      // komenda: zamiast treści krótkie potwierdzenie
      m.append(el('span', 'csys-user', ev.user), el('span', 'csys-arrow', ' → '), el('span', 'csys-text', ev.reply || ev.text));
      return m;
    }
    const uname = window.VMWords ? window.VMWords.maskName(ev.user || '') : (ev.user || '');
    const av = el('div', 'cav', uname.slice(0, 1).toUpperCase());
    const body = el('div', 'cbody');
    const name = el('div', 'cname', uname);
    for (const b of ev.badges || []) if (BADGES[b]) name.append(el('span', 'cbadge cb-' + b, BADGES[b]));
    // oflagowana wiadomość, którą panel każe pokazać: wyraźny znacznik zamiast ukrycia
    if (ev.flag) { m.classList.add('cflagged', 'cflag-' + ev.flag.level); const fb = el('span', 'cbadge cb-flag', '⚑'); fb.title = (ev.flag.reasons || []).join(' · '); name.append(fb); }
    const text = el('div', 'ctext');
    const w = words(ev);
    if (w) m.classList.add('cmasked');
    const frags = w ? [{ t: 'text', v: w.masked }] : ev.fragments && ev.fragments.length ? ev.fragments : [{ t: 'text', v: ev.text || '' }];
    for (const f of frags) {
      if (f.t === 'emote' && f.id) { const i = new Image(); i.className = 'cemote'; i.alt = f.v || ''; i.src = EMOTE(f.id); text.append(i); }
      else text.append(document.createTextNode(f.v || ''));
    }
    body.append(name, text);
    m.append(av, body);
    return m;
  }

  // pasek jak w wiadomościach: wiadomości jadą od prawej do lewej, nie zasłaniają gry; przy kolejce przyspiesza
  function mountTicker(container, opts = {}) {
    container.classList.add('chat', 'chat-ticker');
    container.textContent = '';
    const tag = el('div', 'ticker-tag'); tag.append(el('span', 'tdot'), el('span', 'ttext', opts.label || (window.VMi18n ? window.VMi18n.t('chat') : 'CZAT')));
    const lane = el('div', 'ticker-lane');
    container.append(tag, lane);
    const items = [], seen = new Set(), GAP = 16;   // odstęp między kafelkami
    const base = opts.speed || 140;            // px/s w 1920×1080
    let last = performance.now(), idleAt = 0, raf = 0;
    function frame(now) {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const lw = lane.clientWidth;
      const tail = items.length ? items[items.length - 1].x + items[items.length - 1].w : 0;
      const backlog = Math.max(0, tail - lw);
      const v = base * (1 + Math.min(2.5, backlog / lw));      // dużo wiadomości → szybciej
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i]; it.x -= v * dt;
        it.el.style.transform = `translateX(${it.x.toFixed(1)}px)`;
        if (it.x + it.w < -10) { it.el.remove(); items.splice(i, 1); }
      }
      if (items.length) idleAt = now;
      const vis = items.length > 0 || now - idleAt < 2500;
      if (vis !== container.classList.contains('on')) { container.classList.toggle('on', vis); if (opts.onVisible) opts.onVisible(vis); }
      raf = items.length || now - idleAt < 3000 ? requestAnimationFrame(frame) : 0;
    }
    function add(ev) {
      if (!ev || ev.type !== 'chat') return;
      if (opts.filter && !opts.filter(ev)) return;
      const key = ev.id != null ? 'i' + ev.id : ev.user + ev.text + Math.random();
      if (seen.has(key)) return; seen.add(key);
      const m = render(ev); m.classList.add('in');
      lane.appendChild(m);
      const w = m.offsetWidth, lw = lane.clientWidth;
      const prev = items[items.length - 1];
      const x = Math.max(lw, prev ? prev.x + prev.w + GAP : lw);
      items.push({ el: m, x, w });
      m.style.transform = `translateX(${x}px)`;
      while (items.length > 60) { items[0].el.remove(); items.shift(); }
      if (!container.classList.contains('on')) { container.classList.add('on'); if (opts.onVisible) opts.onVisible(true); }
      idleAt = performance.now();
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }
    return { add, clear: () => { items.forEach(i => i.el.remove()); items.length = 0; } };
  }

  // podejrzane wiadomości (świeże konto, reklama widzów…) nie trafiają na ekran, dopóki panel ich nie puści
  function allowed(ev) {
    const w = ev && ev.type === 'chat' ? words(ev) : null;
    if (w && window.VMWords.settings().mode === 'hide') return false;
    if (!ev.flag || ev.flag.level !== 'suspect') return true;
    try { const s = window.VMClient ? window.VMClient.settings() : {}; return s.botHide === false; } catch (e) { return true; }
  }

  function mount(container, opts = {}) {
    const mode = opts.mode || 'bubbles';
    if (mode === 'ticker') return mountTicker(container, { ...opts, filter: allowed });
    const max = opts.max || (mode === 'bubbles' ? 6 : 40);
    const life = (opts.life || 12) * 1000;
    container.classList.add('chat', 'chat-' + mode);
    const seen = new Set();
    function add(ev) {
      if (!ev || ev.type !== 'chat' || !allowed(ev)) return;
      const key = ev.id != null ? 'i' + ev.id : ev.user + ev.text + Math.random();
      if (seen.has(key)) return; seen.add(key);
      const m = render(ev);
      container.appendChild(m);
      requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('in')));
      while (container.children.length > max) container.firstElementChild.remove();
      if (mode === 'bubbles' || opts.fade) {
        setTimeout(() => { m.classList.add('out'); setTimeout(() => m.remove(), 700); }, ev.command ? Math.min(life, 5000) : life);
      }
    }
    // alert jako wiadomość w czacie (układy z czatem): ikona, napis postaci/gry, kto, ile, zdanie postaci
    function addAlert(ev, info = {}) {
      const AI = window.OverlayAlertInfo; if (!AI) return;
      const tier = info.tier || 1;
      const m = el('div', `cmsg calert ca-${ev.type} tier-${tier}`);
      const ic = el('div', 'caicon'); ic.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${AI.ICONS[ev.type] || AI.ICONS.follow}</svg>`;
      const body = el('div', 'cbody');
      const lab = el('div', 'calabel', info.label || ev.type);
      if (tier >= 3) lab.append(el('span', 'castars', '★'.repeat(tier)));
      body.append(lab, el('div', 'caname', ev.user || ''));
      const det = AI.details(ev); if (det && det !== 'Dzięki!' && det !== 'Thanks!') body.append(el('div', 'cadet', det));
      if (info.line) body.append(el('div', 'caline', info.line));
      m.append(ic, body);
      container.appendChild(m);
      requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('in')));
      while (container.children.length > max) container.firstElementChild.remove();
      if (mode === 'bubbles') setTimeout(() => { m.classList.add('out'); setTimeout(() => m.remove(), 700); }, Math.max(life, 10000));
    }
    return { add, addAlert, clear: () => { container.textContent = ''; } };
  }

  window.OverlayChat = { mount, styles: STYLES, allowed };
})();
