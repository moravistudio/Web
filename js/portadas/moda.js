/*
 * Portada «Valeria Montes» (fotografía de moda) — portada HORIZONTAL ancha.
 * Efecto de cámara: enfoque, ráfaga de tres disparos y aparece la portada.
 *  - En el catálogo corre sola al verse en pantalla y se repite al pasar el cursor (sin sonido).
 *  - Al hacer clic o tocar, se repite CON el sonido de los disparos.
 *  - Con data-gate="1" (portada completa) muestra antes la pantalla «Entrar», porque el navegador exige un toque para dar sonido.
 * Se usa con: <div class="cv cv-moda"></div>  (el contenido lo crea este archivo). Llamar ModaRafaga.init(contenedor).
 */
(function (global) {
  'use strict';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/portadas\/[^/]*$/, '') : '';
  var DIR = BASE + 'assets/portadas/moda/';

  if (!document.getElementById('moda-font')) {
    var f = document.createElement('link'); f.id = 'moda-font'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Jost:ital,wght@0,300;0,400;1,400&display=swap'; document.head.appendChild(f);
  }

  var IW = 1671, IH = 941, FACE = [1075, 245];            // rostro en la foto original (sin retocar)
  var S1 = 1.50, S2 = 1.85, S3 = 2.20, FIN = 4.6;         // instantes de los tres disparos y fin de la secuencia

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }

  function init(el) {
    if (!el || el.__moda) return;
    el.__moda = true;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gated = el.getAttribute('data-gate') === '1';
    el.innerHTML =
      '<div class="md">' +
        '<img class="md__im" src="' + DIR + 'foto.jpg" alt="Modelo con vestido de satén fucsia" draggable="false">' +
        '<div class="md__nav md__rv" data-r="2.75,3.4,-14"><span class="md__logo"><b>VALERIA MONTES</b><i>FOTÓGRAFA DE MODA</i></span>' +
          '<span class="md__menu"><span class="on">Inicio</span><span>Portafolio</span><span>Servicios</span><span>Sobre mí</span><span>Contacto</span></span></div>' +
        '<div class="md__txt"><h2 class="md__rv" data-r="2.9,3.7,26">Moda<br>en Imágenes</h2>' +
          '<p class="md__rv" data-r="3.45,4.2,18">Fotografía editorial y comercial<br>para marcas que inspiran</p>' +
          '<span class="md__btn md__rv" data-r="3.85,4.55,14">Ver Portafolio <i aria-hidden="true">→</i></span></div>' +
        '<div class="md__vf" aria-hidden="true"><i class="md__c a"></i><i class="md__c b"></i><i class="md__c d"></i><i class="md__c e"></i>' +
          '<div class="md__grid"><i></i><i></i><i></i><i></i></div>' +
          '<span class="md__hud md__hud--l">ISO 100 · 1/250 · f/2.8</span><span class="md__hud md__hud--r">●</span>' +
          '<div class="md__fb"><i></i><i></i><i></i><i></i></div></div>' +
        '<div class="md__blk" aria-hidden="true"></div><div class="md__flash" aria-hidden="true"></div>' +
        (gated ? '<div class="md__gate"><b>VALERIA MONTES</b><i>FOTÓGRAFA DE MODA</i><button type="button">Entrar</button></div>' : '') +
      '</div>';

    var box = el.querySelector('.md'), im = el.querySelector('.md__im'), vf = el.querySelector('.md__vf'), fb = el.querySelector('.md__fb'),
        grid = el.querySelector('.md__grid'), hud = el.querySelector('.md__hud--r'), blk = el.querySelector('.md__blk'), flash = el.querySelector('.md__flash'),
        gate = el.querySelector('.md__gate'), rvs = [].slice.call(el.querySelectorAll('.md__rv'));
    var now = 0, raf = 0, sounds = null;

    // La foto SIEMPRE se ve completa en alto (cabeza + volado del vestido); el hueco de la izquierda lo cubre su mismo degradado
    function frame() {
      var W = box.clientWidth, H = box.clientHeight, s = H / IH, dw = IW * s, left;
      if (dw >= W) left = -(dw - W) * clamp((FACE[0] * s - .62 * W) / (dw - W), 0, 1); else left = W - dw;
      return { W: W, H: H, dw: dw, left: left, x: left + FACE[0] * s, y: FACE[1] * s };
    }
    function setT(t) {
      now = t;
      var f = frame(); if (!f.H) return;
      var k = f.H / 900;                                   // las medidas del efecto se pensaron para 900 px de alto
      im.style.height = f.H + 'px'; im.style.width = f.dw + 'px'; im.style.left = f.left + 'px';
      var mk = f.left > 2 ? 'linear-gradient(90deg,transparent 0,#000 ' + Math.min(60, 26000 * k / f.dw).toFixed(1) + '%)' : 'none';
      im.style.webkitMaskImage = mk; im.style.maskImage = mk;
      var blur, br, sc;
      if (t < S1) { blur = 36 - 24 * ease(seg(t, .5, 1.35)); if (t > .6 && t < 1.4) blur += Math.sin((t - .6) * 7) * 3.2 * (1 - seg(t, 1.2, 1.4)); br = 1; sc = 1.08 - .01 * ease(seg(t, .2, 1.4)); }
      else if (t < S2) { blur = 8; br = 1.22; sc = 1.075; }   // foto 1: algo sobreexpuesta y blanda
      else if (t < S3) { blur = 3; br = 1.10; sc = 1.04; }    // foto 2: más cerca de la buena
      else { blur = 0; br = 1; sc = 1; }                      // foto 3: la definitiva
      im.style.filter = blur > 0 ? 'blur(' + (Math.max(blur, 0) * k).toFixed(2) + 'px) brightness(' + br + ')' : 'none';
      im.style.transformOrigin = (FACE[0] / IW * 100).toFixed(1) + '% ' + (FACE[1] / IH * 100).toFixed(1) + '%';
      im.style.transform = sc === 1 ? 'none' : 'scale(' + sc.toFixed(4) + ')';
      vf.style.opacity = (seg(t, .1, .5) * (1 - seg(t, 2.3, 2.8))).toFixed(3);
      var cx = f.x, cy = f.y;
      if (t < 1.3) { var q = 1 - seg(t, .8, 1.3); cx += (Math.sin(t * 3.1) * 110 * q - 150 * (1 - seg(t, .5, .75))) * k; cy += Math.cos(t * 2.4) * 60 * q * k; }
      var sz = (220 - 90 * ease(seg(t, .6, 1.35))) * k;
      fb.style.width = fb.style.height = sz + 'px'; fb.style.left = (cx - sz / 2) + 'px'; fb.style.top = (cy - sz / 2) + 'px';
      fb.style.opacity = (seg(t, .45, .65) * (1 - seg(t, 2.3, 2.7))).toFixed(3);
      fb.classList.toggle('is-lock', t >= 1.35);
      grid.style.opacity = (.55 * seg(t, .2, .5) * (1 - seg(t, 2.3, 2.7))).toFixed(3);
      hud.style.visibility = Math.floor(t * 2) % 2 === 0 ? 'visible' : 'hidden';
      // cada disparo: destello corto + parpadeo negro del espejo; el tercero termina en un destello que se apaga
      var fl = 0, bk = 0;
      [S1, S2].forEach(function (s0) { if (t >= s0 && t < s0 + .045) fl = 1; if (t >= s0 + .045 && t < s0 + .12) bk = 1; });
      if (t >= S3 && t < S3 + .045) fl = 1; else if (t >= S3 + .045 && t < S3 + .10) bk = 1; else if (t >= S3 + .10 && t <= S3 + .55) fl = 1 - seg(t, S3 + .10, S3 + .55);
      flash.style.opacity = fl.toFixed(3); blk.style.opacity = bk;
      rvs.forEach(function (e) {
        var r = e.getAttribute('data-r').split(','), p = ease(seg(t, +r[0], +r[1]));
        e.style.opacity = p.toFixed(3); e.style.transform = p < 1 ? 'translateY(' + ((1 - p) * r[2] * k) + 'px)' : 'none';
      });
    }

    function loadSounds() {
      if (!sounds) sounds = ['clic-corto.wav', 'clic-corto.wav', 'clic.wav'].map(function (n) { var a = new Audio(DIR + n); a.preload = 'auto'; return a; });
      return sounds;
    }
    // Corre la secuencia una vez; con sound=true suena cada disparo
    function run(sound) {
      cancelAnimationFrame(raf);
      var t0 = null, shot = 0, at = [S1, S2, S3];
      (function loop(ts) {
        if (ts === undefined) { raf = requestAnimationFrame(loop); return; }
        if (t0 === null) t0 = ts;
        var t = (ts - t0) / 1000;
        while (shot < 3 && t >= at[shot]) {
          if (sound) { var a = sounds[shot]; a.currentTime = 0; var pr = a.play(); if (pr) pr.catch(function () { /* sin sonido */ }); }
          shot++;
        }
        setT(Math.min(t, FIN));
        raf = t < FIN ? requestAnimationFrame(loop) : 0;
      })();
    }
    // El navegador solo deja sonar si el permiso se pide dentro del toque
    function runWithSound() {
      Promise.all(loadSounds().map(function (a) {
        var pr = a.play(); if (!pr) return null;
        return pr.then(function () { a.pause(); a.currentTime = 0; }).catch(function () { /* sin sonido */ });
      })).then(function () { run(true); });
    }

    if (window.ResizeObserver) new ResizeObserver(function () { if (!raf) setT(now); }).observe(box);

    if (gate) {
      setT(0);
      gate.querySelector('button').addEventListener('click', function (e) {
        e.stopPropagation(); gate.classList.add('is-out'); setTimeout(runWithSound, 450);
        box.addEventListener('click', runWithSound);
      });
      return;
    }
    box.addEventListener('click', runWithSound);
    if (reduce || !('IntersectionObserver' in window)) { setT(FIN); return; }
    box.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !raf) run(false); });
    setT(0);
    var io = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      io.disconnect(); loadSounds(); run(false);
    }, { threshold: .6 });
    io.observe(box);
  }

  global.ModaRafaga = { init: init };
})(window);
