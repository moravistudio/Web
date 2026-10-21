/*
 * Alterna los tres headers del inicio:
 *   1) laptop/tablet/celular   2) Catálogo Online y Catálogo a tu medida   3) mosaico de portadas interactivas
 * y arranca las portadas.
 * - Empieza en el Header 1. Cuando se cierra la pantalla de entrada, cada header se queda 6 s y pasa al siguiente (1 → 2 → 3 → 1).
 * - Header 2 (catálogos): no cambia mientras la persona tiene el cursor sobre él, salvo que el cursor lleve más de 5 s sin moverse;
 *   con el dedo, no cambia hasta 5 s después del último toque.
 * - Header 3 (portadas): no cambia mientras la persona toca o tiene el cursor sobre él (ni 6 s después).
 * - Ninguno cambia con la pestaña oculta ni si el header no se ve en pantalla. Con «reducir movimiento» no cambia solo: solo con las flechas de los costados.
 * - Las portadas se inician la primera vez que se muestra el Header 3 (para no gastar nada antes).
 */
(function () {
  'use strict';
  var wrap = document.querySelector('.hero-slides');
  if (!wrap) return;
  var heroCat = wrap.querySelector('.hero-cat');
  var hero2 = wrap.querySelector('.hero2');
  var arrows = Array.prototype.slice.call(wrap.querySelectorAll('.hero-arrow'));
  wrap.classList.add('js-on');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  // 0 = Header 1 · 1 = catálogos · 2 = portadas (si no existe la sección de catálogos, solo se alternan 0 y 2)
  var slides = heroCat ? [0, 1, 2] : [0, 2];
  var cur = 0, timer = 0, lastTouch = -1e9, lastMove = -1e9, hovering = false, visible = true, started = false, covers = false;
  var STAY = 6000, QUIET = 6000, QUIET_CAT = 5000, RETRY = 300;

  function initCovers() {
    if (covers) return; covers = true;
    var map = [['h2-burger', 'BrasaBurger'], ['h2-gelato', 'LunaGelato'], ['h2-cafe', 'OrigenCafe'], ['h2-pulse', 'PulseFit'], ['h2-aurea', 'Aurea'], ['h2-kicks', 'Kicks'], ['h2-flora', 'Ramo']];
    map.forEach(function (m) {
      var el = document.getElementById(m[0]), api = window[m[1]];
      if (el && api && api.init) { try { api.init(el); } catch (e) { /* una portada con problema no debe romper las demás */ } }
    });
  }
  function show(i) {
    var prev = cur;
    cur = i;
    if (i === 1) { wrap.classList.add('has-cat'); void heroCat.offsetWidth; if (window.HeaderCatalogos) window.HeaderCatalogos.onShow(); }
    if (i === 2) { wrap.classList.add('has-2'); void hero2.offsetWidth; initCovers(); }
    wrap.classList.toggle('is-cat', i === 1);
    wrap.classList.toggle('is-2', i === 2);
    if (prev === 1 && i !== 1) { if (window.HeaderCatalogos) window.HeaderCatalogos.onHide(); setTimeout(function () { if (cur !== 1) wrap.classList.remove('has-cat'); }, 800); }
    if (prev === 2 && i !== 2) setTimeout(function () { if (cur !== 2) wrap.classList.remove('has-2'); }, 800);
    schedule();
  }
  function next() { return slides[(slides.indexOf(cur) + 1) % slides.length]; }
  function prevOf() { return slides[(slides.indexOf(cur) + slides.length - 1) % slides.length]; }
  function blocked() {
    var now = Date.now();
    if (cur === 1) return (hovering && now - lastMove < QUIET_CAT) || (now - lastTouch < QUIET_CAT);
    if (cur === 2) return hovering || (now - lastTouch < QUIET);
    return false;
  }
  function canRun() { return started && !reduce && !document.hidden && visible && !blocked(); }
  // Si en ese momento no toca cambiar (cursor encima, pestaña oculta...), vuelve a mirar enseguida: no espera otros 6 s completos
  function tick() { if (canRun()) show(next()); else schedule(RETRY); }
  function schedule(wait) {
    clearTimeout(timer);
    if (!started || reduce) return;
    timer = setTimeout(tick, wait === undefined ? STAY : wait);
  }
  function touched() { lastTouch = Date.now(); }

  // La flecha de la derecha lleva al siguiente header; la de la izquierda, al anterior
  arrows.forEach(function (a) { a.addEventListener('click', function () { show(a.classList.contains('hero-arrow--prev') ? prevOf() : next()); }); });
  [heroCat, hero2].forEach(function (el) {
    if (!el) return;
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hovering = true; lastMove = Date.now(); } });
    el.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') lastMove = Date.now(); }, { passive: true });
    el.addEventListener('pointerleave', function () { hovering = false; touched(); });
    ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) { el.addEventListener(ev, touched, { passive: true }); });
  });
  document.addEventListener('visibilitychange', function () { schedule(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.2 }).observe(wrap);

  // Arranca cuando se cierra la pantalla de entrada (si no hay, de inmediato)
  function begin() { if (started) return; started = true; schedule(); }
  if (!root.classList.contains('intro-on')) begin();
  else new MutationObserver(function (m, obs) { if (!root.classList.contains('intro-on')) { obs.disconnect(); begin(); } }).observe(root, { attributes: true, attributeFilter: ['class'] });
  // Con los headers 2 y 3 ya listos en segundo plano: calienta las imágenes sin mostrarlas, cuando el navegador está libre
  var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 2500); };
  window.addEventListener('load', function () { idle(function () { ['assets/img/dev-laptop-vacio.webp', 'assets/img/h3-catalogo-escritorio.webp', 'assets/portadas/brasa-burger/capa-1-pan-superior.webp', 'assets/portadas/aurea/sortija-diamante.webp'].forEach(function (u) { var im = new Image(); im.src = u; }); }); });
})();
