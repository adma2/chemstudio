/**
 * template-tool.js - Inserción de anillos aromáticos y alicíclicos
 *
 * Comportamiento:
 *  - Clic en espacio vacío: anillo nuevo centrado en el clic.
 *  - Clic sobre un ENLACE: el anillo se fusiona compartiendo ese enlace, del lado libre
 *    (benceno + benceno = naftaleno). Si un vértice nuevo cae sobre un átomo existente se
 *    reutiliza, así se pueden cerrar anillos (fenantreno, pireno...).
 *  - Clic sobre un ÁTOMO: el anillo se une a ese átomo con un enlace sencillo en la dirección
 *    más libre (benceno + benceno = bifenilo).
 * En los anillos aromáticos los dobles enlaces se colocan para que la estructura de Kekulé
 * siga siendo válida.
 */

import { RING_TEMPLATES } from '../chem-engine/templates.js';
import { calculateNextBondAngle, STANDARD_BOND_LENGTH } from '../chem-engine/snapping.js';

export class TemplateTool {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.templateKey = 'BENZENE'; // 'BENZENE', 'CYCLOHEXANE', 'CYCLOPENTANE'
  }

  setTemplate(key) {
    this.templateKey = (key || 'BENZENE').toUpperCase();
  }

  getTemplate() {
    const key = (this.templateKey || 'BENZENE').toUpperCase();
    return RING_TEMPLATES[key] || RING_TEMPLATES[this.templateKey] || null;
  }

  onMouseDown(e, canvasPos, targetInfo) {
    if (targetInfo && targetInfo.type === 'bond' && this.state.bonds.has(targetInfo.id)) {
      this.fuseOnBond(targetInfo.id);
      return;
    }
    if (targetInfo && targetInfo.type === 'atom' && this.state.getAtom(targetInfo.id)) {
      this.attachToAtom(targetInfo.id);
      return;
    }
    this.insertTemplateAt(canvasPos.x, canvasPos.y, this.templateKey);
  }

  onMouseMove(e, canvasPos, targetInfo) {}
  onMouseUp(e, canvasPos, targetInfo) {}

  insertTemplateAt(cx, cy, key) {
    const lookupKey = (key || this.templateKey || 'BENZENE').toUpperCase();
    const tpl = RING_TEMPLATES[lookupKey] || RING_TEMPLATES[key];
    if (!tpl) return;

    this.state.saveSnapshot();
    const createdAtoms = new Map();

    for (const a of tpl.ringAtoms) {
      const atom = this.state.addAtom({
        x: cx + a.x,
        y: cy + a.y,
        element: a.element || 'C'
      });
      createdAtoms.set(a.id, atom);
    }

    for (const b of tpl.ringBonds) {
      const a1 = createdAtoms.get(b.a1);
      const a2 = createdAtoms.get(b.a2);
      if (a1 && a2) {
        this.state.addBond({
          atom1: a1.id,
          atom2: a2.id,
          type: b.type || 'single'
        });
      }
    }

    this.renderer.render();
  }

  /** Número de vértices y si el anillo es aromático (lleva dobles enlaces) */
  ringInfo() {
    const tpl = this.getTemplate();
    if (!tpl) return null;
    return {
      n: tpl.ringAtoms.length,
      aromatic: tpl.ringBonds.some(b => b.type === 'double')
    };
  }

  /** Átomo existente en (x, y) o uno nuevo */
  atomAt(x, y) {
    for (const a of this.state.atoms.values()) {
      if (Math.hypot(a.x - x, a.y - y) < 8) return a;
    }
    return this.state.addAtom({ x, y, element: 'C' });
  }

  hasDouble(atomId) {
    for (const b of this.state.bonds.values()) {
      if ((b.atom1 === atomId || b.atom2 === atomId) && (b.type === 'double' || b.type === 'triple')) return true;
    }
    return false;
  }

  /** Lados del anillo: los dobles van en aristas cuyos dos extremos aún no tienen doble enlace */
  addRingBonds(ids, aromatic) {
    const n = ids.length;
    for (let i = 0; i < n; i++) {
      const a = ids[i], b = ids[(i + 1) % n];
      if (a === b) continue;
      const exists = Array.from(this.state.bonds.values()).some(x =>
        (x.atom1 === a && x.atom2 === b) || (x.atom1 === b && x.atom2 === a));
      if (exists) continue;
      let type = 'single';
      if (aromatic && !this.hasDouble(a) && !this.hasDouble(b)) type = 'double';
      this.state.addBond({ atom1: a, atom2: b, type });
    }
  }

  /** Fusiona el anillo compartiendo el enlace clicado, del lado opuesto a los vecinos existentes */
  fuseOnBond(bondId) {
    const info = this.ringInfo();
    if (!info) return;
    const bond = this.state.bonds.get(bondId);
    const a1 = this.state.getAtom(bond.atom1);
    const a2 = this.state.getAtom(bond.atom2);
    if (!a1 || !a2) return;

    const d = Math.hypot(a2.x - a1.x, a2.y - a1.y);
    if (d < 1) return;
    const mx = (a1.x + a2.x) / 2, my = (a1.y + a2.y) / 2;
    let nx = -(a2.y - a1.y) / d, ny = (a2.x - a1.x) / d;

    // Lado libre: opuesto a los demás vecinos de los dos átomos del enlace
    let side = 0;
    for (const b of this.state.bonds.values()) {
      for (const [self, other] of [[b.atom1, b.atom2], [b.atom2, b.atom1]]) {
        if ((self === a1.id || self === a2.id) && other !== a1.id && other !== a2.id) {
          const o = this.state.getAtom(other);
          if (o) side += (o.x - mx) * nx + (o.y - my) * ny;
        }
      }
    }
    if (side > 0) { nx = -nx; ny = -ny; }

    this.state.saveSnapshot();
    const n = info.n;
    const apothem = d / (2 * Math.tan(Math.PI / n));
    const R = d / (2 * Math.sin(Math.PI / n));
    const cx = mx + nx * apothem, cy = my + ny * apothem;

    // Vértices empezando en a2 y recorriendo hasta a1 por el lado nuevo
    const start = Math.atan2(a2.y - cy, a2.x - cx);
    const startA1 = Math.atan2(a1.y - cy, a1.x - cx);
    let step = (2 * Math.PI) / n;
    // Sentido de giro: el vértice n-1 debe coincidir con a1
    const endAngle = start + step * (n - 1);
    if (Math.hypot(cx + R * Math.cos(endAngle) - a1.x, cy + R * Math.sin(endAngle) - a1.y) > 1) step = -step;
    void startA1;

    const ids = [a2.id];
    for (let i = 1; i < n - 1; i++) {
      const ang = start + step * i;
      ids.push(this.atomAt(cx + R * Math.cos(ang), cy + R * Math.sin(ang)).id);
    }
    ids.push(a1.id);
    this.addRingBonds(ids, info.aromatic);
    this.state.updateValences();
    this.renderer.render();
  }

  /** Une un anillo nuevo al átomo con un enlace sencillo en la dirección más libre */
  attachToAtom(atomId) {
    const info = this.ringInfo();
    if (!info) return;
    const atom = this.state.getAtom(atomId);
    const L = STANDARD_BOND_LENGTH;
    const deg = calculateNextBondAngle(atom, this.state);
    const ux = Math.cos((deg * Math.PI) / 180), uy = Math.sin((deg * Math.PI) / 180);

    this.state.saveSnapshot();
    const n = info.n;
    const R = L / (2 * Math.sin(Math.PI / n));
    const r0 = { x: atom.x + ux * L, y: atom.y + uy * L };
    const cx = r0.x + ux * R, cy = r0.y + uy * R;
    const start = Math.atan2(r0.y - cy, r0.x - cx);
    const ids = [];
    for (let i = 0; i < n; i++) {
      const ang = start + ((2 * Math.PI) / n) * i;
      ids.push(this.atomAt(cx + R * Math.cos(ang), cy + R * Math.sin(ang)).id);
    }
    this.state.addBond({ atom1: atom.id, atom2: ids[0], type: 'single' });
    this.addRingBonds(ids, info.aromatic);
    this.state.updateValences();
    this.renderer.render();
  }
}
