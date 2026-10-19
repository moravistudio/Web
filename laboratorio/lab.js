/*
 * Laboratorio de movimiento — página oculta de pruebas (no está enlazada desde el sitio).
 * Cuatro efectos independientes. Reglas comunes de cuidado:
 *  - Nada se anima si no se ve en pantalla (IntersectionObserver) ni con la pestaña oculta.
 *  - La resolución del lienzo se limita (DPR máx. 2) y la cantidad de puntos se adapta al tamaño.
 *  - Con «reducir movimiento» activado: red estática, historia sin scroll animado, tarjetas y anillo quietos.
 */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- 1. Red de puntos en 3D ---------- */
  (function network() {
    var canvas = document.getElementById('lab-net');
    var host = document.getElementById('lab-hero');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, dpr = 1, pts = [], running = false, raf = 0;
    var pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    var rotY = 0, rotX = 0;

    function build() {
      var rect = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.floor(rect.width)); H = Math.max(1, Math.floor(rect.height));
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Cantidad según el área (menos puntos en teléfonos); entre 60 y 130
      var n = clamp(Math.round(W * H / 9000), 90, 140);
      pts = [];
      for (var i = 0; i < n; i++) {
        // Reparto dentro de una esfera
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
      rotX = pointer.y * 0.5;
      var ay = rotY + pointer.x * 0.7;
      var cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(rotX), sx = Math.sin(rotX);
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
        var q = proj[c], rad = 1.2 + q.k * 1.8;
        ctx.fillStyle = 'rgba(' + (q.z < 0 ? '150,210,255' : '30,140,255') + ',' + clamp(0.35 + q.k * 0.45, 0.2, 0.95).toFixed(2) + ')';
        ctx.beginPath(); ctx.arc(q.x, q.y, rad, 0, 6.2832); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function drawStatic() { running = true; frame(); running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    function start() { if (reduce || running) return; running = true; if (!raf) raf = requestAnimationFrame(frame); }
    function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    function setPointer(cx, cy) {
      var r = host.getBoundingClientRect();
      pointer.tx = clamp((cx - r.left) / r.width * 2 - 1, -1, 1);
      pointer.ty = clamp((cy - r.top) / r.height * 2 - 1, -1, 1);
    }
    host.addEventListener('pointermove', function (e) { setPointer(e.clientX, e.clientY); }, { passive: true });
    host.addEventListener('touchmove', function (e) { if (e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    host.addEventListener('pointerleave', function () { pointer.tx = 0; pointer.ty = 0; });

    var vis = false;
    function sync() { if (vis && !document.hidden) start(); else stop(); }
    build();
    if (reduce) drawStatic();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(host);
    else { vis = true; sync(); }
    document.addEventListener('visibilitychange', sync);
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { build(); if (reduce) drawStatic(); }, 150); });
  })();

  /* ---------- 2. Historia que avanza con el scroll ---------- */
  (function story() {
    var section = document.getElementById('lab-story');
    var img = document.getElementById('lab-story-img');
    var bar = document.getElementById('lab-story-bar');
    if (!section || !img || reduce) return;
    var caps = section.querySelectorAll('.lab-story__cap');
    var step = -1, ticking = false;

    function update() {
      ticking = false;
      var r = section.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
      // El dispositivo gira y crece hasta quedar de frente hacia el 70 % del recorrido
      var e = clamp(p / 0.7, 0, 1);
      var ease = 1 - Math.pow(1 - e, 3);
      img.style.setProperty('--rx', (40 * (1 - ease)).toFixed(2) + 'deg');
      img.style.setProperty('--ry', (-24 * (1 - ease)).toFixed(2) + 'deg');
      img.style.setProperty('--sc', (0.72 + 0.28 * ease).toFixed(3));
      img.style.setProperty('--op', (0.3 + 0.7 * clamp(p / 0.25, 0, 1)).toFixed(3));
      bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      var s = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
      if (s !== step) {
        step = s;
        for (var i = 0; i < caps.length; i++) caps[i].classList.toggle('is-on', i === s);
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  /* ---------- 3. Tarjetas con inclinación 3D ---------- */
  (function tilt() {
    var cards = document.querySelectorAll('[data-tilt]');
    if (!cards.length || reduce) return;
    var MAX = 10; // grados
    cards.forEach(function (card) {
      function move(cx, cy) {
        var r = card.getBoundingClientRect();
        var px = clamp((cx - r.left) / r.width, 0, 1), py = clamp((cy - r.top) / r.height, 0, 1);
        card.style.setProperty('--ty', ((px - 0.5) * 2 * MAX).toFixed(2) + 'deg');
        card.style.setProperty('--tx', ((0.5 - py) * 2 * MAX).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      }
      function end() {
        card.classList.remove('is-active');
        card.style.setProperty('--tx', '0deg'); card.style.setProperty('--ty', '0deg');
      }
      card.addEventListener('pointerenter', function () { card.classList.add('is-active'); });
      card.addEventListener('pointermove', function (e) { move(e.clientX, e.clientY); }, { passive: true });
      card.addEventListener('pointerleave', end);
      card.addEventListener('pointercancel', end);
      // Dedo: inclina mientras se toca, sin impedir el scroll vertical (touch-action: pan-y)
      card.addEventListener('touchstart', function (e) { card.classList.add('is-active'); if (e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
      card.addEventListener('touchmove', function (e) { if (e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
      card.addEventListener('touchend', end);
      card.addEventListener('touchcancel', end);
    });
  })();

  /* ---------- 4. Anillo de proyectos (se arrastra) ---------- */
  (function ring() {
    var scene = document.getElementById('lab-ring');
    var spin = document.getElementById('lab-ring-spin');
    if (!scene || !spin) return;
    var items = spin.querySelectorAll('.lab-ring__item');
    var n = items.length, step = 360 / n;
    var rot = 0, vel = 0, dragging = false, lastX = 0, vis = false, raf = 0, lastT = 0, resumeAt = 0;

    function layout() {
      var w = items[0].offsetWidth || 240;
      // radio para que las tarjetas queden casi pegadas: (w/2) / tan(π/n), con un pequeño aire
      var radius = Math.round((w / 2) / Math.tan(Math.PI / n) * 1.12);
      spin.style.setProperty('--radius', radius + 'px');
      spin.style.setProperty('--step', step + 'deg');
      items.forEach(function (it, i) { it.style.setProperty('--i', i); });
    }
    function paint() { spin.style.setProperty('--rot', rot.toFixed(2) + 'deg'); }

    function tick(t) {
      raf = 0;
      if (!vis || document.hidden) return;
      var dt = Math.min(48, t - (lastT || t)); lastT = t;
      if (!dragging) {
        if (Math.abs(vel) > 0.01) { rot += vel * dt; vel *= 0.95; }
        else if (!reduce && Date.now() > resumeAt) { rot -= 0.012 * dt; }   // giro lento propio
        paint();
      }
      raf = requestAnimationFrame(tick);
    }
    function run() { if (!raf && vis && !document.hidden) { lastT = 0; raf = requestAnimationFrame(tick); } }

    scene.addEventListener('pointerdown', function (e) {
      dragging = true; lastX = e.clientX; vel = 0; scene.classList.add('is-drag');
      if (scene.setPointerCapture) { try { scene.setPointerCapture(e.pointerId); } catch (x) {} }
    });
    scene.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX;
      rot += dx * 0.4; vel = dx * 0.02; paint();
    });
    function up() { if (!dragging) return; dragging = false; scene.classList.remove('is-drag'); resumeAt = Date.now() + 2500; }
    scene.addEventListener('pointerup', up);
    scene.addEventListener('pointercancel', up);

    layout(); paint();
    if (reduce) return;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; run(); }, { threshold: 0.1 }).observe(scene);
    else { vis = true; run(); }
    document.addEventListener('visibilitychange', run);
    window.addEventListener('resize', layout);
  })();
})();
