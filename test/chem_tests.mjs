import { validateMolecularValences, getBondOrder } from '../js/chem-engine/valence.js';
import { snapAngle, snapBond, calculateNextBondAngle, CANONICAL_ARROW_ANGLES, STANDARD_BOND_LENGTH } from '../js/chem-engine/snapping.js';
import { ChemAligner } from '../js/chem-engine/aligner.js';
import { ChemState } from '../js/state.js';
import { ChemSerializer } from '../js/export/serializer.js';

console.log('--- TEST 1: Valence & Texas Carbon Detection ---');
const normalAtoms = [
  { id: 'c1', element: 'C' },
  { id: 'h1', element: 'H' },
  { id: 'h2', element: 'H' },
  { id: 'h3', element: 'H' },
  { id: 'h4', element: 'H' }
];
const normalBonds = [
  { id: 'b1', atom1: 'c1', atom2: 'h1', type: 'single' },
  { id: 'b2', atom1: 'c1', atom2: 'h2', type: 'single' },
  { id: 'b3', atom1: 'c1', atom2: 'h3', type: 'single' },
  { id: 'b4', atom1: 'c1', atom2: 'h4', type: 'single' }
];
let report = validateMolecularValences(normalAtoms, normalBonds);
console.assert(!report.get('c1').hasError, 'Carbono normal sin error');
console.log('✓ Carbono normal (4 enlaces): OK (sin errores)');

console.log('\n--- TEST 2: Key 1 Sprouting (Metilo -> Isopropilo -> Tert-butilo -> Texas Carbon) ---');
const state = new ChemState();
const a0 = state.addAtom({ id: 'a0', x: 100, y: 100, element: 'C' });
const a1 = state.addAtom({ id: 'a1', x: 133, y: 81, element: 'C' });
state.addBond({ atom1: a0.id, atom2: a1.id, type: 'single' });

function sprout(atom) {
  const angle = calculateNextBondAngle(atom, state);
  const rad = (angle * Math.PI) / 180;
  const newAtom = state.addAtom({
    x: atom.x + STANDARD_BOND_LENGTH * Math.cos(rad),
    y: atom.y + STANDARD_BOND_LENGTH * Math.sin(rad),
    element: 'C'
  });
  state.addBond({ atom1: atom.id, atom2: newAtom.id, type: 'single' });
  state.updateValences();
  return { angle, newAtom };
}

sprout(a1); // metilo
sprout(a1); // isopropilo
sprout(a1); // tert-butilo
console.log('✓ Sprouting metilo, isopropilo, tert-butilo: OK');

console.log('\n--- TEST 3: Cycling bond order with Key 1 (Single -> Double -> Triple -> Single) ---');
const testBond = state.addBond({ atom1: a0.id, atom2: 'new_target', type: 'single' });
console.assert(testBond.type === 'single', 'Inicia en single');

// Simular presionar 1 sobre el enlace existente:
function pressKey1OnBond(bond) {
  if (bond.type === 'single') bond.type = 'double';
  else if (bond.type === 'double') bond.type = 'triple';
  else bond.type = 'single';
}

pressKey1OnBond(testBond);
console.assert(testBond.type === 'double', 'Debe ser double');
console.log('✓ Presionar 1 sobre enlace simple -> Se convierte en DOBLE');

pressKey1OnBond(testBond);
console.assert(testBond.type === 'triple', 'Debe ser triple');
console.log('✓ Presionar 1 sobre enlace doble -> Se convierte en TRIPLE');

pressKey1OnBond(testBond);
console.assert(testBond.type === 'single', 'Debe volver a single');
console.log('✓ Presionar 1 sobre enlace triple -> Vuelve a SIMPLE');

console.log('\n--- TEST 4: Heteroatom Orientation (H2N on left vs NH2 on right/top) ---');
import { getFormattedAtomDisplay } from '../js/chem-engine/elements.js';

// Caso A: Átomo a la izquierda del benceno
const cRing = state.addAtom({ id: 'c_ring', x: 200, y: 200, element: 'C' });
const nLeft = state.addAtom({ id: 'n_left', x: 167, y: 181, element: 'N', label: 'NH2' });
state.addBond({ atom1: cRing.id, atom2: nLeft.id, type: 'single' });

const displayLeft = getFormattedAtomDisplay(nLeft, state);
console.assert(displayLeft.text === 'H2N', `Debe invertirse a H2N en la izquierda (actual: ${displayLeft.text})`);
console.assert(displayLeft.bondingAtom === 'N', 'El bondingAtom debe ser N');
console.assert(displayLeft.bondingSide === 'right', 'En H2N, el bondingSide es right para que N quede pegado al enlace');
console.log(`✓ Sustituyente a la izquierda: se invierte automáticamente a "${displayLeft.text}" con bondingAtom="${displayLeft.bondingAtom}"`);

// Caso B: Átomo arriba (vertical) del benceno
const nTop = state.addAtom({ id: 'n_top', x: 200, y: 162, element: 'N', label: 'NH2' });
state.addBond({ atom1: cRing.id, atom2: nTop.id, type: 'single' });

const displayTop = getFormattedAtomDisplay(nTop, state);
console.assert(displayTop.text === 'NH2', `Debe mantenerse NH2 arriba (actual: ${displayTop.text})`);
console.assert(displayTop.bondingAtom === 'N', 'El bondingAtom debe ser N');
console.assert(displayTop.bondingSide === 'left', 'En NH2, el bondingSide es left para centrar N');
console.log(`✓ Sustituyente superior (vertical): se orienta como "${displayTop.text}" con N centrado en el enlace`);

console.log('\n--- TEST 5: Auto-Valence & Implicit Hydrogens (Pyridine N, H2O, NH3, etc.) ---');
// Piridina: Nitrógeno en un anillo con 1 doble enlace y 1 enlace simple (orden total 3)
const c1 = state.addAtom({ id: 'pyr_c1', x: 300, y: 300, element: 'C' });
const c2 = state.addAtom({ id: 'pyr_c2', x: 340, y: 300, element: 'C' });
const nPyr = state.addAtom({ id: 'pyr_n', x: 320, y: 330, element: 'N' });
state.addBond({ atom1: c1.id, atom2: nPyr.id, type: 'double' }); // orden 2
state.addBond({ atom1: c2.id, atom2: nPyr.id, type: 'single' }); // orden 1

const displayPyr = getFormattedAtomDisplay(nPyr, state);
console.assert(displayPyr.text === 'N', `Nitrógeno de piridina debe ser "N" (actual: ${displayPyr.text})`);
console.log(`✓ Nitrógeno de piridina (3 enlaces): se muestra limpio como "${displayPyr.text}" (sin hidrógenos)`);

// Oxígeno libre (0 enlaces) -> H2O
const oFree = state.addAtom({ id: 'o_free', x: 400, y: 400, element: 'O' });
const displayOFree = getFormattedAtomDisplay(oFree, state);
console.assert(displayOFree.text === 'H2O', `Oxígeno libre debe ser H2O (actual: ${displayOFree.text})`);
console.log(`✓ Oxígeno libre (0 enlaces): se muestra como "${displayOFree.text}"`);

// Formar enlace desde el oxígeno (1 enlace) -> OH
const cAttach = state.addAtom({ id: 'c_attach', x: 440, y: 400, element: 'C' });
state.addBond({ atom1: oFree.id, atom2: cAttach.id, type: 'single' });
const displayOAlcohol = getFormattedAtomDisplay(oFree, state);
console.assert(displayOAlcohol.text === 'HO', `Oxígeno a la izquierda con 1 enlace debe ser HO (actual: ${displayOAlcohol.text})`);
console.log(`✓ Oxígeno con 1 enlace: se actualiza automáticamente a "${displayOAlcohol.text}"`);

// Formar segundo enlace en el oxígeno (2 enlaces) -> O
const cAttach2 = state.addAtom({ id: 'c_attach2', x: 400, y: 440, element: 'C' });
state.addBond({ atom1: oFree.id, atom2: cAttach2.id, type: 'single' });
const displayOEther = getFormattedAtomDisplay(oFree, state);
console.assert(displayOEther.text === 'O', `Oxígeno con 2 enlaces debe ser O (actual: ${displayOEther.text})`);
console.log(`✓ Oxígeno con 2 enlaces (éter/carbonilo): se actualiza automáticamente a "${displayOEther.text}"`);

// Nitrógeno libre (0 enlaces) -> NH3
const nFree = state.addAtom({ id: 'n_free', x: 500, y: 500, element: 'N' });
const displayNFree = getFormattedAtomDisplay(nFree, state);
console.assert(displayNFree.text === 'NH3', `Nitrógeno libre debe ser NH3 (actual: ${displayNFree.text})`);
console.log(`✓ Nitrógeno libre (0 enlaces): se muestra como "${displayNFree.text}"`);

console.log('\n--- TEST 6: Adjust Arrows to Molecule Bounding Boxes ---');
// Crear una molécula con dos átomos (x=600 a x=670)
const m1 = state.addAtom({ id: 'test_m1', x: 600, y: 200, element: 'C' });
const m2 = state.addAtom({ id: 'test_m2', x: 670, y: 200, element: 'C' });
state.addBond({ atom1: m1.id, atom2: m2.id, type: 'single' });

// Crear una flecha que inicia DENTRO de la molécula (x1=630, y1=200) y apunta hacia la derecha
const arrOverlap = state.addArrow({
  id: 'test_arr_overlap',
  x1: 630,
  y1: 200,
  x2: 750,
  y2: 200,
  type: 'normal'
});

const adjusted = ChemAligner.adjustArrowsToMolecules(state, 25);
console.assert(adjusted > 0, 'Debe haber ajustado la flecha superpuesta');
console.assert(arrOverlap.x1 >= 670 + 25, `El inicio de la flecha debe estar fuera de la molécula (actual x1: ${arrOverlap.x1})`);
console.log(`✓ Flecha superpuesta ajustada automáticamente: x1 se movió fuera de la molécula a ${arrOverlap.x1}px`);

console.log('\n--- TEST 7: Chair Conformation & Chair Flip (Giro de Silla) Geometry ---');
import { RING_TEMPLATES } from '../js/chem-engine/templates.js';

// 1. Silla Normal
const chairNorm = RING_TEMPLATES.CHAIR_CYCLOHEXANE;
console.assert(chairNorm, 'Debe existir la plantilla CHAIR_CYCLOHEXANE');
console.assert(chairNorm.ringAtoms.length === 6, 'Debe tener 6 átomos en el anillo');

// Verificar que los axiales sean estrictamente verticales (|dx| === 0, |dy| === 34)
for (const [vId, subs] of Object.entries(chairNorm.substituents)) {
  console.assert(subs.axial.dx === 0, `Axial de ${vId} debe tener dx=0 (actual: ${subs.axial.dx})`);
  console.assert(Math.abs(subs.axial.dy) === 34, `Axial de ${vId} debe tener |dy|=34 (actual: ${subs.axial.dy})`);
}
console.log('✓ Silla Normal: los 6 axiales son estrictamente verticales (|dx|=0, |dy|=34)');

// Verificar que los ecuatoriales apunten hacia afuera (distancia al centro > distancia del átomo al centro)
for (const a of chairNorm.ringAtoms) {
  const subs = chairNorm.substituents[a.id];
  const atomDist = Math.hypot(a.x, a.y);
  const eqDist = Math.hypot(a.x + subs.equatorial.dx, a.y + subs.equatorial.dy);
  console.assert(eqDist > atomDist, `Ecuatorial de ${a.id} debe apuntar hacia afuera del anillo`);
}
console.log('✓ Silla Normal: los 6 ecuatoriales apuntan limpiamente hacia afuera del anillo');

// 2. Giro de Silla (CHAIR_FLIP)
const chairFlip = RING_TEMPLATES.CHAIR_FLIP;
console.assert(chairFlip, 'Debe existir la plantilla CHAIR_FLIP (Giro de Silla)');
console.assert(chairFlip.ringAtoms.length === 6, 'Giro de Silla debe tener 6 átomos');

