import { getMoleculeBoundingBox, getAllMolecules, getConnectedMoleculeAtoms, getArrowBendCorner } from './elements.js';
import { ProblemBuilder } from './problem-builder.js';
import { ArrowRenderer } from '../render/arrow-renderer.js';

export class ChemAligner {
  /**
   * Obtiene el cuadro delimitador (bounding box) de un conjunto de átomos o elementos
   */
  static getBoundingBox(items, state = null) {
    if (!items || items.length === 0) return null;
    if (state && items[0] && items[0].element !== undefined) {
      return getMoleculeBoundingBox(items, state, 3.0);
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const item of items) {
      const x = item.x !== undefined ? item.x : (item.x1 + item.x2) / 2;
      const y = item.y !== undefined ? item.y : (item.y1 + item.y2) / 2;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    return {
      minX, minY, maxX, maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }

  /**
   * Ajusta automáticamente todas las flechas del lienzo para que respeten
   * el cuadro delimitador (cuadrado / bounding box) de las moléculas y nunca se las coman.
   */
  static adjustArrowsToMolecules(state, definedGap = 22) {
    if (!state || !state.arrows || state.arrows.size === 0) return 0;
    const molecules = getAllMolecules(state);
    if (molecules.length === 0) return 0;

    let adjustedCount = 0;

    for (const arrow of state.arrows.values()) {
      // Las flechas dobladas en "L" las coloca el usuario: no se recorren en diagonal
      if (arrow.bend) continue;
      const dx = arrow.x2 - arrow.x1;
      const dy = arrow.y2 - arrow.y1;
      const len = Math.hypot(dx, dy);
      if (len < 5) continue;

      let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (angleDeg < 0) angleDeg += 360;

      const isRight = (angleDeg <= 35 || angleDeg >= 325);
      const isLeft = (angleDeg >= 145 && angleDeg <= 215);
      const isDown = (angleDeg >= 55 && angleDeg <= 125);
      const isUp = (angleDeg >= 235 && angleDeg <= 305);

      for (const mol of molecules) {
        const bbox = mol.bbox;
        if (!bbox) continue;

        // Si la molécula pertenece a un recuadro de compuesto, la posición de la flecha la maneja el recuadro
        let insideCompoundBox = false;
        for (const box of state.referenceBoxes.values()) {
          if (box.boxType === 'compound' && bbox) {
            if (bbox.centerX >= box.x && bbox.centerX <= box.x + box.width &&
                bbox.centerY >= box.y && bbox.centerY <= box.y + box.height) {
              insideCompoundBox = true;
              break;
            }
          }
        }
        if (insideCompoundBox) continue;

        // 1. Verificar si el INICIO de la flecha sale de esta molécula o está dentro/cerca de su caja
        const startNearX = arrow.x1 >= bbox.minX - 15 && arrow.x1 <= bbox.maxX + 15;
        const startNearY = arrow.y1 >= bbox.minY - 15 && arrow.y1 <= bbox.maxY + 15;

        if (startNearX && startNearY) {
          if (isRight) {
            // Flecha saliendo hacia la derecha: debe iniciar fuera del flanco derecho
            const targetX = bbox.maxX + definedGap;
            if (arrow.x1 < targetX) {
              const delta = targetX - arrow.x1;
              arrow.x1 = targetX;
              // Si la punta quedó comida o muy corta, mover también la punta
              if (arrow.x2 <= arrow.x1 + 30) arrow.x2 = arrow.x1 + Math.max(60, len);
              adjustedCount++;
            }
          } else if (isLeft) {
            const targetX = bbox.minX - definedGap;
            if (arrow.x1 > targetX) {
              arrow.x1 = targetX;
              if (arrow.x2 >= arrow.x1 - 30) arrow.x2 = arrow.x1 - Math.max(60, len);
              adjustedCount++;
            }
          } else if (isDown) {
            const targetY = bbox.maxY + definedGap;
            if (arrow.y1 < targetY) {
              arrow.y1 = targetY;
              if (arrow.y2 <= arrow.y1 + 30) arrow.y2 = arrow.y1 + Math.max(60, len);
              adjustedCount++;
            }
          } else if (isUp) {
            const targetY = bbox.minY - definedGap;
            if (arrow.y1 > targetY) {
              arrow.y1 = targetY;
              if (arrow.y2 >= arrow.y1 - 30) arrow.y2 = arrow.y1 - Math.max(60, len);
              adjustedCount++;
            }
          }
        }

        // 2. Verificar si el FINAL de la flecha llega a esta molécula
        const endNearX = arrow.x2 >= bbox.minX - 15 && arrow.x2 <= bbox.maxX + 15;
        const endNearY = arrow.y2 >= bbox.minY - 15 && arrow.y2 <= bbox.maxY + 15;

        if (endNearX && endNearY) {
          if (isRight) {
            // Flecha llegando desde la izquierda: la punta debe detenerse antes del flanco izquierdo
            const targetX = bbox.minX - definedGap;
            if (arrow.x2 > targetX) {
              arrow.x2 = targetX;
              adjustedCount++;
            }
          } else if (isLeft) {
            const targetX = bbox.maxX + definedGap;
            if (arrow.x2 < targetX) {
              arrow.x2 = targetX;
              adjustedCount++;
            }
          } else if (isDown) {
            const targetY = bbox.minY - definedGap;
            if (arrow.y2 > targetY) {
              arrow.y2 = targetY;
              adjustedCount++;
            }
          } else if (isUp) {
            const targetY = bbox.maxY + definedGap;
            if (arrow.y2 < targetY) {
              arrow.y2 = targetY;
              adjustedCount++;
            }
          }
        }
      }
    }

    return adjustedCount;
  }

  /**
   * Centra automáticamente un compuesto / intermediario entre dos flechas consecutivas
   * @param {Object} leftArrow - Flecha previa
   * @param {Object} rightArrow - Flecha posterior
   * @param {Array<Object>|Object} intermediate - Átomos de la molécula o rótulo de intermediario
   * @param {number} definedGap - Espacio deseado entre punta de flecha y molécula (ej. 25px)
   */
  static centerBetweenArrows(leftArrow, rightArrow, intermediate, definedGap = 30) {
    // Si la orientación principal es horizontal
    const leftTipX = Math.max(leftArrow.x1, leftArrow.x2);
    const leftTipY = (leftArrow.y1 + leftArrow.y2) / 2;

    const rightStartX = Math.min(rightArrow.x1, rightArrow.x2);
    const rightStartY = (rightArrow.y1 + rightArrow.y2) / 2;

    const targetCenterX = (leftTipX + rightStartX) / 2;
    const targetCenterY = (leftTipY + rightStartY) / 2;

    if (Array.isArray(intermediate)) {
      // Es una molécula formada por varios átomos
      const bbox = this.getBoundingBox(intermediate);
      if (!bbox) return;
      const shiftX = targetCenterX - bbox.centerX;
      const shiftY = targetCenterY - bbox.centerY;

      for (const atom of intermediate) {
        atom.x += shiftX;
        atom.y += shiftY;
      }

      // Si la molécula es más ancha que el espacio entre flechas, ajustar las flechas hacia afuera
      const newBbox = this.getBoundingBox(intermediate);
      if (leftTipX > newBbox.minX - definedGap) {
        const delta = leftTipX - (newBbox.minX - definedGap);
        leftArrow.x1 -= delta;
        leftArrow.x2 -= delta;
      }
      if (rightStartX < newBbox.maxX + definedGap) {
        const delta = (newBbox.maxX + definedGap) - rightStartX;
        rightArrow.x1 += delta;
        rightArrow.x2 += delta;
      }
    } else if (intermediate) {
      // Es un rótulo o entidad individual
      intermediate.x = targetCenterX;
      intermediate.y = targetCenterY;
    }
  }

  /**
   * Alinea los centros verticales (mismo eje Y horizontal) de los elementos seleccionados
   */
  static alignHorizontalCenters(elements) {
    if (!elements || elements.length < 2) return;
    let sumY = 0;
    let count = 0;

    for (const el of elements) {
      if (el.y !== undefined) {
        sumY += el.y;
        count++;
      } else if (el.y1 !== undefined && el.y2 !== undefined) {
        sumY += (el.y1 + el.y2) / 2;
        count++;
      }
    }

    const avgY = sumY / count;

    for (const el of elements) {
      if (el.y !== undefined) {
        el.y = avgY;
      } else if (el.y1 !== undefined && el.y2 !== undefined) {
        const h = el.y2 - el.y1;
        el.y1 = avgY - h / 2;
        el.y2 = avgY + h / 2;
      }
    }
  }

  /**
   * Alinea los centros horizontales (mismo eje X vertical) de los elementos seleccionados
   */
  static alignVerticalCenters(elements) {
    if (!elements || elements.length < 2) return;
    let sumX = 0;
    let count = 0;

    for (const el of elements) {
      if (el.x !== undefined) {
        sumX += el.x;
        count++;
      } else if (el.x1 !== undefined && el.x2 !== undefined) {
        sumX += (el.x1 + el.x2) / 2;
        count++;
      }
    }

    const avgX = sumX / count;

    for (const el of elements) {
      if (el.x !== undefined) {
        el.x = avgX;
      } else if (el.x1 !== undefined && el.x2 !== undefined) {
        const w = el.x2 - el.x1;
        el.x1 = avgX - w / 2;
        el.x2 = avgX + w / 2;
      }
    }
  }

  /**
   * Obtiene todos los átomos de las moléculas que pertenecen o intersectan un recuadro.
   * Garantiza que si un átomo (ej. benceno) está en el recuadro, TODOS los átomos conectados
   * (ej. carbonilo, oxima, OH, metilo) se incluyan íntegramente.
   */
  static getAtomsForBox(box, state, customMinX = null, customMaxX = null, customMinY = null, customMaxY = null) {
    if (!state || !state.atoms) return [];
    const minX = customMinX !== null ? customMinX : box.x;
    const maxX = customMaxX !== null ? customMaxX : box.x + box.width;
    const minY = customMinY !== null ? customMinY : box.y;
    const maxY = customMaxY !== null ? customMaxY : box.y + box.height;

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
   * Encaja y maqueta automáticamente todo el esquema de reacción:
   * 1. Auto-ajusta los recuadros de compuestos a las moléculas que contienen.
   * 2. Ajusta la longitud de cada flecha según los textos de reactivos arriba y abajo.
   * 3. Reposiciona compuestos y flechas de forma armónica para que NUNCA se coman ningún compuesto.
   * 4. Alinea los centros a lo largo del eje del esquema (IChO Editorial).
   */
  static fitSchemeLayout(state) {
    if (!state) return;
    state.saveSnapshot();

    // La maquetación completa necesita los recuadros de compuesto del Modo Problema para saber
    // qué conecta cada flecha. En esquemas dibujados a mano (letras sueltas A, B, C... como texto,
    // ramas hacia abajo, etc.) reacomodarlo todo encimaba flechas y rótulos; ahí solo se separan
    // las flechas de las moléculas, sin mover nada más.
    const hasCompoundBoxes = Array.from(state.referenceBoxes.values()).some(b => b.boxType === 'compound');
    if (!hasCompoundBoxes) {
      this.adjustArrowsToMolecules(state, 18);
      return;
    }

    const molecules = getAllMolecules(state);

    // Conexiones flecha-recuadro antes de mover nada (para las flechas en "L" y lo que cuelga de ellas)
    const links = new Map();
    const splitSources = new Map(); // recuadros de origen de bifurcaciones y convergencias
    const splitTargets = new Map();
    for (const arrow of state.arrows.values()) {
      if (arrow.type === 'fork' || arrow.type === 'converge') {
        const ys = arrow.type === 'fork' ? [arrow.y1] : [
          arrow.yTop !== undefined ? arrow.yTop : arrow.y2 - 75,
          arrow.yBottom !== undefined ? arrow.yBottom : arrow.y2 + 75
        ];
        splitSources.set(arrow.id, ys.map(y => ProblemBuilder.findBoxNearPoint(arrow.x1, y, state)?.id));
        const ends = arrow.type === 'fork' ? [
          arrow.yTop !== undefined ? arrow.yTop : arrow.y1 - 75,
          arrow.yBottom !== undefined ? arrow.yBottom : arrow.y1 + 75
        ] : [arrow.y2];
        splitTargets.set(arrow.id, ends.map(y => ProblemBuilder.findBoxNearPoint(arrow.x2, y, state)?.id));
        continue;
      }
      const src = ProblemBuilder.findBoxNearPoint(arrow.x1, arrow.y1, state);
      const tgt = src && ProblemBuilder.findBoxNearPoint(arrow.x2, arrow.y2, state, src);
      if (src && tgt) links.set(arrow.id, { src: src.id, tgt: tgt.id });
    }
    const downstreamOf = (boxId) => {
      const seen = new Set([boxId]);
      for (const id of seen) { // el Set crece mientras se recorre
        for (const l of links.values()) if (l.src === id) seen.add(l.tgt);
      }
      return seen;
    };
    // Las ramas que salen de una flecha en "L" se maquetan al final, en orden de síntesis
    const branchBoxes = new Set();
    for (const arrow of state.arrows.values()) {
      const l = links.get(arrow.id);
      if (!l || !getArrowBendCorner(arrow)) continue;
      const down = downstreamOf(l.tgt);
      if (!down.has(l.src)) down.forEach(id => branchBoxes.add(id));
    }
    const boxRank = (boxId) => {
      if (!branchBoxes.has(boxId)) return 0;
      let rank = 1;
      for (const id of branchBoxes) if (id !== boxId && downstreamOf(id).has(boxId)) rank++;
      return rank;
    };
    const branchRank = (arrow) => {
      const l = links.get(arrow.id);
      if (l) return boxRank(l.tgt);
      const ranks = (splitSources.get(arrow.id) || []).map(boxRank);
      const r = Math.max(0, ...ranks);
      return r > 0 ? r + 0.5 : 0; // justo después de colocar su recuadro de origen
    };

    // 1. Asignar letras correlativas de incógnita (A, B, C...) a los recuadros vacíos del esquema
    ProblemBuilder.assignUnknownLetters(state);

    // 2. Auto-ajustar recuadros de compuestos a sus moléculas completas
    for (const box of state.referenceBoxes.values()) {
      if (box.boxType === 'compound') {
        const boxAtoms = this.getAtomsForBox(box, state);
        if (boxAtoms.length > 0) {
          const bbox = getMoleculeBoundingBox(boxAtoms, state, 2.0);
          if (bbox) {
            const padX = 26;
            const padY = 28;

            const oldX = box.x;
            const oldY = box.y;
            const oldW = box.width;
            const oldH = box.height;

            const halfW = Math.max(70, Math.round(bbox.width / 2 + padX));
            const halfH = Math.max(55, Math.round(bbox.height / 2 + padY));

            box.width = halfW * 2;
            box.height = halfH * 2;
            box.x = Math.round(bbox.centerX - halfW);
            box.y = Math.round(bbox.centerY - halfH);

            const shiftX = (box.x + box.width / 2) - (oldX + oldW / 2);
            const shiftY = (box.y + box.height) - (oldY + oldH);
            for (const label of state.textLabels.values()) {
              if (label.x >= oldX - 35 && label.x <= oldX + oldW + 35 &&
                  label.y >= oldY + oldH - 10 && label.y <= oldY + oldH + 85) {
                label.x += shiftX;
                label.y += shiftY;
              }
            }
          }
        }
      }
    }

    // 2.1 Incógnitas vacías: reducirlas al tamaño de su letra
    ProblemBuilder.compactLeafUnknowns(state);

    // Helper para obtener el rectángulo y centro de una entidad
    const getEntityBounds = (entity) => {
      if (!entity) return null;
      if (entity.boxType !== undefined) {
        return {
          minX: entity.x,
          maxX: entity.x + entity.width,
          minY: entity.y,
          maxY: entity.y + entity.height,
          centerX: entity.x + entity.width / 2,
          centerY: entity.y + entity.height / 2,
          entity,
          type: 'box'
        };
      }
      if (entity.bbox !== undefined) {
        return {
          ...entity.bbox,
          entity,
          type: 'molecule'
        };
      }
      if (entity.text !== undefined && entity.x !== undefined) {
        const halfW = (entity.text.length * 8) + 12;
        return {
          minX: entity.x - halfW,
          maxX: entity.x + halfW,
          minY: entity.y - 14,
          maxY: entity.y + 14,
          centerX: entity.x,
          centerY: entity.y,
          entity,
          type: 'label'
        };
      }
      return null;
    };

    // Coleccionar todas las entidades (recuadros, moléculas sin recuadro, rótulos)
    const allEntities = [];
    for (const box of state.referenceBoxes.values()) {
      if (box.boxType === 'compound') {
        const b = getEntityBounds(box);
        if (b) allEntities.push(b);
      }
    }

    for (const mol of molecules) {
      // Verificar si ya está dentro de un recuadro
      let insideAnyBox = false;
      for (const box of state.referenceBoxes.values()) {
        if (box.boxType === 'compound' && mol.bbox) {
          if (mol.bbox.centerX >= box.x && mol.bbox.centerX <= box.x + box.width &&
              mol.bbox.centerY >= box.y && mol.bbox.centerY <= box.y + box.height) {
            insideAnyBox = true;
            break;
          }
        }
      }
      if (!insideAnyBox && mol.bbox) {
        allEntities.push(getEntityBounds(mol));
      }
    }

    for (const label of state.textLabels.values()) {
      allEntities.push(getEntityBounds(label));
    }

    // Dueño de cada molécula antes de mover nada: así un recuadro que pase por encima de otra
    // molécula durante la maquetación no se la lleva consigo
    const boxEntities = allEntities.filter(e => e.type === 'box');
    for (const e of boxEntities) e.ownAtoms = [];
    for (const mol of molecules) {
      if (!mol.bbox) continue;
      const { centerX, centerY } = mol.bbox;
      const owner = boxEntities.find(e => centerX >= e.minX && centerX <= e.maxX && centerY >= e.minY && centerY <= e.maxY);
      if (owner) owner.ownAtoms.push(...mol.atoms);
    }

    // Reconciliar y limpiar flechas duplicadas o redundantes:
    // Si un recuadro es el origen de una flecha de bifurcación (fork),
    // cualquier flecha normal que también salga de él hacia la derecha es redundante
    // (creada por accidente o antes de bifurcar) y rompería el esquema al colapsar las ramas al centro.
    const forkSources = [];
    for (const arrow of state.arrows.values()) {
      if (arrow.type === 'fork') {
        const forkSrcId = splitSources.get(arrow.id)?.[0];
        for (const ent of allEntities) {
          if ((forkSrcId && ent.type === 'box' && ent.entity.id === forkSrcId) ||
              Math.hypot(ent.maxX - arrow.x1, ent.centerY - arrow.y1) < 80) {
            forkSources.push(ent);
          }
        }
      }
    }

    if (forkSources.length > 0) {
      for (const arrow of Array.from(state.arrows.values())) {
        if (arrow.type === 'normal' && (arrow.x2 >= arrow.x1 - 10)) {
          for (const src of forkSources) {
            const l = links.get(arrow.id);
            const leavesRight = !arrow.bend && Math.abs(arrow.x2 - arrow.x1) >= Math.abs(arrow.y2 - arrow.y1);
            if ((l && src.type === 'box' && l.src === src.entity.id && leavesRight) ||
                (!l && Math.hypot(src.maxX - arrow.x1, src.centerY - arrow.y1) < 80)) {
              state.arrows.delete(arrow.id);
              links.delete(arrow.id);
            }
          }
        }
      }
    }

    // 2. Procesar las flechas en orden de síntesis (así una fila que vuelve hacia la izquierda se coloca
    //    después de la que baja hasta ella); a igualdad, de izquierda a derecha
    const order = this.synthesisOrder(state, links, splitSources, splitTargets);
    const placed = new Set(); // recuadros ya colocados por una flecha anterior
    const sortedArrows = Array.from(state.arrows.values()).sort((a, b) => {
      const ax = Math.min(a.x1, a.x2);
      const bx = Math.min(b.x1, b.x2);
      return (branchRank(a) - branchRank(b)) || (order(a) - order(b)) || (ax - bx);
    });

    const gapOf = (ent) => (ent && ent.type === 'box') ? ProblemBuilder.fitGap(ent.entity) : 16;
    const boxEntity = (id) => id && allEntities.find(e => e.type === 'box' && e.entity.id === id);

    for (const arrow of sortedArrows) {
      const dx = arrow.x2 - arrow.x1;
      const dy = arrow.y2 - arrow.y1;
      const isHorizontal = Math.abs(dx) >= Math.abs(dy);
      const isPointingRight = dx >= 0;
      const isPointingDown = dy >= 0;

      // Medir longitud requerida por los reactivos y moléculas sobre la flecha
      const topLines = (arrow.reagentsTop || '').split('\n').filter(Boolean);
      const bottomLines = (arrow.reagentsBottom || '').split('\n').filter(Boolean);
      const topSize = ArrowRenderer.reagentsSize(arrow.reagentsTop, state);
      const bottomSize = ArrowRenderer.reagentsSize(arrow.reagentsBottom, state);
      const requiredTextWidth = Math.max(topSize.width, bottomSize.width);

      // Medir anchura de molécula sobre la flecha (ej. dieno para Diels-Alder)
      let topMolWidth = 0;
      if (arrow.structureTop) {
        let sObj = arrow.structureTop;
        if (typeof sObj === 'string') {
          try { sObj = JSON.parse(sObj); } catch {}
        }
        if (sObj && sObj.atoms && sObj.atoms.length > 0) {
          let minX = Infinity, maxX = -Infinity;
          for (const a of sObj.atoms) {
            if (a.x < minX) minX = a.x;
            if (a.x > maxX) maxX = a.x;
          }
          const rawW = Math.max(30, maxX - minX);
          topMolWidth = Math.round(rawW * 0.65) + 16; // misma escala con la que se dibuja
        }
      }

      // El texto va encima de la molécula, no a su lado: cuenta el más ancho de los dos
      const requiredAssemblyWidth = Math.max(requiredTextWidth, topMolWidth);

      // Flechas horizontales: se expanden según la anchura requerida por reactivos y moléculas
      // (si el usuario la estiró a mano, se respeta su largo)
      let desiredArrowLen = arrow.userLength || Math.max(105, Math.round(requiredAssemblyWidth + 38));
      // Flechas verticales: el texto se escribe horizontalmente a la derecha, por lo que NO deben alargarse verticalmente por la cantidad de caracteres
      // (salvo que lleven moléculas dibujadas al lado, que sí necesitan su altura)
      const hasMolecules = [arrow.reagentsTop, arrow.reagentsBottom].some(txt => ArrowRenderer.layoutReagents(txt, state));
      const reagentsHeight = topSize.height + bottomSize.height;
      const numLines = hasMolecules ? Math.ceil(reagentsHeight / 20) : topLines.length + bottomLines.length;
      const desiredVerticalLen = arrow.userLength || Math.max(72, Math.min(95, Math.round(numLines * 16 + 28)), hasMolecules ? reagentsHeight + 16 : 0);

      // Buscar entidad de origen (cercana al inicio de la flecha)
      let source = null;
      let minSrcDist = 130;
      for (const ent of allEntities) {
        const d = Math.hypot(ent.centerX - arrow.x1, ent.centerY - arrow.y1);
        if (d < minSrcDist) {
          minSrcDist = d;
          source = ent;
        }
      }

      // Buscar entidad de destino (cercana al final de la flecha)
      let target = null;
      let minTgtDist = 130;
      for (const ent of allEntities) {
        if (ent === source) continue;
        const d = Math.hypot(ent.centerX - arrow.x2, ent.centerY - arrow.y2);
        if (d < minTgtDist) {
          minTgtDist = d;
          target = ent;
        }
      }

      // Los recuadros pueden haberse movido o cambiado de tamaño: usar las conexiones originales
      const link = links.get(arrow.id);
      const isBent = Boolean(getArrowBendCorner(arrow));
      if (link) {
        source = allEntities.find(e => e.type === 'box' && e.entity.id === link.src) || source;
        target = allEntities.find(e => e.type === 'box' && e.entity.id === link.tgt) || target;
      }

      // Fórmula bajo una letra (p. ej. C18H25NO4): es más ancha que su recuadro, así que hay que dejarle
      // sitio junto a los reactivos de abajo
      if (isHorizontal && bottomSize.width && !arrow.userLength) {
        const over = [source, target].map(e => {
          const box = e && e.type === 'box' ? e.entity : null;
          if (!box || !box.description || !ProblemBuilder.isCompact(box)) return 0;
          return String(box.description).trim().length * 6.2 / 2 - box.width / 2 - ProblemBuilder.fitGap(box);
        });
        desiredArrowLen = Math.max(desiredArrowLen, Math.round(bottomSize.width + 20 + 2 * Math.max(0, ...over)));
      }

      // Destino ya colocado (ciclo o dos flechas al mismo recuadro): no moverlo, solo unir los extremos
      const targetPlaced = Boolean(link && target && placed.has(link.tgt));
      for (const id of [link?.src, link?.tgt, ...(splitSources.get(arrow.id) || []), ...(splitTargets.get(arrow.id) || [])]) {
        if (id) placed.add(id);
      }
      if (targetPlaced && !isBent && source) {
        const dir = isHorizontal ? (isPointingRight ? 'right' : 'left') : (isPointingDown ? 'down' : 'up');
        const start = ProblemBuilder.arrowEndAtBox(source.entity, target.entity, dir, gapOf(source));
        const end = ProblemBuilder.arrowEndAtBox(source.entity, target.entity, dir, gapOf(target));
        arrow.x1 = start.x1;
        arrow.y1 = start.y1;
        arrow.x2 = end.x2;
        arrow.y2 = end.y2;
        continue;
      }

      if (isBent) {
        // Flecha en "L": conserva su forma. Si no une dos recuadros, se queda donde la puso el usuario
        if (link && source && target) {
          this.fitBentArrow(arrow, source, target, {
            textWidth: requiredAssemblyWidth, lines: numLines, links, downstream: downstreamOf(link.tgt), allEntities, state
          });
        }
        continue;
      }

      if (arrow.type === 'fork') {
        const stemLen = Math.max(70, Math.round(requiredTextWidth + 32));
        const branchLen = 50;

        // Buscar origen
        let source = null;
        let minSrcDist = 140;
        for (const ent of allEntities) {
          const d = Math.hypot(ent.centerX - arrow.x1, ent.centerY - arrow.y1);
          if (d < minSrcDist) {
            minSrcDist = d;
            source = ent;
          }
        }

        source = boxEntity(splitSources.get(arrow.id)?.[0]) || source;

        const isLeft = arrow.direction === 'left' || arrow.x2 < arrow.x1;
        if (source) {
          if (isLeft) {
            arrow.x1 = source.minX - gapOf(source);
            arrow.y1 = source.centerY;
            arrow.stemEndX = arrow.x1 - stemLen;
            arrow.x2 = arrow.stemEndX - branchLen;
          } else {
            arrow.x1 = source.maxX + gapOf(source);
            arrow.y1 = source.centerY;
            arrow.stemEndX = arrow.x1 + stemLen;
            arrow.x2 = arrow.stemEndX + branchLen;
          }
        } else {
          if (isLeft) {
            arrow.stemEndX = arrow.x1 - stemLen;
            arrow.x2 = arrow.stemEndX - branchLen;
          } else {
            arrow.stemEndX = arrow.x1 + stemLen;
            arrow.x2 = arrow.stemEndX + branchLen;
          }
        }

        // Buscar candidatos según el sentido (izquierda o derecha)
        const candidates = isLeft
          ? allEntities.filter(ent => ent !== source && ent.centerX < arrow.x1 + 20)
          : allEntities.filter(ent => ent !== source && ent.centerX > arrow.x1 - 20);

        // Separar candidatos en rama superior e inferior respecto a arrow.y1
        let topCandidates = candidates.filter(ent => ent.centerY < arrow.y1 + 25);
        let bottomCandidates = candidates.filter(ent => ent.centerY >= arrow.y1 - 25);

        // Si todos cayeron en un mismo lado (ej. tras desplazamiento manual), clasificar por orden vertical
        if (topCandidates.length === 0 && candidates.length >= 2) {
          const sortedByY = [...candidates].sort((a, b) => a.centerY - b.centerY);
          topCandidates = [sortedByY[0]];
          bottomCandidates = sortedByY.slice(1);
        } else if (bottomCandidates.length === 0 && candidates.length >= 2) {
          const sortedByY = [...candidates].sort((a, b) => a.centerY - b.centerY);
          topCandidates = sortedByY.slice(0, sortedByY.length - 1);
          bottomCandidates = [sortedByY[sortedByY.length - 1]];
        }

        let targetTop = null;
        if (topCandidates.length > 0) {
          topCandidates.sort((a, b) => Math.hypot(a.centerX - arrow.x2, a.centerY - (arrow.y1 - 75)) - Math.hypot(b.centerX - arrow.x2, b.centerY - (arrow.y1 - 75)));
          targetTop = topCandidates[0];
        }

        let targetBottom = null;
        if (bottomCandidates.length > 0) {
          const filteredBottom = bottomCandidates.filter(c => c !== targetTop);
          if (filteredBottom.length > 0) {
            filteredBottom.sort((a, b) => Math.hypot(a.centerX - arrow.x2, a.centerY - (arrow.y1 + 75)) - Math.hypot(b.centerX - arrow.x2, b.centerY - (arrow.y1 + 75)));
            targetBottom = filteredBottom[0];
          }
        }

        const [forkTopId, forkBottomId] = splitTargets.get(arrow.id) || [];
        targetTop = boxEntity(forkTopId) || targetTop;
        targetBottom = boxEntity(forkBottomId) || targetBottom;
        if (targetBottom === targetTop) targetBottom = null;

        // Medir altura real de ambas entidades para que NUNCA colisionen ni se solapen
        const getEntityHeight = (ent) => {
          if (!ent) return 110;
          if (ent.entity && ent.entity.height) return ent.entity.height;
          return Math.max(110, ent.maxY - ent.minY);
        };

        const hTop = getEntityHeight(targetTop);
        const hBottom = getEntityHeight(targetBottom);

        // Separación vertical generosa: al menos 30px libres entre la base de Box C y el tope de Box D
        const verticalClearance = 30;
        const neededSpacing = (hTop / 2) + (hBottom / 2) + verticalClearance;
        const branchSpacing = Math.max(arrow.branchSpacing || 150, Math.round(neededSpacing));

        arrow.branchSpacing = branchSpacing;
        arrow.yTop = Math.round(arrow.y1 - branchSpacing / 2);
        arrow.yBottom = Math.round(arrow.y1 + branchSpacing / 2);

        if (targetTop) {
          const desiredX = isLeft ? (arrow.x2 - gapOf(targetTop) - (targetTop.maxX - targetTop.minX)) : (arrow.x2 + gapOf(targetTop));
          const shiftX = desiredX - targetTop.minX;
          const shiftY = arrow.yTop - targetTop.centerY;
          this.shiftEntityAndContent(targetTop, shiftX, shiftY, state);
        }

        if (targetBottom) {
          const desiredX = isLeft ? (arrow.x2 - gapOf(targetBottom) - (targetBottom.maxX - targetBottom.minX)) : (arrow.x2 + gapOf(targetBottom));
          const shiftX = desiredX - targetBottom.minX;
          const shiftY = arrow.yBottom - targetBottom.centerY;
          this.shiftEntityAndContent(targetBottom, shiftX, shiftY, state);
        }

        continue;
      }

      if (arrow.type === 'converge') {
        const stemLen = Math.max(70, Math.round(requiredTextWidth + 32));
        const branchLen = 45;

        const expectedYTop = arrow.yTop !== undefined ? arrow.yTop : (arrow.y2 - 75);
        const expectedYBottom = arrow.yBottom !== undefined ? arrow.yBottom : (arrow.y2 + 75);

        // 1. Buscar origen superior
        let sourceTop = null;
        let minSrcTopDist = 160;
        for (const ent of allEntities) {
          const d = Math.hypot(ent.centerX - arrow.x1, ent.centerY - expectedYTop);
          if (d < minSrcTopDist) {
            minSrcTopDist = d;
            sourceTop = ent;
          }
        }

        // 2. Buscar origen inferior
        let sourceBottom = null;
        let minSrcBottomDist = 160;
        for (const ent of allEntities) {
          if (ent === sourceTop) continue;
          const d = Math.hypot(ent.centerX - arrow.x1, ent.centerY - expectedYBottom);
          if (d < minSrcBottomDist) {
            minSrcBottomDist = d;
            sourceBottom = ent;
          }
        }

        const [topId, bottomId] = splitSources.get(arrow.id) || [];
        sourceTop = boxEntity(topId) || sourceTop;
        sourceBottom = boxEntity(bottomId) || sourceBottom;
        if (sourceBottom === sourceTop) sourceBottom = null;

        const getEntityHeight = (ent) => {
          if (!ent) return 110;
          if (ent.entity && ent.entity.height) return ent.entity.height;
          return Math.max(110, ent.maxY - ent.minY);
        };

        const hTop = getEntityHeight(sourceTop);
        const hBottom = getEntityHeight(sourceBottom);
        const verticalClearance = 30;
        const neededSpacing = (hTop / 2) + (hBottom / 2) + verticalClearance;
        const branchSpacing = Math.max(arrow.branchSpacing || 150, Math.round(neededSpacing));
        arrow.branchSpacing = branchSpacing;

        if (sourceTop && sourceBottom) {
          arrow.x1 = Math.max(sourceTop.maxX, sourceBottom.maxX) + Math.max(gapOf(sourceTop), gapOf(sourceBottom));
          arrow.yTop = sourceTop.centerY;
          arrow.yBottom = sourceBottom.centerY;
          arrow.yMid = Math.round((arrow.yTop + arrow.yBottom) / 2);
          arrow.y2 = arrow.yMid;
        } else if (sourceTop) {
          arrow.x1 = sourceTop.maxX + gapOf(sourceTop);
          arrow.yTop = sourceTop.centerY;
          arrow.yBottom = Math.round(arrow.yTop + branchSpacing);
          arrow.yMid = Math.round(arrow.yTop + branchSpacing / 2);
          arrow.y2 = arrow.yMid;
        } else {
          arrow.yTop = Math.round(expectedYTop);
          arrow.yBottom = Math.round(expectedYBottom);
          arrow.yMid = Math.round((arrow.yTop + arrow.yBottom) / 2);
          arrow.y2 = arrow.yMid;
        }

        arrow.stemStartX = arrow.x1 + branchLen;
        arrow.x2 = arrow.stemStartX + stemLen;

        // 3. Buscar target cerca de (arrow.x2, arrow.yMid)
        let target = null;
        let minTgtDist = 140;
        for (const ent of allEntities) {
          if (ent === sourceTop || ent === sourceBottom) continue;
          const d = Math.hypot(ent.centerX - arrow.x2, ent.centerY - arrow.yMid);
          if (d < minTgtDist) {
            minTgtDist = d;
            target = ent;
          }
        }

        target = boxEntity(splitTargets.get(arrow.id)?.[0]) || target;
        if (target) {
          const desiredX = arrow.x2 + gapOf(target);
          const shiftX = desiredX - target.minX;
          const shiftY = arrow.yMid - target.centerY;
          this.shiftEntityAndContent(target, shiftX, shiftY, state);
        }

        continue;
      }

      if (isHorizontal && isPointingRight) {
        let startX = arrow.x1;
        let midY = (arrow.y1 + arrow.y2) / 2;

        if (source) {
          startX = source.maxX + gapOf(source);
          midY = source.centerY;
        }

        arrow.x1 = startX;
        arrow.x2 = startX + desiredArrowLen;
        arrow.y1 = midY;
        arrow.y2 = midY;

        if (target) {
          const desiredTargetMinX = arrow.x2 + gapOf(target);
          const shiftX = desiredTargetMinX - target.minX;
          const shiftY = midY - target.centerY;
          this.shiftEntityAndContent(target, shiftX, shiftY, state);
        }
      } else if (isHorizontal && !isPointingRight) {
        let startX = arrow.x1;
        let midY = (arrow.y1 + arrow.y2) / 2;

        if (source) {
          startX = source.minX - gapOf(source);
          midY = source.centerY;
        }

        arrow.x1 = startX;
        arrow.x2 = startX - desiredArrowLen;
        arrow.y1 = midY;
        arrow.y2 = midY;

        if (target) {
          const desiredTargetMaxX = arrow.x2 - gapOf(target);
          const shiftX = desiredTargetMaxX - target.maxX;
          const shiftY = midY - target.centerY;
          this.shiftEntityAndContent(target, shiftX, shiftY, state);
        }
      } else if (!isHorizontal && isPointingDown) {
        let startY = arrow.y1;
        let midX = (arrow.x1 + arrow.x2) / 2;

        if (source) {
          startY = source.maxY + gapOf(source);
          midX = source.centerX;
        }

        arrow.y1 = startY;
        arrow.y2 = startY + desiredVerticalLen;
        arrow.x1 = midX;
        arrow.x2 = midX;

        if (target) {
          const desiredTargetMinY = arrow.y2 + gapOf(target);
          const shiftY = desiredTargetMinY - target.minY;
          const shiftX = midX - target.centerX;
          this.shiftEntityAndContent(target, shiftX, shiftY, state);
        }
      } else if (!isHorizontal && !isPointingDown) {
        let startY = arrow.y1;
        let midX = (arrow.x1 + arrow.x2) / 2;

        if (source) {
          startY = source.minY - gapOf(source);
          midX = source.centerX;
        }

        arrow.y1 = startY;
        arrow.y2 = startY - desiredVerticalLen;
        arrow.x1 = midX;
        arrow.x2 = midX;

        if (target) {
          const desiredTargetMaxY = arrow.y2 - gapOf(target);
          const shiftY = desiredTargetMaxY - target.maxY;
          const shiftX = midX - target.centerX;
          this.shiftEntityAndContent(target, shiftX, shiftY, state);
        }
      }
    }

    // 3. Si una fila choca con otra, alargar la flecha vertical que las une
    this.separateRows(state);

    // 4. Ajuste final de seguridad de flechas sueltas
    this.adjustArrowsToMolecules(state, 18);
  }

  /** Recuadros de compuesto que toca cada extremo de una flecha: { starts: [ids], ends: [ids] } */
  static arrowBoxes(arrow, state) {
    const near = (x, y, exclude = null) => ProblemBuilder.findBoxNearPoint(x, y, state, exclude)?.id;
    let starts, ends;
    if (arrow.type === 'fork' || arrow.type === 'converge') {
      const half = (arrow.branchSpacing || 150) / 2;
      const vertical = arrow.type === 'fork' && (arrow.direction === 'down' || arrow.direction === 'up');
      const midY = arrow.type === 'fork' ? arrow.y1 : arrow.y2;
      const two = vertical
        ? [[arrow.xTop ?? arrow.x1 - half, arrow.y2], [arrow.xBottom ?? arrow.x1 + half, arrow.y2]]
        : [arrow.yTop ?? midY - half, arrow.yBottom ?? midY + half].map(y => [arrow.type === 'fork' ? arrow.x2 : arrow.x1, y]);
      const pair = two.map(([x, y]) => near(x, y));
      starts = arrow.type === 'fork' ? [near(arrow.x1, arrow.y1)] : pair;
      ends = arrow.type === 'fork' ? pair : [near(arrow.x2, arrow.y2)];
    } else {
      const src = ProblemBuilder.findBoxNearPoint(arrow.x1, arrow.y1, state);
      starts = [src?.id];
      ends = [near(arrow.x2, arrow.y2, src)];
    }
    return { starts: starts.filter(Boolean), ends: ends.filter(Boolean) };
  }

  /** Recuadros unidos a 'boxId' por flechas, sin pasar por la flecha 'exceptArrow' */
  static connectedBoxes(boxId, exceptArrow, state) {
    const groups = [];
    for (const a of state.arrows.values()) {
      if (a === exceptArrow) continue;
      const { starts, ends } = this.arrowBoxes(a, state);
      groups.push([...starts, ...ends]);
    }
    const seen = new Set([boxId]);
    for (const id of seen) { // el Set crece mientras se recorre
      for (const g of groups) if (g.includes(id)) g.forEach(x => seen.add(x));
    }
    return seen;
  }

  /** Función que mueve un grupo de recuadros con sus moléculas, rótulos y flechas internas */
  static createMover(boxIds, exceptArrow, state) {
    const boxes = Array.from(boxIds).map(id => state.referenceBoxes.get(id)).filter(Boolean);
    const inBox = (x, y, b, below = 0, side = 0) => x >= b.x - side && x <= b.x + b.width + side && y >= b.y && y <= b.y + b.height + below;
    const atoms = [];
    for (const mol of getAllMolecules(state)) {
      if (mol.bbox && boxes.some(b => inBox(mol.bbox.centerX, mol.bbox.centerY, b))) atoms.push(...mol.atoms);
    }
    const labels = Array.from(state.textLabels.values()).filter(l => boxes.some(b => inBox(l.x, l.y, b, 60, 35)));
    const arrows = Array.from(state.arrows.values()).filter(a => {
      if (a === exceptArrow) return false;
      const { starts, ends } = this.arrowBoxes(a, state);
      const ids = [...starts, ...ends];
      return ids.length > 0 && ids.every(id => boxIds.has(id));
    });
    return (dx, dy) => {
      for (const o of [...boxes, ...atoms, ...labels]) { o.x += dx; o.y += dy; }
      for (const a of arrows) {
        for (const k of ['x1', 'x2', 'xTop', 'xBottom', 'stemEndX', 'stemStartX']) if (Number.isFinite(a[k])) a[k] += dx;
        for (const k of ['y1', 'y2', 'yTop', 'yBottom', 'yMid', 'stemEndY']) if (Number.isFinite(a[k])) a[k] += dy;
      }
    };
  }

  /** Zonas ocupadas por un grupo de recuadros y por los reactivos de sus flechas horizontales */
  static occupiedRects(boxIds, exceptArrow, state) {
    const rects = [];
    for (const id of boxIds) {
      const b = state.referenceBoxes.get(id);
      if (b) rects.push({ minX: b.x, maxX: b.x + b.width, minY: b.y, maxY: b.y + b.height });
    }
    for (const a of state.arrows.values()) {
      if (a === exceptArrow || a.type === 'fork' || a.type === 'converge' || a.bend) continue;
      if (Math.abs(a.y2 - a.y1) > Math.abs(a.x2 - a.x1)) continue;
      const { starts, ends } = this.arrowBoxes(a, state);
      if (![...starts, ...ends].some(id => boxIds.has(id))) continue;
      const top = ArrowRenderer.reagentsSize(a.reagentsTop, state);
      const bottom = ArrowRenderer.reagentsSize(a.reagentsBottom, state);
      const mid = (a.x1 + a.x2) / 2, y = (a.y1 + a.y2) / 2;
      const half = Math.max(top.width, bottom.width, Math.abs(a.x2 - a.x1)) / 2;
      rects.push({ minX: mid - half, maxX: mid + half, minY: y - 8 - top.height, maxY: y + 11 + bottom.height });
    }
    return rects;
  }

  /**
   * Evita que una fila del esquema se encime con otra: alarga la flecha vertical (o en "L") que
   * las une y desplaza toda la fila del otro extremo.
   */
  static separateRows(state, margin = 14) {
    for (let iter = 0; iter < 12; iter++) {
      let changed = false;
      for (const arrow of state.arrows.values()) {
        if (arrow.type === 'fork' || arrow.type === 'converge') continue;
        if (!getArrowBendCorner(arrow) && Math.abs(arrow.y2 - arrow.y1) <= Math.abs(arrow.x2 - arrow.x1)) continue;
        const { starts: [src], ends: [tgt] } = this.arrowBoxes(arrow, state);
        if (!src || !tgt) continue;
        const moving = this.connectedBoxes(tgt, arrow, state);
        if (moving.has(src)) continue; // ciclo: no se puede mover un lado sin el otro
        const fixed = this.connectedBoxes(src, arrow, state);
        const down = arrow.y2 > arrow.y1;
        let push = 0;
        const fixedRects = this.occupiedRects(fixed, arrow, state);
        for (const m of this.occupiedRects(moving, arrow, state)) {
          for (const f of fixedRects) {
            if (m.minX >= f.maxX + margin || m.maxX + margin <= f.minX ||
                m.minY >= f.maxY + margin || m.maxY + margin <= f.minY) continue;
            push = Math.max(push, down ? f.maxY + margin - m.minY : m.maxY + margin - f.minY);
          }
        }
        if (push < 0.5) continue;
        const dy = down ? Math.ceil(push) : -Math.ceil(push);
        this.createMover(moving, arrow, state)(0, dy);
        arrow.y2 += dy;
        changed = true;
      }
      if (!changed) break;
    }
  }

  /** Orden de síntesis de las flechas: posición de su recuadro de origen siguiendo las conexiones */
  static synthesisOrder(state, links, splitSources, splitTargets) {
    const edges = [];
    for (const l of links.values()) edges.push([l.src, l.tgt]);
    for (const [id, srcs] of splitSources) {
      for (const s of srcs) for (const t of splitTargets.get(id) || []) if (s && t && s !== t) edges.push([s, t]);
    }
    const pending = new Set(edges.flat());
    const pos = new Map();
    const x = (id) => state.referenceBoxes.get(id)?.x ?? 0;
    while (pending.size) {
      const ids = Array.from(pending).sort((a, b) => x(a) - x(b));
      // Sin dependencias pendientes; si hay un ciclo, se entra por el de más a la izquierda
      const next = ids.find(id => !edges.some(([s, t]) => t === id && pending.has(s))) || ids[0];
      pending.delete(next);
      pos.set(next, pos.size + 1);
    }
    return (arrow) => {
      const l = links.get(arrow.id);
      const ids = l ? [l.src] : (splitSources.get(arrow.id) || []).filter(Boolean);
      return Math.max(0, ...ids.map(id => pos.get(id) || 0));
    };
  }

  /**
   * Recoloca una flecha en "L" y su recuadro destino sin perder el doblez.
   * Si el destino es parte de un ciclo o recibe otra flecha, solo se ajustan los extremos.
   */
  static fitBentArrow(arrow, source, target, { textWidth, lines, links, downstream, allEntities, state }) {
    const vertical = arrow.bend === 'vh';
    const horizDir = arrow.x2 >= arrow.x1 ? 'right' : 'left';
    const vertDir = arrow.y2 >= arrow.y1 ? 'down' : 'up';
    const first = vertical ? vertDir : horizDir;
    const second = vertical ? horizDir : vertDir;
    const src = source.entity, tgt = target.entity;

    const incoming = Array.from(links.values()).filter(l => l.tgt === tgt.id).length;
    if (downstream.has(src.id) || incoming > 1) {
      const start = ProblemBuilder.bentLayout(src, first, second, tgt.width, tgt.height, { gap: ProblemBuilder.fitGap(src) });
      const end = ProblemBuilder.arrowEndAtBox(src, tgt, second, ProblemBuilder.fitGap(tgt));
      arrow.x1 = start.x1;
      arrow.y1 = start.y1;
      arrow.x2 = end.x2;
      arrow.y2 = end.y2;
      return;
    }

    const gaps = { gap: ProblemBuilder.fitGap(src), endGap: ProblemBuilder.fitGap(tgt) };
    const opts = { ...gaps, textWidth, lines, minDx: Math.abs(arrow.x2 - arrow.x1), minDy: Math.abs(arrow.y2 - arrow.y1) };
    let layout = ProblemBuilder.bentLayout(src, first, second, tgt.width, tgt.height, opts);
    const margin = 24;
    const collides = (p) => allEntities.some(e => e.type === 'box' && !downstream.has(e.entity.id) &&
      p.boxX < e.maxX + margin && p.boxX + tgt.width + margin > e.minX &&
      p.boxY < e.maxY + margin && p.boxY + tgt.height + margin > e.minY);
    for (let i = 0; i < 60 && collides(layout); i++) {
      layout = ProblemBuilder.bentLayout(src, first, second, tgt.width, tgt.height,
        { ...opts, minDy: Math.abs(layout.y2 - layout.y1) + 20 });
    }
    arrow.x1 = layout.x1;
    arrow.y1 = layout.y1;
    arrow.x2 = layout.x2;
    arrow.y2 = layout.y2;
    this.shiftEntityAndContent(target, layout.boxX - target.minX, layout.boxY - target.minY, state);
  }

  /**
   * Mueve una entidad (recuadro, molécula o rótulo) y todos sus contenidos
   * incluyendo átomos conectados y descripciones o rótulos situados debajo de ella.
   */
  static shiftEntityAndContent(target, shiftX, shiftY, state) {
    if (!target || (shiftX === 0 && shiftY === 0)) return;

    if (target.type === 'box') {
      const b = target.entity;
      b.x += shiftX;
      b.y += shiftY;
      const boxAtoms = target.ownAtoms || this.getAtomsForBox(b, state, target.minX, target.maxX, target.minY, target.maxY);
      for (const atom of boxAtoms) {
        atom.x += shiftX;
        atom.y += shiftY;
      }
      // Mover descripciones y rótulos situados debajo de este recuadro
      for (const label of state.textLabels.values()) {
        if (label.x >= target.minX - 35 && label.x <= target.maxX + 35 &&
            label.y >= target.maxY - 10 && label.y <= target.maxY + 75) {
          label.x += shiftX;
          label.y += shiftY;
        }
      }
    } else if (target.type === 'molecule') {
      const molBbox = target.entity.bbox;
      for (const atom of target.entity.atoms) {
        atom.x += shiftX;
        atom.y += shiftY;
      }
      if (molBbox) {
        for (const label of state.textLabels.values()) {
          if (label.x >= molBbox.minX - 40 && label.x <= molBbox.maxX + 40 &&
              label.y >= molBbox.maxY - 10 && label.y <= molBbox.maxY + 75) {
            label.x += shiftX;
            label.y += shiftY;
          }
        }
      }
    } else if (target.type === 'label') {
      target.entity.x += shiftX;
      target.entity.y += shiftY;
    }

    target.minX += shiftX;
    target.maxX += shiftX;
    target.minY += shiftY;
    target.maxY += shiftY;
    target.centerX += shiftX;
    target.centerY += shiftY;
  }
}
