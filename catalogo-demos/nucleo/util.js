/*
 * Utilidades comunes de todas las muestras del Catálogo a la medida (sin librerías).
 *   U.dinero(289)           → «S/ 289»
 *   U.esc('<b>')            → texto seguro para meter en HTML
 *   U.oscuro('#B4532A', .3) → mismo color, más oscuro (para sombras y detalles de las ilustraciones)
 */
(function (w) {
  'use strict';
  var U = {};
  U.moneda = 'S/';
  U.dinero = function (n) { return U.moneda + ' ' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); };
  U.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function aRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/(.)/g, '$1$1'); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function aHex(r) { return '#' + r.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); }).join(''); }
  U.mezcla = function (a, b, t) { var x = aRgb(a), y = aRgb(b); return aHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]); };
  U.oscuro = function (h, t) { return U.mezcla(h, '#000000', t); };
  U.claro = function (h, t) { return U.mezcla(h, '#ffffff', t); };
  U.param = function (nombre) { return new URLSearchParams(location.search).get(nombre); };
  // aviso breve en la parte baja de la pantalla (lo usan los enlaces de ejemplo)
  U.aviso = function (msg) {
    var a = document.getElementById('u-aviso');
    if (!a) { a = document.createElement('div'); a.id = 'u-aviso'; a.setAttribute('role', 'status'); a.style.cssText = 'position:fixed;left:50%;bottom:22px;transform:translateX(-50%);max-width:min(92vw,460px);background:#1c1c1c;color:#fff;font:500 14px/1.4 system-ui,sans-serif;padding:12px 18px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.3);z-index:2147483000;text-align:center;opacity:0;transition:opacity .2s;pointer-events:none'; document.body.appendChild(a); }
    a.textContent = msg; a.style.opacity = '1'; clearTimeout(a._t); a._t = setTimeout(function () { a.style.opacity = '0'; }, 3400);
  };
  w.U = U;
})(window);
