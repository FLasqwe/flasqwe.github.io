// Параметрический дом VERESK на three.js — архитектурный макет, а не картинка.
// Одна функция buildHouse() собирает модель из параметров конструктора (площадь, этажи,
// материал, кровля, опции); у каждой детали есть этап стройки, поэтому тот же дом умеет
// вырастать от фундамента до света в окнах (блок «Как строим»).
// Рендер по требованию: кадр считается, только когда что-то изменилось и блок на экране.

import * as THREE from 'three';

const PINE = 0x2d3b31;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => 1 - Math.pow(1 - t, 3);

// ── Процедурные текстуры: 1 единица UV = 1 метр, поэтому рисунок не растягивается ──
function canvasTex(size, draw, metres = 2) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.repeat.set(1 / metres, 1 / metres);
  return t;
}
const seeded = (s) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

const TEX = {
  timber: () => canvasTex(512, (g, s) => {
    const r = seeded(7);
    const n = 9;
    for (let i = 0; i < n; i++) {
      const y = (i / n) * s;
      const h = s / n;
      const l = 44 + r() * 7;
      g.fillStyle = `hsl(28 42% ${l}%)`;
      g.fillRect(0, y, s, h);
      g.fillStyle = 'rgba(70,40,20,.10)';
      for (let k = 0; k < 7; k++) g.fillRect(0, y + r() * h, s, 1);
      const grad = g.createLinearGradient(0, y, 0, y + h);
      grad.addColorStop(0, 'rgba(255,235,205,.20)');
      grad.addColorStop(0.55, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(45,25,12,.55)');
      g.fillStyle = grad;
      g.fillRect(0, y, s, h);
    }
  }),
  frame: () => canvasTex(512, (g, s) => {
    const r = seeded(11);
    const n = 11;
    for (let i = 0; i < n; i++) {
      const x = (i / n) * s;
      const w = s / n;
      g.fillStyle = `hsl(150 7% ${19 + r() * 4}%)`;
      g.fillRect(x, 0, w, s);
      g.fillStyle = 'rgba(0,0,0,.42)';
      g.fillRect(x + w - 2, 0, 2, s);
      g.fillStyle = 'rgba(255,255,255,.05)';
      g.fillRect(x, 0, 2, s);
    }
  }),
  aerated: () => canvasTex(256, (g, s) => {
    const r = seeded(19);
    g.fillStyle = '#e9e3d7';
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 2400; i++) {
      g.fillStyle = r() > 0.5 ? 'rgba(120,105,85,.05)' : 'rgba(255,255,255,.07)';
      g.fillRect(r() * s, r() * s, 2, 2);
    }
  }),
  brick: () => canvasTex(512, (g, s) => {
    const r = seeded(23);
    g.fillStyle = '#b9ab98';
    g.fillRect(0, 0, s, s);
    const rows = 14;
    const bh = s / rows;
    const bw = bh * 2.6;
    for (let y = 0; y < rows; y++) {
      for (let x = -1; x < s / bw + 1; x++) {
        const ox = y % 2 ? bw / 2 : 0;
        g.fillStyle = `hsl(${14 + r() * 7} ${38 + r() * 12}% ${34 + r() * 9}%)`;
        g.fillRect(x * bw + ox + 1.5, y * bh + 1.5, bw - 3, bh - 3);
      }
    }
  }, 1.6),
  metal: () => canvasTex(128, (g, s) => {
    g.fillStyle = '#2b2f2e';
    g.fillRect(0, 0, s, s);
    g.fillStyle = 'rgba(255,255,255,.13)';
    g.fillRect(0, 0, 3, s);
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.fillRect(3, 0, 2, s);
  }, 0.5),
  deck: () => canvasTex(256, (g, s) => {
    const r = seeded(31);
    const n = 8;
    for (let i = 0; i < n; i++) {
      g.fillStyle = `hsl(30 30% ${46 + r() * 8}%)`;
      g.fillRect(0, (i / n) * s, s, s / n - 2);
    }
    g.fillStyle = 'rgba(40,25,15,.5)';
    for (let i = 0; i < n; i++) g.fillRect(0, (i / n) * s + s / n - 2, s, 2);
  }, 1.4),
  osb: () => canvasTex(256, (g, s) => {
    const r = seeded(37);
    g.fillStyle = '#c9a877';
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `hsla(${28 + r() * 12} 45% ${48 + r() * 24}% / .55)`;
      g.save();
      g.translate(r() * s, r() * s);
      g.rotate(r() * 3.14);
      g.fillRect(-11, -2, 22, 4);
      g.restore();
    }
  }, 2.4),
};

