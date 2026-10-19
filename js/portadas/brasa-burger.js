/*
 * Portada «Brasa Burger» (hamburguesería). La hamburguesa cae capa por capa y se arma; después se abre en vista
 * explosionada por sí sola cada pocos segundos, o cuando el cursor está encima; el cursor además mueve cada capa a
 * distinta profundidad. Brasas que suben de fondo.
 * Se usa con: <div class="cv cv-burger"></div>  (el contenido lo crea este archivo). Llamar BrasaBurger.init(contenedor).
 * Cuidado de rendimiento: solo anima mientras se ve en pantalla y con la pestaña visible; las brasas son pocas;
 * con «reducir movimiento» queda la hamburguesa armada y quieta.
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var IMG = BASE + 'assets/portadas/brasa-burger/';
  // Posición de cada capa en la imagen original (1024×1536): x, y, ancho, alto
  var L = [
    { f: 'capa-1-pan-superior.webp', x: 141, y: 36, w: 741, h: 309 },
    { f: 'capa-2-lechuga.webp', x: 98, y: 340, w: 828, h: 256 },
    { f: 'capa-3-tomate.webp', x: 131, y: 565, w: 743, h: 207 },
    { f: 'capa-4-queso.webp', x: 137, y: 749, w: 737, h: 249 },
    { f: 'capa-5-carne.webp', x: 135, y: 930, w: 747, h: 266 },
    { f: 'capa-6-pan-inferior.webp', x: 139, y: 1176, w: 735, h: 299 }
  ];
  // Posición «armada»: cada capa se apoya sobre la siguiente con un pequeño solape
  var OVER = [0, 60, 120, 90, 170, 60]; // solape con la capa de arriba
  var assembledTop = [], i;
  assembledTop[0] = L[0].y;
  for (i = 1; i < L.length; i++) assembledTop[i] = assembledTop[i - 1] + L[i - 1].h - OVER[i];
  var DELTA = L.map(function (l, k) { return l.y - assembledTop[k]; }); // cuánto sube/baja cada capa al abrirse
  var EXPL_H = 1440, ASSEMBLED_H = assembledTop[5] + L[5].h - assembledTop[0];
  var DEPTH = [1, 0.7, 0.5, 0.4, 0.25, 0.1]; // parallax: las de arriba se mueven más
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var outBack = function (t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

  function init(el) {
    if (!el || el.__brasa) return;
    el.__brasa = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<canvas class="cv__embers" aria-hidden="true"></canvas><div class="cv__glow"></div>' +
      '<div class="cv__bar"><span class="cv__logo"><b>BRASA</b> BURGER</span><span class="cv__links"><span>Menú</span><span>Locales</span><span>Pedir</span></span></div>' +
      '<div class="cv__copy"><div class="cv__h">Sabor<br>a <em>fuego</em></div><p class="cv__p">Hamburguesas a la parrilla, hechas al momento.</p><span class="cv__btn">Pedir ahora</span></div>' +
      '<div class="cv__stage"></div>';
    var stage = el.querySelector('.cv__stage'), glow = el.querySelector('.cv__glow'), cv = el.querySelector('.cv__embers');
    var imgs = L.map(function (l) { var im = new Image(); im.className = 'cv__layer'; im.alt = ''; im.draggable = false; im.src = IMG + l.f; im.style.zIndex = String(L.length - L.indexOf(l)); stage.appendChild(im); return im; });

    var W = 0, H = 0, k = 1, cx = 0, top0 = 0, dpr = 1, embers = [], ctx = cv.getContext('2d');
    var smoke = [], lastS = 0;
    var smokeSprite = (function () { var c = document.createElement('canvas'); c.width = c.height = 128; var g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(225,205,190,.55)'); gr.addColorStop(0.35, 'rgba(190,160,140,.28)'); gr.addColorStop(0.7, 'rgba(150,120,105,.09)'); gr.addColorStop(1, 'rgba(120,95,85,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c; })();
    function newSmoke(anywhere) {
      var life = 6 + Math.random() * 4;
      return { x: cx + (Math.random() * 2 - 1) * W * 0.34, y: anywhere ? H * (0.2 + Math.random() * 0.8) : H * (1.0 + Math.random() * 0.08), r: 38 + Math.random() * 40, g: 22 + Math.random() * 26, vy: 16 + Math.random() * 16, age: anywhere ? Math.random() * life : 0, life: life, a: 0.5 + Math.random() * 0.5, p: Math.random() * 6.28 };
    }
    var px = 0, tx = 0, hover = false, e = 0, t0 = performance.now() - (parseFloat((/[?&]t=([0-9.]+)/.exec(location.search) || [])[1]) || 0) * 1000, vis = true, running = false, raf = 0;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      k = (H * 0.86) / EXPL_H;
      cx = W * 0.675;
      top0 = (H - EXPL_H * k) / 2 + H * 0.03;
      imgs.forEach(function (im, n) { im.style.width = (L[n].w * k) + 'px'; });
      smoke = [];
      for (var q = 0; q < 16; q++) smoke.push(newSmoke(true));
      embers = [];
      for (var n = 0; n < 34; n++) embers.push({ x: Math.random() * W, y: Math.random() * H, v: 0.15 + Math.random() * 0.55, r: 0.6 + Math.random() * 1.8, p: Math.random() * 6.28, a: 0.35 + Math.random() * 0.6 });
    }

    function place(now) {
      var t = (now - t0) / 1000;
      // Apertura: tras la caída inicial, ciclo automático (armada → abierta → armada); con el cursor encima, abierta
      var auto;
      if (reduce) auto = 0;
      else if (t < 3.4) auto = 0;
      else { var c = (t - 3.4) % 8; auto = c < 2.2 ? 0 : c < 3.6 ? ease((c - 2.2) / 1.4) : c < 5.2 ? 1 : c < 6.6 ? 1 - ease((c - 5.2) / 1.4) : 0; }
      var target = hover ? 1.12 : auto;
      e += (target - e) * 0.09;
      px += (tx - px) * 0.08;
      var shiftC = (1 - clamp(e, 0, 1)) * ((EXPL_H - ASSEMBLED_H) / 2) * k; // armada: centrada
      for (var n = 0; n < imgs.length; n++) {
        // Caída inicial: de abajo hacia arriba, cada capa con su retraso
        var drop = 1;
        if (!reduce) { var st = 0.15 + (5 - n) * 0.32; drop = clamp((t - st) / 0.75, 0, 1); }
        var y = top0 + (assembledTop[n] + DELTA[n] * e) * k + shiftC;
        var fall = (1 - outBack(drop)) * -H * 0.9;
        var fl = reduce ? 0 : Math.sin(t * 1.3 + n * 0.8) * H * 0.004 * (0.4 + e);
        var dx = px * W * 0.03 * DEPTH[n] * (0.5 + e * 0.8);
        var x = cx + (L[n].x - 512) * k + dx;
        var rot = px * (1.5 - n * 0.2) * (0.4 + e * 0.6);
        imgs[n].style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + (y + fall + fl).toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg)';
        imgs[n].style.opacity = drop > 0 ? Math.min(1, drop * 3) : 0;
      }
      glow.style.opacity = (0.3 + 0.5 * clamp(e, 0, 1.1)).toFixed(2);
      return t;
    }

    function drawEmbers(now) {
      ctx.clearRect(0, 0, W, H);
      // Humo suave: nubes tibias y difusas que suben despacio, se ensanchan y se desvanecen (detrás de la hamburguesa)
      var us = Math.min(W, H) / 430, ds = lastS ? Math.min(0.05, (now - lastS) / 1000) : 0.016; lastS = now;
      ctx.globalCompositeOperation = 'source-over';
      for (var sm = 0; sm < smoke.length; sm++) {
        var f = smoke[sm];
        if (!reduce) { f.age += ds; f.y -= f.vy * us * ds * (1 + 0.5 * clamp(e, 0, 1)); f.x += Math.sin(f.age * 0.8 + f.p) * 14 * us * ds + 5 * us * ds; if (f.age > f.life) { smoke[sm] = f = newSmoke(false); } }
        var fr = f.age / f.life, size = (f.r + f.g * fr) * us * 2.6;
        ctx.globalAlpha = clamp(Math.pow(Math.sin(Math.PI * clamp(fr, 0, 1)), 1.3) * 0.65 * f.a * (0.75 + 0.5 * clamp(e, 0, 1)), 0, 1);
        ctx.drawImage(smokeSprite, f.x - size / 2, f.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'lighter';
      for (var n = 0; n < embers.length; n++) {
        var m = embers[n];
        if (!reduce) { m.y -= m.v; m.x += Math.sin(now / 900 + m.p) * 0.25; if (m.y < -6) { m.y = H + 6; m.x = Math.random() * W; } }
        var a = m.a * clamp(m.y / (H * 0.5), 0, 1) * (0.6 + 0.4 * Math.sin(now / 300 + m.p));
        ctx.fillStyle = 'rgba(255,' + (110 + Math.round(m.a * 70)) + ',30,' + a.toFixed(2) + ')';
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    function frame(now) { raf = 0; if (!running) return; place(now); drawEmbers(now); raf = requestAnimationFrame(frame); }
    function sync() {
      var go = vis && !document.hidden && !reduce;
      if (go && !running) { running = true; if (!raf) raf = requestAnimationFrame(frame); }
      else if (!go) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    }

    el.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse') hover = true; });
    el.addEventListener('pointerleave', function () { hover = false; tx = 0; });
    el.addEventListener('pointermove', function (ev) {
      var r = el.getBoundingClientRect(); tx = clamp((ev.clientX - r.left) / r.width * 2 - 1, -1, 1);
      if (ev.pointerType !== 'mouse') hover = true;
    }, { passive: true });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') { hover = false; tx = 0; } });
    el.addEventListener('pointercancel', function () { hover = false; tx = 0; });

    layout();
    if (global.ResizeObserver) new ResizeObserver(layout).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    if (reduce) { place(t0 + 5000); drawEmbers(t0); }
    sync();
  }

  global.BrasaBurger = { init: init };
})(window);
