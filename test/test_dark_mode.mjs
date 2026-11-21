// DOM simulado mínimo para renderizar SVG en Node
globalThis.document = {
  createTextNode(text) {
    return text;
  },
  createElementNS(ns, tag) {
    const el = {
      tagName: tag,
      attributes: {},
      children: [],
      setAttribute(name, value) { this.attributes[name] = String(value); },
      getAttribute(name) { return this.attributes[name]; },
      appendChild(child) { this.children.push(child); return child; },
      get outerHTML() {
        const attrs = Object.entries(this.attributes)
          .map(([k, v]) => `${k}="${v}"`)
          .join(' ');
        const attrStr = attrs ? ' ' + attrs : '';
        if (this.children.length > 0 || tag === 'text' || tag === 'tspan') {
          const inner = this.children.map(c => typeof c === 'string' ? c : c.outerHTML).join('');
          return `<${tag}${attrStr}>${inner}</${tag}>`;
        }
        return `<${tag}${attrStr}/>`;
      },
      set textContent(text) { this.children = [text]; },
      get textContent() { return this.children.join(''); }
    };
    return el;
  }
};

import { ChemState } from '../js/state.js';
import { ArrowRenderer } from '../js/render/arrow-renderer.js';
import { ReferenceBoxRenderer } from '../js/render/reference-box.js';

console.log('--- TEST: Modo Oscuro (Dark Mode) ---');
const state = new ChemState();
console.assert(state.isDarkMode === false, 'Debe iniciar en modo claro');
console.log('✓ Estado inicial: Modo Claro');

state.isDarkMode = true;
console.assert(state.isDarkMode === true, 'Debe alternar a modo oscuro');
console.log('✓ Estado alternado: Modo Oscuro');

// Test ArrowRenderer en Modo Oscuro
const arrow = {
  id: 'arr-1',
  type: 'reaction',
  x1: 100, y1: 100, x2: 200, y2: 100,
  reagentsTop: 'H2SO4, Δ',
  reagentsBottom: 'reflujo'
};

const arrowEl = ArrowRenderer.renderArrow(arrow, false, state);
const arrowSvg = arrowEl.outerHTML;
console.assert(arrowSvg.includes('stroke="#ffffff"'), 'La flecha debe tener trazo blanco (#ffffff) en modo oscuro');
console.assert(arrowSvg.includes('fill="#ffffff"'), 'El texto de reactivos debe ser blanco (#ffffff) en modo oscuro');
console.log('✓ Flecha de reacción y reactivos se renderizan en blanco (#ffffff) en modo oscuro');

// Test ReferenceBoxRenderer en Modo Oscuro
const box = {
  id: 'box-C',
  label: 'C',
  x: 50, y: 50, width: 120, height: 100,
  unknownLetter: 'A'
};

const boxEl = ReferenceBoxRenderer.renderCompoundBox(box, null, state);
const boxSvg = boxEl.outerHTML;
console.assert(boxSvg.includes('fill="#ffffff"'), 'La letra incógnita debe ser blanca (#ffffff) en modo oscuro');

// La etiqueta de esquina (badge) solo se dibuja cuando el recuadro contiene una molécula
state.addAtom({ x: 110, y: 100, element: 'C' });
const filledSvg = ReferenceBoxRenderer.renderCompoundBox(box, null, state).outerHTML;
console.assert(filledSvg.includes('fill="#1e293b"'), 'El badge de identificación debe usar fondo oscuro (#1e293b)');
console.log('✓ Recuadros de compuestos e incógnitas grandes renderizan con fondo oscuro y letra blanca en modo oscuro');

console.log('\n¡Todos los tests de Modo Oscuro pasaron con éxito!');