function makeMaterials() {
  const tex = {};
  const m = (k) => (tex[k] = tex[k] || TEX[k]());
  const std = (o) => new THREE.MeshStandardMaterial(o);
  return {
    walls: {
      timber: std({ map: m('timber'), roughness: 0.82 }),
      frame: std({ map: m('frame'), roughness: 0.78 }),
      aerated: std({ map: m('aerated'), roughness: 0.92 }),
      brick: std({ map: m('brick'), roughness: 0.88 }),
    },
    osb: std({ map: m('osb'), roughness: 0.9 }),
    metal: std({ map: m('metal'), roughness: 0.55, metalness: 0.25 }),
    deck: std({ map: m('deck'), roughness: 0.75 }),
    concrete: std({ color: 0xcfc8ba, roughness: 0.95 }),
    stud: std({ color: 0xd6b98a, roughness: 0.8 }),
    dark: std({ color: 0x24282a, roughness: 0.6 }),
    fascia: std({ color: 0x8a6a48, roughness: 0.7 }),
    door: std({ color: 0x4a3423, roughness: 0.6 }),
    brickChimney: std({ color: 0x8c6450, roughness: 0.9 }),
    glass: std({ color: 0x9db4ba, roughness: 0.18, metalness: 0.1, emissive: 0xffc27a, emissiveIntensity: 0 }),
    frameLight: std({ color: 0xd9cfbd, roughness: 0.6 }),
    pine: [std({ color: PINE, roughness: 0.95, flatShading: true }), std({ color: 0x3a4a3c, roughness: 0.95, flatShading: true })],
    trunk: std({ color: 0x4d3a2c, roughness: 0.9 }),
    stone: std({ color: 0xbdb4a4, roughness: 0.95 }),
    pipe: std({ color: 0x7e4f73, roughness: 0.45, emissive: 0x7e4f73, emissiveIntensity: 0.35 }),
  };
}

// Коробка с UV в метрах
function box(w, h, d, mat, shadow = true) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv;
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  for (let i = 0; i < uv.count; i++) {
    const nx = Math.abs(nor.getX(i));
    const ny = Math.abs(nor.getY(i));
    const x = pos.getX(i); const y = pos.getY(i); const z = pos.getZ(i);
    if (ny > 0.5) uv.setXY(i, x, z);
    else if (nx > 0.5) uv.setXY(i, z, y);
    else uv.setXY(i, x, y);
  }
  const mesh = new THREE.Mesh(g, mat);
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  return mesh;
}

/** Основные размеры дома из площади и этажности. */
export function dims(p) {
  const floors = p.floors;
  const plan = p.area / (floors === 2 ? 2 : floors === 1.5 ? 1.6 : 1);
  const w = Math.sqrt(plan * 1.55);
  const d = plan / w;
  const wallH = floors === 2 ? 6.1 : floors === 1.5 ? 3.3 : 3.0;
  const pitchDeg = p.roof === 'flat' ? 0 : p.roof === 'barn' || floors === 1.5 ? 44 : 30;
  const rise = (d / 2) * Math.tan((pitchDeg * Math.PI) / 180);
  return { w, d, wallH, rise, pitch: (pitchDeg * Math.PI) / 180, top: wallH + rise };
}

