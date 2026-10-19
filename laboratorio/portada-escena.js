/*
 * DEMO — Portada con dispositivos separados (nivel 2).
 * Cada dispositivo (laptop, tablet, celular) es su propia imagen con fondo transparente y se mueve por su cuenta:
 *   - Entrada escalonada (CSS): la laptop sube y su pantalla se enciende; la tablet entra por la derecha; el celular, por abajo.
 *   - Flotación a ritmos distintos + profundidad (JS): en PC reaccionan al cursor; en celular, al desplazamiento de la página.
 *   - Barrido de luz sobre cada dispositivo de vez en cuando (CSS).
 * Cuidado de rendimiento: solo se anima mientras la portada se ve; pausa con la pestaña oculta;
 * con «reducir movimiento» queda todo quieto y visible.
 */
(function () {
  'use strict';
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var scenes = Array.prototype.slice.call(document.querySelectorAll('.scene'));
  if (!scenes.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  // Parámetros por dispositivo: amplitud y velocidad de flotación, profundidad (parallax) e inclinación
  var CFG = {
    laptop: { amp: 6, speed: 2300, phase: 0, depth: 10, tilt: 2.2 },
    tablet: { amp: 8, speed: 1900, phase: 1.6, depth: 20, tilt: 3.2 },
    phone:  { amp: 10, speed: 1600, phase: 3.1, depth: 32, tilt: 4.2 }
  };
  var items = [];
  scenes.forEach(function (sc) {
    Array.prototype.forEach.call(sc.querySelectorAll('.dev'), function (el) {
      var key = el.getAttribute('data-dev');
      items.push({ el: el, cfg: CFG[key] || CFG.laptop, scene: sc, mobile: sc.classList.contains('scene--m') });
    });
  });

  var pointer = { x: 0, y: 0, tx: 0, ty: 0 }, t0 = performance.now();
  var running = false, raf = 0, vis = true;

  function visibleScene(sc) { return sc.offsetParent !== null; }

  function frame(now) {
    raf = 0;
    if (!running) return;
    pointer.x += (pointer.tx - pointer.x) * 0.07; pointer.y += (pointer.ty - pointer.y) * 0.07;
    var vh = window.innerHeight;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!visibleScene(it.scene)) continue;
      var c = it.cfg, fy = Math.sin((now - t0) / c.speed + c.phase) * c.amp, px = 0, py = 0, rx = 0, ry = 0;
      if (it.mobile) {
        var r = it.scene.getBoundingClientRect();
        py = clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1) * c.depth * 0.5;
      } else {
        px = pointer.x * c.depth; py = pointer.y * c.depth * 0.6; ry = pointer.x * c.tilt; rx = -pointer.y * c.tilt;
      }
      it.el.style.transform = 'perspective(1200px) translate3d(' + px.toFixed(2) + 'px,' + (fy + py).toFixed(2) + 'px,0) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    }
    raf = requestAnimationFrame(frame);
  }
  function sync() {
    var go = vis && !document.hidden && !reduce;
    if (go && !running) { running = true; if (!raf) raf = requestAnimationFrame(frame); }
    else if (!go) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  }

  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    pointer.tx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1);
    pointer.ty = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1);
  }, { passive: true });
  hero.addEventListener('pointerleave', function () { pointer.tx = 0; pointer.ty = 0; });

  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(hero);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
