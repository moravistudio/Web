/*
 * Muestra 3 · Casa Firme — catálogo en LISTA con pedido rápido.
 * Estructura: categorías fijas a la izquierda · lista de filas en el centro (foto, datos, presentación y cantidad en la misma fila)
 * · «Tu pedido» fijo a la derecha, siempre visible. Sin página de producto ni ventana: el detalle se despliega dentro de la fila.
 * En celular las categorías pasan a una franja arriba y el pedido a una barra inferior que abre una hoja.
 */
(function (w) {
  'use strict';
  var D = w.DATOS, M = D.marca, carrito = Carrito('casafirme'), $ = function (s, r) { return (r || document).querySelector(s); };
  var movil = function () { return w.matchMedia('(max-width:1099px)').matches; };

  var ICON = {
    lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    caja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/></svg>',
    camion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h11v10H2z"/><path d="M13 10h5l3 3v3h-8"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    escudo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5L15.5 10"/></svg>',
    tarjeta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/></svg>',
    mayor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16v4H4zM6 12v8h12v-8M12 8v12"/></svg>'
  };

  // logo: casa dentro de un cuadrado amarillo + nombre
  function emblema() {
    return '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="11" fill="#F2B705"/><path d="M10 25 24 12l14 13" fill="none" stroke="#1F2A30" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 22v14h16V22" fill="none" stroke="#1F2A30" stroke-width="3.6" stroke-linejoin="round"/><rect x="21" y="28" width="6" height="8" fill="#1F2A30"/></svg>';
  }
  function logo() { return '<a class="logo" href="index.html" aria-label="' + M.nombre + ', inicio">' + emblema() + '<span class="logo__txt"><span class="logo__nombre">' + M.nombre + '</span><span class="logo__sub">' + M.apellido + '</span></span></a>'; }

  w.Tienda = { carrito: carrito, emblema: emblema };
  w.Tienda.total = function () { return carrito.lineas().reduce(function (s, l) { return s + l.cant * D.precioLinea(l); }, 0); };
  w.Tienda.arteLinea = function (l) { return Arte.producto(D.producto(l.id)); };
  w.Tienda.detalle = function (l) { var p = D.producto(l.id); return p && p.tam.length > 1 ? l.talla : ''; };

  // modo: 'lista' (buscador que filtra al escribir), 'producto' (buscador que lleva a la lista) o 'pago' (solo volver)
  function cabecera(modo) {
    var ph = 'Buscar por nombre o código: taladro, cable, pintura…', buscador = modo === 'lista' ? '<div class="busca">' + ICON.lupa + '<label class="solo-lectores" for="q">Buscar productos</label><input id="q" type="search" placeholder="' + ph + '" autocomplete="off"></div>'
      : modo === 'producto' ? '<form class="busca" action="index.html" method="get" role="search">' + ICON.lupa + '<label class="solo-lectores" for="q">Buscar productos</label><input id="q" name="q" type="search" placeholder="' + ph + '" autocomplete="off"></form>'
        : '<a class="cab__vol" href="index.html">← Seguir comprando</a>';
    $('#cabecera').innerHTML = '<div class="aviso">' + M.aviso + '</div>' +
      '<header class="cab"><div class="contenedor cab__in">' + logo() + buscador +
      '<div class="cab__der"><span class="cab__hor">' + M.horario + '</span>' + (modo !== 'pago' ? '<button class="btn-ped' + (modo === 'producto' ? ' btn-ped--siempre' : '') + '" type="button" id="abrir-pedido" aria-label="Abrir mi pedido">' + ICON.bolsa + '<span>Mi pedido</span><b id="n-carrito">0</b></button>' : '') + '</div></div></header>';
  }
  // pie propio de esta muestra: franja de servicios (incluye los medios de pago) + pie con datos de la tienda física
  function pie() {
    var s = function (ico, t, d) { return '<li>' + ico + '<div><b>' + t + '</b><span>' + d + '</span></div></li>'; };
    $('#pie').innerHTML = '<section class="servicios" aria-label="Servicios"><div class="contenedor"><ul>' +
      s(ICON.camion, 'Despacho en 24 horas', 'En Lima, con seguimiento') + s(ICON.escudo, 'Garantía en herramientas', 'Cambio directo por falla de fábrica') +
      s(ICON.tarjeta, 'Tarjeta, Yape o Plin', 'Pagas aquí mismo, sin salir del catálogo') + s(ICON.mayor, 'Compras por mayor', 'Pide tu cotización con descuento') + '</ul></div></section>' +
      '<footer class="pie"><div class="contenedor pie__in">' +
      '<div class="pie__marca">' + logo() + '<p>Todo para tu obra y tu hogar, con atención de lunes a sábado.</p></div>' +
      '<div class="pie__tienda"><h4>Visítanos</h4><p>Av. Los Constructores 450, Ate, Lima</p><p>' + M.horario + '</p></div>' +
      '<div class="pie__tienda"><h4>Pedidos y cotizaciones</h4><p>WhatsApp 900 000 000</p><p>ventas@casafirme.example</p></div>' +
      '</div><div class="contenedor pie__fin"><nav aria-label="Categorías"><a href="index.html?cat=herramientas">Herramientas</a><a href="index.html?cat=electricidad">Electricidad</a><a href="index.html?cat=pinturas">Pinturas</a><a href="index.html?cat=plomeria">Plomería y jardín</a><a href="index.html?cat=ofertas">Ofertas</a></nav>' +
      '<span>© 2026 ' + M.nombre + ' · Catálogo de ejemplo hecho por Moravi Studio. Marca, dirección y productos inventados.</span></div></footer>';
  }

  // ---------- Tu pedido (panel fijo a la derecha; en celular, hoja inferior) ----------
  var panel = null, velo = null, barra = null;
  function montarPedido() {
    panel = $('#pedido'); if (!panel) return;
    panel.innerHTML = '<div class="pedido__cab"><h2>Tu pedido <b id="n-carrito2">0</b></h2><button class="pedido__x" type="button" id="cerrar-pedido" aria-label="Cerrar pedido">×</button></div><div class="pedido__lista" id="pedido-lista"></div><div class="pedido__pie" id="pedido-pie"></div>';
    velo = document.createElement('div'); velo.className = 'velo'; velo.id = 'velo'; document.body.appendChild(velo);
    if ($('#lista')) {   // la barra inferior con el total solo existe en la lista (en celular)
      barra = document.createElement('div'); barra.className = 'barra'; barra.id = 'barra'; barra.hidden = true;
      barra.innerHTML = '<div class="barra__t"><b id="barra-n"></b><span id="barra-t"></span></div><button class="btn btn--marca" type="button" id="abrir-pedido2">Ver pedido</button>';
      document.body.appendChild(barra);
      $('#abrir-pedido2').addEventListener('click', abrirPedido);
    }
    $('#abrir-pedido').addEventListener('click', abrirPedido);
    $('#cerrar-pedido').addEventListener('click', cerrarPedido); velo.addEventListener('click', cerrarPedido);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('on')) cerrarPedido(); });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('#vaciar')) { carrito.vaciar(); return; }
      var b = e.target.closest('[data-acc]'); if (!b) return; var k = b.getAttribute('data-k'), a = b.getAttribute('data-acc');
      if (a === 'mas') carrito.cambiar(k, 1); else if (a === 'menos') carrito.cambiar(k, -1); else carrito.quitar(k);
    });
  }
  // en la lista (pantalla ancha) el pedido ya está fijo a la vista; en celular y en la página de producto se abre como hoja o cajón
  function abrirPedido() { if (!movil() && !panel.classList.contains('pedido--cajon')) { panel.scrollIntoView({ block: 'nearest' }); return; } panel.classList.add('on'); velo.classList.add('on'); document.body.style.overflow = 'hidden'; $('#cerrar-pedido').focus(); }
  function cerrarPedido() { if (!panel) return; panel.classList.remove('on'); velo.classList.remove('on'); document.body.style.overflow = ''; }
  w.Tienda.abrirPedido = abrirPedido;

  function pintarPedido() {
    if (!panel) return;
    var ls = carrito.lineas(), n = carrito.cantidad(), total = w.Tienda.total(), lista = $('#pedido-lista'), pieP = $('#pedido-pie');
    $('#n-carrito').textContent = n; $('#n-carrito2').textContent = n;
    if (barra) { barra.hidden = !n; document.body.classList.toggle('con-barra', !!n); $('#barra-n').textContent = n + (n === 1 ? ' producto' : ' productos'); $('#barra-t').textContent = U.dinero(total); }
    if (!ls.length) {
      lista.innerHTML = '<div class="pedido__vacio">' + ICON.caja + '<p><b>Tu pedido está vacío.</b></p><p>Agrega productos desde la lista y aquí verás el total mientras eliges.</p></div>';
      pieP.innerHTML = ''; return;
    }
    lista.innerHTML = ls.map(function (l) {
      var p = D.producto(l.id), k = U.esc(carrito.llave(l)), det = w.Tienda.detalle(l);
      return '<div class="pl"><a class="pl__foto" href="producto.html?id=' + p.id + '" tabindex="-1" aria-hidden="true">' + w.Tienda.arteLinea(l) + '</a><div><a class="pl__nombre" href="producto.html?id=' + p.id + '">' + U.esc(p.nombre) + '</a>' + (det ? '<div class="pl__var">' + U.esc(det) + '</div>' : '') +
        '<div class="cant cant--s"><button type="button" data-acc="menos" data-k="' + k + '" aria-label="Quitar uno de ' + U.esc(p.nombre) + '">−</button><span>' + l.cant + '</span><button type="button" data-acc="mas" data-k="' + k + '" aria-label="Agregar uno de ' + U.esc(p.nombre) + '">+</button></div></div>' +
        '<div class="pl__der"><div class="pl__precio">' + U.dinero(D.precioLinea(l) * l.cant) + '</div><button class="pl__quitar" type="button" data-acc="quitar" data-k="' + k + '">Quitar</button></div></div>';
    }).join('');
    var falta = Math.max(0, M.envio.gratisDesde - total), pct = Math.min(100, total / M.envio.gratisDesde * 100);
    pieP.innerHTML = '<div class="envio"><p>' + (falta ? 'Te faltan <b>' + U.dinero(falta) + '</b> para el envío gratis' : '<b>¡Tu pedido tiene envío gratis!</b>') + '</p><div class="envio__barra"><i style="width:' + pct + '%"></i></div></div>' +
      '<div class="sub"><span>Subtotal</span><span>' + U.dinero(total) + '</span></div><p class="nota">El envío se calcula al pagar.</p><a class="btn btn--marca btn--bloque" href="pago.html">Ir a pagar</a><button class="pedido__vaciar" type="button" id="vaciar">Vaciar pedido</button>';
  }

  // ---------- Lista de productos (solo inicio) ----------
  function inicio() {
    var L = $('#lista'); if (!L) return;
    var cat = U.param('cat') || 'todo', q = (U.param('q') || '').trim().toLowerCase(), orden = 'rel', sel = {}, catsEl = $('#cats');
    $('#q').value = U.param('q') || '';
    function elegida(p) { return sel[p.id] || p.tam[0].n; }
    function lineaDe(p) { var k = carrito.llave({ id: p.id, color: '', talla: elegida(p) }); return carrito.lineas().filter(function (l) { return carrito.llave(l) === k; })[0]; }
    function etiquetaOferta(p) { var t = p.tam.filter(function (x) { return x.antes; })[0]; return t ? '-' + Math.round((1 - t.precio / t.antes) * 100) + '%' : ''; }
    function compra(p) {
      var t = D.tam(p, elegida(p)), l = lineaDe(p);
      return '<p class="fila__precio">' + (t.antes ? '<s>' + U.dinero(t.antes) + '</s>' : '') + '<b>' + U.dinero(t.precio) + '</b>' + (p.tam.length > 1 ? '<span class="fila__ud">' + U.esc(t.n) + '</span>' : '') + '</p>' +
        (l ? '<div class="cant" role="group" aria-label="Cantidad de ' + U.esc(p.nombre) + '"><button type="button" data-acc="menos" aria-label="Quitar uno">−</button><span>' + l.cant + '</span><button type="button" data-acc="mas" aria-label="Agregar uno">+</button></div>'
          : '<button class="btn btn--marca" type="button" data-acc="agregar" aria-label="Agregar ' + U.esc(p.nombre) + ' al pedido">Agregar</button>');
    }
    function fila(p) {
      var op = p.tam.length > 1 ? '<div class="ops" role="radiogroup" aria-label="' + p.opcion + '"><span class="ops__t">' + p.opcion + '</span>' + p.tam.map(function (t) { var on = t.n === elegida(p); return '<button class="op' + (on ? ' on' : '') + '" type="button" role="radio" aria-checked="' + on + '" data-op="' + U.esc(t.n) + '">' + U.esc(t.n) + '</button>'; }).join('') + '</div>' : '';
      var of = D.enOferta(p) ? etiquetaOferta(p) : '', href = 'producto.html?id=' + p.id + (p.tam.length > 1 ? '&op=' + encodeURIComponent(elegida(p)) : '');
      return '<article class="fila" data-id="' + p.id + '"><a class="fila__foto" href="' + href + '" aria-label="Ver ' + U.esc(p.nombre) + '">' + Arte.producto(p) + (of ? '<span class="etiqueta">' + of + '</span>' : '') + '</a>' +
        '<div class="fila__info"><p class="fila__cod">' + p.codigo + ' · ' + p.tipoTxt + '</p><h2 class="fila__nombre"><a href="' + href + '">' + U.esc(p.nombre) + '</a></h2><p class="fila__res">' + U.esc(p.resumen) + '</p>' + op +
        '<a class="fila__det" href="' + href + '">Ver producto <i aria-hidden="true">→</i></a></div>' +
        '<div class="fila__compra" data-compra>' + compra(p) + '</div></article>';
    }
    function filtrada() {
      var a = D.productos.filter(function (p) {
        return (cat === 'todo' || (cat === 'ofertas' ? D.enOferta(p) : p.cat === cat)) &&
          (!q || (p.nombre + ' ' + p.codigo + ' ' + D.categoriaNombre(p.cat) + ' ' + p.tipoTxt + ' ' + p.desc).toLowerCase().indexOf(q) >= 0);
      });
      if (orden === 'menor') a.sort(function (x, y) { return D.desde(x).precio - D.desde(y).precio; });
      else if (orden === 'mayor') a.sort(function (x, y) { return D.desde(y).precio - D.desde(x).precio; });
      return a;
    }
    function pintarCats() {
      var cuenta = function (c) { return D.productos.filter(function (p) { return c === 'todo' || (c === 'ofertas' ? D.enOferta(p) : p.cat === c); }).length; };
      catsEl.innerHTML = '<h3>Categorías</h3>' + M.categorias.map(function (c) { return '<button class="cats__b' + (c.id === cat ? ' on' : '') + '" type="button" data-cat="' + c.id + '" aria-pressed="' + (c.id === cat) + '">' + c.nombre + '<span>' + cuenta(c.id) + '</span></button>'; }).join('');
    }
    function pintar() {
      var a = filtrada();
      L.innerHTML = a.length ? a.map(fila).join('') : '<div class="vacio"><p><b>No encontramos productos con eso.</b></p><p>Prueba con otra palabra o mira todo el catálogo.</p><button class="btn btn--linea" type="button" data-cat="todo">Ver todo</button></div>';
      $('#conteo').textContent = a.length + (a.length === 1 ? ' producto' : ' productos') + (cat !== 'todo' ? ' en ' + (M.categorias.filter(function (c) { return c.id === cat; })[0] || { nombre: '' }).nombre : '');
      pintarCats();
    }
    function actualizarCompras() { [].forEach.call(L.querySelectorAll('.fila'), function (f) { var p = D.producto(f.getAttribute('data-id')), c = f.querySelector('[data-compra]'); if (p && c) c.innerHTML = compra(p); }); }
    function enfocar(id, acc) { var b = L.querySelector('.fila[data-id="' + id + '"] [data-acc="' + acc + '"]'); if (b) b.focus(); }

    L.addEventListener('click', function (e) {
      var f = e.target.closest('.fila'); if (!f) { var c0 = e.target.closest('[data-cat]'); if (c0) irCat(c0.getAttribute('data-cat')); return; }
      var id = f.getAttribute('data-id'), p = D.producto(id), t;
      if ((t = e.target.closest('[data-acc]'))) {
        var a = t.getAttribute('data-acc'), k = carrito.llave({ id: id, color: '', talla: elegida(p) });
        if (a === 'agregar') { carrito.agregar(id, { talla: elegida(p) }, 1); enfocar(id, 'mas'); }
        else if (a === 'mas') { carrito.cambiar(k, 1); enfocar(id, 'mas'); }
        else { carrito.cambiar(k, -1); enfocar(id, lineaDe(p) ? 'menos' : 'agregar'); }
        return;
      }
      if ((t = e.target.closest('[data-op]'))) { sel[id] = t.getAttribute('data-op'); f.outerHTML = fila(p); var nf = L.querySelector('.fila[data-id="' + id + '"] [data-op="' + sel[id] + '"]'); if (nf) nf.focus(); }
    });
    function irCat(c) { cat = c; history.replaceState(null, '', cat === 'todo' ? 'index.html' : 'index.html?cat=' + cat); pintar(); }
    catsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-cat]'); if (b) irCat(b.getAttribute('data-cat')); });
    $('#q').addEventListener('input', function (e) { q = e.target.value.trim().toLowerCase(); pintar(); });
    $('#orden').addEventListener('change', function (e) { orden = e.target.value; pintar(); });
    carrito.alCambiar(actualizarCompras);
    pintar();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lista = !!$('#lista'), modo = lista ? 'lista' : ($('#prod-raiz') ? 'producto' : 'pago');
    cabecera(modo); pie();
    if ($('#pedido')) { montarPedido(); carrito.alCambiar(pintarPedido); pintarPedido(); }
    if (lista) inicio();
  });
})(window);