/**
 * Дом как список деталей. stage — этап стройки 0…5, delay — доля внутри этапа,
 * mode: grow (растёт вверх), drop (опускается сверху), show (появляется целиком).
 */
function buildHouse(p, M, { detail = false } = {}) {
  const root = new THREE.Group();
  const parts = [];
  const add = (obj, stage, delay = 0, mode = 'grow') => {
    root.add(obj);
    const part = { obj, stage, delay, mode, y: obj.position.y, sy: obj.scale.y };
    parts.push(part);
    return part;
  };
  const { w, d, wallH, rise, pitch } = dims(p);
  const wallMat = M.walls[p.material];
  const T = 0.22;

  // Фундамент
  const slab = box(w + 0.5, 0.32, d + 0.5, M.concrete);
  slab.position.y = 0.16;
  add(slab, 0);
  const base = 0.32;

  // Каркас: стойки и обвязка — показываются только в режиме стройки
  if (detail) {
    const studs = [];
    const step = 0.9;
    for (let x = -w / 2; x <= w / 2 + 0.01; x += step) studs.push([x, d / 2 - 0.08], [x, -d / 2 + 0.08]);
    for (let z = -d / 2 + step; z < d / 2 - 0.01; z += step) studs.push([w / 2 - 0.08, z], [-w / 2 + 0.08, z]);
    studs.sort((a, b) => a[0] - b[0]);
    studs.forEach(([x, z], i) => {
      const s = box(0.1, wallH, 0.14, M.stud);
      s.position.set(x, base + wallH / 2, z);
      add(s, 1, (i / studs.length) * 0.75);
    });
    for (const [px, pz, sx, sz] of [[0, d / 2 - 0.08, w, 0.16], [0, -d / 2 + 0.08, w, 0.16], [w / 2 - 0.08, 0, 0.16, d], [-w / 2 + 0.08, 0, 0.16, d]]) {
      const plate = box(sx, 0.12, sz, M.stud);
      plate.position.set(px, base + wallH, pz);
      add(plate, 1, 0.9, 'drop');
    }
  }

  // Стены: при стройке сначала обшивка OSB, поверх — финишный фасад
  const wallGroup = (mat, grow) => {
    const g = new THREE.Group();
    const front = box(w, wallH, T, mat); front.position.set(0, base + wallH / 2, d / 2 - T / 2);
    const back = box(w, wallH, T, mat); back.position.set(0, base + wallH / 2, -d / 2 + T / 2);
    const left = box(T, wallH, d - T * 2, mat); left.position.set(-w / 2 + T / 2, base + wallH / 2, 0);
    const right = box(T, wallH, d - T * 2, mat); right.position.set(w / 2 - T / 2, base + wallH / 2, 0);
    g.add(front, back, left, right);
    // Фронтоны двускатной кровли
    if (p.roof !== 'flat') {
      for (const sign of [1, -1]) {
        const s = new THREE.Shape();
        s.moveTo(-d / 2, 0); s.lineTo(d / 2, 0); s.lineTo(0, rise); s.closePath();
        const geo = new THREE.ExtrudeGeometry(s, { depth: T, bevelEnabled: false });
        const gable = new THREE.Mesh(geo, mat);
        gable.rotation.y = sign > 0 ? Math.PI / 2 : -Math.PI / 2;
        gable.position.set(sign > 0 ? w / 2 - T : -w / 2 + T, base + wallH, 0);
        gable.castShadow = true;
        g.add(gable);
      }
    }
    if (grow) g.scale.y = 1;
    return g;
  };

  if (detail) {
    const sheath = wallGroup(M.osb, true);
    add(sheath, 3, 0, 'grow');
    const clad = wallGroup(wallMat, true);
    clad.scale.set(1.004, 1.002, 1.006);
    add(clad, 5, 0, 'grow');
  } else {
    add(wallGroup(wallMat, true), 1);
  }

  // Межэтажный пояс — читается как архитектурная деталь
  if (p.floors === 2) {
    const belt = box(w + 0.06, 0.12, d + 0.06, M.fascia);
    belt.position.y = base + 3.05;
    add(belt, 4, 0.2, 'show');
  }

  // Стропила: фермы вдоль дома
  if (detail && p.roof !== 'flat') {
    const n = Math.max(5, Math.round(w / 1.1));
    const len = Math.hypot(d / 2, rise);
    for (let i = 0; i <= n; i++) {
      const x = -w / 2 + (i / n) * w;
      const truss = new THREE.Group();
      for (const s of [1, -1]) {
        const r = box(0.08, 0.18, len + 0.2, M.stud);
        r.rotation.x = s * pitch;
        r.position.set(0, rise / 2, -s * (d / 4) * -1);
        truss.add(r);
      }
      const tie = box(0.08, 0.14, d, M.stud);
      truss.add(tie);
      truss.position.set(x, base + wallH + 0.05, 0);
      add(truss, 2, (i / n) * 0.6, 'drop');
    }
  }

  // Кровля
  const over = p.roof === 'barn' ? 0.08 : 0.55;
  if (p.roof === 'flat') {
    const lid = box(w + 1.3, 0.26, d + 1.3, M.dark);
    lid.position.y = base + wallH + 0.13;
    add(lid, 2, detail ? 0.75 : 0, 'drop');
    const fascia = box(w + 1.34, 0.1, d + 1.34, M.fascia);
    fascia.position.y = base + wallH + 0.02;
    add(fascia, 2, detail ? 0.75 : 0, 'drop');
  } else {
    const slope = Math.hypot(d / 2, rise) + over;
    for (const s of [1, -1]) {
      const panel = box(w + over * 2, 0.14, slope, M.metal);
      panel.rotation.x = s * pitch;
      const mid = slope / 2; // панель идёт от конька вниз, вынос — только у карниза
      panel.position.set(0, base + wallH + rise - Math.sin(pitch) * mid + 0.1, s * Math.cos(pitch) * mid);
      add(panel, 2, detail ? 0.72 : 0, 'drop');
    }
    const ridge = box(w + over * 2 + 0.02, 0.1, 0.34, M.dark);
    ridge.position.y = base + wallH + rise + 0.14;
    add(ridge, 2, detail ? 0.9 : 0, 'drop');
  }

  // Окна
  const glassParts = [];
  const pano = !!p.panoramic;
  // На тёмном каркасе рама светлая, на остальных фасадах — тёмная
  const frameMat = p.material === 'frame' ? M.frameLight : M.dark;
  const place = (x, y, z, ww, wh, axis) => {
    const g = new THREE.Group();
    const frame = axis === 'z' ? box(ww + 0.14, wh + 0.14, 0.08, frameMat, false) : box(0.08, wh + 0.14, ww + 0.14, frameMat, false);
    const glass = axis === 'z' ? box(ww, wh, 0.1, M.glass, false) : box(0.1, wh, ww, M.glass, false);
    g.add(frame, glass);
    // Переплёт панорамного окна
    if (ww > 1.9) {
      const mull = axis === 'z' ? box(0.05, wh, 0.12, frameMat, false) : box(0.12, wh, 0.05, frameMat, false);
      g.add(mull);
    }
    g.position.set(x, y, z);
    add(g, 3, 0.45 + Math.random() * 0.4, 'show');
    glassParts.push(glass);
  };
  const faceZ = d / 2 + (detail ? 0.03 : 0.01);
  const faceX = w / 2 + (detail ? 0.03 : 0.01);
  const levels = p.floors === 2 ? [0, 3.05] : [0];
  const bay = pano ? 3.0 : 2.5;
  const nFront = Math.max(2, Math.floor((w - 1.4) / bay));
  levels.forEach((lv, li) => {
    const wh = pano && li === 0 ? 2.25 : 1.5;
    const ww = pano ? 2.25 : 1.35;
    const cy = base + lv + (pano && li === 0 ? 1.2 : 1.55);
    for (let i = 0; i < nFront; i++) {
      const x = -w / 2 + ((i + 1) / (nFront + 1)) * w;
      if (li === 0 && i === 0 && !pano) continue; // место двери
      place(x, cy, faceZ, ww, wh, 'z');
    }
    const nSide = Math.max(1, Math.floor((d - 1.6) / 2.8));
    for (let i = 0; i < nSide; i++) {
      const z = -d / 2 + ((i + 1) / (nSide + 1)) * d;
      place(faceX, cy, z, 1.25, 1.45, 'x');
      place(-faceX, cy, z, 1.25, 1.45, 'x');
    }
  });
  if (p.roof !== 'flat') {
    // Окно во фронтоне
    place(faceX, base + wallH + rise * 0.38, 0, 1.3, Math.min(1.5, rise * 0.6), 'x');
  }
  // Дверь
  const door = box(1.05, 2.25, 0.1, M.door);
  door.position.set(-w / 2 + (pano ? 0.9 : (1 / (nFront + 1)) * w), base + 1.13, faceZ);
  add(door, 3, 0.8, 'show');

  // Мансардные окна
  if (p.floors === 1.5) {
    for (let i = 0; i < 2; i++) {
      const sky = box(1.1, 0.06, 1.3, M.glass, false);
      const off = (Math.hypot(d / 2, rise)) * 0.46;
      sky.rotation.x = pitch;
      sky.position.set((i ? 1 : -1) * w * 0.2, base + wallH + rise - Math.sin(pitch) * off + 0.2, Math.cos(pitch) * off);
      add(sky, 3, 0.9, 'show');
      glassParts.push(sky);
    }
  }

  // Камин / дымоход
  if (p.fireplace || detail) {
    const ch = box(0.62, 1.7 + rise * 0.5, 0.62, M.brickChimney);
    ch.position.set(w * 0.22, base + wallH + rise * 0.72, -Math.min(d * 0.1, 0.6));
    add(ch, 4, 0.1, 'grow');
  }

  // Инженерия: вводы от участка к дому
  if (detail) {
    for (const [x0, l] of [[w * 0.28, 10], [w * 0.28 + 0.5, 10]]) {
      const tube = box(0.09, 0.09, l, M.pipe, false);
      tube.position.set(x0, 0.06, d / 2 + l / 2);
      add(tube, 4, 0.25, 'show').until = 5.35; // трубы закапываются, когда готов участок
    }
  }

  // Терраса
  if (p.terrace) {
    const tw = Math.min(w * 0.72, 9);
    const td = 3.0;
    const deck = box(tw, 0.2, td, M.deck);
    deck.position.set(w * 0.06, 0.26, d / 2 + td / 2 + 0.1);
    add(deck, 5, 0.3);
    // Ступени к дорожке
    const stepD = box(2.2, 0.1, 0.5, M.deck);
    stepD.position.set(door.position.x + 0.2, 0.12, d / 2 + td + 0.32);
    add(stepD, 5, 0.34);
  }

  // Навес на две машины
  if (p.carport) {
    const cw = 5.6; const cd = 6.2;
    const cx = -w / 2 - cw / 2 - 0.5;
    const pad = box(cw, 0.1, cd, M.stone);
    pad.position.set(cx, 0.05, d / 2 - cd / 2 + 0.6);
    add(pad, 5, 0.3);
    const lid = box(cw + 0.3, 0.14, cd + 0.3, M.dark);
    lid.position.set(cx, 2.65, d / 2 - cd / 2 + 0.6);
    add(lid, 5, 0.55, 'drop');
    for (const [px, pz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const post = box(0.12, 2.55, 0.12, M.fascia);
      post.position.set(cx + (px * (cw - 0.4)) / 2, 1.3, d / 2 - cd / 2 + 0.6 + (pz * (cd - 0.4)) / 2);
      add(post, 5, 0.45);
    }
  }

  // Дорожка к двери
  const pathN = 9;
  for (let i = 0; i < pathN; i++) {
    const st = box(1.3, 0.06, 0.62, M.stone, false);
    st.position.set(door.position.x + Math.sin(i * 0.55) * 0.18, 0.03, d / 2 + 1 + i * 0.95 + (p.terrace ? 2.4 : 0));
    add(st, 5, 0.15 + (i / pathN) * 0.3, 'show');
  }

  // Сосны вокруг
  const r = seeded(101 + Math.round(w * 3));
  const spots = [[-1.3, -1.05, 1.15], [-0.7, -1.5, 0.95], [0.1, -1.75, 1.3], [0.9, -1.5, 1], [1.5, -1.05, 1.2], [-1.85, -0.15, 0.8], [1.95, -0.1, 0.9], [-2.05, 0.75, 0.62]];
  const reach = Math.max(w, d);
  spots.forEach(([fx, fz, s], i) => {
    const tree = new THREE.Group();
    const h = (6 + r() * 2.5) * s;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, h * 0.3, 6), M.trunk);
    trunk.position.y = h * 0.15;
    trunk.castShadow = true;
    tree.add(trunk);
    for (let k = 0; k < 3; k++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry((1.5 - k * 0.36) * s, h * 0.46, 7), M.pine[k % 2]);
      cone.position.y = h * (0.36 + k * 0.23);
      cone.castShadow = true;
      tree.add(cone);
    }
    tree.position.set(fx * reach * 0.62, 0, fz * reach * 0.62);
    add(tree, 5, 0.3 + (i / spots.length) * 0.6, 'grow');
  });

  return { root, parts, glass: glassParts, size: { w, d, top: wallH + rise } };
}

