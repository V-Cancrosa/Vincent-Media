/*
  Połączenie z OBS przez wbudowany obs-websocket (OBS 28+, protokół v5).
  - poziom mikrofonu → „mówię / nie mówię” (avatar ożywa)
  - lista scen i przełączanie scen (panel, telefon)
  Hasło: z ustawień panelu albo z wykrywacza (instalator zapisuje je w detector\data\obs-ws.json).
*/
(function () {
  // SHA-256 (strony file:// nie mają crypto.subtle)
  function sha256(bytes) {
    const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const l = bytes.length, withPad = new Uint8Array(((l + 9 + 63) >> 6) << 6);
    withPad.set(bytes); withPad[l] = 0x80;
    const bits = l * 8, dv = new DataView(withPad.buffer);
    dv.setUint32(withPad.length - 4, bits >>> 0); dv.setUint32(withPad.length - 8, Math.floor(bits / 2 ** 32));
    const W = new Uint32Array(64), r = (x, n) => (x >>> n) | (x << (32 - n));
    for (let o = 0; o < withPad.length; o += 64) {
      for (let i = 0; i < 16; i++) W[i] = dv.getUint32(o + i * 4);
      for (let i = 16; i < 64; i++) { const s0 = r(W[i - 15], 7) ^ r(W[i - 15], 18) ^ (W[i - 15] >>> 3), s1 = r(W[i - 2], 17) ^ r(W[i - 2], 19) ^ (W[i - 2] >>> 10); W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0; }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + W[i]) >>> 0;
        const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    const out = new Uint8Array(32); H.forEach((v, i) => new DataView(out.buffer).setUint32(i * 4, v)); return out;
  }
  const utf8 = s => new TextEncoder().encode(s);
  const b64 = bytes => btoa(String.fromCharCode(...bytes));
  const authString = (password, salt, challenge) => b64(sha256(utf8(b64(sha256(utf8(password + salt))) + challenge)));

  const MIC_KINDS = ['wasapi_input_capture', 'coreaudio_input_capture', 'pulse_input_capture', 'alsa_input_capture', 'pipewire-audio-capture-source'];

  // opts: { url, password, mic, threshold (dB), onTalking(bool), onLevel(dB, name), onScenes(list, current), onStatus(text, ok) }
  function connect(opts) {
    let ws = null, closed = false, reqId = 0, talking = false, lastLoud = 0, mic = opts.mic || '', retry = 2000;
    const pending = {};
    const status = (t, ok) => opts.onStatus && opts.onStatus(t, ok);
    function send(op, d) { if (ws && ws.readyState === 1) ws.send(JSON.stringify({ op, d })); }
    function request(type, data) {
      return new Promise((res, rej) => {
        const id = 'r' + (++reqId); pending[id] = { res, rej };
        send(6, { requestType: type, requestId: id, requestData: data || {} });
        setTimeout(() => { if (pending[id]) { delete pending[id]; rej(new Error('timeout')); } }, 5000);
      });
    }
    async function refreshScenes() {
      try { const r = await request('GetSceneList'); opts.onScenes && opts.onScenes(r.scenes.map(s => s.sceneName).reverse(), r.currentProgramSceneName); } catch (e) {}
    }
    async function pickMic() {
      if (mic) return;
      try {
        const r = await request('GetInputList');
        const m = r.inputs.find(i => MIC_KINDS.includes(i.inputKind)) || r.inputs.find(i => /mic|mikro|wej[sś]cie|input/i.test(i.inputName));
        if (m) mic = m.inputName;
      } catch (e) {}
    }
    function open() {
      if (closed) return;
      try { ws = new WebSocket(opts.url || 'ws://localhost:4455'); } catch (e) { status('zły adres OBS', false); return; }
      ws.onmessage = async e => {
        const m = JSON.parse(e.data);
        if (m.op === 0) {
          const d = { rpcVersion: 1, eventSubscriptions: (opts.onScenes ? 4 : 0) | (opts.onOutput ? 64 : 0) | (opts.onTalking || opts.onLevel ? 65536 : 0) };
          if (m.d.authentication) {
            if (!opts.password) { status('OBS wymaga hasła WebSocket', false); ws.close(); return; }
            d.authentication = authString(opts.password, m.d.authentication.salt, m.d.authentication.challenge);
          }
          send(1, d);
        } else if (m.op === 2) {
          retry = 2000; status('połączono z OBS', true);
          if (opts.onTalking || opts.onLevel) pickMic();
          if (opts.onScenes) refreshScenes();
          if (opts.onReady) opts.onReady();
        } else if (m.op === 5) {
          const t = m.d.eventType, data = m.d.eventData;
          if (t === 'InputVolumeMeters') {
            for (const inp of data.inputs) {
              if (mic && inp.inputName !== mic) continue;
              let peak = 0; for (const ch of inp.inputLevelsMul || []) peak = Math.max(peak, ch[1] || 0);
              const db = peak > 0 ? 20 * Math.log10(peak) : -100;
              if (opts.onLevel) opts.onLevel(db, inp.inputName);
              if (!mic) continue;
              const now = Date.now();
              if (db > (opts.threshold ?? -38)) lastLoud = now;
              const next = now - lastLoud < 280;
              if (next !== talking) { talking = next; opts.onTalking && opts.onTalking(talking); }
            }
          } else if (t === 'StreamStateChanged' || t === 'RecordStateChanged') {
            if (opts.onOutput) opts.onOutput(t, data);
          } else if (t === 'CurrentProgramSceneChanged' || t === 'SceneListChanged' || t === 'SceneCreated' || t === 'SceneRemoved' || t === 'SceneNameChanged') refreshScenes();
        } else if (m.op === 7) {
          const p = pending[m.d.requestId]; if (!p) return; delete pending[m.d.requestId];
          if (m.d.requestStatus && m.d.requestStatus.result) p.res(m.d.responseData || {}); else p.rej(new Error((m.d.requestStatus && m.d.requestStatus.comment) || 'błąd'));
        }
      };
      ws.onclose = e => {
        if (closed) return;
        if (e.code === 4009) status('złe hasło OBS WebSocket', false); else status('brak połączenia z OBS (włącz WebSocket w OBS)', false);
        if (talking) { talking = false; opts.onTalking && opts.onTalking(false); }
        setTimeout(open, retry); retry = Math.min(retry * 2, 30000);
      };
    }
    open();
    return {
      setScene: name => request('SetCurrentProgramScene', { sceneName: name }),
      // przełączenie cięciem (nasze przejście zasłania obraz), potem przywrócenie przejścia użytkownika
      async setSceneCut(name) {
        let prev = null;
        try {
          const cur = await request('GetCurrentSceneTransition');
          if (cur.transitionKind !== 'cut_transition') {
            const list = await request('GetSceneTransitionList');
            const cut = (list.transitions || []).find(t => t.transitionKind === 'cut_transition');
            if (cut) { prev = cur.transitionName; await request('SetCurrentSceneTransition', { transitionName: cut.transitionName }); }
          }
        } catch (e) {}
        try { await request('SetCurrentProgramScene', { sceneName: name }); }
        finally { if (prev) setTimeout(() => request('SetCurrentSceneTransition', { transitionName: prev }).catch(() => {}), 400); }
      },
      call: request,
      setMic: name => { mic = name; },
      close: () => { closed = true; try { ws.close(); } catch (e) {} }
    };
  }

  // konfiguracja: ustawienia panelu → wykrywacz (hasło zapisane przez instalator) → domyślna
  async function config(settings) {
    const s = settings || {};
    let url = s.obsUrl, password = s.obsPassword;
    if (!password || !url) {
      try {
        const r = await fetch(window.vmHub(s.localUrl) + '/obsws', { cache: 'no-store' });
        const j = await r.json();
        if (j && j.ok) { url = url || j.url; password = password || j.password; }
      } catch (e) {}
    }
    if (!url) url = 'ws://' + (/^https?:$/.test(location.protocol) && location.hostname ? location.hostname : 'localhost') + ':4455';
    // telefon: OBS jest na komputerze, z którego przyszła strona
    if (/^https?:$/.test(location.protocol) && location.pathname.indexOf('/ui/') === 0) url = url.replace('localhost', location.hostname).replace('127.0.0.1', location.hostname);
    return { url, password: password || '' };
  }

  window.OverlayOBS = { connect, config, sha256 };
})();
