/**
 * reference-box.js - Renderizador del Recuadro de Referencias estilo IChO
 * Organiza las abreviaturas con flujo multilínea automático y espaciado generoso
 * para evitar colisiones y amontonamientos.
 */

import { formatChemicalFormula, renderFormattedSvgText } from '../chem-engine/elements.js';

export class ReferenceBoxRenderer {
  static render(box, isSelected = false, state = null) {
    if (box.boxType === 'compound') {
      return this.renderCompoundBox(box, isSelected, state);
    }

    const { id, x, y, width, height, title, items } = box;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `reference-box ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', id);

    const isDark = Boolean(state && state.isDarkMode);
    const paddingX = 20;
    const paddingY = 16;
    const availableWidth = width - paddingX * 2;

    // Procesar cada elemento de referencia (modo estructura visual o modo texto tradicional)
    const processedItems = [];
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const abbrStr = `${item.abbr} = `;
        const structMetrics = this.getStructureMetrics(item.structure);

        let itemWidth;
        let itemHeight;
        let textW = Math.max(28, abbrStr.length * 8.5 + 6);

        if (structMetrics) {
          // Si tiene estructura dibujada, el ancho acomoda el rótulo y el esquema químico SVG con holgura
          itemWidth = Math.max(120, textW + structMetrics.dispW + 20);
          itemHeight = Math.max(50, structMetrics.dispH + 16);
        } else {
          // Modo fórmula en texto
          const formStr = item.formula || '';
          itemWidth = Math.max(80, (abbrStr.length + formStr.length) * 7.5 + 24);
          itemHeight = 32;
        }

        processedItems.push({
          item,
          abbrStr,
          textW,
          structMetrics,
          itemWidth,
          itemHeight
        });
      }
    }

    // Organizar en filas multilínea inteligentes
    const rows = [];
    let currentRow = [];
    let currentLineWidth = 0;

    for (const pItem of processedItems) {
      if (currentRow.length > 0 && (currentLineWidth + pItem.itemWidth > availableWidth)) {
        rows.push(currentRow);
        currentRow = [pItem];
        currentLineWidth = pItem.itemWidth;
      } else {
        currentRow.push(pItem);
        currentLineWidth += pItem.itemWidth;
      }
    }
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    // Calcular altura total necesaria considerando las alturas dinámicas de cada fila
    const titleHeight = title && title.trim() !== '' ? 24 : 0;
    const rowHeights = rows.map(r => Math.max(28, ...r.map(pi => pi.itemHeight)));
    const totalRowsHeight = rowHeights.reduce((sum, h) => sum + h, 0);
    const rowGap = 8;
    const neededHeight = Math.max(height, paddingY * 2 + titleHeight + totalRowsHeight + Math.max(0, rows.length - 1) * rowGap);
    box.height = neededHeight;

    // Asegurar ancho suficiente si una fila de estructuras es ancha
    if (rows.length > 0) {
      const maxRowWidth = Math.max(...rows.map(r => r.reduce((sum, pi) => sum + pi.itemWidth, 0) + (r.length - 1) * 16));
      if (maxRowWidth + paddingX * 2 > width) {
        box.width = Math.round(maxRowWidth + paddingX * 2);
      }
    }

    // 1. Fondo blanco / oscuro semitransparente
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', x);
    bgRect.setAttribute('y', y);
    bgRect.setAttribute('width', box.width);
    bgRect.setAttribute('height', neededHeight);
    bgRect.setAttribute('rx', '8');
    bgRect.setAttribute('ry', '8');
    bgRect.setAttribute('fill', isDark ? '#0f172a' : '#ffffff');
    bgRect.setAttribute('fill-opacity', isDark ? '0.88' : '0.95');
    group.appendChild(bgRect);

    // 2. Contorno punteado característico de problemas IChO
    const borderRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    borderRect.setAttribute('x', x);
    borderRect.setAttribute('y', y);
    borderRect.setAttribute('width', box.width);
    borderRect.setAttribute('height', neededHeight);
    borderRect.setAttribute('rx', '8');
    borderRect.setAttribute('ry', '8');
    borderRect.setAttribute('fill', 'none');
    borderRect.setAttribute('stroke', isSelected ? '#2563eb' : (isDark ? '#94a3b8' : '#4b5563'));
    borderRect.setAttribute('stroke-width', '1.6');
    borderRect.setAttribute('stroke-dasharray', '6 5');
    borderRect.setAttribute('class', 'reference-box-border');
    group.appendChild(borderRect);

    // 3. Título opcional
    let startY = y + paddingY + 12;
    if (title && title.trim() !== '') {
      const titleElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      titleElem.setAttribute('x', x + paddingX);
      titleElem.setAttribute('y', startY);
      titleElem.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      titleElem.setAttribute('font-size', '13');
      titleElem.setAttribute('font-weight', 'bold');
      titleElem.setAttribute('fill', isDark ? '#f8fafc' : '#1e293b');
      titleElem.textContent = title;
      group.appendChild(titleElem);
      startY += titleHeight;
    }

    // 4. Renderizar cada fila calculada
    let currY = startY;
    rows.forEach((row, rowIdx) => {
      const rowHeight = rowHeights[rowIdx] || 28;
      const rowCenterY = currY + rowHeight / 2;

      // Calcular espaciado uniforme en la fila
      const totalItemsWidth = row.reduce((sum, r) => sum + r.itemWidth, 0);
      const remainingSpace = Math.max(0, (box.width - paddingX * 2) - totalItemsWidth);
      const extraSpacing = row.length > 1 ? remainingSpace / (row.length - 1) : 0;

      let itemPosX = x + paddingX;

      row.forEach((pItem, colIdx) => {
        const { item, abbrStr, textW, structMetrics, itemWidth } = pItem;

        // Texto con el símbolo: "TBS =" o "-OMs ="
        const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElem.setAttribute('x', itemPosX);
        textElem.setAttribute('y', rowCenterY + 5);
        textElem.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
        textElem.setAttribute('font-size', '14');
        textElem.setAttribute('fill', isDark ? '#f8fafc' : '#0f172a');
        textElem.setAttribute('class', 'ref-item-text');
        textElem.setAttribute('data-parent-id', id);
        textElem.setAttribute('data-abbr', item.abbr);
        textElem.style.cursor = 'pointer';

        const abbrSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        abbrSpan.setAttribute('font-weight', 'bold');
        abbrSpan.textContent = abbrStr;
        textElem.appendChild(abbrSpan);

        if (!structMetrics) {
          // Fórmula textual en su propio tspan: renderFormattedSvgText vacía el elemento que recibe,
          // y si se usaba textElem borraba el "abbr =" ya escrito
          const formulaSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          this.populateFormattedFormula(formulaSpan, item.formula || '');
          textElem.appendChild(formulaSpan);
        }

        const titleTip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleTip.textContent = `Clic para abrir 'Editor de Estructura' y editar ${item.abbr}`;
        textElem.appendChild(titleTip);
        group.appendChild(textElem);

        // Si tiene estructura química dibujada, renderizar su miniatura vectorial al lado
        if (structMetrics) {
          const structGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          structGroup.setAttribute('class', 'ref-item-struct');
          structGroup.setAttribute('data-parent-id', id);
          structGroup.setAttribute('data-abbr', item.abbr);
          structGroup.style.cursor = 'pointer';

          const structCenterX = itemPosX + textW + structMetrics.dispW / 2 + 4;
          const origCenterX = (structMetrics.minX + structMetrics.maxX) / 2;
          const origCenterY = (structMetrics.minY + structMetrics.maxY) / 2;
          const tx = structCenterX - origCenterX * structMetrics.scale;
          const ty = rowCenterY - origCenterY * structMetrics.scale;
          structGroup.setAttribute('transform', `translate(${tx}, ${ty}) scale(${structMetrics.scale})`);

          const structTip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          structTip.textContent = `Estructura química de ${item.abbr} · Clic para editar`;
          structGroup.appendChild(structTip);

          this.renderStructureThumbnail(structMetrics, structGroup, isDark);
          group.appendChild(structGroup);
        }

        // Separador sutil entre elementos de la misma fila
        if (colIdx < row.length - 1) {
          const sepX = itemPosX + itemWidth + extraSpacing / 2;
          const sepLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          sepLine.setAttribute('x1', sepX);
          sepLine.setAttribute('y1', rowCenterY - rowHeight / 2 + 4);
          sepLine.setAttribute('x2', sepX);
          sepLine.setAttribute('y2', rowCenterY + rowHeight / 2 - 4);
          sepLine.setAttribute('stroke', isDark ? '#334155' : '#cbd5e1');
          sepLine.setAttribute('stroke-width', '1');
          group.appendChild(sepLine);
        }

        itemPosX += itemWidth + extraSpacing;
      });

      currY += rowHeight + rowGap;
    });

    // 5. Tirador de redimensionado si está seleccionado
    if (isSelected) {
      const resizeHandle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      resizeHandle.setAttribute('x', x + box.width - 6);
      resizeHandle.setAttribute('y', y + neededHeight - 6);
      resizeHandle.setAttribute('width', '12');
      resizeHandle.setAttribute('height', '12');
      resizeHandle.setAttribute('fill', '#2563eb');
      resizeHandle.setAttribute('class', 'box-resize-handle');
      resizeHandle.setAttribute('data-parent-id', id);
      resizeHandle.style.cursor = 'nwse-resize';
      group.appendChild(resizeHandle);
    }

    return group;
  }

  static renderCompoundBox(box, isSelected = false, state = null) {
    const { id, x, y, width, height, label } = box;
    const isDark = Boolean(state && state.isDarkMode);

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `reference-box compound-box ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', id);

    // 1. Fondo sutil semitransparente
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', x);
    bgRect.setAttribute('y', y);
    bgRect.setAttribute('width', width);
    bgRect.setAttribute('height', height);
    bgRect.setAttribute('rx', '6');
    bgRect.setAttribute('ry', '6');
    bgRect.setAttribute('fill', isDark ? '#0f172a' : '#ffffff');
    bgRect.setAttribute('fill-opacity', isDark ? '0.65' : '0.85');
    bgRect.setAttribute('pointer-events', 'none');
    group.appendChild(bgRect);

    // 2. Contorno punteado estándar de problemas de olimpiada
    const borderRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    borderRect.setAttribute('x', x);
    borderRect.setAttribute('y', y);
    borderRect.setAttribute('width', width);
    borderRect.setAttribute('height', height);
    borderRect.setAttribute('rx', '6');
    borderRect.setAttribute('ry', '6');
    borderRect.setAttribute('fill', 'none');
    borderRect.setAttribute('stroke', isSelected ? '#2563eb' : (isDark ? '#94a3b8' : '#64748b'));
    borderRect.setAttribute('stroke-width', isSelected ? '2' : '1.4');
    borderRect.setAttribute('stroke-dasharray', '5 4');
    borderRect.setAttribute('class', 'reference-box-border');
    borderRect.setAttribute('pointer-events', 'stroke');
    group.appendChild(borderRect);

    // ¿Hay alguna molécula dentro del recuadro?
    let hasAtoms = false;
    if (state && state.atoms) {
      for (const a of state.atoms.values()) {
        if (a.x >= x - 15 && a.x <= x + width + 15 && a.y >= y - 15 && a.y <= y + height + 15) {
          hasAtoms = true;
          break;
        }
      }
    }

    // 3. Etiqueta de esquina (A, B, C...): identifica el recuadro y se dibuja si hay molécula.
    //    En una incógnita vacía no se repite (la letra grande ya la muestra). El rótulo escrito
    //    por el usuario se dibuja aparte, debajo de la molécula.
    if (label && label.trim() !== '' && hasAtoms) {
      // Pastilla de fondo para la letra
      const badgeBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      badgeBg.setAttribute('x', x + 8);
      badgeBg.setAttribute('y', y + 8);
      badgeBg.setAttribute('width', '24');
      badgeBg.setAttribute('height', '22');
      badgeBg.setAttribute('rx', '4');
      badgeBg.setAttribute('fill', isDark ? '#1e293b' : '#f1f5f9');
      badgeBg.setAttribute('stroke', isDark ? '#334155' : '#cbd5e1');
      badgeBg.setAttribute('stroke-width', '1');
      group.appendChild(badgeBg);

      const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelText.setAttribute('x', x + 20);
      labelText.setAttribute('y', y + 24);
      labelText.setAttribute('text-anchor', 'middle');
      labelText.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      labelText.setAttribute('font-size', '14');
      labelText.setAttribute('font-weight', 'bold');
      labelText.setAttribute('fill', isDark ? '#f8fafc' : '#0f172a');
      labelText.textContent = label;
      group.appendChild(labelText);
    }

    // 4. Letra incógnita grande central de olimpiadas (A, B, C...) si el recuadro está vacío
    const letterToDisplay = box.unknownLetter || (!hasAtoms ? (box.label || 'A') : null);
    if (!hasAtoms && letterToDisplay) {
      const unknownText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      unknownText.setAttribute('x', x + width / 2);
      unknownText.setAttribute('y', y + height / 2 + 12);
      unknownText.setAttribute('text-anchor', 'middle');
      unknownText.setAttribute('font-family', "'Times New Roman', Times, Georgia, serif");
      unknownText.setAttribute('font-size', '38');
      unknownText.setAttribute('font-weight', 'bold');
      unknownText.setAttribute('font-style', 'italic');
      unknownText.setAttribute('fill', isDark ? '#ffffff' : '#0f172a');
      unknownText.setAttribute('pointer-events', 'none');
      unknownText.textContent = letterToDisplay;
      group.appendChild(unknownText);
    }

    // 4.1. Rótulo fijado por el usuario debajo de la molécula (estilo IChO) + descripción
    if (hasAtoms) {
      const tag = this.renderCompoundTag(box, state);
      if (tag) group.appendChild(tag);
    }
    const descText = this.renderDescription(box, state, hasAtoms || !letterToDisplay);
    if (descText) group.appendChild(descText);

    // 5. Tirador de redimensionado si está seleccionado
    if (isSelected) {
      const resizeHandle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      resizeHandle.setAttribute('x', x + width - 6);
      resizeHandle.setAttribute('y', y + height - 6);
      resizeHandle.setAttribute('width', '12');
      resizeHandle.setAttribute('height', '12');
      resizeHandle.setAttribute('fill', '#2563eb');
      resizeHandle.setAttribute('class', 'box-resize-handle');
      resizeHandle.setAttribute('data-parent-id', id);
      resizeHandle.style.cursor = 'nwse-resize';
      group.appendChild(resizeHandle);
    }

    // 6. Puntos inteligentes de conexión en cada eje (arriba, abajo, izquierda, derecha)
    const isProblemMode = Boolean(state && state.isProblemMode);
    if (isSelected || isProblemMode) {
      const activeAxis = box.activeAxis || 'right';
      const ports = [
        { axis: 'up', cx: x + width / 2, cy: y, title: 'Eje Superior (Arriba)' },
        { axis: 'down', cx: x + width / 2, cy: y + height, title: 'Eje Inferior (Abajo)' },
        { axis: 'left', cx: x, cy: y + height / 2, title: 'Eje Izquierdo (Izquierda)' },
        { axis: 'right', cx: x + width, cy: y + height / 2, title: 'Eje Derecho (Derecha)' }
      ];

      for (const p of ports) {
        const isActive = activeAxis === p.axis;
        const portGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        portGroup.setAttribute('class', `box-port-handle port-${p.axis} ${isActive ? 'active' : ''}`);
        portGroup.setAttribute('data-parent-id', id);
        portGroup.setAttribute('data-axis', p.axis);
        portGroup.style.cursor = 'pointer';

        const portCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        portCircle.setAttribute('cx', p.cx);
        portCircle.setAttribute('cy', p.cy);
        portCircle.setAttribute('r', isActive ? '4.5' : '3.0');
        portCircle.setAttribute('fill', isActive ? '#2563eb' : (isDark ? '#1e293b' : '#ffffff'));
        portCircle.setAttribute('stroke', isActive ? '#60a5fa' : (isDark ? '#64748b' : '#94a3b8'));
        portCircle.setAttribute('stroke-width', isActive ? '1.5' : '1.0');
        portGroup.appendChild(portCircle);

        const titleElem = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleElem.textContent = `${p.title}: Clic para fijar eje o añadir flecha`;
        portGroup.appendChild(titleElem);

        group.appendChild(portGroup);
      }
    }

    return group;
  }

