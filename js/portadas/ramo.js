/*
 * Parte interactiva de la portada «Flora» (florería): «Elige tu ramo».
 * A la derecha hay seis flores para elegir; a la izquierda se arma el ramo. Un clic en una flor la agrega al ramo (cae y se
 * acomoda en abanico); otro clic en ella, o directamente sobre la flor dentro del ramo, la quita. Debajo, un resumen con las
 * flores elegidas. El cursor (o el dedo) mece las flores del ramo.
 * Se usa con: <div class="cv cv-ramo"></div>  (el contenido lo crea este archivo). Llamar Ramo.init(contenedor).
 * Cuidado de rendimiento: solo anima mientras se ve en pantalla y con la pestaña visible; con «reducir movimiento»
 * no hay animaciones (el ramo cambia directamente).
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var DIR = BASE + 'assets/portadas/floreria/';
  // De izquierda a derecha en el ramo: rojo, blanco, amarillo, rosado, blanco, morado.
  var FL = [
    { n: 'rosa', k: 1, label: 'Rosa', w: 334, h: 604, stem: 172.4, len: 0.82, z: 2, petal: '#d6203a' },
    { n: 'peonia', k: 4, label: 'Peonía', w: 364, h: 596, stem: 174.5, len: 0.9, z: 4, petal: '#fff3df' },
    { n: 'girasol', k: 2, label: 'Girasol', w: 380, h: 604, stem: 177.7, len: 1.0, z: 5, petal: '#ffcb1f' },
    { n: 'tulipan', k: 3, label: 'Tulipán', w: 240, h: 594, stem: 125.5, len: 1.04, z: 7, petal: '#ff7fae' },
    { n: 'margarita', k: 5, label: 'Margarita', w: 318, h: 588, stem: 145.5, len: 0.8, z: 3, petal: '#ffffff' },
    { n: 'lavanda', k: 6, label: 'Lavanda', w: 222, h: 611, stem: 109.6, len: 0.84, z: 1, petal: '#9b7bd0' }
  ];
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var outBack = function (t) { var c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }

  function init(el) {
    if (!el || el.__ramo) return;
    el.__ramo = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<div class="cv__paper"></div>' +
      '<div class="cv__flowers"></div>' +
      '<canvas class="cv__fx" aria-hidden="true"></canvas>' +
      '<div class="cv__logo">FLORA</div>' +
      '<div class="cv__title">Elige tus flores</div>' +
      '<div class="cv__chips"></div>' +
      '<div class="cv__sum"><span class="cv__sum-t">Tu ramo está vacío</span></div>' +
      '<span class="cv__btn">Crear mi ramo</span>';
    var box = el.querySelector('.cv__flowers'), fx = el.querySelector('.cv__fx'), fctx = fx.getContext('2d'), chips = el.querySelector('.cv__chips'), sumEl = el.querySelector('.cv__sum-t');
    var items = FL.map(function (f, i) {
      var wrap = document.createElement('div'); wrap.className = 'cv__fl'; wrap.style.zIndex = String(f.z);
      var im = new Image(); im.alt = ''; im.draggable = false; im.src = DIR + 'abierta-' + f.k + '-' + f.n + '.webp'; wrap.appendChild(im); box.appendChild(wrap);
      var chip = document.createElement('button'); chip.type = 'button'; chip.className = 'cv__chip'; chip.setAttribute('aria-label', f.label);
      var cv = document.createElement('canvas'); cv.width = cv.height = 96; chip.appendChild(cv);
      var tip = document.createElement('span'); tip.className = 'cv__chip-n'; tip.textContent = f.label; chip.appendChild(tip);
      chips.appendChild(chip);
      var it = { f: f, i: i, wrap: wrap, img: im, chip: chip, cv: cv, sel: false, t: -1e9, ang: 0, ang0: 0, sway: 0, swayV: 0, ph: Math.random() * 6.28, grow: 0 };
      im.onload = function () { drawChip(it); };
      return it;
    });
    function drawChip(it) {
      var c = it.cv.getContext('2d'); c.clearRect(0, 0, 96, 96);
      if (!it.img.naturalWidth) return;
      var iw = it.img.naturalWidth, side = iw;                        // cuadrado desde arriba: queda la cabeza de la flor
      c.drawImage(it.img, 0, 0, iw, side, 6, 6, 84, 84);
    }

    var W = 0, H = 0, U = 0, dpr = 1, ox = 0, oy = 0, scale = 1, petals = [], lastT = 0, sumTxt = '';
    var ptr = { x: 0, y: 0, in: false }, lp = { x: 0, y: 0 };
    var t0 = performance.now() - (parseFloat((/[?&]t=([0-9.]+)/.exec(location.search) || [])[1]) || 0) * 1000;
    var vis = true, running = false, raf = 0;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      U = Math.min(W, H); dpr = Math.min(window.devicePixelRatio || 1, 2);
      fx.width = Math.round(W * dpr); fx.height = Math.round(H * dpr); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ox = W * 0.315; oy = H * 1.03;                       // punto donde se juntan los tallos
      scale = (H * 0.7) / (604 * 0.75);
      items.forEach(function (it) {
        var f = it.f, w = f.w * 0.75, h = f.h * 0.75; it.w = w; it.h = h;
        it.wrap.style.cssText = 'position:absolute;left:0;top:0;width:' + w + 'px;height:' + h + 'px;transform-origin:' + (f.stem * 0.75) + 'px ' + h + 'px;opacity:0;z-index:' + f.z + ';';
        it.img.style.cssText = 'display:block;width:100%;height:100%;max-width:none;';
      });
      // botones: cuadrícula 3 × 2 a la derecha
      var d = Math.min(W * 0.1, H * 0.24), gap = d * 0.2, cols = 3, gw = cols * d + (cols - 1) * gap, gx = W * 0.795 - gw / 2, gy = H * 0.26;
      chips.style.cssText = 'left:' + gx + 'px;top:' + gy + 'px;width:' + gw + 'px;gap:' + gap + 'px;';
      items.forEach(function (it) { it.chip.style.width = it.chip.style.height = d + 'px'; });
    }

    function targets() {
      var sel = items.filter(function (it) { return it.sel; }), n = sel.length;
      sel.forEach(function (it, k) { it.ang0 = n === 1 ? 0 : -29 + 58 * k / (n - 1); });
    }
    function summary() {
      var names = items.filter(function (it) { return it.sel; }).map(function (it) { return it.f.label; });
      var txt = names.length > 3 ? names.length + ' flores elegidas' : (names.length ? names.join(' · ') : 'Tu ramo está vacío');
      if (txt === sumTxt) return; sumTxt = txt;
      sumEl.classList.add('swap'); setTimeout(function () { sumEl.textContent = txt; sumEl.classList.remove('swap'); }, 160);
    }
    function burst(it) {
      var f = it.f, a = it.ang * Math.PI / 180, L = it.h * scale * f.len, hx = ox + Math.sin(a) * L * 0.86, hy = oy - Math.cos(a) * L * 0.86, c = hex(f.petal);
      for (var i = 0; i < 12; i++) {
        var ang = Math.random() * 6.2832, v = U * (0.1 + Math.random() * 0.3);
        petals.push({ x: hx, y: hy, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - U * 0.14, r: U * (0.012 + Math.random() * 0.014), rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 8, age: 0, life: 0.9 + Math.random() * 0.8, c: c });
      }
    }
    function toggle(it, now) {
      it.sel = !it.sel; it.t = now;
      if (it.sel) { it.ang = it.ang0 || 0; }
      it.chip.classList.toggle('on', it.sel);
      targets(); summary();
      if (it.sel) { it.ang = it.ang0; burst(it); }
    }

    function place(now, t, dt) {
      lp.x += (ptr.x - lp.x) * 0.09; lp.y += (ptr.y - lp.y) * 0.09;
      var enter = reduce ? 1 : clamp((t - 0.05) / 0.8, 0, 1);
      items.forEach(function (it) {
        var f = it.f, k = clamp((now - it.t) / (it.sel ? 650 : 330), 0, 1);
        var g = it.sel ? (reduce ? 1 : outBack(k)) : (reduce ? 0 : 1 - ease(k));
        it.grow = g;
        if (it.sel) it.ang += (it.ang0 - it.ang) * Math.min(1, dt * 9);
        var tx = ptr.in ? clamp((lp.x - ox) / (W * 0.4), -1, 1) : Math.sin(t * 0.5 + it.ph) * 0.25;
        var target = tx * (4 + it.i * 0.5) + Math.sin(t * 1.1 + it.ph) * 1.0;
        it.swayV += (target - it.sway) * 14 * dt; it.swayV *= (1 - 4 * dt); it.sway += it.swayV * dt;
        var show = (it.sel || (!reduce && k < 1 && it.t > 0)) ? 1 : 0;
        var sc = scale * f.len * Math.max(0.001, g);
        it.wrap.style.opacity = (show ? clamp(g * 2.2, 0, 1) * Math.min(1, enter * 2) : 0).toFixed(2);
        it.wrap.style.transform = 'translate(' + (ox - f.stem * 0.75).toFixed(1) + 'px,' + (oy - it.h).toFixed(1) + 'px) scale(' + sc.toFixed(4) + ') rotate(' + (it.ang + it.sway).toFixed(2) + 'deg)';
        // el botón crece un poco cuando está elegido
        it.chip.style.transform = it.sel ? 'scale(1.06)' : '';
      });
    }

    function drawFx(dt) {
      fctx.clearRect(0, 0, W, H);
      for (var i = petals.length - 1; i >= 0; i--) {
        var p = petals[i]; p.age += dt; if (p.age > p.life) { petals.splice(i, 1); continue; }
        p.vy += U * 0.22 * dt; p.vx *= (1 - 0.8 * dt); p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        var k = 1 - p.age / p.life;
        fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.rot); fctx.globalAlpha = clamp(k * 1.4, 0, 1);
        fctx.fillStyle = 'rgb(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ')';
        fctx.beginPath(); fctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.2832); fctx.fill(); fctx.restore();
      }
    }

    function frame(now) {
      raf = 0; if (!running) return;
      var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016; lastT = now;
      var t = (now - t0) / 1000;
      place(now, t, dt); drawFx(dt);
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      var go = vis && !document.hidden;
      if (go && !running) { running = true; lastT = 0; if (!raf) raf = requestAnimationFrame(frame); }
      else if (!go) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    }
    function setPtr(ev) { var r = el.getBoundingClientRect(); ptr.x = ev.clientX - r.left; ptr.y = ev.clientY - r.top; ptr.in = true; }
    // ¿qué flor del ramo está bajo el cursor? (círculo de la cabeza, de la más cercana a la cámara hacia atrás)
    function bouquetAt(x, y) {
      var order = items.filter(function (it) { return it.sel; }).sort(function (a, b) { return b.f.z - a.f.z; });
      for (var i = 0; i < order.length; i++) {
        var it = order[i], f = it.f, a = (it.ang + it.sway) * Math.PI / 180, L = it.h * scale * f.len, hx = ox + Math.sin(a) * L * 0.86, hy = oy - Math.cos(a) * L * 0.86, r = it.w * scale * f.len * 0.42;
        if ((x - hx) * (x - hx) + (y - hy) * (y - hy) <= r * r) return it;
      }
      return null;
    }
    el.addEventListener('pointerenter', setPtr);
    el.addEventListener('pointermove', function (ev) { setPtr(ev); if (ev.pointerType === 'mouse') el.style.cursor = (ev.target.closest && ev.target.closest('.cv__chip')) || bouquetAt(ptr.x, ptr.y) ? 'pointer' : ''; }, { passive: true });
    el.addEventListener('pointerleave', function () { ptr.in = false; el.style.cursor = ''; });
    el.addEventListener('pointerdown', function (ev) {
      setPtr(ev); var now = performance.now();
      var chip = ev.target.closest && ev.target.closest('.cv__chip');
      if (chip) { toggle(items[Array.prototype.indexOf.call(chips.children, chip)], now); return; }
      var hit = bouquetAt(ptr.x, ptr.y); if (hit) toggle(hit, now);
    });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') ptr.in = false; });
    el.addEventListener('pointercancel', function () { ptr.in = false; });

    layout();
    // ramo inicial: dos flores para que no empiece vacío y se entienda
    toggle(items[0], -1e9); toggle(items[2], -1e9); items[0].t = items[2].t = -1e9; items.forEach(function (it) { if (it.sel) it.grow = 1; });
    sumTxt = ''; summary();
    if (global.ResizeObserver) new ResizeObserver(layout).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    place(t0 + 5000, 5, 0.016);
    sync();
  }

  global.Ramo = { init: init };
})(window);
