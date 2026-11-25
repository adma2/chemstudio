/**
 * bond-tool.js - Herramienta interactiva para trazado y ciclado de enlaces químicos
 * Reglas:
 * 1. Los enlaces tienen LONGITUD ESTRICTAMENTE FIJA (38px). No se pueden estirar indefinidamente.
 * 2. Clic en enlace existente cicla su tipo (simple -> doble -> triple -> cuña -> trazos -> ondulado).
 * 3. Clic simple en átomo brota un nuevo enlace de longitud 38px en el ángulo natural más libre (120°).
 * 4. Arrastre desde un átomo rota el enlace en círculo de radio 38px ajustándose a múltiplos de 30°,
 *    o conecta directamente a otro átomo si el cursor está cerca de él.
 */

import { regularizeClosedRing } from '../chem-engine/ring-geometry.js';
import { snapBond, calculateNextBondAngle, findNearestAnchor, pickChairGuide, STANDARD_BOND_LENGTH } from '../chem-engine/snapping.js';

export class BondTool {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.isDragging = false;
    this.dragStartAtom = null;
    this.dragStartPos = null;
    this.hasMovedSignificantly = false;
  }

  onMouseDown(e, canvasPos, targetInfo) {
    // 1. Clic en enlace existente: ciclar tipo de enlace inmediatamente
    if (targetInfo && targetInfo.type === 'bond') {
      this.state.saveSnapshot();
      this.state.cycleBondType(targetInfo.id);
      this.renderer.render();
      return;
    }

    // 2. Clic en átomo existente
    if (targetInfo && targetInfo.type === 'atom') {
      this.isDragging = true;
      this.hasMovedSignificantly = false;
      this.wasExistingAtom = true;
      this.dragStartAtom = this.state.getAtom(targetInfo.id);
      this.dragStartPos = { x: this.dragStartAtom.x, y: this.dragStartAtom.y };
      return;
    }

    // 3. Clic en espacio vacío: crear átomo inicial (ej. H2O o NH3 libre)
    this.state.saveSnapshot();
    const newAtom = this.state.addAtom({
      x: canvasPos.x,
      y: canvasPos.y,
      element: this.state.activeElement || 'C'
    });
    this.isDragging = true;
    this.hasMovedSignificantly = false;
    this.wasExistingAtom = false;
    this.dragStartAtom = newAtom;
    this.dragStartPos = { x: canvasPos.x, y: canvasPos.y };
    this.renderer.render();
  }

  onMouseMove(e, canvasPos, targetInfo) {
    if (!this.isDragging || !this.dragStartAtom) return;

    const rawDist = Math.hypot(canvasPos.x - this.dragStartPos.x, canvasPos.y - this.dragStartPos.y);
    if (rawDist > 6) {
      this.hasMovedSignificantly = true;
    }

    let targetX = canvasPos.x;
    let targetY = canvasPos.y;

    // Verificar si el cursor está cerca de otro átomo existente para unirlo
    const anchor = this.findDragAnchor(canvasPos);
    if (anchor && anchor.type === 'atom') {
      targetX = anchor.x;
      targetY = anchor.y;
    } else {
      const end = this.getDragEnd(canvasPos);
      targetX = end.x;
      targetY = end.y;
    }

    // Previsualizar enlace con radio estrictamente fijo de 38px
    this.updatePreview(this.dragStartPos.x, this.dragStartPos.y, targetX, targetY);
  }

  onMouseUp(e, canvasPos, targetInfo) {
    if (!this.isDragging || !this.dragStartAtom) {
      this.clearPreview();
      return;
    }

    this.clearPreview();

    // Caso A: Si fue solo un clic sobre un átomo existente -> Sustituir o Brotar
    // Si fue un clic en espacio vacío -> Se queda el átomo libre (ej. H2O o NH3)
    if (!this.hasMovedSignificantly) {
      if (this.wasExistingAtom && this.dragStartAtom) {
        // Si hay un modo de carga activo ('+', '-', '0', 'lp'), aplicarlo directamente al átomo
        if (this.state.activeChargeMode) {
          this.state.saveSnapshot();
          this.state.applyChargeToAtom(this.dragStartAtom, this.state.activeChargeMode);
          this.isDragging = false;
          this.dragStartAtom = null;
          this.state.updateValences();
          this.renderer.render();
          return;
        }

        const activeElem = (this.state.activeElement || 'C').trim();
        const curElem = (this.dragStartAtom.element || 'C').trim();

        if (activeElem !== curElem) {
          // Sustituir el átomo existente por el elemento o grupo activo
          this.state.saveSnapshot();
          this.dragStartAtom.element = activeElem;
          this.dragStartAtom.label = (activeElem === 'C') ? null : activeElem;
          this.dragStartAtom.manualLabel = (activeElem !== 'C');
          this.dragStartAtom.isCustomLabel = (activeElem !== 'C');
          this.isDragging = false;
          this.dragStartAtom = null;
          this.state.updateValences();
          this.renderer.render();
          return;
        }

        // Si el elemento activo coincide con el elemento actual:
        if (activeElem === 'C') {
          // Clic sobre C cuando C está activo: brotar nuevo enlace automáticamente
          this.sproutAutomaticBond(this.dragStartAtom);
        } else if (activeElem === 'N') {
          this.state.saveSnapshot();
          if (this.dragStartAtom.label === 'NH2') this.dragStartAtom.label = 'H2N';
          else if (this.dragStartAtom.label === 'H2N') this.dragStartAtom.label = 'N';
          else this.dragStartAtom.label = 'NH2';
          this.dragStartAtom.manualLabel = true;
        } else if (activeElem === 'O') {
          this.state.saveSnapshot();
          if (this.dragStartAtom.label === 'OH') this.dragStartAtom.label = 'HO';
          else if (this.dragStartAtom.label === 'HO') this.dragStartAtom.label = 'O';
          else this.dragStartAtom.label = 'OH';
          this.dragStartAtom.manualLabel = true;
        } else if (activeElem === 'S') {
          this.state.saveSnapshot();
          if (this.dragStartAtom.label === 'SH') this.dragStartAtom.label = 'HS';
          else if (this.dragStartAtom.label === 'HS') this.dragStartAtom.label = 'S';
          else this.dragStartAtom.label = 'SH';
          this.dragStartAtom.manualLabel = true;
        }
      }
      this.isDragging = false;
      this.dragStartAtom = null;
      this.state.updateValences();
      this.renderer.render();
      return;
    }

    this.state.saveSnapshot();

    // Caso B: Arrastre a un átomo existente cercano
    const anchor = this.findDragAnchor(canvasPos);
    let endAtom;

    if (anchor && anchor.type === 'atom') {
      endAtom = anchor.target;
    } else {
      // Crear nuevo átomo: en la guía axial/ecuatorial si sale de una silla, si no a 38px con snapping
      const end = this.getDragEnd(canvasPos);
      endAtom = this.state.addAtom({
        x: end.x,
        y: end.y,
        element: this.state.activeElement || 'C',
        ...this.depthFrom(this.dragStartAtom)
      });
    }

    // Conectar enlace
    this.state.addBond({
      atom1: this.dragStartAtom.id,
      atom2: endAtom.id,
      type: this.state.bondType || 'single'
    });

    // Si el enlace cierra un anillo de 5 o 7, dejarlo regular
    if (anchor && anchor.type === 'atom' && regularizeClosedRing(this.dragStartAtom.id, endAtom.id, this.state)) {
      this.state.updateValences();
    }

    this.isDragging = false;
    this.dragStartAtom = null;
    this.renderer.render();
  }

  /**
   * Brota un enlace automático a 38px en el ángulo químico óptimo al hacer clic en un átomo
   */
  sproutAutomaticBond(atom) {
    this.state.saveSnapshot();
    let newX, newY;
    const guide = pickChairGuide(atom, this.state);
    if (guide) {
      // Vértice de silla: brotar en la guía axial (o ecuatorial si la axial ya está ocupada)
      newX = guide.x;
      newY = guide.y;
    } else {
      const angleDeg = calculateNextBondAngle(atom, this.state);
      const rad = (angleDeg * Math.PI) / 180;
      newX = atom.x + STANDARD_BOND_LENGTH * Math.cos(rad);
      newY = atom.y + STANDARD_BOND_LENGTH * Math.sin(rad);
    }

    const newAtom = this.state.addAtom({
      x: newX,
      y: newY,
      element: this.state.activeElement || 'C',
      ...this.depthFrom(atom)
    });

    this.state.addBond({
      atom1: atom.id,
      atom2: newAtom.id,
      type: this.state.bondType || 'single'
    });

    this.renderer.render();
  }

  /**
   * Extremo del enlace arrastrado: si sale de un vértice de silla y el cursor apunta
   * cerca de una guía libre (axial/ecuatorial), se ajusta a ella; si no, 38px con snapping a 30°.
   */
  getDragEnd(canvasPos) {
    const guide = pickChairGuide(this.dragStartAtom, this.state, canvasPos);
    if (guide) return { x: guide.x, y: guide.y };
    return snapBond(this.dragStartPos.x, this.dragStartPos.y, canvasPos.x, canvasPos.y, STANDARD_BOND_LENGTH);
  }

  /**
   * Átomo existente al que se uniría el enlace arrastrado. Si el enlace sigue una guía de silla,
   * solo cuenta un átomo que esté justo en el extremo de la guía (no lo que haya bajo el cursor),
   * para no unir por error el carbono con un sustituyente vecino.
   */
  findDragAnchor(canvasPos) {
    const guide = pickChairGuide(this.dragStartAtom, this.state, canvasPos);
    if (guide) return findNearestAnchor(guide.x, guide.y, this.state, this.dragStartAtom.id, 4);
    return findNearestAnchor(canvasPos.x, canvasPos.y, this.state, this.dragStartAtom.id, 12);
  }

  /** El sustituyente hereda la profundidad del átomo de silla (para los huecos en cruces) */
  depthFrom(atom) {
    return atom && typeof atom.depth === 'number' ? { depth: atom.depth } : {};
  }

  updatePreview(x1, y1, x2, y2) {
    if (!this.renderer || !this.renderer.svg) return;
    const root = this.renderer.svg.querySelector('#canvas-root') || this.renderer.svg;
    let preview = this.renderer.svg.querySelector('.bond-drawing-preview');
    if (!preview) {
      preview = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      preview.setAttribute('class', 'bond-drawing-preview');
      preview.setAttribute('stroke', '#3b82f6');
      preview.setAttribute('stroke-width', '2.4');
      preview.setAttribute('stroke-dasharray', '4 3');
      preview.setAttribute('pointer-events', 'none');
      if (root) root.appendChild(preview);
    }
    preview.setAttribute('x1', x1);
    preview.setAttribute('y1', y1);
    preview.setAttribute('x2', x2);
    preview.setAttribute('y2', y2);
  }

  clearPreview() {
    if (!this.renderer || !this.renderer.svg) return;
    const preview = this.renderer.svg.querySelector('.bond-drawing-preview');
    if (preview && preview.parentNode) {
      preview.parentNode.removeChild(preview);
    }
  }
}
