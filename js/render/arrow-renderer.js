/**
 * arrow-renderer.js - Renderizador SVG de flechas de reacción y reactivos
 * Tamaño de letra ampliado (16px) como en los exámenes oficiales de la IChO,
 * con espaciado amplio y alineación lateral para flechas verticales.
 */

import { formatChemicalFormula, renderFormattedSvgText, getArrowBendCorner } from '../chem-engine/elements.js';
import { ReferenceBoxRenderer } from './reference-box.js';

export class ArrowRenderer {
  /**
   * Flecha doblada en "L" (estilo IChO: → y luego ↓). Los reactivos van en el primer tramo,
   * igual que en una flecha recta con esa orientación; la punta va al final del segundo tramo.
   */
  static renderBentArrow(arrow, corner, isSelected = false, state = null) {
    const NS = 'http://www.w3.org/2000/svg';
    const firstLeg = { ...arrow, bend: null, x2: corner.x, y2: corner.y, noHead: true };
    const group = this.renderArrow(firstLeg, isSelected, state);
    // Quitar la línea recta del primer tramo y sus tiradores: se dibuja todo como un solo trazo
    for (const el of Array.from(group.children)) {
      if (el.tagName === 'line' || (el.getAttribute && /arrow-handle/.test(el.getAttribute('class') || ''))) el.remove();
    }
    const isDark = Boolean(state && state.isDarkMode);
    const d = `M ${arrow.x1} ${arrow.y1} L ${corner.x} ${corner.y} L ${arrow.x2} ${arrow.y2}`;

    const hit = document.createElementNS(NS, 'path');
    hit.setAttribute('d', d);
    hit.setAttribute('fill', 'none');
    hit.setAttribute('stroke', 'transparent');
    hit.setAttribute('stroke-width', '24');
    hit.setAttribute('class', 'arrow-hit-area');

    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', isSelected ? '#2563eb' : (isDark ? '#ffffff' : '#111827'));
    path.setAttribute('stroke-width', isSelected ? '2.4' : '1.8');
    path.setAttribute('stroke-linejoin', 'miter');
    path.setAttribute('class', 'arrow-bent-line');
    if (arrow.type === 'dashed' || arrow.dashed || arrow.isDashed) path.setAttribute('stroke-dasharray', '5 4');
    if (!arrow.noHead) path.setAttribute('marker-end', `url(#arrowhead-${isSelected ? 'selected' : 'normal'})`);

    group.insertBefore(path, group.firstChild);
    group.insertBefore(hit, group.firstChild);
    group.classList?.add('bent-arrow');

    if (isSelected) {
      group.appendChild(this.createHandle(arrow.x1, arrow.y1, 'start', arrow.id));
      group.appendChild(this.createHandle(arrow.x2, arrow.y2, 'end', arrow.id));
    }
    return group;
  }

  static renderArrow(arrow, isSelected = false, state = null) {
    const bendCorner = getArrowBendCorner(arrow);
    if (bendCorner) {
      return this.renderBentArrow(arrow, bendCorner, isSelected, state);
    }
    if (arrow.type === 'fork') {
      return this.renderForkArrow(arrow, isSelected, state);
    }
    if (arrow.type === 'converge') {
      return this.renderConvergeArrow(arrow, isSelected, state);
    }

    const { id, x1, y1, x2, y2, type, reagentsTop, reagentsBottom } = arrow;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);

    const isDark = Boolean(state && state.isDarkMode);
    const defaultColor = isDark ? '#ffffff' : '#111827';

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `reaction-arrow ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', id);

    if (length < 2) return group;

    // Área táctil transparente
    const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hitArea.setAttribute('x1', x1);
    hitArea.setAttribute('y1', y1);
    hitArea.setAttribute('x2', x2);
    hitArea.setAttribute('y2', y2);
    hitArea.setAttribute('stroke', 'transparent');
    hitArea.setAttribute('stroke-width', '24');
    hitArea.setAttribute('class', 'arrow-hit-area');
    group.appendChild(hitArea);

    // Línea de la flecha
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', isSelected ? '#2563eb' : defaultColor);
    line.setAttribute('stroke-width', isSelected ? '2.4' : '1.8');
    if (type === 'dashed' || arrow.dashed || arrow.isDashed) {
      line.setAttribute('stroke-dasharray', '5 4');
    }
    // noHead: tramo sin punta (p. ej. el primer tramo de una flecha en "L": → ↓)
    if (!arrow.noHead) {
      line.setAttribute('marker-end', `url(#arrowhead-${isSelected ? 'selected' : 'normal'})`);
    }
    group.appendChild(line);

