/*
 * Muestra 2 · Rosaleda — página de pago SIMULADA (pago.html).
 * Reproduce el recorrido real: datos de entrega → medio de pago (tarjeta, Yape o Plin) → confirmación.
 * Nada se cobra ni se envía: en el catálogo real, este paso lo hace la pasarela de pago del cliente (Niubiz u otra)
 * y al vendedor le llega el pedido por correo. Aquí solo se muestra cómo se vería.
 */
(function (w) {
  'use strict';
  var D = w.DATOS, $ = function (s) { return document.querySelector(s); }, medio = 'tarjeta', ENVIO = 12, GRATIS_DESDE = 250;
  document.addEventListener('DOMContentLoaded', function () {
    var raiz = $('#pago-raiz'), carrito = Tienda.carrito;
    function envio(total) { return total >= GRATIS_DESDE ? 0 : ENVIO; }
    function resumen() {
      var ls = carrito.lineas(); if (!ls.length) return '<p style="color:var(--suave)">Tu carrito está vacío.</p>';
      return ls.map(function (l) {
        var p = D.producto(l.id), det = [Tienda.detalle(l), 'x' + l.cant].filter(Boolean).join(' · ');
        return '<div class="linea"><div class="linea__foto">' + Tienda.arteLinea(l) + '</div><div><div class="linea__nombre">' + U.esc(p.nombre) + '</div><div class="linea__var">' + U.esc(det) + '</div></div><div class="linea__precio">' + U.dinero(D.precioLinea(l) * l.cant) + '</div></div>';
      }).join('');
    }
    function campos() {
      if (medio === 'tarjeta') return '<div class="campos"><div class="campo ancho"><label for="tn">Número de tarjeta</label><input id="tn" inputmode="numeric" placeholder="4111 1111 1111 1111" autocomplete="off"></div><div class="campo"><label for="tv">Vencimiento</label><input id="tv" placeholder="MM/AA" autocomplete="off"></div><div class="campo"><label for="tc">Código (CVV)</label><input id="tc" inputmode="numeric" placeholder="123" autocomplete="off"></div></div>';
      if (medio === 'yape') return '<div class="campos"><div class="campo"><label for="yc">Celular de tu Yape</label><input id="yc" inputmode="numeric" placeholder="9XX XXX XXX"></div><div class="campo"><label for="yk">Código de aprobación</label><input id="yk" inputmode="numeric" placeholder="6 dígitos de tu app"></div></div><p class="nota" style="margin-top:10px">Abre tu app de Yape, copia el código de aprobación y pégalo aquí.</p>';
      return '<p class="nota">Al pagar con Plin te mostraremos la ventana de tu banco para aprobar el pago desde tu app.</p>';
    }
    function pintar() {
      var total = Tienda.total(), env = envio(total);
      if (!carrito.cantidad()) { raiz.innerHTML = '<div class="gracias"><h2>Tu carrito está vacío</h2><p style="margin:10px 0 22px;color:var(--suave)">Agrega algo del catálogo para continuar.</p><a class="btn btn--marca" href="index.html#catalogo">Ir al catálogo</a></div>'; return; }
      raiz.innerHTML = '<div class="pago"><div><h1>Finalizar compra</h1><p class="nota">Compra segura: pagas aquí mismo, sin salir del catálogo.</p>' +
        '<div class="bloque"><h2>1 · Datos de entrega</h2><div class="campos"><div class="campo"><label for="nm">Nombre completo</label><input id="nm" autocomplete="name"></div><div class="campo"><label for="ce">Celular</label><input id="ce" inputmode="numeric" autocomplete="tel"></div><div class="campo ancho"><label for="co">Correo</label><input id="co" type="email" autocomplete="email"></div><div class="campo"><label for="di">Distrito</label><input id="di"></div><div class="campo"><label for="ci">Ciudad</label><input id="ci" value="Lima"></div><div class="campo ancho"><label for="dr">Dirección y referencia</label><input id="dr" autocomplete="street-address"></div></div></div>' +
        '<div class="bloque"><h2>2 · Medio de pago</h2><div class="medios-pago" role="radiogroup" aria-label="Medio de pago">' +
        [['tarjeta', 'Tarjeta', 'Visa, Mastercard…'], ['yape', 'Yape', 'Con tu celular'], ['plin', 'Plin', 'Desde tu banco']].map(function (m) { return '<button class="medio' + (medio === m[0] ? ' on' : '') + '" type="button" role="radio" aria-checked="' + (medio === m[0]) + '" data-m="' + m[0] + '">' + m[1] + '<small>' + m[2] + '</small></button>'; }).join('') +
        '</div><div style="margin-top:16px" id="campos-pago">' + campos() + '</div></div>' +
        '<p class="simulado">Pago simulado para la demostración: no se cobra nada. En el catálogo real este paso lo procesa la pasarela de pago y el vendedor recibe el pedido por correo.</p>' +
        '<p class="aviso-opc" id="err" role="alert"></p></div>' +
        '<aside class="bloque resumen" style="margin-top:0"><h2>Tu pedido</h2>' + resumen() +
        '<div class="fila-total"><span>Subtotal</span><span>' + U.dinero(total) + '</span></div><div class="fila-total"><span>Envío</span><span>' + (env ? U.dinero(env) : 'Gratis') + '</span></div>' +
        '<div class="fila-total grande"><span>Total</span><span>' + U.dinero(total + env) + '</span></div><button class="btn btn--marca btn--bloque" type="button" id="pagar" style="margin-top:14px">Pagar ' + U.dinero(total + env) + '</button><a class="nota" style="display:block;text-align:center;margin-top:12px;text-decoration:underline" href="index.html#catalogo">Seguir comprando</a></aside></div>';
    }
    raiz.addEventListener('click', function (e) {
      var m = e.target.closest('[data-m]'); if (m) { medio = m.getAttribute('data-m'); [].forEach.call(document.querySelectorAll('.medio'), function (b) { var on = b.getAttribute('data-m') === medio; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); }); $('#campos-pago').innerHTML = campos(); return; }
      if (e.target.closest('#pagar')) {
        var ok = ['nm', 'ce', 'co', 'dr'].every(function (id) { var v = $('#' + id).value.trim(); $('#' + id).style.borderColor = v ? '' : 'var(--marca)'; return v; });
        if (!ok) { $('#err').textContent = 'Completa tus datos de entrega para continuar.'; return; }
        var n = 'RO-' + String(Math.floor(1000 + Math.random() * 8999)), nombre = $('#nm').value.trim().split(' ')[0], total = Tienda.total();
        carrito.vaciar();
        raiz.innerHTML = '<div class="gracias"><div class="ok">✓</div><h2>¡Gracias por tu compra, ' + U.esc(nombre) + '!</h2><p style="margin:10px 0;color:var(--suave)">Tu pedido <b>' + n + '</b> fue recibido. Te escribiremos al correo y al celular que indicaste.</p><div class="simulado" style="max-width:520px;margin:18px auto;text-align:left">Esto fue una simulación. En el catálogo real: el pago se procesa con la pasarela del cliente y al vendedor le llega un correo con este pedido (productos, datos de entrega y monto de ' + U.dinero(total) + ') para que lo prepare y lo envíe.</div><a class="btn btn--marca" href="index.html">Volver al catálogo</a></div>';
      }
    });
    pintar();
  });
})(window);
