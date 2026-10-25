/*
 * Portada «Chispita Clean» (lavandería) — portada HORIZONTAL ancha.
 * Una pila de ropa azul rodeada por una ola de agua que gira sin parar (video en bucle, sin sonido), con burbujas encima.
 *  - Las burbujas flotan; al pasar el cursor (o el dedo) por encima REVIENTAN y vuelven a salir en otro sitio.
 *  - El video se desplaza apenas con el cursor, para dar profundidad.
 * Se usa con: <div class="cv cv-chispita"></div>  (el contenido lo crea este archivo). Llamar ChispitaClean.init(contenedor).
 * Cuidado de rendimiento: el video se descarga y se reproduce solo cuando la portada se ve en pantalla (y se pausa al salir);
 * con «reducir movimiento» queda la imagen quieta y las burbujas sin animar.
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var DIR = BASE + 'assets/portadas/chispita/';

  // La letra manuscrita del título se carga una sola vez, aunque haya varias portadas en la página
  if (!document.getElementById('chispita-font')) {
    var f = document.createElement('link'); f.id = 'chispita-font'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap'; document.head.appendChild(f);
  }

  var WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.4A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.3 1.2-1.8 1.3-.5.1-1.1.1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .5.5l.8 1.9c.1.2.1.3 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.7 1.1 1.5 1.8 1 .9 1.8 1.2 2.1 1.3.3.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.2 1.3z"/></svg>';

  function init(el) {
    if (!el || el.__chispita) return;
    el.__chispita = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML =
      '<div class="cv__art"><video class="cv__vid" poster="' + DIR + 'agua-ropa-poster.jpg" muted loop playsinline preload="none" aria-hidden="true"></video><div class="cv__bubs"></div></div>' +
      '<div class="cv__nav"><img class="cv__logo" src="' + DIR + 'logo-chispita-clean.png" alt="Chispita Clean Lavandería" draggable="false">' +
        '<span class="cv__links"><span class="on">Inicio</span><span>Servicios</span><span>Proceso</span><span>Precios</span><span>Contacto</span></span></div>' +
      '<div class="cv__copy"><h2 class="cv__h">Tu ropa limpia,<span class="cv__sc">sin complicaciones</span></h2>' +
        '<p class="cv__p">Lavado profesional, secado y planchado, con recojo y entrega a domicilio.</p>' +
        '<span class="cv__btn">' + WA + 'Pide tu servicio ahora <i aria-hidden="true">→</i></span></div>' +
      '<div class="cv__ben"><span><img src="' + DIR + 'benef-1.webp" alt="" draggable="false">Recojo y entrega a domicilio</span>' +
        '<span><img src="' + DIR + 'benef-2.webp" alt="" draggable="false">Lavado profesional y seguro</span>' +
        '<span><img src="' + DIR + 'benef-3.webp" alt="" draggable="false">Prendas limpias y bien cuidadas</span></div>';

    var art = el.querySelector('.cv__art'), vid = el.querySelector('.cv__vid'), bubs = el.querySelector('.cv__bubs');

    // Burbujas: flotan; al pasar por encima revientan y salen otra vez en otro sitio
    function place(b) { b.style.left = (2 + Math.random() * 92) + '%'; b.style.top = (2 + Math.random() * 90) + '%'; }
    var list = [];
    for (var i = 0; i < 12; i++) {
      var s = document.createElement('span'), z = 1.2 + Math.random() * 2.6;
      s.className = 'cv__bub'; s.style.cssText = 'width:' + z + 'cqw;height:' + z + 'cqw;--d:' + (7 + Math.random() * 7) + 's;--l:' + (-Math.random() * 10) + 's';
      place(s); bubs.appendChild(s); list.push(s);
    }
    function hit(e) {
      list.forEach(function (b) {
        if (b.classList.contains('pop')) return;
        var r = b.getBoundingClientRect();
        if (Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < r.width / 2 + 8) {
          b.classList.add('pop'); setTimeout(function () { place(b); b.classList.remove('pop'); }, 520);
        }
      });
    }
    if (!reduce) {
      el.addEventListener('pointermove', hit, { passive: true });
      el.addEventListener('pointerdown', hit, { passive: true });
      if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
        el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; vid.style.transform = 'translate(' + (x * -2.2) + 'cqw,' + (y * -2.2) + 'cqh) scale(1.015)'; }, { passive: true });
        el.addEventListener('pointerleave', function () { vid.style.transform = ''; });
      }
    }

    // Video: se pide y se reproduce solo mientras la portada se ve
    var loaded = false;
    function play() { if (reduce) return; if (!loaded) { loaded = true; vid.src = DIR + 'agua-ropa.mp4'; } var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { if (en[0].isIntersecting) play(); else vid.pause(); }, { threshold: 0.15 }).observe(el);
    else play();
    document.addEventListener('visibilitychange', function () { if (document.hidden) vid.pause(); else if (loaded) play(); });
  }

  global.ChispitaClean = { init: init };
})(window);
