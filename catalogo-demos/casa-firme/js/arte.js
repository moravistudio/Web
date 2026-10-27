/*
 * Ilustraciones provisionales de producto (SVG propio, sin derechos de autor) para la muestra 3.
 * Sirven para ver cómo queda el catálogo mientras el cliente no entrega sus fotos reales.
 *   Arte.producto(p, alt) → <img> si el producto tiene `foto`; si no, una ilustración sobre fondo claro.
 */
(function (w) {
  'use strict';
  var Y = '#F2B705', C = '#1F2A30', G = '#8C969E', GL = '#C9CED2', R = '#C2402A', V = '#3C8C5A', M = '#B98A56';

  var FORMAS = {
    taladro: function () {
      return '<rect x="36" y="64" width="104" height="46" rx="16" fill="' + Y + '"/><rect x="136" y="76" width="28" height="24" rx="5" fill="' + C + '"/><rect x="164" y="86" width="24" height="5" rx="2" fill="' + G + '"/>' +
        '<path d="M66 108h30l-8 58H60z" fill="' + C + '"/><rect x="52" y="76" width="44" height="6" rx="3" fill="' + C + '" opacity=".25"/><rect x="104" y="104" width="22" height="12" rx="4" fill="' + C + '"/>';
    },
    llaveajustable: function () {
      return '<g transform="rotate(-38 100 104)"><rect x="91" y="74" width="18" height="96" rx="8" fill="' + Y + '"/><rect x="91" y="112" width="18" height="42" rx="7" fill="' + C + '"/><path d="M76 70V40a10 10 0 0 1 10-10h28a10 10 0 0 1 10 10v30z" fill="#B9C0C6"/><rect x="95" y="30" width="20" height="26" fill="#F4F2ED"/><rect x="95" y="56" width="20" height="6" rx="3" fill="' + G + '"/><circle cx="100" cy="66" r="7" fill="' + GL + '" stroke="' + G + '" stroke-width="2"/></g>';
    },
    martillo: function () {
      return '<g transform="rotate(-35 100 104)"><rect x="93" y="62" width="14" height="108" rx="6" fill="' + M + '"/><rect x="62" y="44" width="76" height="26" rx="6" fill="' + C + '"/><path d="M62 52h-14l8 16h6z" fill="' + C + '"/><rect x="92" y="150" width="16" height="20" rx="6" fill="' + Y + '"/></g>';
    },
    flexometro: function () {
      return '<rect x="50" y="56" width="92" height="84" rx="20" fill="' + Y + '"/><circle cx="96" cy="98" r="22" fill="' + C + '" opacity=".9"/><circle cx="96" cy="98" r="9" fill="' + Y + '"/>' +
        '<rect x="138" y="100" width="48" height="9" fill="' + GL + '"/><rect x="184" y="96" width="5" height="17" fill="' + G + '"/><path d="M146 100v5M154 100v5M162 100v5M170 100v5M178 100v5" stroke="' + C + '" stroke-width="1.5"/><rect x="60" y="128" width="26" height="9" rx="4" fill="' + C + '"/>';
    },
    cable: function () {
      return '<circle cx="100" cy="96" r="62" fill="none" stroke="' + R + '" stroke-width="15"/><circle cx="100" cy="96" r="44" fill="none" stroke="' + R + '" stroke-width="15" opacity=".85"/><circle cx="100" cy="96" r="26" fill="none" stroke="' + R + '" stroke-width="15" opacity=".7"/>' +
        '<path d="M150 150q18 18 36 12" fill="none" stroke="' + R + '" stroke-width="10" stroke-linecap="round"/><circle cx="186" cy="162" r="6" fill="' + GL + '"/>';
    },
    foco: function () {
      return '<circle cx="100" cy="82" r="44" fill="#FFE9A6" stroke="' + GL + '" stroke-width="3"/><path d="M88 118l6-26h12l6 26" fill="none" stroke="' + Y + '" stroke-width="3" stroke-linecap="round"/>' +
        '<rect x="82" y="124" width="36" height="34" rx="6" fill="' + GL + '"/><path d="M82 134h36M82 144h36" stroke="' + G + '" stroke-width="3"/><rect x="92" y="158" width="16" height="8" rx="4" fill="' + C + '"/>' +
        '<path d="M100 20v-10M52 36l-8-8M148 36l8-8M36 82H24M164 82h12" stroke="' + Y + '" stroke-width="4" stroke-linecap="round"/>';
    },
    extension: function () {
      var s = '<rect x="46" y="76" width="118" height="46" rx="10" fill="' + Y + '"/><rect x="54" y="84" width="102" height="30" rx="6" fill="' + C + '" opacity=".12"/>', i;
      for (i = 0; i < 4; i++) s += '<circle cx="' + (68 + i * 24) + '" cy="99" r="8" fill="' + C + '"/><circle cx="' + (65 + i * 24) + '" cy="99" r="1.8" fill="' + Y + '"/><circle cx="' + (71 + i * 24) + '" cy="99" r="1.8" fill="' + Y + '"/>';
      return s + '<path d="M46 99q-26 0-26 28t30 24" fill="none" stroke="' + C + '" stroke-width="6" stroke-linecap="round"/><rect x="40" y="148" width="22" height="18" rx="4" fill="' + GL + '"/><rect x="146" y="68" width="10" height="6" rx="3" fill="' + R + '"/>';
    },
    pintura: function () {
      return '<path d="M50 70h100l-8 92a8 8 0 0 1-8 7H66a8 8 0 0 1-8-7z" fill="#fff" stroke="' + GL + '" stroke-width="3"/><ellipse cx="100" cy="70" rx="50" ry="11" fill="#F3F1ED" stroke="' + GL + '" stroke-width="3"/>' +
        '<rect x="62" y="96" width="76" height="42" rx="5" fill="' + Y + '"/><path d="M72 112h56M72 124h38" stroke="' + C + '" stroke-width="4" stroke-linecap="round"/><path d="M52 66q48-52 96 0" fill="none" stroke="' + G + '" stroke-width="3"/>' +
        '<path d="M78 76q-2 16 6 16" fill="none" stroke="#E7E2D6" stroke-width="5" stroke-linecap="round"/>';
    },
    rodillo: function () {
      return '<rect x="36" y="46" width="108" height="38" rx="14" fill="#EDE6D6" stroke="' + GL + '" stroke-width="2"/><path d="M52 52v26M68 52v26M84 52v26M100 52v26M116 52v26M132 52v26" stroke="#D9D0BC" stroke-width="3"/>' +
        '<path d="M144 65h22v36H96v22" fill="none" stroke="' + C + '" stroke-width="5" stroke-linejoin="round"/><rect x="88" y="120" width="16" height="48" rx="7" fill="' + Y + '"/>';
    },
    llave: function () {
      return '<rect x="64" y="136" width="72" height="24" rx="5" fill="' + GL + '"/><rect x="88" y="78" width="24" height="60" rx="5" fill="#B9C0C6"/><path d="M100 78q0-36 44-34v14q-28-2-28 22z" fill="#B9C0C6"/>' +
        '<rect x="62" y="64" width="42" height="9" rx="4.5" fill="#B9C0C6"/><rect x="92" y="86" width="6" height="44" rx="3" fill="#fff" opacity=".6"/><circle cx="144" cy="64" r="3" fill="#6AA7D8"/>';
    },
    manguera: function () {
      return '<ellipse cx="100" cy="116" rx="68" ry="38" fill="none" stroke="' + V + '" stroke-width="14"/><ellipse cx="100" cy="116" rx="46" ry="22" fill="none" stroke="' + V + '" stroke-width="14" opacity=".85"/>' +
        '<path d="M168 110q16-10 14-34" fill="none" stroke="' + V + '" stroke-width="10" stroke-linecap="round"/><rect x="170" y="52" width="26" height="14" rx="4" fill="' + Y + '" transform="rotate(-15 183 59)"/>';
    },
    caja: function () {
      return '<path d="M74 78a26 26 0 0 1 52 0" fill="none" stroke="' + C + '" stroke-width="9" stroke-linecap="round"/><rect x="34" y="84" width="132" height="34" rx="8" fill="' + Y + '"/><rect x="34" y="112" width="132" height="54" rx="8" fill="' + R + '"/>' +
        '<rect x="88" y="108" width="24" height="16" rx="3" fill="' + C + '"/><rect x="42" y="106" width="14" height="14" rx="3" fill="' + GL + '"/><rect x="144" y="106" width="14" height="14" rx="3" fill="' + GL + '"/>';
    }
  };

  w.Arte = {
    producto: function (p, alt) {
      var t = U.esc(alt || p.nombre);
      // con foto real (datos.js → foto) se muestra la foto; si todavía no hay, la ilustración provisional
      if (p.foto) return '<img src="' + p.foto + '" alt="' + t + '" loading="lazy">';
      return '<svg viewBox="0 0 200 200" role="img" aria-label="' + t + '" preserveAspectRatio="xMidYMid slice"><rect width="200" height="200" fill="#F4F2ED"/><circle cx="100" cy="104" r="84" fill="#fff" opacity=".7"/>' +
        '<ellipse cx="100" cy="176" rx="64" ry="7" fill="' + C + '" opacity=".1"/>' + (FORMAS[p.forma] || FORMAS.caja)() + '</svg>';
    }
  };
})(window);
