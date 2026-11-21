/**
 * icho-data.js - Datos en memoria del esquema IChO de Glucopiranosa
 * Las dos sillas se construyen a partir de la plantilla PYRANOSE_CHAIR (templates.js),
 * así el ejemplo siempre usa la misma geometría que la herramienta de silla
 * (axiales alternados, ecuatoriales paralelos, 'depth' para los huecos en cruces).
 */

import { RING_TEMPLATES } from './templates.js';

/**
 * Construye una silla piranosa con sustituyentes.
 * @param {string} prefix  prefijo de ids (p. ej. 'g_')
 * @param {number} cx, cy  centro del anillo
 * @param {Object} subs    { c1: ['axial', 'OH'], c2: ['equatorial', 'OH', 'left'], ... }
 *                         (3er valor opcional: lado forzado de la etiqueta, 'left' -> 'HO', 'BnO')
 * @param {string} c6Group grupo sobre el CH2 de C6 (C5–CH2–X, ecuatorial), p. ej. 'OH' u 'OBn'
 */
function buildPyranoseChair(prefix, cx, cy, subs, c6Group) {
  const tpl = RING_TEMPLATES.PYRANOSE_CHAIR;
  const atoms = [];
  const bonds = [];
  const ring = {};
  const chairId = `${prefix}chair`;

  for (const a of tpl.ringAtoms) {
    const atom = {
      id: `${prefix}${a.id}`,
      x: cx + a.x,
      y: cy + a.y,
      element: a.element,
      depth: a.depth,
      chairId,
      chairVertex: a.id,
      substituentGuides: tpl.substituents[a.id] || null
    };
    if (a.label) atom.label = a.label;
    atoms.push(atom);
    ring[a.id] = atom;
  }
  for (const b of tpl.ringBonds) {
    // Mismo estilo que la plantilla: borde frontal remarcado (cuñas + enlace grueso)
    const bond = { id: `${prefix}b_${b.a1}_${b.a2}`, atom1: `${prefix}${b.a1}`, atom2: `${prefix}${b.a2}`, type: b.type || 'single' };
    if (b.wedgeWidth) bond.wedgeWidth = b.wedgeWidth;
    if (b.boldWidth) bond.boldWidth = b.boldWidth;
    bonds.push(bond);
  }

  const addSub = (parent, dx, dy, element, label, id) => {
    const atom = { id, x: parent.x + dx, y: parent.y + dy, element, depth: parent.depth };
    if (label) atom.label = label;
    atoms.push(atom);
    bonds.push({ id: `${id}_b`, atom1: parent.id, atom2: id, type: 'single' });
    return atom;
  };

  for (const [vid, [pos, label, labelSide]] of Object.entries(subs)) {
    const g = tpl.substituents[vid][pos];
    const sub = addSub(ring[vid], g.dx, g.dy, 'O', label, `${prefix}${vid}_${pos}`);
    if (labelSide) sub.labelSide = labelSide;
  }

  if (c6Group) {
    // C5–CH2 (ecuatorial, abierto hacia arriba-izquierda) y luego el grupo casi vertical,
    // como en la silla de la IChO
    const g = tpl.substituents.c5.equatorial;
    const c6 = addSub(ring.c5, g.dx, g.dy, 'C', null, `${prefix}c6`);
    addSub(c6, 4, -28, 'O', c6Group, `${prefix}c6_o`);
  }
  return { atoms, bonds };
}

// Molécula 1: α-D-glucopiranosa (OH anomérico axial abajo, resto ecuatoriales)
const GLUCOSE = buildPyranoseChair('g_', 120, 150, {
  c1: ['axial', 'OH'],
  c2: ['equatorial', 'OH', 'left'], // 'HO' hacia la izquierda para no chocar con el OH de C1
  c3: ['equatorial', 'OH'],
  c4: ['equatorial', 'OH']
}, 'OH');

