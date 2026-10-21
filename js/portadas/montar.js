/*
 * Arma una portada ancha (horizontal) completa dentro de un contenedor: con su menú, su título, su botón y la parte
 * interactiva que ya existe. Se usa en el catálogo (portadas/) y en la página de cada portada (portadas/ver.html).
 *   PortadasAnchas.mount(elemento, 'burger')   ·   PortadasAnchas.list  ·   PortadasAnchas.byKey
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var LIST = [
    { key: 'burger', name: 'Brasa Burger', tag: 'Hamburguesería', kind: 'direct', cls: 'cv cv-burger', api: 'BrasaBurger', layout: 'simetrica', cx: 0.5, kh: 0.68, dy: 0.005,
      about: 'La hamburguesa se arma sola y se abre con el cursor. Las llamas de «fuego» se inclinan hacia donde lo mueves.' },
    { key: 'gelato', name: 'Polar Gelato', tag: 'Heladería', kind: 'wide', layout: 'salpicon', variant: 'f', kh: 0.78, dy: 0.164, tilt: -12, cls: 'cv cv-gelato', api: 'LunaGelato', theme: 'polar',
      brand: '<b>POLAR</b> GELATO', links: ['Sabores', 'Locales', 'Pedidos'], navBtn: 'Pedir', h: 'Toca una bola,<br>salpica el <em>sabor</em>', p: 'Cada toque cambia el sabor<br>y salpica toda la portada.', btn: 'Elegir sabor',
      about: '' },
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
    { key: 'flora', name: 'Flora', tag: 'Florería', kind: 'direct', layout: 'durazno', cls: 'cv cv-ramo', api: 'Ramo',
      about: 'Toca las flores y arma tu ramo.' }
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
  // Salpicón: cada vez que la persona cambia el sabor de una bola, una mancha de ese color (con gotitas) salpica la portada; las más viejas se desvanecen
  function wireSalpicon(frame, piece) {
    var cv = frame.querySelector('.pw__splash'), ctx = cv.getContext('2d'), W = 0, H = 0, dpr = 1, blobs = [], raf = 0, vis = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function size() { var r = frame.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    if (window.ResizeObserver) new ResizeObserver(size).observe(frame); size();
    function shape(r) { var pts = [], n = 14, i; for (i = 0; i < n; i++) pts.push(r * (0.72 + Math.random() * 0.5)); return pts; }
    function addBlob(x, y, color) {
      var r = W * (0.032 + Math.random() * 0.035), drops = [], i, a;
      for (i = 0; i < 8; i++) { a = Math.random() * 6.2832; drops.push({ dx: Math.cos(a) * r * (1.25 + Math.random() * 1.2), dy: Math.sin(a) * r * (1.25 + Math.random() * 1.2), r: r * (0.06 + Math.random() * 0.12) }); }
      blobs.push({ x: x, y: y, r: r, color: color, pts: shape(r), drops: drops, born: performance.now(), rot: Math.random() * 6.2832 });
      if (blobs.length > 6) blobs[0].kill = performance.now();
      go();
    }
    function path(b, k) {
      var n = b.pts.length, i, p0, p1, cx, cy;
      var P = b.pts.map(function (rr, j) { var a = b.rot + j / n * 6.2832; return [b.x + Math.cos(a) * rr * k, b.y + Math.sin(a) * rr * k]; });
      ctx.beginPath(); ctx.moveTo((P[0][0] + P[n - 1][0]) / 2, (P[0][1] + P[n - 1][1]) / 2);
      for (i = 0; i < n; i++) { p0 = P[i]; p1 = P[(i + 1) % n]; cx = (p0[0] + p1[0]) / 2; cy = (p0[1] + p1[1]) / 2; ctx.quadraticCurveTo(p0[0], p0[1], cx, cy); }
      ctx.closePath();
    }
    function draw(now) {
      raf = 0; ctx.clearRect(0, 0, W, H);
      for (var i = blobs.length - 1; i >= 0; i--) {
        var b = blobs[i], age = (now - b.born) / 1000, grow = Math.min(1, age / 0.45), k = 1 - Math.pow(1 - grow, 3), fade = 1;
        if (b.kill) fade = 1 - (now - b.kill) / 1800; else if (age > 14) fade = 1 - (age - 14) / 3;
        if (fade <= 0) { blobs.splice(i, 1); continue; }
        ctx.globalAlpha = 0.92 * fade; ctx.fillStyle = b.color; path(b, 0.15 + 0.85 * k); ctx.fill();
        b.drops.forEach(function (d) { var s = Math.min(1, Math.max(0, (grow - 0.2) / 0.8)); ctx.beginPath(); ctx.arc(b.x + d.dx * k, b.y + d.dy * k, d.r * s, 0, 6.2832); ctx.fill(); });
        ctx.globalAlpha = 0.28 * fade; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(b.x - b.r * 0.25, b.y - b.r * 0.3, b.r * 0.32, b.r * 0.18, -0.5, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (blobs.length && vis && !document.hidden) raf = requestAnimationFrame(draw);
    }
    function go() { if (!raf && vis && !document.hidden) raf = requestAnimationFrame(draw); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; if (vis) go(); }, { threshold: 0.05 }).observe(frame);
    piece.addEventListener('gelato:pick', function (e) {
      if (reduce) return;
      var r = frame.getBoundingClientRect(), d = e.detail, side = Math.random() < 0.5 ? -1 : 1;
      if (d.left) { addBlob(Math.max(W * 0.24, Math.min(W * 0.7, (d.x - r.left) + side * W * (0.04 + Math.random() * 0.1))), Math.max(H * 0.46, Math.min(H * 0.92, (d.y - r.top) + (Math.random() - 0.3) * H * 0.3)), d.color); return; }
      // las manchas caen del lado del helado y del borde de abajo, lejos del título y del menú
      var x = Math.max(W * 0.4, Math.min(W * 0.95, (d.x - r.left) + side * W * (0.12 + Math.random() * 0.2))), y = Math.max(H * 0.3, Math.min(H * 0.9, (d.y - r.top) + (Math.random() - 0.3) * H * 0.5));
      addBlob(x, y, d.color);
    });
  }
  // Las tres bolas del banana split también se tocan: al tocar una, salpica una mancha de su color alrededor del banana split
  function wireBanana(frame, piece) {
    var box = frame.querySelector('.pw__extra--bs'); if (!box) return;
    var img = box.querySelector('img.bs') || box.querySelector('img'), w1 = box.querySelector('.w1'), w2 = box.querySelector('.w2'), SC = [[0.27, '#ffb3c8'], [0.50, '#c9df9a'], [0.74, '#fff0cf']];
    function scoopAt(e) {
      var r = img.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height, best = null, i;
      if (fy < 0.15 || fy > 0.62) return null;
      for (i = 0; i < SC.length; i++) if (Math.abs(fx - SC[i][0]) < 0.13) best = SC[i];
      return best;
    }
    function wafers(delay) {
      if (!w1 || !w2 || !box.animate) return;
      w1.animate([{ transform: 'translate(-30%, -170%) rotate(-24deg)', opacity: 0 }, { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 }], { duration: 750, delay: delay, easing: 'cubic-bezier(.25, 1.35, .45, 1)', fill: 'backwards' });
      w2.animate([{ transform: 'translate(30%, -170%) rotate(24deg)', opacity: 0 }, { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 }], { duration: 750, delay: delay + 160, easing: 'cubic-bezier(.25, 1.35, .45, 1)', fill: 'backwards' });
    }
    if (w1) {
      var seen = false, run = function () { if (seen) return; seen = true; box.animate([{ transform: 'translateY(14%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 650, easing: 'cubic-bezier(.2, .9, .3, 1.1)', fill: 'backwards' }); wafers(520); };
      if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { if (en[0].isIntersecting) run(); }, { threshold: 0.3 }).observe(box); else run();
    }
    box.addEventListener('pointermove', function (e) { box.style.cursor = scoopAt(e) ? 'pointer' : ''; }, { passive: true });
    box.addEventListener('pointerdown', function (e) {
      var sc = scoopAt(e); if (!sc) { wafers(0); return; } // fuera de las bolas (cristal, plátano): las galletas vuelven a caer. Sobre una bola: solo la mancha
      piece.dispatchEvent(new CustomEvent('gelato:pick', { detail: { n: 0, color: sc[1], x: e.clientX, y: e.clientY, left: true } }));
      // el saltito lo da todo el conjunto (banana split y galletas juntos)
      box.style.transition = 'transform .16s ease'; box.style.transformOrigin = '50% 85%'; box.style.transform = 'scale(1.03)'; setTimeout(function () { box.style.transform = ''; }, 170);
    });
  }
  function mount(el, key) {
    var p = BY[key]; if (!el || !p) return null;
    var frame = document.createElement('div');
    frame.className = 'pw ' + (p.kind === 'direct' ? 'pw--direct' : 'pw--' + p.theme) + (p.layout ? ' pw--' + p.layout : '') + (p.variant ? ' pw--v-' + p.variant : '');
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
    if (p.layout === 'salpicon') frame.insertAdjacentHTML('afterbegin', '<canvas class="pw__splash" aria-hidden="true"></canvas>');
    el.appendChild(frame);
    if (p.variant === 'f') frame.insertAdjacentHTML('beforeend', '<div class="pw__extra pw__extra--bs pw__extra--bs2"><img class="w1" src="' + BASE + 'assets/portadas/luna-gelato/galleta-izq.webp" alt=""><img class="w2" src="' + BASE + 'assets/portadas/luna-gelato/galleta-der.webp" alt=""><img class="bs" src="' + BASE + 'assets/portadas/luna-gelato/banana-split-sin-galletas.webp" alt=""></div>');
    var piece = frame.querySelector('.cv');
    if (p.cx) piece.setAttribute('data-cx', p.cx);
    if (p.usc) piece.setAttribute('data-usc', p.usc);
    if (p.kh) piece.setAttribute('data-kh', p.kh);
    if (p.dy !== undefined) piece.setAttribute('data-dy', p.dy);
    if (p.tilt) piece.setAttribute('data-tilt', p.tilt);
    // Prueba de cerezas nuevas: ver.html?c=gelato&cereza=4&rot=-8  (cereza = 1 a 9, rot = giro extra en grados)
    var mc = /[?&]cereza=([1-9])/.exec(location.search) || [0, '1'], mr = /[?&]rot=(-?d+)/.exec(location.search);
    if (mc && p.key.indexOf('gelato') === 0) {
      var CM = { 1: [289, 389, 228, 174.0], 2: [268, 434, 267, 132.3], 3: [233, 305, 147, 72.8], 4: [327, 393, 276, 192.4], 5: [248, 345, 198, 98.5], 6: [285, 378, 250, 122.0], 7: [265, 341, 196, 166.6], 8: [381, 382, 303, 150.0], 9: [282, 355, 241, 118.4] }[mc[1]];
      piece.setAttribute('data-cherry-img', BASE + 'assets/portadas/luna-gelato/cereza-' + mc[1] + '.webp');
      piece.setAttribute('data-cherry-m', JSON.stringify({ w: CM[0] + 12, bw: CM[2], cx: CM[3] + 6, bb: CM[1] + 6 }));
      if (mr) piece.setAttribute('data-cherry-rot', mr[1]);
    }
    if (p.kind === 'tablero') wireTablero(frame, piece);
    if (p.layout === 'salpicon') wireSalpicon(frame, piece);
    if (p.variant === 'f') wireBanana(frame, piece);
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