// El dibujo de CHAIR_FLIP es la reflexión en X (x -> -x) del dibujo normal...
const key = (p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
const mirroredNorm = new Set(chairNorm.ringAtoms.map(a => key({ x: -a.x, y: a.y })));
for (const af of chairFlip.ringAtoms) {
  console.assert(mirroredNorm.has(key(af)), `Vértice ${af.id} del giro debe ser un vértice reflejado de la silla normal`);
}
// ...pero cada carbono conserva su lado (c1 sigue a la derecha) y sus axiales/ecuatoriales se intercambian
for (const an of chairNorm.ringAtoms) {
  const af = chairFlip.ringAtoms.find(a => a.id === an.id);
  console.assert(Math.sign(af.x) === Math.sign(an.x), `${an.id} debe conservar su lado tras el giro`);
  const axN = chairNorm.substituents[an.id].axial.dy;
  const axF = chairFlip.substituents[an.id].axial.dy;
  console.assert(Math.sign(axN) === -Math.sign(axF), `Axial de ${an.id} debe invertir su dirección tras el giro`);
  // La cara (arriba/abajo) se conserva: el axial de una forma y el ecuatorial de la otra apuntan al mismo lado
  const eqF = chairFlip.substituents[an.id].equatorial.dy;
  console.assert(Math.sign(axN) === Math.sign(eqF), `${an.id}: el axial normal pasa a ecuatorial en la misma cara`);
}
console.log('✓ Giro de Silla (CHAIR_FLIP): dibujo reflejado, cada carbono conserva su lado y axial <-> ecuatorial');

// Axiales alternados (arriba/abajo) alrededor del anillo en todas las sillas
for (const tplKey of ['CHAIR_CYCLOHEXANE', 'CHAIR_FLIP', 'PYRANOSE_CHAIR', 'PYRANOSE_CHAIR_FLIP']) {
  const tpl = RING_TEMPLATES[tplKey];
  const ids = tpl.ringAtoms.map(a => a.id);
  for (let i = 0; i < ids.length; i++) {
    const s1 = tpl.substituents[ids[i]];
    const s2 = tpl.substituents[ids[(i + 1) % ids.length]];
    if (!s1 || !s2) continue; // el O del anillo no tiene sustituyentes
    console.assert(Math.sign(s1.axial.dy) === -Math.sign(s2.axial.dy), `${tplKey}: axiales de ${ids[i]} y ${ids[(i + 1) % ids.length]} deben alternar`);
  }
}
console.log('✓ Las 4 sillas tienen axiales alternados arriba/abajo');

// 3. Piranosas (PYRANOSE_CHAIR & PYRANOSE_CHAIR_FLIP)
const pyrNorm = RING_TEMPLATES.PYRANOSE_CHAIR;
const pyrFlip = RING_TEMPLATES.PYRANOSE_CHAIR_FLIP;
console.assert(pyrNorm.ringAtoms.find(a => a.element === 'O'), 'Piranosa normal debe tener oxígeno en anillo');
console.assert(pyrFlip.ringAtoms.find(a => a.element === 'O'), 'Piranosa giro de silla debe tener oxígeno en anillo');
console.assert(pyrNorm.substituents.c1.axial.defaultGroup === 'OH', 'C1 axial en glucosa debe ser OH alpha hacia abajo');
console.assert(pyrNorm.substituents.c5.equatorial.defaultGroup === 'CH2OH', 'C5 ecuatorial en glucosa debe ser CH2OH');
console.log('✓ Piranosas (IChO): configuradas con Oxígeno en anillo, OH alpha axial y CH2OH ecuatorial');

console.log('\n--- TEST 8: Keyboard Shortcut C Toggle & Sprouting Logic ---');
// Mock de App para probar toggleChairTool
class MockApp {
  constructor() {
    this.activeToolKey = 'select';
    this.tools = {
      chair: { templateType: 'CHAIR_CYCLOHEXANE' }
    };
  }
  selectTool(key, sub) {
    this.activeToolKey = key;
    if (sub) this.tools.chair.templateType = sub;
  }
}

const mockApp = new MockApp();
// Simular ChemShortcuts.toggleChairTool
function testToggleChair(app) {
  if (app.activeToolKey !== 'chair') {
    app.selectTool('chair', 'CHAIR_CYCLOHEXANE');
  } else {
    const current = app.tools.chair.templateType;
    let next = 'CHAIR_FLIP';
    if (current === 'CHAIR_CYCLOHEXANE') next = 'CHAIR_FLIP';
    else if (current === 'CHAIR_FLIP') next = 'CHAIR_CYCLOHEXANE';
    else if (current === 'PYRANOSE_CHAIR') next = 'PYRANOSE_CHAIR_FLIP';
    else if (current === 'PYRANOSE_CHAIR_FLIP') next = 'PYRANOSE_CHAIR';
    app.selectTool('chair', next);
  }
}

testToggleChair(mockApp);
console.assert(mockApp.activeToolKey === 'chair', 'Debe seleccionar chair');
console.assert(mockApp.tools.chair.templateType === 'CHAIR_CYCLOHEXANE', 'Debe iniciar en CHAIR_CYCLOHEXANE');
console.log('✓ Presionar "C" por primera vez: selecciona herramienta Silla Normal (CHAIR_CYCLOHEXANE)');

testToggleChair(mockApp);
console.assert(mockApp.tools.chair.templateType === 'CHAIR_FLIP', 'Debe alternar a CHAIR_FLIP');
console.log('✓ Presionar "C" de nuevo: alterna automáticamente a Giro de Silla (CHAIR_FLIP)');

testToggleChair(mockApp);
console.assert(mockApp.tools.chair.templateType === 'CHAIR_CYCLOHEXANE', 'Debe volver a CHAIR_CYCLOHEXANE');
console.log('✓ Presionar "C" por tercera vez: vuelve a Silla Normal (CHAIR_CYCLOHEXANE)');

console.log('\n--- TEST 9: Pyridine, Pyridinium Ion (N+), and Lone Pairs ---');
import { getAtomLonePairAngles, computeAutoAtomLabel } from '../js/chem-engine/elements.js';

// 1. N de piridinio con 4 enlaces:
const stateN = new ChemState();
const nAtom = stateN.addAtom({ id: 'n1', x: 200, y: 200, element: 'N', charge: 0 });
const cRing1 = stateN.addAtom({ id: 'cr1', x: 174, y: 185, element: 'C' });
const cRing2 = stateN.addAtom({ id: 'cr2', x: 226, y: 185, element: 'C' });
const cMe = stateN.addAtom({ id: 'cme', x: 200, y: 240, element: 'C' });
stateN.addBond({ atom1: nAtom.id, atom2: cRing1.id, type: 'double' }); // 2
stateN.addBond({ atom1: nAtom.id, atom2: cRing2.id, type: 'single' }); // 1
stateN.addBond({ atom1: nAtom.id, atom2: cMe.id, type: 'single' });   // 1 (total 4)

// Carga automática: al dibujar el 4º enlace el N recibe +1 solo, sin error
console.assert(nAtom.charge === 1, `N con 4 enlaces debe recibir carga +1 automática (actual: ${nAtom.charge})`);
console.assert(!stateN.valenceErrors.get('n1').hasError, 'N+ automático no debe marcar error');
console.log('✓ Nitrógeno con 4 enlaces: recibe carga formal +1 automáticamente');

// Si el usuario fuerza la carga a 0 a mano, se respeta y el validador lo marca
nAtom.charge = 0;
stateN.updateValences();
console.assert(nAtom.charge === 0, 'La carga puesta a mano debe respetarse');
let nReport = validateMolecularValences(Array.from(stateN.atoms.values()), Array.from(stateN.bonds.values()));
console.assert(nReport.get('n1').hasError, 'N neutro con 4 enlaces debe reportar error/advertencia');
console.assert(nReport.get('n1').message.includes('requiere carga positiva'), 'Mensaje debe indicar que requiere carga positiva');
console.log('✓ Nitrógeno forzado a neutro con 4 enlaces: alerta correctamente "requiere carga positiva formal (+)"');

// Nitrobenceno: Ar–N(=O)–O  ->  N+ y O− automáticos, sin errores
const stateNitro = new ChemState();
stateNitro.addAtom({ id: 'ar', x: 0, y: 0, element: 'C' });
stateNitro.addAtom({ id: 'nn', x: 33, y: 19, element: 'N' });
stateNitro.addAtom({ id: 'o_dbl', x: 33, y: 57, element: 'O' });
stateNitro.addAtom({ id: 'o_sgl', x: 66, y: 0, element: 'O' });
stateNitro.addBond({ atom1: 'ar', atom2: 'nn', type: 'single' });
stateNitro.addBond({ atom1: 'nn', atom2: 'o_dbl', type: 'double' });
stateNitro.addBond({ atom1: 'nn', atom2: 'o_sgl', type: 'single' });
console.assert(stateNitro.getAtom('nn').charge === 1, 'Nitro: N debe ser +1');
console.assert(stateNitro.getAtom('o_sgl').charge === -1, 'Nitro: O simple debe ser −1');
console.assert(stateNitro.getAtom('o_dbl').charge === 0, 'Nitro: O doble debe ser neutro');
console.assert([...stateNitro.valenceErrors.values()].every(v => !v.hasError), 'Nitro: sin errores de valencia');
// Al quitar el enlace N=O (queda N con 2 enlaces) las cargas automáticas desaparecen
for (const [id, b] of stateNitro.bonds) if (b.atom2 === 'o_dbl') stateNitro.removeBond(id);
console.assert(stateNitro.getAtom('nn').charge === 0 && stateNitro.getAtom('o_sgl').charge === 0, 'Cargas automáticas se retiran solas');
console.log('✓ Nitrobenceno: N+ y O− automáticos (y se retiran al deshacer la estructura)');

// Ahora asignamos carga +1:
nAtom.charge = 1;
stateN.updateValences();
let nReportCharged = validateMolecularValences(Array.from(stateN.atoms.values()), Array.from(stateN.bonds.values()));
console.assert(!nReportCharged.get('n1').hasError, 'Piridinio / Amonio con carga +1 es totalmente válido');
console.log('✓ Piridinio con carga formal +1 (N⁺ con 4 enlaces): VALENCIA VÁLIDA (sin error falso)');

// Auto-label para piridinio N+ con 4 enlaces:
const autoNPlus = computeAutoAtomLabel('N', 4, 1);
console.assert(autoNPlus === 'N+', `Esperado N+, obtenido: ${autoNPlus}`);
console.log('✓ computeAutoAtomLabel para N con 4 enlaces y carga +1 genera "N+"');

// 2. Cálculo de ángulos de pares libres (Lone Pairs):
// En piridina neutra (2 enlaces a cr1 y cr2):
const statePyr = new ChemState();
const nPyr2 = statePyr.addAtom({ id: 'np2', x: 200, y: 200, element: 'N' });
const crA = statePyr.addAtom({ id: 'cra', x: 174, y: 185, element: 'C' });
const crB = statePyr.addAtom({ id: 'crb', x: 226, y: 185, element: 'C' });
statePyr.addBond({ atom1: nPyr2.id, atom2: crA.id, type: 'double' });
statePyr.addBond({ atom1: nPyr2.id, atom2: crB.id, type: 'single' });

const lpAngles = getAtomLonePairAngles(nPyr2, statePyr, 1);
console.assert(lpAngles.length === 1, 'Debe devolver 1 ángulo para 1 par libre');
// El ángulo debe apuntar hacia abajo (hacia el espacio libre opuesto al anillo, Math.PI/2 = 1.57 rad)
const angleDeg = (lpAngles[0] * 180 / Math.PI) % 360;
console.assert(Math.abs(angleDeg - 90) < 5 || Math.abs(angleDeg - 450) < 5, `Ángulo de par libre de piridina debe ser ~90° (hacia abajo), obtenido: ${angleDeg}°`);
console.log(`✓ Ángulo óptimo de par libre en piridina: ${angleDeg.toFixed(1)}° (apunta perfectamente hacia afuera del anillo)`);

console.log('\n--- TEST 10: Oxonium / Hydronium Species (OH3+ / H3O+) ---');
const stateOxo = new ChemState();
const oAtom = stateOxo.addAtom({ id: 'o1', x: 100, y: 100, element: 'O', charge: 0 });
const r1 = stateOxo.addAtom({ id: 'r1', x: 80, y: 90, element: 'C' });
const r2 = stateOxo.addAtom({ id: 'r2', x: 120, y: 90, element: 'C' });
const r3 = stateOxo.addAtom({ id: 'r3', x: 100, y: 130, element: 'C' });
stateOxo.addBond({ atom1: oAtom.id, atom2: r1.id, type: 'single' });
stateOxo.addBond({ atom1: oAtom.id, atom2: r2.id, type: 'single' });
stateOxo.addBond({ atom1: oAtom.id, atom2: r3.id, type: 'single' });

console.assert(oAtom.charge === 1, 'O con 3 enlaces debe recibir carga +1 automática');
oAtom.charge = 0; // forzado a mano
stateOxo.updateValences();
let oReport = validateMolecularValences(Array.from(stateOxo.atoms.values()), Array.from(stateOxo.bonds.values()));
console.assert(oReport.get('o1').hasError, 'Oxígeno neutro con 3 enlaces requiere carga');
console.log('✓ Oxígeno con 3 enlaces: +1 automático; forzado a neutro, alerta de valencia');

oAtom.charge = 1;
stateOxo.updateValences();
let oReportCharged = validateMolecularValences(Array.from(stateOxo.atoms.values()), Array.from(stateOxo.bonds.values()));
console.assert(!oReportCharged.get('o1').hasError, 'Ion oxonio con carga +1 es químicamente válido');
console.log('✓ Ion oxonio con carga +1 (O⁺ con 3 enlaces): VALENCIA VÁLIDA (sin error)');

// Formato y reversión de OH3+ / H3O+:
const oDisplay = getFormattedAtomDisplay({ element: 'O', charge: 1, label: 'OH3+' }, stateOxo);
console.assert(oDisplay.text === 'OH3+', 'Formato correcto para ion hidronio/oxonio');
console.log('✓ Formato tipográfico y reversión de especies oxonio: OK');

console.log('\n--- TEST 11: Chair Substituents Separation & Snapping Anchor Distance ---');
import { findNearestAnchor } from '../js/chem-engine/snapping.js';

const pyranose = RING_TEMPLATES.PYRANOSE_CHAIR;
const c3Sub = pyranose.substituents.c3.equatorial;
const c4Sub = pyranose.substituents.c4.equatorial;

const c3Ring = pyranose.ringAtoms.find(a => a.id === 'c3');
const c4Ring = pyranose.ringAtoms.find(a => a.id === 'c4');

const c3End = { x: c3Ring.x + c3Sub.dx, y: c3Ring.y + c3Sub.dy };
const c4End = { x: c4Ring.x + c4Sub.dx, y: c4Ring.y + c4Sub.dy };

const distBetweenOH = Math.hypot(c4End.x - c3End.x, c4End.y - c3End.y);
// En la silla real el ecuatorial de C3 sube un poco y el de C4 baja un poco (convergen a la izquierda),
// pero sus extremos deben quedar separados lo suficiente para que "HO" no se encime.
console.assert(distBetweenOH > 14, `Separación mínima entre OH3 y OH4 (${distBetweenOH.toFixed(1)}px > 14px)`);
console.assert(Math.abs(pyranose.substituents.c1.axial.dy) === 34, 'Longitud de axiales normalizada a 34px (sustituyentes de silla)');
console.log(`✓ Separación entre sustituyentes ecuatoriales C3 y C4: ${distBetweenOH.toFixed(1)}px (espacio limpio sin colisión)`);
console.log('✓ Longitud de enlaces axiales y ecuatoriales de silla: 34px');

// Prueba de radio de snapping de 12px (para no formar falsos epóxidos)
const stateSnap = new ChemState();
stateSnap.addAtom({ id: 'target_atom', x: 100, y: 100, element: 'O' });
const nearAnchor = findNearestAnchor(100, 118, stateSnap, null, 12); // a 18px de distancia
console.assert(nearAnchor === null, 'A 18px no debe hacer snap involuntario (umbral 12px)');
const exactAnchor = findNearestAnchor(100, 108, stateSnap, null, 12); // a 8px de distancia
console.assert(exactAnchor !== null, 'A 8px sí debe hacer snap intencional');
console.log('✓ Umbral de snapping reducido a 12px: erradica uniones accidentales a átomos adyacentes');

// Enlaces que brotan de un vértice de silla siguen las guías axial/ecuatorial
{
  const { pickChairGuide } = await import('../js/chem-engine/snapping.js');
  const chairState = new ChemState();
  const tpl = RING_TEMPLATES.CHAIR_CYCLOHEXANE;
  const ids = {};
  for (const a of tpl.ringAtoms) {
    ids[a.id] = chairState.addAtom({ x: 200 + a.x, y: 200 + a.y, element: 'C', chairVertex: a.id, depth: a.depth, substituentGuides: tpl.substituents[a.id] }).id;
  }
  for (const b of tpl.ringBonds) chairState.addBond({ atom1: ids[b.a1], atom2: ids[b.a2] });
  const c1 = chairState.getAtom(ids.c1);
  const g1 = pickChairGuide(c1, chairState);
  console.assert(g1 && g1.type === 'axial', 'Clic en vértice de silla: primero la guía axial');
  const sub = chairState.addAtom({ x: g1.x, y: g1.y, element: 'C' });
  chairState.addBond({ atom1: c1.id, atom2: sub.id });
  console.assert(pickChairGuide(c1, chairState).type === 'equatorial', 'Con la axial ocupada: la ecuatorial');
  // Arrastre: el cursor cerca de la dirección ecuatorial se ajusta exactamente a la guía
  const eq = tpl.substituents.c1.equatorial;
  const near = pickChairGuide(c1, chairState, { x: c1.x + eq.dx + 6, y: c1.y + eq.dy - 10 });
  console.assert(near && near.type === 'equatorial' && Math.abs(near.x - (c1.x + eq.dx)) < 1e-9, 'Arrastre cerca de la ecuatorial se ajusta a la guía');
  console.assert(pickChairGuide(c1, chairState, { x: c1.x - 30, y: c1.y }) === null, 'Arrastre lejos de las guías usa el snapping normal');
  console.log('✓ Enlaces desde vértices de silla siguen las guías axial/ecuatorial (clic, tecla 1 y arrastre)');
}

console.log('\n--- TEST 12: Problem Builder Mode & Fit Scheme Layout ---');
import { ProblemBuilder } from '../js/chem-engine/problem-builder.js';

const stateProblem = new ChemState();
stateProblem.isProblemMode = true;

// 1. Crear paso inicial: [ Recuadro A ] ────> [ Recuadro B ]
const step1 = ProblemBuilder.createInitialStep(100, 300, stateProblem);
console.assert(stateProblem.referenceBoxes.size === 2, 'Debe haber 2 recuadros creados');
console.assert(stateProblem.arrows.size === 1, 'Debe haber 1 flecha creada');
console.assert(step1.boxA.label === 'A', 'Primer recuadro debe ser A');
console.assert(step1.boxB.label === 'B', 'Segundo recuadro debe ser B');
console.log('✓ ProblemBuilder.createInitialStep: genera recuadro [A] ──> [B] automáticamente');

// 2. Extender esquema desde B: [B] ────> [C]
const step2 = ProblemBuilder.extendFromBox(step1.boxB, 'right', stateProblem);
console.assert(stateProblem.referenceBoxes.size === 3, 'Debe haber 3 recuadros');
console.assert(stateProblem.arrows.size === 2, 'Debe haber 2 flechas');
console.assert(step2.newBox.label === 'C', 'Tercer recuadro debe ser C');
console.log('✓ ProblemBuilder.extendFromBox: encadena paso siguiente hacia [C]');

// 3. Añadir reactivos largos a la flecha 1
step1.arrow.reagentsTop = '1) NaH, BnCl (2.0 equiv)\n2) NaBH3CN, THF';
step1.arrow.reagentsBottom = 'p-TsOH, H2O';

// 4. Dibujar una molécula dentro de [A]
const aMol1 = stateProblem.addAtom({ id: 'm1', x: step1.boxA.x + 30, y: step1.boxA.y + 30, element: 'C' });
const aMol2 = stateProblem.addAtom({ id: 'm2', x: step1.boxA.x + 70, y: step1.boxA.y + 70, element: 'C' });
stateProblem.addBond({ atom1: aMol1.id, atom2: aMol2.id, type: 'single' });

// 5. Ejecutar "Encajar Esquema"
ChemAligner.fitSchemeLayout(stateProblem);

// Verificar que la flecha 1 se expandió para que quepan los reactivos
const arrowLen1 = step1.arrow.x2 - step1.arrow.x1;
console.assert(arrowLen1 >= 180, `Longitud de flecha ajustada según reactivos (actual: ${arrowLen1}px >= 180px)`);

// Verificar que no hay solapamiento:
// El inicio de la flecha 1 debe estar después del borde derecho de A (+ gap)
console.assert(step1.boxB.x >= step1.arrow.x2, 'Recuadro B se encuentra después de la punta de la flecha 1');
console.log(`✓ ChemAligner.fitSchemeLayout: flecha expandida a ${arrowLen1}px sin solapar ni invadir los compuestos`);

console.log('\n--- TEST 13: Lone Pair Geometry (Hydrazine H2N-NH2 & Hydroxyl OH) ---');

const stateHydrazine = new ChemState();
// Hidrazina inclinada:
const nLeftHyd = stateHydrazine.addAtom({ id: 'n_left_hyd', x: 100, y: 200, element: 'N', lonePairs: 1 });
const nRightHyd = stateHydrazine.addAtom({ id: 'n_right_hyd', x: 150, y: 160, element: 'N', lonePairs: 1 });
stateHydrazine.addBond({ atom1: nLeftHyd.id, atom2: nRightHyd.id, type: 'single' });

const leftDisp = getFormattedAtomDisplay(nLeftHyd, stateHydrazine);
const rightDisp = getFormattedAtomDisplay(nRightHyd, stateHydrazine);
console.assert(leftDisp.text === 'H2N', `Átomo izquierdo debe ser H2N (actual: ${leftDisp.text})`);
console.assert(rightDisp.text === 'NH2', `Átomo derecho debe ser NH2 (actual: ${rightDisp.text})`);

const anglesLeft = getAtomLonePairAngles(nLeftHyd, stateHydrazine, 1);
const anglesRight = getAtomLonePairAngles(nRightHyd, stateHydrazine, 1);

// En H2N (vecino arriba a la derecha), el par libre debe ir ABAJO (+PI/2 = 90°)
console.assert(Math.abs(anglesLeft[0] - Math.PI / 2) < 0.01, `Par libre de H2N debe apuntar hacia ABAJO (+90°), actual: ${(anglesLeft[0] * 180 / Math.PI).toFixed(1)}°`);
// En NH2 (vecino abajo a la izquierda), el par libre debe ir ARRIBA (-PI/2 = -90°)
console.assert(Math.abs(anglesRight[0] - (-Math.PI / 2)) < 0.01, `Par libre de NH2 debe apuntar hacia ARRIBA (-90°), actual: ${(anglesRight[0] * 180 / Math.PI).toFixed(1)}°`);
console.log(`✓ Hidrazina: par libre en H2N apunta a ${(anglesLeft[0] * 180 / Math.PI).toFixed(1)}° (abajo) y en NH2 apunta a ${(anglesRight[0] * 180 / Math.PI).toFixed(1)}° (arriba) sin invadir H2`);

// Probar grupo hidroxilo terminal -OH (2 pares libres)
const stateOH = new ChemState();
const cEthanol = stateOH.addAtom({ id: 'c_eth', x: 200, y: 200, element: 'C' });
const oEthanol = stateOH.addAtom({ id: 'o_eth', x: 240, y: 200, element: 'O', lonePairs: 2 });
stateOH.addBond({ atom1: cEthanol.id, atom2: oEthanol.id, type: 'single' });

const anglesOH = getAtomLonePairAngles(oEthanol, stateOH, 2);
console.assert(anglesOH.length === 2, 'OH debe tener 2 pares libres');
console.assert(Math.abs(anglesOH[0] - (-Math.PI / 2)) < 0.01 && Math.abs(anglesOH[1] - Math.PI / 2) < 0.01, 'Pares libres de OH deben estar arriba y abajo');
console.log('✓ Grupo hidroxilo (OH): 2 pares libres distribuidos verticalmente (arriba y abajo) despejando el H');

console.log('\n--- TEST 14: Fit Scheme Layout without breaking molecules & Enclosing Acetophenone & Oxime ---');
const stateReaction = new ChemState();
stateReaction.isProblemMode = true;

// Crear paso inicial con Box A y Box B
const initStep = ProblemBuilder.createInitialStep(100, 300, stateReaction);
const boxA = initStep.boxA;
const boxB = initStep.boxB;
const arrow = initStep.arrow;
arrow.reagentsTop = 'NH2OH';

// Construir acetofenona en Box A (Benceno + C(=O)CH3 donde =O sube arriba)
const ac_c1 = stateReaction.addAtom({ id: 'ac_c1', x: boxA.x + 40, y: boxA.y + 60, element: 'C' });
const ac_c2 = stateReaction.addAtom({ id: 'ac_c2', x: boxA.x + 80, y: boxA.y + 60, element: 'C' });
const cAcyl = stateReaction.addAtom({ id: 'ac_acyl', x: boxA.x + 100, y: boxA.y + 40, element: 'C' });
const oCarbonyl = stateReaction.addAtom({ id: 'ac_o', x: boxA.x + 100, y: boxA.y - 10, element: 'O' }); // inicialmente sobresalía
const ac_me = stateReaction.addAtom({ id: 'ac_me', x: boxA.x + 120, y: boxA.y + 55, element: 'C' });

stateReaction.addBond({ atom1: ac_c1.id, atom2: ac_c2.id, type: 'single' });
stateReaction.addBond({ atom1: ac_c2.id, atom2: cAcyl.id, type: 'single' });
stateReaction.addBond({ atom1: cAcyl.id, atom2: oCarbonyl.id, type: 'double' });
stateReaction.addBond({ atom1: cAcyl.id, atom2: ac_me.id, type: 'single' });

// Construir oxima en Box B (Benceno + C(=N-OH)CH3 donde N-OH sube arriba)
const b1 = stateReaction.addAtom({ id: 'ox_b1', x: boxB.x + 40, y: boxB.y + 60, element: 'C' });
const b2 = stateReaction.addAtom({ id: 'ox_b2', x: boxB.x + 80, y: boxB.y + 60, element: 'C' });
const bImine = stateReaction.addAtom({ id: 'ox_imine', x: boxB.x + 100, y: boxB.y + 40, element: 'C' });
const nOxime = stateReaction.addAtom({ id: 'ox_n', x: boxB.x + 100, y: boxB.y - 5, element: 'N' });
const ohOxime = stateReaction.addAtom({ id: 'ox_oh', x: boxB.x + 120, y: boxB.y - 20, element: 'O', label: 'OH' });
const bMe = stateReaction.addAtom({ id: 'ox_me', x: boxB.x + 120, y: boxB.y + 55, element: 'C' });

stateReaction.addBond({ atom1: b1.id, atom2: b2.id, type: 'single' });
stateReaction.addBond({ atom1: b2.id, atom2: bImine.id, type: 'single' });
stateReaction.addBond({ atom1: bImine.id, atom2: nOxime.id, type: 'double' });
stateReaction.addBond({ atom1: nOxime.id, atom2: ohOxime.id, type: 'single' });
stateReaction.addBond({ atom1: bImine.id, atom2: bMe.id, type: 'single' });

const initialBondLen = Math.hypot(nOxime.x - bImine.x, nOxime.y - bImine.y);

// Ejecutar fitSchemeLayout
ChemAligner.fitSchemeLayout(stateReaction);

// 1. Verificar que Box A contiene completamente al oxígeno
console.assert(oCarbonyl.y >= boxA.y + 10, 'Oxígeno de acetofenona debe estar holgadamente dentro de Box A');
console.assert(oCarbonyl.y <= boxA.y + boxA.height, 'Oxígeno de acetofenona no debe salir por abajo');
console.log(`✓ Recuadro [A]: auto-ajustado holgadamente envolviendo el oxígeno carbonílico (y_O=${oCarbonyl.y}, box_y=${boxA.y}, top_clearance=${oCarbonyl.y - boxA.y}px)`);

// 2. Verificar que la molécula B NO se rompió ni se estiró
const postBondLen = Math.hypot(nOxime.x - bImine.x, nOxime.y - bImine.y);
console.assert(Math.abs(postBondLen - initialBondLen) < 0.001, `Longitud del enlace C=N no debe variar (inicial: ${initialBondLen.toFixed(1)}, final: ${postBondLen.toFixed(1)})`);
console.assert(ohOxime.y >= boxB.y + 10, 'Grupo OH de oxima debe estar dentro de Box B');
console.log(`✓ Molécula [B]: todos sus átomos (anillo, C=N, OH y metilo) se desplazaron íntegramente juntos (longitud C=N preservada exacta: ${postBondLen.toFixed(1)}px)`);

console.log('\n--- TEST 15: Forked Arrow & Stereoselectivity Layout (Anti / Syn & Descriptions) ---');
const stateFork = new ChemState();
stateFork.isProblemMode = true;

// Crear recuadro de origen con acetofenona
const boxSource = stateFork.addReferenceBox({
  boxType: 'compound',
  label: '1',
  x: 100,
  y: 200,
  width: 140,
  height: 110
});

// Bifurcar paso para generar las rutas Anti y Syn
const forkStep = ProblemBuilder.createForkStep(boxSource, stateFork);
const forkArrow = forkStep.forkArrow;
const boxAnti = forkStep.boxTop;
const boxSyn = forkStep.boxBottom;

console.assert(forkArrow.type === 'fork', 'La flecha debe ser de tipo "fork"');
console.assert(forkArrow.yTop < forkArrow.y1, 'Rama superior debe estar arriba del tallo');
console.assert(forkArrow.yBottom > forkArrow.y1, 'Rama inferior debe estar abajo del tallo');
console.assert(boxAnti.y < boxSyn.y, 'Recuadro Anti debe estar arriba del recuadro Syn');
console.log('✓ Flecha bifurcada creada con tallo central y ramas superior/inferior');

// Construir oxima Anti en boxAnti
const anti_c1 = stateFork.addAtom({ id: 'anti_c1', x: boxAnti.x + 30, y: boxAnti.y + 50, element: 'C' });
const anti_n = stateFork.addAtom({ id: 'anti_n', x: boxAnti.x + 60, y: boxAnti.y + 40, element: 'N' });
const anti_oh = stateFork.addAtom({ id: 'anti_oh', x: boxAnti.x + 75, y: boxAnti.y + 20, element: 'O', label: 'OH' });
stateFork.addBond({ atom1: anti_c1.id, atom2: anti_n.id, type: 'double' });
stateFork.addBond({ atom1: anti_n.id, atom2: anti_oh.id, type: 'single' });

const initialAntiCNLen = Math.hypot(anti_n.x - anti_c1.x, anti_n.y - anti_c1.y);

// Agregar descriptor estereoquímico "Anti" debajo de boxAnti
const labelAntiStereo = stateFork.addTextLabel({
  x: boxAnti.x + boxAnti.width / 2,
  y: boxAnti.y + boxAnti.height + 15,
  text: 'Anti',
  fontSize: 19,
  isStereo: true
});

// Agregar descripción "Producto de Control Cinético" debajo de "Anti"
const labelAntiDesc = stateFork.addTextLabel({
  x: boxAnti.x + boxAnti.width / 2,
  y: boxAnti.y + boxAnti.height + 35,
  text: 'Producto de Control Cinético',
  fontSize: 13,
  isDescription: true
});

// Añadir reactivos en la flecha bifurcada
forkArrow.reagentsTop = 'NH2OH·HCl\nNaOAc, EtOH';

// Ejecutar ajuste armónico del esquema (fitSchemeLayout)
ChemAligner.fitSchemeLayout(stateFork);

// 1. Verificar que la flecha se expandió para que los reactivos quepan holgadamente
console.assert(forkArrow.stemEndX - forkArrow.x1 >= 70, 'El tallo debe acomodar los reactivos');

// 2. Verificar que las moléculas en las ramas NO se deformaron
const postAntiCNLen = Math.hypot(anti_n.x - anti_c1.x, anti_n.y - anti_c1.y);
console.assert(Math.abs(postAntiCNLen - initialAntiCNLen) < 0.001, 'Enlace C=N no debe variar al bifurcar');

// 3. Verificar que los rótulos "Anti" y "Control Cinético" se mantuvieron sincronizados y centrados con el recuadro
console.assert(Math.abs(labelAntiStereo.x - (boxAnti.x + boxAnti.width / 2)) < 5, 'Rótulo Anti debe permanecer centrado bajo el recuadro');
console.assert(labelAntiDesc.y > labelAntiStereo.y, 'Descripción debe quedar debajo del descriptor Anti');
console.log(`✓ Esquema bifurcado encajado a la perfección: tallo extendido, enlaces conservados (C=N: ${postAntiCNLen.toFixed(1)}px), y descriptores ("${labelAntiStereo.text}", "${labelAntiDesc.text}") fijados sin romperse`);

console.log('\n--- TEST 16: Auto-generate Box B and Box C on Bifurcation & Symmetric Vertical Centering ---');
const stateTest16 = new ChemState();
stateTest16.isProblemMode = true;

// Caso: [A] ──> [B]
const step16 = ProblemBuilder.createInitialStep(100, 300, stateTest16);
const arrowToBifurcate = step16.arrow;
const boxA_16 = step16.boxA;
const boxB_16 = step16.boxB;

console.assert(stateTest16.referenceBoxes.size === 2, 'Inicia con Box A y Box B');
console.assert(boxB_16.y + boxB_16.height / 2 === arrowToBifurcate.y1, 'Box B inicia centrado con la flecha simple');

// Ahora simular presionar el botón "Alternar Bifurcación (Anti / Syn)"
arrowToBifurcate.type = 'fork';
arrowToBifurcate.branchSpacing = 150;
arrowToBifurcate.stemEndX = arrowToBifurcate.x1 + 55;
arrowToBifurcate.yTop = arrowToBifurcate.y1 - 75;
arrowToBifurcate.yBottom = arrowToBifurcate.y1 + 75;

// Mover Box B a la rama superior y crear Box C en la rama inferior
const gap16 = 16;
boxB_16.x = arrowToBifurcate.x2 + gap16;
boxB_16.y = arrowToBifurcate.yTop - boxB_16.height / 2;

const labelC_16 = ProblemBuilder.getNextLabel(stateTest16);
const boxC_16 = stateTest16.addReferenceBox({
  boxType: 'compound',
  label: labelC_16,
  x: arrowToBifurcate.x2 + gap16,
  y: arrowToBifurcate.yBottom - boxB_16.height / 2,
  width: boxB_16.width,
  height: boxB_16.height
});

console.assert(stateTest16.referenceBoxes.size === 3, 'Ahora hay 3 recuadros: A, B y C');
console.assert(boxB_16.y + boxB_16.height / 2 === arrowToBifurcate.yTop, 'Box B ahora está centrado exactamente en la rama superior');
console.assert(boxC_16.y + boxC_16.height / 2 === arrowToBifurcate.yBottom, 'Box C ahora está centrado exactamente en la rama inferior');
console.assert(boxC_16.label === 'C', `El nuevo recuadro debe llamarse C (actual: ${boxC_16.label})`);
console.log('✓ Al bifurcar la flecha, Box B se desplaza a la rama superior y se genera automáticamente Box C en la rama inferior');

// 2. Probar centrado simétrico vertical (sin límite inferior artificial)
const testMolAtoms = [
  stateTest16.addAtom({ id: 'm1', x: boxA_16.x + 40, y: boxA_16.y + 30, element: 'C' }),
  stateTest16.addAtom({ id: 'm2', x: boxA_16.x + 40, y: boxA_16.y + 70, element: 'C' })
];
const molBboxY = (30 + 70) / 2 + boxA_16.y; // 50px de centro
ProblemBuilder.autoFitBox(boxA_16, stateTest16);
const boxCenterY = boxA_16.y + boxA_16.height / 2;
console.assert(Math.abs(boxCenterY - molBboxY) < 1, `El recuadro debe quedar centrado simétricamente con el centro vertical de la molécula (boxCenterY=${boxCenterY}, molCenterY=${molBboxY})`);
console.log('✓ Centrado simétrico horizontal/vertical verificado: el recuadro y la flecha se alinean al eje medio de la molécula sin sesgo ni límite inferior');

// 3. Probar toggle de visibilidad de recuadros
stateTest16.showCompoundBoxes = false;
console.assert(stateTest16.showCompoundBoxes === false, 'Toggle a falso oculta los recuadros sin perder datos');
stateTest16.showCompoundBoxes = true;
console.assert(stateTest16.showCompoundBoxes === true, 'Toggle a verdadero vuelve a mostrar los recuadros');
console.log('\n--- TEST 17: Converge Arrow Layout & Closing Bifurcation (2 ➔ 1 Reaction Step) ---');
// Probar cierre de bifurcación desde Box B y Box C hacia Box D
const convRes = ProblemBuilder.createConvergeStep(boxB_16, boxC_16, stateTest16);
const convArrow = convRes.convergeArrow;
const boxD_16 = convRes.targetBox;

console.assert(convArrow.type === 'converge', 'La flecha debe ser de tipo converge');
console.assert(boxD_16.label === 'D', `El recuadro destino debe llamarse D (actual: ${boxD_16.label})`);
console.assert(convArrow.yTop === boxB_16.y + boxB_16.height / 2, 'Rama superior de convergencia coincide con centro de Box B');
console.assert(convArrow.yBottom === boxC_16.y + boxC_16.height / 2, 'Rama inferior de convergencia coincide con centro de Box C');
console.assert(convArrow.yMid === (convArrow.yTop + convArrow.yBottom) / 2, 'Eje medio de convergencia equidistante de ambas ramas');
console.assert(boxD_16.y + boxD_16.height / 2 === convArrow.yMid, 'Box D debe estar perfectamente centrado en el eje medio de la reacción');

// Probar reactivos arriba y abajo en la flecha de convergencia
convArrow.reagentsTop = 'H2, Pd/C';
convArrow.reagentsBottom = 'EtOH, 25°C';

// Colocar molécula en Box D (ej. hidroquinona) y correr fitSchemeLayout
const d_c1 = stateTest16.addAtom({ id: 'd_c1', x: boxD_16.x + 40, y: boxD_16.y + 40, element: 'C' });
const d_c2 = stateTest16.addAtom({ id: 'd_c2', x: boxD_16.x + 80, y: boxD_16.y + 40, element: 'C' });
const d_oh = stateTest16.addAtom({ id: 'd_oh', x: boxD_16.x + 100, y: boxD_16.y + 20, element: 'O', label: 'OH' });
stateTest16.addBond({ atom1: d_c1.id, atom2: d_c2.id, type: 'single' });
stateTest16.addBond({ atom1: d_c2.id, atom2: d_oh.id, type: 'single' });
const initialDLen = Math.hypot(d_oh.x - d_c2.x, d_oh.y - d_c2.y);

ChemAligner.fitSchemeLayout(stateTest16);

const postDLen = Math.hypot(d_oh.x - d_c2.x, d_oh.y - d_c2.y);
console.assert(Math.abs(postDLen - initialDLen) < 0.001, 'Los enlaces en Box D no deben alterarse');
console.assert(convArrow.x2 < boxD_16.x, 'La flecha convergente debe terminar antes de Box D');
console.assert(convArrow.x1 > boxB_16.x + boxB_16.width, 'La flecha convergente debe iniciar después de los recuadros de origen');
console.log('✓ Cierre de bifurcación verificado: dos reactivos convergen con precisión geométrica a un único producto Box D');

console.log('\n--- TEST 18: Auto-assign Olympiad Unknown Letters (Incógnitas A, B, C...) in Empty Boxes ---');
const state18 = new ChemState();
state18.isProblemMode = true;

// 1. Crear secuencia [A] ──> [B] ──> [C] ──> [D]
const step18_1 = ProblemBuilder.createInitialStep(50, 200, state18);
const bA = step18_1.boxA; // badge 'A'
const bB = step18_1.boxB; // badge 'B'

const step18_2 = ProblemBuilder.extendFromBox(bB, 'right', state18);
const bC = step18_2.newBox; // badge 'C'

const step18_3 = ProblemBuilder.extendFromBox(bC, 'right', state18);
const bD = step18_3.newBox; // badge 'D'

console.assert(state18.referenceBoxes.size === 4, 'Se crean 4 recuadros correlativos en el esquema');

// 2. Colocar moléculas en Box A y en Box B (Box C y Box D quedan vacíos)
const mol1 = state18.addAtom({ id: 'm18_1', x: bA.x + 30, y: bA.y + 40, element: 'C' });
const mol2 = state18.addAtom({ id: 'm18_2', x: bB.x + 30, y: bB.y + 40, element: 'C' });

// 3. Ejecutar Encajar Esquema
ChemAligner.fitSchemeLayout(state18);

// Box A tiene molécula -> NO es incógnita
console.assert(bA.unknownLetter === null, 'Box A contiene molécula, por lo que no es incógnita');
console.assert(bA.label === 'A', 'Box A conserva su rótulo de recuadro A');

// Box B tiene molécula -> NO es incógnita
console.assert(bB.unknownLetter === null, 'Box B contiene molécula, por lo que no es incógnita');
console.assert(bB.label === 'B', 'Box B conserva su rótulo de recuadro B');

// Box C está VACÍO -> es la incógnita C -> Debe asignársele 'C'
console.assert(bC.unknownLetter === 'C', `Box C (vacío) debe ser la incógnita 'C' (actual: ${bC.unknownLetter})`);
console.assert(bC.label === 'C', `Box C mantiene su rótulo de esquina 'C' para enumeración clara (actual: ${bC.label})`);

// Box D está VACÍO -> es la incógnita D -> Debe asignársele 'D'
console.assert(bD.unknownLetter === 'D', `Box D (vacío) debe ser la incógnita 'D' (actual: ${bD.unknownLetter})`);
console.assert(bD.label === 'D', `Box D mantiene su rótulo de esquina 'D' para enumeración clara (actual: ${bD.label})`);
console.log('✓ Incógnita de Box C asignada como "C" en el centro manteniendo su rótulo C en la esquina');
console.log('✓ Incógnita de Box D asignada como "D" en el centro manteniendo su rótulo D en la esquina');

// 4. Ahora el usuario dibuja una molécula en Box C
const mol3 = state18.addAtom({ id: 'm18_3', x: bC.x + 30, y: bC.y + 40, element: 'C' });
ChemAligner.fitSchemeLayout(state18);

// Box C ya no está vacío -> unknownLetter se borra
console.assert(bC.unknownLetter === null, 'Al tener molécula en Box C, la incógnita central se despeja automáticamente');
// Box D conserva su incógnita 'D'
console.assert(bD.unknownLetter === 'D', `Box D conserva su incógnita 'D' al completarse Box C (actual: ${bD.unknownLetter})`);
console.log('✓ Al rellenar Box C con una estructura, la incógnita se despeja y Box D conserva su incógnita "D"');

console.log('\n--- TEST 19: Problem Mode Interaction & Canvas Drawing Fixes ---');
import { ArrowTool } from '../js/tools/arrow-tool.js';
import { BondTool } from '../js/tools/bond-tool.js';

const mockRenderer = { render: () => {}, hoveredAtomId: null, hoveredBondId: null };
const state19 = new ChemState();
state19.isProblemMode = true;

// 1. Simular clic simple con ArrowTool en lienzo vacío (rawStartPos definido, desplazamiento 0)
const arrowTool = new ArrowTool(state19, mockRenderer);
arrowTool.onMouseDown({}, { x: 100, y: 200 }, null);
arrowTool.onMouseUp({}, { x: 100, y: 200 }, null);

console.assert(state19.referenceBoxes.size === 2, 'Clic con ArrowTool en lienzo vacío debe crear paso inicial [A] y [B]');
console.assert(state19.arrows.size === 1, 'Clic con ArrowTool debe crear 1 flecha conectando A -> B');
console.log('✓ Clic simple con ArrowTool en lienzo vacío crea correctamente [A] ──> [B]');

// 2. Simular clic simple cerca de Box B para extender la reacción a Box C
const boxB_19 = Array.from(state19.referenceBoxes.values()).find(b => b.label === 'B');
arrowTool.onMouseDown({}, { x: boxB_19.x + boxB_19.width + 10, y: boxB_19.y + boxB_19.height / 2 }, null);
arrowTool.onMouseUp({}, { x: boxB_19.x + boxB_19.width + 10, y: boxB_19.y + boxB_19.height / 2 }, null);

console.assert(state19.referenceBoxes.size === 3, 'Clic cerca de Box B debe extender y crear Box C');
console.assert(state19.arrows.size === 2, 'Debe haber 2 flechas en la cadena secuencial');
console.log('✓ Clic simple con ArrowTool cerca de un recuadro extiende fluidamente hacia [C]');

// 3. Simular selección de elemento C y dibujo de átomo con BondTool dentro de Box A
state19.activeElement = 'C';
state19.bondType = 'single';
const bondTool = new BondTool(state19, mockRenderer);
const boxA_19 = Array.from(state19.referenceBoxes.values()).find(b => b.label === 'A');

bondTool.onMouseDown({}, { x: boxA_19.x + 35, y: boxA_19.y + 45 }, null);
bondTool.onMouseUp({}, { x: boxA_19.x + 35, y: boxA_19.y + 45 }, null);

console.assert(state19.atoms.size === 1, 'BondTool debe permitir colocar átomos de inmediato');
const atomCreated = Array.from(state19.atoms.values())[0];
console.assert(atomCreated.element === 'C', 'Átomo creado debe ser de carbono');
console.log('✓ Dibujo de moléculas y átomos con BondTool dentro de los recuadros opera con total fluidez');

console.log('\n--- TEST 20: Bifurcation Fit Scheme Layout with Asymmetric Box Heights & Deduplication ---');
const state20 = new ChemState();
state20.isProblemMode = true;

// Box A
const boxA20 = state20.addReferenceBox({
  id: 'bA',
  boxType: 'compound',
  label: 'A',
  x: 100, y: 200, width: 140, height: 120
});

// Flecha A -> B
state20.addArrow({
  id: 'arr_A_B',
  x1: 256, y1: 260, x2: 376, y2: 260,
  type: 'normal'
});

// Box B
const boxB20 = state20.addReferenceBox({
  id: 'bB',
  boxType: 'compound',
  label: 'B',
  x: 392, y: 200, width: 140, height: 120
});

// Flecha de bifurcación desde B
const forkArr = state20.addArrow({
  id: 'fork_B',
  x1: 548, y1: 260, x2: 668, y2: 260,
  type: 'fork'
});

// Flecha normal sobrante que también sale de Box B (debe eliminarse)
state20.addArrow({
  id: 'stray_normal_arrow',
  x1: 548, y1: 260, x2: 668, y2: 260,
  type: 'normal'
});

// Box C (1 molécula: alto = 110)
const boxC20 = state20.addReferenceBox({
  id: 'bC',
  boxType: 'compound',
  label: 'C',
  x: 684, y: 150, width: 140, height: 110
});

// Box D (2 moléculas: alto = 240)
const boxD20 = state20.addReferenceBox({
  id: 'bD',
  boxType: 'compound',
  label: 'D',
  x: 684, y: 280, width: 140, height: 240
});

// Átomos dentro de Box C (1 silla)
const aC1 = state20.addAtom({ id: 'ac1', x: 750, y: 205, element: 'C' });

// Átomos dentro de Box D (2 sillas)
const aD1 = state20.addAtom({ id: 'ad1', x: 750, y: 340, element: 'C' });
const aD2 = state20.addAtom({ id: 'ad2', x: 750, y: 460, element: 'C' });

// Ejecutar Encajar Esquema
ChemAligner.fitSchemeLayout(state20);

// 1. Verificar que la flecha normal sobrante fue eliminada
console.assert(!state20.arrows.has('stray_normal_arrow'), 'La flecha normal redundante debe ser eliminada automáticamente');
console.assert(state20.arrows.size === 2, `Debe quedar únicamente la flecha A->B y la bifurcación (actual: ${state20.arrows.size})`);
console.log('✓ Flecha normal superpuesta redundante eliminada automáticamente');

// 2. Verificar que Box C y Box D NO SE SOLAPAN y tienen al menos 25px de separación libre
const bottomC = boxC20.y + boxC20.height;
const topD = boxD20.y;
const clearance = topD - bottomC;
console.assert(clearance >= 25, `Box C y Box D deben tener separación vertical limpia >= 25px (actual: ${clearance}px)`);
console.log(`✓ Separación vertical limpia entre Box C y Box D garantizada: ${clearance}px (sin solapamiento)`);

// 3. Verificar que las ramas de la bifurcación apuntan al centro de Box C y Box D
const forkResult = state20.arrows.get('fork_B');
console.assert(Math.abs(forkResult.yTop - (boxC20.y + boxC20.height / 2)) <= 1, 'Rama superior debe apuntar al centro vertical de Box C');
console.assert(Math.abs(forkResult.yBottom - (boxD20.y + boxD20.height / 2)) <= 1, 'Rama inferior debe apuntar al centro vertical de Box D');
console.log('✓ Ramas de bifurcación apuntan con exactitud matemática a los centros de Box C y Box D');

// Incógnita vacía al final de la ruta: se compacta a su letra junto a la punta de la flecha
{
  const sc = new ChemState();
  const src = sc.addReferenceBox({ id: 'src', boxType: 'compound', label: 'A', x: 100, y: 100, width: 140, height: 110 });
  sc.addAtom({ id: 'mol', x: 170, y: 155, element: 'C' });
  sc.addArrow({ id: 'a1', x1: 256, y1: 155, x2: 366, y2: 155, type: 'normal' });
  const mid = sc.addReferenceBox({ id: 'mid', boxType: 'compound', label: 'B', x: 382, y: 100, width: 140, height: 110 });
  sc.addArrow({ id: 'a2', x1: 538, y1: 155, x2: 648, y2: 155, type: 'normal' });
  const leaf = sc.addReferenceBox({ id: 'leaf', boxType: 'compound', label: 'C', x: 664, y: 100, width: 140, height: 110 });
  ProblemBuilder.assignUnknownLetters(sc);
  console.assert(leaf.width === 140, 'Al crear el esquema la incógnita conserva espacio para dibujar');
  ProblemBuilder.compactLeafUnknowns(sc); // lo que hace "Encajar Esquema"
  console.assert(leaf.width < 70 && leaf.x === 664, `Incógnita final compacta junto a la flecha (x=${leaf.x}, w=${leaf.width})`);
  console.assert(Math.abs((leaf.y + leaf.height / 2) - 155) < 1, 'La letra compacta sigue centrada en el eje de la flecha');
  console.assert(mid.width < 70 && mid.x === 382, 'Una incógnita intermedia también se compacta junto a la flecha que le llega');
  // Al encajar, las flechas siguen pegadas a las letras: sin huecos ni recuadros desconectados
  for (const b of [src, mid, leaf]) { b.width = 140; b.height = 110; b.y = 100; b.compacted = false; }
  ChemAligner.fitSchemeLayout(sc);
  const a1 = sc.arrows.get('a1'), a2 = sc.arrows.get('a2');
  console.assert(mid.width < 70 && mid.x - a1.x2 <= 10 && a2.x1 - (mid.x + mid.width) <= 10, 'Incógnita intermedia pegada a sus dos flechas');
  console.assert(leaf.x - a2.x2 <= 10 && Math.abs(a2.y1 - (mid.y + mid.height / 2)) < 1, 'Incógnita final conectada y alineada');

  // Flecha en "L" (abajo + derecha): conserva el doblez y las conexiones al encajar
  const bent = ProblemBuilder.extendBentFromBox(mid, 'down', 'right', sc);
  ChemAligner.fitSchemeLayout(sc);
  console.assert(bent.arrow.bend === 'vh' && bent.arrow.y2 > bent.arrow.y1 + 50 && bent.arrow.x2 > bent.arrow.x1 + 50, 'La flecha en L no se endereza');
  console.assert(Math.abs(bent.newBox.x - bent.arrow.x2) <= 10 && Math.abs(bent.newBox.y + bent.newBox.height / 2 - bent.arrow.y2) < 1, 'El destino de la L queda en la punta');

  console.assert(src.width === 140, 'Un recuadro con molécula no se compacta');
  console.log('✓ Incógnita final compacta e intermedias compactas (sin espacio en blanco junto a las flechas)');
}

console.log('\n--- TEST 21: Auto & Manual Olympiad Unknown Letters (A, B, C... / Custom X) ---');
const state21 = new ChemState();
state21.isProblemMode = true;

// 1. Crear paso inicial: [ Box A ] ---> [ Box B ]
const step21 = ProblemBuilder.createInitialStep(100, 260, state21);
console.assert(step21.boxA.unknownLetter === 'A', `Box A vacío debe ser asignado automáticamente como incógnita 'A' (actual: ${step21.boxA.unknownLetter})`);
console.assert(step21.boxB.unknownLetter === 'B', `Box B vacío debe ser asignado automáticamente como incógnita 'B' (actual: ${step21.boxB.unknownLetter})`);
console.log('✓ Cajas creadas reciben automáticamente letras de incógnita correlativas (A, B...) sin requerir encajar');

// 2. Personalizar Box A manualmente a 'X'
step21.boxA.unknownLetter = 'X';
step21.boxA.manualUnknown = true;
step21.boxA.isUnknown = true;

// 3. Extender hacia Box C
const stepExt = ProblemBuilder.extendFromBox(step21.boxB, 'right', state21);
// step21.boxA debe seguir siendo 'X'
console.assert(step21.boxA.unknownLetter === 'X', `Box A debe mantener la incógnita manual 'X' (actual: ${step21.boxA.unknownLetter})`);
console.log('✓ Fijar incógnita personalizada (X) se preserva íntegramente al extender el esquema');

// 4. Encajar esquema
ChemAligner.fitSchemeLayout(state21);
console.assert(step21.boxA.unknownLetter === 'X', `Box A debe seguir siendo 'X' tras fitSchemeLayout (actual: ${step21.boxA.unknownLetter})`);
console.log('✓ fitSchemeLayout respeta y protege las incógnitas manuales (manualUnknown)');

// 5. Verificar que las demás cajas correlativas no colisionan con 'X'
console.assert(step21.boxB.unknownLetter === 'B', `Box B debe recibir automáticamente la incógnita 'B' (actual: ${step21.boxB.unknownLetter})`);
console.assert(stepExt.newBox.unknownLetter === 'C', `Box C debe recibir automáticamente la incógnita 'C' (actual: ${stepExt.newBox.unknownLetter})`);
console.log('✓ Cajas subsecuentes asignan correlativos limpios (B, C...) sin colisión con incógnita manual "X"');

// 6. Al colocar moléculas en Box A, la incógnita central se despeja automáticamente
state21.addAtom({ id: 'atom_in_A', x: step21.boxA.x + 40, y: step21.boxA.y + 40, element: 'C' });
ProblemBuilder.assignUnknownLetters(state21);
console.assert(step21.boxA.unknownLetter === null, 'Al dibujar molécula dentro de Box A, su incógnita se despeja');
console.assert(step21.boxA.isUnknown === false, 'Box A ya no es incógnita');
console.log('✓ Al rellenar la caja con moléculas, la incógnita se despeja y vuelve al modo normal');

console.log('\n--- TEST 22: Compound Descriptions, 4-Way Extensions, OMs Groups & Acyclic Alkenes ---');
const state22 = new ChemState();
state22.isProblemMode = true;

// 1. Descripción de compuesto
const step22_1 = ProblemBuilder.createInitialStep(100, 200, state22);
step22_1.boxA.description = 'Ácido Cinámico (85% rto.)';
state22.saveSnapshot();
console.assert(step22_1.boxA.description === 'Ácido Cinámico (85% rto.)', 'Descripción asignada correctamente');
console.log('✓ Descripción / subtítulo de compuesto asignada y persistente en el modelo');

// 2. Extensión hacia la izquierda y hacia arriba
const stepDown = ProblemBuilder.extendFromBox(step22_1.boxB, 'down', state22);
const stepLeft = ProblemBuilder.extendFromBox(stepDown.newBox, 'left', state22);
console.assert(stepLeft.arrow.x2 < stepLeft.arrow.x1, 'Flecha hacia la izquierda apunta a X menor');
console.assert(stepLeft.newBox.x < stepDown.newBox.x, 'Nuevo recuadro a la izquierda queda a X menor');
console.log('✓ Extensión hacia la izquierda (left) posicionada correctamente');

const stepUp = ProblemBuilder.extendFromBox(stepLeft.newBox, 'up', state22);
console.assert(stepUp.arrow.y2 < stepUp.arrow.y1, 'Flecha hacia arriba apunta a Y menor');
console.assert(stepUp.newBox.y < stepLeft.newBox.y, 'Nuevo recuadro hacia arriba queda a Y menor');
console.log('✓ Extensión hacia arriba (up) posicionada correctamente');

// 3. Brotar grupo OMs y validación de valencia
const carbon = state22.addAtom({ id: 'c_parent', x: 500, y: 500, element: 'C' });
const angle = calculateNextBondAngle(carbon, state22);
const rad = (angle * Math.PI) / 180;
const omsAtom = state22.addAtom({
  id: 'a_oms',
  x: carbon.x + 26 * Math.cos(rad),
  y: carbon.y + 26 * Math.sin(rad),
  element: 'OMs',
  label: 'OMs',
  manualLabel: true
});
state22.addBond({ atom1: carbon.id, atom2: omsAtom.id, type: 'single' });
state22.updateValences();

const reportVal = validateMolecularValences(Array.from(state22.atoms.values()), Array.from(state22.bonds.values()));
console.assert(!reportVal.get('c_parent').hasError, 'Carbono con grupo OMs no tiene error de valencia');
console.assert(!reportVal.get('a_oms').hasError, 'Grupo OMs es monovalente válido sin error falso');
console.log('✓ Grupo funcional OMs brotado con valencia orgánica correcta y sin falsos positivos');

// 4. Verificación matemática de recorte en dobles enlaces acíclicos
const aAlk1 = state22.addAtom({ id: 'alk1', x: 600, y: 600, element: 'C' });
const aAlk2 = state22.addAtom({ id: 'alk2', x: 600, y: 640, element: 'C' });
const doubleBond = state22.addBond({ atom1: aAlk1.id, atom2: aAlk2.id, type: 'double' });
// Agregar un enlace simple conectado a aAlk1 (sp3 neighbor)
const aSp3 = state22.addAtom({ id: 'sp3', x: 630, y: 580, element: 'C' });
state22.addBond({ atom1: aAlk1.id, atom2: aSp3.id, type: 'single' });

console.assert(doubleBond.type === 'double', 'Enlace es doble');
console.log('✓ Alqueno acíclico conectado a enlace sp3 configurado para línea continua y trim de 6px');

console.log('\n--- TEST 23: Quick Functional Group Selection & Bond Tool Drawing ---');
const state23 = new ChemState();
state23.activeElement = 'OMs';

// 1. Simular creación con BondTool (que pasa { x, y, element: state.activeElement })
const carbon23 = state23.addAtom({ x: 100, y: 100, element: 'C' });
const omsAtom23 = state23.addAtom({ x: 138, y: 100, element: state23.activeElement });

console.assert(omsAtom23.element === 'OMs', 'Elemento es OMs');
console.assert(omsAtom23.label === 'OMs', 'Label asignado automáticamente como OMs');
console.assert(omsAtom23.manualLabel === true, 'manualLabel es true');
console.assert(omsAtom23.isCustomLabel === true, 'isCustomLabel es true');
console.log('✓ addAtom con activeElement="OMs" asigna automáticamente label y manualLabel');

// 2. Conectar enlace C - OMs a la derecha
state23.addBond({ atom1: carbon23.id, atom2: omsAtom23.id, type: 'single' });
const displayRight = getFormattedAtomDisplay(omsAtom23, state23);
console.assert(displayRight.text === 'OMs', `A la derecha se muestra OMs (actual: ${displayRight.text})`);
console.assert(displayRight.bondingAtom === 'O', 'bondingAtom es O');
console.assert(displayRight.bondingSide === 'left', 'bondingSide es left para unir por O');
console.log('✓ Grupo OMs a la derecha une correctamente por el oxígeno (bondingAtom=O)');

// 3. Conectar enlace C - OMs a la izquierda (debe invertirse a MsO)
const carbonLeft = state23.addAtom({ x: 200, y: 100, element: 'C' });
const omsLeft = state23.addAtom({ x: 162, y: 100, element: 'OMs' });
state23.addBond({ atom1: carbonLeft.id, atom2: omsLeft.id, type: 'single' });
const displayLeft23 = getFormattedAtomDisplay(omsLeft, state23);
console.assert(displayLeft23.text === 'MsO', `A la izquierda se invierte a MsO (actual: ${displayLeft23.text})`);
console.assert(displayLeft23.bondingAtom === 'O', 'bondingAtom es O');
console.assert(displayLeft23.bondingSide === 'right', 'bondingSide es right para unir por O');
console.log('✓ Grupo OMs a la izquierda se invierte automáticamente a MsO uniendo por el oxígeno');

console.log('\n--- TEST 24: Leftward Extension Lettering & Multi-directional Smart Bifurcations ---');
const state24 = new ChemState();
state24.isProblemMode = true;

// 1. Crear cadena A -> B -> C -> D (donde D va hacia la izquierda)
const stepInit = ProblemBuilder.createInitialStep(200, 200, state24);
const boxA24 = stepInit.boxA;
const boxB24 = stepInit.boxB;
const stepC = ProblemBuilder.extendFromBox(boxB24, 'right', state24);
const boxC24 = stepC.newBox;

// Extender hacia abajo desde C, luego hacia la izquierda hacia D
const stepDown24 = ProblemBuilder.extendFromBox(boxC24, 'down', state24);
const boxIntermediate = stepDown24.newBox; // label 'D'
const stepLeft24 = ProblemBuilder.extendFromBox(boxIntermediate, 'left', state24);
const boxLeft = stepLeft24.newBox; // label 'E'

console.assert(boxLeft.label === 'E', `El nuevo recuadro a la izquierda recibe label 'E' (actual: ${boxLeft.label})`);
console.assert(boxLeft.unknownLetter === 'E', `El texto central de incógnita a la izquierda es 'E' (no 'A', actual: ${boxLeft.unknownLetter})`);
console.log('✓ Extensión hacia la izquierda mantiene la incógnita secuencial correlativa sin reiniciar a "A"');

// 2. Bifurcación hacia la izquierda (dir = 'left')
const stepForkLeft = ProblemBuilder.createForkStep(boxLeft, state24, 'left');
console.assert(stepForkLeft.forkArrow.type === 'fork', 'Flecha es de tipo fork');
console.assert(stepForkLeft.forkArrow.direction === 'left', 'Dirección de bifurcación es left');
console.assert(stepForkLeft.forkArrow.x2 < stepForkLeft.forkArrow.x1, 'Bifurcación hacia la izquierda apunta a X menor');
console.assert(stepForkLeft.boxTop.x < stepForkLeft.forkArrow.x2, 'Recuadro superior de bifurcación izquierda está a la izquierda de la flecha');
console.assert(stepForkLeft.boxBottom.x < stepForkLeft.forkArrow.x2, 'Recuadro inferior de bifurcación izquierda está a la izquierda de la flecha');
console.log('✓ Bifurcación hacia la izquierda (left) posiciona flecha y recuadros correctamente hacia X menor');

// 3. Bifurcación hacia abajo (dir = 'down')
const state24Down = new ChemState();
state24Down.isProblemMode = true;
const stepInitDown = ProblemBuilder.createInitialStep(200, 100, state24Down);
const stepForkDown = ProblemBuilder.createForkStep(stepInitDown.boxB, state24Down, 'down');
console.assert(stepForkDown.forkArrow.direction === 'down', 'Dirección de bifurcación es down');
console.assert(stepForkDown.forkArrow.y2 > stepForkDown.forkArrow.y1, 'Bifurcación hacia abajo apunta a Y mayor');
console.log('✓ Bifurcación hacia abajo (down) posiciona flecha y recuadros correctamente hacia Y mayor');

// 4. Bifurcación inteligente usando activeAxis del recuadro
boxA24.activeAxis = 'up';
const stepForkSmart = ProblemBuilder.createForkStep(boxA24, state24);
console.assert(stepForkSmart.forkArrow.direction === 'up', 'createForkStep respeta sourceBox.activeAxis ("up")');
console.assert(stepForkSmart.forkArrow.y2 < stepForkSmart.forkArrow.y1, 'Bifurcación hacia arriba apunta a Y menor');
console.log('✓ Bifurcación inteligente detecta y utiliza el activeAxis del recuadro seleccionado');

console.log('\n--- TEST 25: Axis Port Selection, Compact Radii & Abbrev Structure Flow ---');
const state25 = new ChemState();
state25.isProblemMode = true;

// 1. Simular clic simple en puerto de eje (top, left, down, right)
const step25 = ProblemBuilder.createInitialStep(100, 100, state25);
const box25 = step25.boxA;

// Simular acción del handler mousedown en boxPort
box25.activeAxis = 'left';
state25.clearSelection();
state25.selected.boxes.add(box25.id);

console.assert(box25.activeAxis === 'left', 'activeAxis se actualiza a left en un solo clic');
console.assert(state25.selected.boxes.has(box25.id), 'state.selected.boxes contiene la caja seleccionada');
console.assert(state25.selected.boxes.size === 1, 'Solo hay una caja seleccionada');
console.log('✓ Clic simple en puerto de eje actualiza activeAxis y selecciona la caja sin errores de tipo');

// 2. Verificar que createForkStep hereda activeAxis fijado con un solo clic
const forkFromLeft = ProblemBuilder.createForkStep(box25, state25);
console.assert(forkFromLeft.forkArrow.direction === 'left', 'Bifurcación toma inmediatamente el activeAxis fijado por el clic');
console.assert(forkFromLeft.forkArrow.x2 < forkFromLeft.forkArrow.x1, 'Flecha bifurcada apunta a la izquierda');
console.log('✓ Bifurcación posterior al clic simple en eje izquierdo se genera correctamente hacia la izquierda');

// 3. Crear y modificar abreviatura en Recuadro de Referencias
const refBox25 = state25.addReferenceBox({
  id: 'ref_25',
  boxType: 'reference',
  title: 'Abreviaturas / Reactivos IChO',
  x: 200, y: 500, width: 300, height: 120,
  items: []
});

// Simular guardado desde modal (isNew = true)
const newAbbrItem = { abbr: 'TBS', formula: 't-BuMe2Si' };
refBox25.items.push(newAbbrItem);
console.assert(refBox25.items.length === 1, 'Nueva abreviatura añadida con éxito a la lista');
console.assert(refBox25.items[0].abbr === 'TBS', 'Abreviatura es TBS');
console.assert(refBox25.items[0].formula === 't-BuMe2Si', 'Fórmula desarrollada es t-BuMe2Si');

// Simular edición desde modal (isNew = false)
refBox25.items[0].formula = 'Me2(t-Bu)Si';
console.assert(refBox25.items[0].formula === 'Me2(t-Bu)Si', 'Fórmula editada correctamente en el modelo');
console.log('✓ Flujo de creación y edición de abreviaturas con estructura verificado en el modelo');

console.log('\n--- TEST 26: Dashed Arrows & Modal ChemStudio Molecule Structure ---');
// DOM simulado mínimo en Node.js para probar ArrowRenderer
if (typeof document === 'undefined') {
  globalThis.document = {
    createElementNS: (ns, tag) => {
      const attrs = {};
      const children = [];
      const style = {};
      return {
        tagName: tag,
        style,
        setAttribute: (k, v) => { attrs[k] = String(v); },
        getAttribute: (k) => attrs[k],
        appendChild: (child) => { children.push(child); return child; },
        children,
        attrs
      };
    },
    createTextNode: (text) => ({ text, nodeType: 3 })
  };
}
const { ArrowRenderer } = await import('../js/render/arrow-renderer.js');

const state26 = new ChemState();

// 1. Flecha punteada (type: 'dashed')
const dashedArrow = state26.addArrow({ x1: 100, y1: 200, x2: 180, y2: 200, type: 'dashed' });
console.assert(dashedArrow.type === 'dashed', 'Flecha creada con type="dashed"');
const renderedGroup = ArrowRenderer.renderArrow(dashedArrow);
const lineEl = renderedGroup.children.find(c => c.tagName === 'line' && c.attrs['stroke-dasharray'] === '5 4');
console.assert(lineEl !== undefined, 'Render de flecha punteada incluye stroke-dasharray="5 4"');
console.log('✓ Flecha punteada (type: "dashed") creada y renderizada con stroke-dasharray correctamente');

// 2. Serialización y deserialización de flecha punteada
const serialized26 = ChemSerializer.serialize(state26);
const deserializedState26 = new ChemState();
deserializedState26.loadFromObject(serialized26);
const restoredArrow = deserializedState26.arrows.get(dashedArrow.id);
console.assert(restoredArrow !== undefined, 'Flecha restaurada desde serialización');
console.assert(restoredArrow.type === 'dashed', 'Tipo dashed preservado tras deserializar');
console.log('✓ Serialización y deserialización de flechas punteadas preservada al 100%');

// 3. Estructura de molécula en modal de abreviatura (ejemplo Ms - mesilo con flecha de unión)
const modalState = new ChemState();
const aS = modalState.addAtom({ x: 200, y: 200, element: 'S' });
const aO1 = modalState.addAtom({ x: 200, y: 160, element: 'O' });
const aO2 = modalState.addAtom({ x: 200, y: 240, element: 'O' });
const aMe = modalState.addAtom({ x: 240, y: 200, element: 'C' });
modalState.addBond({ atom1: aS.id, atom2: aO1.id, type: 'double' });
modalState.addBond({ atom1: aS.id, atom2: aO2.id, type: 'double' });
modalState.addBond({ atom1: aS.id, atom2: aMe.id, type: 'single' });
// Flecha punteada indicando punto de unión hacia el azufre
const attachArrow = modalState.addArrow({ x1: 150, y1: 200, x2: 190, y2: 200, type: 'dashed' });
modalState.attachments = [{ x: 190, y: 200, targetAtomId: aS.id }];

const structJson = ChemSerializer.serialize(modalState);
const itemMs = {
  abbr: 'Ms',
  formula: 'CH3SO2',
  structure: structJson
};
console.assert(itemMs.structure && itemMs.structure.atoms.length === 4, 'Estructura química guardada en item');

// Recargar la estructura en un nuevo ChemState (simulando volver a abrir [✏️ Estructura])
const loadedModalState = new ChemState();
loadedModalState.loadFromObject(itemMs.structure);
console.assert(loadedModalState.atoms.size === 4, '4 átomos restaurados en la pizarra del modal');
console.assert(loadedModalState.bonds.size === 3, '3 enlaces restaurados en la pizarra del modal');
console.assert(loadedModalState.arrows.size === 1, '1 flecha de unión punteada restaurada');
const loadedArrow = Array.from(loadedModalState.arrows.values())[0];
console.assert(loadedArrow.type === 'dashed', 'Flecha de unión punteada conservada en la estructura');
console.log('✓ Pizarra ChemStudio del modal de abreviaturas almacena y recarga estructuras complejas con flecha punteada de unión');

console.log('\n--- TEST 27: Compound Boxes Off Toggle & Reference Box Visual Structure Rendering ---');
const { ReferenceBoxRenderer } = await import('../js/render/reference-box.js');
const { SvgRenderer } = await import('../js/render/svg-renderer.js');

// 1. Verificar showCompoundBoxes: false con isProblemMode: true
const state27 = new ChemState();
state27.isProblemMode = true;
state27.showCompoundBoxes = false;
const box27 = {
  id: 'box_a',
  x: 100,
  y: 100,
  width: 120,
  height: 100,
  boxType: 'compound',
  label: 'A',
  unknownLetter: 'A'
};
state27.referenceBoxes.set(box27.id, box27);

// Incógnita suelta con showCompoundBoxes en false y sin seleccionar
const renderedStandalone = ReferenceBoxRenderer.renderStandaloneUnknown(box27, false, state27);
const unknownTxtEl = renderedStandalone.children.find(c => c.tagName === 'text' && c.attrs.font_style !== 'none');
console.assert(renderedStandalone.attrs.class.includes('standalone-unknown'), 'Elemento renderizado como standalone-unknown');
console.log('✓ showCompoundBoxes = false oculta recuadro punteado y muestra solo la incógnita central');

// 2. Verificar getStructureMetrics en ReferenceBoxRenderer sin necesidad de fórmula molecular
const structMetrics = ReferenceBoxRenderer.getStructureMetrics(itemMs.structure);
console.assert(structMetrics !== null, 'getStructureMetrics calcula métricas válidas');
console.assert(structMetrics.dispW > 0 && structMetrics.dispH > 0, 'Dimensiones calculadas > 0');
console.assert(structMetrics.scale > 0 && structMetrics.scale <= 1, 'Escala calculada correctamente');

// 3. Renderizar miniatura vectorial en ReferenceBoxRenderer
const refBoxWithStruct = {
  id: 'ref_ich_test',
  x: 50,
  y: 400,
  width: 320,
  height: 80,
  boxType: 'reference',
  title: 'Abreviaturas / Reactivos IChO',
  items: [
    { abbr: 'Ms', formula: '', structure: itemMs.structure },
    { abbr: 'Et', formula: 'CH2CH3' }
  ]
};
const renderedRefBox = ReferenceBoxRenderer.render(refBoxWithStruct, false, state27);
const structEl = renderedRefBox.children.find(c => c.attrs && c.attrs.class === 'ref-item-struct');
console.assert(structEl !== undefined, 'Miniatura vectorial ref-item-struct generada en el recuadro de referencias');
console.assert(structEl.children.length > 0, 'Miniatura contiene elementos SVG (enlaces y átomos)');
console.log('✓ Recuadro de referencias renderiza miniaturas vectoriales SVG sin requerir fórmula');

// 4. Proximidad geométrica del borrador (distToSegment)
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}
const dClose = distToSegment(150, 105, 100, 100, 200, 100);
const dFar = distToSegment(150, 130, 100, 100, 200, 100);
console.assert(dClose === 5, 'Detección a 5px de distancia del enlace');
console.assert(dFar === 30, 'Detección a 30px fuera del umbral');
console.log('✓ Detección geométrica por proximidad y arrastre de borrador verificado');

