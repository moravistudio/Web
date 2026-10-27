/*
 * Idioma de las muestras de catálogo (español / inglés), compartido por el portafolio y las tres muestras.
 * - Usa la MISMA clave del resto del sitio («moravi-site-lang»): lo que la persona eligió en moravistudio.com o en
 *   /catalogo-demos/ se mantiene al abrir cualquier muestra.
 * - En español no hace nada: las páginas se ven exactamente igual que sin este archivo.
 * - En inglés traduce los textos ya dibujados y todo lo que la página dibuje después (carrito, ventanas, pago…),
 *   usando tablas «texto en español → texto en inglés» que cada muestra registra con Idioma.registrar().
 *   Idioma.registrar({ d: { 'texto': 'text' }, p: [ [/^regex$/, function (todo, g1) { return '...'; }] ], t: [ [/regex/, 'reemplazo'] ] })
 *     d = frases exactas (ya sin espacios sobrantes) · p = frases con partes variables (cantidades, nombres, precios)
 *     t = reemplazos dentro del título de la pestaña
 *   Idioma.actual() · Idioma.cambiar('en') (guarda y recarga la página) · Idioma.selector() (HTML del selector ES | EN)
 */
(function (w) {
  'use strict';
  var KEY = 'moravi-site-lang', D = {}, P = [], Tt = [], ATTRS = ['placeholder', 'aria-label', 'alt', 'title'];
  var SALTAR = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1 };
  var actual = 'es';
  try { var q = new URLSearchParams(location.search).get('lang'); if (q === 'en' || q === 'es') localStorage.setItem(KEY, q); } catch (e) { /* sin almacenamiento */ }
  try { actual = localStorage.getItem(KEY) === 'en' ? 'en' : 'es'; } catch (e) { actual = 'es'; }
  var en = actual === 'en';

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function trad(s) {
    var n = norm(s); if (!n) return s;
    var r = D[n], i, m;
    if (r === undefined) { for (i = 0; i < P.length; i++) { m = P[i][0].exec(n); if (m) { r = P[i][1].apply(null, m); break; } } }
    if (r === undefined) return s;
    return s.match(/^\s*/)[0] + r + s.match(/\s*$/)[0];
  }
  function nodo(n) {
    if (n.nodeType === 3) { var p = n.parentNode; if (p && SALTAR[p.nodeName]) return; var t = trad(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; return; }
    if (n.nodeType !== 1 || SALTAR[n.nodeName]) return;
    attrs(n);
    for (var c = n.firstChild; c; c = c.nextSibling) nodo(c);
  }
  function attrs(e) {
    for (var i = 0; i < ATTRS.length; i++) { var v = e.getAttribute && e.getAttribute(ATTRS[i]); if (v) { var t = trad(v); if (t !== v) e.setAttribute(ATTRS[i], t); } }
  }
  function titulo() {
    var s = document.title, i;
    for (i = 0; i < Tt.length; i++) s = s.replace(Tt[i][0], Tt[i][1]);
    if (s !== document.title) document.title = s;
  }
  function todo() { if (!en) return; nodo(document.documentElement); titulo(); }

  if (en) {
    document.documentElement.setAttribute('lang', 'en');
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        if (m.type === 'childList') { for (var j = 0; j < m.addedNodes.length; j++) nodo(m.addedNodes[j]); if (m.target === document.head || m.target.nodeName === 'TITLE') titulo(); }
        else if (m.type === 'characterData') nodo(m.target);
        else if (m.type === 'attributes') attrs(m.target);
      }
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    document.addEventListener('DOMContentLoaded', todo);
    w.addEventListener('load', todo);
  }

  w.Idioma = {
    actual: function () { return actual; },
    traducir: trad,
    registrar: function (t) {
      var k; if (t.d) for (k in t.d) if (Object.prototype.hasOwnProperty.call(t.d, k)) D[k] = t.d[k];
      if (t.p) P = P.concat(t.p); if (t.t) Tt = Tt.concat(t.t);
      if (en && document.readyState !== 'loading') todo();
    },
    cambiar: function (l) { l = l === 'en' ? 'en' : 'es'; if (l === actual) return; try { localStorage.setItem(KEY, l); } catch (e) { /* sin almacenamiento */ } location.reload(); },
    selector: function (clase) {
      return '<div class="' + (clase || 'idioma') + '" role="group" aria-label="Idioma"><button type="button" data-lang="es" class="' + (en ? '' : 'on') + '" aria-pressed="' + (!en) + '">ES</button><button type="button" data-lang="en" class="' + (en ? 'on' : '') + '" aria-pressed="' + en + '">EN</button></div>';
    },
    enlazar: function (raiz) { [].forEach.call((raiz || document).querySelectorAll('[data-lang]'), function (b) { b.addEventListener('click', function () { w.Idioma.cambiar(b.getAttribute('data-lang')); }); }); }
  };
})(window);
