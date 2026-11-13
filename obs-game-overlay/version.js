// Wersja plików nakładki. Nakładki porównują ją z wersją zgłaszaną przez wykrywacz
// i same się odświeżają, gdy wykrywacz zainstalował aktualizację.
window.VM_VERSION = '1.7.0';
window.vmCheckVersion = function (v) {
  if (!v || v === window.VM_VERSION) return;
  try { if (sessionStorage.getItem('vmReloadedFor') === v) return; sessionStorage.setItem('vmReloadedFor', v); } catch (e) {}
  setTimeout(function () { location.reload(); }, 1500);
};
