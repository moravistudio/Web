/*
 * Ilustraciones provisionales de producto (SVG propio, sin derechos de autor). Sirven para ver cómo queda el catálogo
 * mientras el cliente no entrega sus fotos. Cada una se dibuja en el color elegido del producto.
 *   Arte.producto('tote', '#B97B45', { fondo: '#F3E9DC' })  → texto SVG
 */
(function (w) {
  'use strict';
  var ORO = '#C99A52';
  function tote(c, o, d) { return '<path d="M142 205 C140 90 260 90 258 205" fill="none" stroke="' + o + '" stroke-width="15" stroke-linecap="round"/>' +
    '<path d="M95 205 L305 205 L331 438 Q333 456 315 456 L85 456 Q67 456 69 438 Z" fill="' + c + '"/>' +
    '<path d="M95 205 L305 205 L309 245 L91 245 Z" fill="' + d + '" opacity=".35"/>' +
    '<path d="M86 330 L314 330" stroke="' + d + '" stroke-width="3" stroke-dasharray="7 7" opacity=".55"/>' +
    '<circle cx="200" cy="262" r="9" fill="' + ORO + '"/><circle cx="200" cy="262" r="3.5" fill="' + o + '" opacity=".35"/>'; }
  function bandolera(c, o, d) { return '<path d="M112 262 C96 80 304 80 288 262" fill="none" stroke="' + o + '" stroke-width="12" stroke-linecap="round"/>' +
    '<rect x="92" y="250" width="216" height="170" rx="22" fill="' + c + '"/>' +
    '<path d="M92 272 Q92 250 114 250 L286 250 Q308 250 308 272 L308 312 Q200 372 92 312 Z" fill="' + d + '" opacity=".4"/>' +
    '<path d="M92 312 Q200 372 308 312" fill="none" stroke="' + d + '" stroke-width="3" opacity=".6"/>' +
    '<circle cx="200" cy="338" r="11" fill="' + ORO + '"/><circle cx="200" cy="338" r="4" fill="' + o + '" opacity=".35"/>'; }
  function clutch(c, o, d) { return '<rect x="66" y="270" width="268" height="150" rx="26" fill="' + c + '"/>' +
    '<path d="M66 312 Q200 392 334 312 L334 296 Q334 270 308 270 L92 270 Q66 270 66 296 Z" fill="' + d + '" opacity=".4"/>' +
    '<path d="M66 312 Q200 392 334 312" fill="none" stroke="' + d + '" stroke-width="3" opacity=".6"/>' +
    '<circle cx="200" cy="364" r="12" fill="' + ORO + '"/><circle cx="200" cy="364" r="4.5" fill="' + o + '" opacity=".35"/>' +
    '<path d="M334 300 C372 300 372 360 334 360" fill="none" stroke="' + o + '" stroke-width="9" stroke-linecap="round"/>'; }
  function bucket(c, o, d) { return '<path d="M118 232 C84 120 316 120 282 232" fill="none" stroke="' + o + '" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M108 244 Q96 430 150 456 L250 456 Q304 430 292 244 Z" fill="' + c + '"/>' +
    '<ellipse cx="200" cy="244" rx="92" ry="24" fill="' + d + '"/><ellipse cx="200" cy="244" rx="92" ry="24" fill="none" stroke="' + o + '" stroke-width="3" opacity=".4"/>' +
    '<path d="M126 262 Q200 296 274 262" fill="none" stroke="' + ORO + '" stroke-width="5" stroke-linecap="round"/>' +
    '<circle cx="200" cy="288" r="8" fill="' + ORO + '"/><path d="M200 296 L190 330 M200 296 L210 330" stroke="' + ORO + '" stroke-width="4" stroke-linecap="round"/>'; }
  function zapatilla(c, o, d) { return '<g transform="translate(50 195) scale(1)">' +
    '<path d="M22 138 L22 78 Q22 62 42 60 L90 55 Q114 56 128 76 Q154 106 214 108 Q282 112 286 138 Z" fill="' + c + '"/>' +
    '<path d="M214 108 Q282 112 286 138 L196 138 Q200 118 214 108 Z" fill="' + U.claro(c, .28) + '"/>' +
    '<path d="M22 80 Q40 62 90 55 L94 72 Q52 78 22 96 Z" fill="' + d + '" opacity=".55"/>' +
    '<path d="M18 138 L286 138 Q298 138 298 150 Q298 164 282 164 L36 164 Q18 164 18 148 Z" fill="#F6F1E9"/>' +
    '<path d="M18 146 L298 146" stroke="' + o + '" stroke-width="2.5" opacity=".18"/>' +
    '<path d="M126 82 L152 102 M140 72 L166 94 M154 64 L180 88" stroke="#fff" stroke-width="5.5" stroke-linecap="round" opacity=".92"/></g>'; }
  function bota(c, o, d) { return '<g transform="translate(48 170)">' +
    '<path d="M74 14 L152 14 L154 112 Q156 134 196 138 Q266 144 280 166 L280 178 L58 178 Q50 178 50 168 L50 40 Q50 14 74 14 Z" fill="' + c + '"/>' +
    '<path d="M50 40 Q50 14 74 14 L152 14 L152 34 L50 56 Z" fill="' + d + '" opacity=".45"/>' +
    '<path d="M78 120 Q104 150 178 150" fill="none" stroke="' + d + '" stroke-width="3" stroke-dasharray="6 6" opacity=".6"/>' +
    '<path d="M46 178 L284 178 Q294 178 294 190 L294 196 L46 196 Z" fill="' + o + '"/>' +
    '<rect x="50" y="178" width="58" height="26" rx="4" fill="' + U.claro(o, .12) + '"/></g>'; }
  function sandalia(c, o, d) { return '<g transform="translate(50 250)">' +
    '<path d="M18 90 Q18 66 58 62 L248 66 Q286 72 286 92 Q286 108 248 108 L50 108 Q18 108 18 90 Z" fill="' + U.mezcla(c, '#E3CDAA', .62) + '"/>' +
    '<path d="M18 98 Q18 114 50 114 L248 114 Q286 114 286 98" fill="none" stroke="' + d + '" stroke-width="5" opacity=".5"/>' +
    '<path d="M104 70 Q150 6 214 72" fill="none" stroke="' + c + '" stroke-width="22" stroke-linecap="round"/>' +
    '<path d="M168 72 Q204 30 252 76" fill="none" stroke="' + d + '" stroke-width="16" stroke-linecap="round" opacity=".85"/>' +
    '<circle cx="214" cy="42" r="7" fill="' + ORO + '"/></g>'; }
  function mocasin(c, o, d) { return '<g transform="translate(46 215)">' +
    '<path d="M24 118 Q22 64 74 58 L132 54 Q172 56 196 80 Q250 90 286 112 Q298 120 290 130 L24 130 Z" fill="' + c + '"/>' +
    '<path d="M24 118 Q22 64 74 58 L82 80 Q40 90 24 118 Z" fill="' + d + '" opacity=".5"/>' +
    '<path d="M196 80 Q250 90 286 112 Q298 120 290 130 L190 130 Q196 100 196 80 Z" fill="' + U.claro(c, .2) + '"/>' +
    '<path d="M118 66 Q150 74 170 96" fill="none" stroke="' + d + '" stroke-width="3" opacity=".6"/>' +
    '<rect x="132" y="70" width="40" height="11" rx="5.5" fill="' + ORO + '" transform="rotate(14 152 76)"/>' +
    '<path d="M18 130 L296 130 Q304 130 304 140 L304 148 L18 148 Z" fill="' + o + '"/>' +
    '<rect x="22" y="132" width="52" height="22" rx="4" fill="' + U.claro(o, .1) + '"/></g>'; }
  var TIPOS = { tote: tote, bandolera: bandolera, clutch: clutch, bucket: bucket, zapatilla: zapatilla, bota: bota, sandalia: sandalia, mocasin: mocasin };
  var CALZADO = { zapatilla: 1, bota: 1, sandalia: 1, mocasin: 1 };
  w.Arte = {
    // foto real del producto en ese color (datos.js → fotos); si todavía no hay, la ilustración provisional
    imagen: function (p, k, hex, i, alt) {
      var f = p.fotos && p.fotos[k], t = p.ajustes && p.ajustes[k]; // ajustes: encuadre (zoom/desplazamiento) cuando el producto no quedó centrado en la foto
      return f ? '<img src="' + f + '" alt="' + alt + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block' + (t ? ';transform:' + t : '') + '">'
        : w.Arte.producto(p.tipo, hex, { fondo: w.Arte.fondo(hex, i), alt: alt });
    },
    fondo: function (hex, i) { var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16), lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255; return lum > .7 ? U.mezcla(hex, '#B9A184', [.5, .42, .56, .36][i || 0]) : U.mezcla(hex, '#F4EADE', [.88, .76, .92, .66][i || 0]); },
    pieza: function (tipo, hex) { var d = U.oscuro(hex, .28), o = U.oscuro(hex, .5); return (TIPOS[tipo] || tote)(hex, o, d); },
    producto: function (tipo, hex, op) {
      op = op || {}; var d = U.oscuro(hex, .28), o = U.oscuro(hex, .5), f = (TIPOS[tipo] || tote)(hex, o, d);
      return '<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + U.esc(op.alt || 'Producto') + '" preserveAspectRatio="xMidYMid meet">' +
        (op.fondo ? '<rect width="400" height="500" fill="' + op.fondo + '"/>' : '') +
        (CALZADO[tipo] ? '<ellipse cx="200" cy="386" rx="150" ry="14" fill="#000" opacity=".09"/><g transform="translate(-50 -75) scale(1.25)">' + f + '</g>' : '<ellipse cx="200" cy="462" rx="128" ry="14" fill="#000" opacity=".09"/>' + f) + '</svg>';
    }
  };
})(window);
