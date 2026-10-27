/*
 * Muestra 1 · Azahar — pieza común a todas las páginas: aviso, cabecera, carrito lateral y pie.
 * En la página de inicio también arma la portada, los filtros y la cuadrícula de productos.
 */
(function (w) {
  'use strict';
  var D = w.DATOS, M = D.marca, carrito = Carrito('azahar'), $ = function (s, r) { return (r || document).querySelector(s); };
  var ICON = {
    lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    corazon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4.2 4.2 0 0 1 7-3 4.2 4.2 0 0 1 7 3c0 5.6-7 10-7 10z"/></svg>'
  };

  // logo: imagen PNG con fondo transparente (img/logo/); en el pie oscuro se usa la versión clara
  w.Tienda = {};
  function logo(claro) { return '<a class="logo" href="index.html" aria-label="' + M.nombre + ', inicio"><img class="logo__img" src="img/logo/' + (claro ? 'logo-azahar-claro.png' : 'logo-azahar-recortado.png') + '" alt="' + M.nombre + ', cuero y calzado"></a>'; }

  function cabecera() {
    var cat = U.param('cat') || '';
    var nav = M.categorias.filter(function (c) { return c.id !== 'todo'; }).map(function (c) { return '<a href="index.html?cat=' + c.id + '#catalogo"' + (cat === c.id ? ' class="on"' : '') + '>' + c.nombre + '</a>'; }).join('');
    $('#cabecera').innerHTML = '<div class="aviso">' + M.aviso + '</div>' +
      '<header class="cab"><div class="contenedor cab__in">' + logo() + '<nav class="cab__nav" aria-label="Categorías"><a href="index.html#catalogo">Todo</a>' + nav + '</nav>' +
      '<form class="busca" role="search" onsubmit="return false"><label class="solo-lectores" for="q">Buscar</label>' + ICON.lupa + '<input id="q" type="search" placeholder="Buscar carteras, botas…" autocomplete="off"></form>' +
      '<button class="btn-carrito" type="button" id="abrir-carrito" aria-label="Abrir carrito">' + ICON.bolsa + '<span>Carrito</span><b id="n-carrito">0</b></button></div></header>';
  }
  function pie() {
    $('#pie').innerHTML = '<footer class="pie"><div class="contenedor"><div class="pie__cols">' +
      '<div>' + logo(true) + '<p style="margin-top:14px;max-width:290px">Carteras y calzado de cuero, hechos para acompañarte todos los días.</p></div>' +
      '<div><h4>Tienda</h4><ul><li><a href="index.html?cat=carteras#catalogo">Carteras</a></li><li><a href="index.html?cat=calzado#catalogo">Calzado</a></li><li><a href="index.html?cat=ofertas#catalogo">Ofertas</a></li></ul></div>' +
      '<div><h4>Información</h4><ul><li>Envío a todo el Perú en 2 a 5 días</li><li>Cambios y devoluciones hasta 7 días</li><li>Medidas y cuidados en cada producto</li></ul></div>' +
      '<div><h4>Paga como prefieras</h4><div class="medios"><span>Tarjeta</span><span>Yape</span><span>Plin</span></div><p style="margin-top:14px">Compra segura: tus datos de pago no pasan por nuestro catálogo.</p></div>' +
      '</div><div class="pie__fin"><span>© 2026 ' + M.nombre + ' · Catálogo de ejemplo hecho por Moravi Studio. Marca y productos inventados.</span><span>Muestra 1 · Cuadrícula clásica</span></div></div></footer>';
  }

  // carrito lateral
  function montarCajon() {
    var v = document.createElement('div'); v.className = 'velo'; v.id = 'velo';
    var c = document.createElement('aside'); c.className = 'cajon'; c.id = 'cajon'; c.setAttribute('aria-label', 'Carrito de compras'); c.setAttribute('aria-hidden', 'true');
    c.innerHTML = '<div class="cajon__cab"><h3>Tu carrito</h3><button class="cajon__x" type="button" id="cerrar-carrito" aria-label="Cerrar carrito">×</button></div><div class="cajon__lista" id="lista-carrito"></div><div class="cajon__pie" id="pie-carrito"></div>';
    document.body.appendChild(v); document.body.appendChild(c);
    $('#abrir-carrito').addEventListener('click', abrirCarrito);
    $('#cerrar-carrito').addEventListener('click', cerrarCarrito); v.addEventListener('click', cerrarCarrito);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarCarrito(); });
    $('#lista-carrito').addEventListener('click', function (e) {
      var b = e.target.closest('[data-acc]'); if (!b) return; var k = b.getAttribute('data-k');
      if (b.getAttribute('data-acc') === 'mas') carrito.cambiar(k, 1); else if (b.getAttribute('data-acc') === 'menos') carrito.cambiar(k, -1); else carrito.quitar(k);
    });
  }
  function abrirCarrito() { $('#velo').classList.add('on'); var c = $('#cajon'); c.classList.add('on'); c.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; $('#cerrar-carrito').focus(); }
  function cerrarCarrito() { $('#velo').classList.remove('on'); var c = $('#cajon'); c.classList.remove('on'); c.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  w.Tienda.abrirCarrito = abrirCarrito;
  w.Tienda.agregar = function (id, op, cant) { carrito.agregar(id, op, cant); };
  w.Tienda.carrito = carrito;

  function arteLinea(l) { var p = D.producto(l.id), k = D.colores[l.color] ? l.color : p.colores[0]; return Arte.imagen(p, k, D.colores[k].hex, 0, p.nombre); }
  w.Tienda.arteLinea = arteLinea;
  function pintarCarrito() {
    var ls = carrito.lineas(); $('#n-carrito').textContent = carrito.cantidad();
    var lista = $('#lista-carrito'), pieC = $('#pie-carrito');
    if (!ls.length) { lista.innerHTML = '<div class="cajon__vacio">' + ICON.bolsa + '<p>Tu carrito está vacío.</p><p style="font-size:13px;margin-top:6px">Agrega algo que te guste y aparecerá aquí.</p></div>'; pieC.innerHTML = '<button class="btn btn--linea btn--bloque" type="button" id="seguir">Seguir mirando</button>'; $('#seguir').addEventListener('click', cerrarCarrito); return; }
    lista.innerHTML = ls.map(function (l) {
      var p = D.producto(l.id), k = carrito.llave(l), col = (D.colores[l.color] || {}).nombre || '', det = [col, l.talla && l.talla !== 'Única' ? 'Talla ' + l.talla : ''].filter(Boolean).join(' · ');
      return '<div class="linea"><div class="linea__foto">' + arteLinea(l) + '</div><div><div class="linea__nombre">' + U.esc(p.nombre) + '</div><div class="linea__var">' + U.esc(det) + '</div>' +
        '<div class="cant"><button type="button" data-acc="menos" data-k="' + U.esc(k) + '" aria-label="Quitar uno">−</button><span>' + l.cant + '</span><button type="button" data-acc="mas" data-k="' + U.esc(k) + '" aria-label="Agregar uno">+</button></div></div>' +
        '<div><div class="linea__precio">' + U.dinero(p.precio * l.cant) + '</div><button class="linea__quitar" type="button" data-acc="quitar" data-k="' + U.esc(k) + '">Quitar</button></div></div>';
    }).join('');
    pieC.innerHTML = '<div class="sub"><span>Subtotal</span><span>' + U.dinero(carrito.total(D.precio)) + '</span></div><p class="nota">El envío se calcula al pagar.</p><a class="btn btn--marca btn--bloque" href="pago.html">Ir a pagar</a>';
  }

  // favoritos: se guardan en el navegador de la persona (sin cuenta)
  var FAV = 'azahar-favoritos', favs = [];
  try { favs = JSON.parse(localStorage.getItem(FAV) || '[]'); } catch (e) { favs = []; }
  function guardarFavs() { try { localStorage.setItem(FAV, JSON.stringify(favs)); } catch (e) { /* sin almacenamiento: duran lo que dure la página */ } }

  // tarjetas de producto
  function tarjeta(p) {
    var c0 = D.colores[p.colores[0]].hex, calz = !!p.tallas;
    var puntos = p.colores.map(function (k) { return '<span class="punto" title="' + D.colores[k].nombre + '" style="background:' + D.colores[k].hex + '"></span>'; }).join('');
    return '<article class="tarjeta"><a class="tarjeta__foto" href="producto.html?id=' + p.id + '" aria-label="Ver ' + U.esc(p.nombre) + '" style="background:' + Arte.fondo(c0, 0) + '">' + Arte.imagen(p, p.colores[0], c0, 0, p.nombre) +
      (p.etiqueta ? '<span class="etiqueta">' + p.etiqueta + '</span>' : '') + '<button class="corazon' + (favs.indexOf(p.id) >= 0 ? ' on' : '') + '" type="button" aria-pressed="' + (favs.indexOf(p.id) >= 0) + '" aria-label="Guardar ' + U.esc(p.nombre) + ' en favoritos" data-fav="' + p.id + '">' + ICON.corazon + '</button></a>' +
      '<div class="tarjeta__info"><p class="tarjeta__cat">' + (p.cat === 'carteras' ? 'Carteras' : 'Calzado') + '</p><h3 class="tarjeta__nombre"><a href="producto.html?id=' + p.id + '">' + U.esc(p.nombre) + '</a></h3>' +
      '<p class="precio"><b>' + U.dinero(p.precio) + '</b>' + (p.antes ? '<s>' + U.dinero(p.antes) + '</s>' : '') + '</p><div class="puntos">' + puntos + '</div></div>' +
      (calz ? '<a class="btn btn--linea tarjeta__btn" href="producto.html?id=' + p.id + '">Elegir talla</a>' : '<button class="btn btn--marca tarjeta__btn" type="button" data-add="' + p.id + '">Agregar al carrito</button>') + '</article>';
  }
  w.Tienda.tarjeta = tarjeta;
  w.Tienda.enlazarTarjetas = function (raiz) {
    raiz.addEventListener('click', function (e) {
      var a = e.target.closest('[data-add]'); if (a) { var p = D.producto(a.getAttribute('data-add')); carrito.agregar(p.id, { color: p.colores[0], talla: 'Única' }, 1); abrirCarrito(); return; }
      var f = e.target.closest('[data-fav]'); if (f) { e.preventDefault(); var id = f.getAttribute('data-fav'), i = favs.indexOf(id); if (i >= 0) favs.splice(i, 1); else favs.push(id); guardarFavs(); [].forEach.call(document.querySelectorAll('[data-fav="' + id + '"]'), function (b) { var on = favs.indexOf(id) >= 0; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); }
    });
  };

  // portada y filtros (solo inicio)
  function inicio() {
    var g = $('#grilla'); if (!g) return;
    var cat = U.param('cat') || 'todo', q = '';
    var chips = $('#chips'); chips.innerHTML = M.categorias.map(function (c) { return '<button class="chip' + (c.id === cat ? ' on' : '') + '" type="button" data-cat="' + c.id + '">' + c.nombre + '</button>'; }).join('');
    function lista() { return D.productos.filter(function (p) { return (cat === 'todo' || (cat === 'ofertas' ? !!p.antes : p.cat === cat)) && (!q || (p.nombre + ' ' + p.cat + ' ' + p.tipo).toLowerCase().indexOf(q) >= 0); }); }
    function pintar() {
      var ls = lista(); g.innerHTML = ls.length ? ls.map(tarjeta).join('') : '<div class="vacio"><p>No encontramos productos con eso.</p><p style="font-size:13px;margin-top:6px">Prueba con otra palabra o mira todo el catálogo.</p></div>';
      $('#conteo').textContent = ls.length + (ls.length === 1 ? ' producto' : ' productos');
      [].forEach.call(chips.children, function (b) { b.classList.toggle('on', b.getAttribute('data-cat') === cat); });
    }
    chips.addEventListener('click', function (e) { var b = e.target.closest('[data-cat]'); if (!b) return; cat = b.getAttribute('data-cat'); history.replaceState(null, '', cat === 'todo' ? 'index.html' : 'index.html?cat=' + cat); pintar(); });
    $('#q').addEventListener('input', function (e) { q = e.target.value.trim().toLowerCase(); pintar(); });
    w.Tienda.enlazarTarjetas(g); pintar();
  }

  document.addEventListener('DOMContentLoaded', function () {
    cabecera(); pie(); montarCajon(); carrito.alCambiar(pintarCarrito); pintarCarrito(); inicio();
    if (!$('#q').closest('body').querySelector('#grilla')) { $('#q').addEventListener('keydown', function (e) { if (e.key === 'Enter') location.href = 'index.html#catalogo'; }); }
  });
})(window);
