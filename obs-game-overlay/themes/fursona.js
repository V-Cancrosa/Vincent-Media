/*
  Motywy postaci (fursony) dla nakładki „Teraz gram”.
  Kolory, czcionki i motywy pochodzą ze stron postaci w repozytorium V-Cancrosa/V-Cancrosa.

  Portrety (themes/fursona/*.webp) to kadry z ilustracji – NIE są na licencji CC0, należą do autorów
  (patrz themes/fursona/CREDITS.md). Wszystko inne (SVG, efekty) jest narysowane od zera, CC0.

  Pola jak w games.js, plus:
    group – 'fursona' (osobna grupa w panelu, nie włącza się automatycznie)
    label – domyślny napis nad nazwą gry, gdy w panelu jest zostawiony domyślny „Teraz gram”
    back  – HTML za kartą (np. postać wyglądająca zza panelu)
*/
(function () {
  const GT = window.OverlayGameThemes;
  if (!GT) return;
  const svg = (w, h, body, cls = '') =>
    `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${body}</svg>`;
  const IMG = name => `themes/fursona/${name}.webp`;

  const THEMES = [
    {
      id: 'vince', name: 'Vince', group: 'fursona', match: [],
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
      id: 'chip', name: 'Chip', group: 'fursona', match: [],
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
      back: `<img class="fr-peek" src="${IMG('ragnar')}" alt="">`,
      // korektor graficzny w rytmie 128 BPM
      emblem: `<div class="fr-eq">${Array.from({ length: 9 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>`,
      fx: { shape: 'rect', dir: 'float', count: 16, colors: ['#ff2e88', '#26c6e0', '#b4e03c', '#9b5cff'], size: [3, 9], speed: [6, 14], glow: true }
    },
    {
      id: 'toro', name: 'Toro', group: 'fursona', match: [],
      accent: ['#ffc864', '#5aa63f'],
      label: '灯籠 · teraz gram',
      back: `<img class="ft-peek" src="${IMG('toro')}" alt="">`,
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
      id: 'myr', name: 'Myr-35', group: 'fursona', match: [],
      accent: ['#d9823f', '#ede6d6'],
      label: 'MYR-35 // ZADANIE',
      // wizjer z nanitów z dwiema parami okrągłych uszu i mrugającymi diodami
      emblem: svg(120, 90, `
        <circle cx="34" cy="16" r="9" fill="#6e767d" stroke="#0b0b0c" stroke-width="2.5"/>
        <circle cx="50" cy="10" r="8" fill="#6e767d" stroke="#0b0b0c" stroke-width="2.5"/>
        <circle cx="70" cy="10" r="8" fill="#6e767d" stroke="#0b0b0c" stroke-width="2.5"/>
        <circle cx="86" cy="16" r="9" fill="#6e767d" stroke="#0b0b0c" stroke-width="2.5"/>
        <path d="M14 34 Q14 18 40 18 H80 Q106 18 106 34 L112 52 Q100 76 60 82 Q20 76 8 52 Z" fill="#ede6d6" stroke="#0b0b0c" stroke-width="3"/>
        <path d="M24 34 Q24 28 40 28 H80 Q96 28 96 34 L100 50 Q90 66 60 70 Q30 66 20 50 Z" fill="#0b0b0c"/>
        <g class="fm-eyes"><rect x="38" y="40" width="14" height="6" rx="1" fill="#e08a3c"/><rect x="68" y="40" width="14" height="6" rx="1" fill="#e08a3c"/></g>
        <rect x="56" y="58" width="8" height="3" fill="#e08a3c" opacity=".7" class="fm-led"/>
        <path d="M8 52 L2 58 M112 52 L118 58" stroke="#0b0b0c" stroke-width="3"/>`, 'fm-visor'),
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
