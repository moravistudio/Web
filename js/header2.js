/*
 * Alterna los dos headers del inicio (laptop/tablet/celular ↔ mosaico de portadas interactivas) y arranca las portadas.
 * - Empieza en el Header 1. Cuando se cierra la pantalla de entrada, a los 9 s pasa al Header 2 y ahí se queda 16 s.
 * - No cambia mientras la persona toca o tiene el cursor sobre el Header 2 (ni 10 s después), ni con la pestaña oculta,
 *   ni si el header no se ve en pantalla. Con «reducir movimiento» no cambia solo: solo con los puntitos.
 * - Las portadas se inician la primera vez que se muestra el Header 2 (para no gastar nada antes).
 */
(function () {
  'use strict';
  var wrap = document.querySelector('.hero-slides');
  if (!wrap) return;
  var hero2 = wrap.querySelector('.hero2');
  var dots = Array.prototype.slice.call(wrap.querySelectorAll('.hero-dots button'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var cur = 0, timer = 0, lastTouch = -1e9, hovering = false, visible = true, started = false, covers = false;
  var STAY1 = 9000, STAY2 = 16000, QUIET = 10000;

  function initCovers() {
    if (covers) return; covers = true;
    var map = [['h2-burger', 'BrasaBurger'], ['h2-gelato', 'LunaGelato'], ['h2-cafe', 'OrigenCafe'], ['h2-pulse', 'PulseFit'], ['h2-aurea', 'Aurea'], ['h2-kicks', 'Kicks'], ['h2-flora', 'Ramo']];
    map.forEach(function (m) {
      var el = document.getElementById(m[0]), api = window[m[1]];
      if (el && api && api.init) { try { api.init(el); } catch (e) { /* una portada con problema no debe romper las demás */ } }
    });
  }
  function show(i) {
    cur = i;
    if (i === 1) { wrap.classList.add('has-2'); void hero2.offsetWidth; initCovers(); }
    wrap.classList.toggle('is-2', i === 1);
    dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    if (i === 0) setTimeout(function () { if (cur === 0) wrap.classList.remove('has-2'); }, 800);
    schedule();
  }
  function canRun() { return started && !reduce && !document.hidden && visible && !hovering && (Date.now() - lastTouch > QUIET); }
  function schedule() {
    clearTimeout(timer);
    if (!started || reduce) return;
    timer = setTimeout(function () { if (canRun()) show(cur === 0 ? 1 : 0); else schedule(); }, cur === 0 ? STAY1 : STAY2);
  }
  function touched() { lastTouch = Date.now(); }

  dots.forEach(function (d, k) { d.addEventListener('click', function () { touched(); show(k); }); });
  hero2.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hovering = true; } });
  hero2.addEventListener('pointerleave', function () { hovering = false; touched(); });
  ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) { hero2.addEventListener(ev, touched, { passive: true }); });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.2 }).observe(wrap);

  // Arranca cuando se cierra la pantalla de entrada (si no hay, de inmediato)
  function begin() { if (started) return; started = true; schedule(); }
  if (!root.classList.contains('intro-on')) begin();
  else new MutationObserver(function (m, obs) { if (!root.classList.contains('intro-on')) { obs.disconnect(); begin(); } }).observe(root, { attributes: true, attributeFilter: ['class'] });
  // Con el header 2 ya listo en segundo plano: calienta las imágenes sin mostrarlas, cuando el navegador está libre
  var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 2500); };
  window.addEventListener('load', function () { idle(function () { ['assets/portadas/brasa-burger/capa-1-pan-superior.webp', 'assets/portadas/aurea/sortija-diamante.webp'].forEach(function (u) { var im = new Image(); im.src = u; }); }); });
})();
