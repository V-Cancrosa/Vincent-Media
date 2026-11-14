/*
  Linki do sociali z ikonami (ekrany przerw, gra w ramce, rozmowa, pasek czatu w grze).
  Ustawienie „socials” (panel → Sterowanie → Ekrany): wpisy po przecinku, np. „bluesky: @ktoś.bsky.social”.
  Puste = domyślna lista poniżej. Sieć rozpoznaje się po przedrostku („x:”, „telegram:”) albo po samym adresie.
  Ikony narysowane uproszczonym SVG (currentColor), tylko po to, żeby było widać, który to serwis.
*/
(function () {
  const DEFAULT = 'telegram: @vincent_vince_cancrosa, bluesky: @vcancrosa.bsky.social, instagram: @vincent_cancrosa, x: @Vulpine_Regnum, reddit: u/Kilokero1, github: V-Cancrosa';
  const I = {
    telegram: '<path d="M21.4 3.3 2.9 10.4c-1.1.4-1.1 1.9 0 2.2l4.6 1.4 1.8 5.6c.3.9 1.4 1.1 2 .4l2.6-2.4 4.9 3.6c.8.6 1.9.1 2.1-.9l3-14.6c.2-1.1-.9-2-2-1.4h-.5Z"/><path d="m9.3 19.4.4-4.7 8.6-7.9-10.8 7.2" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.2" stroke-linejoin="round"/>',
    bluesky: '<path d="M12 11.2C10.6 8.4 6.8 3.4 4.2 3.4 2.6 3.4 2 4.6 2 5.9c0 1.1.6 5.4 1 6.5 1 2.6 3.7 3.2 6.2 2.8-4.2.7-5.3 3.1-3 5.4 4.2 4.3 6-.9 5.8-3.2 0 0 0 0 0 0-.2 2.3 1.6 7.5 5.8 3.2 2.3-2.3 1.2-4.7-3-5.4 2.5.4 5.2-.2 6.2-2.8.4-1.1 1-5.4 1-6.5 0-1.3-.6-2.5-2.2-2.5-2.6 0-6.4 5-7.8 7.8Z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="17.4" cy="6.6" r="1.4"/>',
    x: '<path d="M3.5 3h4.8l12.2 18h-4.8Z"/><path d="M19.6 3h1.9l-7 8-1.1-1.5ZM4.4 21H2.5l7.3-8.4 1.1 1.5Z"/>',
    reddit: '<circle cx="12" cy="14.2" r="7.6"/><circle cx="19.6" cy="9.8" r="2.1"/><circle cx="4.4" cy="9.8" r="2.1"/><circle cx="17.6" cy="3.6" r="1.7"/><path d="m12.4 6.6 1.3-4.2 3.9.9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="9" cy="13.4" r="1.4" fill="#000" fill-opacity=".55"/><circle cx="15" cy="13.4" r="1.4" fill="#000" fill-opacity=".55"/><path d="M8.9 17c1.8 1.3 4.4 1.3 6.2 0" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="1.2" stroke-linecap="round"/>',
    github: '<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/>',
    twitch: '<path d="M4.5 2 3 5.8V20h4.8v2.6h2.7l2.6-2.6h3.9l5.2-5.2V2Zm15.6 11.7-3 3h-4.7l-2.6 2.6v-2.6H5.9V3.8h14.2Z"/><path d="M15.3 7h1.8v5.2h-1.8Zm-4.8 0h1.8v5.2h-1.8Z"/>',
    youtube: '<path d="M22 7.2a2.8 2.8 0 0 0-2-2C18.3 4.8 12 4.8 12 4.8s-6.3 0-8 .4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.6 12 29 29 0 0 0 2 16.8a2.8 2.8 0 0 0 2 2c1.7.4 8 .4 8 .4s6.3 0 8-.4a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .4-4.8 29 29 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1Z"/>',
    tiktok: '<path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2.1-2.8V9.2a6.3 6.3 0 1 0 5.4 6.2V8.6a8 8 0 0 0 4.4 1.4V6.7A4.6 4.6 0 0 1 16.6 2Z"/>',
    discord: '<path d="M19.3 5.3A17 17 0 0 0 15 4l-.5 1a16 16 0 0 0-5 0L9 4a17 17 0 0 0-4.3 1.3C2 9.4 1.3 13.4 1.6 17.3a17 17 0 0 0 5.3 2.7l1.1-1.8a11 11 0 0 1-1.7-.8l.4-.3a12 12 0 0 0 10.6 0l.4.3a11 11 0 0 1-1.7.8l1.1 1.8a17 17 0 0 0 5.3-2.7c.4-4.5-.7-8.5-3.1-12ZM8.5 14.9c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm7 0c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z"/>',
    link: '<path d="M10.6 13.4a4 4 0 0 0 5.7 0l3.5-3.5a4 4 0 0 0-5.7-5.7l-1.2 1.2M13.4 10.6a4 4 0 0 0-5.7 0l-3.5 3.5a4 4 0 0 0 5.7 5.7l1.2-1.2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'
  };
  const NAMES = { telegram: 'Telegram', bluesky: 'Bluesky', instagram: 'Instagram', x: 'X', reddit: 'Reddit', github: 'GitHub', twitch: 'Twitch', youtube: 'YouTube', tiktok: 'TikTok', discord: 'Discord', link: '' };
  const ALIAS = { tg: 'telegram', t: 'telegram', bsky: 'bluesky', ig: 'instagram', insta: 'instagram', twitter: 'x', gh: 'github', yt: 'youtube', tt: 'tiktok', dc: 'discord' };
  function guess(v) {
    const s = v.toLowerCase();
    if (/bsky\.(social|app)/.test(s)) return 'bluesky';
    if (/^u\/|reddit\.com/.test(s)) return 'reddit';
    if (/github\.com/.test(s)) return 'github';
    if (/twitch\.tv/.test(s)) return 'twitch';
    if (/youtube\.com|youtu\.be/.test(s)) return 'youtube';
    if (/tiktok\.com/.test(s)) return 'tiktok';
    if (/instagram\.com/.test(s)) return 'instagram';
    if (/t\.me\//.test(s)) return 'telegram';
    if (/(x|twitter)\.com/.test(s)) return 'x';
    if (/discord\.(gg|com)/.test(s)) return 'discord';
    return 'link';
  }
  function parse(str) {
    if (String(str || '').trim() === '-') return [];   // „-” = bez sociali
    const raw = String(str == null || !String(str).trim() ? DEFAULT : str);
    return raw.split(/[,|\n]/).map(x => x.trim()).filter(Boolean).map(x => {
      const m = x.match(/^([a-z]+)\s*:\s*(.+)$/i);
      let net = m ? m[1].toLowerCase() : '', handle = m ? m[2].trim() : x;
      net = ALIAS[net] || net;
      if (!I[net]) { handle = x; net = guess(x); }
      handle = handle.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      return { net, name: NAMES[net] || '', handle, icon: icon(net) };
    });
  }
  const icon = net => `<svg class="soc-ic soc-${net}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${I[net] || I.link}</svg>`;
  // HTML jednego wpisu: ikona + nazwa konta (opcjonalnie nazwa serwisu)
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const item = (s, withName) => `<span class="soc soc-n-${s.net}">${s.icon}${withName && s.name ? `<small>${esc(s.name)}</small>` : ''}<b>${esc(s.handle)}</b></span>`;
  function render(el, str, opts = {}) {
    if (!el) return;
    const list = parse(str), key = JSON.stringify(list.map(s => s.net + s.handle)) + !!opts.names;
    if (el.dataset.soc === key) return; el.dataset.soc = key;
    el.innerHTML = list.map(s => item(s, opts.names)).join('');
  }
  // wygląd (wstrzykiwany raz – strony nie muszą mieć base.css)
  try {
    if (!document.getElementById('vm-soc-css')) {
      const st = document.createElement('style'); st.id = 'vm-soc-css';
      st.textContent = '.soc{display:inline-flex;align-items:center;gap:.45em;white-space:nowrap}.soc-ic{width:1.15em;height:1.15em;flex:none;color:var(--accent,#7c5cff)}.soc small{opacity:.6;font-size:.62em;text-transform:uppercase;letter-spacing:.12em}.soc b{font-weight:inherit}';
      (document.head || document.documentElement).appendChild(st);
    }
  } catch (e) {}
  window.VMSocials = { parse, render, icon, item, DEFAULT };
})();
