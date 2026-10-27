/* Rosaleda · textos en inglés (se usan solo cuando la persona elige EN; ver ../../nucleo/idioma.js) */
(function () {
  if (!window.Idioma) return;
  var NOM = {
    'Rosa Nocturna': "Nocturnal Rose", 'Jazmín de Seda': "Silk Jasmine", 'Brisa de Peonía': "Peony Breeze", 'Ámbar Dulce': "Sweet Amber",
    'Bruma Corporal Vainilla': "Vanilla Body Mist", 'Crema Corporal Almendra': "Almond Body Cream", 'Sérum Facial Rosa Mosqueta': "Rosehip Facial Serum", 'Set Regalo Rosaleda': "Rosaleda Gift Set"
  };
  var TIPO = { 'Eau de parfum': "Eau de parfum", 'Eau de toilette': "Eau de toilette", 'Bruma corporal': "Body mist", 'Crema corporal': "Body cream", 'Sérum facial': "Face serum", 'Set de regalo': "Gift set" };
  var CAT = { Perfumes: "Perfumes", Cuerpo: "Body", Rostro: "Face", Regalos: "Gifts" };
  var nom = function (n) { return NOM[n] || n; };
  var d = {
    'Envíos a todo el Perú · Paga con tarjeta, Yape o Plin · Muestra de regalo en tu primer pedido': "Shipping across Peru · Pay by card, Yape or Plin · Free sample with your first order",
    'Cuerpo': "Body", 'Rostro': "Face", 'Regalos': "Gifts", 'Ofertas': "Sale",
    'Nueva colección': "New collection", 'Fragancias que': "Fragrances that", 'te acompañan': "go with you",
    'Perfumes y cuidado personal con notas suaves, elegantes y de larga duración, para cada momento del día.': "Perfumes and personal care with soft, elegant, long-lasting notes, for every moment of the day.",
    'Ver perfumes': "See perfumes", 'Ideas de regalo': "Gift ideas", 'Envío a todo el Perú': "Shipping across Peru",
    'Muestra de regalo en tu primer pedido': "Free sample with your first order", 'Paga con tarjeta, Yape o Plin': "Pay by card, Yape or Plin",
    'Nuestro catálogo': "Our catalog", 'Vista rápida': "Quick view", 'Ver y agregar': "View and add",
    'Perfumes y cuidado personal para acompañarte todos los días.': "Perfumes and personal care to go with you every day.",
    'Envío a todo el Perú en 2 a 5 días': "Shipping across Peru in 2 to 5 days", 'Notas y tamaños en cada producto': "Notes and sizes on every product",
    '© 2026 Rosaleda · Catálogo de ejemplo hecho por Moravi Studio. Marca y productos inventados.': "© 2026 Rosaleda · Sample catalog made by Moravi Studio. Made-up brand and products.",
    'Muestra 2 · Cuadrícula con ventana de producto': "Sample 2 · Grid with product window",
    'Rosaleda, inicio': "Rosaleda, home", 'Rosaleda, perfumes y belleza': "Rosaleda, perfumes and beauty", 'Buscar perfumes, cremas, regalos…': "Search perfumes, creams, gifts…",
    'Perfumes y cuidado personal Rosaleda: perfume Rosa Nocturna, bruma corporal, sérum y crema de manos': "Rosaleda perfumes and personal care: Nocturnal Rose perfume, body mist, serum and hand cream",
    'Beneficios': "Benefits", 'Notas': "Notes", 'Tamaño': "Size", 'Guardar en favoritos': "Save to favorites", 'Agregar': "Add",
    'Una rosa intensa y envolvente que se abre al caer la tarde. Fragancia floral oriental, de larga duración, pensada para las noches.': "An intense, enveloping rose that opens as evening falls. A long-lasting oriental floral fragrance, made for the night.",
    'Jazmín luminoso sobre un fondo suave de almizcle. Delicado, limpio y elegante: la fragancia perfecta para todos los días.': "Luminous jasmine over a soft musk base. Delicate, clean and elegant: the perfect fragrance for every day.",
    'Fresca y ligera, con la dulzura de la peonía y un toque de fruta. Una eau de toilette alegre para primavera y verano.': "Fresh and light, with the sweetness of peony and a touch of fruit. A cheerful eau de toilette for spring and summer.",
    'Cálida, golosa y sofisticada. El ámbar se mezcla con caramelo y haba tonka en una fragancia que deja huella.': "Warm, gourmand and sophisticated. Amber blends with caramel and tonka bean in a fragrance that leaves a trail.",
    'Bruma ligera con aroma a vainilla suave. Se aplica sobre la piel y el cabello para un perfume sutil durante el día.': "Light mist with a soft vanilla scent. Apply it on skin and hair for a subtle perfume throughout the day.",
    'Crema de textura rica y absorción rápida, con aceite de almendras. Deja la piel suave e hidratada, con un aroma delicado.': "Rich-textured cream that absorbs quickly, with almond oil. Leaves skin soft and moisturized, with a delicate scent.",
    'Sérum ligero con aceite de rosa mosqueta para usar de día o de noche. Textura fluida que se absorbe sin dejar sensación grasa.': "Light serum with rosehip oil to use day or night. A fluid texture that absorbs without a greasy feel.",
    'Eau de parfum Rosa Nocturna de 50 ml, bruma corporal Vainilla de 120 ml y crema de manos de 30 ml, en una caja de regalo rosa con lazo de satén, lista para entregar.': "Nocturnal Rose eau de parfum 50 ml, Vanilla body mist 120 ml and hand cream 30 ml, in a pink gift box with a satin bow, ready to give.",
    'Rosa búlgara': "Bulgarian rose", 'Pachulí': "Patchouli", 'Vainilla': "Vanilla", 'Jazmín': "Jasmine", 'Peonía blanca': "White peony", 'Almizcle': "Musk", 'Peonía': "Peony", 'Pera': "Pear",
    'Cedro blanco': "White cedar", 'Ámbar': "Amber", 'Caramelo': "Caramel", 'Haba tonka': "Tonka bean"
  };
  var k; for (k in NOM) d[k] = NOM[k]; for (k in TIPO) d[k] = TIPO[k]; for (k in CAT) d[k] = CAT[k];
  window.Idioma.registrar({
    d: d,
    p: [
      [/^Agregar · (S\/ .+)$/, function (t, m) { return 'Add · ' + m; }],
      [/^(.+) · (Perfumes|Cuerpo|Rostro|Regalos)$/, function (t, ti, c) { return (TIPO[ti] || ti) + ' · ' + CAT[c]; }],
      [/^Guardar (.+) en favoritos$/, function (t, n) { return 'Save ' + nom(n) + ' to favorites'; }],
      [/^Ver (.+)$/, function (t, n) { return 'View ' + nom(n); }]
    ],
    t: [
      [/Perfumes y belleza/, 'Perfumes and beauty'],
      [/^(.+) · Rosaleda/, function (m, n) { return nom(n) + ' · Rosaleda'; }]
    ]
  });
})();
