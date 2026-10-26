/*
 * Idioma de la página /chatbots/ (español / inglés). Sin librerías y sin tocar el HTML en español:
 * traduce los textos de la página y del pie cambiando el contenido de los nodos de texto según la tabla D (clave = texto en español, sin espacios sobrantes).
 * Usa la misma clave de almacenamiento que el resto del sitio («moravi-site-lang»), así que respeta el idioma que la persona ya eligió.
 * El contenido de las ventanas de ejemplo (#modal) NO se traduce aquí: cada ejemplo trae sus propios textos en cada idioma.
 *   ChatbotsIdioma.actual() · ChatbotsIdioma.cambiar('en') · ChatbotsIdioma.alCambiar(function (idioma) { ... })
 */
(function (global) {
  'use strict';
  var KEY = 'moravi-site-lang';
  var D = {
    '← Volver a Moravi Studio': '← Back to Moravi Studio',
    'Mira cómo atendería': 'See how',
    'un chatbot a tus clientes': 'a chatbot would serve your customers',
    'Abre cualquiera de los ejemplos y conversa como lo haría un cliente: consulta precios, elige opciones y deja armado un pedido. Así se comportaría el de tu negocio.': 'Open any of the examples and chat the way a customer would: ask about prices, pick options and build an order. This is how the one for your business would behave.',
    'Los negocios de estos ejemplos son inventados, y nada de lo que hagas aquí se envía a nadie.': 'The businesses in these examples are made up, and nothing you do here is sent to anyone.',
    'Chatbots básicos': 'Basic chatbots',
    'Con botones': 'With buttons',
    'Acompañan al cliente paso a paso': 'They guide the customer step by step',
    'Cada pantalla ofrece opciones para tocar, así que el cliente nunca se pierde. No usan inteligencia artificial: responden al instante y no tienen costo por mensaje.': 'Every screen offers options to tap, so the customer never gets lost. They don\'t use artificial intelligence: they answer instantly and have no cost per message.',
    'Respuesta inmediata': 'Instant replies',
    'Sin costo por mensaje': 'No cost per message',
    'Ideales para preguntas repetidas': 'Ideal for repeated questions',
    'Nivel 1 · Informativo': 'Level 1 · Informational',
    'Centro de belleza': 'Beauty center',
    'Contesta lo que más se pregunta, servicios, precios, horario y cómo reservar, sin que nadie del equipo tenga que responder.': 'Answers the most common questions (services, prices, hours and how to book) without anyone on the team having to reply.',
    'Servicios y precios': 'Services and prices',
    'Horario': 'Hours',
    'Guía para reservar': 'Booking guide',
    'Probar': 'Try it',
    'Nivel 2 · Con pedido': 'Level 2 · With orders',
    'Boutique de ropa': 'Clothing boutique',
    'El cliente escoge la prenda, la talla y la forma de entrega, y el bot le muestra el pedido completo, listo para confirmar.': 'The customer picks the item, size and delivery method, and the bot shows the complete order, ready to confirm.',
    'Prendas por categoría': 'Items by category',
    'Selección de talla': 'Size selection',
    'Resumen del pedido': 'Order summary',
    'Nivel 3 · Conversacional': 'Level 3 · Conversational',
    'Lavandería a domicilio': 'Home laundry service',
    'Entiende frases cortas como «¿cuánto cuesta?», avisa si el local está abierto y recibe la solicitud de recojo con distrito y día.': 'Understands short phrases like “how much does it cost?”, tells you if the shop is open now, and takes the pickup request with district and day.',
    'Reconoce palabras': 'Recognizes words',
    'Estado del local': 'Open/closed status',
    'Recojo programado': 'Scheduled pickup',
    'Chatbots avanzados con inteligencia artificial': 'Advanced chatbots with artificial intelligence',
    'Chat con IA': 'AI chat',
    'Conversa con el asistente de Moravi Studio': 'Chat with the Moravi Studio assistant',
    'Este sí responde con libertad: escríbele lo que quieras saber de nuestros servicios. Y prueba también los ejemplos de abajo, hechos para otros rubros.': 'This one answers freely: ask whatever you want about our services. And try the examples below, built for other industries.',
    'Conversar con la IA': 'Chat with the AI',
    'Nivel 4 · IA que responde': 'Level 4 · AI that answers',
    'Academia de idiomas': 'Language academy',
    'Conversa con libertad: orienta sobre cursos, niveles, horarios y precios, y ayuda a decidir qué nivel le conviene a cada persona.': 'Chats freely: advises on courses, levels, schedules and prices, and helps decide which level suits each person.',
    'Responde con libertad': 'Answers freely',
    'Orienta sobre niveles': 'Advises on levels',
    'Horarios y precios': 'Schedules and prices',
    'Nivel 5 · IA que capta': 'Level 5 · AI that captures leads',
    'Inmobiliaria': 'Real estate agency',
    'Entiende qué busca el interesado, le sugiere propiedades y deja sus datos listos para que un asesor lo llame.': 'Understands what the prospect is looking for, suggests properties and leaves their details ready for an agent to call.',
    'Pregunta qué busca': 'Asks what they want',
    'Sugiere opciones': 'Suggests options',
    'Deja sus datos': 'Collects their details',
    'Nivel 6 · IA que recibe solicitudes': 'Level 6 · AI that takes requests',
    'Clínica dental': 'Dental clinic',
    'Recibe la solicitud de cita con el tratamiento y el horario preferido, sin diagnosticar y avisando qué hacer ante una urgencia.': 'Takes the appointment request with the treatment and preferred time, without diagnosing, and says what to do in an emergency.',
    'Solicitud de cita': 'Appointment request',
    'Sin diagnosticar': 'No diagnosing',
    'Aviso de urgencias': 'Emergency notice',
    'De tu información a tu chatbot en 4 pasos': 'From your information to your chatbot in 4 steps',
    'Nos cuentas de tu negocio': 'You tell us about your business',
    'Servicios, precios, horarios y las preguntas que más te hacen tus clientes.': 'Services, prices, hours and the questions your customers ask most.',
    'Armamos tu chatbot': 'We build your chatbot',
    'Con tu información y el tono de tu marca, y lo probamos con preguntas reales.': 'With your information and your brand\'s tone, and we test it with real questions.',
    'Lo pruebas antes de publicarlo': 'You try it before it goes live',
    'Te damos un enlace privado para que converses con él y pidas los cambios que quieras.': 'We give you a private link so you can chat with it and ask for any changes.',
    'Lo instalamos en tu web': 'We install it on your website',
    'Con tu aprobación queda funcionando en tu página, atendiendo a tus clientes a cualquier hora.': 'Once you approve it, it goes live on your page, serving your customers at any hour.',
    'Preguntas frecuentes': 'Frequently asked questions',
    '¿Necesito tener una página web?': 'Do I need to have a website?',
    'Sí, el chatbot vive en la página de tu negocio. Si todavía no tienes una, también hacemos páginas web y catálogos digitales.': 'Yes, the chatbot lives on your business\'s website. If you don\'t have one yet, we also build websites and digital catalogs.',
    '¿Funciona dentro de WhatsApp?': 'Does it work inside WhatsApp?',
    'No: estos chatbots atienden en la web de tu negocio, no dentro de WhatsApp. Eso sí, el chatbot puede darle a tu cliente tu número para que siga la conversación contigo por ahí.': 'No: these chatbots serve people on your business\'s website, not inside WhatsApp. They can, however, give your customer your number so they can continue the conversation with you there.',
    '¿Me conviene uno con botones o uno con IA?': 'Should I choose a button chatbot or an AI one?',
    'Si tus clientes preguntan casi siempre lo mismo, uno con botones basta: responde al instante y no tiene costo por mensaje. Si las preguntas son muy variadas o quieres que converse con libertad, conviene uno con IA.': 'If your customers mostly ask the same things, a button chatbot is enough: it answers instantly and has no cost per message. If the questions vary a lot or you want it to chat freely, an AI chatbot is the better fit.',
    '¿Puede equivocarse el chatbot con IA?': 'Can the AI chatbot get things wrong?',
    'Responde solo con la información de tu negocio que le damos y, si no sabe algo, lo dice y te deriva. Aun así sigue siendo una IA, por eso lo revisamos juntos antes de publicarlo.': 'It only answers with the information about your business that we give it and, if it doesn\'t know something, it says so and refers the person to you. It\'s still an AI, so we review it together before publishing.',
    '¿Quién actualiza la información si cambio mis precios?': 'Who updates the information if my prices change?',
    'Nos escribes y lo actualizamos por ti.': 'Just message us and we\'ll update it for you.',
    '¿Cuánto cuesta y cuánto tarda?': 'How much does it cost and how long does it take?',
    'Los chatbots con botones y los de IA se cotizan por separado, y el precio depende de cuánta información maneja y qué funciones necesita. Una vez que tenemos tu información, armarlo toma pocas horas; el tiempo total depende de cuándo nos la envíes y de cuántos cambios pidas.': 'Button chatbots and AI chatbots are quoted separately, and the price depends on how much information it handles and which features it needs. Once we have your information, building it takes a few hours; the total time depends on when you send it and how many changes you ask for.',
    '¿Tu negocio es otro?': 'Is your business different?',
    'Cuéntanos a qué te dedicas y preparamos un ejemplo con tu información.': 'Tell us what you do and we\'ll prepare an example with your information.',
    'Cuéntanos tu caso': 'Tell us about your case',
    // pie del sitio (mismas palabras que el resto del sitio)
    'Diseño web y landing pages pensadas para ayudarte a destacar y vender más.': 'Web design and landing pages built to help you stand out and sell more.',
    'Inicio': 'Home', 'Proyectos': 'Projects', 'Servicios': 'Services', 'Productos': 'Products', 'Contacto': 'Contact',
    'Política de privacidad': 'Privacy policy', 'Términos y condiciones': 'Terms and conditions', 'Suscripciones y reembolsos': 'Subscriptions and refunds',
    'Condiciones de Catálogo Online': 'Online Catalog terms', 'Condiciones de MS Video Downloader': 'MS Video Downloader terms',
    '© 2026 Moravi Studio. Todos los derechos reservados.': '© 2026 Moravi Studio. All rights reserved.'
  };
  var A = { 'Ejemplo de chatbot': 'Chatbot example', 'Cerrar ejemplo': 'Close example', 'Idioma': 'Language' };
  var H = { '../privacidad.html': '../privacy-policy.html', '../terminos.html': '../terms-and-conditions.html', '../suscripciones.html': '../subscriptions-and-refunds.html',
            '../catalogo-condiciones.html': '../online-catalog-terms.html', '../video-downloader-condiciones.html': '../video-downloader-terms.html' };
  var WA = { es: 'Hola%20Moravi%20Studio%2C%20quiero%20un%20chatbot%20para%20mi%20negocio', en: 'Hi%20Moravi%20Studio%2C%20I%20want%20a%20chatbot%20for%20my%20business' };
  var TITULO = { es: null, en: 'Chatbots for your business — Moravi Studio' };
  var DESC = { es: null, en: 'See how a chatbot would serve your customers: open the Moravi Studio examples and chat with them, with buttons or with artificial intelligence.' };

  var originales = new WeakMap(), oyentes = [], actual = 'es';
  function leer() { try { return localStorage.getItem(KEY) === 'en' ? 'en' : 'es'; } catch (e) { return 'es'; } }
  function guardar(l) { try { localStorage.setItem(KEY, l); } catch (e) { /* sin almacenamiento: el idioma vale solo para esta visita */ } }

  function nodosDeTexto() {
    var out = [];
    ['.wrap', '.footer'].forEach(function (sel) {
      var raiz = document.querySelector(sel); if (!raiz) return;
      var w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) { if (n.nodeValue.trim()) out.push(n); }
    });
    return out;
  }
  function aplicar(l) {
    actual = l;
    document.documentElement.setAttribute('lang', l);
    nodosDeTexto().forEach(function (n) {
      if (!originales.has(n)) originales.set(n, n.nodeValue);
      var o = originales.get(n), clave = o.trim();
      n.nodeValue = (l === 'en' && D[clave]) ? o.replace(clave, D[clave]) : o;
    });
    [].forEach.call(document.querySelectorAll('[aria-label]'), function (e) {
      if (!e.hasAttribute('data-aria-es')) e.setAttribute('data-aria-es', e.getAttribute('aria-label'));
      var es = e.getAttribute('data-aria-es'); e.setAttribute('aria-label', (l === 'en' && A[es]) ? A[es] : es);
    });
    [].forEach.call(document.querySelectorAll('.footer a[href]'), function (a) {
      if (!a.hasAttribute('data-href-es')) a.setAttribute('data-href-es', a.getAttribute('href'));
      var es = a.getAttribute('data-href-es'); a.setAttribute('href', (l === 'en' && H[es]) ? H[es] : es);
    });
    [].forEach.call(document.querySelectorAll('a[href*="wa.me"][href*="text="]'), function (a) {
      var h = a.getAttribute('href'); a.setAttribute('href', h.replace(/text=[^&]*/, 'text=' + WA[l]));
    });
    if (!document.documentElement.hasAttribute('data-titulo-es')) {
      document.documentElement.setAttribute('data-titulo-es', document.title);
      var m = document.querySelector('meta[name="description"]'); if (m) document.documentElement.setAttribute('data-desc-es', m.getAttribute('content'));
    }
    document.title = TITULO[l] || document.documentElement.getAttribute('data-titulo-es');
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', DESC[l] || document.documentElement.getAttribute('data-desc-es'));
    [].forEach.call(document.querySelectorAll('.idioma button'), function (b) {
      var on = b.getAttribute('data-lang') === l; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function cambiar(l) { l = l === 'en' ? 'en' : 'es'; if (l === actual) return; guardar(l); aplicar(l); oyentes.forEach(function (f) { try { f(l); } catch (e) { /* un oyente con problema no debe romper el cambio */ } }); }

  global.ChatbotsIdioma = { actual: function () { return actual; }, cambiar: cambiar, alCambiar: function (f) { oyentes.push(f); } };

  function iniciar() {
    [].forEach.call(document.querySelectorAll('.idioma button'), function (b) { b.addEventListener('click', function () { cambiar(b.getAttribute('data-lang')); }); });
    var l = leer(); actual = 'es'; if (l === 'en') aplicar('en'); else { actual = 'es'; aplicar('es'); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})(window);
