/*
 * Portada «Pulse Fit» (gimnasio) — portada CIRCULAR. Un anillo de actividad de neón alrededor de un objeto de gimnasio.
 * Cada clic o toque cambia el objeto: pesa rusa → mancuerna → guantes de boxeo → trofeo (la meta). El anillo se llena como
 * un reloj (3, 6, 9 y 12 h) y un indicador fijo «1 · 2 · 3 · ★» muestra en qué paso va. Al llegar al trofeo: destello y «¡META!»,
 * y luego vuelve a empezar. Si nadie la toca, hace sola una demostración del recorrido completo de vez en cuando.
 * Se usa con: <div class="cv cv-pulse"></div>  (el contenido lo crea este archivo). Llamar PulseFit.init(contenedor).
 * Cuidado de rendimiento: solo anima mientras se ve en pantalla y con la pestaña visible; pocas partículas;
 * con «reducir movimiento» queda la pesa quieta con el primer paso marcado.
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var DIR = BASE + 'assets/portadas/pulse-fit/';
  // Objetos: archivo y zona visible de cada imagen (fracciones de la imagen cuadrada). Todos se ajustan al mismo recuadro.
  // Todos los objetos se centran en el MISMO recuadro (mismo espacio arriba y abajo) y ocupan el mayor tamaño que cabe en él.
  // «dy» = pequeño desplazamiento vertical (fracción del diámetro) para que la zona lisa de cada objeto quede bajo el número,
  // que va siempre en el mismo punto, en el centro del recuadro.
  var OBJS = [
    { f: 'pesa.webp', x0: 0.1435, x1: 0.8804, y0: 0.0478, y1: 0.9705, dy: -0.055 },
    { f: 'balon.webp', x0: 0.0981, x1: 0.9067, y0: 0.0925, y1: 0.9083, dy: 0 },
    { f: 'guante.webp', x0: 0.2121, x1: 0.8118, y0: 0.0431, y1: 0.9609, dy: 0.005 },
    { f: 'trofeo.webp', x0: 0.0797, x1: 0.9195, y0: 0.0542, y1: 0.9633, dy: 0.025 }
  ];
  var LAST = OBJS.length - 1;
  var LIME = '184,255,60';
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var outBack = function (t) { var c1 = 1.8, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

  function init(el) {
    if (!el || el.__pulse) return;
    el.__pulse = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<div class="cv__light"></div>' +
      '<canvas class="cv__ring" aria-hidden="true"></canvas>' +
      '<div class="cv__objs"></div>' +
      '<canvas class="cv__fx" aria-hidden="true"></canvas>' +
      '<div class="cv__count"><span class="cv__num">1</span></div>' +
      '<div class="cv__logo"><span class="cv__logo-t"><b>PULSE</b> FIT</span><span class="cv__logo-m">¡META!</span></div>';
    var light = el.querySelector('.cv__light'), ring = el.querySelector('.cv__ring'), rctx = ring.getContext('2d'),
        box = el.querySelector('.cv__objs'), fx = el.querySelector('.cv__fx'), fctx = fx.getContext('2d'),
        countBox = el.querySelector('.cv__count'), numEl = el.querySelector('.cv__num'), logoEl = el.querySelector('.cv__logo');
    var objs = OBJS.map(function (o) { var im = new Image(); im.className = 'cv__obj'; im.alt = ''; im.draggable = false; im.src = DIR + o.f; box.appendChild(im); return { o: o, el: im }; });

    var W = 0, H = 0, U = 0, dpr = 1, cx = 0, cy = 0, ocx = 0, ocy = 0, nx = 0, ny = 0;
    var step = 0, prev = -1, changeT = -1e9, shown = 0.25, flash = 0, ringFlash = 0, metaT = -1e9;
    var lastTap = -1e9, lastAutoStart = 0, autoLeft = 0, autoNext = 0;
    var waves = [], sparks = [], lastT = 0;
    var ptr = { x: 0, y: 0, in: false }, lp = { x: 0, y: 0 };
    var t0 = performance.now() - (parseFloat((/[?&]t=([0-9.]+)/.exec(location.search) || [])[1]) || 0) * 1000;
    var vis = true, running = false, raf = 0;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      U = Math.min(W, H); dpr = Math.min(window.devicePixelRatio || 1, 2);
      [ring, fx].forEach(function (c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
      rctx.setTransform(dpr, 0, 0, dpr, 0, 0); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2; ocx = cx; ocy = H * 0.395;
      // recuadro común y punto fijo del número (su centro)
      nx = cx; ny = H * 0.46;
      var maxW = U * 0.5, maxH = U * 0.5;
      objs.forEach(function (ob) {
        var o = ob.o, cw = o.x1 - o.x0, chh = o.y1 - o.y0, mx = o.x0 + cw / 2, my = o.y0 + chh / 2;
        var side = Math.min(maxW / cw, maxH / chh);
        ob.left = nx - side * mx; ob.top = (ny + o.dy * U) - side * my;
        ob.el.style.cssText = 'width:' + side + 'px;height:' + side + 'px;left:' + ob.left + 'px;top:' + ob.top + 'px;transform-origin:' + (mx * 100) + '% ' + (my * 100) + '%;';
      });
      ocx = cx; ocy = ny;
      countBox.style.cssText = 'left:' + nx + 'px;top:' + ny + 'px;';
    }

    function burst(n, power) {
      for (var i = 0; i < n; i++) {
        var a = Math.random() * 6.2832, v = U * (0.25 + Math.random() * 0.5) * power;
        sparks.push({ x: ocx + Math.cos(a) * U * 0.1, y: ocy + Math.sin(a) * U * 0.1, vx: Math.cos(a) * v, vy: Math.sin(a) * v - U * 0.05, age: 0, life: 0.5 + Math.random() * 0.5, r: U * (0.004 + Math.random() * 0.006) });
      }
    }
    function setStepUI() {
      numEl.textContent = String(step + 1);
      numEl.classList.remove('pop'); void numEl.offsetWidth; numEl.classList.add('pop');
      logoEl.classList.toggle('meta', step === LAST);
    }
    function go(now, to) {
      prev = step; step = to; changeT = now; ringFlash = 1;
      waves.push({ age: 0, life: 0.7, amp: 1 });
      burst(step === LAST ? 90 : 22, step === LAST ? 1.5 : 1);
      if (step === LAST) { metaT = now; flash = 1; waves.push({ age: -0.18, life: 0.95, amp: 1 }); waves.push({ age: -0.36, life: 1.15, amp: 0.9 }); }
      setStepUI();
    }
    function next(now) { go(now, step >= LAST ? 0 : step + 1); }

    function drawRing(t, dt) {
      rctx.clearRect(0, 0, W, H);
      var R = U * 0.455, lw = U * 0.034;
      shown += ((step + 1) / OBJS.length - shown) * Math.min(1, dt * 8);
      ringFlash *= Math.max(0, 1 - dt * 4.5); flash *= Math.max(0, 1 - dt * 1.3);
      rctx.save(); rctx.translate(cx, cy); rctx.rotate(t * 0.12);
      for (var i = 0; i < 60; i++) {
        var a = i / 60 * 6.2832, long = i % 5 === 0, r1 = U * (long ? 0.385 : 0.395), r2 = U * 0.408;
        rctx.strokeStyle = 'rgba(255,255,255,' + (long ? 0.22 : 0.1) + ')'; rctx.lineWidth = Math.max(1, U * (long ? 0.006 : 0.004));
        rctx.beginPath(); rctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); rctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); rctx.stroke();
      }
      rctx.restore();
      rctx.lineCap = 'round'; rctx.lineWidth = lw;
      rctx.strokeStyle = 'rgba(255,255,255,0.09)'; rctx.beginPath(); rctx.arc(cx, cy, R, 0, 6.2832); rctx.stroke();
      // marcas de reloj en 12, 3, 6 y 9: son los cuatro pasos
      for (var q = 0; q < 4; q++) {
        var qa = -Math.PI / 2 + q * Math.PI / 2, lit = q <= step;
        rctx.fillStyle = lit ? 'rgba(' + LIME + ',1)' : 'rgba(255,255,255,0.28)';
        rctx.beginPath(); rctx.arc(cx + Math.cos(qa) * R, cy + Math.sin(qa) * R, lw * 0.5, 0, 6.2832); rctx.fill();
      }
      var frac = clamp(shown, 0, 1);
      if (frac > 0.003) {
        var a0 = -Math.PI / 2, a1 = a0 + frac * 6.2832;
        rctx.shadowColor = 'rgba(' + LIME + ',' + (0.7 + 0.3 * ringFlash).toFixed(2) + ')'; rctx.shadowBlur = U * (0.04 + 0.05 * ringFlash + 0.07 * flash);
        rctx.strokeStyle = 'rgb(' + LIME + ')'; rctx.lineWidth = lw * (1 + 0.25 * ringFlash);
        rctx.beginPath(); rctx.arc(cx, cy, R, a0, a1); rctx.stroke(); rctx.shadowBlur = 0;
        rctx.fillStyle = 'rgba(255,255,230,' + (0.7 + 0.3 * ringFlash).toFixed(2) + ')';
        rctx.beginPath(); rctx.arc(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R, lw * 0.36, 0, 6.2832); rctx.fill();
      }
      for (var w = waves.length - 1; w >= 0; w--) {
        var wv = waves[w]; wv.age += dt; if (wv.age > wv.life) { waves.splice(w, 1); continue; }
        if (wv.age < 0) continue;
        var f = wv.age / wv.life, rad = U * (0.12 + f * 0.35);
        rctx.strokeStyle = 'rgba(' + LIME + ',' + (Math.pow(1 - f, 1.4) * 0.8 * wv.amp).toFixed(3) + ')'; rctx.lineWidth = Math.max(1, U * 0.016 * (1 - f * 0.6));
        rctx.beginPath(); rctx.arc(cx, cy, rad, 0, 6.2832); rctx.stroke();
      }
      if (flash > 0.01) {
        var g = rctx.createRadialGradient(cx, cy, 0, cx, cy, U * 0.5);
        g.addColorStop(0, 'rgba(' + LIME + ',' + (0.38 * flash).toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + LIME + ',0)');
        rctx.fillStyle = g; rctx.fillRect(0, 0, W, H);
      }
    }

    function drawSparks(dt) {
      fctx.clearRect(0, 0, W, H);
      fctx.globalCompositeOperation = 'lighter';
      for (var i = sparks.length - 1; i >= 0; i--) {
        var p = sparks[i]; p.age += dt; if (p.age > p.life) { sparks.splice(i, 1); continue; }
        p.vy += U * 0.45 * dt; p.vx *= (1 - 1.2 * dt); p.x += p.vx * dt; p.y += p.vy * dt;
        var k = 1 - p.age / p.life, sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1, tl = Math.min(U * 0.05, sp * 0.03);
        fctx.strokeStyle = 'rgba(' + LIME + ',' + (k * 0.9).toFixed(2) + ')'; fctx.lineWidth = Math.max(1, p.r * 1.3); fctx.lineCap = 'round';
        fctx.beginPath(); fctx.moveTo(p.x, p.y); fctx.lineTo(p.x - p.vx / sp * tl, p.y - p.vy / sp * tl); fctx.stroke();
        fctx.fillStyle = 'rgba(235,255,200,' + k.toFixed(2) + ')'; fctx.beginPath(); fctx.arc(p.x, p.y, p.r * k, 0, 6.2832); fctx.fill();
      }
      fctx.globalCompositeOperation = 'source-over';
    }

    function place(now, t, dt) {
      lp.x += (ptr.x - lp.x) * 0.08; lp.y += (ptr.y - lp.y) * 0.08;
      var enter = reduce ? 1 : clamp((t - 0.05) / 0.9, 0, 1);
      var px = (lp.x - cx) / (U * 0.5), py = (lp.y - cy) / (U * 0.5); if (!ptr.in) { px = 0; py = 0; }
      var float = reduce ? 0 : Math.sin(t * 1.6) * U * 0.004;
      var ca = (now - changeT) / 1000;
      for (var i = 0; i < objs.length; i++) {
        var ob = objs[i], op = 0, sc = 1, rot = 0, ty = 0;
        if (i === step) {
          if (ca < 0.1 && prev >= 0 && !reduce) { op = 0; }
          else {
            var f = reduce ? 1 : clamp((ca - 0.1) / 0.55, 0, 1), k = f < 1 ? outBack(f) : 1;
            op = Math.min(1, f * 4) * (reduce ? 1 : 1); sc = 0.55 + 0.45 * k; rot = (1 - k) * -10;
            // golpecito de impacto al llegar
            var kick = ca > 0.1 && ca < 1.2 ? Math.exp(-7 * (ca - 0.1)) * Math.cos(17 * (ca - 0.1)) : 0;
            ty = U * 0.012 * kick; sc *= 1 - 0.05 * kick;
          }
          if (step === 0 && prev < 0) { var fe = reduce ? 1 : enter; op = Math.min(1, fe * 2.2); ty = (1 - outBack(fe)) * -U * 0.5; sc = 1; rot = 0; }
        } else if (i === prev && ca < 0.16 && !reduce) {
          var g = ca / 0.16; op = 1 - g; sc = 1 - g * 0.3; rot = g * 14;
        }
        ob.el.style.opacity = op.toFixed(3);
        ob.el.style.transform = 'translate3d(' + (px * U * 0.012).toFixed(2) + 'px,' + (ty + float + py * U * 0.008).toFixed(2) + 'px,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + sc.toFixed(4) + ')';
      }
      var gx = cx + (ptr.in ? clamp(px, -1, 1) * U * 0.3 : Math.sin(t * 0.7) * U * 0.12), gy = cy + (ptr.in ? clamp(py, -1, 1) * U * 0.3 : Math.cos(t * 0.5) * U * 0.1);
      light.style.transform = 'translate3d(' + (gx - cx).toFixed(1) + 'px,' + (gy - cy).toFixed(1) + 'px,0)';
      light.style.opacity = (0.55 + 0.25 * Math.sin(t * 2.1) + 0.35 * flash + 0.25 * ringFlash).toFixed(2);
      countBox.style.opacity = enter;
      // meta: a los 2,2 s vuelve a empezar; sin toques, a los 5,5 s vuelve al primer paso
      if (step === LAST && now - metaT > 2200) go(now, 0);
      else if (!reduce && step > 0 && step < LAST && now - lastTap > 5500) go(now, 0);
      // demostración sola: recorre los 4 pasos cada ~11 s si nadie interactúa
      if (!reduce && t > 2.4 && now - lastTap > 6500) {
        if (autoLeft === 0 && now - lastAutoStart > 11000 && step === 0) { autoLeft = LAST; autoNext = now; lastAutoStart = now; }
        if (autoLeft > 0 && now >= autoNext) { next(now); autoLeft--; autoNext = now + 900; }
      } else if (now - lastTap <= 6500) autoLeft = 0;
    }

    function frame(now) {
      raf = 0; if (!running) return;
      var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016; lastT = now;
      var t = (now - t0) / 1000;
      place(now, t, dt); drawRing(t, dt); drawSparks(dt);
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      var go2 = vis && !document.hidden && !reduce;
      if (go2 && !running) { running = true; lastT = 0; if (!raf) raf = requestAnimationFrame(frame); }
      else if (!go2) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    }
    function setPtr(ev) { var r = el.getBoundingClientRect(); ptr.x = ev.clientX - r.left; ptr.y = ev.clientY - r.top; ptr.in = true; }
    el.addEventListener('pointerenter', setPtr);
    el.addEventListener('pointermove', setPtr, { passive: true });
    el.addEventListener('pointerleave', function () { ptr.in = false; });
    el.addEventListener('pointerdown', function (ev) {
      setPtr(ev); var now = performance.now(); lastTap = now; autoLeft = 0;
      if (step !== LAST) next(now);          // en la meta no se interrumpe el destello
    });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') ptr.in = false; });
    el.addEventListener('pointercancel', function () { ptr.in = false; });

    setStepUI();
    layout();
    if (global.ResizeObserver) new ResizeObserver(layout).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    if (reduce) { place(t0 + 5000, 5, 0.016); drawRing(5, 0.016); }
    sync();
  }

  global.PulseFit = { init: init };
})(window);
