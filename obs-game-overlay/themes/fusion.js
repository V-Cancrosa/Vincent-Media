/*
  Fuzja stylu z grą. Wybrany styl (postać albo motyw bazowy) zostaje „ciałem” karty,
  a gra z własnym motywem dokłada swoje: kolory, cząsteczki, znak gry (odznaka) i pasek energii.
  Tryby (ustawienie gameMode): 'fuse' – fuzja (domyślnie), 'game' – motyw gry zastępuje styl, 'off' – bez motywów gier.
*/
(function () {
  const GT = window.OverlayGameThemes;
  if (!GT) return;

  GT.resolve = function (settings, gameName, forcedCls) {
    const mode = settings.gameThemes === false ? 'off' : (settings.gameMode || 'fuse');
    const game = gameName && mode !== 'off' ? GT.find(gameName) : null;
    let cls = String(forcedCls || settings.theme || 'neon');
    let def = cls.startsWith('g-') ? GT.byId(cls.slice(2)) : null;
    if (cls.startsWith('g-') && !def) { cls = 'neon'; def = null; }
    // motyw gry wybrany ręcznie albo tryb „gra zastępuje” – bez fuzji
    if (game && (mode === 'game' || (def && def.group !== 'fursona'))) return { cls: 'g-' + game.id, def: game, game: null };
    return { cls, def, game: game && (!def || def.id !== game.id) ? game : null };
  };

  GT.bodyClasses = r => (r.def ? ' game-theme' : '') + (r.def && r.def.group === 'fursona' ? ' f-theme' : '') + (r.game ? ' fuse fuse-' + r.game.id : '');

  // cząsteczki: gry (z domieszką koloru postaci) albo samego stylu
  GT.fusionFx = function (r) {
    if (r.game && r.game.fx) return { ...r.game.fx, colors: [...r.game.fx.colors, ...(r.def ? [r.def.accent[0]] : [])] };
    return r.def ? r.def.fx : null;
  };

  // akcenty: postać trzyma swoje, motyw bazowy przejmuje kolory gry
  GT.fusionAccent = function (r, fallback) {
    if (r.def) return r.def.accent;
    if (r.game) return r.game.accent;
    return fallback;
  };

  // odznaka gry i pasek energii w #wrap
  GT.applyFusion = function (wrap, r) {
    if (!wrap) return;
    let badge = wrap.querySelector('#gbadge'), bar = wrap.querySelector('#fusebar');
    if (!badge) { badge = document.createElement('div'); badge.id = 'gbadge'; badge.setAttribute('aria-hidden', 'true'); wrap.appendChild(badge); }
    if (!bar) { bar = document.createElement('div'); bar.id = 'fusebar'; bar.setAttribute('aria-hidden', 'true'); wrap.appendChild(bar); }
    const id = r.game ? r.game.id : '';
    if (badge.dataset.id !== id) { badge.dataset.id = id; badge.innerHTML = r.game ? r.game.emblem || '' : ''; }
    const root = document.documentElement.style;
    if (r.game) { root.setProperty('--g1', r.game.accent[0]); root.setProperty('--g2', r.game.accent[1]); }
  };
})();