  /**
   * Rótulo del compuesto escrito por el usuario (A, B, H1...), en negrita debajo de la molécula.
   * Solo se dibuja si el usuario lo fijó (box.showLabel); las letras automáticas no aparecen.
   */
  static renderCompoundTag(box, state = null) {
    // Rótulo escrito por el usuario (box.tag); los proyectos guardados antes usaban box.label
    const tagText = box.tag !== undefined ? box.tag : box.label;
    if (!box.showLabel || !tagText || !String(tagText).trim()) return null;
    const isDark = Boolean(state && state.isDarkMode);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', box.x + box.width / 2);
    text.setAttribute('y', box.y + box.height + 20);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
    // Nombres largos (p. ej. "Trinitrotolueno"): bajar el tamaño de letra para que quepa en el
    // ancho del recuadro, sin pasar de 20 px ni bajar de 11 px
    const tagLen = String(tagText).trim().length;
    const fontSize = Math.max(11, Math.min(20, (box.width + 10) / (tagLen * 0.62)));
    text.setAttribute('font-size', fontSize.toFixed(1));
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', isDark ? '#ffffff' : '#0f172a');
    text.setAttribute('pointer-events', 'none');
    text.setAttribute('class', 'compound-tag');
    text.textContent = String(tagText).trim();
    return text;
  }

