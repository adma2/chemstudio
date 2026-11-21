/**
 * chair-tool.js - Herramienta especializada para conformaciones de silla de ciclohexano y piranosas
 * Permite insertar sillas y agregar sustituyentes axiales y ecuatoriales con un solo clic.
 */

import { RING_TEMPLATES } from '../chem-engine/templates.js';
import { getFreeChairGuides } from '../chem-engine/snapping.js';

export class ChairTool {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.templateType = 'CHAIR_CYCLOHEXANE'; // 'CHAIR_CYCLOHEXANE' o 'PYRANOSE_CHAIR'
    this.defaultSubstituent = 'OH';
  }

  onMouseDown(e, canvasPos, targetInfo) {
    // 1. Si se hace clic en un punto guía de sustituyente axial o ecuatorial
    if (targetInfo && targetInfo.isGuideDot) {
      this.addSubstituentFromGuide(targetInfo.atomId, targetInfo.guideType);
      return;
    }

    // 2. Si se hace clic sobre un átomo de silla existente: mostrar menú rápido o alternar
    if (targetInfo && targetInfo.type === 'atom') {
      const atom = this.state.getAtom(targetInfo.id);
      if (atom && atom.chairVertex) {
        // Añadir por defecto sustituyente axial si no lo tiene, o ecuatorial
        this.addSmartSubstituent(atom);
        return;
      }
    }

    // 3. Clic en espacio libre: insertar la conformación de silla completa
    this.insertChairAt(canvasPos.x, canvasPos.y, this.templateType);
  }

  onMouseMove(e, canvasPos, targetInfo) {
    // Si el cursor pasa por un átomo de silla, actualizar el renderer para mostrar las guías
    if (targetInfo && targetInfo.type === 'atom') {
      const atom = this.state.getAtom(targetInfo.id);
      if (atom && atom.chairVertex) {
        this.renderer.hoveredAtomId = atom.id;
        this.renderer.render();
        return;
      }
    }
  }

  onMouseUp(e, canvasPos, targetInfo) {}

  /**
   * Inserta una conformación de silla en las coordenadas indicadas
   */
  insertChairAt(cx, cy, templateKey = 'CHAIR_CYCLOHEXANE') {
    this.state.saveSnapshot();
    const tpl = RING_TEMPLATES[templateKey] || RING_TEMPLATES.CHAIR_CYCLOHEXANE;
    const chairId = this.state.generateId('chair');

    const createdAtoms = new Map();

    // Crear los 6 átomos del anillo
    for (const a of tpl.ringAtoms) {
      const guides = tpl.substituents ? tpl.substituents[a.id] : null;
      const newAtom = this.state.addAtom({
        x: cx + a.x,
        y: cy + a.y,
        element: a.element || 'C',
        label: a.label || null,
        chairId: chairId,
        chairVertex: a.id,
        depth: a.depth !== undefined ? a.depth : 0,
        substituentGuides: guides
      });
      createdAtoms.set(a.id, newAtom);
    }

    // Crear los enlaces del anillo
    for (const b of tpl.ringBonds) {
      const a1 = createdAtoms.get(b.a1);
      const a2 = createdAtoms.get(b.a2);
      if (a1 && a2) {
        this.state.addBond({
          atom1: a1.id,
          atom2: a2.id,
          type: b.type || 'single',
          isFront: b.isFront || false,
          ...(b.wedgeWidth ? { wedgeWidth: b.wedgeWidth } : {}),
          ...(b.boldWidth ? { boldWidth: b.boldWidth } : {})
        });
      }
    }

    this.renderer.render();
  }

  /**
   * Añade un sustituyente en posición axial o ecuatorial a partir de una guía
   */
  addSubstituentFromGuide(atomId, positionType, substituentLabel = null) {
    const parentAtom = this.state.getAtom(atomId);
    if (!parentAtom || !parentAtom.substituentGuides) return;

    const guide = parentAtom.substituentGuides[positionType];
    if (!guide) return;

    this.state.saveSnapshot();

    const subX = parentAtom.x + guide.dx;
    const subY = parentAtom.y + guide.dy;
    let label = substituentLabel;
    if (!label) {
      if (this.state.activeElement && this.state.activeElement !== 'C') {
        label = this.state.activeElement === 'O' ? 'OH' : this.state.activeElement;
      } else {
        label = guide.defaultGroup || this.defaultSubstituent;
      }
    }

    // Determinar elemento principal del sustituyente (ej. 'OH' -> O, 'H' -> H, 'N' -> N, 'Cl' -> Cl)
    let element = 'C';
    if (label === 'H') element = 'H';
    else if (label.startsWith('O')) element = 'O';
    else if (label.startsWith('N')) element = 'N';
    else if (label.startsWith('S')) element = 'S';
    else if (label.startsWith('P')) element = 'P';
    else if (['F', 'Cl', 'Br', 'I'].includes(label)) element = label;

    const newSubAtom = this.state.addAtom({
      x: subX,
      y: subY,
      element: element,
      label: label === 'C' ? null : label,
      // El sustituyente hereda la profundidad de su carbono (para los huecos en cruces)
      depth: parentAtom.depth !== undefined ? parentAtom.depth : 0
    });

    this.state.addBond({
      atom1: parentAtom.id,
      atom2: newSubAtom.id,
      type: guide.type || 'single'
    });

    this.renderer.render();
  }

  /**
   * ¿Ya hay un átomo enlazado en la posición de la guía (axial/ecuatorial)?
   */
  isGuideOccupied(parentAtom, positionType) {
    return !getFreeChairGuides(parentAtom, this.state).some(g => g.type === positionType);
  }

  addSmartSubstituent(parentAtom) {
    if (!parentAtom.substituentGuides) return;
    // Primero axial; si ya está ocupado, ecuatorial; si ambos lo están, no hace nada
    if (!this.isGuideOccupied(parentAtom, 'axial')) {
      this.addSubstituentFromGuide(parentAtom.id, 'axial');
    } else if (!this.isGuideOccupied(parentAtom, 'equatorial')) {
      this.addSubstituentFromGuide(parentAtom.id, 'equatorial');
    }
  }
}
