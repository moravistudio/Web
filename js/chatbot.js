(function () {
  var toggle  = document.querySelector('.chatbot__toggle');
  var window_ = document.querySelector('.chatbot__window');
  var closeBtn = document.querySelector('.chatbot__close');
  var body    = document.querySelector('.chatbot__body');

  /* ── datos ── */
  var tree = {
    servicios: {
      label: '💼 ¿Qué servicios ofrecen?',
      items: [
        { id: 'landing',  label: 'Landing Page',   text: 'Una sola página diseñada con un único objetivo: que el visitante te contacte o te compre. Es la opción más rápida y efectiva para presentar tu negocio y captar clientes.' },
        { id: 'sitio',    label: 'Sitio Web',       text: 'Sitio de varias secciones que representa tu negocio completo: quiénes somos, servicios, proyectos y contacto. Ideal para empresas que necesitan más presencia y credibilidad online.' },
        { id: 'tienda',   label: 'Tienda Online',   text: 'Plataforma de venta con catálogo de productos, carrito de compras y pasarela de pago. Tu negocio abierto las 24 horas, los 7 días de la semana.' },
        { id: 'chatbot',       label: 'Chatbot',                        text: 'Un asistente virtual como este, integrado en tu web. Atiende a tus clientes automáticamente las 24 horas, responde preguntas frecuentes y capta contactos sin que tengas que estar presente.' },
        { id: 'mantenimiento', label: '🔧 Mantenimiento y Actualización', text: 'Mantenemos tu web al día: actualizamos textos, imágenes y contenido, corregimos errores y nos aseguramos de que todo funcione correctamente. Ideal si ya tienes una web pero necesitas que alguien la gestione por ti.' }
      ]
    },
    costo: {
      label: '💰 ¿Cuánto cuesta?',
      items: [
        { id: 'landing',  label: 'Landing Page',   text: 'Desde S/ 400. Precio fijo por ser un proyecto de una sola página.' },
        { id: 'sitio',    label: 'Sitio Web',       text: 'Desde S/ 900. El precio varía según la cantidad de secciones y funcionalidades.' },
        { id: 'tienda',   label: 'Tienda Online',   text: 'Desde S/ 1,400. El precio depende del catálogo, pasarela de pago y funcionalidades requeridas.' },
        { id: 'chatbot',       label: 'Chatbot',                        text: 'Desde S/ 250. Lo integramos a tu web existente en menos de 24 horas.' },
        { id: 'mantenimiento', label: '🔧 Mantenimiento y Actualización', text: 'Desde S/ 150 por actualización puntual. También ofrecemos planes mensuales según la frecuencia de cambios que necesites.' }
      ]
    },
    tiempo: {
      label: '🕐 ¿Cuánto tiempo demora?',
      items: [
        { id: 'landing',  label: 'Landing Page',   text: 'Entre 3 y 4 días hábiles.' },
        { id: 'sitio',    label: 'Sitio Web',       text: 'Entre 7 y 15 días hábiles según la complejidad.' },
        { id: 'tienda',   label: 'Tienda Online',   text: 'Entre 15 y 30 días hábiles.' },
        { id: 'chatbot',       label: 'Chatbot',                        text: 'Menos de 24 horas.' },
        { id: 'mantenimiento', label: '🔧 Mantenimiento y Actualización', text: 'Cambios simples en menos de 24 horas. Actualizaciones más complejas en 2 a 3 días hábiles.' }
      ]
    },
    'mas-preguntas': {
      label: '❓ Tengo más preguntas',
      items: [
        { id: 'portafolio', label: '¿Puedo ver trabajos anteriores?',        text: 'Sí, visita nuestro portafolio y revisa los proyectos que hemos realizado.', link: { href: 'https://moravistudio.github.io/Web/portafolio.html', label: '🗂 Ver portafolio' } },
        { id: 'responsive', label: '¿La web funciona en celular?',            text: 'Sí, todas nuestras webs son responsive — se ven y funcionan perfecto en celular, tablet y computadora.', subopcion: { label: '¿Qué es diseño responsive?', text: 'El diseño responsive significa que tu web se adapta automáticamente a cualquier pantalla — celular, tablet o computadora — sin que el usuario tenga que hacer nada. Hoy más del 65% de las visitas vienen desde el celular, por eso todas nuestras webs están optimizadas para móvil desde el primer día.' } },
        { id: 'hosting',    label: '¿Incluye dominio y hosting?',             text: 'Depende del paquete. Consúltanos y te armamos una propuesta completa según lo que necesitas.' },
        { id: 'cambios',    label: '¿Puedo hacer cambios después?',           submenu: [
          { id: 'yo-mismo',  label: 'Quiero hacer los cambios yo mismo',       text: 'Depende de cómo está construida tu web. Si usamos WordPress, podrás editar textos e imágenes fácilmente desde un panel sin saber programación. Si tu web es en código puro, necesitarías conocimientos técnicos para editarla tú mismo. Consúltanos y te recomendamos la mejor opción según tu caso.' },
          { id: 'ustedes',   label: 'Prefiero que ustedes hagan los cambios',  text: 'Sin problema. Ofrecemos soporte post-entrega para actualizar tu web cuando lo necesites, ya sea que esté hecha en WordPress o en código puro. Escríbenos por WhatsApp y te cotizamos según el cambio que necesitas.', link: { href: 'https://wa.me/51940284018', label: '💬 Escribir por WhatsApp' } }
        ] },
        { id: 'remoto',     label: '¿Trabajan con clientes fuera de Perú?',  text: 'Sí, trabajamos con clientes de cualquier país de forma 100% remota.' }
      ]
    }
  };

  var menu = [
    { id: 'servicios',      label: '💼 ¿Qué servicios ofrecen?' },
    { id: 'costo',          label: '💰 ¿Cuánto cuesta?' },
    { id: 'tiempo',         label: '🕐 ¿Cuánto tiempo demora?' },
    { id: 'mas-preguntas',  label: '❓ Tengo más preguntas' },
    { id: 'contacto',       label: '📩 Quiero contactarlos' }
  ];

  /* ── helpers ── */
  function btnMain() {
    var b = document.createElement('button');
    b.className = 'chatbot__back-btn chatbot__back-btn--main';
    b.textContent = '← Menú principal';
    b.addEventListener('click', renderMenu);
    return b;
  }

  function btnVolver(fn) {
    var b = document.createElement('button');
    b.className = 'chatbot__back-btn';
    b.textContent = '← Volver';
    b.addEventListener('click', fn);
    return b;
  }

  /* ── nivel 0: menú principal ── */
  function renderMenu() {
    var html = '<p class="chatbot__message">¡Hola! Soy el asistente de Moravi Studio 👋 ¿En qué puedo ayudarte?</p><div class="chatbot__options">';
    menu.forEach(function (item) {
      html += '<button class="chatbot__option-btn" data-id="' + item.id + '">' + item.label + '</button>';
    });
    html += '</div>';
    body.innerHTML = html;

    body.querySelectorAll('.chatbot__option-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        id === 'contacto' ? renderContacto() : renderSubMenu(id);
      });
    });
  }

  /* ── nivel 1: submenú ── */
  function renderSubMenu(menuId) {
    var section = tree[menuId];
    body.innerHTML = '';

    var msg = document.createElement('p');
    msg.className = 'chatbot__message';
    msg.textContent = section.label;
    body.appendChild(msg);

    var opts = document.createElement('div');
    opts.className = 'chatbot__options';
    section.items.forEach(function (item) {
      var b = document.createElement('button');
      b.className = 'chatbot__option-btn';
      b.textContent = item.label;
      b.addEventListener('click', function () { renderResponse(menuId, item.id); });
      opts.appendChild(b);
    });
    body.appendChild(opts);
    body.appendChild(btnMain());
  }

  /* ── nivel 2: submenú de cambios ── */
  function renderCambiosMenu() {
    var item = tree['mas-preguntas'].items.find(function (i) { return i.id === 'cambios'; });
    body.innerHTML = '';

    var msg = document.createElement('p');
    msg.className = 'chatbot__message';
    msg.textContent = 'Depende de lo que necesites:';
    body.appendChild(msg);

    var opts = document.createElement('div');
    opts.className = 'chatbot__options';
    item.submenu.forEach(function (sub) {
      var b = document.createElement('button');
      b.className = 'chatbot__option-btn';
      b.textContent = sub.label;
      b.addEventListener('click', function () { renderCambiosResponse(sub.id); });
      opts.appendChild(b);
    });
    body.appendChild(opts);
    body.appendChild(btnVolver(function () { renderSubMenu('mas-preguntas'); }));
    body.appendChild(btnMain());
  }

  function renderCambiosResponse(subId) {
    var item = tree['mas-preguntas'].items.find(function (i) { return i.id === 'cambios'; });
    var sub = item.submenu.find(function (s) { return s.id === subId; });
    body.innerHTML = '';

    var resp = document.createElement('p');
    resp.className = 'chatbot__response';
    resp.textContent = sub.text;
    body.appendChild(resp);

    if (sub.link) {
      var a = document.createElement('a');
      a.className = 'chatbot__wa-btn';
      a.href = sub.link.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = sub.link.label;
      body.appendChild(a);
    }

    body.appendChild(btnVolver(renderCambiosMenu));
    body.appendChild(btnMain());
  }

  /* ── nivel 2: respuesta ── */
  function renderResponse(menuId, itemId) {
    var item = tree[menuId].items.find(function (i) { return i.id === itemId; });

    if (item.submenu) { renderCambiosMenu(); return; }

    body.innerHTML = '';

    var resp = document.createElement('p');
    resp.className = 'chatbot__response';
    resp.textContent = item.text;
    body.appendChild(resp);

    if (item.link) {
      var a = document.createElement('a');
      a.className = 'chatbot__wa-btn';
      a.href = item.link.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = item.link.label;
      body.appendChild(a);
    }

    if (item.subopcion) {
      var sub = document.createElement('button');
      sub.className = 'chatbot__option-btn';
      sub.textContent = item.subopcion.label;
      sub.addEventListener('click', function () { renderSubopcion(item, menuId, itemId); });
      body.appendChild(sub);
    }

    body.appendChild(btnVolver(function () { renderSubMenu(menuId); }));
    body.appendChild(btnMain());
  }

  /* ── nivel 3: subopción ── */
  function renderSubopcion(item, menuId, itemId) {
    body.innerHTML = '';

    var resp = document.createElement('p');
    resp.className = 'chatbot__response';
    resp.textContent = item.subopcion.text;
    body.appendChild(resp);

    body.appendChild(btnVolver(function () { renderResponse(menuId, itemId); }));
    body.appendChild(btnMain());
  }

  /* ── caso especial: contacto ── */
  function renderContacto() {
    body.innerHTML = '';

    var resp = document.createElement('p');
    resp.className = 'chatbot__response';
    resp.textContent = 'Puedes escribirnos por WhatsApp o llenar el formulario de contacto. ¡Te respondemos en menos de 24 horas!';
    body.appendChild(resp);

    var a = document.createElement('a');
    a.className = 'chatbot__wa-btn';
    a.href = 'https://wa.me/51940284018';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = '💬 Escribir por WhatsApp';
    body.appendChild(a);

    body.appendChild(btnMain());
  }

  /* ── toggle ── */
  function openChat() {
    window_.classList.add('chatbot__window--open');
    toggle.setAttribute('aria-expanded', 'true');
    if (!body.hasChildNodes()) renderMenu();
  }

  function closeChat() {
    window_.classList.remove('chatbot__window--open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    window_.classList.contains('chatbot__window--open') ? closeChat() : openChat();
  });

  closeBtn.addEventListener('click', closeChat);

  renderMenu();
})();
