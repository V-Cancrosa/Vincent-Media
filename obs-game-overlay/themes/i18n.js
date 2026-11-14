/*
  Język streama (panel → Ustawienia → Język streama): polski albo angielski.
  Dotyczy wszystkiego, co widać na streamie: napisy kart, alerty, ekrany, przejścia, czat. Panel zostaje po polsku.
  VMi18n.lang() → 'pl' | 'en';  VMi18n.t('key', {n}) → tekst;  VMi18n.label(text) → napis motywu po angielsku
*/
(function () {
  function settings() { try { return JSON.parse(localStorage.getItem('obsGameOverlay.v1') || '{}') || {}; } catch (e) { return {}; } }
  function lang() {
    try { const q = new URLSearchParams(location.search).get('lang'); if (q) return q === 'en' ? 'en' : 'pl'; } catch (e) {}
    return settings().lang === 'en' ? 'en' : 'pl';
  }
  const S = {
    pl: {
      nowPlaying: 'Teraz gram', nowMaking: 'Teraz tworzę', chat: 'CZAT', live: 'NA ŻYWO', talkDefault: 'Pogadajmy',
      lastFollow: 'Ostatni follow', lastSub: 'Ostatni sub', lastRaid: 'Ostatni raid',
      big_prep: 'W przygotowaniu', big_soon: 'Już zaraz!', big_start: 'Już zaraz!', big_brb: 'Zaraz wracam', big_end: 'Do zobaczenia',
      today: 'Dziś: ', playingOn: 'Gramy dalej w ', start: 'Start ', todayAt: 'dziś o {t}', tomorrowAt: 'jutro o {t}', at: ' o {t}',
      check: ['Scena', 'Dźwięk', 'Mikrofon', 'Czat', 'Alerty', 'Napój', 'Gra'],
      thanks: 'Dziękuję, że byliście!', thanksAll: 'Każdemu, kto dziś zajrzał – dziękuję!',
      cr_follow: 'Nowi obserwujący', cr_gift: 'Prezenty', cr_cheer: 'Bitsy', cr_sub: 'Subskrypcje', cr_raid: 'Raidy', cr_redeem: 'Nagrody za punkty', cr_chat: 'Byli z nami na czacie',
      monthN: '{n}. miesiąc', recentFollow: 'Ostatni follow:', recentSub: 'Ostatni sub:',
      sc_prep: 'Przygotowania', sc_soon: 'Stream za chwilę', sc_start: 'Zaczynamy', sc_late: 'Mały poślizg', sc_brb: 'Przerwa', sc_brbLate: 'Przerwa', sc_talk: 'Pogadajmy', sc_end: 'Dzięki za dziś', sc_game: 'Teraz gram',
      lbl_follow: 'Nowy obserwujący', lbl_sub: 'Nowa subskrypcja', lbl_resub: 'Subskrypcja przedłużona', lbl_gift: 'Prezent dla czatu', lbl_cheer: 'Bitsy!', lbl_raid: 'Raid!', lbl_redeem: 'Nagroda za punkty',
      fx: { konfetti: 'konfetti', serca: 'serca', gwiazdy: 'gwiazdy', fajerwerki: 'fajerwerki', iskry: 'iskry', babelki: 'bąbelki' }
    },
    en: {
      nowPlaying: 'Now playing', nowMaking: 'Now creating', chat: 'CHAT', live: 'LIVE', talkDefault: 'Let\'s talk',
      lastFollow: 'Latest follow', lastSub: 'Latest sub', lastRaid: 'Latest raid',
      big_prep: 'Getting ready', big_soon: 'Starting soon!', big_start: 'Starting soon!', big_brb: 'Be right back', big_end: 'See you',
      today: 'Today: ', playingOn: 'Still playing ', start: 'Starts ', todayAt: 'today at {t}', tomorrowAt: 'tomorrow at {t}', at: ' at {t}',
      check: ['Scene', 'Audio', 'Mic', 'Chat', 'Alerts', 'Drink', 'Game'],
      thanks: 'Thank you for being here!', thanksAll: 'To everyone who stopped by today – thank you!',
      cr_follow: 'New followers', cr_gift: 'Gifts', cr_cheer: 'Bits', cr_sub: 'Subscriptions', cr_raid: 'Raids', cr_redeem: 'Channel point rewards', cr_chat: 'In chat with us',
      monthN: 'month {n}', recentFollow: 'Latest follow:', recentSub: 'Latest sub:',
      sc_prep: 'Getting ready', sc_soon: 'Stream soon', sc_start: 'Here we go', sc_late: 'Small delay', sc_brb: 'Break', sc_brbLate: 'Break', sc_talk: 'Let\'s talk', sc_end: 'Thanks for today', sc_game: 'Now playing',
      lbl_follow: 'New follower', lbl_sub: 'New subscriber', lbl_resub: 'Resubscribed', lbl_gift: 'Gifts for chat', lbl_cheer: 'Bits!', lbl_raid: 'Raid!', lbl_redeem: 'Channel points',
      fx: { konfetti: 'confetti', serca: 'hearts', gwiazdy: 'stars', fajerwerki: 'fireworks', iskry: 'sparks', babelki: 'bubbles' }
    }
  };
  // napisy motywów (nad nazwą gry) – po angielsku
  const LABELS_EN = {
    'MYR-35 // ZADANIE': 'MYR-35 // TASK', 'TERAZ TWORZĘ': 'NOW CREATING', 'CZYTAMY': 'READING', 'BLACKRUNNER // CZYTAMY': 'BLACKRUNNER // READING',
    'WYBÓR MISJI': 'MISSION SELECT', 'SR-1 // SOJUSZ': 'SR-1 // ALLIANCE', 'SR-2 // CERBER': 'SR-2 // CERBERUS', 'GOTOWOŚĆ GALAKTYKI': 'GALACTIC READINESS', 'INICJATYWA // PIONIER': 'INITIATIVE // PATHFINDER',
    'RAPORT Z FRONTU': 'FRONT REPORT', 'REMASTER · RAPORT Z FRONTU': 'REMASTER · FRONT REPORT', 'ZIMNA WOJNA 2.0': 'COLD WAR 2.0', 'KONTROLA UMYSŁÓW': 'MIND CONTROL',
    'TRZY STRONY · JEDNA WOJNA': 'THREE SIDES · ONE WAR', 'POWSTANIE': 'UPRISING', 'EVA // RAPORT': 'EVA // REPORT', 'REMASTER · EVA // RAPORT': 'REMASTER · EVA // REPORT',
    'WOJNY O TYBERIUM': 'TIBERIUM WARS', 'GNIEW KANE’A': 'KANE\'S WRATH', 'ZMIERZCH TYBERIUM': 'TIBERIAN TWILIGHT', 'SZTAB // NA ŻYWO': 'HQ // LIVE', 'GODZINA ZERO': 'ZERO HOUR',
    'KRÓLESTWO W GŁĘBI': 'THE KINGDOM BELOW', 'PIEŚŃ JEDWABIU': 'SONG OF SILK', 'HAMLET · LOCHY RODU': 'HAMLET · FAMILY DUNGEONS', 'DYLIŻANS RUSZA': 'THE STAGECOACH ROLLS',
    'TALISMAN · 4. EDYCJA': 'TALISMAN · 4TH EDITION', 'TALISMAN · 5. EDYCJA': 'TALISMAN · 5TH EDITION', 'Teraz gram': 'Now playing'
  };
  function t(key, o = {}) {
    const d = S[lang()], v = d[key] != null ? d[key] : S.pl[key];
    return typeof v === 'string' ? v.replace(/\{(\w+)\}/g, (_, k) => (o[k] != null ? o[k] : '')) : v;
  }
  function label(text) { return lang() === 'en' && text && LABELS_EN[text] ? LABELS_EN[text] : text; }
  // dla galerii: cały zestaw tekstów w danym języku
  function voices(l) { const VO = window.OverlayVoices; return VO && VO.set ? (({ V, TIERS, GAMEV, SCENES }) => ({ V, TIERS, GAMEV, SCENES }))(VO.set(l)) : null; }
  window.VMi18n = { lang, t, label, voices, strings: S };
})();
