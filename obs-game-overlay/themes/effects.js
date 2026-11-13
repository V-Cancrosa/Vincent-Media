/*
  Efekty pełnoekranowe wywoływane przez widzów (!efekt …) albo nagrodami za punkty kanału („Efekt: konfetti”).
  Rysowane na canvasie w kolorach aktywnego motywu. Grafika własna, CC0.
*/
(function () {
  const TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];

  function heart(g, x, y, s) {
    g.beginPath(); g.moveTo(x, y + s * .3);
    g.bezierCurveTo(x, y, x - s * .5, y, x - s * .5, y + s * .3);
    g.bezierCurveTo(x - s * .5, y + s * .6, x, y + s * .8, x, y + s);
    g.bezierCurveTo(x, y + s * .8, x + s * .5, y + s * .6, x + s * .5, y + s * .3);
    g.bezierCurveTo(x + s * .5, y, x, y, x, y + s * .3); g.fill();
  }
  function star(g, x, y, r) {
    g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r);
    g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill();
  }

  const MAKERS = {
    konfetti(W, H, C) {
      return Array.from({ length: 220 }, () => ({ x: rnd(0, W), y: rnd(-H, 0), vx: rnd(-60, 60), vy: rnd(140, 320), r: rnd(0, TAU), vr: rnd(-6, 6), w: rnd(8, 16), h: rnd(4, 8), c: pick(C),
        draw(g, dt) { this.x += this.vx * dt + Math.sin(this.r) * 30 * dt; this.y += this.vy * dt; this.r += this.vr * dt;
          g.save(); g.translate(this.x, this.y); g.rotate(this.r); g.scale(1, Math.cos(this.r * 1.7)); g.fillStyle = this.c; g.fillRect(-this.w / 2, -this.h / 2, this.w, this.h); g.restore(); } }));
    },
    serca(W, H, C) {
      return Array.from({ length: 70 }, () => ({ x: rnd(0, W), y: H + rnd(0, H * .6), vy: rnd(120, 260), s: rnd(18, 46), ph: rnd(0, TAU), c: pick(['#ff4d6d', '#ff8fab', '#ff2e63', ...C]),
        draw(g, dt) { this.y -= this.vy * dt; this.ph += dt * 3; g.fillStyle = this.c; g.globalAlpha = Math.max(0, Math.min(1, this.y / (H * .4))); heart(g, this.x + Math.sin(this.ph) * 18, this.y, this.s); g.globalAlpha = 1; } }));
    },
    gwiazdy(W, H, C) {
      return Array.from({ length: 120 }, () => { const a = rnd(0, TAU), v = rnd(150, 700); return { x: W / 2, y: H / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: rnd(6, 18), life: rnd(1.5, 3), age: 0, c: pick(['#ffffff', '#ffe066', ...C]),
        draw(g, dt) { this.age += dt; this.vx *= .97; this.vy *= .97; this.x += this.vx * dt; this.y += this.vy * dt; g.globalAlpha = Math.max(0, 1 - this.age / this.life); g.fillStyle = this.c; star(g, this.x, this.y, this.s * (1 + Math.sin(this.age * 12) * .3)); g.globalAlpha = 1; } }; });
    },
    fajerwerki(W, H, C) {
      const parts = [];
      for (let k = 0; k < 6; k++) {
        const cx = rnd(W * .15, W * .85), cy = rnd(H * .15, H * .5), delay = k * .45, c = pick(['#ffd43b', '#ff6fb5', '#4c9dff', '#4cd97b', ...C]);
        for (let i = 0; i < 70; i++) { const a = i / 70 * TAU, v = rnd(220, 380);
          parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, age: -delay, life: 1.8, c,
            draw(g, dt) { this.age += dt; if (this.age < 0) return; this.vx *= .975; this.vy = this.vy * .975 + 220 * dt; this.x += this.vx * dt; this.y += this.vy * dt;
              g.globalAlpha = Math.max(0, 1 - this.age / this.life); g.fillStyle = this.c; g.beginPath(); g.arc(this.x, this.y, 3, 0, TAU); g.fill();
              g.globalAlpha *= .35; g.beginPath(); g.arc(this.x, this.y, 8, 0, TAU); g.fill(); g.globalAlpha = 1; } }); }
      }
      return parts;
    },
    iskry(W, H, C) {
      return Array.from({ length: 260 }, (_, i) => { const left = i % 2 === 0; return { x: left ? 0 : W, y: H, vx: (left ? 1 : -1) * rnd(200, 700), vy: -rnd(500, 1100), age: -rnd(0, 2), life: rnd(1.2, 2.2), c: pick(['#ffb347', '#ffd43b', '#ff7a2f', ...C]),
        draw(g, dt) { this.age += dt; if (this.age < 0) return; this.vy += 900 * dt; this.x += this.vx * dt; this.y += this.vy * dt; g.globalAlpha = Math.max(0, 1 - this.age / this.life); g.strokeStyle = this.c; g.lineWidth = 2.5; g.beginPath(); g.moveTo(this.x, this.y); g.lineTo(this.x - this.vx * .02, this.y - this.vy * .02); g.stroke(); g.globalAlpha = 1; } }; });
    },
    babelki(W, H, C) {
      return Array.from({ length: 90 }, () => ({ x: rnd(0, W), y: H + rnd(0, H), vy: rnd(80, 200), r: rnd(10, 40), ph: rnd(0, TAU), c: pick(['#9fe3ff', '#ffffff', ...C]),
        draw(g, dt) { this.y -= this.vy * dt; this.ph += dt * 2; const x = this.x + Math.sin(this.ph) * 20; g.strokeStyle = this.c; g.lineWidth = 2; g.globalAlpha = .8; g.beginPath(); g.arc(x, this.y, this.r, 0, TAU); g.stroke();
          g.globalAlpha = .5; g.beginPath(); g.arc(x - this.r * .35, this.y - this.r * .35, this.r * .2, 0, TAU); g.fillStyle = '#fff'; g.fill(); g.globalAlpha = 1; } }));
    }
  };

  function run(canvas, name, colors, duration = 6) {
    const make = MAKERS[name];
    if (!make || !canvas) return false;
    const g = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const parts = make(W, H, colors && colors.length ? colors : ['#7c5cff', '#00e1ff']);
    let t0 = performance.now(), last = t0;
    const loop = t => {
      const dt = Math.min(.05, (t - last) / 1000); last = t;
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      for (const p of parts) p.draw(g, dt);
      if (t - t0 < duration * 1000) requestAnimationFrame(loop); else g.clearRect(0, 0, W, H);
    };
    requestAnimationFrame(loop);
    return true;
  }

  window.OverlayEffects = { run, names: Object.keys(MAKERS) };
})();
