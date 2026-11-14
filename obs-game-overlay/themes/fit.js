/*
  Dopasowanie tekstu do miejsca: długa nazwa gry (albo nick) najpierw się zmniejsza, a gdy to nie wystarcza,
  przechodzi do drugiej linijki – zamiast ucinać się wielokropkiem.
  VMFit.text(el, { min: 0.6, lines: 2 })  – min: najmniejsza czcionka jako część wyjściowej
*/
(function () {
  function text(el, opts = {}) {
    if (!el || !el.textContent) return;
    const min = opts.min || 0.6, lines = opts.lines || 2;
    el.style.minWidth = ''; el.style.fontSize = ''; el.style.whiteSpace = ''; el.style.display = ''; el.style.webkitLineClamp = ''; el.style.webkitBoxOrient = ''; el.style.overflowWrap = '';
    if (!el.clientWidth || el.scrollWidth <= el.clientWidth + 1) return;
    // najpierw szerzej: karta (opts.container) może urosnąć do swojej maksymalnej szerokości
    const box = opts.container;
    if (box) {
      const mx = parseFloat(getComputedStyle(box).maxWidth), cw = box.offsetWidth;
      if (mx > cw) { el.style.minWidth = Math.min(el.scrollWidth, el.clientWidth + (mx - cw)) + 'px'; if (el.scrollWidth <= el.clientWidth + 1) return; }
    }
    const base = parseFloat(getComputedStyle(el).fontSize) || 16;
    // kilka kroków: zmiana czcionki może zmienić też szerokość karty
    let size = base;
    for (let i = 0; i < 8 && el.scrollWidth > el.clientWidth + 1 && size > base * min; i++) {
      size = Math.max(base * min, Math.floor(size * Math.min(0.97, el.clientWidth / el.scrollWidth)));
      el.style.fontSize = size + 'px';
    }
    if (el.scrollWidth <= el.clientWidth + 1) return;
    // nadal za długie: kilka linijek w tej mniejszej czcionce (bez ucinania w środku słowa, jeśli się da)
    el.style.whiteSpace = 'normal'; el.style.overflowWrap = 'anywhere';
    el.style.display = '-webkit-box'; el.style.webkitBoxOrient = 'vertical'; el.style.webkitLineClamp = String(lines);
  }
  function all(pairs) { for (const [el, o] of pairs) text(el, o); }
  window.VMFit = { text, all };
})();
