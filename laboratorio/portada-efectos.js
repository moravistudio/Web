/*
 * DEMO — Portada con vida (nivel 1: sin imágenes nuevas).
 * PC (≥ 1025 px): red de puntos azules detrás de los dispositivos, barrido de luz que recorre las pantallas,
 * flotación suave e inclinación 3D que sigue al cursor, y entrada animada.
 * Celular (≤ 768 px): barrido de luz, flotación suave, partículas de luz que suben y entrada animada.
 * Cuidado de rendimiento: solo anima mientras la portada se ve; pausa con la pestaña oculta; DPR máx. 2;
 * con «reducir movimiento» queda todo quieto.
 */
(function () {
  'use strict';
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqPC = window.matchMedia('(min-width: 1025px)');
  var mqPhone = window.matchMedia('(max-width: 768px)');
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  var imgPC = hero.querySelector('.hero__devices');
  var imgM = hero.querySelector('.hero__devices-mobile');
  var wrapM = hero.querySelector('.hero__mobile-visual');

  // Capa de brillo: copia exacta de la imagen (misma geometría) que solo se ve en una franja que se desplaza
  function addSheen(im) {
    if (!im) return null;
    var c = im.cloneNode(false);
    c.className = im.className + ' hero__sheen';
    c.alt = ''; c.setAttribute('aria-hidden', 'true'); c.removeAttribute('loading');
    im.parentNode.insertBefore(c, im.nextSibling);
    return c;
  }
  var sheenPC = addSheen(imgPC), sheenM = addSheen(imgM);
  hero.classList.add('fx-on');

  // ----- Lienzos -----
  function makeCanvas(parent, cls, first) {
    var c = document.createElement('canvas');
    c.className = cls; c.setAttribute('aria-hidden', 'true');
    if (first) parent.insertBefore(c, parent.firstChild); else parent.appendChild(c);
    return c;
  }
  var netCanvas = makeCanvas(hero, 'hero__net', true);
  var frontCanvas = makeCanvas(hero, 'hero__net hero__net--front', false);
  var dustCanvas = wrapM ? makeCanvas(wrapM, 'hero__dust', false) : null;

  var pts = [], dust = [], W = 0, H = 0, dW = 0, dH = 0, dpr = 1;
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  var rotY = 0, t0 = performance.now();

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = hero.getBoundingClientRect();
    W = Math.max(1, Math.floor(r.width)); H = Math.max(1, Math.floor(r.height));
    netCanvas.width = W * dpr; netCanvas.height = H * dpr;
    netCanvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    frontCanvas.width = W * dpr; frontCanvas.height = H * dpr;
    frontCanvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    var n = clamp(Math.round(W * H / 9500), 90, 150);
    for (var i = 0; i < n; i++) {
      var u = Math.random() * 2 - 1, th = Math.random() * 6.2832, rr = Math.cbrt(Math.random()), s = Math.sqrt(1 - u * u);
      pts.push({ x: rr * s * Math.cos(th), y: rr * u, z: rr * s * Math.sin(th) });
    }
    if (dustCanvas) {
      var r2 = wrapM.getBoundingClientRect();
      dW = Math.max(1, Math.floor(r2.width)); dH = Math.max(1, Math.floor(r2.height));
      dustCanvas.width = dW * dpr; dustCanvas.height = dH * dpr;
      dustCanvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      dust = [];
      for (var k = 0; k < 34; k++) dust.push({ x: Math.random() * dW, y: Math.random() * dH, v: 0.12 + Math.random() * 0.3, r: 0.8 + Math.random() * 1.8, p: Math.random() * 6.28 });
    }
  }

  function drawNet(now) {
    var back = netCanvas.getContext('2d'), front = frontCanvas.getContext('2d');
    back.clearRect(0, 0, W, H); front.clearRect(0, 0, W, H);
    if (!mqPC.matches) return;
    pointer.x += (pointer.tx - pointer.x) * 0.06; pointer.y += (pointer.ty - pointer.y) * 0.06;
    rotY += 0.0026;
    var ay = rotY + pointer.x * 0.7, ax = pointer.y * 0.5;
    var cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
    var Rx = W * 0.4, Ry = H * 0.44, F = 2.6, ox = W * 0.66, oy = H * 0.52, minX = W * 0.47;
    var proj = new Array(pts.length);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var x1 = p.x * cy - p.z * sy, z1 = p.x * sy + p.z * cy, y2 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx, k = F / (F + z2 + 1);
      proj[i] = { x: ox + x1 * Rx * k, y: oy + y2 * Ry * k, k: k, front: z2 > 0 };
    }
    var maxD = Math.min(W, H) * 0.2, maxD2 = maxD * maxD;
    back.lineWidth = 1; front.lineWidth = 1;
    for (var a = 0; a < proj.length; a++) for (var b = a + 1; b < proj.length; b++) {
      var A = proj[a], B = proj[b], dx = A.x - B.x, dy = A.y - B.y, d2 = dx * dx + dy * dy;
      if (d2 >= maxD2) continue;
      var f = A.front || B.front, ctx = f ? front : back;
      if (f && (A.x < minX || B.x < minX)) continue;
      ctx.strokeStyle = 'rgba(30,140,255,' + ((1 - d2 / maxD2) * (f ? 0.5 : 0.4) * ((A.k + B.k) / 2)).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    }
    for (var c = 0; c < proj.length; c++) {
      var q = proj[c], g = q.front ? front : back;
      if (q.front && q.x < minX) continue;
      g.fillStyle = 'rgba(30,140,255,' + clamp(0.35 + q.k * 0.5, 0.3, 0.95).toFixed(2) + ')';
      g.beginPath(); g.arc(q.x, q.y, 1.4 + q.k * 2.1, 0, 6.2832); g.fill();
    }
  }

  function drawDust(now) {
    if (!dustCanvas) return;
    var ctx = dustCanvas.getContext('2d');
    ctx.clearRect(0, 0, dW, dH);
    if (!mqPhone.matches) return;
    for (var i = 0; i < dust.length; i++) {
      var d = dust[i];
      d.y -= d.v; d.x += Math.sin(now / 1400 + d.p) * 0.12;
      if (d.y < -4) { d.y = dH + 4; d.x = Math.random() * dW; }
      var edge = Math.min(d.y / 24, (dH - d.y) / 24, 1);
      ctx.fillStyle = 'rgba(30,140,255,' + clamp(0.55 * edge, 0, 0.55).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.2832); ctx.fill();
    }
  }

  // ----- Flotación + inclinación -----
  function transformFor(now) {
    var fy = Math.sin((now - t0) / 1700) * (mqPC.matches ? 7 : 4);
    var rx = mqPC.matches ? -pointer.y * 3.2 : 0, ry = mqPC.matches ? pointer.x * 4.2 : 0;
    return 'perspective(1400px) translateY(' + fy.toFixed(2) + 'px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
  }

  var running = false, raf = 0, vis = true;
  function frame(now) {
    raf = 0;
    if (!running) return;
    var tr = transformFor(now);
    if (mqPC.matches) { if (imgPC) imgPC.style.transform = tr; if (sheenPC) sheenPC.style.transform = tr; }
    else if (mqPhone.matches) { if (imgM) imgM.style.transform = tr; if (sheenM) sheenM.style.transform = tr; }
    drawNet(now); drawDust(now);
    raf = requestAnimationFrame(frame);
  }
  function sync() {
    var go = vis && !document.hidden && !reduce;
    if (go && !running) { running = true; if (!raf) raf = requestAnimationFrame(frame); }
    else if (!go) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  }

  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    pointer.tx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1);
    pointer.ty = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1);
  }, { passive: true });
  hero.addEventListener('pointerleave', function () { pointer.tx = 0; pointer.ty = 0; });

  build();
  if (reduce) { drawNet(0); drawDust(0); }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(hero);
  document.addEventListener('visibilitychange', sync);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { build(); if (reduce) { drawNet(0); drawDust(0); } }, 150); });
  sync();
})();
