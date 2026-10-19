/*
 * «Proyectos destacados»: anillo 3D que gira solo y se arrastra con el mouse o el dedo.
 * Sin JavaScript queda una fila deslizable (ver css/styles.css, .projects-ring).
 * Cuidado de rendimiento: solo se anima mientras se ve en pantalla; se pausa con la pestaña oculta;
 * con «reducir movimiento» no gira solo (se puede arrastrar). Un toque sin arrastrar abre el portafolio;
 * si se arrastró, el clic se cancela para no abrir la página por accidente.
 */
(function () {
  'use strict';
  var scene = document.getElementById('proyectos-anillo');
  if (!scene) return;
  var spin = scene.querySelector('.projects-ring__spin');
  var items = spin ? spin.querySelectorAll('.projects-ring__item') : [];
  var n = items.length;
  if (n < 3) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var step = 360 / n;
  var rot = 0, vel = 0, dragging = false, captured = false, moved = false, startX = 0, lastX = 0;
  var vis = false, raf = 0, lastT = 0, resumeAt = 0;

  scene.classList.add('is-3d');

  function layout() {
    var w = items[0].offsetWidth || 240;
    // Radio para que las tarjetas queden casi pegadas: (w/2) / tan(π/n), con un pequeño aire
    var radius = Math.round((w / 2) / Math.tan(Math.PI / n) * 1.12);
    spin.style.setProperty('--radius', radius + 'px');
    spin.style.setProperty('--step', step + 'deg');
    Array.prototype.forEach.call(items, function (it, i) { it.style.setProperty('--i', i); });
  }
  function paint() { spin.style.setProperty('--rot', rot.toFixed(2) + 'deg'); }

  function tick(t) {
    raf = 0;
    if (!vis || document.hidden) return;
    var dt = Math.min(48, t - (lastT || t)); lastT = t;
    if (!dragging) {
      if (Math.abs(vel) > 0.01) { rot += vel * dt; vel *= 0.95; }
      else if (!reduce && Date.now() > resumeAt) { rot -= 0.012 * dt; }
      paint();
    }
    raf = requestAnimationFrame(tick);
  }
  function run() { if (!raf && vis && !document.hidden) { lastT = 0; raf = requestAnimationFrame(tick); } }

  scene.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true; captured = false; moved = false; startX = lastX = e.clientX; vel = 0;
  });
  scene.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX; lastX = e.clientX;
    if (!moved && Math.abs(e.clientX - startX) > 6) {
      moved = true; scene.classList.add('is-drag');
      // Se captura el puntero solo al arrastrar: así un toque simple sigue llegando al enlace
      if (scene.setPointerCapture && !captured) { try { scene.setPointerCapture(e.pointerId); captured = true; } catch (x) { /* sin captura */ } }
    }
    if (moved) { rot += dx * 0.4; vel = dx * 0.02; paint(); }
  });
  function up() {
    if (!dragging) return;
    dragging = false; scene.classList.remove('is-drag'); resumeAt = Date.now() + 2500;
  }
  scene.addEventListener('pointerup', up);
  scene.addEventListener('pointercancel', up);
  // Si hubo arrastre, el clic que el navegador genera al soltar no debe abrir el enlace
  scene.addEventListener('click', function (e) {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);

  layout(); paint();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { vis = en[0].isIntersecting; run(); }, { threshold: 0.1 }).observe(scene);
  } else { vis = true; run(); }
  document.addEventListener('visibilitychange', run);
  window.addEventListener('resize', layout);
})();
