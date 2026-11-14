/*
 * Headers 2, 3 y 4 del inicio: «Catálogo Online» (#hc-a), «Catálogo a tu medida» (#hc-b) y «Chatbots» (#hc-c), cada uno en su propia pantalla.
 * (Antes eran una sola pantalla de dos partes que se corrían con franjas; el 2026-11-13 se separaron y se quitaron las franjas.)
 * - Los aparatos son las imágenes del Header 1 con la pantalla vacía; el contenido se coloca detrás con la perspectiva exacta (homografía).
 * - En el catálogo a tu medida, una animación corta de carrito (3 productos) y el color de la marca cambia: primero azul, luego verde, rosado y rojo.
 * - En el header de chatbots, una conversación de ejemplo se escribe sola en el celular (cliente pregunta, el bot responde y deja armado un pedido).
 * - header2.js los muestra/oculta con HeaderCatalogos.onShow('a'|'b'|'c') / onHide('a'|'b'|'c'); aquí todo se prepara solo la primera vez que se muestra uno.
 */
(function () {
  'use strict';
  var wrapA = document.getElementById('hc-a'), wrapC = document.getElementById('hc-c'), wrap = document.getElementById('hc-b');  // «wrap» = el de a tu medida (aquí viven el catálogo de ejemplo, el carrito y los colores)
  if (!wrapA || !wrap) return;
  var pb = document.getElementById('hc-pb');
  var reduceM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- textos del catálogo de ejemplo y de los rótulos de accesibilidad, según el idioma del sitio ---- */
  var T = {
    es: { brand: 'Tu Marca', chips: ['Todo', 'Novedades', 'Ofertas'], add: 'Agregar', added: 'Agregado', cur: 'S/ ',
      items: [['Polo básico blanco', '59'], ['Jean recto azul', '129'], ['Polo oversize negro', '69'], ['Jean skinny celeste', '119']],
      aria: { colors: 'Elige un color', c: ['Azul', 'Verde', 'Rosado', 'Rojo'] } },
    en: { brand: 'Your Brand', chips: ['All', 'New', 'Sale'], add: 'Add', added: 'Added', cur: 'S/ ',
      items: [['Basic white tee', '59'], ['Straight blue jeans', '129'], ['Oversized black tee', '69'], ['Light blue skinny jeans', '119']],
      aria: { colors: 'Choose a color', c: ['Blue', 'Green', 'Pink', 'Red'] } }
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
    wrap.querySelector('.dots').setAttribute('aria-label', t.aria.colors);
    dots.forEach(function (d, i) { d.setAttribute('aria-label', t.aria.c[i]); });
  }

  /* ---- aparatos: cada pantalla se coloca con la perspectiva exacta del hueco de la imagen (esquinas TL,TR,BR,BL en píxeles de la imagen) ---- */
  var DEV = {
    laptop: { w: 1536, h: 1024, sw: 1280, sh: 800, q: [512, 40, 1402, 96, 1342, 727, 428, 610] },
    phone: { w: 1024, h: 1536, sw: 500, sh: 1190, q: [314, 169, 813, 137, 716, 1401, 207, 1332] },
    tablet: { w: 1024, h: 1536, sw: 660, sh: 1100, q: [186, 243, 858, 190, 784, 1374, 116, 1274] },
    phone2: { w: 1024, h: 1536, sw: 500, sh: 1190, q: [304, 159, 823, 127, 726, 1419, 197, 1350] }
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
    [].forEach.call(document.querySelectorAll('.hero-cat .dev3'), function (el) {
      var d = DEV[el.getAttribute('data-dev')], inn = el.querySelector('.dev3__in'), scr = el.querySelector('.dev3__scr'), img = el.querySelector('.dev3__img');
      inn.style.width = d.w + 'px'; inn.style.height = d.h + 'px'; img.style.width = d.w + 'px'; img.style.height = d.h + 'px';
      scr.style.width = d.sw + 'px'; scr.style.height = d.sh + 'px'; scr.style.transform = homography(d.sw, d.sh, d.q);
      var fit = function () { inn.style.transform = 'scale(' + (el.clientWidth / d.w) + ')'; };
      fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(el);
    });
  }

  /* las píldoras: la última palabra empieza justo sobre la esquina superior izquierda de la laptop */
  function alignPills() {
    [].forEach.call(document.querySelectorAll('.hero-cat .fl--tag, .hero-cat .fl--pill'), function (p) {
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
  var dots = [].slice.call(pb.querySelectorAll('.dot')), cur = 0, auto = true, visits = 0;
  function setColor(i) {
    cur = i; var d = dots[i];
    dots.forEach(function (x) { x.classList.toggle('on', x === d); });
    pb.style.setProperty('--brand', d.dataset.b); pb.style.setProperty('--soft', d.dataset.s); pb.style.setProperty('--bg', d.dataset.bg);
  }
  dots.forEach(function (d, i) { d.addEventListener('click', function () { auto = false; setColor(i); }); });

  /* ---- Header de chatbots: conversación de ejemplo dentro del celular ---- */
  var CT = {
    es: { name: 'Tu Negocio', online: 'En línea', ph: 'Escribe un mensaje…', q: 'Hola, ¿tienen tortas para mañana?', a1: '¡Hola! Sí, tenemos. ¿De qué sabor la quieres?',
      opts: ['Chocolate', 'Vainilla', 'Fresa'], a2: 'Anotado. Torta de chocolate para mañana.', card: ['Pedido listo', 'Torta de chocolate · Mañana'] },
    en: { name: 'Your Business', online: 'Online', ph: 'Type a message…', q: 'Hi, do you have cakes for tomorrow?', a1: 'Hi! Yes, we do. What flavor would you like?',
      opts: ['Chocolate', 'Vanilla', 'Strawberry'], a2: 'Noted. Chocolate cake for tomorrow.', card: ['Order ready', 'Chocolate cake · Tomorrow'] }
  };
  function CL() { return document.documentElement.getAttribute('lang') === 'en' ? CT.en : CT.es; }
  var ROBOT = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="3.8" r="2.2" fill="#1E8CFF"/><path d="M16 6v3" stroke="#1E8CFF" stroke-width="2" stroke-linecap="round"/><rect x="3.5" y="9" width="25" height="18" rx="8.5" fill="#0A1B3C"/><path d="M9.5 17.5q2.5-3.6 5 0M17.5 17.5q2.5-3.6 5 0" stroke="#5CC8FF" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M13 21.6q3 2.2 6 0" stroke="#5CC8FF" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  var SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>';
  var OKSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var cbEl = null, cbMsgs = null, cbTimers = [];
  function renderChat() {
    cbEl = wrapC ? wrapC.querySelector('.cb') : null; if (!cbEl) return;
    var t = CL();
    cbEl.innerHTML = '<div class="cb__bar"><i class="cb__av">' + ROBOT + '</i><div><b>' + t.name + '</b><small>' + t.online + '</small></div></div><div class="cb__msgs"></div><div class="cb__in"><span>' + t.ph + '</span><i class="cb__send">' + SEND + '</i></div>';
    cbMsgs = cbEl.querySelector('.cb__msgs');
  }
  function cbLater(fn, ms) { cbTimers.push(setTimeout(fn, ms)); }
  function cbAdd(html, cls) {
    var d = document.createElement('div'); d.className = 'cb__m ' + cls; d.innerHTML = html; cbMsgs.appendChild(d); void d.offsetWidth; d.classList.add('in'); return d;
  }
  function cbFinal() {  // «reducir movimiento»: se ve la conversación terminada, sin animación
    var t = CL(); cbMsgs.innerHTML = '';
    cbAdd(t.q, 'cb__m--me'); cbAdd(t.a1, 'cb__m--bot'); cbAdd(t.opts[0], 'cb__m--me'); cbAdd(t.a2, 'cb__m--bot');
    cbAdd('<i class="cb__ok">' + OKSVG + '</i><div><b>' + t.card[0] + '</b><span>' + t.card[1] + '</span></div>', 'cb__m--card');
  }
  function chatStop() { cbTimers.forEach(clearTimeout); cbTimers = []; if (cbMsgs) cbMsgs.innerHTML = ''; }
  function chatPlay() {
    chatStop(); if (!cbMsgs) return;
    if (reduceM) { cbFinal(); return; }
    var t = CL(), typing = null, chip = null;
    function typ() { typing = cbAdd('<i></i><i></i><i></i>', 'cb__m--bot cb__m--typing'); }
    function untyp() { if (typing) { typing.remove(); typing = null; } }
    cbLater(function () { cbAdd(t.q, 'cb__m--me'); }, 300);
    cbLater(typ, 800);
    cbLater(function () {
      untyp();
      var m = cbAdd(t.a1 + '<span class="cb__opts">' + t.opts.map(function (o) { return '<b class="cb__chip">' + o + '</b>'; }).join('') + '</span>', 'cb__m--bot');
      chip = m.querySelector('.cb__chip');
    }, 1500);
    cbLater(function () { if (chip) chip.classList.add('on'); }, 2400);
    cbLater(function () { cbAdd(t.opts[0], 'cb__m--me'); }, 2700);
    cbLater(typ, 3100);
    cbLater(function () {
      untyp(); cbAdd(t.a2, 'cb__m--bot');
      cbAdd('<i class="cb__ok">' + OKSVG + '</i><div><b>' + t.card[0] + '</b><span>' + t.card[1] + '</span></div>', 'cb__m--card');
    }, 3800);
    cbLater(chatPlay, 8200);  // si la persona sigue aquí (cursor encima), vuelve a empezar
  }

  var inited = false, showB = false, showC = false, startTimer = 0, chatTimer = 0;
  function init() {
    if (inited) return; inited = true;
    renderMocks(); renderChat(); setupDevices();
    [].forEach.call(document.querySelectorAll('.hero-cat .vis'), function (v) { if (window.ResizeObserver) new ResizeObserver(alignPills).observe(v); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignPills);
    // si la persona cambia de idioma, se vuelven a dibujar los textos del catálogo de ejemplo y se realinean las píldoras
    new MutationObserver(function () { var running = cartTimers.length > 0, chatting = showC; renderMocks(); renderChat(); setupDevices(); alignPills(); if (running) cartStart(); if (chatting) chatPlay(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    // al cambiar de idioma i18n.js reescribe los textos: se realinean cuando termina
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.lang-btn')) setTimeout(alignPills, 60); });
  }

  // Header 2 (Catálogo Online): solo se prepara. Header 3 (a tu medida): además arranca el carrito, y el color avanza uno cada vez que vuelve a mostrarse
  // (la primera vez es el azul, la siguiente el verde, luego el rosado y el rojo).
  function onShow(which) {
    init(); alignPills();
    if (which === 'c') { showC = true; clearTimeout(chatTimer); chatTimer = setTimeout(function () { if (showC) chatPlay(); }, 750); return; }  // cuando termina el fundido de entrada
    if (which !== 'b') return;
    showB = true;
    if (visits++ > 0 && auto) setColor((cur + 1) % dots.length);
    clearTimeout(startTimer);
    startTimer = setTimeout(function () { if (showB) cartStart(); }, 750);  // cuando termina el fundido de entrada
  }
  function onHide(which) {
    if (which === 'c') { showC = false; clearTimeout(chatTimer); chatStop(); return; }
    if (which !== 'b') return;
    showB = false; clearTimeout(startTimer); cartStop();
  }

  window.HeaderCatalogos = { onShow: onShow, onHide: onHide };
})();
