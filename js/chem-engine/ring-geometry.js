/**
 * ring-geometry.js - Convierte anillos deformados en polígonos regulares (estilo IChO).
 * Dibujados enlace a enlace con ángulos de 30°, los anillos de 5 y 7 no pueden cerrar regulares.
 */

const RING_LENGTH = 38;

/** Vecinos de cada átomo: Map(id -> Set(ids)) */
function neighborMap(state) {
  const map = new Map();
  for (const id of state.atoms.keys()) map.set(id, new Set());
  for (const b of state.bonds.values()) {
    map.get(b.atom1)?.add(b.atom2);
    map.get(b.atom2)?.add(b.atom1);
  }
  return map;
}

/** Anillo más pequeño que contiene el enlace a-b (ids en orden) o null */
export function smallestRingWithBond(a, b, state, nb = neighborMap(state)) {
  const prev = new Map([[a, null]]);
  const queue = [a];
  while (queue.length) {
    const curr = queue.shift();
    for (const n of nb.get(curr) || []) {
      if ((curr === a && n === b) || prev.has(n)) continue;
      prev.set(n, curr);
      if (n === b) {
        const ring = [];
        for (let x = b; x !== null; x = prev.get(x)) ring.push(x);
        return ring;
      }
      queue.push(n);
    }
  }
  return null;
}

const normalize = (t) => Math.atan2(Math.sin(t), Math.cos(t));

/**
 * Vuelve regular un anillo (ids en orden). La arista compartida con otro anillo no se mueve, y los
 * sustituyentes acompañan a su átomo apuntando hacia fuera. Devuelve true si cambió algo.
 * No toca sillas ni anillos en perspectiva, ni sistemas puenteados o fusionados por varios lados.
 */
