/*
 * Header 2 del inicio: «Catálogo Online» (izquierda) y «Catálogo a tu medida» (derecha) en una sola pantalla de dos partes.
 * - Cada parte ocupa toda la pantalla; la que no se ve queda como una franja vertical con su nombre. Se agarra y se corre (mouse, dedo o teclado).
 * - Los aparatos son las imágenes del Header 1 con la pantalla vacía; el contenido se coloca detrás con la perspectiva exacta (homografía).
 * - En el catálogo a tu medida, una animación corta de carrito (3 productos) y el color de la marca cambia al terminar cada vuelta.
 * - header2.js la muestra/oculta con HeaderCatalogos.onShow() / onHide(); aquí todo se prepara solo la primera vez que se muestra.
 */
(function () {
  'use strict';
  var wrap = document.getElementById('hc');
  if (!wrap) return;
  var pa = document.getElementById('hc-pa'), pb = document.getElementById('hc-pb'), sa = document.getElementById('hc-sa'), sb = document.getElementById('hc-sb');
  var reduceM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- textos del catálogo de ejemplo y de los rótulos de accesibilidad, según el idioma del sitio ---- */
  var T = {
    es: { brand: 'Tu Marca', chips: ['Todo', 'Novedades', 'Ofertas'], add: 'Agregar', added: 'Agregado', cur: 'S/ ',
      items: [['Polo básico blanco', '59'], ['Jean recto azul', '129'], ['Polo oversize negro', '69'], ['Jean skinny celeste', '119']],
      aria: { sa: 'Ver Catálogo Online', sb: 'Ver Catálogo a tu medida', colors: 'Elige un color', c: ['Verde', 'Azul', 'Rosado', 'Rojo'] } },
    en: { brand: 'Your Brand', chips: ['All', 'New', 'Sale'], add: 'Add', added: 'Added', cur: 'S/ ',
      items: [['Basic white tee', '59'], ['Straight blue jeans', '129'], ['Oversized black tee', '69'], ['Light blue skinny jeans', '119']],
      aria: { sa: 'See Online Catalog', sb: 'See custom catalog', colors: 'Choose a color', c: ['Green', 'Blue', 'Pink', 'Red'] } }
  };
  function L() { return document.documentElement.getAttribute('lang') === 'en' ? T.en : T.es; }

  var CART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="width:3.2cqw;height:3.2cqw"><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.7L21 8H6"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:2.5cqw;height:2.5cqw"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  var lap = null, cartEl = null, badge = null, cards = [];
  function renderMocks() {
    var t = L();
    [].forEach.call(wrap.querySelectorAll('[data-mc]'), function (el) {
      var cs = t.items.map(function (p, i) {
        return '<div class="mc__card"><div class="mc__img"><img src="assets/img/h3-prod-' + (i + 1) + '.webp" alt="" onerror="this.remove()"></div><p>' + p[0] + '</p><s>' + t.cur + p[1] + '</s><em>' + CART + '<span class="t">' + t.add + '</span></em></div>';
      }).join('');
      el.innerHTML = '<div class="mc__bar"><i class="mc__logo">' + t.brand.charAt(0) + '</i><b>' + t.brand + '</b><span class="mc__search"></span><span class="mc__wa">' + CART + '<b class="mc__badge"></b></span></div><div class="mc__chips"><u class="on">' + t.chips[0] + '</u><u>' + t.chips[1] + '</u><u>' + t.chips[2] + '</u></div><div class="mc__grid">' + cs + '</div>';
    });
    lap = wrap.querySelector('.mc--lap'); cartEl = lap.querySelector('.mc__wa'); badge = lap.querySelector('.mc__badge');
    cards = [].slice.call(lap.querySelectorAll('.mc__card')).slice(0, 3);
    sa.setAttribute('aria-label', t.aria.sa); sb.setAttribute('aria-label', t.aria.sb);
    wrap.querySelector('.dots').setAttribute('aria-label', t.aria.colors);
    dots.forEach(function (d, i) { d.setAttribute('aria-label', t.aria.c[i]); });
  }

  /* ---- aparatos: cada pantalla se coloca con la perspectiva exacta del hueco de la imagen (esquinas TL,TR,BR,BL en píxeles de la imagen) ---- */
  var DEV = {
    laptop: { w: 1536, h: 1024, sw: 1280, sh: 800, q: [512, 40, 1402, 96, 1342, 727, 428, 610] },
    phone: { w: 1024, h: 1536, sw: 500, sh: 1190, q: [314, 169, 813, 137, 716, 1401, 207, 1332] },
    tablet: { w: 1024, h: 1536, sw: 660, sh: 1100, q: [186, 243, 858, 190, 784, 1374, 116, 1274] }
  };
  function homography(sw, sh, q) {
    var src = [[0, 0], [sw, 0], [sw, sh], [0, sh]], A = [], b = [], i, r, c, k;
    for (i = 0; i < 4; i++) { var x = src[i][0], y = src[i][1], X = q[2 * i], Y = q[2 * i + 1];
      A.push([x, y, 1, 0, 0, 0, -X * x, -X * y]); b.push(X); A.push([0, 0, 0, x, y, 1, -Y * x, -Y * y]); b.push(Y); }
    for (c = 0; c < 8; c++) { var p = c; for (r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      var t = A[c]; A[c] = A[p]; A[p] = t; t = b[c]; b[c] = b[p]; b[p] = t;
      for (r = c + 1; r < 8; r++) { var m = A[r][c] / A[c][c]; for (k = c; k < 8; k++) A[r][k] -= m * A[c][k]; b[r] -= m * b[c]; } }
    var h = new Array(8); for (r = 7; r >= 0; r--) { var sum = b[r]; for (k = r + 1; k < 8; k++) sum -= A[r][k] * h[k]; h[r] = sum / A[r][r]; }
    return 'matrix3d(' + [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1].join(',') + ')';
  }
  function setupDevices() {
    [].forEach.call(wrap.querySelectorAll('.dev3'), function (el) {
      var d = DEV[el.getAttribute('data-dev')], inn = el.querySelector('.dev3__in'), scr = el.querySelector('.dev3__scr'), img = el.querySelector('.dev3__img');
      inn.style.width = d.w + 'px'; inn.style.height = d.h + 'px'; img.style.width = d.w + 'px'; img.style.height = d.h + 'px';
      scr.style.width = d.sw + 'px'; scr.style.height = d.sh + 'px'; scr.style.transform = homography(d.sw, d.sh, d.q);
      var fit = function () { inn.style.transform = 'scale(' + (el.clientWidth / d.w) + ')'; };
      fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(el);
    });
  }

  /* las píldoras: la última palabra empieza justo sobre la esquina superior izquierda de la laptop */
  function alignPills() {
    [].forEach.call(wrap.querySelectorAll('.fl--tag,.fl--pill'), function (p) {
      var lp = p.parentNode.querySelector('.dev3--laptop'), tn = p.firstChild; if (!lp || !tn || !lp.offsetWidth) return;
      var txt = tn.textContent, k = txt.lastIndexOf(' ') + 1, r = document.createRange(); r.setStart(tn, k); r.setEnd(tn, txt.length);
      var pr = p.getBoundingClientRect(), wl = (r.getBoundingClientRect().left - pr.left) / (pr.width / p.offsetWidth || 1);
      p.style.left = Math.max(0, lp.offsetLeft + 0.326 * lp.offsetWidth - wl) + 'px';
    });
  }

  /* ---- animación del carrito en la laptop: un producto va al carrito, el contador sube y el botón dice «Agregado» ---- */
  var cartTimers = [], cartCount = 0;
  function rel(el) { var x = 0, y = 0; while (el && el !== lap) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return { x: x, y: y }; }
  function later(fn, ms) { cartTimers.push(setTimeout(fn, ms)); }
  function resetCart() {
    cartCount = 0; if (badge) badge.classList.remove('on');
    cards.forEach(function (c) { var b = c.querySelector('em'); b.classList.remove('added', 'press'); b.innerHTML = CART + '<span class="t">' + L().add + '</span>'; });
  }
  function bump() { cartCount++; badge.textContent = cartCount; badge.classList.add('on'); cartEl.classList.remove('bump'); void cartEl.offsetWidth; cartEl.classList.add('bump'); }
  function addTo(i) {
    var c = cards[i]; if (!c) return;
    var b = c.querySelector('em'), im = c.querySelector('.mc__img img');
    b.classList.add('press');
    later(function () {
      b.classList.remove('press'); b.classList.add('added'); b.innerHTML = CHECK + '<span class="t">' + L().added + '</span>';
      if (im) {
        var a = rel(im), t = rel(cartEl), fly = document.createElement('img'); fly.className = 'mc__fly'; fly.src = im.src;
        var size = lap.offsetWidth * 0.09; fly.style.left = (a.x + im.offsetWidth / 2 - size / 2) + 'px'; fly.style.top = (a.y + im.offsetHeight / 2 - size / 2) + 'px'; lap.appendChild(fly);
        var dx = t.x + cartEl.offsetWidth / 2 - (a.x + im.offsetWidth / 2), dy = t.y + cartEl.offsetHeight / 2 - (a.y + im.offsetHeight / 2);
        fly.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + dx * 0.55 + 'px,' + (dy * 0.55 - 30) + 'px) scale(.7)', opacity: 1, offset: .55 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.2)', opacity: .2 }], { duration: 650, easing: 'cubic-bezier(.5,0,.7,.4)', fill: 'forwards' });
        later(function () { fly.remove(); bump(); }, 660);
      } else bump();
    }, 200);
  }
  // Los 3 productos entran en unos 3,5 s, así caben dentro de los 6 s que dura el header en pantalla
  function cartLoop(first) {
    resetCart(); if (!first && auto) setColor((cur + 1) % dots.length);
    for (var i = 0; i < 3; i++) (function (k) { later(function () { addTo(k); }, 500 + k * 1300); })(i);
    later(function () { cartLoop(false); }, 500 + 3 * 1300 + 2300);
  }
  function cartStart() { cartStop(); if (!reduceM) cartLoop(true); }
  function cartStop() { cartTimers.forEach(clearTimeout); cartTimers = []; resetCart(); }

  /* ---- colores del catálogo a tu medida ---- */
  var dots = [].slice.call(pb.querySelectorAll('.dot')), cur = 0, auto = true, colorTimer = 0, visits = 0;
  function setColor(i) {
    cur = i; var d = dots[i];
    dots.forEach(function (x) { x.classList.toggle('on', x === d); });
    pb.style.setProperty('--brand', d.dataset.b); pb.style.setProperty('--soft', d.dataset.s); pb.style.setProperty('--bg', d.dataset.bg);
  }
  dots.forEach(function (d, i) { d.addEventListener('click', function () { auto = false; clearInterval(colorTimer); setColor(i); }); });

  /* ---- la ventana que se corre: x = borde donde empieza la parte B (entre S y ancho-S) ---- */
  var state = 'A', x = 0, S = 64, WP = 0, ready = false;
  function measure() {
    wrap.style.width = ''; wrap.style.height = '';
    var rc = wrap.getBoundingClientRect(), w = Math.floor(rc.width), h = Math.floor(rc.height);
    if (!w) return false;
    wrap.style.width = w + 'px'; wrap.style.height = h + 'px';
    S = sb.offsetWidth; WP = w - S; pa.style.width = pb.style.width = WP + 'px';
    return true;
  }
  function apply(nx) {
    x = Math.round(nx); var t = (WP - x) / (WP - S);
    pa.style.transform = 'translate3d(' + (x - WP) + 'px,0,0)'; pb.style.transform = 'translate3d(' + x + 'px,0,0)';
    sa.style.opacity = t; sb.style.opacity = 1 - t;
    sa.style.pointerEvents = t > .5 ? 'auto' : 'none'; sb.style.pointerEvents = t < .5 ? 'auto' : 'none';
  }
  function go(s, animate) {
    state = s;
    if (s === 'B') setTimeout(function () { if (state === 'B' && shown) cartStart(); }, 750); else cartStop();
    wrap.classList.toggle('anim', animate !== false); apply(s === 'A' ? WP : S);
  }
  function toggle() { go(state === 'A' ? 'B' : 'A'); }

  /* arrastrar: desde las franjas, o desde cualquier parte de la pantalla (útil con el dedo) */
  var drag = null, suppress = false;
  function down(e, fromStrip) {
    if (e.button > 0) return;
    if (!fromStrip && e.target.closest('a,button')) return;
    drag = { sx: e.clientX, sy: e.clientY, x0: x, moved: false, strip: fromStrip, id: e.pointerId, el: e.currentTarget };
  }
  function move(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.sx;
    if (!drag.moved) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - drag.sy)) return;
      drag.moved = true; wrap.classList.remove('anim');
      try { drag.el.setPointerCapture(e.pointerId); } catch (_) {}
    }
    apply(Math.max(S, Math.min(WP, drag.x0 + dx)));
  }
  function up(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag; drag = null;
    if (!d.moved) { if (d.strip) toggle(); return; }
    suppress = true; setTimeout(function () { suppress = false; }, 0);
    var delta = x - d.x0, from = d.x0 >= WP - 1 ? 'A' : 'B';
    go(from === 'A' ? (delta < -80 ? 'B' : 'A') : (delta > 80 ? 'A' : 'B'));
  }

  var inited = false, shown = false;
  function init() {
    if (inited) return; inited = true;
    renderMocks(); setupDevices();
    [[sa, true], [sb, true], [pa, false], [pb, false]].forEach(function (p) {
      p[0].addEventListener('pointerdown', function (e) { down(e, p[1]); });
      p[0].addEventListener('pointermove', move);
      p[0].addEventListener('pointerup', up);
      p[0].addEventListener('pointercancel', function () { drag = null; go(state); });
    });
    wrap.addEventListener('click', function (e) { if (suppress) { e.preventDefault(); e.stopPropagation(); } }, true);
    [sa, sb].forEach(function (b) { b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }); });
    [].forEach.call(wrap.querySelectorAll('.vis'), function (v) { if (window.ResizeObserver) new ResizeObserver(alignPills).observe(v); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignPills);
    window.addEventListener('resize', function () { if (shown && measure()) go(state, false); });
    // si la persona cambia de idioma, se vuelven a dibujar los textos del catálogo de ejemplo y se realinean las píldoras
    new MutationObserver(function () { var running = cartTimers.length > 0; renderMocks(); setupDevices(); alignPills(); if (running) cartStart(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    // al cambiar de idioma i18n.js reescribe los textos: se realinean cuando termina
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.lang-btn')) setTimeout(alignPills, 60); });
  }

  // Cada vez que se muestra: empieza en «Catálogo Online», y el color del catálogo a tu medida avanza uno
  function onShow() {
    init(); shown = true;
    if (measure()) { go('A', false); alignPills(); }
    if (visits++ > 0 && auto) setColor((cur + 1) % dots.length);
    clearInterval(colorTimer);
    if (!reduceM) colorTimer = setInterval(function () { if (auto && !document.hidden && state !== 'B') setColor((cur + 1) % dots.length); }, 4000);
  }
  function onHide() { shown = false; clearInterval(colorTimer); cartStop(); }

  window.HeaderCatalogos = { onShow: onShow, onHide: onHide };
})();
