/*
 * Portada «Origen Café» (cafetería). Una taza de café humeante con tres efectos que trabajan juntos:
 *   1) Vapor: sube de la taza y se aparta del cursor / dedo, como si soplaras.
 *   2) Granos de café flotando alrededor, unos por detrás y otros por delante, con profundidad (parallax).
 *   3) Café que se sirve: al hacer clic o tocar, la superficie se agita con ondas y cae un grano adentro (cada clic lo repite).
 * Se usa con: <div class="cv cv-cafe"></div>  (el contenido lo crea este archivo). Llamar OrigenCafe.init(contenedor).
 * Cuidado de rendimiento: solo anima mientras se ve en pantalla y con la pestaña visible; pocas partículas;
 * con «reducir movimiento» queda la taza quieta, sin vapor animado.
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var IMG = BASE + 'assets/portadas/origen-cafe/';
  var BEANS = ['01', '02', '03', '04', '05', '07', '09', '10', '12', '14'];
  // Superficie del café dentro de la imagen de la taza (fracciones del ancho/alto de la imagen)
  var S = { cx: 0.491, cy: 0.373, rx: 0.2, ry: 0.12, rot: -0.07 };
  // Granos: posición (fracción del lado menor, desde el centro), tamaño, capa (0 detrás, 1 delante), profundidad, giro
  var FLOAT = [
    { b: 0, x: -0.37, y: -0.22, s: 0.15, l: 0, d: 0.4, r: -25 },
    { b: 1, x: 0.38, y: -0.3, s: 0.13, l: 0, d: 0.5, r: 40 },
    { b: 2, x: -0.12, y: -0.4, s: 0.11, l: 0, d: 0.3, r: 12 },
    { b: 3, x: 0.2, y: -0.12, s: 0.1, l: 0, d: 0.6, r: -60 },
    { b: 4, x: -0.44, y: 0.14, s: 0.12, l: 0, d: 0.45, r: 70 },
    { b: 5, x: 0.43, y: 0.12, s: 0.17, l: 1, d: 1.0, r: -35 },
    { b: 6, x: -0.34, y: 0.34, s: 0.19, l: 1, d: 1.2, r: 20 },
    { b: 7, x: 0.28, y: 0.38, s: 0.14, l: 1, d: 0.9, r: 110 },
    { b: 8, x: -0.4, y: -0.02, s: 0.1, l: 1, d: 0.8, r: -80 }
  ];
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var outBack = function (t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

  function init(el) {
    if (!el || el.__cafe) return;
    el.__cafe = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<div class="cv__glow"></div>' +
      '<div class="cv__logo"><b>ORIGEN</b> CAFÉ</div>' +
      '<div class="cv__beans cv__beans--back"></div>' +
      '<img class="cv__cup" alt="" draggable="false">' +
      '<canvas class="cv__ripple" aria-hidden="true"></canvas>' +
      '<canvas class="cv__steam" aria-hidden="true"></canvas>' +
      '<div class="cv__beans cv__beans--front"></div>' +
      '<img class="cv__drop" alt="" draggable="false">' +
      '<div class="cv__copy"><span class="cv__h">Despierta<br><em>tus sentidos</em></span></div>';
    var cup = el.querySelector('.cv__cup'), rip = el.querySelector('.cv__ripple'), rctx = rip.getContext('2d'),
        stm = el.querySelector('.cv__steam'), sctx = stm.getContext('2d'), dropEl = el.querySelector('.cv__drop'),
        backBox = el.querySelector('.cv__beans--back'), frontBox = el.querySelector('.cv__beans--front');
    cup.src = IMG + 'taza.webp';
    dropEl.src = IMG + 'grano-' + BEANS[0] + '.webp';
    var floaters = FLOAT.map(function (f, n) {
      var im = new Image(); im.className = 'cv__bean'; im.alt = ''; im.draggable = false; im.src = IMG + 'grano-' + BEANS[f.b] + '.webp';
      (f.l ? frontBox : backBox).appendChild(im); return { f: f, el: im, ph: Math.random() * 6.28 };
    });
    var steamSprite = (function () { var c = document.createElement('canvas'); c.width = c.height = 96; var g = c.getContext('2d'), gr = g.createRadialGradient(48, 48, 0, 48, 48, 48);
      gr.addColorStop(0, 'rgba(255,246,235,.45)'); gr.addColorStop(0.4, 'rgba(255,240,225,.22)'); gr.addColorStop(0.75, 'rgba(255,235,220,.06)'); gr.addColorStop(1, 'rgba(255,235,220,0)'); g.fillStyle = gr; g.fillRect(0, 0, 96, 96); return c; })();

    var W = 0, H = 0, U = 0, dpr = 1, cupX = 0, cupY = 0, cupS = 0, sx = 0, sy = 0, srx = 0, sry = 0;
    var puffs = [], ripples = [], drops = [], splash = [], pacc = 0, lastT = 0, bounce = 0;
    var ptr = { x: -999, y: -999, vx: 0, vy: 0, in: false, px: 0, py: 0 }, par = { x: 0, y: 0, tx: 0, ty: 0 };
    var t0 = performance.now();
    var vis = true, running = false, raf = 0, lastAuto = -1, lastAutoDrop = 0;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      U = Math.min(W, H); dpr = Math.min(window.devicePixelRatio || 1, 2);
      [rip, stm].forEach(function (c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
      rctx.setTransform(dpr, 0, 0, dpr, 0, 0); sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // La taza: su contenido (73 % del ancho de la imagen) ocupa ~58 % del lado menor; se apoya en la parte baja
      cupS = U * 0.54 / 0.735;
      cupX = W / 2 - cupS * 0.5 + U * 0.01;
      cupY = H * 0.775 - cupS * (1085 / 1254);
      cup.style.cssText = 'width:' + cupS + 'px;height:' + cupS + 'px;left:' + cupX + 'px;top:' + cupY + 'px;';
      sx = cupX + cupS * S.cx; sy = cupY + cupS * S.cy; srx = cupS * S.rx; sry = cupS * S.ry;
      dropEl.style.width = (U * 0.1) + 'px';
      floaters.forEach(function (o) { o.el.style.width = (o.f.s * U) + 'px'; });
    }

    function addRipple(x, y, amp) { ripples.push({ x: x, y: y, age: 0, life: 2.4, amp: amp || 1 }); if (ripples.length > 8) ripples.shift(); }
    function inSurface(x, y) { var dx = (x - sx) / srx, dy = (y - sy) / sry; return dx * dx + dy * dy <= 1.0; }
    function serve(x, y) {
      // Cae un grano desde arriba hasta un punto de la superficie; al llegar, ondas y un pequeño golpe en la taza
      var tx = x, ty = y;
      if (!inSurface(tx, ty)) { var a = Math.random() * 6.28, rr = Math.sqrt(Math.random()) * 0.7; tx = sx + Math.cos(a) * srx * rr; ty = sy + Math.sin(a) * sry * rr; }
      drops.push({ x: tx, y: ty, age: 0, fall: 0.5, bean: Math.floor(Math.random() * BEANS.length), rot: (Math.random() - 0.5) * 220 });
      addRipple(tx, ty, 0.4);
    }

    // Salpicadura de café: gotas translúcidas del color del líquido, con cola y brillo, y una corona fina en el punto de impacto
    function spawnSplash(x, y) {
      for (var i = 0; i < 9; i++) {
        var a = -Math.PI / 2 + (Math.random() - 0.5) * 1.5, v = U * (0.55 + Math.random() * 0.5);
        splash.push({ x: x + (Math.random() - 0.5) * U * 0.015, y: y, vx: Math.cos(a) * v * 0.7, vy: Math.sin(a) * v, y0: y, r: U * (0.0035 + Math.random() * 0.005), kind: 'drop' });
      }
      splash.push({ x: x, y: y, age: 0, kind: 'crown' });
    }
    function drawSplash(dt) {
      sctx.lineCap = 'round';
      for (var i = splash.length - 1; i >= 0; i--) {
        var p = splash[i];
        if (p.kind === 'crown') {
          p.age += dt; if (p.age > 0.42) { splash.splice(i, 1); continue; }
          var f = p.age / 0.42, rad = U * (0.012 + f * 0.05), al = (1 - f) * 0.8;
          sctx.strokeStyle = 'rgba(205,140,70,' + al.toFixed(2) + ')'; sctx.lineWidth = Math.max(1, U * 0.006 * (1 - f));
          for (var k = 0; k < 11; k++) {
            var ang = k / 11 * 6.2832, c = Math.cos(ang), sn = Math.sin(ang), h = U * 0.045 * Math.sin(f * 3.14159) * (0.6 + 0.4 * Math.abs(Math.sin(k * 2.3)));
            sctx.beginPath(); sctx.moveTo(p.x + c * rad, p.y + sn * rad * 0.45); sctx.lineTo(p.x + c * rad * 1.15, p.y + sn * rad * 0.52 - h); sctx.stroke();
          }
          continue;
        }
        p.vy += U * 2.1 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.vy > 0 && p.y >= p.y0) { addRipple(p.x, p.y0, 0.15); splash.splice(i, 1); continue; }
        var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy), tl = Math.min(U * 0.05, sp * 0.045), nx = sp ? p.vx / sp : 0, ny = sp ? p.vy / sp : 1;
        // cola: un trazo fino, translúcido, detrás de la gota
        var g = sctx.createLinearGradient(p.x, p.y, p.x - nx * tl, p.y - ny * tl);
        g.addColorStop(0, 'rgba(150,84,32,.65)'); g.addColorStop(1, 'rgba(150,84,32,0)');
        sctx.strokeStyle = g; sctx.lineWidth = p.r * 1.5; sctx.beginPath(); sctx.moveTo(p.x, p.y); sctx.lineTo(p.x - nx * tl, p.y - ny * tl); sctx.stroke();
        // cuerpo de la gota: ámbar translúcido con borde más oscuro y un brillo
        var gr = sctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 0, p.x, p.y, p.r * 1.25);
        gr.addColorStop(0, 'rgba(214,150,80,.9)'); gr.addColorStop(1, 'rgba(110,58,22,.8)');
        sctx.fillStyle = gr; sctx.beginPath(); sctx.arc(p.x, p.y, p.r * 1.2, 0, 6.2832); sctx.fill();
        sctx.fillStyle = 'rgba(255,236,200,.85)'; sctx.beginPath(); sctx.arc(p.x - p.r * 0.35, p.y - p.r * 0.4, p.r * 0.32, 0, 6.2832); sctx.fill();
      }
      sctx.globalAlpha = 1;
    }

    function drawRipples(dt) {
      rctx.clearRect(0, 0, W, H);
      if (!ripples.length && !drops.length) return;
      rctx.save(); rctx.translate(sx, sy); rctx.rotate(S.rot);
      rctx.beginPath(); rctx.ellipse(0, 0, srx * 0.985, sry * 0.985, 0, 0, 6.2832); rctx.clip();
      for (var i = ripples.length - 1; i >= 0; i--) {
        var r = ripples[i]; r.age += dt; if (r.age > r.life) { ripples.splice(i, 1); continue; }
        var f = r.age / r.life, lx = r.x - sx, ly = r.y - sy;
        var c = Math.cos(-S.rot), s2 = Math.sin(-S.rot), px = lx * c - ly * s2, py = lx * s2 + ly * c;
        for (var k = 0; k < 3; k++) {
          var rf = f * 1.1 - k * 0.1; if (rf <= 0) continue;
          var rad = rf * srx * 1.5, al = Math.pow(1 - clamp(rf, 0, 1), 1.6) * 0.75 * r.amp * (1 - k * 0.22);
          rctx.lineWidth = Math.max(1, U * 0.012 * (1 - rf * 0.5));
          rctx.strokeStyle = 'rgba(255,226,168,' + clamp(al, 0, 1).toFixed(3) + ')';
          rctx.beginPath(); rctx.ellipse(px, py, rad, rad * (sry / srx), 0, 0, 6.2832); rctx.stroke();
          rctx.strokeStyle = 'rgba(45,22,8,' + clamp(al * 0.6, 0, 1).toFixed(3) + ')';
          rctx.beginPath(); rctx.ellipse(px, py, rad * 0.93, rad * 0.93 * (sry / srx), 0, 0, 6.2832); rctx.stroke();
        }
      }
      rctx.restore();
    }

    function drawSteam(now, dt) {
      sctx.clearRect(0, 0, W, H);
      var t = (now - t0) / 1000;
      // brotan bocanadas desde la superficie del café
      pacc += dt * (reduce ? 0 : 11);
      while (pacc >= 1) { pacc -= 1;
        var a = Math.random() * 6.28, rr = Math.sqrt(Math.random()) * 0.75;
        puffs.push({ x: sx + Math.cos(a) * srx * rr, y: sy - sry * 0.15 + Math.sin(a) * sry * rr * 0.5, vx: 0, vy: -(U * (0.1 + Math.random() * 0.07)), age: 0, life: 2.7 + Math.random() * 1.5, r: U * (0.03 + Math.random() * 0.035), g: U * (0.07 + Math.random() * 0.07), p: Math.random() * 6.28, w: 0.5 + Math.random() * 0.8 });
      }
      var R = U * 0.3;
      for (var i = puffs.length - 1; i >= 0; i--) {
        var p = puffs[i]; p.age += dt;
        if (p.age > p.life || p.y < -U * 0.2) { puffs.splice(i, 1); continue; }
        // ondulación propia + corriente de aire general
        p.vx += (Math.sin(t * 1.3 * p.w + p.p) * U * 0.05) * dt;
        // el cursor / dedo sopla: aparta el vapor y lo arrastra en la dirección en que se mueve
        if (ptr.in) {
          var dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < R && d > 0.001) { var k = (1 - d / R); p.vx += (dx / d) * U * 5 * k * dt + ptr.vx * 2.2 * k * dt; p.vy += (dy / d) * U * 1.2 * k * dt; }
        }
        p.vx *= (1 - 0.7 * dt); p.x += p.vx * dt; p.y += p.vy * dt;
        var f = p.age / p.life, size = (p.r + p.g * f) * 2.3;
        sctx.globalAlpha = clamp(Math.pow(Math.sin(Math.PI * clamp(f, 0, 1)), 1.2) * 0.8 * clamp((p.y - U * 0.06) / (U * 0.3), 0, 1), 0, 1);
        sctx.drawImage(steamSprite, p.x - size / 2, p.y - size / 2, size, size);
      }
      sctx.globalAlpha = 1;
    }

    function place(now, dt) {
      var t = (now - t0) / 1000;
      par.x += (par.tx - par.x) * 0.07; par.y += (par.ty - par.y) * 0.07;
      // taza: entrada + golpecito al servir
      var enter = reduce ? 1 : clamp((t - 0.05) / 0.9, 0, 1);
      bounce *= (1 - Math.min(1, dt * 7));
      var up = (1 - outBack(enter)) * U * 0.35;
      cup.style.opacity = Math.min(1, enter * 2.2);
      cup.style.transform = 'translate3d(' + (par.x * U * 0.012).toFixed(2) + 'px,' + (up + bounce * U * 0.012).toFixed(2) + 'px,0) scale(' + (1 + bounce * 0.012).toFixed(4) + ')';
      rip.style.transform = cup.style.transform; rip.style.transformOrigin = sx + 'px ' + sy + 'px';
      // granos que flotan
      floaters.forEach(function (o, n) {
        var f = o.f, st = reduce ? 1 : clamp((t - 0.3 - n * 0.12) / 0.8, 0, 1);
        var bx = W / 2 + f.x * U + par.x * U * 0.06 * f.d + Math.sin(t * 0.8 + o.ph) * U * 0.012;
        var by = H / 2 + f.y * U + par.y * U * 0.04 * f.d + Math.sin(t * 0.6 + o.ph * 1.7) * U * 0.018 - (1 - ease(st)) * U * 0.2;
        o.el.style.opacity = st;
        o.el.style.transform = 'translate3d(' + (bx - f.s * U / 2).toFixed(1) + 'px,' + (by - f.s * U * 0.4).toFixed(1) + 'px,0) rotate(' + (f.r + Math.sin(t * 0.5 + o.ph) * 14 + par.x * 10 * f.d).toFixed(1) + 'deg)';
      });
      // ondas suaves por sí solas cada cierto tiempo, y un grano que cae de vez en cuando
      if (!reduce && t > 2.2) {
        var cyc = Math.floor((t - 2.2) / 5.2); if (cyc !== lastAuto) { lastAuto = cyc; addRipple(sx + (Math.random() - 0.5) * srx, sy + (Math.random() - 0.5) * sry * 0.6, 0.5); }
        if (t - lastAutoDrop > 10 && now - (ptr.last || 0) > 4000) { lastAutoDrop = t; serve(sx, sy); }
      }
      // grano que cae
      var dd = dropEl.style;
      if (drops.length) {
        var dr = drops[0]; dr.age += dt; var f2 = dr.age / dr.fall;
        if (f2 >= 1) { addRipple(dr.x, dr.y, 1.15); bounce = 1; spawnSplash(dr.x, dr.y); drops.shift(); dd.opacity = 0; }
        else {
          if (!dropEl.__b || dropEl.__b !== dr.bean) { dropEl.__b = dr.bean; dropEl.src = IMG + 'grano-' + BEANS[dr.bean] + '.webp'; }
          var e2 = f2 * f2, yy = (sy - U * 0.62) + (dr.y - (sy - U * 0.62)) * e2, sc = 1 - f2 * 0.35;
          dd.opacity = Math.min(1, f2 * 6); dd.transform = 'translate3d(' + (dr.x - U * 0.05).toFixed(1) + 'px,' + (yy - U * 0.04).toFixed(1) + 'px,0) rotate(' + (dr.rot * f2).toFixed(1) + 'deg) scale(' + sc.toFixed(3) + ')';
        }
      } else dd.opacity = 0;
    }

    function frame(now) {
      raf = 0; if (!running) return;
      var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016; lastT = now;
      ptr.vx *= (1 - Math.min(1, dt * 6)); ptr.vy *= (1 - Math.min(1, dt * 6));
      place(now, dt); drawRipples(dt); drawSteam(now, dt); drawSplash(dt);
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      var go = vis && !document.hidden && !reduce;
      if (go && !running) { running = true; lastT = 0; if (!raf) raf = requestAnimationFrame(frame); }
      else if (!go) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    }

    function setPtr(ev) {
      var r = el.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top, now = performance.now();
      if (ptr.in) { var dtp = Math.max(1, now - (ptr.last || now)) / 1000; ptr.vx = clamp((x - ptr.x) / dtp, -U * 2.5, U * 2.5); ptr.vy = clamp((y - ptr.y) / dtp, -U * 2.5, U * 2.5); }
      ptr.x = x; ptr.y = y; ptr.in = true; ptr.last = now;
      par.tx = clamp(x / W * 2 - 1, -1, 1); par.ty = clamp(y / H * 2 - 1, -1, 1);
    }
    el.addEventListener('pointerenter', setPtr);
    el.addEventListener('pointermove', setPtr, { passive: true });
    el.addEventListener('pointerleave', function () { ptr.in = false; par.tx = 0; par.ty = 0; });
    el.addEventListener('pointerdown', function (ev) {
      setPtr(ev);
      // Cada clic o toque sirve café: ondas y un grano. Si se toca la superficie, las ondas salen de ahí.
      var r = el.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
      serve(x, y);
    });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') { ptr.in = false; par.tx = 0; par.ty = 0; } });
    el.addEventListener('pointercancel', function () { ptr.in = false; });

    layout();
    if (global.ResizeObserver) new ResizeObserver(layout).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    if (reduce) place(t0 + 5000, 0.016);
    sync();
  }

  global.OrigenCafe = { init: init };
})(window);
