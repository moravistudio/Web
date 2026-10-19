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
    { f: 'capa-2-bola-fresa.webp', x: 333, y: 219, w: 361, h: 309, cls: 's1', alts: [{ f: 'capab-2-bola-chocolate.webp', x: 330, y: 225, w: 368, h: 303 }, { f: 'capac-2-bola-arandano.webp', x: 328, y: 222, w: 373, h: 305 }] },
    { f: 'capa-3-bola-pistacho.webp', x: 326, y: 490, w: 366, h: 318, cls: 's2', alts: [{ f: 'capab-3-bola-mango.webp', x: 321, y: 493, w: 381, h: 320 }, { f: 'capac-3-bola-limon.webp', x: 321, y: 492, w: 382, h: 316 }] },
    { f: 'capa-4-bola-vainilla.webp', x: 328, y: 765, w: 374, h: 305, cls: 's3', alts: [{ f: 'capab-4-bola-dulce.webp', x: 323, y: 773, w: 379, h: 304 }, { f: 'capac-4-bola-oreo.webp', x: 323, y: 772, w: 382, h: 306 }] },
    { f: 'capa-5-cono.webp', x: 373, y: 1031, w: 273, h: 460, cls: '' }
  ];
  // Posición «armada»: cada bola descansa sobre la de abajo, tapando un poco con sus goteos
  var OVER = [0, 20, 125, 125, 142]; // solape con la pieza de arriba
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
  var NAMES = [null, ['Fresa', 'Chocolate', 'Arándano'], ['Pistacho', 'Mango', 'Limón'], ['Vainilla', 'Dulce de leche', 'Oreo']]; // por bola (1 = arriba)
  var FLAVORS = [['#ffb3c8', '#c9df9a', '#fff0cf'], ['#6b3f2a', '#ffc83d', '#c98a55'], ['#c9a2d6', '#f1f06a', '#d8d2cc']];
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
      '<div class="cv__tag"><span class="cv__tag-t">Fresa · Pistacho · Vainilla</span></div>' +
      '<span class="cv__btn">Elegir sabor</span>';
    var stage = el.querySelector('.cv__stage'), cv = el.querySelector('.cv__drops'), ctx = cv.getContext('2d');
    var imgs = L.map(function (l) {
      var pc = document.createElement('div'); pc.className = 'cv__piece'; pc.style.zIndex = String(L.length - L.indexOf(l));
      var ia = new Image(); ia.className = 'cv__f cv__f0'; ia.alt = ''; ia.draggable = false; ia.src = IMG + l.f; pc.appendChild(ia);
      (l.alts || []).forEach(function (al, ai) { var ib = new Image(); ib.className = 'cv__f cv__f' + (ai + 1); ib.alt = ''; ib.draggable = false; ib.src = IMG + al.f; pc.appendChild(ib); });
      stage.appendChild(pc); return pc;
    });

    var W = 0, H = 0, k = 1, cx = 0, top0 = 0, dpr = 1, drops = [], dacc = 0, lastD = 0, mist = [], macc = 0;
    var mistSprite = (function () { var c = document.createElement('canvas'); c.width = c.height = 96; var g = c.getContext('2d'), gr = g.createRadialGradient(48, 48, 0, 48, 48, 48);
      gr.addColorStop(0, 'rgba(170,205,235,.55)'); gr.addColorStop(0.45, 'rgba(190,215,238,.28)'); gr.addColorStop(1, 'rgba(200,222,242,0)'); g.fillStyle = gr; g.fillRect(0, 0, 96, 96); return c; })();
    var px = 0, tx = 0, hover = false, e = 0, flav = [0, 0, 0, 0, 0], lastUser = -1e9, lastHit = -1, t0 = performance.now() - (parseFloat((/[?&]t=([0-9.]+)/.exec(location.search) || [])[1]) || 0) * 1000;
    var vis = true, running = false, raf = 0, lastCycle = -1;

    function layout() {
      var r = el.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      k = Math.min((H * 0.72) / EXPL_H, (W * 0.6) / 374);
      cx = W * 0.5;
      top0 = H * 0.105;
      imgs.forEach(function (pc, n) {
        var a = pc.querySelector('.cv__f0');
        a.style.width = (L[n].w * k) + 'px';
        (L[n].alts || []).forEach(function (al, ai) { var im = pc.querySelector('.cv__f' + (ai + 1)); im.style.width = (al.w * k) + 'px'; im.style.left = ((al.x - L[n].x) * k) + 'px'; im.style.top = ((al.y - L[n].y) * k) + 'px'; });
      });
    }

    var tagEl = el.querySelector('.cv__tag-t'), tagTimer = 0;
    function updateTag() {
      var txt = [1, 2, 3].map(function (n) { return NAMES[n][flav[n]]; }).join(' · ');
      if (tagEl.textContent === txt) return;
      tagEl.classList.add('swap'); clearTimeout(tagTimer);
      tagTimer = setTimeout(function () { tagEl.textContent = txt; tagEl.classList.remove('swap'); }, 220);
    }
    function setFlav(n, v) { v = ((v % 3) + 3) % 3; if (flav[n] !== v) { flav[n] = v; imgs[n].setAttribute('data-f', String(v)); updateTag(); } }
    function setAll(v) { for (var n = 1; n <= 3; n++) setFlav(n, v); }
    // ¿Qué bola está bajo el cursor? (de arriba hacia abajo; se achica un poco el rectángulo para no contar los bordes vacíos)
    function scoopAt(x, y) {
      for (var n = 1; n <= 3; n++) {
        var r = imgs[n].querySelector('.cv__f0').getBoundingClientRect(), mx = r.width * 0.12, my = r.height * 0.1;
        if (x >= r.left + mx && x <= r.right - mx && y >= r.top + my && y <= r.bottom - my) return n;
      }
      return -1;
    }
    function touchScoop(ev, advance) {
      var hit = scoopAt(ev.clientX, ev.clientY);
      if (advance) { if (hit > 0 && hit !== lastHit) { setFlav(hit, flav[hit] + 1); lastUser = performance.now(); } }
      lastHit = hit; el.style.cursor = hit > 0 ? 'pointer' : '';
    }

    function place(now) {
      var t = (now - t0) / 1000;
      // Ciclo automático: armado → abierto (cambia de sabor y gotea) → armado
      var auto = 0, cyc = Math.floor(Math.max(0, t - 3.4) / 8);
      if (!reduce && t >= 3.4) {
        var c = (t - 3.4) % 8;
        auto = c < 2.2 ? 0 : c < 3.4 ? ease((c - 2.2) / 1.2) : c < 5.4 ? 1 : c < 6.6 ? 1 - ease((c - 5.4) / 1.2) : 0;
        if (!hover && now - lastUser > 10000) setAll(cyc + (c >= 2.2 ? 1 : 0));
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
      // Vapor frío: sube desde el cono y entre las bolas cuando el helado se abre (muy tenue)
      if (st.open > 0.35 && st.t > 3) {
        macc += dt * 3.2 * st.open;
        while (macc >= 1) { macc -= 1;
          mist.push({ x: cx + (Math.random() - 0.5) * W * 0.32, y: top0 + (L[3].y - EXPL_TOP + L[3].h * (0.7 + Math.random() * 0.9)) * k, vy: -(12 + Math.random() * 18) * u, vx: (Math.random() - 0.5) * 6 * u, age: 0, life: 2.6 + Math.random() * 1.8, r: (22 + Math.random() * 26) * u, g: 28 * u, p: Math.random() * 6.28 }); }
      }
      for (var mi = mist.length - 1; mi >= 0; mi--) {
        var m = mist[mi]; m.age += dt; m.y += m.vy * dt; m.x += (m.vx + Math.sin(m.age * 1.1 + m.p) * 7 * u) * dt;
        if (m.age > m.life) { mist.splice(mi, 1); continue; }
        var fr = m.age / m.life, sz = (m.r + m.g * fr) * 2.2;
        ctx.globalAlpha = clamp(Math.sin(Math.PI * fr) * 0.62, 0, 1);
        ctx.drawImage(mistSprite, m.x - sz / 2, m.y - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;
      if (st.open > 0.45 && st.t > 3) {
        dacc += dt * 7 * st.open;
        while (dacc >= 1) {
          dacc -= 1;
          var s = 1 + Math.floor(Math.random() * 3);          // bola 1, 2 ó 3
          var n = s, y = top0 + (T[n] - ASM_TOP + (DELTA[n] + (ASM_TOP - EXPL_TOP)) * clamp(e, 0, 1)) * k + 0;
          var bottom = y + L[n].h * k * 0.9;
          drops.push({ x: cx + (Math.random() - 0.5) * L[n].w * k * 0.7 + px * W * 0.04 * DEPTH[n], y: bottom, vy: 10 * u, s: s - 1, c: FLAVORS[flav[n]][n - 1], r: (1.6 + Math.random() * 1.8) * u, a: 1 });
        }
      }
      for (var d = drops.length - 1; d >= 0; d--) {
        var p = drops[d]; p.vy += 520 * u * dt; p.y += p.vy * dt; p.a -= dt * 0.95;
        if (p.a <= 0 || p.y > H + 10) { drops.splice(d, 1); continue; }
        ctx.globalAlpha = clamp(p.a, 0, 1); ctx.fillStyle = p.c;
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

    el.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse') { hover = true; } });
    el.addEventListener('pointerleave', function () { hover = false; tx = 0; lastHit = -1; el.style.cursor = ''; });
    el.addEventListener('pointermove', function (ev) {
      var r = el.getBoundingClientRect(); tx = clamp((ev.clientX - r.left) / r.width * 2 - 1, -1, 1);
      if (ev.pointerType === 'mouse') touchScoop(ev, true);
    }, { passive: true });
    el.addEventListener('pointerdown', function (ev) { if (ev.pointerType !== 'mouse') { hover = true; lastHit = -1; touchScoop(ev, true); } });
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
