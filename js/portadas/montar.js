/*
 * Arma una portada ancha (horizontal) completa dentro de un contenedor: con su menú, su título, su botón y la parte
 * interactiva que ya existe. Se usa en el catálogo (portadas/) y en la página de cada portada (portadas/ver.html).
 *   PortadasAnchas.mount(elemento, 'burger')   ·   PortadasAnchas.list  ·   PortadasAnchas.byKey
 */
(function (global) {
  'use strict';
  var LIST = [
    { key: 'burger', name: 'Brasa Burger', tag: 'Hamburguesería', kind: 'direct', cls: 'cv cv-burger', api: 'BrasaBurger', layout: 'simetrica', cx: 0.5, kh: 0.68, dy: 0.005,
      about: 'La hamburguesa se arma sola y se abre con el cursor. Las llamas de «fuego» se inclinan hacia donde lo mueves.' },
    { key: 'gelato', name: 'Luna Gelato', tag: 'Heladería', kind: 'wide', cls: 'cv cv-gelato', api: 'LunaGelato', theme: 'gelato',
      brand: '<b>LUNA</b> GELATO', links: ['Sabores', 'Locales', 'Pedidos'], navBtn: 'Pedir', h: 'Arma tu helado,<br><em>bola por bola</em>', p: 'Toca cada bola para cambiar de sabor y mira cómo se transforma.', btn: 'Elegir sabor',
      about: 'El helado se arma sobre el cono. Cada bola cambia de sabor por separado al pasar el cursor o tocarla: nueve sabores reales, con goteos y vapor frío.' },
    { key: 'cafe', name: 'Origen Café', tag: 'Cafetería', kind: 'wide', cls: 'cv cv-cafe', api: 'OrigenCafe', theme: 'cafe',
      brand: '<b>ORIGEN</b> CAFÉ', links: ['Menú', 'Granos', 'Suscripción', 'Visítanos'], navBtn: 'Reservar', cart: true, cx: 0.74, usc: 0.84, h: 'Despierta<br><em>tus sentidos</em>', p: 'Café de origen, tostado cada mañana.<br>Haz clic y mira caer un grano.', btn: 'Pedir ahora',
      about: 'El vapor se aparta cuando pasas el cursor, los granos flotan con profundidad y cada clic hace caer un grano en el café.' },
    { key: 'pulse', name: 'Pulse Fit', tag: 'Gimnasio', kind: 'tablero', cls: 'cv cv-pulse', api: 'PulseFit', theme: 'pulse',
      brand: '<b>PULSE</b> FIT', links: ['Clases', 'Planes', 'Entrenadores'], navBtn: 'Únete', h: 'Supera <em>tu límite</em>', p: 'Cada clic es una repetición. Llega al trofeo y empieza de nuevo.', btn: 'Prueba una clase gratis',
      about: 'Un anillo de actividad con datos del gimnasio alrededor: las calorías y la racha se mueven con cada repetición.' },
    { key: 'aurea', name: 'Aurea', tag: 'Joyería', kind: 'wide', cls: 'cv cv-aurea', api: 'Aurea', theme: 'aurea',
      brand: 'AUREA', links: ['Colección', 'Novias', 'Contacto'], navBtn: 'Reservar cita', h: 'Joyas con<br><em>luz propia</em>', p: 'Pasa el cursor: la luz hace brillar el oro y la piedra.<br>Un clic cambia la gema.', btn: 'Ver colección',
      about: 'El cursor es una linterna que hace brillar la joya con destellos. Cada clic lanza polvo dorado y cambia la piedra: diamante, zafiro y esmeralda.' },
    { key: 'kicks', name: 'Kicks', tag: 'Zapatillas', kind: 'direct', cls: 'cv cv-kicks', api: 'Kicks',
      about: 'El cursor inclina la zapatilla. Cada clic lanza una onda de color y trae otra.' },
    { key: 'flora', name: 'Flora', tag: 'Florería', kind: 'direct', cls: 'cv cv-ramo', api: 'Ramo',
      about: 'Elige tu ramo: seis flores para escoger. Cada clic agrega una flor al ramo, que se acomoda en abanico; otro clic la quita.' }
  ];
  var CART = '<span class="pw__cart" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L21 8H6"/></svg><i>0</i></span>';
  var BY = {}; LIST.forEach(function (p) { BY[p.key] = p; });

  // Datos del tablero que se mueven con el juego: las calorías suben con cada repetición (105 por paso, 420 en el trofeo)
  // y la racha suma 1 cuando la persona llega al trofeo. Racha, cupos y próxima clase, en una web real, los pone el gimnasio.
  function wireTablero(frame, piece) {
    var cal = frame.querySelector('[data-stat="cal"]'), racha = frame.querySelector('[data-stat="racha"]'), days = 7;
    function pop(n) { n.classList.remove('pop'); void n.offsetWidth; n.classList.add('pop'); }
    piece.addEventListener('pulse:step', function (e) {
      var d = e.detail; cal.textContent = String((d.step + 1) * 105); pop(cal);
      if (d.step === d.last && d.user) { days++; racha.textContent = String(days); pop(racha); }
    });
  }
  function mount(el, key) {
    var p = BY[key]; if (!el || !p) return null;
    var frame = document.createElement('div');
    frame.className = 'pw ' + (p.kind === 'direct' ? 'pw--direct' : 'pw--' + p.theme) + (p.layout ? ' pw--' + p.layout : '');
    if (p.kind === 'wide') {
      frame.innerHTML =
        '<div class="pw__nav"><span class="pw__brand">' + p.brand + '</span><span class="pw__links">' + p.links.map(function (l) { return '<span>' + l + '</span>'; }).join('') + '</span><span class="pw__right">' + (p.cart ? CART : '') + '<span class="pw__navbtn">' + p.navBtn + '</span></span></div>' +
        '<div class="pw__copy"><h2>' + p.h + '</h2><p>' + p.p + '</p><span class="pw__btn">' + p.btn + '</span></div>' +
        '<div class="pw__stage"><div class="' + p.cls + '"></div></div>';
    } else if (p.kind === 'tablero') {
      // Tablero de entrenamiento: menú flotante arriba, el anillo al centro con datos a los lados, título y botón abajo
      frame.className += ' pw--tablero';
      frame.innerHTML =
        '<div class="pw__pill"><span class="pw__brand">' + p.brand + '</span><span class="pw__plinks">' + p.links.map(function (l) { return '<span>' + l + '</span>'; }).join('') + '</span><span class="pw__navbtn">' + p.navBtn + '</span></div>' +
        '<div class="pw__stage"><div class="' + p.cls + '"></div></div>' +
        '<div class="pw__stat pw__stat--l1"><span>Racha</span><b><i data-stat="racha">7</i> <u>días</u></b></div>' +
        '<div class="pw__stat pw__stat--l2"><span>Calorías</span><b><i data-stat="cal">105</i> <u>kcal</u></b></div>' +
        '<div class="pw__stat pw__stat--r1"><span>Próxima clase</span><b><i>6:30</i> <u>pm</u></b></div>' +
        '<div class="pw__stat pw__stat--r2"><span>Cupos hoy</span><b><i>8</i> <u>libres</u></b></div>' +
        '<div class="pw__foot"><h2>' + p.h + '</h2><p>' + p.p + '</p><span class="pw__btn">' + p.btn + '</span></div>';
    } else {
      frame.innerHTML = '<div class="' + p.cls + '"></div>';
    }
    el.appendChild(frame);
    var piece = frame.querySelector('.cv');
    if (p.cx) piece.setAttribute('data-cx', p.cx);
    if (p.usc) piece.setAttribute('data-usc', p.usc);
    if (p.kh) piece.setAttribute('data-kh', p.kh);
    if (p.dy !== undefined) piece.setAttribute('data-dy', p.dy);
    if (p.kind === 'tablero') wireTablero(frame, piece);
    var api = global[p.api];
    if (api && api.init) { try { api.init(piece); } catch (e) { /* una portada con problema no debe romper las demás */ } }
    // Brasa Burger simétrica: el carrito se suma al menú, a la derecha
    if (p.layout === 'simetrica') { var bar = piece.querySelector('.cv__bar'); if (bar) bar.insertAdjacentHTML('beforeend', CART);
      piece.insertAdjacentHTML('beforeend', '<div class="cv__info"><span>Abierto hoy hasta las 11 pm</span><span>Delivery en 30 min</span></div>');
      // El botón no recibe el cursor (todo el cuadro es de la hamburguesa): su «hover» se calcula por posición
      var btn = piece.querySelector('.cv__btn');
      if (btn) {
        piece.addEventListener('pointermove', function (ev) { var b = btn.getBoundingClientRect(); btn.classList.toggle('hot', ev.pointerType === 'mouse' && ev.clientX >= b.left && ev.clientX <= b.right && ev.clientY >= b.top && ev.clientY <= b.bottom); }, { passive: true });
        piece.addEventListener('pointerleave', function () { btn.classList.remove('hot'); });
      }
    }
    return frame;
  }
  global.PortadasAnchas = { list: LIST, byKey: BY, mount: mount };
})(window);
