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
  var OVER = [0, 110, 120, 90, 170, 60]; // solape con la capa de arriba (el pan baja más sobre la lechuga: la miga queda tapada)
  var Z = [5, 6, 4, 3, 2, 1]; // la lechuga va por delante del pan
  var CRUMB = 26; // % inferior del pan superior que se recorta cuando está cerrado (la cara interior, la miga)
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
      '<div class="cv__copy"><div class="cv__h"><span class="cv__h1">Sabor</span><br><span class="cv__h2">a <em class="cv__fuego"><canvas class="cv__fcv" aria-hidden="true"></canvas><span class="cv__fw">fuego</span></em></span></div><p class="cv__p">Hamburguesas a la parrilla, hechas al momento.</p><span class="cv__btn">Pedir ahora</span></div>' +
      '<div class="cv__stage"></div><canvas class="cv__smokefront" aria-hidden="true"></canvas>';
    var stage = el.querySelector('.cv__stage'), glow = el.querySelector('.cv__glow'), cv = el.querySelector('.cv__embers'), cf = el.querySelector('.cv__smokefront'), cfx = cf.getContext('2d');
    var imgs = L.map(function (l) { var im = new Image(); im.className = 'cv__layer'; im.alt = ''; im.draggable = false; im.src = IMG + l.f; im.style.zIndex = String(Z[L.indexOf(l)]); stage.appendChild(im); return im; });

    var W = 0, H = 0, k = 1, cx = 0, top0 = 0, dpr = 1, embers = [], ctx = cv.getContext('2d');
    var smoke = [], fsmoke = [], lastS = 0;
    // --- Palabra «fuego»: llamas reales que suben (sin girar) por dentro de las letras y se escapan hacia arriba ---
    var fuego = el.querySelector('.cv__fuego'), fcv = el.querySelector('.cv__fcv'), fctx = fcv.getContext('2d');
    var fireImg = new Image(); fireImg.src = IMG + 'fuego.webp';
    var maskC = document.createElement('canvas'), mctx = maskC.getContext('2d'), fireC = document.createElement('canvas'), fxc = fireC.getContext('2d');
    var wsparks = [], wacc = 0;
    var FD = { ox: 0, oy: 0, tw: 0, th: 0, w: 0, h: 0, pad: 0, base: 0, fs: 0, xs: [], word: 'fuego', ok: false }, Lf = 0, wasLit = false;
    function layoutFire() {
      var cs = getComputedStyle(fuego), fs = parseFloat(cs.fontSize), r = fuego.getBoundingClientRect();
      if (!r.width || !fs) return;
      var d = Math.min(window.devicePixelRatio || 1, 2), pad = fs * 0.3, head = fs * 2.3, tail = fs * 0.4;
      var w = r.width + pad * 2, h = head + r.height + tail;
      [fcv, maskC, fireC].forEach(function (c) { c.width = Math.round(w * d); c.height = Math.round(h * d); });
      [fctx, mctx, fxc].forEach(function (c) { c.setTransform(d, 0, 0, d, 0, 0); });
      fcv.style.cssText = 'left:' + (-pad) + 'px;top:' + (-head) + 'px;width:' + w + 'px;height:' + h + 'px;';
      mctx.font = cs.fontWeight + ' ' + fs + 'px ' + cs.fontFamily; mctx.textBaseline = 'alphabetic';
      if ('letterSpacing' in mctx) mctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
      var m = mctx.measureText('fuego'), asc = m.fontBoundingBoxAscent || fs * 0.98, dsc = m.fontBoundingBoxDescent || fs * 0.3;
      var er = el.getBoundingClientRect(); FD.ox = r.left - er.left; FD.oy = r.top - er.top; FD.tw = r.width; FD.th = r.height;
      FD.w = w; FD.h = h; FD.pad = pad; FD.fs = fs; FD.base = head + (r.height - (asc + dsc)) / 2 + asc;
      FD.xs = []; for (var i = 0; i < FD.word.length; i++) FD.xs.push(mctx.measureText(FD.word.slice(0, i)).width);
      FD.ok = true;
    }
    function drawFire(t) {
      if (!FD.ok || !fireImg.complete || !fireImg.naturalWidth) return;
      if (Lf < 0.01) { if (fcv.style.opacity !== '0') { fcv.style.opacity = '0'; } return; }
      var w = FD.w, h = FD.h, fs = FD.fs, i, k;
      // 1) Forma: las letras, más una estela hacia arriba que se mece (la lengua de fuego de cada letra tiene su propia altura)
      mctx.clearRect(0, 0, w, h); mctx.globalCompositeOperation = 'lighter';
      mctx.save(); mctx.beginPath(); mctx.rect(0, 0, w, FD.base + fs * 0.03); mctx.clip();
      for (i = 0; i < FD.word.length; i++) {
        var hf = clamp((0.6 + 0.4 * Math.sin(t * 2.3 + i * 1.9) * Math.sin(t * 0.9 + i)) * Lf, 0, 1.2);
        for (k = 0; k <= 16; k++) {
          var fr = k / 16, yoff = fr * fs * 1.25 * hf, sway = (0.11 + 0.05 * Math.sin(t * 1.3 + i * 1.7) + 0.035 * Math.sin(t * 4.1 + k * 0.45 + i * 1.3) - px * 0.3) * fs * fr; // px: las llamas se inclinan lejos del cursor
          mctx.fillStyle = 'rgba(255,255,255,' + (Math.pow(1 - fr, 1.8) * 0.34).toFixed(3) + ')';
          mctx.fillText(FD.word[i], FD.pad + FD.xs[i] + sway, FD.base - yoff);
        }
      }
      mctx.restore();
      mctx.globalCompositeOperation = 'source-over'; mctx.fillStyle = '#fff'; mctx.fillText(FD.word, FD.pad, FD.base);
      // 2) Llamas: la imagen sube siempre hacia arriba; tres copias desfasadas que se funden entre sí (nunca baja ni gira)
      fxc.globalCompositeOperation = 'source-over'; fxc.globalAlpha = 1; fxc.clearRect(0, 0, w, h);
      var bg = fxc.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#c2410c'); bg.addColorStop(0.55, '#e8590c'); bg.addColorStop(1, '#ff9a1f'); fxc.fillStyle = bg; fxc.fillRect(0, 0, w, h);
      var Wi = Math.max(w * 2.3, h * 2.6), Hi = Wi * 2 / 3, D = Hi * 0.4, iw = fireImg.naturalWidth, ih = fireImg.naturalHeight;
      for (i = 0; i < 3; i++) {
        var ph = ((t * 0.34 + i / 3) % 1), a = Math.sin(Math.PI * ph);
        var y = (h - Hi) + D * (1 - ph), x = -(Wi - w) * (0.5 + 0.12 * Math.sin(t * 0.45 + i * 2.1));
        fxc.globalAlpha = Math.min(1, a * 1.25);
        fxc.drawImage(fireImg, 0, ih * 0.3, iw, ih * 0.7, x, y + Hi * 0.18, Wi, Hi * 0.82);
      }
      fxc.globalAlpha = 1; fxc.globalCompositeOperation = 'source-over';
      // 3) Llamas recortadas con la forma
      fctx.clearRect(0, 0, w, h); fctx.globalCompositeOperation = 'source-over'; fctx.drawImage(fireC, 0, 0, w, h);
      fctx.globalCompositeOperation = 'destination-in'; fctx.drawImage(maskC, 0, 0, w, h); fctx.globalCompositeOperation = 'source-over';
      fcv.style.opacity = Math.min(1, Lf * 1.2).toFixed(2);
    }
    var smokeSprite = (function () { var c = document.createElement('canvas'); c.width = c.height = 128; var g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(225,205,190,.55)'); gr.addColorStop(0.35, 'rgba(190,160,140,.28)'); gr.addColorStop(0.7, 'rgba(150,120,105,.09)'); gr.addColorStop(1, 'rgba(120,95,85,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c; })();
    function newSmoke(anywhere) {
      var life = 6 + Math.random() * 4;
      return { x: cx + (Math.random() * 2 - 1) * W * 0.34, y: anywhere ? H * (0.2 + Math.random() * 0.8) : H * (1.0 + Math.random() * 0.08), r: 38 + Math.random() * 40, g: 22 + Math.random() * 26, vy: 16 + Math.random() * 16, age: anywhere ? Math.random() * life : 0, life: life, a: 0.5 + Math.random() * 0.5, p: Math.random() * 6.28 };
    }
    function newFront(anywhere) {
      var life = 4.5 + Math.random() * 3;
      return { x: cx + (Math.random() * 2 - 1) * W * 0.2, y: H * (0.5 + Math.random() * 0.2), r: 26 + Math.random() * 26, g: 20 + Math.random() * 24, vy: 14 + Math.random() * 14, age: anywhere ? Math.random() * life : 0, life: life, a: 0.4 + Math.random() * 0.6, p: Math.random() * 6.28 };
    }
    var px = 0, tx = 0, hover = false, e = 0, t0 = performance.now(), vis = true, running = false, raf = 0;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Por defecto: hamburguesa a la derecha. Las portadas anchas pueden pedir otra posición y tamaño (data-cx, data-kh, data-dy)
      var dcx = parseFloat(el.getAttribute('data-cx')), dkh = parseFloat(el.getAttribute('data-kh')), ddy = parseFloat(el.getAttribute('data-dy'));
      k = (H * (dkh || 0.86)) / EXPL_H;
      cx = W * (dcx || 0.675);
      top0 = (H - EXPL_H * k) / 2 + H * (isNaN(ddy) ? 0.03 : ddy);
      imgs.forEach(function (im, n) { im.style.width = (L[n].w * k) + 'px'; });
      cf.width = Math.round(W * dpr); cf.height = Math.round(H * dpr); cfx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fsmoke = [];
      for (var q2 = 0; q2 < 9; q2++) fsmoke.push(newFront(true));
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
        if (n === 0) { var cr = CRUMB * (1 - clamp(e * 1.4, 0, 1)); imgs[0].style.clipPath = cr > 0.2 ? 'inset(0 0 ' + cr.toFixed(1) + '% 0)' : 'none'; }
      }
      glow.style.opacity = (0.3 + 0.5 * clamp(e, 0, 1.1)).toFixed(2);
      // «fuego» se enciende por momentos
      var lit = !reduce && t > 2.8 && ((t - 2.8) % 7) < 3.4;
      Lf += ((lit ? 1 : 0) - Lf) * 0.07;
      if (lit !== wasLit) { wasLit = lit; fuego.classList.toggle('is-lit', lit); }
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
      cfx.clearRect(0, 0, W, H);
      for (var fm = 0; fm < fsmoke.length; fm++) {
        var q = fsmoke[fm];
        if (!reduce) { q.age += ds; q.y -= q.vy * us * ds * (1 + 0.6 * clamp(e, 0, 1)); q.x += Math.sin(q.age * 0.9 + q.p) * 12 * us * ds; if (q.age > q.life) { fsmoke[fm] = q = newFront(false); } }
        var fq = q.age / q.life, sq = (q.r + q.g * fq) * us * 2.4;
        cfx.globalAlpha = clamp(Math.pow(Math.sin(Math.PI * clamp(fq, 0, 1)), 1.4) * 0.34 * q.a * (0.5 + 0.7 * clamp(e, 0, 1)), 0, 1);
        cfx.drawImage(smokeSprite, q.x - sq / 2, q.y - sq / 2, sq, sq);
      }
      cfx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'lighter';
      for (var n = 0; n < embers.length; n++) {
        var m = embers[n];
        if (!reduce) { m.y -= m.v; m.x += Math.sin(now / 900 + m.p) * 0.25; if (m.y < -6) { m.y = H + 6; m.x = Math.random() * W; } }
        var a = m.a * clamp(m.y / (H * 0.5), 0, 1) * (0.6 + 0.4 * Math.sin(now / 300 + m.p));
        ctx.fillStyle = 'rgba(255,' + (110 + Math.round(m.a * 70)) + ',30,' + a.toFixed(2) + ')';
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.2832); ctx.fill();
      }
      // Brasitas que se desprenden de las llamas de «fuego» mientras está encendida (las empuja el mismo viento)
      if (!reduce && FD.ok && Lf > 0.4) {
        wacc += ds * 15 * Lf;
        while (wacc >= 1) { wacc -= 1;
          wsparks.push({ x: FD.ox + FD.tw * (0.05 + Math.random() * 0.9), y: FD.oy + FD.th * (0.05 + Math.random() * 0.3), vx: (16 + Math.random() * 30) * us, vy: -(38 + Math.random() * 90) * us, age: 0, life: 0.9 + Math.random() * 1.1, r: 0.9 + Math.random() * 1.6, p: Math.random() * 6.28 }); }
      }
      for (var ws = wsparks.length - 1; ws >= 0; ws--) {
        var w1 = wsparks[ws]; w1.age += ds; w1.vx += Math.sin(now / 200 + w1.p) * 10 * us * ds; w1.x += w1.vx * ds; w1.y += w1.vy * ds; w1.vy *= (1 - 0.25 * ds);
        if (w1.age > w1.life) { wsparks.splice(ws, 1); continue; }
        var lf1 = 1 - w1.age / w1.life;
        ctx.fillStyle = 'rgba(255,' + (150 + Math.round(90 * lf1)) + ',40,' + (lf1 * (0.7 + 0.3 * Math.sin(now / 90 + w1.p))).toFixed(2) + ')';
        ctx.beginPath(); ctx.arc(w1.x, w1.y, w1.r * us * (0.6 + 0.4 * lf1), 0, 6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    function frame(now) { raf = 0; if (!running) return; var tt = place(now); drawEmbers(now); drawFire(tt); raf = requestAnimationFrame(frame); }
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
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layoutFire(); }); else layoutFire();
    layoutFire();
    if (global.ResizeObserver) new ResizeObserver(function () { layout(); layoutFire(); }).observe(el); else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    if (reduce) { place(t0 + 5000); drawEmbers(t0); }
    sync();
  }

  global.BrasaBurger = { init: init };
})(window);
