/*
  Fuzja stylu (postać albo motyw bazowy) z motywem gry. Tryby (ustawienie gameMode):
    'patch'     – łatka (domyślny): postać prowadzi – karta, czcionki, kolory i avatar są jej, a gra jest
                  naszyta na wierzch jak łatki: emblemat/logo gry, wstążka w kolorach gry, cząsteczki gry
    'fuse-half' – pół na pół (50:50, domyślny): wymieszane kolory, teksty po równo
    'fuse'      – [eksperymentalny] postać bazą, gra dodatkiem (66:33)
    'fuse-game' – [eksperymentalny] gra bazą, postać dodatkiem (33:66): karta w motywie gry + portret/emblemat, kolor i głos postaci
    'game'      – motyw gry zastępuje styl
    'off'       – bez motywów gier
  Proporcja decyduje też, jak często mówi postać, a jak często gra (themes/voices.js → pickMix).
*/
(function () {
  const GT = window.OverlayGameThemes;
  if (!GT) return;
  const MIX = { patch: 0.4, fuse: 0.33, 'fuse-half': 0.5, 'fuse-game': 0.66, game: 1 };
  const PORTRAIT = { vince: 'themes/fursona/vince.webp', chip: 'themes/fursona/chip.webp', ragnar: 'themes/fursona/ragnar.webp', toro: 'themes/fursona/toro.webp' };

  function modeOf(settings) {
    if (settings.gameThemes === false) return 'off';
    const m = settings.gameMode || 'patch';
    return ['patch', 'fuse', 'fuse-half', 'fuse-game', 'game', 'off'].includes(m) ? m : 'patch';
  }

  // r = { cls, def (styl karty), game (gra jako dodatek), persona (postać jako dodatek), mode, mix (udział gry w tekstach) }
  // wariant gry z nazwy (np. Mass Effect 1/2/3 po wyjściu z launchera)
  GT.variantOf = (t, name) => (t && t.variant && name ? t.variant(String(name).toLowerCase()) || '' : '');

  function build(cls, game, mode, variant) {
    const r = build0(cls, game, mode);
    const vdef = r.game || (r.def && r.def.group !== 'fursona' ? r.def : null);
    r.variant = vdef && variant && vdef.variant ? variant : '';
    // wariant podmienia kolory, cząsteczki i emblemat (kopia motywu – oryginał zostaje bez zmian)
    const vo = r.variant && vdef.variants && vdef.variants[r.variant];
    if (vo) {
      const v = { ...vdef, ...vo, fx: vo.fx ? { ...vdef.fx, ...vo.fx } : vdef.fx, variantOf: vdef.id };
      if (r.game === vdef) r.game = v; else r.def = v;
    }
    return r;
  }
  function build0(cls, game, mode) {
    let def = cls.startsWith('g-') ? GT.byId(cls.slice(2)) : null;
    if (cls.startsWith('g-') && !def) { cls = 'neon'; def = null; }
    if (!game || mode === 'off' || (def && def.id === game.id)) return { cls, def, game: null, persona: null, mode, mix: def && def.group !== 'fursona' ? 1 : 0 };
    const chosenIsGame = def && def.group !== 'fursona';
    if (mode === 'game' || chosenIsGame) return { cls: 'g-' + game.id, def: game, game: null, persona: null, mode: 'game', mix: 1 };
    if (mode === 'fuse-game') return { cls: 'g-' + game.id, def: game, game: null, persona: def, base: cls, mode, mix: MIX[mode] };
    return { cls, def, game, persona: null, mode, mix: MIX[mode] };
  }

  // gra bez własnego motywu, ale znanego rodzaju (wykrywacz: Ren'Py → visual novel, Blender i inne programy → tworzenie)
  const KIND_THEME = { vn: 'vn', make: 'mk' };
  // motyw wybrany ręcznie dla gry na liście „Moje gry i programy” (settings.themeFor: nazwa → id motywu albo 'none')
  GT.themeFor = (settings, name) => {
    const tf = settings.themeFor || {}, v = name ? tf[String(name).toLowerCase()] : null;
    return v === 'none' ? 'none' : v ? GT.byId(v) : null;
  };
  GT.resolve = function (settings, gameName, forcedCls, kind) {
    const mode = modeOf(settings);
    const ov = GT.themeFor(settings, gameName);
    const game = gameName && mode !== 'off' && ov !== 'none' ? (ov || GT.find(gameName) || (kind && KIND_THEME[kind] ? GT.byId(KIND_THEME[kind]) : null)) : null;
    const fixed = forcedCls || settings.theme || 'neon';
    const own = String(fixed).startsWith('g-') ? GT.byId(String(fixed).slice(2)) : null;
    return build(String(fixed), game, mode, GT.variantOf(game || own, gameName));
  };

  // alerty, ekrany i układy odtwarzają to samo z tego, co opublikowała karta „Teraz gram”
  GT.fromActive = function (active, settings, forcedCls) {
    const mode = (active && active.mode) || modeOf(settings);
    if (forcedCls) return build(forcedCls, null, mode);
    if (!active) return build(String(settings.theme || 'neon'), null, mode);
    const game = active.game ? GT.byId(active.game) : null;
    return build(String(active.base || active.cls || settings.theme || 'neon'), game, mode, active.variant || '');
  };
  GT.publishable = r => ({ cls: r.cls, base: r.persona ? r.base : r.cls, game: r.game ? r.game.id : (r.persona ? r.def.id : ''), persona: r.persona ? r.persona.id : '', mode: r.mode, variant: r.variant || '', at: Date.now() });

  // dla głosów: kto jest postacią, kto grą i w jakiej proporcji
  GT.voiceInfo = function (r) {
    const personaDef = r.persona || (r.def && r.def.group === 'fursona' ? r.def : null);
    const gameDef = r.game || (r.def && r.def.group !== 'fursona' ? r.def : null);
    return { personaId: personaDef ? personaDef.id : (r.def ? '_' : r.cls), gameId: gameDef ? gameDef.id : '', mix: gameDef ? (r.mix != null ? r.mix : 0.5) : 0, variant: r.variant || '' };
  };

  GT.bodyClasses = r => (r.def ? ' game-theme' : '') + (r.def && r.def.group === 'fursona' ? ' f-theme' : '') +
    (r.game ? ' fuse fuse-' + r.game.id : '') + (r.mode === 'fuse-half' && r.game ? ' fuse-half' : '') + (r.mode === 'patch' && r.game ? ' fuse-patch' : '') +
    (r.persona ? ' fuse-persona fusep-' + r.persona.id : '') + (r.variant ? ' gv-' + r.variant : '');

  // cząsteczki: gra (z domieszką koloru postaci) albo sam styl; przy 50:50 więcej
  GT.fusionFx = function (r) {
    const extra = r.persona ? [r.persona.accent[0]] : (r.def && r.game ? [r.def.accent[0]] : []);
    const src = r.game ? r.game.fx : (r.def ? r.def.fx : null);
    if (!src) return null;
    const fx = { ...src, colors: [...src.colors, ...extra] };
    if (r.mode === 'fuse-half' && r.game) fx.count = Math.round(fx.count * 1.3);
    return fx;
  };

  const hexMix = (a, b, t) => {
    const p = h => { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
    try { const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); } catch (e) { return a; }
  };
  // akcenty: postać trzyma swoje (66:33), przy 50:50 mieszane, motyw bazowy przejmuje kolory gry
  GT.fusionAccent = function (r, fallback) {
    if (r.def && r.game && r.mode === 'fuse-half') return [hexMix(r.def.accent[0], r.game.accent[0], 0.5), hexMix(r.def.accent[1], r.game.accent[1], 0.5)];
    if (r.def) return r.def.accent;
    if (r.game) return r.game.accent;
    return fallback;
  };

  // kontrast: na jasnym akcencie (np. radioaktywna zieleń) tekst ciemny, na ciemnym – biały.
  // Ustawia --on-accent, --on-accent2, --on-g1 i klasę light-accent na <html>.
  const lum = hex => {
    const m = String(hex || '').trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i); if (!m) return null;
    let h = m[1]; if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const c = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  GT.onColor = hex => { const L = lum(hex); return L != null && L > 0.4 ? '#101114' : '#ffffff'; };
  GT.markContrast = function () {
    const el = document.documentElement, cs = getComputedStyle(el), st = el.style;
    let light = false;
    for (const [v, on] of [['--accent', '--on-accent'], ['--accent2', '--on-accent2'], ['--g1', '--on-g1']]) {
      const col = (st.getPropertyValue(v) || cs.getPropertyValue(v)).trim(); if (!col) continue;
      const c = GT.onColor(col); st.setProperty(on, c); if (v === '--accent' && c !== '#ffffff') light = true;
    }
    el.classList.toggle('light-accent', light);
  };

  // dodatki w #wrap: odznaka gry + pasek energii (postać bazą) albo odznaka postaci (gra bazą)
  GT.applyFusion = function (wrap, r) {
    if (!wrap) return;
    const el = id => { let e = wrap.querySelector('#' + id); if (!e) { e = document.createElement('div'); e.id = id; e.setAttribute('aria-hidden', 'true'); wrap.appendChild(e); } return e; };
    const badge = el('gbadge'), bar = el('fusebar'), pbadge = el('pbadge');
    const logo = r.game && r.mode === 'patch' && r.logo ? r.logo : '';
    const gid = r.game ? r.game.id + (r.variant || '') + '|' + logo : '';
    if (badge.dataset.id !== gid) {
      badge.dataset.id = gid; badge.classList.remove('logo');
      badge.innerHTML = r.game ? r.game.emblem || '' : '';
      // naszywka z prawdziwym logo gry; gdy się nie wczyta – zostaje emblemat motywu
      if (logo) { const im = new Image(); im.alt = ''; im.onload = () => { if (badge.dataset.id === gid) { badge.textContent = ''; badge.appendChild(im); badge.classList.add('logo'); } }; im.src = logo; }
    }
    const pid = r.persona ? r.persona.id : '';
    if (pbadge.dataset.id !== pid) {
      pbadge.dataset.id = pid;
      pbadge.innerHTML = !r.persona ? '' : PORTRAIT[pid] ? `<img src="${PORTRAIT[pid]}" alt="">` : (r.persona.emblem || '');
    }
    const root = document.documentElement.style;
    if (r.game) { root.setProperty('--g1', r.game.accent[0]); root.setProperty('--g2', r.game.accent[1]); }
    if (r.persona) { root.setProperty('--g1', r.persona.accent[0]); root.setProperty('--g2', r.persona.accent[1]); }
  };
})();