export function regularizeRing(ring, state) {
  const n = ring.length;
  const nb = neighborMap(state);
  const inRing = new Set(ring);
  const atoms = ring.map(id => state.atoms.get(id));
  if (n < 3 || atoms.some(a => !a || a.chairVertex || a.chairId)) return false;
  for (const b of state.bonds.values()) {
    // Cuñas o enlaces gruesos dentro del anillo: está dibujado en perspectiva
    if (inRing.has(b.atom1) && inRing.has(b.atom2) &&
        (b.wedgeWidth || b.boldWidth || b.type === 'wedge' || b.type === 'dash')) return false;
  }

  const cx0 = atoms.reduce((s, a) => s + a.x, 0) / n, cy0 = atoms.reduce((s, a) => s + a.y, 0) / n;

  // Átomos compartidos con otros anillos: los que tienen un vecino exterior que vuelve al anillo
  // sin pasar por ellos, o que es parte de otro ciclo con ellos (espiro)
  const branchOf = (root, parent) => {
    const seen = new Set([root]);
    for (const id of seen) for (const x of nb.get(id)) if (!inRing.has(x)) seen.add(x);
    const touches = new Set();
    for (const id of seen) for (const x of nb.get(id)) if (inRing.has(x)) touches.add(x);
    const backs = Array.from(nb.get(parent)).filter(x => !inRing.has(x) && seen.has(x)).length;
    return { ids: seen, touches, spiro: touches.size === 1 && backs > 1 };
  };
  const anchors = new Set();
  const branches = [];
  for (const id of ring) {
    const done = new Set();
    for (const x of nb.get(id)) {
      if (inRing.has(x) || done.has(x)) continue;
      const br = branchOf(x, id);
      br.ids.forEach(y => done.add(y));
      if (br.touches.size > 1) br.touches.forEach(t => anchors.add(t));
      else branches.push({ at: id, root: x, ids: br.ids, spiro: br.spiro });
    }
  }
  // Puente sin átomos intermedios (dos átomos del anillo unidos por una cuerda)
  for (let i = 0; i < n; i++) {
    for (const x of nb.get(ring[i])) {
      if (inRing.has(x) && x !== ring[(i + 1) % n] && x !== ring[(i + n - 1) % n]) return false;
    }
  }

  let target;
  if (anchors.size === 2) {
    const i = ring.findIndex((id, k) => anchors.has(id) && anchors.has(ring[(k + 1) % n]));
    if (i < 0) return false;
    // Polígono construido sobre la arista compartida, del lado donde ya estaba el anillo
    const p = atoms[i], q = atoms[(i + 1) % n];
    const ex = q.x - p.x, ey = q.y - p.y, L = Math.hypot(ex, ey);
    if (L < 1) return false;
    const side = Math.sign(ex * (cy0 - p.y) - ey * (cx0 - p.x)) || 1;
    const turn = side * (2 * Math.PI / n);
    target = [];
    let x = p.x, y = p.y, ang = Math.atan2(ey, ex);
    for (let k = 0; k < n; k++) {
      target[(i + k) % n] = { x, y };
      x += L * Math.cos(ang);
      y += L * Math.sin(ang);
      ang += turn;
    }
  } else if (anchors.size === 0) {
    // Anillo suelto: mismo centro, orientación más parecida a la dibujada
    const area = atoms.reduce((s, a, k) => s + a.x * atoms[(k + 1) % n].y - atoms[(k + 1) % n].x * a.y, 0);
    const dir = area >= 0 ? 1 : -1;
    const R = RING_LENGTH / (2 * Math.sin(Math.PI / n));
    let s = 0, c = 0;
    atoms.forEach((a, k) => {
      const t = Math.atan2(a.y - cy0, a.x - cx0) - dir * k * 2 * Math.PI / n;
      s += Math.sin(t);
      c += Math.cos(t);
    });
    let base = Math.atan2(s, c);
    // Si queda cerca de una orientación limpia (vértice o lado vertical/horizontal), usarla
    const grid = Math.PI / (2 * n);
    const snapped = Math.round((base + Math.PI / 2) / grid) * grid - Math.PI / 2;
    if (Math.abs(normalize(base - snapped)) < grid) base = snapped;
    target = ring.map((_, k) => ({
      x: cx0 + R * Math.cos(base + dir * k * 2 * Math.PI / n),
      y: cy0 + R * Math.sin(base + dir * k * 2 * Math.PI / n)
    }));
    const spiro = branches.find(b => b.spiro);
    if (spiro) {
      const k = ring.indexOf(spiro.at);
      const ox = atoms[k].x - target[k].x, oy = atoms[k].y - target[k].y;
      target.forEach(p => { p.x += ox; p.y += oy; });
    }
  } else {
    return false;
  }

  if (target.every((p, k) => Math.hypot(p.x - atoms[k].x, p.y - atoms[k].y) < 0.5)) return false;

  // Dirección "hacia fuera" de cada vértice, antes y después
  const outward = (pts, k) => {
    const a = pts[(k + n - 1) % n], b = pts[(k + 1) % n], p = pts[k];
    const u = Math.hypot(a.x - p.x, a.y - p.y) || 1, v = Math.hypot(b.x - p.x, b.y - p.y) || 1;
    return Math.atan2(-((a.y - p.y) / u + (b.y - p.y) / v), -((a.x - p.x) / u + (b.x - p.x) / v));
  };
  const old = atoms.map(a => ({ x: a.x, y: a.y }));
  for (const br of branches) {
    const k = ring.indexOf(br.at);
    const siblings = branches.filter(o => o.at === br.at).length;
    const moved = !anchors.has(br.at);
    if (!moved || br.spiro) continue; // en la fusión no se mueve nada
    const root = state.atoms.get(br.root);
    const angle = Math.atan2(root.y - old[k].y, root.x - old[k].x);
    const rot = siblings === 1
      ? normalize(outward(target, k) - angle)
      : normalize(outward(target, k) - outward(old, k));
    const cos = Math.cos(rot), sin = Math.sin(rot);
    for (const id of br.ids) {
      const a = state.atoms.get(id);
      const dx = a.x - old[k].x, dy = a.y - old[k].y;
      a.x = target[k].x + dx * cos - dy * sin;
      a.y = target[k].y + dx * sin + dy * cos;
    }
  }
  atoms.forEach((a, k) => { a.x = target[k].x; a.y = target[k].y; });
  return true;
}

/** Al cerrar un anillo de 5 o 7 con el enlace a-b, dejarlo regular (los de 6 se respetan: sillas a mano) */
export function regularizeClosedRing(a, b, state) {
  const ring = smallestRingWithBond(a, b, state);
  return Boolean(ring && (ring.length === 5 || ring.length === 7) && regularizeRing(ring, state));
}

/** Regulariza los anillos de 5 y 7 que contengan alguno de estos átomos; devuelve cuántos cambió */
export function regularizeRingsOf(atomIds, state) {
  const wanted = new Set(atomIds);
  const done = new Set();
  let count = 0;
  const nb = neighborMap(state);
  for (const bond of Array.from(state.bonds.values())) {
    if (!wanted.has(bond.atom1) && !wanted.has(bond.atom2)) continue;
    const ring = smallestRingWithBond(bond.atom1, bond.atom2, state, nb);
    if (!ring || (ring.length !== 5 && ring.length !== 7)) continue;
    const key = [...ring].sort().join('|');
    if (done.has(key)) continue;
    done.add(key);
    if (regularizeRing(ring, state)) count++;
  }
  return count;
}
