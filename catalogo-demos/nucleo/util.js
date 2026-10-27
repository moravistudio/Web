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
  w.U = U;
})(window);
