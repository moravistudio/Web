/*
 * Portada «Pulse Fit» (gimnasio) — portada CIRCULAR. Una pesa rusa dentro de un anillo de actividad de neón.
 * Cada clic o toque suma una repetición: la pesa se contrae con un impacto, salen chispas y una onda de energía,
 * el contador sube y el anillo se llena. Al llegar a 10: destello, «¡META!» y el anillo se vacía para volver a empezar.
 * Si nadie la toca, el anillo se vacía despacio, y de vez en cuando hace una demostración sola de 3 repeticiones.
 * Se usa con: <div class="cv cv-pulse"></div>  (el contenido lo crea este archivo). Llamar PulseFit.init(contenedor).
 * Cuidado de rendimiento: solo anima mientras se ve en pantalla y con la pestaña visible; pocas partículas;
 * con «reducir movimiento» queda la pesa quieta con el anillo a medias.
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var IMG = BASE + 'assets/portadas/pulse-fit/pesa.webp';
  var GOAL = 10;
  // Contenido visible de la imagen (fracciones de la imagen cuadrada): x 0.1435–0.8795, y 0.047–0.969
  var C = { x0: 0.1435, x1: 0.8795, y0: 0.047, y1: 0.969 };
  var LIME = '184,255,60';
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var outBack = function (t) { var c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

  function init(el) {
    if (!el || el.__pulse) return;
    el.__pulse = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<div class="cv__light"></div>' +
      '<canvas class="cv__ring" aria-hidden="true"></canvas>' +
      '<img class="cv__bell" alt="" draggable="false">' +
      '<div class="cv__count"><span class="cv__num">0</span></div>' +
      '<canvas class="cv__fx" aria-hidden="true"></canvas>' +
      '<div class="cv__logo"><b>PULSE</b> FIT</div>';
    var light = el.querySelector('.cv__light'), ring = el.querySelector('.cv__ring'), rctx = ring.getContext('2d'),
        bell = el.querySelector('.cv__bell'), countBox = el.querySelector('.cv__count'), num = el.querySelector('.cv__num'),
        fx = el.querySelector('.cv__fx'), fctx = fx.getContext('2d');
    bell.src = IMG;

    var W = 0, H = 0, U = 0, dpr = 1, cx = 0, cy = 0, bw = 0, bx = 0, by = 0;
    var reps = 0, shown = 0, flash = 0, kick = 0, kickT = -9, metaT = -9, lastTap = -1e9, lastAutoStart = 0, autoLeft = 0, autoNext = 0, drainAcc = 0;
    var waves = [], sparks = [], lastT = 0, ringFlash = 0;
    var ptr = { x: 0, y: 0, in: false }, lp = { x: 0, y: 0 };
    var t0 = performance.now() - (parseFloat((/[?&]t=([0-9.]+)/.exec(location.search) || [])[1]) || 0) * 1000;
    var vis = true, running = false, raf = 0;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      U = Math.min(W, H); dpr = Math.min(window.devicePixelRatio || 1, 2);
      [ring, fx].forEach(function (c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
      rctx.setTransform(dpr, 0, 0, dpr, 0, 0); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2;
      // la pesa: su contenido mide ~44 % del diámetro de ancho y queda centrada un poco más arriba (deja sitio al logo)
      var contentW = U * 0.43; bw = contentW / (C.x1 - C.x0);
      var contentCx = (C.x0 + C.x1) / 2, contentTop = C.y0;
      bx = cx - bw * contentCx; by = U * 0.155 - bw * contentTop;
      bell.style.cssText = 'width:' + bw + 'px;height:' + bw + 'px;left:' + bx + 'px;top:' + by + 'px;transform-origin:50% ' + (C.y1 * 100) + '%;';
      // el contador va sobre el cuerpo esférico de la pesa
      countBox.style.cssText = 'left:' + cx + 'px;top:' + (by + bw * 0.665) + 'px;';
    }

    function burst(n, power) {
      var ox = cx, oy = by + bw * 0.62;
      for (var i = 0; i < n; i++) {
        var a = Math.random() * 6.2832, v = U * (0.25 + Math.random() * 0.5) * power;
        sparks.push({ x: ox + Math.cos(a) * U * 0.12, y: oy + Math.sin(a) * U * 0.12, vx: Math.cos(a) * v, vy: Math.sin(a) * v - U * 0.05, age: 0, life: 0.5 + Math.random() * 0.5, r: U * (0.004 + Math.random() * 0.006) });
      }
    }
    function rep(now, silent) {
      if (reps >= GOAL) return;
      reps++; kick = 1; kickT = now; ringFlash = 1;
      waves.push({ age: 0, life: 0.7, amp: 1 });
      burst(reps >= GOAL ? 90 : 20, reps >= GOAL ? 1.5 : 1);
      num.textContent = String(reps);
      num.classList.remove('pop'); void num.offsetWidth; num.classList.add('pop');
      if (reps >= GOAL) {
        metaT = now; flash = 1; num.textContent = '¡META!'; countBox.classList.add('meta');
        waves.push({ age: -0.18, life: 0.95, amp: 1 }); waves.push({ age: -0.36, life: 1.15, amp: 0.9 });
      }
    }

    function drawRing(now, t, dt) {
      rctx.clearRect(0, 0, W, H);
      var R = U * 0.455, lw = U * 0.034;
      // llenado suave hacia reps
      shown += (reps - shown) * Math.min(1, dt * 9);
      ringFlash *= Math.max(0, 1 - dt * 4.5); flash *= Math.max(0, 1 - dt * 1.3);
      // marcas técnicas que giran despacio
      rctx.save(); rctx.translate(cx, cy); rctx.rotate(t * 0.12);
      for (var i = 0; i < 60; i++) {
        var a = i / 60 * 6.2832, long = i % 5 === 0, r1 = U * (long ? 0.385 : 0.395), r2 = U * 0.408;
        rctx.strokeStyle = 'rgba(255,255,255,' + (long ? 0.22 : 0.1) + ')'; rctx.lineWidth = Math.max(1, U * (long ? 0.006 : 0.004));
        rctx.beginPath(); rctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); rctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); rctx.stroke();
      }
      rctx.restore();
      // pista del anillo
      rctx.lineCap = 'round'; rctx.lineWidth = lw;
      rctx.strokeStyle = 'rgba(255,255,255,0.09)'; rctx.beginPath(); rctx.arc(cx, cy, R, 0, 6.2832); rctx.stroke();
      // progreso
      var frac = clamp(shown / GOAL, 0, 1);
      if (frac > 0.003) {
        var a0 = -Math.PI / 2, a1 = a0 + frac * 6.2832;
        rctx.shadowColor = 'rgba(' + LIME + ',' + (0.7 + 0.3 * ringFlash).toFixed(2) + ')'; rctx.shadowBlur = U * (0.04 + 0.05 * ringFlash + 0.07 * flash);
        rctx.strokeStyle = 'rgb(' + LIME + ')'; rctx.lineWidth = lw * (1 + 0.25 * ringFlash);
        rctx.beginPath(); rctx.arc(cx, cy, R, a0, a1); rctx.stroke();
        rctx.shadowBlur = 0;
        // punta brillante
        rctx.fillStyle = 'rgba(255,255,230,' + (0.7 + 0.3 * ringFlash).toFixed(2) + ')';
        rctx.beginPath(); rctx.arc(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R, lw * 0.36, 0, 6.2832); rctx.fill();
      }
      // ondas de energía que salen de la pesa y recorren el círculo hasta el anillo
      for (var w = waves.length - 1; w >= 0; w--) {
        var wv = waves[w]; wv.age += dt; if (wv.age > wv.life) { waves.splice(w, 1); continue; }
        if (wv.age < 0) continue;
        var f = wv.age / wv.life, rad = U * (0.12 + f * 0.35);
        rctx.strokeStyle = 'rgba(' + LIME + ',' + (Math.pow(1 - f, 1.4) * 0.8 * wv.amp).toFixed(3) + ')'; rctx.lineWidth = Math.max(1, U * 0.016 * (1 - f * 0.6));
        rctx.beginPath(); rctx.arc(cx, cy, rad, 0, 6.2832); rctx.stroke();
      }
      // resplandor de meta
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
        var k = 1 - p.age / p.life;
        var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1, tl = Math.min(U * 0.05, sp * 0.03);
        fctx.strokeStyle = 'rgba(' + LIME + ',' + (k * 0.9).toFixed(2) + ')'; fctx.lineWidth = Math.max(1, p.r * 1.3); fctx.lineCap = 'round';
        fctx.beginPath(); fctx.moveTo(p.x, p.y); fctx.lineTo(p.x - p.vx / sp * tl, p.y - p.vy / sp * tl); fctx.stroke();
        fctx.fillStyle = 'rgba(235,255,200,' + (k).toFixed(2) + ')'; fctx.beginPath(); fctx.arc(p.x, p.y, p.r * k, 0, 6.2832); fctx.fill();
      }
      fctx.globalCompositeOperation = 'source-over';
    }

    function place(now, t, dt) {
      lp.x += (ptr.x - lp.x) * 0.08; lp.y += (ptr.y - lp.y) * 0.08;
      var enter = reduce ? 1 : clamp((t - 0.05) / 0.9, 0, 1);
      var drop = (1 - outBack(enter)) * -U * 0.5;
      var ageK = (now - kickT) / 1000, k = ageK < 1.2 ? Math.exp(-6.5 * ageK) * Math.cos(17 * ageK) : 0;
      var sq = 1 - 0.075 * k * kick, ty = U * 0.014 * k * kick;
      var float = reduce ? 0 : Math.sin(t * 1.6) * U * 0.004;
      var px = (lp.x - cx) / (U * 0.5), py = (lp.y - cy) / (U * 0.5); if (!ptr.in) { px = 0; py = 0; }
      bell.style.opacity = Math.min(1, enter * 2.2);
      bell.style.transform = 'translate3d(' + (px * U * 0.012).toFixed(2) + 'px,' + (drop + ty + float + py * U * 0.008).toFixed(2) + 'px,0) scale(' + (1 + (1 - sq) * 0.6).toFixed(4) + ',' + sq.toFixed(4) + ')';
      // luz verde que sigue al cursor alrededor de la pesa
      var gx = cx + (ptr.in ? clamp(px, -1, 1) * U * 0.3 : Math.sin(t * 0.7) * U * 0.12), gy = cy + (ptr.in ? clamp(py, -1, 1) * U * 0.3 : Math.cos(t * 0.5) * U * 0.1);
      light.style.transform = 'translate3d(' + (gx - cx).toFixed(1) + 'px,' + (gy - cy).toFixed(1) + 'px,0)';
      light.style.opacity = (0.55 + 0.25 * Math.sin(t * 2.1) + 0.35 * flash + 0.25 * ringFlash).toFixed(2);
      countBox.style.opacity = enter;
      // meta: tras 1.8 s se vacía el anillo y vuelve a empezar
      if (reps >= GOAL && now - metaT > 1800) { reps = 0; num.textContent = '0'; countBox.classList.remove('meta'); }
      // sin toques: el anillo se vacía despacio (una repetición cada 1.1 s)
      if (!reduce && reps > 0 && reps < GOAL && now - lastTap > 3500) { drainAcc += dt; if (drainAcc > 1.1) { drainAcc = 0; reps--; num.textContent = String(reps); } }
      // demostración sola: si nadie interactúa, hace 3 repeticiones cada ~9 s
      if (!reduce && t > 2.4 && now - lastTap > 6500) {
        if (autoLeft === 0 && now - lastAutoStart > 9000) { autoLeft = 3; autoNext = now; lastAutoStart = now; }
        if (autoLeft > 0 && now >= autoNext) { rep(now, true); autoLeft--; autoNext = now + 520; }
      } else if (now - lastTap <= 6500) autoLeft = 0;
    }

    function frame(now) {
      raf = 0; if (!running) return;
      var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016; lastT = now;
      var t = (now - t0) / 1000;
      place(now, t, dt); drawRing(now, t, dt); drawSparks(dt);
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
    el.addEventListener('pointerdown', function (ev) { setPtr(ev); lastTap = performance.now(); autoLeft = 0; rep(lastTap, false); });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') ptr.in = false; });
    el.addEventListener('pointercancel', function () { ptr.in = false; });

    layout();
    if (global.ResizeObserver) new ResizeObserver(layout).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    if (reduce) { reps = 6; shown = 6; num.textContent = '6'; place(t0 + 5000, 5, 0.016); drawRing(t0 + 5000, 5, 0.016); }
    sync();
  }

  global.PulseFit = { init: init };
})(window);
