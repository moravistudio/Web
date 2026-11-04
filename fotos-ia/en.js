/*
 * Mejora tus fotos con IA (/fotos-ia/): textos en inglés + selector ES | EN.
 * Usa la misma clave de idioma del sitio (ver ../catalogo-demos/nucleo/idioma.js).
 */
(function () {
  'use strict';
  var I = window.Idioma; if (!I) return;
  var en = I.actual() === 'en';
  I.registrar({
    d: {
      "← Volver a Moravi Studio": "← Back to Moravi Studio",
      "Mejora tus fotos": "Upgrade your photos",
      "con IA": "with AI",
      "Tomamos las fotos que ya tienes de tus productos y mejoramos la luz, el encuadre y el fondo con inteligencia artificial, para que se vean profesionales en tus redes, tu catálogo o tu tienda online.": "We take the photos you already have of your products and improve the light, framing and background with artificial intelligence, so they look professional on your social media, your catalog or your online store.",
      "Los ejemplos de abajo son trabajos de muestra hechos por Moravi Studio, no de clientes.": "The examples below are sample work made by Moravi Studio, not client work.",
      "Quiero mejorar mis fotos": "I want to improve my photos",
      "o mira los ejemplos aquí abajo": "or see the examples below",
      "Antes y después": "Before and after",
      "Desliza la barra para comparar la foto original con la mejorada.": "Slide the bar to compare the original photo with the improved one.",
      "Antes": "Before",
      "Después": "After",
      "Comparar antes y después": "Compare before and after",
      "Pastelería": "Bakery",
      "Torta rosada con lazo, foto original": "Pink cake with a bow, original photo",
      "Torta rosada con lazo, foto mejorada": "Pink cake with a bow, improved photo",
      "Torta de Paw Patrol, foto original": "Paw Patrol cake, original photo",
      "Torta de Paw Patrol, foto mejorada": "Paw Patrol cake, improved photo",
      "Torta de lazo rosado": "Pink bow cake",
      "Pastel de dos pisos": "Two-tier cake",
      "La foto original tenía un fondo recargado y poca luz. Cambiamos el ambiente y conservamos el lazo, la silueta, las perlas doradas y el nombre de la torta.": "The original photo had a cluttered background and little light. We changed the setting and kept the bow, the silhouette, the golden pearls and the name on the cake.",
      "Torta Paw Patrol": "Paw Patrol cake",
      "Cumpleaños infantil": "Kid's birthday",
      "De una foto simple sobre fondo liso a una escena de fiesta, sin tocar las figuras, el número 2 ni el nombre de la torta.": "From a simple photo on a plain background to a party scene, without touching the figures, the number 2 or the name on the cake.",
      "Luz y color": "Light and color",
      "Fondo nuevo": "New background",
      "Producto conservado": "Product preserved",
      "Qué incluye": "What is included",
      "Mejoramos la iluminación y el equilibrio de color.": "We improve the lighting and the color balance.",
      "Encuadre y composición": "Framing and composition",
      "Un encuadre más cuidado y una composición que favorece a tu producto.": "Better framing and a composition that shows off your product.",
      "Fondo y ambiente": "Background and setting",
      "Un fondo y una ambientación acordes al tipo y al estilo de tu producto.": "A background and setting that suit your product type and style.",
      "Tu producto, intacto": "Your product, intact",
      "Cuidamos su forma, colores, textos y decoraciones, y revisamos cada resultado antes de enviártelo.": "We care for its shape, colors, text and decorations, and review each result before sending it to you.",
      "Listas para pantalla": "Ready for screens",
      "Para Instagram, Facebook, WhatsApp, catálogos y tiendas online. No están pensadas para imprimir en gran formato.": "For Instagram, Facebook, WhatsApp, catalogs and online stores. Not intended for large-format printing.",
      "Una ronda de ajustes": "One round of adjustments",
      "Revisas las vistas previas y pides los cambios razonables de cada foto.": "You review the previews and ask for reasonable changes to each photo.",
      "Paquetes": "Packages",
      "Precios de lanzamiento, en soles peruanos. Valen para fotos de dificultad normal o media; si una foto necesita una reconstrucción compleja, te lo decimos y la cotizamos antes de empezar. Desde otros países, el precio se cotiza al momento de pedirlo.": "Launch prices, in Peruvian soles. They apply to photos of normal or medium difficulty; if a photo needs complex reconstruction, we tell you and quote it before starting. From other countries, the price is quoted when you ask for it.",
      "Elegir este pack": "Choose this pack",
      "Cómo trabajamos": "How we work",
      "Eliges tu paquete": "You choose your package",
      "Nos escribes qué productos quieres mejorar y nos envías tus fotos originales, en el mayor tamaño que tengas.": "You write to us about which products you want to improve and send your original photos, in the largest size you have.",
      "Pagas el 50 % y empezamos": "You pay 50% and we start",
      "Con tu adelanto reservamos tu trabajo y comenzamos la producción.": "With your advance payment we reserve your job and start production.",
      "Revisas las vistas previas": "You review the previews",
      "Te compartimos un enlace privado con tus fotos con marca de agua. Pides tu ronda de ajustes.": "We share a private link with your watermarked photos. You request your round of adjustments.",
      "Pagas el saldo y recibes tus fotos": "You pay the balance and get your photos",
      "Con el 50 % restante te entregamos los archivos finales, sin marca de agua.": "With the remaining 50% we deliver the final files, without a watermark.",
      "Preguntas frecuentes": "Frequently asked questions",
      "¿La IA cambia mi producto?": "Does the AI change my product?",
      "Nuestro objetivo es que tu producto se vea como es: conservamos su forma, colores, textos y decoraciones, y revisamos cada resultado. Como la IA puede alterar pequeños detalles, no prometemos una copia idéntica en todos los casos; si tu foto tiene limitaciones, te lo decimos antes de empezar.": "Our goal is for your product to look as it is: we keep its shape, colors, text and decorations, and review every result. Since AI can alter small details, we do not promise an identical copy in every case; if your photo has limitations, we tell you before we start.",
      "¿Qué productos puedo enviar?": "What products can I send?",
      "Tortas, postres, platos de comida, productos de tienda, cosméticos, accesorios, decoración y más. Primero revisamos tus fotos para confirmar que sirvan.": "Cakes, desserts, dishes, shop products, cosmetics, accessories, decoration and more. We review your photos first to confirm they will work.",
      "¿Tengo que llevar mis productos?": "Do I have to bring my products?",
      "No. El servicio es a distancia: nos envías tus fotos y nosotros hacemos el resto.": "No. The service is remote: you send us your photos and we do the rest.",
      "¿Cómo veo las fotos antes de pagar el saldo?": "How do I see the photos before paying the balance?",
      "Con un enlace privado de Google Drive donde están tus fotos con una marca de agua visible. Los archivos finales, sin marca, te los entregamos al pagar el saldo.": "Through a private Google Drive link with your photos carrying a visible watermark. We deliver the final files, without a watermark, once you pay the balance.",
      "¿Sirven para imprimir en gran formato?": "Are they good for large-format printing?",
      "Están pensadas para pantalla: redes sociales, catálogos y tiendas online. Si necesitas imprimir, cuéntanoslo antes de contratar para evaluarlo.": "They are made for screens: social media, catalogs and online stores. If you need to print, tell us before hiring so we can assess it.",
      "¿Cuánto demora?": "How long does it take?",
      "Depende de cuántas fotos son y de qué tan complejas sean. Después de ver tus fotos te confirmamos el plazo.": "It depends on how many photos there are and how complex they are. After seeing your photos we confirm the timeline.",
      "¿Atienden fuera de Perú?": "Do you serve clients outside Peru?",
      "Sí, atendemos clientes de Perú y de otros países de Latinoamérica. Fuera de Perú, el precio y el medio de pago se confirman al cotizar.": "Yes, we serve clients in Peru and other Latin American countries. Outside Peru, the price and the payment method are confirmed when we quote.",
      "¿Tienes fotos para mejorar?": "Do you have photos to improve?",
      "Envíanos una y te contamos qué resultado es posible.": "Send us one and we will tell you what result is possible.",
      "Escríbenos por WhatsApp": "Message us on WhatsApp",
      "Pack pequeño": "Small pack",
      "6 fotos": "6 photos",
      "S/ 13.17 por foto": "S/ 13.17 per photo",
      "Pack emprendedor": "Entrepreneur pack",
      "12 fotos": "12 photos",
      "S/ 10.75 por foto": "S/ 10.75 per photo",
      "Pack negocio": "Business pack",
      "20 fotos": "20 photos",
      "S/ 9.45 por foto": "S/ 9.45 per photo",
      "Pack comercial": "Commercial pack",
      "30 fotos": "30 photos",
      "S/ 8.63 por foto": "S/ 8.63 per photo",
      "Diseño web y landing pages pensadas para ayudarte a destacar y vender más.": "Web design and landing pages built to help you stand out and sell more.",
      "Inicio": "Home",
      "Proyectos": "Projects",
      "Servicios": "Services",
      "Productos": "Products",
      "Contacto": "Contact",
      "Política de privacidad": "Privacy policy",
      "Términos y condiciones": "Terms and conditions",
      "Suscripciones y reembolsos": "Subscriptions and refunds",
      "Condiciones de Catálogo Online": "Online Catalog terms",
      "Condiciones de MS Video Downloader": "MS Video Downloader terms",
      "© 2026 Moravi Studio. Todos los derechos reservados.": "© 2026 Moravi Studio. All rights reserved.",
      "Idioma": "Language"
    },
    t: [[/^Mejora tus fotos con IA/, 'Upgrade your photos with AI']]
  });
  var H = { '../privacidad.html': '../privacy-policy.html', '../terminos.html': '../terms-and-conditions.html', '../suscripciones.html': '../subscriptions-and-refunds.html', '../catalogo-condiciones.html': '../online-catalog-terms.html', '../video-downloader-condiciones.html': '../video-downloader-terms.html' };
  document.addEventListener('DOMContentLoaded', function () {
    var slot = document.getElementById('idioma-slot'); if (slot) { slot.innerHTML = I.selector('idioma'); I.enlazar(slot); }
    if (!en) return;
    [].forEach.call(document.querySelectorAll('a[href]'), function (a) {
      var h = a.getAttribute('href'); if (H[h]) a.setAttribute('href', H[h]);
      var w = a.getAttribute('data-wa'); if (w) a.setAttribute('href', 'https://wa.me/51940284018?text=' + encodeURIComponent(w));
    });
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', 'We improve your product photos with artificial intelligence: more light, a better background and a professional look. See before-and-after examples and the packages.');
  });
})();
