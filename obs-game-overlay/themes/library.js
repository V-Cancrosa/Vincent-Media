/*
  Motywy gier z biblioteki Steam (Vincent). Grafika narysowana od zera, bez logotypów i grafik z gier – CC0.
  Pola jak w games.js. Style w library.css.
*/
(function () {
  const GT = window.OverlayGameThemes;
  if (!GT) return;
  const svg = (w, h, body, cls = '') =>
    `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">${body}</svg>`;

  const THEMES = [
    {
      id: 'tal', name: 'Talisman', match: ['talisman'],
      accent: ['#c8962e', '#7a1a12'],
      // amulet z koroną i rubinem na złotym łańcuszku
      emblem: svg(90, 110, `
        <path d="M18 6 Q45 34 72 6" fill="none" stroke="#c8962e" stroke-width="3" stroke-dasharray="4 3"/>
        <g class="em-swing">
          <path d="M28 34 L33 22 L39 30 L45 18 L51 30 L57 22 L62 34 Z" fill="#e2b84e" stroke="#5a3a10" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="45" cy="64" r="28" fill="#e2b84e" stroke="#5a3a10" stroke-width="3"/>
          <circle cx="45" cy="64" r="21" fill="none" stroke="#8a6420" stroke-width="2" stroke-dasharray="2 4"/>
          <path d="M45 48 L56 64 L45 80 L34 64 Z" fill="#b3201a" stroke="#5a0f0a" stroke-width="2"/>
          <path d="M45 48 L50 60 L45 64 L40 60 Z" fill="#ff8a7a" opacity=".7" class="em-pulse"/>
        </g>`),
      fx: { shape: 'dot', dir: 'float', count: 18, colors: ['#ffd77a', '#e2b84e', '#fff1c1'], size: [1, 2.4], speed: [4, 9], glow: true, twinkle: true },
      variant: n => (/5th|5\.|piąt/.test(n) ? 'tal5' : 'tal4'),
      variants: { tal4: { label: 'TALISMAN · 4. EDYCJA' }, tal5: { label: 'TALISMAN · 5. EDYCJA', accent: ['#d9a441', '#2f5d8a'] } }
    },
    {
      id: 'pal', name: 'Palworld', match: ['palworld'],
      accent: ['#2fa8ff', '#7ed957'],
      // okrągły, puchaty stworek, który podskakuje
      emblem: svg(100, 100, `
        <g class="em-hop">
          <ellipse cx="50" cy="92" rx="26" ry="5" fill="#000" opacity=".18"/>
          <path d="M28 30 Q24 8 38 20 Z M72 30 Q76 8 62 20 Z" fill="#ffd36b" stroke="#2b3a55" stroke-width="3" stroke-linejoin="round"/>
          <circle cx="50" cy="56" r="32" fill="#ffe7a3" stroke="#2b3a55" stroke-width="3.5"/>
          <path d="M26 46 q6 -6 12 0 M62 46 q6 -6 12 0" fill="none" stroke="#2b3a55" stroke-width="2"/>
          <circle cx="40" cy="56" r="5" fill="#2b3a55"/><circle cx="60" cy="56" r="5" fill="#2b3a55"/>
          <circle cx="41.5" cy="54" r="1.6" fill="#fff"/><circle cx="61.5" cy="54" r="1.6" fill="#fff"/>
          <path d="M45 66 q5 5 10 0" fill="none" stroke="#2b3a55" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="32" cy="66" r="4" fill="#ff9aa2" opacity=".7"/><circle cx="68" cy="66" r="4" fill="#ff9aa2" opacity=".7"/>
        </g>`),
      fx: { shape: 'star', dir: 'float', count: 12, colors: ['#ffffff', '#ffe066', '#9fe3ff'], size: [4, 8], speed: [4, 9], twinkle: true }
    },
    {
      id: 'me', name: 'Mass Effect', match: ['mass effect'],
      accent: ['#ff8a1c', '#4fb7ff'],
      // pierścień przekaźnika z niebieskim rdzeniem
      emblem: svg(110, 110, `
        <defs><radialGradient id="meg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e6f6ff"/><stop offset=".4" stop-color="#4fb7ff"/><stop offset="1" stop-color="#4fb7ff" stop-opacity="0"/></radialGradient></defs>
        <circle cx="55" cy="55" r="34" fill="url(#meg)" class="em-pulse"/>
        <g class="em-spin-me"><ellipse cx="55" cy="55" rx="46" ry="16" fill="none" stroke="#9fd4ff" stroke-width="3"/><ellipse cx="55" cy="55" rx="40" ry="12" fill="none" stroke="#4fb7ff" stroke-width="1.5" stroke-dasharray="6 6"/></g>
        <path d="M30 98 L50 40 L56 40 L44 98 Z M80 98 L60 40 L54 40 L66 98 Z" fill="#3a4250" stroke="#11151c" stroke-width="2"/>
        <path d="M24 100 H86" stroke="#ff8a1c" stroke-width="3"/>`),
      fx: { shape: 'dot', dir: 'float', count: 18, colors: ['#4fb7ff', '#bfe6ff', '#ff8a1c'], size: [1, 2.4], speed: [4, 10], glow: true },
      // Legendary Edition startuje launcherem, potem przechodzi w jedną z części – wykrywacz podaje, która to
      variant(n) {
        if (n.includes('andromeda')) return 'mea';
        const m = n.match(/mass effect[^0-9a-z]*([123])\b/);
        if (m) return 'me' + m[1];
        if (n.includes('legendary')) return 'mele';
        return /^mass effect\W*$/.test(n.trim()) ? 'me1' : '';
      },
      variants: {
        mele: { label: 'WYBÓR MISJI', accent: ['#e8eef5', '#4fb7ff'] },
        me1: { label: 'SR-1 // SOJUSZ', accent: ['#4fb7ff', '#e8f4ff'], fx: { colors: ['#4fb7ff', '#bfe6ff', '#ffffff'] } },
        me2: { label: 'SR-2 // CERBER', accent: ['#ff9a1c', '#ffd27a'], fx: { colors: ['#ff9a1c', '#ffd27a', '#fff1d6'], count: 22 },
          emblem: svg(110, 110, `
            <g class="em-spin-me" fill="none" stroke="#ffb347" stroke-width="3">
              <path d="M55 8 L95 31 L95 79 L55 102 L15 79 L15 31 Z"/>
              <path d="M55 22 L83 38 L83 72 L55 88 L27 72 L27 38 Z" stroke-width="1.5" stroke-dasharray="5 4" opacity=".8"/>
            </g>
            <circle cx="55" cy="55" r="18" fill="#ff9a1c" class="em-pulse"/><circle cx="55" cy="55" r="8" fill="#fff1d6"/>`) },
        me3: { label: 'GOTOWOŚĆ GALAKTYKI', accent: ['#ff3b30', '#ffb0a8'], fx: { colors: ['#ff3b30', '#ff8a7a', '#ffd0c8'], dir: 'up', speed: [8, 20] },
          emblem: svg(110, 110, `
            <g class="em-pulse"><path d="M55 14 C70 14 80 26 80 40 L92 98 L74 70 L66 102 L55 74 L44 102 L36 70 L18 98 L30 40 C30 26 40 14 55 14 Z" fill="#1a0c0c" stroke="#ff3b30" stroke-width="2.5"/></g>
            <path d="M44 40 H66" stroke="#ff3b30" stroke-width="4" stroke-linecap="round" class="me3-eye"/>`) },
        mea: { label: 'INICJATYWA // PIONIER', accent: ['#2ad4c4', '#8a6cff'], fx: { colors: ['#2ad4c4', '#8a6cff', '#e6fffb'] } }
      }
    },
    {
      id: 'wf', name: 'Warframe', match: ['warframe'],
      accent: ['#4fd1ff', '#d4af6a'],
      // kula energii w złotej oprawie z trzema ostrzami
      emblem: svg(110, 110, `
        <defs><radialGradient id="wfg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#4fd1ff"/><stop offset="1" stop-color="#4fd1ff" stop-opacity="0"/></radialGradient></defs>
        <circle cx="55" cy="55" r="30" fill="url(#wfg)" class="em-pulse"/>
        <g class="em-spin" fill="#d4af6a" stroke="#6b5426" stroke-width="1.5">
          <path d="M55 6 C66 26 62 40 55 44 C48 40 44 26 55 6 Z"/>
          <path d="M97 79 C75 80 65 70 64 61 C70 56 84 54 97 79 Z"/>
          <path d="M13 79 C26 54 40 56 46 61 C45 70 35 80 13 79 Z"/>
        </g>
        <circle cx="55" cy="55" r="9" fill="#e9fbff"/>`),
      fx: { shape: 'dot', dir: 'up', count: 26, colors: ['#4fd1ff', '#a8ecff', '#ffffff'], size: [1, 2.6], speed: [10, 26], glow: true, twinkle: true }
    },
    {
      id: 'dl', name: 'Deadlock', match: ['deadlock'],
      accent: ['#d8c99b', '#2f6d63'],
      // wachlarz art déco z dziurką od klucza
      emblem: svg(110, 80, `
        <g fill="none" stroke="#d8c99b" stroke-width="2">
          <path d="M10 76 A45 45 0 0 1 100 76"/>
          <path d="M22 76 A33 33 0 0 1 88 76"/>
          ${[0, 1, 2, 3, 4, 5, 6].map(i => { const a = Math.PI * (i + 1) / 8; return `<path d="M55 76 L${(55 - Math.cos(a) * 45).toFixed(1)} ${(76 - Math.sin(a) * 45).toFixed(1)}"/>`; }).join('')}
        </g>
        <circle cx="55" cy="76" r="20" fill="#16302c" stroke="#d8c99b" stroke-width="2.5"/>
        <circle cx="55" cy="70" r="5" fill="#d8c99b"/><path d="M52 72 L50 86 H60 L58 72 Z" fill="#d8c99b"/>`, 'dl-fan'),
      fx: { shape: 'dot', dir: 'float', count: 14, colors: ['#d8c99b', '#efe6c8'], size: [0.8, 1.8], speed: [3, 7] }
    },
    {
      id: 'dd', name: 'Darkest Dungeon', match: ['darkest dungeon'],
      accent: ['#c4302b', '#e8a33d'],
      // pochodnia na ściennym uchwycie z żywym płomieniem
      emblem: svg(70, 120, `
        <g class="dd-flame">
          <path d="M35 6 C46 22 52 30 46 42 C44 48 26 48 24 42 C18 30 26 20 35 6 Z" fill="#e8a33d"/>
          <path d="M35 18 C41 28 43 34 40 40 C38 44 32 44 30 40 C27 34 30 28 35 18 Z" fill="#ffe08a"/>
        </g>
        <path d="M24 46 H46 L42 58 H28 Z" fill="#3a2a22" stroke="#120c0a" stroke-width="2"/>
        <rect x="31" y="58" width="8" height="40" fill="#5a3a26" stroke="#120c0a" stroke-width="2"/>
        <path d="M18 98 H52 L48 106 H22 Z M30 106 H40 V116 H30 Z" fill="#2a2a2e" stroke="#0a0a0c" stroke-width="2"/>`),
      fx: { shape: 'dot', dir: 'up', count: 26, colors: ['#ffb347', '#ff7a2f', '#ffe08a'], size: [1, 2.6], speed: [16, 34], glow: true, twinkle: true },
      variant: n => (/darkest dungeon\W*(ii|2)\b/.test(n) ? 'dd2' : 'dd1'),
      variants: {
        dd1: { label: 'HAMLET · LOCHY RODU' },
        dd2: { label: 'DYLIŻANS RUSZA', accent: ['#e86a2d', '#9fb3c2'], fx: { colors: ['#ff9a4a', '#e86a2d', '#cfd8de'], dir: 'left', speed: [30, 60] } }
      }
    },
    {
      id: 'hk', name: 'Hollow Knight', match: ['hollow knight', 'silksong'],
      accent: ['#e8eef7', '#c72c3b'],
      // igła z czerwoną nicią, która się rozwija
      emblem: svg(120, 90, `
        <path class="hk-thread" d="M18 70 C40 20 60 90 80 40 S110 30 112 12" fill="none" stroke="#c72c3b" stroke-width="2.5" stroke-linecap="round"/>
        <g transform="rotate(-38 60 45)">
          <path d="M10 45 L96 42 L104 45 L96 48 Z" fill="#e8eef7" stroke="#1a2236" stroke-width="2" stroke-linejoin="round"/>
          <ellipse cx="18" cy="45" rx="6" ry="3" fill="none" stroke="#1a2236" stroke-width="2"/>
        </g>`, 'hk-needle'),
      fx: { shape: 'dot', dir: 'float', count: 20, colors: ['#e8eef7', '#b9c8e6', '#ffffff'], size: [1, 2.4], speed: [3, 8], glow: true, twinkle: true },
      variant: n => (n.includes('silksong') ? 'silk' : 'hk1'),
      variants: {
        hk1: { label: 'KRÓLESTWO W GŁĘBI', accent: ['#e8eef7', '#6f9bff'], fx: { colors: ['#e8eef7', '#9cc2ff', '#ffffff'] } },
        silk: { label: 'PIEŚŃ JEDWABIU', accent: ['#f3ece4', '#c72c3b'], fx: { colors: ['#f3ece4', '#ff8a8a', '#c72c3b'], dir: 'up', speed: [8, 18] } }
      }
    },
    // ---------------------------------------------------------------- Command & Conquer
    {
      id: 'ra', name: 'C&C: Red Alert', match: ['red alert'],
      accent: ['#e0241b', '#f2d7a8'], label: 'RAPORT Z FRONTU',
      // wieża Tesli z wyładowaniem
      emblem: svg(90, 120, `
        <path class="ra-bolt" d="M45 18 L36 6 M45 18 L56 4 M45 18 L28 14 M45 18 L64 12" stroke="#bfe9ff" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="45" cy="20" r="11" fill="#9ed8ff" class="em-pulse"/><circle cx="45" cy="20" r="6" fill="#ffffff"/>
        ${[0, 1, 2, 3].map(i => `<ellipse cx="45" cy="${40 + i * 14}" rx="${12 + i * 3}" ry="4" fill="#5a1410" stroke="#1a0606" stroke-width="2"/>`).join('')}
        <path d="M34 34 L28 108 H62 L56 34 Z" fill="#2a2a2e" stroke="#0a0a0c" stroke-width="2" opacity=".85"/>
        <path d="M20 108 H70 L74 116 H16 Z" fill="#e0241b" stroke="#1a0606" stroke-width="2"/>`),
      fx: { shape: 'rect', dir: 'left', count: 20, colors: ['#bfe9ff', '#ffffff', '#e0241b'], size: [6, 14], speed: [40, 90], glow: true },
      // RA1 / Remastered, RA2 + Yuri's Revenge, RA3 + Uprising
      variant(n) {
        if (n.includes('yuri')) return 'yr';
        if (/red alert\W*3|\bra3\b/.test(n)) return n.includes('uprising') ? 'up' : 'ra3';
        if (/red alert\W*2|\bra2\b/.test(n)) return 'ra2';
        if (n.includes('remaster')) return 'rem';
        return 'ra1';
      },
      variants: {
        ra1: { label: 'RAPORT Z FRONTU' },
        rem: { label: 'REMASTER · RAPORT Z FRONTU' },
        ra2: { label: 'ZIMNA WOJNA 2.0', accent: ['#d01c1c', '#3a7bd5'], fx: { colors: ['#bfe9ff', '#3a7bd5', '#d01c1c'] } },
        yr: { label: 'KONTROLA UMYSŁÓW', accent: ['#a43cd8', '#59e05a'], fx: { colors: ['#c98cff', '#59e05a', '#a43cd8'], shape: 'dot', dir: 'float', speed: [6, 14], glow: true, twinkle: true } },
        ra3: { label: 'TRZY STRONY · JEDNA WOJNA', accent: ['#ff2d2d', '#ffd23f'], fx: { colors: ['#ffd23f', '#ff2d2d', '#bfe9ff'] } },
        up: { label: 'POWSTANIE', accent: ['#ff2d2d', '#4fb7ff'] }
      }
    },
    {
      id: 'cnc', name: 'C&C: Tiberium', match: ['tiberian', 'tiberium', 'command & conquer', 'command and conquer'],
      accent: ['#5be35b', '#e8c547'], label: 'EVA // RAPORT',
      // kryształy tyberium
      emblem: svg(110, 100, `
        <g class="em-pulse">
          <path d="M30 96 L22 46 L36 22 L46 52 L40 96 Z" fill="#3ccf3c" stroke="#0d3a0d" stroke-width="2"/>
          <path d="M44 96 L48 30 L60 6 L72 34 L66 96 Z" fill="#5be35b" stroke="#0d3a0d" stroke-width="2"/>
          <path d="M66 96 L74 52 L88 36 L92 70 L82 96 Z" fill="#2fb52f" stroke="#0d3a0d" stroke-width="2"/>
          <path d="M52 28 L60 10 L64 32 Z M28 44 L36 26 L38 46 Z" fill="#c9ffc9" opacity=".8"/>
        </g>
        <path d="M10 96 H100" stroke="#e8c547" stroke-width="3"/>`),
      fx: { shape: 'tri', dir: 'up', count: 22, colors: ['#5be35b', '#a8ff8a', '#e8c547'], size: [3, 6], speed: [8, 20], glow: true, twinkle: true },
      variant(n) {
        if (/kane'?s wrath/.test(n)) return 'kw';
        if (/tiberium wars|(c&c|conquer)\W*3\b/.test(n)) return 'tw';
        if (n.includes('firestorm')) return 'fs';
        if (n.includes('tiberian sun')) return 'ts';
        if (/tiberian twilight|(c&c|conquer)\W*4\b/.test(n)) return 'c4';
        if (n.includes('remaster')) return 'rem';
        return 'td';
      },
      variants: {
        td: { label: 'EVA // RAPORT' },
        rem: { label: 'REMASTER · EVA // RAPORT' },
        ts: { label: 'TIBERIAN SUN', accent: ['#3fd0c8', '#5be35b'], fx: { colors: ['#3fd0c8', '#a8fff4', '#5be35b'] } },
        fs: { label: 'FIRESTORM', accent: ['#ff7a2f', '#3fd0c8'], fx: { colors: ['#ff7a2f', '#ffd08a', '#3fd0c8'] } },
        tw: { label: 'WOJNY O TYBERIUM', accent: ['#7ed321', '#ffc400'] },
        kw: { label: 'GNIEW KANE’A', accent: ['#ff3030', '#7ed321'], fx: { colors: ['#ff3030', '#ff8a8a', '#7ed321'] } },
        c4: { label: 'ZMIERZCH TYBERIUM', accent: ['#9cff57', '#4fb7ff'] }
      }
    },
    {
      id: 'gen', name: 'C&C: Generals', match: ['generals', 'zero hour'],
      accent: ['#d9b56b', '#6f7d4a'], label: 'SZTAB // NA ŻYWO',
      // obrotowy radar + gwiazdki stopnia
      emblem: svg(110, 100, `
        <circle cx="55" cy="55" r="40" fill="#1d2414" stroke="#6f7d4a" stroke-width="3"/>
        <circle cx="55" cy="55" r="26" fill="none" stroke="#6f7d4a" stroke-width="1.5" stroke-dasharray="3 4"/>
        <g class="em-spin"><path d="M55 55 L55 15 A40 40 0 0 1 90 35 Z" fill="#9fd06b" opacity=".45"/></g>
        <circle cx="70" cy="40" r="3" fill="#e0241b" class="em-pulse"/>
        ${[0, 1, 2].map(i => `<path transform="translate(${34 + i * 21} 4) scale(.5)" d="M10 0 L13 7 L20 7 L14 12 L16 20 L10 15 L4 20 L6 12 L0 7 L7 7 Z" fill="#d9b56b"/>`).join('')}`),
      fx: { shape: 'dot', dir: 'left', count: 26, colors: ['#d9b56b', '#c8a878', '#9a8a6a'], size: [0.8, 2.2], speed: [30, 70] },
      variant: n => (n.includes('zero hour') ? 'zh' : 'gen'),
      variants: { gen: { label: 'SZTAB // NA ŻYWO' }, zh: { label: 'GODZINA ZERO', accent: ['#e0a43a', '#7d8b4a'] } }
    },

    // ---------------------------------------------------------------- Visual Novel (SoulCreek i inne gry na Ren'Py – wykrywacz rozpoznaje silnik)
    {
      id: 'vn', name: 'Visual Novel', match: ['soulcreek', 'visual novel'], label: 'CZYTAMY',
      accent: ['#8fd3ff', '#f2a7c3'],
      // okno dialogowe z plakietką imienia i mrugającą strzałką „dalej”
      emblem: svg(120, 90, `
        <rect x="6" y="30" width="108" height="52" rx="8" fill="#0d1220" fill-opacity=".92" stroke="#8fd3ff" stroke-width="2.5"/>
        <rect x="14" y="18" width="48" height="20" rx="5" fill="#f2a7c3" stroke="#0d1220" stroke-width="2"/>
        <path d="M22 28 H54" stroke="#0d1220" stroke-width="3" stroke-linecap="round"/>
        <path d="M20 48 H96 M20 60 H80" stroke="#cfe9ff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
        <path class="vn-next" d="M98 68 L106 68 L102 75 Z" fill="#8fd3ff"/>`),
      fx: { shape: 'dot', dir: 'float', count: 16, colors: ['#8fd3ff', '#f2a7c3', '#ffffff'], size: [1, 2.2], speed: [3, 7], glow: true, twinkle: true },
      variant: n => (n.includes('soulcreek') ? 'sc' : ''),
      variants: { sc: { label: 'BLACKRUNNER // CZYTAMY', accent: ['#6fe0ff', '#ff6a3d'], fx: { colors: ['#6fe0ff', '#ff6a3d', '#cfe9ff'], dir: 'up', speed: [6, 14] } } }
    },

    // ---------------------------------------------------------------- Blender i modelowanie 3D (nie gra – „Teraz tworzę”)
    {
      id: 'mk', name: 'Blender / 3D', match: ['blender', 'zbrush', 'substance painter', 'substance 3d', 'houdini', 'maya', 'cinema 4d', '3ds max'], label: 'TERAZ TWORZĘ', kind: 'make',
      accent: ['#f5792a', '#4f8fe6'],
      // obracająca się siatka (icosfera) z zaznaczonymi wierzchołkami
      emblem: svg(110, 110, `
        <g class="mk-spin" fill="none" stroke="#9cc0f0" stroke-width="1.6" stroke-linejoin="round">
          <path d="M55 10 L92 32 L92 78 L55 100 L18 78 L18 32 Z"/>
          <path d="M55 10 L55 55 M92 32 L55 55 M18 32 L55 55 M55 100 L55 55 M92 78 L55 55 M18 78 L55 55" opacity=".7"/>
          <path d="M18 32 L92 32 M18 78 L92 78" stroke-dasharray="3 4" opacity=".5"/>
        </g>
        ${[[55, 10], [92, 32], [92, 78], [55, 100], [18, 78], [18, 32]].map(([x, y]) => `<rect x="${x - 3.5}" y="${y - 3.5}" width="7" height="7" fill="#f5792a" stroke="#1a1a1a"/>`).join('')}
        <circle cx="55" cy="55" r="6" fill="#4f8fe6" stroke="#fff" stroke-width="2" class="em-pulse"/>`),
      fx: { shape: 'square', dir: 'float', count: 18, colors: ['#f5792a', '#4f8fe6', '#e6e6e6'], size: [2, 4], speed: [4, 9], glow: true }
    }
  ];

  // motywy gier, których nie ma w bibliotece, zostają do wykrywania, ale nie zaśmiecają listy w panelu
  const NOT_IN_LIBRARY = ['elden', 'mc', 'fn', 'lol', 'val', 'gta'];
  for (const t of GT.list) if (NOT_IN_LIBRARY.includes(t.id)) t.hidden = true;
  for (const t of THEMES) { t.group = 'game'; GT.list.push(t); }
})();
