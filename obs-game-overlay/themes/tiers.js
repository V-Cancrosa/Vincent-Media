/*
  Poziom reakcji (1–5) zależny od wielkości zdarzenia: im więcej bitsów, dłuższy sub, większy gift,
  większy raid albo droższa nagroda – tym większy, dłuższy i głośniejszy alert, mocniejsze efekty i inne teksty postaci.
*/
(function () {
  // progi: wartość >= próg → poziom (indeks + 2); poniżej pierwszego progu – poziom 1
  const STEPS = {
    cheer:  [100, 500, 1000, 5000],      // bitsy
    gift:   [2, 5, 10, 50],              // liczba subów w prezencie
    resub:  [3, 6, 12, 24],              // miesiące
    raid:   [5, 20, 50, 200],            // widzowie
    redeem: [500, 2000, 10000, 50000]    // koszt nagrody w punktach
  };
  const value = ev => ({ cheer: ev.amount, gift: ev.count, resub: ev.months, raid: ev.viewers, redeem: ev.cost })[ev.type];

  function tier(ev) {
    if (!ev) return 1;
    let t = 1;
    if (ev.type === 'follow') t = 1;
    else if (ev.type === 'sub') t = 2;
    else if (STEPS[ev.type]) { const v = +value(ev) || 0; t = 1; for (const s of STEPS[ev.type]) if (v >= s) t++; }
    // sub Tier 2 / Tier 3 to o poziom / dwa wyżej
    if (/Tier 2/.test(ev.tier || '')) t += 1;
    if (/Tier 3/.test(ev.tier || '')) t += 2;
    return Math.max(1, Math.min(5, t));
  }

  // jak mocno reagować na danym poziomie
  const REACT = {
    1: { scale: 1.00, extra: 0,   fx: 1.0, effect: null,                     shake: 0, volume: 0.8, name: '' },
    2: { scale: 1.06, extra: 1.0, fx: 1.4, effect: null,                     shake: 0, volume: 0.9, name: '' },
    3: { scale: 1.14, extra: 2.0, fx: 2.0, effect: ['konfetti'],             shake: 0, volume: 1.0, name: 'DUŻE' },
    4: { scale: 1.24, extra: 3.5, fx: 2.8, effect: ['fajerwerki'],           shake: 1, volume: 1.0, name: 'OGROMNE' },
    5: { scale: 1.36, extra: 5.0, fx: 3.6, effect: ['fajerwerki', 'gwiazdy'], shake: 2, volume: 1.0, name: 'LEGENDARNE' }
  };

  // wartości do zdarzeń testowych na każdym poziomie (panel → alerty → „poziom”)
  const SAMPLE = {
    cheer:  [50, 300, 800, 2500, 10000],
    gift:   [1, 3, 7, 20, 100],
    resub:  [2, 4, 9, 18, 36],
    raid:   [3, 12, 35, 120, 500],
    redeem: [100, 1000, 5000, 20000, 100000]
  };
  function sample(type, t) {
    const i = Math.max(1, Math.min(5, t)) - 1, v = SAMPLE[type] ? SAMPLE[type][i] : 0;
    return ({ cheer: { amount: v }, gift: { count: v }, resub: { months: v }, raid: { viewers: v }, redeem: { cost: v }, sub: { tier: t >= 4 ? 'Tier 3' : t === 3 ? 'Tier 2' : 'Tier 1' } })[type] || {};
  }

  window.OverlayTiers = { tier, react: t => REACT[Math.max(1, Math.min(5, t))], sample, STEPS };
})();
