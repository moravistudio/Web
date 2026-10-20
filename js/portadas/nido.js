/*
 * Portada «Nido» (inmobiliaria) — ilustración vectorial plana dibujada con código (SVG), sin fotos.
 *  - El cursor (o el dedo) mueve las capas a distinta velocidad (parallax): cielo, nubes, colinas, casa, árboles.
 *  - Cada clic o toque cambia del día a la noche (o al revés): el sol baja y sube la luna, el cielo cambia de color,
 *    aparecen estrellas y se encienden las ventanas. El letrero «Se vende» se balancea.
 *  - Sin interacción, pasa solo del día a la noche cada pocos segundos. Salen nubes y humo de la chimenea.
 * Se usa con: <div class="cv cv-nido"></div>  (el contenido lo crea este archivo). Llamar Nido.init(contenedor).
 * Cuidado de rendimiento: solo anima mientras se ve en pantalla y con la pestaña visible; con «reducir movimiento»
 * queda el dibujo quieto de día.
 */
(function (global) {
  'use strict';
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  function hex(h) { if (h.charAt(0) === 'r') { var m = h.match(/[0-9]+/g); return [+m[0], +m[1], +m[2]]; } return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(a, b, t) { var x = hex(a), y = hex(b); return 'rgb(' + Math.round(x[0] + (y[0] - x[0]) * t) + ',' + Math.round(x[1] + (y[1] - x[1]) * t) + ',' + Math.round(x[2] + (y[2] - x[2]) * t) + ')'; }
  var uidN = 0;

  function init(el) {
    if (!el || el.__nido) return;
    el.__nido = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var u = 'nd' + (++uidN), i, stars = '';
    for (i = 0; i < 26; i++) stars += '<circle class="st" cx="' + (6 + Math.random() * 288).toFixed(1) + '" cy="' + (4 + Math.random() * 100).toFixed(1) + '" r="' + (0.5 + Math.random() * 1.1).toFixed(2) + '" data-p="' + (Math.random() * 6.28).toFixed(2) + '"/>';
    el.innerHTML =
      '<svg class="cv__svg" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="' + u + 'sky" x1="0" y1="0" x2="0" y2="1"><stop id="' + u + 's0" offset="0"/><stop id="' + u + 's1" offset="1"/></linearGradient>' +
      '<mask id="' + u + 'moon"><rect x="-50" y="-50" width="400" height="300" fill="#fff"/><circle id="' + u + 'cut" cx="0" cy="0" r="15" fill="#000"/></mask>' +
      '<radialGradient id="' + u + 'glow"><stop offset="0" stop-color="#ffd66b" stop-opacity=".9"/><stop offset="1" stop-color="#ffd66b" stop-opacity="0"/></radialGradient></defs>' +
      '<rect id="' + u + 'bgrect" x="-30" y="-30" width="360" height="260" fill="url(#' + u + 'sky)"/>' +
      '<g id="' + u + 'g-stars">' + stars + '</g>' +
      '<g id="' + u + 'g-sun"><circle id="' + u + 'sunhalo" r="34" fill="#fff1a8" opacity=".35"/><circle id="' + u + 'sun" r="19" fill="#ffd54a"/></g>' +
      '<g id="' + u + 'g-moon"><g mask="url(#' + u + 'moon)"><circle id="' + u + 'moondisc" r="15" fill="#fff6d6"/></g></g>' +
      '<g id="' + u + 'g-clouds"><g id="' + u + 'c1"><ellipse cx="0" cy="0" rx="22" ry="7"/><ellipse cx="-12" cy="-4" rx="10" ry="7"/><ellipse cx="8" cy="-7" rx="12" ry="8"/></g>' +
      '<g id="' + u + 'c2"><ellipse cx="0" cy="0" rx="17" ry="5.5"/><ellipse cx="-8" cy="-3" rx="8" ry="5.5"/><ellipse cx="7" cy="-5" rx="9" ry="6"/></g>' +
      '<g id="' + u + 'c3"><ellipse cx="0" cy="0" rx="26" ry="8"/><ellipse cx="-14" cy="-4" rx="11" ry="7.5"/><ellipse cx="10" cy="-8" rx="13" ry="9"/></g></g>' +
      '<g id="' + u + 'g-far"><path id="' + u + 'far" d="M-40 140 C 20 100, 70 105, 120 128 C 170 150, 215 96, 340 122 L340 220 L-40 220 Z"/></g>' +
      '<g id="' + u + 'g-mid"><path id="' + u + 'mid" d="M-40 156 C 30 126, 90 132, 150 150 C 210 166, 260 128, 340 148 L340 220 L-40 220 Z"/></g>' +
      '<g id="' + u + 'g-house">' +
        '<ellipse cx="150" cy="171" rx="48" ry="4" fill="#000" opacity=".18"/>' +
        '<rect id="' + u + 'chim" x="167" y="108" width="9" height="22" rx="1"/>' +
        '<rect id="' + u + 'body" x="118" y="132" width="64" height="40" rx="2"/>' +
        '<path id="' + u + 'roof" d="M111 134 L150 104 L189 134 Z"/>' +
        '<rect id="' + u + 'door" x="143" y="148" width="14" height="24" rx="7"/><circle cx="154" cy="161" r="1.2" fill="#ffd66b"/>' +
        '<g id="' + u + 'win"><rect x="124" y="141" width="14" height="13" rx="1.5"/><rect x="162" y="141" width="14" height="13" rx="1.5"/></g>' +
        '<g id="' + u + 'wglow" opacity="0"><circle cx="131" cy="147.5" r="17" fill="url(#' + u + 'glow)"/><circle cx="169" cy="147.5" r="17" fill="url(#' + u + 'glow)"/></g>' +
        '<g id="' + u + 'smoke"></g>' +
      '</g>' +
      '<g id="' + u + 'g-near"><path id="' + u + 'near" d="M-40 172 C 40 160, 110 170, 190 166 C 240 164, 290 170, 340 164 L340 220 L-40 220 Z"/></g>' +
      '<g id="' + u + 'g-trees"><g id="' + u + 't1"><rect x="48" y="150" width="4" height="22" fill="#7a4f31"/><circle id="' + u + 'f1" cx="50" cy="142" r="15"/><circle id="' + u + 'f1b" cx="58" cy="148" r="10"/></g>' +
      '<g id="' + u + 't2"><rect x="238" y="152" width="4" height="20" fill="#7a4f31"/><circle id="' + u + 'f2" cx="240" cy="146" r="12"/><circle id="' + u + 'f2b" cx="233" cy="151" r="8"/></g></g>' +
      '<g id="' + u + 'sign" transform="translate(88 172)"><rect x="-1" y="-30" width="2.4" height="30" fill="#7a4f31"/><g id="' + u + 'board"><rect x="-13" y="-30" width="26" height="12" rx="2" fill="#fff"/><rect x="-13" y="-30" width="26" height="3.5" rx="1.5" fill="#e5573f"/><text x="0" y="-21" font-family="Poppins,sans-serif" font-size="5.4" font-weight="800" text-anchor="middle" fill="#2a3550">SE VENDE</text></g></g>' +
      '<rect id="' + u + 'tint" x="-30" y="-30" width="360" height="260" fill="#0b1030" opacity="0"/>' +
      '</svg>' +
      '<div class="cv__logo"><b>NIDO</b> inmobiliaria</div>' +
      '<div class="cv__tag">Encuentra tu lugar</div>';
    var $ = function (id) { return el.querySelector('#' + u + id); };
    var stopA = $('s0'), stopB = $('s1'), sunG = $('g-sun'), sun = $('sun'), halo = $('sunhalo'), moonG = $('g-moon'), cut = $('cut'), moonDisc = $('moondisc'), starsG = $('g-stars'),
        clouds = $('g-clouds'), cl = [$('c1'), $('c2'), $('c3')], far = $('far'), mid = $('mid'), near = $('near'), gFar = $('g-far'), gMid = $('g-mid'), gHouse = $('g-house'), gNear = $('g-near'), gTrees = $('g-trees'),
        body = $('body'), roof = $('roof'), chim = $('chim'), door = $('door'), win = $('win'), wglow = $('wglow'), smoke = $('smoke'), board = $('board'), tint = $('tint'),
        f1 = [$('f1'), $('f1b')], f2 = [$('f2'), $('f2b')], t1 = $('t1'), t2 = $('t2');
    var starEls = Array.prototype.slice.call(starsG.querySelectorAll('.st'));
    var puffs = []; for (i = 0; i < 6; i++) { var pf = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); smoke.appendChild(pf); puffs.push({ el: pf, p: i / 6 }); }

    var night = 0, target = 0, lastTap = -1e9, lastAuto = 0, lastT = 0, swing = 0, swingV = 0;
    var ptr = { x: 0, y: 0, in: false }, lp = { x: 0, y: 0 };
    var t0 = performance.now() - (parseFloat((/[?&]t=([0-9.]+)/.exec(location.search) || [])[1]) || 0) * 1000;
    var vis = true, running = false, raf = 0;

    function paint(t, dt) {
      var nx = lp.x, ny = lp.y, e = ease(clamp(night, 0, 1)), dusk = Math.sin(clamp(night, 0, 1) * Math.PI); // 0 día · 1 noche · dusk = atardecer en medio
      stopA.setAttribute('stop-color', mix(mix('#6cc4ff', '#ff9a6c', dusk * 0.6), '#0d1736', e));
      stopB.setAttribute('stop-color', mix(mix('#fff0cf', '#ffd07a', dusk * 0.6), '#39407e', e));
      // sol y luna: el sol baja detrás de las colinas y la luna sube
      var sunY = 58 + e * 120, moonY = 178 - e * 120;
      sunG.setAttribute('transform', 'translate(' + (214 + nx * 3).toFixed(2) + ' ' + sunY.toFixed(2) + ')');
      sun.setAttribute('fill', mix('#ffd54a', '#ff8a4d', dusk)); halo.setAttribute('opacity', (0.38 * (1 - e)).toFixed(2));
      moonG.setAttribute('transform', 'translate(' + (82 + nx * 3).toFixed(2) + ' ' + moonY.toFixed(2) + ')');
      cut.setAttribute('cx', 7); cut.setAttribute('cy', -4);
      starsG.setAttribute('opacity', clamp((e - 0.35) / 0.65, 0, 1).toFixed(2));
      starEls.forEach(function (s) { var p = parseFloat(s.getAttribute('data-p')); s.setAttribute('opacity', (0.45 + 0.55 * Math.sin(t * 2.2 + p)).toFixed(2)); s.setAttribute('fill', '#fff8dc'); });
      // nubes: avanzan solas
      var cc = mix('#ffffff', '#6b74a6', e);
      cl.forEach(function (c, k) { c.setAttribute('fill', cc); c.setAttribute('opacity', (0.95 - e * 0.35).toFixed(2));
        var speed = [3.2, 2.2, 1.5][k], base = [40, 170, 260][k], y = [46, 28, 62][k];
        var x = ((base + t * speed) % 380) - 40; c.setAttribute('transform', 'translate(' + x.toFixed(2) + ' ' + y + ')'); });
      clouds.setAttribute('transform', 'translate(' + (-nx * 4).toFixed(2) + ' ' + (-ny * 2).toFixed(2) + ')');
      // colinas, casa, árboles (parallax creciente)
      far.setAttribute('fill', mix('#b9e5ad', '#1f2d52', e)); mid.setAttribute('fill', mix('#8ed48f', '#182646', e)); near.setAttribute('fill', mix('#6cc06f', '#111d3a', e));
      gFar.setAttribute('transform', 'translate(' + (-nx * 6).toFixed(2) + ' ' + (-ny * 1.5).toFixed(2) + ')');
      gMid.setAttribute('transform', 'translate(' + (-nx * 9).toFixed(2) + ' ' + (-ny * 2).toFixed(2) + ')');
      gHouse.setAttribute('transform', 'translate(' + (-nx * 13).toFixed(2) + ' ' + (-ny * 2.5).toFixed(2) + ')');
      gNear.setAttribute('transform', 'translate(' + (-nx * 17).toFixed(2) + ' ' + (-ny * 3).toFixed(2) + ')');
      gTrees.setAttribute('transform', 'translate(' + (-nx * 20).toFixed(2) + ' ' + (-ny * 3.5).toFixed(2) + ')');
      var sway = Math.sin(t * 1.3) * 0.9; t1.setAttribute('transform', 'rotate(' + sway.toFixed(2) + ' 50 172)'); t2.setAttribute('transform', 'rotate(' + (-sway).toFixed(2) + ' 240 172)');
      var tc = mix('#4fae62', '#17304f', e), tc2 = mix('#63c277', '#1d3a5c', e); f1[0].setAttribute('fill', tc); f1[1].setAttribute('fill', tc2); f2[0].setAttribute('fill', tc); f2[1].setAttribute('fill', tc2);
      body.setAttribute('fill', mix('#fff3e0', '#bfae98', e)); roof.setAttribute('fill', mix('#e5573f', '#8f3a3b', e)); chim.setAttribute('fill', mix('#b9492f', '#6f2e30', e)); door.setAttribute('fill', mix('#8a5a3b', '#4d3426', e));
      // ventanas: de azul claro a luz amarilla
      var lit = clamp((e - 0.45) / 0.55, 0, 1), flick = 1 - 0.06 * Math.sin(t * 7) * lit;
      Array.prototype.forEach.call(win.children, function (w) { w.setAttribute('fill', mix('#bfe3ff', '#ffd66b', lit)); });
      wglow.setAttribute('opacity', (lit * flick).toFixed(2));
      tint.setAttribute('opacity', (e * 0.12).toFixed(3));
      // humo de la chimenea
      puffs.forEach(function (pu) { pu.p += dt * 0.22; if (pu.p > 1) pu.p -= 1; var k = pu.p;
        pu.el.setAttribute('cx', (171.5 + Math.sin(k * 5 + pu.p * 9) * 3 + k * 9).toFixed(2)); pu.el.setAttribute('cy', (106 - k * 30).toFixed(2));
        pu.el.setAttribute('r', (2 + k * 5).toFixed(2)); pu.el.setAttribute('fill', mix('#ffffff', '#aab2d8', e)); pu.el.setAttribute('opacity', (0.7 * Math.sin(k * Math.PI)).toFixed(2)); });
      // letrero: péndulo que se amortigua
      swingV += (-swing * 40 - swingV * 2.4) * dt; swing += swingV * dt;
      board.setAttribute('transform', 'rotate(' + clamp(swing, -0.5, 0.5) * 57.3 + ' 0 -30)');
    }

    function frame(now) {
      raf = 0; if (!running) return;
      var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016; lastT = now;
      var t = (now - t0) / 1000;
      lp.x += ((ptr.in ? clamp(ptr.x, -1, 1) : Math.sin(t * 0.4) * 0.3) - lp.x) * 0.08;
      lp.y += ((ptr.in ? clamp(ptr.y, -1, 1) : Math.cos(t * 0.33) * 0.15) - lp.y) * 0.08;
      night += (target - night) * Math.min(1, dt * 1.7);
      if (!reduce && t > 3 && now - lastTap > 6500 && now - lastAuto > 7500) { lastAuto = now; target = target > 0.5 ? 0 : 1; swingV += 2.5; }
      paint(t, dt);
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      var go = vis && !document.hidden && !reduce;
      if (go && !running) { running = true; lastT = 0; if (!raf) raf = requestAnimationFrame(frame); }
      else if (!go) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    }
    function setPtr(ev) { var r = el.getBoundingClientRect(); ptr.x = (ev.clientX - r.left) / r.width * 2 - 1; ptr.y = (ev.clientY - r.top) / r.height * 2 - 1; ptr.in = true; }
    el.addEventListener('pointerenter', setPtr);
    el.addEventListener('pointermove', setPtr, { passive: true });
    el.addEventListener('pointerleave', function () { ptr.in = false; });
    el.addEventListener('pointerdown', function (ev) { setPtr(ev); var now = performance.now(); lastTap = now; lastAuto = now; target = target > 0.5 ? 0 : 1; swingV += 3; });
    el.addEventListener('pointerup', function (ev) { if (ev.pointerType !== 'mouse') ptr.in = false; });
    el.addEventListener('pointercancel', function () { ptr.in = false; });

    paint(0, 0.016);
    if (global.IntersectionObserver) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(el); else sync();
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  global.Nido = { init: init };
})(window);
