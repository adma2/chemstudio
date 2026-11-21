/**
 * problem-builder.js - Asistente de construcción de problemas y esquemas de reacción IChO
 * Permite colocar flechas con tamaño estándar y genera automáticamente recuadros de
 * compuestos correlativos (A, B, C...) que se auto-ajustan al contenido molecular.
 */

import { getMoleculeBoundingBox, getAllMolecules, getConnectedMoleculeAtoms, getArrowBendCorner } from './elements.js';

export class ProblemBuilder {
  /**
   * Obtiene la siguiente letra correlativa para un recuadro de compuesto ('A', 'B', 'C'...)
   */
  static getNextLabel(state) {
    const existingLabels = new Set();
    for (const box of state.referenceBoxes.values()) {
      if (box.label) existingLabels.add(box.label.toUpperCase());
    }
    for (const label of state.textLabels.values()) {
      if (label.text && label.text.length === 1) existingLabels.add(label.text.toUpperCase());
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i];
      if (!existingLabels.has(letter)) return letter;
    }
    return `C${existingLabels.size + 1}`;
  }

  /** Distancia de un punto al rectángulo de un recuadro (0 si está dentro) */
  static distPointToBox(px, py, b) {
    const cx = Math.max(b.x, Math.min(px, b.x + b.width));
    const cy = Math.max(b.y, Math.min(py, b.y + b.height));
    return Math.hypot(px - cx, py - cy);
  }

  /** Recuadro de compuesto existente que se solapa con el rectángulo dado (o null) */
  static findOverlappingBox(rect, state, exclude = null, margin = 6) {
    for (const b of state.referenceBoxes.values()) {
      if (b.boxType !== 'compound' || b === exclude) continue;
      if (rect.x < b.x + b.width + margin && rect.x + rect.width + margin > b.x &&
          rect.y < b.y + b.height + margin && rect.y + rect.height + margin > b.y) {
        return b;
      }
    }
    return null;
  }

  /** Recuadro de compuesto cuyo borde está cerca de un punto (para unir flechas a recuadros) */
  static findBoxNearPoint(px, py, state, exclude = null, maxDist = 45) {
    let best = null, bestD = maxDist;
    for (const b of state.referenceBoxes.values()) {
      if (b.boxType !== 'compound' || b === exclude) continue;
      const d = this.distPointToBox(px, py, b);
      if (d < bestD) { bestD = d; best = b; }
    }
    return best;
  }

  /** ¿Ya hay una flecha que sale de 'src' y llega a 'tgt'? */
  static arrowConnects(src, tgt, state) {
    for (const a of state.arrows.values()) {
      if (this.distPointToBox(a.x1, a.y1, src) < 45 && this.distPointToBox(a.x2, a.y2, tgt) < 45) return true;
    }
    return false;
  }

  /**
   * Punto del borde de 'box' donde termina una flecha que sale de 'source' en la dirección 'dir'
   * (se usa al reutilizar un recuadro existente, p. ej. al cerrar un ciclo).
   */
  static arrowEndAtBox(source, box, dir, gap = 16) {
    const scx = source.x + source.width / 2, scy = source.y + source.height / 2;
    const bcx = box.x + box.width / 2, bcy = box.y + box.height / 2;
    if (dir === 'right') return { x1: source.x + source.width + gap, y1: scy, x2: box.x - gap, y2: bcy };
    if (dir === 'left') return { x1: source.x - gap, y1: scy, x2: box.x + box.width + gap, y2: bcy };
    if (dir === 'down') return { x1: scx, y1: source.y + source.height + gap, x2: bcx, y2: box.y - gap };
    return { x1: scx, y1: source.y - gap, x2: bcx, y2: box.y + box.height + gap };
  }

  /**
   * Modo problema sobre un dibujo existente, guiado por las flechas:
   *  1. Nodos = moléculas dibujadas + letras sueltas de intermediario (A, B, F...).
   *     Una letra justo debajo de una molécula es el nombre de esa molécula, no otro nodo.
   *  2. Cada flecha (también las de varios tramos, como una flecha sin punta seguida de otra)
   *     une el nodo de su cola con el de su punta; "+" une co-reactivos.
   *  3. Solo se enmarcan las moléculas que forman parte de la ruta (las de definiciones o
   *     abreviaturas sueltas se dejan como están). Sin flechas, se enmarcan todas.
   *  4. Las letras pasan a ser incógnitas con su misma letra. Las moléculas conocidas se rotulan
   *     en el orden de la síntesis: con números (1, 2...) si el examen ya usa letras para las
   *     incógnitas, o con letras (A, B, C...) si no hay ninguna.
   * Devuelve el número de recuadros creados.
   */
  static autoBoxExistingScheme(state) {
    state.saveSnapshot();
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
    const rectDist = (px, py, r) => {
      const cx = Math.max(r.minX, Math.min(px, r.maxX));
      const cy = Math.max(r.minY, Math.min(py, r.maxY));
      return Math.hypot(px - cx, py - cy);
    };
    const existingCompounds = Array.from(state.referenceBoxes.values()).filter(b => b.boxType === 'compound');
    const unknownSize = (text) => ({ W: Math.max(44, Math.round(text.length * 23 + 18)), H: 56 });

    // 1. Nodos
    const nodes = [];
    for (const mol of getAllMolecules(state)) {
      if (!mol.bbox || mol.atoms.length === 0) continue;
      const { centerX, centerY } = mol.bbox;
      if (existingCompounds.some(b => inside(b, centerX, centerY))) continue;
      nodes.push({ kind: 'mol', mol, rect: mol.bbox, cx: centerX, cy: centerY, letter: null });
    }
    const letterLabels = Array.from(state.textLabels.values())
      .filter(l => l.isIntermediary && l.text && String(l.text).trim().length <= 4);
    for (const l of letterLabels) {
      const text = String(l.text).trim();
      let owner = null, best = Infinity;
      for (const n of nodes) {
        if (n.kind !== 'mol' || n.letter) continue;
        const r = n.rect;
        // debajo de la molécula o sobre su mitad inferior (moléculas grandes con la letra encima)
        if (l.x < r.minX - 30 || l.x > r.maxX + 30 || l.y < Math.min(n.cy, r.maxY - 15) || l.y > r.maxY + 70) continue;
        const d = Math.abs(l.x - n.cx) + Math.abs(l.y - r.maxY);
        if (d < best) { best = d; owner = n; }
      }
      if (owner) {
        owner.letter = text;
        owner.letterLabel = l;
      } else {
        const { W, H } = unknownSize(text);
        const cy = l.y - 8;
        nodes.push({ kind: 'letter', label: l, letter: text, cx: l.x, cy,
          rect: { minX: l.x - W / 2, maxX: l.x + W / 2, minY: cy - H / 2, maxY: cy + H / 2 } });
      }
    }

    // 2. Tramos de flecha (las bifurcaciones y convergencias aportan dos tramos)
    const legs = [];
    for (const a of state.arrows.values()) {
      if (![a.x1, a.y1, a.x2, a.y2].every(Number.isFinite)) continue;
      if (a.type === 'fork') {
        const yTop = a.yTop !== undefined ? a.yTop : a.y1 - 75;
        const yBot = a.yBottom !== undefined ? a.yBottom : a.y1 + 75;
        legs.push({ sx: a.x1, sy: a.y1, ex: a.x2, ey: yTop }, { sx: a.x1, sy: a.y1, ex: a.x2, ey: yBot });
      } else if (a.type === 'converge') {
        const yTop = a.yTop !== undefined ? a.yTop : a.y2 - 75;
        const yBot = a.yBottom !== undefined ? a.yBottom : a.y2 + 75;
        legs.push({ sx: a.x1, sy: yTop, ex: a.x2, ey: a.y2 }, { sx: a.x1, sy: yBot, ex: a.x2, ey: a.y2 });
      } else if (getArrowBendCorner(a)) {
        // Flecha en "L": dos tramos que se encadenan por la esquina
        const c = getArrowBendCorner(a);
        legs.push({ sx: a.x1, sy: a.y1, ex: c.x, ey: c.y }, { sx: c.x, sy: c.y, ex: a.x2, ey: a.y2 });
      } else {
        legs.push({ sx: a.x1, sy: a.y1, ex: a.x2, ey: a.y2 });
      }
    }

    // Nodo más cercano a un extremo; se penaliza lo que queda "detrás" según el sentido de la flecha
    const TOL = 160;
    const nearestNode = (px, py, dx, dy, exclude) => {
      let found = null, bestScore = TOL;
      for (const n of nodes) {
        if (n === exclude) continue;
        const d = rectDist(px, py, n.rect);
        if (d > TOL) continue;
        const along = (n.cx - px) * dx + (n.cy - py) * dy;
        const score = d + (along < 0 && d > 0 ? -along * 0.5 : 0);
        if (score < bestScore) { bestScore = score; found = n; }
      }
      return found;
    };
    const dirOf = (g) => {
      const len = Math.hypot(g.ex - g.sx, g.ey - g.sy) || 1;
      return { dx: (g.ex - g.sx) / len, dy: (g.ey - g.sy) / len };
    };
    const JOIN = 14;
    // Cola: si no hay nodo, seguir hacia atrás por el tramo que termina aquí (flechas de varios tramos)
    const resolveStart = (g, seen = new Set()) => {
      if (seen.has(g)) return null;
      seen.add(g);
      const prev = legs.find(o => o !== g && Math.hypot(o.ex - g.sx, o.ey - g.sy) < JOIN);
      const { dx, dy } = dirOf(g);
      const n = nearestNode(g.sx, g.sy, -dx, -dy, null);
      if (n && (!prev || rectDist(g.sx, g.sy, n.rect) < 20)) return n;
      return prev ? resolveStart(prev, seen) : n;
    };
    const resolveEnd = (g, seen = new Set()) => {
      if (seen.has(g)) return null;
      seen.add(g);
      const next = legs.find(o => o !== g && Math.hypot(o.sx - g.ex, o.sy - g.ey) < JOIN);
      const { dx, dy } = dirOf(g);
      const n = nearestNode(g.ex, g.ey, dx, dy, null);
      if (n && (!next || rectDist(g.ex, g.ey, n.rect) < 20)) return n;
      return next ? resolveEnd(next, seen) : n;
    };

    const edges = new Map(); // nodo -> Set(nodos siguientes)
    const addEdge = (s, t) => {
      if (!s || !t || s === t) return;
      if (!edges.has(s)) edges.set(s, new Set());
      edges.get(s).add(t);
    };
    for (const g of legs) addEdge(resolveStart(g), resolveEnd(g));

    // "+" entre dos moléculas: el compañero comparte las mismas flechas (co-reactivo / co-producto)
    for (const plus of state.textLabels.values()) {
      if (String(plus.text).trim() !== '+') continue;
      const side = (left) => {
        let found = null, best = 90;
        for (const n of nodes) {
          if (n.kind !== 'mol') continue;
          if (plus.y < n.rect.minY - 30 || plus.y > n.rect.maxY + 30) continue;
          const d = left ? plus.x - n.rect.maxX : n.rect.minX - plus.x;
          if (d >= -5 && d < best) { best = d; found = n; }
        }
        return found;
      };
      const L = side(true), R = side(false);
      if (!L || !R) continue;
      for (const [a, b] of [[L, R], [R, L]]) {
        for (const t of (edges.get(a) || [])) addEdge(b, t);
        for (const [s, ts] of Array.from(edges.entries())) if (ts.has(a)) addEdge(s, b);
      }
    }

    // 3. Nodos que entran en la ruta
    const inRoute = new Set();
    for (const [s, ts] of edges) { inRoute.add(s); for (const t of ts) inRoute.add(t); }
    const noArrows = legs.length === 0;
    // (una molécula con su letra también es parte del examen aunque ninguna flecha la toque)
    const routeNodes = nodes.filter(n => n.kind === 'letter' || n.letter || noArrows || inRoute.has(n));

    // Orden de síntesis: orden topológico siguiendo las flechas (empates: izquierda→derecha, arriba→abajo)
    const geo = (a, b) => (a.cx - b.cx) || (a.cy - b.cy);
    const indeg = new Map(routeNodes.map(n => [n, 0]));
    for (const [s, ts] of edges) if (indeg.has(s)) for (const t of ts) if (indeg.has(t)) indeg.set(t, indeg.get(t) + 1);
    const ordered = [];
    const done = new Set();
    let queue = routeNodes.filter(n => indeg.get(n) === 0).sort(geo);
    while (ordered.length < routeNodes.length) {
      if (queue.length === 0) {
        // ciclo: seguir por el nodo pendiente más a la izquierda
        queue = [routeNodes.filter(n => !done.has(n)).sort(geo)[0]];
      }
      const n = queue.shift();
      if (done.has(n)) continue;
      done.add(n);
      ordered.push(n);
      const next = Array.from(edges.get(n) || []).filter(t => indeg.has(t) && !done.has(t));
      for (const t of next) indeg.set(t, indeg.get(t) - 1);
      queue.push(...next.filter(t => indeg.get(t) <= 0));
      queue.sort(geo);
    }

    // 4. Recuadros
    const usesLetters = nodes.some(n => n.letter);
    const usedLetters = new Set(nodes.filter(n => n.letter).map(n => n.letter.toUpperCase()));
    for (const b of state.referenceBoxes.values()) if (b.label) usedLetters.add(String(b.label).toUpperCase());
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let letterIdx = 0, numberIdx = 0;
    const nextKnownLabel = () => {
      if (usesLetters) {
        do { numberIdx++; } while (usedLetters.has(String(numberIdx)));
        usedLetters.add(String(numberIdx));
        return String(numberIdx);
      }
      while (letterIdx < alphabet.length && usedLetters.has(alphabet[letterIdx])) letterIdx++;
      const l = letterIdx < alphabet.length ? alphabet[letterIdx++] : `C${++numberIdx}`;
      usedLetters.add(l);
      return l;
    };

    let created = 0;
    const unknownBoxes = [];
    for (const n of ordered) {
      if (n.kind === 'mol') {
        const { centerX, centerY, width, height } = n.rect;
        const halfW = Math.max(70, Math.round(width / 2 + 26));
        const halfH = Math.max(55, Math.round(height / 2 + 28));
        state.addReferenceBox({
          boxType: 'compound', label: n.letter || nextKnownLabel(),
          x: Math.round(centerX - halfW), y: Math.round(centerY - halfH), width: halfW * 2, height: halfH * 2
        });
        if (n.letterLabel) state.removeTextLabel(n.letterLabel.id);
      } else {
        const { W, H } = unknownSize(n.letter);
        const box = state.addReferenceBox({
          boxType: 'compound', label: n.letter,
          x: Math.round(n.cx - W / 2), y: Math.round(n.cy - H / 2), width: W, height: H,
          unknownLetter: n.letter, manualUnknown: true, isUnknown: true, compacted: true
        });
        unknownBoxes.push(box);
        state.removeTextLabel(n.label.id);
      }
      created++;
    }

    // 5. Texto pequeño justo debajo de una incógnita (su fórmula) -> fórmula del recuadro
    for (const l of Array.from(state.textLabels.values())) {
      if (l.isIntermediary || !l.text) continue;
      const box = unknownBoxes.find(b => Math.abs(l.x - (b.x + b.width / 2)) < 40 &&
        l.y > b.y + b.height / 2 && l.y < b.y + b.height + 40);
      if (box && !box.description) {
        box.description = String(l.text).trim();
        state.removeTextLabel(l.id);
      }
    }

    this.assignUnknownLetters(state);
    return created;
  }

  /**
   * Crea un paso inicial de reacción: [ Recuadro A ] ────> [ Recuadro B ]
   */
  static createInitialStep(startX, startY, state) {
    state.saveSnapshot();

    const boxWidth = 140;
    const boxHeight = 110;
    const arrowLength = 110;
    const gap = 16;

    const labelA = this.getNextLabel(state);
    const boxA = state.addReferenceBox({
      boxType: 'compound',
      label: labelA,
      x: startX,
      y: startY - boxHeight / 2,
      width: boxWidth,
      height: boxHeight
    });

    const arrowX1 = boxA.x + boxA.width + gap;
    const arrowY = startY;
    const arrowX2 = arrowX1 + arrowLength;

    const arrow = state.addArrow({
      x1: arrowX1,
      y1: arrowY,
      x2: arrowX2,
      y2: arrowY,
      type: 'normal',
      reagentsTop: '',
      reagentsBottom: ''
    });

    const labelB = this.getNextLabel(state);
    const boxB = state.addReferenceBox({
      boxType: 'compound',
      label: labelB,
      x: arrowX2 + gap,
      y: startY - boxHeight / 2,
      width: boxWidth,
      height: boxHeight
    });

    this.assignUnknownLetters(state);

    return { boxA, arrow, boxB };
  }

  /**
   * Extiende un esquema a partir de un recuadro existente en una dirección (right, down, up, left)
   */
  static extendFromBox(sourceBox, direction = 'right', state) {
    state.saveSnapshot();

    const boxWidth = sourceBox.width || 140;
    const boxHeight = sourceBox.height || 110;
    const arrowLength = (direction === 'down' || direction === 'up') ? 76 : 110;
    const gap = 16;

    let arrowX1, arrowY1, arrowX2, arrowY2;
    let newBoxX, newBoxY;

    if (direction === 'right') {
      arrowX1 = sourceBox.x + sourceBox.width + gap;
      arrowY1 = sourceBox.y + sourceBox.height / 2;
      arrowX2 = arrowX1 + arrowLength;
      arrowY2 = arrowY1;
      newBoxX = arrowX2 + gap;
      newBoxY = sourceBox.y;
    } else if (direction === 'down') {
      arrowX1 = sourceBox.x + sourceBox.width / 2;
      arrowY1 = sourceBox.y + sourceBox.height + gap;
      arrowX2 = arrowX1;
      arrowY2 = arrowY1 + arrowLength;
      newBoxX = sourceBox.x;
      newBoxY = arrowY2 + gap;
    } else if (direction === 'up') {
      arrowX1 = sourceBox.x + sourceBox.width / 2;
      arrowY1 = sourceBox.y - gap;
      arrowX2 = arrowX1;
      arrowY2 = arrowY1 - arrowLength;
      newBoxX = sourceBox.x;
      newBoxY = arrowY2 - boxHeight - gap;
    } else { // left
      arrowX1 = sourceBox.x - gap;
      arrowY1 = sourceBox.y + sourceBox.height / 2;
      arrowX2 = arrowX1 - arrowLength;
      arrowY2 = arrowY1;
      newBoxX = arrowX2 - boxWidth - gap;
      newBoxY = sourceBox.y;
    }

    // Si el nuevo recuadro caería encima de uno existente (p. ej. clics repetidos o cerrar un
    // ciclo), se reutiliza ese recuadro en vez de encimar otro
    const existing = this.findOverlappingBox({ x: newBoxX, y: newBoxY, width: boxWidth, height: boxHeight }, state, sourceBox);
    if (existing) {
      if (this.arrowConnects(sourceBox, existing, state)) {
        return { arrow: null, newBox: existing, reused: true };
      }
      const p = this.arrowEndAtBox(sourceBox, existing, direction);
      const arrowToExisting = state.addArrow({ ...p, type: 'normal', reagentsTop: '', reagentsBottom: '' });
      this.assignUnknownLetters(state);
      return { arrow: arrowToExisting, newBox: existing, reused: true };
    }

    const arrow = state.addArrow({
      x1: arrowX1,
      y1: arrowY1,
      x2: arrowX2,
      y2: arrowY2,
      type: 'normal',
      reagentsTop: '',
      reagentsBottom: ''
    });

    const nextLabel = this.getNextLabel(state);
    const newBox = state.addReferenceBox({
      boxType: 'compound',
      label: nextLabel,
      unknownLetter: nextLabel,
      x: newBoxX,
      y: newBoxY,
      width: boxWidth,
      height: boxHeight
    });

    this.assignUnknownLetters(state);

    return { arrow, newBox };
  }

  /**
   * Bifurca el esquema desde un recuadro origen para rutas paralelas / estereoquímica (Anti / Syn).
   * Genera una flecha de bifurcación (fork arrow) y dos recuadros de compuestos paralelos (arriba y abajo).
   */
  static createForkStep(sourceBox, state, direction = null) {
    state.saveSnapshot();

    const dir = direction || sourceBox.activeAxis || 'right';
    const boxWidth = sourceBox.width || 140;
    const boxHeight = sourceBox.height || 110;
    const branchSpacing = 150;
    const gap = 16;
    const stemLen = 70;
    const branchLen = 50;

    let arrowX1, arrowY1, arrowX2, arrowY2, stemEndX, stemEndY;
    let yTop, yBottom, xTop, xBottom;
    let box1X, box1Y, box2X, box2Y;

    if (dir === 'left') {
      arrowX1 = sourceBox.x - gap;
      arrowY1 = sourceBox.y + sourceBox.height / 2;
      stemEndX = arrowX1 - stemLen;
      arrowX2 = stemEndX - branchLen;
      arrowY2 = arrowY1;
      yTop = arrowY1 - branchSpacing / 2;
      yBottom = arrowY1 + branchSpacing / 2;
      box1X = arrowX2 - gap - boxWidth;
      box1Y = yTop - boxHeight / 2;
      box2X = arrowX2 - gap - boxWidth;
      box2Y = yBottom - boxHeight / 2;
    } else if (dir === 'down') {
      arrowX1 = sourceBox.x + sourceBox.width / 2;
      arrowY1 = sourceBox.y + sourceBox.height + gap;
      stemEndY = arrowY1 + stemLen;
      arrowX2 = arrowX1;
      arrowY2 = stemEndY + branchLen;
      xTop = arrowX1 - branchSpacing / 2;
      xBottom = arrowX1 + branchSpacing / 2;
      box1X = xTop - boxWidth / 2;
      box1Y = arrowY2 + gap;
      box2X = xBottom - boxWidth / 2;
      box2Y = arrowY2 + gap;
    } else if (dir === 'up') {
      arrowX1 = sourceBox.x + sourceBox.width / 2;
      arrowY1 = sourceBox.y - gap;
      stemEndY = arrowY1 - stemLen;
      arrowX2 = arrowX1;
      arrowY2 = stemEndY - branchLen;
      xTop = arrowX1 - branchSpacing / 2;
      xBottom = arrowX1 + branchSpacing / 2;
      box1X = xTop - boxWidth / 2;
      box1Y = arrowY2 - gap - boxHeight;
      box2X = xBottom - boxWidth / 2;
      box2Y = arrowY2 - gap - boxHeight;
    } else { // 'right'
      arrowX1 = sourceBox.x + sourceBox.width + gap;
      arrowY1 = sourceBox.y + sourceBox.height / 2;
      stemEndX = arrowX1 + stemLen;
      arrowX2 = stemEndX + branchLen;
      arrowY2 = arrowY1;
      yTop = arrowY1 - branchSpacing / 2;
      yBottom = arrowY1 + branchSpacing / 2;
      box1X = arrowX2 + gap;
      box1Y = yTop - boxHeight / 2;
      box2X = arrowX2 + gap;
      box2Y = yBottom - boxHeight / 2;
    }

    const forkArrow = state.addArrow({
      x1: arrowX1,
      y1: arrowY1,
      x2: arrowX2,
      y2: arrowY2,
      type: 'fork',
      direction: dir,
      stemEndX,
      stemEndY,
      branchSpacing,
      yTop,
      yBottom,
      xTop,
      xBottom,
      reagentsTop: '',
      reagentsBottom: ''
    });

    // Ramas: reutilizar un recuadro existente si la posición ya está ocupada
    const makeBranchBox = (bx, by) => {
      const existing = this.findOverlappingBox({ x: bx, y: by, width: boxWidth, height: boxHeight }, state, sourceBox);
      if (existing) return existing;
      const label = this.getNextLabel(state);
      return state.addReferenceBox({
        boxType: 'compound', label, unknownLetter: label,
        x: bx, y: by, width: boxWidth, height: boxHeight
      });
    };
    const boxTop = makeBranchBox(box1X, box1Y);
    const boxBottom = makeBranchBox(box2X, box2Y);

    this.assignUnknownLetters(state);

    return { forkArrow, boxTop, boxBottom };
  }

  /**
   * Cierra una bifurcación: dos compuestos (superior e inferior) convergen
   * mediante una flecha de convergencia hacia un único producto final.
   */
  static createConvergeStep(sourceBoxTop, sourceBoxBottom, state) {
    state.saveSnapshot();

    const boxWidth = 140;
    const boxHeight = 110;
    const gap = 16;
    const branchLen = 45;
    const stemLen = 80;

    const x1 = Math.max(sourceBoxTop.x + sourceBoxTop.width, sourceBoxBottom.x + sourceBoxBottom.width) + gap;
    const yTop = sourceBoxTop.y + sourceBoxTop.height / 2;
    const yBottom = sourceBoxBottom.y + sourceBoxBottom.height / 2;
    const yMid = (yTop + yBottom) / 2;
    const stemStartX = x1 + branchLen;
    const x2 = stemStartX + stemLen;

    const convergeArrow = state.addArrow({
      x1,
      y1: yMid,
      x2,
      y2: yMid,
      type: 'converge',
      yTop,
      yBottom,
      yMid,
      stemStartX,
      branchSpacing: Math.abs(yBottom - yTop),
      reagentsTop: '',
      reagentsBottom: ''
    });

    const tgtRect = { x: x2 + gap, y: yMid - boxHeight / 2, width: boxWidth, height: boxHeight };
    let targetBox = this.findOverlappingBox(tgtRect, state);
    if (!targetBox) {
      const nextLabel = this.getNextLabel(state);
      targetBox = state.addReferenceBox({ boxType: 'compound', label: nextLabel, ...tgtRect });
    }

    this.assignUnknownLetters(state);

    return { convergeArrow, targetBox };
  }

  /**
   * Encuentra todos los átomos de las moléculas que están dentro o intersectan un recuadro de compuesto.
   * Expande a través de los enlaces para asegurar que toda la molécula (ej. carbonilo =O, oxima, etc.)
   * se mantenga íntegra y nunca se corte o rompa.
   */
  static getAtomsInsideBox(box, state) {
    if (!state || !state.atoms) return [];
    const minX = box.x;
    const maxX = box.x + box.width;
    const minY = box.y;
    const maxY = box.y + box.height;

    const seedAtoms = [];
    for (const atom of state.atoms.values()) {
      if (atom.x >= minX - 15 && atom.x <= maxX + 15 && atom.y >= minY - 15 && atom.y <= maxY + 15) {
        seedAtoms.push(atom);
      }
    }

    if (seedAtoms.length === 0) return [];

    const visited = new Set();
    for (const seed of seedAtoms) {
      if (!visited.has(seed.id)) {
        const molAtoms = getConnectedMoleculeAtoms(seed.id, state);
        for (const ma of molAtoms) {
          visited.add(ma.id);
        }
      }
    }

    return Array.from(visited).map(id => state.getAtom(id)).filter(Boolean);
  }

  /**
   * Auto-ajusta el tamaño y posición de un recuadro según las moléculas que contiene
   */
  static autoFitBox(box, state, padding = 26) {
    if (box.boxType !== 'compound') return false;

    const atoms = this.getAtomsInsideBox(box, state);
    if (atoms.length === 0) return false;

    const bbox = getMoleculeBoundingBox(atoms, state, 2.0);
    if (!bbox) return false;

    const padX = padding;
    const padY = 28;

    const halfW = Math.max(70, Math.round(bbox.width / 2 + padX));
    const halfH = Math.max(55, Math.round(bbox.height / 2 + padY));

    box.width = halfW * 2;
    box.height = halfH * 2;
    box.x = Math.round(bbox.centerX - halfW);
    box.y = Math.round(bbox.centerY - halfH);

    return true;
  }

  /**
   * Auto-ajusta todos los recuadros de compuestos del lienzo
   */
  static autoFitAllBoxes(state) {
    let changed = false;
    for (const box of state.referenceBoxes.values()) {
      if (box.boxType === 'compound') {
        if (this.autoFitBox(box, state)) changed = true;
      }
    }
    return changed;
  }

  /**
   * Asigna automáticamente letras correlativas de incógnita (A, B, C...) a los recuadros
   * de compuestos que queden vacíos (sin estructura) dentro del flujo de reacción.
   */
  static assignUnknownLetters(state) {
    if (!state || !state.referenceBoxes) return;

    const compoundBoxes = Array.from(state.referenceBoxes.values())
      .filter(b => b.boxType === 'compound');

    if (compoundBoxes.length === 0) return;

    // 1. Construir grafo dirigido según las flechas de reacción para determinar el orden de síntesis
    const adj = new Map();
    const inDegree = new Map();
    for (const b of compoundBoxes) {
      adj.set(b.id, new Set());
      inDegree.set(b.id, 0);
    }

    const distPointToBox = (px, py, b) => {
      const clampX = Math.max(b.x, Math.min(px, b.x + b.width));
      const clampY = Math.max(b.y, Math.min(py, b.y + b.height));
      return Math.hypot(px - clampX, py - clampY);
    };

    const arrows = Array.from(state.arrows.values());
    for (const arrow of arrows) {
      if (arrow.type === 'normal') {
        let src = null, minSrcDist = 80;
        for (const b of compoundBoxes) {
          const d = distPointToBox(arrow.x1, arrow.y1, b);
          if (d < minSrcDist) { minSrcDist = d; src = b; }
        }
        let tgt = null, minTgtDist = 80;
        for (const b of compoundBoxes) {
          if (b === src) continue;
          const d = distPointToBox(arrow.x2, arrow.y2, b);
          if (d < minTgtDist) { minTgtDist = d; tgt = b; }
        }
        if (src && tgt && !adj.get(src.id).has(tgt.id)) {
          adj.get(src.id).add(tgt.id);
          inDegree.set(tgt.id, inDegree.get(tgt.id) + 1);
        }
      } else if (arrow.type === 'fork') {
        let src = null, minSrcDist = 80;
        for (const b of compoundBoxes) {
          const d = distPointToBox(arrow.x1, arrow.y1, b);
          if (d < minSrcDist) { minSrcDist = d; src = b; }
        }
        const yTop = arrow.yTop !== undefined ? arrow.yTop : (arrow.y1 - 75);
        const yBot = arrow.yBottom !== undefined ? arrow.yBottom : (arrow.y1 + 75);
        let tgtTop = null, minTopDist = 80;
        let tgtBot = null, minBotDist = 80;
        for (const b of compoundBoxes) {
          if (b === src) continue;
          const dTop = distPointToBox(arrow.x2, yTop, b);
          if (dTop < minTopDist) { minTopDist = dTop; tgtTop = b; }
          const dBot = distPointToBox(arrow.x2, yBot, b);
          if (dBot < minBotDist) { minBotDist = dBot; tgtBot = b; }
        }
        if (src && tgtTop && !adj.get(src.id).has(tgtTop.id)) {
          adj.get(src.id).add(tgtTop.id);
          inDegree.set(tgtTop.id, inDegree.get(tgtTop.id) + 1);
        }
        if (src && tgtBot && !adj.get(src.id).has(tgtBot.id)) {
          adj.get(src.id).add(tgtBot.id);
          inDegree.set(tgtBot.id, inDegree.get(tgtBot.id) + 1);
        }
      } else if (arrow.type === 'converge') {
        const yTop = arrow.yTop !== undefined ? arrow.yTop : (arrow.y2 - 75);
        const yBot = arrow.yBottom !== undefined ? arrow.yBottom : (arrow.y2 + 75);
        let srcTop = null, minSrcTopDist = 80;
        let srcBot = null, minSrcBotDist = 80;
        for (const b of compoundBoxes) {
          const dTop = distPointToBox(arrow.x1, yTop, b);
          if (dTop < minSrcTopDist) { minSrcTopDist = dTop; srcTop = b; }
          const dBot = distPointToBox(arrow.x1, yBot, b);
          if (dBot < minSrcBotDist) { minSrcBotDist = dBot; srcBot = b; }
        }
        let tgt = null, minTgtDist = 80;
        for (const b of compoundBoxes) {
          if (b === srcTop || b === srcBot) continue;
          const d = distPointToBox(arrow.x2, arrow.y2, b);
          if (d < minTgtDist) { minTgtDist = d; tgt = b; }
        }
        if (srcTop && tgt && !adj.get(srcTop.id).has(tgt.id)) {
          adj.get(srcTop.id).add(tgt.id);
          inDegree.set(tgt.id, inDegree.get(tgt.id) + 1);
        }
        if (srcBot && tgt && !adj.get(srcBot.id).has(tgt.id)) {
          adj.get(srcBot.id).add(tgt.id);
          inDegree.set(tgt.id, inDegree.get(tgt.id) + 1);
        }
      }
    }

    // 2. Ordenamiento topológico siguiendo la síntesis (flechas)
    const ordered = [];
    const queue = compoundBoxes.filter(b => inDegree.get(b.id) === 0);
    // Ordenar orígenes por X ascendente y luego Y ascendente
    queue.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);

    const visited = new Set();
    while (queue.length > 0) {
      const curr = queue.shift();
      if (visited.has(curr.id)) continue;
      visited.add(curr.id);
      ordered.push(curr);

      const nextBoxes = Array.from(adj.get(curr.id)).map(id => state.referenceBoxes.get(id)).filter(Boolean);
      nextBoxes.sort((a, b) => a.y - b.y);
      for (const nxt of nextBoxes) {
        inDegree.set(nxt.id, inDegree.get(nxt.id) - 1);
        if (inDegree.get(nxt.id) <= 0 && !visited.has(nxt.id)) {
          queue.push(nxt);
        }
      }
    }

    // Agregar cualquier recuadro no alcanzado por flechas en orden geométrico (x, y)
    for (const b of compoundBoxes) {
      if (!visited.has(b.id)) {
        ordered.push(b);
        visited.add(b.id);
      }
    }

    // 3. Asignar letras correlativas a las cajas vacías (incógnitas)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const usedManualLetters = new Set();
    for (const box of ordered) {
      if (box.manualUnknown && box.unknownLetter) {
        usedManualLetters.add(String(box.unknownLetter).trim().toUpperCase());
      }
    }

    let unknownIdx = 0;
    for (const box of ordered) {
      const atoms = this.getAtomsInsideBox(box, state);
      if (atoms.length === 0) {
        box.isUnknown = true;
        if (!box.manualUnknown) {
          // Si el rótulo de esquina es A, B, C, D... usarlo para coincidir exactamente con el esquema del estudiante
          const candidate = (box.label && /^[A-Z]$/.test(box.label.trim())) 
            ? box.label.trim() 
            : alphabet[unknownIdx % alphabet.length];
          
          if (!usedManualLetters.has(candidate)) {
            box.unknownLetter = candidate;
          } else {
            while (usedManualLetters.has(alphabet[unknownIdx % alphabet.length]) && unknownIdx < 52) {
              unknownIdx++;
            }
            box.unknownLetter = alphabet[unknownIdx % alphabet.length];
          }
          unknownIdx++;
        }
      } else {
        box.isUnknown = false;
        box.unknownLetter = null;
        box.manualUnknown = false;
      }
    }

  }

  /**
   * Al encajar el esquema, las incógnitas vacías al final de la ruta ocupan solo lo que mide
   * su letra (estilo IChO: "→ H1") en vez del tamaño de un recuadro de molécula.
   * No se hace al crear los recuadros, para que haya espacio donde dibujar la molécula.
   */
  static compactLeafUnknowns(state) {
    for (const box of state.referenceBoxes.values()) {
      if (box.boxType !== 'compound') continue;
      if (this.getAtomsInsideBox(box, state).length > 0) continue;
      this.compactEmptyBox(box, state);
    }
  }

  /**
   * Reduce un recuadro de incógnita vacío (al final de la ruta) al tamaño de su letra,
   * conservando el lado por el que llega su flecha para que la letra quede junto a la punta.
   * Los recuadros redimensionados a mano (userSized) no se tocan.
   */
  static compactEmptyBox(box, state) {
    if (!box || box.userSized) return;
    const letter = String(box.unknownLetter || box.label || 'A').trim() || 'A';
    const W = Math.max(44, Math.round(letter.length * 23 + 18));
    const H = 56;
    if (Math.abs(box.width - W) < 0.5 && Math.abs(box.height - H) < 0.5) return;

    const distToBox = (px, py) => {
      const cx = Math.max(box.x, Math.min(px, box.x + box.width));
      const cy = Math.max(box.y, Math.min(py, box.y + box.height));
      return Math.hypot(px - cx, py - cy);
    };

    // Puntos donde llegan / salen flechas, con su dirección
    const ends = [];
    const starts = [];
    for (const a of state.arrows.values()) {
      const sx = Math.sign(a.x2 - a.x1);
      const sy = Math.sign(a.y2 - a.y1);
      const horizontal = Math.abs(a.x2 - a.x1) >= Math.abs(a.y2 - a.y1);
      const dir = horizontal ? { dx: sx, dy: 0 } : { dx: 0, dy: sy };
      if (a.type === 'fork') {
        if (horizontal) {
          ends.push({ x: a.x2, y: a.yTop !== undefined ? a.yTop : a.y2, dir });
          ends.push({ x: a.x2, y: a.yBottom !== undefined ? a.yBottom : a.y2, dir });
        } else {
          ends.push({ x: a.xTop !== undefined ? a.xTop : a.x2, y: a.y2, dir });
          ends.push({ x: a.xBottom !== undefined ? a.xBottom : a.x2, y: a.y2, dir });
        }
        starts.push({ x: a.x1, y: a.y1, dir });
      } else if (a.type === 'converge') {
        ends.push({ x: a.x2, y: a.y2, dir });
        starts.push({ x: a.x1, y: a.yTop !== undefined ? a.yTop : a.y1, dir });
        starts.push({ x: a.x1, y: a.yBottom !== undefined ? a.yBottom : a.y1, dir });
      } else {
        ends.push({ x: a.x2, y: a.y2, dir });
        starts.push({ x: a.x1, y: a.y1, dir });
      }
    }
    const nearest = (pts) => {
      let best = null, bestD = 80;
      for (const p of pts) {
        const d = distToBox(p.x, p.y);
        if (d < bestD) { bestD = d; best = p; }
      }
      return best;
    };

    // Solo se compactan incógnitas al final de la ruta (sin flecha de salida): si ya sale una
    // flecha, encoger el recuadro la separaría de él y el esquema dejaría de reconocer la conexión.
    // Al extender desde una incógnita compacta, la flecha nueva ya nace junto a su letra.
    if (nearest(starts)) return;

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    let nx = cx - W / 2;
    let ny = cy - H / 2;

    const incoming = nearest(ends);
    if (incoming) {
      // Conservar el lado por el que entra la flecha, para que la letra quede junto a la punta
      if (incoming.dir.dx > 0) nx = box.x;
      else if (incoming.dir.dx < 0) nx = box.x + box.width - W;
      else if (incoming.dir.dy > 0) ny = box.y;
      else if (incoming.dir.dy < 0) ny = box.y + box.height - H;
    }

    box.x = Math.round(nx);
    box.y = Math.round(ny);
    box.width = W;
    box.height = H;
    box.compacted = true;
  }
}