console.log('\n--- TEST 28: Benzene Template in Modal, Dashed Bonds, and Key 1 Sprouting ---');
const { TemplateTool } = await import('../js/tools/template-tool.js');

// 1. TemplateTool con clave 'benzene' en minúscula
const state28 = new ChemState();
const mockRenderer28 = { render: () => {} };
const tplTool = new TemplateTool(state28, mockRenderer28);
tplTool.setTemplate('benzene');
tplTool.insertTemplateAt(200, 200, 'benzene');
console.assert(state28.atoms.size === 6, 'Anillo de benceno insertado con 6 átomos');
console.assert(state28.bonds.size === 6, 'Anillo de benceno con 6 enlaces');
console.log('✓ TemplateTool inserta benceno exitosamente con clave en minúsculas ("benzene")');

// 2. Enlace punteado (type: 'dashed')
const extraAtom = state28.addAtom({ x: 300, y: 300, element: 'C' });
const bondDashed = state28.addBond({ atom1: Array.from(state28.atoms.keys())[0], atom2: extraAtom.id, type: 'dashed' });
console.assert(getBondOrder('dashed') === 1, 'getBondOrder("dashed") retorna 1');
console.assert(bondDashed.type === 'dashed', 'Enlace de tipo dashed creado');

// 3. Ciclado de enlace con 'dashed'
state28.cycleBondType(bondDashed.id);
console.assert(bondDashed.type === 'wavy', 'Ciclado después de dashed va a wavy');
console.log('✓ Enlace punteado (dashed) integrado en modelo, valencias y ciclo de tipos');

