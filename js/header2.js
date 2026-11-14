/*
 * Alterna los cuatro headers del inicio:
 *   1) laptop/tablet/celular   2) Catálogo Online   3) Catálogo a tu medida   4) Chatbots
 * (El 2 y el 3 eran una sola pantalla de dos partes; se separaron el 2026-11-13.)
 * (El Header 3, el mosaico de portadas interactivas, se sacó del inicio el 2026-11-13; está archivado en git con la etiqueta
 *  «archivo-header-3-portadas». Las portadas siguen en /portadas/ y en el submenú Servicios.)
 * - Empieza en el Header 1. Cuando se cierra la pantalla de entrada, cada header se queda 6 s y pasa al siguiente (1 → 2 → 3 → 4 → 1).
 * - Headers 2 y 3 (catálogos): no cambian mientras la persona tiene el cursor sobre él, salvo que el cursor lleve más de 5 s sin moverse;
 *   con el dedo, no cambia hasta 5 s después del último toque.
 * - Ninguno cambia con la pestaña oculta ni si el header no se ve en pantalla. Con «reducir movimiento» no cambia solo: solo con las flechas de los costados.
 */
(function () {
  'use strict';
  var wrap = document.querySelector('.hero-slides');
  if (!wrap) return;
  var heroA = wrap.querySelector('.hero-cat--a');
  var heroB = wrap.querySelector('.hero-cat--b');
  var heroC = wrap.querySelector('.hero-cat--c');
  var arrows = Array.prototype.slice.call(wrap.querySelectorAll('.hero-arrow'));
  wrap.classList.add('js-on');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  // 0 = Header 1 · 1 = Catálogo Online · 2 = Catálogo a tu medida · 3 = Chatbots (si no existe una sección, se salta)
  var slides = [0]; if (heroA) slides.push(1); if (heroB) slides.push(2); if (heroC) slides.push(3);
  var cur = 0, timer = 0, lastTouch = -1e9, lastMove = -1e9, hovering = false, visible = true, started = false;
  var STAY = 6000, QUIET_CAT = 5000, RETRY = 300;

  function show(i) {
    var prev = cur;
    cur = i;
    if (i === 1) { wrap.classList.add('has-cat'); void heroA.offsetWidth; if (window.HeaderCatalogos) window.HeaderCatalogos.onShow('a'); }
    if (i === 2) { wrap.classList.add('has-catb'); void heroB.offsetWidth; if (window.HeaderCatalogos) window.HeaderCatalogos.onShow('b'); }
    if (i === 3) { wrap.classList.add('has-catc'); void heroC.offsetWidth; if (window.HeaderCatalogos) window.HeaderCatalogos.onShow('c'); }
    wrap.classList.toggle('is-cat', i === 1);
    wrap.classList.toggle('is-catb', i === 2);
    wrap.classList.toggle('is-catc', i === 3);
    if (prev === 1 && i !== 1) { if (window.HeaderCatalogos) window.HeaderCatalogos.onHide('a'); setTimeout(function () { if (cur !== 1) wrap.classList.remove('has-cat'); }, 800); }
    if (prev === 2 && i !== 2) { if (window.HeaderCatalogos) window.HeaderCatalogos.onHide('b'); setTimeout(function () { if (cur !== 2) wrap.classList.remove('has-catb'); }, 800); }
    if (prev === 3 && i !== 3) { if (window.HeaderCatalogos) window.HeaderCatalogos.onHide('c'); setTimeout(function () { if (cur !== 3) wrap.classList.remove('has-catc'); }, 800); }
    schedule();
  }
  function next() { return slides[(slides.indexOf(cur) + 1) % slides.length]; }
  function prevOf() { return slides[(slides.indexOf(cur) + slides.length - 1) % slides.length]; }
  function blocked() {
    var now = Date.now();
    if (cur === 1 || cur === 2 || cur === 3) return (hovering && now - lastMove < QUIET_CAT) || (now - lastTouch < QUIET_CAT);
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
  [heroA, heroB, heroC].forEach(function (el) {
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
  // Con el header 2 ya listo en segundo plano: calienta las imágenes sin mostrarlas, cuando el navegador está libre
  var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 2500); };
  window.addEventListener('load', function () { idle(function () { ['assets/img/dev-laptop-vacio.webp', 'assets/img/h3-catalogo-escritorio.webp'].forEach(function (u) { var im = new Image(); im.src = u; }); }); });
})();
