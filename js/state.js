/**
 * state.js - Gestor de estado central de ChemStudio
 * Controla átomos, enlaces, flechas de reacción, cajas de referencias, selección y deshacer/rehacer.
 */

import { validateMolecularValences, getBondOrder } from './chem-engine/valence.js';

export class ChemState {
  constructor() {
    this.atoms = new Map();
    this.bonds = new Map();
    this.arrows = new Map();
    this.referenceBoxes = new Map();
    this.textLabels = new Map();

    // Selección actual
    this.selected = {
      atoms: new Set(),
      bonds: new Set(),
      arrows: new Set(),
      labels: new Set(),
      boxes: new Set()
    };

    // Herramienta activa
    this.currentTool = 'select'; // 'select', 'bond', 'wedge', 'dash', 'chair', 'arrow', 'text', etc.
    this.bondType = 'single';
    this.activeElement = 'C';
    this.isProblemMode = false; // Modo Construir Problema (IChO reaction scheme)
    this.showCompoundBoxes = true; // Visibilidad de recuadros de problema (A, B, C...)
    this.isDarkMode = false; // Modo Oscuro (fondo oscuro, enlaces/flechas/texto blancos)
    this.activeChargeMode = null; // Modo continuo de carga ('+', '-', '0', 'lp' o null)

    // Parámetros de vista (pan & zoom)
    this.pan = { x: 0, y: 0 };
    this.zoom = 1.0;

    // Historial para Deshacer / Rehacer
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 50;

    // Suscriptores de eventos
    this.listeners = new Map();

    // Cache de validación de valencias
    this.valenceErrors = new Map();

    // Autoincrementadores de ID
    this.nextId = 1;
  }

