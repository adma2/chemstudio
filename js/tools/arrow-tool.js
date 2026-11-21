/**
 * arrow-tool.js - Herramienta interactiva para trazado y edición de flechas de reacción
 * Soporta estirado libre, bloqueo magnético a ángulos canónicos (0°, 45°, 90°, 180°, 270°)
 * y espacio definido garantizado entre molécula y flecha.
 */

import { snapAngle, CANONICAL_ARROW_ANGLES, findNearestAnchor } from '../chem-engine/snapping.js';
import { ChemAligner } from '../chem-engine/aligner.js';
import { ProblemBuilder } from '../chem-engine/problem-builder.js';

export class ArrowTool {
  constructor(state, renderer, onArrowCreated = null) {
    this.state = state;
    this.renderer = renderer;
    this.onArrowCreated = onArrowCreated;
    this.isDrawing = false;
    this.rawStartPos = null;
    this.effectiveStartPos = null;
    this.startAnchor = null;
    this.currentSnapped = null;
    this.activeHandleArrow = null;
    this.activeHandleRole = null;
    this.definedGap = 20; // Espacio definido entre compuesto y flecha
    this.defaultType = 'normal'; // 'normal' o 'fork'
  }

  onMouseDown(e, canvasPos, targetInfo) {
    // 1. Clic en tirador de flecha existente
    if (targetInfo && targetInfo.isArrowHandle) {
      this.activeHandleArrow = this.state.arrows.get(targetInfo.arrowId);
      this.activeHandleRole = targetInfo.role;
      this.isDrawing = true;
      return;
    }

    // 2. Clic en flecha existente -> seleccionarla y abrir inspector
    if (targetInfo && targetInfo.type === 'arrow') {
      this.state.clearSelection();
      this.state.selected.arrows.add(targetInfo.id);
      this.renderer.render();
      if (this.onArrowCreated) {
        this.onArrowCreated(this.state.arrows.get(targetInfo.id));
      }
      return;
    }

    // 3. Clic sobre un recuadro de compuesto (borde o badge) -> seleccionarlo
    if (targetInfo && targetInfo.type === 'box') {
      this.state.clearSelection();
      this.state.selected.boxes.add(targetInfo.id);
      this.renderer.render();
      return;
    }

    // 4. Iniciar dibujo de nueva flecha
    this.isDrawing = true;
    this.rawStartPos = { x: canvasPos.x, y: canvasPos.y };
    this.effectiveStartPos = { x: canvasPos.x, y: canvasPos.y };
    this.currentSnapped = { x: canvasPos.x, y: canvasPos.y, angleDeg: 0, isSnapped: false };
    this.startAnchor = findNearestAnchor(canvasPos.x, canvasPos.y, this.state, null, 35);
  }

