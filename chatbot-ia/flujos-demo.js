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
  var pasteleria = {
    titulo: 'Pastelería de ejemplo', sub: 'Chatbot con botones · arma el pedido',
    pie: 'Ejemplo de Moravi Studio: negocio y precios inventados. No se envía nada a nadie.',
    inicio: 'inicio', libre: false,
    nodos: {
      inicio: { t: '¡Hola! 👋 Soy el asistente de la Pastelería de ejemplo.\n¿Qué quieres pedir o consultar?', b: [
        { l: 'Tortas', ir: 'tortas' }, { l: 'Cupcakes y postres', ir: 'postres' }, { l: 'Ver precios', ir: 'precios' },
        { l: 'Horario y dirección', ir: 'horario' }, { l: 'Zonas de envío', ir: 'envios' }] },
      precios: { t: 'Nuestros precios (inventados para la demostración):\n• Tortas: S/ 75 (8 porciones), S/ 120 (15 porciones) y S/ 185 (25 porciones)\n• Cupcakes, caja de 6: S/ 36\n• Cheesecake de fresa entero: S/ 70\n• Alfajores, caja de 12: S/ 30', b: [{ l: 'Pedir una torta', ir: 'tortas' }, MENU] },
      horario: { t: '🕘 Atendemos de lunes a sábado, de 9:00 a 19:00. Domingos cerrado.\n\n📍 Av. Ejemplo 123, Lima (dirección inventada).', b: [{ l: 'Pedir una torta', ir: 'tortas' }, MENU] },
      envios: { t: 'Entregamos a domicilio en Miraflores, San Isidro, Surco y San Borja (zonas inventadas). También puedes recoger tu pedido en la pastelería.', b: [{ l: 'Pedir una torta', ir: 'tortas' }, MENU] },
      tortas: { t: 'Nuestras tortas (se hornean por encargo). ¿De qué sabor?', b: [
        { l: 'Chocolate', set: { producto: 'Torta de chocolate' }, ir: 'tamano' },
        { l: 'Vainilla con fresas', set: { producto: 'Torta de vainilla con fresas' }, ir: 'tamano' },
        { l: 'Tres leches', set: { producto: 'Torta tres leches' }, ir: 'tamano' }, MENU] },
      tamano: { t: 'Elegiste: {{producto}}.\n¿De qué tamaño la quieres?', b: [
        { l: 'Pequeña (8 porciones) · S/ 75', set: { tam: 'Pequeña (8 porciones)', precio: 'S/ 75' }, ir: 'fecha' },
        { l: 'Mediana (15 porciones) · S/ 120', set: { tam: 'Mediana (15 porciones)', precio: 'S/ 120' }, ir: 'fecha' },
        { l: 'Grande (25 porciones) · S/ 185', set: { tam: 'Grande (25 porciones)', precio: 'S/ 185' }, ir: 'fecha' }] },
      postres: { t: 'Cupcakes y postres disponibles:', b: [
        { l: 'Cupcakes, caja de 6 · S/ 36', set: { producto: 'Cupcakes', tam: 'Caja de 6', precio: 'S/ 36' }, ir: 'fecha' },
        { l: 'Cheesecake de fresa · S/ 70', set: { producto: 'Cheesecake de fresa', tam: 'Entero (10 porciones)', precio: 'S/ 70' }, ir: 'fecha' },
        { l: 'Alfajores, caja de 12 · S/ 30', set: { producto: 'Alfajores', tam: 'Caja de 12', precio: 'S/ 30' }, ir: 'fecha' }, MENU] },
      fecha: { t: '¿Para cuándo lo necesitas?\nTodo se prepara por encargo, con 24 horas de anticipación.', b: [
        { l: 'Mañana', set: { fecha: 'Mañana' }, ir: 'entrega' }, { l: 'En 2 días', set: { fecha: 'En 2 días' }, ir: 'entrega' },
        { l: 'En 3 días o más', set: { fecha: 'En 3 días o más' }, ir: 'entrega' }] },
      entrega: { t: '¿Cómo te lo hacemos llegar?', b: [
        { l: 'Envío a domicilio', set: { entrega: 'Envío a domicilio' }, ir: 'resumen' }, { l: 'Lo recojo en la pastelería', set: { entrega: 'Recojo en la pastelería' }, ir: 'resumen' }] },
      resumen: { t: 'Listo, así quedó tu pedido:', caja: 'Tu pedido', cajaT: 'Pedido: {{producto}}\nTamaño: {{tam}}\nPrecio: {{precio}}\nPara: {{fecha}}\nEntrega: {{entrega}}', b: [
        { l: 'Confirmar pedido', ir: 'confirmado' }, { l: 'Empezar de nuevo', ir: 'inicio' }] },
      confirmado: { t: '✅ ¡Pedido anotado!\n\nEs un ejemplo: no se envió a nadie. En una pastelería real, el negocio recibiría el pedido completo, con la fecha de entrega, y no tendría que preguntarte nada más.', b: [{ l: 'Armar otro pedido', ir: 'inicio' }] }
    }
  };

  // Nivel 3 · Conversacional: botones + reconoce palabras escritas + dice si está abierto
  var lavanderia = {
    titulo: 'Lavandería de ejemplo', sub: 'Chatbot con botones · entiende palabras',
    pie: 'Ejemplo de Moravi Studio: negocio y precios inventados. No se envía nada a nadie.',
    inicio: 'inicio', libre: true, horario: { dias: [1, 2, 3, 4, 5, 6], desde: 8, hasta: 20 },
    palabras: [
      { k: ['precio', 'precios', 'cuesta', 'cuestan', 'cuanto cuesta', 'cuanto cobran', 'cuanto sale', 'cuanto vale', 'tarifa', 'tarifas', 'costo', 'costos', 'valor'], ir: 'precios' },
      { k: ['horario', 'horarios', 'hora', 'horas', 'abierto', 'abiertos', 'atienden', 'atencion', 'abren', 'abre', 'cierran', 'cierra'], ir: 'horario' },
      { k: ['recojo', 'recojos', 'recoger', 'recogen', 'recojan', 'recoja', 'domicilio', 'delivery', 'pedido', 'pedidos', 'pedir', 'servicio', 'servicios'], ir: 'servicio' },
      { k: ['distrito', 'distritos', 'zona', 'zonas', 'cobertura', 'llegan', 'llegar', 'donde'], ir: 'cobertura' },
      { k: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches'], ir: 'inicio' },
      { k: ['zapatilla', 'zapatillas', 'edredon', 'edredones', 'cortina', 'cortinas', 'casaca', 'casacas', 'abrigo', 'abrigos'], ir: 'especiales' }
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

  global.FLUJOS_DEMO = { belleza: belleza, pasteleria: pasteleria, lavanderia: lavanderia };
})(window);
