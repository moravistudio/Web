/*
 * Portada «Aurea» (joyería). La luz hace brillar la joya.
 *  - Una sortija de oro con una piedra grande. El cursor (o el dedo) es una linterna: donde pasa la luz, el oro y la piedra
 *    brillan y aparecen destellos de cuatro puntas en las facetas. Sin cursor, un haz de luz recorre la joya cada pocos segundos.
 *  - Cada clic o toque: destello y lluvia de polvo dorado, y la piedra cambia (diamante → zafiro → esmeralda; imágenes reales).
 * Se usa con: <div class="cv cv-aurea"></div>  (el contenido lo crea este archivo). Llamar Aurea.init(contenedor).
 * Cuidado de rendimiento: solo anima mientras se ve en pantalla y con la pestaña visible; pocas partículas;
 * con «reducir movimiento» queda la sortija quieta, con la piedra iluminada y sin destellos animados.
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var DIR = BASE + 'assets/portadas/aurea/';
  var STONES = [
    { f: 'sortija-diamante.webp', name: 'Diamante', tone: '255,246,214' },
    { f: 'sortija-zafiro.webp', name: 'Zafiro', tone: '190,214,255' },
    { f: 'sortija-esmeralda.webp', name: 'Esmeralda', tone: '190,255,222' }
  ];
  // Zona visible de la imagen (fracciones) y piedra (centro y radio como fracción del ancho de la imagen)
  var BOX = { x0: 0.0997, x1: 0.9003, y0: 0.1715, y1: 0.8381 };
  var GEM = { cx: 0.5, cy: 0.345, r: 0.205 };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var outBack = function (t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

  function init(el) {
    if (!el || el.__aurea) return;
    el.__aurea = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<div class="cv__bokeh"></div>' +
      '<canvas class="cv__dust" aria-hidden="true"></canvas>' +
      '<div class="cv__stones"></div>' +
      '<canvas class="cv__fx" aria-hidden="true"></canvas>' +
      '<div class="cv__flash"></div>' +
      '<div class="cv__logo">AUREA</div>' +
      '<div class="cv__tag">Joyas con luz propia</div>' +
      '<div class="cv__name"><span class="cv__name-t">Diamante</span></div>' +
      '<span class="cv__btn">Ver colección</span>';
    var dustC = el.querySelector('.cv__dust'), dctx = dustC.getContext('2d'), fxC = el.querySelector('.cv__fx'), fctx = fxC.getContext('2d'),
        box = el.querySelector('.cv__stones'), flashEl = el.querySelector('.cv__flash'), nameEl = el.querySelector('.cv__name-t');
    var stones = STONES.map(function (s) {
      var wrap = document.createElement('div'); wrap.className = 'cv__stone';
      var a = new Image(); a.className = 'cv__ring'; a.alt = ''; a.draggable = false; a.src = DIR + s.f;
      var b = new Image(); b.className = 'cv__lit'; b.alt = ''; b.draggable = false; b.src = DIR + s.f;
      wrap.appendChild(a); wrap.appendChild(b); box.appendChild(wrap); return { s: s, wrap: wrap, base: a, lit: b };
    });

    var W = 0, H = 0, U = 0, dpr = 1, side = 0, left = 0, top = 0, gx = 0, gy = 0, gr = 0;
    var cur = 0, prev = -1, changeT = -1e9, flash = 0, lastTap = -1e9, lastAuto = 0, nameTimer = 0;
    var stars = [], dust = [], sparks = [], lastT = 0, starAcc = 0;
    var ptr = { x: 0, y: 0, in: false }, light = { x: 0, y: 0, a: 0 };
    var t0 = performance.now();
    var vis = true, running = false, raf = 0;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      U = Math.min(W, H); dpr = Math.min(window.devicePixelRatio || 1, 2);
      [dustC, fxC].forEach(function (c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // la sortija: su contenido mide ~64 % del ancho; el centro visible va un poco bajo el centro (deja sitio al logo y al texto)
      side = U * 0.64 / (BOX.x1 - BOX.x0);
      var bw = (BOX.x0 + BOX.x1) / 2, bh = (BOX.y0 + BOX.y1) / 2;
      left = W / 2 - side * bw; top = U * 0.475 - side * bh;   // se ancla al lado menor, igual que los textos (que van en cqmin)
      stones.forEach(function (st) {
        [st.base, st.lit].forEach(function (im) { im.style.cssText = 'width:' + side + 'px;height:' + side + 'px;left:' + left + 'px;top:' + top + 'px;'; });
      });
      gx = left + side * GEM.cx; gy = top + side * GEM.cy; gr = side * GEM.r;
      dust = [];
      for (var i = 0; i < 38; i++) dust.push({ x: Math.random() * W, y: Math.random() * H, v: 0.04 + Math.random() * 0.12, r: 0.5 + Math.random() * 1.4, p: Math.random() * 6.28, a: 0.15 + Math.random() * 0.5 });
    }

    function newStar(x, y, size, life) {
      stars.push({ x: x, y: y, size: size || (U * (0.035 + Math.random() * 0.05)), age: 0, life: life || (0.5 + Math.random() * 0.5), rot: (Math.random() - 0.5) * 0.5 });
    }
    function setName(txt) {
      clearTimeout(nameTimer); nameEl.classList.add('swap');
      nameTimer = setTimeout(function () { nameEl.textContent = txt; nameEl.classList.remove('swap'); }, 220);
    }
    function go(now, to, burst) {
      prev = cur; cur = ((to % STONES.length) + STONES.length) % STONES.length; changeT = now; flash = 1;
      el.dispatchEvent(new CustomEvent('aurea:gem', { detail: { index: cur } }));
      setName(STONES[cur].name);
      if (burst) {
        for (var i = 0; i < 9; i++) { var a = Math.random() * 6.2832, d = Math.random() * gr * 0.9; newStar(gx + Math.cos(a) * d, gy + Math.sin(a) * d * 0.9, U * (0.04 + Math.random() * 0.07), 0.6 + Math.random() * 0.6); }
        for (var k = 0; k < 46; k++) {
          var ang = Math.random() * 6.2832, sp = U * (0.2 + Math.random() * 0.55);
          sparks.push({ x: gx, y: gy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - U * 0.08, age: 0, life: 0.8 + Math.random() * 0.9, r: U * (0.003 + Math.random() * 0.005) });
        }
      }
    }

    function drawDust(t, dt) {
      dctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dust.length; i++) {
        var d = dust[i];
        if (!reduce) { d.y -= d.v * U * dt * 6; d.x += Math.sin(t * 0.6 + d.p) * U * dt * 0.05; if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; } }
        var tw = 0.55 + 0.45 * Math.sin(t * 1.8 + d.p);
        dctx.fillStyle = 'rgba(255,214,130,' + (d.a * tw).toFixed(2) + ')';
        dctx.beginPath(); dctx.arc(d.x, d.y, d.r, 0, 6.2832); dctx.fill();
      }
    }

    function drawStar(x, y, size, a, rot, tone) {
      fctx.save(); fctx.translate(x, y); fctx.rotate(rot);
      var g = fctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.55);
      g.addColorStop(0, 'rgba(255,255,255,' + (0.9 * a).toFixed(2) + ')'); g.addColorStop(0.3, 'rgba(' + tone + ',' + (0.4 * a).toFixed(2) + ')'); g.addColorStop(1, 'rgba(' + tone + ',0)');
      fctx.fillStyle = g; fctx.beginPath(); fctx.arc(0, 0, size * 0.55, 0, 6.2832); fctx.fill();
      fctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(2) + ')';
      for (var k = 0; k < 2; k++) {
        fctx.beginPath(); fctx.moveTo(-size, 0); fctx.quadraticCurveTo(0, size * 0.03, size, 0); fctx.quadraticCurveTo(0, -size * 0.03, -size, 0); fctx.fill();
        fctx.rotate(Math.PI / 2);
      }
      fctx.restore();
    }

    function place(now, t, dt) {
      // luz: sigue al cursor; sin cursor, un haz recorre la joya cada ~6 s
      var autoPhase = ((t - 1.2) % 6.5) / 2.6;      // 0..1 recorre; el resto espera
      var idle = !ptr.in && (now - lastTap > 1500);
      var tx, ty, ta;
      if (ptr.in) { tx = ptr.x; ty = ptr.y; ta = 1; }
      else if (idle && autoPhase >= 0 && autoPhase <= 1 && !reduce) { var p = ease(autoPhase); tx = W * (0.12 + p * 0.76); ty = H * (0.62 - Math.sin(p * 3.1416) * 0.2); ta = Math.sin(p * 3.1416) * 1.1; }
      else { tx = light.x || W / 2; ty = light.y || H / 2; ta = 0; }
      light.x += (tx - light.x) * 0.16; light.y += (ty - light.y) * 0.16; light.a += (ta - light.a) * 0.12;
      if (reduce) { light.x = gx; light.y = gy; light.a = 0.8; }
      var R = U * 0.38;
      // cambio de piedra: la nueva entra con un ligero rebote y la anterior se desvanece
      var ca = (now - changeT) / 1000;
      for (var i = 0; i < stones.length; i++) {
        var st = stones[i], op = 0, sc = 1;
        if (i === cur) { var f = reduce ? 1 : clamp(ca / 0.55, 0, 1); op = prev < 0 && ca > 1e5 ? 1 : f < 1 ? Math.min(1, f * 2.2) : 1; if (prev < 0) op = reduce ? 1 : clamp((t - 0.1) / 0.8, 0, 1); sc = prev < 0 ? (reduce ? 1 : 0.94 + 0.06 * outBack(clamp((t - 0.1) / 0.8, 0, 1))) : 0.96 + 0.04 * outBack(f); }
        else if (i === prev && ca < 0.5 && !reduce) { op = 1 - clamp(ca / 0.5, 0, 1); }
        st.wrap.style.opacity = op.toFixed(3);
        st.wrap.style.transform = 'translate3d(0,' + (Math.sin(t * 1.1) * U * 0.004).toFixed(2) + 'px,0) scale(' + sc.toFixed(4) + ')';
        st.wrap.style.transformOrigin = gx + 'px ' + gy + 'px';
        if (op > 0.01) {
          var lx = light.x - left, ly = light.y - top;
          st.lit.style.setProperty('--lx', lx.toFixed(1) + 'px'); st.lit.style.setProperty('--ly', ly.toFixed(1) + 'px'); st.lit.style.setProperty('--lr', (R * 1.0).toFixed(1) + 'px');
          st.lit.style.opacity = clamp(light.a, 0, 1).toFixed(3);
        }
      }
      flashEl.style.opacity = (flash * 0.85).toFixed(3);
      flash *= Math.max(0, 1 - dt * 3.2);
      // destellos: aparecen en la piedra, más cerca de la luz
      starAcc += dt * (reduce ? 0 : (2.2 + 9 * light.a));
      while (starAcc >= 1) {
        starAcc -= 1;
        var a = Math.random() * 6.2832, rr = Math.sqrt(Math.random()) * gr * 0.95;
        var px = gx + Math.cos(a) * rr, py = gy + Math.sin(a) * rr * 0.92;
        if (light.a > 0.2 && Math.random() < 0.75) { var ang = Math.random() * 6.2832, dd = Math.random() * R * 0.5; px = clamp(light.x + Math.cos(ang) * dd, gx - gr, gx + gr); py = clamp(light.y + Math.sin(ang) * dd, gy - gr, gy + gr); }
        newStar(px, py);
      }
      // sin interacción, cambia de piedra sola cada ~9 s
      if (!reduce && t > 3 && now - lastTap > 8000 && now - lastAuto > 9000) { lastAuto = now; go(now, cur + 1, true); }
    }

    function drawFx(dt) {
      fctx.clearRect(0, 0, W, H);
      fctx.globalCompositeOperation = 'lighter';
      var tone = STONES[cur].tone;
      for (var i = stars.length - 1; i >= 0; i--) {
        var s = stars[i]; s.age += dt; if (s.age > s.life) { stars.splice(i, 1); continue; }
        var k = s.age / s.life, a = Math.sin(Math.PI * k), sz = s.size * (0.4 + 0.6 * Math.sin(Math.PI * k));
        drawStar(s.x, s.y, sz, a, s.rot + k * 0.6, tone);
      }
      for (var j = sparks.length - 1; j >= 0; j--) {
        var p = sparks[j]; p.age += dt; if (p.age > p.life) { sparks.splice(j, 1); continue; }
        p.vy += U * 0.5 * dt; p.vx *= (1 - 1.1 * dt); p.x += p.vx * dt; p.y += p.vy * dt;
        var kk = 1 - p.age / p.life;
        fctx.fillStyle = 'rgba(255,214,120,' + kk.toFixed(2) + ')'; fctx.beginPath(); fctx.arc(p.x, p.y, p.r * (0.5 + kk), 0, 6.2832); fctx.fill();
        fctx.fillStyle = 'rgba(255,255,235,' + (kk * 0.8).toFixed(2) + ')'; fctx.beginPath(); fctx.arc(p.x, p.y, p.r * 0.45, 0, 6.2832); fctx.fill();
      }
      fctx.globalCompositeOperation = 'source-over';
    }

    function frame(now) {
      raf = 0; if (!running) return;
      var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016; lastT = now;
      var t = (now - t0) / 1000;
      place(now, t, dt); drawDust(t, dt); drawFx(dt);
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
    el.addEventListener('pointerdown', function (ev) { setPtr(ev); var now = performance.now(); lastTap = now; lastAuto = now; go(now, cur + 1, true); });
    // La portada que rodea la pieza puede pedir una gema concreta (selector de gemas)
    el.addEventListener('aurea:set', function (ev) { var now = performance.now(); lastTap = now; lastAuto = now; if (ev.detail.index !== cur) go(now, ev.detail.index, true); });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') ptr.in = false; });
    el.addEventListener('pointercancel', function () { ptr.in = false; });

    layout();
    if (global.ResizeObserver) new ResizeObserver(layout).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    if (reduce) { place(t0 + 5000, 5, 0.016); drawDust(5, 0.016); }
    sync();
  }

  global.Aurea = { init: init };
})(window);
