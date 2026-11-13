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
    const av = el('div', 'cav', (ev.user || '?').slice(0, 1).toUpperCase());
    const body = el('div', 'cbody');
    const name = el('div', 'cname', ev.user || '');
    for (const b of ev.badges || []) if (BADGES[b]) name.append(el('span', 'cbadge cb-' + b, BADGES[b]));
    const text = el('div', 'ctext');
    const frags = ev.fragments && ev.fragments.length ? ev.fragments : [{ t: 'text', v: ev.text || '' }];
    for (const f of frags) {
      if (f.t === 'emote' && f.id) { const i = new Image(); i.className = 'cemote'; i.alt = f.v || ''; i.src = EMOTE(f.id); text.append(i); }
      else text.append(document.createTextNode(f.v || ''));
    }
    body.append(name, text);
    m.append(av, body);
    return m;
  }

  function mount(container, opts = {}) {
    const mode = opts.mode || 'bubbles';
    const max = opts.max || (mode === 'bubbles' ? 6 : 40);
    const life = (opts.life || 12) * 1000;
    container.classList.add('chat', 'chat-' + mode);
    const seen = new Set();
    function add(ev) {
      if (!ev || ev.type !== 'chat') return;
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
    return { add, clear: () => { container.textContent = ''; } };
  }

  window.OverlayChat = { mount, styles: STYLES };
})();
