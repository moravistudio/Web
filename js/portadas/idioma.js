/*
 * Inglés para las portadas interactivas. Los textos de las portadas están escritos en español dentro del código;
 * este archivo los muestra en inglés cuando la página está en inglés (<html lang="en">), y los devuelve al español al volver.
 * - En español no hace nada (ni siquiera observa la página): solo gasta algo cuando el idioma es inglés.
 * - Traduce el texto de lo que esté dentro de .cv (portadas), .pw (portadas anchas), .mosaic__go y [data-idioma]
 *   (páginas del catálogo de portadas). Lo que una portada escribe después (sabores, gemas, resumen del ramo) también se traduce.
 * - Avisa con el evento «portadas:idioma» en document cuando cambia el idioma (la portada de la hamburguesa lo usa para redibujar «fire»).
 * Para agregar o corregir un texto: editar la tabla D de abajo (clave = texto en español exacto, sin espacios sobrantes).
 */
(function (global) {
  'use strict';
  var KEY = 'moravi-site-lang';
  var SCOPE = '.cv, .pw, .mosaic__go, [data-idioma]';

  var D = {
    // Portada Brasa Burger
    'Menú': 'Menu', 'Locales': 'Locations', 'Pedir': 'Order', 'Pedir ahora': 'Order now', 'Sabor': 'Flavor', 'a': 'on', 'fuego': 'fire',
    'Hamburguesas a la parrilla, hechas al momento.': 'Grilled burgers, made to order.',
    'Abierto hoy hasta las 11 pm': 'Open today until 11 pm', 'Delivery en 30 min': 'Delivery in 30 min',
    // Polar Gelato
    'Sabores': 'Flavors', 'Pedidos': 'Orders', 'Toca una bola,': 'Tap a scoop,', 'salpica el': 'splash the', 'sabor': 'flavor',
    'Cada toque cambia el sabor': 'Every tap changes the flavor', 'y salpica toda la portada.': 'and splashes the whole cover.', 'Elegir sabor': 'Choose a flavor',
    'Fresa': 'Strawberry', 'Chocolate': 'Chocolate', 'Arándano': 'Blueberry', 'Pistacho': 'Pistachio', 'Mango': 'Mango', 'Limón': 'Lemon',
    'Vainilla': 'Vanilla', 'Dulce de leche': 'Dulce de leche', 'Oreo': 'Oreo',
    // Origen Café
    'Granos': 'Beans', 'Suscripción': 'Subscription', 'Visítanos': 'Visit us', 'Reservar': 'Book', 'Despierta': 'Wake up', 'tus sentidos': 'your senses',
    'Café de origen, tostado cada mañana.': 'Single-origin coffee, roasted every morning.', 'Haz clic y mira caer un grano.': 'Click and watch a bean drop.',
    // Pulse Fit
    'Clases': 'Classes', 'Planes': 'Plans', 'Entrenadores': 'Trainers', 'Únete': 'Join', 'Supera': 'Push', 'tu límite': 'your limit',
    'Cada clic es una repetición. Llega al trofeo y empieza de nuevo.': 'Every click is a rep. Reach the trophy and start again.',
    'Prueba una clase gratis': 'Try a free class', '¡META!': 'FINISH!',
    'Racha': 'Streak', 'días': 'days', 'Calorías': 'Calories', 'Próxima clase': 'Next class', 'Cupos hoy': 'Spots today', 'libres': 'left',
    // Aurea
    'Colección': 'Collection', 'Novias': 'Bridal', 'Contacto': 'Contact', 'Reservar cita': 'Book a visit', 'Joyas con': 'Jewelry with', 'luz propia': 'its own light',
    'Pasa el cursor: la luz hace brillar el oro y la piedra.': 'Move your cursor: the light makes the gold and the stone shine.',
    'Un clic cambia la gema.': 'One click changes the gem.', 'Ver colección': 'View collection', 'Elegir gema': 'Choose a gem',
    'Diamante': 'Diamond', 'Zafiro': 'Sapphire', 'Esmeralda': 'Emerald',
    'Joyas con luz propia': 'Jewelry with its own light',
    // Kicks
    'Hombre': 'Men', 'Mujer': 'Women', 'Novedades': 'New in', 'Ofertas': 'Sale', 'Nueva colección': 'New collection', 'Comprar ahora': 'Shop now',
    // Flora
    'Elige tus flores': 'Pick your flowers', 'Tu ramo está vacío': 'Your bouquet is empty', 'Crear mi ramo': 'Create my bouquet', 'Ramo completo': 'Full bouquet',
    'Rosa': 'Rose', 'Peonía': 'Peony', 'Girasol': 'Sunflower', 'Tulipán': 'Tulip', 'Margarita': 'Daisy', 'Lavanda': 'Lavender',
    // Etiquetas de rubro y descripciones (catálogo de portadas)
    'Hamburguesería': 'Burger joint', 'Heladería': 'Ice cream shop', 'Cafetería': 'Coffee shop', 'Gimnasio': 'Gym', 'Joyería': 'Jewelry', 'Zapatillas': 'Sneakers', 'Florería': 'Flower shop',
    'La hamburguesa se arma sola y se abre con el cursor. Las llamas de «fuego» se inclinan hacia donde lo mueves.': 'The burger builds itself and opens with your cursor. The flames of “fire” lean wherever you move it.',
    'Toca las bolas para cambiar el sabor y salpicar la portada.': 'Tap the scoops to change the flavor and splash the cover.',
    'El vapor se aparta cuando pasas el cursor, los granos flotan con profundidad y cada clic hace caer un grano en el café.': 'The steam parts as your cursor passes, the beans float with depth, and each click drops a bean into the coffee.',
    'Un anillo de actividad con datos del gimnasio alrededor: las calorías y la racha se mueven con cada repetición.': 'An activity ring with gym data around it: calories and streak move with every rep.',
    'Cada gema cambia el color de toda la portada, y la luz del cursor hace brillar la joya y el título.': 'Each gem changes the color of the whole cover, and the cursor’s light makes the jewel and the title shine.',
    'El cursor inclina la zapatilla. Cada clic lanza una onda de color y trae otra.': 'The cursor tilts the sneaker. Each click sends out a wave of color and brings in another.',
    'Toca las flores y arma tu ramo.': 'Tap the flowers and build your bouquet.',
    // Chispita Clean
    'Lavandería': 'Laundry', 'Inicio': 'Home', 'Servicios': 'Services', 'Proceso': 'Process', 'Precios': 'Pricing',
    'Tu ropa limpia,': 'Your clothes clean,', 'sin complicaciones': 'hassle-free',
    'Lavado profesional, secado y planchado, con recojo y entrega a domicilio.': 'Professional washing, drying and ironing, with home pickup and delivery.',
    'Pide tu servicio ahora': 'Order your service now', 'Recojo y entrega a domicilio': 'Home pickup and delivery', 'Lavado profesional y seguro': 'Safe, professional washing', 'Prendas limpias y bien cuidadas': 'Clean, well-cared-for clothes',
    'Una ola de agua gira sin parar alrededor de la ropa. Las burbujas flotan y revientan cuando pasas el cursor o el dedo.': 'A wave of water swirls around the clothes. Bubbles float and pop when your cursor or finger passes over them.',
    // Páginas del catálogo de portadas
    'Catálogo de portadas': 'Interactive covers', 'interactivas': 'catalog',
    'La primera pantalla de un negocio, con vida propia. Cada portada se mueve: pasa el cursor o tócala, y abre la que quieras ver completa.': 'A business’s first screen, alive. Every cover moves: hover or tap it, and open the one you want to see in full.',
    'Ver': 'View', 'Ver portada completa': 'View full cover', 'Pronto habrá más portadas.': 'More covers coming soon.', '← Volver a Moravi Studio': '← Back to Moravi Studio', 'Ver portada completa': 'View full cover',
    '← Catálogo de portadas': '← Covers catalog', '‹ Anterior': '‹ Previous', 'Siguiente ›': 'Next ›',
    'Catálogo de portadas interactivas — Moravi Studio': 'Interactive covers catalog — Moravi Studio', 'Portada — Moravi Studio': 'Cover — Moravi Studio'
  };
  // «Catálogo de portadas <em>interactivas</em>» queda «Interactive covers <em>catalog</em>» (el orden en inglés es otro, por eso el título usa estas dos piezas)

  var PLURAL = { 'rosas': 'roses', 'peonías': 'peonies', 'girasoles': 'sunflowers', 'tulipanes': 'tulips', 'margaritas': 'daisies', 'lavandas': 'lavenders' };

  // Traduce un texto ya sin espacios sobrantes; si no lo conoce, lo devuelve igual
  function tr(s) {
    if (D.hasOwnProperty(s)) return D[s];
    var m;
    if (s.indexOf(' · ') > 0) { return s.split(' · ').map(tr).join(' · '); }          // «Fresa · Pistacho · Vainilla», «2 rosas · Girasol»
    if ((m = /^(\d+) (rosas|peonías|girasoles|tulipanes|margaritas|lavandas)$/.exec(s))) return m[1] + ' ' + PLURAL[m[2]];
    if ((m = /^(\d+) flores elegidas$/.exec(s))) return m[1] + ' flowers picked';
    if ((m = /^(\d+) flores$/.exec(s))) return m[1] + ' flowers';
    if ((m = /^Ver la portada completa: (.+?)( — (.+))?$/.exec(s))) return 'View the full cover: ' + m[1] + (m[3] ? ' — ' + (D[m[3].charAt(0).toUpperCase() + m[3].slice(1)] || m[3]).toLowerCase() : '');
    return s;
  }

  function isEn() { return document.documentElement.getAttribute('lang') === 'en'; }
  function inScope(n) { var e = n.nodeType === 1 ? n : n.parentElement; return !!(e && e.closest && e.closest(SCOPE)); }

  function setText(node, en) {
    var orig = node.__es !== undefined ? node.__es : node.nodeValue, core = orig.trim();
    if (!core) return;
    var out = en ? tr(core) : core;
    if (out === core && node.__es === undefined) return;
    node.__es = orig;
    node.nodeValue = en ? orig.replace(core, out) : orig;
  }
  function setAttr(el, name, en) {
    var cur = el.getAttribute(name); if (cur === null) return;
    var store = '__es_' + name, orig = el[store] !== undefined ? el[store] : cur, out = en ? tr(orig) : orig;
    if (out === cur && el[store] === undefined) return;
    el[store] = orig; el.setAttribute(name, out);
  }
  function setTitle(en) {
    var cur = document.title, orig = document.__estitle !== undefined ? document.__estitle : cur;
    var out = en ? (D[orig] || orig.replace(' — portada interactiva · ', ' — interactive cover · ')) : orig;
    if (out === cur && document.__estitle === undefined) return;
    document.__estitle = orig; document.title = out;
  }

  // Traduce (o restituye) todo el texto de un árbol
  function apply(root, en) {
    if (!root) return;
    if (root.nodeType === 3) { if (inScope(root)) setText(root, en); return; }
    if (root.nodeType !== 1) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = walker.nextNode())) { if (inScope(n)) list.push(n); }
    list.forEach(function (t) { setText(t, en); });
    var els = [].slice.call(root.querySelectorAll('[aria-label],[title]')); els.push(root);
    els.forEach(function (e) { if (inScope(e)) { setAttr(e, 'aria-label', en); setAttr(e, 'title', en); } });
  }
  function refresh(root) { apply(root || document.body, isEn()); }

  function onLang() {
    var en = isEn();
    apply(document.body, en); setTitle(en);
    document.dispatchEvent(new CustomEvent('portadas:idioma', { detail: { lang: en ? 'en' : 'es' } }));
  }

  // Las páginas del catálogo de portadas no tienen el selector: siguen el idioma que la persona eligió en la web
  if (!document.querySelector('script[src*="i18n.js"]')) {
    try { var st = localStorage.getItem(KEY); if (st === 'en' || st === 'es') document.documentElement.setAttribute('lang', st); } catch (e) { /* sin almacenamiento: queda en español */ }
  }

  // Todo lo que se agregue después (las portadas se arman y escriben solas) se traduce al aparecer, solo si el idioma es inglés
  new MutationObserver(function (muts) {
    if (!isEn()) return;
    muts.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) { apply(n, true); }); });
  }).observe(document.documentElement, { childList: true, subtree: true });
  // Cambio de idioma con el selector
  new MutationObserver(onLang).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  function start() { if (isEn()) { apply(document.body, true); setTitle(true); document.dispatchEvent(new CustomEvent('portadas:idioma', { detail: { lang: 'en' } })); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  global.PortadasIdioma = { tr: tr, isEn: isEn, refresh: refresh };
})(window);
