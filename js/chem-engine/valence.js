/**
 * valence.js - Validador de reglas de valencia química
 * Detecta violaciones como el "Texas Carbon" (carbono pentavalente con 5 enlaces)
 * y marca los átomos en rojo.
 */

import { ELEMENTS, getBondOrder } from './elements.js';

export { getBondOrder };

/**
 * Valida la valencia de todos los átomos del sistema molecular
 * @param {Array} atoms - Lista de átomos { id, element, charge, label }
 * @param {Array} bonds - Lista de enlaces { id, atom1, atom2, type }
 * @returns {Map<string, Object>} Mapa de atomId -> { hasError, isTexasCarbon, message, bondCount }
 */
export function validateMolecularValences(atoms, bonds) {
  const valenceReport = new Map();
  const bondCounts = new Map();

  // Inicializar conteos
  for (const atom of atoms) {
    bondCounts.set(atom.id, 0);
  }

  // Sumar órdenes de enlace para cada átomo
  for (const bond of bonds) {
    const order = getBondOrder(bond.type);
    if (bondCounts.has(bond.atom1)) {
      bondCounts.set(bond.atom1, bondCounts.get(bond.atom1) + order);
    }
    if (bondCounts.has(bond.atom2)) {
      bondCounts.set(bond.atom2, bondCounts.get(bond.atom2) + order);
    }
  }

  // Validar cada átomo según su elemento químico
  for (const atom of atoms) {
    const bondSum = bondCounts.get(atom.id) || 0;
    const elementSymbol = atom.element || 'C';
    const elemDef = ELEMENTS[elementSymbol];
    // Auto-detectar carga en etiquetas como 'OH3+', 'H3O+', 'NH4+', 'O-', 'N+'
    let effectiveCharge = atom.charge || 0;
    if (effectiveCharge === 0 && atom.label && typeof atom.label === 'string') {
      const trimmed = atom.label.trim();
      if (/\+$/.test(trimmed)) effectiveCharge = 1;
      else if (/[\-−]$/.test(trimmed)) effectiveCharge = -1;
    }

    let hasError = false;
    let isTexasCarbon = false;
    let message = '';

    if (elementSymbol === 'C') {
      // Regla de oro de la química orgánica: El Carbono NO puede tener más de 4 enlaces
      if (bondSum > 4) {
        hasError = true;
        isTexasCarbon = true;
        message = `¡Error de Valencia! Carbono hipervalente ("Texas Carbon") con ${bondSum} enlaces (máximo permitido: 4).`;
      }
    } else if (elementSymbol === 'H') {
      if (bondSum > 1) {
        hasError = true;
        message = `Hidrógeno hipervalente con ${bondSum} enlaces (máximo: 1).`;
      }
    } else if (elementSymbol === 'O') {
      if (bondSum > 3) {
        hasError = true;
        message = `Oxígeno hipervalente con ${bondSum} enlaces (máx: 3 en iones oxonio/hidronio).`;
      } else if (bondSum === 3 && effectiveCharge <= 0) {
        hasError = true;
        message = `Oxígeno con 3 enlaces (ion oxonio/hidronio OH3+) requiere carga positiva formal (+).`;
      } else if (bondSum > 2 && effectiveCharge <= 0) {
        hasError = true;
        message = `Oxígeno con ${bondSum} enlaces excede la valencia permitida (máx: 2).`;
      }
    } else if (elementSymbol === 'N') {
      if (bondSum > 4) {
        hasError = true;
        message = `Nitrógeno hipervalente con ${bondSum} enlaces (máx: 4).`;
      } else if (bondSum === 4 && effectiveCharge <= 0) {
        hasError = true;
        message = `Nitrógeno con 4 enlaces requiere carga positiva formal (+).`;
      }
    } else if (['F', 'Cl', 'Br', 'I'].includes(elementSymbol)) {
      // Como sustituyentes en problemas orgánicos normales
      if (elementSymbol === 'F' && bondSum > 1) {
        hasError = true;
        message = `Flúor no puede tener más de 1 enlace.`;
      } else if (bondSum > 1 && !atom.isHypervalentOk) {
        // En halogenuros orgánicos típicos de olimpiadas
        hasError = true;
        message = `${elemDef ? elemDef.name : elementSymbol} con ${bondSum} enlaces (máx. habitual: 1).`;
      }
    }

    valenceReport.set(atom.id, {
      hasError,
      isTexasCarbon,
      message,
      bondCount: bondSum,
      element: elementSymbol
    });
  }

  return valenceReport;
}