  onMouseMove(e, canvasPos, targetInfo) {
    if (!this.isDrawing) return;

    if (this.activeHandleArrow) {
      const arrow = this.activeHandleArrow;
      if (arrow.type === 'fork') {
        if (this.activeHandleRole === 'start') {
          arrow.x1 = canvasPos.x;
          arrow.y1 = canvasPos.y;
        } else if (this.activeHandleRole === 'stemEnd') {
          arrow.stemEndX = Math.max(arrow.x1 + 20, Math.min(arrow.x2 - 15, canvasPos.x));
        } else if (this.activeHandleRole === 'endTop') {
          arrow.x2 = Math.max((arrow.stemEndX || arrow.x1 + 40) + 20, canvasPos.x);
          arrow.yTop = canvasPos.y;
          if (arrow.yBottom !== undefined) {
            arrow.branchSpacing = Math.round(Math.abs(arrow.yBottom - arrow.yTop));
          }
        } else if (this.activeHandleRole === 'endBottom') {
          arrow.x2 = Math.max((arrow.stemEndX || arrow.x1 + 40) + 20, canvasPos.x);
          arrow.yBottom = canvasPos.y;
          if (arrow.yTop !== undefined) {
            arrow.branchSpacing = Math.round(Math.abs(arrow.yBottom - arrow.yTop));
          }
        }
        this.renderer.render();
        return;
      }

      if (arrow.type === 'converge') {
        if (this.activeHandleRole === 'startTop') {
          arrow.x1 = canvasPos.x;
          arrow.yTop = canvasPos.y;
          if (arrow.yBottom !== undefined) {
            arrow.branchSpacing = Math.round(Math.abs(arrow.yBottom - arrow.yTop));
            arrow.yMid = (arrow.yTop + arrow.yBottom) / 2;
            arrow.y2 = arrow.yMid;
          }
        } else if (this.activeHandleRole === 'startBottom') {
          arrow.x1 = canvasPos.x;
          arrow.yBottom = canvasPos.y;
          if (arrow.yTop !== undefined) {
            arrow.branchSpacing = Math.round(Math.abs(arrow.yBottom - arrow.yTop));
            arrow.yMid = (arrow.yTop + arrow.yBottom) / 2;
            arrow.y2 = arrow.yMid;
          }
        } else if (this.activeHandleRole === 'stemMeet') {
          arrow.stemStartX = Math.max(arrow.x1 + 15, Math.min(arrow.x2 - 20, canvasPos.x));
          arrow.yMid = canvasPos.y;
          arrow.y2 = canvasPos.y;
        } else if (this.activeHandleRole === 'end') {
          arrow.x2 = Math.max((arrow.stemStartX || arrow.x1 + 45) + 20, canvasPos.x);
          arrow.y2 = canvasPos.y;
          arrow.yMid = canvasPos.y;
        }
        this.renderer.render();
        return;
      }

      if (arrow.bend) {
        // Flecha en "L": los extremos se mueven libres (la esquina se recalcula sola)
        if (this.activeHandleRole === 'end') { arrow.x2 = canvasPos.x; arrow.y2 = canvasPos.y; }
        else if (this.activeHandleRole === 'start') { arrow.x1 = canvasPos.x; arrow.y1 = canvasPos.y; }
        this.renderer.render();
        return;
      }

      if (this.activeHandleRole === 'end') {
        const snapped = snapAngle(arrow.x1, arrow.y1, canvasPos.x, canvasPos.y, CANONICAL_ARROW_ANGLES, 12);
        arrow.x2 = snapped.x;
        arrow.y2 = snapped.y;
      } else if (this.activeHandleRole === 'start') {
        const snapped = snapAngle(arrow.x2, arrow.y2, canvasPos.x, canvasPos.y, CANONICAL_ARROW_ANGLES, 12);
        arrow.x1 = snapped.x;
        arrow.y1 = snapped.y;
      }
      this.renderer.render();
      return;
    }

    if (!this.rawStartPos) return;

    // Calcular vector provisional y ángulo
    let rawDx = canvasPos.x - this.rawStartPos.x;
    let rawDy = canvasPos.y - this.rawStartPos.y;
    let angleRad = Math.atan2(rawDy, rawDx);

    // Si empezó cerca de un átomo o rótulo, calcular punto de salida respetando el espacio definido
    let startX = this.rawStartPos.x;
    let startY = this.rawStartPos.y;

    if (this.startAnchor) {
      startX = this.startAnchor.x + Math.cos(angleRad) * this.definedGap;
      startY = this.startAnchor.y + Math.sin(angleRad) * this.definedGap;
    }
    this.effectiveStartPos = { x: startX, y: startY };

    if (this.defaultType === 'bent') {
      // Flecha en "L": sale en horizontal (o vertical si el arrastre es más vertical) y dobla 90°
      const sx = this.rawStartPos.x, sy = this.rawStartPos.y;
      this.effectiveStartPos = { x: sx, y: sy };
      this.bentDirection = Math.abs(canvasPos.x - sx) >= Math.abs(canvasPos.y - sy) ? 'hv' : 'vh';
      this.currentSnapped = { x: canvasPos.x, y: canvasPos.y, angleDeg: 0, isSnapped: false };
      this.updateBentPreview(sx, sy, canvasPos.x, canvasPos.y, this.bentDirection);
      return;
    }

    // Bloqueo magnético a 0°, 45°, 90°, 180°, 270°
    const snapped = snapAngle(startX, startY, canvasPos.x, canvasPos.y, CANONICAL_ARROW_ANGLES, 12);
    this.currentSnapped = snapped;

    this.updatePreview(startX, startY, snapped.x, snapped.y, snapped.angleDeg, snapped.isSnapped);
  }

