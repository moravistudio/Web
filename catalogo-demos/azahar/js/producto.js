/*
 * Muestra 1 · Azahar — página completa de un producto (producto.html?id=p1).
 * Galería, color, talla, cantidad, agregar al carrito, detalles en acordeón y productos relacionados.
 */
(function (w) {
  'use strict';
  var D = w.DATOS, $ = function (s) { return document.querySelector(s); };
  document.addEventListener('DOMContentLoaded', function () {
    var p = D.producto(U.param('id') || 'p1') || D.producto('p1'), estado = { color: p.colores[0], talla: p.tallas ? '' : 'Única', cant: 1, vista: 0 };
    document.title = p.nombre + ' · ' + D.marca.nombre + ' (muestra de catálogo)';
    $('#migas').innerHTML = '<a href="index.html">Inicio</a> › <a href="index.html?cat=' + p.cat + '#catalogo">' + (p.cat === 'carteras' ? 'Carteras' : 'Calzado') + '</a> › ' + U.esc(p.nombre);
    
    function vista(i, hex) { return Arte.imagen(p, estado.color, hex, i, p.nombre + ', vista ' + (i + 1)); }
    function pintar() {
      var c = D.colores[estado.color], hex = c.hex, conFoto = !!(p.fotos && p.fotos[estado.color]);
      // con foto real hay una sola vista por ahora; las ilustraciones provisionales simulan cuatro
      var minis = (conFoto ? [0] : [0, 1, 2, 3]).map(function (i) { return '<button class="mini' + (i === estado.vista ? ' on' : '') + '" type="button" data-v="' + i + '" aria-label="Ver foto ' + (i + 1) + '">' + vista(i, hex) + '</button>'; }).join('');
      var muestras = p.colores.map(function (k) { return '<button class="muestra' + (k === estado.color ? ' on' : '') + '" type="button" data-c="' + k + '" title="' + D.colores[k].nombre + '" aria-label="Color ' + D.colores[k].nombre + '" style="background:' + D.colores[k].hex + '"></button>'; }).join('');
      var tallas = p.tallas ? '<div class="opc"><div class="opc__tit">Talla <span>(elige una)</span></div><div class="tallas">' + p.tallas.map(function (t) { return '<button class="talla' + (t === estado.talla ? ' on' : '') + '" type="button" data-t="' + t + '">' + t + '</button>'; }).join('') + '</div></div>' : '';
      $('#prod').innerHTML =
        '<div class="galeria"><div class="galeria__mini">' + minis + '</div><div class="galeria__grande">' + vista(estado.vista, hex) + '' + (conFoto ? '' : '<span class="galeria__nota">Fotos provisionales</span>') + '</div></div>' +
        '<div><p class="prod__cat">' + (p.cat === 'carteras' ? 'Carteras' : 'Calzado') + '</p><h1>' + U.esc(p.nombre) + '</h1>' +
        '<div class="estrellas"><i>★★★★★</i><span>4,8 · 23 opiniones</span></div>' +
        '<p class="precio"><b>' + U.dinero(p.precio) + '</b>' + (p.antes ? '<s>' + U.dinero(p.antes) + '</s>' : '') + '</p>' +
        '<p class="prod__desc">' + U.esc(p.desc) + '</p>' +
        '<div class="opc"><div class="opc__tit">Color <span>· ' + c.nombre + '</span></div><div class="muestras">' + muestras + '</div></div>' + tallas +
        '<div class="prod__acc"><div class="cant"><button type="button" data-q="-1" aria-label="Menos">−</button><span>' + estado.cant + '</span><button type="button" data-q="1" aria-label="Más">+</button></div>' +
        '<button class="btn btn--marca" type="button" id="agregar">Agregar al carrito</button><button class="btn btn--linea" type="button" id="comprar">Comprar ahora</button></div>' +
        '<p class="aviso-opc" id="aviso-opc" role="status"></p>' +
        '<div class="beneficios"><div>Envío a todo el Perú en 2 a 5 días</div><div>Cambios y devoluciones hasta 7 días</div><div>Paga con tarjeta, Yape o Plin</div></div>' +
        '<div class="acordeon"><details open><summary>Medidas</summary><p>' + U.esc(p.medidas) + '</p></details><details><summary>Materiales y cuidados</summary><p>Cuero de res con acabado suave. Limpiar con un paño seco; evitar la humedad y el sol directo. Guardar en su bolsa de tela.</p></details><details><summary>Envíos y cambios</summary><p>Lima: entrega en 24 a 72 horas. Provincias: 3 a 5 días con seguimiento. Puedes cambiar tu pedido dentro de los 7 días siguientes a la entrega.</p></details></div></div>';
    }
    function aviso(t) { var a = $('#aviso-opc'); if (a) a.textContent = t; }
    function agregar() { if (p.tallas && !estado.talla) { aviso('Elige una talla para continuar.'); return false; } Tienda.agregar(p.id, { color: estado.color, talla: estado.talla }, estado.cant); return true; }
    $('#prod').addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-v]'))) { estado.vista = +t.getAttribute('data-v'); pintar(); return; }
      if ((t = e.target.closest('[data-c]'))) { estado.color = t.getAttribute('data-c'); pintar(); return; }
      if ((t = e.target.closest('[data-t]'))) { estado.talla = t.getAttribute('data-t'); pintar(); return; }
      if ((t = e.target.closest('[data-q]'))) { estado.cant = Math.max(1, Math.min(10, estado.cant + (+t.getAttribute('data-q')))); pintar(); return; }
      if (e.target.closest('#agregar')) { if (agregar()) Tienda.abrirCarrito(); return; }
      if (e.target.closest('#comprar')) { if (agregar()) location.href = 'pago.html'; }
    });
    pintar();
    var rel = D.productos.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 4);
    $('#relacionados').innerHTML = rel.map(Tienda.tarjeta).join(''); Tienda.enlazarTarjetas($('#relacionados'));
  });
})(window);
