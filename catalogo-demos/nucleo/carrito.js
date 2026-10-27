/*
 * Carrito de compras de las muestras del Catálogo a la medida. Guarda en el navegador (localStorage) y avisa cuando cambia.
 * Cada línea es un producto + color + talla. Sin servidor: el pedido real se arma en la página de pago.
 *   var carrito = Carrito('azahar'); carrito.agregar('p1', { color: 'camel', talla: 'Única' }, 1);
 */
(function (w) {
  'use strict';
  function Carrito(clave) {
    var K = 'carrito-' + clave, lineas = [], oyentes = [];
    try { lineas = JSON.parse(localStorage.getItem(K) || '[]').filter(function (l) { return l && l.id && l.cant > 0; }); } catch (e) { lineas = []; }
    function guardar() { try { localStorage.setItem(K, JSON.stringify(lineas)); } catch (e) { /* sin almacenamiento: el carrito vive solo mientras la página está abierta */ } oyentes.forEach(function (f) { f(lineas); }); }
    function llave(l) { return l.id + '|' + (l.color || '') + '|' + (l.talla || ''); }
    var api = {
      lineas: function () { return lineas.slice(); },
      cantidad: function () { return lineas.reduce(function (s, l) { return s + l.cant; }, 0); },
      agregar: function (id, op, cant) {
        op = op || {}; cant = cant || 1;
        var n = { id: id, color: op.color || '', talla: op.talla || '', cant: cant }, ex = lineas.filter(function (l) { return llave(l) === llave(n); })[0];
        if (ex) ex.cant = Math.min(20, ex.cant + cant); else lineas.push(n);
        guardar();
      },
      cambiar: function (k, delta) { lineas.forEach(function (l) { if (llave(l) === k) l.cant = Math.max(0, Math.min(20, l.cant + delta)); }); lineas = lineas.filter(function (l) { return l.cant > 0; }); guardar(); },
      quitar: function (k) { lineas = lineas.filter(function (l) { return llave(l) !== k; }); guardar(); },
      vaciar: function () { lineas = []; guardar(); },
      llave: llave,
      total: function (precio) { return lineas.reduce(function (s, l) { return s + l.cant * precio(l.id); }, 0); },
      alCambiar: function (f) { oyentes.push(f); }
    };
    return api;
  }
  w.Carrito = Carrito;
})(window);
