/* Casa Firme · textos en inglés (se usan solo cuando la persona elige EN; ver ../../nucleo/idioma.js) */
(function () {
  if (!window.Idioma) return;
  var NOM = {
    'Taladro percutor 650 W': "650 W hammer drill", 'Llave ajustable (inglesa)': "Adjustable wrench", 'Martillo de carpintero': "Carpenter's hammer", 'Flexómetro con freno': "Tape measure with lock",
    'Cable eléctrico 2.5 mm²': "2.5 mm² electrical wire", 'Foco LED 9 W luz cálida': "9 W LED bulb, warm light", 'Extensión eléctrica 5 m, 4 tomas': "5 m extension cord, 4 outlets", 'Pintura látex blanco': "White latex paint",
    'Rodillo con bandeja': "Paint roller with tray", 'Llave mezcladora para lavatorio': "Bathroom sink mixer tap", 'Manguera de jardín reforzada': "Reinforced garden hose", 'Caja de herramientas 17"': "17\" toolbox"
  };
  var TIPO = {
    'Herramienta eléctrica': "Power tool", 'Herramienta manual': "Hand tool", 'Medición': "Measuring", 'Cables': "Wires and cables", 'Iluminación': "Lighting", 'Accesorios': "Accessories",
    'Pintura para paredes': "Wall paint", 'Accesorios de pintura': "Painting accessories", 'Grifería': "Taps and fixtures", 'Jardín': "Garden", 'Almacenamiento': "Storage"
  };
  var nom = function (n) { return NOM[n] || n; };
  var d = {
    'Despacho en Lima en 24 horas · Envíos a todo el Perú · Paga con tarjeta, Yape o Plin': "Lima delivery in 24 hours · Shipping across Peru · Pay by card, Yape or Plin",
    'Buscar productos': "Search products", 'Lunes a sábado · 8:00 a 18:00': "Monday to Saturday · 8:00 a.m. to 6:00 p.m.", 'Mi pedido': "My order",
    'Herramientas': "Tools", 'Electricidad': "Electrical", 'Pinturas': "Paint", 'Plomería y jardín': "Plumbing and garden", 'Ofertas': "Deals",
    'Catálogo de productos': "Product catalog", 'Ordenar por': "Sort by", 'Más pedidos': "Most ordered", 'Precio: menor a mayor': "Price: low to high", 'Precio: mayor a menor': "Price: high to low",
    'Ver producto': "View product", 'Agregar': "Add", 'Largo': "Length", 'Peso': "Weight", 'Presentación': "Format",
    '1 foco': "1 bulb", 'Pack de 4': "Pack of 4", '1 galón': "1 gallon", '4 galones': "4 gallons", 'Con maletín': "With case", 'Rodillo 9" + bandeja': "9\" roller + tray", 'Con mangueras': "With hoses", '17 pulgadas': "17 inches",
    'Tu pedido está vacío.': "Your order is empty.", 'Agrega productos desde la lista y aquí verás el total mientras eliges.': "Add products from the list and you will see the total here as you choose.",
    'Despacho en 24 horas': "24-hour dispatch", 'En Lima, con seguimiento': "In Lima, with tracking", 'Garantía en herramientas': "Tool warranty", 'Cambio directo por falla de fábrica': "Direct replacement for factory defects",
    'Tarjeta, Yape o Plin': "Card, Yape or Plin", 'Pagas aquí mismo, sin salir del catálogo': "You pay right here, without leaving the catalog",
    'Compras por mayor': "Bulk purchases", 'Pide tu cotización con descuento →': "Ask for your discounted quote →",
    'Todo para tu obra y tu hogar, con atención de lunes a sábado.': "Everything for your project and your home, with service Monday to Saturday.",
    'Visítanos': "Visit us", 'Pedidos y cotizaciones': "Orders and quotes",
    '© 2026 Casa Firme · Catálogo de ejemplo hecho por Moravi Studio. Marca, dirección y productos inventados.': "© 2026 Casa Firme · Sample catalog made by Moravi Studio. Made-up brand, address and products.",
    'Ver pedido': "View order", 'Casa Firme, inicio': "Casa Firme, home", 'Casa Firme, ferretería y hogar': "Casa Firme, hardware and home",
    'Buscar por nombre o código: taladro, cable, pintura…': "Search by name or code: drill, wire, paint…", 'Abrir mi pedido': "Open my order", 'Lista de productos': "Product list",
    'Cerrar pedido': "Close order", 'Servicios': "Services", 'Vaciar pedido': "Clear order", 'Te faltan': "You are", 'para el envío gratis': "away from free shipping", '¡Tu pedido tiene envío gratis!': "Your order ships for free!",
    'Ejemplo: en tu catálogo este botón abre un mensaje de cotización a tu negocio.': "Example: in your catalog this button opens a quote message to your business.",
    'Ejemplo: en tu catálogo este enlace abre el WhatsApp de tu negocio.': "Example: in your catalog this link opens your business's WhatsApp.",
    'Ejemplo: en tu catálogo este enlace escribe al correo de tu negocio.': "Example: in your catalog this link emails your business.",
    'Catálogo': "Catalog", 'Oferta': "Sale", 'Haz clic en la foto para acercar': "Click the photo to zoom in", 'En stock, listo para despacho': "In stock, ready to ship", 'Despacho en Lima en 24 horas': "Lima delivery in 24 hours",
    'Descripción': "Description", 'Ficha técnica': "Specifications", 'También te puede servir': "You may also need", 'Ver opciones': "See options", 'Productos relacionados': "Related products", 'Ruta': "Breadcrumb",
    // fichas
    'Potencia': "Power", 'Mandril': "Chuck", 'Velocidad': "Speed", 'Incluye': "Includes", 'Maletín y 3 brocas': "Case and 3 drill bits", 'Material': "Material", 'Acero cromo-vanadio': "Chrome-vanadium steel",
    'Acabado': "Finish", 'Cromado': "Chrome-plated", 'Apertura máxima': "Maximum opening", 'Mango': "Handle", 'Antideslizante, con ojal para colgar': "Non-slip, with a hanging loop",
    'Cabeza': "Head", 'Acero forjado': "Forged steel", 'Fibra de vidrio': "Fiberglass", 'Empuñadura': "Grip", 'Goma antideslizante': "Non-slip rubber", 'Uso': "Use", 'Clavar y desclavar': "Driving and pulling nails",
    'Cinta': "Tape", 'Acero con recubrimiento': "Coated steel", 'Freno': "Lock", 'Sí': "Yes", 'Carcasa': "Case", 'Antigolpes': "Shock-resistant", 'Extra': "Extra", 'Correa de muñeca': "Wrist strap",
    'Calibre': "Gauge", 'Conductor': "Conductor", 'Cobre': "Copper", 'Aislamiento': "Insulation", 'PVC rojo': "Red PVC", 'Tensión': "Voltage",
    '9 W (equivale a 60 W)': "9 W (equivalent to 60 W)", 'Luz': "Light", 'Cálida 3000 K': "Warm 3000 K", 'Base': "Base", 'Duración': "Lifespan", 'Tomas': "Outlets", '4 con interruptor': "4, with switch", '0 a 2,800 rpm': "0 to 2,800 rpm", '15,000 horas': "15,000 hours", '1 hora': "1 hour", '9\" felpa media': "9\" medium pile", '2 mangueras trenzadas de acero inoxidable': "2 braided stainless steel hoses", 'Cable': "Cable", 'Cuerpo': "Body",
    'Amarillo reforzado, extremos negros': "Reinforced yellow, black ends", 'Mate': "Matte", 'Rendimiento': "Coverage", 'Hasta 40 m² por galón': "Up to 40 m² per gallon", 'Secado al tacto': "Touch-dry time",
    'Interior y exterior protegido': "Interior and sheltered exterior", 'Rodillo': "Roller", 'Bandeja': "Tray", 'Plástica rígida, con rampa estriada': "Rigid plastic, with a ribbed ramp", 'Ergonómico, con ojal para colgar': "Ergonomic, with a hanging loop",
    'Cromo': "Chrome", 'Cartucho': "Cartridge", 'Cerámico 35 mm': "Ceramic 35 mm", 'Diámetro': "Diameter", 'Refuerzo': "Reinforcement", '3 capas': "3 layers",
    'Pistola multichorro y conectores de latón': "Multi-pattern spray gun and brass connectors", 'Medida': "Size", 'Interior': "Interior", 'Bandeja desmontable': "Removable tray", 'Cierres': "Latches", 'Metálicos': "Metal",
    // resúmenes y descripciones
    'Velocidad variable y mandril de 13 mm. Perfora madera, metal y concreto liviano.': "Variable speed and a 13 mm chuck. Drills wood, metal and light concrete.",
    'Taladro percutor de 650 W con velocidad variable, reversa y mandril de 13 mm. Viene con maletín y un juego de 3 brocas para empezar a trabajar el mismo día.': "650 W hammer drill with variable speed, reverse and a 13 mm chuck. Comes with a case and a set of 3 drill bits so you can start working the same day.",
    'Acero cromado con mordaza de apertura amplia y mango amarillo y negro antideslizante.': "Chrome-plated steel with a wide-opening jaw and a non-slip yellow and black handle.",
    'Llave ajustable de acero cromo-vanadio con mordaza de apertura amplia y tornillo de ajuste suave. Sirve para tuercas y pernos de distintas medidas, y el mango antideslizante da buen agarre.': "Chrome-vanadium adjustable wrench with a wide-opening jaw and a smooth adjusting screw. It fits nuts and bolts of different sizes, and the non-slip handle gives a good grip.",
    'Cabeza de acero forjado y mango de fibra de vidrio que absorbe el golpe.': "Forged steel head and a fiberglass handle that absorbs the impact.",
    'Martillo de carpintero con cabeza de acero forjado y uña para desclavar. El mango de fibra de vidrio absorbe la vibración y cansa menos la mano.': "Carpenter's hammer with a forged steel head and a claw for pulling nails. The fiberglass handle absorbs vibration and tires your hand less.",
    'Cinta de acero con freno y carcasa amarilla con goma antigolpes.': "Steel tape with a lock and a yellow case with shock-absorbing rubber.",
    'Flexómetro con cinta de acero, freno para fijar la medida y carcasa antigolpes. Lleva correa de muñeca.': "Tape measure with a steel tape, a lock to hold the measurement and a shock-resistant case. Includes a wrist strap.",
    'Cable de cobre con aislamiento de PVC para instalaciones de tomacorrientes.': "Copper wire with PVC insulation for outlet installations.",
    'Cable unipolar de cobre de 2.5 mm² con aislamiento de PVC, apto para circuitos de tomacorrientes y alumbrado en instalaciones domésticas.': "Single-core 2.5 mm² copper wire with PVC insulation, suitable for outlet and lighting circuits in home installations.",
    'Equivale a 60 W, con 15,000 horas de duración y luz cálida.': "Equivalent to 60 W, with 15,000 hours of life and warm light.",
    'Foco LED de 9 W que equivale a uno incandescente de 60 W y gasta mucho menos. Luz cálida, base E27 y hasta 15,000 horas de duración.': "9 W LED bulb equivalent to a 60 W incandescent one, using much less power. Warm light, E27 base and up to 15,000 hours of life.",
    'Cuatro tomas con interruptor y cuerpo amarillo reforzado, con cable de 5 m.': "Four outlets with a switch and a reinforced yellow body, with a 5 m cord.",
    'Extensión de 5 metros con cuatro tomas e interruptor general. Cuerpo amarillo reforzado con extremos negros y cable de 3 × 1.5 mm² que se recoge fácil.': "5-meter extension cord with four outlets and a master switch. Reinforced yellow body with black ends and a 3 × 1.5 mm² cable that coils up easily.",
    'Acabado mate, lavable, para interiores y exteriores protegidos.': "Matte, washable finish, for interiors and sheltered exteriors.",
    'Pintura látex blanca de acabado mate, lavable y de buena cobertura. Rinde hasta 40 m² por galón y seca al tacto en una hora.': "White latex paint with a matte, washable finish and good coverage. Covers up to 40 m² per gallon and is touch-dry in one hour.",
    'Rodillo de felpa de 9 pulgadas con mango amarillo y bandeja plástica estriada.': "9-inch pile roller with a yellow handle and a ribbed plastic tray.",
    'Rodillo de felpa de 9 pulgadas con armazón de acero y mango ergonómico amarillo y negro, con ojal para colgar. Viene con bandeja plástica de rampa estriada, que reparte bien la pintura. Ideal para paredes y techos lisos.': "9-inch pile roller with a steel frame and an ergonomic yellow and black handle with a hanging loop. Comes with a plastic tray with a ribbed ramp that spreads the paint well. Ideal for smooth walls and ceilings.",
    'Monocomando cromada con cartucho cerámico y dos mangueras trenzadas de conexión.': "Chrome single-lever mixer with a ceramic cartridge and two braided connection hoses.",
    'Llave mezcladora monocomando para lavatorio, de acabado cromo, palanca única y pico curvo corto, con cartucho cerámico de 35 mm. Incluye dos mangueras trenzadas de acero inoxidable con tuercas.': "Single-lever bathroom sink mixer in chrome finish, with a single handle and a short curved spout, and a 35 mm ceramic cartridge. Includes two stainless steel braided hoses with nuts.",
    'Tres capas reforzadas, con pistola multichorro y conectores de latón.': "Three reinforced layers, with a multi-pattern spray gun and brass connectors.",
    'Manguera de jardín de media pulgada con tres capas de refuerzo que evitan dobleces. Incluye pistola de riego con cabezal de varios chorros y conectores de latón.': "Half-inch garden hose with three reinforcement layers that prevent kinks. Includes a spray gun with a multi-pattern head and brass connectors.",
    'Tapa amarilla, cuerpo negro, cierres metálicos y asa reforzada.': "Yellow lid, black body, metal latches and a reinforced handle.",
    'Caja de herramientas de 17 pulgadas con tapa amarilla y cuerpo negro de plástico rígido, bandeja desmontable, dos cierres metálicos y asa reforzada. Cabe lo necesario para el trabajo de la casa.': "17-inch toolbox with a yellow lid and a rigid black plastic body, a removable tray, two metal latches and a reinforced handle. It holds what you need for work around the house."
  };
  var k; for (k in NOM) d[k] = NOM[k];
  window.Idioma.registrar({
    d: d,
    p: [
      [/^(CF-\d+) · (.+)$/, function (t, c, ti) { return c + ' · ' + (TIPO[ti] || ti); }],
      [/^Ahorras (S\/ .+)$/, function (t, m) { return 'You save ' + m; }],
      [/^Agregar (?:al pedido) · (S\/ .+)$/, function (t, m) { return 'Add to order · ' + m; }],
      [/^✓ Agregaste (\d+) × (.+?)( \(.+\))? a tu pedido\.$/, function (t, n, p, o) { return '✓ You added ' + n + ' × ' + nom(p) + (o || '') + ' to your order.'; }],
      [/^Cantidad de (.+)$/, function (t, n) { return 'Quantity of ' + nom(n); }],
      [/^Quitar uno de (.+)$/, function (t, n) { return 'Remove one ' + nom(n); }],
      [/^Agregar uno de (.+)$/, function (t, n) { return 'Add one ' + nom(n); }],
      [/^Agregar (.+) al pedido$/, function (t, n) { return 'Add ' + nom(n) + ' to your order'; }],
      [/^Acercar la foto de (.+)$/, function (t, n) { return 'Zoom in on the photo of ' + nom(n); }],
      [/^Ver (.+)$/, function (t, n) { return 'View ' + nom(n); }]
    ],
    t: [
      [/Ferretería y hogar/, 'Hardware and home'],
      [/^(.+) · Casa Firme/, function (m, n) { return nom(n) + ' · Casa Firme'; }]
    ]
  });
})();
