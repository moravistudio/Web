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
    { key: 'aurea', name: 'Aurea', tag: 'Joyería', kind: 'escaparate', layout: 'escaparate', cls: 'cv cv-aurea', api: 'Aurea', theme: 'aurea',
      brand: 'AUREA', links: ['Colección', 'Novias', 'Contacto'], navBtn: 'Reservar cita', h: 'Joyas con<br><em>luz propia</em>', p: 'Pasa el cursor: la luz hace brillar el oro y la piedra.<br>Un clic cambia la gema.', btn: 'Ver colección',
      about: 'Cada gema cambia el color de toda la portada, y la luz del cursor hace brillar la joya y el título.' },
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
  // Selector de gemas: cada círculo pide esa gema a la pieza; cuando la gema cambia (clic o solo), el círculo activo la sigue
  function wireEscaparate(frame, piece) {
    var PAL = [
      { bg: 'radial-gradient(90% 120% at 28% 55%, #2c2c38 0%, #14141b 55%, #08080b 100%)', ink: '#f3ead2', acc: '#e9d8a6', mut: '#8f8a78' },
      { bg: 'radial-gradient(90% 120% at 28% 55%, #1b3a86 0%, #0b1a4a 55%, #050c24 100%)', ink: '#eaf0ff', acc: '#f0c978', mut: '#8793b8' },
      { bg: 'radial-gradient(90% 120% at 28% 55%, #0f5a40 0%, #07291d 55%, #03130d 100%)', ink: '#e8fff4', acc: '#e3cf84', mut: '#78a590' }
    ];
    var tabs = [].slice.call(frame.querySelectorAll('.pw__tabs button')), ghost = frame.querySelector('.pw__ghost'), shines = [].slice.call(frame.querySelectorAll('.pw__shine')), cur = 0;
    function paint(i) {
      var c = PAL[i];
      frame.style.setProperty('--pw-ink', c.ink); frame.style.setProperty('--pw-accent', c.acc); frame.style.setProperty('--pw-muted', c.mut);
      tabs.forEach(function (b, k) { b.classList.toggle('is-on', k === i); });
      ghost.textContent = '0' + (i + 1);
    }
    frame.style.setProperty('--pw-bg', PAL[0].bg); paint(0);
    tabs.forEach(function (b) { b.addEventListener('click', function () { piece.dispatchEvent(new CustomEvent('aurea:set', { detail: { index: +b.getAttribute('data-gem') } })); }); });
    // Al cambiar la gema: una onda de color nace en la joya y cubre la portada con el fondo de la nueva gema; el dorado cambia a mitad de la onda
    piece.addEventListener('aurea:gem', function (e) {
      var i = e.detail.index; if (i === cur) return; cur = i;
      var w = document.createElement('div'); w.className = 'pw__wave'; w.style.background = PAL[i].bg; frame.insertBefore(w, frame.firstChild);
      var done = function () { frame.style.setProperty('--pw-bg', PAL[i].bg); if (w.parentNode) w.parentNode.removeChild(w); };
      if (w.animate) {
        var a = w.animate([{ clipPath: 'circle(0% at 28% 44%)' }, { clipPath: 'circle(150% at 28% 44%)' }], { duration: 950, easing: 'cubic-bezier(.3,.7,.2,1)' });
        a.onfinish = done; setTimeout(function () { paint(i); }, 330);
      } else { paint(i); done(); }
    });
    // La luz sigue al cursor también sobre el título: las letras brillan donde pasa
    function shine(ev) { shines.forEach(function (el) { var r = el.getBoundingClientRect(); el.style.setProperty('--lx', (ev.clientX - r.left) + 'px'); el.style.setProperty('--ly', (ev.clientY - r.top) + 'px'); }); }
    frame.addEventListener('pointermove', function (ev) { if (ev.pointerType === 'mouse') shine(ev); }, { passive: true });
    frame.addEventListener('pointerleave', function () { shines.forEach(function (el) { el.style.setProperty('--lx', '-999px'); el.style.setProperty('--ly', '-999px'); }); });
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
    } else if (p.kind === 'escaparate') {
      // Cada gema, su propio mundo: menú normal arriba, la joya a la izquierda, columna editorial; el fondo y el dorado cambian con la gema
      frame.innerHTML =
        '<div class="pw__ghost" aria-hidden="true">01</div>' +
        '<div class="pw__nav2"><span class="pw__logo2">Aurea</span><span class="pw__links2">' + p.links.map(function (l) { return '<span>' + l + '</span>'; }).join('') + '<span class="pw__links2-cta">Reservar cita</span></span></div>' +
        '<div class="pw__stage"><div class="' + p.cls + '"></div></div>' +
        '<div class="pw__col">' +
          '<h2><span class="pw__shine pw__shine--ink">Joyas con</span><span class="pw__shine pw__shine--acc">luz propia</span></h2><i class="pw__rule"></i>' +
          '<p>Pasa el cursor: la luz hace brillar el oro y la piedra.</p>' +
          '<div class="pw__tabs" role="group" aria-label="Elegir gema"><button type="button" class="is-on" data-gem="0"><u>01</u> Diamante</button><button type="button" data-gem="1"><u>02</u> Zafiro</button><button type="button" data-gem="2"><u>03</u> Esmeralda</button></div>' +
          '<span class="pw__btn pw__btn--gold">' + p.btn + '</span></div>';
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
    if (p.kind === 'escaparate') wireEscaparate(frame, piece);
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