  onMouseUp(e, canvasPos, targetInfo) {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.clearPreview();

    if (this.activeHandleArrow) {
      this.state.saveSnapshot();
      this.activeHandleArrow = null;
      this.activeHandleRole = null;
      ChemAligner.adjustArrowsToMolecules(this.state);
      this.renderer.render();
      return;
    }

    if (!this.rawStartPos) {
      this.resetDrawingState();
      return;
    }

    const startX = this.effectiveStartPos ? this.effectiveStartPos.x : this.rawStartPos.x;
    const startY = this.effectiveStartPos ? this.effectiveStartPos.y : this.rawStartPos.y;

    if (this.defaultType === 'bent') {
      const ex = canvasPos.x, ey = canvasPos.y;
      if (Math.hypot(ex - startX, ey - startY) < 18) {
        // Clic simple: flecha en "L" por defecto (→ 120 px y luego ↓ 120 px)
        this.createBentArrow(startX, startY, startX + 120, startY + 120, 'hv');
      } else {
        this.createBentArrow(startX, startY, ex, ey, this.bentDirection || 'hv');
      }
      this.resetDrawingState();
      return;
    }

    let endX = this.currentSnapped ? this.currentSnapped.x : canvasPos.x;
    let endY = this.currentSnapped ? this.currentSnapped.y : canvasPos.y;

    const endAnchor = findNearestAnchor(endX, endY, this.state, null, 35);
    if (endAnchor && (!this.startAnchor || endAnchor.target.id !== this.startAnchor.target.id)) {
      const angleRad = (this.currentSnapped ? this.currentSnapped.angleDeg * Math.PI : 0) / 180;
      endX = endAnchor.x - Math.cos(angleRad) * this.definedGap;
      endY = endAnchor.y - Math.sin(angleRad) * this.definedGap;
    }

    const finalLength = Math.hypot(endX - startX, endY - startY);
    const isFork = this.defaultType === 'fork';
    const isConverge = this.defaultType === 'converge';

    if (finalLength < 18) {
      if (this.state.isProblemMode && this.rawStartPos) {
        this.state.showCompoundBoxes = true;
        let step;
        if (isFork) {
          // Clic simple con herramienta bifurcación: crear caja inicial y bifurcación
          const boxWidth = 140;
          const boxHeight = 110;
          const labelA = ProblemBuilder.getNextLabel(this.state);
          const sourceBox = this.state.addReferenceBox({
            boxType: 'compound',
            label: labelA,
            x: Math.max(30, this.rawStartPos.x),
            y: this.rawStartPos.y - boxHeight / 2,
            width: boxWidth,
            height: boxHeight
          });
          const forkRes = ProblemBuilder.createForkStep(sourceBox, this.state);
          step = { arrow: forkRes.forkArrow };
        } else if (isConverge) {
          // Clic simple con herramienta convergencia: dos reactivos convergen a uno
          const boxWidth = 140;
          const boxHeight = 110;
          const branchSpacing = 150;
          const labelTop = ProblemBuilder.getNextLabel(this.state);
          const boxTop = this.state.addReferenceBox({
            boxType: 'compound',
            label: labelTop,
            x: Math.max(30, this.rawStartPos.x),
            y: this.rawStartPos.y - branchSpacing / 2 - boxHeight / 2,
            width: boxWidth,
            height: boxHeight
          });
          const labelBottom = ProblemBuilder.getNextLabel(this.state);
          const boxBottom = this.state.addReferenceBox({
            boxType: 'compound',
            label: labelBottom,
            x: Math.max(30, this.rawStartPos.x),
            y: this.rawStartPos.y + branchSpacing / 2 - boxHeight / 2,
            width: boxWidth,
            height: boxHeight
          });
          const convRes = ProblemBuilder.createConvergeStep(boxTop, boxBottom, this.state);
          step = { arrow: convRes.convergeArrow };
        } else {
          // Clic simple en Modo Problema:
          // 1. ¿Está cerca de un recuadro de compuesto existente? -> Extender desde él
          let nearBox = null;
          let minBoxDist = 130;
          for (const b of this.state.referenceBoxes.values()) {
            if (b.boxType === 'compound') {
              const d = Math.hypot((b.x + b.width) - this.rawStartPos.x, (b.y + b.height / 2) - this.rawStartPos.y);
              if (d < minBoxDist) {
                minBoxDist = d;
                nearBox = b;
              }
            }
          }
          if (nearBox) {
            step = ProblemBuilder.extendFromBox(nearBox, 'right', this.state);
          } else {
            step = ProblemBuilder.createInitialStep(Math.max(30, this.rawStartPos.x), this.rawStartPos.y, this.state);
          }
        }
        const createdArrow = step.arrow || step.forkArrow || step.convergeArrow;
        this.state.clearSelection();
        if (createdArrow) this.state.selected.arrows.add(createdArrow.id);
        this.renderer.render();
        if (this.onArrowCreated && createdArrow) this.onArrowCreated(createdArrow);
      } else if (this.rawStartPos) {
        // Clic simple fuera de modo problema: crear flecha horizontal normal de 100px
        this.state.saveSnapshot();
        const newArrow = this.state.addArrow({
          x1: startX,
          y1: startY,
          x2: startX + 100,
          y2: startY,
          type: 'normal',
          reagentsTop: '',
          reagentsBottom: ''
        });
        this.state.clearSelection();
        this.state.selected.arrows.add(newArrow.id);
        this.renderer.render();
        if (this.onArrowCreated) this.onArrowCreated(newArrow);
      }
      this.resetDrawingState();
      return;
    }

    this.state.saveSnapshot();

    const branchSpacing = 150;
    const stemEndX = this.effectiveStartPos.x + Math.max(50, (endX - this.effectiveStartPos.x) * 0.45);
    const stemStartX = this.effectiveStartPos.x + Math.max(40, (endX - this.effectiveStartPos.x) * 0.45);
    const yTop = this.effectiveStartPos.y - branchSpacing / 2;
    const yBottom = this.effectiveStartPos.y + branchSpacing / 2;
    const yMid = this.effectiveStartPos.y;
    const isDashed = this.defaultType === 'dashed';

    const newArrow = this.state.addArrow({
      x1: this.effectiveStartPos.x,
      y1: isConverge ? yMid : this.effectiveStartPos.y,
      x2: endX,
      y2: (isFork || isConverge) ? yMid : endY,
      type: isFork ? 'fork' : (isConverge ? 'converge' : (isDashed ? 'dashed' : 'normal')),
      stemEndX: isFork ? stemEndX : undefined,
      stemStartX: isConverge ? stemStartX : undefined,
      branchSpacing: (isFork || isConverge) ? branchSpacing : undefined,
      yTop: (isFork || isConverge) ? yTop : undefined,
      yBottom: (isFork || isConverge) ? yBottom : undefined,
      yMid: isConverge ? yMid : undefined,
      reagentsTop: '',
      reagentsBottom: ''
    });

    // En Modo Construir Problema: auto-generar o conectar recuadros A, B, C...
    if (this.state.isProblemMode) {
      this.state.showCompoundBoxes = true;
      const boxWidth = 140;
      const boxHeight = 110;
      const gap = 16;

      if (isConverge) {
        let topSrc = null, bottomSrc = null;
        for (const box of this.state.referenceBoxes.values()) {
          if (box.boxType === 'compound') {
            if (Math.hypot(box.x + box.width - this.effectiveStartPos.x, box.y + box.height / 2 - yTop) < 80) {
              topSrc = box;
            } else if (Math.hypot(box.x + box.width - this.effectiveStartPos.x, box.y + box.height / 2 - yBottom) < 80) {
              bottomSrc = box;
            }
          }
        }
        if (!topSrc) {
          const lTop = ProblemBuilder.getNextLabel(this.state);
          this.state.addReferenceBox({
            boxType: 'compound',
            label: lTop,
            x: Math.max(20, this.effectiveStartPos.x - boxWidth - gap),
            y: yTop - boxHeight / 2,
            width: boxWidth,
            height: boxHeight
          });
        }
        if (!bottomSrc) {
          const lBottom = ProblemBuilder.getNextLabel(this.state);
          this.state.addReferenceBox({
            boxType: 'compound',
            label: lBottom,
            x: Math.max(20, this.effectiveStartPos.x - boxWidth - gap),
            y: yBottom - boxHeight / 2,
            width: boxWidth,
            height: boxHeight
          });
        }
        const labelProduct = ProblemBuilder.getNextLabel(this.state);
        this.state.addReferenceBox({
          boxType: 'compound',
          label: labelProduct,
          x: endX + gap,
          y: yMid - boxHeight / 2,
          width: boxWidth,
          height: boxHeight
        });
      } else {
        // Buscar si el inicio está cerca de un recuadro de compuesto existente
        // Recuadro de origen: el que tenga cualquier borde cerca del inicio de la flecha
        let sourceBox = ProblemBuilder.findBoxNearPoint(this.effectiveStartPos.x, this.effectiveStartPos.y, this.state);
        if (!sourceBox) {
          let minSrcDist = 90;
          for (const box of this.state.referenceBoxes.values()) {
            if (box.boxType === 'compound') {
              const d = Math.hypot(box.x + box.width - this.effectiveStartPos.x, box.y + box.height / 2 - this.effectiveStartPos.y);
              if (d < minSrcDist) {
                minSrcDist = d;
                sourceBox = box;
              }
            }
          }
        }

        if (!sourceBox) {
          const labelA = ProblemBuilder.getNextLabel(this.state);
          sourceBox = this.state.addReferenceBox({
            boxType: 'compound',
            label: labelA,
            x: Math.max(20, this.effectiveStartPos.x - boxWidth - gap),
            y: this.effectiveStartPos.y - boxHeight / 2,
            width: boxWidth,
            height: boxHeight
          });
        }

        if (isFork) {
          // Limpiar flechas normales saliendo del mismo sourceBox para evitar flechas duplicadas
          if (sourceBox) {
            for (const [arrId, arr] of Array.from(this.state.arrows.entries())) {
              if (arr.id !== newArrow.id && arr.type === 'normal') {
                if (Math.hypot(arr.x1 - (sourceBox.x + sourceBox.width), arr.y1 - (sourceBox.y + sourceBox.height / 2)) < 60) {
                  this.state.removeArrow(arrId);
                }
              }
            }
          }

          // Verificar si ya existen recuadros en las ramas antes de crear duplicados
          let existingTop = null;
          let existingBottom = null;
          for (const box of this.state.referenceBoxes.values()) {
            if (box.boxType === 'compound' && box !== sourceBox) {
              if (Math.hypot(box.x - endX, (box.y + box.height / 2) - yTop) < 100) {
                existingTop = box;
              } else if (Math.hypot(box.x - endX, (box.y + box.height / 2) - yBottom) < 100) {
                existingBottom = box;
              }
            }
          }

          if (!existingTop) {
            const labelTop = ProblemBuilder.getNextLabel(this.state);
            this.state.addReferenceBox({
              boxType: 'compound',
              label: labelTop,
              x: endX + gap,
              y: yTop - boxHeight / 2,
              width: boxWidth,
              height: boxHeight
            });
          }

          if (!existingBottom) {
            const labelBottom = ProblemBuilder.getNextLabel(this.state);
            this.state.addReferenceBox({
              boxType: 'compound',
              label: labelBottom,
              x: endX + gap,
              y: yBottom - boxHeight / 2,
              width: boxWidth,
              height: boxHeight
            });
          }
        } else {
        // Buscar si el final está cerca de un recuadro de compuesto existente
        // Recuadro destino: el que tenga cualquier borde cerca de la punta (así se cierran
        // esquemas cíclicos volviendo al primer recuadro, venga la flecha de donde venga)
        let targetBox = ProblemBuilder.findBoxNearPoint(endX, endY, this.state, sourceBox);
        if (!targetBox) {
          let minTgtDist = 90;
          for (const box of this.state.referenceBoxes.values()) {
            if (box.boxType === 'compound' && box !== sourceBox) {
              const d = Math.hypot(box.x - endX, box.y + box.height / 2 - endY);
              if (d < minTgtDist) {
                minTgtDist = d;
                targetBox = box;
              }
            }
          }
        }
        // Si el recuadro nuevo caería encima de uno existente, reutilizarlo
        if (!targetBox) {
          targetBox = ProblemBuilder.findOverlappingBox(
            { x: endX + gap, y: endY - boxHeight / 2, width: boxWidth, height: boxHeight }, this.state, sourceBox);
        }

          if (!targetBox) {
            const labelB = ProblemBuilder.getNextLabel(this.state);
            targetBox = this.state.addReferenceBox({
              boxType: 'compound',
              label: labelB,
              x: endX + gap,
              y: endY - boxHeight / 2,
              width: boxWidth,
              height: boxHeight
            });
          }
        }
      }
    }

    this.state.clearSelection();
    this.state.selected.arrows.add(newArrow.id);
    if (this.state.isProblemMode) {
      ProblemBuilder.assignUnknownLetters(this.state);
    }
    ChemAligner.adjustArrowsToMolecules(this.state);
    this.renderer.render();

    if (this.onArrowCreated) {
      this.onArrowCreated(newArrow);
    }

    this.resetDrawingState();
  }

