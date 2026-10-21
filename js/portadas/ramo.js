/*
 * Parte interactiva de la portada «Flora» (florería): «Elige tu ramo».
 * Cada flor se puede agregar hasta 3 veces (un 4.º toque quita todas las de ese tipo). A la derecha hay seis flores para elegir; a la izquierda se arma el ramo. Un clic en una flor la agrega al ramo (cae y se
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
    { n: 'rosa', k: 1, label: 'Rosa', w: 303, h: 560, stem: 99.5, len: 0.82, z: 2, petal: '#d6203a' },
    { n: 'peonia', k: 4, label: 'Peonía', w: 351, h: 560, stem: 189.3, len: 0.9, z: 4, petal: '#fff3df' },
    { n: 'girasol', k: 2, label: 'Girasol', w: 356, h: 560, stem: 116.1, len: 1.0, z: 5, petal: '#ffcb1f' },
    { n: 'tulipan', k: 3, label: 'Tulipán', w: 228, h: 560, stem: 116.6, len: 1.04, z: 7, petal: '#ff7fae' },
    { n: 'margarita', k: 5, label: 'Margarita', w: 264, h: 560, stem: 115, len: 0.8, z: 3, petal: '#ffffff' },
    { n: 'lavanda', k: 6, label: 'Lavanda', w: 142, h: 560, stem: 68.8, len: 0.84, z: 1, petal: '#9b7bd0' }
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
      '<div class="cv__wrapb"><img alt="" draggable="false"></div>' +
      '<div class="cv__flowers"></div>' +
      '<div class="cv__wrapf"><img alt="" draggable="false"></div>' +
      '<canvas class="cv__fx" aria-hidden="true"></canvas>' +
      '<div class="cv__logo">FLORA</div>' +
      '<div class="cv__title">Elige tus flores</div>' +
      '<div class="cv__chips"></div>' +
      '<div class="cv__sum"><span class="cv__sum-t">Tu ramo está vacío</span></div>' +
      '<span class="cv__btn">Crear mi ramo</span>';
    var wrapB = el.querySelector('.cv__wrapb'), wrapF = el.querySelector('.cv__wrapf'), wrapBi = wrapB.querySelector('img'), wrapFi = wrapF.querySelector('img'), box = el.querySelector('.cv__flowers'), fx = el.querySelector('.cv__fx'), fctx = fx.getContext('2d'), chips = el.querySelector('.cv__chips'), sumEl = el.querySelector('.cv__sum-t');
    wrapBi.src = wrapFi.src = DIR + 'papel-kraft.webp';
    var MAXN = 9;                                  // máximo de flores en el ramo
    var types = FL.map(function (f, i) {
      var chip = document.createElement('button'); chip.type = 'button'; chip.className = 'cv__chip'; chip.setAttribute('aria-label', f.label);
      var cv = document.createElement('canvas'); cv.width = cv.height = 96; chip.appendChild(cv);
      var tip = document.createElement('span'); tip.className = 'cv__chip-n'; tip.textContent = f.label; chip.appendChild(tip);
      chips.appendChild(chip);
      return { f: f, i: i, chip: chip, cv: cv, n: 0, img0: null };
    });
    var items = [];
    FL.forEach(function (f, i) {
      for (var j = 0; j < 3; j++) {
        var wrap = document.createElement('div'); wrap.className = 'cv__fl'; wrap.style.zIndex = String(f.z);
        var im = new Image(); im.alt = ''; im.draggable = false; im.src = DIR + 'abierta-' + f.k + '-' + f.n + '.webp'; wrap.appendChild(im); box.appendChild(wrap);
        var it = { f: f, i: i, j: j, ty: types[i], wrap: wrap, img: im, sel: false, t: -1e9, ang: 0, ang0: 0, sway: 0, swayV: 0, ph: Math.random() * 6.28, grow: 0, lenF: 1, sizeF: 1, curLen: f.len, rank: ((i * 3 + j) * 7) % 19 };
        if (j === 0) { types[i].img0 = im; (function (ty) { im.onload = function () { drawChip(ty); }; })(types[i]); }
        items.push(it);
      }
    });
    function drawChip(ty) {
      var c = ty.cv.getContext('2d'); c.clearRect(0, 0, 96, 96);
      if (!ty.img0 || !ty.img0.naturalWidth) return;
      var iw = ty.img0.naturalWidth, side = iw;                        // cuadrado desde arriba: queda la cabeza de la flor
      c.drawImage(ty.img0, 0, 0, iw, side, 6, 6, 84, 84);
    }

    var W = 0, H = 0, U = 0, dpr = 1, ox = 0, oy = 0, scale = 1, petals = [], lastT = 0, sumTxt = '';
    var ptr = { x: 0, y: 0, in: false }, lp = { x: 0, y: 0 };
    var wb = 0, wbV = 0, wbox = { l: 0, r: 0, t: 0, b: 0 };   // papel kraft: ángulo y velocidad del vaivén al tocarlo; zona del ramo que reacciona al toque
    var t0 = performance.now();
    var vis = true, running = false, raf = 0;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      U = Math.min(W, H); dpr = Math.min(window.devicePixelRatio || 1, 2);
      fx.width = Math.round(W * dpr); fx.height = Math.round(H * dpr); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Ramo envuelto en papel kraft con cinta: una capa de papel DETRÁS de las flores (el interior) y otra DELANTE (la parte de abajo, recortada por el borde de la boca en V), así las flores quedan dentro del papel
      var ww = Math.min(W * 0.25, H * 0.54), hc = ww * 835 / 568, wl = W * 0.315 - ww / 2, wt = H * 0.33, box0 = 'position:absolute;left:' + wl + 'px;top:' + wt + 'px;width:' + ww + 'px;pointer-events:none;';
      wrapB.style.cssText = box0 + 'z-index:1;transform-origin:50% 92%;'; wrapF.style.cssText = box0 + 'z-index:3;transform-origin:50% 92%;';
      wbox = { l: wl - ww * 0.6, r: wl + ww * 1.6, t: wt - H * 0.22, b: wt + hc };
      wrapBi.style.cssText = wrapFi.style.cssText = 'display:block;width:100%;height:auto;max-width:none;';
      wrapFi.style.clipPath = 'polygon(0% 23.1%, 6.7% 23.4%, 43.1% 31.7%, 47.5% 34.7%, 73.9% 29.9%, 84.5% 20.4%, 98.6% 12%, 100% 12%, 100% 100%, 0% 100%)';
      wrapB.style.filter = wrapF.style.filter = 'drop-shadow(0 ' + (H * 0.015) + 'px ' + (H * 0.025) + 'px rgba(60,40,20,.25))';
      ox = W * 0.315; oy = wt + hc * 0.347 + H * 0.04;     // punto donde se juntan los tallos (debajo de la boca del papel: queda tapado por la parte delantera)
      scale = (H * 0.56) / (560 * 0.75);
      items.forEach(function (it) {
        var f = it.f, w = f.w * 0.75, h = f.h * 0.75; it.w = w; it.h = h;
        it.wrap.style.cssText = 'position:absolute;left:0;top:0;width:' + w + 'px;height:' + h + 'px;transform-origin:' + (f.stem * 0.75) + 'px ' + h + 'px;opacity:0;z-index:' + f.z + ';';
        it.img.style.cssText = 'display:block;width:100%;height:100%;max-width:none;';
      });
      // botones: cuadrícula 3 × 2 a la derecha
      var d = Math.min(W * 0.1, H * 0.19), gap = d * 0.2, cols = 3, gw = cols * d + (cols - 1) * gap, gx = W * 0.795 - gw / 2, gy = H * 0.215;
      chips.style.cssText = 'left:' + gx + 'px;top:' + gy + 'px;width:' + gw + 'px;gap:' + gap + 'px;';
      types.forEach(function (ty) { ty.chip.style.width = ty.chip.style.height = d + 'px'; });
    }

    function chosen() { return items.filter(function (it) { return it.sel; }); }
    // Reparto en abanico: más flores = abanico más abierto y flores un poco más chicas; alturas escalonadas (las del centro más altas)
    // y las más bajas por delante, para que ninguna flor quede tapada por completo por otra
    function targets() {
      var sel = chosen().sort(function (a, b) { return a.rank - b.rank; }), n = sel.length;
      var half = clamp(14 + 3.5 * n, 20, 46), sizeF = clamp(1.02 - 0.035 * n, 0.78, 1);
      sel.forEach(function (it, k) {
        var tt = n === 1 ? 0 : (k / (n - 1)) * 2 - 1;
        it.ang0 = tt * half; it.sizeF = sizeF; it.lenF = (1 - 0.12 * Math.abs(tt)) * (k % 2 ? 0.86 : 1);
        it.curLen = it.f.len * it.lenF * it.sizeF;
        it.wrap.style.zIndex = String(20 + Math.round((2 - it.f.len * it.lenF) * 10) * 10 + k + (it.i === 0 ? 40 : 0)); // las más bajas por delante; la rosa un escalón más al frente
      });
    }
    function summary() {
      var parts = types.filter(function (ty) { return ty.n > 0; }).map(function (ty) { return ty.n > 1 ? ty.n + ' ' + ty.f.label.toLowerCase() + (ty.f.label.slice(-1) === 'z' ? 'ces' : 's') : ty.f.label; });
      var total = chosen().length;
      var txt = total >= MAXN ? 'Ramo completo · ' + total + ' flores' : total > 3 ? total + ' flores elegidas' : (parts.length ? parts.join(' · ') : 'Tu ramo está vacío');
      if (txt === sumTxt) return; sumTxt = txt;
      sumEl.classList.add('swap'); setTimeout(function () { sumEl.textContent = txt; sumEl.classList.remove('swap'); }, 160);
    }
    function burst(it) {
      var f = it.f, a = it.ang * Math.PI / 180, L = it.h * scale * it.curLen, hx = ox + Math.sin(a) * L * 0.86, hy = oy - Math.cos(a) * L * 0.86, c = hex(f.petal);
      for (var i = 0; i < 12; i++) {
        var ang = Math.random() * 6.2832, v = U * (0.1 + Math.random() * 0.3);
        petals.push({ x: hx, y: hy, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - U * 0.14, r: U * (0.012 + Math.random() * 0.014), rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 8, age: 0, life: 0.9 + Math.random() * 0.8, c: c });
      }
    }
    function chipUI(ty) {
      ty.chip.classList.toggle('on', ty.n > 0);
      ty.chip.setAttribute('data-n', ty.n > 1 ? String(ty.n) : '');
      ty.chip.style.transform = ty.n > 0 ? 'scale(1.06)' : '';
    }
    // Botón de una flor: 1.er toque la agrega; 2.º y 3.er toque agregan otra igual; el toque siguiente quita todas las de ese tipo (vuelve a cero)
    function addOrReset(ty, now) {
      if (ty.n < 3 && chosen().length < MAXN) {
        var it = items.filter(function (x) { return x.i === ty.i && !x.sel; })[0];
        it.sel = true; it.t = now; ty.n++;
        targets(); it.ang = it.ang0; chipUI(ty); summary(); burst(it);
      } else if (ty.n > 0) {
        // ya hay 3 de este tipo, o el ramo está completo (9): el toque quita las de este tipo y vuelve a cero
        items.forEach(function (x) { if (x.i === ty.i && x.sel) { x.sel = false; x.t = now; } });
        ty.n = 0; targets(); chipUI(ty); summary();
      } else {
        // ramo completo y este tipo no está en el ramo: no cabe, el botón tiembla
        ty.chip.classList.remove('full'); void ty.chip.offsetWidth; ty.chip.classList.add('full');
      }
    }
    // Toque sobre una flor dentro del ramo: quita solo esa
    function removeOne(it, now) {
      it.sel = false; it.t = now; it.ty.n--; targets(); chipUI(it.ty); summary();
    }

    // Toque sobre el ramo (papel, cinta o tallos): el ramo entero se mece un poquito y vuelve a su sitio
    function bump(x) {
      if (reduce) return;
      var dir = x < ox ? 1 : -1;
      wbV += 40 * dir;
      items.forEach(function (it) { if (it.sel) it.swayV += 14 * dir; });
    }
    function place(now, t, dt) {
      wbV += (-wb * 90 - wbV * 6) * dt; wb += wbV * dt;
      var wt3 = 'rotate(' + wb.toFixed(2) + 'deg)'; wrapB.style.transform = wrapF.style.transform = wt3;
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
        var sc = scale * it.curLen * Math.max(0.001, g);
        it.wrap.style.opacity = (show ? clamp(g * 2.2, 0, 1) * Math.min(1, enter * 2) : 0).toFixed(2);
        it.wrap.style.transform = 'translate(' + (ox - f.stem * 0.75).toFixed(1) + 'px,' + (oy - it.h).toFixed(1) + 'px) scale(' + sc.toFixed(4) + ') rotate(' + (it.ang + it.sway).toFixed(2) + 'deg)';
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
      var order = chosen().sort(function (a, b) { return (parseInt(b.wrap.style.zIndex, 10) || 0) - (parseInt(a.wrap.style.zIndex, 10) || 0); });
      for (var i = 0; i < order.length; i++) {
        var it = order[i], a = (it.ang + it.sway) * Math.PI / 180, L = it.h * scale * it.curLen, hx = ox + Math.sin(a) * L * 0.86, hy = oy - Math.cos(a) * L * 0.86, r = it.w * scale * it.curLen * 0.42;
        if ((x - hx) * (x - hx) + (y - hy) * (y - hy) <= r * r) return it;
      }
      return null;
    }
    el.addEventListener('pointerenter', setPtr);
    // el botón «Crear mi ramo» no recibe el cursor (todo el cuadro es de la portada): su «hover» se calcula por posición
    var btnEl = el.querySelector('.cv__btn');
    function overBtn(ev) { var b = btnEl.getBoundingClientRect(); return ev.clientX >= b.left && ev.clientX <= b.right && ev.clientY >= b.top && ev.clientY <= b.bottom; }
    el.addEventListener('pointermove', function (ev) { setPtr(ev); if (ev.pointerType === 'mouse') { var ob = overBtn(ev); btnEl.classList.toggle('hot', ob); el.style.cursor = ob || (ev.target.closest && ev.target.closest('.cv__chip')) || bouquetAt(ptr.x, ptr.y) ? 'pointer' : ''; } }, { passive: true });
    el.addEventListener('pointerleave', function () { ptr.in = false; el.style.cursor = ''; btnEl.classList.remove('hot'); });
    el.addEventListener('pointerdown', function (ev) {
      setPtr(ev); var now = performance.now();
      var chip = ev.target.closest && ev.target.closest('.cv__chip');
      if (chip) { addOrReset(types[Array.prototype.indexOf.call(chips.children, chip)], now); return; }
      var hit = bouquetAt(ptr.x, ptr.y);
      if (hit) removeOne(hit, now);
      else if (ptr.x >= wbox.l && ptr.x <= wbox.r && ptr.y >= wbox.t && ptr.y <= wbox.b) bump(ptr.x);
    });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') ptr.in = false; });
    el.addEventListener('pointercancel', function () { ptr.in = false; });

    layout();
    // ramo inicial: dos flores para que no empiece vacío y se entienda
    addOrReset(types[0], -1e9); addOrReset(types[2], -1e9); items.forEach(function (it) { if (it.sel) { it.t = -1e9; it.grow = 1; } });
    sumTxt = ''; summary();
    if (global.ResizeObserver) new ResizeObserver(layout).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    place(t0 + 5000, 5, 0.016);
    sync();
  }

  global.Ramo = { init: init };
})(window);
