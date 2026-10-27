/*
 * Muestra 1 · «Azahar» (carteras y calzado) — marca inventada para la demostración. Nada de esto es un negocio real.
 * Los productos se arman a mano por Moravi Studio en este archivo (no hay panel ni base de datos).
 * Las «fotos» son ilustraciones provisionales (arte.js): cuando el cliente entregue sus fotos reales se reemplazan.
 */
(function (w) {
  'use strict';
  var COLORES = {
    camel: { nombre: 'Camel', hex: '#B97B45' }, negro: { nombre: 'Negro', hex: '#2B2522' }, vino: { nombre: 'Vino', hex: '#6E2433' },
    crema: { nombre: 'Crema', hex: '#E6D6BD' }, oliva: { nombre: 'Oliva', hex: '#5D6A44' }
  };
  var MARCA = {
    nombre: 'Azahar', apellido: 'cuero & calzado', whatsapp: '51940284018',
    aviso: 'Envíos a todo el Perú · Paga con tarjeta, Yape o Plin',
    categorias: [{ id: 'todo', nombre: 'Todo' }, { id: 'carteras', nombre: 'Carteras' }, { id: 'calzado', nombre: 'Calzado' }, { id: 'ofertas', nombre: 'Ofertas' }]
  };
  var TALLAS_CALZADO = ['35', '36', '37', '38', '39', '40'];
  var PRODUCTOS = [
    { id: 'p1', nombre: 'Tote Lima', cat: 'carteras', tipo: 'tote', precio: 289, colores: ['camel'], fotos: { camel: 'img/productos/tote-lima-camel.jpg' }, etiqueta: 'Nuevo', desc: 'Tote amplio de cuero para el día a día: cabe la laptop, la agenda y todo lo que necesitas. Dos asas reforzadas y cierre con broche dorado.', medidas: '36 × 30 × 12 cm' },
    { id: 'p2', nombre: 'Bandolera Cusco', cat: 'carteras', tipo: 'bandolera', precio: 239, colores: ['negro'], fotos: { negro: 'img/productos/bandolera-cusco-negro.jpg' }, desc: 'Bandolera compacta con solapa y correa ajustable. Ligera, elegante y con espacio para lo esencial.', medidas: '24 × 17 × 7 cm' },
    { id: 'p3', nombre: 'Clutch Paracas', cat: 'carteras', tipo: 'clutch', precio: 169, antes: 210, colores: ['vino'], fotos: { vino: 'img/productos/clutch-paracas-vino.jpg' }, etiqueta: '-20%', desc: 'Clutch de noche con pliegue suave y botón dorado. Perfecta para eventos y cenas.', medidas: '27 × 14 × 3 cm' },
    { id: 'p4', nombre: 'Bucket Arequipa', cat: 'carteras', tipo: 'bucket', precio: 259, colores: ['crema'], fotos: { crema: 'img/productos/bucket-arequipa-crema.jpg' }, desc: 'Bolso saco con cordón dorado y asa larga desmontable. Un clásico que combina con todo.', medidas: '22 × 24 × 14 cm' },
    { id: 'p5', nombre: 'Tote Barranco', cat: 'carteras', tipo: 'tote', precio: 299, colores: ['oliva'], fotos: { oliva: 'img/productos/tote-barranco-oliva.jpg' }, etiqueta: 'Nuevo', desc: 'Versión grande del tote, con bolsillo interno con cierre. Ideal para viajes cortos y la oficina.', medidas: '40 × 32 × 14 cm' },
    { id: 'p6', nombre: 'Bandolera Máncora', cat: 'carteras', tipo: 'bandolera', precio: 219, colores: ['camel'], fotos: { camel: 'img/productos/bandolera-mancora-camel.jpg' }, desc: 'Bandolera de verano en tonos cálidos, con correa de cuero trenzado.', medidas: '22 × 16 × 6 cm' },
    { id: 'p7', nombre: 'Zapatilla Alba', cat: 'calzado', tipo: 'zapatilla', precio: 249, colores: ['crema'], fotos: { crema: 'img/productos/zapatilla-alba-crema.jpg' }, ajustes: { crema: 'translateY(-10.2%) scale(1.2)' }, tallas: TALLAS_CALZADO, etiqueta: 'Nuevo', desc: 'Zapatilla urbana de cuero con suela de goma ligera. Cómoda desde el primer día.', medidas: 'Horma regular' },
    { id: 'p8', nombre: 'Bota Otoño', cat: 'calzado', tipo: 'bota', precio: 389, colores: ['camel'], fotos: { camel: 'img/productos/bota-otono-camel.jpg' }, ajustes: { camel: 'translateY(-17%) scale(1.3)' }, tallas: TALLAS_CALZADO, desc: 'Botín de caña media con suela de cuero y taco bajo. Para toda la temporada fría.', medidas: 'Caña 14 cm' },
    { id: 'p9', nombre: 'Sandalia Brisa', cat: 'calzado', tipo: 'sandalia', precio: 159, colores: ['negro'], fotos: { negro: 'img/productos/sandalia-brisa-negro.jpg' }, ajustes: { negro: 'translateY(-9%) scale(1.15)' }, tallas: TALLAS_CALZADO, desc: 'Sandalia plana de dos tiras, suave y fresca. La compañera del verano.', medidas: 'Plantilla acolchada' },
    { id: 'p10', nombre: 'Mocasín Clásico', cat: 'calzado', tipo: 'mocasin', precio: 279, colores: ['vino'], fotos: { vino: 'img/productos/mocasin-clasico-vino.jpg' }, ajustes: { vino: 'translateY(-8%) scale(1.1)' }, tallas: TALLAS_CALZADO, desc: 'Mocasín de cuero con detalle dorado. Elegante para la oficina y cómodo para caminar.', medidas: 'Horma regular' },
    { id: 'p11', nombre: 'Zapatilla Ruta', cat: 'calzado', tipo: 'zapatilla', precio: 219, antes: 259, colores: ['oliva'], fotos: { oliva: 'img/productos/zapatilla-ruta-oliva.jpg' }, tallas: TALLAS_CALZADO, etiqueta: '-15%', desc: 'Zapatilla de uso diario con plantilla suave y buen agarre.', medidas: 'Horma ancha' },
    { id: 'p12', nombre: 'Bota Andina', cat: 'calzado', tipo: 'bota', precio: 429, colores: ['negro'], fotos: { negro: 'img/productos/bota-andina-negro.jpg' }, tallas: TALLAS_CALZADO, desc: 'Bota resistente con suela de goma y cierre lateral. Pensada para ciudad y paseo.', medidas: 'Caña 18 cm' }
  ];
  var porId = {}; PRODUCTOS.forEach(function (p) { porId[p.id] = p; });
  w.DATOS = { marca: MARCA, colores: COLORES, productos: PRODUCTOS, producto: function (id) { return porId[id]; }, precio: function (id) { return porId[id] ? porId[id].precio : 0; } };
})(window);