  /**
   * Fórmula / descripción del compuesto (campo 'description'), con subíndices y superíndices.
   * En una incógnita va justo debajo de la letra grande (estilo IChO: "M" y debajo "(C36H42BO12R)");
   * si hay molécula, debajo del recuadro.
   */
  static renderDescription(box, state, hasAtoms) {
    if (!box.description || !String(box.description).trim()) return null;
    const isDark = Boolean(state && state.isDarkMode);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const letterBaseline = box.y + box.height / 2 + 12;
    const y = hasAtoms ? box.y + box.height + this.descriptionOffset(box, hasAtoms) : letterBaseline + 22;
    text.setAttribute('x', box.x + box.width / 2);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
    text.setAttribute('font-size', '13');
    text.setAttribute('fill', isDark ? '#e2e8f0' : '#1e293b');
    text.setAttribute('pointer-events', 'none');
    text.setAttribute('class', 'compound-description');
    renderFormattedSvgText(text, String(box.description).trim());
    return text;
  }

  /** Distancia de la descripción bajo el recuadro (más abajo si hay rótulo visible) */
  static descriptionOffset(box, hasAtoms) {
    const tagText = box.tag !== undefined ? box.tag : box.label;
    return (hasAtoms && box.showLabel && tagText && String(tagText).trim()) ? 38 : 17;
  }

