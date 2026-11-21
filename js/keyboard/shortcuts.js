/**
 * shortcuts.js - Atajos de teclado de ChemStudio
 * 1. Si el cursor está sobre un ENLACE existente:
 *    - Al pulsar '1', cicla su orden: simple -> doble -> triple -> discontinuo -> simple.
 *    - Al pulsar '2', se convierte en doble.
 *    - Al pulsar '3', se convierte en triple.
 * 2. Si el cursor está sobre un ÁTOMO:
 *    - Al pulsar '1', brota un nuevo enlace C-C (CH3 -> Isopropilo -> Tert-butilo -> Texas Carbon en rojo).
 *    - Al pulsar O, N, S, P, F, Cl, Br, I, H, C, cambia el elemento químico.
 */

import { calculateNextBondAngle, pickChairGuide, STANDARD_BOND_LENGTH } from '../chem-engine/snapping.js';

export class ChemShortcuts {
  constructor(state, renderer, app) {
    this.state = state;
    this.renderer = renderer;
    this.app = app;
    this.initListeners();
  }

  initListeners() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    // Con cualquier ventana modal abierta (abreviaturas, molécula sobre flecha, tabla periódica...)
    // los atajos del lienzo principal se desactivan: si no, Supr/Ctrl+Z/teclas de elemento
    // modificarían también la pizarra principal que queda detrás.
    if (typeof document !== 'undefined' && typeof document.querySelector === 'function' &&
        document.querySelector('.modal-overlay')) {
      return;
    }

    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      return;
    }

    const key = e.key.toLowerCase();
    const isCtrl = e.ctrlKey || e.metaKey;

    // 1. Deshacer / Rehacer
    if (isCtrl && key === 'z') {
      e.preventDefault();
      if (e.shiftKey) this.state.redo();
      else this.state.undo();
      this.renderer.render();
      return;
    }

    if (isCtrl && key === 'y') {
      e.preventDefault();
      this.state.redo();
      this.renderer.render();
      return;
    }

    // 2. Eliminar selección
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      this.deleteSelected();
      return;
    }

    // Escape para cancelar modo continuo de carga
    if (e.key === 'Escape') {
      if (this.app && this.app.activeChargeMode) {
        this.app.setActiveChargeMode(null);
        return;
      }
    }

    // 3. Atajos sobre ENLACES (bajo hover o seleccionados)
    const targetBonds = this.getTargetBonds();
    if (targetBonds.length > 0) {
      if (this.handleBondShortcuts(key, targetBonds)) {
        e.preventDefault();
        return;
      }
    }

    // 4. Atajos sobre ÁTOMOS (bajo hover o seleccionados)
    // Para la tecla 'c': solo mutar átomo a Carbono si el cursor está directamente SOBRE el átomo (hoveredAtomId).
    // Si no está sobre un átomo, 'c' siempre activa o alterna la herramienta Silla / Giro de Silla.
    if (key === 'c' && !this.renderer.hoveredAtomId) {
      e.preventDefault();
      this.state.clearSelection();
      this.toggleChairTool();
      return;
    }

    // S (Seleccionar), B (Enlace) y G (Grupo) también son atajos de herramienta: sin el cursor
    // sobre un átomo cambian de herramienta en vez de convertir toda la selección en S/Br/grupo.
    const isToolKey = ['s', 'b', 'g'].includes(key) && !this.renderer.hoveredAtomId;
    const targetAtoms = isToolKey ? [] : this.getTargetAtoms();
    if (targetAtoms.length > 0) {
      if (this.handleAtomShortcuts(key, targetAtoms)) {
        e.preventDefault();
        return;
      }
    }

    // 5. Atajos de herramientas generales
    if (!isCtrl) {
      switch (key) {
        case 's':
        case 'v':
          this.app.selectTool('select');
          break;
        case 'b':
          this.app.selectTool('bond');
          break;
        case '4':
          this.app.selectTool('bond', 'dashed');
          break;
        case 'a':
          this.app.selectTool('arrow');
          break;
        case 'c':
          this.toggleChairTool();
          break;
        case 't':
          this.app.selectTool('text');
          break;
        case 'e':
          this.app.selectTool('eraser');
          break;
        case 'r':
          this.app.selectTool('reference');
          break;
        case 'g':
          const groupInput = (typeof document !== 'undefined' && typeof document.getElementById === 'function') ? document.getElementById('input-quick-group') : null;
          const groupText = (groupInput && groupInput.value.trim()) ? groupInput.value.trim() : 'OMs';
          if (this.app?.activateGroup) {
            this.app.activateGroup(groupText);
          }
          break;
      }
    }
  }

  toggleChairTool() {
    if (this.app.activeToolKey !== 'chair') {
      this.app.selectTool('chair', 'CHAIR_CYCLOHEXANE');
    } else {
      // Alternar conformación (Normal <-> Giro de Silla)
      const current = this.app.tools.chair.templateType;
      let next = 'CHAIR_FLIP';
      if (current === 'CHAIR_CYCLOHEXANE') {
        next = 'CHAIR_FLIP';
      } else if (current === 'CHAIR_FLIP') {
        next = 'CHAIR_CYCLOHEXANE';
      } else if (current === 'PYRANOSE_CHAIR') {
        next = 'PYRANOSE_CHAIR_FLIP';
      } else if (current === 'PYRANOSE_CHAIR_FLIP') {
        next = 'PYRANOSE_CHAIR';
      }
      this.app.selectTool('chair', next);
    }
  }

  getTargetBonds() {
    if (this.renderer.hoveredBondId) {
      const bond = this.state.bonds.get(this.renderer.hoveredBondId);
      if (bond) return [bond];
    }

    const selectedBonds = [];
    for (const id of this.state.selected.bonds) {
      const bond = this.state.bonds.get(id);
      if (bond) selectedBonds.push(bond);
    }
    return selectedBonds;
  }

  getTargetAtoms() {
    if (this.renderer.hoveredAtomId) {
      const atom = this.state.getAtom(this.renderer.hoveredAtomId);
      if (atom) return [atom];
    }

    const selectedAtoms = [];
    for (const id of this.state.selected.atoms) {
      const atom = this.state.getAtom(id);
      if (atom) selectedAtoms.push(atom);
    }
    return selectedAtoms;
  }

  handleBondShortcuts(key, bonds) {
    if (key === '1') {
      // Si se pulsa '1' sobre un enlace existente:
      // simple -> doble -> triple -> dashed -> simple
      this.state.saveSnapshot();
      for (const bond of bonds) {
        if (bond.type === 'single') {
          bond.type = 'double';
        } else if (bond.type === 'double') {
          bond.type = 'triple';
        } else if (bond.type === 'triple') {
          bond.type = 'dashed';
        } else {
          bond.type = 'single';
        }
      }
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    if (key === '2') {
      this.state.saveSnapshot();
      for (const bond of bonds) bond.type = 'double';
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    if (key === '3') {
      this.state.saveSnapshot();
      for (const bond of bonds) bond.type = 'triple';
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    if (key === '4') {
      this.state.saveSnapshot();
      for (const bond of bonds) bond.type = 'dashed';
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    return false;
  }

  handleAtomShortcuts(key, atoms) {
    // Si se pulsa '1' sobre un átomo: brotar nuevo enlace C-C (metilo -> isopropilo -> tert-butilo)
    if (key === '1') {
      this.state.saveSnapshot();
      for (const atom of atoms) {
        this.sproutCarbonBond(atom);
      }
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    // Si se pulsa 'g' sobre un átomo: cambiar elemento al grupo funcional o activarlo
    if (key === 'g') {
      const groupInput = (typeof document !== 'undefined' && typeof document.getElementById === 'function') ? document.getElementById('input-quick-group') : null;
      const groupText = (groupInput && groupInput.value.trim()) ? groupInput.value.trim() : 'OMs';
      if (this.app?.activateGroup) {
        this.app.activateGroup(groupText);
      }
      if (atoms.length > 0) {
        this.state.saveSnapshot();
        for (const atom of atoms) {
          atom.element = groupText;
          atom.label = groupText;
          atom.manualLabel = true;
          atom.isCustomLabel = true;
        }
        this.state.updateValences();
        this.renderer.render();
        if (this.app?.updateValenceStatus) this.app.updateValenceStatus();
      }
      return true;
    }

    // Cambiar a elemento químico (O, N, S, P, F, Cl, Br, I, H, C)
    let newElement = null;
    let newLabel = null;

    switch (key) {
      case 'c':
        newElement = 'C';
        newLabel = null;
        break;
      case 'o':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          if (atom.element === 'O') {
            if (atom.label === 'OH') atom.label = 'HO';
            else if (atom.label === 'HO') atom.label = 'O';
            else if (atom.label === 'O') atom.label = 'H2O';
            else {
              atom.label = null;
              atom.manualLabel = false;
            }
            if (atom.label) atom.manualLabel = true;
          } else {
            atom.element = 'O';
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case 'n':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          if (atom.element === 'N') {
            // Ciclar manualmente si se pulsa repetidamente
            if (atom.label === 'NH2') atom.label = 'H2N';
            else if (atom.label === 'H2N') atom.label = 'N';
            else if (atom.label === 'N') atom.label = 'NH3';
            else {
              atom.label = null;
              atom.manualLabel = false;
            }
            if (atom.label) atom.manualLabel = true;
          } else {
            atom.element = 'N';
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case 's':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          if (atom.element === 'S') {
            if (atom.label === 'SH') atom.label = 'HS';
            else if (atom.label === 'HS') atom.label = 'S';
            else if (atom.label === 'S') atom.label = 'H2S';
            else {
              atom.label = null;
              atom.manualLabel = false;
            }
            if (atom.label) atom.manualLabel = true;
          } else {
            atom.element = 'S';
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case 'p':
        newElement = 'P';
        newLabel = 'P';
        break;
      case 'f':
        newElement = 'F';
        newLabel = 'F';
        break;
      case 'l':
        newElement = 'Cl';
        newLabel = 'Cl';
        break;
      case 'b':
        newElement = 'Br';
        newLabel = 'Br';
        break;
      case 'i':
        newElement = 'I';
        newLabel = 'I';
        break;
      case 'h':
        newElement = 'H';
        newLabel = 'H';
        break;
      case 'k':
        newElement = 'Si';
        newLabel = 'Si';
        break;
      case '+':
      case '=':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          atom.charge = (atom.charge || 0) + 1;
          if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case '-':
      case '_':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          atom.charge = (atom.charge || 0) - 1;
          if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case '0':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          atom.charge = atom.autoCharge || 0; // volver a la carga automática
          atom.lonePairs = 0;
          if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case ':':
      case ';':
        this.state.saveSnapshot();
        for (const atom of atoms) {
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
        this.renderer.render();
        return true;
    }

    if (newElement) {
      this.state.saveSnapshot();
      for (const atom of atoms) {
        atom.element = newElement;
        atom.label = newLabel;
        atom.manualLabel = false;
      }
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    return false;
  }

  /**
   * Punto donde brota un enlace nuevo: guía axial/ecuatorial libre si es un vértice de silla,
   * si no, el ángulo químico óptimo a 38px.
   */
  getSproutPoint(atom) {
    const guide = pickChairGuide(atom, this.state);
    if (guide) return { x: guide.x, y: guide.y, depth: atom.depth };
    const rad = (calculateNextBondAngle(atom, this.state) * Math.PI) / 180;
    return {
      x: atom.x + STANDARD_BOND_LENGTH * Math.cos(rad),
      y: atom.y + STANDARD_BOND_LENGTH * Math.sin(rad),
      depth: atom.depth
    };
  }

  sproutCarbonBond(atom) {
    const p = this.getSproutPoint(atom);
    const newAtom = this.state.addAtom({
      x: p.x,
      y: p.y,
      element: 'C',
      label: null,
      ...(typeof p.depth === 'number' ? { depth: p.depth } : {})
    });

    this.state.addBond({
      atom1: atom.id,
      atom2: newAtom.id,
      type: 'single'
    });
  }

  sproutGroupBond(atom, groupText = 'OMs') {
    const p = this.getSproutPoint(atom);

    const cleanGroup = String(groupText).trim() || 'OMs';
    const newAtom = this.state.addAtom({
      ...(typeof p.depth === 'number' ? { depth: p.depth } : {}),
      x: p.x,
      y: p.y,
      element: cleanGroup,
      label: cleanGroup,
      manualLabel: true
    });

    this.state.addBond({
      atom1: atom.id,
      atom2: newAtom.id,
      type: 'single'
    });

    return newAtom;
  }

  deleteSelected() {
    const sel = this.state.selected;
    const hasSelection = ['atoms', 'bonds', 'arrows', 'labels', 'boxes'].some(k => sel[k] && sel[k].size > 0);
    if (!hasSelection) return; // sin selección no se guarda un paso vacío en Deshacer
    this.state.saveSnapshot();

    for (const id of Array.from(this.state.selected.atoms)) this.state.removeAtom(id);
    for (const id of Array.from(this.state.selected.bonds)) this.state.removeBond(id);
    for (const id of Array.from(this.state.selected.arrows)) this.state.removeArrow(id);
    for (const id of Array.from(this.state.selected.labels)) this.state.removeTextLabel(id);
    for (const id of Array.from(this.state.selected.boxes)) this.state.removeReferenceBox(id);

    this.state.clearSelection();
    this.renderer.render();
    this.app.updateValenceStatus();
  }
}
