/*
 * Tarjetas de «Servicios» con una inclinación suave hacia el cursor (solo PC con mouse).
 * Es el mismo efecto de «Productos listos para usar», pero más sutil (las tarjetas son más grandes).
 * En celular y tablet chica no hace nada. Con «reducir movimiento» tampoco. Los estilos están en css/servicios-efecto.css.
 */
(function () {
  'use strict';
  var grid = document.querySelector('.services__grid');
  if (!grid) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var mouse = window.matchMedia('(hover: hover) and (pointer: fine)');
  var phone = window.matchMedia('(max-width: 768px)');
  if (!mouse.matches) return;
  var MAX = 6; // grados máximos de inclinación
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  grid.classList.add('tilt-ready');
  Array.prototype.forEach.call(grid.querySelectorAll('.services__card'), function (card) {
    function setTilt(e) {
      var r = card.getBoundingClientRect();
      var px = clamp((e.clientX - r.left) / r.width, 0, 1), py = clamp((e.clientY - r.top) / r.height, 0, 1);
      card.style.setProperty('--ty', ((px - 0.5) * 2 * MAX).toFixed(2) + 'deg');
      card.style.setProperty('--tx', ((0.5 - py) * 2 * MAX).toFixed(2) + 'deg');
    }
    function end() { card.classList.remove('is-tilting'); card.style.setProperty('--tx', '0deg'); card.style.setProperty('--ty', '0deg'); }
    card.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !phone.matches) card.classList.add('is-tilting'); });
    card.addEventListener('pointermove', function (e) { if (card.classList.contains('is-tilting')) setTilt(e); }, { passive: true });
    card.addEventListener('pointerleave', end);
    card.addEventListener('pointercancel', end);
  });
})();