    // Centro del segmento
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const angleDeg = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
    const isVertical = (angleDeg >= 60 && angleDeg <= 120) || (angleDeg >= 240 && angleDeg <= 300);

    const structMetrics = arrow.structureTop ? this.getArrowStructureMetrics(arrow.structureTop) : null;

    if (isVertical) {
      // --- FLECHA VERTICAL: Reactivos al lado derecho con espacio generoso ---
      const lateralGap = 20;
      let currLateralX = midX + lateralGap;

      if (structMetrics) {
        const structGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        structGroup.setAttribute('class', 'arrow-reagent-struct');
        structGroup.setAttribute('data-arrow-id', id);
        structGroup.style.cursor = 'pointer';

        const finalStructX = currLateralX + structMetrics.dispW / 2;
        const finalStructY = midY;
        const origCenterX = (structMetrics.minX + structMetrics.maxX) / 2;
        const origCenterY = (structMetrics.minY + structMetrics.maxY) / 2;
        const tx = finalStructX - origCenterX * structMetrics.scale;
        const ty = finalStructY - origCenterY * structMetrics.scale;
        structGroup.setAttribute('transform', `translate(${tx}, ${ty}) scale(${structMetrics.scale})`);

        const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleEl.textContent = 'Molécula de reactivo sobre la flecha · Clic para editar';
        structGroup.appendChild(titleEl);

        ReferenceBoxRenderer.renderStructureThumbnail(structMetrics, structGroup, isDark);
        group.appendChild(structGroup);

        currLateralX += structMetrics.dispW + 12;
      }

      const combinedReagents = [reagentsTop, reagentsBottom].filter(t => t && t.trim() !== '').join('\n');
      if (combinedReagents) {
        const textGroup = this.renderReagentsText(
          combinedReagents,
          currLateralX,
          midY,
          'start',
          'reagent-vertical',
          isDark
        );
        group.appendChild(textGroup);
      }
    } else {
      // --- FLECHA HORIZONTAL O DIAGONAL ---
      let nx = dy / length;
      let ny = -dx / length;
      if (ny > 0) {
        nx = -nx;
        ny = -ny;
      }

      // Vector unitario tangencial a lo largo de la flecha
      const ux = dx / length;
      const uy = dy / length;

      // Separación equilibrada para letras grandes estilo IChO más cerca de la flecha
      const offsetTop = 8;
      const offsetBottom = 11;

      // Reactivos Arriba (incluyendo molécula si existe)
      const hasTopText = reagentsTop && reagentsTop.trim() !== '';
      const topLines = hasTopText ? reagentsTop.split('\n') : [];
      const textHeight = topLines.length * 19;
      const maxChars = hasTopText ? Math.max(...topLines.map(l => l.length)) : 0;
      const textWidth = hasTopText ? maxChars * 8.5 + 4 : 0;

      if (structMetrics) {
        // Molécula sobre la flecha, centrada (estilo IChO); el texto de arriba va ENCIMA de ella
        void textWidth;
        const structCenterX = midX;
        const structCenterY = midY;

        // Margen extra: las etiquetas (OBn, AcO...) sobresalen de las posiciones de los átomos
        const labelPad = 8;
        const distFromArrow = offsetTop + labelPad + structMetrics.dispH / 2;
        const finalStructX = structCenterX + nx * distFromArrow;
        const finalStructY = structCenterY + ny * distFromArrow;

        const structGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        structGroup.setAttribute('class', 'arrow-reagent-struct');
        structGroup.setAttribute('data-arrow-id', id);
        structGroup.style.cursor = 'pointer';

        const origCenterX = (structMetrics.minX + structMetrics.maxX) / 2;
        const origCenterY = (structMetrics.minY + structMetrics.maxY) / 2;
        const tx = finalStructX - origCenterX * structMetrics.scale;
        const ty = finalStructY - origCenterY * structMetrics.scale;
        structGroup.setAttribute('transform', `translate(${tx}, ${ty}) scale(${structMetrics.scale})`);

        const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleEl.textContent = 'Molécula de reactivo sobre la flecha · Clic para editar';
        structGroup.appendChild(titleEl);

        ReferenceBoxRenderer.renderStructureThumbnail(structMetrics, structGroup, isDark);
        group.appendChild(structGroup);

        // Texto de arriba (ej. "1) NIS, TMSOTf") encima de la molécula, centrado
        if (hasTopText) {
          const dist = offsetTop + labelPad + structMetrics.dispH + labelPad + 10 + textHeight / 2;
          const topGroup = this.renderReagentsText(
            reagentsTop,
            midX + nx * dist,
            midY + ny * dist,
            'middle',
            'reagent-top',
            isDark
          );
          group.appendChild(topGroup);
        }
      } else if (hasTopText) {
        // Sin molécula, renderizado tradicional centrado
        const topGroup = this.renderReagentsText(
          reagentsTop,
          midX + nx * (offsetTop + textHeight / 2),
          midY + ny * (offsetTop + textHeight / 2),
          'middle',
          'reagent-top',
          isDark
        );
        group.appendChild(topGroup);
      }

      // Reactivos Abajo
      if (reagentsBottom && reagentsBottom.trim() !== '') {
        const lines = reagentsBottom.split('\n');
        const textHeight = lines.length * 19;
        const bottomGroup = this.renderReagentsText(
          reagentsBottom,
          midX - nx * (offsetBottom + textHeight / 2),
          midY - ny * (offsetBottom + textHeight / 2),
          'middle',
          'reagent-bottom',
          isDark
        );
        group.appendChild(bottomGroup);
      }
    }

