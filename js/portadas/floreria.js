/*
 * Parte interactiva de la portada «Flora» (florería): un ramo de seis flores que florece.
 *  - Empieza con las flores en capullo. Cada clic o toque abre la siguiente (capullo → flor abierta, con un pequeño «pop»
 *    y pétalos que salen volando) y cambia el color suave del fondo.
 *  - Cuando están las seis abiertas, el ramo respira un momento y vuelve a cerrarse para empezar de nuevo.
 *  - El cursor (o el dedo) inclina las flores hacia él, cada una con su peso, como mecidas por el aire.
 *  - Sin interacción, se abren solas una a una.
 * Se usa con: <div class="cv cv-flora"></div>  (el contenido lo crea este archivo). Llamar Floreria.init(contenedor).
 * Cuidado de rendimiento: solo anima mientras se ve en pantalla y con la pestaña visible; con «reducir movimiento»
 * queda el ramo abierto y quieto.
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var DIR = BASE + 'assets/portadas/floreria/';
  // Tamaño (en la imagen original) y posición de la base del tallo de cada flor; «ang» abre el ramo en abanico;
  // «len» escalona la altura; «z» es el orden de superposición; «petal» el color de sus pétalos sueltos.
  var FL = [
    { n: 'rosa', k: 1, w: 334, h: 604, stem: 172.4, ang: -44, len: 0.70, z: 2, petal: '#d6203a' },
    { n: 'girasol', k: 2, w: 380, h: 604, stem: 177.7, ang: -25, len: 0.93, z: 4, petal: '#ffcb1f' },
    { n: 'tulipan', k: 3, w: 240, h: 594, stem: 125.5, ang: -7, len: 1.03, z: 6, petal: '#ff7fae' },
    { n: 'peonia', k: 4, w: 364, h: 596, stem: 174.5, ang: 11, len: 0.96, z: 5, petal: '#fff3df' },
    { n: 'margarita', k: 5, w: 318, h: 588, stem: 145.5, ang: 29, len: 0.76, z: 3, petal: '#ffffff' },
    { n: 'lavanda', k: 6, w: 222, h: 611, stem: 109.6, ang: 46, len: 0.78, z: 1, petal: '#9b7bd0' }
  ];
  var BG = ['#f7dbe4', '#fbeac2', '#d9ecdc', '#dfe3f7', '#f6dccf', '#e7dcf1']; // un tono suave por cada flor que se abre
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var outBack = function (t) { var c1 = 2, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }

  function init(el) {
    if (!el || el.__flora) return;
    el.__flora = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<div class="cv__bg"></div><div class="cv__bgnew"></div>' +
      '<div class="cv__flowers"></div>' +
      '<canvas class="cv__fx" aria-hidden="true"></canvas>' +
      '<div class="cv__logo"><b>FLORA</b> florería</div>';
    var bgNew = el.querySelector('.cv__bgnew'), bgOld = el.querySelector('.cv__bg'), box = el.querySelector('.cv__flowers'), fx = el.querySelector('.cv__fx'), fctx = fx.getContext('2d');
    var items = FL.map(function (f) {
      var wrap = document.createElement('div'); wrap.className = 'cv__fl'; wrap.style.zIndex = String(f.z);
      var bud = new Image(); bud.className = 'cv__bud'; bud.alt = ''; bud.draggable = false; bud.src = DIR + 'capullo-' + f.k + '-' + f.n + '.webp';
      var open = new Image(); open.className = 'cv__open'; open.alt = ''; open.draggable = false; open.src = DIR + 'abierta-' + f.k + '-' + f.n + '.webp';
      wrap.appendChild(bud); wrap.appendChild(open); box.appendChild(wrap);
      return { f: f, wrap: wrap, bud: bud, open: open, state: 0, t: -1, ph: Math.random() * 6.28, sway: 0, swayV: 0 };
    });

    var W = 0, H = 0, U = 0, dpr = 1, ox = 0, oy = 0, scale = 1, nOpen = 0, lastTap = -1e9, lastAuto = 0, allT = -1, bgIdx = -1;
    var petals = [], lastT = 0;
    var ptr = { x: 0, y: 0, in: false }, lp = { x: 0, y: 0 };
    var t0 = performance.now() - (parseFloat((/[?&]t=([0-9.]+)/.exec(location.search) || [])[1]) || 0) * 1000;
    var vis = true, running = false, raf = 0;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      U = Math.min(W, H); dpr = Math.min(window.devicePixelRatio || 1, 2);
      fx.width = Math.round(W * dpr); fx.height = Math.round(H * dpr); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ox = W * 0.5; oy = H * 1.02;                       // punto donde se juntan los tallos (abajo, centro)
      scale = (H * 0.84) / (604 * 0.75);                   // las imágenes están al 75 % del tamaño original: la flor más alta mide ~80 % del alto
      items.forEach(function (it) {
        var f = it.f, w = f.w * 0.75, h = f.h * 0.75;
        it.wrap.style.cssText = 'position:absolute;left:0;top:0;width:' + w * 1 + 'px;height:' + h + 'px;z-index:' + f.z + ';transform-origin:' + (f.stem * 0.75) + 'px ' + h + 'px;';
        it.bud.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;';
        it.open.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;';
        it.w = w; it.h = h;
      });
    }

    function color(i) { return BG[(i + BG.length) % BG.length]; }
    function setBg(i) {
      if (i === bgIdx) return; bgIdx = i;
      bgOld.style.background = bgNew.style.background || color(i); bgNew.style.opacity = 0; bgNew.style.background = color(i);
      void bgNew.offsetWidth; bgNew.style.opacity = 1;
    }
    function burst(it, now) {
      // pétalos sueltos desde la cabeza de la flor
      var f = it.f, a = f.ang * Math.PI / 180, L = it.h * scale * f.len;
      var hx = ox + Math.sin(a) * L * 0.86, hy = oy - Math.cos(a) * L * 0.86;
      var c = hex(f.petal);
      for (var i = 0; i < 16; i++) {
        var ang = Math.random() * 6.2832, v = U * (0.12 + Math.random() * 0.35);
        petals.push({ x: hx, y: hy, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - U * 0.18, r: U * (0.012 + Math.random() * 0.016), rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 8, age: 0, life: 1.1 + Math.random() * 0.9, c: c });
      }
    }
    function openNext(now) {
      var it = items[nOpen]; if (!it || it.state) return;
      it.state = 1; it.t = now; setBg(nOpen); burst(it, now); nOpen++;
      if (nOpen >= items.length) allT = now;
    }
    function closeAll(now) { items.forEach(function (it) { it.state = 0; it.t = now; }); nOpen = 0; allT = -1; }

    function place(now, t, dt) {
      lp.x += (ptr.x - lp.x) * 0.09; lp.y += (ptr.y - lp.y) * 0.09;
      var enter = reduce ? 1 : clamp((t - 0.05) / 0.9, 0, 1);
      items.forEach(function (it, i) {
        var f = it.f, a0 = f.ang;
        // apertura: pop con rebote
        var k = it.state ? clamp((now - it.t) / 650, 0, 1) : 0, pop = it.state ? (reduce ? 1 : outBack(k)) : 0;
        var closing = !it.state && it.t > 0 ? clamp((now - it.t) / 450, 0, 1) : 1; // al cerrar, vuelve al capullo
        var openAmt = it.state ? ease(k) : (it.t > 0 ? 1 - ease(closing) : 0);
        it.open.style.opacity = clamp(openAmt * 1.3, 0, 1).toFixed(3);
        it.bud.style.opacity = clamp(1 - openAmt * 1.3, 0, 1).toFixed(3);
        // balanceo hacia el cursor + viento suave, cada flor con su peso
        var tx = ptr.in ? clamp((lp.x - ox) / (W * 0.5), -1, 1) : Math.sin(t * 0.5 + it.ph) * 0.25;
        var target = tx * (5 + i * 0.7) + Math.sin(t * 1.1 + it.ph) * 1.1;
        it.swayV += (target - it.sway) * 14 * dt; it.swayV *= (1 - 4 * dt); it.sway += it.swayV * dt;
        var sc = scale * f.len, grow = reduce ? 1 : (0.4 + 0.6 * ease(clamp((enter * 1.4 - i * 0.1), 0, 1)));
        var popScale = 1 + (it.state ? 0.12 * Math.sin(k * Math.PI) : 0);
        it.wrap.style.opacity = Math.min(1, enter * 2.2).toFixed(2);
        it.wrap.style.transform = 'translate(' + (ox - f.stem * 0.75).toFixed(1) + 'px,' + (oy - it.h).toFixed(1) + 'px) scale(' + (sc * grow * popScale).toFixed(4) + ') rotate(' + (a0 + it.sway + (pop - openAmt) * 2).toFixed(2) + 'deg)';
        it.wrap.style.transformOrigin = (f.stem * 0.75) + 'px ' + it.h + 'px';
      });
      // sin interacción: se abren solas; al terminar, se cierra todo y vuelve a empezar
      if (!reduce && t > 2.2 && now - lastTap > 6000) {
        if (allT > 0 && now - allT > 2600) closeAll(now);
        else if (allT < 0 && now - lastAuto > 1500) { lastAuto = now; openNext(now); }
      } else if (allT > 0 && now - allT > 3200 && now - lastTap > 1500) closeAll(now);
    }

    function drawFx(dt) {
      fctx.clearRect(0, 0, W, H);
      for (var i = petals.length - 1; i >= 0; i--) {
        var p = petals[i]; p.age += dt; if (p.age > p.life) { petals.splice(i, 1); continue; }
        p.vy += U * 0.22 * dt; p.vx *= (1 - 0.8 * dt); p.x += p.vx * dt + Math.sin(p.age * 5 + p.rot) * U * 0.02 * dt * 8; p.y += p.vy * dt; p.rot += p.vr * dt;
        var k = 1 - p.age / p.life;
        fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.rot); fctx.globalAlpha = clamp(k * 1.4, 0, 1);
        fctx.fillStyle = 'rgb(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ')';
        fctx.beginPath(); fctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.2832); fctx.fill();
        fctx.globalAlpha = clamp(k * 1.4, 0, 1) * 0.35; fctx.fillStyle = '#fff'; fctx.beginPath(); fctx.ellipse(-p.r * 0.25, -p.r * 0.12, p.r * 0.45, p.r * 0.2, 0, 0, 6.2832); fctx.fill();
        fctx.restore();
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
      var go = vis && !document.hidden && !reduce;
      if (go && !running) { running = true; lastT = 0; if (!raf) raf = requestAnimationFrame(frame); }
      else if (!go) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    }
    function setPtr(ev) { var r = el.getBoundingClientRect(); ptr.x = ev.clientX - r.left; ptr.y = ev.clientY - r.top; ptr.in = true; }
    el.addEventListener('pointerenter', setPtr);
    el.addEventListener('pointermove', setPtr, { passive: true });
    el.addEventListener('pointerleave', function () { ptr.in = false; });
    el.addEventListener('pointerdown', function (ev) {
      setPtr(ev); var now = performance.now(); lastTap = now; lastAuto = now;
      if (allT > 0 && now - allT > 400) closeAll(now); else openNext(now);
    });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') ptr.in = false; });
    el.addEventListener('pointercancel', function () { ptr.in = false; });

    setBg(-1 + 6); bgNew.style.opacity = 1; bgNew.style.background = '#e7dcf1'; bgOld.style.background = '#e7dcf1'; bgIdx = 5;
    layout();
    if (global.ResizeObserver) new ResizeObserver(layout).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    if (reduce) { items.forEach(function (it) { it.state = 1; it.t = -1e9; }); nOpen = items.length; place(t0 + 5000, 5, 0.016); }
    sync();
  }

  global.Floreria = { init: init };
})(window);
