/*
 * Arma una portada ancha (horizontal) completa dentro de un contenedor: con su menú, su título, su botón y la parte
 * interactiva que ya existe. Se usa en el catálogo (portadas/) y en la página de cada portada (portadas/ver.html).
 *   PortadasAnchas.mount(elemento, 'burger')   ·   PortadasAnchas.list  ·   PortadasAnchas.byKey
 */
(function (global) {
  'use strict';
  var LIST = [
    { key: 'burger', name: 'Brasa Burger', tag: 'Hamburguesería', kind: 'direct', cls: 'cv cv-burger', api: 'BrasaBurger',
      about: 'La hamburguesa se arma capa por capa y se abre sola, o cuando pasas el cursor. La palabra «fuego» se enciende con llamas, y salen brasas y humo.' },
    { key: 'gelato', name: 'Luna Gelato', tag: 'Heladería', kind: 'wide', cls: 'cv cv-gelato', api: 'LunaGelato', theme: 'gelato',
      brand: '<b>LUNA</b> GELATO', links: ['Sabores', 'Locales', 'Pedidos'], navBtn: 'Pedir', h: 'Arma tu helado,<br><em>bola por bola</em>', p: 'Toca cada bola para cambiar de sabor y mira cómo se transforma.', btn: 'Elegir sabor',
      about: 'El helado se arma sobre el cono. Cada bola cambia de sabor por separado al pasar el cursor o tocarla: nueve sabores reales, con goteos y vapor frío.' },
    { key: 'cafe', name: 'Origen Café', tag: 'Cafetería', kind: 'wide', cls: 'cv cv-cafe', api: 'OrigenCafe', theme: 'cafe',
      brand: '<b>ORIGEN</b> CAFÉ', links: ['Menú', 'Granos', 'Suscripción', 'Visítanos'], navBtn: 'Reservar', cart: true, cx: 0.74, usc: 0.84, h: 'Despierta<br><em>tus sentidos</em>', p: 'Café de origen, tostado cada mañana.<br>Haz clic y mira caer un grano.', btn: 'Pedir ahora',
      about: 'El vapor se aparta cuando pasas el cursor, los granos flotan con profundidad y cada clic sirve café: ondas en la taza, un grano que cae y gotitas.' },
    { key: 'pulse', name: 'Pulse Fit', tag: 'Gimnasio', kind: 'wide', cls: 'cv cv-pulse', api: 'PulseFit', theme: 'pulse',
      brand: '<b>PULSE</b> FIT', links: ['Clases', 'Planes', 'Entrenadores'], navBtn: 'Únete', h: 'Supera<br><em>tu límite</em>', p: 'Cada clic es una repetición.<br>Llega al trofeo y empieza de nuevo.', btn: 'Prueba una clase gratis',
      about: 'Un anillo de actividad: cada clic cambia el objeto (pesa rusa, balón, guante, trofeo) y llena el anillo como un reloj hasta la meta.' },
    { key: 'aurea', name: 'Aurea', tag: 'Joyería', kind: 'wide', cls: 'cv cv-aurea', api: 'Aurea', theme: 'aurea',
      brand: 'AUREA', links: ['Colección', 'Novias', 'Contacto'], navBtn: 'Reservar cita', h: 'Joyas con<br><em>luz propia</em>', p: 'Pasa el cursor: la luz hace brillar el oro y la piedra.<br>Un clic cambia la gema.', btn: 'Ver colección',
      about: 'El cursor es una linterna que hace brillar la joya con destellos. Cada clic lanza polvo dorado y cambia la piedra: diamante, zafiro y esmeralda.' },
    { key: 'kicks', name: 'Kicks', tag: 'Zapatillas', kind: 'direct', cls: 'cv cv-kicks', api: 'Kicks',
      about: 'Una zapatilla sobre un fondo de color con una palabra gigante detrás. El cursor la inclina; cada clic lanza una onda de color y trae otra zapatilla.' },
    { key: 'flora', name: 'Flora', tag: 'Florería', kind: 'direct', cls: 'cv cv-ramo', api: 'Ramo',
      about: 'Elige tu ramo: seis flores para escoger. Cada clic agrega una flor al ramo, que se acomoda en abanico; otro clic la quita.' }
  ];
  var CART = '<span class="pw__cart" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L21 8H6"/></svg><i>0</i></span>';
  var BY = {}; LIST.forEach(function (p) { BY[p.key] = p; });

  function mount(el, key) {
    var p = BY[key]; if (!el || !p) return null;
    var frame = document.createElement('div');
    frame.className = 'pw ' + (p.kind === 'direct' ? 'pw--direct' : 'pw--' + p.theme);
    if (p.kind === 'wide') {
      frame.innerHTML =
        '<div class="pw__nav"><span class="pw__brand">' + p.brand + '</span><span class="pw__links">' + p.links.map(function (l) { return '<span>' + l + '</span>'; }).join('') + '</span><span class="pw__right">' + (p.cart ? CART : '') + '<span class="pw__navbtn">' + p.navBtn + '</span></span></div>' +
        '<div class="pw__copy"><h2>' + p.h + '</h2><p>' + p.p + '</p><span class="pw__btn">' + p.btn + '</span></div>' +
        '<div class="pw__stage"><div class="' + p.cls + '"></div></div>';
    } else {
      frame.innerHTML = '<div class="' + p.cls + '"></div>';
    }
    el.appendChild(frame);
    var piece = frame.querySelector('.cv');
    if (p.cx) piece.setAttribute('data-cx', p.cx);
    if (p.usc) piece.setAttribute('data-usc', p.usc);
    var api = global[p.api];
    if (api && api.init) { try { api.init(piece); } catch (e) { /* una portada con problema no debe romper las demás */ } }
    return frame;
  }
  global.PortadasAnchas = { list: LIST, byKey: BY, mount: mount };
})(window);
