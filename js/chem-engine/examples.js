/**
 * examples.js - Galería de esquemas de ejemplo (Suzuki, diclofenaco, PAH helicoidal, IChO glucosa,
 * síntesis de un trisacárido, síntesis de tromboxano B2 y porfirinas).
 *
 * Los ejemplos se construyen por código con SchemeBuilder (enlace estándar de 38 px), así que
 * siguen las mismas reglas de dibujo que la app (etiquetas automáticas, cargas, sillas IChO...).
 */

import { RING_TEMPLATES } from './templates.js';
import { ICHO_GLUCOSE_SCHEME } from './icho-data.js';

const L = 38;
const rad = (deg) => (deg * Math.PI) / 180;
const vec = (deg, len = L) => ({ x: len * Math.cos(rad(deg)), y: len * Math.sin(rad(deg)) });
const STANDARD = ['C', 'H', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I'];

class SchemeBuilder {
  constructor(prefix) {
    this.p = prefix;
    this.n = 0;
    this.atoms = [];
    this.bonds = [];
    this.arrows = [];
    this.referenceBoxes = [];
    this.textLabels = [];
    this.byId = new Map();
    this.byPos = new Map();
  }

  nid(kind) { return `${this.p}${kind}${++this.n}`; }

  /** Átomo; label opcional (OBn, OMe...). Elementos fuera de la lista estándar llevan etiqueta fija. */
  atom(x, y, element = 'C', opts = {}) {
    const isStd = STANDARD.includes(element);
    const a = {
      id: this.nid('a'), x, y, element, charge: 0, lonePairs: 0,
      label: opts.label !== undefined ? opts.label : (isStd ? null : element),
      manualLabel: !isStd, isCustomLabel: !isStd,
      ...opts
    };
    this.atoms.push(a);
    this.byId.set(a.id, a);
    return a.id;
  }

  /** Átomo único por posición (para anillos fusionados) */
  atomAt(x, y, element = 'C') {
    const key = `${Math.round(x * 2)},${Math.round(y * 2)}`;
    if (!this.byPos.has(key)) this.byPos.set(key, this.atom(x, y, element));
    return this.byPos.get(key);
  }

  get(id) { return this.byId.get(id); }

  bond(a1, a2, type = 'single', opts = {}) {
    const exists = this.bonds.find(b => (b.atom1 === a1 && b.atom2 === a2) || (b.atom1 === a2 && b.atom2 === a1));
    if (exists) return exists;
    const b = { id: this.nid('b'), atom1: a1, atom2: a2, type, ...opts };
    this.bonds.push(b);
    return b;
  }

  /** Sustituyente desde un átomo en una dirección (grados, y hacia abajo). */
  sub(fromId, deg, element = 'C', label, type = 'single', len = L) {
    const a = this.get(fromId);
    const d = vec(deg, len);
    const opts = {};
    if (label !== undefined && label !== null) opts.label = label;
    if (typeof a.depth === 'number') opts.depth = a.depth;
    const id = this.atom(a.x + d.x, a.y + d.y, element, opts);
    this.bond(fromId, id, type);
    return id;
  }

  /** Cadena en zigzag: lista de ángulos; devuelve los ids (sin el inicial). */
  chain(fromId, angles, types = []) {
    const ids = [];
    let curr = fromId;
    angles.forEach((deg, i) => {
      curr = this.sub(curr, deg, 'C', undefined, types[i] || 'single');
      ids.push(curr);
    });
    return ids;
  }

  /** Polígono regular de lado L. startDeg = ángulo del primer vértice. Devuelve ids en orden. */
  ring(cx, cy, n, startDeg, elements = {}) {
    const r = L / (2 * Math.sin(Math.PI / n));
    const ids = [];
    for (let i = 0; i < n; i++) {
      const d = vec(startDeg + (360 / n) * i, r);
      ids.push(this.atomAt(cx + d.x, cy + d.y, elements[i] || 'C'));
    }
    for (let i = 0; i < n; i++) this.bond(ids[i], ids[(i + 1) % n]);
    return ids;
  }

  /** Hexágono construido sobre la arista a-b, del lado opuesto al punto 'away'. */
  hexOnEdge(aId, bId, away) {
    const a = this.get(aId), b = this.get(bId);
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    let nx = -(b.y - a.y), ny = b.x - a.x;
    const nl = Math.hypot(nx, ny);
    nx /= nl; ny /= nl;
    if ((away.x - mx) * nx + (away.y - my) * ny > 0) { nx = -nx; ny = -ny; }
    const h = (Math.sqrt(3) / 2) * L;
    const cx = mx + nx * h, cy = my + ny * h;
    const start = (Math.atan2(a.y - cy, a.x - cx) * 180) / Math.PI;
    return this.ring(cx, cy, 6, start);
  }

  /** Estructura de Kekulé: dobles alternados en los enlaces entre estos átomos (emparejamiento perfecto). */
  kekulize(atomIds) {
    const set = new Set(atomIds);
    const edges = this.bonds.filter(b => set.has(b.atom1) && set.has(b.atom2));
    const adj = new Map(atomIds.map(id => [id, []]));
    edges.forEach(e => { adj.get(e.atom1).push(e); adj.get(e.atom2).push(e); });
    const matched = new Map();
    const other = (e, a) => (e.atom1 === a ? e.atom2 : e.atom1);
    const solve = () => {
      let pick = null, best = Infinity;
      for (const a of atomIds) {
        if (matched.has(a)) continue;
        const opts = adj.get(a).filter(e => !matched.has(other(e, a)));
        if (opts.length < best) { best = opts.length; pick = [a, opts]; }
      }
      if (!pick) return true;
      if (best === 0) return false;
      const [a, opts] = pick;
      for (const e of opts) {
        const o = other(e, a);
        matched.set(a, e); matched.set(o, e);
        if (solve()) return true;
        matched.delete(a); matched.delete(o);
      }
      return false;
    };
    if (solve()) new Set(matched.values()).forEach(e => { e.type = 'double'; });
  }

  /** Silla de piranosa / ciclohexano a partir de la plantilla (modelo IChO). */
  chair(cx, cy, subs = {}, opts = {}) {
    const tpl = RING_TEMPLATES[opts.template || 'PYRANOSE_CHAIR'];
    const ring = {};
    for (const a of tpl.ringAtoms) {
      const id = this.atom(cx + a.x, cy + a.y, a.element, {
        depth: a.depth, chairVertex: a.id, substituentGuides: tpl.substituents[a.id] || null,
        ...(a.label ? { label: a.label } : {})
      });
      ring[a.id] = id;
    }
    for (const b of tpl.ringBonds) {
      this.bond(ring[b.a1], ring[b.a2], b.type || 'single', {
        ...(b.wedgeWidth ? { wedgeWidth: b.wedgeWidth } : {}),
        ...(b.boldWidth ? { boldWidth: b.boldWidth } : {})
      });
    }
    for (const [vid, [pos, label, extra = {}]] of Object.entries(subs)) {
      const g = tpl.substituents[vid][pos];
      const parent = this.get(ring[vid]);
      const element = extra.element || (label && label.startsWith('S') ? 'S' : 'O');
      const id = this.atom(parent.x + g.dx, parent.y + g.dy, element, { label, depth: parent.depth, ...(extra.side ? { labelSide: extra.side } : {}) });
      this.bond(ring[vid], id);
    }
    if (opts.c6Group) {
      const g = tpl.substituents.c5.equatorial;
      const c5 = this.get(ring.c5);
      const c6 = this.atom(c5.x + g.dx, c5.y + g.dy, 'C', { depth: c5.depth });
      this.bond(ring.c5, c6);
      const o = this.atom(c5.x + g.dx + 4, c5.y + g.dy - 28, 'O', { label: opts.c6Group, depth: c5.depth });
      this.bond(c6, o);
    }
    return ring;
  }

  arrow(x1, y1, x2, y2, top = '', bottom = '', opts = {}) {
    this.arrows.push({ id: this.nid('arr'), x1, y1, x2, y2, type: 'normal', reagentsTop: top, reagentsBottom: bottom, ...opts });
  }

  /** Texto: letra de compuesto (negrita grande) o texto normal. */
  text(x, y, text, opts = {}) {
    const bold = opts.bold !== undefined ? opts.bold : /^[A-Z][0-9']?$/.test(text);
    this.textLabels.push({
      id: this.nid('lbl'), x, y, text,
      fontSize: opts.fontSize || (bold ? 22 : 14),
      isIntermediary: bold,
      ...(opts.fontWeight ? { fontWeight: opts.fontWeight } : {})
    });
  }

  refBox(x, y, width, items, height = 90) {
    this.referenceBoxes.push({ id: this.nid('ref'), boxType: 'reference', x, y, width, height, title: '', items });
  }

  structure() {
    return { version: '1.0', atoms: this.atoms, bonds: this.bonds, arrows: [], referenceBoxes: [], textLabels: [] };
  }

  scheme() {
    return {
      version: '1.0',
      atoms: this.atoms, bonds: this.bonds, arrows: this.arrows,
      referenceBoxes: this.referenceBoxes, textLabels: this.textLabels,
      showCompoundBoxes: true
    };
  }
}

/** Benceno con dos vértices horizontales (izquierda/derecha); devuelve ids [der, abajo-der, abajo-izq, izq, arriba-izq, arriba-der]. */
function benzeneH(b, cx, cy) {
  const ids = b.ring(cx, cy, 6, 0);
  b.kekulize(ids);
  return ids;
}

// ---------------------------------------------------------------------------
// 1. Acoplamiento de Suzuki
// ---------------------------------------------------------------------------
function buildSuzuki() {
  const b = new SchemeBuilder('sz_');
  const y = 150;

  // 4-bromoanisol
  const r1 = benzeneH(b, 150, y);
  const o1 = b.sub(r1[3], 180, 'O'); // enlace exocíclico en la bisectriz (120° con el anillo)
  b.sub(o1, 120, 'C');
  b.sub(r1[0], 0, 'Br');
  b.text(262, y + 6, '+', { bold: false, fontSize: 22 });

  // Ácido fenilborónico
  const boron = b.atom(310, y, 'B');
  b.sub(boron, 240, 'O');
  b.sub(boron, 120, 'O');
  const r2 = benzeneH(b, 310 + 2 * L, y);
  b.bond(boron, r2[3]);

  b.arrow(470, y, 650, y, 'Pd(PPh3)4', 'K2CO3, 80 °C');

  // 4-metoxibifenilo
  const r3 = benzeneH(b, 770, y);
  const o3 = b.sub(r3[3], 180, 'O');
  b.sub(o3, 120, 'C');
  const r4 = benzeneH(b, 770 + 3 * L, y);
  b.bond(r3[0], r4[3]);
  return b.scheme();
}

// ---------------------------------------------------------------------------
// 2. Diclofenaco
// ---------------------------------------------------------------------------
function buildDiclofenac() {
  const b = new SchemeBuilder('dc_');
  // Anillo A con vértice arriba: [arriba, arriba-der, abajo-der, abajo, abajo-izq, arriba-izq]
  const A = b.ring(260, 160, 6, -90);
  b.kekulize(A);
  const ch2 = b.sub(A[4], 150);
  const cooh = b.sub(ch2, 210);
  b.sub(cooh, 270, 'O', undefined, 'double');
  b.sub(cooh, 150, 'O');
  const n = b.sub(A[3], 90, 'N');
  // Anillo B unido al N hacia abajo-derecha
  const c1 = b.sub(n, 30);
  const c1a = b.get(c1);
  const cB = vec(30);
  const Bv = [];
  for (let i = 0; i < 6; i++) {
    const d = vec(210 + 60 * i);
    // el vértice 0 cae justo sobre c1: reutilizarlo para que el anillo quede unido al N
    Bv.push(i === 0 ? c1 : b.atomAt(c1a.x + cB.x + d.x, c1a.y + cB.y + d.y));
  }
  for (let i = 0; i < 6; i++) b.bond(Bv[i], Bv[(i + 1) % 6]);
  b.kekulize(Bv);
  b.sub(Bv[1], 270, 'Cl');
  b.sub(Bv[5], 150, 'Cl');
  b.text(265, 345, 'Diclofenaco', { bold: false, fontSize: 15 });
  return b.scheme();
}

// ---------------------------------------------------------------------------
// 3. Hidrocarburo aromático policíclico helicoidal
// ---------------------------------------------------------------------------
function buildHelicalPAH() {
  const b = new SchemeBuilder('pah_');
  // Hexágonos de vértices laterales en una red: centro(q, r)
  const x0 = 120, y0 = 330;
  const center = (q, r) => ({ x: x0 + 1.5 * L * q, y: y0 + Math.sqrt(3) * L * (r + q / 2) });
  const rings = [[0, 0], [1, -1], [2, -2], [2, -3], [3, -4], [4, -4], [4, -3], [4, -2], [3, -1]];
  const all = new Set();
  for (const [q, r] of rings) {
    const c = center(q, r);
    b.ring(c.x, c.y, 6, 0).forEach(id => all.add(id));
  }
  b.kekulize(Array.from(all));
  return b.scheme();
}

// ---------------------------------------------------------------------------
// 4. Síntesis de un trisacárido "Gal-Gal-Glc" (IChO)
// ---------------------------------------------------------------------------
function buildTrisaccharide() {
  const b = new SchemeBuilder('ts_');
  const y = 190;

  // Metil 3-O-bencil-β-D-galactopiranósido (OH de C4 axial)
  b.chair(115, y, {
    c1: ['equatorial', 'OMe'],
    c2: ['equatorial', 'OH'],
    c3: ['equatorial', 'OBn'],
    c4: ['axial', 'OH', { side: 'left' }] // "HO" a la izquierda para no chocar con el OH del CH2OH
  }, { c6Group: 'OH' });
  b.arrow(225, y, 370, y, 'RB(OH)2, Py', '');
  b.text(395, y + 7, 'L');

  // Donador 1 (galactosilo) como molécula sobre la flecha (más pequeña, estilo IChO)
  const d1 = new SchemeBuilder('d1_');
  d1.chair(0, 0, {
    c1: ['equatorial', 'SEt', { element: 'S' }],
    c2: ['equatorial', 'OBn'],
    c3: ['equatorial', 'OFmoc', { side: 'left' }],
    c4: ['axial', 'OAc', { side: 'left' }]
  }, { c6Group: 'OBn' });
  b.arrow(425, y, 625, y, '1) NIS, TMSOTf', '2) Et3N', { structureTop: d1.structure() });
  b.text(655, y + 7, 'M');
  b.text(657, y + 34, '(C36H42BO12R)', { bold: false, fontSize: 13 });

  // Donador 2 (glucosilo) como molécula sobre la flecha
  const d2 = new SchemeBuilder('d2_');
  d2.chair(0, 0, {
    c1: ['equatorial', 'SEt', { element: 'S' }],
    c2: ['equatorial', 'OBz'],
    c3: ['equatorial', 'OBn', { side: 'left' }],
    c4: ['equatorial', 'OBn', { side: 'left' }]
  }, { c6Group: 'OBn' });
  b.arrow(735, y, 935, y, '1) NIS, TMSOTf', '2) H2O, heating', { structureTop: d2.structure() });
  b.text(1020, y + 7, '"Gal-Gal-Glc"', { bold: true, fontSize: 20 });

  // Definiciones: Fmoc, NIS, TMSOTf
  const yd = 360;
  b.text(60, yd + 5, 'Fmoc =', { bold: false, fontSize: 15 });
  const w0 = b.atom(105, yd, 'C');
  const cO = b.sub(w0, -30, 'C', undefined, 'wavy');
  b.sub(cO, 270, 'O', undefined, 'double');
  const oE = b.sub(cO, 30, 'O');
  const ch2 = b.sub(oE, -30);
  const c9 = b.sub(ch2, 30);
  // Fluoreno: pentágono con C9 a la izquierda y dos bencenos fusionados a la derecha
  const c9a = b.get(c9);
  const rp = L / (2 * Math.sin(Math.PI / 5));
  const pc = { x: c9a.x + rp, y: c9a.y };
  const P = [c9];
  for (let i = 1; i < 5; i++) {
    const d = vec(180 + 72 * i, rp);
    P.push(b.atomAt(pc.x + d.x, pc.y + d.y));
  }
  for (let i = 0; i < 5; i++) b.bond(P[i], P[(i + 1) % 5]);
  const top = b.hexOnEdge(P[1], P[2], pc);
  const bot = b.hexOnEdge(P[3], P[4], pc);
  b.kekulize(top);
  b.kekulize(bot);

  b.text(470, yd + 5, 'NIS =', { bold: false, fontSize: 15 });
  // Succinimida N-yodada: N a la derecha
  const nc = { x: 560, y: yd };
  const S = [];
  for (let i = 0; i < 5; i++) {
    const d = vec(72 * i, rp);
    S.push(b.atomAt(nc.x + d.x, nc.y + d.y, i === 0 ? 'N' : 'C'));
  }
  for (let i = 0; i < 5; i++) b.bond(S[i], S[(i + 1) % 5]);
  b.sub(S[1], 72, 'O', undefined, 'double');
  b.sub(S[4], -72, 'O', undefined, 'double');
  b.sub(S[0], 0, 'I');

  b.text(820, yd + 5, 'TMSOTf = CF3SO3SiMe3', { bold: false, fontSize: 15 });
  return b.scheme();
}

// ---------------------------------------------------------------------------
// 5. Síntesis de tromboxano B2 a partir de D-glucosa
// ---------------------------------------------------------------------------
function buildThromboxane() {
  const b = new SchemeBuilder('tx_');

  // D-glucosa (anillo plano con estereoquímica): [arriba, arriba-der, abajo-der, abajo(O), abajo-izq, arriba-izq]
  const G = b.ring(95, 120, 6, -90, { 3: 'O' });
  b.sub(G[0], 270, 'O', undefined, 'wedge');
  b.sub(G[1], 330, 'O', undefined, 'dash');
  b.sub(G[5], 210, 'O', undefined, 'dash');
  b.sub(G[4], 150, 'O', undefined, 'wavy');
  const ch2g = b.sub(G[2], 30, 'C', undefined, 'wedge');
  b.sub(ch2g, -30, 'O');
  b.text(95, 215, 'D-glucose', { bold: false, fontSize: 14 });

  const y = 120;
  b.arrow(280, y, 430, y, '1) MeOH, HCl', '2) PhCH(OMe)2, TsOH');
  b.text(455, y + 7, 'D');
  b.arrow(480, y, 575, y, '1) TsCl, Py', '2) Na2CO3');
  b.text(600, y + 7, 'E');
  b.arrow(625, y, 720, y, '1) LiAlH4', '2) BzCl');
  b.text(745, y + 7, 'F');
  // Flecha en "L": tramo horizontal sin punta y bajada con punta
  // Flecha doblada en L: → y luego ↓ hacia el piranósido
  b.arrow(770, y, 905, 245, '1) H2, Pd(OH)2/C', '2) TBDPSCl', { bend: 'hv' });

  // Intermedio: 2-desoxi piranósido
  const I = b.ring(890, 345, 6, -90, { 3: 'O' });
  b.sub(I[0], 270, 'O', 'OBz', 'dash');
  b.sub(I[1], 330, 'O', undefined, 'dash');
  b.sub(I[4], 150, 'O', 'OMe', 'dash');
  const ch2i = b.sub(I[2], 30, 'C', undefined, 'wedge');
  b.sub(ch2i, -30, 'O', 'OTBDPS');

  const y2 = 355;
  b.arrow(800, y2, 680, y2, '1) DMSO, (COCl)2', '2) Et3N');
  b.text(655, y2 + 7, 'G');

  // Fosfonato como "molécula sobre la flecha" (pegado a la flecha, como en la IChO)
  const ph = new SchemeBuilder('ph_');
  const p = ph.atom(0, 0, 'P', { label: '(MeO)2P' });
  ph.sub(p, 270, 'O', undefined, 'double');
  const pc = ph.sub(p, 30);
  ph.sub(pc, -30, 'C', 'COOMe');
  b.arrow(640, y2, 500, y2, '', 'KO^tBu', { structureTop: ph.structure() });
  b.text(485, y2 + 7, 'H');
  b.arrow(460, y2, 340, y2, '1) H2, Pd(OH)2/C', '2) K2CO3');
  b.text(315, y2 + 7, 'I');
  b.text(315, y2 + 40, 'C25H32SiO5', { bold: false, fontSize: 13 }); // centrada bajo la I
  // Varios pasos: una sola flecha hacia el tromboxano
  b.arrow(315, 405, 315, 480, '', '');

  // Tromboxano B2
  const T = b.ring(95, 575, 6, -90, { 3: 'O' });
  b.sub(T[0], 270, 'O', undefined, 'dash');
  b.sub(T[4], 150, 'O', undefined, 'dash');
  // Cadena α (cis) desde el vértice superior derecho
  const a1 = b.sub(T[1], -30, 'C', undefined, 'dash');
  const [a2, a3, a4, a5, a6] = b.chain(a1, [30, 0, -30, 30, -30], ['single', 'double']);
  b.sub(a6, 30, 'C', 'COOH');
  // Cadena ω (trans) desde el vértice inferior derecho
  const b1 = b.sub(T[2], 30, 'C', undefined, 'wedge');
  const [, b3] = b.chain(b1, [-30, 30], ['double']);
  b.sub(b3, 90, 'O', undefined, 'dash');
  b.chain(b3, [-30, 30, -30, 30, -30]);
  void a2; void a3; void a4; void a5;
  b.text(130, 675, 'Thromboxane B​2', { bold: false, fontSize: 15 });

  // Recuadro de referencias con estructuras
  const bz = new SchemeBuilder('bz_');
  const br = benzeneH(bz, 0, 0);
  const co = bz.sub(br[0], 0);
  bz.sub(co, -60, 'O', undefined, 'double'); // carbono sp2: 120° entre sus tres enlaces
  bz.sub(co, 60, 'Cl');

  const dm = new SchemeBuilder('dm_');
  const s = dm.atom(0, 0, 'S');
  dm.sub(s, 150);
  dm.sub(s, 30);
  dm.sub(s, 270, 'O', undefined, 'double');

  const py = new SchemeBuilder('py_');
  const pr = py.ring(0, 0, 6, -90, { 3: 'N' });
  py.kekulize(pr);

  b.refBox(560, 470, 420, [
    { abbr: 'BzCl', formula: '', structure: bz.structure() },
    { abbr: 'DMSO', formula: '', structure: dm.structure() },
    { abbr: 'TBDPSCl', formula: 't-Bu(Ph)2SiCl' },
    { abbr: 'Py', formula: '', structure: py.structure() }
  ], 150);
  return b.scheme();
}

// ---------------------------------------------------------------------------
// 6. Porfirinas (moléculas grandes): tetrafenilporfirina, nitración/reducción y dímero azo con Mo
// ---------------------------------------------------------------------------

/**
 * Porfirina centrada en (cx, cy). Cuatro pirroles (arriba, derecha, abajo, izquierda) con el N
 * hacia el centro y cuatro carbonos meso en las diagonales.
 *  opts.metal: símbolo del metal central (p. ej. 'Mo'); sin metal, los N de arriba y abajo son NH.
 *  opts.meso: { tr, br, bl, tl } -> 'Ph' (etiqueta) o null (libre, para unir otra cosa).
 * Devuelve los ids de los carbonos meso y de los N.
 */
function addPorphyrin(b, cx, cy, opts = {}) {
  const r5 = L / (2 * Math.sin(Math.PI / 5));   // radio del pentágono
  const R5 = 87.2;                               // centro de la porfirina -> centro de cada pirrol
  const Dm = 95.3;                               // centro -> carbono meso (enlaces Cα–Cmeso ≈ 38)
  const pyrroles = {};
  for (const [name, th] of [['top', -90], ['right', 0], ['bottom', 90], ['left', 180]]) {
    const pc = { x: cx + R5 * Math.cos(rad(th)), y: cy + R5 * Math.sin(rad(th)) };
    // vértices del pentágono: N hacia el centro, luego α, β, β, α
    const ids = [];
    const elems = ['N', 'C', 'C', 'C', 'C'];
    for (let i = 0; i < 5; i++) {
      const d = vec(th + 180 + 72 * i, r5);
      ids.push(b.atomAt(pc.x + d.x, pc.y + d.y, elems[i]));
    }
    for (let i = 0; i < 5; i++) b.bond(ids[i], ids[(i + 1) % 5]);
    pyrroles[name] = { n: ids[0], alphas: [ids[1], ids[4]] };
  }
  const meso = {};
  const allAlphas = Object.values(pyrroles).flatMap(p => p.alphas);
  for (const [name, phi] of [['tr', -45], ['br', 45], ['bl', 135], ['tl', 225]]) {
    const d = vec(phi, Dm);
    const m = b.atom(cx + d.x, cy + d.y, 'C');
    meso[name] = m;
    // unir con los dos carbonos α más cercanos
    const mA = b.get(m);
    allAlphas
      .map(id => ({ id, dist: Math.hypot(b.get(id).x - mA.x, b.get(id).y - mA.y) }))
      .sort((p, q) => p.dist - q.dist)
      .slice(0, 2)
      .forEach(({ id }) => b.bond(m, id));
    const sub = opts.meso && opts.meso[name];
    if (sub) b.sub(m, phi, 'C', sub);
  }
  // Kekulé del macrociclo: los N de arriba y abajo quedan sin doble enlace (NH o N–metal)
  const ringAtoms = new Set();
  for (const p of Object.values(pyrroles)) {
    for (const bd of b.bonds) {
      if (bd.atom1 === p.n || bd.atom2 === p.n || p.alphas.includes(bd.atom1) || p.alphas.includes(bd.atom2)) {
        ringAtoms.add(bd.atom1); ringAtoms.add(bd.atom2);
      }
    }
  }
  Object.values(meso).forEach(id => ringAtoms.add(id));
  // solo átomos del macrociclo (sin los Ph de los meso)
  const macro = Array.from(ringAtoms).filter(id => {
    const a = b.get(id);
    return Math.hypot(a.x - cx, a.y - cy) < 125 && !a.label; // macrociclo: hasta los C β (~115 px)
  }).filter(id => id !== pyrroles.top.n && id !== pyrroles.bottom.n);
  b.kekulize(macro);

  if (opts.metal) {
    const metal = b.atom(cx, cy, opts.metal);
    b.bond(pyrroles.top.n, metal);
    b.bond(pyrroles.bottom.n, metal);
    b.bond(pyrroles.left.n, metal, 'dative');
    b.bond(pyrroles.right.n, metal, 'dative');
  }
  return { meso, n: pyrroles };
}

/** Fenilo con un vértice arriba unido a 'fromId' desde arriba; devuelve [ipso, ..., para] */
function addParaPhenyl(b, ipsoX, ipsoY) {
  const ids = b.ring(ipsoX, ipsoY + L, 6, -90); // [arriba(ipso), arr-der, ab-der, abajo(para), ab-izq, arr-izq]
  b.kekulize(ids);
  return ids;
}

function buildPorphyrins() {
  const b = new SchemeBuilder('pf_');
  const y = 170;
  const dm = 95.3 / Math.SQRT2; // desplazamiento x/y de un carbono meso diagonal
  const k = L / Math.SQRT2;

  b.text(45, y + 6, 'PhCHO', { bold: false, fontSize: 16 });
  // Pirrol sobre la flecha
  const py = new SchemeBuilder('py2_');
  py.ring(0, 0, 5, 90, { 0: 'N' });
  const pyIds = py.atoms.map(a => a.id);
  py.bonds.find(x => x.atom1 === pyIds[1] && x.atom2 === pyIds[2]).type = 'double';
  py.bonds.find(x => x.atom1 === pyIds[3] && x.atom2 === pyIds[4]).type = 'double';
  b.arrow(95, y, 255, y, '1) pyrrole, TFA', '2) DDQ', { structureTop: py.structure() });

  // A: tetrafenilporfirina
  addPorphyrin(b, 430, y, { meso: { tr: 'Ph', br: 'Ph', bl: 'Ph', tl: 'Ph' } });
  b.text(430, y + 160, 'A');

  b.arrow(610, y, 770, y, '1) conc. HNO3', '2) SnCl2, HCl');

  // B: aminofenil-trifenilporfirina
  const B = addPorphyrin(b, 950, y, { meso: { tr: 'Ph', bl: 'Ph', tl: 'Ph' } });
  const mB = b.get(B.meso.br);
  const ph = addParaPhenyl(b, mB.x + k, mB.y + k);
  b.bond(B.meso.br, ph[0]);
  b.sub(ph[3], 90, 'N');
  b.text(925, y + 160, 'B');

  b.arrow(1160, y + 150, 1160, y + 330, '1) MnO2\n2) MoCl2', '');

  // C: dímero azo de Mo-porfirinas
  const c1 = { x: 560, y: 520 };
  const P1 = addPorphyrin(b, c1.x, c1.y, { metal: 'Mo', meso: { tr: 'Ph', bl: 'Ph', tl: 'Ph' } });
  const m1 = b.get(P1.meso.br);
  const ar1 = addParaPhenyl(b, m1.x + k, m1.y + k);
  b.bond(P1.meso.br, ar1[0]);
  const n1 = b.sub(ar1[3], 90, 'N');
  const n2 = b.sub(n1, 30, 'N', undefined, 'double');
  const n2a = b.get(n2);
  const ar2 = addParaPhenyl(b, n2a.x, n2a.y + L);
  b.bond(n2, ar2[0]);
  const para2 = b.get(ar2[3]);
  const c2 = { x: para2.x + k + dm, y: para2.y + k + dm };
  const P2 = addPorphyrin(b, c2.x, c2.y, { metal: 'Mo', meso: { tr: 'Ph', br: 'Ph', bl: 'Ph' } });
  b.bond(ar2[3], P2.meso.tl);
  b.text(c1.x + 40, c2.y - 20, 'C');
  return b.scheme();
}

/** Catálogo que muestra la galería de ejemplos */
export const EXAMPLE_SCHEMES = [
  {
    key: 'icho-glucose',
    name: 'IChO · Glucopiranosa',
    description: 'Esquema de examen con sillas de glucosa, incógnitas A–G y recuadro de abreviaturas.',
    build: () => JSON.parse(JSON.stringify(ICHO_GLUCOSE_SCHEME))
  },
  {
    key: 'suzuki',
    name: 'Acoplamiento de Suzuki',
    description: '4-Bromoanisol + ácido fenilborónico → 4-metoxibifenilo (Pd(PPh3)4, K2CO3).',
    build: buildSuzuki
  },
  {
    key: 'diclofenac',
    name: 'Diclofenaco',
    description: 'Molécula de fármaco: anillos aromáticos, NH, ácido carboxílico y Cl.',
    build: buildDiclofenac
  },
  {
    key: 'helical-pah',
    name: 'Aromático policíclico helicoidal',
    description: 'Hidrocarburo de anillos fusionados (antraceno + heliceno) con estructura de Kekulé.',
    build: buildHelicalPAH
  },
  {
    key: 'trisaccharide',
    name: 'IChO · Trisacárido Gal-Gal-Glc',
    description: 'Glicosilaciones con donadores en silla, incógnitas L y M, definiciones de Fmoc, NIS y TMSOTf.',
    build: buildTrisaccharide
  },
  {
    key: 'porphyrins',
    name: 'Porfirinas (moléculas grandes)',
    description: 'Tetrafenilporfirina, aminofenil-porfirina y dímero azo de Mo-porfirinas (enlaces de coordinación).',
    build: buildPorphyrins
  },
  {
    key: 'thromboxane',
    name: 'IChO · Síntesis de tromboxano B2',
    description: 'Ruta desde D-glucosa con cuñas, enlaces punteados, alquenos cis/trans y recuadro de referencias.',
    build: buildThromboxane
  }
];
