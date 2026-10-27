/* Textos comunes en inglés: franja de muestra, carrito/pedido, pago y confirmación. Cada muestra añade los suyos en js/en.js */
(function () {
  if (!window.Idioma) return;
  var cuenta = function (n, uno, otros) { return n + ' ' + (n === '1' ? uno : otros); };
  window.Idioma.registrar({
    d: {
      '← Ver otras muestras': "← See other samples", '← Muestras': "← Samples",
      'Muestra de catálogo hecha por Moravi Studio': "Catalog sample made by Moravi Studio", 'Quiero uno así': "I want one like this", 'Idioma': "Language",
      'Todo': "All", 'Buscar': "Search", 'Carrito': "Cart", 'Categorías': "Categories", 'Filtrar por categoría': "Filter by category", 'Nuevo': "New",
      'Tu carrito': "Your cart", 'Tu carrito está vacío.': "Your cart is empty.", 'Agrega algo que te guste y aparecerá aquí.': "Add something you like and it will appear here.",
      'Seguir mirando': "Keep browsing", 'Abrir carrito': "Open cart", 'Carrito de compras': "Shopping cart", 'Cerrar carrito': "Close cart",
      'Quitar': "Remove", 'Quitar uno': "Remove one", 'Agregar uno': "Add one", 'Menos': "Less", 'Más': "More", 'Cerrar': "Close",
      'Subtotal': "Subtotal", 'El envío se calcula al pagar.': "Shipping is calculated at checkout.", 'Ir a pagar': "Go to checkout",
      'No encontramos productos con eso.': "We couldn't find any products for that.", 'Prueba con otra palabra o mira todo el catálogo.': "Try another word or browse the whole catalog.", 'Ver todo': "See all",
      'Tienda': "Shop", 'Información': "Information", 'Paga como prefieras': "Pay your way", 'Tarjeta': "Card",
      'Compra segura: tus datos de pago no pasan por nuestro catálogo.': "Safe shopping: your payment details never pass through our catalog.",
      'Inicio': "Home", 'Color': "Color", 'Desde': "From", 'Cantidad': "Quantity",
      // pago
      'Finalizar compra': "Checkout", 'Compra segura: pagas aquí mismo, sin salir del catálogo.': "Safe shopping: you pay right here, without leaving the catalog.",
      '1 · Datos de entrega': "1 · Delivery details", 'Nombre completo': "Full name", 'Celular': "Mobile phone", 'Correo': "Email", 'Distrito': "District", 'Ciudad': "City", 'Dirección y referencia': "Address and landmark",
      '2 · Medio de pago': "2 · Payment method", 'Medio de pago': "Payment method", 'Con tu celular': "With your phone", 'Desde tu banco': "From your bank",
      'Número de tarjeta': "Card number", 'Vencimiento': "Expiry date", 'Código (CVV)': "Security code (CVV)", 'MM/AA': "MM/YY",
      'Pago simulado para la demostración: no se cobra nada. En el catálogo real este paso lo procesa la pasarela de pago y el vendedor recibe el pedido por correo.': "Simulated payment for the demo: nothing is charged. In the real catalog this step is processed by the payment gateway and the seller receives the order by email.",
      'Al pagar con Plin te mostraremos la ventana de tu banco para aprobar el pago desde tu app.': "When you pay with Plin, we will show you your bank's window so you can approve the payment from your app.",
      'Completa tus datos de entrega para continuar.': "Complete your delivery details to continue.",
      'Tu pedido': "Your order", 'Envío': "Shipping", 'Gratis': "Free", 'Total': "Total", 'Seguir comprando': "Keep shopping", '← Seguir comprando': "← Keep shopping",
      'fue recibido. Te escribiremos al correo y al celular que indicaste.': "was received. We will write to you at the email and phone number you provided.",
      'Volver al catálogo': "Back to the catalog"
    },
    p: [
      [/^(\d+) productos?$/, function (t, n) { return cuenta(n, 'product', 'products'); }],
      [/^Pagar (S\/ .+)$/, function (t, m) { return 'Pay ' + m; }],
      [/^¡Gracias por tu compra, (.+)!$/, function (t, n) { return 'Thank you for your purchase, ' + n + '!'; }],
      [/^Esto fue una simulación\. En el catálogo real: el pago se procesa con la pasarela del cliente y al vendedor le llega un correo con este pedido \(productos, datos de entrega y monto de (.+)\) para que lo prepare y lo envíe\.$/, function (t, m) { return "This was a simulation. In the real catalog: the payment is processed with the customer's gateway and the seller receives an email with this order (products, delivery details and an amount of " + m + ') so they can prepare and ship it.'; }]
    ],
    t: [[/\(muestra de catálogo\)/, '(catalog sample)'], [/^Pagar ·/, 'Checkout ·'], [/^Producto ·/, 'Product ·']]
  });
})();