// Molécula 2: metil 2,3,6-tri-O-bencil-α-D-glucopiranósido (OMe axial abajo, 4-OH libre)
const INTERMEDIATE = buildPyranoseChair('g2_', 680, 320, {
  c1: ['axial', 'OMe'],
  c2: ['equatorial', 'OBn', 'left'], // 'BnO' hacia la izquierda para no chocar con el OMe de C1
  c3: ['equatorial', 'OBn'],
  c4: ['equatorial', 'OH']
}, 'OBn');

export const ICHO_GLUCOSE_SCHEME = {
  version: "1.0",
  atoms: [...GLUCOSE.atoms, ...INTERMEDIATE.atoms],
  bonds: [...GLUCOSE.bonds, ...INTERMEDIATE.bonds],
  arrows: [
    {
      id: "arr_1",
      x1: 200,
      y1: 155,
      x2: 300,
      y2: 155,
      type: "normal",
      reagentsTop: "CH3OH, HCl",
      reagentsBottom: ""
    },
    {
      id: "arr_2",
      x1: 340,
      y1: 155,
      x2: 440,
      y2: 155,
      type: "normal",
      reagentsTop: "PhCH(OMe)2",
      reagentsBottom: "p-TsOH"
    },
    {
      id: "arr_3",
      x1: 480,
      y1: 155,
      x2: 580,
      y2: 155,
      type: "normal",
      reagentsTop: "NaH (excess)",
      reagentsBottom: "MeI (excess)"
    },
    {
      id: "arr_4",
      x1: 620,
      y1: 155,
      x2: 720,
      y2: 155,
      type: "normal",
      reagentsTop: "p-TsOH",
      reagentsBottom: "H2O"
    },
    {
      id: "arr_down_start",
      x1: 126,
      y1: 220,
      x2: 126,
      y2: 320,
      type: "normal",
      reagentsTop: "NaH (excess)\nMeI (excess)",
      reagentsBottom: ""
    },
    {
      id: "arr_f_to_g",
      x1: 155,
      y1: 340,
      x2: 255,
      y2: 340,
      type: "normal",
      reagentsTop: "H2O, HCl",
      reagentsBottom: ""
    },
    {
      id: "arr_b_to_inter",
      x1: 445,
      y1: 185,
      // Flecha doblada en L: baja desde B y gira hacia el glucósido de abajo
      x2: 556,
      y2: 319,
      bend: "vh",
      type: "normal",
      reagentsTop: "1) NaH, BnCl\n2) NaBH3CN",
      reagentsBottom: ""
    },
    {
      id: "arr_inter_to_e",
      x1: 805,
      y1: 345,
      x2: 895,
      y2: 345,
      type: "normal",
      reagentsTop: "1) Ac2O, Py",
      reagentsBottom: "2) DIBAL-H (excess)"
    }
  ],
  referenceBoxes: [
    {
      id: "ref_icho_1",
      x: 35,
      y: 435,
      width: 930,
      height: 80,
      title: "",
      items: [
        { abbr: "Ac", formula: "H3C-C(=O)~" },
        { abbr: "Bn", formula: "PhCH2" },
        { abbr: "DIBAL-H", formula: "i-Bu2AlH" },
        { abbr: "p-TsOH", formula: "H3C-C6H4-SO3H" },
        { abbr: "Py", formula: "Piridina" }
      ]
    }
  ],
  textLabels: [
    { id: "lbl_a", x: 320, y: 160, text: "A", isIntermediary: true },
    { id: "lbl_b", x: 445, y: 160, text: "B", isIntermediary: true },
    { id: "lbl_c", x: 600, y: 160, text: "C", isIntermediary: true },
    { id: "lbl_d", x: 740, y: 160, text: "D", isIntermediary: true },
    { id: "lbl_f", x: 126, y: 345, text: "F", isIntermediary: true },
    { id: "lbl_g", x: 275, y: 345, text: "G", isIntermediary: true },
    { id: "lbl_e", x: 925, y: 350, text: "E", isIntermediary: true }
  ]
};