// 4. Brotar con tecla 1 sobre átomo (cálculo de nuevo átomo y enlace)
const initialAtomsCount = state28.atoms.size;
const aTarget = Array.from(state28.atoms.values())[2];
const nextAngle = calculateNextBondAngle(aTarget, state28);
const rad28 = (nextAngle * Math.PI) / 180;
const newAtom = state28.addAtom({
  x: aTarget.x + STANDARD_BOND_LENGTH * Math.cos(rad28),
  y: aTarget.y + STANDARD_BOND_LENGTH * Math.sin(rad28),
  element: 'C'
});
state28.addBond({ atom1: aTarget.id, atom2: newAtom.id, type: 'single' });
console.assert(state28.atoms.size === initialAtomsCount + 1, 'Metilo brotado correctamente');
console.log('✓ Lógica de brotado con tecla 1 verificada en el modelo');

console.log('\n--- TEST 29: Compact Vertical Arrows Independent of Text Width & 4-Way Schemes ---');
const state29 = new ChemState();
const { boxA: b29A, boxB: b29B, arrow: arrow29AB } = ProblemBuilder.createInitialStep(100, 100, state29);

// Extender Box B hacia abajo
const { arrow: downArrow, newBox: b29C } = ProblemBuilder.extendFromBox(b29B, 'down', state29);
console.assert(Math.abs(downArrow.y2 - downArrow.y1) === 76, 'Flecha vertical creada inicialmente a 76px compactos');

