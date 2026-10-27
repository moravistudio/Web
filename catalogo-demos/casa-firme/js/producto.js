/*
 * Muestra 3 · Casa Firme — PÁGINA DE PRODUCTO (producto.html?id=c1&op=20%20oz).
 * Foto grande (con acercamiento al hacer clic), precio, presentación, cantidad, descripción, ficha técnica y productos relacionados.
 * El pedido se abre como cajón lateral al agregar. Comparte carrito y datos con la lista.
 */
(function (w) {
  'use strict';
  var D = w.DATOS, M = D.marca, $ = function (s, r) { return (r || document).querySelector(s); };
  document.addEventListener('DOMContentLoaded', function () {
    var raiz = $('#prod-raiz'), carrito = Tienda.carrito, p = D.producto(U.param('id'));
    if (!p) { raiz.innerHTML = '<div class="gracias"><h2>No encontramos ese producto</h2><p style="margin:10px 0 22px;color:var(--suave)">Puede que el enlace esté incompleto.</p><a class="btn btn--marca" href="index.html">Ir al catálogo</a></div>'; return; }
    document.title = p.nombre + ' · ' + M.nombre + ' (muestra de catálogo)';
    var op = D.tam(p, U.param('op') || p.tam[0].n).n, cant = 1, aviso = '';

    function relacionados() {
      var misma = D.productos.filter(function (x) { return x.id !== p.id && x.cat === p.cat; }), otras = D.productos.filter(function (x) { return x.id !== p.id && x.cat !== p.cat; });
      return misma.concat(otras).slice(0, 4).map(function (x) {
        var t = D.desde(x), multi = x.tam.length > 1;
        return '<article class="rel__f" data-id="' + x.id + '"><a class="rel__foto" href="producto.html?id=' + x.id + '" aria-label="Ver ' + U.esc(x.nombre) + '">' + Arte.producto(x) + '</a>' +
          '<div><p class="fila__cod">' + x.codigo + '</p><a class="rel__nombre" href="producto.html?id=' + x.id + '">' + U.esc(x.nombre) + '</a><p class="rel__p">' + (multi ? 'Desde ' : '') + '<b>' + U.dinero(t.precio) + '</b></p></div>' +
          (multi ? '<a class="btn btn--linea" href="producto.html?id=' + x.id + '">Ver opciones</a>' : '<button class="btn btn--linea" type="button" data-rel="' + x.id + '">Agregar</button>') + '</article>';
      }).join('');
    }
    function enPedido() { var k = carrito.llave({ id: p.id, color: '', talla: op }), l = carrito.lineas().filter(function (x) { return carrito.llave(x) === k; })[0]; return l ? l.cant : 0; }
    function compra() {
      var t = D.tam(p, op), ya = enPedido();
      return '<p class="prod__precio">' + (t.antes ? '<s>' + U.dinero(t.antes) + '</s>' : '') + '<b>' + U.dinero(t.precio) + '</b>' + (t.antes ? '<em>Ahorras ' + U.dinero(t.antes - t.precio) + '</em>' : '') + '</p>' +
        (p.tam.length > 1 ? '<div class="ops" role="radiogroup" aria-label="' + p.opcion + '"><span class="ops__t">' + p.opcion + '</span>' + p.tam.map(function (x) { var on = x.n === op; return '<button class="op' + (on ? ' on' : '') + '" type="button" role="radio" aria-checked="' + on + '" data-op="' + U.esc(x.n) + '">' + U.esc(x.n) + '</button>'; }).join('') + '</div>' : '') +
        '<div class="prod__buy"><div class="cant" role="group" aria-label="Cantidad"><button type="button" data-q="-1" aria-label="Menos">−</button><span>' + cant + '</span><button type="button" data-q="1" aria-label="Más">+</button></div>' +
        '<button class="btn btn--marca" type="button" id="agregar">Agregar al pedido · ' + U.dinero(t.precio * cant) + '</button></div>' +
        '<p class="prod__ok" role="status">' + (aviso || (ya ? 'Ya tienes ' + ya + ' en tu pedido.' : '')) + '</p>';
    }
    function pintarCompra() { $('#compra').innerHTML = compra(); }

    raiz.innerHTML = '<nav class="migas" aria-label="Ruta"><a href="index.html">Catálogo</a><span>/</span><a href="index.html?cat=' + p.cat + '">' + D.categoriaNombre(p.cat) + '</a><span>/</span><b>' + U.esc(p.nombre) + '</b></nav>' +
      '<div class="prod"><div><div class="prod__foto" id="foto"><button class="zoom" type="button" aria-pressed="false" aria-label="Acercar la foto de ' + U.esc(p.nombre) + '">' + Arte.producto(p) + '</button>' + (D.enOferta(p) ? '<span class="etiqueta">Oferta</span>' : '') + '</div><p class="prod__pista">Haz clic en la foto para acercar</p></div>' +
      '<div class="prod__info"><p class="fila__cod">' + p.codigo + ' · ' + p.tipoTxt + '</p><h1>' + U.esc(p.nombre) + '</h1><p class="prod__res">' + U.esc(p.resumen) + '</p>' +
      '<div id="compra"></div>' +
      '<ul class="prod__gar"><li>En stock, listo para despacho</li><li>Despacho en Lima en 24 horas</li><li>Cambio directo por falla de fábrica</li></ul>' +
      '<div class="prod__sec"><h2>Descripción</h2><p>' + U.esc(p.desc) + '</p></div>' +
      '<div class="prod__sec"><h2>Ficha técnica</h2><dl>' + p.specs.map(function (s) { return '<div><dt>' + s[0] + '</dt><dd>' + U.esc(s[1]) + '</dd></div>'; }).join('') + '</dl></div></div></div>' +
      '<section class="rel" aria-label="Productos relacionados"><h2>También te puede servir</h2><div class="rel__lista">' + relacionados() + '</div></section>';
    pintarCompra();

    // acercar la foto: un clic la amplía y sigue al puntero; otro clic la devuelve
    var fo = $('#foto'), zb = $('.zoom', fo);
    function mover(e) { if (!fo.classList.contains('zoom-on')) return; var r = zb.getBoundingClientRect(); fo.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%'); fo.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%'); }
    zb.addEventListener('click', function (e) { var on = fo.classList.toggle('zoom-on'); zb.setAttribute('aria-pressed', on); if (e.detail) mover(e); });
    zb.addEventListener('mousemove', mover);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && fo.classList.contains('zoom-on')) { fo.classList.remove('zoom-on'); zb.setAttribute('aria-pressed', 'false'); } });

    $('#compra').addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-op]'))) { op = t.getAttribute('data-op'); aviso = ''; history.replaceState(null, '', 'producto.html?id=' + p.id + '&op=' + encodeURIComponent(op)); pintarCompra(); var b = $('[data-op="' + op + '"]', $('#compra')); if (b) b.focus(); return; }
      if ((t = e.target.closest('[data-q]'))) { cant = Math.max(1, Math.min(20, cant + (+t.getAttribute('data-q')))); aviso = ''; pintarCompra(); var q = $('[data-q="' + t.getAttribute('data-q') + '"]', $('#compra')); if (q) q.focus(); return; }
      if (e.target.closest('#agregar')) { carrito.agregar(p.id, { talla: op }, cant); aviso = '✓ Agregaste ' + cant + ' × ' + p.nombre + (p.tam.length > 1 ? ' (' + op + ')' : '') + ' a tu pedido.'; cant = 1; pintarCompra(); Tienda.abrirPedido(); }
    });
    $('.rel__lista').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rel]'); if (!b) return;
      carrito.agregar(b.getAttribute('data-rel'), { talla: D.producto(b.getAttribute('data-rel')).tam[0].n }, 1);
      b.textContent = '✓ Agregado'; setTimeout(function () { b.textContent = 'Agregar'; }, 1600);
    });
    carrito.alCambiar(function () { aviso = aviso && enPedido() ? aviso : ''; pintarCompra(); });
  });
})(window);
