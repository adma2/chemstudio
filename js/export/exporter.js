/**
 * exporter.js - Exportación vectorial SVG y ráster PNG de alta resolución (300 DPI)
 */

export class ChemExporter {
  /** Resolución real del PNG: 300 DPI sobre la unidad CSS de 96 DPI */
  static PNG_SCALE = 300 / 96;

  /**
   * Dibuja el lienzo "limpio" para exportar (modo claro, sin selección, sin hover, sin marcas de
   * error, sin tiradores ni puertos del Modo Problema), ejecuta fn() y restaura todo como estaba.
   */
  static withCleanRender(renderer, state, fn) {
    if (!renderer || typeof renderer.render !== 'function') return fn();
    const saved = {
      selected: state.selected,
      dark: state.isDarkMode,
      problem: state.isProblemMode,
      hoveredAtomId: renderer.hoveredAtomId,
      hoveredBondId: renderer.hoveredBondId
    };
    state.selected = { atoms: new Set(), bonds: new Set(), arrows: new Set(), labels: new Set(), boxes: new Set() };
    state.isDarkMode = false;
    state.isProblemMode = false;
    renderer.hoveredAtomId = null;
    renderer.hoveredBondId = null;
    renderer.exportMode = true;
    try {
      if (typeof renderer.initSvgDefs === 'function') renderer.initSvgDefs();
      renderer.render();
      return fn();
    } finally {
      state.selected = saved.selected;
      state.isDarkMode = saved.dark;
      state.isProblemMode = saved.problem;
      renderer.hoveredAtomId = saved.hoveredAtomId;
      renderer.hoveredBondId = saved.hoveredBondId;
      renderer.exportMode = false;
      if (typeof renderer.initSvgDefs === 'function') renderer.initSvgDefs();
      renderer.render();
    }
  }

  /** Límites de lo que realmente se dibujó (incluye moléculas sobre flechas, textos largos, cargas...) */
  static measureRenderedBounds(svgRootElement) {
    try {
      const root = svgRootElement.querySelector('#canvas-root');
      if (!root || typeof root.getBBox !== 'function') return null;
      const b = root.getBBox(); // en coordenadas del dibujo (sin el pan/zoom del propio grupo)
      if (!b || !(b.width > 0) || !(b.height > 0)) return null;
      return { minX: b.x, minY: b.y, maxX: b.x + b.width, maxY: b.y + b.height };
    } catch (e) {
      return null;
    }
  }

  /**
   * Genera el código SVG independiente del esquema actual.
   * Con renderer, se exporta un dibujo limpio (ver withCleanRender).
   */
  static generateSvgString(svgRootElement, state, padding = 40, renderer = null) {
    return this.withCleanRender(renderer, state, () => this.buildSvgString(svgRootElement, state, padding));
  }

  static buildSvgString(svgRootElement, state, padding = 40) {
    const measured = this.measureRenderedBounds(svgRootElement);
    const clone = svgRootElement.cloneNode(true);

    // Quitar todo lo que es solo de edición
    const transient = clone.querySelectorAll([
      '.bond-drawing-preview', '.arrow-drawing-preview', '.marquee-selection-preview',
      '#bond-drawing-preview', '#arrow-drawing-preview', '#marquee-selection-preview',
      '.chair-guide-dot', '.rotate-handle', '.box-resize-handle', '.box-port-handle'
    ].join(', '));
    transient.forEach(el => el.remove());

    // Calcular bounding box de todo el contenido
    const bbox = measured || this.calculateContentBounds(state);
    const width = Math.max(200, bbox.maxX - bbox.minX + padding * 2);
    const height = Math.max(150, bbox.maxY - bbox.minY + padding * 2);

    // Ajustar el transform del rootGroup para que quede centrado en (padding, padding)
    const rootGroup = clone.querySelector('#canvas-root');
    if (rootGroup) {
      const offsetX = padding - bbox.minX;
      const offsetY = padding - bbox.minY;
      rootGroup.setAttribute('transform', `translate(${offsetX}, ${offsetY}) scale(1)`);
    }

    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
    clone.setAttribute('width', `${width}px`);
    clone.setAttribute('height', `${height}px`);
    clone.setAttribute('style', 'background-color: #ffffff;');

    const serializer = new XMLSerializer();
    return serializer.serializeToString(clone);
  }

  static calculateContentBounds(state) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let hasContent = false;

    // Respaldo cuando el navegador no puede medir el dibujo: estimar el ancho de los textos
    const CHAR_W = 10;
    for (const atom of state.atoms.values()) {
      // Las etiquetas (OTBDPS, CO2Me...) pueden salir hacia cualquier lado del átomo
      const labelW = atom.label ? String(atom.label).length * CHAR_W + 6 : 8;
      minX = Math.min(minX, atom.x - labelW);
      minY = Math.min(minY, atom.y - 14);
      maxX = Math.max(maxX, atom.x + labelW);
      maxY = Math.max(maxY, atom.y + 14);
      hasContent = true;
    }

    for (const arrow of state.arrows.values()) {
      const lines = [arrow.reagentsTop, arrow.reagentsBottom].filter(Boolean).join('\n').split('\n');
      const textW = Math.max(0, ...lines.map(l => l.length)) * 8.5;
      const structH = arrow.structureTop ? 130 : 0;
      minX = Math.min(minX, arrow.x1, arrow.x2, (arrow.x1 + arrow.x2) / 2 - textW / 2);
      minY = Math.min(minY, arrow.y1 - 45 - structH, arrow.y2 - 45 - structH);
      maxX = Math.max(maxX, arrow.x1, arrow.x2, (arrow.x1 + arrow.x2) / 2 + textW / 2, Math.max(arrow.x1, arrow.x2) + 20 + textW);
      maxY = Math.max(maxY, arrow.y1 + 45, arrow.y2 + 45);
      hasContent = true;
    }

    for (const label of state.textLabels.values()) {
      const halfW = Math.max(20, String(label.text || '').length * CHAR_W / 2 + 6);
      minX = Math.min(minX, label.x - halfW);
      minY = Math.min(minY, label.y - 22);
      maxX = Math.max(maxX, label.x + halfW);
      maxY = Math.max(maxY, label.y + 22);
      hasContent = true;
    }

    for (const box of state.referenceBoxes.values()) {
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
      hasContent = true;
    }

    if (!hasContent) {
      return { minX: 0, minY: 0, maxX: 800, maxY: 600 };
    }

    return { minX, minY, maxX, maxY };
  }

  /**
   * Descarga el esquema actual como archivo SVG
   */
  static downloadSvg(svgRootElement, state, filename = 'esquema_olimpiada.svg', renderer = null) {
    const svgStr = this.generateSvgString(svgRootElement, state, 40, renderer);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Descarga el esquema actual como imagen PNG de alta resolución (300 DPI = escala 3.125)
   */
  static downloadPng(svgRootElement, state, filename = 'esquema_olimpiada.png', scale = ChemExporter.PNG_SCALE, renderer = null) {
    const svgStr = this.generateSvgString(svgRootElement, state, 40, renderer);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((pngBlob) => {
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = url;
  }

  /**
   * Copia el SVG al portapapeles
   */
  static async copySvgToClipboard(svgRootElement, state, renderer = null) {
    const svgStr = this.generateSvgString(svgRootElement, state, 40, renderer);
    await navigator.clipboard.writeText(svgStr);
  }
}
