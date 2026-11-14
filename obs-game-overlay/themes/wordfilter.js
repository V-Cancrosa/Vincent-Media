/*
  Filtr słów zakazanych regulaminem Twitcha (obelgi rasowe, homofobiczne itp.) – czat, nicki w alertach i skan ekranu.
  Przekleństwa NIE są tu filtrowane (Twitch na nie pozwala) – tylko słowa nienawiści i ich przeróbki:
    leet (n1gg3r, f@g), podwójne litery (niiiig), kropki/kreski w środku (n.i.g), litery osobno (n i g g e r),
    rozbicie na dwa słowa (nig ger, knee grow – „pod TTS”), cyrylica i inne podobne litery, znaki zerowej szerokości,
    q zamiast g, y zamiast i.
  Wzorce są zapisane ROT13, żeby plik nie był listą obelg do czytania; odkodowuje je dopiero przeglądarka.
  Poziomy: hard – zawsze zakrywane; soft – słowa dwuznaczne (np. „pedał” to też część roweru), zakrywane, chyba że w panelu wyłączysz.
  VMWords.check(text) → { level: 'hard'|'soft'|null, hits: [{ text, level, cat }], masked }
  VMWords.lines(lines) → słowa z OCR do zasłonięcia;  VMWords.maskName(nick)
  Ustawienia (panel → Czat → Słowa zakazane): wordFilter 'mask'|'hide'|'off', wordSoft true/false, wordExtra, wordAllow.
*/
(function () {
  const RAW = [["^a+[vl]+[td]+[td]+(r+e+|n+u*|h+u*|n+m+|r+e+m+|r+e+f+|n+f+|h+m+|e+|r+g+|y+r+g+|r+e+v+a+b+)f*$", "hard", "race"], ["^a+[vl]+[td]+(y+r+g+|a+b+t+|e+|n+)f*$", "hard", "race"], ["^a+[vl]+[td]+r+e+f*$", "soft", "race"], ["^x*a+r+r+[td]+(e+b+j*|r+e+|n+)f*$", "hard", "race"], ["^a+[vl]+o+o+n+f*$", "soft", "race"], ["^a+r+t+e+b+(r+)?f*$", "soft", "race"], ["^(w+v+t+n+o+b+b+|c+b+e+p+u+z+b+a+x+r+l+|m+v+c+c+r+e+u+r+n+q+|t+b+y+y+v+j+b+t+|w+h+a+t+y+r+o+h+a+a+l+)f*$", "hard", "race"], ["^p+b+b+a+f*$", "hard", "race"], ["^(x+l*v+x+r+|p+u+v+a+x+|f+c+v+p+x*|t+b+b+x+|j+r+g+o+n+p+x+|o+r+n+a+r+e+|g+b+j+r+y+u+r+n+q+|e+n+t+u+r+n+q+|c+n+x+v+|f+n+a+q+a+v+t+t+r+e+|p+u+v+a+n+z+n+a+)f*$", "hard", "race"], ["^s+n+t+(t+(b+g+|v+g+|r+g+|l+)|b+g+|f+|m+)?f*$", "hard", "lgbt"], ["^g+e+n+a+a+(l+|v+r+)f*$", "hard", "lgbt"], ["^(q+l+x+r+|f+u+r+z+n+y+r+|y+n+q+l+o+b+l+)f*$", "soft", "lgbt"], ["^e+r+g+n+e+q+(f+|r+q+|n+g+v+b+a+)?$", "soft", "ableism"], ["^p+m+n+e+a+h+p+u+(l|n|h|b|r|r+z|n+z+v|b+j|b+j+v)?$", "hard", "race"], ["^p+v+n+c+(n+g+(l|n|r|v|r+t+b|l+z)|n+x+(v|n|b+j|b+z)?)$", "hard", "race"], ["^(z+h+e+m+l+a+(n|l|b+j|r+z|v+r|x+n|x+v|b+j+v)?)$", "soft", "race"], ["^(c+r+q+n+y+(l|n|h|r|b+j|x+v|r+x|m+v+r)?|c+r+q+m+v+b+|p+v+b+g+(n|l|b|r|n+z+v)|p+j+r+y+(r|n|h|v|r+z)?)$", "soft", "lgbt"], ["F:a+[vl]+[td]+[td]+(r+e+|n+)", "hard", "race"], ["F:s+n+t+t+b+g+", "hard", "lgbt"], ["F:p+m+n+e+a+h+p+u+", "hard", "race"]];
  const rot = s => s.replace(/[a-z]/gi, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode((c.charCodeAt(0) - b + 13) % 26 + b); });
  const PATS = RAW.map(([p, level, cat]) => { const d = rot(p), sub = d.startsWith('F:'); return { re: new RegExp(sub ? d.slice(2) : d), sub, level, cat }; });
  // „F:” po ROT13 = „S:” (fragment dłuższego słowa); wyjątki dla zwykłych słów, które zawierają fragment
  const SUB_OK = /^(s+n+i+g+g+e+r+(s|e+d|i+n+g)?)$/;
  // zwykłe słowa zapisane normalnie (bez leet) – nie zakrywać
  const SAFE_RAW = /^["'(«„]*(niger|nigeria|nigerian|nigerians|nigerii|nigerze)["').,!?:;»”]*$/i;

  const HOMO = { 'а': 'a', 'в': 'b', 'е': 'e', 'ё': 'e', 'к': 'k', 'м': 'm', 'н': 'h', 'о': 'o', 'р': 'p', 'с': 'c', 'т': 't', 'у': 'y', 'х': 'x', 'і': 'i', 'ї': 'i', 'ј': 'j', 'ԁ': 'd', 'ɡ': 'g', 'ԛ': 'q', 'ɢ': 'g', 'ɪ': 'i', 'ʀ': 'r',
    'α': 'a', 'β': 'b', 'ε': 'e', 'η': 'n', 'ι': 'i', 'κ': 'k', 'ν': 'v', 'ο': 'o', 'ρ': 'p', 'τ': 't', 'υ': 'u', 'χ': 'x', 'γ': 'y',
    'ł': 'l', 'ø': 'o', 'ß': 'ss', 'æ': 'ae', 'œ': 'oe', 'đ': 'd', 'ı': 'i' };
  const LEET = { '0': 'o', '1': 'i', '!': 'i', '|': 'i', '¡': 'i', '3': 'e', '€': 'e', '4': 'a', '@': 'a', '5': 's', '$': 's', '7': 't', '+': 't', '8': 'b', '9': 'g', '6': 'g', '2': 'z' };
  function norm(tok) {
    let t = String(tok || '').normalize('NFKC').toLowerCase().replace(/[​-‏⁠﻿­]/g, '');
    t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
    let o = '';
    for (const c of t) o += HOMO[c] || LEET[c] || c;
    return o.replace(/[^a-z]/g, '');
  }
  function settings() { try { return (window.VMClient && window.VMClient.settings && window.VMClient.settings()) || JSON.parse(localStorage.getItem('obsGameOverlay.v1') || '{}') || {}; } catch (e) { return {}; } }
  const list = v => String(v || '').split(',').map(norm).filter(Boolean);

  // jeden kandydat (token, złączone sąsiednie tokeny albo litery pisane osobno) → trafienie albo null
  function test(w, cfg) {
    if (!w || w.length < 3 || cfg.allow.includes(w)) return null;
    if (cfg.extra.includes(w)) return { level: 'hard', cat: 'custom' };
    for (const p of PATS) {
      if (p.sub) { if (p.re.test(w) && !SUB_OK.test(w)) return { level: p.level, cat: p.cat }; }
      else if (p.re.test(w)) return { level: p.level, cat: p.cat };
    }
    for (const e of cfg.extra) if (e.length >= 5 && w.includes(e)) return { level: 'hard', cat: 'custom' };
    return null;
  }
  // tokens: znormalizowane słowa w kolejności → [{ i0, i1, level, cat }] (zakres tokenów do zakrycia)
  function scanTokens(toks, cfg, raws) {
    const out = [], hit = new Set();
    if (raws) raws.forEach((r, i) => { if (SAFE_RAW.test(r)) hit.add(i); });
    const add = (i0, i1, r) => { out.push({ i0, i1, ...r }); for (let i = i0; i <= i1; i++) hit.add(i); };
    toks.forEach((w, i) => { if (hit.has(i)) return; const r = test(w, cfg); if (r) add(i, i, r); });
    // dwa i trzy słowa razem („nig ger”, „knee grow”)
    for (let n = 2; n <= 3; n++) for (let i = 0; i + n <= toks.length; i++) {
      if ([...Array(n).keys()].some(k => hit.has(i + k))) continue;
      const w = toks.slice(i, i + n).join(''); if (w.length > 16) continue;
      const r = test(w, cfg); if (r) add(i, i + n - 1, r);
    }
    // litery osobno: „n i g g e r”, „n-i-g”
    for (let i = 0; i < toks.length; i++) {
      if (toks[i].length > 2) continue;
      let j = i; while (j + 1 < toks.length && toks[j + 1].length <= 2) j++;
      if (j - i >= 2) {
        for (let a = i; a <= j; a++) for (let b = j; b >= a + 2; b--) {
          const w = toks.slice(a, b + 1).join(''); const r = test(w, cfg);
          if (r) { add(a, b, r); a = b; break; }
        }
      }
      i = j;
    }
    return out;
  }
  function cfgOf(s = settings()) { return { allow: list(s.wordAllow), extra: list(s.wordExtra), soft: s.wordSoft !== false, mode: s.wordFilter || 'mask' }; }
  const BLOCK = n => '▇'.repeat(Math.max(3, Math.min(6, n)));

  function check(text, s) {
    const cfg = cfgOf(s), src = String(text || '');
    const toks = [], re = /\S+/g; let m;
    while ((m = re.exec(src))) toks.push({ raw: m[0], at: m.index, n: norm(m[0]) });
    const hits = scanTokens(toks.map(t => t.n), cfg, toks.map(t => t.raw)).filter(h => h.level === 'hard' || cfg.soft);
    if (!hits.length) return { level: null, hits: [], masked: src };
    const cover = new Set(); hits.forEach(h => { for (let i = h.i0; i <= h.i1; i++) cover.add(i); });
    let masked = '', pos = 0;
    toks.forEach((t, i) => { masked += src.slice(pos, t.at) + (cover.has(i) ? BLOCK(t.raw.length) : t.raw); pos = t.at + t.raw.length; });
    masked += src.slice(pos);
    return {
      level: hits.some(h => h.level === 'hard') ? 'hard' : 'soft',
      hits: hits.map(h => ({ text: toks.slice(h.i0, h.i1 + 1).map(t => t.raw).join(' '), level: h.level, cat: h.cat })),
      masked
    };
  }
  // nick: w nickach nie ma spacji, więc szukamy też fragmentów (np. xX_n1gg3r_Xx)
  function maskName(name, s) {
    const cfg = cfgOf(s); if (cfg.mode === 'off') return name;
    const parts = String(name || '').split(/[_\-.\s]+/).map(norm).filter(Boolean);
    const whole = norm(name);
    const bad = test(whole, cfg) || scanTokens(parts, cfg).length || PATS.some(p => p.sub && p.re.test(whole) && !SUB_OK.test(whole));
    return bad ? BLOCK(6) : name;
  }
  // OCR: lines = [{ words: [{ t, x, y, w, h }] }] → słowa do zasłonięcia (z tymi samymi współrzędnymi)
  function lines(ls, s) {
    const cfg = cfgOf(s); if (cfg.mode === 'off') return [];
    const out = [];
    for (const l of ls || []) {
      const ws = l.words || []; if (!ws.length) continue;
      const hits = scanTokens(ws.map(w => norm(w.t)), cfg, ws.map(w => w.t)).filter(h => h.level === 'hard' || cfg.soft);
      for (const h of hits) for (let i = h.i0; i <= h.i1; i++) out.push({ ...ws[i], level: h.level });
    }
    return out;
  }
  window.VMWords = { check, maskName, lines, norm, settings: cfgOf };
})();