  generateId(prefix = 'item') {
    return `${prefix}_${Date.now().toString(36)}_${this.nextId++}`;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const cb of this.listeners.get(event)) {
        cb(data);
      }
    }
  }

  saveSnapshot() {
    const snapshot = {
      atoms: Array.from(this.atoms.values()).map(a => ({ ...a })),
      bonds: Array.from(this.bonds.values()).map(b => ({ ...b })),
      arrows: Array.from(this.arrows.values()).map(a => ({ ...a })),
      referenceBoxes: Array.from(this.referenceBoxes.values()).map(r => ({ ...r })),
      textLabels: Array.from(this.textLabels.values()).map(l => ({ ...l }))
    };

    this.undoStack.push(JSON.stringify(snapshot));
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Limpiar historial posterior
  }

  undo() {
    if (this.undoStack.length === 0) return;
    const current = {
      atoms: Array.from(this.atoms.values()).map(a => ({ ...a })),
      bonds: Array.from(this.bonds.values()).map(b => ({ ...b })),
      arrows: Array.from(this.arrows.values()).map(a => ({ ...a })),
      referenceBoxes: Array.from(this.referenceBoxes.values()).map(r => ({ ...r })),
      textLabels: Array.from(this.textLabels.values()).map(l => ({ ...l }))
    };
    this.redoStack.push(JSON.stringify(current));

    const previous = JSON.parse(this.undoStack.pop());
    this.loadFromObject(previous, false);
    this.emit('change');
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const current = {
      atoms: Array.from(this.atoms.values()).map(a => ({ ...a })),
      bonds: Array.from(this.bonds.values()).map(b => ({ ...b })),
      arrows: Array.from(this.arrows.values()).map(a => ({ ...a })),
      referenceBoxes: Array.from(this.referenceBoxes.values()).map(r => ({ ...r })),
      textLabels: Array.from(this.textLabels.values()).map(l => ({ ...l }))
    };
    this.undoStack.push(JSON.stringify(current));

    const next = JSON.parse(this.redoStack.pop());
    this.loadFromObject(next, false);
    this.emit('change');
  }

  updateValences() {
    // Sincronizar carga desde la etiqueta si contiene sufijo de carga (+ o -)
    for (const atom of this.atoms.values()) {
      if (atom.label && typeof atom.label === 'string') {
        const trimmed = atom.label.trim();
        if (trimmed.endsWith('+') && (atom.charge === 0 || atom.charge === undefined)) {
          const match = trimmed.match(/(\d+)\+$/);
          atom.charge = match ? parseInt(match[1], 10) : 1;
        } else if ((trimmed.endsWith('-') || trimmed.endsWith('−')) && (atom.charge === 0 || atom.charge === undefined)) {
          const match = trimmed.match(/(\d+)[-−]$/);
          atom.charge = match ? -parseInt(match[1], 10) : -1;
        }
      }
    }
    this.applyAutoCharges();
    const atomList = Array.from(this.atoms.values());
    const bondList = Array.from(this.bonds.values());
    this.valenceErrors = validateMolecularValences(atomList, bondList);
  }

  /**
   * Cargas formales automáticas:
   *  - N con 4 enlaces            -> N+  (amonio, piridinio, nitro, diazonio...)
   *  - O con 3 enlaces            -> O+  (oxonio)
   *  - O terminal unido por enlace simple a un N+ automático -> O−  (nitro, N-óxidos)
   * 'autoCharge' recuerda la última carga puesta automáticamente. Si el usuario cambia la
   * carga a mano (charge !== autoCharge) se respeta y no se vuelve a tocar.
   * Solo se aplica a átomos sin etiqueta de grupo (p. ej. no toca 'OMe', 'NO2', 'NH4+').
   */
  applyAutoCharges() {
    const sums = new Map();
    const neighbors = new Map();
    for (const a of this.atoms.values()) {
      sums.set(a.id, 0);
      neighbors.set(a.id, []);
    }
    for (const b of this.bonds.values()) {
      if (!sums.has(b.atom1) || !sums.has(b.atom2)) continue;
      const order = getBondOrder(b.type);
      sums.set(b.atom1, sums.get(b.atom1) + order);
      sums.set(b.atom2, sums.get(b.atom2) + order);
      neighbors.get(b.atom1).push({ id: b.atom2, order });
      neighbors.get(b.atom2).push({ id: b.atom1, order });
    }

    const isAuto = (a) => (a.charge || 0) === (a.autoCharge || 0);
    const isPlain = (a) => !a.label || a.label === a.element ||
      (!a.manualLabel && [`${a.element}+`, `${a.element}-`, `${a.element}−`].includes(a.label));

    const desired = new Map();
    for (const a of this.atoms.values()) {
      let c = 0;
      if (a.element === 'N' && sums.get(a.id) === 4) c = 1;
      else if (a.element === 'O' && sums.get(a.id) === 3) c = 1;
      desired.set(a.id, c);
    }

    // O− en el oxígeno terminal (enlace simple) de un N+ automático: nitro, N-óxidos
    for (const n of this.atoms.values()) {
      if (n.element !== 'N' || desired.get(n.id) !== 1 || !isAuto(n) || !isPlain(n)) continue;
      const oxygens = neighbors.get(n.id)
        .map(nb => ({ ...nb, atom: this.atoms.get(nb.id) }))
        .filter(nb => nb.atom && nb.atom.element === 'O' && nb.order === 1 && sums.get(nb.id) === 1);
      // Si el usuario ya puso un O− a mano en ese N, no añadir otro
      if (oxygens.some(nb => !isAuto(nb.atom) && (nb.atom.charge || 0) < 0)) continue;
      const target = oxygens.find(nb => isAuto(nb.atom) && (!nb.atom.label || ['O', 'O-', 'O−'].includes(nb.atom.label)));
      if (target) desired.set(target.id, -1);
    }

    for (const a of this.atoms.values()) {
      if (!isAuto(a) || !isPlain(a)) continue;
      const c = desired.get(a.id) || 0;
      a.charge = c;
      a.autoCharge = c;
    }
  }

  // --- Operaciones de Átomos ---
  addAtom(atom) {
    const id = atom.id || this.generateId('atom');
    const elem = atom.element || 'C';
    const isStandardElem = ['C', 'H', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I'].includes(elem);
    const defaultLabel = isStandardElem ? (atom.label || null) : (atom.label || elem);
    const isManual = atom.manualLabel !== undefined ? atom.manualLabel : (!isStandardElem);
    const isCustom = atom.isCustomLabel !== undefined ? atom.isCustomLabel : (!isStandardElem);

    const newAtom = {
      id,
      x: atom.x,
      y: atom.y,
      element: elem,
      charge: atom.charge !== undefined ? atom.charge : 0,
      lonePairs: atom.lonePairs !== undefined ? atom.lonePairs : 0,
      label: defaultLabel,
      manualLabel: isManual,
      isCustomLabel: isCustom,
      ...atom
    };

    if (!isStandardElem) {
      if (!newAtom.label) newAtom.label = elem;
      if (newAtom.manualLabel === undefined) newAtom.manualLabel = true;
      if (newAtom.isCustomLabel === undefined) newAtom.isCustomLabel = true;
    }

    this.atoms.set(id, newAtom);
    this.updateValences();
    return newAtom;
  }

  getAtom(id) {
    return this.atoms.get(id);
  }

  updateAtom(id, updates) {
    const atom = this.atoms.get(id);
    if (atom) {
      Object.assign(atom, updates);
      this.updateValences();
    }
  }

  setAtomCharge(id, charge) {
    const atom = this.atoms.get(id);
    if (!atom) return;
    this.saveState();
    atom.charge = charge;
    this.updateValences();
    this.emit('change');
  }

  applyChargeToAtom(atom, mode = this.activeChargeMode) {
    if (!atom || !mode) return;
    if (mode === '+') {
      atom.charge = (atom.charge || 0) + 1;
      if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
        atom.label = null;
        atom.manualLabel = false;
      }
    } else if (mode === '-') {
      atom.charge = (atom.charge || 0) - 1;
      if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
        atom.label = null;
        atom.manualLabel = false;
      }
    } else if (mode === '0') {
      // "0" = volver a la carga automática (0 para un átomo normal, + para N con 4 enlaces...)
      atom.charge = atom.autoCharge || 0;
      atom.lonePairs = 0;
      if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
        atom.label = null;
        atom.manualLabel = false;
      }
    } else if (mode === 'lp') {
      if (!atom.lonePairs || atom.lonePairs === 0) {
        if (atom.element === 'N') atom.lonePairs = 1;
        else if (atom.element === 'O' || atom.element === 'S') atom.lonePairs = 2;
        else if (['F', 'Cl', 'Br', 'I'].includes(atom.element)) atom.lonePairs = 3;
        else atom.lonePairs = 1;
      } else if (atom.lonePairs >= 3) {
        atom.lonePairs = 0;
      } else {
        atom.lonePairs += 1;
      }
    }
  }

  toggleAtomLonePairs(id, count = null) {
    const atom = this.atoms.get(id);
    if (!atom) return;
    this.saveState();
    if (count !== null) {
      atom.lonePairs = count;
    } else {
      if (!atom.lonePairs || atom.lonePairs === 0) {
        if (atom.element === 'N') atom.lonePairs = 1;
        else if (atom.element === 'O' || atom.element === 'S') atom.lonePairs = 2;
        else if (['F', 'Cl', 'Br', 'I'].includes(atom.element)) atom.lonePairs = 3;
        else atom.lonePairs = 1;
      } else if (atom.lonePairs >= 3) {
        atom.lonePairs = 0;
      } else {
        atom.lonePairs += 1;
      }
    }
    this.emit('change');
  }

  removeAtom(id) {
    // Eliminar también enlaces conectados
    const bondsToRemove = [];
    for (const [bId, bond] of this.bonds.entries()) {
      if (bond.atom1 === id || bond.atom2 === id) {
        bondsToRemove.push(bId);
      }
    }
    for (const bId of bondsToRemove) {
      this.bonds.delete(bId);
    }
    this.atoms.delete(id);
    this.selected.atoms.delete(id);
    this.updateValences();
  }

  // --- Operaciones de Enlaces ---
  addBond(bond) {
    // Evitar enlaces duplicados entre los mismos dos átomos
    for (const existing of this.bonds.values()) {
      if ((existing.atom1 === bond.atom1 && existing.atom2 === bond.atom2) ||
          (existing.atom1 === bond.atom2 && existing.atom2 === bond.atom1)) {
        return existing;
      }
    }

    const id = bond.id || this.generateId('bond');
    const newBond = {
      id,
      atom1: bond.atom1,
      atom2: bond.atom2,
      type: bond.type || 'single', // 'single', 'double', 'triple', 'wedge', 'dash', 'wavy'
      isFront: bond.isFront || false,
      ...bond
    };
    this.bonds.set(id, newBond);
    this.updateValences();
    return newBond;
  }

  cycleBondType(bondId) {
    const bond = this.bonds.get(bondId);
    if (!bond) return;
    const cycle = ['single', 'double', 'triple', 'wedge', 'dash', 'dashed', 'wavy'];
    const nextIdx = (cycle.indexOf(bond.type) + 1) % cycle.length;
    bond.type = cycle[nextIdx];
    this.updateValences();
  }

  removeBond(id) {
    this.bonds.delete(id);
    this.selected.bonds.delete(id);
    this.updateValences();
  }

  // --- Flechas de Reacción ---
  addArrow(arrow) {
    const id = arrow.id || this.generateId('arrow');
    const newArrow = {
      id,
      x1: arrow.x1,
      y1: arrow.y1,
      x2: arrow.x2,
      y2: arrow.y2,
      type: arrow.type || 'normal', // 'normal', 'reversible', 'retrosynthetic'
      reagentsTop: arrow.reagentsTop || '',
      reagentsBottom: arrow.reagentsBottom || '',
      reagentsLeft: arrow.reagentsLeft || '',
      reagentsRight: arrow.reagentsRight || '',
      ...arrow
    };
    this.arrows.set(id, newArrow);
    return newArrow;
  }

  removeArrow(id) {
    this.arrows.delete(id);
    this.selected.arrows.delete(id);
  }

  // --- Cajas de Referencias (IChO Reference Box) ---
  addReferenceBox(box) {
    const id = box.id || this.generateId('refbox');
    const newBox = {
      id,
      boxType: box.boxType || 'reference',
      label: box.label || null,
      x: box.x,
      y: box.y,
      width: box.width || (box.boxType === 'compound' ? 140 : 480),
      height: box.height || (box.boxType === 'compound' ? 110 : 100),
      title: box.title || '',
      items: box.boxType === 'compound' ? (box.items || []) : (box.items || [
        { abbr: 'Ac', formula: 'H3C-C(=O)~' },
        { abbr: 'Bn', formula: 'PhCH2' },
        { abbr: 'DIBAL-H', formula: 'i-Bu2AlH' },
        { abbr: 'p-TsOH', formula: 'H3C-C6H4-SO3H' },
        { abbr: 'Py', formula: 'Piridina' }
      ]),
      ...box
    };
    this.referenceBoxes.set(id, newBox);
    return newBox;
  }

  removeReferenceBox(id) {
    this.referenceBoxes.delete(id);
    this.selected.boxes.delete(id);
  }

  // --- Etiquetas y Rótulos de Intermediarios (A, B, C...) ---
  addTextLabel(label) {
    const id = label.id || this.generateId('label');
    const newLabel = {
      id,
      x: label.x,
      y: label.y,
      text: label.text || 'A',
      fontSize: label.fontSize || 18,
      isIntermediary: label.isIntermediary !== undefined ? label.isIntermediary : true,
      ...label
    };
    this.textLabels.set(id, newLabel);
    return newLabel;
  }

  removeTextLabel(id) {
    this.textLabels.delete(id);
    this.selected.labels.delete(id);
  }

  // --- Limpieza y Selección ---
  clearSelection() {
    this.selected.atoms.clear();
    this.selected.bonds.clear();
    this.selected.arrows.clear();
    this.selected.labels.clear();
    this.selected.boxes.clear();
  }

  clearAll() {
    this.saveSnapshot();
    this.atoms.clear();
    this.bonds.clear();
    this.arrows.clear();
    this.referenceBoxes.clear();
    this.textLabels.clear();
    this.clearSelection();
    this.updateValences();
    this.emit('change');
  }

  /**
   * Revisa que un proyecto tenga la forma esperada ANTES de tocar el lienzo.
   * Lanza un Error con un mensaje legible si algo no cuadra.
   */
  static validateProjectData(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('El archivo no contiene un proyecto de Chem Studio.');
    }
    const lists = ['atoms', 'bonds', 'arrows', 'referenceBoxes', 'textLabels'];
    if (!lists.some(k => k in data)) {
      throw new Error('El archivo no contiene átomos, enlaces, flechas ni rótulos.');
    }
    for (const k of lists) {
      if (data[k] === undefined || data[k] === null) continue;
      if (!Array.isArray(data[k])) throw new Error(`"${k}" debe ser una lista.`);
      for (const item of data[k]) {
        if (!item || typeof item !== 'object' || item.id === undefined || item.id === null) {
          throw new Error(`Hay un elemento sin id en "${k}".`);
        }
      }
    }
    const num = (v) => typeof v === 'number' && Number.isFinite(v);
    const atomIds = new Set();
    for (const a of data.atoms || []) {
      if (!num(a.x) || !num(a.y)) throw new Error(`El átomo ${a.id} no tiene coordenadas válidas.`);
      atomIds.add(a.id);
    }
    for (const b of data.bonds || []) {
      if (!atomIds.has(b.atom1) || !atomIds.has(b.atom2)) {
        throw new Error(`El enlace ${b.id} apunta a un átomo que no existe.`);
      }
    }
    for (const arr of data.arrows || []) {
      if (![arr.x1, arr.y1, arr.x2, arr.y2].every(num)) throw new Error(`La flecha ${arr.id} no tiene coordenadas válidas.`);
    }
    for (const r of data.referenceBoxes || []) {
      if (![r.x, r.y].every(num)) throw new Error(`El recuadro ${r.id} no tiene coordenadas válidas.`);
    }
    for (const l of data.textLabels || []) {
      if (![l.x, l.y].every(num)) throw new Error(`El rótulo ${l.id} no tiene coordenadas válidas.`);
    }
  }

  loadFromObject(data, saveHistory = true) {
    // Validar primero: si el archivo está mal, el lienzo actual no se borra
    ChemState.validateProjectData(data);
    if (saveHistory) {
      this.saveSnapshot();
    }
    this.atoms.clear();
    this.bonds.clear();
    this.arrows.clear();
    this.referenceBoxes.clear();
    this.textLabels.clear();
    this.clearSelection();

    if (data.atoms) {
      for (const a of data.atoms) this.atoms.set(a.id, { ...a });
    }
    if (data.bonds) {
      for (const b of data.bonds) this.bonds.set(b.id, { ...b });
    }
    if (data.arrows) {
      for (const arr of data.arrows) this.arrows.set(arr.id, { ...arr });
    }
    if (data.referenceBoxes) {
      for (const r of data.referenceBoxes) this.referenceBoxes.set(r.id, { ...r });
    }
    if (data.textLabels) {
      for (const l of data.textLabels) this.textLabels.set(l.id, { ...l });
    }
    if (data.showCompoundBoxes !== undefined) {
      this.showCompoundBoxes = data.showCompoundBoxes;
    }

    this.updateValences();
  }
}
