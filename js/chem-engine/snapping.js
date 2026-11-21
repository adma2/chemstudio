/**
 * snapping.js - Motor de snapping angular y anclaje magnético
 * Enlaces químicos: LONGITUD ESTRICTAMENTE FIJA (38px) y ángulos canónicos (múltiplos de 30°).
 * Flechas de reacción: Longitud arbitraria con bloqueo a ángulos canónicos (0°, 45°, 90°, 180°, 270°).
 */

export const CANONICAL_ARROW_ANGLES = [
  0,    // Horizontal derecha
  45,   // Diagonal abajo-derecha
  90,   // Vertical abajo
  135,  // Diagonal abajo-izquierda
  180,  // Horizontal izquierda
  225,  // Diagonal arriba-izquierda
  270,  // Vertical arriba
  315   // Diagonal arriba-derecha
];

export const STANDARD_BOND_ANGLES = [
  -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180
];

export const STANDARD_BOND_LENGTH = 38; // Longitud estándar ACS 1996

export function snapAngle(x1, y1, x2, y2, allowedAngles = CANONICAL_ARROW_ANGLES, thresholdDeg = 12) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);

  if (length < 3) {
    return { x: x2, y: y2, angleDeg: 0, isSnapped: false, length };
  }

  let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;

  let closestAngle = allowedAngles[0];
  let minDiff = 360;

  for (const target of allowedAngles) {
    const normTarget = (target + 360) % 360;
    let diff = Math.abs(angleDeg - normTarget);
    if (diff > 180) diff = 360 - diff;

    if (diff < minDiff) {
      minDiff = diff;
      closestAngle = normTarget;
    }
  }

  if (minDiff <= thresholdDeg) {
    const rad = (closestAngle * Math.PI) / 180;
    return {
      x: x1 + length * Math.cos(rad),
      y: y1 + length * Math.sin(rad),
      angleDeg: closestAngle,
      isSnapped: true,
      length
    };
  }

  return { x: x2, y: y2, angleDeg, isSnapped: false, length };
}

export function snapBond(x1, y1, x2, y2, fixedLength = STANDARD_BOND_LENGTH) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const snappedAngleDeg = Math.round(angleDeg / 30) * 30;
  const rad = (snappedAngleDeg * Math.PI) / 180;

  return {
    x: x1 + fixedLength * Math.cos(rad),
    y: y1 + fixedLength * Math.sin(rad),
    angleDeg: snappedAngleDeg,
    length: fixedLength
  };
}

/**
 * Calcula el siguiente ángulo óptimo para brotar enlaces con la tecla '1' o clic:
 * 1 enlace  -> brota a 120° (formando metilo CH3)
 * 2 enlaces -> brota a 120° simétrico (formando isopropilo -CH(CH3)2)
 * 3 enlaces -> brota completando el tetraedro (formando tert-butilo -C(CH3)3)
 * 4 enlaces -> brota un 5to enlace (provocando Texas Carbon en rojo)
 */
export function calculateNextBondAngle(atom, state) {
  const connectedAngles = [];
  for (const bond of state.bonds.values()) {
    let otherAtom = null;
    if (bond.atom1 === atom.id) otherAtom = state.getAtom(bond.atom2);
    else if (bond.atom2 === atom.id) otherAtom = state.getAtom(bond.atom1);

    if (otherAtom) {
      const ang = (Math.atan2(otherAtom.y - atom.y, otherAtom.x - atom.x) * 180) / Math.PI;
      connectedAngles.push(((Math.round(ang) % 360) + 360) % 360);
    }
  }

  if (connectedAngles.length === 0) {
    return 30;
  }

  if (connectedAngles.length === 1) {
    const existing = connectedAngles[0];
    // Continuación estándar en zigzag a 120°
    return (existing + 120) % 360;
  }

  // Para 2, 3 o 4 enlaces: encontrar el ángulo de paso 30° con máxima separación de los existentes
  let bestAngle = 0;
  let maxMinDist = -1;

  for (let test = 0; test < 360; test += 30) {
    let minDist = 360;
    for (const ang of connectedAngles) {
      let d = Math.abs(test - ang);
      if (d > 180) d = 360 - d;
      minDist = Math.min(minDist, d);
    }
    if (minDist > maxMinDist) {
      maxMinDist = minDist;
      bestAngle = test;
    }
  }

  return bestAngle;
}

/**
 * Guías axial/ecuatorial libres de un vértice de silla (átomo con 'substituentGuides').
 * Una guía está ocupada si ya hay un sustituyente enlazado en su extremo.
 */
export function getFreeChairGuides(atom, state) {
  if (!atom || !atom.substituentGuides) return [];
  const free = [];
  for (const type of ['axial', 'equatorial']) {
    const guide = atom.substituentGuides[type];
    if (!guide) continue;
    const tx = atom.x + guide.dx;
    const ty = atom.y + guide.dy;
    let occupied = false;
    for (const bond of state.bonds.values()) {
      let otherId = null;
      if (bond.atom1 === atom.id) otherId = bond.atom2;
      else if (bond.atom2 === atom.id) otherId = bond.atom1;
      if (!otherId) continue;
      const other = state.getAtom(otherId);
      if (other && !other.chairVertex && Math.hypot(other.x - tx, other.y - ty) < 8) {
        occupied = true;
        break;
      }
    }
    if (!occupied) free.push({ type, x: tx, y: ty, dx: guide.dx, dy: guide.dy, guide });
  }
  return free;
}

/**
 * Elige la guía de silla para un enlace nuevo que sale de 'atom':
 *  - sin cursor (clic / tecla 1): la primera libre (axial, luego ecuatorial);
 *  - con cursor (arrastre): la libre más cercana en ángulo, si está a menos de 50°.
 * Devuelve null si el átomo no es de silla o no aplica (entonces se usa el snapping normal).
 */
export function pickChairGuide(atom, state, cursor = null) {
  const free = getFreeChairGuides(atom, state);
  if (free.length === 0) return null;
  if (!cursor) return free[0];
  const cursorAng = Math.atan2(cursor.y - atom.y, cursor.x - atom.x);
  let best = null;
  let bestDiff = Infinity;
  for (const g of free) {
    let diff = Math.abs(Math.atan2(g.dy, g.dx) - cursorAng);
    if (diff > Math.PI) diff = 2 * Math.PI - diff;
    if (diff < bestDiff) {
      bestDiff = diff;
      best = g;
    }
  }
  return bestDiff <= (50 * Math.PI) / 180 ? best : null;
}

export function findNearestAnchor(x, y, state, excludeId = null, maxDist = 12) {
  let nearest = null;
  let minDist = maxDist;

  for (const atom of state.atoms.values()) {
    if (atom.id === excludeId) continue;
    const dist = Math.hypot(atom.x - x, atom.y - y);
    if (dist < minDist) {
      minDist = dist;
      nearest = { type: 'atom', target: atom, x: atom.x, y: atom.y };
    }
  }

  for (const label of state.textLabels.values()) {
    if (label.id === excludeId) continue;
    const dist = Math.hypot(label.x - x, label.y - y);
    if (dist < minDist) {
      minDist = dist;
      nearest = { type: 'label', target: label, x: label.x, y: label.y };
    }
  }

  return nearest;
}
