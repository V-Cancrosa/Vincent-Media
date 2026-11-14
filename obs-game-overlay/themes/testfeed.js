/*
  Testowy ruch na czacie: stały napływ wiadomości (co jakiś czas wiadomość w stylu bota) i alertów.
  Używają go panel i strona demo. Każda wiadomość przechodzi przez themes/botcheck.js – flaga trafia do wiadomości
  (nakładka ukrywa „podejrzane”) i do onFlag (lista „Moderacja”).
    VMTestFeed.start({ send(ev), onFlag(ev), chat: true, alerts: true, chatMs: 1600, alertMs: 9000, lang: () => 'pl', ctx: () => ({...}) })
    VMTestFeed.stop(), VMTestFeed.running, VMTestFeed.bot(lang) – jedna wiadomość bota (przycisk testu)
*/
(function () {
  const USERS = ['LunaFox', 'Kuba_Gra', 'PixelWilk', 'Nocny_Smok', 'herbatka99', 'MrówkaPancerna', 'Zet', 'Ola_Rysuje', 'Bartek_3D', 'KasiaKot', 'MaxPower', 'srebrny_lis'];
  const STYLES = ['', '', '', 'neon', 'szklo', 'pixel', 'komiks', 'terminal', 'papier', 'holo', 'sakura', 'ogien', 'lod'];
  const LINES = {
    pl: ['cześć wszystkim!', 'ale akcja', 'GG', 'jak długo już grasz?', 'pozdro z Krakowa', 'to było mocne', 'ten boss to żart', 'wracam z herbatą', 'haha dobre', 'czemu tam poszedłeś?', 'ta muzyka jest super', 'o nie…', 'jeszcze raz!', 'jakie masz ustawienia?', 'dzień dobry o 2 w nocy', 'czy to nowy motyw nakładki?'],
    en: ['hi everyone!', 'what a play', 'GG', 'how long have you been playing?', 'greetings from Berlin', 'that was intense', 'this boss is a joke', 'back with tea', 'lol nice', 'why did you go there?', 'love this music', 'oh no…', 'again!', 'what settings do you use?', 'good morning at 2 am', 'is that a new overlay theme?']
  };
  // wiadomości w stylu botów: świeże konto + reklama, ogólnik na dzień dobry, link, kopiuj-wklej z kilku kont
  const BOTS = {
    pl: [
      { user: 'nowe_konto_2077', text: 'fajnie grasz! best viewers on streamboo .com', age: 0.3 },
      { user: 'promo_kanal_88', text: 'kup widzów i followów taniej, napisz do mnie', age: 2 },
      { user: 'hej_streamer_1', text: 'hej streamer fajny stream', age: 1.5 },
      { user: 'linkowiec', text: 'zobacz to www.darmowe-skiny .xyz', age: 5 },
      { user: 'kopia_a', text: 'wow niesamowity stream jestem pod wrażeniem', age: 9, copy: true }
    ],
    en: [
      { user: 'new_acc_2077', text: 'nice stream! best viewers on streamboo .com', age: 0.3 },
      { user: 'promo_channel_88', text: 'cheap viewers and followers, dm me', age: 2 },
      { user: 'hey_streamer_1', text: 'hey streamer nice stream', age: 1.5 },
      { user: 'linkguy', text: 'check this www.free-skins .xyz', age: 5 },
      { user: 'copy_a', text: 'wow amazing stream i am so impressed', age: 9, copy: true }
    ]
  };
  const ALERTS = ['follow', 'follow', 'sub', 'resub', 'gift', 'cheer', 'cheer', 'raid', 'redeem'];
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  let timers = [], opts = null, n = 0;

  function chatEv(user, text, extra = {}) {
    return { type: 'chat', user, login: user.toLowerCase(), text, fragments: [{ t: 'text', v: text }], style: rnd(STYLES), badges: Math.random() < 0.2 ? ['subscriber'] : [], test: true, _n: ++n, ...extra };
  }
  function judge(ev) {
    if (window.OverlayBotCheck) {
      const c = opts && opts.ctx ? opts.ctx() : {};
      const f = window.OverlayBotCheck.check(ev, c);
      if (f) ev.flag = f;
    }
    if (ev.flag && opts && opts.onFlag) opts.onFlag(ev);
    return ev;
  }
  function bot(lang) {
    const b = rnd(BOTS[lang === 'en' ? 'en' : 'pl']);
    const out = [judge(chatEv(b.user, b.text, { accountAgeDays: b.age, style: '', badges: [] }))];
    // kopiuj-wklej: ten sam tekst od drugiego konta chwilę później
    if (b.copy) out.push(judge(chatEv(b.user.replace(/a$/, 'b'), b.text, { accountAgeDays: b.age + 1, style: '', badges: [] })));
    return out;
  }
  function alertEv() {
    const type = rnd(ALERTS), tier = 1 + Math.floor(Math.random() * 5), user = rnd(USERS);
    let ev = { type, user, test: true, _n: ++n };
    if (type === 'sub') ev.tier = 'Tier 1';
    if (type === 'redeem') { ev.reward = (opts && opts.lang && opts.lang() === 'en') ? 'Hydrate!' : 'Nawodnij się'; ev.cost = 500; }
    if (window.OverlayTiers) ev = { ...ev, ...window.OverlayTiers.sample(type, tier) };
    if ((type === 'resub' || type === 'cheer') && opts && opts.sample) ev.message = opts.sample();
    return ev;
  }
  function start(o) {
    stop(); opts = o;
    const lang = () => (o.lang ? o.lang() : 'pl') === 'en' ? 'en' : 'pl';
    const tickChat = () => {
      if (Math.random() < 0.13) bot(lang()).forEach((ev, i) => setTimeout(() => o.send(ev), i * 700));
      else o.send(judge(chatEv(rnd(USERS), rnd(LINES[lang()]))));
      timers[0] = setTimeout(tickChat, (o.chatMs || 1600) * (0.5 + Math.random()));
    };
    const tickAlert = () => { o.send(alertEv()); timers[1] = setTimeout(tickAlert, (o.alertMs || 9000) * (0.7 + Math.random() * 0.6)); };
    if (o.chat !== false) tickChat();
    if (o.alerts !== false) timers[1] = setTimeout(tickAlert, 1500);
    api.running = true;
  }
  function stop() { timers.forEach(clearTimeout); timers = []; api.running = false; }
  const api = { start, stop, running: false, configure(o) { if (!api.running) opts = o; }, bot: lang => { const evs = bot(lang); return evs; }, judge: ev => judge(ev) };
  window.VMTestFeed = api;
})();
