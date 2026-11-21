/**
 * eraser-tool.js - Borrador de elementos químicos con detección de proximidad y arrastre fluido
 */

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

export class EraserTool {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.isMouseDown = false;
  }

  onMouseDown(e, canvasPos, targetInfo) {
    this.isMouseDown = true;
    this.eraseUnderCursor(canvasPos, targetInfo);
  }

  onMouseMove(e, canvasPos, targetInfo) {
    if (this.isMouseDown && (e.buttons === 1 || e.which === 1)) {
      this.eraseUnderCursor(canvasPos, targetInfo);
    }
  }

  onMouseUp(e, canvasPos, targetInfo) {
    this.isMouseDown = false;
  }

  eraseUnderCursor(canvasPos, targetInfo) {
    let target = targetInfo;

    // Si no hay targetInfo directo de SVG, buscar por proximidad geométrica
    if ((!target || !target.id) && canvasPos) {
      // 1. Proximidad a átomos (radio 16px)
      for (const atom of this.state.atoms.values()) {
        if (Math.hypot(atom.x - canvasPos.x, atom.y - canvasPos.y) <= 16) {
          target = { type: 'atom', id: atom.id };
          break;
        }
      }

      // 2. Proximidad a enlaces (distancia 12px)
      if (!target) {
        for (const bond of this.state.bonds.values()) {
          const a1 = this.state.getAtom(bond.atom1);
          const a2 = this.state.getAtom(bond.atom2);
          if (!a1 || !a2) continue;
          if (distToSegment(canvasPos.x, canvasPos.y, a1.x, a1.y, a2.x, a2.y) <= 12) {
            target = { type: 'bond', id: bond.id };
            break;
          }
        }
      }

      // 3. Proximidad a flechas (distancia 14px)
      if (!target) {
        for (const arrow of this.state.arrows.values()) {
          if (distToSegment(canvasPos.x, canvasPos.y, arrow.x1, arrow.y1, arrow.x2, arrow.y2) <= 14) {
            target = { type: 'arrow', id: arrow.id };
            break;
          }
        }
      }
    }

    if (!target || !target.id) return;

    this.state.saveSnapshot();

    switch (target.type) {
      case 'atom':
        this.state.removeAtom(target.id);
        break;
      case 'bond':
        this.state.removeBond(target.id);
        break;
      case 'arrow':
        this.state.removeArrow(target.id);
        break;
      case 'box':
        this.state.removeReferenceBox(target.id);
        break;
      case 'label':
        this.state.removeTextLabel(target.id);
        break;
    }

    this.renderer.render();
  }
}
