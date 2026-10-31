/*
 * Pantalla de entrada: pantalla completa con un fluido de luz que reacciona al cursor (js/intro-fluido.js, WebGL2); si el aparato no lo
 * soporta, una red de puntos en 3D (canvas 2D, sin librerías ni imágenes). Se muestra una sola vez por visita (sessionStorage) y se cierra con el botón, la rueda del mouse o Escape.
 * En celular SOLO se entra con el botón «Conoce Moravi Studio»: el dedo únicamente juega con la tinta de luz (deslizar hacia arriba ya no cierra la entrada). Los textos y el selector ES/EN los maneja js/i18n.js.
 * Cuidado de rendimiento: solo anima mientras se ve; se pausa con la pestaña oculta; resolución limitada
 * (DPR máx. 2); menos puntos en pantallas chicas; red estática si el aparato pide «reducir movimiento».
 * Al cerrarse, el elemento se elimina del documento y la animación se detiene por completo.
 */
(function () {
  'use strict';
  var box = document.getElementById('intro');
  if (!box) return;
  var root = document.documentElement;
  if (!root.classList.contains('intro-on')) { box.parentNode.removeChild(box); return; }

  var canvas = document.getElementById('intro-net');
  var btn = document.getElementById('intro-enter');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var fl = window.IntroFluido ? window.IntroFluido.create(canvas, box, reduce) : null;   // tinta de luz; null = sin WebGL2: se usa la red de puntos
  var ctx = !fl && canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var W = 0, H = 0, pts = [], running = false, raf = 0, rotY = 0, closed = false, vis = true;
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  function build() {
    var rect = box.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.floor(rect.width)); H = Math.max(1, Math.floor(rect.height));
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = clamp(Math.round(W * H / 9000), 90, 140);
    pts = [];
    for (var i = 0; i < n; i++) {
      var u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = Math.cbrt(Math.random());
      var s = Math.sqrt(1 - u * u);
      pts.push({ x: r * s * Math.cos(th), y: r * u, z: r * s * Math.sin(th) });
    }
  }

  function frame() {
    raf = 0;
    if (!running) return;
    rotY += 0.0022;
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    var ay = rotY + pointer.x * 0.7, ax = pointer.y * 0.5;
    var cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
    var R = Math.min(W, H) * (W < 700 ? 0.62 : 0.5) + (W < 700 ? 40 : 0), F = 2.6;
    var proj = new Array(pts.length);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var x1 = p.x * cy - p.z * sy, z1 = p.x * sy + p.z * cy;
      var y2 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx;
      var k = F / (F + z2 + 1);
      proj[i] = { x: W / 2 + x1 * R * k * 1.15, y: H / 2 + y2 * R * k, z: z2, k: k };
    }
    ctx.clearRect(0, 0, W, H);
    var maxD = Math.min(W, H) * (W < 700 ? 0.3 : 0.2), maxD2 = maxD * maxD;
    ctx.lineWidth = 1;
    for (var a = 0; a < proj.length; a++) {
      for (var b = a + 1; b < proj.length; b++) {
        var dx = proj[a].x - proj[b].x, dy = proj[a].y - proj[b].y, d2 = dx * dx + dy * dy;
        if (d2 < maxD2) {
          var al = (1 - d2 / maxD2) * 0.35 * ((proj[a].k + proj[b].k) / 2);
          ctx.strokeStyle = 'rgba(111,195,255,' + al.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(proj[a].x, proj[a].y); ctx.lineTo(proj[b].x, proj[b].y); ctx.stroke();
        }
      }
    }
    for (var c = 0; c < proj.length; c++) {
      var q = proj[c];
      ctx.fillStyle = 'rgba(' + (q.z < 0 ? '150,210,255' : '30,140,255') + ',' + clamp(0.35 + q.k * 0.45, 0.2, 0.95).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(q.x, q.y, 1.2 + q.k * 1.8, 0, 6.2832); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  function drawStatic() { running = true; frame(); running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  function sync() {
    var go = !closed && vis && !document.hidden && !reduce;
    if (fl) { fl.run(go); return; }
    if (go && !running) { running = true; if (!raf) raf = requestAnimationFrame(frame); }
    else if (!go) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  }
  function setPointer(cx, cy) {
    var r = box.getBoundingClientRect();
    pointer.tx = clamp((cx - r.left) / r.width * 2 - 1, -1, 1);
    pointer.ty = clamp((cy - r.top) / r.height * 2 - 1, -1, 1);
  }

  var resizeTimer;
  function onResize() { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { if (!ctx) return; build(); if (reduce) drawStatic(); }, 150); }
  function onVisibility() { sync(); }

  function enter() {
    if (closed) return;
    closed = true;
    try { sessionStorage.setItem('moravi-intro-visto', '1'); } catch (e) { /* sin almacenamiento: se mostrará de nuevo */ }
    sync();
    box.classList.add('is-leaving');
    root.classList.remove('intro-on', 'scene-wait');
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
    setTimeout(function () { if (fl) fl.destroy(); if (box.parentNode) box.parentNode.removeChild(box); }, 800);
  }
  function onKey(e) { if (e.key === 'Escape') enter(); }

  btn.addEventListener('click', enter);
  box.addEventListener('wheel', function (e) { if (e.deltaY > 25) enter(); }, { passive: true });
  box.addEventListener('touchmove', function (e) {
    if (e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  box.addEventListener('pointermove', function (e) { setPointer(e.clientX, e.clientY); }, { passive: true });
  box.addEventListener('pointerleave', function () { pointer.tx = 0; pointer.ty = 0; });
  document.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', onResize);

  if (fl) sync();
  else if (ctx) { build(); if (reduce) drawStatic(); sync(); }
})();
