/*
 * Fondo de la pantalla de entrada: «tinta de luz». Simulación real de un fluido en la tarjeta gráfica (WebGL2, ecuaciones de Navier-Stokes).
 * El cursor (o el dedo) empuja el fluido y deja tinta azul luminosa que se enrosca en remolinos y se disuelve sola.
 * Si nadie lo toca, chorros suaves aparecen solos. Con «reducir movimiento» queda una imagen quieta.
 * Uso (lo hace js/intro.js): var f = IntroFluido.create(canvas, caja, reducirMovimiento);  f.run(true|false);  f.destroy();
 * create() devuelve null si el aparato no puede (sin WebGL2 o sin texturas de coma flotante); entonces intro.js usa la red de puntos de siempre.
 * Cuidado de rendimiento: resolución reducida en pantallas chicas, DPR máx. 1.5, solo corre mientras la entrada se ve.
 */
(function (global) {
  'use strict';

  function supported() {
    try { var t = document.createElement('canvas').getContext('webgl2'); return !!(t && t.getExtension('EXT_color_buffer_float')); } catch (e) { return false; }
  }

  function create(canvas, box, reduce) {
    if (!canvas || !supported()) return null;
    var gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) return null;
    var mobile = innerWidth < 700, SIM = mobile ? 96 : 128, DYE = mobile ? 384 : 640;
    var ok = true;

    function compile(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    try {
      var VS = compile(gl.VERTEX_SHADER, '#version 300 es\nin vec2 aPos; out vec2 vUv,vL,vR,vT,vB; uniform vec2 texel;\nvoid main(){ vUv=aPos*.5+.5; vL=vUv-vec2(texel.x,0.); vR=vUv+vec2(texel.x,0.); vT=vUv+vec2(0.,texel.y); vB=vUv-vec2(0.,texel.y); gl_Position=vec4(aPos,0.,1.); }');
      var prog = function (fs) {
        var p = gl.createProgram(); gl.attachShader(p, VS);
        gl.attachShader(p, compile(gl.FRAGMENT_SHADER, '#version 300 es\nprecision highp float; precision highp sampler2D; in vec2 vUv,vL,vR,vT,vB; out vec4 o;\n' + fs));
        gl.bindAttribLocation(p, 0, 'aPos'); gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link');
        var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < n; i++) { var nm = gl.getActiveUniform(p, i).name; u[nm] = gl.getUniformLocation(p, nm); }
        return { p: p, u: u };
      };
      var splat = prog('uniform sampler2D uTarget; uniform float aspect, radius; uniform vec3 color; uniform vec2 point; void main(){ vec2 p=vUv-point; p.x*=aspect; o=vec4(texture(uTarget,vUv).xyz+exp(-dot(p,p)/radius)*color,1.); }');
      var advect = prog('uniform sampler2D uVelocity,uSource; uniform vec2 texel; uniform float dt,dissipation; void main(){ vec2 c=vUv-dt*texture(uVelocity,vUv).xy*texel; o=texture(uSource,c)/(1.+dissipation*dt); }');
      var diverg = prog('uniform sampler2D uVelocity; void main(){ float L=texture(uVelocity,vL).x,R=texture(uVelocity,vR).x,T=texture(uVelocity,vT).y,B=texture(uVelocity,vB).y; vec2 C=texture(uVelocity,vUv).xy; if(vL.x<0.)L=-C.x; if(vR.x>1.)R=-C.x; if(vT.y>1.)T=-C.y; if(vB.y<0.)B=-C.y; o=vec4(.5*(R-L+T-B),0.,0.,1.); }');
      var curlP = prog('uniform sampler2D uVelocity; void main(){ float L=texture(uVelocity,vL).y,R=texture(uVelocity,vR).y,T=texture(uVelocity,vT).x,B=texture(uVelocity,vB).x; o=vec4(.5*(R-L-T+B),0.,0.,1.); }');
      var vortP = prog('uniform sampler2D uVelocity,uCurl; uniform float curl,dt; void main(){ float L=texture(uCurl,vL).x,R=texture(uCurl,vR).x,T=texture(uCurl,vT).x,B=texture(uCurl,vB).x,C=texture(uCurl,vUv).x; vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L)); f/=length(f)+.0001; f*=curl*C; f.y*=-1.; vec2 v=texture(uVelocity,vUv).xy; o=vec4(clamp(v+f*dt,-1000.,1000.),0.,1.); }');
      var presP = prog('uniform sampler2D uPressure,uDivergence; void main(){ float L=texture(uPressure,vL).x,R=texture(uPressure,vR).x,T=texture(uPressure,vT).x,B=texture(uPressure,vB).x; float d=texture(uDivergence,vUv).x; o=vec4((L+R+B+T-d)*.25,0.,0.,1.); }');
      var gradP = prog('uniform sampler2D uPressure,uVelocity; void main(){ float L=texture(uPressure,vL).x,R=texture(uPressure,vR).x,T=texture(uPressure,vT).x,B=texture(uPressure,vB).x; vec2 v=texture(uVelocity,vUv).xy-vec2(R-L,T-B); o=vec4(v,0.,1.); }');
      var clearP = prog('uniform sampler2D uTexture; uniform float value; void main(){ o=value*texture(uTexture,vUv); }');
      var disp = prog('uniform sampler2D uDye; float lm(vec3 c){ return dot(c,vec3(.3,.5,.2)); }\n' +
        'void main(){ vec3 c=texture(uDye,vUv).rgb; float l=lm(c);\n' +
        ' vec3 n=normalize(vec3(lm(texture(uDye,vL).rgb)-lm(texture(uDye,vR).rgb), lm(texture(uDye,vB).rgb)-lm(texture(uDye,vT).rgb), .06));\n' +
        ' vec3 Ld=normalize(vec3(-.45,.65,.6)); float diff=.55+.45*dot(n,Ld); float spec=pow(max(dot(reflect(-Ld,n),vec3(0.,0.,1.)),0.),22.)*smoothstep(.02,.45,l);\n' +
        ' vec3 bg=mix(vec3(.012,.03,.085), vec3(.03,.09,.24), smoothstep(1.,0.,length(vUv-vec2(.5,.45))*1.5));\n' +
        ' vec3 col=bg + c*diff*1.25 + spec*vec3(.55,.85,1.)*1.1 + c*c*.5;\n' +
        ' col*=1.-.5*smoothstep(.45,1.1,length(vUv-.5)); o=vec4(col,1.); }');
    } catch (e) { return null; }

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    function fbo(w, h, ifmt, fmt) {
      var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, ifmt, w, h, 0, fmt, gl.HALF_FLOAT, null);
      var f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) ok = false;
      gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      return { t: t, f: f, w: w, h: h, tx: [1 / w, 1 / h] };
    }
    function dbl(w, h, a, b) { var r = fbo(w, h, a, b), wr = fbo(w, h, a, b); return { get r() { return r; }, get w() { return wr; }, swap: function () { var x = r; r = wr; wr = x; }, tx: r.tx }; }
    var vel, dye, div, curl, pres;
    function res(r) { var a = canvas.width / canvas.height; return a >= 1 ? [Math.round(r * a), r] : [r, Math.round(r / a)]; }
    function init() {
      var s = res(SIM), d = res(DYE);
      vel = dbl(s[0], s[1], gl.RG16F, gl.RG); dye = dbl(d[0], d[1], gl.RGBA16F, gl.RGBA);
      div = fbo(s[0], s[1], gl.R16F, gl.RED); curl = fbo(s[0], s[1], gl.R16F, gl.RED); pres = dbl(s[0], s[1], gl.R16F, gl.RED);
    }
    function size() {
      var dpr = Math.min(devicePixelRatio || 1, 1.5), w = Math.max(2, Math.round(box.clientWidth * dpr)), h = Math.max(2, Math.round(box.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; init(); seed(); }
    }

    function bind(p) { gl.useProgram(p.p); }
    function tex(p, name, t, unit) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(p.u[name], unit); }
    function blit(target) {
      if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.f); gl.viewport(0, 0, target.w, target.h); } else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function T(p, tx) { gl.uniform2f(p.u.texel, tx[0], tx[1]); }

    function addSplat(x, y, dx, dy, col) {
      bind(splat); tex(splat, 'uTarget', vel.r.t, 0); gl.uniform1f(splat.u.aspect, canvas.width / canvas.height); gl.uniform2f(splat.u.point, x, y);
      gl.uniform3f(splat.u.color, dx, dy, 0); gl.uniform1f(splat.u.radius, .0028); T(splat, vel.tx); blit(vel.w); vel.swap();
      tex(splat, 'uTarget', dye.r.t, 0); gl.uniform3f(splat.u.color, col[0], col[1], col[2]); gl.uniform1f(splat.u.radius, .0055); T(splat, dye.tx); blit(dye.w); dye.swap();
    }
    function hsv(h, s, v) { var i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s); switch (i % 6) { case 0: return [v, t, p]; case 1: return [q, v, p]; case 2: return [p, v, t]; case 3: return [p, q, v]; case 4: return [t, p, v]; default: return [v, p, q]; } }
    var hue = .58;
    function color(k) { hue += .004 + Math.random() * .004; if (hue > .64) hue = .52; var c = hsv(hue, .75 + Math.random() * .2, 1); return [c[0] * k, c[1] * k, c[2] * k]; }
    function seed() { for (var i = 0; i < 6; i++) addSplat(.2 + Math.random() * .6, .25 + Math.random() * .5, (Math.random() - .5) * 2200, (Math.random() - .5) * 2200, color(.9)); }   // arranque: ya hay tinta en movimiento

    function step(dt) {
      gl.disable(gl.BLEND);
      bind(curlP); T(curlP, vel.tx); tex(curlP, 'uVelocity', vel.r.t, 0); blit(curl);
      bind(vortP); T(vortP, vel.tx); tex(vortP, 'uVelocity', vel.r.t, 0); tex(vortP, 'uCurl', curl.t, 1); gl.uniform1f(vortP.u.curl, 24); gl.uniform1f(vortP.u.dt, dt); blit(vel.w); vel.swap();
      bind(diverg); T(diverg, vel.tx); tex(diverg, 'uVelocity', vel.r.t, 0); blit(div);
      bind(clearP); tex(clearP, 'uTexture', pres.r.t, 0); gl.uniform1f(clearP.u.value, .8); T(clearP, pres.tx); blit(pres.w); pres.swap();
      bind(presP); T(presP, vel.tx); tex(presP, 'uDivergence', div.t, 0);
      for (var i = 0; i < 18; i++) { tex(presP, 'uPressure', pres.r.t, 1); blit(pres.w); pres.swap(); }
      bind(gradP); T(gradP, vel.tx); tex(gradP, 'uPressure', pres.r.t, 0); tex(gradP, 'uVelocity', vel.r.t, 1); blit(vel.w); vel.swap();
      bind(advect); T(advect, vel.tx); tex(advect, 'uVelocity', vel.r.t, 0); tex(advect, 'uSource', vel.r.t, 1); gl.uniform1f(advect.u.dt, dt); gl.uniform1f(advect.u.dissipation, .35); blit(vel.w); vel.swap();
      T(advect, dye.tx); tex(advect, 'uVelocity', vel.r.t, 0); tex(advect, 'uSource', dye.r.t, 1); gl.uniform1f(advect.u.dissipation, .55); blit(dye.w); dye.swap();
    }
    function render() { bind(disp); T(disp, dye.tx); tex(disp, 'uDye', dye.r.t, 0); blit(null); }

    var P = { x: .5, y: .5, px: .5, py: .5, moved: false }, last = 0, idleT = 0, auto = 0, running = false, raf = 0;
    function pos(e) { var r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]; }
    function onMove(e) { var p = pos(e); P.px = P.x; P.py = P.y; P.x = p[0]; P.y = p[1]; P.moved = true; idleT = 0; }
    function onDown(e) { var p = pos(e); P.x = P.px = p[0]; P.y = P.py = p[1]; idleT = 0; addSplat(p[0], p[1], 0, 0, color(.9)); }
    box.addEventListener('pointermove', onMove, { passive: true });
    box.addEventListener('pointerdown', onDown, { passive: true });

    function frame(now) {
      raf = 0; if (!running) return;
      var dt = Math.min(.033, (now - last) / 1000); last = now; idleT += dt;
      size();
      if (P.moved) {
        var dx = (P.x - P.px) * 6500, dy = (P.y - P.py) * 6500;
        if (Math.abs(dx) + Math.abs(dy) > 0.5) addSplat(P.x, P.y, dx, dy, color(.7));
        P.px = P.x; P.py = P.y; P.moved = false;
      }
      if (idleT > 1.6) {   // sin cursor: chorros suaves aparecen solos
        auto -= dt;
        if (auto <= 0) { auto = .5 + Math.random() * 1.1; var a = Math.random() * 6.283, f = 900 + Math.random() * 1500; addSplat(.1 + Math.random() * .8, .12 + Math.random() * .76, Math.cos(a) * f, Math.sin(a) * f, color(.8)); }
      }
      step(dt); render();
      raf = requestAnimationFrame(frame);
    }
    function run(on) {
      if (on && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!on && running) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    }
    function destroy() {
      run(false); box.removeEventListener('pointermove', onMove); box.removeEventListener('pointerdown', onDown);
      var lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
    }

    size();
    if (!ok) { destroy(); return null; }
    if (reduce) { for (var i = 0; i < 40; i++) step(.016); render(); }   // «reducir movimiento»: una imagen quieta con la tinta ya extendida
    return { run: run, destroy: destroy };
  }

  global.IntroFluido = { create: create };
})(window);