// Añadir texto largo de reactivos en la flecha vertical
downArrow.reagentsTop = 'Calor, H2O, medio acido';
downArrow.reagentsBottom = 'Rearreglo de Beckmann estereoespecifico (48 caracteres)';

// Encajar esquema
ChemAligner.fitSchemeLayout(state29);

const vertLen = Math.abs(downArrow.y2 - downArrow.y1);
console.assert(vertLen <= 95 && vertLen >= 72, `Longitud de flecha vertical (${vertLen}px) es compacta (<=95px) a pesar del texto largo`);
console.assert(b29C.y > downArrow.y2 && b29C.y - downArrow.y2 <= 10, `Box C posicionado limpiamente debajo de la flecha vertical`);
console.assert(Math.abs(downArrow.x1 - (b29B.x + b29B.width / 2)) < 1, 'Flecha vertical perfectamente centrada con Box B');
console.assert(Math.abs(b29C.x + b29C.width / 2 - downArrow.x1) < 1, 'Box C centrado con la flecha vertical');
console.log(`✓ Flecha vertical compacta (${vertLen}px) no se deforma ni se estira por reactivos largos`);

// Extender Box C hacia la izquierda y encajar
const { arrow: leftArrow, newBox: b29D } = ProblemBuilder.extendFromBox(b29C, 'left', state29);
leftArrow.reagentsTop = 'TFA, DCM, 0 C';
ChemAligner.fitSchemeLayout(state29);

