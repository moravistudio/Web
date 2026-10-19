/*
 * Tarjetas de «Productos listos para usar» con inclinación 3D al pasar el cursor.
 * Solo con mouse (puntero fino con hover): en celulares y tablets no hace nada, para no estorbar
 * el deslizamiento del carrusel. Con «reducir movimiento» tampoco se activa.
 * El efecto visual (perspectiva, profundidad) está en css/styles.css; aquí solo se calculan los ángulos.
 */
(function () {
  'use strict';
  var section = document.getElementById('productos-inicio');
  if (!section) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var MAX = 10; // grados
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var cards = section.querySelectorAll('.projects__card');
  if (!cards.length) return;
  section.classList.add('tilt-ready');

  Array.prototype.forEach.call(cards, function (card) {
    function move(e) {
      var r = card.getBoundingClientRect();
      var px = clamp((e.clientX - r.left) / r.width, 0, 1), py = clamp((e.clientY - r.top) / r.height, 0, 1);
      card.style.setProperty('--ty', ((px - 0.5) * 2 * MAX).toFixed(2) + 'deg');
      card.style.setProperty('--tx', ((0.5 - py) * 2 * MAX).toFixed(2) + 'deg');
      card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    }
    function end() {
      card.classList.remove('is-tilting');
      card.style.setProperty('--tx', '0deg');
      card.style.setProperty('--ty', '0deg');
    }
    card.addEventListener('pointerenter', function () { card.classList.add('is-tilting'); });
    card.addEventListener('pointermove', move, { passive: true });
    card.addEventListener('pointerleave', end);
    card.addEventListener('pointercancel', end);
  });
})();
