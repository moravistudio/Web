/*
 * Muestra 3 · «Casa Firme» (ferretería y hogar) — marca inventada para la demostración. Nada de esto es un negocio real.
 * Los productos se arman a mano por Moravi Studio en este archivo (no hay panel ni base de datos).
 * Las «fotos» son ilustraciones provisionales (arte.js): cuando el cliente entregue sus fotos reales se reemplazan (campo `foto`).
 * Cada producto tiene una o más PRESENTACIONES (tam), cada una con su precio; `opcion` es el nombre del grupo («Largo», «Peso»…).
 */
(function (w) {
  'use strict';
  var MARCA = {
    nombre: 'Casa Firme', apellido: 'Ferretería y hogar',
    aviso: 'Despacho en Lima en 24 horas · Envíos a todo el Perú · Paga con tarjeta, Yape o Plin',
    horario: 'Lunes a sábado · 8:00 a 18:00',
    envio: { costo: 15, gratisDesde: 300 },
    categorias: [{ id: 'todo', nombre: 'Todo' }, { id: 'herramientas', nombre: 'Herramientas' }, { id: 'electricidad', nombre: 'Electricidad' }, { id: 'pinturas', nombre: 'Pinturas' }, { id: 'plomeria', nombre: 'Plomería y jardín' }, { id: 'ofertas', nombre: 'Ofertas' }]
  };
  var CAT = { herramientas: 'Herramientas', electricidad: 'Electricidad', pinturas: 'Pinturas', plomeria: 'Plomería y jardín' };
  var PRODUCTOS = [
    { id: 'c1', codigo: 'CF-1001', nombre: 'Taladro percutor 650 W', foto: 'img/productos/taladro-percutor.webp', cat: 'herramientas', tipoTxt: 'Herramienta eléctrica', forma: 'taladro', opcion: 'Presentación',
      tam: [{ n: 'Con maletín', precio: 189, antes: 229 }],
      resumen: 'Velocidad variable y mandril de 13 mm. Perfora madera, metal y concreto liviano.',
      desc: 'Taladro percutor de 650 W con velocidad variable, reversa y mandril de 13 mm. Viene con maletín y un juego de 3 brocas para empezar a trabajar el mismo día.',
      specs: [['Potencia', '650 W'], ['Mandril', '13 mm'], ['Velocidad', '0 a 2,800 rpm'], ['Incluye', 'Maletín y 3 brocas']] },
    { id: 'c2', codigo: 'CF-1002', nombre: 'Llave ajustable (inglesa)', foto: 'img/productos/llave-ajustable.webp', cat: 'herramientas', tipoTxt: 'Herramienta manual', forma: 'llaveajustable', opcion: 'Largo',
      tam: [{ n: '10"', precio: 39 }, { n: '12"', precio: 49 }],
      resumen: 'Acero cromado con mordaza de apertura amplia y mango amarillo y negro antideslizante.',
      desc: 'Llave ajustable de acero cromo-vanadio con mordaza de apertura amplia y tornillo de ajuste suave. Sirve para tuercas y pernos de distintas medidas, y el mango antideslizante da buen agarre.',
      specs: [['Material', 'Acero cromo-vanadio'], ['Acabado', 'Cromado'], ['Apertura máxima', '30 mm (10") · 34 mm (12")'], ['Mango', 'Antideslizante, con ojal para colgar']] },
    { id: 'c3', codigo: 'CF-1003', nombre: 'Martillo de carpintero', foto: 'img/productos/martillo-carpintero.webp', cat: 'herramientas', tipoTxt: 'Herramienta manual', forma: 'martillo', opcion: 'Peso',
      tam: [{ n: '16 oz', precio: 29 }, { n: '20 oz', precio: 34 }],
      resumen: 'Cabeza de acero forjado y mango de fibra de vidrio que absorbe el golpe.',
      desc: 'Martillo de carpintero con cabeza de acero forjado y uña para desclavar. El mango de fibra de vidrio absorbe la vibración y cansa menos la mano.',
      specs: [['Cabeza', 'Acero forjado'], ['Mango', 'Fibra de vidrio'], ['Empuñadura', 'Goma antideslizante'], ['Uso', 'Clavar y desclavar']] },
    { id: 'c4', codigo: 'CF-1004', nombre: 'Flexómetro con freno', foto: 'img/productos/flexometro.webp', cat: 'herramientas', tipoTxt: 'Medición', forma: 'flexometro', opcion: 'Largo',
      tam: [{ n: '3 m', precio: 12 }, { n: '5 m', precio: 19 }, { n: '8 m', precio: 29 }],
      resumen: 'Cinta de acero con freno y carcasa amarilla con goma antigolpes.',
      desc: 'Flexómetro con cinta de acero, freno para fijar la medida y carcasa antigolpes. Lleva correa de muñeca.',
      specs: [['Cinta', 'Acero con recubrimiento'], ['Freno', 'Sí'], ['Carcasa', 'Antigolpes'], ['Extra', 'Correa de muñeca']] },
    { id: 'c5', codigo: 'CF-2001', nombre: 'Cable eléctrico 2.5 mm²', foto: 'img/productos/cable-electrico.webp', cat: 'electricidad', tipoTxt: 'Cables', forma: 'cable', opcion: 'Largo',
      tam: [{ n: '10 m', precio: 24 }, { n: '25 m', precio: 58 }, { n: '100 m', precio: 215 }],
      resumen: 'Cable de cobre con aislamiento de PVC para instalaciones de tomacorrientes.',
      desc: 'Cable unipolar de cobre de 2.5 mm² con aislamiento de PVC, apto para circuitos de tomacorrientes y alumbrado en instalaciones domésticas.',
      specs: [['Calibre', '2.5 mm² (14 AWG)'], ['Conductor', 'Cobre'], ['Aislamiento', 'PVC rojo'], ['Tensión', '450/750 V']] },
    { id: 'c6', codigo: 'CF-2002', nombre: 'Foco LED 9 W luz cálida', foto: 'img/productos/foco-led.webp', cat: 'electricidad', tipoTxt: 'Iluminación', forma: 'foco', opcion: 'Presentación',
      tam: [{ n: '1 foco', precio: 6 }, { n: 'Pack de 4', precio: 22, antes: 24 }],
      resumen: 'Equivale a 60 W, con 15,000 horas de duración y luz cálida.',
      desc: 'Foco LED de 9 W que equivale a uno incandescente de 60 W y gasta mucho menos. Luz cálida, base E27 y hasta 15,000 horas de duración.',
      specs: [['Potencia', '9 W (equivale a 60 W)'], ['Luz', 'Cálida 3000 K'], ['Base', 'E27'], ['Duración', '15,000 horas']] },
    { id: 'c7', codigo: 'CF-2003', nombre: 'Extensión eléctrica 5 m, 4 tomas', foto: 'img/productos/extension-electrica.webp', cat: 'electricidad', tipoTxt: 'Accesorios', forma: 'extension', opcion: 'Presentación',
      tam: [{ n: '5 m', precio: 35 }],
      resumen: 'Cuatro tomas con interruptor y cuerpo amarillo reforzado, con cable de 5 m.',
      desc: 'Extensión de 5 metros con cuatro tomas e interruptor general. Cuerpo amarillo reforzado con extremos negros y cable de 3 × 1.5 mm² que se recoge fácil.',
      specs: [['Largo', '5 m'], ['Tomas', '4 con interruptor'], ['Cable', '3 × 1.5 mm²'], ['Cuerpo', 'Amarillo reforzado, extremos negros']] },
    { id: 'c8', codigo: 'CF-3001', nombre: 'Pintura látex blanco', foto: 'img/productos/pintura-latex.webp', cat: 'pinturas', tipoTxt: 'Pintura para paredes', forma: 'pintura', opcion: 'Presentación',
      tam: [{ n: '1 galón', precio: 69 }, { n: '4 galones', precio: 249, antes: 276 }],
      resumen: 'Acabado mate, lavable, para interiores y exteriores protegidos.',
      desc: 'Pintura látex blanca de acabado mate, lavable y de buena cobertura. Rinde hasta 40 m² por galón y seca al tacto en una hora.',
      specs: [['Acabado', 'Mate'], ['Rendimiento', 'Hasta 40 m² por galón'], ['Secado al tacto', '1 hora'], ['Uso', 'Interior y exterior protegido']] },
    { id: 'c9', codigo: 'CF-3002', nombre: 'Rodillo con bandeja', foto: 'img/productos/rodillo-bandeja.webp', cat: 'pinturas', tipoTxt: 'Accesorios de pintura', forma: 'rodillo', opcion: 'Presentación',
      tam: [{ n: 'Rodillo 9" + bandeja', precio: 24 }],
      resumen: 'Rodillo de felpa de 9 pulgadas con mango amarillo y bandeja plástica estriada.',
      desc: 'Rodillo de felpa de 9 pulgadas con armazón de acero y mango ergonómico amarillo y negro, con ojal para colgar. Viene con bandeja plástica de rampa estriada, que reparte bien la pintura. Ideal para paredes y techos lisos.',
      specs: [['Rodillo', '9" felpa media'], ['Bandeja', 'Plástica rígida, con rampa estriada'], ['Mango', 'Ergonómico, con ojal para colgar']] },
    { id: 'c10', codigo: 'CF-4001', nombre: 'Llave mezcladora para lavatorio', foto: 'img/productos/llave-mezcladora.webp', cat: 'plomeria', tipoTxt: 'Grifería', forma: 'llave', opcion: 'Presentación',
      tam: [{ n: 'Con mangueras', precio: 119 }],
      resumen: 'Monocomando cromada con cartucho cerámico y dos mangueras trenzadas de conexión.',
      desc: 'Llave mezcladora monocomando para lavatorio, de acabado cromo, palanca única y pico curvo corto, con cartucho cerámico de 35 mm. Incluye dos mangueras trenzadas de acero inoxidable con tuercas.',
      specs: [['Acabado', 'Cromo'], ['Cartucho', 'Cerámico 35 mm'], ['Incluye', '2 mangueras trenzadas de acero inoxidable']] },
    { id: 'c11', codigo: 'CF-4002', nombre: 'Manguera de jardín reforzada', foto: 'img/productos/manguera-jardin.webp', cat: 'plomeria', tipoTxt: 'Jardín', forma: 'manguera', opcion: 'Largo',
      tam: [{ n: '15 m', precio: 49 }, { n: '25 m', precio: 79 }],
      resumen: 'Tres capas reforzadas, con pistola multichorro y conectores de latón.',
      desc: 'Manguera de jardín de media pulgada con tres capas de refuerzo que evitan dobleces. Incluye pistola de riego con cabezal de varios chorros y conectores de latón.',
      specs: [['Diámetro', '1/2"'], ['Refuerzo', '3 capas'], ['Incluye', 'Pistola multichorro y conectores de latón']] },
    { id: 'c12', codigo: 'CF-1005', nombre: 'Caja de herramientas 17"', foto: 'img/productos/caja-herramientas.webp', cat: 'herramientas', tipoTxt: 'Almacenamiento', forma: 'caja', opcion: 'Presentación',
      tam: [{ n: '17 pulgadas', precio: 59 }],
      resumen: 'Tapa amarilla, cuerpo negro, cierres metálicos y asa reforzada.',
      desc: 'Caja de herramientas de 17 pulgadas con tapa amarilla y cuerpo negro de plástico rígido, bandeja desmontable, dos cierres metálicos y asa reforzada. Cabe lo necesario para el trabajo de la casa.',
      specs: [['Medida', '17 pulgadas'], ['Interior', 'Bandeja desmontable'], ['Cierres', 'Metálicos']] }
  ];
  var porId = {}; PRODUCTOS.forEach(function (p) { porId[p.id] = p; });
  function tam(p, n) { return p.tam.filter(function (t) { return t.n === n; })[0] || p.tam[0]; }
  w.DATOS = {
    marca: MARCA, productos: PRODUCTOS, categoriaNombre: function (c) { return CAT[c] || c; },
    producto: function (id) { return porId[id]; },
    tam: tam,
    precioLinea: function (l) { var p = porId[l.id]; return p ? tam(p, l.talla).precio : 0; },
    desde: function (p) { return p.tam[0]; },
    enOferta: function (p) { return p.tam.some(function (t) { return !!t.antes; }); }
  };
})(window);
