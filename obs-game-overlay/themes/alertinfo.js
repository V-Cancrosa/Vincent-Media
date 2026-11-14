/*
  Wspólne dla alertów (alerts.html) i alertów w czacie (themes/chat.js): ikony, opis zdarzenia, odmiana liczebników.
*/
(function () {
  const ICONS = {
    follow: '<path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2.2 0 3.6 1.3 4.4 2.6.8-1.3 2.2-2.6 4.4-2.6 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z"/>',
    sub: '<path d="M12 2.5l2.9 6.2 6.6.7-5 4.5 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z"/>',
    resub: '<path d="M12 2.5l2.9 6.2 6.6.7-5 4.5 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z"/>',
    gift: '<path d="M3 9h18v4H3zM5 13h14v8H5z"/><path d="M12 9v12" stroke="#000" stroke-opacity=".35" stroke-width="2"/><path d="M12 9c-1.5-3.5-6-4.5-6-1.8C6 9 9.5 9 12 9zm0 0c1.5-3.5 6-4.5 6-1.8C18 9 14.5 9 12 9z"/>',
    cheer: '<path d="M12 2l7 7-7 13L5 9z"/><path d="M5 9h14M12 2v20" stroke="#000" stroke-opacity=".3" stroke-width="1.2" fill="none"/>',
    raid: '<path d="M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM1.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5zm13.5 0c0-2.2-.8-4.2-2.1-5.6.9-.6 2-.9 3.1-.9 3 0 5.5 2.5 5.5 6.5z"/>',
    redeem: '<path d="M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4z"/><path d="M9 7v12" stroke="#000" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="2 2"/>'
  };
  const pl = (n, one, few, many) => {
    const n10 = n % 10, n100 = n % 100;
    if (n === 1) return one;
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
    return many;
  };
  function details(ev) {
    switch (ev.type) {
      case 'sub': return ev.tier || '';
      case 'resub': return [`${ev.months} ${pl(ev.months, 'miesiąc', 'miesiące', 'miesięcy')}`, ev.message ? `„${ev.message}”` : ''].filter(Boolean).join(' · ');
      case 'gift': return `${ev.count} ${pl(ev.count, 'sub', 'suby', 'subów')} w prezencie`;
      case 'cheer': return [`${ev.amount} ${pl(ev.amount, 'bits', 'bitsy', 'bitsów')}`, ev.message ? `„${ev.message}”` : ''].filter(Boolean).join(' · ');
      case 'raid': return `${ev.viewers} ${pl(ev.viewers, 'osoba wpada', 'osoby wpadają', 'osób wpada')} na stream`;
      case 'redeem': return [ev.reward, ev.cost ? `${ev.cost} pkt` : '', ev.message ? `„${ev.message}”` : ''].filter(Boolean).join(' · ');
      default: return 'Dzięki!';
    }
  }

  window.OverlayAlertInfo = { ICONS, details, pl };
})();
