/* Azahar · textos en inglés (se usan solo cuando la persona elige EN; ver ../../nucleo/idioma.js) */
(function () {
  if (!window.Idioma) return;
  var NOM = {
    'Tote Lima': "Lima Tote", 'Bandolera Cusco': "Cusco Crossbody", 'Clutch Paracas': "Paracas Clutch", 'Bucket Arequipa': "Arequipa Bucket Bag", 'Tote Barranco': "Barranco Tote", 'Bandolera Máncora': "Máncora Crossbody",
    'Zapatilla Alba': "Alba Sneaker", 'Bota Otoño': "Autumn Boot", 'Sandalia Brisa': "Brisa Sandal", 'Mocasín Clásico': "Classic Loafer", 'Zapatilla Ruta': "Ruta Sneaker", 'Bota Andina': "Andean Boot"
  };
  var COL = { Camel: "Camel", Negro: "Black", Vino: "Wine", Crema: "Cream", Oliva: "Olive" };
  var nom = function (n) { return NOM[n] || n; }, C = '(Camel|Negro|Vino|Crema|Oliva)';
  var d = {
    'Envíos a todo el Perú · Paga con tarjeta, Yape o Plin': "Shipping across Peru · Pay by card, Yape or Plin",
    'Carteras': "Handbags", 'Calzado': "Footwear", 'Ofertas': "Sale",
    'Colección otoño': "Autumn collection", 'Cuero que acompaña': "Leather that goes with", 'tus pasos': "your every step",
    'Carteras y calzado hechos para el día a día: cómodos, resistentes y con el detalle justo para que se vean bien en cualquier ocasión.': "Handbags and footwear made for everyday life: comfortable, durable and with just the right detail to look good on any occasion.",
    'Ver la colección': "See the collection", 'Envío a todo el Perú': "Shipping across Peru", 'Cambios en 7 días': "Exchanges within 7 days", 'Paga con Yape o Plin': "Pay with Yape or Plin",
    'Nuestro catálogo': "Our catalog", 'Agregar al carrito': "Add to cart", 'Elegir talla': "Choose size",
    'Carteras y calzado de cuero, hechos para acompañarte todos los días.': "Leather handbags and footwear, made to go with you every day.",
    'Envío a todo el Perú en 2 a 5 días': "Shipping across Peru in 2 to 5 days", 'Cambios y devoluciones hasta 7 días': "Exchanges and returns within 7 days", 'Medidas y cuidados en cada producto': "Sizes and care on every product",
    '© 2026 Azahar · Catálogo de ejemplo hecho por Moravi Studio. Marca y productos inventados.': "© 2026 Azahar · Sample catalog made by Moravi Studio. Made-up brand and products.",
    'Muestra 1 · Cuadrícula clásica': "Sample 1 · Classic grid",
    'Buscar carteras, botas…': "Search handbags, boots…", 'Azahar, inicio': "Azahar, home", 'Azahar, cuero y calzado': "Azahar, leather and footwear",
    'Tote, botines y clutch de cuero sobre pedestales de yeso, con una rama de azahar': "Leather tote, ankle boots and clutch on plaster pedestals, with an orange blossom branch",
    'Comprar ahora': "Buy now", 'Paga con tarjeta, Yape o Plin': "Pay by card, Yape or Plin", 'Medidas': "Dimensions", 'Materiales y cuidados': "Materials and care",
    'Cuero de res con acabado suave. Limpiar con un paño seco; evitar la humedad y el sol directo. Guardar en su bolsa de tela.': "Cowhide leather with a soft finish. Clean with a dry cloth; avoid moisture and direct sun. Store in its cloth bag.",
    'Envíos y cambios': "Shipping and exchanges",
    'Lima: entrega en 24 a 72 horas. Provincias: 3 a 5 días con seguimiento. Puedes cambiar tu pedido dentro de los 7 días siguientes a la entrega.': "Lima: delivery in 24 to 72 hours. Provinces: 3 to 5 days with tracking. You can exchange your order within 7 days after delivery.",
    'También te puede gustar': "You may also like", 'Ruta': "Breadcrumb", 'Talla': "Size", '(elige una)': "(choose one)", 'Elige una talla para continuar.': "Choose a size to continue.",
    'Horma regular': "Regular fit", 'Horma ancha': "Wide fit", 'Caña 14 cm': "Shaft height 14 cm", 'Caña 18 cm': "Shaft height 18 cm", 'Plantilla acolchada': "Cushioned insole",
    'Tote amplio de cuero para el día a día: cabe la laptop, la agenda y todo lo que necesitas. Dos asas reforzadas y cierre con broche dorado.': "Roomy leather tote for everyday: it fits your laptop, your planner and everything you need. Two reinforced handles and a gold clasp closure.",
    'Bandolera compacta con solapa y correa ajustable. Ligera, elegante y con espacio para lo esencial.': "Compact crossbody with a flap and an adjustable strap. Light, elegant and with room for the essentials.",
    'Clutch de noche con pliegue suave y botón dorado. Perfecta para eventos y cenas.': "Evening clutch with a soft fold and a gold button. Perfect for events and dinners.",
    'Bolso saco con cordón dorado y asa larga desmontable. Un clásico que combina con todo.': "Bucket bag with a gold drawstring and a detachable long strap. A classic that goes with everything.",
    'Versión grande del tote, con bolsillo interno con cierre. Ideal para viajes cortos y la oficina.': "Large version of the tote, with a zippered inner pocket. Ideal for short trips and the office.",
    'Bandolera de verano en tonos cálidos, con correa de cuero trenzado.': "Summer crossbody in warm tones, with a braided leather strap.",
    'Zapatilla urbana de cuero con suela de goma ligera. Cómoda desde el primer día.': "Urban leather sneaker with a light rubber sole. Comfortable from day one.",
    'Botín de caña media con suela de cuero y taco bajo. Para toda la temporada fría.': "Mid-height ankle boot with a leather sole and a low heel. For the whole cold season.",
    'Sandalia plana de dos tiras, suave y fresca. La compañera del verano.': "Flat two-strap sandal, soft and fresh. The perfect summer companion.",
    'Mocasín de cuero con detalle dorado. Elegante para la oficina y cómodo para caminar.': "Leather loafer with a gold detail. Elegant for the office and comfortable for walking.",
    'Zapatilla de uso diario con plantilla suave y buen agarre.': "Everyday sneaker with a soft insole and good grip.",
    'Bota resistente con suela de goma y cierre lateral. Pensada para ciudad y paseo.': "Sturdy boot with a rubber sole and a side zip. Made for the city and for walks."
  };
  var k; for (k in NOM) d[k] = NOM[k]; for (k in COL) d[k] = COL[k];
  window.Idioma.registrar({
    d: d,
    p: [
      [new RegExp('^' + C + '(?: · Talla (\\S+))?(?: · (x\\d+))?$'), function (t, c, s, x) { return COL[c] + (s ? ' · Size ' + s : '') + (x ? ' · ' + x : ''); }],
      [new RegExp('^· ' + C + '$'), function (t, c) { return '· ' + COL[c]; }],
      [new RegExp('^Color ' + C + '$'), function (t, c) { return 'Color ' + COL[c]; }],
      [/^Ver foto (\d+)$/, function (t, n) { return 'View photo ' + n; }],
      [/^(.+), vista (\d+)$/, function (t, n, v) { return nom(n) + ', view ' + v; }],
      [/^Guardar (.+) en favoritos$/, function (t, n) { return 'Save ' + nom(n) + ' to favorites'; }],
      [/^› (.+)$/, function (t, n) { return '› ' + nom(n); }],
      [/^Ver (.+)$/, function (t, n) { return 'View ' + nom(n); }]
    ],
    t: [
      [/Carteras y calzado de cuero/, 'Leather handbags and footwear'],
      [/^(.+) · Azahar/, function (m, n) { return nom(n) + ' · Azahar'; }]
    ]
  });
})();
