/*
 * Ilustraciones provisionales de producto (SVG propio, sin derechos de autor) para la muestra 2.
 * Sirven para ver cómo queda el catálogo mientras el cliente no entrega sus fotos reales.
 *   Arte.producto(p, alt)      → texto SVG completo (con fondo)
 *   Arte.pieza(forma, tono)    → solo el envase, para componer la portada
 */
(function (w) {
  'use strict';
  var n = 0, ORO1 = '#EBD79F', ORO2 = '#B58F45', CIRUELA = '#C2407A';

  // degradados propios de cada envase (identificador único para que no choquen dos dibujos en la misma página)
  function defs(g, tono) {
    return '<defs><linearGradient id="' + g + 'o" x1="0" x2="1"><stop offset="0" stop-color="' + ORO1 + '"/><stop offset="1" stop-color="' + ORO2 + '"/></linearGradient>' +
      '<linearGradient id="' + g + 'v" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/></linearGradient>' +
      '<linearGradient id="' + g + 'l" x1="0" x2="1"><stop offset="0" stop-color="' + U.claro(tono, .25) + '"/><stop offset=".6" stop-color="' + tono + '"/><stop offset="1" stop-color="' + U.oscuro(tono, .18) + '"/></linearGradient></defs>';
  }
  function etiqueta(x, y, ancho) {
    return '<rect x="' + x + '" y="' + y + '" width="' + ancho + '" height="42" rx="4" fill="#fff" opacity=".9"/>' +
      '<text x="' + (x + ancho / 2) + '" y="' + (y + 19) + '" text-anchor="middle" font-family="Georgia,serif" font-size="11" letter-spacing="2" fill="' + CIRUELA + '">ROSALEDA</text>' +
      '<path d="M' + (x + 14) + ' ' + (y + 29) + ' H' + (x + ancho - 14) + '" stroke="' + CIRUELA + '" stroke-width="1" opacity=".5"/>';
  }
  function brillo(x, y, h) { return '<rect x="' + x + '" y="' + y + '" width="9" height="' + h + '" rx="4.5" fill="#fff" opacity=".55"/>'; }
  function vidrio(g, t) { return 'fill="url(#' + g + 'v)" stroke="' + U.oscuro(t, .1) + '" stroke-opacity=".28"'; }

  function cuadrado(g, t) {
    return '<rect x="182" y="198" width="36" height="32" fill="url(#' + g + 'o)"/><rect x="166" y="124" width="68" height="78" rx="9" fill="url(#' + g + 'o)"/><rect x="166" y="124" width="68" height="14" rx="7" fill="#fff" opacity=".3"/>' +
      '<rect x="122" y="224" width="156" height="208" rx="22" ' + vidrio(g, t) + '/><rect x="134" y="256" width="132" height="164" rx="14" fill="url(#' + g + 'l)"/>' + etiqueta(160, 322, 80) + brillo(140, 266, 120);
  }
  function redondo(g, t) {
    return '<rect x="186" y="214" width="28" height="34" fill="url(#' + g + 'o)"/><circle cx="200" cy="170" r="42" fill="url(#' + g + 'o)"/><ellipse cx="184" cy="150" rx="16" ry="9" fill="#fff" opacity=".35"/>' +
      '<circle cx="200" cy="340" r="96" ' + vidrio(g, t) + '/><circle cx="200" cy="340" r="84" fill="url(#' + g + 'l)"/>' + etiqueta(160, 322, 80) +
      '<path d="M128 306 A84 84 0 0 1 164 266" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".55"/>';
  }
  function facetado(g, t) {
    return '<rect x="184" y="196" width="32" height="36" fill="url(#' + g + 'o)"/><rect x="164" y="122" width="72" height="80" rx="12" fill="url(#' + g + 'o)"/><rect x="164" y="122" width="72" height="14" rx="7" fill="#fff" opacity=".3"/>' +
      '<polygon points="200,226 282,262 282,402 200,434 118,402 118,262" ' + vidrio(g, t) + '/><polygon points="200,246 266,272 266,396 200,420 134,396 134,272" fill="url(#' + g + 'l)"/>' +
      '<polyline points="134,272 200,300 266,272" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><line x1="200" y1="300" x2="200" y2="420" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>' + etiqueta(163, 338, 74);
  }
  function alto(g, t) {
    return '<rect x="180" y="150" width="40" height="30" fill="url(#' + g + 'o)"/><rect x="170" y="86" width="60" height="68" rx="10" fill="' + CIRUELA + '"/><rect x="170" y="128" width="60" height="9" fill="url(#' + g + 'o)"/><rect x="170" y="86" width="60" height="12" rx="6" fill="#fff" opacity=".25"/>' +
      '<rect x="146" y="176" width="108" height="256" rx="16" ' + vidrio(g, t) + '/><rect x="156" y="206" width="88" height="214" rx="10" fill="url(#' + g + 'l)"/>' + etiqueta(160, 276, 80) + brillo(160, 216, 160);
  }
  function bruma(g, t) {
    return '<rect x="190" y="150" width="20" height="36" fill="' + U.oscuro('#E7A8BC', .1) + '"/><rect x="168" y="106" width="64" height="48" rx="12" fill="#E7A8BC"/><rect x="224" y="118" width="26" height="12" rx="6" fill="#E7A8BC"/><rect x="168" y="106" width="64" height="12" rx="6" fill="#fff" opacity=".35"/>' +
      '<rect x="146" y="180" width="108" height="252" rx="26" ' + vidrio(g, t) + '/><rect x="156" y="226" width="88" height="196" rx="18" fill="url(#' + g + 'l)"/>' + etiqueta(160, 290, 80) + brillo(162, 236, 150);
  }
  function crema(g, t) {
    return '<rect x="100" y="292" width="200" height="50" rx="16" fill="url(#' + g + 'o)"/><rect x="100" y="292" width="200" height="12" rx="6" fill="#fff" opacity=".35"/>' +
      '<rect x="108" y="336" width="184" height="98" rx="22" fill="#fff" stroke="' + U.oscuro('#F6DCE6', .1) + '"/><rect x="108" y="336" width="184" height="98" rx="22" fill="' + t + '" opacity=".55"/>' + etiqueta(160, 358, 80) +
      '<rect x="120" y="344" width="10" height="80" rx="5" fill="#fff" opacity=".55"/>';
  }
  function serum(g, t) {
    return '<path d="M182 118 Q182 84 200 84 Q218 84 218 118 L218 190 L182 190 Z" fill="' + CIRUELA + '"/><rect x="176" y="186" width="48" height="26" rx="4" fill="url(#' + g + 'o)"/>' +
      '<rect x="144" y="210" width="112" height="224" rx="20" ' + vidrio(g, t) + '/><rect x="154" y="226" width="92" height="196" rx="14" fill="url(#' + g + 'l)"/>' + etiqueta(160, 286, 80) + brillo(160, 238, 150);
  }
  // el set junta un perfume y una bruma dentro de una caja con lazo; cada envase lleva sus propios degradados
  function set() {
    var a = 'a' + (++n), b = 'a' + (++n);
    return defs(a, '#F2A9C3') + defs(b, '#F5C9D8') +
      '<g transform="translate(-22 18) scale(.92)">' + facetado(a, '#F2A9C3') + '</g>' +
      '<g transform="translate(96 74) scale(.76)">' + bruma(b, '#F5C9D8') + '</g>' +
      '<rect x="70" y="338" width="260" height="98" rx="12" fill="' + CIRUELA + '"/><rect x="70" y="338" width="260" height="22" rx="8" fill="' + U.claro(CIRUELA, .14) + '"/>' +
      '<rect x="190" y="338" width="20" height="98" fill="#FBD5E3"/><path d="M200 338 C168 300 146 324 178 338 Z M200 338 C232 300 254 324 222 338 Z" fill="#FBD5E3"/>' +
      '<text x="130" y="402" text-anchor="middle" font-family="Georgia,serif" font-size="12" letter-spacing="3" fill="#F7DCE8">ROSALEDA</text>';
  }
  var FORMAS = { cuadrado: cuadrado, redondo: redondo, facetado: facetado, alto: alto, bruma: bruma, crema: crema, serum: serum };

  function pieza(forma, tono) {
    var sombra = '<ellipse cx="200" cy="438" rx="120" ry="12" fill="#3A1F30" opacity=".12"/>';
    if (forma === 'set') return sombra + set();
    var g = 'a' + (++n);
    return defs(g, tono) + sombra + (FORMAS[forma] || cuadrado)(g, tono);
  }
  w.Arte = {
    pieza: pieza,
    producto: function (p, alt) {
      // con foto real (datos.js → foto) se muestra la foto; si todavía no hay, la ilustración provisional
      if (p.foto) return '<img src="' + p.foto + '" alt="' + U.esc(alt || p.nombre) + '" loading="lazy">';
      return '<svg viewBox="0 0 400 500" role="img" aria-label="' + U.esc(alt || p.nombre) + '" preserveAspectRatio="xMidYMid slice"><rect width="400" height="500" fill="' + p.fondo + '"/>' +
        '<circle cx="200" cy="300" r="168" fill="#fff" opacity=".42"/><circle cx="332" cy="92" r="34" fill="#fff" opacity=".5"/>' + pieza(p.forma, p.tono) + '</svg>';
    }
  };
})(window);
