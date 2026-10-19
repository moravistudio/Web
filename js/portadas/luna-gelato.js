/*
 * Portada «Luna Gelato» (heladería). El cono sube y las bolas caen una a una y se apilan sobre él; la cereza cae al final.
 * Cada cierto tiempo (o al pasar el cursor / tocar) el helado se abre un poco, las bolas gotean y cambian de sabor:
 * fresa, pistacho y vainilla pasan a arándano, mango y chocolate (y vuelven).
 * Se usa con: <div class="cv cv-gelato"></div>  (el contenido lo crea este archivo). Llamar LunaGelato.init(contenedor).
 * Cuidado de rendimiento: solo anima mientras se ve en pantalla y con la pestaña visible;
 * con «reducir movimiento» queda el helado armado y quieto.
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var IMG = BASE + 'assets/portadas/luna-gelato/';
  // Posición de cada pieza en la imagen original (1024×1536): x, y, ancho, alto  (de arriba hacia abajo)
  var L = [
    { f: 'capa-1-cereza.webp', x: 434, y: 18, w: 206, h: 211, cls: '' },
    { f: 'capa-2-bola-fresa.webp', x: 333, y: 219, w: 361, h: 309, cls: 's1' },
    { f: 'capa-3-bola-pistacho.webp', x: 326, y: 490, w: 366, h: 318, cls: 's2' },
    { f: 'capa-4-bola-vainilla.webp', x: 328, y: 765, w: 374, h: 305, cls: 's3' },
    { f: 'capa-5-cono.webp', x: 373, y: 1031, w: 273, h: 460, cls: '' }
  ];
  // Posición «armada»: cada bola descansa sobre la de abajo, tapando un poco con sus goteos
  var OVER = [0, 20, 125, 125, 80]; // solape con la pieza de arriba
  var T = [], i;
  T[0] = L[0].y;
  for (i = 1; i < L.length; i++) T[i] = T[i - 1] + L[i - 1].h - OVER[i];
  // La cereza se apoya sobre la fresa: se ancla a ella
  T[0] = T[1] - L[0].h + 24;
  var DELTA = L.map(function (l, n) { return l.y - T[n]; });
  var EXPL_TOP = L[0].y, EXPL_H = (L[4].y + L[4].h) - L[0].y;
  var ASM_TOP = T[0], ASM_H = (T[4] + L[4].h) - T[0];
  var DEPTH = [1, 0.7, 0.5, 0.35, 0.15];
  var DROP_ORDER = [4, 3, 2, 1, 0]; // cae primero el cono, la cereza al final
  var FLAVORS = [['#ff9db8', '#c9df9a', '#fff0cf'], ['#9d98ff', '#ffb04a', '#7a4a33']];
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var outBack = function (t) { var c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

  function init(el) {
    if (!el || el.__luna) return;
    el.__luna = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<div class="cv__blob cv__blob--1"></div><div class="cv__blob cv__blob--2"></div><div class="cv__blob cv__blob--3"></div>' +
      '<div class="cv__logo"><b>LUNA</b> GELATO</div>' +
      '<div class="cv__stage"></div><canvas class="cv__drops" aria-hidden="true"></canvas>' +
      '<div class="cv__tag"><span class="cv__tag-a">Fresa · Pistacho · Vainilla</span><span class="cv__tag-b">Arándano · Mango · Chocolate</span></div>' +
      '<span class="cv__btn">Elegir sabor</span>';
    var stage = el.querySelector('.cv__stage'), cv = el.querySelector('.cv__drops'), ctx = cv.getContext('2d');
    var imgs = L.map(function (l) { var im = new Image(); im.className = 'cv__layer' + (l.cls ? ' cv__' + l.cls : ''); im.alt = ''; im.draggable = false; im.src = IMG + l.f; im.style.zIndex = String(L.length - L.indexOf(l)); stage.appendChild(im); return im; });

    var W = 0, H = 0, k = 1, cx = 0, top0 = 0, dpr = 1, drops = [], dacc = 0, lastD = 0;
    var px = 0, tx = 0, hover = false, e = 0, alt = false, t0 = performance.now() - (parseFloat((/[?&]t=([0-9.]+)/.exec(location.search) || [])[1]) || 0) * 1000;
    var vis = true, running = false, raf = 0, lastCycle = -1;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      k = Math.min((H * 0.72) / EXPL_H, (W * 0.6) / 374);
      cx = W * 0.5;
      top0 = H * 0.105;
      imgs.forEach(function (im, n) { im.style.width = (L[n].w * k) + 'px'; });
    }

    function setAlt(v) { if (alt !== v) { alt = v; el.classList.toggle('is-alt', alt); } }

    function place(now) {
      var t = (now - t0) / 1000;
      // Ciclo automático: armado → abierto (cambia de sabor y gotea) → armado
      var auto = 0, cyc = Math.floor(Math.max(0, t - 3.4) / 8);
      if (!reduce && t >= 3.4) {
        var c = (t - 3.4) % 8;
        auto = c < 2.2 ? 0 : c < 3.4 ? ease((c - 2.2) / 1.2) : c < 5.4 ? 1 : c < 6.6 ? 1 - ease((c - 5.4) / 1.2) : 0;
        if (!hover) setAlt(((cyc + (c >= 2.2 ? 1 : 0)) % 2) === 1);
      }
      var target = hover ? 1 : auto;
      e += (target - e) * 0.09;
      px += (tx - px) * 0.08;
      var openAmt = clamp(e, 0, 1);
      // armado: centrado en su zona; abierto: ocupa un poco más
      var asmShift = ((EXPL_H - ASM_H) / 2) * k * (1 - openAmt);
      for (var n = 0; n < imgs.length; n++) {
        var drop = 1;
        if (!reduce) { var st = 0.1 + DROP_ORDER.indexOf(n) * 0.42; drop = clamp((t - st) / 0.8, 0, 1); }
        var y = top0 + (T[n] - ASM_TOP + (DELTA[n] + (ASM_TOP - EXPL_TOP)) * openAmt) * k + asmShift;
        var fall = n === 4 ? (1 - ease(drop)) * H * 0.5 : (1 - outBack(drop)) * -H * 0.95;
        var fl = reduce ? 0 : Math.sin(t * 1.4 + n * 0.9) * H * 0.0035 * (0.4 + openAmt);
        var dx = px * W * 0.04 * DEPTH[n] * (0.5 + openAmt * 0.8);
        var x = cx + (L[n].x - 512 + L[n].w / 2 - (L[n].x - 512 + L[n].w / 2) * 0) * k - (L[n].w * k) / 2 + dx;
        var rot = px * (1.2 - n * 0.2) * (0.4 + openAmt * 0.6);
        imgs[n].style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + (y + fall + fl).toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg)';
        imgs[n].style.opacity = drop > 0 ? Math.min(1, drop * 3) : 0;
      }
      return { t: t, open: openAmt };
    }

    // Gotas que caen de las bolas cuando el helado se abre
    function drawDrops(now, st) {
      ctx.clearRect(0, 0, W, H);
      if (reduce) return;
      var dt = lastD ? Math.min(0.05, (now - lastD) / 1000) : 0.016; lastD = now;
      var u = H / 436;
      if (st.open > 0.45 && st.t > 3) {
        dacc += dt * 7 * st.open;
        while (dacc >= 1) {
          dacc -= 1;
          var s = 1 + Math.floor(Math.random() * 3);          // bola 1, 2 ó 3
          var n = s, y = top0 + (T[n] - ASM_TOP + (DELTA[n] + (ASM_TOP - EXPL_TOP)) * clamp(e, 0, 1)) * k + 0;
          var bottom = y + L[n].h * k * 0.9;
          drops.push({ x: cx + (Math.random() - 0.5) * L[n].w * k * 0.7 + px * W * 0.04 * DEPTH[n], y: bottom, vy: 10 * u, s: s - 1, r: (1.6 + Math.random() * 1.8) * u, a: 1 });
        }
      }
      var set = FLAVORS[alt ? 1 : 0];
      for (var d = drops.length - 1; d >= 0; d--) {
        var p = drops[d]; p.vy += 520 * u * dt; p.y += p.vy * dt; p.a -= dt * 0.95;
        if (p.a <= 0 || p.y > H + 10) { drops.splice(d, 1); continue; }
        ctx.globalAlpha = clamp(p.a, 0, 1); ctx.fillStyle = set[p.s];
        var len = p.r * (1.6 + p.vy / (160 * u));
        ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, len, 0, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = clamp(p.a, 0, 1) * 0.55; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p.x - p.r * 0.3, p.y - len * 0.3, p.r * 0.32, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function frame(now) { raf = 0; if (!running) return; var st = place(now); drawDrops(now, st); raf = requestAnimationFrame(frame); }
    function sync() {
      var go = vis && !document.hidden && !reduce;
      if (go && !running) { running = true; if (!raf) raf = requestAnimationFrame(frame); }
      else if (!go) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    }

    el.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse') { hover = true; setAlt(!alt); } });
    el.addEventListener('pointerleave', function () { hover = false; tx = 0; });
    el.addEventListener('pointermove', function (ev) {
      var r = el.getBoundingClientRect(); tx = clamp((ev.clientX - r.left) / r.width * 2 - 1, -1, 1);
    }, { passive: true });
    el.addEventListener('pointerdown', function (ev) { if (ev.pointerType !== 'mouse') { hover = true; setAlt(!alt); } });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') { hover = false; tx = 0; } });
    el.addEventListener('pointercancel', function () { hover = false; tx = 0; });

    layout();
    if (global.ResizeObserver) new ResizeObserver(layout).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    if (reduce) place(t0 + 5000);
    sync();
  }

  global.LunaGelato = { init: init };
})(window);
