/*
 * Portafolio de catálogos (/catalogo-demos/): textos en inglés + selector ES | EN.
 * La elección se guarda con la misma clave del sitio y la heredan las tres muestras (ver nucleo/idioma.js).
 */
(function () {
  'use strict';
  var I = window.Idioma; if (!I) return;
  var en = I.actual() === 'en';
  I.registrar({
    d: {
      '← Volver a Moravi Studio': "← Back to Moravi Studio",
      'Elige cómo quieres': "Choose how you want to", 'mostrar tus productos': "show your products",
      'Tres catálogos de ejemplo, cada uno armado de otra manera. Ábrelos, busca un producto, agrégalo al pedido y llega hasta el pago, como lo haría un cliente tuyo.': "Three sample catalogs, each built in a different way. Open them, look for a product, add it to the order and go all the way to checkout, just as one of your customers would.",
      'Los negocios y los productos de estos ejemplos son inventados. El pago es una simulación: no se cobra nada y no se envía nada a nadie.': "The businesses and products in these examples are made up. Payment is a simulation: nothing is charged and nothing is sent to anyone.",
      'Quiero mi catálogo': "I want my catalog", 'o mira las muestras aquí abajo': "or see the samples below",
      'Tres maneras de ordenar un catálogo': "Three ways to organize a catalog",
      'Cuadrícula y página de producto': "Grid and product page", 'Cuadrícula y ventana central': "Grid and central window", 'Lista de pedido rápido': "Quick-order list",
      'Carteras y calzado': "Handbags and footwear", 'Perfumes y belleza': "Perfumes and beauty", 'Ferretería y hogar': "Hardware and home",
      'Fotos grandes en cuadrícula. Al tocar un producto se abre su página completa, con colores, tallas y productos parecidos.': "Large photos in a grid. Tapping a product opens its full page, with colors, sizes and similar products.",
      'El cliente no sale de la pantalla: el producto se abre en una ventana al centro, con su tamaño, la cantidad y la opción de guardarlo en favoritos.': "The customer never leaves the screen: the product opens in a window in the center, with its size, quantity and the option to save it to favorites.",
      'Para quien compra seguido y sabe lo que busca: un producto por fila, con su presentación y su cantidad, y el pedido siempre a la vista.': "For people who buy often and know what they want: one product per row, with its format and quantity, and the order always in view.",
      'Ideal para:': "Ideal for:",
      'moda, calzado y accesorios con varios colores y tallas.': "fashion, footwear and accessories with several colors and sizes.",
      'perfumería, belleza y regalos, donde la presentación importa.': "perfumery, beauty and gifts, where presentation matters.",
      'ferreterías y tiendas con muchos productos y clientes que compran seguido.': "hardware stores and shops with many products and customers who buy often.",
      'Color y talla': "Color and size", 'Página por producto': "Page per product", 'Carrito lateral': "Side cart",
      'Ventana de producto': "Product window", 'Tamaños y precios': "Sizes and prices", 'Favoritos': "Favorites",
      'Búsqueda por código': "Search by code", 'Pedido siempre visible': "Order always visible", 'Envío gratis desde S/ 300': "Free shipping from S/ 300",
      'Ver muestra': "View sample",
      'Abrir la muestra Azahar': "Open the Azahar sample", 'Abrir la muestra Rosaleda': "Open the Rosaleda sample", 'Abrir la muestra Casa Firme': "Open the Casa Firme sample",
      'Vista de la muestra Azahar: portada con un bolso y botines de cuero, y debajo el catálogo en cuadrícula': "View of the Azahar sample: cover with a leather bag and ankle boots, and the grid catalog below",
      'Vista de la muestra Rosaleda: portada con frascos de perfume rosados y debajo el catálogo': "View of the Rosaleda sample: cover with pink perfume bottles and the catalog below",
      'Vista de la muestra Casa Firme: lista de productos con foto, precio y botón de agregar, y el pedido a la derecha': "View of the Casa Firme sample: product list with photo, price and an add button, and the order on the right",
      'Todos los catálogos incluyen': "Every catalog includes",
      'Carrito de compras': "Shopping cart", 'El cliente arma su pedido y ve el total al instante.': "The customer builds their order and sees the total instantly.",
      'Detalle de cada producto': "Details for each product", 'Fotos, descripción, ficha técnica y opciones.': "Photos, description, specifications and options.",
      'Pago dentro del catálogo': "Payment inside the catalog", 'Sin salir de tu página, con una pasarela de pagos.': "Without leaving your page, with a payment gateway.",
      'Hecho para el celular': "Built for mobile", 'Se ve y se usa bien en teléfono, tableta y computadora.': "Looks and works well on phone, tablet and computer.",
      'Buscador y categorías': "Search and categories", 'Tus clientes encuentran rápido lo que buscan.': "Your customers quickly find what they are looking for.",
      'Tu marca, tus fotos': "Your brand, your photos", 'Tu logo, tus colores y tus textos, no los del ejemplo.': "Your logo, your colors and your texts, not the ones from the example.",
      'De tus productos a tu catálogo en 4 pasos': "From your products to your catalog in 4 steps",
      'Eliges el que más se parece': "You pick the closest one", 'Nos dices cuál de los ejemplos te gusta y qué le cambiarías.': "Tell us which example you like and what you would change.",
      'Nos envías tus productos': "You send us your products", 'Fotos, nombres, precios y presentaciones, tal como los tengas.': "Photos, names, prices and formats, just as you have them.",
      'Lo armamos con tu marca': "We build it with your brand", 'Con tus colores, tu logo y tus textos. Te damos un enlace privado para que lo pruebes y pidas cambios.': "With your colors, your logo and your texts. We give you a private link so you can try it and ask for changes.",
      'Lo instalamos en tu web': "We install it on your website", 'Con tu aprobación queda dentro de tu página, vendiendo a cualquier hora.': "With your approval it goes live inside your site, selling at any hour.",
      'Preguntas frecuentes': "Frequently asked questions",
      '¿Necesito tener una página web?': "Do I need to have a website?", 'El catálogo vive dentro de la página de tu negocio. Si todavía no tienes una, también hacemos páginas web.': "The catalog lives inside your business website. If you don't have one yet, we also build websites.",
      '¿Se puede adaptar a mi marca?': "Can it be adapted to my brand?", 'Sí, y lo hacemos nosotros. Armamos el catálogo con tu logo, tus colores, tus fotos y tus textos; tú no tocas código ni necesitas ningún programa. Lo que elijas de los ejemplos es la forma de recorrerlo.': "Yes, and we do it for you. We build the catalog with your logo, colors, photos and texts; you don't touch any code or need any software. What you choose from the examples is the way it is browsed.",
      '¿Mis clientes pueden pagar dentro del catálogo?': "Can my customers pay inside the catalog?", 'Las muestras simulan el recorrido completo: pedido, datos de entrega y pago. En tu catálogo el pago se conecta a una pasarela de pagos, con tarjeta y las billeteras que esa pasarela acepte en tu país. Lo vemos contigo antes de empezar.': "The samples simulate the whole journey: order, delivery details and payment. In your catalog, payment connects to a payment gateway, with cards and the wallets that gateway accepts in your country. We go over it with you before starting.",
      '¿Funciona bien en el celular?': "Does it work well on mobile?", 'Sí. Los tres ejemplos se adaptan al celular, a la tableta y a la computadora. Ábrelos desde tu teléfono para verlo.': "Yes. All three examples adapt to phones, tablets and computers. Open them on your phone to see.",
      '¿Quién actualiza los productos y los precios?': "Who updates the products and prices?", 'Nos escribes y lo actualizamos por ti. No tienes que aprender ningún panel.': "You message us and we update it for you. You don't have to learn any dashboard.",
      '¿Qué necesito para empezar?': "What do I need to get started?", 'Las fotos de tus productos, sus nombres, sus precios y, si las tienen, sus presentaciones: tallas, tamaños o colores.': "Photos of your products, their names, their prices and, if they have them, their options: sizes, formats or colors.",
      '¿Y si no tengo buenas fotos de mis productos?': "What if I don't have good photos of my products?", 'Cuéntanoslo: también hacemos fotografía de productos, así que no necesitas llegar con todo listo.': "Tell us: we also do product photography, so you don't need to arrive with everything ready.",
      '¿Puedo verlo antes de que se publique?': "Can I see it before it goes live?", 'Sí. Te damos un enlace privado para que lo pruebes y nos pidas los cambios antes de publicarlo.': "Yes. We give you a private link so you can try it and ask for changes before it is published.",
      '¿Cuánto cuesta y cuánto tarda?': "How much does it cost and how long does it take?", 'Se cotiza según la cantidad de productos y las funciones que necesites. Escríbenos y te respondemos con una propuesta; el tiempo depende de cuándo nos envíes tus productos y fotos.': "It is quoted according to the number of products and the features you need. Message us and we will reply with a proposal; the timing depends on when you send us your products and photos.",
      '¿Tu negocio es otro?': "Is your business different?", 'Cuéntanos qué vendes y te mostramos cómo se vería con tus productos.': "Tell us what you sell and we will show you how it would look with your products.", 'Cuéntanos tu caso': "Tell us your case",
      'Diseño web y landing pages pensadas para ayudarte a destacar y vender más.': "Web design and landing pages built to help you stand out and sell more.",
      'Inicio': "Home", 'Proyectos': "Projects", 'Servicios': "Services", 'Productos': "Products", 'Contacto': "Contact",
      'Política de privacidad': "Privacy policy", 'Términos y condiciones': "Terms and conditions", 'Suscripciones y reembolsos': "Subscriptions and refunds",
      'Condiciones de Catálogo Online': "Online Catalog terms", 'Condiciones de MS Video Downloader': "MS Video Downloader terms",
      '© 2026 Moravi Studio. Todos los derechos reservados.': "© 2026 Moravi Studio. All rights reserved.",
      'Idioma': "Language"
    },
    t: [[/^Catálogos para tu negocio/, 'Catalogs for your business']]
  });
  var H = { '../privacidad.html': '../privacy-policy.html', '../terminos.html': '../terms-and-conditions.html', '../suscripciones.html': '../subscriptions-and-refunds.html', '../catalogo-condiciones.html': '../online-catalog-terms.html', '../video-downloader-condiciones.html': '../video-downloader-terms.html' };
  var WA = { es: 'Hola%20Moravi%20Studio%2C%20quiero%20un%20cat%C3%A1logo%20para%20mi%20negocio', en: 'Hi%20Moravi%20Studio%2C%20I%20want%20a%20catalog%20for%20my%20business' };
  document.addEventListener('DOMContentLoaded', function () {
    var slot = document.getElementById('idioma-slot'); if (slot) { slot.innerHTML = I.selector('idioma'); I.enlazar(slot); }
    if (!en) return;
    [].forEach.call(document.querySelectorAll('a[href]'), function (a) {
      var h = a.getAttribute('href'); if (H[h]) a.setAttribute('href', H[h]);
      if (h.indexOf('wa.me/') >= 0 && h.indexOf('text=') >= 0) a.setAttribute('href', h.replace(/text=[^&]*/, 'text=' + WA.en));
    });
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', 'Three sample catalogs from Moravi Studio, each built in a different way. Open them and go through the order just as one of your customers would.');
  });
})();