/** Просмотрщик: сцена, свет, вращение мышью/пальцем и рендер по требованию. */
export function createViewer(host, { params, detail = false, yaw = -0.62, lowPower = false } = {}) {
  const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
  const renderer = new THREE.WebGLRenderer({ antialias: !lowPower || dpr < 2, alpha: true, powerPreference: lowPower ? 'low-power' : 'high-performance' });
  renderer.setPixelRatio(dpr);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 1, 400);
  scene.add(new THREE.HemisphereLight(0xfff4e4, 0xa89a82, 1.5));
  const sun = new THREE.DirectionalLight(0xfff0da, 2.7);
  sun.position.set(-20, 30, 24);
  sun.castShadow = true;
  sun.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 5;
  const sc = sun.shadow.camera;
  sc.left = -34; sc.right = 34; sc.top = 34; sc.bottom = -34; sc.near = 1; sc.far = 110;
  scene.add(sun);

  // Участок: мягкая тень на цвете страницы и лёгкий «газон»-диск
  // Край участка растворяется в фоне: диск с радиальной прозрачностью, без резкой границы
  const fade = document.createElement('canvas');
  fade.width = fade.height = 256;
  const fg = fade.getContext('2d');
  const rad = fg.createRadialGradient(128, 128, 40, 128, 128, 126);
  rad.addColorStop(0, '#fff');
  rad.addColorStop(0.55, '#fff');
  rad.addColorStop(1, '#000');
  fg.fillStyle = rad;
  fg.fillRect(0, 0, 256, 256);
  const lawn = new THREE.Mesh(new THREE.CircleGeometry(38, 72), new THREE.MeshStandardMaterial({ color: 0xcfcfb4, roughness: 1, transparent: true, alphaMap: new THREE.CanvasTexture(fade), depthWrite: false }));
  lawn.rotation.x = -Math.PI / 2;
  lawn.receiveShadow = true;
  scene.add(lawn);

  const spin = new THREE.Group();
  scene.add(spin);
  const M = makeMaterials();
  let house = null;
  let current = params;
  let progress = detail ? 0 : 6;
  let lit = 0;
  let dirty = true;
  let visible = true;
  let raf = 0;
  let yawNow = yaw;
  let yawGoal = yaw;
  let vel = 0;
  let appear = 1;
  let frameDist = 40;
  let lookY = 3;

  function fit() {
    const box3 = { w: dims(current).w, d: dims(current).d, top: dims(current).top };
    const reach = Math.max(box3.w, box3.d) * 1.45 + (current.carport ? 7 : 0) + (current.terrace ? 3 : 0);
    const aspect = camera.aspect || 1.4;
    const vFov = (camera.fov * Math.PI) / 180;
    const fitW = (reach * 1.2) / (2 * Math.tan(vFov / 2) * Math.min(aspect, 1.7));
    const fitH = ((box3.top + 7) * 1.06) / (2 * Math.tan(vFov / 2));
    frameDist = Math.max(fitW, fitH);
    lookY = Math.max(2.6, box3.top * 0.42);
    const el = 0.22;
    camera.position.set(0, lookY + Math.sin(el) * frameDist, Math.cos(el) * frameDist);
    camera.lookAt(0, lookY, 0);
  }

  function resize() {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    fit();
    dirty = true;
    tick();
  }

  function applyProgress() {
    if (!house) return;
    for (const part of house.parts) {
      const span = 0.42;
      const start = part.stage + part.delay * (1 - span);
      const t = clamp((progress - start) / span);
      const e = ease(t);
      const o = part.obj;
      o.visible = t > 0 && !(part.until && progress >= part.until);
      if (part.mode === 'grow') {
        o.scale.y = Math.max(0.0001, part.sy * e);
      } else if (part.mode === 'drop') {
        o.position.y = part.y + (1 - e) * 5;
      }
    }
    // Свет в окнах включается на этапе инженерии и держится до конца
    const lightOn = detail ? clamp((progress - 4.3) / 0.8) : lit;
    M.glass.emissiveIntensity = lightOn * 0.95;
    dirty = true;
  }

  function rebuild() {
    if (house) {
      spin.remove(house.root);
      house.root.traverse((n) => { if (n.geometry) n.geometry.dispose(); });
    }
    house = buildHouse(current, M, { detail });
    spin.add(house.root);
    fit();
    applyProgress();
    appear = 0;
  }

  function loop() {
    raf = 0;
    if (!visible) return;
    let moving = false;
    if (Math.abs(yawGoal - yawNow) > 0.0006) { yawNow += (yawGoal - yawNow) * 0.14; moving = true; }
    if (Math.abs(vel) > 0.0002) { yawGoal += vel; vel *= 0.92; moving = true; }
    if (appear < 1) {
      appear = Math.min(1, appear + 0.075);
      const e = ease(appear);
      house.root.position.y = (1 - e) * -0.22;
      moving = true;
    }
    spin.rotation.y = yawNow;
    if (dirty || moving) {
      renderer.render(scene, camera);
      dirty = false;
    }
    if (moving) tick();
  }
  function tick() { if (!raf && visible) raf = requestAnimationFrame(loop); }

  // Вращение: мышь и горизонтальный жест; вертикальная прокрутка страницы не блокируется
  let drag = null;
  const el = renderer.domElement;
  el.style.touchAction = 'pan-y';
  el.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, id: e.pointerId }; el.setPointerCapture(e.pointerId); host.classList.add('is-drag'); });
  el.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    drag.x = e.clientX;
    yawGoal += dx * 0.0062;
    vel = dx * 0.0011;
    tick();
  });
  const end = () => { drag = null; host.classList.remove('is-drag'); };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; if (visible) { dirty = true; tick(); } }, { rootMargin: '120px' });
  io.observe(host);

  rebuild();
  resize();

  return {
    update(next) { current = next; rebuild(); tick(); },
    setProgress(p) { if (p === progress) return; progress = p; applyProgress(); tick(); },
    setLit(v) { lit = v; applyProgress(); tick(); },
    setYaw(v) { yawGoal = v; tick(); },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); renderer.dispose(); },
  };
}