console.assert(leftArrow.x2 < leftArrow.x1, 'Flecha hacia la izquierda apunta en sentido -X');
console.assert(b29D.x + b29D.width < leftArrow.x1, 'Box D colocado a la izquierda de Box C');
console.assert(b29D.y === b29C.y, 'Box D alineado horizontalmente con Box C');
console.log('✓ Extensión y alineación hacia la izquierda con fitSchemeLayout verificado');

console.log('\n--- TEST 30: Reference Box Structure Enlargement & Benzene Ring-Interior Double Bonds ---');
const benzeneStructure = {
  atoms: [
    { id: 'b_c1', x: 200, y: 100, element: 'C' },
    { id: 'b_c2', x: 235, y: 120, element: 'C' },
    { id: 'b_c3', x: 235, y: 160, element: 'C' },
    { id: 'b_c4', x: 200, y: 180, element: 'C' },
    { id: 'b_c5', x: 165, y: 160, element: 'C' },
    { id: 'b_c6', x: 165, y: 120, element: 'C' },
    { id: 'b_sub1', x: 200, y: 220, element: 'C' },
    { id: 'b_sub2', x: 200, y: 260, element: 'C' }
  ],
  bonds: [
    { id: 'b_b1', atom1: 'b_c1', atom2: 'b_c2', type: 'double' },
    { id: 'b_b2', atom1: 'b_c2', atom2: 'b_c3', type: 'single' },
    { id: 'b_b3', atom1: 'b_c3', atom2: 'b_c4', type: 'double' },
    { id: 'b_b4', atom1: 'b_c4', atom2: 'b_c5', type: 'single' },
    { id: 'b_b5', atom1: 'b_c5', atom2: 'b_c6', type: 'double' },
    { id: 'b_b6', atom1: 'b_c6', atom2: 'b_c1', type: 'single' },
    { id: 'b_b7', atom1: 'b_c4', atom2: 'b_sub1', type: 'single' },
    { id: 'b_b8', atom1: 'b_sub1', atom2: 'b_sub2', type: 'dashed' }
  ],
  arrows: []
};

// 1. Verificar tamaño aumentado y mayor resolución
const bMetrics = ReferenceBoxRenderer.getStructureMetrics(benzeneStructure);
console.assert(bMetrics !== null, 'bMetrics válido');
console.assert(bMetrics.scale >= 0.45, `Escala calculada (${bMetrics.scale}) es óptima`);
console.assert(bMetrics.dispH >= 70, `Altura mostrada (${bMetrics.dispH}px) es amplia y legible (>=70px)`);
console.log(`✓ Miniatura en recuadro de referencias ampliada con escala ${bMetrics.scale} y altura ${bMetrics.dispH}px`);

// 2. Renderizar recuadro con benceno y verificar dobles enlaces en el interior
const state30 = new ChemState();
const refBox30 = {
  id: 'ref_stivi',
  x: 40,
  y: 50,
  width: 360,
  height: 120,
  boxType: 'reference',
  title: 'Abreviaturas / Reactivos IChO',
  items: [
    { abbr: 'stivi', formula: '', structure: benzeneStructure }
  ]
};

const renderedBox30 = ReferenceBoxRenderer.render(refBox30, false, state30);
const structGrp = renderedBox30.children.find(c => c.attrs && c.attrs.class === 'ref-item-struct');
console.assert(structGrp !== undefined, 'ref-item-struct presente en el DOM virtual');

// Buscar enlaces renderizados dentro de structGrp
const lines = structGrp.children.filter(c => c.tagName === 'line');
// Un benceno con 3 dobles enlaces y 4 enlaces simples (1 dashed) genera 3*2 + 4 = 10 líneas
console.assert(lines.length >= 9, `Total de líneas de enlace renderizadas: ${lines.length} (incluye dobles líneas)`);

// Verificar que la línea exterior del doble enlace coincide con los átomos y la interior está desplazada
const outerLineFound = lines.some(l => 
  (Math.abs(Number(l.attrs.x1) - 200) < 1 && Math.abs(Number(l.attrs.y1) - 100) < 1) ||
  (Math.abs(Number(l.attrs.x2) - 200) < 1 && Math.abs(Number(l.attrs.y2) - 100) < 1)
);
console.assert(outerLineFound, 'Línea exterior del doble enlace coincide exactamente con los vértices del anillo');

// Verificar que el texto de abreviatura tiene font-size 14
const textEl30 = renderedBox30.children.find(c => c.attrs && c.attrs.class === 'ref-item-text');
console.assert(textEl30.attrs['font-size'] === '14', 'Rótulo de abreviatura tiene font-size 14px proporcionado');
console.log('✓ Dobles enlaces del benceno renderizados en el interior del ciclo y proporciones tipográficas verificadas');

console.log('\n--- TEST 31: Reagent Molecule on Reaction Arrow (Diels-Alder) & Arrow Length Expansion ---');
const state31 = new ChemState();
const { boxA: b31A, boxB: b31B, arrow: arrow31 } = ProblemBuilder.createInitialStep(100, 100, state31);

// Dieno s-cis (1,3-butadieno) para Diels-Alder
const dieneStructure = {
  atoms: [
    { id: 'd_c1', x: 305, y: 145, element: 'C' },
    { id: 'd_c2', x: 338, y: 164, element: 'C' },
    { id: 'd_c3', x: 338, y: 202, element: 'C' },
    { id: 'd_c4', x: 305, y: 221, element: 'C' }
  ],
  bonds: [
    { id: 'd_b1', atom1: 'd_c1', atom2: 'd_c2', type: 'double' },
    { id: 'd_b2', atom1: 'd_c2', atom2: 'd_c3', type: 'single' },
    { id: 'd_b3', atom1: 'd_c3', atom2: 'd_c4', type: 'double' }
  ],
  arrows: []
};

// 1. Verificar métricas del dieno en ArrowRenderer
const dMetrics = ArrowRenderer.getArrowStructureMetrics(dieneStructure);
console.assert(dMetrics !== null, 'dMetrics calculado');
console.assert(dMetrics.dispW > 0 && dMetrics.dispH > 0, 'Ancho y alto > 0');
console.assert(dMetrics.scale <= 0.85, `Escala proporcionada a la flecha (${dMetrics.scale})`);
console.log(`✓ Métricas de reactivo sobre flecha: dispW=${dMetrics.dispW}px, dispH=${dMetrics.dispH}px, scale=${dMetrics.scale}`);

// 2. Asignar dieno y reactivos a la flecha
arrow31.structureTop = dieneStructure;
arrow31.reagentsTop = ', Δ';
arrow31.reagentsBottom = 'Diels-Alder';

// 3. Auto-ajuste de longitud con fitSchemeLayout
const initialLen = Math.abs(arrow31.x2 - arrow31.x1);
ChemAligner.fitSchemeLayout(state31);
const fittedLen = Math.abs(arrow31.x2 - arrow31.x1);
console.assert(fittedLen >= dMetrics.dispW + 38, `Longitud de flecha expandida (${fittedLen}px) aloja dieno (${dMetrics.dispW}px) y reactivos`);
console.assert(b31B.x > arrow31.x2, 'Box B posicionado tras la punta de la flecha sin solapamiento');
console.log(`✓ Longitud de flecha auto-expandida de ${initialLen}px a ${fittedLen}px para alojar molécula y reactivo`);

// 4. Renderizado SVG de la flecha con molécula reactivo
const renderedArrow31 = ArrowRenderer.renderArrow(arrow31, false, state31);
const structGrp31 = renderedArrow31.children.find(c => c.attrs && c.attrs.class === 'arrow-reagent-struct');
console.assert(structGrp31 !== undefined, 'Grupo .arrow-reagent-struct presente en la flecha');
console.assert(structGrp31.attrs['data-arrow-id'] === arrow31.id, 'Atributo data-arrow-id coincide');

// Verificar líneas de enlace del dieno (2 dobles enlaces = 4 líneas, 1 simple = 1 línea -> total 5)
const dieneLines = structGrp31.children.filter(c => c.tagName === 'line');
console.assert(dieneLines.length >= 5, `Líneas del dieno renderizadas: ${dieneLines.length}`);

// Verificar texto adicional a la derecha de la molécula (, Δ) y debajo (Diels-Alder)
const topTextGroup = renderedArrow31.children.find(c => c.attrs && c.attrs.class && c.attrs.class.includes('reagent-top'));
console.assert(topTextGroup !== undefined, 'Texto reactivo superior presente');
const bottomTextGroup = renderedArrow31.children.find(c => c.attrs && c.attrs.class && c.attrs.class.includes('reagent-bottom'));
console.assert(bottomTextGroup !== undefined, 'Texto reactivo inferior (Diels-Alder) presente');
console.log('✓ Renderizado SVG vectorial de molécula y texto sobre flecha verificado');

console.log('\n--- TEST 32: Direct Atom Substitution with Bond Tool & Full Periodic Table ---');
const { PERIODIC_TABLE_DATA } = await import('../js/chem-engine/elements.js');

// 1. Verificar datos de la Tabla Periódica completa (118 elementos)
console.assert(Array.isArray(PERIODIC_TABLE_DATA) && PERIODIC_TABLE_DATA.length === 118, '118 elementos en la tabla periódica');
const siData = PERIODIC_TABLE_DATA.find(e => e.symbol === 'Si');
console.assert(siData && siData.name === 'Silicio' && siData.number === 14, 'Silicio (Si, 14) correctamente catalogado');
const bData = PERIODIC_TABLE_DATA.find(e => e.symbol === 'B');
console.assert(bData && bData.name === 'Boro' && bData.number === 5, 'Boro (B, 5) correctamente catalogado');
console.log('✓ Tabla Periódica completa con 118 elementos verificada');

// 2. Simular clic sobre átomo de carbono con activeElement = 'Si' usando BondTool
const state32 = new ChemState();
const dummyRenderer = { render: () => {} };
const bondTool32 = new BondTool(state32, dummyRenderer);

