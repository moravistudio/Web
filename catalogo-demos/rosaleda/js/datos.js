/*
 * Muestra 2 · «Rosaleda» (perfumes y belleza) — marca inventada para la demostración. Nada de esto es un negocio real.
 * Los productos se arman a mano por Moravi Studio en este archivo (no hay panel ni base de datos).
 * Las «fotos» son ilustraciones provisionales (arte.js): cuando el cliente entregue sus fotos reales se reemplazan.
 * Cada producto tiene uno o más TAMAÑOS (tam), cada uno con su precio; si solo hay uno, no se pide elegir.
 */
(function (w) {
  'use strict';
  var MARCA = {
    nombre: 'Rosaleda', apellido: 'perfumes & belleza',
    aviso: 'Envíos a todo el Perú · Paga con tarjeta, Yape o Plin · Muestra de regalo en tu primer pedido',
    categorias: [{ id: 'todo', nombre: 'Todo' }, { id: 'perfumes', nombre: 'Perfumes' }, { id: 'cuerpo', nombre: 'Cuerpo' }, { id: 'rostro', nombre: 'Rostro' }, { id: 'regalos', nombre: 'Regalos' }, { id: 'ofertas', nombre: 'Ofertas' }]
  };
  var CAT = { perfumes: 'Perfumes', cuerpo: 'Cuerpo', rostro: 'Rostro', regalos: 'Regalos' };
  var PRODUCTOS = [
    { id: 'r1', nombre: 'Rosa Nocturna', foto: 'img/productos/rosa-nocturna.webp', cat: 'perfumes', tipoTxt: 'Eau de parfum', forma: 'cuadrado', tono: '#C2477A', fondo: '#FBE3EB', etiqueta: 'Nuevo',
      tam: [{ n: '50 ml', precio: 189 }, { n: '100 ml', precio: 289 }], notas: ['Rosa búlgara', 'Pachulí', 'Vainilla'],
      desc: 'Una rosa intensa y envolvente que se abre al caer la tarde. Fragancia floral oriental, de larga duración, pensada para las noches.' },
    { id: 'r2', nombre: 'Jazmín de Seda', foto: 'img/productos/jazmin-de-seda.webp', cat: 'perfumes', tipoTxt: 'Eau de parfum', forma: 'redondo', tono: '#E8CF8E', fondo: '#F1E6FA',
      tam: [{ n: '50 ml', precio: 179 }, { n: '100 ml', precio: 269 }], notas: ['Jazmín', 'Peonía blanca', 'Almizcle'],
      desc: 'Jazmín luminoso sobre un fondo suave de almizcle. Delicado, limpio y elegante: la fragancia perfecta para todos los días.' },
    { id: 'r3', nombre: 'Brisa de Peonía', foto: 'img/productos/brisa-de-peonia.webp', cat: 'perfumes', tipoTxt: 'Eau de toilette', forma: 'facetado', tono: '#F2A9C3', fondo: '#FDEBDD',
      tam: [{ n: '50 ml', precio: 159, antes: 189 }, { n: '100 ml', precio: 239, antes: 279 }], etiqueta: '-15%', notas: ['Peonía', 'Pera', 'Cedro blanco'],
      desc: 'Fresca y ligera, con la dulzura de la peonía y un toque de fruta. Una eau de toilette alegre para primavera y verano.' },
    { id: 'r4', nombre: 'Ámbar Dulce', foto: 'img/productos/ambar-dulce.webp', cat: 'perfumes', tipoTxt: 'Eau de parfum', forma: 'alto', tono: '#E59A3E', fondo: '#E9F3EC',
      tam: [{ n: '50 ml', precio: 199 }, { n: '100 ml', precio: 299 }], notas: ['Ámbar', 'Caramelo', 'Haba tonka'],
      desc: 'Cálida, golosa y sofisticada. El ámbar se mezcla con caramelo y haba tonka en una fragancia que deja huella.' },
    { id: 'r5', nombre: 'Bruma Corporal Vainilla', foto: 'img/productos/bruma-vainilla.webp', cat: 'cuerpo', tipoTxt: 'Bruma corporal', forma: 'bruma', tono: '#F5C9D8', fondo: '#F1E6FA',
      tam: [{ n: '120 ml', precio: 79 }, { n: '240 ml', precio: 129 }],
      desc: 'Bruma ligera con aroma a vainilla suave. Se aplica sobre la piel y el cabello para un perfume sutil durante el día.' },
    { id: 'r6', nombre: 'Crema Corporal Almendra', foto: 'img/productos/crema-almendra.webp', cat: 'cuerpo', tipoTxt: 'Crema corporal', forma: 'crema', tono: '#FFF0E6', fondo: '#FBE3EB',
      tam: [{ n: '200 ml', precio: 69 }, { n: '400 ml', precio: 109 }],
      desc: 'Crema de textura rica y absorción rápida, con aceite de almendras. Deja la piel suave e hidratada, con un aroma delicado.' },
    { id: 'r7', nombre: 'Sérum Facial Rosa Mosqueta', foto: 'img/productos/serum-rosa-mosqueta.webp', cat: 'rostro', tipoTxt: 'Sérum facial', forma: 'serum', tono: '#F6B7A2', fondo: '#FDEBDD',
      tam: [{ n: '30 ml', precio: 119 }],
      desc: 'Sérum ligero con aceite de rosa mosqueta para usar de día o de noche. Textura fluida que se absorbe sin dejar sensación grasa.' },
    { id: 'r8', nombre: 'Set Regalo Rosaleda', foto: 'img/productos/set-regalo.webp', cat: 'regalos', tipoTxt: 'Set de regalo', forma: 'set', tono: '#C2477A', fondo: '#E9F3EC', etiqueta: '-15%',
      tam: [{ n: 'Set', precio: 229, antes: 268 }],
      desc: 'Eau de parfum Rosa Nocturna de 50 ml, bruma corporal Vainilla de 120 ml y crema de manos de 30 ml, en una caja de regalo rosa con lazo de satén, lista para entregar.' }
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