    if (isSelected) {
      const h1 = this.createHandle(x1, y1, 'start', id);
      const h2 = this.createHandle(x2, y2, 'end', id);
      group.appendChild(h1);
      group.appendChild(h2);
    }

    return group;
  }

  static renderForkArrow(arrow, isSelected = false, state = null) {
    const { id, x1, y1, x2, reagentsTop, reagentsBottom } = arrow;
    const isDark = Boolean(state && state.isDarkMode);
    const strokeColor = isSelected ? '#2563eb' : (isDark ? '#ffffff' : '#111827');
    const strokeWidth = isSelected ? '2.4' : '1.8';
    const markerUrl = `url(#arrowhead-${isSelected ? 'selected' : 'normal'})`;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `reaction-arrow fork-arrow ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', id);

    const branchSpacing = arrow.branchSpacing || 130;
    const isVertical = arrow.direction === 'down' || arrow.direction === 'up' || (Math.abs(arrow.y2 - arrow.y1) > Math.abs(arrow.x2 - arrow.x1));
    const radius = 6;

    let dTop, dBottom;
    let hitStem, hitBranch1, hitBranch2;
    let stemLine;

    if (isVertical) {
      const isUp = arrow.direction === 'up' || arrow.y2 < arrow.y1;
      const stemEndY = arrow.stemEndY !== undefined 
        ? arrow.stemEndY 
        : (isUp ? Math.min(arrow.y1 - 50, (arrow.y1 + arrow.y2) / 2) : Math.max(arrow.y1 + 50, (arrow.y1 + arrow.y2) / 2));
      const xLeft = arrow.xTop !== undefined ? arrow.xTop : (x1 - branchSpacing / 2);
      const xRight = arrow.xBottom !== undefined ? arrow.xBottom : (x1 + branchSpacing / 2);
      const signY = isUp ? -1 : 1;

      hitStem = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      hitStem.setAttribute('x1', x1);
      hitStem.setAttribute('y1', y1);
      hitStem.setAttribute('x2', x1);
      hitStem.setAttribute('y2', stemEndY);
      hitStem.setAttribute('stroke', 'transparent');
      hitStem.setAttribute('stroke-width', '24');
      hitStem.setAttribute('class', 'arrow-hit-area');
      group.appendChild(hitStem);

      stemLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      stemLine.setAttribute('x1', x1);
      stemLine.setAttribute('y1', y1);
      stemLine.setAttribute('x2', x1);
      stemLine.setAttribute('y2', stemEndY);
      stemLine.setAttribute('stroke', strokeColor);
      stemLine.setAttribute('stroke-width', strokeWidth);
      group.appendChild(stemLine);

      dTop = `M ${x1} ${stemEndY} L ${xLeft + radius} ${stemEndY} Q ${xLeft} ${stemEndY} ${xLeft} ${stemEndY + signY * radius} L ${xLeft} ${arrow.y2}`;
      dBottom = `M ${x1} ${stemEndY} L ${xRight - radius} ${stemEndY} Q ${xRight} ${stemEndY} ${xRight} ${stemEndY + signY * radius} L ${xRight} ${arrow.y2}`;
    } else {
      const isLeft = arrow.direction === 'left' || arrow.x2 < x1;
      const signX = isLeft ? -1 : 1;
      const stemEndX = arrow.stemEndX !== undefined 
        ? arrow.stemEndX 
        : (isLeft ? Math.min(x1 - 50, x1 + (x2 - x1) * 0.45) : Math.max(x1 + 50, x1 + (x2 - x1) * 0.45));
      const yTop = arrow.yTop !== undefined ? arrow.yTop : (y1 - branchSpacing / 2);
      const yBottom = arrow.yBottom !== undefined ? arrow.yBottom : (y1 + branchSpacing / 2);

      hitStem = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      hitStem.setAttribute('x1', x1);
      hitStem.setAttribute('y1', y1);
      hitStem.setAttribute('x2', stemEndX);
      hitStem.setAttribute('y2', y1);
      hitStem.setAttribute('stroke', 'transparent');
      hitStem.setAttribute('stroke-width', '24');
      hitStem.setAttribute('class', 'arrow-hit-area');
      group.appendChild(hitStem);

      stemLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      stemLine.setAttribute('x1', x1);
      stemLine.setAttribute('y1', y1);
      stemLine.setAttribute('x2', stemEndX);
      stemLine.setAttribute('y2', y1);
      stemLine.setAttribute('stroke', strokeColor);
      stemLine.setAttribute('stroke-width', strokeWidth);
      group.appendChild(stemLine);

      dTop = `M ${stemEndX} ${y1} L ${stemEndX} ${yTop + radius} Q ${stemEndX} ${yTop} ${stemEndX + signX * radius} ${yTop} L ${x2} ${yTop}`;
      dBottom = `M ${stemEndX} ${y1} L ${stemEndX} ${yBottom - radius} Q ${stemEndX} ${yBottom} ${stemEndX + signX * radius} ${yBottom} L ${x2} ${yBottom}`;
    }

    // Rama 1
    const topPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    topPath.setAttribute('d', dTop);
    topPath.setAttribute('fill', 'none');
    topPath.setAttribute('stroke', strokeColor);
    topPath.setAttribute('stroke-width', strokeWidth);
    topPath.setAttribute('marker-end', markerUrl);
    group.appendChild(topPath);

    // Rama 2
    const bottomPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bottomPath.setAttribute('d', dBottom);
    bottomPath.setAttribute('fill', 'none');
    bottomPath.setAttribute('stroke', strokeColor);
    bottomPath.setAttribute('stroke-width', strokeWidth);
    bottomPath.setAttribute('marker-end', markerUrl);
    group.appendChild(bottomPath);

    // 5. Reactivos situados sobre el tallo principal
    const midStemX = (x1 + (arrow.stemEndX || x1)) / 2;
    const offsetTop = 8;
    const offsetBottom = 11;

    if (reagentsTop && reagentsTop.trim() !== '') {
      const lines = reagentsTop.split('\n');
      const textHeight = lines.length * 19;
      const topGroup = this.renderReagentsText(
        reagentsTop,
        midStemX,
        y1 - (offsetTop + textHeight / 2),
        'middle',
        'reagent-top',
        isDark
      );
      group.appendChild(topGroup);
    }

    if (reagentsBottom && reagentsBottom.trim() !== '') {
      const lines = reagentsBottom.split('\n');
      const textHeight = lines.length * 19;
      const bottomGroup = this.renderReagentsText(
        reagentsBottom,
        midStemX,
        y1 + (offsetBottom + textHeight / 2),
        'middle',
        'reagent-bottom',
        isDark
      );
      group.appendChild(bottomGroup);
    }

    // 6. Tiradores de edición interactiva si está seleccionada
    if (isSelected) {
      group.appendChild(this.createHandle(x1, y1, 'start', id));
      group.appendChild(this.createHandle(stemEndX, y1, 'stemEnd', id));
      group.appendChild(this.createHandle(x2, yTop, 'endTop', id));
      group.appendChild(this.createHandle(x2, yBottom, 'endBottom', id));
    }

    return group;
  }

  static renderConvergeArrow(arrow, isSelected = false, state = null) {
    const { id, x1, x2, reagentsTop, reagentsBottom } = arrow;
    const isDark = Boolean(state && state.isDarkMode);
    const strokeColor = isSelected ? '#2563eb' : (isDark ? '#ffffff' : '#111827');
    const strokeWidth = isSelected ? '2.4' : '1.8';
    const markerUrl = `url(#arrowhead-${isSelected ? 'selected' : 'normal'})`;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `reaction-arrow converge-arrow ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', id);

    const branchSpacing = arrow.branchSpacing || 150;
    const yMid = arrow.yMid !== undefined ? arrow.yMid : (arrow.y2 !== undefined ? arrow.y2 : 300);
    const yTop = arrow.yTop !== undefined ? arrow.yTop : (yMid - branchSpacing / 2);
    const yBottom = arrow.yBottom !== undefined ? arrow.yBottom : (yMid + branchSpacing / 2);
    const stemStartX = arrow.stemStartX !== undefined ? arrow.stemStartX : Math.max(x1 + 40, x1 + (x2 - x1) * 0.4);
    const radius = 6;

    // 1. Áreas táctiles transparentes
    const hitTop = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hitTop.setAttribute('x1', x1);
    hitTop.setAttribute('y1', yTop);
    hitTop.setAttribute('x2', stemStartX);
    hitTop.setAttribute('y2', yTop);
    hitTop.setAttribute('stroke', 'transparent');
    hitTop.setAttribute('stroke-width', '24');
    hitTop.setAttribute('class', 'arrow-hit-area');
    group.appendChild(hitTop);

    const hitBottom = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hitBottom.setAttribute('x1', x1);
    hitBottom.setAttribute('y1', yBottom);
    hitBottom.setAttribute('x2', stemStartX);
    hitBottom.setAttribute('y2', yBottom);
    hitBottom.setAttribute('stroke', 'transparent');
    hitBottom.setAttribute('stroke-width', '24');
    hitBottom.setAttribute('class', 'arrow-hit-area');
    group.appendChild(hitBottom);

    const hitStem = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hitStem.setAttribute('x1', stemStartX);
    hitStem.setAttribute('y1', yMid);
    hitStem.setAttribute('x2', x2);
    hitStem.setAttribute('y2', yMid);
    hitStem.setAttribute('stroke', 'transparent');
    hitStem.setAttribute('stroke-width', '24');
    hitStem.setAttribute('class', 'arrow-hit-area');
    group.appendChild(hitStem);

    // 2. Rama Superior: horizontal desde (x1, yTop) a (stemStartX - r, yTop), curva hacia abajo hasta (stemStartX, yMid)
    const topPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const dTop = `M ${x1} ${yTop} L ${stemStartX - radius} ${yTop} Q ${stemStartX} ${yTop} ${stemStartX} ${yTop + radius} L ${stemStartX} ${yMid}`;
    topPath.setAttribute('d', dTop);
    topPath.setAttribute('stroke', strokeColor);
    topPath.setAttribute('stroke-width', strokeWidth);
    topPath.setAttribute('fill', 'none');
    group.appendChild(topPath);

    // 3. Rama Inferior: horizontal desde (x1, yBottom) a (stemStartX - r, yBottom), curva hacia arriba hasta (stemStartX, yMid)
    const bottomPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const dBottom = `M ${x1} ${yBottom} L ${stemStartX - radius} ${yBottom} Q ${stemStartX} ${yBottom} ${stemStartX} ${yBottom - radius} L ${stemStartX} ${yMid}`;
    bottomPath.setAttribute('d', dBottom);
    bottomPath.setAttribute('stroke', strokeColor);
    bottomPath.setAttribute('stroke-width', strokeWidth);
    bottomPath.setAttribute('fill', 'none');
    group.appendChild(bottomPath);

    // 4. Tallo principal unido: desde (stemStartX, yMid) hasta (x2, yMid) con punta de flecha
    const stemLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    stemLine.setAttribute('x1', stemStartX);
    stemLine.setAttribute('y1', yMid);
    stemLine.setAttribute('x2', x2);
    stemLine.setAttribute('y2', yMid);
    stemLine.setAttribute('stroke', strokeColor);
    stemLine.setAttribute('stroke-width', strokeWidth);
    stemLine.setAttribute('marker-end', markerUrl);
    group.appendChild(stemLine);

    // 5. Reactivos sobre y bajo el tallo unido
    const stemMidX = (stemStartX + x2) / 2;
    const offsetTop = 8;
    const offsetBottom = 11;

    if (reagentsTop && reagentsTop.trim() !== '') {
      const lines = reagentsTop.split('\n');
      const textHeight = lines.length * 19;
      const topGroup = this.renderReagentsText(
        reagentsTop,
        stemMidX,
        yMid - (offsetTop + textHeight / 2),
        'middle',
        'reagent-top',
        isDark
      );
      group.appendChild(topGroup);
    }

    if (reagentsBottom && reagentsBottom.trim() !== '') {
      const lines = reagentsBottom.split('\n');
      const textHeight = lines.length * 19;
      const bottomGroup = this.renderReagentsText(
        reagentsBottom,
        stemMidX,
        yMid + (offsetBottom + textHeight / 2),
        'middle',
        'reagent-bottom',
        isDark
      );
      group.appendChild(bottomGroup);
    }

    // 6. Tiradores de interacción si está seleccionada
    if (isSelected) {
      group.appendChild(this.createHandle(x1, yTop, 'startTop', id));
      group.appendChild(this.createHandle(x1, yBottom, 'startBottom', id));
      group.appendChild(this.createHandle(stemStartX, yMid, 'stemMeet', id));
      group.appendChild(this.createHandle(x2, yMid, 'end', id));
    }

    return group;
  }

  static renderReagentsText(text, x, y, anchor = 'middle', className = '', isDark = false) {
    const lines = text.split('\n');
    const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElem.setAttribute('x', x);
    textElem.setAttribute('y', y);
    textElem.setAttribute('text-anchor', anchor);
    textElem.setAttribute('class', `reagent-text ${className}`);
    textElem.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
    textElem.setAttribute('font-size', '16'); // Tamaño ampliado estilo IChO
    textElem.setAttribute('fill', isDark ? '#ffffff' : '#111827');

    const lineHeight = 20;
    const startY = y - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((lineText, idx) => {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', x);
      tspan.setAttribute('y', startY + idx * lineHeight + 5);
      this.populateFormattedTspan(tspan, lineText);
      textElem.appendChild(tspan);
    });

    return textElem;
  }

  static populateFormattedTspan(tspan, str) {
    if (!str) return;
    renderFormattedSvgText(tspan, str);
  }

  static getArrowStructureMetrics(structure) {
    let structObj = structure;
    if (typeof structure === 'string') {
      try {
        structObj = JSON.parse(structure);
      } catch {
        return null;
      }
    }
    if (!structObj || !structObj.atoms || structObj.atoms.length === 0) return null;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const a of structObj.atoms) {
      if (a.x < minX) minX = a.x;
      if (a.x > maxX) maxX = a.x;
      if (a.y < minY) minY = a.y;
      if (a.y > maxY) maxY = a.y;
    }
    for (const arr of (structObj.arrows || [])) {
      if (arr.x1 < minX) minX = arr.x1;
      if (arr.x1 > maxX) maxX = arr.x1;
      if (arr.x2 < minX) minX = arr.x2;
      if (arr.x2 > maxX) maxX = arr.x2;
      if (arr.y1 < minY) minY = arr.y1;
      if (arr.y1 > maxY) maxY = arr.y1;
      if (arr.y2 < minY) minY = arr.y2;
      if (arr.y2 > maxY) maxY = arr.y2;
    }

    const rawW = Math.max(25, maxX - minX);
    const rawH = Math.max(25, maxY - minY);

    // Escala de reactivo (como los donadores sobre flecha de la IChO): 65 % del tamaño de la
    // pizarra, reduciendo más solo si la molécula es muy grande
    const targetH = 110;
    const targetW = 190;
    const scale = Math.min(0.65, targetH / rawH, targetW / rawW);
    const dispW = Math.max(26, Math.round(rawW * scale));
    const dispH = Math.max(26, Math.round(rawH * scale));

    return {
      structObj,
      minX, maxX, minY, maxY,
      rawW, rawH,
      scale,
      dispW,
      dispH
    };
  }

  static createHandle(x, y, role, parentId) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '5');
    circle.setAttribute('fill', '#ffffff');
    circle.setAttribute('stroke', '#2563eb');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('class', `arrow-handle handle-${role}`);
    circle.setAttribute('data-handle-role', role);
    circle.setAttribute('data-parent-id', parentId);
    circle.style.cursor = 'crosshair';
    return circle;
  }
}
