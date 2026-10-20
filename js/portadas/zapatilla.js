/*
 * Portada «Kicks» (zapatillas / moda) — portada HORIZONTAL ancha, estilo gráfico urbano.
 * Una zapatilla blanca de perfil sobre un fondo de color vivo, con una palabra gigante detrás (RUN, JUMP, MOVE, FLOW).
 *  - El cursor (o el dedo) inclina la zapatilla; la palabra gigante y la sombra se mueven a otra profundidad.
 *  - Cada clic o toque: una onda de color se expande desde ahí y cambia el fondo y la palabra; la zapatilla salta con líneas de velocidad.
 *  - Sin interacción, cambia sola de color cada ~5 s con la misma onda.
 * Se usa con: <div class="cv cv-kicks"></div>  (el contenido lo crea este archivo). Llamar Kicks.init(contenedor).
 * Cuidado de rendimiento: solo anima mientras se ve en pantalla y con la pestaña visible; con «reducir movimiento»
 * queda la zapatilla quieta sobre el primer color, sin ondas ni saltos.
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var DIR = BASE + 'assets/portadas/zapatilla/';
  // Cada color trae su propia zapatilla (otro modelo), alternando blanca y negra para que siempre contraste con el fondo.
  // «box» = zona visible de cada imagen (fracciones).
  var PALETTE = [
    { bg: '#ff6a1f', word: 'RUN', ink: '#ffffff', ghost: 'rgba(255,255,255,.2)', shoe: 'zapatilla.webp', box: { x0: 0.0159, x1: 0.9864, y0: 0.2552, y1: 0.7568 } },
    { bg: '#c6f432', word: 'FLOW', ink: '#10140a', ghost: 'rgba(16,20,10,.14)', shoe: 'alta.webp', box: { x0: 0.004, x1: 0.9928, y0: 0.1818, y1: 0.807 } },
    { bg: '#2b59ff', word: 'JUMP', ink: '#ffffff', ghost: 'rgba(255,255,255,.2)', shoe: 'casual.webp', box: { x0: 0.0152, x1: 0.9936, y0: 0.2783, y1: 0.7185 } },
    { bg: '#ff3d8b', word: 'MOVE', ink: '#ffffff', ghost: 'rgba(255,255,255,.22)', shoe: 'chunky.webp', box: { x0: 0.008, x1: 0.992, y0: 0.2002, y1: 0.7895 } }
  ];
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  var outBack = function (t) { var c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

  function init(el) {
    if (!el || el.__kicks) return;
    el.__kicks = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<canvas class="cv__bg" aria-hidden="true"></canvas>' +
      '<div class="cv__word"><span class="cv__word-t">RUN</span></div>' +
      '<div class="cv__shadow"></div>' +
      '<canvas class="cv__fx" aria-hidden="true"></canvas>' +
      '<div class="cv__shoes"></div>' +
      '<div class="cv__logo">KICKS</div>' +
      '<div class="cv__sub">Nueva colección</div>' +
      '<span class="cv__btn">Comprar ahora</span>';
    var bg = el.querySelector('.cv__bg'), bctx = bg.getContext('2d'), fx = el.querySelector('.cv__fx'), fctx = fx.getContext('2d'),
        wordBox = el.querySelector('.cv__word'), wordEl = el.querySelector('.cv__word-t'), shadow = el.querySelector('.cv__shadow'), shoesBox = el.querySelector('.cv__shoes');
    var shoes = PALETTE.map(function (c) { var im = new Image(); im.className = 'cv__shoe'; im.alt = ''; im.draggable = false; im.src = DIR + c.shoe; shoesBox.appendChild(im); return { el: im, box: c.box, side: 0, sx: 0, sy: 0 }; });
    var prev = -1, changeT = -1e9;

    var W = 0, H = 0, U = 0, dpr = 1, cx = 0, cy = 0, base = 0, cur = 0;
    var waves = [], lines = [], puffs = [], lastT = 0, jumpT = -1e9, lastTap = -1e9, lastAuto = 0, wordTimer = 0;
    var ptr = { x: 0, y: 0, in: false }, lp = { x: 0, y: 0 };
    var t0 = performance.now();
    var vis = true, running = false, raf = 0;

    function applyInk(i) {
      var c = PALETTE[i]; el.style.setProperty('--ink', c.ink); el.style.setProperty('--ghost', c.ghost);
    }
    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      U = H; dpr = Math.min(window.devicePixelRatio || 1, 2);
      [bg, fx].forEach(function (c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // cada zapatilla se ajusta para ocupar como máximo ~48 % del ancho y ~64 % del alto, centrada
      cx = W * 0.6; cy = H * 0.5;
      shoes.forEach(function (sh) {
        var b = sh.box, cw = b.x1 - b.x0, chh = b.y1 - b.y0;
        var ch = Math.min(H * 0.64, (W * 0.44 / cw) * chh);
        sh.side = ch / chh; sh.sx = cx - sh.side * (b.x0 + b.x1) / 2; sh.sy = cy - sh.side * (b.y0 + b.y1) / 2;
        sh.el.style.cssText = 'width:' + sh.side + 'px;height:' + sh.side + 'px;left:' + sh.sx + 'px;top:' + sh.sy + 'px;transform-origin:50% ' + (b.y1 * 100) + '%;';
      });
      var cs = shoes[cur], gw = cs.side * (cs.box.x1 - cs.box.x0) * 0.8, groundY = cs.sy + cs.side * cs.box.y1;
      shadow.style.cssText = 'width:' + gw + 'px;height:' + (H * 0.07) + 'px;left:' + (cx - gw / 2) + 'px;top:' + (groundY - H * 0.015) + 'px;';
      applyInk(cur);
    }

    function startWave(x, y, to) {
      waves.push({ x: x, y: y, age: 0, life: 0.75, color: PALETTE[to].bg, to: to });
      applyInk(to);
      clearTimeout(wordTimer); wordEl.classList.add('swap');
      wordTimer = setTimeout(function () { wordEl.textContent = PALETTE[to].word; wordEl.classList.remove('swap'); }, 230);
    }
    function change(now, x, y, jump) {
      prev = cur; cur = (cur + 1) % PALETTE.length; changeT = now; startWave(x, y, cur);
      var ns = shoes[cur], B = ns.box;
      var gw0 = ns.side * (B.x1 - B.x0) * 0.8, gy0 = ns.sy + ns.side * B.y1;
      shadow.style.width = gw0 + 'px'; shadow.style.left = (cx - gw0 / 2) + 'px'; shadow.style.top = (gy0 - H * 0.015) + 'px';
      if (jump) {
        jumpT = now;
        for (var i = 0; i < 16; i++) lines.push({ x: ns.sx + ns.side * (B.x0 + 0.1 + Math.random() * 0.7), y: ns.sy + ns.side * (B.y0 + Math.random() * (B.y1 - B.y0)), len: U * (0.12 + Math.random() * 0.28), age: 0, life: 0.5 + Math.random() * 0.3, w: Math.max(1, U * (0.004 + Math.random() * 0.006)) });
        for (var k = 0; k < 10; k++) puffs.push({ x: ns.sx + ns.side * (B.x0 + 0.1 + Math.random() * 0.8), y: ns.sy + ns.side * B.y1, vx: (Math.random() - 0.5) * U * 0.5, vy: -U * (0.05 + Math.random() * 0.2), r: U * (0.015 + Math.random() * 0.03), age: 0, life: 0.5 + Math.random() * 0.4 });
      }
    }

    function drawBg(dt) {
      bctx.fillStyle = PALETTE[base].bg; bctx.fillRect(0, 0, W, H);
      for (var i = 0; i < waves.length; i++) {
        var w = waves[i]; w.age += dt;
        var far = Math.max(Math.hypot(w.x, w.y), Math.hypot(W - w.x, w.y), Math.hypot(w.x, H - w.y), Math.hypot(W - w.x, H - w.y));
        var f = clamp(w.age / w.life, 0, 1), rad = ease(f) * far * 1.02;
        bctx.fillStyle = w.color; bctx.beginPath(); bctx.arc(w.x, w.y, rad, 0, 6.2832); bctx.fill();
        if (f >= 1) { base = w.to; waves.splice(i, 1); i--; }
      }
    }
    function drawFx(dt) {
      fctx.clearRect(0, 0, W, H);
      var inkIsDark = PALETTE[cur].ink !== '#ffffff', col = inkIsDark ? '16,20,10' : '255,255,255';
      for (var i = lines.length - 1; i >= 0; i--) {
        var l = lines[i]; l.age += dt; if (l.age > l.life) { lines.splice(i, 1); continue; }
        var k = l.age / l.life;
        fctx.strokeStyle = 'rgba(' + col + ',' + ((1 - k) * 0.75).toFixed(2) + ')'; fctx.lineWidth = l.w; fctx.lineCap = 'round';
        var x = l.x - U * 0.5 * k; fctx.beginPath(); fctx.moveTo(x, l.y); fctx.lineTo(x - l.len * (1 - k * 0.4), l.y); fctx.stroke();
      }
      for (var j = puffs.length - 1; j >= 0; j--) {
        var p = puffs[j]; p.age += dt; if (p.age > p.life) { puffs.splice(j, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= (1 - 2 * dt);
        var kk = p.age / p.life;
        fctx.fillStyle = 'rgba(' + col + ',' + ((1 - kk) * 0.35).toFixed(2) + ')'; fctx.beginPath(); fctx.arc(p.x, p.y, p.r * (0.6 + kk), 0, 6.2832); fctx.fill();
      }
    }

    function place(now, t, dt) {
      lp.x += (ptr.x - lp.x) * 0.09; lp.y += (ptr.y - lp.y) * 0.09;
      var nx = ptr.in ? clamp((lp.x - W / 2) / (W / 2), -1, 1) : Math.sin(t * 0.55) * 0.35;
      var ny = ptr.in ? clamp((lp.y - H / 2) / (H / 2), -1, 1) : Math.cos(t * 0.45) * 0.2;
      var enter = reduce ? 1 : clamp((t - 0.05) / 0.9, 0, 1), ea = outBack(enter);
      var ja = (now - jumpT) / 1000, jy = 0, jr = 0;
      if (ja >= 0 && ja < 0.9 && !reduce) { jy = -Math.sin(Math.min(1, ja / 0.55) * Math.PI) * U * (ja < 0.55 ? 0.17 : 0) * 1; jr = -6 * Math.sin(Math.min(1, ja / 0.55) * Math.PI); if (ja > 0.55) { var s = (ja - 0.55) / 0.35; jy = Math.exp(-7 * s) * Math.cos(14 * s) * U * 0.012; } }
      var fl = reduce ? 0 : Math.sin(t * 1.5) * U * 0.006;
      var ca = (now - changeT) / 1000;
      for (var i = 0; i < shoes.length; i++) {
        var sh = shoes[i], op = 0, tx = 0, ty = 0, rot = 0, sc = 1;
        if (i === cur) {
          var inT = prev < 0 ? 0 : clamp((ca - 0.15) / 0.55, 0, 1), k = prev < 0 ? 1 : outBack(inT);
          op = prev < 0 ? Math.min(1, enter * 2) : Math.min(1, inT * 3);
          tx = prev < 0 ? 0 : (1 - k) * U * 1.1; ty = prev < 0 ? (1 - ea) * U * 0.4 : 0; rot = prev < 0 ? 0 : (1 - k) * 14;
        } else if (i === prev && ca < 0.4 && !reduce) {
          var g = clamp(ca / 0.4, 0, 1); op = 1 - g; tx = -g * U * 0.9; rot = -g * 12; sc = 1 - g * 0.1;
        }
        // la zapatilla actual responde claramente al cursor: se inclina, se acerca y se desplaza hacia él
        var live = i === cur ? 1 : 0;
        sh.el.style.opacity = op.toFixed(3);
        sh.el.style.transform = 'perspective(1000px) translate3d(' + (tx + live * nx * U * 0.09).toFixed(2) + 'px,' + (ty + live * (jy + fl + ny * U * 0.05)).toFixed(2) + 'px,0) rotateY(' + (live * nx * 20).toFixed(2) + 'deg) rotateX(' + (-live * ny * 12).toFixed(2) + 'deg) rotateZ(' + (rot + live * jr).toFixed(2) + 'deg) scale(' + (sc * (1 + live * Math.abs(nx) * 0.04)).toFixed(4) + ')';
      }
      var lift = clamp(-jy / (U * 0.17), 0, 1);
      shadow.style.opacity = (0.5 * Math.min(1, enter * 2) * (1 - lift * 0.6)).toFixed(2);
      shadow.style.transform = 'translate3d(' + (nx * U * 0.05).toFixed(2) + 'px,0,0) scaleX(' + (1 - lift * 0.3).toFixed(3) + ')';
      wordBox.style.transform = 'translate3d(' + (-nx * U * 0.07).toFixed(2) + 'px,' + (-ny * U * 0.025).toFixed(2) + 'px,0)';
      if (!reduce && t > 3 && now - lastTap > 5200 && now - lastAuto > 5200) { lastAuto = now; change(now, W * (0.2 + Math.random() * 0.6), H * (0.2 + Math.random() * 0.6), false); }
    }

    function frame(now) {
      raf = 0; if (!running) return;
      var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016; lastT = now;
      var t = (now - t0) / 1000;
      place(now, t, dt); drawBg(dt); drawFx(dt);
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      var go = vis && !document.hidden && !reduce;
      if (go && !running) { running = true; lastT = 0; if (!raf) raf = requestAnimationFrame(frame); }
      else if (!go) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    }
    function setPtr(ev) { var r = el.getBoundingClientRect(); ptr.x = ev.clientX - r.left; ptr.y = ev.clientY - r.top; ptr.in = true; }
    el.addEventListener('pointerenter', setPtr);
    el.addEventListener('pointermove', setPtr, { passive: true });
    el.addEventListener('pointerleave', function () { ptr.in = false; });
    el.addEventListener('pointerdown', function (ev) { setPtr(ev); var now = performance.now(); lastTap = now; lastAuto = now; change(now, ptr.x, ptr.y, true); });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') ptr.in = false; });
    el.addEventListener('pointercancel', function () { ptr.in = false; });

    layout(); bctx.fillStyle = PALETTE[0].bg; bctx.fillRect(0, 0, W, H);
    if (global.ResizeObserver) new ResizeObserver(layout).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    if (reduce) { place(t0 + 5000, 5, 0.016); drawBg(0.016); }
    sync();
  }

  global.Kicks = { init: init };
})(window);
