/*
  Motywy postaci (fursony) dla nakładki „Teraz gram”.
  Kolory, czcionki i motywy pochodzą ze stron postaci w repozytorium V-Cancrosa/V-Cancrosa.

  Portrety (themes/fursona/*.webp) to kadry z ilustracji – NIE są na licencji CC0, należą do autorów
  (patrz themes/fursona/CREDITS.md). Wszystko inne (SVG, efekty) jest narysowane od zera, CC0.

  Pola jak w games.js, plus:
    group – 'fursona' (osobna grupa w panelu, nie włącza się automatycznie)
    label – domyślny napis nad nazwą gry, gdy w panelu jest zostawiony domyślny „Teraz gram”
    back  – HTML za kartą
    pop   – portret wkomponowany w kartę: dół karty go zasłania, a głowa wychodzi przed górną krawędź
    side  – po której stronie karty jest postać przy pozycji „środek” (w rogach – po stronie rogu)
    face  – w którą stronę patrzy portret; w lewym rogu postać patrzy w prawo, w prawym – w lewo (odbicie)
*/
(function () {
  const GT = window.OverlayGameThemes;
  if (!GT) return;
  const svg = (w, h, body, cls = '') =>
    `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${body}</svg>`;
  const IMG = name => `themes/fursona/${name}.webp`;


  // ---------------------------------------------------------------- Myr-35: głowa protogena 3/4 z matrycą LED
  // Kształt według arkusza protogena (Pentarch, 2021): wizjer jak pocisk zakrywający całą twarz, szara opaska
  // od czubka głowy do okrągłego portu z płetwą z tyłu policzka, obroża na szyi. Kolory i dwie pary
  // okrągłych uszu – Myr-35. Matryca: diody co 3 jednostki (~550), klatki mimiki przełączane w CSS:
  // spokój, mrugnięcie, uśmiech ^^, mówienie (fm-talk – gdy mikrofon), zakłócenie (Nanite Syndrome).
  function myrHead() {
    const VIS = 'M64 22 C90 13 126 17 142 34 C154 47 157 62 153 78 C149 92 139 102 123 108 L98 114 C86 116 75 112 71 104 C64 86 60 52 64 22 Z';
    const P = 3, cells = [];
    for (let y = 18; y <= 114; y += P) for (let x = 64; x <= 156; x += P) cells.push([x, y]);
    let test = null;
    try {
      const c = document.createElement('canvas').getContext('2d'), path = new Path2D(VIS);
      test = (x, y) => [[0, 0], [2.4, 0], [-2.4, 0], [0, 2.4], [0, -2.4]].every(([dx, dy]) => c.isPointInPath(path, x + dx, y + dy));
    } catch (e) { test = (x, y) => x > 72 && x < 150 && y > 26 && y < 106; }
    const vis = cells.filter(([x, y]) => test(x, y));
    // oczy: przyjazne owale – bliższe większe, dalsze zwężone perspektywą
    const eyes = [{ cx: 129, cy: 52, rx: 6.5, ry: 9 }, { cx: 101, cy: 50, rx: 4.6, ry: 8 }];
    const eye = (x, y, f) => eyes.some(e => {
      const dx = (x - e.cx) / e.rx, dy = (y - e.cy) / e.ry;
      if (f === 'blink') return Math.abs(y - e.cy - 1) <= 1.6 && Math.abs(dx) <= 1.15;
      if (f === 'happy') return Math.abs(dx) <= 1.2 && Math.abs(y - (e.cy + 3 - e.ry * 0.75 * (1 - Math.abs(dx) / 1.2))) <= 1.7;   // ^ ^
      return dx * dx + dy * dy <= 1;
    });
    // usta: małe „w” przy pysku; mówienie – otwarte; uśmiech – szersze „w” i rumieńce
    const W = (x, y, x0, x1, base, h) => {
      if (x < x0 || x > x1) return false;
      const t = (x - x0) / (x1 - x0), half = t < 0.5 ? t * 2 : (t - 0.5) * 2;
      return Math.abs(y - (base + h * Math.sin(half * Math.PI))) <= 1.6;
    };
    const mouth = (x, y, f) => {
      if (f === 'talk') return Math.hypot((x - 128) / 7, (y - 84) / 4.5) <= 1 && Math.hypot((x - 128) / 7, (y - 84) / 4.5) >= 0.45;
      if (f === 'happy') return W(x, y, 112, 146, 80, 5) || (Math.abs(y - 66) <= 1 && (Math.abs(x - 136) <= 4 || Math.abs(x - 108) <= 2.5));
      return W(x, y, 116, 142, 80, 4);
    };
    const dots = list => list.map(([x, y]) => `M${x} ${y}h0`).join('');
    const frame = (cls, f, mf) => `<path class="fm-f ${cls}" d="${dots(vis.filter(([x, y]) => eye(x, y, f) || mouth(x, y, mf)))}"/>`;
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const glitch = `<path class="fm-f fm-glitch" d="${dots(vis.filter(([x, y]) => (eye(x, y, 'neutral') && rnd() > 0.35) || (Math.abs(y - 64 - Math.round(rnd() * 3) * 3) <= 1 && rnd() > 0.45) || rnd() > 0.93))}"/>`;
    const FUR = '#ede6d6', FUR2 = '#d3c9b6', INK = '#0b0b0c';
    return svg(160, 130, `
      <defs><clipPath id="fmVisClip"><path d="${VIS}"/></clipPath>
        <linearGradient id="fmGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#26303f"/><stop offset=".55" stop-color="#151b25"/><stop offset="1" stop-color="#0a0d12"/></linearGradient>
        <linearGradient id="fmFur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${FUR}"/><stop offset="1" stop-color="${FUR2}"/></linearGradient></defs>
      <path d="M100 22 L106 2 L112 12 L122 4 L120 20 Z" fill="${FUR2}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M50 100 L46 128 H98 L96 104 Z" fill="${FUR2}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M72 18 L62 12 L64 21 L50 16 L54 27 L38 28 L46 37 L28 44 L39 51 L24 61 L37 66 L26 78 L41 80 L34 92 L48 92 L46 103 L60 99 L64 110 L82 106 L82 20 Z" fill="url(#fmFur)" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M40 56 l8 -3 M36 72 l8 -1 M46 86 l7 2" stroke="#a89f8e" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M40 40 L36 22 L32 4 L42 11 L46 1 L52 12 L61 7 L62 21 L70 27 L60 40 Z" fill="${FUR}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M44 34 L41 19 L47 21 L52 15 L55 26 L51 34 Z" fill="#e8a26a"/>
      <path d="M44 106 Q70 116 98 108 L98 117 Q70 125 44 115 Z" fill="#6e767d" stroke="${INK}" stroke-width="2.5"/>
      <path d="${VIS}" fill="url(#fmGlass)" stroke="${INK}" stroke-width="3"/>
      <g clip-path="url(#fmVisClip)" stroke-linecap="round">
        <path d="${dots(vis)}" stroke="#e08a3c" stroke-opacity=".12" stroke-width="1.7"/>
        <g class="fm-leds" stroke="#ffad5c" stroke-width="2.7">
          ${frame('fm-neutral', 'neutral', 'neutral')}${frame('fm-blink', 'blink', 'neutral')}${frame('fm-happy', 'happy', 'happy')}${frame('fm-talk', 'neutral', 'talk')}${glitch}
        </g>
        <path d="M84 16 C106 26 124 46 128 112" fill="none" stroke="#ffffff" stroke-opacity=".07" stroke-width="2"/>
        <path d="M72 24 C98 15 126 22 142 38" fill="none" stroke="#ffffff" stroke-opacity=".16" stroke-width="3"/>
      </g>
      <path d="M64 20 C59 44 61 72 68 96" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
      <path d="M64 20 C59 44 61 72 68 96" fill="none" stroke="#8a9097" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M60 90 L38 100 L60 108 Z" fill="#8a9097" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="68" cy="99" r="12" fill="#8a9097" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="68" cy="99" r="7.5" fill="#151b25" stroke="${INK}" stroke-width="2"/>
      <circle cx="68" cy="99" r="3" fill="#d9823f" class="fm-side"/>`, 'fm-head');
  }

  const THEMES = [
    {
      id: 'vince', side: 'l', face: 'left', name: 'Vince', group: 'fursona', match: [],
      accent: ['#e3a43f', '#ece3cf'],
      label: 'Teraz gram',
      // portret w ramce jak z planu architekta + wymiar „6′4″”
      emblem: `
        <div class="fv-frame">
          <img src="${IMG('vince')}" alt="">
          <i class="fv-c fv-c1"></i><i class="fv-c fv-c2"></i><i class="fv-c fv-c3"></i><i class="fv-c fv-c4"></i>
          <span class="fv-dim">VC—001 · 6′4″</span>
        </div>
        ${svg(400, 40, `
          <path class="fv-path" d="M0 30 H120 C170 30 180 12 230 12 H400"/>
          <path class="fv-path fv-path2" d="M0 30 H120 C170 30 180 36 230 36 H400"/>`, 'fv-dual')}`,
      fx: { shape: 'dot', dir: 'float', count: 10, colors: ['#e3a43f', '#ece3cf'], size: [0.8, 1.8], speed: [3, 7], glow: true, twinkle: true }
    },
    {
      id: 'chip', name: 'Chip', group: 'fursona', match: [], side: 'r', face: 'right',
      accent: ['#2f6bd8', '#4a2a17'],
      label: 'no co. gram',
      // polaroid z taśmą + pęknięty dzwonek, który się kołysze
      emblem: `
        <div class="fc-polaroid"><img src="${IMG('chip')}" alt=""><span>ta mina to ustawienie domyślne.</span><i class="fc-tape"></i></div>
        <div class="fc-bell">${svg(60, 70, `
          <path d="M30 2 V10" stroke="#4a2a17" stroke-width="3"/>
          <circle cx="30" cy="12" r="4" fill="none" stroke="#4a2a17" stroke-width="3"/>
          <path d="M10 52 Q10 18 30 16 Q50 18 50 52 Z" fill="#c9ccd3" stroke="#4a2a17" stroke-width="3" stroke-linejoin="round"/>
          <path d="M16 46 Q17 26 30 22" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>
          <path d="M6 52 H54" stroke="#4a2a17" stroke-width="4" stroke-linecap="round"/>
          <circle cx="30" cy="58" r="5" fill="#4a2a17"/>
          <path d="M33 22 L36 30 L32 34 L35 42" stroke="#4a2a17" stroke-width="1.6" fill="none"/>`)}</div>`,
      fx: { shape: 'star', dir: 'float', count: 9, colors: ['#3fa2ff', '#2f6bd8', '#ffffff'], size: [4, 8], speed: [3, 7], twinkle: true }
    },
    {
      id: 'ragnar', name: 'Ragnar', group: 'fursona', match: [],
      accent: ['#ff2e88', '#26c6e0'],
      label: 'Teraz gram · 128 BPM',
      side: 'r', face: 'left', pop: IMG('ragnar'),
      // korektor graficzny w rytmie 128 BPM
      emblem: `<div class="fr-eq">${Array.from({ length: 9 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>`,
      fx: { shape: 'rect', dir: 'float', count: 16, colors: ['#ff2e88', '#26c6e0', '#b4e03c', '#9b5cff'], size: [3, 9], speed: [6, 14], glow: true }
    },
    {
      id: 'toro', name: 'Toro', group: 'fursona', match: [],
      accent: ['#ffc864', '#5aa63f'],
      label: '灯籠 · teraz gram',
      side: 'l', face: 'right', pop: IMG('toro'),
      // kamienna latarnia tōrō z migoczącym światłem
      emblem: svg(70, 110, `
        <defs><radialGradient id="ftg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".5" stop-color="#ffc864" stop-opacity=".55"/><stop offset="1" stop-color="#ffc864" stop-opacity="0"/></radialGradient></defs>
        <circle cx="35" cy="44" r="34" fill="url(#ftg)" class="ft-glow"/>
        <path d="M14 30 L35 16 L56 30 Z" fill="#6e6a64" stroke="#2a2d33" stroke-width="2" stroke-linejoin="round"/>
        <path d="M33 10 h4 v7 h-4 z" fill="#6e6a64"/>
        <rect x="20" y="30" width="30" height="24" fill="#4f4b46" stroke="#2a2d33" stroke-width="2"/>
        <rect x="26" y="35" width="18" height="14" fill="#ffd77a" class="ft-flame"/>
        <path d="M16 54 H54 L50 60 H20 Z" fill="#6e6a64" stroke="#2a2d33" stroke-width="2"/>
        <rect x="29" y="60" width="12" height="30" fill="#5a5650" stroke="#2a2d33" stroke-width="2"/>
        <path d="M18 90 H52 L56 100 H14 Z" fill="#6e6a64" stroke="#2a2d33" stroke-width="2"/>`, 'ft-lantern'),
      fx: { shape: 'dot', dir: 'float', count: 16, colors: ['#e9ff8a', '#ffc864', '#c8f06a'], size: [1.4, 2.8], speed: [5, 11], glow: true, twinkle: true }
    },
    {
      id: 'myr', name: 'Myr-35', group: 'fursona', match: [], side: 'l', face: 'right',
      accent: ['#d9823f', '#ede6d6'],
      label: 'MYR-35 // ZADANIE',
      // głowa protogena w ujęciu 3/4: kremowa skorupa, dwie pary okrągłych uszu, wizjer-pysk z gęstą matrycą LED (mimika)
      emblem: myrHead(),
      fx: null
    },
    {
      id: 'zarin', name: 'Zarin', group: 'fursona', match: [],
      accent: ['#2fd46b', '#1fc7b5'],
      label: 'teraz rozbieram:',
      // płyta z kadłuba Patch: szablonowe PATCH, wydrapane „curio”, śruby + wentylator uprzęży
      emblem: `
        <div class="fz-plate">${svg(170, 74, `
          <rect x="2" y="2" width="166" height="70" rx="4" fill="#7d8186" stroke="#3a3f45" stroke-width="3"/>
          <rect x="2" y="42" width="166" height="12" fill="#5e7a5a" opacity=".9"/>
          <text x="16" y="36" font-family="'Saira Stencil One', Impact, sans-serif" font-size="30" fill="#e6e1d3" letter-spacing="3">PATCH</text>
          <text x="104" y="68" font-family="'Caveat', cursive" font-size="20" fill="#1b1f24" transform="rotate(-6 104 68)">curio</text>
          <circle cx="10" cy="10" r="3" fill="#3a3f45"/><circle cx="160" cy="10" r="3" fill="#3a3f45"/>
          <circle cx="10" cy="64" r="3" fill="#3a3f45"/><circle cx="160" cy="64" r="3" fill="#3a3f45"/>
          <path d="M120 14 l8 6 M126 12 l6 8 M60 60 l10 -2" stroke="#4a4f55" stroke-width="1.2"/>`)}</div>
        <div class="fz-fan">${svg(50, 50, `
          <circle cx="25" cy="25" r="23" fill="#1b1f24" stroke="#5a6068" stroke-width="3"/>
          <g class="fz-blades"><path d="M25 25 C22 14 26 6 32 6 C30 14 28 20 25 25 Z M25 25 C36 22 44 26 44 32 C36 30 30 28 25 25 Z M25 25 C28 36 24 44 18 44 C20 36 22 30 25 25 Z M25 25 C14 28 6 24 6 18 C14 20 20 22 25 25 Z" fill="#9aa4ad"/></g>
          <circle cx="25" cy="25" r="4" fill="#2fd46b"/>`)}</div>`,
      fx: { shape: 'dot', dir: 'left', count: 34, colors: ['#ffffff', '#cfe8f2', '#dfe5e8'], size: [0.8, 2.2], speed: [40, 90] }
    }
  ];

  for (const t of THEMES) GT.list.push(t);
})();
