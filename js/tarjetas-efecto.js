/*
 * Tarjetas de «Productos listos para usar» con efecto 3D.
 *  - PC (mouse): se inclinan siguiendo el cursor, con brillo.
 *  - Celular/tablet chica (carrusel): al deslizar, cada tarjeta gira en 3D según qué tan lejos está del centro,
 *    y además se inclina hacia donde se toca con el dedo.
 * Con «reducir movimiento» no se activa nada. El efecto visual está en css/styles.css; aquí solo se calculan ángulos.
 */
(function () {
  'use strict';
  var section = document.getElementById('productos-inicio');
  if (!section) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cards = section.querySelectorAll('.projects__card');
  var track = section.querySelector('.home-products__grid');
  if (!cards.length || !track) return;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var phone = window.matchMedia('(max-width: 768px)');
  var mouse = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ----- Inclinación hacia el cursor / el dedo ----- */
  function setTilt(card, e, max) {
    var r = card.getBoundingClientRect();
    var px = clamp((e.clientX - r.left) / r.width, 0, 1), py = clamp((e.clientY - r.top) / r.height, 0, 1);
    card.style.setProperty('--ty', ((px - 0.5) * 2 * max).toFixed(2) + 'deg');
    card.style.setProperty('--tx', ((0.5 - py) * 2 * max).toFixed(2) + 'deg');
    card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
    card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
  }
  function endTilt(card) {
    card.classList.remove('is-tilting');
    card.style.setProperty('--tx', '0deg');
    card.style.setProperty('--ty', '0deg');
  }
  Array.prototype.forEach.call(cards, function (card) {
    card.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse' && mouse.matches && !phone.matches) card.classList.add('is-tilting');
    });
    card.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' && phone.matches) { card.classList.add('is-tilting'); setTilt(card, e, 9); }
    });
    card.addEventListener('pointermove', function (e) {
      if (!card.classList.contains('is-tilting')) return;
      setTilt(card, e, e.pointerType === 'mouse' ? 10 : 9);
    }, { passive: true });
    ['pointerleave', 'pointercancel', 'pointerup'].forEach(function (ev) {
      card.addEventListener(ev, function (e) { if (ev !== 'pointerup' || e.pointerType !== 'mouse') endTilt(card); });
    });
  });
  if (mouse.matches) section.classList.add('tilt-ready');

  /* ----- Celular: giro 3D de cada tarjeta según su posición en el carrusel ----- */
  var raf = 0;
  function coverflow() {
    raf = 0;
    var on = phone.matches;
    section.classList.toggle('cf-ready', on);
    var center = track.scrollLeft + track.clientWidth / 2;
    Array.prototype.forEach.call(cards, function (card) {
      if (!on) { card.style.removeProperty('--cf'); card.style.removeProperty('--cs'); return; }
      var d = clamp((card.offsetLeft + card.offsetWidth / 2 - center) / card.offsetWidth, -1, 1);
      card.style.setProperty('--cf', (-d * 32).toFixed(2) + 'deg');
      card.style.setProperty('--cs', (1 - Math.abs(d) * 0.08).toFixed(3));
    });
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(coverflow); }
  track.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  if (phone.addEventListener) phone.addEventListener('change', schedule);
  coverflow();
})();