  resetDrawingState() {
    this.rawStartPos = null;
    this.effectiveStartPos = null;
    this.startAnchor = null;
    this.currentSnapped = null;
  }

  createBentArrow(x1, y1, x2, y2, bend = 'hv') {
    this.state.saveSnapshot();
    const newArrow = this.state.addArrow({
      x1, y1, x2, y2,
      type: 'normal',
      bend,
      reagentsTop: '',
      reagentsBottom: ''
    });
    this.state.clearSelection();
    this.state.selected.arrows.add(newArrow.id);
    this.renderer.render();
    if (this.onArrowCreated) this.onArrowCreated(newArrow);
    return newArrow;
  }

  updateBentPreview(x1, y1, x2, y2, bend) {
    if (!this.renderer || !this.renderer.svg) return;
    const root = this.renderer.svg.querySelector('#canvas-root') || this.renderer.svg;
    let previewGroup = this.renderer.svg.querySelector('.arrow-drawing-preview');
    if (!previewGroup) {
      previewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      previewGroup.setAttribute('class', 'arrow-drawing-preview');
      previewGroup.setAttribute('pointer-events', 'none');
      if (root) root.appendChild(previewGroup);
    }
    previewGroup.innerHTML = '';
    const c = bend === 'vh' ? { x: x1, y: y2 } : { x: x2, y: y1 };
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} L ${c.x} ${c.y} L ${x2} ${y2}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#2563eb');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-dasharray', '5 4');
    path.setAttribute('marker-end', 'url(#arrowhead-selected)');
    previewGroup.appendChild(path);
  }

  updatePreview(x1, y1, x2, y2, angleDeg, isSnapped) {
    if (!this.renderer || !this.renderer.svg) return;
    const root = this.renderer.svg.querySelector('#canvas-root') || this.renderer.svg;
    let previewGroup = this.renderer.svg.querySelector('.arrow-drawing-preview');
    if (!previewGroup) {
      previewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      previewGroup.setAttribute('class', 'arrow-drawing-preview');
      previewGroup.setAttribute('pointer-events', 'none');
      if (root) root.appendChild(previewGroup);
    }
    previewGroup.innerHTML = '';

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', isSnapped ? '#10b981' : '#2563eb');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', (this.defaultType === 'dashed' || !isSnapped) ? '5 4' : 'none');
    line.setAttribute('marker-end', 'url(#arrowhead-selected)');
    previewGroup.appendChild(line);

    // Badge visual del ángulo
    const badge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - 16;

    const badgeBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    badgeBg.setAttribute('x', midX - 30);
    badgeBg.setAttribute('y', midY - 10);
    badgeBg.setAttribute('width', '60');
    badgeBg.setAttribute('height', '18');
    badgeBg.setAttribute('rx', '4');
    badgeBg.setAttribute('fill', isSnapped ? '#065f46' : '#1e3a8a');
    badge.appendChild(badgeBg);

    const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    badgeText.setAttribute('x', midX);
    badgeText.setAttribute('y', midY + 3);
    badgeText.setAttribute('text-anchor', 'middle');
    badgeText.setAttribute('font-family', 'sans-serif');
    badgeText.setAttribute('font-size', '11');
    badgeText.setAttribute('font-weight', 'bold');
    badgeText.setAttribute('fill', '#ffffff');
    badgeText.textContent = `${Math.round(angleDeg)}°${isSnapped ? ' 🔒' : ''}`;
    badge.appendChild(badgeText);

    previewGroup.appendChild(badge);
  }

  clearPreview() {
    if (!this.renderer || !this.renderer.svg) return;
    const preview = this.renderer.svg.querySelector('.arrow-drawing-preview');
    if (preview && preview.parentNode) {
      preview.parentNode.removeChild(preview);
    }
  }
}
