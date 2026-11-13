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
      fx: { shape: 'dot', dir: 'float', count: 18, colors: ['#ffd77a', '#e2b84e', '#fff1c1'], size: [1, 2.4], speed: [4, 9], glow: true, twinkle: true }
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
      fx: { shape: 'dot', dir: 'float', count: 18, colors: ['#4fb7ff', '#bfe6ff', '#ff8a1c'], size: [1, 2.4], speed: [4, 10], glow: true }
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
      fx: { shape: 'dot', dir: 'up', count: 26, colors: ['#ffb347', '#ff7a2f', '#ffe08a'], size: [1, 2.6], speed: [16, 34], glow: true, twinkle: true }
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
      fx: { shape: 'dot', dir: 'float', count: 20, colors: ['#e8eef7', '#b9c8e6', '#ffffff'], size: [1, 2.4], speed: [3, 8], glow: true, twinkle: true }
    }
  ];

  // motywy gier, których nie ma w bibliotece, zostają do wykrywania, ale nie zaśmiecają listy w panelu
  const NOT_IN_LIBRARY = ['elden', 'mc', 'fn', 'lol', 'val', 'gta'];
  for (const t of GT.list) if (NOT_IN_LIBRARY.includes(t.id)) t.hidden = true;
  for (const t of THEMES) { t.group = 'game'; GT.list.push(t); }
})();
