/*
  Wspólne dla źródeł OBS (czat, układy, ekrany): ustawienia, motyw z fuzją i zdarzenia z wykrywacza.
*/
(function () {
  const KEY = 'obsGameOverlay.v1', ACTIVE_KEY = 'obsGameOverlay.activeTheme';
  const q = new URLSearchParams(location.search);
  const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch (e) { return fb; } };
  const DEF = { theme: 'neon', motion: 'full', local: true, localUrl: 'http://localhost:7777' };
  const GT = () => window.OverlayGameThemes || { byId: () => null, FX: { attach() {}, set() {} }, texture: () => '' };

  function settings() { return { ...DEF, ...(q.get('panel') === '0' ? {} : read(KEY, {})) }; }

  // motyw: ten sam styl i ta sama gra co karta „Teraz gram” (overlay.html publikuje je w activeTheme)
  let lastKey = null;
  function applyTheme(base = '', hooks = {}) {
    const s = settings(), gt = GT();
    const f = gt.fromActive ? gt.fromActive(read(ACTIVE_KEY, null), s, q.get('theme')) : { cls: s.theme || 'neon', def: null, game: null };
    const { cls, def, game } = f;
    // id = postać (także gdy jest dodatkiem do gry) – avatar i głos
    const r = { ...f, id: f.persona ? f.persona.id : (def ? def.id : cls), reduced: (q.get('motion') || s.motion) === 'reduced' };
    document.body.className = `theme-${cls} ${base}` + (gt.bodyClasses ? gt.bodyClasses(r) : '') + (r.reduced ? ' reduced-motion' : '');
    const acc = gt.fusionAccent ? gt.fusionAccent(r, ['#7c5cff', '#00e1ff']) : ['#7c5cff', '#00e1ff'];
    const root = document.documentElement.style;
    root.setProperty('--accent', s.accent || acc[0]); root.setProperty('--accent2', s.accent2 || acc[1]);
    setTimeout(() => gt.markContrast && gt.markContrast(), 0);
    if (game) { root.setProperty('--g1', game.accent[0]); root.setProperty('--g2', game.accent[1]); }
    if (f.persona) { root.setProperty('--g1', f.persona.accent[0]); root.setProperty('--g2', f.persona.accent[1]); }
    root.setProperty('--tex', def ? gt.texture(def) : '');
    const key = cls + '|' + (game ? game.id : '') + '|' + (f.persona ? f.persona.id : '') + (f.variant || '') + r.reduced;
    if (key !== lastKey) { lastKey = key; if (hooks.changed) hooks.changed(r); }
    return r;
  }

  // zdarzenia: wykrywacz (Twitch, testy) + kanał przeglądarki (przyciski testowe w panelu / demo)
  function events(onEvent, opts = {}) {
    let last = null, timer = null;
    async function poll() {
      clearTimeout(timer);
      let delay = opts.interval || 1000;
      const s = settings();
      if (s.local) {
        try {
          const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 2500);
          const r = await fetch(window.vmHub(s.localUrl) + '/events' + (last != null ? '?after=' + last : ''), { cache: 'no-store', signal: ctl.signal });
          clearTimeout(t);
          const j = await r.json();
          if (window.vmCheckVersion) window.vmCheckVersion(j.appVersion);
          if (last != null && j.last < last) last = null;
          for (const ev of j.events || []) onEvent(ev);
          last = j.last;
        } catch (e) { delay = 10000; }
      } else delay = 5000;
      timer = setTimeout(poll, delay);
    }
    try {
      const bc = new BroadcastChannel('obsGameOverlay');
      bc.addEventListener('message', e => {
        const m = e.data;
        if (m && typeof m === 'object' && m.type === 'alert' && m.event) onEvent({ ...m.event, id: undefined });
        else if (m === 'update' && opts.onSettings) opts.onSettings();
      });
    } catch (e) {}
    window.addEventListener('storage', e => { if ((e.key === KEY || e.key === ACTIVE_KEY) && opts.onSettings) opts.onSettings(); });
    poll();
  }

  async function hubGet(path) {
    const s = settings();
    const r = await fetch(window.vmHub(s.localUrl) + path, { cache: 'no-store' });
    return r.json();
  }

  window.VMClient = { settings, applyTheme, events, hubGet, param: k => q.get(k), read };
})();
