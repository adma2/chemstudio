/**
 * svg-renderer.js - Motor principal de renderizado SVG para ChemStudio
 * Dibuja átomos, enlaces, flechas, recuadros y rótulos del lienzo con el estilo de los
 * exámenes IChO.
 */

import { ELEMENTS, formatChemicalFormula, getFormattedAtomDisplay, getAtomLonePairAngles, renderFormattedSvgText } from '../chem-engine/elements.js';
import { ArrowRenderer } from './arrow-renderer.js';
import { ReferenceBoxRenderer } from './reference-box.js';
import { ChemState } from '../state.js';

export class SvgRenderer {
  /** Modo blanco y negro (preferencia global): etiquetas y cargas sin colores por elemento */
  static monochrome = false;

  constructor(svgElement, state) {
    this.svgElement = svgElement;
    this.svg = svgElement;
    this.state = state;
    this.hoveredAtomId = null;
    this.hoveredBondId = null;
    this.activeGuideAtomId = null;

    this.initSvgDefs();
  }

  initSvgDefs() {
    let defs = this.svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      this.svg.insertBefore(defs, this.svg.firstChild);
    }

    const markerNormalColor = (this.state && this.state.isDarkMode) ? '#ffffff' : '#111827';
    defs.innerHTML = `
      <marker id="arrowhead-normal" viewBox="0 0 10 10" refX="8" refY="5"
        markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="${markerNormalColor}" />
      </marker>
      
      <marker id="arrowhead-selected" viewBox="0 0 10 10" refX="8" refY="5"
        markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#2563eb" />
      </marker>

      <filter id="glow-error" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    `;
  }

  render() {
    const defs = this.svg.querySelector('defs');
    this.svg.innerHTML = '';
    if (defs) this.svg.appendChild(defs);

    const rootGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    rootGroup.setAttribute('id', 'canvas-root');
    rootGroup.setAttribute('transform', `translate(${this.state.pan.x}, ${this.state.pan.y}) scale(${this.state.zoom})`);
    this.svg.appendChild(rootGroup);

    const boxLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    boxLayer.setAttribute('id', 'layer-boxes');
    rootGroup.appendChild(boxLayer);

    const arrowLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    arrowLayer.setAttribute('id', 'layer-arrows');
    rootGroup.appendChild(arrowLayer);

    const bondLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bondLayer.setAttribute('id', 'layer-bonds');
    rootGroup.appendChild(bondLayer);

    const atomLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    atomLayer.setAttribute('id', 'layer-atoms');
    rootGroup.appendChild(atomLayer);

    const guideLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    guideLayer.setAttribute('id', 'layer-guides');
    rootGroup.appendChild(guideLayer);

    const labelLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labelLayer.setAttribute('id', 'layer-labels');
    rootGroup.appendChild(labelLayer);

    // 1. Cajas de Referencias y Recuadros de Compuestos
    for (const box of this.state.referenceBoxes.values()) {
      const isSelected = this.state.selected.boxes.has(box.id);
      if (box.boxType === 'compound' && !this.state.showCompoundBoxes && !isSelected) {
        let hasAtoms = false;
        for (const a of this.state.atoms.values()) {
          if (a.x >= box.x - 15 && a.x <= box.x + box.width + 15 && a.y >= box.y - 15 && a.y <= box.y + box.height + 15) {
            hasAtoms = true;
            break;
          }
        }
        if (hasAtoms) {
          const tag = ReferenceBoxRenderer.renderCompoundTag(box, this.state);
          if (tag) boxLayer.appendChild(tag);
        }
        if (!hasAtoms) {
          boxLayer.appendChild(ReferenceBoxRenderer.renderStandaloneUnknown(box, isSelected, this.state));
        } else {
          const descText = ReferenceBoxRenderer.renderDescription(box, this.state, hasAtoms);
          if (descText) boxLayer.appendChild(descText);
        }
        continue;
      }
      boxLayer.appendChild(ReferenceBoxRenderer.render(box, isSelected, this.state));
    }

    // 2. Flechas de Reacción
    for (const arrow of this.state.arrows.values()) {
      const isSelected = this.state.selected.arrows.has(arrow.id);
      arrowLayer.appendChild(ArrowRenderer.renderArrow(arrow, isSelected, this.state));
    }

    // 3. Enlaces Químicos (los de atrás primero; los de delante dejan un hueco al cruzarlos)
    const haloBondIds = this.computeCrossingHalos();
    const orderedBonds = Array.from(this.state.bonds.values())
      .map((bond, idx) => ({ bond, idx, depth: this.getBondDepth(bond) }))
      .sort((p, q) => ((p.depth || 0) - (q.depth || 0)) || (p.idx - q.idx));
    for (const { bond } of orderedBonds) {
      const a1 = this.state.getAtom(bond.atom1);
      const a2 = this.state.getAtom(bond.atom2);
      if (!a1 || !a2) continue;

      if (haloBondIds.has(bond.id)) {
        bondLayer.appendChild(this.renderCrossingHalo(a1, a2));
      }
      const isSelected = this.state.selected.bonds.has(bond.id);
      const isHovered = this.hoveredBondId === bond.id;
      const bondElem = this.renderBond(bond, a1, a2, isSelected, isHovered);
      bondLayer.appendChild(bondElem);
    }

    // 4. Átomos y Alertas de Texas Carbon en ROJO
    for (const atom of this.state.atoms.values()) {
      const isSelected = this.state.selected.atoms.has(atom.id);
      const isHovered = this.hoveredAtomId === atom.id;
      const valInfo = this.state.valenceErrors.get(atom.id);
      const atomElem = this.renderAtom(atom, isSelected, isHovered, valInfo);
      atomLayer.appendChild(atomElem);
    }

    // 5. Rótulos de Intermediarios (A, B, C...) - Tamaño 22px grande estilo IChO
    for (const label of this.state.textLabels.values()) {
      const isSelected = this.state.selected.labels.has(label.id);
      const labelElem = this.renderTextLabel(label, isSelected);
      labelLayer.appendChild(labelElem);
    }

    // 6. Las guías axial/ecuatorial de la silla no se dibujan: la herramienta de enlace ya sigue
    //    esas direcciones sola (pickChairGuide). renderChairGuides() sirve para mostrarlas.

    // 6.1 Tirador de rotación (↻) cuando hay 2+ átomos seleccionados con la herramienta de selección
    this.renderRotateHandle(guideLayer);

    // 7. Elementos HTML sobre el lienzo (p. ej. el rótulo editable del recuadro seleccionado)
    if (typeof this.onAfterRender === 'function') this.onAfterRender();
  }

  /** Tirador ↻ encima de la selección; arrastrarlo gira los átomos seleccionados (SelectTool) */
  renderRotateHandle(layer) {
    if (!this.state || this.state.currentTool !== 'select') return;
    const atoms = Array.from(this.state.selected.atoms).map(id => this.state.getAtom(id)).filter(Boolean);
    if (atoms.length < 2) return;
    const NS = 'http://www.w3.org/2000/svg';
    const z = this.state.zoom || 1;
    const minX = Math.min(...atoms.map(a => a.x)), maxX = Math.max(...atoms.map(a => a.x));
    const minY = Math.min(...atoms.map(a => a.y));
    const cx = (minX + maxX) / 2;
    const hy = minY - 34 / z;

    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', minY - 10 / z);
    line.setAttribute('x2', cx);
    line.setAttribute('y2', hy + 9 / z);
    line.setAttribute('stroke', '#2563eb');
    line.setAttribute('stroke-width', 1.5 / z);
    line.setAttribute('stroke-dasharray', `${3 / z} ${3 / z}`);
    line.setAttribute('pointer-events', 'none');
    layer.appendChild(line);

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'rotate-handle');
    g.style.cursor = 'grab';
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', hy);
    circle.setAttribute('r', 9 / z);
    circle.setAttribute('fill', '#ffffff');
    circle.setAttribute('stroke', '#2563eb');
    circle.setAttribute('stroke-width', 2 / z);
    g.appendChild(circle);
    const icon = document.createElementNS(NS, 'text');
    icon.setAttribute('x', cx);
    icon.setAttribute('y', hy + 4.5 / z);
    icon.setAttribute('text-anchor', 'middle');
    icon.setAttribute('font-size', 13 / z);
    icon.setAttribute('font-weight', 'bold');
    icon.setAttribute('fill', '#2563eb');
    icon.setAttribute('pointer-events', 'none');
    icon.textContent = '↻';
    g.appendChild(icon);
    const title = document.createElementNS(NS, 'title');
    title.textContent = 'Arrastra para rotar la selección (Shift: de 15° en 15°)';
    g.appendChild(title);
    layer.appendChild(g);

    // Ángulo actual mientras se gira
    if (typeof this.rotationAngleDeg === 'number') {
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', cx + 14 / z);
      t.setAttribute('y', hy - 10 / z);
      t.setAttribute('font-size', 12 / z);
      t.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      t.setAttribute('fill', '#2563eb');
      t.setAttribute('pointer-events', 'none');
      t.textContent = `${this.rotationAngleDeg}°`;
      layer.appendChild(t);
    }
  }

  /**
   * Profundidad media de un enlace (solo si ambos átomos tienen 'depth', p. ej. sillas).
   * Positivo = más cerca del observador.
   */
  getBondDepth(bond) {
    const a1 = this.state.getAtom(bond.atom1);
    const a2 = this.state.getAtom(bond.atom2);
    if (!a1 || !a2 || typeof a1.depth !== 'number' || typeof a2.depth !== 'number') return null;
    return (a1.depth + a2.depth) / 2;
  }

  /**
   * Devuelve los ids de los enlaces que pasan POR DELANTE de otro enlace con el que se cruzan.
   * Esos enlaces se dibujan con un halo del color del fondo, que corta el enlace de atrás
   * (axiales internos de la silla que cruzan el borde opuesto del anillo).
   */
  computeCrossingHalos() {
    const halos = new Set();
    const items = [];
    for (const bond of this.state.bonds.values()) {
      const depth = this.getBondDepth(bond);
      if (depth === null) continue;
      const a1 = this.state.getAtom(bond.atom1);
      const a2 = this.state.getAtom(bond.atom2);
      items.push({ bond, depth, a1, a2 });
    }
    const orient = (ax, ay, bx, by, cx, cy) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const p = items[i], q = items[j];
        const ids = [p.bond.atom1, p.bond.atom2];
        if (ids.includes(q.bond.atom1) || ids.includes(q.bond.atom2)) continue;
        const d1 = orient(q.a1.x, q.a1.y, q.a2.x, q.a2.y, p.a1.x, p.a1.y);
        const d2 = orient(q.a1.x, q.a1.y, q.a2.x, q.a2.y, p.a2.x, p.a2.y);
        const d3 = orient(p.a1.x, p.a1.y, p.a2.x, p.a2.y, q.a1.x, q.a1.y);
        const d4 = orient(p.a1.x, p.a1.y, p.a2.x, p.a2.y, q.a2.x, q.a2.y);
        if (d1 * d2 < 0 && d3 * d4 < 0) {
          if (p.depth > q.depth) halos.add(p.bond.id);
          else if (q.depth > p.depth) halos.add(q.bond.id);
        }
      }
    }
    return halos;
  }

  renderCrossingHalo(a1, a2) {
    const halo = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const len = Math.hypot(a2.x - a1.x, a2.y - a1.y) || 1;
    // Recortar los extremos para no tapar los enlaces que comparten vértice
    const trim = Math.min(6, len / 4);
    const ux = (a2.x - a1.x) / len, uy = (a2.y - a1.y) / len;
    halo.setAttribute('x1', a1.x + ux * trim);
    halo.setAttribute('y1', a1.y + uy * trim);
    halo.setAttribute('x2', a2.x - ux * trim);
    halo.setAttribute('y2', a2.y - uy * trim);
    halo.setAttribute('stroke', (this.state && this.state.isDarkMode) ? '#090d16' : '#ffffff');
    halo.setAttribute('stroke-width', '7');
    halo.setAttribute('stroke-linecap', 'butt');
    halo.setAttribute('class', 'bond-crossing-halo');
    halo.setAttribute('pointer-events', 'none');
    return halo;
  }

  isBondInRing(a1Id, a2Id) {
    if (!this.state || !this.state.bonds) return false;
    const visited = new Set([a1Id]);
    const queue = [];

    for (const bond of this.state.bonds.values()) {
      if ((bond.atom1 === a1Id && bond.atom2 === a2Id) || (bond.atom1 === a2Id && bond.atom2 === a1Id)) {
        continue;
      }
      if (bond.atom1 === a1Id) {
        visited.add(bond.atom2);
        queue.push(bond.atom2);
      } else if (bond.atom2 === a1Id) {
        visited.add(bond.atom1);
        queue.push(bond.atom1);
      }
    }

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr === a2Id) return true;

      for (const bond of this.state.bonds.values()) {
        if ((bond.atom1 === a1Id && bond.atom2 === a2Id) || (bond.atom1 === a2Id && bond.atom2 === a1Id)) {
          continue;
        }
        let next = null;
        if (bond.atom1 === curr && !visited.has(bond.atom2)) next = bond.atom2;
        else if (bond.atom2 === curr && !visited.has(bond.atom1)) next = bond.atom1;

        if (next) {
          visited.add(next);
          queue.push(next);
        }
      }
    }

    return false;
  }

  getRingInteriorDirection(a1, a2) {
    // Si el enlace no forma parte de un ciclo (ej. C=O, C=N exocíclicos o alquenos acíclicos),
    // NO es un enlace de anillo y debe ser un doble enlace simétrico perfectamente centrado.
    if (!this.isBondInRing(a1.id, a2.id)) {
      return { nx: 0, ny: 0, isRing: false };
    }

    const dx = a2.x - a1.x;
    const dy = a2.y - a1.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return { nx: 0, ny: -1, isRing: false };

    const nx = -dy / len;
    const ny = dx / len;
    const midX = (a1.x + a2.x) / 2;
    const midY = (a1.y + a2.y) / 2;

    let dotSum = 0;
    let neighborCount = 0;

    for (const bond of this.state.bonds.values()) {
      let other = null;
      if (bond.atom1 === a1.id && bond.atom2 !== a2.id) other = this.state.getAtom(bond.atom2);
      else if (bond.atom2 === a1.id && bond.atom1 !== a2.id) other = this.state.getAtom(bond.atom1);
      else if (bond.atom1 === a2.id && bond.atom2 !== a1.id) other = this.state.getAtom(bond.atom2);
      else if (bond.atom2 === a2.id && bond.atom1 !== a1.id) other = this.state.getAtom(bond.atom1);

      if (other) {
        const vx = other.x - midX;
        const vy = other.y - midY;
        const dot = vx * nx + vy * ny;
        dotSum += dot;
        neighborCount++;
      }
    }

    if (neighborCount === 0) {
      return { nx: 0, ny: 0, isRing: false };
    }

    const side = dotSum >= 0 ? 1 : -1;
    return {
      nx: nx * side,
      ny: ny * side,
      isRing: true
    };
  }

  renderBond(bond, a1, a2, isSelected, isHovered) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `chem-bond ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', bond.id);

    const x1 = a1.x, y1 = a1.y;
    const x2 = a2.x, y2 = a2.y;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);

    if (length === 0) return group;

    const angle = Math.atan2(dy, dx);
    const ux = dx / length;
    const uy = dy / length;
    const perpX = -Math.sin(angle);
    const perpY = Math.cos(angle);

    const defaultBondColor = (this.state && this.state.isDarkMode) ? '#ffffff' : '#111827';
    const strokeColor = isSelected ? '#2563eb' : (isHovered ? '#3b82f6' : defaultBondColor);
    // Grosor normal limpio uniforme para todos los enlaces simples
    const baseStrokeWidth = isSelected ? 2.4 : 1.9;

    // Área táctil transparente
    const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hitArea.setAttribute('x1', x1);
    hitArea.setAttribute('y1', y1);
    hitArea.setAttribute('x2', x2);
    hitArea.setAttribute('y2', y2);
    hitArea.setAttribute('stroke', 'transparent');
    hitArea.setAttribute('stroke-width', '18');
    hitArea.setAttribute('class', 'bond-hit-area');
    group.appendChild(hitArea);

    switch (bond.type) {
      case 'double': {
        const ringDir = this.getRingInteriorDirection(a1, a2);

        if (ringDir.isRing) {
          const offsetDist = 4.2;
          const trimDist = 5.0;

          const outerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          outerLine.setAttribute('x1', x1);
          outerLine.setAttribute('y1', y1);
          outerLine.setAttribute('x2', x2);
          outerLine.setAttribute('y2', y2);
          outerLine.setAttribute('stroke', strokeColor);
          outerLine.setAttribute('stroke-width', baseStrokeWidth);
          outerLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(outerLine);

          const inX1 = x1 + ux * trimDist + ringDir.nx * offsetDist;
          const inY1 = y1 + uy * trimDist + ringDir.ny * offsetDist;
          const inX2 = x2 - ux * trimDist + ringDir.nx * offsetDist;
          const inY2 = y2 - uy * trimDist + ringDir.ny * offsetDist;

          const innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          innerLine.setAttribute('x1', inX1);
          innerLine.setAttribute('y1', inY1);
          innerLine.setAttribute('x2', inX2);
          innerLine.setAttribute('y2', inY2);
          innerLine.setAttribute('stroke', strokeColor);
          innerLine.setAttribute('stroke-width', baseStrokeWidth * 0.95);
          innerLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(innerLine);
        } else {
          // Alqueno acíclico o carbonilo:
          // 1. Línea principal continua, igual que un enlace simple
          const mainLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          mainLine.setAttribute('x1', x1);
          mainLine.setAttribute('y1', y1);
          mainLine.setAttribute('x2', x2);
          mainLine.setAttribute('y2', y2);
          mainLine.setAttribute('stroke', strokeColor);
          mainLine.setAttribute('stroke-width', baseStrokeWidth);
          mainLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(mainLine);

          // 2. Determinar lado y presencia de enlaces adyacentes (sp3/sustituyentes)
          let sideSum = 0;
          let hasNeighbors1 = false;
          let hasNeighbors2 = false;

          for (const b of this.state.bonds.values()) {
            if (b.id === bond.id) continue;
            let other = null;
            if (b.atom1 === a1.id) { other = this.state.getAtom(b.atom2); hasNeighbors1 = true; }
            else if (b.atom2 === a1.id) { other = this.state.getAtom(b.atom1); hasNeighbors1 = true; }
            if (other) {
              const vx = other.x - a1.x;
              const vy = other.y - a1.y;
              sideSum += (vx * perpX + vy * perpY);
            }

            let other2 = null;
            if (b.atom1 === a2.id) { other2 = this.state.getAtom(b.atom2); hasNeighbors2 = true; }
            else if (b.atom2 === a2.id) { other2 = this.state.getAtom(b.atom1); hasNeighbors2 = true; }
            if (other2) {
              const vx = other2.x - a2.x;
              const vy = other2.y - a2.y;
              sideSum += (vx * perpX + vy * perpY);
            }
          }

          // Lado interior/cóncavo preferente
          const side = sideSum > 0.05 ? 1 : (sideSum < -0.05 ? -1 : 1);
          const offsetDist = 4.0;

          // Recorte en los vértices que conectan con otros enlaces (sp3) para que no choquen
          const trim1 = hasNeighbors1 ? 6.0 : 2.5;
          const trim2 = hasNeighbors2 ? 6.0 : 2.5;

          const inX1 = x1 + ux * trim1 + perpX * side * offsetDist;
          const inY1 = y1 + uy * trim1 + perpY * side * offsetDist;
          const inX2 = x2 - ux * trim2 + perpX * side * offsetDist;
          const inY2 = y2 - uy * trim2 + perpY * side * offsetDist;

          const companionLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          companionLine.setAttribute('x1', inX1);
          companionLine.setAttribute('y1', inY1);
          companionLine.setAttribute('x2', inX2);
          companionLine.setAttribute('y2', inY2);
          companionLine.setAttribute('stroke', strokeColor);
          companionLine.setAttribute('stroke-width', baseStrokeWidth * 0.95);
          companionLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(companionLine);
        }
        break;
      }

      case 'triple': {
        const offset = 3.6;
        for (const factor of [-1, 0, 1]) {
          const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          l.setAttribute('x1', x1 + perpX * offset * factor);
          l.setAttribute('y1', y1 + perpY * offset * factor);
          l.setAttribute('x2', x2 + perpX * offset * factor);
          l.setAttribute('y2', y2 + perpY * offset * factor);
          l.setAttribute('stroke', strokeColor);
          l.setAttribute('stroke-width', factor === 0 ? baseStrokeWidth : baseStrokeWidth * 0.9);
          l.setAttribute('stroke-linecap', 'round');
          group.appendChild(l);
        }
        break;
      }

      case 'bold': {
        // Enlace grueso (borde frontal de las sillas estilo IChO)
        const boldLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        boldLine.setAttribute('x1', x1);
        boldLine.setAttribute('y1', y1);
        boldLine.setAttribute('x2', x2);
        boldLine.setAttribute('y2', y2);
        boldLine.setAttribute('stroke', strokeColor);
        boldLine.setAttribute('stroke-width', bond.boldWidth || 5);
        boldLine.setAttribute('stroke-linecap', 'round');
        group.appendChild(boldLine);
        break;
      }

      case 'wedge': {
        // wedgeWidth opcional: ancho del extremo grueso (las sillas lo igualan al enlace 'bold').
        // En ese caso la cuña es un trapecio que arranca con el grosor de un enlace normal
        // (como el borde remarcado de las sillas IChO), en vez de terminar en punta.
        const wedgeBase = bond.wedgeWidth ? bond.wedgeWidth / 2 : 4.2;
        const tipHalf = bond.wedgeWidth ? baseStrokeWidth / 2 : 0;
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const p2 = `${x2 + perpX * wedgeBase},${y2 + perpY * wedgeBase}`;
        const p3 = `${x2 - perpX * wedgeBase},${y2 - perpY * wedgeBase}`;
        if (tipHalf > 0) {
          const p0 = `${x1 - perpX * tipHalf},${y1 - perpY * tipHalf}`;
          const p1 = `${x1 + perpX * tipHalf},${y1 + perpY * tipHalf}`;
          poly.setAttribute('points', `${p0} ${p1} ${p2} ${p3}`);
          poly.setAttribute('stroke', strokeColor);
          poly.setAttribute('stroke-width', '0.6');
          poly.setAttribute('stroke-linejoin', 'round');
        } else {
          poly.setAttribute('points', `${x1},${y1} ${p2} ${p3}`);
        }
        poly.setAttribute('fill', strokeColor);
        group.appendChild(poly);
        break;
      }

      case 'dash': {
        const numDashes = 7;
        for (let i = 1; i <= numDashes; i++) {
          const t = i / numDashes;
          const px = x1 + dx * t;
          const py = y1 + dy * t;
          const halfWidth = 0.8 + (t * 3.6);
          const dl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          dl.setAttribute('x1', px - perpX * halfWidth);
          dl.setAttribute('y1', py - perpY * halfWidth);
          dl.setAttribute('x2', px + perpX * halfWidth);
          dl.setAttribute('y2', py + perpY * halfWidth);
          dl.setAttribute('stroke', strokeColor);
          dl.setAttribute('stroke-width', '1.8');
          group.appendChild(dl);
        }
        break;
      }

      case 'wavy': {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const waves = 4;
        let d = `M ${x1} ${y1}`;
        for (let i = 0; i < waves * 2; i++) {
          const t1 = (i + 0.5) / (waves * 2);
          const t2 = (i + 1) / (waves * 2);
          const side = i % 2 === 0 ? 1 : -1;
          const cx = x1 + dx * t1 + perpX * 3.5 * side;
          const cy = y1 + dy * t1 + perpY * 3.5 * side;
          const ex = x1 + dx * t2;
          const ey = y1 + dy * t2;
          d += ` Q ${cx} ${cy}, ${ex} ${ey}`;
        }
        path.setAttribute('d', d);
        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', baseStrokeWidth);
        path.setAttribute('fill', 'none');
        group.appendChild(path);
        break;
      }

      case 'dative': // enlace de coordinación (N→metal): se dibuja punteado y no cuenta en la valencia
      case 'dashed': {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', strokeColor);
        line.setAttribute('stroke-width', baseStrokeWidth);
        line.setAttribute('stroke-dasharray', '5 4');
        line.setAttribute('stroke-linecap', 'round');
        group.appendChild(line);
        break;
      }

      case 'single':
      default: {
        // Enlace simple
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', strokeColor);
        line.setAttribute('stroke-width', baseStrokeWidth);
        line.setAttribute('stroke-linecap', 'round');
        group.appendChild(line);
        break;
      }
    }

    return group;
  }

  renderAtom(atom, isSelected, isHovered, valInfo) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `chem-atom ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', atom.id);

    // Al exportar no se marcan los errores de valencia (es un aviso de edición, no parte del dibujo)
    const hasError = valInfo && valInfo.hasError && !this.exportMode;

    if (hasError) {
      const errorHalo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      errorHalo.setAttribute('cx', atom.x);
      errorHalo.setAttribute('cy', atom.y);
      errorHalo.setAttribute('r', '13');
      errorHalo.setAttribute('fill', '#ef4444');
      errorHalo.setAttribute('fill-opacity', '0.35');
      errorHalo.setAttribute('stroke', '#dc2626');
      errorHalo.setAttribute('stroke-width', '2');
      errorHalo.setAttribute('filter', 'url(#glow-error)');
      errorHalo.setAttribute('class', 'valence-error-pulse');
      group.appendChild(errorHalo);

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = valInfo.message;
      group.appendChild(title);
    }

    const displayInfo = getFormattedAtomDisplay(atom, this.state);

    // Resaltado de selección / hover: solo el círculo en carbonos implícitos. Los átomos con
    // etiqueta (OH, NH2, Cl...) no llevan resaltado: el círculo quedaba tapado por el fondo de la
    // etiqueta (asomaba un trozo) y un recuadro alrededor del texto se veía peor.
    if ((isSelected || isHovered) && displayInfo.isImplicit) {
      const selRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      selRing.setAttribute('cx', atom.x);
      selRing.setAttribute('cy', atom.y);
      selRing.setAttribute('r', '9');
      selRing.setAttribute('fill', isSelected ? '#bfdbfe' : '#e0e7ff');
      selRing.setAttribute('fill-opacity', '0.6');
      selRing.setAttribute('stroke', '#2563eb');
      selRing.setAttribute('stroke-width', '1.5');
      group.appendChild(selRing);
    }

    if (!displayInfo.isImplicit) {
      const isDark = this.state && this.state.isDarkMode;
      // Modo blanco y negro: sin código de colores por elemento (estilo examen); los errores siguen en rojo
      let textColor = hasError ? '#dc2626' : ((!SvgRenderer.monochrome && ELEMENTS[displayInfo.element]?.color) || (isDark ? '#ffffff' : '#111827'));
      if (isDark && textColor === '#111827') textColor = '#ffffff';
      const { text, bondingAtom, bondingSide, prefix, suffix } = displayInfo;

      // Dimensiones tipográficas estándar (Arial 15px)
      // El átomo de anclaje (ej. 'N', 'O', 'C') se centra EXACTAMENTE en (atom.x, atom.y)
      const letterWidth = (bondingAtom.length > 1) ? Math.max(17, bondingAtom.length * 8.5) : 11;
      const prefixWidth = prefix ? (prefix.length * 8.5) : 0;
      const suffixWidth = suffix ? (suffix.length * 8.5) : 0;

      // Margen estricto (2.0px) para evitar recortar de más los enlaces
      const margin = 2.0;
      let textXMin, textXMax;

      // Átomo con carga sola (N+, O−, S+...): la LETRA va centrada en el átomo y la carga a su
      // derecha. Si se centrara el texto completo "O−", la letra quedaría corrida a la izquierda
      // respecto al enlace (medio ancho del signo).
      const chargedMatch = bondingSide === 'center' && text ? /^([A-Z][a-z]?)(\d*[+\-−])$/.exec(text) : null;
      const chargedMainW = chargedMatch ? this.estimateTextWidth(chargedMatch[1], 15) : 0;

      const vertH = bondingSide === 'below' || bondingSide === 'above';
      if (vertH) {
        // H debajo/encima del átomo (amidas -NH-): el fondo cubre solo el ancho de la letra
        textXMin = atom.x - letterWidth / 2 - margin;
        textXMax = atom.x + letterWidth / 2 + margin;
      } else if (chargedMatch) {
        // El fondo cubre solo la letra: la carga es un superíndice y, si el fondo la incluyera,
        // recortaría los enlaces que salen hacia la derecha (p. ej. el N=O del nitro).
        textXMin = atom.x - chargedMainW / 2 - margin;
        textXMax = atom.x + chargedMainW / 2 + margin;
      } else if (bondingSide === 'right') {
        // H2N- (a la izquierda del enlace): 'N' centrado en atom.x, 'H2' a la izquierda
        textXMin = atom.x - letterWidth / 2 - prefixWidth - margin;
        textXMax = atom.x + letterWidth / 2 + margin;
      } else if (bondingSide === 'left') {
        // -NH2 (a la derecha o vertical): 'N' centrado en atom.x, 'H2' a la derecha
        textXMin = atom.x - letterWidth / 2 - margin;
        textXMax = atom.x + letterWidth / 2 + suffixWidth + margin;
      } else {
        // Átomo simple, grupo o heterociclo centrado
        const fullWidth = text ? Math.max(letterWidth, text.length * 8.5) : letterWidth;
        textXMin = atom.x - fullWidth / 2 - margin;
        textXMax = atom.x + fullWidth / 2 + margin;
      }

      const textYMin = atom.y - 7.5 - margin - (bondingSide === 'above' ? 16 : 0);
      const textYMax = atom.y + 6.5 + margin + (bondingSide === 'below' ? 16 : 0);
      const maskWidth = textXMax - textXMin;
      const maskHeight = textYMax - textYMin;

      // 1. Máscara de fondo ceñida que no devora el enlace
      const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgRect.setAttribute('x', textXMin);
      bgRect.setAttribute('y', textYMin);
      bgRect.setAttribute('width', maskWidth);
      bgRect.setAttribute('height', maskHeight);
      bgRect.setAttribute('rx', '2.5');
      bgRect.setAttribute('ry', '2.5');
      bgRect.setAttribute('fill', isDark ? '#090d16' : '#ffffff');
      group.appendChild(bgRect);

      // 2. Elemento de texto con posicionamiento exacto del heteroátomo en el enlace
      const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElem.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      textElem.setAttribute('font-size', '15');
      textElem.setAttribute('font-weight', '500');
      textElem.setAttribute('fill', textColor);

      if (bondingSide === 'right') {
        // Prefijo a la izquierda (ej. H2)
        const prefixTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        prefixTspan.setAttribute('x', atom.x - letterWidth / 2);
        prefixTspan.setAttribute('y', atom.y + 5);
        prefixTspan.setAttribute('text-anchor', 'end');
        this.populateFormattedText(prefixTspan, prefix);
        textElem.appendChild(prefixTspan);

        // Heteroátomo de unión centrado en atom.x (ej. N)
        const mainTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        mainTspan.setAttribute('x', atom.x);
        mainTspan.setAttribute('y', atom.y + 5);
        mainTspan.setAttribute('text-anchor', 'middle');
        mainTspan.textContent = bondingAtom;
        textElem.appendChild(mainTspan);

        // Carga tras el heteroátomo (ej. H4N+, H3O+): sin esto el '+' se perdía
        if (suffix) {
          const suffixTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          suffixTspan.setAttribute('x', atom.x + letterWidth / 2);
          suffixTspan.setAttribute('y', atom.y + 5);
          suffixTspan.setAttribute('text-anchor', 'start');
          // Un signo suelto no tiene letra delante para que el parser lo vea como carga: '^' lo fuerza a superíndice
          this.populateFormattedText(suffixTspan, /^[+\-−]$/.test(suffix) ? `^${suffix}` : suffix);
          textElem.appendChild(suffixTspan);
        }
      } else if (bondingSide === 'left') {
        // Heteroátomo de unión centrado en atom.x (ej. N)
        const mainTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        mainTspan.setAttribute('x', atom.x);
        mainTspan.setAttribute('y', atom.y + 5);
        mainTspan.setAttribute('text-anchor', 'middle');
        mainTspan.textContent = bondingAtom;
        textElem.appendChild(mainTspan);

        // Sufijo a la derecha (ej. H2)
        const suffixTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        suffixTspan.setAttribute('x', atom.x + letterWidth / 2);
        suffixTspan.setAttribute('y', atom.y + 5);
        suffixTspan.setAttribute('text-anchor', 'start');
        this.populateFormattedText(suffixTspan, suffix);
        textElem.appendChild(suffixTspan);
      } else if (vertH) {
        const mainTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        mainTspan.setAttribute('x', atom.x);
        mainTspan.setAttribute('y', atom.y + 5);
        mainTspan.setAttribute('text-anchor', 'middle');
        mainTspan.textContent = bondingAtom;
        textElem.appendChild(mainTspan);
        const hTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        hTspan.setAttribute('x', atom.x);
        hTspan.setAttribute('y', atom.y + 5 + (bondingSide === 'below' ? 16 : -16));
        hTspan.setAttribute('text-anchor', 'middle');
        hTspan.textContent = suffix;
        textElem.appendChild(hTspan);
      } else if (chargedMatch) {
        textElem.setAttribute('x', atom.x - chargedMainW / 2);
        textElem.setAttribute('y', atom.y + 5);
        textElem.setAttribute('text-anchor', 'start');
        this.populateFormattedText(textElem, text);
      } else {
        textElem.setAttribute('x', atom.x);
        textElem.setAttribute('y', atom.y + 5);
        textElem.setAttribute('text-anchor', 'middle');
        this.populateFormattedText(textElem, text);
      }

      group.appendChild(textElem);

      // Renderizar pares libres de electrones (lone pairs)
      if (atom.lonePairs && atom.lonePairs > 0) {
        const lpAngles = getAtomLonePairAngles(atom, this.state, atom.lonePairs);
        const dist = 14;
        for (const ang of lpAngles) {
          const cx = atom.x + dist * Math.cos(ang);
          const cy = atom.y + dist * Math.sin(ang);
          const tx = -Math.sin(ang);
          const ty = Math.cos(ang);
          const sep = 3.5;

          const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot1.setAttribute('cx', cx - sep * tx);
          dot1.setAttribute('cy', cy - sep * ty);
          dot1.setAttribute('r', '1.6');
          dot1.setAttribute('fill', '#0f172a');
          group.appendChild(dot1);

          const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot2.setAttribute('cx', cx + sep * tx);
          dot2.setAttribute('cy', cy + sep * ty);
          dot2.setAttribute('r', '1.6');
          dot2.setAttribute('fill', '#0f172a');
          group.appendChild(dot2);
        }
      }

      // Renderizar carga formal si no está ya integrada en el texto de la fórmula
      const hasChargeInText = /[+\-−]/.test(displayInfo.text || '');
      if (atom.charge !== 0 && atom.charge !== undefined && !hasChargeInText) {
        const isPos = atom.charge > 0;
        const mono = SvgRenderer.monochrome;
        const strokeCol = mono ? ((this.state && this.state.isDarkMode) ? '#ffffff' : '#111827') : (isPos ? '#2563eb' : '#dc2626');
        const fillCol = mono ? ((this.state && this.state.isDarkMode) ? '#090d16' : '#ffffff') : (isPos ? '#eff6ff' : '#fef2f2');
        const badgeX = textXMax + 7;
        const badgeY = atom.y - 7;

        const badgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const badgeCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        badgeCircle.setAttribute('cx', badgeX);
        badgeCircle.setAttribute('cy', badgeY);
        badgeCircle.setAttribute('r', '5.5');
        badgeCircle.setAttribute('fill', fillCol);
        badgeCircle.setAttribute('stroke', strokeCol);
        badgeCircle.setAttribute('stroke-width', '1.2');
        badgeGroup.appendChild(badgeCircle);

        const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        badgeText.setAttribute('x', badgeX);
        badgeText.setAttribute('y', badgeY + 3.5);
        badgeText.setAttribute('text-anchor', 'middle');
        badgeText.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
        badgeText.setAttribute('font-size', '10');
        badgeText.setAttribute('font-weight', 'bold');
        badgeText.setAttribute('fill', strokeCol);
        badgeText.textContent = isPos ? (atom.charge === 1 ? '+' : `${atom.charge}+`) : (atom.charge === -1 ? '−' : `${Math.abs(atom.charge)}−`);
        badgeGroup.appendChild(badgeText);

        group.appendChild(badgeGroup);
      }
    } else {
      const carbonPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      carbonPoint.setAttribute('cx', atom.x);
      carbonPoint.setAttribute('cy', atom.y);
      carbonPoint.setAttribute('r', '4');
      carbonPoint.setAttribute('fill', isHovered ? '#3b82f6' : 'transparent');
      group.appendChild(carbonPoint);

      // Pares libres en un carbono implícito (p. ej. carbanión)
      if (atom.lonePairs && atom.lonePairs > 0) {
        const lpAngles = getAtomLonePairAngles(atom, this.state, atom.lonePairs);
        const dist = 12;
        for (const ang of lpAngles) {
          const cx = atom.x + dist * Math.cos(ang);
          const cy = atom.y + dist * Math.sin(ang);
          const tx = -Math.sin(ang);
          const ty = Math.cos(ang);
          const sep = 3.5;

          const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot1.setAttribute('cx', cx - sep * tx);
          dot1.setAttribute('cy', cy - sep * ty);
          dot1.setAttribute('r', '1.6');
          dot1.setAttribute('fill', (this.state && this.state.isDarkMode) ? '#ffffff' : '#0f172a');
          group.appendChild(dot1);

          const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot2.setAttribute('cx', cx + sep * tx);
          dot2.setAttribute('cy', cy + sep * ty);
          dot2.setAttribute('r', '1.6');
          dot2.setAttribute('fill', (this.state && this.state.isDarkMode) ? '#ffffff' : '#0f172a');
          group.appendChild(dot2);
        }
      }

      // Carga formal en un carbono implícito (p. ej. carbocatión / carbanión)
      if (atom.charge !== 0 && atom.charge !== undefined) {
        const lpAngles = getAtomLonePairAngles(atom, this.state, 1);
        const angle = lpAngles.length > 0 ? lpAngles[0] : -Math.PI / 4;
        const isPos = atom.charge > 0;
        const mono = SvgRenderer.monochrome;
        const strokeCol = mono ? ((this.state && this.state.isDarkMode) ? '#ffffff' : '#111827') : (isPos ? '#2563eb' : '#dc2626');
        const fillCol = mono ? ((this.state && this.state.isDarkMode) ? '#090d16' : '#ffffff') : (isPos ? '#eff6ff' : '#fef2f2');
        const badgeX = atom.x + 12 * Math.cos(angle);
        const badgeY = atom.y + 12 * Math.sin(angle);

        const badgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const badgeCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        badgeCircle.setAttribute('cx', badgeX);
        badgeCircle.setAttribute('cy', badgeY);
        badgeCircle.setAttribute('r', '5.5');
        badgeCircle.setAttribute('fill', fillCol);
        badgeCircle.setAttribute('stroke', strokeCol);
        badgeCircle.setAttribute('stroke-width', '1.2');
        badgeGroup.appendChild(badgeCircle);

        const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        badgeText.setAttribute('x', badgeX);
        badgeText.setAttribute('y', badgeY + 3.5);
        badgeText.setAttribute('text-anchor', 'middle');
        badgeText.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
        badgeText.setAttribute('font-size', '10');
        badgeText.setAttribute('font-weight', 'bold');
        badgeText.setAttribute('fill', strokeCol);
        badgeText.textContent = isPos ? '+' : '−';
        badgeGroup.appendChild(badgeText);

        group.appendChild(badgeGroup);
      }
    }

    return group;
  }

  /**
   * Ancho aproximado (px) de un texto en Arial: anchos de avance por carácter en em.
   * Se usa para centrar exactamente la letra de un átomo cargado sobre su posición.
   */
  estimateTextWidth(str, fontSize = 15) {
    const em = {
      A: 0.667, B: 0.667, C: 0.722, D: 0.722, E: 0.667, F: 0.611, G: 0.778, H: 0.722, I: 0.278,
      K: 0.667, L: 0.556, M: 0.833, N: 0.722, O: 0.778, P: 0.667, R: 0.722, S: 0.667, T: 0.611,
      U: 0.722, V: 0.667, W: 0.944, X: 0.667, Y: 0.667, Z: 0.611,
      a: 0.556, b: 0.556, e: 0.556, g: 0.556, i: 0.222, l: 0.222, n: 0.556, o: 0.556, r: 0.333, s: 0.5, u: 0.556
    };
    let w = 0;
    for (const ch of String(str)) w += (em[ch] !== undefined ? em[ch] : 0.6);
    return w * fontSize;
  }

  populateFormattedText(textElem, str) {
    if (!str) return;
    renderFormattedSvgText(textElem, str);
  }

  renderTextLabel(label, isSelected) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `chem-label ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', label.id);

    const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElem.setAttribute('x', label.x);
    textElem.setAttribute('y', label.y);
    textElem.setAttribute('text-anchor', 'middle');

    if (label.isStereo) {
      // Estilo estereoquímico IChO: Times New Roman, bold italic, 19px (ej. Anti, Syn, E, Z)
      textElem.setAttribute('font-family', "'Times New Roman', Times, Georgia, serif");
      textElem.setAttribute('font-size', label.fontSize || 19);
      textElem.setAttribute('font-weight', 'bold');
      textElem.setAttribute('font-style', 'italic');
    } else if (label.isDescription) {
      // Descripción / subtítulo explicativo: Arial 13px (ej. Producto de Control Cinético, Si3O9(6-))
      textElem.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      textElem.setAttribute('font-size', label.fontSize || 13);
      textElem.setAttribute('font-weight', label.fontWeight || 'normal');
      textElem.setAttribute('font-style', 'normal');
    } else {
      textElem.setAttribute('font-family', label.fontFamily || 'Arial, Helvetica, sans-serif');
      textElem.setAttribute('font-size', label.fontSize || (label.isIntermediary ? 22 : 14));
      textElem.setAttribute('font-weight', label.fontWeight || (label.isIntermediary ? 'bold' : 'normal'));
      textElem.setAttribute('font-style', label.fontStyle || 'normal');
    }

    const defaultLabelColor = (this.state && this.state.isDarkMode) ? '#ffffff' : '#111827';
    textElem.setAttribute('fill', isSelected ? '#2563eb' : (label.color || defaultLabelColor));
    renderFormattedSvgText(textElem, label.text);
    group.appendChild(textElem);

    return group;
  }

  renderChairGuides(layer) {
    if (!this.hoveredAtomId) return;
    const atom = this.state.getAtom(this.hoveredAtomId);
    if (!atom || !atom.chairVertex) return;

    const guides = atom.substituentGuides;
    if (!guides) return;

    for (const [posType, guide] of Object.entries(guides)) {
      const targetX = atom.x + guide.dx;
      const targetY = atom.y + guide.dy;

      const guideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      guideLine.setAttribute('x1', atom.x);
      guideLine.setAttribute('y1', atom.y);
      guideLine.setAttribute('x2', targetX);
      guideLine.setAttribute('y2', targetY);
      guideLine.setAttribute('stroke', '#059669');
      guideLine.setAttribute('stroke-width', '1.5');
      guideLine.setAttribute('stroke-dasharray', '3 3');
      layer.appendChild(guideLine);

      const guideDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      guideDot.setAttribute('cx', targetX);
      guideDot.setAttribute('cy', targetY);
      guideDot.setAttribute('r', '4');
      guideDot.setAttribute('fill', '#10b981');
      guideDot.setAttribute('class', `chair-guide-dot guide-${posType}`);
      guideDot.setAttribute('data-atom-id', atom.id);
      guideDot.setAttribute('data-guide-type', posType);
      guideDot.style.cursor = 'pointer';

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `Clic para añadir enlace ${posType.toUpperCase()}`;
      guideDot.appendChild(title);

      layer.appendChild(guideDot);
    }
  }
}

/**
 * Las miniaturas de estructuras (molécula sobre flecha, recuadro de referencias) se dibujan con el
 * mismo renderer que la pizarra: etiquetas automáticas (OH, NH2...), cargas, cuñas, enlaces gruesos,
 * enlaces ondulados, etc.
 */
ReferenceBoxRenderer.thumbnailRenderer = (structObj, group, isDark) => {
  // Devuelve false si no se pudo usar el renderer completo (p. ej. un DOM simulado en las
  // pruebas); entonces se usa el dibujo simplificado. Nada se añade a 'group' hasta tener éxito.
  try {
    const tmp = new ChemState();
    tmp.isDarkMode = isDark;
    tmp.loadFromObject(JSON.parse(JSON.stringify({ atoms: structObj.atoms || [], bonds: structObj.bonds || [] })), false);
    const renderer = new SvgRenderer(document.createElementNS('http://www.w3.org/2000/svg', 'svg'), tmp);
    const neutralize = (el, cls) => {
      // Sin clases/ids de átomo o enlace: un clic en la miniatura no debe tratarse como un átomo
      // de la pizarra principal (abre su editor a través del grupo contenedor)
      el.setAttribute('class', cls);
      el.removeAttribute('data-id');
      return el;
    };
    const parts = [];
    for (const b of tmp.bonds.values()) {
      const a1 = tmp.getAtom(b.atom1);
      const a2 = tmp.getAtom(b.atom2);
      if (a1 && a2) parts.push(neutralize(renderer.renderBond(b, a1, a2, false, false), 'thumb-bond'));
    }
    for (const a of tmp.atoms.values()) {
      parts.push(neutralize(renderer.renderAtom(a, false, false, null), 'thumb-atom'));
    }
    parts.forEach(p => group.appendChild(p));
    return true;
  } catch (err) {
    return false;
  }
};
