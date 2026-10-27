/*
 * Muestra 2 · Rosaleda — pieza común a todas las páginas: aviso, cabecera, carrito lateral y pie.
 * En la página de inicio también arma la portada, las pestañas, la cuadrícula y la VENTANA CENTRAL de producto
 * (el producto se ve en una ventana sobre el catálogo, sin salir de la página).
 */
(function (w) {
  'use strict';
  var D = w.DATOS, M = D.marca, carrito = Carrito('rosaleda'), $ = function (s, r) { return (r || document).querySelector(s); };
  var FAV = 'rosaleda-favoritos', favs = [];
  try { favs = JSON.parse(localStorage.getItem(FAV) || '[]'); } catch (e) { favs = []; }
  function guardarFavs() { try { localStorage.setItem(FAV, JSON.stringify(favs)); } catch (e) { /* sin almacenamiento: los favoritos duran lo que dure la página */ } }

  var ICON = {
    lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    corazon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4.2 4.2 0 0 1 7-3 4.2 4.2 0 0 1 7 3c0 5.6-7 10-7 10z"/></svg>'
  };

  // logo: rosa de seis pétalos + nombre
  function emblema() {
    var a = '', b = '', i;
    for (i = 0; i < 6; i++) a += '<ellipse cx="24" cy="12" rx="7" ry="11" fill="#C2407A" opacity="' + (i % 2 ? '.7' : '.95') + '" transform="rotate(' + (i * 60) + ' 24 24)"/>';
    for (i = 0; i < 6; i++) b += '<ellipse cx="24" cy="17" rx="4.6" ry="7" fill="#E7A8BC" transform="rotate(' + (30 + i * 60) + ' 24 24)"/>';
    return '<svg viewBox="0 0 48 48" aria-hidden="true">' + a + b + '<circle cx="24" cy="24" r="4" fill="#C7A25B"/></svg>';
  }
  function logo() { return '<a class="logo" href="index.html" aria-label="' + M.nombre + ', inicio">' + emblema() + '<span class="logo__txt"><span class="logo__nombre">' + M.nombre + '</span><span class="logo__sub">' + M.apellido + '</span></span></a>'; }

  w.Tienda = { emblema: emblema };

  function cabecera(conBusca) {
    var cat = U.param('cat') || '';
    var nav = M.categorias.filter(function (c) { return c.id !== 'todo'; }).map(function (c) { return '<a href="index.html?cat=' + c.id + '#catalogo"' + (cat === c.id ? ' class="on"' : '') + '>' + c.nombre + '</a>'; }).join('');
    $('#cabecera').innerHTML = '<div class="aviso">' + M.aviso + '</div>' +
      '<header class="cab"><div class="contenedor cab__in"><nav class="cab__nav" aria-label="Categorías">' + nav + '</nav>' + logo() +
      '<div class="cab__der">' + (conBusca ? '<button class="btn-icono" type="button" id="abrir-busca" aria-label="Buscar" aria-expanded="false">' + ICON.lupa + '</button>' : '') +
      '<button class="btn-icono btn-carrito" type="button" id="abrir-carrito" aria-label="Abrir carrito">' + ICON.bolsa + '<b id="n-carrito">0</b></button></div></div>' +
      (conBusca ? '<div class="busca-panel" id="busca-panel" hidden><div class="contenedor"><label class="solo-lectores" for="q">Buscar</label><input id="q" type="search" placeholder="Buscar perfumes, cremas, regalos…" autocomplete="off"></div></div>' : '') + '</header>';
  }
  function pie() {
    $('#pie').innerHTML = '<footer class="pie"><div class="contenedor"><div class="pie__cols">' +
      '<div>' + logo() + '<p style="margin-top:14px;max-width:290px">Perfumes y cuidado personal para acompañarte todos los días.</p></div>' +
      '<div><h4>Tienda</h4><ul><li><a href="index.html?cat=perfumes#catalogo">Perfumes</a></li><li><a href="index.html?cat=cuerpo#catalogo">Cuerpo</a></li><li><a href="index.html?cat=rostro#catalogo">Rostro</a></li><li><a href="index.html?cat=regalos#catalogo">Regalos</a></li></ul></div>' +
      '<div><h4>Ayuda</h4><ul><li>Envíos y entregas</li><li>Cambios y devoluciones</li><li>Cuidado de tus fragancias</li></ul></div>' +
      '<div><h4>Paga como prefieras</h4><div class="medios"><span>Tarjeta</span><span>Yape</span><span>Plin</span></div><p style="margin-top:14px">Compra segura: tus datos de pago no pasan por nuestro catálogo.</p></div>' +
      '</div><div class="pie__fin"><span>© 2026 ' + M.nombre + ' · Catálogo de ejemplo hecho por Moravi Studio. Marca y productos inventados.</span><span>Muestra 2 · Cuadrícula con ventana de producto</span></div></div></footer>';
  }

  // carrito lateral
  function montarCajon() {
    var v = document.createElement('div'); v.className = 'velo'; v.id = 'velo';
    var c = document.createElement('aside'); c.className = 'cajon'; c.id = 'cajon'; c.setAttribute('aria-label', 'Carrito de compras'); c.setAttribute('aria-hidden', 'true');
    c.innerHTML = '<div class="cajon__cab"><h3>Tu carrito</h3><button class="cajon__x" type="button" id="cerrar-carrito" aria-label="Cerrar carrito">×</button></div><div class="cajon__lista" id="lista-carrito"></div><div class="cajon__pie" id="pie-carrito"></div>';
    document.body.appendChild(v); document.body.appendChild(c);
    $('#abrir-carrito').addEventListener('click', abrirCarrito);
    $('#cerrar-carrito').addEventListener('click', cerrarCarrito); v.addEventListener('click', cerrarCarrito);
    $('#lista-carrito').addEventListener('click', function (e) {
      var b = e.target.closest('[data-acc]'); if (!b) return; var k = b.getAttribute('data-k');
      if (b.getAttribute('data-acc') === 'mas') carrito.cambiar(k, 1); else if (b.getAttribute('data-acc') === 'menos') carrito.cambiar(k, -1); else carrito.quitar(k);
    });
  }
  function abrirCarrito() { $('#velo').classList.add('on'); var c = $('#cajon'); c.classList.add('on'); c.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; $('#cerrar-carrito').focus(); }
  function cerrarCarrito() { $('#velo').classList.remove('on'); var c = $('#cajon'); c.classList.remove('on'); c.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  w.Tienda.abrirCarrito = abrirCarrito;
  w.Tienda.carrito = carrito;
  w.Tienda.total = function () { return carrito.lineas().reduce(function (s, l) { return s + l.cant * D.precioLinea(l); }, 0); };
  w.Tienda.arteLinea = function (l) { return Arte.producto(D.producto(l.id)); };
  w.Tienda.detalle = function (l) { return l.talla && l.talla !== 'Set' ? l.talla : ''; };

  function pintarCarrito() {
    var ls = carrito.lineas(); $('#n-carrito').textContent = carrito.cantidad();
    var lista = $('#lista-carrito'), pieC = $('#pie-carrito');
    if (!ls.length) { lista.innerHTML = '<div class="cajon__vacio">' + ICON.bolsa + '<p>Tu carrito está vacío.</p><p style="font-size:13px;margin-top:6px">Agrega algo que te guste y aparecerá aquí.</p></div>'; pieC.innerHTML = '<button class="btn btn--linea btn--bloque" type="button" id="seguir">Seguir mirando</button>'; $('#seguir').addEventListener('click', cerrarCarrito); return; }
    lista.innerHTML = ls.map(function (l) {
      var p = D.producto(l.id), k = carrito.llave(l);
      return '<div class="linea"><div class="linea__foto">' + w.Tienda.arteLinea(l) + '</div><div><div class="linea__nombre">' + U.esc(p.nombre) + '</div><div class="linea__var">' + U.esc(w.Tienda.detalle(l)) + '</div>' +
        '<div class="cant"><button type="button" data-acc="menos" data-k="' + U.esc(k) + '" aria-label="Quitar uno">−</button><span>' + l.cant + '</span><button type="button" data-acc="mas" data-k="' + U.esc(k) + '" aria-label="Agregar uno">+</button></div></div>' +
        '<div><div class="linea__precio">' + U.dinero(D.precioLinea(l) * l.cant) + '</div><button class="linea__quitar" type="button" data-acc="quitar" data-k="' + U.esc(k) + '">Quitar</button></div></div>';
    }).join('');
    pieC.innerHTML = '<div class="sub"><span>Subtotal</span><span>' + U.dinero(w.Tienda.total()) + '</span></div><p class="nota">El envío se calcula al pagar.</p><a class="btn btn--marca btn--bloque" href="pago.html">Ir a pagar</a>';
  }

  // tarjetas de producto
  function precioHtml(p) {
    var t = D.desde(p);
    return '<p class="precio">' + (p.tam.length > 1 ? '<span class="precio__desde">Desde</span>' : '') + '<b>' + U.dinero(t.precio) + '</b>' + (t.antes ? '<s>' + U.dinero(t.antes) + '</s>' : '') + '</p>';
  }
  function tarjeta(p) {
    return '<article class="tarj"><div class="tarj__marco"><button class="tarj__foto" type="button" data-ver="' + p.id + '" aria-label="Ver ' + U.esc(p.nombre) + '">' + Arte.producto(p) + '<span class="tarj__rapida">Vista rápida</span></button>' +
      (p.etiqueta ? '<span class="etiqueta">' + p.etiqueta + '</span>' : '') +
      '<button class="corazon' + (favs.indexOf(p.id) >= 0 ? ' on' : '') + '" type="button" aria-pressed="' + (favs.indexOf(p.id) >= 0) + '" aria-label="Guardar ' + U.esc(p.nombre) + ' en favoritos" data-fav="' + p.id + '">' + ICON.corazon + '</button></div>' +
      '<div class="tarj__info"><p class="tarj__tipo">' + p.tipoTxt + '</p><h3 class="tarj__nombre"><button type="button" data-ver="' + p.id + '">' + U.esc(p.nombre) + '</button></h3>' + precioHtml(p) +
      '<button class="tarj__ver" type="button" data-ver="' + p.id + '">Ver y agregar</button></div></article>';
  }

  // ventana central de producto
  var modal = null, estado = null, previo = null;
  function montarModal() {
    modal = document.createElement('div'); modal.className = 'modal'; modal.id = 'modal'; modal.setAttribute('aria-hidden', 'true');
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('[data-cerrar]')) { cerrarModal(); return; }
      var t;
      if ((t = e.target.closest('[data-t]'))) { estado.tam = t.getAttribute('data-t'); pintarModal(); return; }
      if ((t = e.target.closest('[data-q]'))) { estado.cant = Math.max(1, Math.min(10, estado.cant + (+t.getAttribute('data-q')))); pintarModal(); return; }
      if (e.target.closest('#m-agregar')) { carrito.agregar(estado.p.id, { talla: estado.tam }, estado.cant); cerrarModal(); abrirCarrito(); return; }
      if ((t = e.target.closest('[data-fav-m]'))) { alternarFav(estado.p.id); pintarModal(); return; }
    });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('on')) return;
      if (e.key === 'Escape') { cerrarModal(); return; }
      if (e.key !== 'Tab') return;
      var f = [].filter.call(modal.querySelectorAll('button,a[href],input'), function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }
  function pintarModal() {
    var p = estado.p, t = D.tam(p, estado.tam), fav = favs.indexOf(p.id) >= 0;
    var tams = p.tam.length > 1 ? '<div class="opc"><div class="opc__tit">Tamaño <span>· ' + t.n + '</span></div><div class="tams">' + p.tam.map(function (x) { return '<button class="tam' + (x.n === t.n ? ' on' : '') + '" type="button" data-t="' + U.esc(x.n) + '">' + x.n + '<small>' + U.dinero(x.precio) + '</small></button>'; }).join('') + '</div></div>' : '';
    var notas = p.notas ? '<div class="opc"><div class="opc__tit">Notas</div><div class="notas">' + p.notas.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div></div>' : '';
    modal.innerHTML = '<div class="modal__caja" role="dialog" aria-modal="true" aria-labelledby="m-nombre">' +
      '<button class="modal__x" type="button" data-cerrar aria-label="Cerrar">×</button>' +
      '<div class="modal__foto">' + Arte.producto(p) + (p.etiqueta ? '<span class="etiqueta">' + p.etiqueta + '</span>' : '') + '' + (p.foto ? '' : '<span class="galeria__nota">Fotos provisionales</span>') + '</div>' +
      '<div class="modal__info"><p class="tarj__tipo">' + p.tipoTxt + ' · ' + D.categoriaNombre(p.cat) + '</p><h2 id="m-nombre">' + U.esc(p.nombre) + '</h2>' +
      '<div class="estrellas"><i>★★★★★</i><span>4,9 · 41 opiniones</span></div>' +
      '<p class="precio"><b>' + U.dinero(t.precio) + '</b>' + (t.antes ? '<s>' + U.dinero(t.antes) + '</s>' : '') + '</p>' +
      '<p class="modal__desc">' + U.esc(p.desc) + '</p>' + notas + tams +
      '<div class="modal__acc"><div class="cant"><button type="button" data-q="-1" aria-label="Menos">−</button><span>' + estado.cant + '</span><button type="button" data-q="1" aria-label="Más">+</button></div>' +
      '<button class="btn btn--marca" type="button" id="m-agregar">Agregar · ' + U.dinero(t.precio * estado.cant) + '</button>' +
      '<button class="btn-icono btn-icono--lin' + (fav ? ' on' : '') + '" type="button" data-fav-m aria-pressed="' + fav + '" aria-label="Guardar en favoritos">' + ICON.corazon + '</button></div>' +
      '<ul class="beneficios"><li>Envío a todo el Perú en 2 a 5 días</li><li>Muestra de regalo en tu primer pedido</li><li>Paga con tarjeta, Yape o Plin</li></ul></div></div>';
    var x = modal.querySelector('.modal__x'); if (x && !modal.contains(document.activeElement)) x.focus();
  }
  function abrirModal(id) {
    var p = D.producto(id); if (!p) return;
    previo = document.activeElement; estado = { p: p, tam: p.tam[0].n, cant: 1 };
    modal.classList.add('on'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; pintarModal();
  }
  function cerrarModal() {
    modal.classList.remove('on'); modal.setAttribute('aria-hidden', 'true'); if (!$('#cajon').classList.contains('on')) document.body.style.overflow = '';
    if (previo && previo.focus) previo.focus();
  }
  function alternarFav(id) {
    var i = favs.indexOf(id); if (i >= 0) favs.splice(i, 1); else favs.push(id); guardarFavs();
    [].forEach.call(document.querySelectorAll('[data-fav="' + id + '"]'), function (b) { var on = favs.indexOf(id) >= 0; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  }

  // portada, pestañas y cuadrícula (solo inicio)
  function inicio() {
    var g = $('#grilla'); if (!g) return;
    var cat = U.param('cat') || 'todo', q = '';
    var tabs = $('#tabs'); tabs.innerHTML = M.categorias.map(function (c) { return '<button class="tab' + (c.id === cat ? ' on' : '') + '" type="button" data-cat="' + c.id + '">' + c.nombre + '</button>'; }).join('');
    function lista() { return D.productos.filter(function (p) { return (cat === 'todo' || (cat === 'ofertas' ? D.enOferta(p) : p.cat === cat)) && (!q || (p.nombre + ' ' + p.cat + ' ' + p.tipoTxt + ' ' + (p.notas || []).join(' ')).toLowerCase().indexOf(q) >= 0); }); }
    function pintar() {
      var ls = lista(); g.innerHTML = ls.length ? ls.map(tarjeta).join('') : '<div class="vacio"><p>No encontramos productos con eso.</p><p style="font-size:13px;margin-top:6px">Prueba con otra palabra o mira todo el catálogo.</p></div>';
      $('#conteo').textContent = ls.length + (ls.length === 1 ? ' producto' : ' productos');
      [].forEach.call(tabs.children, function (b) { b.classList.toggle('on', b.getAttribute('data-cat') === cat); });
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('[data-cat]'); if (!b) return; cat = b.getAttribute('data-cat'); history.replaceState(null, '', cat === 'todo' ? 'index.html' : 'index.html?cat=' + cat); pintar(); });
    $('#q').addEventListener('input', function (e) { q = e.target.value.trim().toLowerCase(); pintar(); });
    var bb = $('#abrir-busca'), panel = $('#busca-panel');
    bb.addEventListener('click', function () { var abre = panel.hidden; panel.hidden = !abre; bb.setAttribute('aria-expanded', abre); if (abre) $('#q').focus(); });
    document.addEventListener('click', function (e) {
      var v = e.target.closest('[data-ver]'); if (v) { abrirModal(v.getAttribute('data-ver')); return; }
      var f = e.target.closest('[data-fav]'); if (f) alternarFav(f.getAttribute('data-fav'));
    });
    pintar();
    if (U.param('ver') && D.producto(U.param('ver'))) abrirModal(U.param('ver')); // enlace directo a un producto: index.html?ver=r1
  }

  document.addEventListener('DOMContentLoaded', function () {
    var esInicio = !!$('#grilla');
    cabecera(esInicio); pie(); montarCajon(); carrito.alCambiar(pintarCarrito); pintarCarrito();
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('#cajon').classList.contains('on')) cerrarCarrito(); });
    if (esInicio) { montarModal(); inicio(); }
  });
})(window);
