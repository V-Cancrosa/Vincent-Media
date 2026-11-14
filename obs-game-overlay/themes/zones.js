/*
  Strefy alertów: każdy ekran (scenes.html) i układ (layouts.html) mówi alertom, gdzie jest na nim wolne miejsce,
  albo że alerty mają być częścią czatu. Alerty (alerts.html) to jedno źródło we wszystkich scenach,
  więc same nie wiedzą, która scena jest na wizji – dowiadują się stąd.

  Kto jest „na wizji”:
    • w OBS – zdarzenie obsSourceActiveChanged (scena ze źródłem jest w programie),
    • w zwykłej przeglądarce / demo – ramka ma rozmiar (ukryta ramka ma szerokość 0).
  Zapasowo panel w OBS podaje nazwę bieżącej sceny ({type:'scene'}), a alerts.html ma do niej domyślne strefy.

  Wiadomość: { type:'zone', src, prio, on, zone: { mode:'card'|'chat', rect:[x,y,w,h] }, at }
*/
(function () {
  let bc = null; try { bc = new BroadcastChannel('obsGameOverlay'); } catch (e) {}
  const inOBS = !!window.obsstudio;
  const src = Math.random().toString(36).slice(2);
  let obsActive = false, getZone = null, prio = 1, timer = null, wasOn = false, since = 0;

  function isActive() {
    if (inOBS) return obsActive;
    // ramka w stronie (demo): ukryta ramka nie jest „na wizji”
    try { const fe = window.frameElement; if (fe && (fe.hidden || fe.getClientRects().length === 0)) return false; } catch (e) {}
    return window.innerWidth > 0 && window.innerHeight > 0 && document.visibilityState === 'visible';
  }
  function send() {
    if (!bc || !getZone) return;
    const on = isActive();
    let zone = null;
    if (on) { try { zone = getZone(); } catch (e) { zone = null; } }
    const now = on && !!zone;
    if (now && !wasOn) since = Date.now();
    wasOn = now;
    bc.postMessage({ type: 'zone', src, prio, on: now, zone, since, at: Date.now() });
  }
  // alerts.html po starcie pyta, kto jest na wizji
  if (bc) bc.addEventListener('message', e => { if (e.data && e.data.type === 'zone-query') send(); });
  window.addEventListener('obsSourceActiveChanged', e => { obsActive = !!(e.detail && e.detail.active); send(); });
  window.addEventListener('beforeunload', () => { if (bc) bc.postMessage({ type: 'zone', src, on: false, at: Date.now() }); });

  window.VMZone = {
    // fn() → strefa (albo null); wysyłana od razu i co 1,5 s, dopóki źródło jest na wizji
    announce(fn, p = 1) { getZone = fn; prio = p; send(); clearInterval(timer); timer = setInterval(send, 1500); },
    refresh: send,
    isActive,
    inOBS
  };
})();