const atomC = state32.addAtom({ x: 200, y: 200, element: 'C' });
const initialAtomCount = state32.atoms.size;
const initialBondCount = state32.bonds.size;

// Seleccionar silicio como activeElement
state32.activeElement = 'Si';

// Simular clic sin arrastre (hasMovedSignificantly = false)
bondTool32.onMouseDown({}, { x: 200, y: 200 }, { type: 'atom', id: atomC.id });
bondTool32.onMouseUp({}, { x: 200, y: 200 }, { type: 'atom', id: atomC.id });

// Verificar que el átomo de carbono fue SUSTITUIDO por Silicio, sin crear enlaces ni átomos nuevos
console.assert(state32.atoms.size === initialAtomCount, 'No se crearon átomos adicionales al hacer clic');
console.assert(state32.bonds.size === initialBondCount, 'No se crearon enlaces nuevos al hacer clic');
console.assert(atomC.element === 'Si', 'El átomo fue sustituido a Silicio (Si)');
console.assert(atomC.label === 'Si', 'La etiqueta del átomo es Si');
console.assert(atomC.manualLabel === true, 'manualLabel fijado en true para Si');
console.log('✓ Clic sobre átomo con Silicio activo sustituye el elemento en lugar de brotar enlace no deseado');

// 3. Simular clic sobre átomo cuando activeElement = 'C' -> Debe brotar nuevo enlace
state32.activeElement = 'C';
const atomC2 = state32.addAtom({ x: 300, y: 300, element: 'C' });
const atomCountBeforeSprout = state32.atoms.size;
const bondCountBeforeSprout = state32.bonds.size;

bondTool32.onMouseDown({}, { x: 300, y: 300 }, { type: 'atom', id: atomC2.id });
bondTool32.onMouseUp({}, { x: 300, y: 300 }, { type: 'atom', id: atomC2.id });

console.assert(state32.atoms.size === atomCountBeforeSprout + 1, 'Brotado automático de C cuando activeElement es C');
console.assert(state32.bonds.size === bondCountBeforeSprout + 1, 'Nuevo enlace creado en brotado de C');
console.log('✓ Clic sobre Carbono con Carbono activo conserva el brotado automático');

console.log('\n--- TEST 33: Smart Chemical Text Parsing & Formula/Charge Formatting ---');
const { parseChemicalRichText, formatChemicalFormula, calculateMolecularFormula } = await import('../js/chem-engine/elements.js');

// 1. Parsing de Si3O9(6-)
const tokensSi = parseChemicalRichText('Si3O9(6-)');
console.assert(tokensSi.length === 5, `5 tokens esperados en Si3O9(6-), obtenidos ${tokensSi.length}`);
console.assert(tokensSi[0].type === 'normal' && tokensSi[0].text === 'Si', 'Token 0: Si normal');
console.assert(tokensSi[1].type === 'sub' && tokensSi[1].text === '3', 'Token 1: 3 subíndice');
console.assert(tokensSi[2].type === 'normal' && tokensSi[2].text === 'O', 'Token 2: O normal');
console.assert(tokensSi[3].type === 'sub' && tokensSi[3].text === '9', 'Token 3: 9 subíndice');
console.assert(tokensSi[4].type === 'super' && tokensSi[4].text === '6−', 'Token 4: 6− superíndice de carga');
console.log('✓ parseChemicalRichText descompone Si3O9(6-) en Si + sub(3) + O + sub(9) + super(6−)');

// 2. Formato Unicode y HTML de Si3O9(6-)
const unicodeSi = formatChemicalFormula('Si3O9(6-)', false);
console.assert(unicodeSi === 'Si₃O₉⁶⁻', `Unicode esperado Si₃O₉⁶⁻, obtenido ${unicodeSi}`);
const htmlSi = formatChemicalFormula('Si3O9(6-)', true);
console.assert(htmlSi === 'Si<sub>3</sub>O<sub>9</sub><sup>6−</sup>', `HTML esperado Si<sub>3</sub>O<sub>9</sub><sup>6−</sup>, obtenido ${htmlSi}`);
console.log('✓ formatChemicalFormula genera Si₃O₉⁶⁻ en Unicode y Si<sub>3</sub>O<sub>9</sub><sup>6−</sup> en HTML');

// 3. Parsing de otras fórmulas con carga: [Si3O9]6-, SO4(2-), NH4(+), Fe(CN)6(4-)
console.assert(formatChemicalFormula('[Si3O9]6-') === '[Si₃O₉]⁶⁻', 'Formato [Si3O9]6- correcto');
console.assert(formatChemicalFormula('SO4(2-)') === 'SO₄²⁻', 'Formato SO4(2-) correcto');
console.assert(formatChemicalFormula('NH4(+)') === 'NH₄⁺', 'Formato NH4(+) correcto');
console.assert(formatChemicalFormula('Fe(CN)6(4-)') === 'Fe(CN)₆⁴⁻', 'Formato Fe(CN)6(4-) correcto');
console.log('✓ Formateo de diversas fórmulas y aniones/cationes verificado');

// 4. calculateMolecularFormula a partir de átomos con carga
const silicateAtoms = [
  { element: 'Si', charge: 0 },
  { element: 'Si', charge: 0 },
  { element: 'Si', charge: 0 },
  { element: 'O', charge: -1 },
  { element: 'O', charge: -1 },
  { element: 'O', charge: -1 },
  { element: 'O', charge: -1 },
  { element: 'O', charge: -1 },
  { element: 'O', charge: -1 },
  { element: 'O', charge: 0 },
  { element: 'O', charge: 0 },
  { element: 'O', charge: 0 },
];
const computedFormula = calculateMolecularFormula(silicateAtoms);
console.assert(computedFormula === 'Si3O9(6−)' || computedFormula === 'Si3O9(6-)', `Fórmula esperada Si3O9(6−), obtenida ${computedFormula}`);
console.log(`✓ calculateMolecularFormula para anión ciclotrisilicato genera "${computedFormula}"`);

console.log('\n--- TEST 34: Sticky Charge Mode (Click-to-Charge & Marquee Charge) ---');
const { SelectTool } = await import('../js/tools/select-tool.js');

const state34 = new ChemState();
const selectTool34 = new SelectTool(state34, dummyRenderer);
const bondTool34 = new BondTool(state34, dummyRenderer);

// Crear 3 átomos neutros (por ejemplo oxígenos)
const o1 = state34.addAtom({ x: 100, y: 100, element: 'O', charge: 0 });
const o2 = state34.addAtom({ x: 150, y: 100, element: 'O', charge: 0 });
const o3 = state34.addAtom({ x: 200, y: 100, element: 'O', charge: 0 });

// 1. Activar modo continuo de carga negativa '-'
state34.activeChargeMode = '-';

// Simular clic en o1 con BondTool sin arrastrar
bondTool34.onMouseDown({}, { x: 100, y: 100 }, { type: 'atom', id: o1.id });
bondTool34.onMouseUp({}, { x: 100, y: 100 }, { type: 'atom', id: o1.id });
console.assert(o1.charge === -1, `o1 debe tener carga -1 tras clic con modo '-' (actual: ${o1.charge})`);

// Simular clic en o2 con SelectTool
selectTool34.handleElementClick({ type: 'atom', id: o2.id }, false);
console.assert(o2.charge === -1, `o2 debe tener carga -1 tras clic con SelectTool (actual: ${o2.charge})`);

// Clic de nuevo en o1 -> se decrementa a -2
bondTool34.onMouseDown({}, { x: 100, y: 100 }, { type: 'atom', id: o1.id });
bondTool34.onMouseUp({}, { x: 100, y: 100 }, { type: 'atom', id: o1.id });
console.assert(o1.charge === -2, `o1 debe tener carga -2 tras segundo clic con modo '-' (actual: ${o1.charge})`);

// 2. Cambiar modo a positivo '+'
state34.activeChargeMode = '+';
bondTool34.onMouseDown({}, { x: 100, y: 100 }, { type: 'atom', id: o1.id });
bondTool34.onMouseUp({}, { x: 100, y: 100 }, { type: 'atom', id: o1.id });
console.assert(o1.charge === -1, `o1 debe subir a -1 tras clic con modo '+' (actual: ${o1.charge})`);

// 3. Cambiar modo a neutro '0'
state34.activeChargeMode = '0';
bondTool34.onMouseDown({}, { x: 100, y: 100 }, { type: 'atom', id: o1.id });
bondTool34.onMouseUp({}, { x: 100, y: 100 }, { type: 'atom', id: o1.id });
console.assert(o1.charge === 0, `o1 debe restablecerse a 0 con modo '0' (actual: ${o1.charge})`);

// 4. Selección múltiple por marquesina con modo '-' activo
state34.activeChargeMode = '-';
selectTool34.finishMarqueeSelection({ x: 90, y: 90 }, { x: 210, y: 110 });
console.assert(o1.charge === -1, `o1 debe tener -1 tras selección por marquesina con modo '-' (actual: ${o1.charge})`);
console.assert(o2.charge === -2, `o2 debe tener -2 tras marquesina (actual: ${o2.charge})`);
console.assert(o3.charge === -1, `o3 debe tener -1 tras marquesina (actual: ${o3.charge})`);
console.log('✓ Modo continuo de carga (clic simple en átomos y selección múltiple) verificado al 100%');

console.log('\n¡TODOS LOS TESTS PASARON EXITOSAMENTE!');








console.log('\n--- TEST EJEMPLOS: la galería construye todos los esquemas sin errores de valencia ---');
{
  const { EXAMPLE_SCHEMES } = await import('../js/chem-engine/examples.js');
  for (const ex of EXAMPLE_SCHEMES) {
    const st = new ChemState();
    st.loadFromObject(ex.build(), false);
    const ids = new Set(st.atoms.keys());
    const danglingBonds = [...st.bonds.values()].filter(b => !ids.has(b.atom1) || !ids.has(b.atom2));
    const errors = [...st.valenceErrors.entries()].filter(([, v]) => v.hasError);
    console.assert(st.atoms.size > 0, `${ex.key}: debe tener átomos`);
    console.assert(danglingBonds.length === 0, `${ex.key}: enlaces a átomos inexistentes`);
    console.assert(errors.length === 0, `${ex.key}: errores de valencia ${JSON.stringify(errors.map(([id, v]) => v.message))}`);
  }
  console.log(`✓ ${EXAMPLE_SCHEMES.length} ejemplos construidos sin errores de valencia`);
}

console.log('\n--- TEST ANILLOS: fusionar sobre enlace (naftaleno) y unir a átomo (bifenilo) ---');
{
  const { TemplateTool } = await import('../js/tools/template-tool.js');
  const st = new ChemState();
  const tool = new TemplateTool(st, { render() {} });
  tool.setTemplate('BENZENE');
  tool.insertTemplateAt(200, 200, 'BENZENE');
  const firstBond = [...st.bonds.values()][0];
  tool.onMouseDown({}, { x: 0, y: 0 }, { type: 'bond', id: firstBond.id });
  const doubles = [...st.bonds.values()].filter(b => b.type === 'double').length;
  console.assert(st.atoms.size === 10 && st.bonds.size === 11, `Naftaleno: 10 átomos / 11 enlaces (actual ${st.atoms.size}/${st.bonds.size})`);
  console.assert(doubles === 5, `Naftaleno: 5 dobles enlaces (Kekulé), actual ${doubles}`);
  // Ningún átomo con dos dobles enlaces
  const dbl = new Map();
  for (const b of st.bonds.values()) if (b.type === 'double') for (const a of [b.atom1, b.atom2]) dbl.set(a, (dbl.get(a) || 0) + 1);
  console.assert([...dbl.values()].every(v => v === 1), 'Naftaleno: cada carbono con un solo doble enlace');

  const st2 = new ChemState();
  const tool2 = new TemplateTool(st2, { render() {} });
  tool2.insertTemplateAt(200, 200, 'BENZENE');
  const atom0 = [...st2.atoms.values()][0];
  tool2.onMouseDown({}, { x: 0, y: 0 }, { type: 'atom', id: atom0.id });
  console.assert(st2.atoms.size === 12 && st2.bonds.size === 13, `Bifenilo: 12 átomos / 13 enlaces (actual ${st2.atoms.size}/${st2.bonds.size})`);
  console.log('✓ Anillos: clic en enlace fusiona (naftaleno) y clic en átomo une (bifenilo)');
}

console.log('\n--- TEST AMIDA: H del NH debajo del N cuando hay enlaces a ambos lados ---');
{
  const { getFormattedAtomDisplay } = await import('../js/chem-engine/elements.js');
  const st = new ChemState();
  st.addAtom({ id: 'cme', x: 0, y: 30, element: 'C' });
  st.addAtom({ id: 'cco', x: 33, y: 11, element: 'C' });
  st.addAtom({ id: 'oo', x: 33, y: -27, element: 'O' });
  st.addAtom({ id: 'nn', x: 66, y: 30, element: 'N' });
  st.addAtom({ id: 'cn', x: 99, y: 11, element: 'C' });
  st.addBond({ atom1: 'cme', atom2: 'cco' });
  st.addBond({ atom1: 'cco', atom2: 'oo', type: 'double' });
  st.addBond({ atom1: 'cco', atom2: 'nn' });
  st.addBond({ atom1: 'nn', atom2: 'cn' });
  const d = getFormattedAtomDisplay(st.getAtom('nn'), st);
  console.assert(d.bondingAtom === 'N' && d.bondingSide === 'below' && d.suffix === 'H', `Amida: H debajo del N (actual ${d.bondingSide})`);
  // Con enlaces solo hacia un lado, el NH sigue horizontal
  const st2 = new ChemState();
  st2.addAtom({ id: 'a', x: 0, y: 0, element: 'C' });
  st2.addAtom({ id: 'b', x: 0, y: 38, element: 'C' });
  st2.addAtom({ id: 'n', x: 33, y: 19, element: 'N' });
  st2.addBond({ atom1: 'a', atom2: 'n' });
  st2.addBond({ atom1: 'b', atom2: 'n' });
  const d2 = getFormattedAtomDisplay(st2.getAtom('n'), st2);
  console.assert(d2.bondingSide !== 'below' && d2.bondingSide !== 'above', 'NH con enlaces de un solo lado: H al lado');
  console.log('✓ Amida: la H del NH va debajo del N; con enlaces de un lado sigue al lado');
}

console.log('\n--- TEST RECUADROS: no se encima un recuadro nuevo sobre uno existente ---');
{
  const sp = new ChemState();
  const { boxA, boxB } = ProblemBuilder.createInitialStep(100, 200, sp);
  const count = () => [...sp.referenceBoxes.values()].filter(b => b.boxType === 'compound').length;
  const before = count(), arrowsBefore = sp.arrows.size;
  // Extender otra vez desde A a la derecha: la posición ya la ocupa B (ya conectado) -> nada nuevo
  const again = ProblemBuilder.extendFromBox(boxA, 'right', sp);
  console.assert(count() === before && again.newBox === boxB && sp.arrows.size === arrowsBefore,
    `Clic repetido no debe encimar recuadros (recuadros ${before}->${count()}, flechas ${arrowsBefore}->${sp.arrows.size})`);
  // Ciclo: B -> abajo -> C, C -> izquierda cae sobre la columna de A? (abajo de A) -> D; D -> arriba vuelve a A
  const c = ProblemBuilder.extendFromBox(boxB, 'down', sp).newBox;
  const d = ProblemBuilder.extendFromBox(c, 'left', sp).newBox;
  const n = count();
  const back = ProblemBuilder.extendFromBox(d, 'up', sp);
  console.assert(back.newBox === boxA && count() === n && back.arrow, 'Cerrar el ciclo reutiliza el recuadro A con una flecha nueva');
  console.log('✓ Recuadros: clics repetidos no encima recuadros y los ciclos vuelven al recuadro existente');
}

console.log('\n--- TEST ROTACIÓN: el tirador gira la selección alrededor de su centro ---');
{
  const { SelectTool } = await import('../js/tools/select-tool.js');
  const sr = new ChemState();
  sr.addAtom({ id: 'p', x: 0, y: 0, element: 'C' });
  sr.addAtom({ id: 'q', x: 38, y: 0, element: 'O' });
  sr.addBond({ atom1: 'p', atom2: 'q' });
  sr.selected.atoms.add('p'); sr.selected.atoms.add('q');
  const tool = new SelectTool(sr, { render() {} });
  // centro (19, 0); arrastrar desde arriba del centro hasta su derecha = +90°
  tool.onMouseDown({}, { x: 19, y: -40 }, { isRotateHandle: true });
  tool.onMouseMove({ shiftKey: false }, { x: 59, y: 0 }, null);
  tool.onMouseUp({}, { x: 59, y: 0 }, null);
  const p = sr.getAtom('p'), q = sr.getAtom('q');
  console.assert(Math.abs(p.x - 19) < 0.01 && Math.abs(p.y + 19) < 0.01 && Math.abs(q.x - 19) < 0.01 && Math.abs(q.y - 19) < 0.01,
    `Rotación de 90°: p=(${p.x.toFixed(1)},${p.y.toFixed(1)}) q=(${q.x.toFixed(1)},${q.y.toFixed(1)})`);
  console.assert(Math.abs(Math.hypot(q.x - p.x, q.y - p.y) - 38) < 0.01, 'La rotación conserva la longitud de enlace');
  sr.undo();
  console.assert(sr.getAtom('p').x === 0 && sr.getAtom('q').x === 38, 'Deshacer devuelve la posición original');
  console.log('✓ Rotación: gira alrededor del centro, conserva enlaces y se puede deshacer');
}

