// «O» словесного знака — надувное кольцо из фольги (WebGL, один крошечный шейдер, без библиотек).
// Один canvas на страницу: сначала в «E◯’» заставки, потом переезжает в «O» знака «EKIMOV’».
// Бережём телефон: canvas размером с «O», DPR ≤ 1.5, на касании 30 кадров/с и пауза, пока палец листает;
// рисуем только когда «O» на экране, вкладка видна и меню закрыто. Нет WebGL — CSS-кольцо;
// «уменьшение движения» — один неподвижный кадр (гладкая фаза).
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prof = /[?&]orbprof\b/.test(location.search);
  const root = document.documentElement;

  const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p;gl_Position=vec4(p,0.,1.);}';
  // Тор в плоскости экрана: «надутые» секции со швами + мягкие заломы фольги.
  // Хром: отражение студии с широкими софтбоксами, френель, едва заметный перелив тонкой плёнки.
  const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v;
uniform float uT, uCr, uPx, uK;
uniform mat3 uR;
uniform vec2 uL;
const float R = .615;
const float N = 9.;
float crum(vec3 p){
  float c = abs(sin(dot(p, vec3(1., .62, .3)) + 1.2 * sin(dot(p, vec3(-.45, 1.1, .5)) * .7)));
  c += .45 * abs(sin(dot(p, vec3(-.7, .3, 1.)) * 1.6 + .9 * sin(dot(p, vec3(.9, -.5, .2)) * 1.2)));
  return c * .69;
}
float map(vec3 p){
  p = uR * p;
  float a = atan(p.y, p.x);
  vec2 q = vec2(length(p.xy) - R, p.z);
  float s2 = sin(a * N * .5); s2 *= s2;
  float seam = s2 / (s2 + .06); // гладкая ложбинка шва, без излома в один пиксель
  float r = .292 * (.84 + .16 * seam) * (1. + .025 * sin(uT * 1.1) + .07 * uK);
  return (length(q) - r - (crum(p * CF) - .5) * .034 * uCr) * .74;
}
vec3 nrm(vec3 p){
  const vec2 k = vec2(1., -1.);
  float e = clamp(uPx * .45, .0035, .011); // шаг ~ размер пикселя: швы и заломы не рассыпаются в «стежки»
  return normalize(k.xyy * map(p + k.xyy * e) + k.yyx * map(p + k.yyx * e) + k.yxy * map(p + k.yxy * e) + k.xxx * map(p + k.xxx * e));
}
float env(vec3 d){
  float y = d.y;
  float c = .4 + .5 * smoothstep(-.3, 1., y);
  c *= mix(.48, 1., smoothstep(-.6, .1, y));
  c -= .15 * exp(-y * y * 26.);
  c += 2.2 * smoothstep(.6, .93, dot(d, normalize(vec3(-.55 + uL.x, .72 + uL.y, .45))));
  c += 1.2 * smoothstep(.22, .03, abs(d.x - .74 - uL.x * .5)) * smoothstep(-.5, .35, y);
  c += .55 * smoothstep(.72, .97, dot(d, normalize(vec3(-.3, -.75, .55))));
  c += .7 * smoothstep(.8, .99, dot(d, normalize(vec3(.35, -.25, .9))));
  c -= .2 * smoothstep(.18, .0, abs(d.x + .62)) * smoothstep(-.2, .5, y);
  return max(c, .03);
}
vec3 shade(vec3 p, vec3 rd){
  vec3 n = nrm(p);
  float ndv = clamp(dot(n, -rd), 0., 1.);
  float fr = .55 + .45 * pow(1. - ndv, 3.);
  float ao = clamp(map(p + n * .07) / .05, .3, 1.);
  float e = env(reflect(rd, n));
  vec3 col = vec3(e) * fr * (.6 + .4 * ao) * 1.25 + .03;
  vec3 film = .5 + .5 * cos(6.2832 * (vec3(0., .33, .67) + (1. - ndv) * 1.7 + uT * .03));
  col = mix(col, col * film * 1.2, .07 * (1. - ndv) + .02);
  col = clamp(1. - exp(-col * 1.6), 0., 1.);
  return mix(col, col * col * (3. - 2. * col), .35);
}
void main(){
  vec3 ro = vec3(0., 0., 3.2);
  vec3 rd = normalize(vec3(v * .3125, -1.));
  float b = dot(ro, rd), h = b * b - dot(ro, ro) + 1.21;
  if (h < 0.) { gl_FragColor = vec4(0.); return; }
  float t = -b - sqrt(h), tf = -b + sqrt(h), md = 1e3, tm = t, d;
  bool hit = false;
  for (int i = 0; i < STEPS; i++) {
    d = map(ro + rd * t);
    if (d < md) { md = d; tm = t; }
    if (d < .0012) { hit = true; break; }
    t += d;
    if (t > tf) break;
  }
  if (hit) { gl_FragColor = vec4(shade(ro + rd * t, rd), 1.); return; }
  // Сглаживание контура: пиксель рядом с поверхностью получает её цвет с частичной прозрачностью
  float a = 1. - smoothstep(0., uPx * 1.6, md);
  if (a <= 0.) { gl_FragColor = vec4(0.); return; }
  gl_FragColor = vec4(shade(ro + rd * tm, rd) * a, a);
}`;

  const sh = (gl, type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  };
  const M = new Float32Array(9);
  const rot = (ax, ay, az) => {
    const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay), cz = Math.cos(az), sz = Math.sin(az);
    // R = Rz * Ry * Rx (столбцы для uniformMatrix3fv)
    M[0] = cz * cy; M[1] = sz * cy; M[2] = -sy;
    M[3] = cz * sy * sx - sz * cx; M[4] = sz * sy * sx + cz * cx; M[5] = cy * sx;
    M[6] = cz * sy * cx + sz * sx; M[7] = sz * sy * cx - cz * sx; M[8] = cy * cx;
    return M;
  };

  function create() {
    const cv = document.createElement('canvas');
    cv.className = 'orb';
    cv.setAttribute('aria-hidden', 'true');
    const api = { el: cv, ok: false, attach, poke() {}, mount() {}, setRes() { return false; }, render() { return false; }, center() {}, setSpin() {}, stats: { frames: 0, ms: 0 } };
    let gl = null, glUp = false; // glUp: шейдер однажды собрался — наблюдатели существуют
    try { gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: prof }); } catch { gl = null; }
    const fallback = () => {
      const s = document.createElement('span');
      s.className = 'orb orb--css';
      s.setAttribute('aria-hidden', 'true');
      if (cv.parentNode) cv.replaceWith(s);
      api.el = s; api.ok = false;
    };
    if (!gl) { fallback(); return api; }
    // Программный WebGL (нет видеокарты: SwiftShader, llvmpipe) — на компьютере меньше пикселей и 30 кадров/с
    let soft = false;
    try {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      soft = /swiftshader|llvmpipe|software|basic render/i.test(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '');
    } catch { soft = false; }
    if (/[?&]orbhq\b/.test(location.search)) soft = false; // для скриншотов в headless
    const slow = coarse || soft;
    api.soft = soft;
    const steps = coarse ? 40 : 56;
    const U = {};
    // Программа, буфер, uniform-ы; повторно — после webglcontextrestored
    const setup = () => {
      const vs = sh(gl, gl.VERTEX_SHADER, VS), fs = sh(gl, gl.FRAGMENT_SHADER, `#define STEPS ${steps}\n#define CF ${coarse ? '2.4' : '2.9'}\n${FS}`);
      if (!vs || !fs) return false;
      const pr = gl.createProgram();
      gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false;
      gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uT', 'uCr', 'uPx', 'uK', 'uR', 'uL'].forEach((k) => { U[k] = gl.getUniformLocation(pr, k); });
      gl.clearColor(0, 0, 0, 0);
      return true;
    };
    if (!setup()) { fallback(); return api; }
    api.ok = true; glUp = true;

    const px1 = new Uint8Array(4); // ?orbprof: синхронное чтение пикселя = честное время кадра
    let parent = null, onScreen = false, pageOn = !document.hidden, menuOn = root.classList.contains('menu-open');
    let raf = 0, last = 0, size = 0, scrollQuiet = 0;
    let tx = 0, ty = 0, px = 0, py = 0, mx = null, my = null;
    // Внешнее управление (assets/sig.js): кольцо путешествует по странице, цикл и размер задаёт сцена
    let ext = false, ctr = null, spinX = 0;
    // Реакция на клик/касание: короткий «вдох» + толчок вращения (один раз, ~0,9 с)
    const PK = 900, SPIN = 2.2;
    let pk0 = -1e9, spin = 0;
    const ease = (x) => 1 - (1 - x) ** 3;
    const t0 = performance.now() - 2600; // старт не с «нулевой» позы
    const resize = () => {
      if (!parent || !api.ok) return;
      const w = parent.clientWidth;
      if (!w) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      // Касание: не меньше css-ширины × 1,5 (чёткость на телефоне); урезаем только компьютер без видеокарты
      let s = coarse ? w * Math.max(dpr, 1.5) : w * dpr * (soft ? 0.6 : 1);
      s = Math.max(24, Math.min(coarse ? 200 : 340, Math.round(s)));
      if (s !== size) { size = s; cv.width = cv.height = s; gl.viewport(0, 0, s, s); }
      if (reduce) frame(performance.now());
    };
    const frame = (now) => {
      const a = prof ? performance.now() : 0;
      const t = reduce ? 6.0 : (now - t0) / 1000;
      // Курсор наклоняет кольцо (мышь); на касании — только собственное медленное покачивание
      if (fine && mx !== null && !reduce) {
        const r = ctr || cv.getBoundingClientRect();
        if (r.width) {
          tx = Math.max(-1, Math.min(1, (mx - (r.left + r.width / 2)) / (window.innerWidth * 0.5)));
          ty = Math.max(-1, Math.min(1, (my - (r.top + r.height / 2)) / (window.innerHeight * 0.5)));
        }
      }
      px += (tx - px) * 0.06; py += (ty - py) * 0.06;
      const e = Math.min(1, (now - pk0) / PK);
      if (e >= 1 && pk0 > 0) { spin += SPIN; pk0 = -1e9; }
      const kickA = e < 1 ? ease(e) * SPIN : 0;
      const inflate = e < 1 ? Math.sin(Math.PI * Math.min(1, e * 1.6)) * (1 - e) : 0;
      const ax = 0.32 * Math.sin(t * 0.37) + py * 0.42 + inflate * 0.35;
      const ay = 0.36 * Math.sin(t * 0.29 + 1.3) + px * 0.5;
      const az = t * 0.22 + spin + kickA + spinX;
      // Морфинг: гладкий надувной (швы) ↔ мягко смятая фольга, цикл ~16 с; без движения — гладкая фаза
      const cr = reduce ? 0.1 : 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(t * 0.39 - 1.2)) ** 1.6;
      gl.uniform1f(U.uT, t);
      gl.uniform1f(U.uCr, cr * (1 - inflate) * (coarse ? 0.75 : 1));
      gl.uniform1f(U.uK, inflate);
      gl.uniform1f(U.uPx, 2 / size);
      gl.uniform2f(U.uL, px * 0.25, -py * 0.2);
      gl.uniformMatrix3fv(U.uR, false, rot(ax, ay, az));
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (prof) { gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px1); api.stats.ms += performance.now() - a; }
      api.stats.frames++;
    };
    const live = () => !ext && api.ok && onScreen && pageOn && !menuOn && !reduce && size > 0;
    const loop = (now) => {
      raf = 0;
      if (!live()) return;
      raf = requestAnimationFrame(loop);
      if (coarse && now < scrollQuiet) return; // касание: пока палец листает — кадр не перерисовываем
      if (slow && now - last < 30) return; // касание и программный WebGL: ~30 кадров/с
      last = now;
      frame(now);
    };
    const kick = () => { if (!raf && live()) raf = requestAnimationFrame(loop); };
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((es) => { onScreen = es[es.length - 1].isIntersecting; kick(); })
      : null;
    const ro = 'ResizeObserver' in window ? new ResizeObserver(() => { resize(); kick(); }) : null;
    document.addEventListener('visibilitychange', () => { pageOn = !document.hidden; kick(); });
    // Полноэкранное меню закрывает знак — под ним не рисуем
    if (!reduce) new MutationObserver(() => {
      const m = root.classList.contains('menu-open');
      if (m !== menuOn) { menuOn = m; kick(); }
    }).observe(root, { attributes: true, attributeFilter: ['class'] });
    if (coarse && !reduce) window.addEventListener('scroll', () => { scrollQuiet = performance.now() + 180; }, { passive: true });
    if (fine && !reduce) window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    // Потеря контекста (часто в мобильном Safari после фона): CSS-кольцо на место canvas, цикл стоит —
    // live() требует api.ok, так что наблюдатели больше ничего не запускают. Контекст вернулся — canvas обратно.
    cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; fallback(); });
    cv.addEventListener('webglcontextrestored', () => {
      if (!setup()) return; // остаёмся с CSS-кольцом
      const css = api.el;
      if (css !== cv && css.parentNode) css.replaceWith(cv);
      api.el = cv; api.ok = true;
      const s0 = size; size = 0;
      if (ext) { api.setRes(s0 || 64); if (api.onrestore) api.onrestore(); } else { resize(); kick(); }
    });

    // Клик/касание по «O»: одноразовая реакция (единственное взаимодействие с кольцом на телефоне)
    api.poke = () => {
      if (!api.ok || reduce) return;
      const now = performance.now();
      if (now - pk0 < PK * 0.5) return; // частые касания не копят толчки
      if (pk0 > 0) spin += ease(Math.min(1, (now - pk0) / PK)) * SPIN; // незаконченный толчок — фиксируем его поворот
      pk0 = now; scrollQuiet = 0;
      kick();
      if (ext && api.onpoke) api.onpoke();
    };

    // ── Внешнее управление: один цикл rAF на странице (sig.js) ──
    // mount: canvas переезжает в слой-путешественник; свои наблюдатели и цикл отключаются
    api.mount = (el) => {
      ext = true;
      cancelAnimationFrame(raf); raf = 0;
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      parent = null;
      if (api.el.parentNode !== el) el.appendChild(api.el);
    };
    // setRes: размер буфера в пикселях (маленький, когда кольцо в шапке); true — буфер очищен, нужен кадр
    api.setRes = (s) => {
      if (!api.ok) return false;
      s = Math.max(16, Math.min(coarse ? 200 : 340, Math.round(s)));
      if (s === size) return false;
      size = s; cv.width = cv.height = s; gl.viewport(0, 0, s, s);
      return true;
    };
    // render: кадр, если пора (касание и программный WebGL — ~30 кадров/с, пока палец листает — пауза)
    api.render = (now, force) => {
      if (!api.ok || !size) return false;
      if (!force) {
        if (reduce) return false;
        if (coarse && now < scrollQuiet) return false;
        if (slow && now - last < 30) return false;
      }
      last = now;
      frame(now);
      return true;
    };
    // center: центр кольца на экране (для наклона за курсором) — без чтения раскладки в кадре
    api.center = (x, y, w) => { ctr = { left: x - w / 2, top: y - w / 2, width: w, height: w }; };
    // setSpin: поворот в плоскости экрана (кольцо «катится», пока падает) — облик не меняется
    api.setSpin = (a) => { spinX = a; };

    function attach(el) {
      if (api.el.parentNode !== el) el.appendChild(api.el);
      if (!glUp) return; // WebGL нет вовсе: CSS-кольцо, ничего не рисуем
      // И при CSS-кольце после потери контекста: после восстановления canvas встанет сюда
      parent = el;
      if (io) { io.disconnect(); io.observe(el); } else onScreen = true;
      if (ro) { ro.disconnect(); ro.observe(el); }
      if (!api.ok) return;
      resize();
      kick();
    }
    return api;
  }
  window.EGOrb = prof ? () => (window.__orb = create()) : create;
})();