  static renderStandaloneUnknown(box, isSelected = false, state = null) {
    const { id, x, y, width, height, unknownLetter } = box;
    const isDark = Boolean(state && state.isDarkMode);
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `reference-box standalone-unknown ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', id);

    // Área de clic transparente: sin ella la letra (pointer-events: none) no se podía seleccionar
    const hitRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitRect.setAttribute('x', x);
    hitRect.setAttribute('y', y);
    hitRect.setAttribute('width', width);
    hitRect.setAttribute('height', height);
    hitRect.setAttribute('fill', 'transparent');
    hitRect.setAttribute('class', 'standalone-unknown-hit');
    hitRect.style.cursor = 'pointer';
    group.appendChild(hitRect);

    if (isSelected) {
      const selRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      selRect.setAttribute('x', x - 4);
      selRect.setAttribute('y', y - 4);
      selRect.setAttribute('width', width + 8);
      selRect.setAttribute('height', height + 8);
      selRect.setAttribute('rx', '8');
      selRect.setAttribute('fill', 'none');
      selRect.setAttribute('stroke', '#2563eb');
      selRect.setAttribute('stroke-width', '2');
      selRect.setAttribute('stroke-dasharray', '4 3');
      group.appendChild(selRect);
    }

    const unknownText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    unknownText.setAttribute('x', x + width / 2);
    unknownText.setAttribute('y', y + height / 2 + 12);
    unknownText.setAttribute('text-anchor', 'middle');
    unknownText.setAttribute('font-family', "'Times New Roman', Times, Georgia, serif");
    unknownText.setAttribute('font-size', '38');
    unknownText.setAttribute('font-weight', 'bold');
    unknownText.setAttribute('font-style', 'italic');
    unknownText.setAttribute('fill', isDark ? '#ffffff' : '#0f172a');
    unknownText.setAttribute('pointer-events', 'none');
    unknownText.textContent = unknownLetter || 'A';
    group.appendChild(unknownText);

    // Fórmula / descripción justo debajo de la letra
    const descText = this.renderDescription(box, state, false);
    if (descText) group.appendChild(descText);

    return group;
  }

  static populateFormattedFormula(parentElem, str) {
    if (!str) return;
    renderFormattedSvgText(parentElem, str);
  }

  static getStructureMetrics(structure) {
    if (!structure) return null;
    let structObj = structure;
    if (typeof structure === 'string') {
      try {
        structObj = JSON.parse(structure);
      } catch {
        return null;
      }
    }
    const atoms = structObj.atoms || [];
    if (!atoms || atoms.length === 0) return null;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const a of atoms) {
      if (a.x < minX) minX = a.x;
      if (a.x > maxX) maxX = a.x;
      if (a.y < minY) minY = a.y;
      if (a.y > maxY) maxY = a.y;
    }
    const arrows = structObj.arrows || [];
    for (const arr of arrows) {
      if (arr.x1 < minX) minX = arr.x1;
      if (arr.x1 > maxX) maxX = arr.x1;
      if (arr.x2 < minX) minX = arr.x2;
      if (arr.x2 > maxX) maxX = arr.x2;
      if (arr.y1 < minY) minY = arr.y1;
      if (arr.y1 > maxY) maxY = arr.y1;
      if (arr.y2 < minY) minY = arr.y2;
      if (arr.y2 > maxY) maxY = arr.y2;
    }

    const rawW = Math.max(30, maxX - minX);
    const rawH = Math.max(30, maxY - minY);

    // Escalado para renderizar una estructura química clara, nítida y legible estilo IChO
    const targetH = 76;
    const targetW = 125;
    const scale = Math.min(0.88, targetH / rawH, targetW / rawW);
    const dispW = Math.max(34, Math.round(rawW * scale));
    const dispH = Math.max(36, Math.round(rawH * scale));

    return {
      structObj,
      minX, maxX, minY, maxY,
      rawW, rawH,
      scale,
      dispW,
      dispH
    };
  }

  static renderStructureThumbnail(metrics, group, isDark) {
    const { structObj } = metrics;
    // Renderer completo (lo registra svg-renderer.js); el dibujo simplificado de abajo queda
    // solo para estructuras que incluyan flechas
    if (this.thumbnailRenderer && !(structObj.arrows && structObj.arrows.length)) {
      if (this.thumbnailRenderer(structObj, group, isDark) !== false) return;
    }
    const strokeColor = isDark ? '#ffffff' : '#111827';
    const bgFill = isDark ? '#0f172a' : '#ffffff';

    const atoms = structObj.atoms || [];
    const bonds = structObj.bonds || [];
    const arrows = structObj.arrows || [];

    const atomMap = new Map();
    for (const a of atoms) atomMap.set(a.id, a);

    // Helper: detectar si un enlace pertenece a un ciclo
    const isBondInRing = (a1Id, a2Id) => {
      const visited = new Set([a1Id]);
      const queue = [];
      for (const b of bonds) {
        if ((b.atom1 === a1Id && b.atom2 === a2Id) || (b.atom1 === a2Id && b.atom2 === a1Id)) continue;
        if (b.atom1 === a1Id) { visited.add(b.atom2); queue.push(b.atom2); }
        else if (b.atom2 === a1Id) { visited.add(b.atom1); queue.push(b.atom1); }
      }
      while (queue.length > 0) {
        const curr = queue.shift();
        if (curr === a2Id) return true;
        for (const b of bonds) {
          if ((b.atom1 === a1Id && b.atom2 === a2Id) || (b.atom1 === a2Id && b.atom2 === a1Id)) continue;
          let next = null;
          if (b.atom1 === curr && !visited.has(b.atom2)) next = b.atom2;
          else if (b.atom2 === curr && !visited.has(b.atom1)) next = b.atom1;
          if (next) {
            visited.add(next);
            queue.push(next);
          }
        }
      }
      return false;
    };

    // Helper: calcular vector normal apuntando estrictamente hacia el interior del anillo
    const getRingInteriorDirection = (a1, a2) => {
      if (!isBondInRing(a1.id, a2.id)) {
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
      for (const b of bonds) {
        let other = null;
        if (b.atom1 === a1.id && b.atom2 !== a2.id) other = atomMap.get(b.atom2);
        else if (b.atom2 === a1.id && b.atom1 !== a2.id) other = atomMap.get(b.atom1);
        else if (b.atom1 === a2.id && b.atom2 !== a1.id) other = atomMap.get(b.atom2);
        else if (b.atom2 === a2.id && b.atom1 !== a1.id) other = atomMap.get(b.atom1);

        if (other) {
          const vx = other.x - midX;
          const vy = other.y - midY;
          dotSum += (vx * nx + vy * ny);
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
    };

    // 1. Enlaces
    for (const b of bonds) {
      const a1 = atomMap.get(b.atom1);
      const a2 = atomMap.get(b.atom2);
      if (!a1 || !a2) continue;

      const dx = a2.x - a1.x;
      const dy = a2.y - a1.y;
      const len = Math.hypot(dx, dy);
      if (len === 0) continue;

      const ux = dx / len;
      const uy = dy / len;
      const px = -uy;
      const py = ux;

      const type = b.type || 'single';

      if (type === 'double') {
        const ringDir = getRingInteriorDirection(a1, a2);

        if (ringDir.isRing) {
          // Benceno / Anillos aromáticos: línea perimetral continua sobre los vértices
          const outerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          outerLine.setAttribute('x1', a1.x);
          outerLine.setAttribute('y1', a1.y);
          outerLine.setAttribute('x2', a2.x);
          outerLine.setAttribute('y2', a2.y);
          outerLine.setAttribute('stroke', strokeColor);
          outerLine.setAttribute('stroke-width', '2.0');
          outerLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(outerLine);

          // Doble enlace interior: desplazado hacia ADENTRO del ciclo con recorte en las puntas (trim)
          const offsetDist = 4.0;
          const trimDist = 4.8;
          const inX1 = a1.x + ux * trimDist + ringDir.nx * offsetDist;
          const inY1 = a1.y + uy * trimDist + ringDir.ny * offsetDist;
          const inX2 = a2.x - ux * trimDist + ringDir.nx * offsetDist;
          const inY2 = a2.y - uy * trimDist + ringDir.ny * offsetDist;

          const innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          innerLine.setAttribute('x1', inX1);
          innerLine.setAttribute('y1', inY1);
          innerLine.setAttribute('x2', inX2);
          innerLine.setAttribute('y2', inY2);
          innerLine.setAttribute('stroke', strokeColor);
          innerLine.setAttribute('stroke-width', '1.9');
          innerLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(innerLine);
        } else {
          // Alqueno acíclico o carbonilo: línea principal continua + línea compañera
          const mainLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          mainLine.setAttribute('x1', a1.x);
          mainLine.setAttribute('y1', a1.y);
          mainLine.setAttribute('x2', a2.x);
          mainLine.setAttribute('y2', a2.y);
          mainLine.setAttribute('stroke', strokeColor);
          mainLine.setAttribute('stroke-width', '2.0');
          mainLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(mainLine);

          let sideSum = 0;
          let hasNeighbors1 = false;
          let hasNeighbors2 = false;

          for (const bOther of bonds) {
            if (bOther === b) continue;
            let other = null;
            if (bOther.atom1 === a1.id) { other = atomMap.get(bOther.atom2); hasNeighbors1 = true; }
            else if (bOther.atom2 === a1.id) { other = atomMap.get(bOther.atom1); hasNeighbors1 = true; }
            if (other) {
              const vx = other.x - a1.x;
              const vy = other.y - a1.y;
              sideSum += (vx * px + vy * py);
            }

            let other2 = null;
            if (bOther.atom1 === a2.id) { other2 = atomMap.get(bOther.atom2); hasNeighbors2 = true; }
            else if (bOther.atom2 === a2.id) { other2 = atomMap.get(bOther.atom1); hasNeighbors2 = true; }
            if (other2) {
              const vx = other2.x - a2.x;
              const vy = other2.y - a2.y;
              sideSum += (vx * px + vy * py);
            }
          }

          const side = sideSum > 0.05 ? 1 : (sideSum < -0.05 ? -1 : 1);
          const offsetDist = 3.8;
          const trim1 = hasNeighbors1 ? 5.5 : 2.5;
          const trim2 = hasNeighbors2 ? 5.5 : 2.5;

          const inX1 = a1.x + ux * trim1 + px * side * offsetDist;
          const inY1 = a1.y + uy * trim1 + py * side * offsetDist;
          const inX2 = a2.x - ux * trim2 + px * side * offsetDist;
          const inY2 = a2.y - uy * trim2 + py * side * offsetDist;

          const companionLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          companionLine.setAttribute('x1', inX1);
          companionLine.setAttribute('y1', inY1);
          companionLine.setAttribute('x2', inX2);
          companionLine.setAttribute('y2', inY2);
          companionLine.setAttribute('stroke', strokeColor);
          companionLine.setAttribute('stroke-width', '1.9');
          companionLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(companionLine);
        }
      } else if (type === 'triple') {
        const offset = 3.2;
        [-offset, 0, offset].forEach(off => {
          const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          l.setAttribute('x1', a1.x + px * off);
          l.setAttribute('y1', a1.y + py * off);
          l.setAttribute('x2', a2.x + px * off);
          l.setAttribute('y2', a2.y + py * off);
          l.setAttribute('stroke', strokeColor);
          l.setAttribute('stroke-width', '1.8');
          group.appendChild(l);
        });
      } else if (type === 'wedge') {
        const w = 4;
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        poly.setAttribute('points', `${a1.x},${a1.y} ${a2.x + px * w},${a2.y + py * w} ${a2.x - px * w},${a2.y - py * w}`);
        poly.setAttribute('fill', strokeColor);
        group.appendChild(poly);
      } else if (type === 'dash') {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a1.x);
        line.setAttribute('y1', a1.y);
        line.setAttribute('x2', a2.x);
        line.setAttribute('y2', a2.y);
        line.setAttribute('stroke', strokeColor);
        line.setAttribute('stroke-width', '2.2');
        line.setAttribute('stroke-dasharray', '3 3');
        group.appendChild(line);
      } else if (type === 'dashed') {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a1.x);
        line.setAttribute('y1', a1.y);
        line.setAttribute('x2', a2.x);
        line.setAttribute('y2', a2.y);
        line.setAttribute('stroke', strokeColor);
        line.setAttribute('stroke-width', '2.0');
        line.setAttribute('stroke-dasharray', '5 4');
        line.setAttribute('stroke-linecap', 'round');
        group.appendChild(line);
      } else {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a1.x);
        line.setAttribute('y1', a1.y);
        line.setAttribute('x2', a2.x);
        line.setAttribute('y2', a2.y);
        line.setAttribute('stroke', strokeColor);
        line.setAttribute('stroke-width', '2.0');
        line.setAttribute('stroke-linecap', 'round');
        group.appendChild(line);
      }
    }

    // 2. Flechas (punteadas de unión o normales)
    for (const arr of arrows) {
      const dx = arr.x2 - arr.x1;
      const dy = arr.y2 - arr.y1;
      const len = Math.hypot(dx, dy);
      if (len === 0) continue;

      const ux = dx / len;
      const uy = dy / len;
      const px = -uy;
      const py = ux;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', arr.x1);
      line.setAttribute('y1', arr.y1);
      line.setAttribute('x2', arr.x2);
      line.setAttribute('y2', arr.y2);
      line.setAttribute('stroke', strokeColor);
      line.setAttribute('stroke-width', '2.0');
      if (arr.type === 'dashed' || arr.dashed || arr.isDashed) {
        line.setAttribute('stroke-dasharray', '4 3');
      }
      group.appendChild(line);

      // Punta de flecha pequeña
      const headLen = 7;
      const headWidth = 4;
      const hx = arr.x2;
      const hy = arr.y2;
      const bx = hx - ux * headLen;
      const by = hy - uy * headLen;

      const head = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      head.setAttribute('points', `${hx},${hy} ${bx + px * headWidth},${by + py * headWidth} ${bx - px * headWidth},${by - py * headWidth}`);
      head.setAttribute('fill', strokeColor);
      group.appendChild(head);
    }

    // 3. Heteroátomos
    for (const a of atoms) {
      const hasLabel = a.label && a.label.trim();
      const isHetero = a.element !== 'C';
      if (isHetero || hasLabel || a.manualLabel) {
        const textVal = hasLabel ? a.label : a.element;
        const textLen = textVal.length;
        const rectW = Math.max(18, textLen * 9 + 4);
        const rectH = 16;

        // Máscara de fondo
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('x', a.x - rectW / 2);
        bg.setAttribute('y', a.y - rectH / 2);
        bg.setAttribute('width', rectW);
        bg.setAttribute('height', rectH);
        bg.setAttribute('rx', '3');
        bg.setAttribute('fill', bgFill);
        group.appendChild(bg);

        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', a.x);
        txt.setAttribute('y', a.y + 4);
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
        txt.setAttribute('font-size', '13.5');
        txt.setAttribute('font-weight', 'bold');
        txt.setAttribute('fill', strokeColor);

        this.populateFormattedFormula(txt, textVal);
        group.appendChild(txt);
      }
    }
  }
}
