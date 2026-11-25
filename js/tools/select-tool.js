/**
 * select-tool.js - Herramienta de selección múltiple, desplazamiento y redimensionamiento
 */

import { ProblemBuilder } from '../chem-engine/problem-builder.js';

export class SelectTool {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.isDragging = false;
    this.dragStartPos = null;
    this.initialPositions = new Map();
    this.isMarqueeSelecting = false;
    this.activeResizeBox = null;
  }

  onMouseDown(e, canvasPos, targetInfo) {
    // 0. Tirador de rotación (↻) de la selección: gira los átomos seleccionados alrededor de su centro
    if (targetInfo && targetInfo.isRotateHandle) {
      const atoms = Array.from(this.state.selected.atoms).map(id => this.state.getAtom(id)).filter(Boolean);
      if (atoms.length >= 2) {
        this.state.saveSnapshot();
        const cx = atoms.reduce((s, a) => s + a.x, 0) / atoms.length;
        const cy = atoms.reduce((s, a) => s + a.y, 0) / atoms.length;
        this.rotation = {
          cx, cy,
          startAngle: Math.atan2(canvasPos.y - cy, canvasPos.x - cx),
          initial: new Map(atoms.map(a => [a.id, { x: a.x, y: a.y }]))
        };
      }
      return;
    }

    // 1. Si se hace clic en el tirador de redimensionado de una caja de referencias
    if (targetInfo && targetInfo.isBoxResizeHandle) {
      this.activeResizeBox = this.state.referenceBoxes.get(targetInfo.boxId);
      this.isDragging = true;
      this.dragStartPos = { x: canvasPos.x, y: canvasPos.y };
      return;
    }

    // 2. Si se hace clic sobre un elemento existente. Si forma parte de la selección actual
    //    (p. ej. un enlace de una molécula seleccionada con el recuadro, o el recuadro de
    //    compuesto que la contiene), se arrastra toda la selección en vez de reemplazarla.
    if (targetInfo && targetInfo.id) {
      if (!e.shiftKey && this.isPartOfSelection(targetInfo, canvasPos)) {
        if (targetInfo.type === 'box') this.state.selected.boxes.add(targetInfo.id);
      } else {
        this.handleElementClick(targetInfo, e.shiftKey);
      }
      this.startDrag(canvasPos);
      return;
    }

    // 3. Clic en espacio libre dentro de la selección: arrastrarla
    if (!e.shiftKey && this.isInsideSelectionBounds(canvasPos)) {
      this.startDrag(canvasPos);
      return;
    }

    // 4. Clic en espacio libre
    if (!e.shiftKey) {
      this.state.clearSelection();
    }
    this.isMarqueeSelecting = true;
    this.dragStartPos = { x: canvasPos.x, y: canvasPos.y };
    this.renderer.render();
  }

  onMouseMove(e, canvasPos, targetInfo) {
    if (this.rotation) {
      const r = this.rotation;
      let angle = Math.atan2(canvasPos.y - r.cy, canvasPos.x - r.cx) - r.startAngle;
      if (e && e.shiftKey) {
        const step = Math.PI / 12; // Shift: saltos de 15°
        angle = Math.round(angle / step) * step;
      }
      const cos = Math.cos(angle), sin = Math.sin(angle);
      for (const [id, p] of r.initial) {
        const a = this.state.getAtom(id);
        if (!a) continue;
        const dx = p.x - r.cx, dy = p.y - r.cy;
        a.x = r.cx + dx * cos - dy * sin;
        a.y = r.cy + dx * sin + dy * cos;
      }
      this.renderer.rotationAngleDeg = Math.round((angle * 180) / Math.PI);
      this.renderer.render();
      return;
    }

    if (!this.isDragging && !this.isMarqueeSelecting) return;

    if (this.activeResizeBox) {
      const dx = canvasPos.x - this.dragStartPos.x;
      const dy = canvasPos.y - this.dragStartPos.y;
      this.activeResizeBox.width = Math.max(120, this.activeResizeBox.width + dx);
      this.activeResizeBox.height = Math.max(50, this.activeResizeBox.height + dy);
      this.activeResizeBox.userSized = true; // tamaño elegido a mano: no compactarlo automáticamente
      this.dragStartPos = { x: canvasPos.x, y: canvasPos.y };
      this.renderer.render();
      return;
    }

    if (this.isDragging && this.dragStartPos) {
      const dx = canvasPos.x - this.dragStartPos.x;
      const dy = canvasPos.y - this.dragStartPos.y;

      // Desplazar átomos seleccionados
      for (const [id, pos] of this.initialPositions.get('atoms').entries()) {
        const atom = this.state.getAtom(id);
        if (atom) {
          atom.x = pos.x + dx;
          atom.y = pos.y + dy;
        }
      }

      // Desplazar flechas seleccionadas
      for (const [id, pos] of this.initialPositions.get('arrows').entries()) {
        const arrow = this.state.arrows.get(id);
        if (arrow) {
          arrow.x1 = pos.x1 + dx;
          arrow.y1 = pos.y1 + dy;
          arrow.x2 = pos.x2 + dx;
          arrow.y2 = pos.y2 + dy;
        }
      }

      // Desplazar rótulos seleccionados
      for (const [id, pos] of this.initialPositions.get('labels').entries()) {
        const label = this.state.textLabels.get(id);
        if (label) {
          label.x = pos.x + dx;
          label.y = pos.y + dy;
        }
      }

      // Desplazar cajas de referencias seleccionadas
      for (const [id, pos] of this.initialPositions.get('boxes').entries()) {
        const box = this.state.referenceBoxes.get(id);
        if (box) {
          box.x = pos.x + dx;
          box.y = pos.y + dy;
        }
      }

      this.renderer.render();
      return;
    }

    if (this.isMarqueeSelecting && this.dragStartPos) {
      this.updateMarqueePreview(this.dragStartPos.x, this.dragStartPos.y, canvasPos.x, canvasPos.y);
    }
  }

  onMouseUp(e, canvasPos, targetInfo) {
    if (this.rotation) {
      this.rotation = null;
      this.renderer.rotationAngleDeg = null;
      this.state.updateValences();
      this.renderer.render();
      return;
    }

    if (this.isDragging) {
      // Deshacer debe volver a la posición de antes del arrastre (solo si algo se movió)
      if (this.preDragSnapshot && this.state.makeSnapshot() !== this.preDragSnapshot) {
        this.state.saveSnapshot(this.preDragSnapshot);
      }
      this.preDragSnapshot = null;
      this.isDragging = false;
      this.dragStartPos = null;
      this.activeResizeBox = null;
      this.renderer.render();
    }

    if (this.isMarqueeSelecting) {
      this.clearMarqueePreview();
      this.finishMarqueeSelection(this.dragStartPos, canvasPos);
      this.isMarqueeSelecting = false;
      this.dragStartPos = null;
      this.renderer.render();
    }
  }

  handleElementClick(targetInfo, isShift) {
    const sel = this.state.selected;
    const typeMap = {
      atom: sel.atoms,
      bond: sel.bonds,
      arrow: sel.arrows,
      label: sel.labels,
      box: sel.boxes
    };

    const targetSet = typeMap[targetInfo.type];
    if (!targetSet) return;

    if (targetInfo.type === 'atom' && this.state.activeChargeMode) {
      const atom = this.state.getAtom(targetInfo.id);
      if (atom) {
        this.state.saveSnapshot();
        this.state.applyChargeToAtom(atom, this.state.activeChargeMode);
        this.state.updateValences();
      }
    }

    if (isShift) {
      if (targetSet.has(targetInfo.id)) {
        targetSet.delete(targetInfo.id);
      } else {
        targetSet.add(targetInfo.id);
      }
    } else {
      if (!targetSet.has(targetInfo.id)) {
        this.state.clearSelection();
        targetSet.add(targetInfo.id);
      }
    }
  }

  startDrag(canvasPos) {
    this.preDragSnapshot = this.state.makeSnapshot();
    this.isDragging = true;
    this.dragStartPos = { x: canvasPos.x, y: canvasPos.y };
    this.recordInitialPositions();
    this.renderer.render();
  }

  /** Rectángulo que rodea los átomos, flechas y rótulos seleccionados (null si no hay) */
  getSelectionBounds() {
    const sel = this.state.selected;
    const xs = [], ys = [];
    for (const id of sel.atoms) {
      const a = this.state.getAtom(id);
      if (a) { xs.push(a.x); ys.push(a.y); }
    }
    for (const id of sel.arrows) {
      const a = this.state.arrows.get(id);
      if (a) { xs.push(a.x1, a.x2); ys.push(a.y1, a.y2); }
    }
    for (const id of sel.labels) {
      const l = this.state.textLabels.get(id);
      if (l) { xs.push(l.x); ys.push(l.y); }
    }
    if (xs.length === 0) return null;
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  }

  /** ¿El punto cae sobre la zona de la selección? (margen para etiquetas como OH o Br) */
  isInsideSelectionBounds(pos, margin = 15) {
    const b = this.getSelectionBounds();
    if (!b) return false;
    return pos.x >= b.minX - margin && pos.x <= b.maxX + margin &&
           pos.y >= b.minY - margin && pos.y <= b.maxY + margin;
  }

  /** ¿El elemento clicado pertenece a la selección actual, de modo que hay que arrastrarla entera? */
  isPartOfSelection(targetInfo, pos) {
    const sel = this.state.selected;
    if (targetInfo.type === 'bond') {
      const b = this.state.bonds.get(targetInfo.id);
      return Boolean(b && sel.atoms.has(b.atom1) && sel.atoms.has(b.atom2));
    }
    if (targetInfo.type === 'box') {
      const box = this.state.referenceBoxes.get(targetInfo.id);
      return Boolean(box && box.boxType === 'compound' && this.isInsideSelectionBounds(pos));
    }
    return false;
  }

  recordInitialPositions() {
    this.initialPositions = new Map([
      ['atoms', new Map()],
      ['arrows', new Map()],
      ['labels', new Map()],
      ['boxes', new Map()]
    ]);

    // Átomos que se mueven: los seleccionados, los extremos de los enlaces seleccionados
    // y la molécula que contiene cada recuadro de compuesto seleccionado
    const atomIds = new Set(this.state.selected.atoms);
    for (const id of this.state.selected.bonds) {
      const b = this.state.bonds.get(id);
      if (b) { atomIds.add(b.atom1); atomIds.add(b.atom2); }
    }
    for (const id of this.state.selected.boxes) {
      const box = this.state.referenceBoxes.get(id);
      if (box && box.boxType === 'compound') {
        for (const a of ProblemBuilder.getAtomsInsideBox(box, this.state)) atomIds.add(a.id);
      }
    }
    for (const id of atomIds) {
      const a = this.state.getAtom(id);
      if (a) this.initialPositions.get('atoms').set(id, { x: a.x, y: a.y });
    }

    for (const id of this.state.selected.arrows) {
      const arr = this.state.arrows.get(id);
      if (arr) this.initialPositions.get('arrows').set(id, { x1: arr.x1, y1: arr.y1, x2: arr.x2, y2: arr.y2 });
    }

    for (const id of this.state.selected.labels) {
      const l = this.state.textLabels.get(id);
      if (l) this.initialPositions.get('labels').set(id, { x: l.x, y: l.y });
    }

    for (const id of this.state.selected.boxes) {
      const b = this.state.referenceBoxes.get(id);
      if (b) this.initialPositions.get('boxes').set(id, { x: b.x, y: b.y });
    }
  }

  updateMarqueePreview(x1, y1, x2, y2) {
    if (!this.renderer || !this.renderer.svg) return;
    const root = this.renderer.svg.querySelector('#canvas-root') || this.renderer.svg;
    let preview = this.renderer.svg.querySelector('.marquee-selection-preview');
    if (!preview) {
      preview = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      preview.setAttribute('class', 'marquee-selection-preview');
      preview.setAttribute('fill', '#3b82f6');
      preview.setAttribute('fill-opacity', '0.15');
      preview.setAttribute('stroke', '#2563eb');
      preview.setAttribute('stroke-width', '1');
      preview.setAttribute('stroke-dasharray', '4 4');
      preview.setAttribute('pointer-events', 'none');
      if (root) root.appendChild(preview);
    }
    const minX = Math.min(x1, x2), minY = Math.min(y1, y2);
    const w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
    preview.setAttribute('x', minX);
    preview.setAttribute('y', minY);
    preview.setAttribute('width', w);
    preview.setAttribute('height', h);
  }

  clearMarqueePreview() {
    if (!this.renderer || !this.renderer.svg) return;
    const preview = this.renderer.svg.querySelector('.marquee-selection-preview');
    if (preview && preview.parentNode) {
      preview.parentNode.removeChild(preview);
    }
  }

  finishMarqueeSelection(start, end) {
    if (!start || !end) return;
    const minX = Math.min(start.x, end.x), maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y), maxY = Math.max(start.y, end.y);

    if (maxX - minX < 5 && maxY - minY < 5) return;

    const newlySelectedAtoms = [];
    for (const atom of this.state.atoms.values()) {
      if (atom.x >= minX && atom.x <= maxX && atom.y >= minY && atom.y <= maxY) {
        this.state.selected.atoms.add(atom.id);
        newlySelectedAtoms.push(atom);
      }
    }
    if (this.state.activeChargeMode && newlySelectedAtoms.length > 0) {
      this.state.saveSnapshot();
      for (const a of newlySelectedAtoms) {
        this.state.applyChargeToAtom(a, this.state.activeChargeMode);
      }
      this.state.updateValences();
    }
    for (const arrow of this.state.arrows.values()) {
      const mx = (arrow.x1 + arrow.x2) / 2;
      const my = (arrow.y1 + arrow.y2) / 2;
      if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
        this.state.selected.arrows.add(arrow.id);
      }
    }
    for (const label of this.state.textLabels.values()) {
      if (label.x >= minX && label.x <= maxX && label.y >= minY && label.y <= maxY) {
        this.state.selected.labels.add(label.id);
      }
    }
    // Recuadros de abreviaturas: se seleccionan si el recuadro de selección toca cualquier parte de ellos
    for (const box of this.state.referenceBoxes.values()) {
      const bx2 = box.x + box.width, by2 = box.y + box.height;
      if (box.boxType === 'compound') {
        // Incógnitas (letras): basta con que su centro quede dentro. Recuadros con molécula: si quedan
        // enteros dentro o, con los recuadros ocultos, si se seleccionó toda su molécula.
        const atoms = ProblemBuilder.getAtomsInsideBox(box, this.state);
        const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
        const inside = atoms.length === 0
          ? cx >= minX && cx <= maxX && cy >= minY && cy <= maxY
          : (box.x >= minX && bx2 <= maxX && box.y >= minY && by2 <= maxY) ||
            (!this.state.showCompoundBoxes && atoms.every(a => this.state.selected.atoms.has(a.id)));
        if (inside) this.state.selected.boxes.add(box.id);
        continue;
      }
      if (box.x <= maxX && bx2 >= minX && box.y <= maxY && by2 >= minY) {
        this.state.selected.boxes.add(box.id);
      }
    }
  }
}
