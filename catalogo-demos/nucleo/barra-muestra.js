/*
 * Franja de «muestra» (solo en la copia que se publica en moravistudio.com/catalogo-demos/).
 * Va arriba de cada página de cada muestra: permite volver al portafolio y pedir un catálogo parecido.
 * Uso: <script src="../nucleo/barra-muestra.js" data-nombre="Azahar"></script> justo después de <body>.
 */
(function () {
  'use strict';
  var s = document.currentScript, nombre = (s && s.getAttribute('data-nombre')) || 'esta muestra';
  var msg = encodeURIComponent('Hola Moravi Studio, vi la muestra «' + nombre + '» y quiero un catálogo parecido para mi negocio.');
  var css = '#barra-muestra{background:#0A1B3C;color:#fff;font:500 13px/1.3 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 16px;position:relative;z-index:60}' +
    '#barra-muestra a{color:#fff;text-decoration:none}#barra-muestra .bm-volver{display:inline-flex;align-items:center;gap:6px;font-weight:600}#barra-muestra .bm-volver:hover{text-decoration:underline}' +
    '#barra-muestra .bm-txt{color:#c9d6ea;text-align:center;flex:1}' +
    '#barra-muestra .bm-pedir{background:#1E8CFF;border-radius:99px;padding:6px 14px;font-weight:700;white-space:nowrap}#barra-muestra .bm-pedir:hover{background:#3a9bff}' +
    '#barra-muestra a:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '@media (max-width:640px){#barra-muestra .bm-txt{display:none}#barra-muestra{padding:7px 12px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var b = document.createElement('div'); b.id = 'barra-muestra';
  b.innerHTML = '<a class="bm-volver" href="../">← Ver otras muestras</a><span class="bm-txt">Muestra de catálogo hecha por Moravi Studio</span>' +
    '<a class="bm-pedir" href="https://wa.me/51940284018?text=' + msg + '" target="_blank" rel="noopener noreferrer">Quiero uno así</a>';
  document.body.insertBefore(b, document.body.firstChild);
})();
