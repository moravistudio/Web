/*
 * Carrusel de las tarjetas de productos del inicio (solo teléfonos y tablets chicas, ≤ 768 px).
 * - Las tarjetas se deslizan de izquierda a derecha con el dedo (scroll-snap del navegador).
 * - Los puntitos de abajo indican cuántas hay y en cuál se está; también se pueden tocar.
 * - Avanza solo cada 4 segundos, pero se detiene si la persona toca o desliza, si la sección no se ve en pantalla,
 *   si la pestaña está oculta o si el aparato pide «reducir movimiento». En PC no hace nada.
 */
(function () {
  var section = document.getElementById('productos-inicio');
  if (!section) return;
  var track = section.querySelector('.home-products__grid');
  var dotsBox = section.querySelector('.home-products__dots');
  if (!track || !dotsBox) return;

  var cards = Array.prototype.slice.call(track.querySelectorAll('.projects__card'));
  var mq = window.matchMedia('(max-width: 768px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var INTERVAL = 4000;      // avance automático
  var RESUME_AFTER = 8000;  // tras tocar, espera antes de volver a avanzar solo
  var timer = null, resumeTimer = null, visible = false, userPaused = false, current = 0, programmaticUntil = 0;

  // Puntitos
  var dots = cards.map(function (_, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'home-products__dot';
    b.setAttribute('aria-label', (i + 1) + ' / ' + cards.length);
    b.addEventListener('click', function () { userPause(); goTo(i); });
    dotsBox.appendChild(b);
    return b;
  });

  function setActive(i) {
    current = i;
    dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  }

  function goTo(i) {
    var card = cards[i];
    if (!card) return;
    // Se mueve solo la tira (no la página): se calcula la posición para dejar la tarjeta centrada.
    var left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    setActive(i);                              // el puntito cambia de inmediato
    programmaticUntil = Date.now() + 800;      // y mientras dura el deslizamiento no se recalcula con tarjetas intermedias
    track.scrollTo({ left: left, behavior: reduce.matches ? 'auto' : 'smooth' });
  }

  // Punto activo según la tarjeta más cercana al centro
  var rafId = null;
  function onScroll() {
    if (rafId || Date.now() < programmaticUntil) return;
    rafId = requestAnimationFrame(function () {
      rafId = null;
      var center = track.scrollLeft + track.clientWidth / 2, best = 0, bestDist = Infinity;
      cards.forEach(function (c, k) {
        var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < bestDist) { bestDist = d; best = k; }
      });
      if (best !== current) setActive(best);
    });
  }
  track.addEventListener('scroll', onScroll, { passive: true });

  // Auto avance
  function canRun() { return mq.matches && visible && !userPaused && !reduce.matches && !document.hidden; }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() {
    stop();
    if (!canRun()) return;
    timer = setInterval(function () { goTo((current + 1) % cards.length); }, INTERVAL);
  }
  function userPause() {
    userPaused = true; stop();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () { userPaused = false; start(); }, RESUME_AFTER);
  }
  ['touchstart', 'pointerdown', 'wheel', 'keydown', 'focusin'].forEach(function (ev) {
    track.addEventListener(ev, userPause, { passive: true });
  });
  document.addEventListener('visibilitychange', start);
  if (mq.addEventListener) mq.addEventListener('change', function () { if (!mq.matches) { stop(); track.scrollLeft = 0; setActive(0); } else { start(); } });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; start(); }, { threshold: 0.35 }).observe(section);
  } else { visible = true; start(); }

  setActive(0);
})();
