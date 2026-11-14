// Wersja plików nakładki. Nakładki porównują ją z wersją zgłaszaną przez wykrywacz
// i same się odświeżają, gdy wykrywacz zainstalował aktualizację.
window.VM_VERSION = '1.21.0';
window.vmCheckVersion = function (v) {
  if (!v || v === window.VM_VERSION) return;
  try { if (sessionStorage.getItem('vmReloadedFor') === v) return; sessionStorage.setItem('vmReloadedFor', v); } catch (e) {}
  setTimeout(function () { location.reload(); }, 1500);
};
// Adres wykrywacza: na komputerze z ustawień (localhost), a gdy strona jest otwarta z wykrywacza
// (pilot z telefonu: http://192.168.x.x:7777/ui/…) – ten sam adres, z którego przyszła strona.
window.vmHub = function (fallback) {
  if (/^https?:$/.test(location.protocol) && location.pathname.indexOf('/ui/') === 0) return location.origin;
  return String(fallback || 'http://localhost:7777').replace(/\/+$/, '');
};
