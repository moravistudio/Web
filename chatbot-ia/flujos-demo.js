/*
 * Flujos de los chatbots de botones de demostración (sin IA, sin WhatsApp, sin servidor).
 * Los tres negocios son de EJEMPLO: no existen, no tienen marca y los precios son inventados para la demostración.
 * Los tres cierran dentro del mismo chat con un resumen: no se envía nada a nadie.
 */
(function (global) {
  'use strict';
  var MENU = { l: 'Volver al menú', ir: 'inicio' };

  // Nivel 1 · Informativo: solo botones, resuelve las preguntas de siempre
  var belleza = {
    titulo: 'Centro de belleza de ejemplo', sub: 'Chatbot con botones · informativo',
    pie: 'Ejemplo de Moravi Studio: negocio y precios inventados.',
    inicio: 'inicio', libre: false, horario: { dias: [1, 2, 3, 4, 5, 6], desde: 9, hasta: 20 },
    nodos: {
      inicio: { t: '¡Hola! 👋 Te atiende el asistente del Centro de belleza de ejemplo.\n{{abierto}}\n¿Qué quieres consultar?', b: [
        { l: 'Cabello', ir: 'cabello' }, { l: 'Uñas y cejas', ir: 'unas' },
        { l: 'Horario y dirección', ir: 'horario' }, { l: 'Cómo reservar', ir: 'reservar' }] },
      cabello: { t: 'Servicios para el cabello:\n• Corte y peinado: S/ 45\n• Tinte completo: S/ 120\n• Tratamiento de hidratación: S/ 80\n\n(Precios inventados para la demostración)', b: [
        { l: 'Ver uñas y cejas', ir: 'unas' }, { l: 'Cómo reservar', ir: 'reservar' }, MENU] },
      unas: { t: 'Uñas y cejas:\n• Manicure: S/ 35\n• Pedicure: S/ 45\n• Diseño de cejas: S/ 25\n\n(Precios inventados para la demostración)', b: [
        { l: 'Ver cabello', ir: 'cabello' }, { l: 'Cómo reservar', ir: 'reservar' }, MENU] },
      horario: { t: '🕘 Abrimos de lunes a sábado, de 9:00 a 20:00. Los domingos descansamos.\n\n📍 Av. Ejemplo 123, Lima (dirección inventada).', b: [{ l: 'Cómo reservar', ir: 'reservar' }, MENU] },
      reservar: { t: 'Reservar es simple: la recepción solo necesita saber qué servicio quieres y qué día te acomoda.\n\nEn este ejemplo no hay recepción; en tu negocio, el bot recibiría esos datos.', b: [
        { l: 'Ver servicios de cabello', ir: 'cabello' }, { l: 'Ver uñas y cejas', ir: 'unas' }, MENU] }
    }
  };

  // Nivel 2 · Con pedido: el cliente elige y el bot arma el resumen
  var ropa = {
    titulo: 'Boutique de ropa de ejemplo', sub: 'Chatbot con botones · arma el pedido',
    pie: 'Ejemplo de Moravi Studio: negocio y precios inventados. No se envía nada a nadie.',
    inicio: 'inicio', libre: false,
    nodos: {
      inicio: { t: '¡Hola! 👋 Soy el asistente de la Boutique de ropa de ejemplo.\n¿Qué prenda te interesa?', b: [
        { l: 'Polos', ir: 'polos' }, { l: 'Pantalones', ir: 'pantalones' }, { l: 'Casacas', ir: 'casacas' }] },
      polos: { t: 'Polos disponibles:', b: [
        { l: 'Polo básico · S/ 39', set: { prenda: 'Polo básico', precio: 'S/ 39' }, ir: 'talla' },
        { l: 'Polo estampado · S/ 49', set: { prenda: 'Polo estampado', precio: 'S/ 49' }, ir: 'talla' }, MENU] },
      pantalones: { t: 'Pantalones disponibles:', b: [
        { l: 'Jean clásico · S/ 119', set: { prenda: 'Jean clásico', precio: 'S/ 119' }, ir: 'talla' },
        { l: 'Jogger · S/ 89', set: { prenda: 'Jogger', precio: 'S/ 89' }, ir: 'talla' }, MENU] },
      casacas: { t: 'Casacas disponibles:', b: [
        { l: 'Casaca de jean · S/ 159', set: { prenda: 'Casaca de jean', precio: 'S/ 159' }, ir: 'talla' },
        { l: 'Casaca cortaviento · S/ 129', set: { prenda: 'Casaca cortaviento', precio: 'S/ 129' }, ir: 'talla' }, MENU] },
      talla: { t: 'Elegiste: {{prenda}} ({{precio}}).\n¿En qué talla la quieres?', b: [
        { l: 'S', set: { talla: 'S' }, ir: 'entrega' }, { l: 'M', set: { talla: 'M' }, ir: 'entrega' },
        { l: 'L', set: { talla: 'L' }, ir: 'entrega' }, { l: 'XL', set: { talla: 'XL' }, ir: 'entrega' }] },
      entrega: { t: '¿Cómo te lo hacemos llegar?', b: [
        { l: 'Envío a domicilio', set: { entrega: 'Envío a domicilio' }, ir: 'resumen' }, { l: 'Lo recojo en la tienda', set: { entrega: 'Recojo en tienda' }, ir: 'resumen' }] },
      resumen: { t: 'Listo, así quedó tu pedido:', caja: 'Tu pedido', cajaT: 'Prenda: {{prenda}}\nTalla: {{talla}}\nPrecio: {{precio}}\nEntrega: {{entrega}}', b: [
        { l: 'Confirmar pedido', ir: 'confirmado' }, { l: 'Empezar de nuevo', ir: 'inicio' }] },
      confirmado: { t: '✅ ¡Pedido anotado!\n\nEs un ejemplo: no se envió a nadie. En una tienda real, el dueño recibiría el pedido completo y no tendría que preguntarte nada más.', b: [{ l: 'Armar otro pedido', ir: 'inicio' }] }
    }
  };

  // Nivel 3 · Conversacional: botones + reconoce palabras escritas + dice si está abierto
  var lavanderia = {
    titulo: 'Lavandería de ejemplo', sub: 'Chatbot con botones · entiende palabras',
    pie: 'Ejemplo de Moravi Studio: negocio y precios inventados. No se envía nada a nadie.',
    inicio: 'inicio', libre: true, horario: { dias: [1, 2, 3, 4, 5, 6], desde: 8, hasta: 20 },
    palabras: [
      { k: ['precio', 'cuesta', 'cuanto', 'tarifa', 'costo', 'valor'], ir: 'precios' },
      { k: ['horario', 'hora', 'abierto', 'atienden', 'abren', 'cierran'], ir: 'horario' },
      { k: ['recojo', 'recoger', 'recogen', 'domicilio', 'delivery', 'pedido', 'pedir', 'servicio'], ir: 'servicio' },
      { k: ['distrito', 'zona', 'cobertura', 'llegan', 'donde'], ir: 'cobertura' },
      { k: ['hola', 'buenas', 'buenos dias', 'buenas tardes'], ir: 'inicio' },
      { k: ['zapatilla', 'edredon', 'cortina', 'casaca', 'abrigo'], ir: 'especiales' }
    ],
    nodos: {
      inicio: { t: '¡Hola! 👋 Soy el asistente de la Lavandería de ejemplo.\n{{abierto}}\nElige una opción o escríbeme tu pregunta (por ejemplo: «¿cuánto cuesta?» o «¿hasta qué hora atienden?»).', b: [
        { l: 'Precios', ir: 'precios' }, { l: 'Horario', ir: 'horario' }, { l: 'Pedir recojo a domicilio', ir: 'servicio' }, { l: 'Zonas de cobertura', ir: 'cobertura' }] },
      precios: { t: 'Nuestros precios (inventados para la demostración):\n• Lavado por kilo: S/ 6 el kilo\n• Lavado + planchado: S/ 9 el kilo\n• Prendas especiales (casacas, edredones): S/ 8 por prenda\n\nEl recojo y la entrega a domicilio no tienen costo.', b: [{ l: 'Pedir recojo a domicilio', ir: 'servicio' }, MENU] },
      horario: { t: '{{abierto}}\n\nAtendemos de lunes a sábado, de 8:00 a 20:00. Domingos cerrado.', b: [{ l: 'Pedir recojo a domicilio', ir: 'servicio' }, MENU] },
      cobertura: { t: 'Recogemos en Miraflores, San Isidro, Surco y San Borja (zonas inventadas).', b: [{ l: 'Pedir recojo a domicilio', ir: 'servicio' }, MENU] },
      especiales: { t: 'Las prendas especiales (casacas, abrigos, edredones, cortinas, zapatillas) se cobran por prenda: desde S/ 8 (precio inventado).', b: [{ l: 'Pedir recojo a domicilio', ir: 'servicio' }, MENU] },
      servicio: { t: 'Con gusto. ¿Qué servicio necesitas?', b: [
        { l: 'Lavado por kilo', set: { servicio: 'Lavado por kilo' }, ir: 'distrito' }, { l: 'Lavado + planchado', set: { servicio: 'Lavado + planchado' }, ir: 'distrito' },
        { l: 'Prendas especiales', set: { servicio: 'Prendas especiales' }, ir: 'distrito' }] },
      distrito: { t: '¿En qué distrito te recogemos?', b: [
        { l: 'Miraflores', set: { distrito: 'Miraflores' }, ir: 'dia' }, { l: 'San Isidro', set: { distrito: 'San Isidro' }, ir: 'dia' },
        { l: 'Surco', set: { distrito: 'Surco' }, ir: 'dia' }, { l: 'San Borja', set: { distrito: 'San Borja' }, ir: 'dia' }] },
      dia: { t: '¿Qué día te queda mejor?', b: [
        { l: 'Hoy', set: { dia: 'Hoy' }, ir: 'resumen' }, { l: 'Mañana', set: { dia: 'Mañana' }, ir: 'resumen' }, { l: 'Pasado mañana', set: { dia: 'Pasado mañana' }, ir: 'resumen' }] },
      resumen: { t: 'Esto es lo que anoté:', caja: 'Solicitud de recojo', cajaT: 'Servicio: {{servicio}}\nDistrito: {{distrito}}\nDía: {{dia}}', b: [
        { l: 'Confirmar solicitud', ir: 'confirmado' }, { l: 'Empezar de nuevo', ir: 'inicio' }] },
      confirmado: { t: '✅ ¡Solicitud anotada!\n\nEs un ejemplo: no se envió a nadie. En una lavandería real, el dueño recibiría este aviso y te confirmaría la hora del recojo.', b: [{ l: 'Hacer otra solicitud', ir: 'inicio' }] },
      noentendi: { t: 'No estoy seguro de haber entendido 🙂 Este bot reconoce palabras como «precio», «horario», «recojo» o «zonas». Elige una opción:', b: [
        { l: 'Precios', ir: 'precios' }, { l: 'Horario', ir: 'horario' }, { l: 'Pedir recojo a domicilio', ir: 'servicio' }, { l: 'Zonas de cobertura', ir: 'cobertura' }] }
    }
  };

  global.FLUJOS_DEMO = { belleza: belleza, ropa: ropa, lavanderia: lavanderia };
})(window);
