/*
 * Chatbot de botones (SIN IA, sin servidor, costo cero). Se monta dentro de la página, con el mismo aspecto que el chat con IA.
 *   MsiaFlujo.mount({ contenedor: elemento, flujo: {...} })
 * Un flujo es un objeto sencillo:
 *   titulo, sub, pie, inicio: 'id del primer nodo', libre: true/false (permite escribir), palabras: [{ k: ['precio'], ir: 'nodo' }],
 *   horario: { dias: [1..6], desde: 8, hasta: 20 }  (hora de Lima, para {{abierto}}),
 *   nodos: { id: { t: 'texto (puede usar {{variable}})', b: [{ l: 'botón', ir: 'nodo', set: { variable: 'valor' } }], caja: 'título de la caja con el mensaje del pedido' } }
 * No envía nada a nadie: en una web real el último botón abriría el WhatsApp del negocio.
 * El texto se inserta siempre como texto (nunca como HTML).
 */
(function (global) {
  'use strict';
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  // ¿Abierto ahora? según el horario del flujo, en hora de Lima
  function abiertoAhora(h, ui) {
    if (!h) return '';
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Lima', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date()), dia = 0, hora = 0;
      p.forEach(function (x) { if (x.type === 'weekday') dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[x.value]; if (x.type === 'hour') hora = +x.value % 24; });
      return (h.dias.indexOf(dia) >= 0 && hora >= h.desde && hora < h.hasta) ? (ui.abierto || '🟢 Abierto ahora') : (ui.cerrado || '🔴 Cerrado ahora');
    } catch (e) { return ''; }
  }

  function mount(o) {
    var f = o.flujo, cont = o.contenedor; if (!f || !cont) return null;
    var vars = {}, busy = false, ui = f.ui || {};
    var root = el('div', 'msia-root msia-embed is-open'), win = el('div', 'msia-win'), list = el('div', 'msia-msgs'), foot = el('div', 'msia-foot', f.pie || 'Demo de Moravi Studio: no se envía nada a nadie.');
    var head = el('div', 'msia-head'), t = el('b'), sub = el('small', null, f.sub || 'Chatbot de botones'); t.appendChild(document.createTextNode(f.titulo || 'Asistente')); t.appendChild(sub);
    var nuevo = el('button', 'msia-icon-btn', '↻'); nuevo.type = 'button'; nuevo.title = ui.nuevo || 'Nueva conversación'; nuevo.setAttribute('aria-label', ui.nuevo || 'Nueva conversación');
    head.appendChild(t); head.appendChild(nuevo); win.appendChild(head); win.appendChild(list);
    var form = null, input = null;
    if (f.libre) {
      form = el('form', 'msia-form'); input = el('textarea', 'msia-input'); var send = el('button', 'msia-send', ui.enviar || 'Enviar'); send.type = 'submit';
      input.rows = 1; input.maxLength = 200; input.placeholder = ui.placeholder || 'Escribe tu pregunta o elige una opción…'; input.setAttribute('aria-label', ui.tuMensaje || 'Tu mensaje');
      form.appendChild(input); form.appendChild(send); win.appendChild(form);
    }
    win.appendChild(foot); root.appendChild(win); cont.appendChild(root);

    function tpl(s) { return String(s).replace(/\{\{(\w+)\}\}/g, function (_, k) { return k === 'abierto' ? abiertoAhora(f.horario, ui) : (vars[k] != null ? vars[k] : ''); }); }
    function addBot(texto) { var b = el('div', 'msia-m msia-m--bot', tpl(texto)); list.appendChild(b); list.scrollTop = list.scrollHeight; return b; }
    function addMe(texto) { list.appendChild(el('div', 'msia-m msia-m--me', texto)); list.scrollTop = list.scrollHeight; }
    function limpiarBotones() { [].slice.call(list.querySelectorAll('.msia-opts')).forEach(function (n) { n.remove(); }); }
    function typing(on) { var x = list.querySelector('.msia-typing'); if (on && !x) { x = el('div', 'msia-typing'); x.innerHTML = '<i></i><i></i><i></i>'; list.appendChild(x); list.scrollTop = list.scrollHeight; } if (!on && x) x.remove(); }

    function mostrar(id) {
      var n = f.nodos[id]; if (!n) return;
      busy = true; typing(true);
      setTimeout(function () {
        typing(false); addBot(n.t);
        if (n.caja) { // el «mensaje» que le llegaría al negocio, en una caja aparte
          var c = el('div', 'msia-caja'); c.appendChild(el('b', null, n.caja)); c.appendChild(el('span', null, tpl(n.cajaT || '')));
          list.appendChild(c);
        }
        if (n.b && n.b.length) {
          var box = el('div', 'msia-opts');
          n.b.forEach(function (bt) {
            var b = el('button', 'msia-opt', bt.l); b.type = 'button';
            b.addEventListener('click', function () { if (busy) return; limpiarBotones(); addMe(bt.l); if (bt.set) Object.keys(bt.set).forEach(function (k) { vars[k] = bt.set[k]; }); if (bt.ir) mostrar(bt.ir); });
            box.appendChild(b);
          });
          list.appendChild(box);
        }
        list.scrollTop = list.scrollHeight; busy = false;
      }, 420);
    }
    function reiniciar() { vars = {}; list.textContent = ''; mostrar(f.inicio); }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault(); var v = input.value.trim(); if (!v || busy) return; input.value = ''; limpiarBotones(); addMe(v);
        var q = norm(v), destino = null;
        (f.palabras || []).some(function (p) { return p.k.some(function (k) { if (q.indexOf(norm(k)) >= 0) { destino = p.ir; return true; } return false; }); });
        mostrar(destino || 'noentendi');
      });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
    }
    nuevo.addEventListener('click', function () { if (!busy) reiniciar(); });
    mostrar(f.inicio);
    return { reiniciar: reiniciar, destruir: function () { if (root.parentNode) root.parentNode.removeChild(root); } };
  }
  global.MsiaFlujo = { mount: mount };
})(window);