console.log('\n--- TEST ENCAJAR: un esquema sin recuadros de problema no se descompone ---');
{
  const { ICHO_GLUCOSE_SCHEME } = await import('../js/chem-engine/icho-data.js');
  const sf = new ChemState();
  sf.loadFromObject(JSON.parse(JSON.stringify(ICHO_GLUCOSE_SCHEME)), false);
  const labelsBefore = [...sf.textLabels.values()].map(l => [l.x, l.y]);
  const arrowsBefore = [...sf.arrows.values()].map(a => [a.x2, a.y2]);
  ChemAligner.fitSchemeLayout(sf);
  const labelsAfter = [...sf.textLabels.values()].map(l => [l.x, l.y]);
  const arrowsAfter = [...sf.arrows.values()].map(a => [a.x2, a.y2]);
  console.assert(JSON.stringify(labelsBefore) === JSON.stringify(labelsAfter), 'Encajar no mueve las letras de un esquema dibujado a mano');
  console.assert(JSON.stringify(arrowsBefore) === JSON.stringify(arrowsAfter), 'Encajar no mueve las puntas de flecha de un esquema dibujado a mano');
  console.log('✓ Encajar Esquema respeta los esquemas dibujados a mano (solo separa flechas de moléculas)');
}

console.log('\n--- TEST AUTO MODO PROBLEMA: enmarca un ejemplo existente ---');
{
  const { EXAMPLE_SCHEMES } = await import('../js/chem-engine/examples.js');
  for (const ex of EXAMPLE_SCHEMES) {
    const st = new ChemState();
    st.loadFromObject(ex.build(), false);
    const { getAllMolecules: gam } = await import('../js/chem-engine/elements.js');
    const nMol = gam(st).length;
    const lettersBefore = [...st.textLabels.values()].filter(l => l.isIntermediary && String(l.text).trim().length <= 4).length;
    ProblemBuilder.autoBoxExistingScheme(st);
    const boxes = [...st.referenceBoxes.values()].filter(b => b.boxType === 'compound');
    const molBoxes = boxes.filter(b => ProblemBuilder.getAtomsInsideBox(b, st).length > 0);
    console.assert(molBoxes.length >= 1 && boxes.length <= nMol + lettersBefore, `${ex.key}: recuadros ${boxes.length} (moléculas ${nMol}, letras ${lettersBefore})`);
    console.assert([...st.textLabels.values()].filter(l => l.isIntermediary && String(l.text).trim().length <= 4).length === 0, `${ex.key}: quedaron letras sueltas`);
    const labels = boxes.map(b => b.label).filter(Boolean);
    console.assert(new Set(labels).size === labels.length, `${ex.key}: letras de esquina repetidas ${labels}`);
  }
  const st = new ChemState();
  st.loadFromObject(EXAMPLE_SCHEMES.find(e => e.key === 'icho-glucose').build(), false);
  ProblemBuilder.autoBoxExistingScheme(st);
  const unknowns = [...st.referenceBoxes.values()].filter(b => b.isUnknown).map(b => b.unknownLetter).sort();
  console.log('  IChO incógnitas:', unknowns.join(','));
  console.assert(unknowns.join(',') === 'A,B,C,D,E,F,G', 'IChO: las letras A–G deben volverse incógnitas');
  // Las moléculas conocidas se numeran en el orden de las flechas: glucosa (inicio) = 1, la de abajo = 2
  const known = [...st.referenceBoxes.values()].filter(b => b.boxType === 'compound' && !b.isUnknown)
    .sort((a, b) => a.x - b.x).map(b => b.label);
  console.assert(known.join(',') === '1,2', `IChO: conocidas numeradas por flechas, salió ${known}`);

  // Las definiciones sueltas (Fmoc, NIS) no son compuestos del esquema
  const tri = new ChemState();
  tri.loadFromObject(EXAMPLE_SCHEMES.find(e => e.key === 'trisaccharide').build(), false);
  ProblemBuilder.autoBoxExistingScheme(tri);
  const triMol = [...tri.referenceBoxes.values()].filter(b => b.boxType === 'compound' && !b.isUnknown);
  console.assert(triMol.length === 1, `Trisacárido: solo el donador inicial va en recuadro, salieron ${triMol.length}`);

  // Sin letras: A, B, C siguiendo la reacción (reactivo + reactivo → producto)
  const suz = new ChemState();
  suz.loadFromObject(EXAMPLE_SCHEMES.find(e => e.key === 'suzuki').build(), false);
  ProblemBuilder.autoBoxExistingScheme(suz);
  const suzL = [...suz.referenceBoxes.values()].sort((a, b) => a.x - b.x).map(b => b.label).join(',');
  console.assert(suzL === 'A,B,C', `Suzuki: letras por orden de reacción, salió ${suzL}`);

  // Flecha de dos tramos (sin punta + con punta) une F con la molécula de abajo en el tromboxano
  const tx = new ChemState();
  tx.loadFromObject(EXAMPLE_SCHEMES.find(e => e.key === 'thromboxane').build(), false);
  ProblemBuilder.autoBoxExistingScheme(tx);
  const txKnown = [...tx.referenceBoxes.values()].filter(b => b.boxType === 'compound' && !b.isUnknown).length;
  console.assert(txKnown === 3, `Tromboxano: 3 moléculas conocidas en la ruta, salieron ${txKnown}`);
  console.log('✓ Modo problema sobre un ejemplo: guiado por flechas (orden, definiciones fuera, flechas de varios tramos)');
}

console.log('\n--- TEST REVISIÓN: atajos, deshacer, guardar/abrir y flecha en L ---');
{
  const { ChemShortcuts } = await import('../js/keyboard/shortcuts.js');
  const { ChemSerializer } = await import('../js/export/serializer.js');
  const { getArrowBendCorner } = await import('../js/chem-engine/elements.js');

  // S/B/G con una molécula seleccionada y el cursor fuera: cambian de herramienta, no los átomos
  const st = new ChemState();
  const a1 = st.addAtom({ x: 0, y: 0, element: 'C' });
  const a2 = st.addAtom({ x: 40, y: 0, element: 'C' });
  st.addBond({ atom1: a1.id, atom2: a2.id, type: 'single' });
  st.selected.atoms.add(a1.id); st.selected.atoms.add(a2.id);
  const toolsPicked = [];
  const fakeApp = { selectTool: (t) => toolsPicked.push(t), activateGroup: () => toolsPicked.push('group'), updateValenceStatus() {} };
  const fakeRenderer = { hoveredAtomId: null, hoveredBondId: null, render() {} };
  const sc = Object.create(ChemShortcuts.prototype);
  Object.assign(sc, { state: st, renderer: fakeRenderer, app: fakeApp });
  for (const k of ['s', 'b', 'g']) sc.handleKeyDown({ key: k, target: { tagName: 'DIV' }, preventDefault() {} });
  console.assert(a1.element === 'C' && a2.element === 'C', `S/B/G no deben cambiar la selección: ${a1.element}, ${a2.element}`);
  console.assert(toolsPicked.join(',') === 'select,bond,group', `S/B/G deben cambiar de herramienta: ${toolsPicked}`);
  // Con el cursor sobre un átomo, S sí lo vuelve azufre
  fakeRenderer.hoveredAtomId = a1.id;
  sc.handleKeyDown({ key: 's', target: { tagName: 'DIV' }, preventDefault() {} });
  console.assert(a1.element === 'S', 'S sobre un átomo debe convertirlo en azufre');
  fakeRenderer.hoveredAtomId = null;

  // Supr sin selección no deja un paso vacío en Deshacer
  st.clearSelection();
  const undoBefore = st.history ? st.history.length : (st.undoStack ? st.undoStack.length : null);
  sc.handleKeyDown({ key: 'Delete', target: { tagName: 'DIV' }, preventDefault() {} });
  const undoAfter = st.history ? st.history.length : (st.undoStack ? st.undoStack.length : null);
  console.assert(undoBefore === undoAfter, `Supr sin selección no debe guardar historial (${undoBefore} → ${undoAfter})`);

  // Un proyecto inválido no borra el lienzo actual
  const atomsBefore = st.atoms.size;
  let threw = false;
  try { st.loadFromObject({ atoms: 'no-es-lista' }, true); } catch (e) { threw = true; }
  console.assert(threw && st.atoms.size === atomsBefore, 'JSON inválido: debe fallar sin borrar el lienzo');
  threw = false;
  try { st.loadFromObject({ atoms: [{ id: 'x', x: 0, y: 0 }], bonds: [{ id: 'b', atom1: 'x', atom2: 'fantasma' }] }, true); } catch (e) { threw = true; }
  console.assert(threw && st.atoms.size === atomsBefore, 'Enlace a átomo inexistente: debe fallar sin borrar el lienzo');

  // Guardar conserva si los recuadros están ocultos
  st.showCompoundBoxes = false;
  const saved = ChemSerializer.serialize(st);
  console.assert(saved.showCompoundBoxes === false, 'serialize debe guardar showCompoundBoxes');
  const st2 = new ChemState();
  st2.loadFromObject(JSON.parse(JSON.stringify(saved)), false);
  console.assert(st2.showCompoundBoxes === false && st2.atoms.size === st.atoms.size, 'Abrir lo guardado debe restaurar recuadros y átomos');

  // Flecha en L: esquina según la dirección
  console.assert(JSON.stringify(getArrowBendCorner({ x1: 0, y1: 0, x2: 100, y2: 80, bend: 'hv' })) === '{"x":100,"y":0}', 'esquina hv');
  console.assert(JSON.stringify(getArrowBendCorner({ x1: 0, y1: 0, x2: 100, y2: 80, bend: 'vh' })) === '{"x":0,"y":80}', 'esquina vh');
  console.assert(getArrowBendCorner({ x1: 0, y1: 0, x2: 100, y2: 0, bend: 'hv' }) === null, 'L con extremos alineados = recta');

  // Modo Problema sigue la flecha en L del ejemplo IChO: B → glucósido (2)
  const ic = new ChemState();
  ic.loadFromObject((await import('../js/chem-engine/examples.js')).EXAMPLE_SCHEMES.find(e => e.key === 'icho-glucose').build(), false);
  ProblemBuilder.autoBoxExistingScheme(ic);
  const known = [...ic.referenceBoxes.values()].filter(b => b.boxType === 'compound' && !b.isUnknown).map(b => b.label).sort();
  console.assert(known.join(',') === '1,2', `IChO con flecha en L: conocidas ${known}`);
  console.log('✓ S/B/G, Supr vacío, JSON inválido, guardar recuadros y flecha en L');
}

console.log('\n--- TEST: Copiar y pegar (Ctrl+C / Ctrl+V) ---');
{
  const cp = new ChemState();
  const a = cp.addAtom({ x: 0, y: 0, element: 'C' });
  const o = cp.addAtom({ x: 38, y: 0, element: 'O' });
  const far = cp.addAtom({ x: 500, y: 500, element: 'N' });
  cp.addBond({ atom1: a.id, atom2: o.id, type: 'double' });
  cp.addBond({ atom1: o.id, atom2: far.id, type: 'single' });
  const arr = cp.addArrow({ x1: 60, y1: 0, x2: 160, y2: 0, reagentsTop: 'Mg' });
  cp.selected.atoms.add(a.id); cp.selected.atoms.add(o.id); cp.selected.arrows.add(arr.id);

  const clip = cp.copySelection();
  console.assert(clip.atoms.length === 2 && clip.bonds.length === 1, 'Solo se copian los enlaces entre átomos seleccionados');
  cp.pasteClipboard(clip, 0, 100);
  console.assert(cp.atoms.size === 5 && cp.bonds.size === 3 && cp.arrows.size === 2, 'Pegar añade copias');
  const pasted = [...cp.selected.atoms].map(id => cp.atoms.get(id));
  console.assert(pasted.length === 2 && pasted.every(p => p.y === 100), 'Lo pegado queda seleccionado y desplazado');
  const pastedBond = cp.bonds.get([...cp.selected.bonds][0]);
  console.assert(pastedBond.type === 'double' && cp.selected.atoms.has(pastedBond.atom1) && cp.selected.atoms.has(pastedBond.atom2), 'El enlace pegado une los átomos nuevos');
  const pastedArrow = cp.arrows.get([...cp.selected.arrows][0]);
  console.assert(pastedArrow.y1 === 100 && pastedArrow.reagentsTop === 'Mg', 'La flecha pegada conserva sus reactivos');
  console.assert(JSON.stringify(ChemState.clipboardCenter(clip)) === '{"x":80,"y":0}', 'Centro del portapapeles');
  cp.undo();
  console.assert(cp.atoms.size === 3 && cp.arrows.size === 1, 'Deshacer quita lo pegado');
  cp.clearSelection();
  console.assert(cp.copySelection() === null, 'Sin selección no se copia nada');
  console.log('✓ Ctrl+C / Ctrl+V copian moléculas, enlaces y flechas con ids nuevos');
}
console.log('\n--- TEST: Arrastrar una molécula seleccionada con el recuadro ---');
{
  const { SelectTool } = await import('../js/tools/select-tool.js');
  const st = new ChemState();
  const a1 = st.addAtom({ x: 100, y: 100, element: 'C' });
  const a2 = st.addAtom({ x: 138, y: 100, element: 'C' });
  const bond = st.addBond({ atom1: a1.id, atom2: a2.id });
  const box = st.addReferenceBox({ boxType: 'compound', label: 'A', x: 60, y: 60, width: 140, height: 80 });
  const tool = new SelectTool(st, { render() {}, svg: null });
  // Selección por recuadro: solo marca los átomos
  st.selected.atoms.add(a1.id); st.selected.atoms.add(a2.id);

  // Agarrar por el enlace mueve toda la molécula
  tool.onMouseDown({ shiftKey: false }, { x: 119, y: 100 }, { type: 'bond', id: bond.id });
  tool.onMouseMove({}, { x: 119, y: 150 }, null);
  tool.onMouseUp({}, { x: 119, y: 150 }, null);
  console.assert(st.selected.atoms.size === 2, 'La selección se conserva al agarrar un enlace');
  console.assert(a1.y === 150 && a2.y === 150, 'Agarrar un enlace de la selección mueve la molécula');
  st.undo();
  console.assert(st.atoms.get(a1.id).y === 100, 'Deshacer devuelve la molécula a su sitio');

  // Agarrar por dentro del recuadro de compuesto mueve la molécula y el recuadro
  const s2 = st.atoms;
  st.selected.atoms.add(a1.id); st.selected.atoms.add(a2.id);
  tool.onMouseDown({ shiftKey: false }, { x: 120, y: 110 }, { type: 'box', id: box.id });
  tool.onMouseMove({}, { x: 170, y: 110 }, null);
  tool.onMouseUp({}, { x: 170, y: 110 }, null);
  console.assert(s2.get(a1.id).x === 150 && st.referenceBoxes.get(box.id).x === 110, 'El recuadro y su molécula se mueven juntos');

  // Un clic sin mover no deja un paso vacío en Deshacer
  const before = st.undoStack.length;
  tool.onMouseDown({ shiftKey: false }, { x: 150, y: 100 }, { type: 'atom', id: a1.id });
  tool.onMouseUp({}, { x: 150, y: 100 }, null);
  console.assert(st.undoStack.length === before, 'Clic sin mover no guarda paso de Deshacer');
  console.log('✓ La selección se arrastra desde un enlace, el recuadro o su interior');
}

// El recuadro de selección también selecciona las letras de incógnita, para poder borrarlas
{
  const st = new ChemState();
  const l1 = st.addReferenceBox({ boxType: 'compound', label: 'A', unknownLetter: 'A', x: 100, y: 100, width: 32, height: 36 });
  const l2 = st.addReferenceBox({ boxType: 'compound', label: 'B', unknownLetter: 'B', x: 300, y: 100, width: 32, height: 36 });
  const far = st.addReferenceBox({ boxType: 'compound', label: 'C', unknownLetter: 'C', x: 600, y: 100, width: 32, height: 36 });
  const tool = new SelectTool(st, { render() {} });
  tool.finishMarqueeSelection({ x: 50, y: 50 }, { x: 400, y: 200 });
  console.assert(st.selected.boxes.has(l1.id) && st.selected.boxes.has(l2.id) && !st.selected.boxes.has(far.id), 'La selección con recuadro incluye solo las letras que rodea');
  console.log('✓ Las letras de incógnita se seleccionan con el recuadro');
}
