/*
 * English version of the demo button chatbots (see flujos-demo.js). Same node ids and structure as the Spanish flows.
 * The three businesses are EXAMPLES: they don't exist, have no brand, and the prices are made up for the demonstration.
 * All three close inside the chat with a summary: nothing is sent to anyone.
 */
(function (global) {
  'use strict';
  var MENU = { l: 'Back to menu', ir: 'inicio' };
  var UI = { nuevo: 'New conversation', enviar: 'Send', placeholder: 'Type your question or pick an option…', tuMensaje: 'Your message', abierto: '🟢 Open now', cerrado: '🔴 Closed now' };

  // Level 1 · Informational: buttons only, answers the usual questions
  var belleza = {
    ui: UI, titulo: 'Example beauty center', sub: 'Button chatbot · informational',
    pie: 'Moravi Studio example: made-up business and prices.',
    inicio: 'inicio', libre: false, horario: { dias: [1, 2, 3, 4, 5, 6], desde: 9, hasta: 20 },
    nodos: {
      inicio: { t: 'Hi! 👋 I\'m the assistant of the example beauty center.\n{{abierto}}\nWhat would you like to know?', b: [
        { l: 'Hair', ir: 'cabello' }, { l: 'Nails and brows', ir: 'unas' },
        { l: 'Hours and address', ir: 'horario' }, { l: 'How to book', ir: 'reservar' }] },
      cabello: { t: 'Hair services:\n• Cut and styling: S/ 45\n• Full color: S/ 120\n• Hydration treatment: S/ 80\n\n(Prices made up for the demonstration)', b: [
        { l: 'See nails and brows', ir: 'unas' }, { l: 'How to book', ir: 'reservar' }, MENU] },
      unas: { t: 'Nails and brows:\n• Manicure: S/ 35\n• Pedicure: S/ 45\n• Brow shaping: S/ 25\n\n(Prices made up for the demonstration)', b: [
        { l: 'See hair', ir: 'cabello' }, { l: 'How to book', ir: 'reservar' }, MENU] },
      horario: { t: '🕘 We\'re open Monday to Saturday, 9:00 to 20:00. Closed on Sundays.\n\n📍 123 Example Ave., Lima (made-up address).', b: [{ l: 'How to book', ir: 'reservar' }, MENU] },
      reservar: { t: 'Booking is simple: reception only needs to know which service you want and which day suits you.\n\nIn this example there is no reception; in your business, the bot would receive those details.', b: [
        { l: 'See hair services', ir: 'cabello' }, { l: 'See nails and brows', ir: 'unas' }, MENU] }
    }
  };

  // Level 2 · With orders: the customer chooses and the bot builds the summary
  var pasteleria = {
    ui: UI, titulo: 'Example bakery', sub: 'Button chatbot · builds the order',
    pie: 'Moravi Studio example: made-up business and prices. Nothing is sent to anyone.',
    inicio: 'inicio', libre: false,
    nodos: {
      inicio: { t: 'Hi! 👋 I\'m the assistant of the example bakery.\nWhat would you like to order?', b: [
        { l: 'Cakes', ir: 'tortas' }, { l: 'Cupcakes and desserts', ir: 'postres' }] },
      tortas: { t: 'Our cakes (baked to order). Which flavor?', b: [
        { l: 'Chocolate', set: { producto: 'Chocolate cake' }, ir: 'tamano' },
        { l: 'Vanilla with strawberries', set: { producto: 'Vanilla cake with strawberries' }, ir: 'tamano' },
        { l: 'Tres leches', set: { producto: 'Tres leches cake' }, ir: 'tamano' }, MENU] },
      tamano: { t: 'You chose: {{producto}}.\nWhat size do you want?', b: [
        { l: 'Small (8 servings) · S/ 75', set: { tam: 'Small (8 servings)', precio: 'S/ 75' }, ir: 'fecha' },
        { l: 'Medium (15 servings) · S/ 120', set: { tam: 'Medium (15 servings)', precio: 'S/ 120' }, ir: 'fecha' },
        { l: 'Large (25 servings) · S/ 185', set: { tam: 'Large (25 servings)', precio: 'S/ 185' }, ir: 'fecha' }] },
      postres: { t: 'Available cupcakes and desserts:', b: [
        { l: 'Cupcakes, box of 6 · S/ 36', set: { producto: 'Cupcakes', tam: 'Box of 6', precio: 'S/ 36' }, ir: 'fecha' },
        { l: 'Strawberry cheesecake · S/ 70', set: { producto: 'Strawberry cheesecake', tam: 'Whole (10 servings)', precio: 'S/ 70' }, ir: 'fecha' },
        { l: 'Alfajores, box of 12 · S/ 30', set: { producto: 'Alfajores', tam: 'Box of 12', precio: 'S/ 30' }, ir: 'fecha' }, MENU] },
      fecha: { t: 'When do you need it?\nEverything is made to order, with 24 hours\' notice.', b: [
        { l: 'Tomorrow', set: { fecha: 'Tomorrow' }, ir: 'entrega' }, { l: 'In 2 days', set: { fecha: 'In 2 days' }, ir: 'entrega' },
        { l: 'In 3 days or more', set: { fecha: 'In 3 days or more' }, ir: 'entrega' }] },
      entrega: { t: 'How should we get it to you?', b: [
        { l: 'Home delivery', set: { entrega: 'Home delivery' }, ir: 'resumen' }, { l: 'I\'ll pick it up at the bakery', set: { entrega: 'Bakery pickup' }, ir: 'resumen' }] },
      resumen: { t: 'Done, here\'s your order:', caja: 'Your order', cajaT: 'Order: {{producto}}\nSize: {{tam}}\nPrice: {{precio}}\nFor: {{fecha}}\nDelivery: {{entrega}}', b: [
        { l: 'Confirm order', ir: 'confirmado' }, { l: 'Start over', ir: 'inicio' }] },
      confirmado: { t: '✅ Order noted!\n\nThis is an example: nothing was sent to anyone. In a real bakery, the business would receive the complete order, with the delivery date, and wouldn\'t have to ask you anything else.', b: [{ l: 'Build another order', ir: 'inicio' }] }
    }
  };

  // Level 3 · Conversational: buttons + recognizes typed words + says whether it's open
  var lavanderia = {
    ui: UI, titulo: 'Example laundry service', sub: 'Button chatbot · understands words',
    pie: 'Moravi Studio example: made-up business and prices. Nothing is sent to anyone.',
    inicio: 'inicio', libre: true, horario: { dias: [1, 2, 3, 4, 5, 6], desde: 8, hasta: 20 },
    palabras: [
      { k: ['price', 'prices', 'cost', 'how much', 'rate', 'fee', 'precio', 'cuesta', 'cuanto'], ir: 'precios' },
      { k: ['hours', 'open', 'close', 'closing', 'schedule', 'what time', 'horario', 'abierto'], ir: 'horario' },
      { k: ['pickup', 'pick up', 'pick-up', 'collect', 'delivery', 'order', 'book', 'service', 'recojo', 'pedir'], ir: 'servicio' },
      { k: ['district', 'area', 'zone', 'coverage', 'where', 'distrito', 'zona', 'cobertura'], ir: 'cobertura' },
      { k: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'hola', 'buenas'], ir: 'inicio' },
      { k: ['sneaker', 'shoes', 'duvet', 'comforter', 'curtain', 'coat', 'jacket', 'zapatilla', 'edredon'], ir: 'especiales' }
    ],
    nodos: {
      inicio: { t: 'Hi! 👋 I\'m the assistant of the example laundry service.\n{{abierto}}\nPick an option or type your question (for example: “how much does it cost?” or “what time do you close?”).', b: [
        { l: 'Prices', ir: 'precios' }, { l: 'Hours', ir: 'horario' }, { l: 'Request home pickup', ir: 'servicio' }, { l: 'Coverage areas', ir: 'cobertura' }] },
      precios: { t: 'Our prices (made up for the demonstration):\n• Wash by the kilo: S/ 6 per kilo\n• Wash + ironing: S/ 9 per kilo\n• Special items (jackets, duvets): S/ 8 per item\n\nPickup and home delivery are free.', b: [{ l: 'Request home pickup', ir: 'servicio' }, MENU] },
      horario: { t: '{{abierto}}\n\nWe\'re open Monday to Saturday, 8:00 to 20:00. Closed on Sundays.', b: [{ l: 'Request home pickup', ir: 'servicio' }, MENU] },
      cobertura: { t: 'We pick up in Miraflores, San Isidro, Surco and San Borja (made-up areas).', b: [{ l: 'Request home pickup', ir: 'servicio' }, MENU] },
      especiales: { t: 'Special items (jackets, coats, duvets, curtains, sneakers) are charged per item: from S/ 8 (made-up price).', b: [{ l: 'Request home pickup', ir: 'servicio' }, MENU] },
      servicio: { t: 'Happy to help. Which service do you need?', b: [
        { l: 'Wash by the kilo', set: { servicio: 'Wash by the kilo' }, ir: 'distrito' }, { l: 'Wash + ironing', set: { servicio: 'Wash + ironing' }, ir: 'distrito' },
        { l: 'Special items', set: { servicio: 'Special items' }, ir: 'distrito' }] },
      distrito: { t: 'Which district should we pick up from?', b: [
        { l: 'Miraflores', set: { distrito: 'Miraflores' }, ir: 'dia' }, { l: 'San Isidro', set: { distrito: 'San Isidro' }, ir: 'dia' },
        { l: 'Surco', set: { distrito: 'Surco' }, ir: 'dia' }, { l: 'San Borja', set: { distrito: 'San Borja' }, ir: 'dia' }] },
      dia: { t: 'Which day suits you best?', b: [
        { l: 'Today', set: { dia: 'Today' }, ir: 'resumen' }, { l: 'Tomorrow', set: { dia: 'Tomorrow' }, ir: 'resumen' }, { l: 'Day after tomorrow', set: { dia: 'Day after tomorrow' }, ir: 'resumen' }] },
      resumen: { t: 'Here\'s what I noted:', caja: 'Pickup request', cajaT: 'Service: {{servicio}}\nDistrict: {{distrito}}\nDay: {{dia}}', b: [
        { l: 'Confirm request', ir: 'confirmado' }, { l: 'Start over', ir: 'inicio' }] },
      confirmado: { t: '✅ Request noted!\n\nThis is an example: nothing was sent to anyone. In a real laundry service, the owner would receive this notice and confirm the pickup time with you.', b: [{ l: 'Make another request', ir: 'inicio' }] },
      noentendi: { t: 'I\'m not sure I understood 🙂 This bot recognizes words like “price”, “hours”, “pickup” or “areas”. Pick an option:', b: [
        { l: 'Prices', ir: 'precios' }, { l: 'Hours', ir: 'horario' }, { l: 'Request home pickup', ir: 'servicio' }, { l: 'Coverage areas', ir: 'cobertura' }] }
    }
  };

  global.FLUJOS_DEMO_EN = { belleza: belleza, pasteleria: pasteleria, lavanderia: lavanderia };
})(window);
