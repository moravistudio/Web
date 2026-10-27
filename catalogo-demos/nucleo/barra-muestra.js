/*
 * Franja de «muestra» (solo en la copia que se publica en moravistudio.com/catalogo-demos/).
 * Va arriba de cada página de cada muestra: permite volver al portafolio, cambiar el idioma (ES | EN) y pedir un catálogo parecido.
 * Uso: <script src="../nucleo/barra-muestra.js" data-nombre="Azahar"></script> justo después de <body> (y después de idioma.js).
 */
(function () {
  'use strict';
  if (/[?&]sinbarra(?:=|&|$)/.test(location.search)) return; // para tomar las capturas de las tarjetas sin la franja
  var s = document.currentScript, nombre = (s && s.getAttribute('data-nombre')) || 'esta muestra';
  var I = window.Idioma, en = !!I && I.actual() === 'en';
  var msg = encodeURIComponent(en
    ? 'Hi Moravi Studio, I saw the “' + nombre + '” sample and I want a similar catalog for my business.'
    : 'Hola Moravi Studio, vi la muestra «' + nombre + '» y quiero un catálogo parecido para mi negocio.');
  var css = '#barra-muestra{background:#0A1B3C;color:#fff;font:500 13px/1.3 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 16px;position:relative;z-index:60}' +
    '#barra-muestra a{color:#fff;text-decoration:none}#barra-muestra .bm-volver{display:inline-flex;align-items:center;gap:6px;font-weight:600;white-space:nowrap}#barra-muestra .bm-volver:hover{text-decoration:underline}' +
    '#barra-muestra .bm-corto{display:none}' +
    '#barra-muestra .bm-txt{color:#c9d6ea;text-align:center;flex:1}' +
    '#barra-muestra .bm-der{display:flex;align-items:center;gap:10px}' +
    '#barra-muestra .bm-idioma{display:inline-flex;border:1px solid rgba(255,255,255,.4);border-radius:99px;padding:2px}' +
    '#barra-muestra .bm-idioma button{border:0;background:transparent;color:#dbe6f6;font:700 11.5px/1 Inter,system-ui,sans-serif;padding:5px 9px;border-radius:99px;cursor:pointer}' +
    '#barra-muestra .bm-idioma button.on{background:#fff;color:#0A1B3C}' +
    '#barra-muestra .bm-pedir{background:#1E8CFF;border-radius:99px;padding:6px 14px;font-weight:700;white-space:nowrap}#barra-muestra .bm-pedir:hover{background:#3a9bff}' +
    '#barra-muestra a:focus-visible,#barra-muestra button:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '@media (max-width:640px){#barra-muestra .bm-txt{display:none}#barra-muestra{padding:7px 10px;gap:8px}#barra-muestra .bm-largo{display:none}#barra-muestra .bm-corto{display:inline}#barra-muestra .bm-pedir{padding:6px 11px}#barra-muestra .bm-der{gap:7px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var b = document.createElement('div'); b.id = 'barra-muestra';
  b.innerHTML = '<a class="bm-volver" href="../"><span class="bm-largo">← Ver otras muestras</span><span class="bm-corto">← Muestras</span></a><span class="bm-txt">Muestra de catálogo hecha por Moravi Studio</span>' +
    '<div class="bm-der">' + (I ? I.selector('bm-idioma') : '') + '<a class="bm-pedir" href="https://wa.me/51940284018?text=' + msg + '" target="_blank" rel="noopener noreferrer">Quiero uno así</a></div>';
  document.body.insertBefore(b, document.body.firstChild);
  if (I) I.enlazar(b);
})();
