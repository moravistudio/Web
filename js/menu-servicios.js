/*
 * Menú desplegable de «Servicios»: abre/cierra con la flechita (toque o teclado).
 * En PC con mouse, el abrir al pasar el cursor lo hace solo el CSS. Aquí solo se cuida:
 * - cerrar al tocar fuera, al elegir una opción o con la tecla Escape;
 * - mantener aria-expanded al día para lectores de pantalla.
 * Si algo falla, el enlace «Servicios» sigue funcionando igual que antes.
 */
/* Al llegar desde otra página con #seccion (p. ej. «Servicios» desde el portafolio), la portada se quedaba arriba porque el navegador salta
   a la sección antes de que termine de armarse. Una vez cargada, si sigue arriba, baja a la sección. */
window.addEventListener('load', function () {
  var h = location.hash, t = null;
  if (h.length < 2) return;
  try { t = document.querySelector(h); } catch (e) { return; }
  if (!t) return;
  setTimeout(function () {
    if (window.scrollY < 50 && !document.documentElement.classList.contains('intro-on')) t.scrollIntoView({ behavior: 'instant' });
  }, 200);
});

(function () {
  var items = document.querySelectorAll('.nav__item');
  if (!items.length) return;

  function setOpen(item, open) {
    item.classList.toggle('is-open', open);
    var caret = item.querySelector('.nav__caret');
    if (caret) {
      caret.setAttribute('aria-expanded', open ? 'true' : 'false');
      var en = document.documentElement.getAttribute('lang') === 'en';
      caret.setAttribute('aria-label', en ? 'Show services' : 'Mostrar servicios');
    }
  }

  items.forEach(function (item) {
    var caret = item.querySelector('.nav__caret');
    if (!caret) return;
    caret.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(item, !item.classList.contains('is-open'));
    });
    item.querySelectorAll('.nav__sublink').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(item, false); });
    });
  });

  document.addEventListener('click', function (e) {
    items.forEach(function (item) { if (!item.contains(e.target)) setOpen(item, false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    items.forEach(function (item) {
      if (item.classList.contains('is-open')) {
        setOpen(item, false);
        var caret = item.querySelector('.nav__caret');
        if (caret && item.contains(document.activeElement)) caret.focus();
      }
    });
  });
})();
