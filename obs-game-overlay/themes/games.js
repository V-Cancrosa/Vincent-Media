/*
  Motywy gier dla nakładki „Teraz gram”.
  Cała grafika (emblematy SVG, tekstury, cząsteczki) jest narysowana od zera dla tego projektu
  i nie zawiera logotypów ani grafik z gier. Licencja: CC0 / domena publiczna.

  Każdy motyw:
    id      – klasa CSS: theme-g-<id> (style w games.css)
    name    – nazwa w panelu
    match   – fragmenty nazwy gry (małe litery), po których motyw włącza się automatycznie
    accent  – kolory akcentu [główny, drugi]
    emblem  – SVG wystający poza panel
    texture – opcjonalna tekstura tła rysowana na canvasie (ustawiana jako --tex)
    fx      – cząsteczki wokół panelu
*/
(function () {
  const svg = (w, h, body) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">${body}</svg>`;

  const THEMES = [
    {
      id: 'elden', name: 'Elden Ring', match: ['elden ring', 'nightreign'],
      accent: ['#d6b25e', '#f5e0a0'],
      // „miejsce łaski”: złota gwiazda w okręgach
      emblem: svg(100, 100, `
        <defs>
          <radialGradient id="eg" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="#fff6d8" stop-opacity=".95"/>
            <stop offset=".35" stop-color="#f1cf7a" stop-opacity=".55"/>
            <stop offset="1" stop-color="#d6b25e" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#eg)" class="em-pulse"/>
        <g fill="none" stroke="#f3dc9a" stroke-width="1.4" class="em-spin">
          <circle cx="50" cy="50" r="30"/>
          <circle cx="50" cy="50" r="22" stroke-dasharray="3 5"/>
          <path d="M50 8 L50 92 M8 50 L92 50" stroke-width=".9" opacity=".7"/>
        </g>
        <path d="M50 22 L54 46 L78 50 L54 54 L50 78 L46 54 L22 50 L46 46 Z" fill="#fff4cf"/>
        <circle cx="50" cy="50" r="4" fill="#fff"/>`),
      fx: { shape: 'dot', dir: 'up', count: 34, colors: ['#ffd27a', '#ffb347', '#fff1c1'], size: [1.2, 3.2], speed: [12, 34], glow: true, twinkle: true }
    },
    {
      id: 'mc', name: 'Minecraft', match: ['minecraft'],
      accent: ['#5d9b3a', '#ffff55'],
      // sześcian z wokseli (trawa + ziemia)
      emblem: svg(64, 64, `
        <g shape-rendering="crispEdges">
          <path d="M32 4 L60 18 L32 32 L4 18 Z" fill="#6fb043"/>
          <path d="M32 4 L46 11 L32 18 L18 11 Z" fill="#7cc24a"/>
          <path d="M18 11 L32 18 L18 25 L4 18 Z" fill="#5d9b3a"/>
          <path d="M4 18 L32 32 L32 60 L4 46 Z" fill="#8b5e36"/>
          <path d="M32 32 L60 18 L60 46 L32 60 Z" fill="#6b4526"/>
          <path d="M4 18 L32 32 L32 38 L4 24 Z" fill="#5d9b3a"/>
          <path d="M32 32 L60 18 L60 24 L32 38 Z" fill="#4f8a31"/>
          <rect x="10" y="32" width="5" height="5" fill="#7a5230"/><rect x="20" y="42" width="5" height="5" fill="#5e3d20"/>
          <rect x="40" y="34" width="5" height="5" fill="#57391c"/><rect x="50" y="30" width="4" height="4" fill="#7a5230"/>
          <rect x="44" y="46" width="5" height="5" fill="#7a5230"/>
        </g>`),
      texture(g, w, h) {
        const cols = ['#866043', '#79553a', '#93694a', '#6c4b33', '#8d6447'];
        const px = 8;
        for (let y = 0; y < h; y += px) for (let x = 0; x < w; x += px) {
          g.fillStyle = cols[(Math.random() * cols.length) | 0]; g.fillRect(x, y, px, px);
        }
      },
      fx: { shape: 'square', dir: 'up', count: 18, colors: ['#b5ff3a', '#7cfc00', '#e6ff70'], size: [3, 6], speed: [14, 28], glow: true, stepped: true }
    },
    {
      id: 'fn', name: 'Fortnite', match: ['fortnite'],
      accent: ['#ffe14d', '#3a7bff'],
      // odznaka-gwiazda z błyskawicą
      emblem: svg(100, 100, `
        <g class="em-wobble">
          <path d="M50 4 L61 30 L90 26 L70 48 L88 72 L60 68 L50 96 L40 68 L12 72 L30 48 L10 26 L39 30 Z" fill="#ffe14d" stroke="#1a1f5c" stroke-width="5" stroke-linejoin="round"/>
          <path d="M55 22 L38 54 L50 54 L44 80 L64 44 L52 44 Z" fill="#fff" stroke="#1a1f5c" stroke-width="3.5" stroke-linejoin="round"/>
        </g>`),
      fx: { shape: 'star', dir: 'float', count: 14, colors: ['#ffffff', '#ffe14d', '#9fd0ff'], size: [4, 9], speed: [4, 10], twinkle: true }
    },
    {
      id: 'lol', name: 'League of Legends', match: ['league of legends'],
      accent: ['#c8aa6e', '#0ac8b9'],
      // kryształ hextech w złotej oprawie
      emblem: svg(80, 100, `
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdfafa"/><stop offset=".5" stop-color="#0ac8b9"/><stop offset="1" stop-color="#005a82"/></linearGradient>
          <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0e6d2"/><stop offset=".5" stop-color="#c8aa6e"/><stop offset="1" stop-color="#785a28"/></linearGradient>
        </defs>
        <ellipse cx="40" cy="52" rx="34" ry="40" fill="#0ac8b9" opacity=".22" class="em-pulse"/>
        <path d="M40 4 L68 40 L40 96 L12 40 Z" fill="none" stroke="url(#lg2)" stroke-width="4"/>
        <path d="M40 16 L58 40 L40 82 L22 40 Z" fill="url(#lg1)"/>
        <path d="M40 16 L58 40 L40 46 L22 40 Z" fill="#fff" opacity=".45"/>
        <path d="M6 40 L18 40 M62 40 L74 40" stroke="url(#lg2)" stroke-width="3"/>`),
      fx: { shape: 'dot', dir: 'float', count: 22, colors: ['#0ac8b9', '#cdfafa', '#0397ab'], size: [1.5, 3.5], speed: [5, 12], glow: true, twinkle: true }
    },
    {
      id: 'val', name: 'VALORANT', match: ['valorant'],
      accent: ['#ff4655', '#ece8e1'],
      // ostre odłamki
      emblem: svg(90, 70, `
        <g class="em-float">
          <path d="M6 64 L34 6 L44 6 L22 64 Z" fill="#ff4655"/>
          <path d="M30 64 L52 18 L62 18 L46 64 Z" fill="#ece8e1"/>
          <path d="M54 64 L70 30 L80 30 L70 64 Z" fill="#ff4655" opacity=".8"/>
        </g>`),
      fx: { shape: 'tri', dir: 'float', count: 10, colors: ['#ff4655', '#ece8e1'], size: [4, 8], speed: [6, 14] }
    },
    {
      id: 'cs', name: 'Counter-Strike 2', match: ['counter-strike', 'cs2', 'cs:go'],
      accent: ['#f5a623', '#5d79ae'],
      // celownik z radarem
      emblem: svg(100, 100, `
        <defs><linearGradient id="csg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f5a623" stop-opacity="0"/><stop offset="1" stop-color="#f5a623" stop-opacity=".55"/></linearGradient></defs>
        <circle cx="50" cy="50" r="44" fill="#11161c" stroke="#f5a623" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#f5a623" stroke-opacity=".35"/>
        <circle cx="50" cy="50" r="15" fill="none" stroke="#f5a623" stroke-opacity=".35"/>
        <g class="em-spin-fast"><path d="M50 50 L50 6 A44 44 0 0 1 88 28 Z" fill="url(#csg)"/></g>
        <path d="M50 14 L50 38 M50 62 L50 86 M14 50 L38 50 M62 50 L86 50" stroke="#fff" stroke-width="3"/>
        <circle cx="68" cy="34" r="3.5" fill="#ff5148" class="em-blip"/>`),
      fx: { shape: 'dot', dir: 'float', count: 16, colors: ['#9aa5b1', '#c9d1d9'], size: [0.8, 1.8], speed: [3, 8] }
    },
    {
      id: 'gta', name: 'Grand Theft Auto V', match: ['grand theft auto', 'gta'],
      accent: ['#ffb347', '#72d572'],
      // pięć gwiazdek „poszukiwany”
      emblem: svg(170, 34, [0, 1, 2, 3, 4].map(i =>
        `<path class="em-star em-star-${i}" transform="translate(${i * 34} 0)" d="M17 2 L21.5 12 L32 12.6 L24 19.5 L26.6 30 L17 24.4 L7.4 30 L10 19.5 L2 12.6 L12.5 12 Z" fill="#fff" stroke="#111" stroke-width="2.4" stroke-linejoin="round"/>`).join('')),
      fx: null
    },
    {
      id: 'cp', name: 'Cyberpunk 2077', match: ['cyberpunk'],
      accent: ['#fcee0a', '#00f0ff'],
      // chip / obwód
      emblem: svg(90, 90, `
        <g class="em-float">
          <path d="M20 8 L70 8 L82 20 L82 70 L70 82 L20 82 L8 70 L8 20 Z" fill="#0b0f14" stroke="#00f0ff" stroke-width="3"/>
          <rect x="28" y="28" width="34" height="34" fill="#fcee0a"/>
          <rect x="35" y="35" width="20" height="20" fill="#0b0f14"/>
          <path d="M45 8 V28 M45 62 V82 M8 45 H28 M62 45 H82 M20 20 L28 28 M70 70 L62 62" stroke="#00f0ff" stroke-width="2.5"/>
          <rect x="42" y="42" width="6" height="6" fill="#ff003c" class="em-blip"/>
        </g>`),
      fx: { shape: 'rect', dir: 'float', count: 12, colors: ['#00f0ff', '#fcee0a', '#ff003c'], size: [2, 10], speed: [8, 20] }
    }
  ];

  // ------------------------------------------------------------ cząsteczki
  const FX = {
    canvas: null, ctx: null, cfg: null, parts: [], raf: 0, last: 0, w: 0, h: 0, dpr: 1,
    attach(canvas) {
      this.canvas = canvas; this.ctx = canvas.getContext('2d');
      new ResizeObserver(() => this.resize()).observe(canvas);
    },
    resize() {
      if (!this.canvas) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = this.canvas.clientWidth; this.h = this.canvas.clientHeight;
      this.canvas.width = Math.round(this.w * this.dpr); this.canvas.height = Math.round(this.h * this.dpr);
      if (this.cfg) this.seed();
    },
    set(cfg) {
      if (cfg === this.cfg) return;
      this.cfg = cfg;
      cancelAnimationFrame(this.raf);
      if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (!cfg || !this.canvas) return;
      this.resize();
      this.last = performance.now();
      const loop = t => { this.step(Math.min(0.05, (t - this.last) / 1000)); this.last = t; this.raf = requestAnimationFrame(loop); };
      this.raf = requestAnimationFrame(loop);
    },
    rnd: (a, b) => a + Math.random() * (b - a),
    spawn(initial) {
      const c = this.cfg, w = this.w, h = this.h;
      const p = {
        x: this.rnd(0, w), y: initial ? this.rnd(0, h) : (c.dir === 'up' ? h + 10 : c.dir === 'down' ? -10 : this.rnd(0, h)),
        s: this.rnd(c.size[0], c.size[1]), v: this.rnd(c.speed[0], c.speed[1]),
        col: c.colors[(Math.random() * c.colors.length) | 0],
        ph: Math.random() * Math.PI * 2, drift: this.rnd(-1, 1), age: 0, life: this.rnd(3, 7), rot: Math.random() * Math.PI
      };
      return p;
    },
    seed() { this.parts = Array.from({ length: this.cfg.count }, () => this.spawn(true)); },
    step(dt) {
      const c = this.cfg, g = this.ctx, d = this.dpr;
      if (!c || !g) return;
      g.setTransform(d, 0, 0, d, 0, 0);
      g.clearRect(0, 0, this.w, this.h);
      g.globalCompositeOperation = c.glow ? 'lighter' : 'source-over';
      for (let i = 0; i < this.parts.length; i++) {
        const p = this.parts[i];
        p.age += dt; p.ph += dt * 2;
        if (c.dir === 'up') { p.y -= p.v * dt; p.x += Math.sin(p.ph) * 8 * dt + p.drift * 4 * dt; }
        else if (c.dir === 'down') { p.y += p.v * dt; p.x += Math.sin(p.ph) * 6 * dt; }
        else { p.x += Math.cos(p.ph * .5) * p.v * dt * p.drift; p.y += Math.sin(p.ph * .7) * p.v * dt * .6; }
        // zanikanie przy krawędziach i z wiekiem (dla „float”)
        let a = 1;
        if (c.dir === 'float') a = Math.min(1, p.age / 1, Math.max(0, (p.life - p.age) / 1));
        else a = Math.min(1, Math.max(0, p.y / (this.h * .35)), Math.max(0, (this.h - p.y) / 30 + .3));
        if (c.twinkle) a *= .55 + .45 * Math.sin(p.ph * 2.2);
        const dead = c.dir === 'float' ? p.age > p.life : (p.y < -12 || p.y > this.h + 12);
        if (dead) { this.parts[i] = this.spawn(false); continue; }
        g.globalAlpha = Math.max(0, a);
        g.fillStyle = p.col;
        let x = p.x, y = p.y;
        if (c.stepped) { x = Math.round(x / 3) * 3; y = Math.round(y / 3) * 3; }
        if (c.shape === 'dot') {
          if (c.glow) { g.globalAlpha = Math.max(0, a * .35); g.beginPath(); g.arc(x, y, p.s * 3, 0, 7); g.fill(); g.globalAlpha = Math.max(0, a); }
          g.beginPath(); g.arc(x, y, p.s, 0, 7); g.fill();
        } else if (c.shape === 'square') {
          if (c.glow) { g.globalAlpha = Math.max(0, a * .3); g.fillRect(x - p.s, y - p.s, p.s * 3, p.s * 3); g.globalAlpha = Math.max(0, a); }
          g.fillRect(x, y, p.s, p.s);
        } else if (c.shape === 'star') {
          const r = p.s; g.beginPath();
          g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r);
          g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill();
        } else if (c.shape === 'tri') {
          p.rot += dt * .6; g.save(); g.translate(x, y); g.rotate(p.rot);
          g.beginPath(); g.moveTo(0, -p.s); g.lineTo(p.s * .8, p.s * .7); g.lineTo(-p.s * .8, p.s * .7); g.fill(); g.restore();
        } else if (c.shape === 'rect') {
          g.fillRect(x, y, p.s, Math.max(1.5, p.s / 4));
        }
      }
      g.globalAlpha = 1;
    }
  };

  function texture(theme) {
    if (!theme || !theme.texture) return '';
    if (theme._tex) return theme._tex;
    const c = document.createElement('canvas'); c.width = 128; c.height = 128;
    theme.texture(c.getContext('2d'), 128, 128);
    theme._tex = `url(${c.toDataURL()})`;
    return theme._tex;
  }

  function find(name) {
    if (!name) return null;
    const n = name.toLowerCase();
    return THEMES.find(t => t.match.some(m => (m.length <= 4 ? new RegExp(`(^|[^a-z0-9])${m}([^a-z0-9]|$)`).test(n) : n.includes(m)))) || null;
  }

  window.OverlayGameThemes = { list: THEMES, find, byId: id => THEMES.find(t => t.id === id) || null, FX, texture };
})();
