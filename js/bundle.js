(function() {
  "use strict";

  // --- js/chem-engine/elements.js ---
/**
 * elements.js - Diccionario químico de elementos, valencias y abreviaturas
 */

const ELEMENTS = {
  C: { symbol: 'C', name: 'Carbono', valence: 4, color: '#111827', implicitH: true },
  H: { symbol: 'H', name: 'Hidrógeno', valence: 1, color: '#4b5563', implicitH: false },
  O: { symbol: 'O', name: 'Oxígeno', valence: 2, color: '#dc2626', implicitH: true },
  N: { symbol: 'N', name: 'Nitrógeno', valence: 3, maxValence: 4, color: '#2563eb', implicitH: true },
  S: { symbol: 'S', name: 'Azufre', valence: 2, maxValence: 6, color: '#d97706', implicitH: true },
  P: { symbol: 'P', name: 'Fósforo', valence: 3, maxValence: 5, color: '#ea580c', implicitH: true },
  F: { symbol: 'F', name: 'Flúor', valence: 1, color: '#16a34a', implicitH: false },
  Cl: { symbol: 'Cl', name: 'Cloro', valence: 1, maxValence: 7, color: '#15803d', implicitH: false },
  Br: { symbol: 'Br', name: 'Bromo', valence: 1, maxValence: 5, color: '#991b1b', implicitH: false },
  I: { symbol: 'I', name: 'Yodo', valence: 1, maxValence: 7, color: '#7c3aed', implicitH: false },
  B: { symbol: 'B', name: 'Boro', valence: 3, maxValence: 4, color: '#ea580c', implicitH: true },
  Si: { symbol: 'Si', name: 'Silicio', valence: 4, maxValence: 6, color: '#0284c7', implicitH: true },
  Li: { symbol: 'Li', name: 'Litio', valence: 1, color: '#ef4444', implicitH: false },
  Na: { symbol: 'Na', name: 'Sodio', valence: 1, color: '#ef4444', implicitH: false },
  K: { symbol: 'K', name: 'Potasio', valence: 1, color: '#ef4444', implicitH: false },
  Mg: { symbol: 'Mg', name: 'Magnesio', valence: 2, color: '#f97316', implicitH: false },
  Ca: { symbol: 'Ca', name: 'Calcio', valence: 2, color: '#f97316', implicitH: false },
  Al: { symbol: 'Al', name: 'Aluminio', valence: 3, color: '#06b6d4', implicitH: false },
  Ti: { symbol: 'Ti', name: 'Titanio', valence: 4, color: '#6366f1', implicitH: false },
  Cr: { symbol: 'Cr', name: 'Cromo', valence: 3, maxValence: 6, color: '#6366f1', implicitH: false },
  Mn: { symbol: 'Mn', name: 'Manganeso', valence: 2, maxValence: 7, color: '#6366f1', implicitH: false },
  Fe: { symbol: 'Fe', name: 'Hierro', valence: 2, maxValence: 3, color: '#6366f1', implicitH: false },
  Co: { symbol: 'Co', name: 'Cobalto', valence: 2, maxValence: 3, color: '#6366f1', implicitH: false },
  Ni: { symbol: 'Ni', name: 'Níquel', valence: 2, color: '#6366f1', implicitH: false },
  Cu: { symbol: 'Cu', name: 'Cobre', valence: 1, maxValence: 2, color: '#6366f1', implicitH: false },
  Zn: { symbol: 'Zn', name: 'Zinc', valence: 2, color: '#6366f1', implicitH: false },
  Se: { symbol: 'Se', name: 'Selenio', valence: 2, maxValence: 6, color: '#10b981', implicitH: true },
  Pd: { symbol: 'Pd', name: 'Paladio', valence: 2, maxValence: 4, color: '#6366f1', implicitH: false },
  Ag: { symbol: 'Ag', name: 'Plata', valence: 1, color: '#6366f1', implicitH: false },
  Sn: { symbol: 'Sn', name: 'Estaño', valence: 2, maxValence: 4, color: '#06b6d4', implicitH: false },
  Pt: { symbol: 'Pt', name: 'Platino', valence: 2, maxValence: 4, color: '#6366f1', implicitH: false },
  Au: { symbol: 'Au', name: 'Oro', valence: 1, maxValence: 3, color: '#6366f1', implicitH: false }
};

const PERIODIC_TABLE_DATA = [
  // Periodo 1
  { number: 1, symbol: 'H', name: 'Hidrógeno', period: 1, group: 1, category: 'nonmetal', valence: 1 },
  { number: 2, symbol: 'He', name: 'Helio', period: 1, group: 18, category: 'noble', valence: 0 },
  // Periodo 2
  { number: 3, symbol: 'Li', name: 'Litio', period: 2, group: 1, category: 'alkali', valence: 1 },
  { number: 4, symbol: 'Be', name: 'Berilio', period: 2, group: 2, category: 'alkaline-earth', valence: 2 },
  { number: 5, symbol: 'B', name: 'Boro', period: 2, group: 13, category: 'metalloid', valence: 3 },
  { number: 6, symbol: 'C', name: 'Carbono', period: 2, group: 14, category: 'nonmetal', valence: 4 },
  { number: 7, symbol: 'N', name: 'Nitrógeno', period: 2, group: 15, category: 'nonmetal', valence: 3 },
  { number: 8, symbol: 'O', name: 'Oxígeno', period: 2, group: 16, category: 'nonmetal', valence: 2 },
  { number: 9, symbol: 'F', name: 'Flúor', period: 2, group: 17, category: 'halogen', valence: 1 },
  { number: 10, symbol: 'Ne', name: 'Neón', period: 2, group: 18, category: 'noble', valence: 0 },
  // Periodo 3
  { number: 11, symbol: 'Na', name: 'Sodio', period: 3, group: 1, category: 'alkali', valence: 1 },
  { number: 12, symbol: 'Mg', name: 'Magnesio', period: 3, group: 2, category: 'alkaline-earth', valence: 2 },
  { number: 13, symbol: 'Al', name: 'Aluminio', period: 3, group: 13, category: 'post-transition', valence: 3 },
  { number: 14, symbol: 'Si', name: 'Silicio', period: 3, group: 14, category: 'metalloid', valence: 4 },
  { number: 15, symbol: 'P', name: 'Fósforo', period: 3, group: 15, category: 'nonmetal', valence: 3 },
  { number: 16, symbol: 'S', name: 'Azufre', period: 3, group: 16, category: 'nonmetal', valence: 2 },
  { number: 17, symbol: 'Cl', name: 'Cloro', period: 3, group: 17, category: 'halogen', valence: 1 },
  { number: 18, symbol: 'Ar', name: 'Argón', period: 3, group: 18, category: 'noble', valence: 0 },
  // Periodo 4
  { number: 19, symbol: 'K', name: 'Potasio', period: 4, group: 1, category: 'alkali', valence: 1 },
  { number: 20, symbol: 'Ca', name: 'Calcio', period: 4, group: 2, category: 'alkaline-earth', valence: 2 },
  { number: 21, symbol: 'Sc', name: 'Escandio', period: 4, group: 3, category: 'transition', valence: 3 },
  { number: 22, symbol: 'Ti', name: 'Titanio', period: 4, group: 4, category: 'transition', valence: 4 },
  { number: 23, symbol: 'V', name: 'Vanadio', period: 4, group: 5, category: 'transition', valence: 5 },
  { number: 24, symbol: 'Cr', name: 'Cromo', period: 4, group: 6, category: 'transition', valence: 6 },
  { number: 25, symbol: 'Mn', name: 'Manganeso', period: 4, group: 7, category: 'transition', valence: 7 },
  { number: 26, symbol: 'Fe', name: 'Hierro', period: 4, group: 8, category: 'transition', valence: 3 },
  { number: 27, symbol: 'Co', name: 'Cobalto', period: 4, group: 9, category: 'transition', valence: 3 },
  { number: 28, symbol: 'Ni', name: 'Níquel', period: 4, group: 10, category: 'transition', valence: 2 },
  { number: 29, symbol: 'Cu', name: 'Cobre', period: 4, group: 11, category: 'transition', valence: 2 },
  { number: 30, symbol: 'Zn', name: 'Zinc', period: 4, group: 12, category: 'transition', valence: 2 },
  { number: 31, symbol: 'Ga', name: 'Galio', period: 4, group: 13, category: 'post-transition', valence: 3 },
  { number: 32, symbol: 'Ge', name: 'Germanio', period: 4, group: 14, category: 'metalloid', valence: 4 },
  { number: 33, symbol: 'As', name: 'Arsénico', period: 4, group: 15, category: 'metalloid', valence: 3 },
  { number: 34, symbol: 'Se', name: 'Selenio', period: 4, group: 16, category: 'nonmetal', valence: 2 },
  { number: 35, symbol: 'Br', name: 'Bromo', period: 4, group: 17, category: 'halogen', valence: 1 },
  { number: 36, symbol: 'Kr', name: 'Kriptón', period: 4, group: 18, category: 'noble', valence: 0 },
  // Periodo 5
  { number: 37, symbol: 'Rb', name: 'Rubidio', period: 5, group: 1, category: 'alkali', valence: 1 },
  { number: 38, symbol: 'Sr', name: 'Estroncio', period: 5, group: 2, category: 'alkaline-earth', valence: 2 },
  { number: 39, symbol: 'Y', name: 'Itrio', period: 5, group: 3, category: 'transition', valence: 3 },
  { number: 40, symbol: 'Zr', name: 'Circonio', period: 5, group: 4, category: 'transition', valence: 4 },
  { number: 41, symbol: 'Nb', name: 'Niobio', period: 5, group: 5, category: 'transition', valence: 5 },
  { number: 42, symbol: 'Mo', name: 'Molibdeno', period: 5, group: 6, category: 'transition', valence: 6 },
  { number: 43, symbol: 'Tc', name: 'Tecnecio', period: 5, group: 7, category: 'transition', valence: 7 },
  { number: 44, symbol: 'Ru', name: 'Rutenio', period: 5, group: 8, category: 'transition', valence: 4 },
  { number: 45, symbol: 'Rh', name: 'Rodio', period: 5, group: 9, category: 'transition', valence: 3 },
  { number: 46, symbol: 'Pd', name: 'Paladio', period: 5, group: 10, category: 'transition', valence: 2 },
  { number: 47, symbol: 'Ag', name: 'Plata', period: 5, group: 11, category: 'transition', valence: 1 },
  { number: 48, symbol: 'Cd', name: 'Cadmio', period: 5, group: 12, category: 'transition', valence: 2 },
  { number: 49, symbol: 'In', name: 'Indio', period: 5, group: 13, category: 'post-transition', valence: 3 },
  { number: 50, symbol: 'Sn', name: 'Estaño', period: 5, group: 14, category: 'post-transition', valence: 4 },
  { number: 51, symbol: 'Sb', name: 'Antimonio', period: 5, group: 15, category: 'metalloid', valence: 3 },
  { number: 52, symbol: 'Te', name: 'Telurio', period: 5, group: 16, category: 'metalloid', valence: 2 },
  { number: 53, symbol: 'I', name: 'Yodo', period: 5, group: 17, category: 'halogen', valence: 1 },
  { number: 54, symbol: 'Xe', name: 'Xenón', period: 5, group: 18, category: 'noble', valence: 0 },
  // Periodo 6
  { number: 55, symbol: 'Cs', name: 'Cesio', period: 6, group: 1, category: 'alkali', valence: 1 },
  { number: 56, symbol: 'Ba', name: 'Bario', period: 6, group: 2, category: 'alkaline-earth', valence: 2 },
  { number: 57, symbol: 'La', name: 'Lantano', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 1 },
  { number: 58, symbol: 'Ce', name: 'Cerio', period: 6, group: 3, category: 'lanthanide', valence: 4, isFBlock: true, fRow: 1, fCol: 2 },
  { number: 59, symbol: 'Pr', name: 'Praseodimio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 3 },
  { number: 60, symbol: 'Nd', name: 'Neodimio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 4 },
  { number: 61, symbol: 'Pm', name: 'Prometio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 5 },
  { number: 62, symbol: 'Sm', name: 'Samario', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 6 },
  { number: 63, symbol: 'Eu', name: 'Europio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 7 },
  { number: 64, symbol: 'Gd', name: 'Gadolinio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 8 },
  { number: 65, symbol: 'Tb', name: 'Terbio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 9 },
  { number: 66, symbol: 'Dy', name: 'Disprosio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 10 },
  { number: 67, symbol: 'Ho', name: 'Holmio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 11 },
  { number: 68, symbol: 'Er', name: 'Erbio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 12 },
  { number: 69, symbol: 'Tm', name: 'Tulio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 13 },
  { number: 70, symbol: 'Yb', name: 'Iterbio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 14 },
  { number: 71, symbol: 'Lu', name: 'Lutecio', period: 6, group: 3, category: 'lanthanide', valence: 3, isFBlock: true, fRow: 1, fCol: 15 },
  { number: 72, symbol: 'Hf', name: 'Hafnio', period: 6, group: 4, category: 'transition', valence: 4 },
  { number: 73, symbol: 'Ta', name: 'Tántalo', period: 6, group: 5, category: 'transition', valence: 5 },
  { number: 74, symbol: 'W', name: 'Wolframio', period: 6, group: 6, category: 'transition', valence: 6 },
  { number: 75, symbol: 'Re', name: 'Renio', period: 6, group: 7, category: 'transition', valence: 7 },
  { number: 76, symbol: 'Os', name: 'Osmio', period: 6, group: 8, category: 'transition', valence: 4 },
  { number: 77, symbol: 'Ir', name: 'Iridio', period: 6, group: 9, category: 'transition', valence: 4 },
  { number: 78, symbol: 'Pt', name: 'Platino', period: 6, group: 10, category: 'transition', valence: 4 },
  { number: 79, symbol: 'Au', name: 'Oro', period: 6, group: 11, category: 'transition', valence: 3 },
  { number: 80, symbol: 'Hg', name: 'Mercurio', period: 6, group: 12, category: 'transition', valence: 2 },
  { number: 81, symbol: 'Tl', name: 'Talio', period: 6, group: 13, category: 'post-transition', valence: 3 },
  { number: 82, symbol: 'Pb', name: 'Plomo', period: 6, group: 14, category: 'post-transition', valence: 4 },
  { number: 83, symbol: 'Bi', name: 'Bismuto', period: 6, group: 15, category: 'post-transition', valence: 3 },
  { number: 84, symbol: 'Po', name: 'Polonio', period: 6, group: 16, category: 'post-transition', valence: 4 },
  { number: 85, symbol: 'At', name: 'Ástato', period: 6, group: 17, category: 'halogen', valence: 1 },
  { number: 86, symbol: 'Rn', name: 'Radón', period: 6, group: 18, category: 'noble', valence: 0 },
  // Periodo 7
  { number: 87, symbol: 'Fr', name: 'Francio', period: 7, group: 1, category: 'alkali', valence: 1 },
  { number: 88, symbol: 'Ra', name: 'Radio', period: 7, group: 2, category: 'alkaline-earth', valence: 2 },
  { number: 89, symbol: 'Ac', name: 'Actinio', period: 7, group: 3, category: 'actinide', valence: 3, isFBlock: true, fRow: 2, fCol: 1 },
  { number: 90, symbol: 'Th', name: 'Torio', period: 7, group: 3, category: 'actinide', valence: 4, isFBlock: true, fRow: 2, fCol: 2 },
  { number: 91, symbol: 'Pa', name: 'Protactinio', period: 7, group: 3, category: 'actinide', valence: 5, isFBlock: true, fRow: 2, fCol: 3 },
  { number: 92, symbol: 'U', name: 'Uranio', period: 7, group: 3, category: 'actinide', valence: 6, isFBlock: true, fRow: 2, fCol: 4 },
  { number: 93, symbol: 'Np', name: 'Neptunio', period: 7, group: 3, category: 'actinide', valence: 5, isFBlock: true, fRow: 2, fCol: 5 },
  { number: 94, symbol: 'Pu', name: 'Plutonio', period: 7, group: 3, category: 'actinide', valence: 4, isFBlock: true, fRow: 2, fCol: 6 },
  { number: 95, symbol: 'Am', name: 'Americio', period: 7, group: 3, category: 'actinide', valence: 3, isFBlock: true, fRow: 2, fCol: 7 },
  { number: 96, symbol: 'Cm', name: 'Curio', period: 7, group: 3, category: 'actinide', valence: 3, isFBlock: true, fRow: 2, fCol: 8 },
  { number: 97, symbol: 'Bk', name: 'Berkelio', period: 7, group: 3, category: 'actinide', valence: 3, isFBlock: true, fRow: 2, fCol: 9 },
  { number: 98, symbol: 'Cf', name: 'Californio', period: 7, group: 3, category: 'actinide', valence: 3, isFBlock: true, fRow: 2, fCol: 10 },
  { number: 99, symbol: 'Es', name: 'Einstenio', period: 7, group: 3, category: 'actinide', valence: 3, isFBlock: true, fRow: 2, fCol: 11 },
  { number: 100, symbol: 'Fm', name: 'Fermio', period: 7, group: 3, category: 'actinide', valence: 3, isFBlock: true, fRow: 2, fCol: 12 },
  { number: 101, symbol: 'Md', name: 'Mendelevio', period: 7, group: 3, category: 'actinide', valence: 3, isFBlock: true, fRow: 2, fCol: 13 },
  { number: 102, symbol: 'No', name: 'Nobelio', period: 7, group: 3, category: 'actinide', valence: 2, isFBlock: true, fRow: 2, fCol: 14 },
  { number: 103, symbol: 'Lr', name: 'Laurencio', period: 7, group: 3, category: 'actinide', valence: 3, isFBlock: true, fRow: 2, fCol: 15 },
  { number: 104, symbol: 'Rf', name: 'Rutherfordio', period: 7, group: 4, category: 'transition', valence: 4 },
  { number: 105, symbol: 'Db', name: 'Dubnio', period: 7, group: 5, category: 'transition', valence: 5 },
  { number: 106, symbol: 'Sg', name: 'Seaborgio', period: 7, group: 6, category: 'transition', valence: 6 },
  { number: 107, symbol: 'Bh', name: 'Bohrio', period: 7, group: 7, category: 'transition', valence: 7 },
  { number: 108, symbol: 'Hs', name: 'Hassio', period: 7, group: 8, category: 'transition', valence: 8 },
  { number: 109, symbol: 'Mt', name: 'Meitnerio', period: 7, group: 9, category: 'transition', valence: 4 },
  { number: 110, symbol: 'Ds', name: 'Darmstadtio', period: 7, group: 10, category: 'transition', valence: 4 },
  { number: 111, symbol: 'Rg', name: 'Roentgenio', period: 7, group: 11, category: 'transition', valence: 3 },
  { number: 112, symbol: 'Cn', name: 'Copernicio', period: 7, group: 12, category: 'transition', valence: 2 },
  { number: 113, symbol: 'Nh', name: 'Nihonio', period: 7, group: 13, category: 'post-transition', valence: 3 },
  { number: 114, symbol: 'Fl', name: 'Flerovio', period: 7, group: 14, category: 'post-transition', valence: 4 },
  { number: 115, symbol: 'Mc', name: 'Moscovio', period: 7, group: 15, category: 'post-transition', valence: 3 },
  { number: 116, symbol: 'Lv', name: 'Livermorio', period: 7, group: 16, category: 'post-transition', valence: 4 },
  { number: 117, symbol: 'Ts', name: 'Tenesino', period: 7, group: 17, category: 'halogen', valence: 1 },
  { number: 118, symbol: 'Og', name: 'Oganesón', period: 7, group: 18, category: 'noble', valence: 0 }
];

// Registrar todos los elementos en ELEMENTS para acceso uniforme
PERIODIC_TABLE_DATA.forEach(elem => {
  if (!ELEMENTS[elem.symbol]) {
    ELEMENTS[elem.symbol] = {
      symbol: elem.symbol,
      name: elem.name,
      valence: elem.valence,
      color: '#475569',
      implicitH: false
    };
  }
});

// Abreviaturas y grupos comunes en Olimpiadas de Química (IChO)
const COMMON_GROUPS = {
  // Alquilos y arilos
  Me: { label: 'Me', formula: 'CH3', valence: 1 },
  Et: { label: 'Et', formula: 'CH2CH3', valence: 1 },
  iPr: { label: 'i-Pr', formula: 'CH(CH3)2', valence: 1 },
  tBu: { label: 't-Bu', formula: 'C(CH3)3', valence: 1 },
  Ph: { label: 'Ph', formula: 'C6H5', valence: 1 },
  Bn: { label: 'Bn', formula: 'CH2Ph', valence: 1 },
  
  // Protectores y acilos
  Ac: { label: 'Ac', formula: 'COCH3', valence: 1 },
  Ts: { label: 'Ts', formula: 'SO2C6H4CH3', valence: 1 },
  Ms: { label: 'Ms', formula: 'SO2CH3', valence: 1 },
  Tf: { label: 'Tf', formula: 'SO2CF3', valence: 1 },
  TBS: { label: 'TBS', formula: 'SiMe2tBu', valence: 1 },
  TBDPS: { label: 'TBDPS', formula: 'SiPh2tBu', valence: 1 },
  MOM: { label: 'MOM', formula: 'CH2OCH3', valence: 1 },
  PMB: { label: 'PMB', formula: 'CH2C6H4OMe', valence: 1 },
  PMP: { label: 'PMP', formula: 'C6H4OMe', valence: 1 },
  Cbz: { label: 'Cbz', formula: 'COOCH2Ph', valence: 1 },
  Boc: { label: 'Boc', formula: 'COOC(CH3)3', valence: 1 },
  
  // Oxígenos protegidos y grupos oxigenados comunes
  OMe: { label: 'OMe', formula: 'OCH3', valence: 1 },
  OEt: { label: 'OEt', formula: 'OCH2CH3', valence: 1 },
  OBn: { label: 'OBn', formula: 'OCH2Ph', valence: 1 },
  OAc: { label: 'OAc', formula: 'OCOCH3', valence: 1 },
  OTs: { label: 'OTs', formula: 'OSO2Tol', valence: 1 },
  OTBS: { label: 'OTBS', formula: 'OSiMe2tBu', valence: 1 },
  OTBDPS: { label: 'OTBDPS', formula: 'OSiPh2tBu', valence: 1 },
  OMOM: { label: 'OMOM', formula: 'OCH2OMe', valence: 1 },
  OPMP: { label: 'OPMP', formula: 'OC6H4OMe', valence: 1 },
  
  // Reactivos y catalizadores
  CSA: { label: 'CSA', formula: 'Ácido camforsulfónico', isReagent: true },
  DMAP: { label: 'DMAP', formula: '4-dimetilaminopiridina', isReagent: true },
  DMP: { label: 'DMP', formula: 'Periodinano de Dess-Martin', isReagent: true },
  DDQ: { label: 'DDQ', formula: '2,3-dicloro-5,6-diciano-p-benzoquinona', isReagent: true },
  DCC: { label: 'DCC', formula: 'N,N\'-diciclohexilcarbodiimida', isReagent: true },
  DIBAL: { label: 'DIBAL-H', formula: 'i-Bu2AlH', isReagent: true },
  Py: { label: 'Py', formula: 'Piridina', isReagent: true }
};

const SUBSCRIPT_MAP = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
};

const SUPERSCRIPT_MAP = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '−': '⁻'
};

/**
 * Analizador sintáctico universal de texto químico.
 * Detecta:
 * - Subíndices tras elementos o paréntesis: Si3, O9, H2O, (CH2)4, etc.
 * - Cargas iónicas entre paréntesis tras fórmula: Si3O9(6-), SO4(2-), NH4(+), Fe(CN)6(4-), etc.
 * - Cargas directas o con caret: [Si3O9]6-, Fe3+, Cl-, ^6-, ^{2-}, etc.
 * - Símbolos griegos y grados: \Delta -> Δ, \deg -> °, etc.
 */
function parseChemicalRichText(str) {
  if (!str) return [];
  let s = String(str)
    .replace(/\\Delta\b|\\delta\b/g, 'Δ')
    .replace(/\\alpha\b/g, 'α')
    .replace(/\\beta\b/g, 'β')
    .replace(/\\gamma\b/g, 'γ')
    .replace(/\\mu\b/g, 'μ')
    .replace(/\\pi\b/g, 'π')
    .replace(/\\deg\b/g, '°');

  // 1. Cargas entre paréntesis tras fórmula química: ej. Si3O9(6-) o NH4(+)
  s = s.replace(/([A-Za-z0-9)\]])\s*\((?:(\d+)?([+\-−])|([+\-−])(\d+)?)\)/g, (m, prev, n1, s1, s2, n2) => {
    const num = n1 || n2 || '';
    const sign = (s1 || s2) === '-' ? '−' : (s1 || s2);
    return prev + '\u0001SUPER:' + num + sign + '\u0002';
  });

  // 2. Cargas con acento circunflejo: ej. ^6-, ^{2-}, ^+, ^-
  //    También letras en minúscula como superíndice: KO^tBu, ^iPr, ^nBu
  s = s.replace(/\^\{?(\d*[+\-−]|[+\-−]\d*|\d+|[a-z]+)\}?/g, (m, chg) => {
    return '\u0001SUPER:' + chg.replace(/-/g, '−') + '\u0002';
  });

  // 3a. Número de hidrógenos seguido de carga: ej. OH3+, NH4+, CH3+, NH2-
  //     El número es SIEMPRE subíndice (el H nunca lleva carga 3+), así que se separa:
  //     OH3+ → O H₃ ⁺ (y no OH³⁺, que se leería como carga 3+)
  s = s.replace(/H(\d+)([+\-−])(?=[,\s;)]|$)/g, (m, num, sign) => {
    const sg = sign === '-' ? '−' : sign;
    return 'H\u0001SUB:' + num + '\u0002\u0001SUPER:' + sg + '\u0002';
  });

  // 3b. Cargas directas tras símbolo o corchete: ej. [Si3O9]6- o Fe3+ o Cl-
  s = s.replace(/([A-Za-z)\]])(\d+)?([+\-−])(?=[,\s;)]|$)/g, (m, prev, num, sign) => {
    const s = sign === '-' ? '−' : sign;
    return prev + '\u0001SUPER:' + (num || '') + s + '\u0002';
  });

  // 4. Subíndices estequiométricos: ej. Si3, O9, H2O
  s = s.replace(/([A-Za-z)\]~])(\d+)/g, (m, prev, digits) => {
    return prev + '\u0001SUB:' + digits + '\u0002';
  });

  // 5. Partir por delimitadores \u0001 y \u0002
  const tokens = [];
  const parts = s.split(/(\u0001(?:SUPER|SUB):[^\u0002]+\u0002)/);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('\u0001SUPER:') && part.endsWith('\u0002')) {
      tokens.push({ type: 'super', text: part.slice(7, -1) });
    } else if (part.startsWith('\u0001SUB:') && part.endsWith('\u0002')) {
      tokens.push({ type: 'sub', text: part.slice(5, -1) });
    } else {
      tokens.push({ type: 'normal', text: part });
    }
  }
  return tokens;
}

/**
 * Formatea cadenas químicas con subíndices y superíndices (Unicode o HTML)
 * ej. Si3O9(6-) -> Si₃O₉⁶⁻ o Si<sub>3</sub>O<sub>9</sub><sup>6−</sup>
 */
function formatChemicalFormula(str, asHtml = false) {
  if (!str) return '';
  const tokens = parseChemicalRichText(str);
  if (asHtml) {
    return tokens.map(t => {
      if (t.type === 'sub') return `<sub>${t.text}</sub>`;
      if (t.type === 'super') return `<sup>${t.text}</sup>`;
      return t.text;
    }).join('');
  }
  return tokens.map(t => {
    if (t.type === 'sub') return t.text.split('').map(c => SUBSCRIPT_MAP[c] || c).join('');
    if (t.type === 'super') return t.text.split('').map(c => SUPERSCRIPT_MAP[c] || c).join('');
    return t.text;
  }).join('');
}

/**
 * Renderiza texto químico enriquecido con tspans de subíndices y superíndices en un elemento SVG.
 */
function renderFormattedSvgText(parentElem, str, options = {}) {
  if (!parentElem) return;
  while (parentElem.firstChild) {
    parentElem.removeChild(parentElem.firstChild);
  }
  if (!str) return;

  const tokens = parseChemicalRichText(str);
  for (const token of tokens) {
    if (token.type === 'sub') {
      const sub = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      sub.setAttribute('baseline-shift', 'sub');
      sub.setAttribute('font-size', options.subFontSize || '0.75em');
      sub.textContent = token.text;
      parentElem.appendChild(sub);
    } else if (token.type === 'super') {
      const sup = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      sup.setAttribute('baseline-shift', 'super');
      sup.setAttribute('font-size', options.superFontSize || '0.75em');
      sup.setAttribute('font-weight', options.superFontWeight || 'bold');
      sup.textContent = token.text;
      parentElem.appendChild(sup);
    } else {
      const textNode = document.createTextNode(token.text);
      parentElem.appendChild(textNode);
    }
  }
}

/**
 * Calcula la fórmula molecular o empírica y la carga neta total de un conjunto de átomos.
 * ej. 3 Si, 9 O, carga total -6 -> "Si3O9(6-)"
 */
function calculateMolecularFormula(atoms) {
  if (!atoms || atoms.length === 0) return '';
  const counts = new Map();
  let netCharge = 0;

  for (const atom of atoms) {
    const elem = (atom.element || 'C').trim();
    counts.set(elem, (counts.get(elem) || 0) + 1);
    const chg = atom.charge !== undefined ? atom.charge : 0;
    netCharge += chg;
  }

  // Orden: C primero, luego H, luego otros alfabéticos con Oxígeno al final para aniones inorgánicos
  const elements = Array.from(counts.keys());
  const hasC = elements.includes('C');
  elements.sort((a, b) => {
    if (hasC) {
      if (a === 'C') return -1;
      if (b === 'C') return 1;
      if (a === 'H') return -1;
      if (b === 'H') return 1;
    }
    if (a === 'O') return 1;
    if (b === 'O') return -1;
    return a.localeCompare(b);
  });

  let formula = '';
  for (const elem of elements) {
    const count = counts.get(elem);
    formula += elem + (count > 1 ? count : '');
  }

  if (netCharge !== 0) {
    const sign = netCharge > 0 ? '+' : '−';
    const absVal = Math.abs(netCharge);
    const chgStr = (absVal === 1 ? '' : absVal) + sign;
    formula = `${formula}(${chgStr})`;
  }

  return formula;
}

/**
 * Diccionario de inversión de grupos químicos para que el heteroátomo
 * siempre se enlace directamente al enlace químico (ej. H2N- a la izquierda vs -NH2 a la derecha).
 */
const GROUP_REVERSALS = {
  'NH2': 'H2N',
  'NH': 'HN',
  'NH3': 'H3N',
  'OH': 'HO',
  'OH3+': 'H3O+',
  'H3O+': 'OH3+',
  'OH2+': 'H2O+',
  'H2O+': 'OH2+',
  'OH+': 'HO+',
  'HO+': 'OH+',
  'NH4+': 'H4N+',
  'H4N+': 'NH4+',
  'SH': 'HS',
  'PH2': 'H2P',
  'CH3': 'H3C',
  'CH2': 'H2C',
  'CH': 'HC',
  'COOH': 'HOOC',
  'CO2H': 'HO2C',
  'CHO': 'OHC',
  'OMe': 'MeO',
  'OEt': 'EtO',
  'OBn': 'BnO',
  'OBz': 'BzO',
  'OAc': 'AcO',
  'OFmoc': 'FmocO',
  'OTBDPS': 'TBDPSO',
  'OTBS': 'TBSO',
  'SEt': 'EtS',
  'OTs': 'TsO',
  'OTf': 'TfO',
  'OMs': 'MsO',
  'OCH3': 'H3CO',
  'NO2': 'O2N',
  'SO3H': 'HO3S',
  'NMe2': 'Me2N',
  'NEt2': 'Et2N',
  'NHBoc': 'BocHN',
  'NHAc': 'AcHN',
  'CN': 'NC',
  'COOMe': 'MeO2C',
  'CO2Me': 'MeO2C',
  'COOEt': 'EtO2C',
  'CO2Et': 'EtO2C'
};

const REVERSE_GROUP_MAP = Object.fromEntries(
  Object.entries(GROUP_REVERSALS).map(([k, v]) => [v, k])
);

/**
 * Calcula la orientación del sustituyente según la dirección de los enlaces conectados
 */
function getAtomAttachmentOrientation(atom, state) {
  // Lado forzado de la etiqueta (p. ej. 'BnO' a la izquierda en enlaces casi verticales)
  if (atom.labelSide === 'left') {
    return { direction: 'left', isLeft: true, isRight: false, isVertical: false, dx: -1, dy: 0 };
  }
  if (atom.labelSide === 'right') {
    return { direction: 'right', isLeft: false, isRight: true, isVertical: false, dx: 1, dy: 0 };
  }

  if (!state || !state.bonds) {
    return { direction: 'right', isLeft: false, isRight: true, isVertical: false, dx: 1, dy: 0 };
  }

  let sumDx = 0;
  let sumDy = 0;
  let count = 0;

  for (const bond of state.bonds.values()) {
    let other = null;
    if (bond.atom1 === atom.id) other = state.getAtom(bond.atom2);
    else if (bond.atom2 === atom.id) other = state.getAtom(bond.atom1);

    if (other) {
      const dx = atom.x - other.x;
      const dy = atom.y - other.y;
      const len = Math.hypot(dx, dy) || 1;
      sumDx += dx / len;
      sumDy += dy / len;
      count++;
    }
  }

  if (count === 0) {
    return { direction: 'right', isLeft: false, isRight: true, isVertical: false, dx: 1, dy: 0 };
  }

  const avgDx = sumDx / count;
  const avgDy = sumDy / count;

  // Si el átomo está predominantemente a la izquierda del enlace
  const isLeft = avgDx < -0.25;
  const isRight = avgDx > 0.25;
  const isVertical = Math.abs(avgDx) <= 0.25;

  let direction = 'right';
  if (isLeft) direction = 'left';
  else if (isRight) direction = 'right';
  else direction = avgDy < 0 ? 'top' : 'bottom';

  return {
    direction,
    isLeft,
    isRight,
    isVertical,
    dx: avgDx,
    dy: avgDy
  };
}

function getBondOrder(bondType) {
  switch (bondType) {
    case 'double': return 2;
    case 'triple': return 3;
    case 'dative': return 0; // coordinación a un metal: no cambia la valencia ni la carga del ligando
    case 'single':
    case 'bold':
    case 'wedge':
    case 'dash':
    case 'dashed':
    case 'wavy':
    default:
      return 1;
  }
}

function getAtomBondOrderSum(atom, state) {
  if (!state || !state.bonds) return 0;
  let sum = 0;
  for (const bond of state.bonds.values()) {
    if (bond.atom1 === atom.id || bond.atom2 === atom.id) {
      sum += getBondOrder(bond.type);
    }
  }
  return sum;
}

/**
 * Calcula automáticamente la fórmula química con hidrógenos implícitos
 * según la valencia y la suma de enlaces actual:
 * - N con 0 enlaces -> NH3 (amoniaco libre)
 * - N con 1 enlace  -> NH2 (amina primaria / sustituyente)
 * - N con 2 enlaces -> NH (amina secundaria / imina)
 * - N con 3 enlaces -> N (piridina, amina terciaria)
 * - O con 0 enlaces -> H2O (agua libre)
 * - O con 1 enlace  -> OH (alcohol / hidroxilo)
 * - O con 2 enlaces -> O (éter, carbonilo)
 * - S con 0 enlaces -> H2S
 * - S con 1 enlace  -> SH
 * - S con 2+ enlaces -> S
 */
function computeAutoAtomLabel(element, bondSum, charge = 0) {
  if (charge > 0) {
    if (element === 'O') {
      if (bondSum === 0) return 'H3O+';
      if (bondSum === 1) return 'H2O+';
      if (bondSum === 2) return 'HO+';
      return 'O+';
    }
    if (element === 'N') {
      if (bondSum === 0) return 'NH4+';
      if (bondSum === 1) return 'NH3+';
      if (bondSum === 2) return 'NH2+';
      if (bondSum === 3) return 'NH+';
      return 'N+';
    }
    if (element === 'C') {
      return bondSum === 0 ? 'CH3+' : null;
    }
  } else if (charge < 0) {
    if (element === 'O') {
      if (bondSum === 0) return 'HO-';
      return 'O-';
    }
    if (element === 'N') {
      if (bondSum === 0) return 'NH2-';
      if (bondSum === 1) return 'NH-';
      return 'N-';
    }
    if (element === 'C') {
      return bondSum === 0 ? 'CH3-' : null;
    }
    // Haluros (F⁻, Cl⁻, Br⁻, I⁻): el halógeno con carga negativa ya completó su octeto,
    // así que no lleva hidrógenos implícitos (HCl + carga − → Cl⁻, no "HCl⁻")
    if (['F', 'Cl', 'Br', 'I'].includes(element)) {
      return element;
    }
  }

  switch (element) {
    case 'N':
      if (bondSum === 0) return 'NH3';
      if (bondSum === 1) return 'NH2';
      if (bondSum === 2) return 'NH';
      // Con 4 enlaces y carga 0 se muestra 'N' (la carga + la asigna state.applyAutoCharges;
      // si el usuario la quitó a mano, el validador lo marca en rojo y el dibujo no lo oculta)
      return 'N';

    case 'O':
      if (bondSum === 0) return 'H2O';
      if (bondSum === 1) return 'OH';
      return 'O'; // con 3 enlaces la carga + la asigna state.applyAutoCharges

    case 'S':
      if (bondSum === 0) return 'H2S';
      if (bondSum === 1) return 'SH';
      return 'S';

    case 'P':
      if (bondSum === 0) return 'PH3';
      if (bondSum === 1) return 'PH2';
      if (bondSum === 2) return 'PH';
      return 'P';

    case 'F':
      return bondSum === 0 ? 'HF' : 'F';

    case 'Cl':
      return bondSum === 0 ? 'HCl' : 'Cl';

    case 'Br':
      return bondSum === 0 ? 'HBr' : 'Br';

    case 'I':
      return bondSum === 0 ? 'HI' : 'I';

    case 'C':
      return bondSum === 0 ? 'CH4' : null;

    default:
      return element;
  }
}

/**
 * Obtiene la representación de texto y el átomo de anclaje (bonding atom)
 * garantizando que N, O, S, etc. se sitúen exactamente en el punto de unión
 * y calculando dinámicamente los hidrógenos implícitos según los enlaces presentes y carga.
 */
function getFormattedAtomDisplay(atom, state) {
  const element = atom.element || 'C';
  let rawLabel = atom.label;
  const bondSum = getAtomBondOrderSum(atom, state);
  const effectiveCharge = atom.charge || (atom.label && /\+$/.test(atom.label.trim()) ? 1 : (atom.label && /[\-−]$/.test(atom.label.trim()) ? -1 : 0));

  // Lista de fórmulas automáticas calculables
  const autoFormulas = [
    'N', 'NH', 'NH2', 'NH3', 'NH4+', 'N+', 'H2N', 'HN', 'H3N', 'H4N+',
    'O', 'OH', 'H2O', 'H3O+', 'OH3+', 'HO', 'O+', 'O-',
    'S', 'SH', 'H2S', 'HS',
    'P', 'PH', 'PH2', 'PH3', 'H2P', 'HP', 'H3P',
    'F', 'HF', 'Cl', 'HCl', 'Br', 'HBr', 'I', 'HI', 'CH4', 'C'
  ];

  let text = rawLabel;

  // Si no tiene etiqueta manual o su etiqueta es una de las fórmulas automáticas:
  if (!atom.manualLabel && (!rawLabel || autoFormulas.includes(rawLabel))) {
    text = computeAutoAtomLabel(element, bondSum, effectiveCharge);
  } else if (!text) {
    text = element;
  }

  // Carbono implícito (esqueleto sin etiqueta)
  if (element === 'C' && (!text || text === 'C')) {
    return { isImplicit: true };
  }

  if (!text) {
    return { isImplicit: true };
  }

  const orientation = getAtomAttachmentOrientation(atom, state);

  // Inversión inteligente según el lado respecto al enlace
  if (orientation.isLeft) {
    if (GROUP_REVERSALS[text]) {
      text = GROUP_REVERSALS[text];
    }
  } else {
    // Si está a la derecha o vertical, retornar a la forma estándar
    if (REVERSE_GROUP_MAP[text]) {
      text = REVERSE_GROUP_MAP[text];
    }
  }

  // Identificar el átomo de unión (bonding atom) y qué parte es prefijo/sufijo
  // bondingSide: 'right' (ej. H2N -> 'N' está a la derecha, 'H2' es prefijo a la izquierda)
  //              'left'  (ej. NH2 -> 'N' está a la izquierda, 'H2' es sufijo a la derecha)
  //              'center' (ej. 'N', 'O', 'Cl', etc.)
  let bondingAtom = element;
  let bondingSide = 'center';
  let prefix = '';
  let suffix = '';

  if (text === 'H3O+' || text === 'H3O') {
    bondingAtom = 'O';
    bondingSide = 'right';
    prefix = 'H3';
    suffix = text.includes('+') ? '+' : '';
  } else if (text === 'OH3+' || text === 'OH3') {
    bondingAtom = 'O';
    bondingSide = 'left';
    suffix = 'H3+';
  } else if (text === 'H2O+' || text === 'H2O') {
    bondingAtom = 'O';
    bondingSide = 'right';
    prefix = 'H2';
    suffix = text.includes('+') ? '+' : '';
  } else if (text === 'OH2+') {
    bondingAtom = 'O';
    bondingSide = 'left';
    suffix = 'H2+';
  } else if (text === 'HO+') {
    bondingAtom = 'O';
    bondingSide = 'right';
    prefix = 'H';
    suffix = '+';
  } else if (text === 'OH+') {
    bondingAtom = 'O';
    bondingSide = 'left';
    suffix = 'H+';
  } else if (text === 'H4N+') {
    bondingAtom = 'N';
    bondingSide = 'right';
    prefix = 'H4';
    suffix = '+';
  } else if (text === 'NH4+') {
    bondingAtom = 'N';
    bondingSide = 'left';
    suffix = 'H4+';
  } else if (text === 'N+' || text === 'O+' || text === 'O-') {
    bondingAtom = text[0];
    bondingSide = 'center';
    suffix = text.slice(1);
  } else if (text === 'H2O') {
    bondingAtom = 'O';
    bondingSide = 'right';
    prefix = 'H2';
  } else if (text === 'H2S') {
    bondingAtom = 'S';
    bondingSide = 'right';
    prefix = 'H2';
  } else if (text === 'NH3') {
    bondingAtom = 'N';
    bondingSide = 'left';
    suffix = 'H3';
  } else if (text === 'H3N') {
    bondingAtom = 'N';
    bondingSide = 'right';
    prefix = 'H3';
  } else if (text.startsWith('H2N')) {
    bondingAtom = 'N';
    bondingSide = 'right';
    prefix = 'H2';
  } else if (text.startsWith('HN')) {
    bondingAtom = 'N';
    bondingSide = 'right';
    prefix = 'H';
  } else if (text.startsWith('H3N')) {
    bondingAtom = 'N';
    bondingSide = 'right';
    prefix = 'H3';
  } else if (text === 'HO') {
    bondingAtom = 'O';
    bondingSide = 'right';
    prefix = 'H';
  } else if (text === 'HS') {
    bondingAtom = 'S';
    bondingSide = 'right';
    prefix = 'H';
  } else if (text === 'H3C') {
    bondingAtom = 'C';
    bondingSide = 'right';
    prefix = 'H3';
  } else if (text === 'H2C') {
    bondingAtom = 'C';
    bondingSide = 'right';
    prefix = 'H2';
  } else if (text === 'HC') {
    bondingAtom = 'C';
    bondingSide = 'right';
    prefix = 'H';
  } else if (text === 'HOOC') {
    bondingAtom = 'C';
    bondingSide = 'right';
    prefix = 'HOO';
  } else if (text === 'OHC') {
    bondingAtom = 'C';
    bondingSide = 'right';
    prefix = 'OH';
  } else if (text === 'BnO') {
    bondingAtom = 'O';
    bondingSide = 'right';
    prefix = 'Bn';
  } else if (text === 'MeO') {
    bondingAtom = 'O';
    bondingSide = 'right';
    prefix = 'Me';
  } else if (text === 'AcO') {
    bondingAtom = 'O';
    bondingSide = 'right';
    prefix = 'Ac';
  } else if (text === 'TsO') {
    bondingAtom = 'O';
    bondingSide = 'right';
    prefix = 'Ts';
  } else if (text === 'MsO') {
    bondingAtom = 'O';
    bondingSide = 'right';
    prefix = 'Ms';
  } else if (text === 'O2N') {
    bondingAtom = 'N';
    bondingSide = 'right';
    prefix = 'O2';
  } else if (text === 'Me2N') {
    bondingAtom = 'N';
    bondingSide = 'right';
    prefix = 'Me2';
  } else if (text.startsWith('NH2')) {
    bondingAtom = 'N';
    bondingSide = 'left';
    suffix = text.slice(1); // 'H2'
  } else if (text.startsWith('NH')) {
    bondingAtom = 'N';
    bondingSide = 'left';
    suffix = text.slice(1);
  } else if (text.startsWith('OH')) {
    bondingAtom = 'O';
    bondingSide = 'left';
    suffix = 'H';
  } else if (text.startsWith('SH')) {
    bondingAtom = 'S';
    bondingSide = 'left';
    suffix = 'H';
  } else if (text.startsWith('OMe')) {
    bondingAtom = 'O';
    bondingSide = 'left';
    suffix = 'Me';
  } else if (text.startsWith('OBn')) {
    bondingAtom = 'O';
    bondingSide = 'left';
    suffix = 'Bn';
  } else if (text.startsWith('OAc')) {
    bondingAtom = 'O';
    bondingSide = 'left';
    suffix = 'Ac';
  } else if (text.startsWith('OTs')) {
    bondingAtom = 'O';
    bondingSide = 'left';
    suffix = 'Ts';
  } else if (text.startsWith('OMs')) {
    bondingAtom = 'O';
    bondingSide = 'left';
    suffix = 'Ms';
  } else if (text.startsWith('NO2')) {
    bondingAtom = 'N';
    bondingSide = 'left';
    suffix = 'O2';
  } else if (text.startsWith('COOH')) {
    bondingAtom = 'C';
    bondingSide = 'left';
    suffix = 'OOH';
  } else if (text.startsWith('CH3')) {
    bondingAtom = 'C';
    bondingSide = 'left';
    suffix = 'H3';
  } else if (text.length > element.length && text.startsWith(element) && !/[+\-−]$/.test(text)) {
    // Regla general (OTBDPS, OBz, SEt, COOMe...): el enlace llega a la letra del elemento
    // y el resto del grupo queda a la derecha
    bondingAtom = element;
    bondingSide = 'left';
    suffix = text.slice(element.length);
  } else if (text.length > element.length && text.endsWith(element) && !/[+\-−]/.test(text)) {
    // Forma invertida (TBDPSO, BzO, EtS, MeO2C...): el enlace llega a la última letra
    bondingAtom = element;
    bondingSide = 'right';
    prefix = text.slice(0, text.length - element.length);
  } else {
    bondingSide = 'center';
    bondingAtom = text;
  }

  // Un solo H en un átomo con enlaces a ambos lados (amida -C(=O)-NH-, amina secundaria...):
  // a los lados no hay espacio, así que la H va debajo del átomo (o arriba si los enlaces bajan),
  // como en los editores químicos habituales.
  const singleH = text === `${element}H` || text === `H${element}`;
  if (singleH && state && state.bonds && !atom.labelSide) {
    let hasLeft = false, hasRight = false, sumDy = 0;
    for (const bond of state.bonds.values()) {
      let other = null;
      if (bond.atom1 === atom.id) other = state.getAtom(bond.atom2);
      else if (bond.atom2 === atom.id) other = state.getAtom(bond.atom1);
      if (!other) continue;
      const dx = other.x - atom.x, dy = other.y - atom.y;
      const len = Math.hypot(dx, dy) || 1;
      if (dx / len < -0.3) hasLeft = true;
      if (dx / len > 0.3) hasRight = true;
      sumDy += dy / len;
    }
    if (hasLeft && hasRight) {
      bondingAtom = element;
      bondingSide = sumDy <= 0 ? 'below' : 'above';
      prefix = '';
      suffix = 'H';
    }
  }

  return {
    isImplicit: false,
    text,
    element,
    bondingAtom,
    bondingSide,
    prefix,
    suffix,
    orientation
  };
}

/**
 * Calcula el cuadro delimitador exacto de un átomo incluyendo sus etiquetas de texto
 */
function getAtomBoundingBox(atom, state, margin = 3.0) {
  const displayInfo = getFormattedAtomDisplay(atom, state);
  if (displayInfo.isImplicit) {
    return {
      minX: atom.x - 5,
      maxX: atom.x + 5,
      minY: atom.y - 5,
      maxY: atom.y + 5
    };
  }

  const { bondingAtom, bondingSide, prefix, suffix } = displayInfo;
  const letterWidth = (bondingAtom && bondingAtom.length > 1) ? 17 : 11;
  const prefixWidth = prefix ? (prefix.length * 8.5) : 0;
  const suffixWidth = suffix ? (suffix.length * 8.5) : 0;

  let textXMin, textXMax;
  if (bondingSide === 'right') {
    textXMin = atom.x - letterWidth / 2 - prefixWidth - margin;
    textXMax = atom.x + letterWidth / 2 + margin;
  } else if (bondingSide === 'left') {
    textXMin = atom.x - letterWidth / 2 - margin;
    textXMax = atom.x + letterWidth / 2 + suffixWidth + margin;
  } else {
    textXMin = atom.x - letterWidth / 2 - margin;
    textXMax = atom.x + letterWidth / 2 + margin;
  }

  const textYMin = atom.y - 8.0 - margin;
  const textYMax = atom.y + 7.0 + margin;

  return {
    minX: textXMin,
    maxX: textXMax,
    minY: textYMin,
    maxY: textYMax
  };
}

/**
 * Calcula el cuadro delimitador (cuadrado / bounding box) de toda una molécula
 * considerando todos sus átomos y las etiquetas de texto de sus sustituyentes.
 */
function getMoleculeBoundingBox(atoms, state, padding = 0) {
  if (!atoms || atoms.length === 0) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const atom of atoms) {
    const bbox = getAtomBoundingBox(atom, state, 3.0);
    minX = Math.min(minX, bbox.minX);
    maxX = Math.max(maxX, bbox.maxX);
    minY = Math.min(minY, bbox.minY);
    maxY = Math.max(maxY, bbox.maxY);
  }

  return {
    minX: minX - padding,
    maxX: maxX + padding,
    minY: minY - padding,
    maxY: maxY + padding,
    width: (maxX - minX) + 2 * padding,
    height: (maxY - minY) + 2 * padding,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}

/**
 * Obtiene todos los átomos interconectados que forman una molécula completa
 */
function getConnectedMoleculeAtoms(startAtomId, state) {
  const visited = new Set();
  const queue = [startAtomId];
  visited.add(startAtomId);

  while (queue.length > 0) {
    const currId = queue.shift();
    for (const bond of state.bonds.values()) {
      let neighborId = null;
      if (bond.atom1 === currId) neighborId = bond.atom2;
      else if (bond.atom2 === currId) neighborId = bond.atom1;

      if (neighborId && !visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }
  }

  return Array.from(visited).map(id => state.getAtom(id)).filter(Boolean);
}

/**
 * Esquina de una flecha doblada en "L" (arrow.bend):
 *  - 'hv': primero horizontal y luego vertical  → esquina (x2, y1)
 *  - 'vh': primero vertical y luego horizontal  → esquina (x1, y2)
 * Devuelve null si la flecha no está doblada o si sus extremos están alineados (sería recta).
 */
function getArrowBendCorner(arrow) {
  if (!arrow || !arrow.bend || arrow.type === 'fork' || arrow.type === 'converge') return null;
  if (Math.abs(arrow.x2 - arrow.x1) < 2 || Math.abs(arrow.y2 - arrow.y1) < 2) return null;
  return arrow.bend === 'vh' ? { x: arrow.x1, y: arrow.y2 } : { x: arrow.x2, y: arrow.y1 };
}

/**
 * Obtiene todas las moléculas individuales presentes en el estado
 */
function getAllMolecules(state) {
  const visited = new Set();
  const molecules = [];

  for (const atom of state.atoms.values()) {
    if (!visited.has(atom.id)) {
      const molAtoms = getConnectedMoleculeAtoms(atom.id, state);
      for (const a of molAtoms) visited.add(a.id);
      molecules.push({
        atoms: molAtoms,
        bbox: getMoleculeBoundingBox(molAtoms, state)
      });
    }
  }

  return molecules;
}

/**
 * Obtiene los ángulos (en radianes) para colocar pares de electrones libres (lone pairs)
 * de forma químicamente óptima y estética en el espacio libre alrededor del átomo.
 */
function getAtomLonePairAngles(atom, state, count = 1) {
  if (!count || count <= 0) return [];

  const displayInfo = getFormattedAtomDisplay(atom, state);
  const hasH = Boolean(displayInfo && (displayInfo.prefix || displayInfo.suffix));
  const bondingSide = displayInfo ? displayInfo.bondingSide : 'center';
  
  const neighborAngles = [];
  if (state && state.bonds) {
    for (const bond of state.bonds.values()) {
      let otherId = null;
      if (bond.atom1 === atom.id) otherId = bond.atom2;
      else if (bond.atom2 === atom.id) otherId = bond.atom1;
      
      if (otherId) {
        const other = state.getAtom(otherId);
        if (other) {
          neighborAngles.push(Math.atan2(other.y - atom.y, other.x - atom.x));
        }
      }
    }
  }

  if (neighborAngles.length === 0) {
    // Átomo aislado
    if (hasH) {
      if (count === 1) return [-Math.PI / 2];
      if (count === 2) return [-Math.PI / 2, Math.PI / 2];
      return [-Math.PI / 2, Math.PI / 2, Math.PI, 0].slice(0, count);
    }
    const defaults = [Math.PI / 2, -Math.PI / 2, 0, Math.PI];
    return defaults.slice(0, count);
  }

  if (neighborAngles.length === 1) {
    // 1 enlace vecino (átomo terminal)
    const bondAngle = neighborAngles[0];
    const opp = bondAngle + Math.PI;

    if (hasH) {
      // El heteroátomo tiene hidrógenos representados como prefijo (izq) o sufijo (der).
      // Si colocamos el par libre colineal al enlace o hacia el lado de los hidrógenos,
      // colisionará directamente con las letras 'H' o subíndices (ej. NH2, H2N, OH).
      // Por tanto, orientamos los pares libres perpendicularmente (vertical) evitando el enlace y los H.
      if (count === 1) {
        // Ej. Amina primaria terminal (NH2 / H2N)
        // Si el vecino está abajo (sin(bondAngle) > 0.05), el par libre apunta ARRIBA (-PI/2)
        // Si el vecino está arriba (sin(bondAngle) < -0.05), el par libre apunta ABAJO (+PI/2)
        // Si el enlace es horizontal (|sin(bondAngle)| <= 0.05):
        //   - En H2N (vecino a la der, H a la izq): par libre abajo (+PI/2)
        //   - En NH2 (vecino a la izq, H a la der): par libre arriba (-PI/2)
        // De esta forma, en hidrazina H2N-NH2 o aminas opuestas quedan alternadas (transoid) limpiamente.
        let ang = -Math.PI / 2;
        if (Math.sin(bondAngle) < -0.05) {
          ang = Math.PI / 2;
        } else if (Math.sin(bondAngle) > 0.05) {
          ang = -Math.PI / 2;
        } else {
          ang = (bondingSide === 'right' || Math.cos(bondAngle) > 0) ? Math.PI / 2 : -Math.PI / 2;
        }
        return [ang];
      } else if (count === 2) {
        // Ej. Hidroxilo terminal (OH / HO) o tiol (SH / HS)
        if (Math.abs(Math.sin(bondAngle)) > 0.7) {
          if (bondingSide === 'right') {
            return Math.sin(bondAngle) > 0 ? [-Math.PI / 2, 0] : [Math.PI / 2, 0];
          } else {
            return Math.sin(bondAngle) > 0 ? [-Math.PI / 2, Math.PI] : [Math.PI / 2, Math.PI];
          }
        }
        return [-Math.PI / 2, Math.PI / 2];
      } else {
        const base = Math.sin(bondAngle) < 0 ? Math.PI / 2 : -Math.PI / 2;
        return [base, base - Math.PI / 3, base + Math.PI / 3].slice(0, count);
      }
    }

    // Átomo terminal desnudo (ej. =O, -Cl, -F, -Br, -I)
    if (count === 1) {
      return [opp];
    } else if (count === 2) {
      return [bondAngle + Math.PI - Math.PI / 3, bondAngle + Math.PI + Math.PI / 3];
    } else if (count === 3) {
      return [bondAngle + Math.PI / 2, opp, bondAngle - Math.PI / 2];
    } else {
      const res = [];
      for (let i = 0; i < count; i++) {
        res.push(bondAngle + Math.PI / 2 + (i / Math.max(1, count - 1)) * Math.PI);
      }
      return res;
    }
  }

  // 2 o más enlaces: encontrar el hueco angular más amplio
  const normAngles = neighborAngles.map(a => {
    let n = a % (2 * Math.PI);
    if (n < 0) n += 2 * Math.PI;
    return n;
  }).sort((a, b) => a - b);

  let maxGap = 0;
  let gapStart = 0;
  for (let i = 0; i < normAngles.length; i++) {
    const nextIdx = (i + 1) % normAngles.length;
    let diff = normAngles[nextIdx] - normAngles[i];
    if (diff < 0) diff += 2 * Math.PI;
    if (diff > maxGap) {
      maxGap = diff;
      gapStart = normAngles[i];
    }
  }

  const res = [];
  for (let i = 1; i <= count; i++) {
    const frac = i / (count + 1);
    let ang = gapStart + frac * maxGap;

    // Si tiene hidrógenos (ej. amina secundaria -NH-) y el ángulo apunta directamente a 'H':
    if (hasH && count === 1) {
      const hX = (bondingSide === 'right') ? -1 : 1;
      if (Math.cos(ang) * hX > 0.7) {
        // Desviar hacia la vertical más cercana que esté en el hueco libre
        ang = Math.sin(ang) >= 0 ? Math.PI / 2 : -Math.PI / 2;
      }
    }
    res.push(ang);
  }
  return res;
}



  // --- js/chem-engine/valence.js ---
/**
 * valence.js - Validador de reglas de valencia química
 * Detecta violaciones como el "Texas Carbon" (carbono pentavalente con 5 enlaces)
 * y marca los átomos en rojo.
 */


{ getBondOrder };

/**
 * Valida la valencia de todos los átomos del sistema molecular
 * @param {Array} atoms - Lista de átomos { id, element, charge, label }
 * @param {Array} bonds - Lista de enlaces { id, atom1, atom2, type }
 * @returns {Map<string, Object>} Mapa de atomId -> { hasError, isTexasCarbon, message, bondCount }
 */
function validateMolecularValences(atoms, bonds) {
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


  // --- js/chem-engine/templates.js ---
/**
 * templates.js - Plantillas de anillos: sillas de ciclohexano y piranosa (modelo de los
 * exámenes IChO), benceno, ciclohexano y ciclopentano.
 */

const RING_TEMPLATES = {
  // Sillas con el modelo de los exámenes IChO. Las coordenadas se calcularon a partir de esa
  // silla de referencia: no editarlas a mano.
  //  - 3 pares de enlaces paralelos; vértices superiores a la misma altura y los inferiores también.
  //  - Borde frontal remarcado: cuña desde la punta, enlace grueso, cuña hacia la otra punta.
  //  - Axiales verticales y alternados (arriba/abajo); ecuatoriales paralelos a los enlaces
  //    del anillo que están a un enlace de distancia.
  //  - 'depth' = cercanía al observador (positivo = delante); el renderer la usa para dejar un
  //    hueco en el enlace de atrás cuando dos enlaces se cruzan.
  //  - El giro de silla es la imagen especular: cada carbono conserva su lado (c1 a la derecha)
  //    y su cara (arriba/abajo); axiales <-> ecuatoriales.
  // Enlace más largo del anillo 46 px; sustituyentes 34 px.
  PYRANOSE_CHAIR: {
    name: 'Silla Piranosa (Glucosa / IChO)',
    description: 'Silla 4C1 con el O del anillo arriba a la derecha y el borde frontal remarcado (modelo IChO)',
    ringAtoms: [
      { id: 'c1', x: 54.8, y: 19.6, depth: 8, element: 'C' },
      { id: 'c2', x: 10.8, y: 7.6, depth: 45, element: 'C' },
      { id: 'c3', x: -30.8, y: 19.6, depth: 26, element: 'C' },
      { id: 'c4', x: -54.8, y: -19.6, depth: -8, element: 'C' },
      { id: 'c5', x: -10.8, y: -7.6, depth: -45, element: 'C' },
      { id: 'o6', x: 30.8, y: -19.6, depth: -26, element: 'O', label: 'O' }
    ],
    ringBonds: [
      { a1: 'c1', a2: 'c2', type: 'wedge', wedgeWidth: 5.0, isFront: true },
      { a1: 'c2', a2: 'c3', type: 'bold', boldWidth: 5.0, isFront: true },
      { a1: 'c4', a2: 'c3', type: 'wedge', wedgeWidth: 5.0, isFront: true },
      { a1: 'c4', a2: 'c5', type: 'single' },
      { a1: 'c5', a2: 'o6', type: 'single' },
      { a1: 'o6', a2: 'c1', type: 'single' }
    ],
    substituents: {
      c1: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C1 (Abajo)', type: 'single', defaultGroup: 'OH' },
        equatorial: { dx: 32.7, dy: -9.4, label: 'Ecuatorial C1 (Arriba-Der)', type: 'single', defaultGroup: 'OH' }
      },
      c2: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C2 (Arriba)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: 17.8, dy: 29.0, label: 'Ecuatorial C2 (Abajo-Der)', type: 'single', defaultGroup: 'OH' }
      },
      c3: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C3 (Abajo)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -32.8, dy: -8.9, label: 'Ecuatorial C3 (Arriba-Izq)', type: 'single', defaultGroup: 'OH' }
      },
      c4: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C4 (Arriba)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -32.7, dy: 9.4, label: 'Ecuatorial C4 (Abajo-Izq)', type: 'single', defaultGroup: 'OH' }
      },
      c5: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C5 (Abajo)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -28.3, dy: -18.9, label: 'Ecuatorial C5 (Arriba-Izq)', type: 'single', defaultGroup: 'CH2OH' }
      }
    }
  },

  PYRANOSE_CHAIR_FLIP: {
    name: 'Piranosa (Giro de Silla)',
    description: 'Silla 1C4: mismo anillo tras el giro de silla (axiales y ecuatoriales intercambiados)',
    ringAtoms: [
      { id: 'c1', x: 54.8, y: -19.6, depth: -8, element: 'C' },
      { id: 'c2', x: 30.8, y: 19.6, depth: 26, element: 'C' },
      { id: 'c3', x: -10.8, y: 7.6, depth: 45, element: 'C' },
      { id: 'c4', x: -54.8, y: 19.6, depth: 8, element: 'C' },
      { id: 'c5', x: -30.8, y: -19.6, depth: -26, element: 'C' },
      { id: 'o6', x: 10.8, y: -7.6, depth: -45, element: 'O', label: 'O' }
    ],
    ringBonds: [
      { a1: 'c1', a2: 'c2', type: 'wedge', wedgeWidth: 5.0, isFront: true },
      { a1: 'c2', a2: 'c3', type: 'bold', boldWidth: 5.0, isFront: true },
      { a1: 'c4', a2: 'c3', type: 'wedge', wedgeWidth: 5.0, isFront: true },
      { a1: 'c4', a2: 'c5', type: 'single' },
      { a1: 'c5', a2: 'o6', type: 'single' },
      { a1: 'o6', a2: 'c1', type: 'single' }
    ],
    substituents: {
      c1: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C1 (Arriba)', type: 'single', defaultGroup: 'OH' },
        equatorial: { dx: 32.7, dy: 9.4, label: 'Ecuatorial C1 (Abajo-Der)', type: 'single', defaultGroup: 'OH' }
      },
      c2: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C2 (Abajo)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: 32.8, dy: -8.9, label: 'Ecuatorial C2 (Arriba-Der)', type: 'single', defaultGroup: 'OH' }
      },
      c3: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C3 (Arriba)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -17.8, dy: 29.0, label: 'Ecuatorial C3 (Abajo-Izq)', type: 'single', defaultGroup: 'OH' }
      },
      c4: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C4 (Abajo)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -32.7, dy: -9.4, label: 'Ecuatorial C4 (Arriba-Izq)', type: 'single', defaultGroup: 'OH' }
      },
      c5: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C5 (Arriba)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -32.8, dy: 8.9, label: 'Ecuatorial C5 (Abajo-Izq)', type: 'single', defaultGroup: 'CH2OH' }
      }
    }
  },

  CHAIR_CYCLOHEXANE: {
    name: 'Silla de Ciclohexano (Normal)',
    description: 'Silla con el modelo IChO: enlaces paralelos por pares, axiales verticales alternados y borde frontal remarcado',
    ringAtoms: [
      { id: 'c1', x: 54.8, y: 19.6, depth: 8, element: 'C' },
      { id: 'c2', x: 10.8, y: 7.6, depth: 45, element: 'C' },
      { id: 'c3', x: -30.8, y: 19.6, depth: 26, element: 'C' },
      { id: 'c4', x: -54.8, y: -19.6, depth: -8, element: 'C' },
      { id: 'c5', x: -10.8, y: -7.6, depth: -45, element: 'C' },
      { id: 'c6', x: 30.8, y: -19.6, depth: -26, element: 'C' }
    ],
    ringBonds: [
      { a1: 'c1', a2: 'c2', type: 'wedge', wedgeWidth: 5.0, isFront: true },
      { a1: 'c2', a2: 'c3', type: 'bold', boldWidth: 5.0, isFront: true },
      { a1: 'c4', a2: 'c3', type: 'wedge', wedgeWidth: 5.0, isFront: true },
      { a1: 'c4', a2: 'c5', type: 'single' },
      { a1: 'c5', a2: 'c6', type: 'single' },
      { a1: 'c6', a2: 'c1', type: 'single' }
    ],
    substituents: {
      c1: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C1 (Abajo)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: 32.7, dy: -9.4, label: 'Ecuatorial C1 (Arriba-Der)', type: 'single', defaultGroup: 'H' }
      },
      c2: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C2 (Arriba)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: 17.8, dy: 29.0, label: 'Ecuatorial C2 (Abajo-Der)', type: 'single', defaultGroup: 'H' }
      },
      c3: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C3 (Abajo)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -32.8, dy: -8.9, label: 'Ecuatorial C3 (Arriba-Izq)', type: 'single', defaultGroup: 'H' }
      },
      c4: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C4 (Arriba)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -32.7, dy: 9.4, label: 'Ecuatorial C4 (Abajo-Izq)', type: 'single', defaultGroup: 'H' }
      },
      c5: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C5 (Abajo)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -28.3, dy: -18.9, label: 'Ecuatorial C5 (Arriba-Izq)', type: 'single', defaultGroup: 'H' }
      },
      c6: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C6 (Arriba)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: 32.8, dy: 8.9, label: 'Ecuatorial C6 (Abajo-Der)', type: 'single', defaultGroup: 'H' }
      }
    }
  },

  CHAIR_FLIP: {
    name: 'Giro de Silla (Invertida)',
    description: 'La misma silla tras el giro: cada carbono conserva su posición y los axiales pasan a ecuatoriales',
    ringAtoms: [
      { id: 'c1', x: 54.8, y: -19.6, depth: -8, element: 'C' },
      { id: 'c2', x: 30.8, y: 19.6, depth: 26, element: 'C' },
      { id: 'c3', x: -10.8, y: 7.6, depth: 45, element: 'C' },
      { id: 'c4', x: -54.8, y: 19.6, depth: 8, element: 'C' },
      { id: 'c5', x: -30.8, y: -19.6, depth: -26, element: 'C' },
      { id: 'c6', x: 10.8, y: -7.6, depth: -45, element: 'C' }
    ],
    ringBonds: [
      { a1: 'c1', a2: 'c2', type: 'wedge', wedgeWidth: 5.0, isFront: true },
      { a1: 'c2', a2: 'c3', type: 'bold', boldWidth: 5.0, isFront: true },
      { a1: 'c4', a2: 'c3', type: 'wedge', wedgeWidth: 5.0, isFront: true },
      { a1: 'c4', a2: 'c5', type: 'single' },
      { a1: 'c5', a2: 'c6', type: 'single' },
      { a1: 'c6', a2: 'c1', type: 'single' }
    ],
    substituents: {
      c1: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C1 (Arriba)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: 32.7, dy: 9.4, label: 'Ecuatorial C1 (Abajo-Der)', type: 'single', defaultGroup: 'H' }
      },
      c2: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C2 (Abajo)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: 32.8, dy: -8.9, label: 'Ecuatorial C2 (Arriba-Der)', type: 'single', defaultGroup: 'H' }
      },
      c3: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C3 (Arriba)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -17.8, dy: 29.0, label: 'Ecuatorial C3 (Abajo-Izq)', type: 'single', defaultGroup: 'H' }
      },
      c4: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C4 (Abajo)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -32.7, dy: -9.4, label: 'Ecuatorial C4 (Arriba-Izq)', type: 'single', defaultGroup: 'H' }
      },
      c5: {
        axial: { dx: 0.0, dy: -34.0, label: 'Axial C5 (Arriba)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: -32.8, dy: 8.9, label: 'Ecuatorial C5 (Abajo-Izq)', type: 'single', defaultGroup: 'H' }
      },
      c6: {
        axial: { dx: 0.0, dy: 34.0, label: 'Axial C6 (Abajo)', type: 'single', defaultGroup: 'H' },
        equatorial: { dx: 28.3, dy: -18.9, label: 'Ecuatorial C6 (Arriba-Der)', type: 'single', defaultGroup: 'H' }
      }
    }
  },

  // Benceno aromático
  BENZENE: {
    name: 'Benceno',
    ringAtoms: Array.from({ length: 6 }, (_, i) => {
      const angle = (i * 60 - 30) * (Math.PI / 180);
      const r = 38;
      return { id: `b${i}`, x: Math.round(r * Math.cos(angle)), y: Math.round(r * Math.sin(angle)), element: 'C' };
    }),
    ringBonds: [
      { a1: 'b0', a2: 'b1', type: 'double' },
      { a1: 'b1', a2: 'b2', type: 'single' },
      { a1: 'b2', a2: 'b3', type: 'double' },
      { a1: 'b3', a2: 'b4', type: 'single' },
      { a1: 'b4', a2: 'b5', type: 'double' },
      { a1: 'b5', a2: 'b0', type: 'single' }
    ]
  },

  // Ciclohexano plano
  CYCLOHEXANE: {
    name: 'Ciclohexano (Plano)',
    ringAtoms: Array.from({ length: 6 }, (_, i) => {
      const angle = (i * 60 - 30) * (Math.PI / 180);
      const r = 38;
      return { id: `ch${i}`, x: Math.round(r * Math.cos(angle)), y: Math.round(r * Math.sin(angle)), element: 'C' };
    }),
    ringBonds: [
      { a1: 'ch0', a2: 'ch1', type: 'single' },
      { a1: 'ch1', a2: 'ch2', type: 'single' },
      { a1: 'ch2', a2: 'ch3', type: 'single' },
      { a1: 'ch3', a2: 'ch4', type: 'single' },
      { a1: 'ch4', a2: 'ch5', type: 'single' },
      { a1: 'ch5', a2: 'ch0', type: 'single' }
    ]
  },

  // Ciclopentano
  CYCLOPENTANE: {
    name: 'Ciclopentano',
    ringAtoms: Array.from({ length: 5 }, (_, i) => {
      const angle = (i * 72 - 90) * (Math.PI / 180);
      const r = 35;
      return { id: `cp${i}`, x: Math.round(r * Math.cos(angle)), y: Math.round(r * Math.sin(angle)), element: 'C' };
    }),
    ringBonds: [
      { a1: 'cp0', a2: 'cp1', type: 'single' },
      { a1: 'cp1', a2: 'cp2', type: 'single' },
      { a1: 'cp2', a2: 'cp3', type: 'single' },
      { a1: 'cp3', a2: 'cp4', type: 'single' },
      { a1: 'cp4', a2: 'cp0', type: 'single' }
    ]
  }
};


  // --- js/chem-engine/snapping.js ---
/**
 * snapping.js - Motor de snapping angular y anclaje magnético
 * Enlaces químicos: LONGITUD ESTRICTAMENTE FIJA (38px) y ángulos canónicos (múltiplos de 30°).
 * Flechas de reacción: Longitud arbitraria con bloqueo a ángulos canónicos (0°, 45°, 90°, 180°, 270°).
 */

const CANONICAL_ARROW_ANGLES = [
  0,    // Horizontal derecha
  45,   // Diagonal abajo-derecha
  90,   // Vertical abajo
  135,  // Diagonal abajo-izquierda
  180,  // Horizontal izquierda
  225,  // Diagonal arriba-izquierda
  270,  // Vertical arriba
  315   // Diagonal arriba-derecha
];

const STANDARD_BOND_ANGLES = [
  -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180
];

const STANDARD_BOND_LENGTH = 38; // Longitud estándar ACS 1996

function snapAngle(x1, y1, x2, y2, allowedAngles = CANONICAL_ARROW_ANGLES, thresholdDeg = 12) {
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

function snapBond(x1, y1, x2, y2, fixedLength = STANDARD_BOND_LENGTH) {
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
function calculateNextBondAngle(atom, state) {
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
function getFreeChairGuides(atom, state) {
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
function pickChairGuide(atom, state, cursor = null) {
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

function findNearestAnchor(x, y, state, excludeId = null, maxDist = 12) {
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


  // --- js/chem-engine/aligner.js ---


class ChemAligner {
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

    // 2.1 Incógnitas vacías al final de la ruta: reducirlas al tamaño de su letra
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

    // Reconciliar y limpiar flechas duplicadas o redundantes:
    // Si un recuadro es el origen de una flecha de bifurcación (fork),
    // cualquier flecha normal que también salga de él hacia la derecha es redundante
    // (creada por accidente o antes de bifurcar) y rompería el esquema al colapsar las ramas al centro.
    const forkSources = [];
    for (const arrow of state.arrows.values()) {
      if (arrow.type === 'fork') {
        for (const ent of allEntities) {
          if (Math.hypot(ent.maxX - arrow.x1, ent.centerY - arrow.y1) < 80) {
            forkSources.push(ent);
          }
        }
      }
    }

    if (forkSources.length > 0) {
      for (const arrow of Array.from(state.arrows.values())) {
        if (arrow.type === 'normal' && (arrow.x2 >= arrow.x1 - 10)) {
          for (const src of forkSources) {
            if (Math.hypot(src.maxX - arrow.x1, src.centerY - arrow.y1) < 80) {
              state.arrows.delete(arrow.id);
            }
          }
        }
      }
    }

    // 2. Procesar flechas ordenadas de izquierda a derecha
    const sortedArrows = Array.from(state.arrows.values()).sort((a, b) => {
      const ax = Math.min(a.x1, a.x2);
      const bx = Math.min(b.x1, b.x2);
      return ax - bx;
    });

    const gap = 16;

    for (const arrow of sortedArrows) {
      const dx = arrow.x2 - arrow.x1;
      const dy = arrow.y2 - arrow.y1;
      const isHorizontal = Math.abs(dx) >= Math.abs(dy);
      const isPointingRight = dx >= 0;
      const isPointingDown = dy >= 0;

      // Medir longitud requerida por los reactivos y moléculas sobre la flecha
      const topLines = (arrow.reagentsTop || '').split('\n').filter(Boolean);
      const bottomLines = (arrow.reagentsBottom || '').split('\n').filter(Boolean);
      const maxChars = Math.max(0, ...topLines.map(l => l.length), ...bottomLines.map(l => l.length));
      const requiredTextWidth = maxChars * 8.2;

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
          topMolWidth = Math.round(rawW * 0.8) + 16;
        }
      }

      const topLineWidth = topLines.length > 0 ? Math.max(...topLines.map(l => l.length)) * 8.2 : 0;
      const totalTopAssemblyWidth = topMolWidth + (topMolWidth > 0 && topLineWidth > 0 ? topLineWidth + 8 : topLineWidth);
      const requiredAssemblyWidth = Math.max(requiredTextWidth, totalTopAssemblyWidth);

      // Flechas horizontales: se expanden según la anchura requerida por reactivos y moléculas
      const desiredArrowLen = Math.max(105, Math.round(requiredAssemblyWidth + 38));
      // Flechas verticales: el texto se escribe horizontalmente a la derecha, por lo que NO deben alargarse verticalmente por la cantidad de caracteres
      const numLines = topLines.length + bottomLines.length;
      const desiredVerticalLen = Math.max(72, Math.min(95, Math.round(numLines * 16 + 28)));

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

      if (arrow.type === 'fork') {
        const topLines = (arrow.reagentsTop || '').split('\n').filter(Boolean);
        const bottomLines = (arrow.reagentsBottom || '').split('\n').filter(Boolean);
        const maxChars = Math.max(0, ...topLines.map(l => l.length), ...bottomLines.map(l => l.length));
        const requiredTextWidth = maxChars * 8.2;
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

        const isLeft = arrow.direction === 'left' || arrow.x2 < arrow.x1;
        if (source) {
          if (isLeft) {
            arrow.x1 = source.minX - gap;
            arrow.y1 = source.centerY;
            arrow.stemEndX = arrow.x1 - stemLen;
            arrow.x2 = arrow.stemEndX - branchLen;
          } else {
            arrow.x1 = source.maxX + gap;
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
          const desiredX = isLeft ? (arrow.x2 - gap - (targetTop.maxX - targetTop.minX)) : (arrow.x2 + gap);
          const shiftX = desiredX - targetTop.minX;
          const shiftY = arrow.yTop - targetTop.centerY;
          this.shiftEntityAndContent(targetTop, shiftX, shiftY, state);
        }

        if (targetBottom) {
          const desiredX = isLeft ? (arrow.x2 - gap - (targetBottom.maxX - targetBottom.minX)) : (arrow.x2 + gap);
          const shiftX = desiredX - targetBottom.minX;
          const shiftY = arrow.yBottom - targetBottom.centerY;
          this.shiftEntityAndContent(targetBottom, shiftX, shiftY, state);
        }

        continue;
      }

      if (arrow.type === 'converge') {
        const topLines = (arrow.reagentsTop || '').split('\n').filter(Boolean);
        const bottomLines = (arrow.reagentsBottom || '').split('\n').filter(Boolean);
        const maxChars = Math.max(0, ...topLines.map(l => l.length), ...bottomLines.map(l => l.length));
        const requiredTextWidth = maxChars * 8.2;
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
          arrow.x1 = Math.max(sourceTop.maxX, sourceBottom.maxX) + gap;
          arrow.yTop = sourceTop.centerY;
          arrow.yBottom = sourceBottom.centerY;
          arrow.yMid = Math.round((arrow.yTop + arrow.yBottom) / 2);
          arrow.y2 = arrow.yMid;
        } else if (sourceTop) {
          arrow.x1 = sourceTop.maxX + gap;
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

        if (target) {
          const desiredX = arrow.x2 + gap;
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
          startX = source.maxX + gap;
          midY = source.centerY;
        }

        arrow.x1 = startX;
        arrow.x2 = startX + desiredArrowLen;
        arrow.y1 = midY;
        arrow.y2 = midY;

        if (target) {
          const desiredTargetMinX = arrow.x2 + gap;
          const shiftX = desiredTargetMinX - target.minX;
          const shiftY = midY - target.centerY;
          this.shiftEntityAndContent(target, shiftX, shiftY, state);
        }
      } else if (isHorizontal && !isPointingRight) {
        let startX = arrow.x1;
        let midY = (arrow.y1 + arrow.y2) / 2;

        if (source) {
          startX = source.minX - gap;
          midY = source.centerY;
        }

        arrow.x1 = startX;
        arrow.x2 = startX - desiredArrowLen;
        arrow.y1 = midY;
        arrow.y2 = midY;

        if (target) {
          const desiredTargetMaxX = arrow.x2 - gap;
          const shiftX = desiredTargetMaxX - target.maxX;
          const shiftY = midY - target.centerY;
          this.shiftEntityAndContent(target, shiftX, shiftY, state);
        }
      } else if (!isHorizontal && isPointingDown) {
        let startY = arrow.y1;
        let midX = (arrow.x1 + arrow.x2) / 2;

        if (source) {
          startY = source.maxY + gap;
          midX = source.centerX;
        }

        arrow.y1 = startY;
        arrow.y2 = startY + desiredVerticalLen;
        arrow.x1 = midX;
        arrow.x2 = midX;

        if (target) {
          const desiredTargetMinY = arrow.y2 + gap;
          const shiftY = desiredTargetMinY - target.minY;
          const shiftX = midX - target.centerX;
          this.shiftEntityAndContent(target, shiftX, shiftY, state);
        }
      } else if (!isHorizontal && !isPointingDown) {
        let startY = arrow.y1;
        let midX = (arrow.x1 + arrow.x2) / 2;

        if (source) {
          startY = source.minY - gap;
          midX = source.centerX;
        }

        arrow.y1 = startY;
        arrow.y2 = startY - desiredVerticalLen;
        arrow.x1 = midX;
        arrow.x2 = midX;

        if (target) {
          const desiredTargetMaxY = arrow.y2 - gap;
          const shiftY = desiredTargetMaxY - target.maxY;
          const shiftX = midX - target.centerX;
          this.shiftEntityAndContent(target, shiftX, shiftY, state);
        }
      }
    }

    // 3. Ajuste final de seguridad de flechas sueltas
    this.adjustArrowsToMolecules(state, 18);
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
      const boxAtoms = this.getAtomsForBox(b, state, target.minX, target.maxX, target.minY, target.maxY);
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


  // --- js/chem-engine/problem-builder.js ---
/**
 * problem-builder.js - Asistente de construcción de problemas y esquemas de reacción IChO
 * Permite colocar flechas con tamaño estándar y genera automáticamente recuadros de
 * compuestos correlativos (A, B, C...) que se auto-ajustan al contenido molecular.
 */


class ProblemBuilder {
  /**
   * Obtiene la siguiente letra correlativa para un recuadro de compuesto ('A', 'B', 'C'...)
   */
  static getNextLabel(state) {
    const existingLabels = new Set();
    for (const box of state.referenceBoxes.values()) {
      if (box.label) existingLabels.add(box.label.toUpperCase());
    }
    for (const label of state.textLabels.values()) {
      if (label.text && label.text.length === 1) existingLabels.add(label.text.toUpperCase());
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i];
      if (!existingLabels.has(letter)) return letter;
    }
    return `C${existingLabels.size + 1}`;
  }

  /** Distancia de un punto al rectángulo de un recuadro (0 si está dentro) */
  static distPointToBox(px, py, b) {
    const cx = Math.max(b.x, Math.min(px, b.x + b.width));
    const cy = Math.max(b.y, Math.min(py, b.y + b.height));
    return Math.hypot(px - cx, py - cy);
  }

  /** Recuadro de compuesto existente que se solapa con el rectángulo dado (o null) */
  static findOverlappingBox(rect, state, exclude = null, margin = 6) {
    for (const b of state.referenceBoxes.values()) {
      if (b.boxType !== 'compound' || b === exclude) continue;
      if (rect.x < b.x + b.width + margin && rect.x + rect.width + margin > b.x &&
          rect.y < b.y + b.height + margin && rect.y + rect.height + margin > b.y) {
        return b;
      }
    }
    return null;
  }

  /** Recuadro de compuesto cuyo borde está cerca de un punto (para unir flechas a recuadros) */
  static findBoxNearPoint(px, py, state, exclude = null, maxDist = 45) {
    let best = null, bestD = maxDist;
    for (const b of state.referenceBoxes.values()) {
      if (b.boxType !== 'compound' || b === exclude) continue;
      const d = this.distPointToBox(px, py, b);
      if (d < bestD) { bestD = d; best = b; }
    }
    return best;
  }

  /** ¿Ya hay una flecha que sale de 'src' y llega a 'tgt'? */
  static arrowConnects(src, tgt, state) {
    for (const a of state.arrows.values()) {
      if (this.distPointToBox(a.x1, a.y1, src) < 45 && this.distPointToBox(a.x2, a.y2, tgt) < 45) return true;
    }
    return false;
  }

  /**
   * Punto del borde de 'box' donde termina una flecha que sale de 'source' en la dirección 'dir'
   * (se usa al reutilizar un recuadro existente, p. ej. al cerrar un ciclo).
   */
  static arrowEndAtBox(source, box, dir, gap = 16) {
    const scx = source.x + source.width / 2, scy = source.y + source.height / 2;
    const bcx = box.x + box.width / 2, bcy = box.y + box.height / 2;
    if (dir === 'right') return { x1: source.x + source.width + gap, y1: scy, x2: box.x - gap, y2: bcy };
    if (dir === 'left') return { x1: source.x - gap, y1: scy, x2: box.x + box.width + gap, y2: bcy };
    if (dir === 'down') return { x1: scx, y1: source.y + source.height + gap, x2: bcx, y2: box.y - gap };
    return { x1: scx, y1: source.y - gap, x2: bcx, y2: box.y + box.height + gap };
  }

  /**
   * Modo problema sobre un dibujo existente, guiado por las flechas:
   *  1. Nodos = moléculas dibujadas + letras sueltas de intermediario (A, B, F...).
   *     Una letra justo debajo de una molécula es el nombre de esa molécula, no otro nodo.
   *  2. Cada flecha (también las de varios tramos, como una flecha sin punta seguida de otra)
   *     une el nodo de su cola con el de su punta; "+" une co-reactivos.
   *  3. Solo se enmarcan las moléculas que forman parte de la ruta (las de definiciones o
   *     abreviaturas sueltas se dejan como están). Sin flechas, se enmarcan todas.
   *  4. Las letras pasan a ser incógnitas con su misma letra. Las moléculas conocidas se rotulan
   *     en el orden de la síntesis: con números (1, 2...) si el examen ya usa letras para las
   *     incógnitas, o con letras (A, B, C...) si no hay ninguna.
   * Devuelve el número de recuadros creados.
   */
  static autoBoxExistingScheme(state) {
    state.saveSnapshot();
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
    const rectDist = (px, py, r) => {
      const cx = Math.max(r.minX, Math.min(px, r.maxX));
      const cy = Math.max(r.minY, Math.min(py, r.maxY));
      return Math.hypot(px - cx, py - cy);
    };
    const existingCompounds = Array.from(state.referenceBoxes.values()).filter(b => b.boxType === 'compound');
    const unknownSize = (text) => ({ W: Math.max(44, Math.round(text.length * 23 + 18)), H: 56 });

    // 1. Nodos
    const nodes = [];
    for (const mol of getAllMolecules(state)) {
      if (!mol.bbox || mol.atoms.length === 0) continue;
      const { centerX, centerY } = mol.bbox;
      if (existingCompounds.some(b => inside(b, centerX, centerY))) continue;
      nodes.push({ kind: 'mol', mol, rect: mol.bbox, cx: centerX, cy: centerY, letter: null });
    }
    const letterLabels = Array.from(state.textLabels.values())
      .filter(l => l.isIntermediary && l.text && String(l.text).trim().length <= 4);
    for (const l of letterLabels) {
      const text = String(l.text).trim();
      let owner = null, best = Infinity;
      for (const n of nodes) {
        if (n.kind !== 'mol' || n.letter) continue;
        const r = n.rect;
        // debajo de la molécula o sobre su mitad inferior (moléculas grandes con la letra encima)
        if (l.x < r.minX - 30 || l.x > r.maxX + 30 || l.y < Math.min(n.cy, r.maxY - 15) || l.y > r.maxY + 70) continue;
        const d = Math.abs(l.x - n.cx) + Math.abs(l.y - r.maxY);
        if (d < best) { best = d; owner = n; }
      }
      if (owner) {
        owner.letter = text;
        owner.letterLabel = l;
      } else {
        const { W, H } = unknownSize(text);
        const cy = l.y - 8;
        nodes.push({ kind: 'letter', label: l, letter: text, cx: l.x, cy,
          rect: { minX: l.x - W / 2, maxX: l.x + W / 2, minY: cy - H / 2, maxY: cy + H / 2 } });
      }
    }

    // 2. Tramos de flecha (las bifurcaciones y convergencias aportan dos tramos)
    const legs = [];
    for (const a of state.arrows.values()) {
      if (![a.x1, a.y1, a.x2, a.y2].every(Number.isFinite)) continue;
      if (a.type === 'fork') {
        const yTop = a.yTop !== undefined ? a.yTop : a.y1 - 75;
        const yBot = a.yBottom !== undefined ? a.yBottom : a.y1 + 75;
        legs.push({ sx: a.x1, sy: a.y1, ex: a.x2, ey: yTop }, { sx: a.x1, sy: a.y1, ex: a.x2, ey: yBot });
      } else if (a.type === 'converge') {
        const yTop = a.yTop !== undefined ? a.yTop : a.y2 - 75;
        const yBot = a.yBottom !== undefined ? a.yBottom : a.y2 + 75;
        legs.push({ sx: a.x1, sy: yTop, ex: a.x2, ey: a.y2 }, { sx: a.x1, sy: yBot, ex: a.x2, ey: a.y2 });
      } else if (getArrowBendCorner(a)) {
        // Flecha en "L": dos tramos que se encadenan por la esquina
        const c = getArrowBendCorner(a);
        legs.push({ sx: a.x1, sy: a.y1, ex: c.x, ey: c.y }, { sx: c.x, sy: c.y, ex: a.x2, ey: a.y2 });
      } else {
        legs.push({ sx: a.x1, sy: a.y1, ex: a.x2, ey: a.y2 });
      }
    }

    // Nodo más cercano a un extremo; se penaliza lo que queda "detrás" según el sentido de la flecha
    const TOL = 160;
    const nearestNode = (px, py, dx, dy, exclude) => {
      let found = null, bestScore = TOL;
      for (const n of nodes) {
        if (n === exclude) continue;
        const d = rectDist(px, py, n.rect);
        if (d > TOL) continue;
        const along = (n.cx - px) * dx + (n.cy - py) * dy;
        const score = d + (along < 0 && d > 0 ? -along * 0.5 : 0);
        if (score < bestScore) { bestScore = score; found = n; }
      }
      return found;
    };
    const dirOf = (g) => {
      const len = Math.hypot(g.ex - g.sx, g.ey - g.sy) || 1;
      return { dx: (g.ex - g.sx) / len, dy: (g.ey - g.sy) / len };
    };
    const JOIN = 14;
    // Cola: si no hay nodo, seguir hacia atrás por el tramo que termina aquí (flechas de varios tramos)
    const resolveStart = (g, seen = new Set()) => {
      if (seen.has(g)) return null;
      seen.add(g);
      const prev = legs.find(o => o !== g && Math.hypot(o.ex - g.sx, o.ey - g.sy) < JOIN);
      const { dx, dy } = dirOf(g);
      const n = nearestNode(g.sx, g.sy, -dx, -dy, null);
      if (n && (!prev || rectDist(g.sx, g.sy, n.rect) < 20)) return n;
      return prev ? resolveStart(prev, seen) : n;
    };
    const resolveEnd = (g, seen = new Set()) => {
      if (seen.has(g)) return null;
      seen.add(g);
      const next = legs.find(o => o !== g && Math.hypot(o.sx - g.ex, o.sy - g.ey) < JOIN);
      const { dx, dy } = dirOf(g);
      const n = nearestNode(g.ex, g.ey, dx, dy, null);
      if (n && (!next || rectDist(g.ex, g.ey, n.rect) < 20)) return n;
      return next ? resolveEnd(next, seen) : n;
    };

    const edges = new Map(); // nodo -> Set(nodos siguientes)
    const addEdge = (s, t) => {
      if (!s || !t || s === t) return;
      if (!edges.has(s)) edges.set(s, new Set());
      edges.get(s).add(t);
    };
    for (const g of legs) addEdge(resolveStart(g), resolveEnd(g));

    // "+" entre dos moléculas: el compañero comparte las mismas flechas (co-reactivo / co-producto)
    for (const plus of state.textLabels.values()) {
      if (String(plus.text).trim() !== '+') continue;
      const side = (left) => {
        let found = null, best = 90;
        for (const n of nodes) {
          if (n.kind !== 'mol') continue;
          if (plus.y < n.rect.minY - 30 || plus.y > n.rect.maxY + 30) continue;
          const d = left ? plus.x - n.rect.maxX : n.rect.minX - plus.x;
          if (d >= -5 && d < best) { best = d; found = n; }
        }
        return found;
      };
      const L = side(true), R = side(false);
      if (!L || !R) continue;
      for (const [a, b] of [[L, R], [R, L]]) {
        for (const t of (edges.get(a) || [])) addEdge(b, t);
        for (const [s, ts] of Array.from(edges.entries())) if (ts.has(a)) addEdge(s, b);
      }
    }

    // 3. Nodos que entran en la ruta
    const inRoute = new Set();
    for (const [s, ts] of edges) { inRoute.add(s); for (const t of ts) inRoute.add(t); }
    const noArrows = legs.length === 0;
    // (una molécula con su letra también es parte del examen aunque ninguna flecha la toque)
    const routeNodes = nodes.filter(n => n.kind === 'letter' || n.letter || noArrows || inRoute.has(n));

    // Orden de síntesis: orden topológico siguiendo las flechas (empates: izquierda→derecha, arriba→abajo)
    const geo = (a, b) => (a.cx - b.cx) || (a.cy - b.cy);
    const indeg = new Map(routeNodes.map(n => [n, 0]));
    for (const [s, ts] of edges) if (indeg.has(s)) for (const t of ts) if (indeg.has(t)) indeg.set(t, indeg.get(t) + 1);
    const ordered = [];
    const done = new Set();
    let queue = routeNodes.filter(n => indeg.get(n) === 0).sort(geo);
    while (ordered.length < routeNodes.length) {
      if (queue.length === 0) {
        // ciclo: seguir por el nodo pendiente más a la izquierda
        queue = [routeNodes.filter(n => !done.has(n)).sort(geo)[0]];
      }
      const n = queue.shift();
      if (done.has(n)) continue;
      done.add(n);
      ordered.push(n);
      const next = Array.from(edges.get(n) || []).filter(t => indeg.has(t) && !done.has(t));
      for (const t of next) indeg.set(t, indeg.get(t) - 1);
      queue.push(...next.filter(t => indeg.get(t) <= 0));
      queue.sort(geo);
    }

    // 4. Recuadros
    const usesLetters = nodes.some(n => n.letter);
    const usedLetters = new Set(nodes.filter(n => n.letter).map(n => n.letter.toUpperCase()));
    for (const b of state.referenceBoxes.values()) if (b.label) usedLetters.add(String(b.label).toUpperCase());
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let letterIdx = 0, numberIdx = 0;
    const nextKnownLabel = () => {
      if (usesLetters) {
        do { numberIdx++; } while (usedLetters.has(String(numberIdx)));
        usedLetters.add(String(numberIdx));
        return String(numberIdx);
      }
      while (letterIdx < alphabet.length && usedLetters.has(alphabet[letterIdx])) letterIdx++;
      const l = letterIdx < alphabet.length ? alphabet[letterIdx++] : `C${++numberIdx}`;
      usedLetters.add(l);
      return l;
    };

    let created = 0;
    const unknownBoxes = [];
    for (const n of ordered) {
      if (n.kind === 'mol') {
        const { centerX, centerY, width, height } = n.rect;
        const halfW = Math.max(70, Math.round(width / 2 + 26));
        const halfH = Math.max(55, Math.round(height / 2 + 28));
        state.addReferenceBox({
          boxType: 'compound', label: n.letter || nextKnownLabel(),
          x: Math.round(centerX - halfW), y: Math.round(centerY - halfH), width: halfW * 2, height: halfH * 2
        });
        if (n.letterLabel) state.removeTextLabel(n.letterLabel.id);
      } else {
        const { W, H } = unknownSize(n.letter);
        const box = state.addReferenceBox({
          boxType: 'compound', label: n.letter,
          x: Math.round(n.cx - W / 2), y: Math.round(n.cy - H / 2), width: W, height: H,
          unknownLetter: n.letter, manualUnknown: true, isUnknown: true, compacted: true
        });
        unknownBoxes.push(box);
        state.removeTextLabel(n.label.id);
      }
      created++;
    }

    // 5. Texto pequeño justo debajo de una incógnita (su fórmula) -> fórmula del recuadro
    for (const l of Array.from(state.textLabels.values())) {
      if (l.isIntermediary || !l.text) continue;
      const box = unknownBoxes.find(b => Math.abs(l.x - (b.x + b.width / 2)) < 40 &&
        l.y > b.y + b.height / 2 && l.y < b.y + b.height + 40);
      if (box && !box.description) {
        box.description = String(l.text).trim();
        state.removeTextLabel(l.id);
      }
    }

    this.assignUnknownLetters(state);
    return created;
  }

  /**
   * Crea un paso inicial de reacción: [ Recuadro A ] ────> [ Recuadro B ]
   */
  static createInitialStep(startX, startY, state) {
    state.saveSnapshot();

    const boxWidth = 140;
    const boxHeight = 110;
    const arrowLength = 110;
    const gap = 16;

    const labelA = this.getNextLabel(state);
    const boxA = state.addReferenceBox({
      boxType: 'compound',
      label: labelA,
      x: startX,
      y: startY - boxHeight / 2,
      width: boxWidth,
      height: boxHeight
    });

    const arrowX1 = boxA.x + boxA.width + gap;
    const arrowY = startY;
    const arrowX2 = arrowX1 + arrowLength;

    const arrow = state.addArrow({
      x1: arrowX1,
      y1: arrowY,
      x2: arrowX2,
      y2: arrowY,
      type: 'normal',
      reagentsTop: '',
      reagentsBottom: ''
    });

    const labelB = this.getNextLabel(state);
    const boxB = state.addReferenceBox({
      boxType: 'compound',
      label: labelB,
      x: arrowX2 + gap,
      y: startY - boxHeight / 2,
      width: boxWidth,
      height: boxHeight
    });

    this.assignUnknownLetters(state);

    return { boxA, arrow, boxB };
  }

  /**
   * Extiende un esquema a partir de un recuadro existente en una dirección (right, down, up, left)
   */
  static extendFromBox(sourceBox, direction = 'right', state) {
    state.saveSnapshot();

    const boxWidth = sourceBox.width || 140;
    const boxHeight = sourceBox.height || 110;
    const arrowLength = (direction === 'down' || direction === 'up') ? 76 : 110;
    const gap = 16;

    let arrowX1, arrowY1, arrowX2, arrowY2;
    let newBoxX, newBoxY;

    if (direction === 'right') {
      arrowX1 = sourceBox.x + sourceBox.width + gap;
      arrowY1 = sourceBox.y + sourceBox.height / 2;
      arrowX2 = arrowX1 + arrowLength;
      arrowY2 = arrowY1;
      newBoxX = arrowX2 + gap;
      newBoxY = sourceBox.y;
    } else if (direction === 'down') {
      arrowX1 = sourceBox.x + sourceBox.width / 2;
      arrowY1 = sourceBox.y + sourceBox.height + gap;
      arrowX2 = arrowX1;
      arrowY2 = arrowY1 + arrowLength;
      newBoxX = sourceBox.x;
      newBoxY = arrowY2 + gap;
    } else if (direction === 'up') {
      arrowX1 = sourceBox.x + sourceBox.width / 2;
      arrowY1 = sourceBox.y - gap;
      arrowX2 = arrowX1;
      arrowY2 = arrowY1 - arrowLength;
      newBoxX = sourceBox.x;
      newBoxY = arrowY2 - boxHeight - gap;
    } else { // left
      arrowX1 = sourceBox.x - gap;
      arrowY1 = sourceBox.y + sourceBox.height / 2;
      arrowX2 = arrowX1 - arrowLength;
      arrowY2 = arrowY1;
      newBoxX = arrowX2 - boxWidth - gap;
      newBoxY = sourceBox.y;
    }

    // Si el nuevo recuadro caería encima de uno existente (p. ej. clics repetidos o cerrar un
    // ciclo), se reutiliza ese recuadro en vez de encimar otro
    const existing = this.findOverlappingBox({ x: newBoxX, y: newBoxY, width: boxWidth, height: boxHeight }, state, sourceBox);
    if (existing) {
      if (this.arrowConnects(sourceBox, existing, state)) {
        return { arrow: null, newBox: existing, reused: true };
      }
      const p = this.arrowEndAtBox(sourceBox, existing, direction);
      const arrowToExisting = state.addArrow({ ...p, type: 'normal', reagentsTop: '', reagentsBottom: '' });
      this.assignUnknownLetters(state);
      return { arrow: arrowToExisting, newBox: existing, reused: true };
    }

    const arrow = state.addArrow({
      x1: arrowX1,
      y1: arrowY1,
      x2: arrowX2,
      y2: arrowY2,
      type: 'normal',
      reagentsTop: '',
      reagentsBottom: ''
    });

    const nextLabel = this.getNextLabel(state);
    const newBox = state.addReferenceBox({
      boxType: 'compound',
      label: nextLabel,
      unknownLetter: nextLabel,
      x: newBoxX,
      y: newBoxY,
      width: boxWidth,
      height: boxHeight
    });

    this.assignUnknownLetters(state);

    return { arrow, newBox };
  }

  /**
   * Bifurca el esquema desde un recuadro origen para rutas paralelas / estereoquímica (Anti / Syn).
   * Genera una flecha de bifurcación (fork arrow) y dos recuadros de compuestos paralelos (arriba y abajo).
   */
  static createForkStep(sourceBox, state, direction = null) {
    state.saveSnapshot();

    const dir = direction || sourceBox.activeAxis || 'right';
    const boxWidth = sourceBox.width || 140;
    const boxHeight = sourceBox.height || 110;
    const branchSpacing = 150;
    const gap = 16;
    const stemLen = 70;
    const branchLen = 50;

    let arrowX1, arrowY1, arrowX2, arrowY2, stemEndX, stemEndY;
    let yTop, yBottom, xTop, xBottom;
    let box1X, box1Y, box2X, box2Y;

    if (dir === 'left') {
      arrowX1 = sourceBox.x - gap;
      arrowY1 = sourceBox.y + sourceBox.height / 2;
      stemEndX = arrowX1 - stemLen;
      arrowX2 = stemEndX - branchLen;
      arrowY2 = arrowY1;
      yTop = arrowY1 - branchSpacing / 2;
      yBottom = arrowY1 + branchSpacing / 2;
      box1X = arrowX2 - gap - boxWidth;
      box1Y = yTop - boxHeight / 2;
      box2X = arrowX2 - gap - boxWidth;
      box2Y = yBottom - boxHeight / 2;
    } else if (dir === 'down') {
      arrowX1 = sourceBox.x + sourceBox.width / 2;
      arrowY1 = sourceBox.y + sourceBox.height + gap;
      stemEndY = arrowY1 + stemLen;
      arrowX2 = arrowX1;
      arrowY2 = stemEndY + branchLen;
      xTop = arrowX1 - branchSpacing / 2;
      xBottom = arrowX1 + branchSpacing / 2;
      box1X = xTop - boxWidth / 2;
      box1Y = arrowY2 + gap;
      box2X = xBottom - boxWidth / 2;
      box2Y = arrowY2 + gap;
    } else if (dir === 'up') {
      arrowX1 = sourceBox.x + sourceBox.width / 2;
      arrowY1 = sourceBox.y - gap;
      stemEndY = arrowY1 - stemLen;
      arrowX2 = arrowX1;
      arrowY2 = stemEndY - branchLen;
      xTop = arrowX1 - branchSpacing / 2;
      xBottom = arrowX1 + branchSpacing / 2;
      box1X = xTop - boxWidth / 2;
      box1Y = arrowY2 - gap - boxHeight;
      box2X = xBottom - boxWidth / 2;
      box2Y = arrowY2 - gap - boxHeight;
    } else { // 'right'
      arrowX1 = sourceBox.x + sourceBox.width + gap;
      arrowY1 = sourceBox.y + sourceBox.height / 2;
      stemEndX = arrowX1 + stemLen;
      arrowX2 = stemEndX + branchLen;
      arrowY2 = arrowY1;
      yTop = arrowY1 - branchSpacing / 2;
      yBottom = arrowY1 + branchSpacing / 2;
      box1X = arrowX2 + gap;
      box1Y = yTop - boxHeight / 2;
      box2X = arrowX2 + gap;
      box2Y = yBottom - boxHeight / 2;
    }

    const forkArrow = state.addArrow({
      x1: arrowX1,
      y1: arrowY1,
      x2: arrowX2,
      y2: arrowY2,
      type: 'fork',
      direction: dir,
      stemEndX,
      stemEndY,
      branchSpacing,
      yTop,
      yBottom,
      xTop,
      xBottom,
      reagentsTop: '',
      reagentsBottom: ''
    });

    // Ramas: reutilizar un recuadro existente si la posición ya está ocupada
    const makeBranchBox = (bx, by) => {
      const existing = this.findOverlappingBox({ x: bx, y: by, width: boxWidth, height: boxHeight }, state, sourceBox);
      if (existing) return existing;
      const label = this.getNextLabel(state);
      return state.addReferenceBox({
        boxType: 'compound', label, unknownLetter: label,
        x: bx, y: by, width: boxWidth, height: boxHeight
      });
    };
    const boxTop = makeBranchBox(box1X, box1Y);
    const boxBottom = makeBranchBox(box2X, box2Y);

    this.assignUnknownLetters(state);

    return { forkArrow, boxTop, boxBottom };
  }

  /**
   * Cierra una bifurcación: dos compuestos (superior e inferior) convergen
   * mediante una flecha de convergencia hacia un único producto final.
   */
  static createConvergeStep(sourceBoxTop, sourceBoxBottom, state) {
    state.saveSnapshot();

    const boxWidth = 140;
    const boxHeight = 110;
    const gap = 16;
    const branchLen = 45;
    const stemLen = 80;

    const x1 = Math.max(sourceBoxTop.x + sourceBoxTop.width, sourceBoxBottom.x + sourceBoxBottom.width) + gap;
    const yTop = sourceBoxTop.y + sourceBoxTop.height / 2;
    const yBottom = sourceBoxBottom.y + sourceBoxBottom.height / 2;
    const yMid = (yTop + yBottom) / 2;
    const stemStartX = x1 + branchLen;
    const x2 = stemStartX + stemLen;

    const convergeArrow = state.addArrow({
      x1,
      y1: yMid,
      x2,
      y2: yMid,
      type: 'converge',
      yTop,
      yBottom,
      yMid,
      stemStartX,
      branchSpacing: Math.abs(yBottom - yTop),
      reagentsTop: '',
      reagentsBottom: ''
    });

    const tgtRect = { x: x2 + gap, y: yMid - boxHeight / 2, width: boxWidth, height: boxHeight };
    let targetBox = this.findOverlappingBox(tgtRect, state);
    if (!targetBox) {
      const nextLabel = this.getNextLabel(state);
      targetBox = state.addReferenceBox({ boxType: 'compound', label: nextLabel, ...tgtRect });
    }

    this.assignUnknownLetters(state);

    return { convergeArrow, targetBox };
  }

  /**
   * Encuentra todos los átomos de las moléculas que están dentro o intersectan un recuadro de compuesto.
   * Expande a través de los enlaces para asegurar que toda la molécula (ej. carbonilo =O, oxima, etc.)
   * se mantenga íntegra y nunca se corte o rompa.
   */
  static getAtomsInsideBox(box, state) {
    if (!state || !state.atoms) return [];
    const minX = box.x;
    const maxX = box.x + box.width;
    const minY = box.y;
    const maxY = box.y + box.height;

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
   * Auto-ajusta el tamaño y posición de un recuadro según las moléculas que contiene
   */
  static autoFitBox(box, state, padding = 26) {
    if (box.boxType !== 'compound') return false;

    const atoms = this.getAtomsInsideBox(box, state);
    if (atoms.length === 0) return false;

    const bbox = getMoleculeBoundingBox(atoms, state, 2.0);
    if (!bbox) return false;

    const padX = padding;
    const padY = 28;

    const halfW = Math.max(70, Math.round(bbox.width / 2 + padX));
    const halfH = Math.max(55, Math.round(bbox.height / 2 + padY));

    box.width = halfW * 2;
    box.height = halfH * 2;
    box.x = Math.round(bbox.centerX - halfW);
    box.y = Math.round(bbox.centerY - halfH);

    return true;
  }

  /**
   * Auto-ajusta todos los recuadros de compuestos del lienzo
   */
  static autoFitAllBoxes(state) {
    let changed = false;
    for (const box of state.referenceBoxes.values()) {
      if (box.boxType === 'compound') {
        if (this.autoFitBox(box, state)) changed = true;
      }
    }
    return changed;
  }

  /**
   * Asigna automáticamente letras correlativas de incógnita (A, B, C...) a los recuadros
   * de compuestos que queden vacíos (sin estructura) dentro del flujo de reacción.
   */
  static assignUnknownLetters(state) {
    if (!state || !state.referenceBoxes) return;

    const compoundBoxes = Array.from(state.referenceBoxes.values())
      .filter(b => b.boxType === 'compound');

    if (compoundBoxes.length === 0) return;

    // 1. Construir grafo dirigido según las flechas de reacción para determinar el orden de síntesis
    const adj = new Map();
    const inDegree = new Map();
    for (const b of compoundBoxes) {
      adj.set(b.id, new Set());
      inDegree.set(b.id, 0);
    }

    const distPointToBox = (px, py, b) => {
      const clampX = Math.max(b.x, Math.min(px, b.x + b.width));
      const clampY = Math.max(b.y, Math.min(py, b.y + b.height));
      return Math.hypot(px - clampX, py - clampY);
    };

    const arrows = Array.from(state.arrows.values());
    for (const arrow of arrows) {
      if (arrow.type === 'normal') {
        let src = null, minSrcDist = 80;
        for (const b of compoundBoxes) {
          const d = distPointToBox(arrow.x1, arrow.y1, b);
          if (d < minSrcDist) { minSrcDist = d; src = b; }
        }
        let tgt = null, minTgtDist = 80;
        for (const b of compoundBoxes) {
          if (b === src) continue;
          const d = distPointToBox(arrow.x2, arrow.y2, b);
          if (d < minTgtDist) { minTgtDist = d; tgt = b; }
        }
        if (src && tgt && !adj.get(src.id).has(tgt.id)) {
          adj.get(src.id).add(tgt.id);
          inDegree.set(tgt.id, inDegree.get(tgt.id) + 1);
        }
      } else if (arrow.type === 'fork') {
        let src = null, minSrcDist = 80;
        for (const b of compoundBoxes) {
          const d = distPointToBox(arrow.x1, arrow.y1, b);
          if (d < minSrcDist) { minSrcDist = d; src = b; }
        }
        const yTop = arrow.yTop !== undefined ? arrow.yTop : (arrow.y1 - 75);
        const yBot = arrow.yBottom !== undefined ? arrow.yBottom : (arrow.y1 + 75);
        let tgtTop = null, minTopDist = 80;
        let tgtBot = null, minBotDist = 80;
        for (const b of compoundBoxes) {
          if (b === src) continue;
          const dTop = distPointToBox(arrow.x2, yTop, b);
          if (dTop < minTopDist) { minTopDist = dTop; tgtTop = b; }
          const dBot = distPointToBox(arrow.x2, yBot, b);
          if (dBot < minBotDist) { minBotDist = dBot; tgtBot = b; }
        }
        if (src && tgtTop && !adj.get(src.id).has(tgtTop.id)) {
          adj.get(src.id).add(tgtTop.id);
          inDegree.set(tgtTop.id, inDegree.get(tgtTop.id) + 1);
        }
        if (src && tgtBot && !adj.get(src.id).has(tgtBot.id)) {
          adj.get(src.id).add(tgtBot.id);
          inDegree.set(tgtBot.id, inDegree.get(tgtBot.id) + 1);
        }
      } else if (arrow.type === 'converge') {
        const yTop = arrow.yTop !== undefined ? arrow.yTop : (arrow.y2 - 75);
        const yBot = arrow.yBottom !== undefined ? arrow.yBottom : (arrow.y2 + 75);
        let srcTop = null, minSrcTopDist = 80;
        let srcBot = null, minSrcBotDist = 80;
        for (const b of compoundBoxes) {
          const dTop = distPointToBox(arrow.x1, yTop, b);
          if (dTop < minSrcTopDist) { minSrcTopDist = dTop; srcTop = b; }
          const dBot = distPointToBox(arrow.x1, yBot, b);
          if (dBot < minSrcBotDist) { minSrcBotDist = dBot; srcBot = b; }
        }
        let tgt = null, minTgtDist = 80;
        for (const b of compoundBoxes) {
          if (b === srcTop || b === srcBot) continue;
          const d = distPointToBox(arrow.x2, arrow.y2, b);
          if (d < minTgtDist) { minTgtDist = d; tgt = b; }
        }
        if (srcTop && tgt && !adj.get(srcTop.id).has(tgt.id)) {
          adj.get(srcTop.id).add(tgt.id);
          inDegree.set(tgt.id, inDegree.get(tgt.id) + 1);
        }
        if (srcBot && tgt && !adj.get(srcBot.id).has(tgt.id)) {
          adj.get(srcBot.id).add(tgt.id);
          inDegree.set(tgt.id, inDegree.get(tgt.id) + 1);
        }
      }
    }

    // 2. Ordenamiento topológico siguiendo la síntesis (flechas)
    const ordered = [];
    const queue = compoundBoxes.filter(b => inDegree.get(b.id) === 0);
    // Ordenar orígenes por X ascendente y luego Y ascendente
    queue.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);

    const visited = new Set();
    while (queue.length > 0) {
      const curr = queue.shift();
      if (visited.has(curr.id)) continue;
      visited.add(curr.id);
      ordered.push(curr);

      const nextBoxes = Array.from(adj.get(curr.id)).map(id => state.referenceBoxes.get(id)).filter(Boolean);
      nextBoxes.sort((a, b) => a.y - b.y);
      for (const nxt of nextBoxes) {
        inDegree.set(nxt.id, inDegree.get(nxt.id) - 1);
        if (inDegree.get(nxt.id) <= 0 && !visited.has(nxt.id)) {
          queue.push(nxt);
        }
      }
    }

    // Agregar cualquier recuadro no alcanzado por flechas en orden geométrico (x, y)
    for (const b of compoundBoxes) {
      if (!visited.has(b.id)) {
        ordered.push(b);
        visited.add(b.id);
      }
    }

    // 3. Asignar letras correlativas a las cajas vacías (incógnitas)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const usedManualLetters = new Set();
    for (const box of ordered) {
      if (box.manualUnknown && box.unknownLetter) {
        usedManualLetters.add(String(box.unknownLetter).trim().toUpperCase());
      }
    }

    let unknownIdx = 0;
    for (const box of ordered) {
      const atoms = this.getAtomsInsideBox(box, state);
      if (atoms.length === 0) {
        box.isUnknown = true;
        if (!box.manualUnknown) {
          // Si el rótulo de esquina es A, B, C, D... usarlo para coincidir exactamente con el esquema del estudiante
          const candidate = (box.label && /^[A-Z]$/.test(box.label.trim())) 
            ? box.label.trim() 
            : alphabet[unknownIdx % alphabet.length];
          
          if (!usedManualLetters.has(candidate)) {
            box.unknownLetter = candidate;
          } else {
            while (usedManualLetters.has(alphabet[unknownIdx % alphabet.length]) && unknownIdx < 52) {
              unknownIdx++;
            }
            box.unknownLetter = alphabet[unknownIdx % alphabet.length];
          }
          unknownIdx++;
        }
      } else {
        box.isUnknown = false;
        box.unknownLetter = null;
        box.manualUnknown = false;
      }
    }

  }

  /**
   * Al encajar el esquema, las incógnitas vacías al final de la ruta ocupan solo lo que mide
   * su letra (estilo IChO: "→ H1") en vez del tamaño de un recuadro de molécula.
   * No se hace al crear los recuadros, para que haya espacio donde dibujar la molécula.
   */
  static compactLeafUnknowns(state) {
    for (const box of state.referenceBoxes.values()) {
      if (box.boxType !== 'compound') continue;
      if (this.getAtomsInsideBox(box, state).length > 0) continue;
      this.compactEmptyBox(box, state);
    }
  }

  /**
   * Reduce un recuadro de incógnita vacío (al final de la ruta) al tamaño de su letra,
   * conservando el lado por el que llega su flecha para que la letra quede junto a la punta.
   * Los recuadros redimensionados a mano (userSized) no se tocan.
   */
  static compactEmptyBox(box, state) {
    if (!box || box.userSized) return;
    const letter = String(box.unknownLetter || box.label || 'A').trim() || 'A';
    const W = Math.max(44, Math.round(letter.length * 23 + 18));
    const H = 56;
    if (Math.abs(box.width - W) < 0.5 && Math.abs(box.height - H) < 0.5) return;

    const distToBox = (px, py) => {
      const cx = Math.max(box.x, Math.min(px, box.x + box.width));
      const cy = Math.max(box.y, Math.min(py, box.y + box.height));
      return Math.hypot(px - cx, py - cy);
    };

    // Puntos donde llegan / salen flechas, con su dirección
    const ends = [];
    const starts = [];
    for (const a of state.arrows.values()) {
      const sx = Math.sign(a.x2 - a.x1);
      const sy = Math.sign(a.y2 - a.y1);
      const horizontal = Math.abs(a.x2 - a.x1) >= Math.abs(a.y2 - a.y1);
      const dir = horizontal ? { dx: sx, dy: 0 } : { dx: 0, dy: sy };
      if (a.type === 'fork') {
        if (horizontal) {
          ends.push({ x: a.x2, y: a.yTop !== undefined ? a.yTop : a.y2, dir });
          ends.push({ x: a.x2, y: a.yBottom !== undefined ? a.yBottom : a.y2, dir });
        } else {
          ends.push({ x: a.xTop !== undefined ? a.xTop : a.x2, y: a.y2, dir });
          ends.push({ x: a.xBottom !== undefined ? a.xBottom : a.x2, y: a.y2, dir });
        }
        starts.push({ x: a.x1, y: a.y1, dir });
      } else if (a.type === 'converge') {
        ends.push({ x: a.x2, y: a.y2, dir });
        starts.push({ x: a.x1, y: a.yTop !== undefined ? a.yTop : a.y1, dir });
        starts.push({ x: a.x1, y: a.yBottom !== undefined ? a.yBottom : a.y1, dir });
      } else {
        ends.push({ x: a.x2, y: a.y2, dir });
        starts.push({ x: a.x1, y: a.y1, dir });
      }
    }
    const nearest = (pts) => {
      let best = null, bestD = 80;
      for (const p of pts) {
        const d = distToBox(p.x, p.y);
        if (d < bestD) { bestD = d; best = p; }
      }
      return best;
    };

    // Solo se compactan incógnitas al final de la ruta (sin flecha de salida): si ya sale una
    // flecha, encoger el recuadro la separaría de él y el esquema dejaría de reconocer la conexión.
    // Al extender desde una incógnita compacta, la flecha nueva ya nace junto a su letra.
    if (nearest(starts)) return;

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    let nx = cx - W / 2;
    let ny = cy - H / 2;

    const incoming = nearest(ends);
    if (incoming) {
      // Conservar el lado por el que entra la flecha, para que la letra quede junto a la punta
      if (incoming.dir.dx > 0) nx = box.x;
      else if (incoming.dir.dx < 0) nx = box.x + box.width - W;
      else if (incoming.dir.dy > 0) ny = box.y;
      else if (incoming.dir.dy < 0) ny = box.y + box.height - H;
    }

    box.x = Math.round(nx);
    box.y = Math.round(ny);
    box.width = W;
    box.height = H;
    box.compacted = true;
  }
}


  // --- js/chem-engine/icho-data.js ---
/**
 * icho-data.js - Datos en memoria del esquema IChO de Glucopiranosa
 * Las dos sillas se construyen a partir de la plantilla PYRANOSE_CHAIR (templates.js),
 * así el ejemplo siempre usa la misma geometría que la herramienta de silla
 * (axiales alternados, ecuatoriales paralelos, 'depth' para los huecos en cruces).
 */


/**
 * Construye una silla piranosa con sustituyentes.
 * @param {string} prefix  prefijo de ids (p. ej. 'g_')
 * @param {number} cx, cy  centro del anillo
 * @param {Object} subs    { c1: ['axial', 'OH'], c2: ['equatorial', 'OH', 'left'], ... }
 *                         (3er valor opcional: lado forzado de la etiqueta, 'left' -> 'HO', 'BnO')
 * @param {string} c6Group grupo sobre el CH2 de C6 (C5–CH2–X, ecuatorial), p. ej. 'OH' u 'OBn'
 */
function buildPyranoseChair(prefix, cx, cy, subs, c6Group) {
  const tpl = RING_TEMPLATES.PYRANOSE_CHAIR;
  const atoms = [];
  const bonds = [];
  const ring = {};
  const chairId = `${prefix}chair`;

  for (const a of tpl.ringAtoms) {
    const atom = {
      id: `${prefix}${a.id}`,
      x: cx + a.x,
      y: cy + a.y,
      element: a.element,
      depth: a.depth,
      chairId,
      chairVertex: a.id,
      substituentGuides: tpl.substituents[a.id] || null
    };
    if (a.label) atom.label = a.label;
    atoms.push(atom);
    ring[a.id] = atom;
  }
  for (const b of tpl.ringBonds) {
    // Mismo estilo que la plantilla: borde frontal remarcado (cuñas + enlace grueso)
    const bond = { id: `${prefix}b_${b.a1}_${b.a2}`, atom1: `${prefix}${b.a1}`, atom2: `${prefix}${b.a2}`, type: b.type || 'single' };
    if (b.wedgeWidth) bond.wedgeWidth = b.wedgeWidth;
    if (b.boldWidth) bond.boldWidth = b.boldWidth;
    bonds.push(bond);
  }

  const addSub = (parent, dx, dy, element, label, id) => {
    const atom = { id, x: parent.x + dx, y: parent.y + dy, element, depth: parent.depth };
    if (label) atom.label = label;
    atoms.push(atom);
    bonds.push({ id: `${id}_b`, atom1: parent.id, atom2: id, type: 'single' });
    return atom;
  };

  for (const [vid, [pos, label, labelSide]] of Object.entries(subs)) {
    const g = tpl.substituents[vid][pos];
    const sub = addSub(ring[vid], g.dx, g.dy, 'O', label, `${prefix}${vid}_${pos}`);
    if (labelSide) sub.labelSide = labelSide;
  }

  if (c6Group) {
    // C5–CH2 (ecuatorial, abierto hacia arriba-izquierda) y luego el grupo casi vertical,
    // como en la silla de la IChO
    const g = tpl.substituents.c5.equatorial;
    const c6 = addSub(ring.c5, g.dx, g.dy, 'C', null, `${prefix}c6`);
    addSub(c6, 4, -28, 'O', c6Group, `${prefix}c6_o`);
  }
  return { atoms, bonds };
}

// Molécula 1: α-D-glucopiranosa (OH anomérico axial abajo, resto ecuatoriales)
const GLUCOSE = buildPyranoseChair('g_', 120, 150, {
  c1: ['axial', 'OH'],
  c2: ['equatorial', 'OH', 'left'], // 'HO' hacia la izquierda para no chocar con el OH de C1
  c3: ['equatorial', 'OH'],
  c4: ['equatorial', 'OH']
}, 'OH');

// Molécula 2: metil 2,3,6-tri-O-bencil-α-D-glucopiranósido (OMe axial abajo, 4-OH libre)
const INTERMEDIATE = buildPyranoseChair('g2_', 680, 320, {
  c1: ['axial', 'OMe'],
  c2: ['equatorial', 'OBn', 'left'], // 'BnO' hacia la izquierda para no chocar con el OMe de C1
  c3: ['equatorial', 'OBn'],
  c4: ['equatorial', 'OH']
}, 'OBn');

const ICHO_GLUCOSE_SCHEME = {
  version: "1.0",
  atoms: [...GLUCOSE.atoms, ...INTERMEDIATE.atoms],
  bonds: [...GLUCOSE.bonds, ...INTERMEDIATE.bonds],
  arrows: [
    {
      id: "arr_1",
      x1: 200,
      y1: 155,
      x2: 300,
      y2: 155,
      type: "normal",
      reagentsTop: "CH3OH, HCl",
      reagentsBottom: ""
    },
    {
      id: "arr_2",
      x1: 340,
      y1: 155,
      x2: 440,
      y2: 155,
      type: "normal",
      reagentsTop: "PhCH(OMe)2",
      reagentsBottom: "p-TsOH"
    },
    {
      id: "arr_3",
      x1: 480,
      y1: 155,
      x2: 580,
      y2: 155,
      type: "normal",
      reagentsTop: "NaH (excess)",
      reagentsBottom: "MeI (excess)"
    },
    {
      id: "arr_4",
      x1: 620,
      y1: 155,
      x2: 720,
      y2: 155,
      type: "normal",
      reagentsTop: "p-TsOH",
      reagentsBottom: "H2O"
    },
    {
      id: "arr_down_start",
      x1: 126,
      y1: 220,
      x2: 126,
      y2: 320,
      type: "normal",
      reagentsTop: "NaH (excess)\nMeI (excess)",
      reagentsBottom: ""
    },
    {
      id: "arr_f_to_g",
      x1: 155,
      y1: 340,
      x2: 255,
      y2: 340,
      type: "normal",
      reagentsTop: "H2O, HCl",
      reagentsBottom: ""
    },
    {
      id: "arr_b_to_inter",
      x1: 460,
      y1: 185,
      // Flecha doblada en L: baja desde B y gira hacia el glucósido de abajo
      x2: 556,
      y2: 319,
      bend: "vh",
      type: "normal",
      reagentsTop: "1) NaH, BnCl\n2) NaBH3CN",
      reagentsBottom: ""
    },
    {
      id: "arr_inter_to_e",
      x1: 805,
      y1: 345,
      x2: 895,
      y2: 345,
      type: "normal",
      reagentsTop: "1) Ac2O, Py",
      reagentsBottom: "2) DIBAL-H (excess)"
    }
  ],
  referenceBoxes: [
    {
      id: "ref_icho_1",
      x: 35,
      y: 435,
      width: 930,
      height: 80,
      title: "",
      items: [
        { abbr: "Ac", formula: "H3C-C(=O)~" },
        { abbr: "Bn", formula: "PhCH2" },
        { abbr: "DIBAL-H", formula: "i-Bu2AlH" },
        { abbr: "p-TsOH", formula: "H3C-C6H4-SO3H" },
        { abbr: "Py", formula: "Piridina" }
      ]
    }
  ],
  textLabels: [
    { id: "lbl_a", x: 320, y: 160, text: "A", isIntermediary: true },
    { id: "lbl_b", x: 460, y: 160, text: "B", isIntermediary: true },
    { id: "lbl_c", x: 600, y: 160, text: "C", isIntermediary: true },
    { id: "lbl_d", x: 740, y: 160, text: "D", isIntermediary: true },
    { id: "lbl_f", x: 126, y: 345, text: "F", isIntermediary: true },
    { id: "lbl_g", x: 275, y: 345, text: "G", isIntermediary: true },
    { id: "lbl_e", x: 925, y: 350, text: "E", isIntermediary: true }
  ]
};


  // --- js/chem-engine/examples.js ---
/**
 * examples.js - Galería de esquemas de ejemplo (Suzuki, diclofenaco, PAH helicoidal, IChO glucosa,
 * síntesis de un trisacárido, síntesis de tromboxano B2 y porfirinas).
 *
 * Los ejemplos se construyen por código con SchemeBuilder (enlace estándar de 38 px), así que
 * siguen las mismas reglas de dibujo que la app (etiquetas automáticas, cargas, sillas IChO...).
 */



const L = 38;
const rad = (deg) => (deg * Math.PI) / 180;
const vec = (deg, len = L) => ({ x: len * Math.cos(rad(deg)), y: len * Math.sin(rad(deg)) });
const STANDARD = ['C', 'H', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I'];

class SchemeBuilder {
  constructor(prefix) {
    this.p = prefix;
    this.n = 0;
    this.atoms = [];
    this.bonds = [];
    this.arrows = [];
    this.referenceBoxes = [];
    this.textLabels = [];
    this.byId = new Map();
    this.byPos = new Map();
  }

  nid(kind) { return `${this.p}${kind}${++this.n}`; }

  /** Átomo; label opcional (OBn, OMe...). Elementos fuera de la lista estándar llevan etiqueta fija. */
  atom(x, y, element = 'C', opts = {}) {
    const isStd = STANDARD.includes(element);
    const a = {
      id: this.nid('a'), x, y, element, charge: 0, lonePairs: 0,
      label: opts.label !== undefined ? opts.label : (isStd ? null : element),
      manualLabel: !isStd, isCustomLabel: !isStd,
      ...opts
    };
    this.atoms.push(a);
    this.byId.set(a.id, a);
    return a.id;
  }

  /** Átomo único por posición (para anillos fusionados) */
  atomAt(x, y, element = 'C') {
    const key = `${Math.round(x * 2)},${Math.round(y * 2)}`;
    if (!this.byPos.has(key)) this.byPos.set(key, this.atom(x, y, element));
    return this.byPos.get(key);
  }

  get(id) { return this.byId.get(id); }

  bond(a1, a2, type = 'single', opts = {}) {
    const exists = this.bonds.find(b => (b.atom1 === a1 && b.atom2 === a2) || (b.atom1 === a2 && b.atom2 === a1));
    if (exists) return exists;
    const b = { id: this.nid('b'), atom1: a1, atom2: a2, type, ...opts };
    this.bonds.push(b);
    return b;
  }

  /** Sustituyente desde un átomo en una dirección (grados, y hacia abajo). */
  sub(fromId, deg, element = 'C', label, type = 'single', len = L) {
    const a = this.get(fromId);
    const d = vec(deg, len);
    const opts = {};
    if (label !== undefined && label !== null) opts.label = label;
    if (typeof a.depth === 'number') opts.depth = a.depth;
    const id = this.atom(a.x + d.x, a.y + d.y, element, opts);
    this.bond(fromId, id, type);
    return id;
  }

  /** Cadena en zigzag: lista de ángulos; devuelve los ids (sin el inicial). */
  chain(fromId, angles, types = []) {
    const ids = [];
    let curr = fromId;
    angles.forEach((deg, i) => {
      curr = this.sub(curr, deg, 'C', undefined, types[i] || 'single');
      ids.push(curr);
    });
    return ids;
  }

  /** Polígono regular de lado L. startDeg = ángulo del primer vértice. Devuelve ids en orden. */
  ring(cx, cy, n, startDeg, elements = {}) {
    const r = L / (2 * Math.sin(Math.PI / n));
    const ids = [];
    for (let i = 0; i < n; i++) {
      const d = vec(startDeg + (360 / n) * i, r);
      ids.push(this.atomAt(cx + d.x, cy + d.y, elements[i] || 'C'));
    }
    for (let i = 0; i < n; i++) this.bond(ids[i], ids[(i + 1) % n]);
    return ids;
  }

  /** Hexágono construido sobre la arista a-b, del lado opuesto al punto 'away'. */
  hexOnEdge(aId, bId, away) {
    const a = this.get(aId), b = this.get(bId);
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    let nx = -(b.y - a.y), ny = b.x - a.x;
    const nl = Math.hypot(nx, ny);
    nx /= nl; ny /= nl;
    if ((away.x - mx) * nx + (away.y - my) * ny > 0) { nx = -nx; ny = -ny; }
    const h = (Math.sqrt(3) / 2) * L;
    const cx = mx + nx * h, cy = my + ny * h;
    const start = (Math.atan2(a.y - cy, a.x - cx) * 180) / Math.PI;
    return this.ring(cx, cy, 6, start);
  }

  /** Estructura de Kekulé: dobles alternados en los enlaces entre estos átomos (emparejamiento perfecto). */
  kekulize(atomIds) {
    const set = new Set(atomIds);
    const edges = this.bonds.filter(b => set.has(b.atom1) && set.has(b.atom2));
    const adj = new Map(atomIds.map(id => [id, []]));
    edges.forEach(e => { adj.get(e.atom1).push(e); adj.get(e.atom2).push(e); });
    const matched = new Map();
    const other = (e, a) => (e.atom1 === a ? e.atom2 : e.atom1);
    const solve = () => {
      let pick = null, best = Infinity;
      for (const a of atomIds) {
        if (matched.has(a)) continue;
        const opts = adj.get(a).filter(e => !matched.has(other(e, a)));
        if (opts.length < best) { best = opts.length; pick = [a, opts]; }
      }
      if (!pick) return true;
      if (best === 0) return false;
      const [a, opts] = pick;
      for (const e of opts) {
        const o = other(e, a);
        matched.set(a, e); matched.set(o, e);
        if (solve()) return true;
        matched.delete(a); matched.delete(o);
      }
      return false;
    };
    if (solve()) new Set(matched.values()).forEach(e => { e.type = 'double'; });
  }

  /** Silla de piranosa / ciclohexano a partir de la plantilla (modelo IChO). */
  chair(cx, cy, subs = {}, opts = {}) {
    const tpl = RING_TEMPLATES[opts.template || 'PYRANOSE_CHAIR'];
    const ring = {};
    for (const a of tpl.ringAtoms) {
      const id = this.atom(cx + a.x, cy + a.y, a.element, {
        depth: a.depth, chairVertex: a.id, substituentGuides: tpl.substituents[a.id] || null,
        ...(a.label ? { label: a.label } : {})
      });
      ring[a.id] = id;
    }
    for (const b of tpl.ringBonds) {
      this.bond(ring[b.a1], ring[b.a2], b.type || 'single', {
        ...(b.wedgeWidth ? { wedgeWidth: b.wedgeWidth } : {}),
        ...(b.boldWidth ? { boldWidth: b.boldWidth } : {})
      });
    }
    for (const [vid, [pos, label, extra = {}]] of Object.entries(subs)) {
      const g = tpl.substituents[vid][pos];
      const parent = this.get(ring[vid]);
      const element = extra.element || (label && label.startsWith('S') ? 'S' : 'O');
      const id = this.atom(parent.x + g.dx, parent.y + g.dy, element, { label, depth: parent.depth, ...(extra.side ? { labelSide: extra.side } : {}) });
      this.bond(ring[vid], id);
    }
    if (opts.c6Group) {
      const g = tpl.substituents.c5.equatorial;
      const c5 = this.get(ring.c5);
      const c6 = this.atom(c5.x + g.dx, c5.y + g.dy, 'C', { depth: c5.depth });
      this.bond(ring.c5, c6);
      const o = this.atom(c5.x + g.dx + 4, c5.y + g.dy - 28, 'O', { label: opts.c6Group, depth: c5.depth });
      this.bond(c6, o);
    }
    return ring;
  }

  arrow(x1, y1, x2, y2, top = '', bottom = '', opts = {}) {
    this.arrows.push({ id: this.nid('arr'), x1, y1, x2, y2, type: 'normal', reagentsTop: top, reagentsBottom: bottom, ...opts });
  }

  /** Texto: letra de compuesto (negrita grande) o texto normal. */
  text(x, y, text, opts = {}) {
    const bold = opts.bold !== undefined ? opts.bold : /^[A-Z][0-9']?$/.test(text);
    this.textLabels.push({
      id: this.nid('lbl'), x, y, text,
      fontSize: opts.fontSize || (bold ? 22 : 14),
      isIntermediary: bold,
      ...(opts.fontWeight ? { fontWeight: opts.fontWeight } : {})
    });
  }

  refBox(x, y, width, items, height = 90) {
    this.referenceBoxes.push({ id: this.nid('ref'), boxType: 'reference', x, y, width, height, title: '', items });
  }

  structure() {
    return { version: '1.0', atoms: this.atoms, bonds: this.bonds, arrows: [], referenceBoxes: [], textLabels: [] };
  }

  scheme() {
    return {
      version: '1.0',
      atoms: this.atoms, bonds: this.bonds, arrows: this.arrows,
      referenceBoxes: this.referenceBoxes, textLabels: this.textLabels,
      showCompoundBoxes: true
    };
  }
}

/** Benceno con dos vértices horizontales (izquierda/derecha); devuelve ids [der, abajo-der, abajo-izq, izq, arriba-izq, arriba-der]. */
function benzeneH(b, cx, cy) {
  const ids = b.ring(cx, cy, 6, 0);
  b.kekulize(ids);
  return ids;
}

// ---------------------------------------------------------------------------
// 1. Acoplamiento de Suzuki
// ---------------------------------------------------------------------------
function buildSuzuki() {
  const b = new SchemeBuilder('sz_');
  const y = 150;

  // 4-bromoanisol
  const r1 = benzeneH(b, 150, y);
  const o1 = b.sub(r1[3], 180, 'O'); // enlace exocíclico en la bisectriz (120° con el anillo)
  b.sub(o1, 120, 'C');
  b.sub(r1[0], 0, 'Br');
  b.text(262, y + 6, '+', { bold: false, fontSize: 22 });

  // Ácido fenilborónico
  const boron = b.atom(310, y, 'B');
  b.sub(boron, 240, 'O');
  b.sub(boron, 120, 'O');
  const r2 = benzeneH(b, 310 + 2 * L, y);
  b.bond(boron, r2[3]);

  b.arrow(470, y, 650, y, 'Pd(PPh3)4', 'K2CO3, 80 °C');

  // 4-metoxibifenilo
  const r3 = benzeneH(b, 770, y);
  const o3 = b.sub(r3[3], 180, 'O');
  b.sub(o3, 120, 'C');
  const r4 = benzeneH(b, 770 + 3 * L, y);
  b.bond(r3[0], r4[3]);
  return b.scheme();
}

// ---------------------------------------------------------------------------
// 2. Diclofenaco
// ---------------------------------------------------------------------------
function buildDiclofenac() {
  const b = new SchemeBuilder('dc_');
  // Anillo A con vértice arriba: [arriba, arriba-der, abajo-der, abajo, abajo-izq, arriba-izq]
  const A = b.ring(260, 160, 6, -90);
  b.kekulize(A);
  const ch2 = b.sub(A[4], 150);
  const cooh = b.sub(ch2, 210);
  b.sub(cooh, 270, 'O', undefined, 'double');
  b.sub(cooh, 150, 'O');
  const n = b.sub(A[3], 90, 'N');
  // Anillo B unido al N hacia abajo-derecha
  const c1 = b.sub(n, 30);
  const c1a = b.get(c1);
  const cB = vec(30);
  const Bv = [];
  for (let i = 0; i < 6; i++) {
    const d = vec(210 + 60 * i);
    // el vértice 0 cae justo sobre c1: reutilizarlo para que el anillo quede unido al N
    Bv.push(i === 0 ? c1 : b.atomAt(c1a.x + cB.x + d.x, c1a.y + cB.y + d.y));
  }
  for (let i = 0; i < 6; i++) b.bond(Bv[i], Bv[(i + 1) % 6]);
  b.kekulize(Bv);
  b.sub(Bv[1], 270, 'Cl');
  b.sub(Bv[5], 150, 'Cl');
  b.text(265, 345, 'Diclofenaco', { bold: false, fontSize: 15 });
  return b.scheme();
}

// ---------------------------------------------------------------------------
// 3. Hidrocarburo aromático policíclico helicoidal
// ---------------------------------------------------------------------------
function buildHelicalPAH() {
  const b = new SchemeBuilder('pah_');
  // Hexágonos de vértices laterales en una red: centro(q, r)
  const x0 = 120, y0 = 330;
  const center = (q, r) => ({ x: x0 + 1.5 * L * q, y: y0 + Math.sqrt(3) * L * (r + q / 2) });
  const rings = [[0, 0], [1, -1], [2, -2], [2, -3], [3, -4], [4, -4], [4, -3], [4, -2], [3, -1]];
  const all = new Set();
  for (const [q, r] of rings) {
    const c = center(q, r);
    b.ring(c.x, c.y, 6, 0).forEach(id => all.add(id));
  }
  b.kekulize(Array.from(all));
  return b.scheme();
}

// ---------------------------------------------------------------------------
// 4. Síntesis de un trisacárido "Gal-Gal-Glc" (IChO)
// ---------------------------------------------------------------------------
function buildTrisaccharide() {
  const b = new SchemeBuilder('ts_');
  const y = 190;

  // Metil 3-O-bencil-β-D-galactopiranósido (OH de C4 axial)
  b.chair(115, y, {
    c1: ['equatorial', 'OMe'],
    c2: ['equatorial', 'OH'],
    c3: ['equatorial', 'OBn'],
    c4: ['axial', 'OH', { side: 'left' }] // "HO" a la izquierda para no chocar con el OH del CH2OH
  }, { c6Group: 'OH' });
  b.arrow(225, y, 370, y, 'RB(OH)2, Py', '');
  b.text(395, y + 7, 'L');

  // Donador 1 (galactosilo) como molécula sobre la flecha (más pequeña, estilo IChO)
  const d1 = new SchemeBuilder('d1_');
  d1.chair(0, 0, {
    c1: ['equatorial', 'SEt', { element: 'S' }],
    c2: ['equatorial', 'OBn'],
    c3: ['equatorial', 'OFmoc', { side: 'left' }],
    c4: ['axial', 'OAc', { side: 'left' }]
  }, { c6Group: 'OBn' });
  b.arrow(425, y, 625, y, '1) NIS, TMSOTf', '2) Et3N', { structureTop: d1.structure() });
  b.text(655, y + 7, 'M');
  b.text(657, y + 34, '(C36H42BO12R)', { bold: false, fontSize: 13 });

  // Donador 2 (glucosilo) como molécula sobre la flecha
  const d2 = new SchemeBuilder('d2_');
  d2.chair(0, 0, {
    c1: ['equatorial', 'SEt', { element: 'S' }],
    c2: ['equatorial', 'OBz'],
    c3: ['equatorial', 'OBn', { side: 'left' }],
    c4: ['equatorial', 'OBn', { side: 'left' }]
  }, { c6Group: 'OBn' });
  b.arrow(735, y, 935, y, '1) NIS, TMSOTf', '2) H2O, heating', { structureTop: d2.structure() });
  b.text(1020, y + 7, '"Gal-Gal-Glc"', { bold: true, fontSize: 20 });

  // Definiciones: Fmoc, NIS, TMSOTf
  const yd = 360;
  b.text(60, yd + 5, 'Fmoc =', { bold: false, fontSize: 15 });
  const w0 = b.atom(105, yd, 'C');
  const cO = b.sub(w0, -30, 'C', undefined, 'wavy');
  b.sub(cO, 270, 'O', undefined, 'double');
  const oE = b.sub(cO, 30, 'O');
  const ch2 = b.sub(oE, -30);
  const c9 = b.sub(ch2, 30);
  // Fluoreno: pentágono con C9 a la izquierda y dos bencenos fusionados a la derecha
  const c9a = b.get(c9);
  const rp = L / (2 * Math.sin(Math.PI / 5));
  const pc = { x: c9a.x + rp, y: c9a.y };
  const P = [c9];
  for (let i = 1; i < 5; i++) {
    const d = vec(180 + 72 * i, rp);
    P.push(b.atomAt(pc.x + d.x, pc.y + d.y));
  }
  for (let i = 0; i < 5; i++) b.bond(P[i], P[(i + 1) % 5]);
  const top = b.hexOnEdge(P[1], P[2], pc);
  const bot = b.hexOnEdge(P[3], P[4], pc);
  b.kekulize(top);
  b.kekulize(bot);

  b.text(470, yd + 5, 'NIS =', { bold: false, fontSize: 15 });
  // Succinimida N-yodada: N a la derecha
  const nc = { x: 560, y: yd };
  const S = [];
  for (let i = 0; i < 5; i++) {
    const d = vec(72 * i, rp);
    S.push(b.atomAt(nc.x + d.x, nc.y + d.y, i === 0 ? 'N' : 'C'));
  }
  for (let i = 0; i < 5; i++) b.bond(S[i], S[(i + 1) % 5]);
  b.sub(S[1], 72, 'O', undefined, 'double');
  b.sub(S[4], -72, 'O', undefined, 'double');
  b.sub(S[0], 0, 'I');

  b.text(820, yd + 5, 'TMSOTf = CF3SO3SiMe3', { bold: false, fontSize: 15 });
  return b.scheme();
}

// ---------------------------------------------------------------------------
// 5. Síntesis de tromboxano B2 a partir de D-glucosa
// ---------------------------------------------------------------------------
function buildThromboxane() {
  const b = new SchemeBuilder('tx_');

  // D-glucosa (anillo plano con estereoquímica): [arriba, arriba-der, abajo-der, abajo(O), abajo-izq, arriba-izq]
  const G = b.ring(95, 120, 6, -90, { 3: 'O' });
  b.sub(G[0], 270, 'O', undefined, 'wedge');
  b.sub(G[1], 330, 'O', undefined, 'dash');
  b.sub(G[5], 210, 'O', undefined, 'dash');
  b.sub(G[4], 150, 'O', undefined, 'wavy');
  const ch2g = b.sub(G[2], 30, 'C', undefined, 'wedge');
  b.sub(ch2g, -30, 'O');
  b.text(95, 215, 'D-glucose', { bold: false, fontSize: 14 });

  const y = 120;
  b.arrow(280, y, 430, y, '1) MeOH, HCl', '2) PhCH(OMe)2, TsOH');
  b.text(455, y + 7, 'D');
  b.arrow(480, y, 575, y, '1) TsCl, Py', '2) Na2CO3');
  b.text(600, y + 7, 'E');
  b.arrow(625, y, 720, y, '1) LiAlH4', '2) BzCl');
  b.text(745, y + 7, 'F');
  // Flecha en "L": tramo horizontal sin punta y bajada con punta
  // Flecha doblada en L: → y luego ↓ hacia el piranósido
  b.arrow(770, y, 905, 245, '1) H2, Pd(OH)2/C', '2) TBDPSCl', { bend: 'hv' });

  // Intermedio: 2-desoxi piranósido
  const I = b.ring(890, 345, 6, -90, { 3: 'O' });
  b.sub(I[0], 270, 'O', 'OBz', 'dash');
  b.sub(I[1], 330, 'O', undefined, 'dash');
  b.sub(I[4], 150, 'O', 'OMe', 'dash');
  const ch2i = b.sub(I[2], 30, 'C', undefined, 'wedge');
  b.sub(ch2i, -30, 'O', 'OTBDPS');

  const y2 = 355;
  b.arrow(800, y2, 680, y2, '1) DMSO, (COCl)2', '2) Et3N');
  b.text(655, y2 + 7, 'G');

  // Fosfonato como "molécula sobre la flecha" (pegado a la flecha, como en la IChO)
  const ph = new SchemeBuilder('ph_');
  const p = ph.atom(0, 0, 'P', { label: '(MeO)2P' });
  ph.sub(p, 270, 'O', undefined, 'double');
  const pc = ph.sub(p, 30);
  ph.sub(pc, -30, 'C', 'COOMe');
  b.arrow(640, y2, 500, y2, '', 'KO^tBu', { structureTop: ph.structure() });
  b.text(485, y2 + 7, 'H');
  b.arrow(460, y2, 340, y2, '1) H2, Pd(OH)2/C', '2) K2CO3');
  b.text(315, y2 + 7, 'I');
  b.text(315, y2 + 40, 'C25H32SiO5', { bold: false, fontSize: 13 }); // centrada bajo la I
  // Varios pasos: una sola flecha hacia el tromboxano
  b.arrow(315, 405, 315, 480, '', '');

  // Tromboxano B2
  const T = b.ring(95, 575, 6, -90, { 3: 'O' });
  b.sub(T[0], 270, 'O', undefined, 'dash');
  b.sub(T[4], 150, 'O', undefined, 'dash');
  // Cadena α (cis) desde el vértice superior derecho
  const a1 = b.sub(T[1], -30, 'C', undefined, 'dash');
  const [a2, a3, a4, a5, a6] = b.chain(a1, [30, 0, -30, 30, -30], ['single', 'double']);
  b.sub(a6, 30, 'C', 'COOH');
  // Cadena ω (trans) desde el vértice inferior derecho
  const b1 = b.sub(T[2], 30, 'C', undefined, 'wedge');
  const [, b3] = b.chain(b1, [-30, 30], ['double']);
  b.sub(b3, 90, 'O', undefined, 'dash');
  b.chain(b3, [-30, 30, -30, 30, -30]);
  void a2; void a3; void a4; void a5;
  b.text(130, 675, 'Thromboxane B​2', { bold: false, fontSize: 15 });

  // Recuadro de referencias con estructuras
  const bz = new SchemeBuilder('bz_');
  const br = benzeneH(bz, 0, 0);
  const co = bz.sub(br[0], 0);
  bz.sub(co, -60, 'O', undefined, 'double'); // carbono sp2: 120° entre sus tres enlaces
  bz.sub(co, 60, 'Cl');

  const dm = new SchemeBuilder('dm_');
  const s = dm.atom(0, 0, 'S');
  dm.sub(s, 150);
  dm.sub(s, 30);
  dm.sub(s, 270, 'O', undefined, 'double');

  const py = new SchemeBuilder('py_');
  const pr = py.ring(0, 0, 6, -90, { 3: 'N' });
  py.kekulize(pr);

  b.refBox(560, 470, 420, [
    { abbr: 'BzCl', formula: '', structure: bz.structure() },
    { abbr: 'DMSO', formula: '', structure: dm.structure() },
    { abbr: 'TBDPSCl', formula: 't-Bu(Ph)2SiCl' },
    { abbr: 'Py', formula: '', structure: py.structure() }
  ], 150);
  return b.scheme();
}

// ---------------------------------------------------------------------------
// 6. Porfirinas (moléculas grandes): tetrafenilporfirina, nitración/reducción y dímero azo con Mo
// ---------------------------------------------------------------------------

/**
 * Porfirina centrada en (cx, cy). Cuatro pirroles (arriba, derecha, abajo, izquierda) con el N
 * hacia el centro y cuatro carbonos meso en las diagonales.
 *  opts.metal: símbolo del metal central (p. ej. 'Mo'); sin metal, los N de arriba y abajo son NH.
 *  opts.meso: { tr, br, bl, tl } -> 'Ph' (etiqueta) o null (libre, para unir otra cosa).
 * Devuelve los ids de los carbonos meso y de los N.
 */
function addPorphyrin(b, cx, cy, opts = {}) {
  const r5 = L / (2 * Math.sin(Math.PI / 5));   // radio del pentágono
  const R5 = 87.2;                               // centro de la porfirina -> centro de cada pirrol
  const Dm = 95.3;                               // centro -> carbono meso (enlaces Cα–Cmeso ≈ 38)
  const pyrroles = {};
  for (const [name, th] of [['top', -90], ['right', 0], ['bottom', 90], ['left', 180]]) {
    const pc = { x: cx + R5 * Math.cos(rad(th)), y: cy + R5 * Math.sin(rad(th)) };
    // vértices del pentágono: N hacia el centro, luego α, β, β, α
    const ids = [];
    const elems = ['N', 'C', 'C', 'C', 'C'];
    for (let i = 0; i < 5; i++) {
      const d = vec(th + 180 + 72 * i, r5);
      ids.push(b.atomAt(pc.x + d.x, pc.y + d.y, elems[i]));
    }
    for (let i = 0; i < 5; i++) b.bond(ids[i], ids[(i + 1) % 5]);
    pyrroles[name] = { n: ids[0], alphas: [ids[1], ids[4]] };
  }
  const meso = {};
  const allAlphas = Object.values(pyrroles).flatMap(p => p.alphas);
  for (const [name, phi] of [['tr', -45], ['br', 45], ['bl', 135], ['tl', 225]]) {
    const d = vec(phi, Dm);
    const m = b.atom(cx + d.x, cy + d.y, 'C');
    meso[name] = m;
    // unir con los dos carbonos α más cercanos
    const mA = b.get(m);
    allAlphas
      .map(id => ({ id, dist: Math.hypot(b.get(id).x - mA.x, b.get(id).y - mA.y) }))
      .sort((p, q) => p.dist - q.dist)
      .slice(0, 2)
      .forEach(({ id }) => b.bond(m, id));
    const sub = opts.meso && opts.meso[name];
    if (sub) b.sub(m, phi, 'C', sub);
  }
  // Kekulé del macrociclo: los N de arriba y abajo quedan sin doble enlace (NH o N–metal)
  const ringAtoms = new Set();
  for (const p of Object.values(pyrroles)) {
    for (const bd of b.bonds) {
      if (bd.atom1 === p.n || bd.atom2 === p.n || p.alphas.includes(bd.atom1) || p.alphas.includes(bd.atom2)) {
        ringAtoms.add(bd.atom1); ringAtoms.add(bd.atom2);
      }
    }
  }
  Object.values(meso).forEach(id => ringAtoms.add(id));
  // solo átomos del macrociclo (sin los Ph de los meso)
  const macro = Array.from(ringAtoms).filter(id => {
    const a = b.get(id);
    return Math.hypot(a.x - cx, a.y - cy) < 125 && !a.label; // macrociclo: hasta los C β (~115 px)
  }).filter(id => id !== pyrroles.top.n && id !== pyrroles.bottom.n);
  b.kekulize(macro);

  if (opts.metal) {
    const metal = b.atom(cx, cy, opts.metal);
    b.bond(pyrroles.top.n, metal);
    b.bond(pyrroles.bottom.n, metal);
    b.bond(pyrroles.left.n, metal, 'dative');
    b.bond(pyrroles.right.n, metal, 'dative');
  }
  return { meso, n: pyrroles };
}

/** Fenilo con un vértice arriba unido a 'fromId' desde arriba; devuelve [ipso, ..., para] */
function addParaPhenyl(b, ipsoX, ipsoY) {
  const ids = b.ring(ipsoX, ipsoY + L, 6, -90); // [arriba(ipso), arr-der, ab-der, abajo(para), ab-izq, arr-izq]
  b.kekulize(ids);
  return ids;
}

function buildPorphyrins() {
  const b = new SchemeBuilder('pf_');
  const y = 170;
  const dm = 95.3 / Math.SQRT2; // desplazamiento x/y de un carbono meso diagonal
  const k = L / Math.SQRT2;

  b.text(45, y + 6, 'PhCHO', { bold: false, fontSize: 16 });
  // Pirrol sobre la flecha
  const py = new SchemeBuilder('py2_');
  py.ring(0, 0, 5, 90, { 0: 'N' });
  const pyIds = py.atoms.map(a => a.id);
  py.bonds.find(x => x.atom1 === pyIds[1] && x.atom2 === pyIds[2]).type = 'double';
  py.bonds.find(x => x.atom1 === pyIds[3] && x.atom2 === pyIds[4]).type = 'double';
  b.arrow(95, y, 255, y, '1) pyrrole, TFA', '2) DDQ', { structureTop: py.structure() });

  // A: tetrafenilporfirina
  addPorphyrin(b, 430, y, { meso: { tr: 'Ph', br: 'Ph', bl: 'Ph', tl: 'Ph' } });
  b.text(430, y + 160, 'A');

  b.arrow(610, y, 770, y, '1) conc. HNO3', '2) SnCl2, HCl');

  // B: aminofenil-trifenilporfirina
  const B = addPorphyrin(b, 950, y, { meso: { tr: 'Ph', bl: 'Ph', tl: 'Ph' } });
  const mB = b.get(B.meso.br);
  const ph = addParaPhenyl(b, mB.x + k, mB.y + k);
  b.bond(B.meso.br, ph[0]);
  b.sub(ph[3], 90, 'N');
  b.text(925, y + 160, 'B');

  b.arrow(1160, y + 150, 1160, y + 330, '1) MnO2\n2) MoCl2', '');

  // C: dímero azo de Mo-porfirinas
  const c1 = { x: 560, y: 520 };
  const P1 = addPorphyrin(b, c1.x, c1.y, { metal: 'Mo', meso: { tr: 'Ph', bl: 'Ph', tl: 'Ph' } });
  const m1 = b.get(P1.meso.br);
  const ar1 = addParaPhenyl(b, m1.x + k, m1.y + k);
  b.bond(P1.meso.br, ar1[0]);
  const n1 = b.sub(ar1[3], 90, 'N');
  const n2 = b.sub(n1, 30, 'N', undefined, 'double');
  const n2a = b.get(n2);
  const ar2 = addParaPhenyl(b, n2a.x, n2a.y + L);
  b.bond(n2, ar2[0]);
  const para2 = b.get(ar2[3]);
  const c2 = { x: para2.x + k + dm, y: para2.y + k + dm };
  const P2 = addPorphyrin(b, c2.x, c2.y, { metal: 'Mo', meso: { tr: 'Ph', br: 'Ph', bl: 'Ph' } });
  b.bond(ar2[3], P2.meso.tl);
  b.text(c1.x + 40, c2.y - 20, 'C');
  return b.scheme();
}

/** Catálogo que muestra la galería de ejemplos */
const EXAMPLE_SCHEMES = [
  {
    key: 'icho-glucose',
    name: 'IChO · Glucopiranosa',
    description: 'Esquema de examen con sillas de glucosa, incógnitas A–G y recuadro de abreviaturas.',
    build: () => JSON.parse(JSON.stringify(ICHO_GLUCOSE_SCHEME))
  },
  {
    key: 'suzuki',
    name: 'Acoplamiento de Suzuki',
    description: '4-Bromoanisol + ácido fenilborónico → 4-metoxibifenilo (Pd(PPh3)4, K2CO3).',
    build: buildSuzuki
  },
  {
    key: 'diclofenac',
    name: 'Diclofenaco',
    description: 'Molécula de fármaco: anillos aromáticos, NH, ácido carboxílico y Cl.',
    build: buildDiclofenac
  },
  {
    key: 'helical-pah',
    name: 'Aromático policíclico helicoidal',
    description: 'Hidrocarburo de anillos fusionados (antraceno + heliceno) con estructura de Kekulé.',
    build: buildHelicalPAH
  },
  {
    key: 'trisaccharide',
    name: 'IChO · Trisacárido Gal-Gal-Glc',
    description: 'Glicosilaciones con donadores en silla, incógnitas L y M, definiciones de Fmoc, NIS y TMSOTf.',
    build: buildTrisaccharide
  },
  {
    key: 'porphyrins',
    name: 'Porfirinas (moléculas grandes)',
    description: 'Tetrafenilporfirina, aminofenil-porfirina y dímero azo de Mo-porfirinas (enlaces de coordinación).',
    build: buildPorphyrins
  },
  {
    key: 'thromboxane',
    name: 'IChO · Síntesis de tromboxano B2',
    description: 'Ruta desde D-glucosa con cuñas, enlaces punteados, alquenos cis/trans y recuadro de referencias.',
    build: buildThromboxane
  }
];


  // --- js/state.js ---
/**
 * state.js - Gestor de estado central de ChemStudio
 * Controla átomos, enlaces, flechas de reacción, cajas de referencias, selección y deshacer/rehacer.
 */


class ChemState {
  constructor() {
    this.atoms = new Map();
    this.bonds = new Map();
    this.arrows = new Map();
    this.referenceBoxes = new Map();
    this.textLabels = new Map();

    // Selección actual
    this.selected = {
      atoms: new Set(),
      bonds: new Set(),
      arrows: new Set(),
      labels: new Set(),
      boxes: new Set()
    };

    // Herramienta activa
    this.currentTool = 'select'; // 'select', 'bond', 'wedge', 'dash', 'chair', 'arrow', 'text', etc.
    this.bondType = 'single';
    this.activeElement = 'C';
    this.isProblemMode = false; // Modo Construir Problema (IChO reaction scheme)
    this.showCompoundBoxes = true; // Visibilidad de recuadros de problema (A, B, C...)
    this.isDarkMode = false; // Modo Oscuro (fondo oscuro, enlaces/flechas/texto blancos)
    this.activeChargeMode = null; // Modo continuo de carga ('+', '-', '0', 'lp' o null)

    // Parámetros de vista (pan & zoom)
    this.pan = { x: 0, y: 0 };
    this.zoom = 1.0;

    // Historial para Deshacer / Rehacer
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 50;

    // Suscriptores de eventos
    this.listeners = new Map();

    // Cache de validación de valencias
    this.valenceErrors = new Map();

    // Autoincrementadores de ID
    this.nextId = 1;
  }

  generateId(prefix = 'item') {
    return `${prefix}_${Date.now().toString(36)}_${this.nextId++}`;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const cb of this.listeners.get(event)) {
        cb(data);
      }
    }
  }

  /** Estado actual serializado (lo que guarda un paso de Deshacer) */
  makeSnapshot() {
    return JSON.stringify({
      atoms: Array.from(this.atoms.values()).map(a => ({ ...a })),
      bonds: Array.from(this.bonds.values()).map(b => ({ ...b })),
      arrows: Array.from(this.arrows.values()).map(a => ({ ...a })),
      referenceBoxes: Array.from(this.referenceBoxes.values()).map(r => ({ ...r })),
      textLabels: Array.from(this.textLabels.values()).map(l => ({ ...l }))
    });
  }

  /** Guarda un paso de Deshacer; 'snapshot' permite guardar uno tomado antes (p. ej. al empezar a arrastrar) */
  saveSnapshot(snapshot = this.makeSnapshot()) {
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Limpiar historial posterior
  }

  undo() {
    if (this.undoStack.length === 0) return;
    const current = {
      atoms: Array.from(this.atoms.values()).map(a => ({ ...a })),
      bonds: Array.from(this.bonds.values()).map(b => ({ ...b })),
      arrows: Array.from(this.arrows.values()).map(a => ({ ...a })),
      referenceBoxes: Array.from(this.referenceBoxes.values()).map(r => ({ ...r })),
      textLabels: Array.from(this.textLabels.values()).map(l => ({ ...l }))
    };
    this.redoStack.push(JSON.stringify(current));

    const previous = JSON.parse(this.undoStack.pop());
    this.loadFromObject(previous, false);
    this.emit('change');
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const current = {
      atoms: Array.from(this.atoms.values()).map(a => ({ ...a })),
      bonds: Array.from(this.bonds.values()).map(b => ({ ...b })),
      arrows: Array.from(this.arrows.values()).map(a => ({ ...a })),
      referenceBoxes: Array.from(this.referenceBoxes.values()).map(r => ({ ...r })),
      textLabels: Array.from(this.textLabels.values()).map(l => ({ ...l }))
    };
    this.undoStack.push(JSON.stringify(current));

    const next = JSON.parse(this.redoStack.pop());
    this.loadFromObject(next, false);
    this.emit('change');
  }

  updateValences() {
    // Sincronizar carga desde la etiqueta si contiene sufijo de carga (+ o -)
    for (const atom of this.atoms.values()) {
      if (atom.label && typeof atom.label === 'string') {
        const trimmed = atom.label.trim();
        if (trimmed.endsWith('+') && (atom.charge === 0 || atom.charge === undefined)) {
          const match = trimmed.match(/(\d+)\+$/);
          atom.charge = match ? parseInt(match[1], 10) : 1;
        } else if ((trimmed.endsWith('-') || trimmed.endsWith('−')) && (atom.charge === 0 || atom.charge === undefined)) {
          const match = trimmed.match(/(\d+)[-−]$/);
          atom.charge = match ? -parseInt(match[1], 10) : -1;
        }
      }
    }
    this.applyAutoCharges();
    const atomList = Array.from(this.atoms.values());
    const bondList = Array.from(this.bonds.values());
    this.valenceErrors = validateMolecularValences(atomList, bondList);
  }

  /**
   * Cargas formales automáticas:
   *  - N con 4 enlaces            -> N+  (amonio, piridinio, nitro, diazonio...)
   *  - O con 3 enlaces            -> O+  (oxonio)
   *  - O terminal unido por enlace simple a un N+ automático -> O−  (nitro, N-óxidos)
   * 'autoCharge' recuerda la última carga puesta automáticamente. Si el usuario cambia la
   * carga a mano (charge !== autoCharge) se respeta y no se vuelve a tocar.
   * Solo se aplica a átomos sin etiqueta de grupo (p. ej. no toca 'OMe', 'NO2', 'NH4+').
   */
  applyAutoCharges() {
    const sums = new Map();
    const neighbors = new Map();
    for (const a of this.atoms.values()) {
      sums.set(a.id, 0);
      neighbors.set(a.id, []);
    }
    for (const b of this.bonds.values()) {
      if (!sums.has(b.atom1) || !sums.has(b.atom2)) continue;
      const order = getBondOrder(b.type);
      sums.set(b.atom1, sums.get(b.atom1) + order);
      sums.set(b.atom2, sums.get(b.atom2) + order);
      neighbors.get(b.atom1).push({ id: b.atom2, order });
      neighbors.get(b.atom2).push({ id: b.atom1, order });
    }

    const isAuto = (a) => (a.charge || 0) === (a.autoCharge || 0);
    const isPlain = (a) => !a.label || a.label === a.element ||
      (!a.manualLabel && [`${a.element}+`, `${a.element}-`, `${a.element}−`].includes(a.label));

    const desired = new Map();
    for (const a of this.atoms.values()) {
      let c = 0;
      if (a.element === 'N' && sums.get(a.id) === 4) c = 1;
      else if (a.element === 'O' && sums.get(a.id) === 3) c = 1;
      desired.set(a.id, c);
    }

    // O− en el oxígeno terminal (enlace simple) de un N+ automático: nitro, N-óxidos
    for (const n of this.atoms.values()) {
      if (n.element !== 'N' || desired.get(n.id) !== 1 || !isAuto(n) || !isPlain(n)) continue;
      const oxygens = neighbors.get(n.id)
        .map(nb => ({ ...nb, atom: this.atoms.get(nb.id) }))
        .filter(nb => nb.atom && nb.atom.element === 'O' && nb.order === 1 && sums.get(nb.id) === 1);
      // Si el usuario ya puso un O− a mano en ese N, no añadir otro
      if (oxygens.some(nb => !isAuto(nb.atom) && (nb.atom.charge || 0) < 0)) continue;
      const target = oxygens.find(nb => isAuto(nb.atom) && (!nb.atom.label || ['O', 'O-', 'O−'].includes(nb.atom.label)));
      if (target) desired.set(target.id, -1);
    }

    for (const a of this.atoms.values()) {
      if (!isAuto(a) || !isPlain(a)) continue;
      const c = desired.get(a.id) || 0;
      a.charge = c;
      a.autoCharge = c;
    }
  }

  // --- Operaciones de Átomos ---
  addAtom(atom) {
    const id = atom.id || this.generateId('atom');
    const elem = atom.element || 'C';
    const isStandardElem = ['C', 'H', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I'].includes(elem);
    const defaultLabel = isStandardElem ? (atom.label || null) : (atom.label || elem);
    const isManual = atom.manualLabel !== undefined ? atom.manualLabel : (!isStandardElem);
    const isCustom = atom.isCustomLabel !== undefined ? atom.isCustomLabel : (!isStandardElem);

    const newAtom = {
      id,
      x: atom.x,
      y: atom.y,
      element: elem,
      charge: atom.charge !== undefined ? atom.charge : 0,
      lonePairs: atom.lonePairs !== undefined ? atom.lonePairs : 0,
      label: defaultLabel,
      manualLabel: isManual,
      isCustomLabel: isCustom,
      ...atom
    };

    if (!isStandardElem) {
      if (!newAtom.label) newAtom.label = elem;
      if (newAtom.manualLabel === undefined) newAtom.manualLabel = true;
      if (newAtom.isCustomLabel === undefined) newAtom.isCustomLabel = true;
    }

    this.atoms.set(id, newAtom);
    this.updateValences();
    return newAtom;
  }

  getAtom(id) {
    return this.atoms.get(id);
  }

  updateAtom(id, updates) {
    const atom = this.atoms.get(id);
    if (atom) {
      Object.assign(atom, updates);
      this.updateValences();
    }
  }

  setAtomCharge(id, charge) {
    const atom = this.atoms.get(id);
    if (!atom) return;
    this.saveState();
    atom.charge = charge;
    this.updateValences();
    this.emit('change');
  }

  applyChargeToAtom(atom, mode = this.activeChargeMode) {
    if (!atom || !mode) return;
    if (mode === '+') {
      atom.charge = (atom.charge || 0) + 1;
      if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
        atom.label = null;
        atom.manualLabel = false;
      }
    } else if (mode === '-') {
      atom.charge = (atom.charge || 0) - 1;
      if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
        atom.label = null;
        atom.manualLabel = false;
      }
    } else if (mode === '0') {
      // "0" = volver a la carga automática (0 para un átomo normal, + para N con 4 enlaces...)
      atom.charge = atom.autoCharge || 0;
      atom.lonePairs = 0;
      if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
        atom.label = null;
        atom.manualLabel = false;
      }
    } else if (mode === 'lp') {
      if (!atom.lonePairs || atom.lonePairs === 0) {
        if (atom.element === 'N') atom.lonePairs = 1;
        else if (atom.element === 'O' || atom.element === 'S') atom.lonePairs = 2;
        else if (['F', 'Cl', 'Br', 'I'].includes(atom.element)) atom.lonePairs = 3;
        else atom.lonePairs = 1;
      } else if (atom.lonePairs >= 3) {
        atom.lonePairs = 0;
      } else {
        atom.lonePairs += 1;
      }
    }
  }

  toggleAtomLonePairs(id, count = null) {
    const atom = this.atoms.get(id);
    if (!atom) return;
    this.saveState();
    if (count !== null) {
      atom.lonePairs = count;
    } else {
      if (!atom.lonePairs || atom.lonePairs === 0) {
        if (atom.element === 'N') atom.lonePairs = 1;
        else if (atom.element === 'O' || atom.element === 'S') atom.lonePairs = 2;
        else if (['F', 'Cl', 'Br', 'I'].includes(atom.element)) atom.lonePairs = 3;
        else atom.lonePairs = 1;
      } else if (atom.lonePairs >= 3) {
        atom.lonePairs = 0;
      } else {
        atom.lonePairs += 1;
      }
    }
    this.emit('change');
  }

  removeAtom(id) {
    // Eliminar también enlaces conectados
    const bondsToRemove = [];
    for (const [bId, bond] of this.bonds.entries()) {
      if (bond.atom1 === id || bond.atom2 === id) {
        bondsToRemove.push(bId);
      }
    }
    for (const bId of bondsToRemove) {
      this.bonds.delete(bId);
    }
    this.atoms.delete(id);
    this.selected.atoms.delete(id);
    this.updateValences();
  }

  // --- Operaciones de Enlaces ---
  addBond(bond) {
    // Evitar enlaces duplicados entre los mismos dos átomos
    for (const existing of this.bonds.values()) {
      if ((existing.atom1 === bond.atom1 && existing.atom2 === bond.atom2) ||
          (existing.atom1 === bond.atom2 && existing.atom2 === bond.atom1)) {
        return existing;
      }
    }

    const id = bond.id || this.generateId('bond');
    const newBond = {
      id,
      atom1: bond.atom1,
      atom2: bond.atom2,
      type: bond.type || 'single', // 'single', 'double', 'triple', 'wedge', 'dash', 'wavy'
      isFront: bond.isFront || false,
      ...bond
    };
    this.bonds.set(id, newBond);
    this.updateValences();
    return newBond;
  }

  cycleBondType(bondId) {
    const bond = this.bonds.get(bondId);
    if (!bond) return;
    const cycle = ['single', 'double', 'triple', 'wedge', 'dash', 'dashed', 'wavy'];
    const nextIdx = (cycle.indexOf(bond.type) + 1) % cycle.length;
    bond.type = cycle[nextIdx];
    this.updateValences();
  }

  removeBond(id) {
    this.bonds.delete(id);
    this.selected.bonds.delete(id);
    this.updateValences();
  }

  // --- Flechas de Reacción ---
  addArrow(arrow) {
    const id = arrow.id || this.generateId('arrow');
    const newArrow = {
      id,
      x1: arrow.x1,
      y1: arrow.y1,
      x2: arrow.x2,
      y2: arrow.y2,
      type: arrow.type || 'normal', // 'normal', 'reversible', 'retrosynthetic'
      reagentsTop: arrow.reagentsTop || '',
      reagentsBottom: arrow.reagentsBottom || '',
      reagentsLeft: arrow.reagentsLeft || '',
      reagentsRight: arrow.reagentsRight || '',
      ...arrow
    };
    this.arrows.set(id, newArrow);
    return newArrow;
  }

  removeArrow(id) {
    this.arrows.delete(id);
    this.selected.arrows.delete(id);
  }

  // --- Cajas de Referencias (IChO Reference Box) ---
  addReferenceBox(box) {
    const id = box.id || this.generateId('refbox');
    const newBox = {
      id,
      boxType: box.boxType || 'reference',
      label: box.label || null,
      x: box.x,
      y: box.y,
      width: box.width || (box.boxType === 'compound' ? 140 : 480),
      height: box.height || (box.boxType === 'compound' ? 110 : 100),
      title: box.title || '',
      items: box.boxType === 'compound' ? (box.items || []) : (box.items || [
        { abbr: 'Ac', formula: 'H3C-C(=O)~' },
        { abbr: 'Bn', formula: 'PhCH2' },
        { abbr: 'DIBAL-H', formula: 'i-Bu2AlH' },
        { abbr: 'p-TsOH', formula: 'H3C-C6H4-SO3H' },
        { abbr: 'Py', formula: 'Piridina' }
      ]),
      ...box
    };
    this.referenceBoxes.set(id, newBox);
    return newBox;
  }

  removeReferenceBox(id) {
    this.referenceBoxes.delete(id);
    this.selected.boxes.delete(id);
  }

  // --- Etiquetas y Rótulos de Intermediarios (A, B, C...) ---
  addTextLabel(label) {
    const id = label.id || this.generateId('label');
    const newLabel = {
      id,
      x: label.x,
      y: label.y,
      text: label.text || 'A',
      fontSize: label.fontSize || 18,
      isIntermediary: label.isIntermediary !== undefined ? label.isIntermediary : true,
      ...label
    };
    this.textLabels.set(id, newLabel);
    return newLabel;
  }

  removeTextLabel(id) {
    this.textLabels.delete(id);
    this.selected.labels.delete(id);
  }

  // --- Copiar y pegar ---
  /**
   * Copia lo seleccionado: átomos (con los enlaces entre ellos), flechas y rótulos.
   * Devuelve null si no hay nada que copiar.
   */
  copySelection() {
    const sel = this.selected;
    const atomIds = new Set(sel.atoms);
    // Un enlace seleccionado arrastra sus dos átomos
    for (const bId of sel.bonds) {
      const b = this.bonds.get(bId);
      if (b) { atomIds.add(b.atom1); atomIds.add(b.atom2); }
    }
    const atoms = [...atomIds].map(id => this.atoms.get(id)).filter(Boolean);
    const bonds = [...this.bonds.values()].filter(b => atomIds.has(b.atom1) && atomIds.has(b.atom2));
    const arrows = [...sel.arrows].map(id => this.arrows.get(id)).filter(Boolean);
    const labels = [...sel.labels].map(id => this.textLabels.get(id)).filter(Boolean);
    if (atoms.length + arrows.length + labels.length === 0) return null;
    return JSON.parse(JSON.stringify({ atoms, bonds, arrows, labels }));
  }

  /** Centro del contenido copiado (para pegarlo centrado en el cursor) */
  static clipboardCenter(clip) {
    const xs = [], ys = [];
    for (const a of clip.atoms) { xs.push(a.x); ys.push(a.y); }
    for (const a of clip.arrows) { xs.push(a.x1, a.x2); ys.push(a.y1, a.y2); }
    for (const l of clip.labels) { xs.push(l.x); ys.push(l.y); }
    return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
  }

  /**
   * Pega una copia desplazada (dx, dy) con ids nuevos y deja seleccionado lo pegado.
   * Guarda un paso de Deshacer.
   */
  pasteClipboard(clip, dx, dy) {
    if (!clip) return;
    this.saveSnapshot();
    this.clearSelection();
    const idMap = new Map();
    for (const a of clip.atoms) {
      const { id, ...rest } = a;
      const added = this.addAtom({ ...rest, x: a.x + dx, y: a.y + dy });
      idMap.set(id, added.id);
      this.selected.atoms.add(added.id);
    }
    for (const b of clip.bonds) {
      const { id, ...rest } = b;
      const added = this.addBond({ ...rest, atom1: idMap.get(b.atom1), atom2: idMap.get(b.atom2) });
      this.selected.bonds.add(added.id);
    }
    for (const a of clip.arrows) {
      const { id, ...rest } = JSON.parse(JSON.stringify(a));
      const added = this.addArrow({ ...rest, x1: a.x1 + dx, y1: a.y1 + dy, x2: a.x2 + dx, y2: a.y2 + dy });
      this.selected.arrows.add(added.id);
    }
    for (const l of clip.labels) {
      const { id, ...rest } = l;
      const added = this.addTextLabel({ ...rest, x: l.x + dx, y: l.y + dy });
      this.selected.labels.add(added.id);
    }
    this.updateValences();
    this.emit('change');
  }

  // --- Limpieza y Selección ---
  clearSelection() {
    this.selected.atoms.clear();
    this.selected.bonds.clear();
    this.selected.arrows.clear();
    this.selected.labels.clear();
    this.selected.boxes.clear();
  }

  clearAll() {
    this.saveSnapshot();
    this.atoms.clear();
    this.bonds.clear();
    this.arrows.clear();
    this.referenceBoxes.clear();
    this.textLabels.clear();
    this.clearSelection();
    this.updateValences();
    this.emit('change');
  }

  /**
   * Revisa que un proyecto tenga la forma esperada ANTES de tocar el lienzo.
   * Lanza un Error con un mensaje legible si algo no cuadra.
   */
  static validateProjectData(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('El archivo no contiene un proyecto de Chem Studio.');
    }
    const lists = ['atoms', 'bonds', 'arrows', 'referenceBoxes', 'textLabels'];
    if (!lists.some(k => k in data)) {
      throw new Error('El archivo no contiene átomos, enlaces, flechas ni rótulos.');
    }
    for (const k of lists) {
      if (data[k] === undefined || data[k] === null) continue;
      if (!Array.isArray(data[k])) throw new Error(`"${k}" debe ser una lista.`);
      for (const item of data[k]) {
        if (!item || typeof item !== 'object' || item.id === undefined || item.id === null) {
          throw new Error(`Hay un elemento sin id en "${k}".`);
        }
      }
    }
    const num = (v) => typeof v === 'number' && Number.isFinite(v);
    const atomIds = new Set();
    for (const a of data.atoms || []) {
      if (!num(a.x) || !num(a.y)) throw new Error(`El átomo ${a.id} no tiene coordenadas válidas.`);
      atomIds.add(a.id);
    }
    for (const b of data.bonds || []) {
      if (!atomIds.has(b.atom1) || !atomIds.has(b.atom2)) {
        throw new Error(`El enlace ${b.id} apunta a un átomo que no existe.`);
      }
    }
    for (const arr of data.arrows || []) {
      if (![arr.x1, arr.y1, arr.x2, arr.y2].every(num)) throw new Error(`La flecha ${arr.id} no tiene coordenadas válidas.`);
    }
    for (const r of data.referenceBoxes || []) {
      if (![r.x, r.y].every(num)) throw new Error(`El recuadro ${r.id} no tiene coordenadas válidas.`);
    }
    for (const l of data.textLabels || []) {
      if (![l.x, l.y].every(num)) throw new Error(`El rótulo ${l.id} no tiene coordenadas válidas.`);
    }
  }

  loadFromObject(data, saveHistory = true) {
    // Validar primero: si el archivo está mal, el lienzo actual no se borra
    ChemState.validateProjectData(data);
    if (saveHistory) {
      this.saveSnapshot();
    }
    this.atoms.clear();
    this.bonds.clear();
    this.arrows.clear();
    this.referenceBoxes.clear();
    this.textLabels.clear();
    this.clearSelection();

    if (data.atoms) {
      for (const a of data.atoms) this.atoms.set(a.id, { ...a });
    }
    if (data.bonds) {
      for (const b of data.bonds) this.bonds.set(b.id, { ...b });
    }
    if (data.arrows) {
      for (const arr of data.arrows) this.arrows.set(arr.id, { ...arr });
    }
    if (data.referenceBoxes) {
      for (const r of data.referenceBoxes) this.referenceBoxes.set(r.id, { ...r });
    }
    if (data.textLabels) {
      for (const l of data.textLabels) this.textLabels.set(l.id, { ...l });
    }
    if (data.showCompoundBoxes !== undefined) {
      this.showCompoundBoxes = data.showCompoundBoxes;
    }

    this.updateValences();
  }
}


  // --- js/render/arrow-renderer.js ---
/**
 * arrow-renderer.js - Renderizador SVG de flechas de reacción y reactivos
 * Tamaño de letra ampliado (16px) como en los exámenes oficiales de la IChO,
 * con espaciado amplio y alineación lateral para flechas verticales.
 */



class ArrowRenderer {
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


  // --- js/render/reference-box.js ---
/**
 * reference-box.js - Renderizador del Recuadro de Referencias estilo IChO
 * Organiza las abreviaturas con flujo multilínea automático y espaciado generoso
 * para evitar colisiones y amontonamientos.
 */


class ReferenceBoxRenderer {
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


  // --- js/render/svg-renderer.js ---
/**
 * svg-renderer.js - Motor principal de renderizado SVG para ChemStudio
 * Dibuja átomos, enlaces, flechas, recuadros y rótulos del lienzo con el estilo de los
 * exámenes IChO.
 */





class SvgRenderer {
  /** Modo blanco y negro (preferencia global): etiquetas y cargas sin colores por elemento */
  static monochrome = false;

  constructor(svgElement, state) {
    this.svgElement = svgElement;
    this.svg = svgElement;
    this.state = state;
    this.hoveredAtomId = null;
    this.hoveredBondId = null;
    this.activeGuideAtomId = null;

    this.initSvgDefs();
  }

  initSvgDefs() {
    let defs = this.svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      this.svg.insertBefore(defs, this.svg.firstChild);
    }

    const markerNormalColor = (this.state && this.state.isDarkMode) ? '#ffffff' : '#111827';
    defs.innerHTML = `
      <marker id="arrowhead-normal" viewBox="0 0 10 10" refX="8" refY="5"
        markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="${markerNormalColor}" />
      </marker>
      
      <marker id="arrowhead-selected" viewBox="0 0 10 10" refX="8" refY="5"
        markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#2563eb" />
      </marker>

      <filter id="glow-error" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    `;
  }

  render() {
    const defs = this.svg.querySelector('defs');
    this.svg.innerHTML = '';
    if (defs) this.svg.appendChild(defs);

    const rootGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    rootGroup.setAttribute('id', 'canvas-root');
    rootGroup.setAttribute('transform', `translate(${this.state.pan.x}, ${this.state.pan.y}) scale(${this.state.zoom})`);
    this.svg.appendChild(rootGroup);

    const boxLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    boxLayer.setAttribute('id', 'layer-boxes');
    rootGroup.appendChild(boxLayer);

    const arrowLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    arrowLayer.setAttribute('id', 'layer-arrows');
    rootGroup.appendChild(arrowLayer);

    const bondLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bondLayer.setAttribute('id', 'layer-bonds');
    rootGroup.appendChild(bondLayer);

    const atomLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    atomLayer.setAttribute('id', 'layer-atoms');
    rootGroup.appendChild(atomLayer);

    const guideLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    guideLayer.setAttribute('id', 'layer-guides');
    rootGroup.appendChild(guideLayer);

    const labelLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labelLayer.setAttribute('id', 'layer-labels');
    rootGroup.appendChild(labelLayer);

    // 1. Cajas de Referencias y Recuadros de Compuestos
    for (const box of this.state.referenceBoxes.values()) {
      const isSelected = this.state.selected.boxes.has(box.id);
      if (box.boxType === 'compound' && !this.state.showCompoundBoxes && !isSelected) {
        let hasAtoms = false;
        for (const a of this.state.atoms.values()) {
          if (a.x >= box.x - 15 && a.x <= box.x + box.width + 15 && a.y >= box.y - 15 && a.y <= box.y + box.height + 15) {
            hasAtoms = true;
            break;
          }
        }
        if (hasAtoms) {
          const tag = ReferenceBoxRenderer.renderCompoundTag(box, this.state);
          if (tag) boxLayer.appendChild(tag);
        }
        if (!hasAtoms) {
          boxLayer.appendChild(ReferenceBoxRenderer.renderStandaloneUnknown(box, isSelected, this.state));
        } else {
          const descText = ReferenceBoxRenderer.renderDescription(box, this.state, hasAtoms);
          if (descText) boxLayer.appendChild(descText);
        }
        continue;
      }
      boxLayer.appendChild(ReferenceBoxRenderer.render(box, isSelected, this.state));
    }

    // 2. Flechas de Reacción
    for (const arrow of this.state.arrows.values()) {
      const isSelected = this.state.selected.arrows.has(arrow.id);
      arrowLayer.appendChild(ArrowRenderer.renderArrow(arrow, isSelected, this.state));
    }

    // 3. Enlaces Químicos (los de atrás primero; los de delante dejan un hueco al cruzarlos)
    const haloBondIds = this.computeCrossingHalos();
    const orderedBonds = Array.from(this.state.bonds.values())
      .map((bond, idx) => ({ bond, idx, depth: this.getBondDepth(bond) }))
      .sort((p, q) => ((p.depth || 0) - (q.depth || 0)) || (p.idx - q.idx));
    for (const { bond } of orderedBonds) {
      const a1 = this.state.getAtom(bond.atom1);
      const a2 = this.state.getAtom(bond.atom2);
      if (!a1 || !a2) continue;

      if (haloBondIds.has(bond.id)) {
        bondLayer.appendChild(this.renderCrossingHalo(a1, a2));
      }
      const isSelected = this.state.selected.bonds.has(bond.id);
      const isHovered = this.hoveredBondId === bond.id;
      const bondElem = this.renderBond(bond, a1, a2, isSelected, isHovered);
      bondLayer.appendChild(bondElem);
    }

    // 4. Átomos y Alertas de Texas Carbon en ROJO
    for (const atom of this.state.atoms.values()) {
      const isSelected = this.state.selected.atoms.has(atom.id);
      const isHovered = this.hoveredAtomId === atom.id;
      const valInfo = this.state.valenceErrors.get(atom.id);
      const atomElem = this.renderAtom(atom, isSelected, isHovered, valInfo);
      atomLayer.appendChild(atomElem);
    }

    // 5. Rótulos de Intermediarios (A, B, C...) - Tamaño 22px grande estilo IChO
    for (const label of this.state.textLabels.values()) {
      const isSelected = this.state.selected.labels.has(label.id);
      const labelElem = this.renderTextLabel(label, isSelected);
      labelLayer.appendChild(labelElem);
    }

    // 6. Las guías axial/ecuatorial de la silla no se dibujan: la herramienta de enlace ya sigue
    //    esas direcciones sola (pickChairGuide). renderChairGuides() sirve para mostrarlas.

    // 6.1 Tirador de rotación (↻) cuando hay 2+ átomos seleccionados con la herramienta de selección
    this.renderRotateHandle(guideLayer);

    // 7. Elementos HTML sobre el lienzo (p. ej. el rótulo editable del recuadro seleccionado)
    if (typeof this.onAfterRender === 'function') this.onAfterRender();
  }

  /** Tirador ↻ encima de la selección; arrastrarlo gira los átomos seleccionados (SelectTool) */
  renderRotateHandle(layer) {
    if (!this.state || this.state.currentTool !== 'select') return;
    const atoms = Array.from(this.state.selected.atoms).map(id => this.state.getAtom(id)).filter(Boolean);
    if (atoms.length < 2) return;
    const NS = 'http://www.w3.org/2000/svg';
    const z = this.state.zoom || 1;
    const minX = Math.min(...atoms.map(a => a.x)), maxX = Math.max(...atoms.map(a => a.x));
    const minY = Math.min(...atoms.map(a => a.y));
    const cx = (minX + maxX) / 2;
    const hy = minY - 34 / z;

    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', minY - 10 / z);
    line.setAttribute('x2', cx);
    line.setAttribute('y2', hy + 9 / z);
    line.setAttribute('stroke', '#2563eb');
    line.setAttribute('stroke-width', 1.5 / z);
    line.setAttribute('stroke-dasharray', `${3 / z} ${3 / z}`);
    line.setAttribute('pointer-events', 'none');
    layer.appendChild(line);

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'rotate-handle');
    g.style.cursor = 'grab';
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', hy);
    circle.setAttribute('r', 9 / z);
    circle.setAttribute('fill', '#ffffff');
    circle.setAttribute('stroke', '#2563eb');
    circle.setAttribute('stroke-width', 2 / z);
    g.appendChild(circle);
    const icon = document.createElementNS(NS, 'text');
    icon.setAttribute('x', cx);
    icon.setAttribute('y', hy + 4.5 / z);
    icon.setAttribute('text-anchor', 'middle');
    icon.setAttribute('font-size', 13 / z);
    icon.setAttribute('font-weight', 'bold');
    icon.setAttribute('fill', '#2563eb');
    icon.setAttribute('pointer-events', 'none');
    icon.textContent = '↻';
    g.appendChild(icon);
    const title = document.createElementNS(NS, 'title');
    title.textContent = 'Arrastra para rotar la selección (Shift: de 15° en 15°)';
    g.appendChild(title);
    layer.appendChild(g);

    // Ángulo actual mientras se gira
    if (typeof this.rotationAngleDeg === 'number') {
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', cx + 14 / z);
      t.setAttribute('y', hy - 10 / z);
      t.setAttribute('font-size', 12 / z);
      t.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      t.setAttribute('fill', '#2563eb');
      t.setAttribute('pointer-events', 'none');
      t.textContent = `${this.rotationAngleDeg}°`;
      layer.appendChild(t);
    }
  }

  /**
   * Profundidad media de un enlace (solo si ambos átomos tienen 'depth', p. ej. sillas).
   * Positivo = más cerca del observador.
   */
  getBondDepth(bond) {
    const a1 = this.state.getAtom(bond.atom1);
    const a2 = this.state.getAtom(bond.atom2);
    if (!a1 || !a2 || typeof a1.depth !== 'number' || typeof a2.depth !== 'number') return null;
    return (a1.depth + a2.depth) / 2;
  }

  /**
   * Devuelve los ids de los enlaces que pasan POR DELANTE de otro enlace con el que se cruzan.
   * Esos enlaces se dibujan con un halo del color del fondo, que corta el enlace de atrás
   * (axiales internos de la silla que cruzan el borde opuesto del anillo).
   */
  computeCrossingHalos() {
    const halos = new Set();
    const items = [];
    for (const bond of this.state.bonds.values()) {
      const depth = this.getBondDepth(bond);
      if (depth === null) continue;
      const a1 = this.state.getAtom(bond.atom1);
      const a2 = this.state.getAtom(bond.atom2);
      items.push({ bond, depth, a1, a2 });
    }
    const orient = (ax, ay, bx, by, cx, cy) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const p = items[i], q = items[j];
        const ids = [p.bond.atom1, p.bond.atom2];
        if (ids.includes(q.bond.atom1) || ids.includes(q.bond.atom2)) continue;
        const d1 = orient(q.a1.x, q.a1.y, q.a2.x, q.a2.y, p.a1.x, p.a1.y);
        const d2 = orient(q.a1.x, q.a1.y, q.a2.x, q.a2.y, p.a2.x, p.a2.y);
        const d3 = orient(p.a1.x, p.a1.y, p.a2.x, p.a2.y, q.a1.x, q.a1.y);
        const d4 = orient(p.a1.x, p.a1.y, p.a2.x, p.a2.y, q.a2.x, q.a2.y);
        if (d1 * d2 < 0 && d3 * d4 < 0) {
          if (p.depth > q.depth) halos.add(p.bond.id);
          else if (q.depth > p.depth) halos.add(q.bond.id);
        }
      }
    }
    return halos;
  }

  renderCrossingHalo(a1, a2) {
    const halo = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const len = Math.hypot(a2.x - a1.x, a2.y - a1.y) || 1;
    // Recortar los extremos para no tapar los enlaces que comparten vértice
    const trim = Math.min(6, len / 4);
    const ux = (a2.x - a1.x) / len, uy = (a2.y - a1.y) / len;
    halo.setAttribute('x1', a1.x + ux * trim);
    halo.setAttribute('y1', a1.y + uy * trim);
    halo.setAttribute('x2', a2.x - ux * trim);
    halo.setAttribute('y2', a2.y - uy * trim);
    halo.setAttribute('stroke', (this.state && this.state.isDarkMode) ? '#090d16' : '#ffffff');
    halo.setAttribute('stroke-width', '7');
    halo.setAttribute('stroke-linecap', 'butt');
    halo.setAttribute('class', 'bond-crossing-halo');
    halo.setAttribute('pointer-events', 'none');
    return halo;
  }

  isBondInRing(a1Id, a2Id) {
    if (!this.state || !this.state.bonds) return false;
    const visited = new Set([a1Id]);
    const queue = [];

    for (const bond of this.state.bonds.values()) {
      if ((bond.atom1 === a1Id && bond.atom2 === a2Id) || (bond.atom1 === a2Id && bond.atom2 === a1Id)) {
        continue;
      }
      if (bond.atom1 === a1Id) {
        visited.add(bond.atom2);
        queue.push(bond.atom2);
      } else if (bond.atom2 === a1Id) {
        visited.add(bond.atom1);
        queue.push(bond.atom1);
      }
    }

    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr === a2Id) return true;

      for (const bond of this.state.bonds.values()) {
        if ((bond.atom1 === a1Id && bond.atom2 === a2Id) || (bond.atom1 === a2Id && bond.atom2 === a1Id)) {
          continue;
        }
        let next = null;
        if (bond.atom1 === curr && !visited.has(bond.atom2)) next = bond.atom2;
        else if (bond.atom2 === curr && !visited.has(bond.atom1)) next = bond.atom1;

        if (next) {
          visited.add(next);
          queue.push(next);
        }
      }
    }

    return false;
  }

  getRingInteriorDirection(a1, a2) {
    // Si el enlace no forma parte de un ciclo (ej. C=O, C=N exocíclicos o alquenos acíclicos),
    // NO es un enlace de anillo y debe ser un doble enlace simétrico perfectamente centrado.
    if (!this.isBondInRing(a1.id, a2.id)) {
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

    for (const bond of this.state.bonds.values()) {
      let other = null;
      if (bond.atom1 === a1.id && bond.atom2 !== a2.id) other = this.state.getAtom(bond.atom2);
      else if (bond.atom2 === a1.id && bond.atom1 !== a2.id) other = this.state.getAtom(bond.atom1);
      else if (bond.atom1 === a2.id && bond.atom2 !== a1.id) other = this.state.getAtom(bond.atom2);
      else if (bond.atom2 === a2.id && bond.atom1 !== a1.id) other = this.state.getAtom(bond.atom1);

      if (other) {
        const vx = other.x - midX;
        const vy = other.y - midY;
        const dot = vx * nx + vy * ny;
        dotSum += dot;
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
  }

  renderBond(bond, a1, a2, isSelected, isHovered) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `chem-bond ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', bond.id);

    const x1 = a1.x, y1 = a1.y;
    const x2 = a2.x, y2 = a2.y;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);

    if (length === 0) return group;

    const angle = Math.atan2(dy, dx);
    const ux = dx / length;
    const uy = dy / length;
    const perpX = -Math.sin(angle);
    const perpY = Math.cos(angle);

    const defaultBondColor = (this.state && this.state.isDarkMode) ? '#ffffff' : '#111827';
    const strokeColor = isSelected ? '#2563eb' : (isHovered ? '#3b82f6' : defaultBondColor);
    // Grosor normal limpio uniforme para todos los enlaces simples
    const baseStrokeWidth = isSelected ? 2.4 : 1.9;

    // Área táctil transparente
    const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hitArea.setAttribute('x1', x1);
    hitArea.setAttribute('y1', y1);
    hitArea.setAttribute('x2', x2);
    hitArea.setAttribute('y2', y2);
    hitArea.setAttribute('stroke', 'transparent');
    hitArea.setAttribute('stroke-width', '18');
    hitArea.setAttribute('class', 'bond-hit-area');
    group.appendChild(hitArea);

    switch (bond.type) {
      case 'double': {
        const ringDir = this.getRingInteriorDirection(a1, a2);

        if (ringDir.isRing) {
          const offsetDist = 4.2;
          const trimDist = 5.0;

          const outerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          outerLine.setAttribute('x1', x1);
          outerLine.setAttribute('y1', y1);
          outerLine.setAttribute('x2', x2);
          outerLine.setAttribute('y2', y2);
          outerLine.setAttribute('stroke', strokeColor);
          outerLine.setAttribute('stroke-width', baseStrokeWidth);
          outerLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(outerLine);

          const inX1 = x1 + ux * trimDist + ringDir.nx * offsetDist;
          const inY1 = y1 + uy * trimDist + ringDir.ny * offsetDist;
          const inX2 = x2 - ux * trimDist + ringDir.nx * offsetDist;
          const inY2 = y2 - uy * trimDist + ringDir.ny * offsetDist;

          const innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          innerLine.setAttribute('x1', inX1);
          innerLine.setAttribute('y1', inY1);
          innerLine.setAttribute('x2', inX2);
          innerLine.setAttribute('y2', inY2);
          innerLine.setAttribute('stroke', strokeColor);
          innerLine.setAttribute('stroke-width', baseStrokeWidth * 0.95);
          innerLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(innerLine);
        } else {
          // Alqueno acíclico o carbonilo:
          // 1. Línea principal continua, igual que un enlace simple
          const mainLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          mainLine.setAttribute('x1', x1);
          mainLine.setAttribute('y1', y1);
          mainLine.setAttribute('x2', x2);
          mainLine.setAttribute('y2', y2);
          mainLine.setAttribute('stroke', strokeColor);
          mainLine.setAttribute('stroke-width', baseStrokeWidth);
          mainLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(mainLine);

          // 2. Determinar lado y presencia de enlaces adyacentes (sp3/sustituyentes)
          let sideSum = 0;
          let hasNeighbors1 = false;
          let hasNeighbors2 = false;

          for (const b of this.state.bonds.values()) {
            if (b.id === bond.id) continue;
            let other = null;
            if (b.atom1 === a1.id) { other = this.state.getAtom(b.atom2); hasNeighbors1 = true; }
            else if (b.atom2 === a1.id) { other = this.state.getAtom(b.atom1); hasNeighbors1 = true; }
            if (other) {
              const vx = other.x - a1.x;
              const vy = other.y - a1.y;
              sideSum += (vx * perpX + vy * perpY);
            }

            let other2 = null;
            if (b.atom1 === a2.id) { other2 = this.state.getAtom(b.atom2); hasNeighbors2 = true; }
            else if (b.atom2 === a2.id) { other2 = this.state.getAtom(b.atom1); hasNeighbors2 = true; }
            if (other2) {
              const vx = other2.x - a2.x;
              const vy = other2.y - a2.y;
              sideSum += (vx * perpX + vy * perpY);
            }
          }

          // Lado interior/cóncavo preferente
          const side = sideSum > 0.05 ? 1 : (sideSum < -0.05 ? -1 : 1);
          const offsetDist = 4.0;

          // Recorte en los vértices que conectan con otros enlaces (sp3) para que no choquen
          const trim1 = hasNeighbors1 ? 6.0 : 2.5;
          const trim2 = hasNeighbors2 ? 6.0 : 2.5;

          const inX1 = x1 + ux * trim1 + perpX * side * offsetDist;
          const inY1 = y1 + uy * trim1 + perpY * side * offsetDist;
          const inX2 = x2 - ux * trim2 + perpX * side * offsetDist;
          const inY2 = y2 - uy * trim2 + perpY * side * offsetDist;

          const companionLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          companionLine.setAttribute('x1', inX1);
          companionLine.setAttribute('y1', inY1);
          companionLine.setAttribute('x2', inX2);
          companionLine.setAttribute('y2', inY2);
          companionLine.setAttribute('stroke', strokeColor);
          companionLine.setAttribute('stroke-width', baseStrokeWidth * 0.95);
          companionLine.setAttribute('stroke-linecap', 'round');
          group.appendChild(companionLine);
        }
        break;
      }

      case 'triple': {
        const offset = 3.6;
        for (const factor of [-1, 0, 1]) {
          const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          l.setAttribute('x1', x1 + perpX * offset * factor);
          l.setAttribute('y1', y1 + perpY * offset * factor);
          l.setAttribute('x2', x2 + perpX * offset * factor);
          l.setAttribute('y2', y2 + perpY * offset * factor);
          l.setAttribute('stroke', strokeColor);
          l.setAttribute('stroke-width', factor === 0 ? baseStrokeWidth : baseStrokeWidth * 0.9);
          l.setAttribute('stroke-linecap', 'round');
          group.appendChild(l);
        }
        break;
      }

      case 'bold': {
        // Enlace grueso (borde frontal de las sillas estilo IChO)
        const boldLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        boldLine.setAttribute('x1', x1);
        boldLine.setAttribute('y1', y1);
        boldLine.setAttribute('x2', x2);
        boldLine.setAttribute('y2', y2);
        boldLine.setAttribute('stroke', strokeColor);
        boldLine.setAttribute('stroke-width', bond.boldWidth || 5);
        boldLine.setAttribute('stroke-linecap', 'round');
        group.appendChild(boldLine);
        break;
      }

      case 'wedge': {
        // wedgeWidth opcional: ancho del extremo grueso (las sillas lo igualan al enlace 'bold').
        // En ese caso la cuña es un trapecio que arranca con el grosor de un enlace normal
        // (como el borde remarcado de las sillas IChO), en vez de terminar en punta.
        const wedgeBase = bond.wedgeWidth ? bond.wedgeWidth / 2 : 4.2;
        const tipHalf = bond.wedgeWidth ? baseStrokeWidth / 2 : 0;
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const p2 = `${x2 + perpX * wedgeBase},${y2 + perpY * wedgeBase}`;
        const p3 = `${x2 - perpX * wedgeBase},${y2 - perpY * wedgeBase}`;
        if (tipHalf > 0) {
          const p0 = `${x1 - perpX * tipHalf},${y1 - perpY * tipHalf}`;
          const p1 = `${x1 + perpX * tipHalf},${y1 + perpY * tipHalf}`;
          poly.setAttribute('points', `${p0} ${p1} ${p2} ${p3}`);
          poly.setAttribute('stroke', strokeColor);
          poly.setAttribute('stroke-width', '0.6');
          poly.setAttribute('stroke-linejoin', 'round');
        } else {
          poly.setAttribute('points', `${x1},${y1} ${p2} ${p3}`);
        }
        poly.setAttribute('fill', strokeColor);
        group.appendChild(poly);
        break;
      }

      case 'dash': {
        const numDashes = 7;
        for (let i = 1; i <= numDashes; i++) {
          const t = i / numDashes;
          const px = x1 + dx * t;
          const py = y1 + dy * t;
          const halfWidth = 0.8 + (t * 3.6);
          const dl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          dl.setAttribute('x1', px - perpX * halfWidth);
          dl.setAttribute('y1', py - perpY * halfWidth);
          dl.setAttribute('x2', px + perpX * halfWidth);
          dl.setAttribute('y2', py + perpY * halfWidth);
          dl.setAttribute('stroke', strokeColor);
          dl.setAttribute('stroke-width', '1.8');
          group.appendChild(dl);
        }
        break;
      }

      case 'wavy': {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const waves = 4;
        let d = `M ${x1} ${y1}`;
        for (let i = 0; i < waves * 2; i++) {
          const t1 = (i + 0.5) / (waves * 2);
          const t2 = (i + 1) / (waves * 2);
          const side = i % 2 === 0 ? 1 : -1;
          const cx = x1 + dx * t1 + perpX * 3.5 * side;
          const cy = y1 + dy * t1 + perpY * 3.5 * side;
          const ex = x1 + dx * t2;
          const ey = y1 + dy * t2;
          d += ` Q ${cx} ${cy}, ${ex} ${ey}`;
        }
        path.setAttribute('d', d);
        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', baseStrokeWidth);
        path.setAttribute('fill', 'none');
        group.appendChild(path);
        break;
      }

      case 'dative': // enlace de coordinación (N→metal): se dibuja punteado y no cuenta en la valencia
      case 'dashed': {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', strokeColor);
        line.setAttribute('stroke-width', baseStrokeWidth);
        line.setAttribute('stroke-dasharray', '5 4');
        line.setAttribute('stroke-linecap', 'round');
        group.appendChild(line);
        break;
      }

      case 'single':
      default: {
        // Enlace simple
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', strokeColor);
        line.setAttribute('stroke-width', baseStrokeWidth);
        line.setAttribute('stroke-linecap', 'round');
        group.appendChild(line);
        break;
      }
    }

    return group;
  }

  renderAtom(atom, isSelected, isHovered, valInfo) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `chem-atom ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', atom.id);

    // Al exportar no se marcan los errores de valencia (es un aviso de edición, no parte del dibujo)
    const hasError = valInfo && valInfo.hasError && !this.exportMode;

    if (hasError) {
      const errorHalo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      errorHalo.setAttribute('cx', atom.x);
      errorHalo.setAttribute('cy', atom.y);
      errorHalo.setAttribute('r', '13');
      errorHalo.setAttribute('fill', '#ef4444');
      errorHalo.setAttribute('fill-opacity', '0.35');
      errorHalo.setAttribute('stroke', '#dc2626');
      errorHalo.setAttribute('stroke-width', '2');
      errorHalo.setAttribute('filter', 'url(#glow-error)');
      errorHalo.setAttribute('class', 'valence-error-pulse');
      group.appendChild(errorHalo);

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = valInfo.message;
      group.appendChild(title);
    }

    const displayInfo = getFormattedAtomDisplay(atom, this.state);

    // Resaltado de selección / hover: solo el círculo en carbonos implícitos. Los átomos con
    // etiqueta (OH, NH2, Cl...) no llevan resaltado: el círculo quedaba tapado por el fondo de la
    // etiqueta (asomaba un trozo) y un recuadro alrededor del texto se veía peor.
    if ((isSelected || isHovered) && displayInfo.isImplicit) {
      const selRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      selRing.setAttribute('cx', atom.x);
      selRing.setAttribute('cy', atom.y);
      selRing.setAttribute('r', '9');
      selRing.setAttribute('fill', isSelected ? '#bfdbfe' : '#e0e7ff');
      selRing.setAttribute('fill-opacity', '0.6');
      selRing.setAttribute('stroke', '#2563eb');
      selRing.setAttribute('stroke-width', '1.5');
      group.appendChild(selRing);
    }

    if (!displayInfo.isImplicit) {
      const isDark = this.state && this.state.isDarkMode;
      // Modo blanco y negro: sin código de colores por elemento (estilo examen); los errores siguen en rojo
      let textColor = hasError ? '#dc2626' : ((!SvgRenderer.monochrome && ELEMENTS[displayInfo.element]?.color) || (isDark ? '#ffffff' : '#111827'));
      if (isDark && textColor === '#111827') textColor = '#ffffff';
      const { text, bondingAtom, bondingSide, prefix, suffix } = displayInfo;

      // Dimensiones tipográficas estándar (Arial 15px)
      // El átomo de anclaje (ej. 'N', 'O', 'C') se centra EXACTAMENTE en (atom.x, atom.y)
      const letterWidth = (bondingAtom.length > 1) ? Math.max(17, bondingAtom.length * 8.5) : 11;
      const prefixWidth = prefix ? (prefix.length * 8.5) : 0;
      const suffixWidth = suffix ? (suffix.length * 8.5) : 0;

      // Margen estricto (2.0px) para evitar recortar de más los enlaces
      const margin = 2.0;
      let textXMin, textXMax;

      // Átomo con carga sola (N+, O−, S+...): la LETRA va centrada en el átomo y la carga a su
      // derecha. Si se centrara el texto completo "O−", la letra quedaría corrida a la izquierda
      // respecto al enlace (medio ancho del signo).
      const chargedMatch = bondingSide === 'center' && text ? /^([A-Z][a-z]?)(\d*[+\-−])$/.exec(text) : null;
      const chargedMainW = chargedMatch ? this.estimateTextWidth(chargedMatch[1], 15) : 0;

      const vertH = bondingSide === 'below' || bondingSide === 'above';
      if (vertH) {
        // H debajo/encima del átomo (amidas -NH-): el fondo cubre solo el ancho de la letra
        textXMin = atom.x - letterWidth / 2 - margin;
        textXMax = atom.x + letterWidth / 2 + margin;
      } else if (chargedMatch) {
        // El fondo cubre solo la letra: la carga es un superíndice y, si el fondo la incluyera,
        // recortaría los enlaces que salen hacia la derecha (p. ej. el N=O del nitro).
        textXMin = atom.x - chargedMainW / 2 - margin;
        textXMax = atom.x + chargedMainW / 2 + margin;
      } else if (bondingSide === 'right') {
        // H2N- (a la izquierda del enlace): 'N' centrado en atom.x, 'H2' a la izquierda
        textXMin = atom.x - letterWidth / 2 - prefixWidth - margin;
        textXMax = atom.x + letterWidth / 2 + margin;
      } else if (bondingSide === 'left') {
        // -NH2 (a la derecha o vertical): 'N' centrado en atom.x, 'H2' a la derecha
        textXMin = atom.x - letterWidth / 2 - margin;
        textXMax = atom.x + letterWidth / 2 + suffixWidth + margin;
      } else {
        // Átomo simple, grupo o heterociclo centrado
        const fullWidth = text ? Math.max(letterWidth, text.length * 8.5) : letterWidth;
        textXMin = atom.x - fullWidth / 2 - margin;
        textXMax = atom.x + fullWidth / 2 + margin;
      }

      const textYMin = atom.y - 7.5 - margin - (bondingSide === 'above' ? 16 : 0);
      const textYMax = atom.y + 6.5 + margin + (bondingSide === 'below' ? 16 : 0);
      const maskWidth = textXMax - textXMin;
      const maskHeight = textYMax - textYMin;

      // 1. Máscara de fondo ceñida que no devora el enlace
      const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgRect.setAttribute('x', textXMin);
      bgRect.setAttribute('y', textYMin);
      bgRect.setAttribute('width', maskWidth);
      bgRect.setAttribute('height', maskHeight);
      bgRect.setAttribute('rx', '2.5');
      bgRect.setAttribute('ry', '2.5');
      bgRect.setAttribute('fill', isDark ? '#090d16' : '#ffffff');
      group.appendChild(bgRect);

      // 2. Elemento de texto con posicionamiento exacto del heteroátomo en el enlace
      const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElem.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      textElem.setAttribute('font-size', '15');
      textElem.setAttribute('font-weight', '500');
      textElem.setAttribute('fill', textColor);

      if (bondingSide === 'right') {
        // Prefijo a la izquierda (ej. H2)
        const prefixTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        prefixTspan.setAttribute('x', atom.x - letterWidth / 2);
        prefixTspan.setAttribute('y', atom.y + 5);
        prefixTspan.setAttribute('text-anchor', 'end');
        this.populateFormattedText(prefixTspan, prefix);
        textElem.appendChild(prefixTspan);

        // Heteroátomo de unión centrado en atom.x (ej. N)
        const mainTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        mainTspan.setAttribute('x', atom.x);
        mainTspan.setAttribute('y', atom.y + 5);
        mainTspan.setAttribute('text-anchor', 'middle');
        mainTspan.textContent = bondingAtom;
        textElem.appendChild(mainTspan);

        // Carga tras el heteroátomo (ej. H4N+, H3O+): sin esto el '+' se perdía
        if (suffix) {
          const suffixTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          suffixTspan.setAttribute('x', atom.x + letterWidth / 2);
          suffixTspan.setAttribute('y', atom.y + 5);
          suffixTspan.setAttribute('text-anchor', 'start');
          // Un signo suelto no tiene letra delante para que el parser lo vea como carga: '^' lo fuerza a superíndice
          this.populateFormattedText(suffixTspan, /^[+\-−]$/.test(suffix) ? `^${suffix}` : suffix);
          textElem.appendChild(suffixTspan);
        }
      } else if (bondingSide === 'left') {
        // Heteroátomo de unión centrado en atom.x (ej. N)
        const mainTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        mainTspan.setAttribute('x', atom.x);
        mainTspan.setAttribute('y', atom.y + 5);
        mainTspan.setAttribute('text-anchor', 'middle');
        mainTspan.textContent = bondingAtom;
        textElem.appendChild(mainTspan);

        // Sufijo a la derecha (ej. H2)
        const suffixTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        suffixTspan.setAttribute('x', atom.x + letterWidth / 2);
        suffixTspan.setAttribute('y', atom.y + 5);
        suffixTspan.setAttribute('text-anchor', 'start');
        this.populateFormattedText(suffixTspan, suffix);
        textElem.appendChild(suffixTspan);
      } else if (vertH) {
        const mainTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        mainTspan.setAttribute('x', atom.x);
        mainTspan.setAttribute('y', atom.y + 5);
        mainTspan.setAttribute('text-anchor', 'middle');
        mainTspan.textContent = bondingAtom;
        textElem.appendChild(mainTspan);
        const hTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        hTspan.setAttribute('x', atom.x);
        hTspan.setAttribute('y', atom.y + 5 + (bondingSide === 'below' ? 16 : -16));
        hTspan.setAttribute('text-anchor', 'middle');
        hTspan.textContent = suffix;
        textElem.appendChild(hTspan);
      } else if (chargedMatch) {
        textElem.setAttribute('x', atom.x - chargedMainW / 2);
        textElem.setAttribute('y', atom.y + 5);
        textElem.setAttribute('text-anchor', 'start');
        this.populateFormattedText(textElem, text);
      } else {
        textElem.setAttribute('x', atom.x);
        textElem.setAttribute('y', atom.y + 5);
        textElem.setAttribute('text-anchor', 'middle');
        this.populateFormattedText(textElem, text);
      }

      group.appendChild(textElem);

      // Renderizar pares libres de electrones (lone pairs)
      if (atom.lonePairs && atom.lonePairs > 0) {
        const lpAngles = getAtomLonePairAngles(atom, this.state, atom.lonePairs);
        const dist = 14;
        for (const ang of lpAngles) {
          const cx = atom.x + dist * Math.cos(ang);
          const cy = atom.y + dist * Math.sin(ang);
          const tx = -Math.sin(ang);
          const ty = Math.cos(ang);
          const sep = 3.5;

          const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot1.setAttribute('cx', cx - sep * tx);
          dot1.setAttribute('cy', cy - sep * ty);
          dot1.setAttribute('r', '1.6');
          dot1.setAttribute('fill', '#0f172a');
          group.appendChild(dot1);

          const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot2.setAttribute('cx', cx + sep * tx);
          dot2.setAttribute('cy', cy + sep * ty);
          dot2.setAttribute('r', '1.6');
          dot2.setAttribute('fill', '#0f172a');
          group.appendChild(dot2);
        }
      }

      // Renderizar carga formal si no está ya integrada en el texto de la fórmula
      const hasChargeInText = /[+\-−]/.test(displayInfo.text || '');
      if (atom.charge !== 0 && atom.charge !== undefined && !hasChargeInText) {
        const isPos = atom.charge > 0;
        const mono = SvgRenderer.monochrome;
        const strokeCol = mono ? ((this.state && this.state.isDarkMode) ? '#ffffff' : '#111827') : (isPos ? '#2563eb' : '#dc2626');
        const fillCol = mono ? ((this.state && this.state.isDarkMode) ? '#090d16' : '#ffffff') : (isPos ? '#eff6ff' : '#fef2f2');
        const badgeX = textXMax + 7;
        const badgeY = atom.y - 7;

        const badgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const badgeCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        badgeCircle.setAttribute('cx', badgeX);
        badgeCircle.setAttribute('cy', badgeY);
        badgeCircle.setAttribute('r', '5.5');
        badgeCircle.setAttribute('fill', fillCol);
        badgeCircle.setAttribute('stroke', strokeCol);
        badgeCircle.setAttribute('stroke-width', '1.2');
        badgeGroup.appendChild(badgeCircle);

        const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        badgeText.setAttribute('x', badgeX);
        badgeText.setAttribute('y', badgeY + 3.5);
        badgeText.setAttribute('text-anchor', 'middle');
        badgeText.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
        badgeText.setAttribute('font-size', '10');
        badgeText.setAttribute('font-weight', 'bold');
        badgeText.setAttribute('fill', strokeCol);
        badgeText.textContent = isPos ? (atom.charge === 1 ? '+' : `${atom.charge}+`) : (atom.charge === -1 ? '−' : `${Math.abs(atom.charge)}−`);
        badgeGroup.appendChild(badgeText);

        group.appendChild(badgeGroup);
      }
    } else {
      const carbonPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      carbonPoint.setAttribute('cx', atom.x);
      carbonPoint.setAttribute('cy', atom.y);
      carbonPoint.setAttribute('r', '4');
      carbonPoint.setAttribute('fill', isHovered ? '#3b82f6' : 'transparent');
      group.appendChild(carbonPoint);

      // Pares libres en un carbono implícito (p. ej. carbanión)
      if (atom.lonePairs && atom.lonePairs > 0) {
        const lpAngles = getAtomLonePairAngles(atom, this.state, atom.lonePairs);
        const dist = 12;
        for (const ang of lpAngles) {
          const cx = atom.x + dist * Math.cos(ang);
          const cy = atom.y + dist * Math.sin(ang);
          const tx = -Math.sin(ang);
          const ty = Math.cos(ang);
          const sep = 3.5;

          const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot1.setAttribute('cx', cx - sep * tx);
          dot1.setAttribute('cy', cy - sep * ty);
          dot1.setAttribute('r', '1.6');
          dot1.setAttribute('fill', (this.state && this.state.isDarkMode) ? '#ffffff' : '#0f172a');
          group.appendChild(dot1);

          const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot2.setAttribute('cx', cx + sep * tx);
          dot2.setAttribute('cy', cy + sep * ty);
          dot2.setAttribute('r', '1.6');
          dot2.setAttribute('fill', (this.state && this.state.isDarkMode) ? '#ffffff' : '#0f172a');
          group.appendChild(dot2);
        }
      }

      // Carga formal en un carbono implícito (p. ej. carbocatión / carbanión)
      if (atom.charge !== 0 && atom.charge !== undefined) {
        const lpAngles = getAtomLonePairAngles(atom, this.state, 1);
        const angle = lpAngles.length > 0 ? lpAngles[0] : -Math.PI / 4;
        const isPos = atom.charge > 0;
        const mono = SvgRenderer.monochrome;
        const strokeCol = mono ? ((this.state && this.state.isDarkMode) ? '#ffffff' : '#111827') : (isPos ? '#2563eb' : '#dc2626');
        const fillCol = mono ? ((this.state && this.state.isDarkMode) ? '#090d16' : '#ffffff') : (isPos ? '#eff6ff' : '#fef2f2');
        const badgeX = atom.x + 12 * Math.cos(angle);
        const badgeY = atom.y + 12 * Math.sin(angle);

        const badgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const badgeCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        badgeCircle.setAttribute('cx', badgeX);
        badgeCircle.setAttribute('cy', badgeY);
        badgeCircle.setAttribute('r', '5.5');
        badgeCircle.setAttribute('fill', fillCol);
        badgeCircle.setAttribute('stroke', strokeCol);
        badgeCircle.setAttribute('stroke-width', '1.2');
        badgeGroup.appendChild(badgeCircle);

        const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        badgeText.setAttribute('x', badgeX);
        badgeText.setAttribute('y', badgeY + 3.5);
        badgeText.setAttribute('text-anchor', 'middle');
        badgeText.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
        badgeText.setAttribute('font-size', '10');
        badgeText.setAttribute('font-weight', 'bold');
        badgeText.setAttribute('fill', strokeCol);
        badgeText.textContent = isPos ? '+' : '−';
        badgeGroup.appendChild(badgeText);

        group.appendChild(badgeGroup);
      }
    }

    return group;
  }

  /**
   * Ancho aproximado (px) de un texto en Arial: anchos de avance por carácter en em.
   * Se usa para centrar exactamente la letra de un átomo cargado sobre su posición.
   */
  estimateTextWidth(str, fontSize = 15) {
    const em = {
      A: 0.667, B: 0.667, C: 0.722, D: 0.722, E: 0.667, F: 0.611, G: 0.778, H: 0.722, I: 0.278,
      K: 0.667, L: 0.556, M: 0.833, N: 0.722, O: 0.778, P: 0.667, R: 0.722, S: 0.667, T: 0.611,
      U: 0.722, V: 0.667, W: 0.944, X: 0.667, Y: 0.667, Z: 0.611,
      a: 0.556, b: 0.556, e: 0.556, g: 0.556, i: 0.222, l: 0.222, n: 0.556, o: 0.556, r: 0.333, s: 0.5, u: 0.556
    };
    let w = 0;
    for (const ch of String(str)) w += (em[ch] !== undefined ? em[ch] : 0.6);
    return w * fontSize;
  }

  populateFormattedText(textElem, str) {
    if (!str) return;
    renderFormattedSvgText(textElem, str);
  }

  renderTextLabel(label, isSelected) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `chem-label ${isSelected ? 'selected' : ''}`);
    group.setAttribute('data-id', label.id);

    const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElem.setAttribute('x', label.x);
    textElem.setAttribute('y', label.y);
    textElem.setAttribute('text-anchor', 'middle');

    if (label.isStereo) {
      // Estilo estereoquímico IChO: Times New Roman, bold italic, 19px (ej. Anti, Syn, E, Z)
      textElem.setAttribute('font-family', "'Times New Roman', Times, Georgia, serif");
      textElem.setAttribute('font-size', label.fontSize || 19);
      textElem.setAttribute('font-weight', 'bold');
      textElem.setAttribute('font-style', 'italic');
    } else if (label.isDescription) {
      // Descripción / subtítulo explicativo: Arial 13px (ej. Producto de Control Cinético, Si3O9(6-))
      textElem.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      textElem.setAttribute('font-size', label.fontSize || 13);
      textElem.setAttribute('font-weight', label.fontWeight || 'normal');
      textElem.setAttribute('font-style', 'normal');
    } else {
      textElem.setAttribute('font-family', label.fontFamily || 'Arial, Helvetica, sans-serif');
      textElem.setAttribute('font-size', label.fontSize || (label.isIntermediary ? 22 : 14));
      textElem.setAttribute('font-weight', label.fontWeight || (label.isIntermediary ? 'bold' : 'normal'));
      textElem.setAttribute('font-style', label.fontStyle || 'normal');
    }

    const defaultLabelColor = (this.state && this.state.isDarkMode) ? '#ffffff' : '#111827';
    textElem.setAttribute('fill', isSelected ? '#2563eb' : (label.color || defaultLabelColor));
    renderFormattedSvgText(textElem, label.text);
    group.appendChild(textElem);

    return group;
  }

  renderChairGuides(layer) {
    if (!this.hoveredAtomId) return;
    const atom = this.state.getAtom(this.hoveredAtomId);
    if (!atom || !atom.chairVertex) return;

    const guides = atom.substituentGuides;
    if (!guides) return;

    for (const [posType, guide] of Object.entries(guides)) {
      const targetX = atom.x + guide.dx;
      const targetY = atom.y + guide.dy;

      const guideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      guideLine.setAttribute('x1', atom.x);
      guideLine.setAttribute('y1', atom.y);
      guideLine.setAttribute('x2', targetX);
      guideLine.setAttribute('y2', targetY);
      guideLine.setAttribute('stroke', '#059669');
      guideLine.setAttribute('stroke-width', '1.5');
      guideLine.setAttribute('stroke-dasharray', '3 3');
      layer.appendChild(guideLine);

      const guideDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      guideDot.setAttribute('cx', targetX);
      guideDot.setAttribute('cy', targetY);
      guideDot.setAttribute('r', '4');
      guideDot.setAttribute('fill', '#10b981');
      guideDot.setAttribute('class', `chair-guide-dot guide-${posType}`);
      guideDot.setAttribute('data-atom-id', atom.id);
      guideDot.setAttribute('data-guide-type', posType);
      guideDot.style.cursor = 'pointer';

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `Clic para añadir enlace ${posType.toUpperCase()}`;
      guideDot.appendChild(title);

      layer.appendChild(guideDot);
    }
  }
}

/**
 * Las miniaturas de estructuras (molécula sobre flecha, recuadro de referencias) se dibujan con el
 * mismo renderer que la pizarra: etiquetas automáticas (OH, NH2...), cargas, cuñas, enlaces gruesos,
 * enlaces ondulados, etc.
 */
ReferenceBoxRenderer.thumbnailRenderer = (structObj, group, isDark) => {
  // Devuelve false si no se pudo usar el renderer completo (p. ej. un DOM simulado en las
  // pruebas); entonces se usa el dibujo simplificado. Nada se añade a 'group' hasta tener éxito.
  try {
    const tmp = new ChemState();
    tmp.isDarkMode = isDark;
    tmp.loadFromObject(JSON.parse(JSON.stringify({ atoms: structObj.atoms || [], bonds: structObj.bonds || [] })), false);
    const renderer = new SvgRenderer(document.createElementNS('http://www.w3.org/2000/svg', 'svg'), tmp);
    const neutralize = (el, cls) => {
      // Sin clases/ids de átomo o enlace: un clic en la miniatura no debe tratarse como un átomo
      // de la pizarra principal (abre su editor a través del grupo contenedor)
      el.setAttribute('class', cls);
      el.removeAttribute('data-id');
      return el;
    };
    const parts = [];
    for (const b of tmp.bonds.values()) {
      const a1 = tmp.getAtom(b.atom1);
      const a2 = tmp.getAtom(b.atom2);
      if (a1 && a2) parts.push(neutralize(renderer.renderBond(b, a1, a2, false, false), 'thumb-bond'));
    }
    for (const a of tmp.atoms.values()) {
      parts.push(neutralize(renderer.renderAtom(a, false, false, null), 'thumb-atom'));
    }
    parts.forEach(p => group.appendChild(p));
    return true;
  } catch (err) {
    return false;
  }
};


  // --- js/tools/select-tool.js ---
/**
 * select-tool.js - Herramienta de selección múltiple, desplazamiento y redimensionamiento
 */


class SelectTool {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.isDragging = false;
    this.dragStartPos = null;
    this.initialPositions = new Map();
    this.isMarqueeSelecting = false;
    this.activeResizeBox = null;
  }

  onMouseDown(e, canvasPos, targetInfo) {
    // 0. Tirador de rotación (↻) de la selección: gira los átomos seleccionados alrededor de su centro
    if (targetInfo && targetInfo.isRotateHandle) {
      const atoms = Array.from(this.state.selected.atoms).map(id => this.state.getAtom(id)).filter(Boolean);
      if (atoms.length >= 2) {
        this.state.saveSnapshot();
        const cx = atoms.reduce((s, a) => s + a.x, 0) / atoms.length;
        const cy = atoms.reduce((s, a) => s + a.y, 0) / atoms.length;
        this.rotation = {
          cx, cy,
          startAngle: Math.atan2(canvasPos.y - cy, canvasPos.x - cx),
          initial: new Map(atoms.map(a => [a.id, { x: a.x, y: a.y }]))
        };
      }
      return;
    }

    // 1. Si se hace clic en el tirador de redimensionado de una caja de referencias
    if (targetInfo && targetInfo.isBoxResizeHandle) {
      this.activeResizeBox = this.state.referenceBoxes.get(targetInfo.boxId);
      this.isDragging = true;
      this.dragStartPos = { x: canvasPos.x, y: canvasPos.y };
      return;
    }

    // 2. Si se hace clic sobre un elemento existente. Si forma parte de la selección actual
    //    (p. ej. un enlace de una molécula seleccionada con el recuadro, o el recuadro de
    //    compuesto que la contiene), se arrastra toda la selección en vez de reemplazarla.
    if (targetInfo && targetInfo.id) {
      if (!e.shiftKey && this.isPartOfSelection(targetInfo, canvasPos)) {
        if (targetInfo.type === 'box') this.state.selected.boxes.add(targetInfo.id);
      } else {
        this.handleElementClick(targetInfo, e.shiftKey);
      }
      this.startDrag(canvasPos);
      return;
    }

    // 3. Clic en espacio libre dentro de la selección: arrastrarla
    if (!e.shiftKey && this.isInsideSelectionBounds(canvasPos)) {
      this.startDrag(canvasPos);
      return;
    }

    // 4. Clic en espacio libre
    if (!e.shiftKey) {
      this.state.clearSelection();
    }
    this.isMarqueeSelecting = true;
    this.dragStartPos = { x: canvasPos.x, y: canvasPos.y };
    this.renderer.render();
  }

  onMouseMove(e, canvasPos, targetInfo) {
    if (this.rotation) {
      const r = this.rotation;
      let angle = Math.atan2(canvasPos.y - r.cy, canvasPos.x - r.cx) - r.startAngle;
      if (e && e.shiftKey) {
        const step = Math.PI / 12; // Shift: saltos de 15°
        angle = Math.round(angle / step) * step;
      }
      const cos = Math.cos(angle), sin = Math.sin(angle);
      for (const [id, p] of r.initial) {
        const a = this.state.getAtom(id);
        if (!a) continue;
        const dx = p.x - r.cx, dy = p.y - r.cy;
        a.x = r.cx + dx * cos - dy * sin;
        a.y = r.cy + dx * sin + dy * cos;
      }
      this.renderer.rotationAngleDeg = Math.round((angle * 180) / Math.PI);
      this.renderer.render();
      return;
    }

    if (!this.isDragging && !this.isMarqueeSelecting) return;

    if (this.activeResizeBox) {
      const dx = canvasPos.x - this.dragStartPos.x;
      const dy = canvasPos.y - this.dragStartPos.y;
      this.activeResizeBox.width = Math.max(120, this.activeResizeBox.width + dx);
      this.activeResizeBox.height = Math.max(50, this.activeResizeBox.height + dy);
      this.activeResizeBox.userSized = true; // tamaño elegido a mano: no compactarlo automáticamente
      this.dragStartPos = { x: canvasPos.x, y: canvasPos.y };
      this.renderer.render();
      return;
    }

    if (this.isDragging && this.dragStartPos) {
      const dx = canvasPos.x - this.dragStartPos.x;
      const dy = canvasPos.y - this.dragStartPos.y;

      // Desplazar átomos seleccionados
      for (const [id, pos] of this.initialPositions.get('atoms').entries()) {
        const atom = this.state.getAtom(id);
        if (atom) {
          atom.x = pos.x + dx;
          atom.y = pos.y + dy;
        }
      }

      // Desplazar flechas seleccionadas
      for (const [id, pos] of this.initialPositions.get('arrows').entries()) {
        const arrow = this.state.arrows.get(id);
        if (arrow) {
          arrow.x1 = pos.x1 + dx;
          arrow.y1 = pos.y1 + dy;
          arrow.x2 = pos.x2 + dx;
          arrow.y2 = pos.y2 + dy;
        }
      }

      // Desplazar rótulos seleccionados
      for (const [id, pos] of this.initialPositions.get('labels').entries()) {
        const label = this.state.textLabels.get(id);
        if (label) {
          label.x = pos.x + dx;
          label.y = pos.y + dy;
        }
      }

      // Desplazar cajas de referencias seleccionadas
      for (const [id, pos] of this.initialPositions.get('boxes').entries()) {
        const box = this.state.referenceBoxes.get(id);
        if (box) {
          box.x = pos.x + dx;
          box.y = pos.y + dy;
        }
      }

      this.renderer.render();
      return;
    }

    if (this.isMarqueeSelecting && this.dragStartPos) {
      this.updateMarqueePreview(this.dragStartPos.x, this.dragStartPos.y, canvasPos.x, canvasPos.y);
    }
  }

  onMouseUp(e, canvasPos, targetInfo) {
    if (this.rotation) {
      this.rotation = null;
      this.renderer.rotationAngleDeg = null;
      this.state.updateValences();
      this.renderer.render();
      return;
    }

    if (this.isDragging) {
      // Deshacer debe volver a la posición de antes del arrastre (solo si algo se movió)
      if (this.preDragSnapshot && this.state.makeSnapshot() !== this.preDragSnapshot) {
        this.state.saveSnapshot(this.preDragSnapshot);
      }
      this.preDragSnapshot = null;
      this.isDragging = false;
      this.dragStartPos = null;
      this.activeResizeBox = null;
      this.renderer.render();
    }

    if (this.isMarqueeSelecting) {
      this.clearMarqueePreview();
      this.finishMarqueeSelection(this.dragStartPos, canvasPos);
      this.isMarqueeSelecting = false;
      this.dragStartPos = null;
      this.renderer.render();
    }
  }

  handleElementClick(targetInfo, isShift) {
    const sel = this.state.selected;
    const typeMap = {
      atom: sel.atoms,
      bond: sel.bonds,
      arrow: sel.arrows,
      label: sel.labels,
      box: sel.boxes
    };

    const targetSet = typeMap[targetInfo.type];
    if (!targetSet) return;

    if (targetInfo.type === 'atom' && this.state.activeChargeMode) {
      const atom = this.state.getAtom(targetInfo.id);
      if (atom) {
        this.state.saveSnapshot();
        this.state.applyChargeToAtom(atom, this.state.activeChargeMode);
        this.state.updateValences();
      }
    }

    if (isShift) {
      if (targetSet.has(targetInfo.id)) {
        targetSet.delete(targetInfo.id);
      } else {
        targetSet.add(targetInfo.id);
      }
    } else {
      if (!targetSet.has(targetInfo.id)) {
        this.state.clearSelection();
        targetSet.add(targetInfo.id);
      }
    }
  }

  startDrag(canvasPos) {
    this.preDragSnapshot = this.state.makeSnapshot();
    this.isDragging = true;
    this.dragStartPos = { x: canvasPos.x, y: canvasPos.y };
    this.recordInitialPositions();
    this.renderer.render();
  }

  /** Rectángulo que rodea los átomos, flechas y rótulos seleccionados (null si no hay) */
  getSelectionBounds() {
    const sel = this.state.selected;
    const xs = [], ys = [];
    for (const id of sel.atoms) {
      const a = this.state.getAtom(id);
      if (a) { xs.push(a.x); ys.push(a.y); }
    }
    for (const id of sel.arrows) {
      const a = this.state.arrows.get(id);
      if (a) { xs.push(a.x1, a.x2); ys.push(a.y1, a.y2); }
    }
    for (const id of sel.labels) {
      const l = this.state.textLabels.get(id);
      if (l) { xs.push(l.x); ys.push(l.y); }
    }
    if (xs.length === 0) return null;
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  }

  /** ¿El punto cae sobre la zona de la selección? (margen para etiquetas como OH o Br) */
  isInsideSelectionBounds(pos, margin = 15) {
    const b = this.getSelectionBounds();
    if (!b) return false;
    return pos.x >= b.minX - margin && pos.x <= b.maxX + margin &&
           pos.y >= b.minY - margin && pos.y <= b.maxY + margin;
  }

  /** ¿El elemento clicado pertenece a la selección actual, de modo que hay que arrastrarla entera? */
  isPartOfSelection(targetInfo, pos) {
    const sel = this.state.selected;
    if (targetInfo.type === 'bond') {
      const b = this.state.bonds.get(targetInfo.id);
      return Boolean(b && sel.atoms.has(b.atom1) && sel.atoms.has(b.atom2));
    }
    if (targetInfo.type === 'box') {
      const box = this.state.referenceBoxes.get(targetInfo.id);
      return Boolean(box && box.boxType === 'compound' && this.isInsideSelectionBounds(pos));
    }
    return false;
  }

  recordInitialPositions() {
    this.initialPositions = new Map([
      ['atoms', new Map()],
      ['arrows', new Map()],
      ['labels', new Map()],
      ['boxes', new Map()]
    ]);

    // Átomos que se mueven: los seleccionados, los extremos de los enlaces seleccionados
    // y la molécula que contiene cada recuadro de compuesto seleccionado
    const atomIds = new Set(this.state.selected.atoms);
    for (const id of this.state.selected.bonds) {
      const b = this.state.bonds.get(id);
      if (b) { atomIds.add(b.atom1); atomIds.add(b.atom2); }
    }
    for (const id of this.state.selected.boxes) {
      const box = this.state.referenceBoxes.get(id);
      if (box && box.boxType === 'compound') {
        for (const a of ProblemBuilder.getAtomsInsideBox(box, this.state)) atomIds.add(a.id);
      }
    }
    for (const id of atomIds) {
      const a = this.state.getAtom(id);
      if (a) this.initialPositions.get('atoms').set(id, { x: a.x, y: a.y });
    }

    for (const id of this.state.selected.arrows) {
      const arr = this.state.arrows.get(id);
      if (arr) this.initialPositions.get('arrows').set(id, { x1: arr.x1, y1: arr.y1, x2: arr.x2, y2: arr.y2 });
    }

    for (const id of this.state.selected.labels) {
      const l = this.state.textLabels.get(id);
      if (l) this.initialPositions.get('labels').set(id, { x: l.x, y: l.y });
    }

    for (const id of this.state.selected.boxes) {
      const b = this.state.referenceBoxes.get(id);
      if (b) this.initialPositions.get('boxes').set(id, { x: b.x, y: b.y });
    }
  }

  updateMarqueePreview(x1, y1, x2, y2) {
    if (!this.renderer || !this.renderer.svg) return;
    const root = this.renderer.svg.querySelector('#canvas-root') || this.renderer.svg;
    let preview = this.renderer.svg.querySelector('.marquee-selection-preview');
    if (!preview) {
      preview = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      preview.setAttribute('class', 'marquee-selection-preview');
      preview.setAttribute('fill', '#3b82f6');
      preview.setAttribute('fill-opacity', '0.15');
      preview.setAttribute('stroke', '#2563eb');
      preview.setAttribute('stroke-width', '1');
      preview.setAttribute('stroke-dasharray', '4 4');
      preview.setAttribute('pointer-events', 'none');
      if (root) root.appendChild(preview);
    }
    const minX = Math.min(x1, x2), minY = Math.min(y1, y2);
    const w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
    preview.setAttribute('x', minX);
    preview.setAttribute('y', minY);
    preview.setAttribute('width', w);
    preview.setAttribute('height', h);
  }

  clearMarqueePreview() {
    if (!this.renderer || !this.renderer.svg) return;
    const preview = this.renderer.svg.querySelector('.marquee-selection-preview');
    if (preview && preview.parentNode) {
      preview.parentNode.removeChild(preview);
    }
  }

  finishMarqueeSelection(start, end) {
    if (!start || !end) return;
    const minX = Math.min(start.x, end.x), maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y), maxY = Math.max(start.y, end.y);

    if (maxX - minX < 5 && maxY - minY < 5) return;

    const newlySelectedAtoms = [];
    for (const atom of this.state.atoms.values()) {
      if (atom.x >= minX && atom.x <= maxX && atom.y >= minY && atom.y <= maxY) {
        this.state.selected.atoms.add(atom.id);
        newlySelectedAtoms.push(atom);
      }
    }
    if (this.state.activeChargeMode && newlySelectedAtoms.length > 0) {
      this.state.saveSnapshot();
      for (const a of newlySelectedAtoms) {
        this.state.applyChargeToAtom(a, this.state.activeChargeMode);
      }
      this.state.updateValences();
    }
    for (const arrow of this.state.arrows.values()) {
      const mx = (arrow.x1 + arrow.x2) / 2;
      const my = (arrow.y1 + arrow.y2) / 2;
      if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
        this.state.selected.arrows.add(arrow.id);
      }
    }
    for (const label of this.state.textLabels.values()) {
      if (label.x >= minX && label.x <= maxX && label.y >= minY && label.y <= maxY) {
        this.state.selected.labels.add(label.id);
      }
    }
    // Recuadros de abreviaturas: se seleccionan si el recuadro de selección toca cualquier parte de ellos
    for (const box of this.state.referenceBoxes.values()) {
      if (box.boxType === 'compound') continue;
      const bx2 = box.x + box.width, by2 = box.y + box.height;
      if (box.x <= maxX && bx2 >= minX && box.y <= maxY && by2 >= minY) {
        this.state.selected.boxes.add(box.id);
      }
    }
  }
}


  // --- js/tools/bond-tool.js ---
/**
 * bond-tool.js - Herramienta interactiva para trazado y ciclado de enlaces químicos
 * Reglas:
 * 1. Los enlaces tienen LONGITUD ESTRICTAMENTE FIJA (38px). No se pueden estirar indefinidamente.
 * 2. Clic en enlace existente cicla su tipo (simple -> doble -> triple -> cuña -> trazos -> ondulado).
 * 3. Clic simple en átomo brota un nuevo enlace de longitud 38px en el ángulo natural más libre (120°).
 * 4. Arrastre desde un átomo rota el enlace en círculo de radio 38px ajustándose a múltiplos de 30°,
 *    o conecta directamente a otro átomo si el cursor está cerca de él.
 */


class BondTool {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.isDragging = false;
    this.dragStartAtom = null;
    this.dragStartPos = null;
    this.hasMovedSignificantly = false;
  }

  onMouseDown(e, canvasPos, targetInfo) {
    // 1. Clic en enlace existente: ciclar tipo de enlace inmediatamente
    if (targetInfo && targetInfo.type === 'bond') {
      this.state.saveSnapshot();
      this.state.cycleBondType(targetInfo.id);
      this.renderer.render();
      return;
    }

    // 2. Clic en átomo existente
    if (targetInfo && targetInfo.type === 'atom') {
      this.isDragging = true;
      this.hasMovedSignificantly = false;
      this.wasExistingAtom = true;
      this.dragStartAtom = this.state.getAtom(targetInfo.id);
      this.dragStartPos = { x: this.dragStartAtom.x, y: this.dragStartAtom.y };
      return;
    }

    // 3. Clic en espacio vacío: crear átomo inicial (ej. H2O o NH3 libre)
    this.state.saveSnapshot();
    const newAtom = this.state.addAtom({
      x: canvasPos.x,
      y: canvasPos.y,
      element: this.state.activeElement || 'C'
    });
    this.isDragging = true;
    this.hasMovedSignificantly = false;
    this.wasExistingAtom = false;
    this.dragStartAtom = newAtom;
    this.dragStartPos = { x: canvasPos.x, y: canvasPos.y };
    this.renderer.render();
  }

  onMouseMove(e, canvasPos, targetInfo) {
    if (!this.isDragging || !this.dragStartAtom) return;

    const rawDist = Math.hypot(canvasPos.x - this.dragStartPos.x, canvasPos.y - this.dragStartPos.y);
    if (rawDist > 6) {
      this.hasMovedSignificantly = true;
    }

    let targetX = canvasPos.x;
    let targetY = canvasPos.y;

    // Verificar si el cursor está cerca de otro átomo existente para unirlo
    const anchor = this.findDragAnchor(canvasPos);
    if (anchor && anchor.type === 'atom') {
      targetX = anchor.x;
      targetY = anchor.y;
    } else {
      const end = this.getDragEnd(canvasPos);
      targetX = end.x;
      targetY = end.y;
    }

    // Previsualizar enlace con radio estrictamente fijo de 38px
    this.updatePreview(this.dragStartPos.x, this.dragStartPos.y, targetX, targetY);
  }

  onMouseUp(e, canvasPos, targetInfo) {
    if (!this.isDragging || !this.dragStartAtom) {
      this.clearPreview();
      return;
    }

    this.clearPreview();

    // Caso A: Si fue solo un clic sobre un átomo existente -> Sustituir o Brotar
    // Si fue un clic en espacio vacío -> Se queda el átomo libre (ej. H2O o NH3)
    if (!this.hasMovedSignificantly) {
      if (this.wasExistingAtom && this.dragStartAtom) {
        // Si hay un modo de carga activo ('+', '-', '0', 'lp'), aplicarlo directamente al átomo
        if (this.state.activeChargeMode) {
          this.state.saveSnapshot();
          this.state.applyChargeToAtom(this.dragStartAtom, this.state.activeChargeMode);
          this.isDragging = false;
          this.dragStartAtom = null;
          this.state.updateValences();
          this.renderer.render();
          return;
        }

        const activeElem = (this.state.activeElement || 'C').trim();
        const curElem = (this.dragStartAtom.element || 'C').trim();

        if (activeElem !== curElem) {
          // Sustituir el átomo existente por el elemento o grupo activo
          this.state.saveSnapshot();
          this.dragStartAtom.element = activeElem;
          this.dragStartAtom.label = (activeElem === 'C') ? null : activeElem;
          this.dragStartAtom.manualLabel = (activeElem !== 'C');
          this.dragStartAtom.isCustomLabel = (activeElem !== 'C');
          this.isDragging = false;
          this.dragStartAtom = null;
          this.state.updateValences();
          this.renderer.render();
          return;
        }

        // Si el elemento activo coincide con el elemento actual:
        if (activeElem === 'C') {
          // Clic sobre C cuando C está activo: brotar nuevo enlace automáticamente
          this.sproutAutomaticBond(this.dragStartAtom);
        } else if (activeElem === 'N') {
          this.state.saveSnapshot();
          if (this.dragStartAtom.label === 'NH2') this.dragStartAtom.label = 'H2N';
          else if (this.dragStartAtom.label === 'H2N') this.dragStartAtom.label = 'N';
          else this.dragStartAtom.label = 'NH2';
          this.dragStartAtom.manualLabel = true;
        } else if (activeElem === 'O') {
          this.state.saveSnapshot();
          if (this.dragStartAtom.label === 'OH') this.dragStartAtom.label = 'HO';
          else if (this.dragStartAtom.label === 'HO') this.dragStartAtom.label = 'O';
          else this.dragStartAtom.label = 'OH';
          this.dragStartAtom.manualLabel = true;
        } else if (activeElem === 'S') {
          this.state.saveSnapshot();
          if (this.dragStartAtom.label === 'SH') this.dragStartAtom.label = 'HS';
          else if (this.dragStartAtom.label === 'HS') this.dragStartAtom.label = 'S';
          else this.dragStartAtom.label = 'SH';
          this.dragStartAtom.manualLabel = true;
        }
      }
      this.isDragging = false;
      this.dragStartAtom = null;
      this.state.updateValences();
      this.renderer.render();
      return;
    }

    this.state.saveSnapshot();

    // Caso B: Arrastre a un átomo existente cercano
    const anchor = this.findDragAnchor(canvasPos);
    let endAtom;

    if (anchor && anchor.type === 'atom') {
      endAtom = anchor.target;
    } else {
      // Crear nuevo átomo: en la guía axial/ecuatorial si sale de una silla, si no a 38px con snapping
      const end = this.getDragEnd(canvasPos);
      endAtom = this.state.addAtom({
        x: end.x,
        y: end.y,
        element: this.state.activeElement || 'C',
        ...this.depthFrom(this.dragStartAtom)
      });
    }

    // Conectar enlace
    this.state.addBond({
      atom1: this.dragStartAtom.id,
      atom2: endAtom.id,
      type: this.state.bondType || 'single'
    });

    this.isDragging = false;
    this.dragStartAtom = null;
    this.renderer.render();
  }

  /**
   * Brota un enlace automático a 38px en el ángulo químico óptimo al hacer clic en un átomo
   */
  sproutAutomaticBond(atom) {
    this.state.saveSnapshot();
    let newX, newY;
    const guide = pickChairGuide(atom, this.state);
    if (guide) {
      // Vértice de silla: brotar en la guía axial (o ecuatorial si la axial ya está ocupada)
      newX = guide.x;
      newY = guide.y;
    } else {
      const angleDeg = calculateNextBondAngle(atom, this.state);
      const rad = (angleDeg * Math.PI) / 180;
      newX = atom.x + STANDARD_BOND_LENGTH * Math.cos(rad);
      newY = atom.y + STANDARD_BOND_LENGTH * Math.sin(rad);
    }

    const newAtom = this.state.addAtom({
      x: newX,
      y: newY,
      element: this.state.activeElement || 'C',
      ...this.depthFrom(atom)
    });

    this.state.addBond({
      atom1: atom.id,
      atom2: newAtom.id,
      type: this.state.bondType || 'single'
    });

    this.renderer.render();
  }

  /**
   * Extremo del enlace arrastrado: si sale de un vértice de silla y el cursor apunta
   * cerca de una guía libre (axial/ecuatorial), se ajusta a ella; si no, 38px con snapping a 30°.
   */
  getDragEnd(canvasPos) {
    const guide = pickChairGuide(this.dragStartAtom, this.state, canvasPos);
    if (guide) return { x: guide.x, y: guide.y };
    return snapBond(this.dragStartPos.x, this.dragStartPos.y, canvasPos.x, canvasPos.y, STANDARD_BOND_LENGTH);
  }

  /**
   * Átomo existente al que se uniría el enlace arrastrado. Si el enlace sigue una guía de silla,
   * solo cuenta un átomo que esté justo en el extremo de la guía (no lo que haya bajo el cursor),
   * para no unir por error el carbono con un sustituyente vecino.
   */
  findDragAnchor(canvasPos) {
    const guide = pickChairGuide(this.dragStartAtom, this.state, canvasPos);
    if (guide) return findNearestAnchor(guide.x, guide.y, this.state, this.dragStartAtom.id, 4);
    return findNearestAnchor(canvasPos.x, canvasPos.y, this.state, this.dragStartAtom.id, 12);
  }

  /** El sustituyente hereda la profundidad del átomo de silla (para los huecos en cruces) */
  depthFrom(atom) {
    return atom && typeof atom.depth === 'number' ? { depth: atom.depth } : {};
  }

  updatePreview(x1, y1, x2, y2) {
    if (!this.renderer || !this.renderer.svg) return;
    const root = this.renderer.svg.querySelector('#canvas-root') || this.renderer.svg;
    let preview = this.renderer.svg.querySelector('.bond-drawing-preview');
    if (!preview) {
      preview = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      preview.setAttribute('class', 'bond-drawing-preview');
      preview.setAttribute('stroke', '#3b82f6');
      preview.setAttribute('stroke-width', '2.4');
      preview.setAttribute('stroke-dasharray', '4 3');
      preview.setAttribute('pointer-events', 'none');
      if (root) root.appendChild(preview);
    }
    preview.setAttribute('x1', x1);
    preview.setAttribute('y1', y1);
    preview.setAttribute('x2', x2);
    preview.setAttribute('y2', y2);
  }

  clearPreview() {
    if (!this.renderer || !this.renderer.svg) return;
    const preview = this.renderer.svg.querySelector('.bond-drawing-preview');
    if (preview && preview.parentNode) {
      preview.parentNode.removeChild(preview);
    }
  }
}


  // --- js/tools/arrow-tool.js ---
/**
 * arrow-tool.js - Herramienta interactiva para trazado y edición de flechas de reacción
 * Soporta estirado libre, bloqueo magnético a ángulos canónicos (0°, 45°, 90°, 180°, 270°)
 * y espacio definido garantizado entre molécula y flecha.
 */




class ArrowTool {
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


  // --- js/tools/chair-tool.js ---
/**
 * chair-tool.js - Herramienta especializada para conformaciones de silla de ciclohexano y piranosas
 * Permite insertar sillas y agregar sustituyentes axiales y ecuatoriales con un solo clic.
 */



class ChairTool {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.templateType = 'CHAIR_CYCLOHEXANE'; // 'CHAIR_CYCLOHEXANE' o 'PYRANOSE_CHAIR'
    this.defaultSubstituent = 'OH';
  }

  onMouseDown(e, canvasPos, targetInfo) {
    // 1. Si se hace clic en un punto guía de sustituyente axial o ecuatorial
    if (targetInfo && targetInfo.isGuideDot) {
      this.addSubstituentFromGuide(targetInfo.atomId, targetInfo.guideType);
      return;
    }

    // 2. Si se hace clic sobre un átomo de silla existente: mostrar menú rápido o alternar
    if (targetInfo && targetInfo.type === 'atom') {
      const atom = this.state.getAtom(targetInfo.id);
      if (atom && atom.chairVertex) {
        // Añadir por defecto sustituyente axial si no lo tiene, o ecuatorial
        this.addSmartSubstituent(atom);
        return;
      }
    }

    // 3. Clic en espacio libre: insertar la conformación de silla completa
    this.insertChairAt(canvasPos.x, canvasPos.y, this.templateType);
  }

  onMouseMove(e, canvasPos, targetInfo) {
    // Si el cursor pasa por un átomo de silla, actualizar el renderer para mostrar las guías
    if (targetInfo && targetInfo.type === 'atom') {
      const atom = this.state.getAtom(targetInfo.id);
      if (atom && atom.chairVertex) {
        this.renderer.hoveredAtomId = atom.id;
        this.renderer.render();
        return;
      }
    }
  }

  onMouseUp(e, canvasPos, targetInfo) {}

  /**
   * Inserta una conformación de silla en las coordenadas indicadas
   */
  insertChairAt(cx, cy, templateKey = 'CHAIR_CYCLOHEXANE') {
    this.state.saveSnapshot();
    const tpl = RING_TEMPLATES[templateKey] || RING_TEMPLATES.CHAIR_CYCLOHEXANE;
    const chairId = this.state.generateId('chair');

    const createdAtoms = new Map();

    // Crear los 6 átomos del anillo
    for (const a of tpl.ringAtoms) {
      const guides = tpl.substituents ? tpl.substituents[a.id] : null;
      const newAtom = this.state.addAtom({
        x: cx + a.x,
        y: cy + a.y,
        element: a.element || 'C',
        label: a.label || null,
        chairId: chairId,
        chairVertex: a.id,
        depth: a.depth !== undefined ? a.depth : 0,
        substituentGuides: guides
      });
      createdAtoms.set(a.id, newAtom);
    }

    // Crear los enlaces del anillo
    for (const b of tpl.ringBonds) {
      const a1 = createdAtoms.get(b.a1);
      const a2 = createdAtoms.get(b.a2);
      if (a1 && a2) {
        this.state.addBond({
          atom1: a1.id,
          atom2: a2.id,
          type: b.type || 'single',
          isFront: b.isFront || false,
          ...(b.wedgeWidth ? { wedgeWidth: b.wedgeWidth } : {}),
          ...(b.boldWidth ? { boldWidth: b.boldWidth } : {})
        });
      }
    }

    this.renderer.render();
  }

  /**
   * Añade un sustituyente en posición axial o ecuatorial a partir de una guía
   */
  addSubstituentFromGuide(atomId, positionType, substituentLabel = null) {
    const parentAtom = this.state.getAtom(atomId);
    if (!parentAtom || !parentAtom.substituentGuides) return;

    const guide = parentAtom.substituentGuides[positionType];
    if (!guide) return;

    this.state.saveSnapshot();

    const subX = parentAtom.x + guide.dx;
    const subY = parentAtom.y + guide.dy;
    let label = substituentLabel;
    if (!label) {
      if (this.state.activeElement && this.state.activeElement !== 'C') {
        label = this.state.activeElement === 'O' ? 'OH' : this.state.activeElement;
      } else {
        label = guide.defaultGroup || this.defaultSubstituent;
      }
    }

    // Determinar elemento principal del sustituyente (ej. 'OH' -> O, 'H' -> H, 'N' -> N, 'Cl' -> Cl)
    let element = 'C';
    if (label === 'H') element = 'H';
    else if (label.startsWith('O')) element = 'O';
    else if (label.startsWith('N')) element = 'N';
    else if (label.startsWith('S')) element = 'S';
    else if (label.startsWith('P')) element = 'P';
    else if (['F', 'Cl', 'Br', 'I'].includes(label)) element = label;

    const newSubAtom = this.state.addAtom({
      x: subX,
      y: subY,
      element: element,
      label: label === 'C' ? null : label,
      // El sustituyente hereda la profundidad de su carbono (para los huecos en cruces)
      depth: parentAtom.depth !== undefined ? parentAtom.depth : 0
    });

    this.state.addBond({
      atom1: parentAtom.id,
      atom2: newSubAtom.id,
      type: guide.type || 'single'
    });

    this.renderer.render();
  }

  /**
   * ¿Ya hay un átomo enlazado en la posición de la guía (axial/ecuatorial)?
   */
  isGuideOccupied(parentAtom, positionType) {
    return !getFreeChairGuides(parentAtom, this.state).some(g => g.type === positionType);
  }

  addSmartSubstituent(parentAtom) {
    if (!parentAtom.substituentGuides) return;
    // Primero axial; si ya está ocupado, ecuatorial; si ambos lo están, no hace nada
    if (!this.isGuideOccupied(parentAtom, 'axial')) {
      this.addSubstituentFromGuide(parentAtom.id, 'axial');
    } else if (!this.isGuideOccupied(parentAtom, 'equatorial')) {
      this.addSubstituentFromGuide(parentAtom.id, 'equatorial');
    }
  }
}


  // --- js/tools/template-tool.js ---
/**
 * template-tool.js - Inserción de anillos aromáticos y alicíclicos
 *
 * Comportamiento:
 *  - Clic en espacio vacío: anillo nuevo centrado en el clic.
 *  - Clic sobre un ENLACE: el anillo se fusiona compartiendo ese enlace, del lado libre
 *    (benceno + benceno = naftaleno). Si un vértice nuevo cae sobre un átomo existente se
 *    reutiliza, así se pueden cerrar anillos (fenantreno, pireno...).
 *  - Clic sobre un ÁTOMO: el anillo se une a ese átomo con un enlace sencillo en la dirección
 *    más libre (benceno + benceno = bifenilo).
 * En los anillos aromáticos los dobles enlaces se colocan para que la estructura de Kekulé
 * siga siendo válida.
 */



class TemplateTool {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.templateKey = 'BENZENE'; // 'BENZENE', 'CYCLOHEXANE', 'CYCLOPENTANE'
  }

  setTemplate(key) {
    this.templateKey = (key || 'BENZENE').toUpperCase();
  }

  getTemplate() {
    const key = (this.templateKey || 'BENZENE').toUpperCase();
    return RING_TEMPLATES[key] || RING_TEMPLATES[this.templateKey] || null;
  }

  onMouseDown(e, canvasPos, targetInfo) {
    if (targetInfo && targetInfo.type === 'bond' && this.state.bonds.has(targetInfo.id)) {
      this.fuseOnBond(targetInfo.id);
      return;
    }
    if (targetInfo && targetInfo.type === 'atom' && this.state.getAtom(targetInfo.id)) {
      this.attachToAtom(targetInfo.id);
      return;
    }
    this.insertTemplateAt(canvasPos.x, canvasPos.y, this.templateKey);
  }

  onMouseMove(e, canvasPos, targetInfo) {}
  onMouseUp(e, canvasPos, targetInfo) {}

  insertTemplateAt(cx, cy, key) {
    const lookupKey = (key || this.templateKey || 'BENZENE').toUpperCase();
    const tpl = RING_TEMPLATES[lookupKey] || RING_TEMPLATES[key];
    if (!tpl) return;

    this.state.saveSnapshot();
    const createdAtoms = new Map();

    for (const a of tpl.ringAtoms) {
      const atom = this.state.addAtom({
        x: cx + a.x,
        y: cy + a.y,
        element: a.element || 'C'
      });
      createdAtoms.set(a.id, atom);
    }

    for (const b of tpl.ringBonds) {
      const a1 = createdAtoms.get(b.a1);
      const a2 = createdAtoms.get(b.a2);
      if (a1 && a2) {
        this.state.addBond({
          atom1: a1.id,
          atom2: a2.id,
          type: b.type || 'single'
        });
      }
    }

    this.renderer.render();
  }

  /** Número de vértices y si el anillo es aromático (lleva dobles enlaces) */
  ringInfo() {
    const tpl = this.getTemplate();
    if (!tpl) return null;
    return {
      n: tpl.ringAtoms.length,
      aromatic: tpl.ringBonds.some(b => b.type === 'double')
    };
  }

  /** Átomo existente en (x, y) o uno nuevo */
  atomAt(x, y) {
    for (const a of this.state.atoms.values()) {
      if (Math.hypot(a.x - x, a.y - y) < 8) return a;
    }
    return this.state.addAtom({ x, y, element: 'C' });
  }

  hasDouble(atomId) {
    for (const b of this.state.bonds.values()) {
      if ((b.atom1 === atomId || b.atom2 === atomId) && (b.type === 'double' || b.type === 'triple')) return true;
    }
    return false;
  }

  /** Lados del anillo: los dobles van en aristas cuyos dos extremos aún no tienen doble enlace */
  addRingBonds(ids, aromatic) {
    const n = ids.length;
    for (let i = 0; i < n; i++) {
      const a = ids[i], b = ids[(i + 1) % n];
      if (a === b) continue;
      const exists = Array.from(this.state.bonds.values()).some(x =>
        (x.atom1 === a && x.atom2 === b) || (x.atom1 === b && x.atom2 === a));
      if (exists) continue;
      let type = 'single';
      if (aromatic && !this.hasDouble(a) && !this.hasDouble(b)) type = 'double';
      this.state.addBond({ atom1: a, atom2: b, type });
    }
  }

  /** Fusiona el anillo compartiendo el enlace clicado, del lado opuesto a los vecinos existentes */
  fuseOnBond(bondId) {
    const info = this.ringInfo();
    if (!info) return;
    const bond = this.state.bonds.get(bondId);
    const a1 = this.state.getAtom(bond.atom1);
    const a2 = this.state.getAtom(bond.atom2);
    if (!a1 || !a2) return;

    const d = Math.hypot(a2.x - a1.x, a2.y - a1.y);
    if (d < 1) return;
    const mx = (a1.x + a2.x) / 2, my = (a1.y + a2.y) / 2;
    let nx = -(a2.y - a1.y) / d, ny = (a2.x - a1.x) / d;

    // Lado libre: opuesto a los demás vecinos de los dos átomos del enlace
    let side = 0;
    for (const b of this.state.bonds.values()) {
      for (const [self, other] of [[b.atom1, b.atom2], [b.atom2, b.atom1]]) {
        if ((self === a1.id || self === a2.id) && other !== a1.id && other !== a2.id) {
          const o = this.state.getAtom(other);
          if (o) side += (o.x - mx) * nx + (o.y - my) * ny;
        }
      }
    }
    if (side > 0) { nx = -nx; ny = -ny; }

    this.state.saveSnapshot();
    const n = info.n;
    const apothem = d / (2 * Math.tan(Math.PI / n));
    const R = d / (2 * Math.sin(Math.PI / n));
    const cx = mx + nx * apothem, cy = my + ny * apothem;

    // Vértices empezando en a2 y recorriendo hasta a1 por el lado nuevo
    const start = Math.atan2(a2.y - cy, a2.x - cx);
    const startA1 = Math.atan2(a1.y - cy, a1.x - cx);
    let step = (2 * Math.PI) / n;
    // Sentido de giro: el vértice n-1 debe coincidir con a1
    const endAngle = start + step * (n - 1);
    if (Math.hypot(cx + R * Math.cos(endAngle) - a1.x, cy + R * Math.sin(endAngle) - a1.y) > 1) step = -step;
    void startA1;

    const ids = [a2.id];
    for (let i = 1; i < n - 1; i++) {
      const ang = start + step * i;
      ids.push(this.atomAt(cx + R * Math.cos(ang), cy + R * Math.sin(ang)).id);
    }
    ids.push(a1.id);
    this.addRingBonds(ids, info.aromatic);
    this.state.updateValences();
    this.renderer.render();
  }

  /** Une un anillo nuevo al átomo con un enlace sencillo en la dirección más libre */
  attachToAtom(atomId) {
    const info = this.ringInfo();
    if (!info) return;
    const atom = this.state.getAtom(atomId);
    const L = STANDARD_BOND_LENGTH;
    const deg = calculateNextBondAngle(atom, this.state);
    const ux = Math.cos((deg * Math.PI) / 180), uy = Math.sin((deg * Math.PI) / 180);

    this.state.saveSnapshot();
    const n = info.n;
    const R = L / (2 * Math.sin(Math.PI / n));
    const r0 = { x: atom.x + ux * L, y: atom.y + uy * L };
    const cx = r0.x + ux * R, cy = r0.y + uy * R;
    const start = Math.atan2(r0.y - cy, r0.x - cx);
    const ids = [];
    for (let i = 0; i < n; i++) {
      const ang = start + ((2 * Math.PI) / n) * i;
      ids.push(this.atomAt(cx + R * Math.cos(ang), cy + R * Math.sin(ang)).id);
    }
    this.state.addBond({ atom1: atom.id, atom2: ids[0], type: 'single' });
    this.addRingBonds(ids, info.aromatic);
    this.state.updateValences();
    this.renderer.render();
  }
}


  // --- js/tools/text-tool.js ---
/**
 * text-tool.js - Rótulos de intermediarios (A, B, C...) y fórmulas químicas
 */

class TextTool {
  constructor(state, renderer, onOpenTextPrompt = null) {
    this.state = state;
    this.renderer = renderer;
    this.onOpenTextPrompt = onOpenTextPrompt;
    this.nextIntermediary = 'A';
  }

  onMouseDown(e, canvasPos, targetInfo) {
    if (targetInfo && targetInfo.type === 'atom') {
      // Editar etiqueta directa del átomo (ej. OMe, OBn, OTBS)
      const atom = this.state.getAtom(targetInfo.id);
      if (this.onOpenTextPrompt) {
        this.onOpenTextPrompt({
          title: 'Editar Grupo / Átomo',
          initialValue: atom.label || atom.element,
          callback: (newVal) => {
            if (newVal !== null) {
              this.state.saveSnapshot();
              atom.label = newVal.trim() === '' ? null : newVal;
              this.state.updateAtom(atom.id, { label: atom.label });
              this.renderer.render();
            }
          }
        });
      }
      return;
    }

    if (targetInfo && targetInfo.type === 'label') {
      // Editar rótulo existente
      const label = this.state.textLabels.get(targetInfo.id);
      if (this.onOpenTextPrompt) {
        this.onOpenTextPrompt({
          title: 'Editar Rótulo de Intermediario',
          initialValue: label.text,
          callback: (newVal) => {
            if (newVal !== null && newVal.trim() !== '') {
              this.state.saveSnapshot();
              label.text = newVal;
              this.renderer.render();
            }
          }
        });
      }
      return;
    }

    // Colocar nuevo rótulo de intermediario (A, B, C...)
    this.state.saveSnapshot();
    const newLabel = this.state.addTextLabel({
      x: canvasPos.x,
      y: canvasPos.y,
      text: this.nextIntermediary,
      isIntermediary: true
    });

    // Avanzar siguiente letra por conveniencia si es letra mayúscula única
    if (this.nextIntermediary.length === 1 && this.nextIntermediary >= 'A' && this.nextIntermediary < 'Z') {
      this.nextIntermediary = String.fromCharCode(this.nextIntermediary.charCodeAt(0) + 1);
    }

    this.renderer.render();
  }

  onMouseMove(e, canvasPos, targetInfo) {}
  onMouseUp(e, canvasPos, targetInfo) {}
}


  // --- js/tools/reference-tool.js ---
/**
 * reference-tool.js - Herramienta para insertar y configurar el Recuadro de Referencias estilo IChO
 */

class ReferenceTool {
  constructor(state, renderer, onOpenBoxEditor = null) {
    this.state = state;
    this.renderer = renderer;
    this.onOpenBoxEditor = onOpenBoxEditor;
  }

  onMouseDown(e, canvasPos, targetInfo) {
    if (targetInfo && targetInfo.type === 'box') {
      const box = this.state.referenceBoxes.get(targetInfo.id);
      this.state.clearSelection();
      this.state.selected.boxes.add(box.id);
      this.renderer.render();
      if (this.onOpenBoxEditor) {
        this.onOpenBoxEditor(box);
      }
      return;
    }

    // Insertar nuevo recuadro de referencias punteado
    this.state.saveSnapshot();
    const newBox = this.state.addReferenceBox({
      x: canvasPos.x - 240,
      y: canvasPos.y - 45,
      width: 520,
      height: 80,
      title: '',
      items: [
        { abbr: 'Ac', formula: 'H3C-C(=O)~' },
        { abbr: 'Bn', formula: 'PhCH2' },
        { abbr: 'DIBAL-H', formula: 'i-Bu2AlH' },
        { abbr: 'p-TsOH', formula: 'H3C-C6H4-SO3H' },
        { abbr: 'Py', formula: 'Piridina' }
      ]
    });

    this.state.clearSelection();
    this.state.selected.boxes.add(newBox.id);
    this.renderer.render();

    if (this.onOpenBoxEditor) {
      this.onOpenBoxEditor(newBox);
    }
  }

  onMouseMove(e, canvasPos, targetInfo) {}
  onMouseUp(e, canvasPos, targetInfo) {}
}


  // --- js/tools/eraser-tool.js ---
/**
 * eraser-tool.js - Borrador de elementos químicos con detección de proximidad y arrastre fluido
 */

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

class EraserTool {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.isMouseDown = false;
  }

  onMouseDown(e, canvasPos, targetInfo) {
    this.isMouseDown = true;
    this.eraseUnderCursor(canvasPos, targetInfo);
  }

  onMouseMove(e, canvasPos, targetInfo) {
    if (this.isMouseDown && (e.buttons === 1 || e.which === 1)) {
      this.eraseUnderCursor(canvasPos, targetInfo);
    }
  }

  onMouseUp(e, canvasPos, targetInfo) {
    this.isMouseDown = false;
  }

  eraseUnderCursor(canvasPos, targetInfo) {
    let target = targetInfo;

    // Si no hay targetInfo directo de SVG, buscar por proximidad geométrica
    if ((!target || !target.id) && canvasPos) {
      // 1. Proximidad a átomos (radio 16px)
      for (const atom of this.state.atoms.values()) {
        if (Math.hypot(atom.x - canvasPos.x, atom.y - canvasPos.y) <= 16) {
          target = { type: 'atom', id: atom.id };
          break;
        }
      }

      // 2. Proximidad a enlaces (distancia 12px)
      if (!target) {
        for (const bond of this.state.bonds.values()) {
          const a1 = this.state.getAtom(bond.atom1);
          const a2 = this.state.getAtom(bond.atom2);
          if (!a1 || !a2) continue;
          if (distToSegment(canvasPos.x, canvasPos.y, a1.x, a1.y, a2.x, a2.y) <= 12) {
            target = { type: 'bond', id: bond.id };
            break;
          }
        }
      }

      // 3. Proximidad a flechas (distancia 14px)
      if (!target) {
        for (const arrow of this.state.arrows.values()) {
          if (distToSegment(canvasPos.x, canvasPos.y, arrow.x1, arrow.y1, arrow.x2, arrow.y2) <= 14) {
            target = { type: 'arrow', id: arrow.id };
            break;
          }
        }
      }
    }

    if (!target || !target.id) return;

    this.state.saveSnapshot();

    switch (target.type) {
      case 'atom':
        this.state.removeAtom(target.id);
        break;
      case 'bond':
        this.state.removeBond(target.id);
        break;
      case 'arrow':
        this.state.removeArrow(target.id);
        break;
      case 'box':
        this.state.removeReferenceBox(target.id);
        break;
      case 'label':
        this.state.removeTextLabel(target.id);
        break;
    }

    this.renderer.render();
  }
}


  // --- js/keyboard/shortcuts.js ---
/**
 * shortcuts.js - Atajos de teclado de ChemStudio
 * 1. Si el cursor está sobre un ENLACE existente:
 *    - Al pulsar '1', cicla su orden: simple -> doble -> triple -> discontinuo -> simple.
 *    - Al pulsar '2', se convierte en doble.
 *    - Al pulsar '3', se convierte en triple.
 * 2. Si el cursor está sobre un ÁTOMO:
 *    - Al pulsar '1', brota un nuevo enlace C-C (CH3 -> Isopropilo -> Tert-butilo -> Texas Carbon en rojo).
 *    - Al pulsar O, N, S, P, F, Cl, Br, I, H, C, cambia el elemento químico.
 */


class ChemShortcuts {
  constructor(state, renderer, app) {
    this.state = state;
    this.renderer = renderer;
    this.app = app;
    this.initListeners();
  }

  initListeners() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    // Con cualquier ventana modal abierta (abreviaturas, molécula sobre flecha, tabla periódica...)
    // los atajos del lienzo principal se desactivan: si no, Supr/Ctrl+Z/teclas de elemento
    // modificarían también la pizarra principal que queda detrás.
    if (typeof document !== 'undefined' && typeof document.querySelector === 'function' &&
        document.querySelector('.modal-overlay')) {
      return;
    }

    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      return;
    }

    const key = e.key.toLowerCase();
    const isCtrl = e.ctrlKey || e.metaKey;

    // 1. Deshacer / Rehacer
    if (isCtrl && key === 'z') {
      e.preventDefault();
      if (e.shiftKey) this.state.redo();
      else this.state.undo();
      this.renderer.render();
      return;
    }

    if (isCtrl && key === 'y') {
      e.preventDefault();
      this.state.redo();
      this.renderer.render();
      return;
    }

    // Copiar / Cortar / Pegar
    if (isCtrl && (key === 'c' || key === 'x')) {
      const clip = this.state.copySelection();
      if (clip) {
        e.preventDefault();
        this.clipboard = clip;
        this.pasteCount = 0;
        if (key === 'x') this.deleteSelected();
      }
      return;
    }

    if (isCtrl && key === 'v') {
      e.preventDefault();
      this.paste();
      return;
    }

    // 2. Eliminar selección
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      this.deleteSelected();
      return;
    }

    // Escape para cancelar modo continuo de carga
    if (e.key === 'Escape') {
      if (this.app && this.app.activeChargeMode) {
        this.app.setActiveChargeMode(null);
        return;
      }
    }

    // 3. Atajos sobre ENLACES (bajo hover o seleccionados)
    const targetBonds = this.getTargetBonds();
    if (targetBonds.length > 0) {
      if (this.handleBondShortcuts(key, targetBonds)) {
        e.preventDefault();
        return;
      }
    }

    // 4. Atajos sobre ÁTOMOS (bajo hover o seleccionados)
    // Para la tecla 'c': solo mutar átomo a Carbono si el cursor está directamente SOBRE el átomo (hoveredAtomId).
    // Si no está sobre un átomo, 'c' siempre activa o alterna la herramienta Silla / Giro de Silla.
    if (key === 'c' && !this.renderer.hoveredAtomId) {
      e.preventDefault();
      this.state.clearSelection();
      this.toggleChairTool();
      return;
    }

    // S (Seleccionar), B (Enlace) y G (Grupo) también son atajos de herramienta: sin el cursor
    // sobre un átomo cambian de herramienta en vez de convertir toda la selección en S/Br/grupo.
    const isToolKey = ['s', 'b', 'g'].includes(key) && !this.renderer.hoveredAtomId;
    const targetAtoms = isToolKey ? [] : this.getTargetAtoms();
    if (targetAtoms.length > 0) {
      if (this.handleAtomShortcuts(key, targetAtoms)) {
        e.preventDefault();
        return;
      }
    }

    // 5. Atajos de herramientas generales
    if (!isCtrl) {
      switch (key) {
        case 's':
        case 'v':
          this.app.selectTool('select');
          break;
        case 'b':
          this.app.selectTool('bond');
          break;
        case '4':
          this.app.selectTool('bond', 'dashed');
          break;
        case 'a':
          this.app.selectTool('arrow');
          break;
        case 'c':
          this.toggleChairTool();
          break;
        case 't':
          this.app.selectTool('text');
          break;
        case 'e':
          this.app.selectTool('eraser');
          break;
        case 'r':
          this.app.selectTool('reference');
          break;
        case 'g':
          const groupInput = (typeof document !== 'undefined' && typeof document.getElementById === 'function') ? document.getElementById('input-quick-group') : null;
          const groupText = (groupInput && groupInput.value.trim()) ? groupInput.value.trim() : 'OMs';
          if (this.app?.activateGroup) {
            this.app.activateGroup(groupText);
          }
          break;
      }
    }
  }

  toggleChairTool() {
    if (this.app.activeToolKey !== 'chair') {
      this.app.selectTool('chair', 'CHAIR_CYCLOHEXANE');
    } else {
      // Alternar conformación (Normal <-> Giro de Silla)
      const current = this.app.tools.chair.templateType;
      let next = 'CHAIR_FLIP';
      if (current === 'CHAIR_CYCLOHEXANE') {
        next = 'CHAIR_FLIP';
      } else if (current === 'CHAIR_FLIP') {
        next = 'CHAIR_CYCLOHEXANE';
      } else if (current === 'PYRANOSE_CHAIR') {
        next = 'PYRANOSE_CHAIR_FLIP';
      } else if (current === 'PYRANOSE_CHAIR_FLIP') {
        next = 'PYRANOSE_CHAIR';
      }
      this.app.selectTool('chair', next);
    }
  }

  getTargetBonds() {
    if (this.renderer.hoveredBondId) {
      const bond = this.state.bonds.get(this.renderer.hoveredBondId);
      if (bond) return [bond];
    }

    const selectedBonds = [];
    for (const id of this.state.selected.bonds) {
      const bond = this.state.bonds.get(id);
      if (bond) selectedBonds.push(bond);
    }
    return selectedBonds;
  }

  getTargetAtoms() {
    if (this.renderer.hoveredAtomId) {
      const atom = this.state.getAtom(this.renderer.hoveredAtomId);
      if (atom) return [atom];
    }

    const selectedAtoms = [];
    for (const id of this.state.selected.atoms) {
      const atom = this.state.getAtom(id);
      if (atom) selectedAtoms.push(atom);
    }
    return selectedAtoms;
  }

  handleBondShortcuts(key, bonds) {
    if (key === '1') {
      // Si se pulsa '1' sobre un enlace existente:
      // simple -> doble -> triple -> dashed -> simple
      this.state.saveSnapshot();
      for (const bond of bonds) {
        if (bond.type === 'single') {
          bond.type = 'double';
        } else if (bond.type === 'double') {
          bond.type = 'triple';
        } else if (bond.type === 'triple') {
          bond.type = 'dashed';
        } else {
          bond.type = 'single';
        }
      }
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    if (key === '2') {
      this.state.saveSnapshot();
      for (const bond of bonds) bond.type = 'double';
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    if (key === '3') {
      this.state.saveSnapshot();
      for (const bond of bonds) bond.type = 'triple';
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    if (key === '4') {
      this.state.saveSnapshot();
      for (const bond of bonds) bond.type = 'dashed';
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    return false;
  }

  handleAtomShortcuts(key, atoms) {
    // Si se pulsa '1' sobre un átomo: brotar nuevo enlace C-C (metilo -> isopropilo -> tert-butilo)
    if (key === '1') {
      this.state.saveSnapshot();
      for (const atom of atoms) {
        this.sproutCarbonBond(atom);
      }
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    // Si se pulsa 'g' sobre un átomo: cambiar elemento al grupo funcional o activarlo
    if (key === 'g') {
      const groupInput = (typeof document !== 'undefined' && typeof document.getElementById === 'function') ? document.getElementById('input-quick-group') : null;
      const groupText = (groupInput && groupInput.value.trim()) ? groupInput.value.trim() : 'OMs';
      if (this.app?.activateGroup) {
        this.app.activateGroup(groupText);
      }
      if (atoms.length > 0) {
        this.state.saveSnapshot();
        for (const atom of atoms) {
          atom.element = groupText;
          atom.label = groupText;
          atom.manualLabel = true;
          atom.isCustomLabel = true;
        }
        this.state.updateValences();
        this.renderer.render();
        if (this.app?.updateValenceStatus) this.app.updateValenceStatus();
      }
      return true;
    }

    // Cambiar a elemento químico (O, N, S, P, F, Cl, Br, I, H, C)
    let newElement = null;
    let newLabel = null;

    switch (key) {
      case 'c':
        newElement = 'C';
        newLabel = null;
        break;
      case 'o':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          if (atom.element === 'O') {
            if (atom.label === 'OH') atom.label = 'HO';
            else if (atom.label === 'HO') atom.label = 'O';
            else if (atom.label === 'O') atom.label = 'H2O';
            else {
              atom.label = null;
              atom.manualLabel = false;
            }
            if (atom.label) atom.manualLabel = true;
          } else {
            atom.element = 'O';
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case 'n':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          if (atom.element === 'N') {
            // Ciclar manualmente si se pulsa repetidamente
            if (atom.label === 'NH2') atom.label = 'H2N';
            else if (atom.label === 'H2N') atom.label = 'N';
            else if (atom.label === 'N') atom.label = 'NH3';
            else {
              atom.label = null;
              atom.manualLabel = false;
            }
            if (atom.label) atom.manualLabel = true;
          } else {
            atom.element = 'N';
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case 's':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          if (atom.element === 'S') {
            if (atom.label === 'SH') atom.label = 'HS';
            else if (atom.label === 'HS') atom.label = 'S';
            else if (atom.label === 'S') atom.label = 'H2S';
            else {
              atom.label = null;
              atom.manualLabel = false;
            }
            if (atom.label) atom.manualLabel = true;
          } else {
            atom.element = 'S';
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case 'p':
        newElement = 'P';
        newLabel = 'P';
        break;
      case 'f':
        newElement = 'F';
        newLabel = 'F';
        break;
      case 'l':
        newElement = 'Cl';
        newLabel = 'Cl';
        break;
      case 'b':
        newElement = 'Br';
        newLabel = 'Br';
        break;
      case 'i':
        newElement = 'I';
        newLabel = 'I';
        break;
      case 'h':
        newElement = 'H';
        newLabel = 'H';
        break;
      case 'k':
        newElement = 'Si';
        newLabel = 'Si';
        break;
      case '+':
      case '=':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          atom.charge = (atom.charge || 0) + 1;
          if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case '-':
      case '_':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          atom.charge = (atom.charge || 0) - 1;
          if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case '0':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          atom.charge = atom.autoCharge || 0; // volver a la carga automática
          atom.lonePairs = 0;
          if (atom.label && (atom.label.endsWith('+') || atom.label.endsWith('-') || atom.label.endsWith('−'))) {
            atom.label = null;
            atom.manualLabel = false;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.app.updateValenceStatus();
        return true;
      case ':':
      case ';':
        this.state.saveSnapshot();
        for (const atom of atoms) {
          if (!atom.lonePairs || atom.lonePairs === 0) {
            if (atom.element === 'N') atom.lonePairs = 1;
            else if (atom.element === 'O' || atom.element === 'S') atom.lonePairs = 2;
            else if (['F', 'Cl', 'Br', 'I'].includes(atom.element)) atom.lonePairs = 3;
            else atom.lonePairs = 1;
          } else if (atom.lonePairs >= 3) {
            atom.lonePairs = 0;
          } else {
            atom.lonePairs += 1;
          }
        }
        this.renderer.render();
        return true;
    }

    if (newElement) {
      this.state.saveSnapshot();
      for (const atom of atoms) {
        atom.element = newElement;
        atom.label = newLabel;
        atom.manualLabel = false;
      }
      this.state.updateValences();
      this.renderer.render();
      this.app.updateValenceStatus();
      return true;
    }

    return false;
  }

  /**
   * Punto donde brota un enlace nuevo: guía axial/ecuatorial libre si es un vértice de silla,
   * si no, el ángulo químico óptimo a 38px.
   */
  getSproutPoint(atom) {
    const guide = pickChairGuide(atom, this.state);
    if (guide) return { x: guide.x, y: guide.y, depth: atom.depth };
    const rad = (calculateNextBondAngle(atom, this.state) * Math.PI) / 180;
    return {
      x: atom.x + STANDARD_BOND_LENGTH * Math.cos(rad),
      y: atom.y + STANDARD_BOND_LENGTH * Math.sin(rad),
      depth: atom.depth
    };
  }

  sproutCarbonBond(atom) {
    const p = this.getSproutPoint(atom);
    const newAtom = this.state.addAtom({
      x: p.x,
      y: p.y,
      element: 'C',
      label: null,
      ...(typeof p.depth === 'number' ? { depth: p.depth } : {})
    });

    this.state.addBond({
      atom1: atom.id,
      atom2: newAtom.id,
      type: 'single'
    });
  }

  sproutGroupBond(atom, groupText = 'OMs') {
    const p = this.getSproutPoint(atom);

    const cleanGroup = String(groupText).trim() || 'OMs';
    const newAtom = this.state.addAtom({
      ...(typeof p.depth === 'number' ? { depth: p.depth } : {}),
      x: p.x,
      y: p.y,
      element: cleanGroup,
      label: cleanGroup,
      manualLabel: true
    });

    this.state.addBond({
      atom1: atom.id,
      atom2: newAtom.id,
      type: 'single'
    });

    return newAtom;
  }

  /**
   * Pega lo copiado centrado en el cursor si está sobre el lienzo; si no, desplazado
   * 30 px respecto al original (cada pegado sucesivo se desplaza un poco más).
   */
  paste() {
    if (!this.clipboard) return;
    let dx, dy;
    const cursor = this.app && this.app.lastCanvasPos;
    if (cursor) {
      const c = this.state.constructor.clipboardCenter(this.clipboard);
      dx = cursor.x - c.x;
      dy = cursor.y - c.y;
    } else {
      this.pasteCount = (this.pasteCount || 0) + 1;
      dx = dy = 30 * this.pasteCount;
    }
    this.state.pasteClipboard(this.clipboard, dx, dy);
    if (this.app && typeof this.app.selectTool === 'function') this.app.selectTool('select');
    this.renderer.render();
    if (this.app && this.app.updateValenceStatus) this.app.updateValenceStatus();
  }

  deleteSelected() {
    const sel = this.state.selected;
    const hasSelection = ['atoms', 'bonds', 'arrows', 'labels', 'boxes'].some(k => sel[k] && sel[k].size > 0);
    if (!hasSelection) return; // sin selección no se guarda un paso vacío en Deshacer
    this.state.saveSnapshot();

    for (const id of Array.from(this.state.selected.atoms)) this.state.removeAtom(id);
    for (const id of Array.from(this.state.selected.bonds)) this.state.removeBond(id);
    for (const id of Array.from(this.state.selected.arrows)) this.state.removeArrow(id);
    for (const id of Array.from(this.state.selected.labels)) this.state.removeTextLabel(id);
    for (const id of Array.from(this.state.selected.boxes)) this.state.removeReferenceBox(id);

    this.state.clearSelection();
    this.renderer.render();
    this.app.updateValenceStatus();
  }
}


  // --- js/export/exporter.js ---
/**
 * exporter.js - Exportación vectorial SVG y ráster PNG de alta resolución (300 DPI)
 */

class ChemExporter {
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


  // --- js/export/serializer.js ---
/**
 * serializer.js - Guardado y carga de proyectos en formato JSON
 */

class ChemSerializer {
  static serialize(state) {
    return {
      version: '1.1',
      created: new Date().toISOString(),
      showCompoundBoxes: state.showCompoundBoxes !== false,
      atoms: Array.from(state.atoms.values()),
      bonds: Array.from(state.bonds.values()),
      arrows: Array.from(state.arrows.values()),
      referenceBoxes: Array.from(state.referenceBoxes.values()),
      textLabels: Array.from(state.textLabels.values())
    };
  }

  static downloadJson(state, filename = 'proyecto_olimpiada.json') {
    const data = this.serialize(state);
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Lee un .json y lo carga. callback(true) si salió bien, callback(false, mensaje) si no.
   * Si el archivo no es válido, el lienzo actual se queda como estaba.
   */
  static loadFromFile(file, state, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let data;
      try {
        data = JSON.parse(e.target.result);
      } catch (err) {
        console.error('Error al parsear el archivo JSON:', err);
        if (callback) callback(false, 'El archivo no es un JSON válido.');
        return;
      }
      try {
        state.loadFromObject(data, true);
        if (callback) callback(true);
      } catch (err) {
        console.error('Proyecto no válido:', err);
        if (callback) callback(false, err && err.message ? err.message : 'El proyecto no es válido.');
      }
    };
    reader.onerror = () => { if (callback) callback(false, 'No se pudo leer el archivo.'); };
    reader.readAsText(file);
  }
}


  // --- js/app.js ---
/**
 * app.js - Orquestador principal de ChemStudio
 * Conecta la interfaz (barra superior, paleta, inspectores y ventanas modales) con el estado,
 * las herramientas y el renderer.
 */




















/** Escapa texto para meterlo en HTML (atributos value="..." o innerHTML) */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Aviso no bloqueante dentro de la página. Sustituye a alert(): en páginas incrustadas
 * (p. ej. el link compartido) el navegador puede bloquear los diálogos y el aviso no se vería.
 */
function showToast(message, kind = 'info') {
  if (typeof document === 'undefined' || !document.body) return;
  let box = document.getElementById('chem-toast');
  if (!box) {
    box = document.createElement('div');
    box.id = 'chem-toast';
    box.setAttribute('role', 'status');
    box.style.cssText = 'position:fixed;left:50%;bottom:44px;transform:translateX(-50%);z-index:100000;' +
      'max-width:min(560px,calc(100vw - 32px));padding:10px 16px;border-radius:8px;font-size:14px;' +
      'box-shadow:0 6px 20px rgba(0,0,0,.25);transition:opacity .2s;pointer-events:none;';
    document.body.appendChild(box);
  }
  box.textContent = message;
  box.style.background = kind === 'error' ? '#b91c1c' : '#1f2937';
  box.style.color = '#ffffff';
  box.style.opacity = '1';
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => { box.style.opacity = '0'; }, kind === 'error' ? 6000 : 3500);
}

/** Confirmación dentro de la página (sustituye a confirm(), que también puede estar bloqueado) */
function askConfirm(message, onYes, yesLabel = 'Sí') {
  if (typeof document === 'undefined' || !document.body) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;z-index:100001;padding:16px;';
  overlay.innerHTML = `
    <div style="background:#ffffff;color:#111827;border-radius:10px;padding:20px 22px;max-width:380px;width:100%;box-shadow:0 10px 30px rgba(0,0,0,.3);font-size:15px;">
      <div style="margin-bottom:16px;">${escapeHtml(message)}</div>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn btn-sm" data-act="no">Cancelar</button>
        <button class="btn btn-sm" data-act="yes" style="background:#dc2626;color:#ffffff;">${escapeHtml(yesLabel)}</button>
      </div>
    </div>`;
  const close = () => { overlay.remove(); window.removeEventListener('keydown', onKey, true); };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    else if (e.key === 'Enter') { e.stopPropagation(); close(); onYes(); }
  };
  overlay.addEventListener('click', (e) => {
    const act = e.target?.getAttribute?.('data-act');
    if (act === 'yes') { close(); onYes(); }
    else if (act === 'no' || e.target === overlay) close();
  });
  window.addEventListener('keydown', onKey, true);
  document.body.appendChild(overlay);
  overlay.querySelector('[data-act="yes"]')?.focus();
}

class ChemApp {
  constructor() {
    this.state = new ChemState();
    this.svgElement = document.getElementById('chem-canvas');
    this.renderer = new SvgRenderer(this.svgElement, this.state);

    this.isPanning = false;
    this.isRightPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.isSpacePressed = false;
    this.currentMolLabelLetter = 'A';
    this.activeChargeMode = null; // Modo continuo de carga ('+', '-', '0', 'lp' o null)

    this.tools = {
      select: new SelectTool(this.state, this.renderer),
      bond: new BondTool(this.state, this.renderer),
      arrow: new ArrowTool(this.state, this.renderer, (arrow) => this.showArrowInspector(arrow)),
      chair: new ChairTool(this.state, this.renderer),
      template: new TemplateTool(this.state, this.renderer),
      text: new TextTool(this.state, this.renderer, (params) => this.showTextModal(params)),
      reference: new ReferenceTool(this.state, this.renderer, (box) => this.showBoxInspector(box)),
      eraser: new EraserTool(this.state, this.renderer)
    };

    // Por defecto la herramienta de silla usa CHAIR_CYCLOHEXANE (con atajo C)
    this.tools.chair.templateType = 'CHAIR_CYCLOHEXANE';

    this.activeToolKey = 'select';
    this.shortcuts = new ChemShortcuts(this.state, this.renderer, this);

    this.initCanvasEvents();
    this.initUiEvents();
    this.initInspectors();

    // Rótulo editable que flota sobre el recuadro de compuesto seleccionado
    this.renderer.onAfterRender = () => this.updateBoxTagEditor();

    this.state.on('change', () => {
      this.updateValenceStatus();
      this.renderer.render();
      this.updateInspectors();
    });

    this.loadExampleScheme();
  }

  /**
   * Recuadro de compuesto al que pertenece la selección actual: el recuadro seleccionado,
   * o el que contiene todos los átomos seleccionados (útil con los recuadros ocultos).
   */
  getTaggableCompoundBox() {
    for (const id of this.state.selected.boxes) {
      const b = this.state.referenceBoxes.get(id);
      if (b && b.boxType === 'compound') return b;
    }
    if (this.state.selected.atoms.size > 0) {
      const selIds = Array.from(this.state.selected.atoms);
      for (const b of this.state.referenceBoxes.values()) {
        if (b.boxType !== 'compound') continue;
        const inside = new Set(ProblemBuilder.getAtomsInsideBox(b, this.state).map(a => a.id));
        if (selIds.every(id => inside.has(id))) return b;
      }
    }
    return null;
  }

  ensureBoxTagEditor() {
    if (this.boxTagEditor) return this.boxTagEditor;
    const container = this.svgElement.parentElement;
    const wrap = document.createElement('div');
    wrap.className = 'box-tag-editor';
    wrap.style.cssText = 'position: absolute; z-index: 20; display: none; align-items: center; gap: 4px; padding: 2px 4px 2px 7px; border-radius: 6px; background: #2563eb; box-shadow: 0 2px 6px rgba(0,0,0,0.25); font-family: Arial, Helvetica, sans-serif;';
    wrap.innerHTML = `
      <span style="font-size: 10px; font-weight: bold; color: #dbeafe; text-transform: uppercase; letter-spacing: 0.4px;">Rótulo</span>
      <input type="text" class="box-tag-label" maxlength="40" spellcheck="false" title="Rótulo del compuesto (A, B, H1...). Enter para fijar; vacío = letra automática"
        style="width: 46px; height: 20px; border: none; border-radius: 4px; padding: 0 4px; font-size: 14px; font-weight: bold; text-align: center; color: #0f172a; background: #ffffff; outline: none;" />
      <span style="font-size: 10px; font-weight: bold; color: #dbeafe; text-transform: uppercase; letter-spacing: 0.4px; margin-left: 4px;">Fórmula</span>
      <input type="text" class="box-tag-formula" maxlength="40" spellcheck="false" placeholder="(C6H12O6)" title="Fórmula o texto debajo de la letra, con subíndices automáticos (ej. (C36H42BO12R)). Vacío = sin fórmula"
        style="width: 120px; height: 20px; border: none; border-radius: 4px; padding: 0 4px; font-size: 13px; color: #0f172a; background: #ffffff; outline: none;" />
    `;
    container.appendChild(wrap);
    const input = wrap.querySelector('.box-tag-label');
    const formulaInput = wrap.querySelector('.box-tag-formula');

    wrap.addEventListener('mousedown', (e) => e.stopPropagation());
    for (const el of [input, formulaInput]) {
      el.addEventListener('focus', () => {
        this.state.saveSnapshot();
        el.select();
      });
      el.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          el.blur();
        }
      });
      el.addEventListener('blur', () => {
        this.renderer.render();
        this.updateInspectors();
      });
    }
    input.addEventListener('input', () => {
      this.fitTagInputWidth();
      const box = this.boxTagEditorBox;
      if (box) this.applyBoxTag(box, input.value);
    });
    formulaInput.addEventListener('input', () => {
      const box = this.boxTagEditorBox;
      if (!box) return;
      // La fórmula usa el campo "descripción" del recuadro (el mismo del panel lateral)
      box.description = formulaInput.value;
      this.renderer.render();
    });

    this.boxTagEditor = wrap;
    this.boxTagInput = input;
    this.boxTagFormulaInput = formulaInput;
    return wrap;
  }

  /** El campo del rótulo crece con el texto (nombres largos como "Trinitrotolueno") */
  fitTagInputWidth() {
    if (!this.boxTagInput) return;
    const len = Math.max(this.boxTagInput.value.length, (this.boxTagInput.placeholder || '').length, 3);
    this.boxTagInput.style.width = `${Math.min(200, Math.max(46, len * 9 + 14))}px`;
  }

  /**
   * Fija el rótulo de un recuadro de compuesto. Si está vacío (incógnita) es su letra grande;
   * si contiene una molécula, se dibuja en negrita debajo de ella. Vacío = volver a lo automático.
   */
  applyBoxTag(box, rawValue) {
    const val = String(rawValue || '').trim();
    const hasAtoms = ProblemBuilder.getAtomsInsideBox(box, this.state).length > 0;
    // La etiqueta de esquina (box.label: A, B...) es independiente y NO se toca: es el
    // identificador de cada recuadro. El rótulo escrito aquí va en su propio campo (box.tag).
    if (hasAtoms) {
      box.tag = val;
      box.showLabel = Boolean(val);
    } else {
      box.showLabel = false;
      box.manualUnknown = Boolean(val);
      if (val) {
        box.unknownLetter = val;
        box.isUnknown = true;
      }
    }
    ProblemBuilder.assignUnknownLetters(this.state);
    // Si la incógnita ya estaba compacta, ajustar su ancho al nuevo texto (p. ej. "C" -> "H1")
    if (box.compacted && !hasAtoms) {
      box.compacted = false;
      ProblemBuilder.compactEmptyBox(box, this.state);
    }
    this.renderer.render();
  }

  /** Coloca el rótulo editable sobre el recuadro de compuesto activo (o lo oculta). */
  updateBoxTagEditor() {
    const box = this.getTaggableCompoundBox();
    if (!box) {
      if (this.boxTagEditor && !this.boxTagEditor.contains(document.activeElement)) {
        this.boxTagEditor.style.display = 'none';
        this.boxTagEditorBox = null;
      }
      return;
    }
    const wrap = this.ensureBoxTagEditor();
    const input = this.boxTagInput;
    this.boxTagEditorBox = box;

    const hasAtoms = ProblemBuilder.getAtomsInsideBox(box, this.state).length > 0;
    const current = hasAtoms ? (box.showLabel ? (box.tag || '') : '') : (box.unknownLetter || box.label || '');
    if (document.activeElement !== input) {
      input.value = current || '';
      input.placeholder = hasAtoms ? 'p. ej. 1' : '';
      this.fitTagInputWidth();
    }
    if (this.boxTagFormulaInput && document.activeElement !== this.boxTagFormulaInput) {
      this.boxTagFormulaInput.value = box.description || '';
    }

    // Posición en pantalla: encima del borde superior del recuadro, centrado
    const { pan, zoom } = this.state;
    wrap.style.display = 'flex';
    const w = wrap.offsetWidth || 110;
    const left = pan.x + (box.x + box.width / 2) * zoom - w / 2;
    const top = pan.y + box.y * zoom - 30;
    wrap.style.left = `${Math.round(left)}px`;
    wrap.style.top = `${Math.round(Math.max(2, top))}px`;
  }

  /** Abre el rótulo editable del recuadro activo; devuelve false si no hay recuadro. */
  focusBoxTagEditor() {
    const box = this.getTaggableCompoundBox();
    if (!box) return false;
    this.updateBoxTagEditor();
    if (this.boxTagInput) this.boxTagInput.focus();
    return true;
  }

  selectTool(toolKey, subOption = null) {
    this.activeToolKey = toolKey;
    this.state.currentTool = toolKey;

    if (toolKey !== 'select' && toolKey !== 'bond' && this.activeChargeMode) {
      this.setActiveChargeMode(null);
    }

    if (toolKey === 'bond' && subOption) {
      this.state.bondType = subOption;
      if (this.state.selected.bonds.size > 0) {
        this.state.saveSnapshot();
        for (const bId of this.state.selected.bonds) {
          const b = this.state.bonds.get(bId);
          if (b) b.type = subOption;
        }
        this.state.updateValences();
        this.renderer.render();
      }
    } else if (toolKey === 'arrow') {
      if (subOption === 'fork') {
        this.tools.arrow.defaultType = 'fork';
      } else if (subOption === 'converge') {
        this.tools.arrow.defaultType = 'converge';
      } else if (subOption === 'dashed') {
        this.tools.arrow.defaultType = 'dashed';
      } else if (subOption === 'bent') {
        this.tools.arrow.defaultType = 'bent';
      } else {
        this.tools.arrow.defaultType = 'normal';
      }
    } else if (toolKey === 'chair') {
      if (subOption) {
        this.tools.chair.templateType = subOption;
      } else {
        subOption = this.tools.chair.templateType;
      }
    } else if (toolKey === 'template' && subOption) {
      this.tools.template.setTemplate(String(subOption).toUpperCase());
    }

    const currentSub = toolKey === 'chair' 
      ? this.tools.chair.templateType 
      : (toolKey === 'bond' ? this.state.bondType : (toolKey === 'arrow' ? (this.tools.arrow.defaultType !== 'normal' ? this.tools.arrow.defaultType : null) : (toolKey === 'template' ? this.tools.template.templateKey : null)));

    document.querySelectorAll('.tool-btn').forEach(btn => {
      if (btn.dataset.tool === toolKey) {
        if (currentSub && btn.dataset.sub) {
          btn.classList.toggle('active', btn.dataset.sub === currentSub);
        } else if (!btn.dataset.sub && !currentSub) {
          btn.classList.add('active');
        } else if (!btn.dataset.sub) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      } else {
        btn.classList.remove('active');
      }
    });

    this.renderer.render();
  }

  getCanvasCoordinates(e) {
    const rect = this.svgElement.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const x = (clientX - this.state.pan.x) / this.state.zoom;
    const y = (clientY - this.state.pan.y) / this.state.zoom;

    return { x, y };
  }

  getTargetInfo(e) {
    const target = e.target;
    const closest = (selector) => target.closest(selector);

    if (closest('.rotate-handle')) {
      return { isRotateHandle: true };
    }

    const boxPort = closest('.box-port-handle');
    if (boxPort) {
      return {
        isBoxPort: true,
        boxId: boxPort.dataset.parentId,
        axis: boxPort.dataset.axis
      };
    }

    const refItem = closest('.ref-item-text, .ref-item-struct');
    if (refItem) {
      return {
        isRefItem: true,
        boxId: refItem.dataset.parentId,
        abbr: refItem.dataset.abbr
      };
    }

    const boxResize = closest('.box-resize-handle');
    if (boxResize) {
      return { isBoxResizeHandle: true, boxId: boxResize.dataset.parentId };
    }

    const arrowHandle = closest('.arrow-handle');
    if (arrowHandle) {
      return {
        isArrowHandle: true,
        arrowId: arrowHandle.dataset.parentId,
        role: arrowHandle.dataset.handleRole
      };
    }

    const guideDot = closest('.chair-guide-dot');
    if (guideDot) {
      return {
        isGuideDot: true,
        atomId: guideDot.dataset.atomId,
        guideType: guideDot.dataset.guideType
      };
    }

    const atomGroup = closest('.chem-atom');
    if (atomGroup) {
      return { type: 'atom', id: atomGroup.dataset.id };
    }

    const bondGroup = closest('.chem-bond');
    if (bondGroup) {
      return { type: 'bond', id: bondGroup.dataset.id };
    }

    const arrowStructGroup = closest('.arrow-reagent-struct');
    if (arrowStructGroup) {
      return { isArrowStruct: true, arrowId: arrowStructGroup.dataset.arrowId };
    }

    const arrowGroup = closest('.reaction-arrow');
    if (arrowGroup) {
      return { type: 'arrow', id: arrowGroup.dataset.id };
    }

    const labelGroup = closest('.chem-label');
    if (labelGroup) {
      return { type: 'label', id: labelGroup.dataset.id };
    }

    const boxGroup = closest('.reference-box');
    if (boxGroup) {
      return { type: 'box', id: boxGroup.dataset.id };
    }

    return null;
  }

  initCanvasEvents() {
    this.svgElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.isSpacePressed && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        this.isSpacePressed = true;
        this.svgElement.style.cursor = 'grab';
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSpacePressed = false;
        this.svgElement.style.cursor = 'default';
      }
    });

    this.svgElement.addEventListener('mousedown', (e) => {
      if (e.button === 2 || e.button === 1 || this.isSpacePressed) {
        e.preventDefault();
        this.isRightPanning = true;
        this.panStart = { x: e.clientX - this.state.pan.x, y: e.clientY - this.state.pan.y };
        this.svgElement.style.cursor = 'grabbing';
        return;
      }

      if (e.button !== 0) return;

      const canvasPos = this.getCanvasCoordinates(e);
      const targetInfo = this.getTargetInfo(e);

      // Clic en punto de eje de recuadro de compuesto
      if (targetInfo && targetInfo.isBoxPort) {
        e.preventDefault();
        e.stopPropagation();
        const box = this.state.referenceBoxes.get(targetInfo.boxId);
        if (box) {
          box.activeAxis = targetInfo.axis;
          this.state.clearSelection();
          this.state.selected.boxes.add(box.id);
          this.renderer.render();
          this.updateInspectors();
        }
        return;
      }

      // Clic en abreviatura del recuadro de referencias en el lienzo
      if (targetInfo && targetInfo.isRefItem) {
        e.preventDefault();
        e.stopPropagation();
        const box = this.state.referenceBoxes.get(targetInfo.boxId);
        if (box && box.items) {
          const item = box.items.find(it => it.abbr === targetInfo.abbr);
          if (item) {
            this.openAbbrevStructureModal(item, box);
          }
        }
        return;
      }

      // Clic en molécula de reactivo sobre la flecha en el lienzo
      if (targetInfo && targetInfo.isArrowStruct) {
        e.preventDefault();
        e.stopPropagation();
        const arrow = this.state.arrows.get(targetInfo.arrowId);
        if (arrow) {
          this.state.clearSelection();
          this.state.selected.arrows.add(arrow.id);
          this.renderer.render();
          this.updateInspectors();
          this.openArrowStructureModal(arrow);
        }
        return;
      }

      const activeTool = this.tools[this.activeToolKey];
      if (activeTool && activeTool.onMouseDown) {
        activeTool.onMouseDown(e, canvasPos, targetInfo);
      }
    });

    this.svgElement.addEventListener('dblclick', (e) => {
      const targetInfo = this.getTargetInfo(e);
      if (targetInfo && targetInfo.isBoxPort) {
        const box = this.state.referenceBoxes.get(targetInfo.boxId);
        if (box) {
          box.activeAxis = targetInfo.axis;
          const step = ProblemBuilder.extendFromBox(box, targetInfo.axis, this.state);
          this.state.clearSelection();
          this.state.selected.boxes.add(step.newBox.id);
          this.renderer.render();
          this.updateInspectors();
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isRightPanning || this.isPanning) {
        this.state.pan.x = e.clientX - this.panStart.x;
        this.state.pan.y = e.clientY - this.panStart.y;
        this.renderer.render();
        return;
      }

      const canvasPos = this.getCanvasCoordinates(e);
      const targetInfo = this.getTargetInfo(e);

      // Posición del cursor sobre el lienzo (Ctrl+V pega ahí); null si está fuera del lienzo
      const overCanvas = e.target && typeof e.target.closest === 'function' && e.target.closest('#chem-canvas');
      this.lastCanvasPos = overCanvas ? canvasPos : null;

      this.renderer.hoveredAtomId = targetInfo && targetInfo.type === 'atom' ? targetInfo.id : null;
      this.renderer.hoveredBondId = targetInfo && targetInfo.type === 'bond' ? targetInfo.id : null;

      const activeTool = this.tools[this.activeToolKey];
      if (activeTool && activeTool.onMouseMove) {
        activeTool.onMouseMove(e, canvasPos, targetInfo);
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (this.isRightPanning || this.isPanning) {
        this.isRightPanning = false;
        this.isPanning = false;
        this.svgElement.style.cursor = this.isSpacePressed ? 'grab' : 'default';
        return;
      }

      // Si el mouseup se originó en la interfaz de usuario (barra lateral, herramientas, encabezado, modales),
      // no ejecutar herramientas de lienzo ni recrear inspectores para no invalidar los eventos click.
      const isUi = Boolean(e.target.closest('.sidebar-right, .toolbar-left, .header, .status-bar, .modal-overlay, .box-tag-editor'));
      if (isUi) {
        return;
      }

      const canvasPos = this.getCanvasCoordinates(e);
      const targetInfo = this.getTargetInfo(e);
      const activeTool = this.tools[this.activeToolKey];
      if (activeTool && activeTool.onMouseUp) {
        activeTool.onMouseUp(e, canvasPos, targetInfo);
      }
      this.updateInspectors();
      this.updateValenceStatus();
    });

    this.svgElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newZoom = Math.min(Math.max(0.3, this.state.zoom * zoomFactor), 4.0);

      const rect = this.svgElement.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      this.state.pan.x = mouseX - (mouseX - this.state.pan.x) * (newZoom / this.state.zoom);
      this.state.pan.y = mouseY - (mouseY - this.state.pan.y) * (newZoom / this.state.zoom);
      this.state.zoom = newZoom;

      this.renderer.render();
    }, { passive: false });
  }

  initUiEvents() {
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        const sub = btn.dataset.sub;
        this.selectTool(tool, sub);
      });
    });

    document.querySelectorAll('.elem-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.elem-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.quick-group-chip').forEach(c => c.classList.remove('active'));
        const btnSelectGroup = document.getElementById('btn-select-group');
        if (btnSelectGroup) btnSelectGroup.classList.remove('active');
        btn.classList.add('active');
        this.state.activeElement = btn.dataset.elem;

        if (this.activeToolKey !== 'bond') {
          this.selectTool('bond', 'single');
        }

        if (this.state.selected.atoms.size > 0) {
          this.state.saveSnapshot();
          const elem = btn.dataset.elem;
          for (const id of this.state.selected.atoms) {
            const a = this.state.getAtom(id);
            if (a) {
              if (elem === 'C') {
                a.element = 'C';
                a.label = null;
                a.manualLabel = false;
              } else if (elem === 'N') {
                if (a.element === 'N') {
                  if (a.label === 'NH2') a.label = 'H2N';
                  else if (a.label === 'H2N') a.label = 'N';
                  else a.label = 'NH2';
                  a.manualLabel = true;
                } else {
                  a.element = 'N';
                  a.label = 'NH2';
                  a.manualLabel = false;
                }
              } else if (elem === 'O') {
                if (a.element === 'O') {
                  if (a.label === 'OH') a.label = 'HO';
                  else if (a.label === 'HO') a.label = 'O';
                  else a.label = 'OH';
                  a.manualLabel = true;
                } else {
                  a.element = 'O';
                  a.label = 'OH';
                  a.manualLabel = false;
                }
              } else if (elem === 'S') {
                if (a.element === 'S') {
                  if (a.label === 'SH') a.label = 'HS';
                  else if (a.label === 'HS') a.label = 'S';
                  else a.label = 'SH';
                  a.manualLabel = true;
                } else {
                  a.element = 'S';
                  a.label = 'SH';
                  a.manualLabel = false;
                }
              } else {
                a.element = elem;
                a.label = elem;
                a.manualLabel = false;
              }
            }
          }
          this.state.updateValences();
          this.renderer.render();
          this.updateValenceStatus();
        }
      });
    });

    // Asignación de Rótulo de Molécula (A, B, C...)
    const assignMoleculeLabel = () => {
      // En un esquema de problema el rótulo pertenece al recuadro: abrir su rótulo editable
      if (this.focusBoxTagEditor()) return;

      const input = document.getElementById('input-mol-label');
      const letter = input ? input.value.trim() : this.currentMolLabelLetter;
      if (!letter) return;

      // Obtener átomos de la molécula seleccionada (o todos si no hay selección)
      let atoms = [];
      for (const id of this.state.selected.atoms) {
        atoms.push(this.state.getAtom(id));
      }
      if (atoms.length === 0) {
        atoms = Array.from(this.state.atoms.values());
      }
      if (atoms.length === 0) {
        showToast('Dibuja o selecciona primero una molécula para asignarle su rótulo.');
        return;
      }

      this.state.saveSnapshot();
      const bbox = ChemAligner.getBoundingBox(atoms);
      const labelX = bbox.centerX;
      const labelY = bbox.maxY + 24;

      const newLabel = this.state.addTextLabel({
        x: labelX,
        y: labelY,
        text: letter,
        fontSize: 20,
        isIntermediary: true
      });

      this.state.clearSelection();
      this.state.selected.labels.add(newLabel.id);
      this.renderer.render();

      // Avanzar siguiente letra sugerida (A -> B -> C...)
      if (letter.length === 1 && letter >= 'A' && letter < 'Z') {
        const nextChar = String.fromCharCode(letter.charCodeAt(0) + 1);
        this.currentMolLabelLetter = nextChar;
        if (input) input.value = nextChar;
      }
    };

    // Asignación de Descriptor Estereoquímico (Anti, Syn, E, Z, cis, trans)
    this.assignMoleculeStereo = (stereoText) => {
      if (!stereoText) return;
      let atoms = [];
      for (const id of this.state.selected.atoms) {
        const a = this.state.getAtom(id);
        if (a) atoms.push(a);
      }
      if (atoms.length === 0) {
        atoms = Array.from(this.state.atoms.values());
      }
      if (atoms.length === 0) {
        showToast('Dibuja o selecciona primero una molécula para asignarle su descriptor estereoquímico.');
        return;
      }

      this.state.saveSnapshot();
      const bbox = ChemAligner.getBoundingBox(atoms);
      const labelX = bbox.centerX;
      const labelY = bbox.maxY + 22;

      let existingStereo = null;
      let existingDesc = null;
      for (const l of this.state.textLabels.values()) {
        if (Math.abs(l.x - labelX) < 45 && l.y >= bbox.maxY - 5 && l.y <= bbox.maxY + 85) {
          if (l.isStereo) existingStereo = l;
          else if (l.isDescription) existingDesc = l;
        }
      }

      if (existingStereo) {
        existingStereo.text = stereoText;
        existingStereo.x = labelX;
        existingStereo.y = labelY;
      } else {
        const newLabel = this.state.addTextLabel({
          x: labelX,
          y: labelY,
          text: stereoText,
          fontSize: 19,
          isStereo: true,
          isIntermediary: false
        });
        this.state.clearSelection();
        this.state.selected.labels.add(newLabel.id);
      }

      if (existingDesc) {
        existingDesc.x = labelX;
        existingDesc.y = labelY + 20;
      }

      this.renderer.render();
    };

    // Asignación de Descripción / Subtítulo del Producto (ej. Control Cinético)
    this.assignMoleculeDescription = (descText) => {
      if (!descText) return;
      let atoms = [];
      for (const id of this.state.selected.atoms) {
        const a = this.state.getAtom(id);
        if (a) atoms.push(a);
      }
      if (atoms.length === 0) {
        atoms = Array.from(this.state.atoms.values());
      }
      if (atoms.length === 0) {
        showToast('Dibuja o selecciona primero una molécula para asignarle su descripción.');
        return;
      }

      this.state.saveSnapshot();
      const bbox = ChemAligner.getBoundingBox(atoms);
      const labelX = bbox.centerX;

      let existingStereo = null;
      let existingDesc = null;
      for (const l of this.state.textLabels.values()) {
        if (Math.abs(l.x - labelX) < 45 && l.y >= bbox.maxY - 5 && l.y <= bbox.maxY + 85) {
          if (l.isStereo) existingStereo = l;
          else if (l.isDescription) existingDesc = l;
        }
      }

      const descY = existingStereo ? existingStereo.y + 20 : bbox.maxY + 22;

      if (existingDesc) {
        existingDesc.text = descText;
        existingDesc.x = labelX;
        existingDesc.y = descY;
      } else {
        const newLabel = this.state.addTextLabel({
          x: labelX,
          y: descY,
          text: descText,
          fontSize: 13,
          isDescription: true,
          isIntermediary: false
        });
        this.state.clearSelection();
        this.state.selected.labels.add(newLabel.id);
      }

      this.renderer.render();
    };

    document.querySelectorAll('.btn-stereo').forEach(btn => {
      btn.addEventListener('click', () => {
        const stereo = btn.dataset.stereo;
        this.assignMoleculeStereo(stereo);
      });
    });

    const descInput = document.getElementById('input-mol-description');
    const handleAddDesc = () => {
      const desc = descInput ? descInput.value.trim() : '';
      if (desc) {
        this.assignMoleculeDescription(desc);
      }
    };

    document.getElementById('btn-add-mol-description')?.addEventListener('click', handleAddDesc);
    descInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleAddDesc();
      }
    });

    document.getElementById('btn-auto-formula-desc')?.addEventListener('click', () => {
      let atoms = [];
      for (const id of this.state.selected.atoms) {
        const a = this.state.getAtom(id);
        if (a) atoms.push(a);
      }
      if (atoms.length === 0) {
        atoms = Array.from(this.state.atoms.values());
      }
      if (atoms.length === 0) {
        showToast('Dibuja o selecciona primero una molécula para calcular su fórmula.');
        return;
      }
      const formula = calculateMolecularFormula(atoms);
      if (descInput) descInput.value = formula;
      this.assignMoleculeDescription(formula);
    });

    // Modo blanco y negro (preferencia guardada en el navegador; por defecto desactivado)
    const monoBtn = document.getElementById('btn-toggle-monochrome');
    const applyMono = (on) => {
      SvgRenderer.monochrome = on;
      if (monoBtn) {
        monoBtn.classList.toggle('active', on);
        monoBtn.style.background = on ? '#2563eb' : '';
        monoBtn.style.color = on ? '#ffffff' : '';
        monoBtn.textContent = on ? '◐ Blanco y negro (On)' : '◐ Blanco y negro';
      }
      this.renderer.render();
    };
    let savedMono = false;
    try { savedMono = localStorage.getItem('chemstudio-monochrome') === '1'; } catch (e) { /* sin almacenamiento */ }
    applyMono(savedMono);
    monoBtn?.addEventListener('click', () => {
      const on = !SvgRenderer.monochrome;
      try { localStorage.setItem('chemstudio-monochrome', on ? '1' : '0'); } catch (e) { /* sin almacenamiento */ }
      applyMono(on);
    });
    document.getElementById('btn-assign-mol-label')?.addEventListener('click', assignMoleculeLabel);

    document.getElementById('btn-clear')?.addEventListener('click', () => {
      askConfirm('¿Limpiar todo el lienzo?', () => {
        this.state.clearAll();
        if (this.tools?.text) this.tools.text.nextIntermediary = 'A';
        this.renderer.render();
        this.updateValenceStatus();
      }, 'Limpiar');
    });

    document.getElementById('btn-load-example')?.addEventListener('click', () => {
      this.openExamplesGallery();
    });

    document.getElementById('btn-undo')?.addEventListener('click', () => {
      this.state.undo();
      this.renderer.render();
      this.updateValenceStatus();
    });

    document.getElementById('btn-redo')?.addEventListener('click', () => {
      this.state.redo();
      this.renderer.render();
      this.updateValenceStatus();
    });

    document.getElementById('btn-align-h')?.addEventListener('click', () => {
      this.alignSelected('h-centers');
    });

    document.getElementById('btn-align-v')?.addEventListener('click', () => {
      this.alignSelected('v-centers');
    });

    const toggleBoxesBtn = document.getElementById('btn-toggle-boxes-visibility');
    const updateToggleBoxesBtnUi = () => {
      if (!toggleBoxesBtn) return;
      if (this.state.showCompoundBoxes) {
        toggleBoxesBtn.textContent = 'Recuadros (On)';
        toggleBoxesBtn.style.background = '#eff6ff';
        toggleBoxesBtn.style.borderColor = '#93c5fd';
        toggleBoxesBtn.style.color = '#1d4ed8';
        toggleBoxesBtn.style.fontWeight = '600';
      } else {
        toggleBoxesBtn.textContent = 'Recuadros (Off)';
        toggleBoxesBtn.style.background = '';
        toggleBoxesBtn.style.borderColor = '';
        toggleBoxesBtn.style.color = '#64748b';
        toggleBoxesBtn.style.fontWeight = '';
      }
    };
    updateToggleBoxesBtnUi();

    const problemModeBtn = document.getElementById('btn-toggle-problem-mode');
    problemModeBtn?.addEventListener('click', () => {
      this.state.isProblemMode = !this.state.isProblemMode;
      problemModeBtn.classList.toggle('active', this.state.isProblemMode);
      if (this.state.isProblemMode) {
        problemModeBtn.style.background = '#2563eb';
        problemModeBtn.style.color = '#ffffff';
        problemModeBtn.textContent = 'Modo Problema (Activo)';
        this.selectTool('arrow');
        // Asegurar que los recuadros estén visibles
        this.state.showCompoundBoxes = true;
        updateToggleBoxesBtnUi();

        const hasCompoundBoxes = Array.from(this.state.referenceBoxes.values()).some(b => b.boxType === 'compound');
        const hasDrawing = this.state.atoms.size > 0 || this.state.arrows.size > 0 ||
          Array.from(this.state.textLabels.values()).some(l => l.isIntermediary);
        if (!hasCompoundBoxes && hasDrawing) {
          // Ya hay un dibujo (p. ej. un ejemplo): enmarcar cada molécula y convertir las letras en incógnitas
          ProblemBuilder.autoBoxExistingScheme(this.state);
          this.state.clearSelection();
          this.renderer.render();
          this.updateInspectors();
        } else if (!hasCompoundBoxes && !hasDrawing) {
          const step = ProblemBuilder.createInitialStep(100, 260, this.state);
          this.state.clearSelection();
          if (step.boxA) this.state.selected.boxes.add(step.boxA.id);
          this.renderer.render();
          this.updateInspectors();
        }
      } else {
        problemModeBtn.style.background = '';
        problemModeBtn.style.color = '';
        problemModeBtn.textContent = 'Modo Problema';
      }
    });

    document.getElementById('btn-fit-scheme')?.addEventListener('click', () => {
      ChemAligner.fitSchemeLayout(this.state);
      this.renderer.render();
    });

    toggleBoxesBtn?.addEventListener('click', () => {
      this.state.showCompoundBoxes = !this.state.showCompoundBoxes;
      updateToggleBoxesBtnUi();
      this.renderer.render();
    });

    // Control de Modo Oscuro (Dark Mode)
    const darkModeBtn = document.getElementById('btn-toggle-dark-mode');
    const updateDarkModeUi = () => {
      if (!darkModeBtn) return;
      document.body.classList.toggle('dark-mode', Boolean(this.state.isDarkMode));
      if (this.state.isDarkMode) {
        darkModeBtn.textContent = 'Modo Claro';
        darkModeBtn.style.background = '#1e293b';
        darkModeBtn.style.color = '#f8fafc';
        darkModeBtn.style.borderColor = '#38bdf8';
        darkModeBtn.style.fontWeight = 'bold';
      } else {
        darkModeBtn.textContent = 'Modo Oscuro';
        darkModeBtn.style.background = '';
        darkModeBtn.style.color = '';
        darkModeBtn.style.borderColor = '';
        darkModeBtn.style.fontWeight = '';
      }
      this.renderer.initSvgDefs();
      this.renderer.render();
    };

    if (typeof localStorage !== 'undefined') {
      const savedDark = localStorage.getItem('chem_dark_mode');
      if (savedDark === 'true') {
        this.state.isDarkMode = true;
        updateDarkModeUi();
      }
    }

    darkModeBtn?.addEventListener('click', () => {
      this.state.isDarkMode = !this.state.isDarkMode;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('chem_dark_mode', this.state.isDarkMode ? 'true' : 'false');
      }
      updateDarkModeUi();
    });

    document.getElementById('btn-center-between-arrows')?.addEventListener('click', () => {
      this.centerSelectedBetweenArrows();
    });

    document.getElementById('btn-adjust-arrows')?.addEventListener('click', () => {
      this.state.saveSnapshot();
      const count = ChemAligner.adjustArrowsToMolecules(this.state);
      this.renderer.render();
    });

    document.getElementById('btn-distribute-h')?.addEventListener('click', () => {
      this.distributeSelectedH();
    });

    document.getElementById('btn-export-svg')?.addEventListener('click', () => {
      ChemExporter.downloadSvg(this.svgElement, this.state, 'esquema_olimpiada.svg', this.renderer);
    });

    document.getElementById('btn-export-png')?.addEventListener('click', () => {
      ChemExporter.downloadPng(this.svgElement, this.state, 'esquema_olimpiada.png', ChemExporter.PNG_SCALE, this.renderer);
    });

    document.getElementById('btn-save-json')?.addEventListener('click', () => {
      ChemSerializer.downloadJson(this.state, 'proyecto_olimpiada.json');
    });

    document.getElementById('file-input-json')?.addEventListener('change', (e) => {
      const input = e.target;
      const file = input.files[0];
      // Vaciar el campo para que volver a elegir el mismo archivo también dispare "change"
      input.value = '';
      if (file) {
        ChemSerializer.loadFromFile(file, this.state, (success, message) => {
          if (success) {
            if (this.tools?.text) this.tools.text.nextIntermediary = 'A';
            if (typeof updateToggleBoxesBtnUi === 'function') updateToggleBoxesBtnUi();
            this.renderer.render();
            this.updateValenceStatus();
            showToast(`Proyecto "${file.name}" abierto.`);
          } else {
            showToast(`No se pudo abrir "${file.name}": ${message}`, 'error');
          }
        });
      }
    });

    document.getElementById('btn-load-json')?.addEventListener('click', () => {
      document.getElementById('file-input-json')?.click();
    });
  }

  alignSelected(type) {
    const items = [];
    for (const id of this.state.selected.atoms) items.push(this.state.getAtom(id));
    for (const id of this.state.selected.arrows) items.push(this.state.arrows.get(id));
    for (const id of this.state.selected.labels) items.push(this.state.textLabels.get(id));

    if (items.length < 2) {
      showToast('Selecciona al menos 2 elementos para alinear.');
      return;
    }
    this.state.saveSnapshot();

    if (type === 'h-centers') {
      ChemAligner.alignHorizontalCenters(items);
    } else if (type === 'v-centers') {
      ChemAligner.alignVerticalCenters(items);
    }

    this.renderer.render();
  }

  centerSelectedBetweenArrows() {
    const arrows = Array.from(this.state.arrows.values());
    if (arrows.length < 2) {
      showToast('Se necesitan al menos 2 flechas en el lienzo para centrar el intermediario.');
      return;
    }

    const selectedLabels = Array.from(this.state.selected.labels).map(id => this.state.textLabels.get(id));
    const selectedAtoms = Array.from(this.state.selected.atoms).map(id => this.state.getAtom(id));

    const target = selectedLabels.length > 0 ? selectedLabels[0] : (selectedAtoms.length > 0 ? selectedAtoms : null);
    if (!target) {
      showToast('Selecciona el intermediario (rótulo o molécula) a centrar entre las flechas.');
      return;
    }

    const targetX = Array.isArray(target) ? ChemAligner.getBoundingBox(target).centerX : target.x;
    let leftArrow = null, rightArrow = null;
    let minLeftDist = Infinity, minRightDist = Infinity;

    for (const arr of arrows) {
      const arrX = (arr.x1 + arr.x2) / 2;
      if (arrX < targetX && (targetX - arrX) < minLeftDist) {
        minLeftDist = targetX - arrX;
        leftArrow = arr;
      } else if (arrX > targetX && (arrX - targetX) < minRightDist) {
        minRightDist = arrX - targetX;
        rightArrow = arr;
      }
    }

    if (leftArrow && rightArrow) {
      this.state.saveSnapshot();
      ChemAligner.centerBetweenArrows(leftArrow, rightArrow, target, 30);
      this.renderer.render();
    } else {
      showToast('No se encontraron flechas a la izquierda y derecha del elemento seleccionado.');
    }
  }

  distributeSelectedH() {
    const items = [];
    for (const id of this.state.selected.labels) items.push(this.state.textLabels.get(id));
    for (const id of this.state.selected.arrows) items.push(this.state.arrows.get(id));

    if (items.length < 2) {
      showToast('Selecciona al menos 2 elementos para distribuir con espaciado uniforme.');
      return;
    }
    this.state.saveSnapshot();

    ChemAligner.distributeHorizontally(items, 30);
    this.renderer.render();
  }

  initInspectors() {
    const topInput = document.getElementById('arrow-reagents-top');
    const bottomInput = document.getElementById('arrow-reagents-bottom');

    const updateArrowReagents = () => {
      const selArrowId = Array.from(this.state.selected.arrows)[0];
      if (selArrowId) {
        const arrow = this.state.arrows.get(selArrowId);
        if (arrow) {
          this.state.saveSnapshot();
          arrow.reagentsTop = topInput.value;
          arrow.reagentsBottom = bottomInput.value;
          this.renderer.render();
        }
      }
    };

    topInput?.addEventListener('input', updateArrowReagents);
    bottomInput?.addEventListener('input', updateArrowReagents);

    // Botón Dibujar / Editar Molécula sobre la Flecha
    document.getElementById('btn-draw-arrow-struct')?.addEventListener('click', () => {
      const selArrowId = Array.from(this.state.selected.arrows)[0];
      if (!selArrowId) return;
      const arrow = this.state.arrows.get(selArrowId);
      if (arrow) {
        this.openArrowStructureModal(arrow);
      }
    });

    // Botón Importar Selección del Lienzo a la Flecha
    document.getElementById('btn-import-selection-to-arrow')?.addEventListener('click', () => {
      const selArrowId = Array.from(this.state.selected.arrows)[0];
      if (!selArrowId) return;
      const arrow = this.state.arrows.get(selArrowId);
      if (!arrow) return;

      const selAtomIds = Array.from(this.state.selected.atoms);
      if (selAtomIds.length === 0) {
        showToast('Por favor selecciona primero una molécula en el lienzo (con la herramienta de Selección) para importarla sobre la flecha.');
        return;
      }

      this.state.saveSnapshot();
      const atomsToCopy = selAtomIds.map(id => this.state.getAtom(id)).filter(Boolean);
      const atomIdSet = new Set(selAtomIds);
      const bondsToCopy = Array.from(this.state.bonds.values()).filter(b => atomIdSet.has(b.atom1) && atomIdSet.has(b.atom2));

      arrow.structureTop = {
        version: '1.0',
        atoms: atomsToCopy.map(a => ({ ...a })),
        bonds: bondsToCopy.map(b => ({ ...b })),
        arrows: []
      };

      this.renderer.render();
      this.updateInspectors();
    });

    // Botón Quitar Molécula de la Flecha
    document.getElementById('btn-clear-arrow-struct')?.addEventListener('click', () => {
      const selArrowId = Array.from(this.state.selected.arrows)[0];
      if (!selArrowId) return;
      const arrow = this.state.arrows.get(selArrowId);
      if (arrow) {
        this.state.saveSnapshot();
        arrow.structureTop = null;
        this.renderer.render();
        this.updateInspectors();
      }
    });

    document.getElementById('btn-toggle-dashed-arrow')?.addEventListener('click', () => {
      const selArrowId = Array.from(this.state.selected.arrows)[0];
      if (!selArrowId) return;
      const arrow = this.state.arrows.get(selArrowId);
      if (arrow) {
        this.state.saveSnapshot();
        arrow.type = (arrow.type === 'dashed') ? 'normal' : 'dashed';
        this.renderer.render();
        this.updateInspectors();
      }
    });

    // Doblar en L: recta → (→ ↓) → (↓ →) → recta
    document.getElementById('btn-toggle-bent-arrow')?.addEventListener('click', () => {
      const selArrowId = Array.from(this.state.selected.arrows)[0];
      const arrow = selArrowId ? this.state.arrows.get(selArrowId) : null;
      if (!arrow || arrow.type === 'fork' || arrow.type === 'converge') {
        showToast('Selecciona una flecha simple para doblarla en L.');
        return;
      }
      this.state.saveSnapshot();
      if (!arrow.bend) {
        const dx = arrow.x2 - arrow.x1, dy = arrow.y2 - arrow.y1;
        if (Math.abs(dx) >= Math.abs(dy)) {
          arrow.bend = 'hv';
          if (Math.abs(dy) < 2) arrow.y2 = arrow.y1 + 100; // recta horizontal: la punta baja 100 px
        } else {
          arrow.bend = 'vh';
          if (Math.abs(dx) < 2) arrow.x2 = arrow.x1 + 100; // recta vertical: la punta gira a la derecha
        }
      } else if (arrow.bend === 'hv') {
        arrow.bend = 'vh';
      } else {
        delete arrow.bend;
      }
      this.renderer.render();
      this.updateInspectors();
    });

    document.getElementById('btn-toggle-fork-arrow')?.addEventListener('click', () => {
      const selArrowId = Array.from(this.state.selected.arrows)[0];
      if (!selArrowId) return;
      const arrow = this.state.arrows.get(selArrowId);
      if (arrow) {
        this.state.saveSnapshot();
        const gap = 16;
        if (arrow.type === 'fork') {
          arrow.type = 'normal';
          arrow.y2 = arrow.y1;

          // Re-centrar cualquier recuadro que estuviera en la rama superior (B)
          let targetTop = null;
          let targetBottom = null;
          for (const box of this.state.referenceBoxes.values()) {
            if (box.boxType === 'compound') {
              if (Math.abs(box.x - (arrow.x2 + gap)) < 50) {
                if (Math.abs((box.y + box.height / 2) - (arrow.yTop || (arrow.y1 - 75))) < 50) {
                  targetTop = box;
                } else if (Math.abs((box.y + box.height / 2) - (arrow.yBottom || (arrow.y1 + 75))) < 50) {
                  targetBottom = box;
                }
              }
            }
          }

          if (targetTop) {
            const shiftY = arrow.y1 - (targetTop.y + targetTop.height / 2);
            targetTop.y += shiftY;
            const atoms = ChemAligner.getAtomsForBox(targetTop, this.state);
            for (const a of atoms) a.y += shiftY;
          }
          if (targetBottom) {
            const bottomAtoms = ChemAligner.getAtomsForBox(targetBottom, this.state);
            if (bottomAtoms.length === 0) {
              this.state.removeReferenceBox(targetBottom.id);
            }
          }
        } else {
          arrow.type = 'fork';
          arrow.branchSpacing = arrow.branchSpacing || 150;
          arrow.stemEndX = arrow.x1 + Math.max(50, (arrow.x2 - arrow.x1) * 0.45);
          arrow.yTop = arrow.y1 - arrow.branchSpacing / 2;
          arrow.yBottom = arrow.y1 + arrow.branchSpacing / 2;

          // Buscar si había un recuadro destino cerca del final de la flecha simple
          let targetBox = null;
          let minTgtDist = 130;
          for (const box of this.state.referenceBoxes.values()) {
            if (box.boxType === 'compound') {
              const d = Math.hypot(box.x - arrow.x2, (box.y + box.height / 2) - arrow.y1);
              if (d < minTgtDist) {
                minTgtDist = d;
                targetBox = box;
              }
            }
          }

          const boxWidth = targetBox ? targetBox.width : 140;
          const boxHeight = targetBox ? targetBox.height : 110;

          if (targetBox) {
            // 1. Mover el recuadro existente a la rama SUPERIOR (B)
            const oldCenterY = targetBox.y + targetBox.height / 2;
            const newCenterY = arrow.yTop;
            const shiftY = newCenterY - oldCenterY;
            targetBox.x = arrow.x2 + gap;
            targetBox.y = arrow.yTop - boxHeight / 2;

            const atoms = ChemAligner.getAtomsForBox(targetBox, this.state);
            for (const a of atoms) a.y += shiftY;

            // 2. CREAR AUTOMÁTICAMENTE EL RECUADRO C EN LA RAMA INFERIOR
            const labelC = ProblemBuilder.getNextLabel(this.state);
            this.state.addReferenceBox({
              boxType: 'compound',
              label: labelC,
              x: arrow.x2 + gap,
              y: arrow.yBottom - boxHeight / 2,
              width: boxWidth,
              height: boxHeight
            });
          } else if (this.state.isProblemMode) {
            // No había recuadro: generar B arriba y C abajo
            const labelB = ProblemBuilder.getNextLabel(this.state);
            this.state.addReferenceBox({
              boxType: 'compound',
              label: labelB,
              x: arrow.x2 + gap,
              y: arrow.yTop - boxHeight / 2,
              width: boxWidth,
              height: boxHeight
            });

            const labelC = ProblemBuilder.getNextLabel(this.state);
            this.state.addReferenceBox({
              boxType: 'compound',
              label: labelC,
              x: arrow.x2 + gap,
              y: arrow.yBottom - boxHeight / 2,
              width: boxWidth,
              height: boxHeight
            });
          }
        }
        this.renderer.render();
        this.updateInspectors();
      }
    });

    document.getElementById('btn-toggle-converge-arrow')?.addEventListener('click', () => {
      const selArrowId = Array.from(this.state.selected.arrows)[0];
      if (!selArrowId) return;
      const arrow = this.state.arrows.get(selArrowId);
      if (arrow) {
        this.state.saveSnapshot();
        if (arrow.type === 'converge') {
          arrow.type = 'normal';
          arrow.y2 = arrow.yMid !== undefined ? arrow.yMid : arrow.y1;
          arrow.yTop = undefined;
          arrow.yBottom = undefined;
          arrow.yMid = undefined;
          arrow.stemStartX = undefined;
        } else {
          arrow.type = 'converge';
          arrow.branchSpacing = arrow.branchSpacing || 150;
          arrow.yMid = arrow.y1;
          arrow.yTop = arrow.yMid - arrow.branchSpacing / 2;
          arrow.yBottom = arrow.yMid + arrow.branchSpacing / 2;
          arrow.stemStartX = arrow.x1 + Math.max(40, (arrow.x2 - arrow.x1) * 0.45);
          arrow.y2 = arrow.yMid;
        }
        this.renderer.render();
        this.updateInspectors();
      }
    });

    document.getElementById('btn-add-axial')?.addEventListener('click', () => {
      const selAtomId = Array.from(this.state.selected.atoms)[0];
      if (selAtomId) {
        this.tools.chair.addSubstituentFromGuide(selAtomId, 'axial');
      } else {
        showToast('Selecciona un vértice de la silla de ciclohexano primero.');
      }
    });

    document.getElementById('btn-add-equatorial')?.addEventListener('click', () => {
      const selAtomId = Array.from(this.state.selected.atoms)[0];
      if (selAtomId) {
        this.tools.chair.addSubstituentFromGuide(selAtomId, 'equatorial');
      } else {
        showToast('Selecciona un vértice de la silla de ciclohexano primero.');
      }
    });

    document.getElementById('btn-add-ref-item')?.addEventListener('click', () => {
      const abbrInput = document.getElementById('ref-item-abbr');
      const formulaInput = document.getElementById('ref-item-formula');
      if (!abbrInput || !formulaInput) return;

      const abbr = abbrInput.value.trim();
      const formula = formulaInput.value.trim();
      if (!abbr) return;

      const selBoxId = Array.from(this.state.selected.boxes)[0];
      const box = selBoxId ? this.state.referenceBoxes.get(selBoxId) : Array.from(this.state.referenceBoxes.values())[0];

      if (box) {
        this.state.saveSnapshot();
        box.items.push({ abbr, formula });
        this.renderer.render();
        this.renderBoxItemsList(box);
        abbrInput.value = '';
        formulaInput.value = '';
      }
    });

    document.getElementById('btn-draw-ref-item')?.addEventListener('click', () => {
      const selBoxId = Array.from(this.state.selected.boxes)[0];
      const box = selBoxId ? this.state.referenceBoxes.get(selBoxId) : Array.from(this.state.referenceBoxes.values()).find(b => b.boxType === 'reference');
      if (box) {
        this.openAbbrevStructureModal(null, box);
      }
    });

    // Control de Cargas y Pares Electrónicos
    const getActiveAtoms = () => {
      if (this.renderer.hoveredAtomId) {
        const a = this.state.getAtom(this.renderer.hoveredAtomId);
        if (a) return [a];
      }
      if (this.state.selected.atoms.size > 0) {
        return Array.from(this.state.selected.atoms).map(id => this.state.getAtom(id)).filter(Boolean);
      }
      const allAtoms = Array.from(this.state.atoms.values());
      return allAtoms.length > 0 ? [allAtoms[allAtoms.length - 1]] : [];
    };

    // Control de Selección de Grupos Funcionales y Protectores Rápidos (OMs, OTs, etc.)
    const quickGroupInput = document.getElementById('input-quick-group');
    const btnSelectGroup = document.getElementById('btn-select-group') || document.getElementById('btn-sprout-group');

    this.activateGroup = (groupText, sourceBtn = null) => {
      const clean = (groupText || '').trim() || 'OMs';

      // 1. Quitar estado activo de todos los elementos y chips
      document.querySelectorAll('.elem-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.quick-group-chip').forEach(c => c.classList.remove('active'));
      const btnSel = document.getElementById('btn-select-group') || document.getElementById('btn-sprout-group');
      if (btnSel) btnSel.classList.remove('active');

      // 2. Marcar como activo el botón o chip correspondiente
      if (sourceBtn) {
        sourceBtn.classList.add('active');
      } else {
        let matched = false;
        document.querySelectorAll('.quick-group-chip').forEach(c => {
          if (c.getAttribute('data-group') === clean) {
            c.classList.add('active');
            matched = true;
          }
        });
        if (!matched && btnSel) {
          btnSel.classList.add('active');
        }
      }

      // 3. Sincronizar campo de texto
      if (quickGroupInput && quickGroupInput.value !== clean) {
        quickGroupInput.value = clean;
      }

      // 4. Asignar como activeElement en el estado químico
      this.state.activeElement = clean;

      // 5. Activar la herramienta de enlace simple (Bond Tool) para trazar con snapping
      if (this.activeToolKey !== 'bond') {
        this.selectTool('bond', 'single');
      }

      // 6. Si hay átomos seleccionados en el lienzo, transformarlos inmediatamente al grupo
      if (this.state.selected.atoms.size > 0) {
        this.state.saveSnapshot();
        for (const id of this.state.selected.atoms) {
          const a = this.state.getAtom(id);
          if (a) {
            a.element = clean;
            a.label = clean;
            a.manualLabel = true;
            a.isCustomLabel = true;
          }
        }
        this.state.updateValences();
        this.renderer.render();
        this.updateValenceStatus();
        this.updateInspectors();
      }

      // 7. Notificar al usuario en la barra de estado
      const statusText = document.getElementById('valence-status-text');
      if (statusText) {
        const orig = statusText.textContent;
        statusText.textContent = `⚡ Grupo seleccionado: [${clean}]. Haz clic o arrastra desde cualquier átomo para trazar el enlace.`;
        setTimeout(() => {
          if (statusText.textContent.includes('Grupo seleccionado:')) statusText.textContent = orig;
        }, 3500);
      }
    };

    btnSelectGroup?.addEventListener('click', () => {
      const g = quickGroupInput ? quickGroupInput.value : 'OMs';
      this.activateGroup(g, btnSelectGroup);
    });

    quickGroupInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.activateGroup(quickGroupInput.value, btnSelectGroup);
      }
    });

    document.querySelectorAll('.quick-group-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const g = chip.getAttribute('data-group');
        this.activateGroup(g, chip);
      });
    });

    document.getElementById('btn-open-periodic-table')?.addEventListener('click', () => {
      this.openPeriodicTableModal();
    });

    this.setActiveChargeMode = (mode) => {
      if (this.activeChargeMode === mode || !mode) {
        this.activeChargeMode = null;
      } else {
        this.activeChargeMode = mode;
      }
      this.state.activeChargeMode = this.activeChargeMode;

      const btnPos = document.getElementById('btn-charge-pos');
      const btnNeg = document.getElementById('btn-charge-neg');
      const btnLp = document.getElementById('btn-lone-pairs');
      const btnNeu = document.getElementById('btn-charge-neutral');
      const banner = document.getElementById('charge-mode-banner');
      const bannerText = document.getElementById('charge-mode-text');

      btnPos?.classList.toggle('active-pos', this.activeChargeMode === '+');
      btnNeg?.classList.toggle('active-neg', this.activeChargeMode === '-');
      btnLp?.classList.toggle('active-lp', this.activeChargeMode === 'lp');
      btnNeu?.classList.toggle('active-neutral', this.activeChargeMode === '0');

      if (this.activeChargeMode) {
        if (banner) banner.style.display = 'flex';
        const labelMap = {
          '+': '⊕ (+) Positivo',
          '-': '⊖ (−) Negativo',
          'lp': '·· Pares Libres (LP)',
          '0': '0 Neutro'
        };
        if (bannerText) {
          bannerText.innerHTML = `⚡ Modo Carga: <b>${labelMap[this.activeChargeMode]}</b>. Haz clic en átomos para aplicar.`;
        }
        // Despejar selección previa para no alterar inadvertidamente el último átomo dibujado
        this.state.clearSelection();
        this.renderer.render();
      } else {
        if (banner) banner.style.display = 'none';
      }
    };

    document.getElementById('btn-charge-pos')?.addEventListener('click', () => {
      this.setActiveChargeMode('+');
    });

    document.getElementById('btn-charge-neg')?.addEventListener('click', () => {
      this.setActiveChargeMode('-');
    });

    document.getElementById('btn-lone-pairs')?.addEventListener('click', () => {
      this.setActiveChargeMode('lp');
    });

    document.getElementById('btn-charge-neutral')?.addEventListener('click', () => {
      this.setActiveChargeMode('0');
    });

    document.getElementById('btn-charge-mode-close')?.addEventListener('click', () => {
      this.setActiveChargeMode(null);
    });

    document.getElementById('btn-quick-pyridinium')?.addEventListener('click', () => {
      let targetAtom = null;
      for (const [atomId, info] of this.state.valenceErrors.entries()) {
        if (info.hasError && info.message.includes('Nitrógeno')) {
          targetAtom = this.state.getAtom(atomId);
          break;
        }
      }
      if (!targetAtom) {
        const atoms = getActiveAtoms();
        targetAtom = atoms.length > 0 ? atoms[0] : null;
      }
      if (targetAtom) {
        this.state.saveSnapshot();
        targetAtom.charge = 1;
        targetAtom.lonePairs = 0;
        if (targetAtom.label && (targetAtom.label.endsWith('-') || targetAtom.label.endsWith('−'))) {
          targetAtom.label = null;
        }
        this.state.updateValences();
        this.renderer.render();
        this.updateValenceStatus();
      }
    });

    // Inspector de Recuadro de Compuesto (Modo Problema)
    const getActiveCompoundBox = () => {
      let selBoxId = Array.from(this.state.selected.boxes)[0];
      if (!selBoxId && this.lastSelectedCompoundBoxId) {
        selBoxId = this.lastSelectedCompoundBoxId;
      }
      if (!selBoxId) return null;
      const box = this.state.referenceBoxes.get(selBoxId);
      return (box && box.boxType === 'compound') ? box : null;
    };

    const unkInput = document.getElementById('input-compound-unknown');
    const btnUpdateUnk = document.getElementById('btn-update-compound-unknown');

    const applyCompoundUnknown = (saveToHistory = true) => {
      const box = getActiveCompoundBox();
      if (!box) return;
      const val = unkInput ? unkInput.value.trim() : '';
      if (saveToHistory) {
        this.state.saveSnapshot();
      }
      if (val) {
        box.unknownLetter = val.toUpperCase();
        box.manualUnknown = true;
        box.isUnknown = true;
      } else {
        box.manualUnknown = false;
        // Si se vacía, restablecer letra automática correlativa
        ProblemBuilder.assignUnknownLetters(this.state);
        if (unkInput) unkInput.value = box.unknownLetter || '';
      }
      this.renderer.render();
      this.state.emit('change');
      if (btnUpdateUnk) {
        const origText = btnUpdateUnk.textContent;
        btnUpdateUnk.textContent = '✓ Fijado!';
        btnUpdateUnk.style.filter = 'brightness(1.25)';
        setTimeout(() => {
          btnUpdateUnk.textContent = origText;
          btnUpdateUnk.style.filter = '';
        }, 800);
      }
    };

    // Actualización reactiva en tiempo real al escribir en la incógnita central
    unkInput?.addEventListener('input', () => {
      const box = getActiveCompoundBox();
      if (!box) return;
      const val = unkInput.value.trim();
      if (val) {
        box.unknownLetter = val.toUpperCase();
        box.manualUnknown = true;
        box.isUnknown = true;
      } else {
        box.manualUnknown = false;
        ProblemBuilder.assignUnknownLetters(this.state);
      }
      this.renderer.render();
    });

    unkInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCompoundUnknown(true);
      }
    });

    unkInput?.addEventListener('change', () => {
      applyCompoundUnknown(true);
    });

    btnUpdateUnk?.addEventListener('click', () => {
      applyCompoundUnknown(true);
    });

    // Descripción / Subtítulo del compuesto
    const descInput = document.getElementById('input-compound-description');
    const btnUpdateDesc = document.getElementById('btn-update-compound-description');
    const applyCompoundDescription = (saveToHistory = true) => {
      const box = getActiveCompoundBox();
      if (!box) return;
      const val = descInput ? descInput.value.trim() : '';
      if (saveToHistory) {
        this.state.saveSnapshot();
      }
      box.description = val;
      this.renderer.render();
      this.state.emit('change');
      if (btnUpdateDesc) {
        const orig = btnUpdateDesc.textContent;
        btnUpdateDesc.textContent = '✓ Fijado!';
        btnUpdateDesc.style.borderColor = '#16a34a';
        btnUpdateDesc.style.color = '#16a34a';
        setTimeout(() => {
          btnUpdateDesc.textContent = orig;
          btnUpdateDesc.style.borderColor = '';
          btnUpdateDesc.style.color = '';
        }, 700);
      }
    };
    descInput?.addEventListener('input', () => {
      const box = getActiveCompoundBox();
      if (!box) return;
      box.description = descInput.value;
      this.renderer.render();
    });
    descInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCompoundDescription(true);
      }
    });
    btnUpdateDesc?.addEventListener('click', () => {
      applyCompoundDescription(true);
    });

    // Rótulo de esquina secundario
    const labelInput = document.getElementById('input-compound-label');
    const btnUpdateLabel = document.getElementById('btn-update-compound-label');
    const applyCompoundLabel = () => {
      const box = getActiveCompoundBox();
      if (!box) return;
      const val = labelInput ? labelInput.value.trim() : '';
      this.state.saveSnapshot();
      box.label = val;
      this.renderer.render();
      this.state.emit('change');
    };
    btnUpdateLabel?.addEventListener('click', applyCompoundLabel);
    labelInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCompoundLabel();
      }
    });

    document.getElementById('btn-extend-problem-smart')?.addEventListener('click', () => {
      const selBoxId = Array.from(this.state.selected.boxes)[0];
      if (!selBoxId) return;
      const box = this.state.referenceBoxes.get(selBoxId);
      if (box) {
        const dir = box.activeAxis || 'right';
        const step = ProblemBuilder.extendFromBox(box, dir, this.state);
        this.state.clearSelection();
        this.state.selected.boxes.add(step.newBox.id);
        this.renderer.render();
        this.updateInspectors();
      }
    });

    document.getElementById('btn-extend-problem-right')?.addEventListener('click', () => {
      const selBoxId = Array.from(this.state.selected.boxes)[0];
      if (!selBoxId) return;
      const box = this.state.referenceBoxes.get(selBoxId);
      if (box) {
        box.activeAxis = 'right';
        const step = ProblemBuilder.extendFromBox(box, 'right', this.state);
        this.state.clearSelection();
        this.state.selected.boxes.add(step.newBox.id);
        this.renderer.render();
        this.updateInspectors();
      }
    });

    document.getElementById('btn-extend-problem-down')?.addEventListener('click', () => {
      const selBoxId = Array.from(this.state.selected.boxes)[0];
      if (!selBoxId) return;
      const box = this.state.referenceBoxes.get(selBoxId);
      if (box) {
        box.activeAxis = 'down';
        const step = ProblemBuilder.extendFromBox(box, 'down', this.state);
        this.state.clearSelection();
        this.state.selected.boxes.add(step.newBox.id);
        this.renderer.render();
        this.updateInspectors();
      }
    });

    document.getElementById('btn-extend-problem-left')?.addEventListener('click', () => {
      const selBoxId = Array.from(this.state.selected.boxes)[0];
      if (!selBoxId) return;
      const box = this.state.referenceBoxes.get(selBoxId);
      if (box) {
        box.activeAxis = 'left';
        const step = ProblemBuilder.extendFromBox(box, 'left', this.state);
        this.state.clearSelection();
        this.state.selected.boxes.add(step.newBox.id);
        this.renderer.render();
        this.updateInspectors();
      }
    });

    document.getElementById('btn-extend-problem-up')?.addEventListener('click', () => {
      const selBoxId = Array.from(this.state.selected.boxes)[0];
      if (!selBoxId) return;
      const box = this.state.referenceBoxes.get(selBoxId);
      if (box) {
        box.activeAxis = 'up';
        const step = ProblemBuilder.extendFromBox(box, 'up', this.state);
        this.state.clearSelection();
        this.state.selected.boxes.add(step.newBox.id);
        this.renderer.render();
        this.updateInspectors();
      }
    });

    document.getElementById('btn-finish-problem-mode')?.addEventListener('click', () => {
      this.finishProblemMode();
    });

    document.getElementById('btn-fork-problem-step')?.addEventListener('click', () => {
      const selBoxId = Array.from(this.state.selected.boxes)[0];
      if (!selBoxId) return;
      const box = this.state.referenceBoxes.get(selBoxId);
      if (box) {
        const dir = box.activeAxis || 'right';
        const forkRes = ProblemBuilder.createForkStep(box, this.state, dir);
        this.state.clearSelection();
        this.state.selected.arrows.add(forkRes.forkArrow.id);
        this.renderer.render();
        this.updateInspectors();
      }
    });

    document.getElementById('btn-converge-problem-step')?.addEventListener('click', () => {
      const selBoxId = Array.from(this.state.selected.boxes)[0];
      if (!selBoxId) return;
      const box = this.state.referenceBoxes.get(selBoxId);
      if (!box) return;

      // Buscar si existe otra caja en la misma columna vertical (hermana)
      let siblingBox = null;
      let minXDiff = Infinity;
      for (const other of this.state.referenceBoxes.values()) {
        if (other.id !== box.id && other.boxType === 'compound') {
          const xDiff = Math.abs(other.x - box.x);
          if (xDiff < 70) {
            if (!siblingBox || Math.abs(other.y - box.y) < Math.abs(siblingBox.y - box.y)) {
              siblingBox = other;
            }
          }
        }
      }

      let topBox = box;
      let bottomBox = siblingBox;
      if (!bottomBox) {
        // Si no hay hermana, generar una caja inferior automáticamente
        const labelC = ProblemBuilder.getNextLabel(this.state);
        bottomBox = this.state.addReferenceBox({
          boxType: 'compound',
          label: labelC,
          x: box.x,
          y: box.y + box.height + 40,
          width: box.width,
          height: box.height
        });
      }

      if (topBox.y > bottomBox.y) {
        const temp = topBox;
        topBox = bottomBox;
        bottomBox = temp;
      }

      const convRes = ProblemBuilder.createConvergeStep(topBox, bottomBox, this.state);
      this.state.clearSelection();
      this.state.selected.boxes.add(convRes.targetBox.id);
      this.renderer.render();
      this.updateInspectors();
    });

    document.getElementById('btn-autofit-this-box')?.addEventListener('click', () => {
      const selBoxId = Array.from(this.state.selected.boxes)[0];
      if (!selBoxId) return;
      const box = this.state.referenceBoxes.get(selBoxId);
      if (box) {
        this.state.saveSnapshot();
        ProblemBuilder.autoFitBox(box, this.state);
        this.renderer.render();
      }
    });
  }

  updateInspectors() {
    const arrowSection = document.getElementById('inspector-arrow');
    const chairSection = document.getElementById('inspector-chair');
    const boxSection = document.getElementById('inspector-refbox');
    const compoundBoxSection = document.getElementById('inspector-compound-box');
    const molSection = document.getElementById('inspector-molecule');

    // 1. Molécula seleccionada (mostrar asignador de letra A, B, C... y descripciones)
    if (this.state.selected.atoms.size > 0) {
      if (molSection) molSection.style.display = 'block';
      const descInput = document.getElementById('input-mol-description');
      if (descInput) {
        let descFound = '';
        const atoms = Array.from(this.state.selected.atoms).map(id => this.state.getAtom(id)).filter(Boolean);
        if (atoms.length > 0) {
          const bbox = ChemAligner.getBoundingBox(atoms);
          for (const l of this.state.textLabels.values()) {
            if (l.isDescription && Math.abs(l.x - bbox.centerX) < 50 && l.y >= bbox.maxY - 5 && l.y <= bbox.maxY + 85) {
              descFound = l.text;
              break;
            }
          }
        }
        descInput.value = descFound;
      }
    } else {
      if (molSection) molSection.style.display = 'none';
    }

    // 2. Flecha seleccionada
    if (this.state.selected.arrows.size === 1) {
      const arrowId = Array.from(this.state.selected.arrows)[0];
      const arrow = this.state.arrows.get(arrowId);
      if (arrow) {
        arrowSection.style.display = 'block';
        document.getElementById('arrow-reagents-top').value = arrow.reagentsTop || '';
        document.getElementById('arrow-reagents-bottom').value = arrow.reagentsBottom || '';
        const badge = document.getElementById('arrow-struct-badge');
        const drawBtn = document.getElementById('btn-draw-arrow-struct');
        const clearBtn = document.getElementById('btn-clear-arrow-struct');
        const hasMol = Boolean(arrow.structureTop);
        if (badge) badge.style.display = hasMol ? 'inline-block' : 'none';
        if (clearBtn) clearBtn.style.display = hasMol ? 'block' : 'none';
        if (drawBtn) drawBtn.textContent = hasMol ? '✏️ Editar Molécula' : '✏️ Dibujar Molécula';

        const toggleForkBtn = document.getElementById('btn-toggle-fork-arrow');
        if (toggleForkBtn) {
          toggleForkBtn.textContent = arrow.type === 'fork' 
            ? '➔ Convertir en Flecha Simple' 
            : '🔀 Alternar Bifurcación (Anti / Syn)';
        }
        const toggleConvergeBtn = document.getElementById('btn-toggle-converge-arrow');
        if (toggleConvergeBtn) {
          toggleConvergeBtn.textContent = arrow.type === 'converge'
            ? '➔ Convertir en Flecha Simple'
            : '⏩ Alternar Convergencia (2 ➔ 1)';
        }
      }
    } else {
      arrowSection.style.display = 'none';
    }

    // 3. Vértice de silla seleccionado
    let hasChairAtom = false;
    for (const id of this.state.selected.atoms) {
      const a = this.state.getAtom(id);
      if (a && a.chairVertex) {
        hasChairAtom = true;
        break;
      }
    }
    chairSection.style.display = hasChairAtom ? 'block' : 'none';

    // 4. Caja seleccionada (Compuesto o Referencia)
    if (this.state.selected.boxes.size === 1) {
      const boxId = Array.from(this.state.selected.boxes)[0];
      const box = this.state.referenceBoxes.get(boxId);
      if (box && box.boxType === 'compound') {
        this.lastSelectedCompoundBoxId = boxId;
        if (boxSection) boxSection.style.display = 'none';
        if (compoundBoxSection) {
          compoundBoxSection.style.display = 'block';
          const labelInput = document.getElementById('input-compound-label');
          if (labelInput) labelInput.value = box.label || '';
          const descInput = document.getElementById('input-compound-description');
          if (descInput) descInput.value = box.description || '';
          const unkInput = document.getElementById('input-compound-unknown');
          if (unkInput) {
            const atoms = ProblemBuilder.getAtomsInsideBox(box, this.state);
            if (atoms.length === 0 && !box.unknownLetter) {
              ProblemBuilder.assignUnknownLetters(this.state);
            }
            unkInput.value = box.unknownLetter || (atoms.length === 0 ? 'A' : '');
          }
        }
      } else if (box) {
        if (compoundBoxSection) compoundBoxSection.style.display = 'none';
        if (boxSection) {
          boxSection.style.display = 'block';
          this.renderBoxItemsList(box);
        }
      }
    } else {
      if (boxSection) boxSection.style.display = 'none';
      if (compoundBoxSection) compoundBoxSection.style.display = 'none';
    }
  }

  renderBoxItemsList(box) {
    const container = document.getElementById('refbox-items-list');
    if (!container) return;
    container.innerHTML = '';

    box.items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'ref-item-row';

      const label = document.createElement('span');
      let displayContent = `<b>${escapeHtml(item.abbr)}</b> = `;
      let hasStructure = false;
      if (item.structure) {
        let sObj = item.structure;
        if (typeof sObj === 'string') {
          try { sObj = JSON.parse(sObj); } catch {}
        }
        if (sObj && sObj.atoms && sObj.atoms.length > 0) hasStructure = true;
      }
      if (hasStructure) {
        displayContent += `<span style="color: #3b82f6; font-size: 10px; font-weight: bold; background: rgba(59,130,246,0.15); padding: 1px 5px; border-radius: 4px;">🔬 Estructura</span>`;
        if (item.formula) displayContent += ` <span style="font-size: 10px; color: #94a3b8; font-family: monospace;">(${escapeHtml(item.formula)})</span>`;
      } else {
        displayContent += escapeHtml(item.formula || '');
      }
      label.innerHTML = displayContent;
      label.style.cursor = 'pointer';
      label.title = `Clic para abrir Editor de Estructura de ${item.abbr}`;
      label.onclick = () => this.openAbbrevStructureModal(item, box);
      row.appendChild(label);

      const rightGrp = document.createElement('div');
      rightGrp.style.display = 'flex';
      rightGrp.style.alignItems = 'center';
      rightGrp.style.gap = '4px';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-sm';
      editBtn.style.padding = '2px 5px';
      editBtn.style.fontSize = '11px';
      editBtn.textContent = '✏️ Estructura';
      editBtn.title = `Abrir editor de estructura para ${item.abbr}`;
      editBtn.onclick = (e) => {
        e.stopPropagation();
        this.openAbbrevStructureModal(item, box);
      };
      rightGrp.appendChild(editBtn);

      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-sm';
      delBtn.style.padding = '2px 6px';
      delBtn.textContent = '✕';
      delBtn.title = 'Eliminar abreviatura';
      delBtn.onclick = (e) => {
        e.stopPropagation();
        this.state.saveSnapshot();
        box.items.splice(idx, 1);
        this.renderer.render();
        this.renderBoxItemsList(box);
      };
      rightGrp.appendChild(delBtn);

      row.appendChild(rightGrp);
      container.appendChild(row);
    });
  }

  /**
   * Cambia el elemento de un átomo en los editores de estructura (abreviaturas y flechas)
   * dejando que la etiqueta (OH, NH2, O, N...) se calcule sola según sus enlaces.
   * Solo los elementos sin fórmula automática (Si, B, metales...) llevan etiqueta fija.
   */
  setStructureAtomElement(atom, elem) {
    const autoLabel = ['C', 'H', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I'].includes(elem);
    atom.element = elem;
    atom.label = autoLabel ? null : elem;
    atom.manualLabel = !autoLabel;
    atom.isCustomLabel = !autoLabel;
  }

  /**
   * Átomo (radio 14) o enlace (distancia 8) más cercano a un punto del lienzo de un editor de
   * estructura; null si no hay ninguno. Los átomos tienen prioridad sobre los enlaces.
   */
  findNearestStructureItem(state, pos) {
    let best = null;
    let bestDist = 14;
    for (const a of state.atoms.values()) {
      const d = Math.hypot(pos.x - a.x, pos.y - a.y);
      if (d < bestDist) {
        bestDist = d;
        best = { type: 'atom', id: a.id };
      }
    }
    if (best) return best;
    bestDist = 8;
    for (const b of state.bonds.values()) {
      const a1 = state.getAtom(b.atom1);
      const a2 = state.getAtom(b.atom2);
      if (!a1 || !a2) continue;
      const dx = a2.x - a1.x, dy = a2.y - a1.y;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) continue;
      const t = Math.max(0, Math.min(1, ((pos.x - a1.x) * dx + (pos.y - a1.y) * dy) / lenSq));
      const d = Math.hypot(pos.x - (a1.x + t * dx), pos.y - (a1.y + t * dy));
      if (d < bestDist) {
        bestDist = d;
        best = { type: 'bond', id: b.id };
      }
    }
    return best;
  }

  openAbbrevStructureModal(item, box) {
    const isNew = !item;
    const initialAbbr = item ? (item.abbr || '') : '';
    const initialFormula = item ? (item.formula || '') : '';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-abbrev-structure';

    const templates = [
      { name: 'TBS / TBDMS', abbr: 'TBS', formula: 't-BuMe2Si', desc: 'tert-butil dimetilsilil' },
      { name: 'Ac (Acetilo)', abbr: 'Ac', formula: 'CH3CO', desc: 'acetilo' },
      { name: 'Bn (Bencilo)', abbr: 'Bn', formula: 'PhCH2', desc: 'bencilo' },
      { name: 'Ph (Fenilo)', abbr: 'Ph', formula: 'C6H5', desc: 'fenilo' },
      { name: 'Ts (Tosilo)', abbr: 'Ts', formula: 'p-TolSO2', desc: 'p-toluenosulfonilo' },
      { name: 'Ms (Mesilo)', abbr: 'Ms', formula: 'CH3SO2', desc: 'metanosulfonilo' },
      { name: 'Tf (Trifil)', abbr: 'Tf', formula: 'CF3SO2', desc: 'trifluorometanosulfonilo' },
      { name: 'Bz (Benzoilo)', abbr: 'Bz', formula: 'PhCO', desc: 'benzoilo' },
      { name: 'Boc', abbr: 'Boc', formula: 't-BuOCO', desc: 'tert-butiloxicarbonilo' },
      { name: 'Fmoc', abbr: 'Fmoc', formula: 'C15H11O2', desc: 'fluorenilmetiloxicarbonilo' },
      { name: 'COOMe', abbr: 'COOMe', formula: 'CO2CH3', desc: 'metoxicarbonilo' },
      { name: 'NO2 (Nitro)', abbr: 'NO2', formula: 'NO2', desc: 'grupo nitro' },
      { name: '-OMs', abbr: '-OMs', formula: 'CH3SO3', desc: 'mesilato / mesiloxi' }
    ];

    const isDark = Boolean(this.state && this.state.isDarkMode);

    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); padding: 12px;';

    overlay.innerHTML = `
      <div class="modal-card modal-chemstudio-subwindow" style="width: 96vw; max-width: 1440px; height: 92vh; display: flex; flex-direction: column; background: ${isDark ? '#090d16' : '#ffffff'}; color: ${isDark ? '#f8fafc' : '#0f172a'}; border: 1px solid ${isDark ? '#1e293b' : '#cbd5e1'}; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); overflow: hidden; padding: 0;">
        
        <!-- Encabezado Superior (diseño exacto de Chem Studio) -->
        <header class="header" style="height: auto; min-height: 48px; flex-shrink: 0; flex-wrap: wrap; gap: 6px 12px; border-bottom: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; background: ${isDark ? '#0f172a' : '#ffffff'}; display: flex; align-items: center; justify-content: space-between; padding: 6px 16px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span class="logo" style="font-size: 15px; font-weight: bold; color: ${isDark ? '#60a5fa' : '#2563eb'}; display: flex; align-items: center; gap: 6px;">
              ⬡ Chem Studio <span style="font-size: 12px; font-weight: normal; color: ${isDark ? '#94a3b8' : '#64748b'};">| Pizarra de Estructura de Abreviatura</span>
            </span>
            <div style="display: flex; align-items: center; gap: 8px; background: ${isDark ? '#1e293b' : '#f1f5f9'}; padding: 3px 10px; border-radius: 6px; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
              <label style="font-size: 11px; font-weight: bold; color: ${isDark ? '#cbd5e1' : '#475569'};">Abreviatura / Símbolo:</label>
              <input type="text" id="modal-struct-abbr" class="form-input" value="${escapeHtml(initialAbbr)}" style="width: 120px; height: 26px; font-size: 13px; font-weight: bold; padding: 2px 8px;" placeholder="ej. TBS, -OMs, Ac" />
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-sm" id="modal-btn-undo" title="Deshacer (Ctrl+Z)">↶ Deshacer</button>
            <button class="btn btn-sm" id="modal-btn-redo" title="Rehacer (Ctrl+Y)">↷ Rehacer</button>
            <button class="btn btn-sm" id="modal-btn-center" title="Centrar estructura en la pizarra">⇥ Centrar</button>
            <button class="btn btn-sm" id="modal-btn-clear" title="Limpiar pizarra">🗑 Limpiar</button>
            <div style="width: 1px; height: 24px; background: ${isDark ? '#334155' : '#e2e8f0'}; margin: 0 4px;"></div>
            <button class="btn btn-sm" id="modal-struct-cancel">✕ Cancelar</button>
            <button class="btn btn-sm btn-primary" id="modal-struct-save" style="font-weight: bold; background: #2563eb; color: #ffffff; padding: 5px 16px; font-size: 13px;">💾 Guardar y Colocar en Referencias</button>
          </div>
        </header>

        <!-- Sub-workspace: Toolbar Left + Canvas Central + Sidebar Right -->
        <div style="display: flex; flex: 1; min-height: 0; position: relative; overflow: hidden;">
          
          <!-- Toolbar Left (vertical, idéntico a Chem Studio) -->
          <aside class="toolbar-left" style="width: 54px; border-right: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; background: ${isDark ? '#0f172a' : '#f8fafc'}; display: flex; flex-direction: column; align-items: center; padding: 8px 0; gap: 4px; overflow-y: auto;">
            <button class="tool-btn modal-tool-btn active" data-tool="select" title="Seleccionar y Desplazar (V) [Supr/Backspace para borrar]">
              <span class="tool-icon">↖</span>
              <span class="tool-shortcut">V</span>
            </button>
            
            <div class="tool-sep" style="width: 32px; height: 1px; background: ${isDark ? '#334155' : '#cbd5e1'}; margin: 3px 0;"></div>

            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="single" title="Enlace Simple (Tecla 1)">
              <span class="tool-icon">╱</span>
              <span class="tool-shortcut">1</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="double" title="Enlace Doble (Tecla 2)">
              <span class="tool-icon">═</span>
              <span class="tool-shortcut">2</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="triple" title="Enlace Triple (Tecla 3)">
              <span class="tool-icon">≡</span>
              <span class="tool-shortcut">3</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="wedge" title="Cuña Sólida (Up)">
              <span class="tool-icon">▲</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="dash" title="Cuña a Trazos (Down)">
              <span class="tool-icon">▤</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="dashed" title="Enlace Punteado de Unión (Tecla 4 / P): indica el enlace donde conecta la abreviatura, ej. -O-Si o punto de unión">
              <span class="tool-icon" style="font-weight: bold; letter-spacing: -2px;">╌╌</span>
              <span class="tool-shortcut">4</span>
            </button>

            <div class="tool-sep" style="width: 32px; height: 1px; background: ${isDark ? '#334155' : '#cbd5e1'}; margin: 3px 0;"></div>

            <button class="tool-btn modal-tool-btn" data-tool="arrow" data-sub="dashed" title="Flecha Punteada de Unión: marca hacia dónde conecta el grupo (ej. en -Ms, -TBS)">
              <span class="tool-icon" style="color: #3b82f6; font-weight: bold;">⇢</span>
              <span class="tool-shortcut">U</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="arrow" data-sub="normal" title="Flecha Normal de Reacción">
              <span class="tool-icon">➔</span>
            </button>

            <div class="tool-sep" style="width: 32px; height: 1px; background: ${isDark ? '#334155' : '#cbd5e1'}; margin: 3px 0;"></div>

            <button class="tool-btn modal-tool-btn" data-tool="template" data-sub="BENZENE" title="Anillo de Benceno">
              <span class="tool-icon">⌬</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="template" data-sub="CYCLOHEXANE" title="Ciclohexano">
              <span class="tool-icon">⬡</span>
            </button>

            <div class="tool-sep" style="width: 32px; height: 1px; background: ${isDark ? '#334155' : '#cbd5e1'}; margin: 3px 0;"></div>

            <button class="tool-btn modal-tool-btn" data-tool="eraser" title="Borrador: haz clic o arrastra sobre átomos o enlaces para borrarlos (Supr / Del)">
              <span class="tool-icon">⌫</span>
              <span class="tool-shortcut">Del</span>
            </button>
          </aside>

          <!-- Center Canvas Area -->
          <div id="modal-chem-canvas-container" style="flex: 1; height: 100%; position: relative; background: ${isDark ? '#090d16' : '#ffffff'}; overflow: hidden; cursor: crosshair;">
            <svg id="modal-chem-svg" width="100%" height="100%" style="display: block; width: 100%; height: 100%;"></svg>
            <div style="position: absolute; bottom: 10px; left: 14px; font-size: 11px; color: ${isDark ? '#94a3b8' : '#64748b'}; pointer-events: none; background: ${isDark ? 'rgba(15,23,42,0.88)' : 'rgba(255,255,255,0.9)'}; padding: 4px 10px; border-radius: 5px; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
              Atajos ChemStudio: <b>1</b> Ciclar enlace / Brotar C · <b>Supr / Backspace</b> Borrar selección · <b>⌫</b> Borrador arrastrable · <b>⇢</b> Flecha de unión · <b>Clic der</b> Pan · <b>Rueda</b> Zoom
            </div>
          </div>

          <!-- Right Sidebar -->
          <aside style="width: 250px; border-left: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; background: ${isDark ? '#0f172a' : '#f8fafc'}; padding: 12px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto;">
            
            <div>
              <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${isDark ? '#94a3b8' : '#64748b'}; margin-bottom: 6px; letter-spacing: 0.5px;">
                Átomos y Elementos
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
                ${['C', 'Si', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I', 'H'].map(el => `
                  <button class="btn btn-sm modal-elem-btn ${el === 'C' ? 'active' : ''}" data-elem="${el}" style="font-weight: bold; justify-content: center; ${el === 'C' ? 'background: #2563eb; color: #ffffff; border-color: #2563eb;' : ''}">
                    ${el}
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${isDark ? '#94a3b8' : '#64748b'}; letter-spacing: 0.5px;">
                  Plantillas IChO
                </span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
                ${templates.map(t => `
                  <button class="btn btn-sm btn-outline modal-template-btn" data-abbr="${t.abbr}" data-formula="${t.formula}" style="font-size: 11px; font-weight: 600; padding: 4px 2px; justify-content: center;" title="${t.desc}">
                    ${t.abbr}
                  </button>
                `).join('')}
              </div>
            </div>

            <div style="border-top: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; padding-top: 10px;">
              <button id="modal-struct-capture-btn" class="btn btn-sm btn-primary" style="width: 100%; justify-content: center; font-size: 11px; padding: 6px;" title="Copiar la molécula seleccionada del lienzo principal a esta pizarra">
                📥 Copiar Selección del Lienzo
              </button>
            </div>

            <div style="background: ${isDark ? '#1e293b' : '#f1f5f9'}; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 6px; padding: 8px; font-size: 11px; color: ${isDark ? '#cbd5e1' : '#475569'}; line-height: 1.4;">
              <strong style="color: ${isDark ? '#60a5fa' : '#2563eb'};">💡 Colocación Directa:</strong><br/>
              Al hacer clic en <b>Guardar</b>, esta estructura se colocará visualmente en el recuadro de abreviaturas del esquema. No ocupas poner fórmula molecular.
            </div>

            <div style="margin-top: auto; border-top: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; padding-top: 8px;">
              <label style="display: block; font-size: 10px; color: ${isDark ? '#94a3b8' : '#64748b'}; margin-bottom: 2px;">Fórmula de texto (opcional):</label>
              <input type="text" id="modal-struct-formula" class="form-input" value="${escapeHtml(initialFormula)}" style="width: 100%; font-size: 11px; font-family: monospace; height: 26px; padding: 2px 6px;" placeholder="Opcional (ej. t-BuMe2Si)" />
            </div>

          </aside>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const abbrInput = overlay.querySelector('#modal-struct-abbr');
    const formulaInput = overlay.querySelector('#modal-struct-formula');
    const modalSvg = overlay.querySelector('#modal-chem-svg');

    // Inicializar estado completo del editor para la pizarra del modal
    const modalState = new ChemState();
    modalState.isDarkMode = isDark;
    modalState.bondType = 'single';
    modalState.activeElement = 'C';
    modalState.currentTool = 'select';
    modalState.pan = { x: 0, y: 0 };
    modalState.zoom = 1.0;

    const modalRenderer = new SvgRenderer(modalSvg, modalState);

    const modalTools = {
      select: new SelectTool(modalState, modalRenderer),
      bond: new BondTool(modalState, modalRenderer),
      template: new TemplateTool(modalState, modalRenderer),
      arrow: new ArrowTool(modalState, modalRenderer),
      eraser: new EraserTool(modalState, modalRenderer)
    };

    let activeModalToolKey = 'select';

    const selectModalTool = (tool, sub = null) => {
      activeModalToolKey = tool;
      modalState.currentTool = tool;
      overlay.querySelectorAll('.modal-tool-btn').forEach(b => {
        const matchTool = b.dataset.tool === tool;
        const matchSub = !sub || String(b.dataset.sub).toUpperCase() === String(sub).toUpperCase();
        b.classList.toggle('active', matchTool && matchSub);
      });
      if (tool === 'bond' && sub) {
        modalState.bondType = sub;
        if (modalState.selected.bonds.size > 0) {
          modalState.saveSnapshot();
          for (const bId of modalState.selected.bonds) {
            const b = modalState.bonds.get(bId);
            if (b) b.type = sub;
          }
          modalState.updateValences();
          modalRenderer.render();
        }
      } else if (tool === 'arrow') {
        modalTools.arrow.defaultType = sub || 'dashed';
      } else if (tool === 'template' && sub) {
        modalTools.template.setTemplate(String(sub).toUpperCase());
      }
    };

    const selectModalElement = (elem) => {
      modalState.activeElement = elem;
      overlay.querySelectorAll('.modal-elem-btn').forEach(b => {
        const isActive = b.dataset.elem === elem;
        b.classList.toggle('active', isActive);
        b.style.background = isActive ? '#2563eb' : '';
        b.style.color = isActive ? '#ffffff' : '';
        b.style.borderColor = isActive ? '#2563eb' : '';
      });
      if (modalState.selected.atoms.size > 0) {
        modalState.saveSnapshot();
        for (const id of modalState.selected.atoms) {
          const a = modalState.getAtom(id);
          if (a) this.setStructureAtomElement(a, elem);
        }
        modalState.updateValences();
        modalRenderer.render();
      }
    };

    // Generador de plantillas IChO con estructuras reales y flechas de unión punteadas
    const loadTemplateData = (templateKey) => {
      modalState.clearAll();
      const key = String(templateKey || '').trim().toUpperCase();

      if (key === 'TBS' || key === 'TBDMS') {
        const si = modalState.addAtom({ x: 320, y: 150, element: 'Si', label: 'Si', manualLabel: true });
        const me1 = modalState.addAtom({ x: 320, y: 114, element: 'C', label: 'CH3', manualLabel: false });
        const me2 = modalState.addAtom({ x: 320, y: 186, element: 'C', label: 'H3C', manualLabel: false });
        const cQuat = modalState.addAtom({ x: 358, y: 150, element: 'C' });
        const t1 = modalState.addAtom({ x: 386, y: 126, element: 'C', label: 'CH3' });
        const t2 = modalState.addAtom({ x: 396, y: 150, element: 'C', label: 'CH3' });
        const t3 = modalState.addAtom({ x: 386, y: 174, element: 'C', label: 'CH3' });
        modalState.addBond({ atom1: si.id, atom2: me1.id, type: 'single' });
        modalState.addBond({ atom1: si.id, atom2: me2.id, type: 'single' });
        modalState.addBond({ atom1: si.id, atom2: cQuat.id, type: 'single' });
        modalState.addBond({ atom1: cQuat.id, atom2: t1.id, type: 'single' });
        modalState.addBond({ atom1: cQuat.id, atom2: t2.id, type: 'single' });
        modalState.addBond({ atom1: cQuat.id, atom2: t3.id, type: 'single' });
        modalState.addArrow({ x1: 250, y1: 150, x2: 304, y2: 150, type: 'dashed' });
        return { abbr: 'TBS', formula: 't-BuMe2Si' };
      }

      if (key === 'MS') {
        const s = modalState.addAtom({ x: 320, y: 150, element: 'S', label: 'S', manualLabel: true });
        const o1 = modalState.addAtom({ x: 346, y: 120, element: 'O', label: 'O' });
        const o2 = modalState.addAtom({ x: 346, y: 180, element: 'O', label: 'O' });
        const me = modalState.addAtom({ x: 358, y: 150, element: 'C', label: 'CH3' });
        modalState.addBond({ atom1: s.id, atom2: o1.id, type: 'double' });
        modalState.addBond({ atom1: s.id, atom2: o2.id, type: 'double' });
        modalState.addBond({ atom1: s.id, atom2: me.id, type: 'single' });
        modalState.addArrow({ x1: 250, y1: 150, x2: 304, y2: 150, type: 'dashed' });
        return { abbr: 'Ms', formula: 'CH3SO2' };
      }

      if (key === 'OMS' || key === '-OMS') {
        const o = modalState.addAtom({ x: 280, y: 150, element: 'O', label: 'O' });
        const s = modalState.addAtom({ x: 318, y: 150, element: 'S', label: 'S', manualLabel: true });
        const o1 = modalState.addAtom({ x: 318, y: 114, element: 'O', label: 'O' });
        const o2 = modalState.addAtom({ x: 318, y: 186, element: 'O', label: 'O' });
        const me = modalState.addAtom({ x: 356, y: 150, element: 'C', label: 'CH3' });
        modalState.addBond({ atom1: o.id, atom2: s.id, type: 'single' });
        modalState.addBond({ atom1: s.id, atom2: o1.id, type: 'double' });
        modalState.addBond({ atom1: s.id, atom2: o2.id, type: 'double' });
        modalState.addBond({ atom1: s.id, atom2: me.id, type: 'single' });
        modalState.addArrow({ x1: 220, y1: 150, x2: 268, y2: 150, type: 'dashed' });
        return { abbr: '-OMs', formula: 'CH3SO3' };
      }

      if (key === 'TS') {
        const s = modalState.addAtom({ x: 270, y: 150, element: 'S', label: 'S', manualLabel: true });
        const o1 = modalState.addAtom({ x: 270, y: 114, element: 'O', label: 'O' });
        const o2 = modalState.addAtom({ x: 270, y: 186, element: 'O', label: 'O' });
        const c1 = modalState.addAtom({ x: 308, y: 150, element: 'C' });
        const c2 = modalState.addAtom({ x: 327, y: 117, element: 'C' });
        const c3 = modalState.addAtom({ x: 365, y: 117, element: 'C' });
        const c4 = modalState.addAtom({ x: 384, y: 150, element: 'C' });
        const c5 = modalState.addAtom({ x: 365, y: 183, element: 'C' });
        const c6 = modalState.addAtom({ x: 327, y: 183, element: 'C' });
        const me = modalState.addAtom({ x: 422, y: 150, element: 'C', label: 'CH3' });
        modalState.addBond({ atom1: s.id, atom2: o1.id, type: 'double' });
        modalState.addBond({ atom1: s.id, atom2: o2.id, type: 'double' });
        modalState.addBond({ atom1: s.id, atom2: c1.id, type: 'single' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'double' });
        modalState.addBond({ atom1: c2.id, atom2: c3.id, type: 'single' });
        modalState.addBond({ atom1: c3.id, atom2: c4.id, type: 'double' });
        modalState.addBond({ atom1: c4.id, atom2: c5.id, type: 'single' });
        modalState.addBond({ atom1: c5.id, atom2: c6.id, type: 'double' });
        modalState.addBond({ atom1: c6.id, atom2: c1.id, type: 'single' });
        modalState.addBond({ atom1: c4.id, atom2: me.id, type: 'single' });
        modalState.addArrow({ x1: 200, y1: 150, x2: 254, y2: 150, type: 'dashed' });
        return { abbr: 'Ts', formula: 'p-TolSO2' };
      }

      if (key === 'AC') {
        const c1 = modalState.addAtom({ x: 320, y: 150, element: 'C' });
        const o = modalState.addAtom({ x: 320, y: 114, element: 'O', label: 'O' });
        const me = modalState.addAtom({ x: 358, y: 150, element: 'C', label: 'CH3' });
        modalState.addBond({ atom1: c1.id, atom2: o.id, type: 'double' });
        modalState.addBond({ atom1: c1.id, atom2: me.id, type: 'single' });
        modalState.addArrow({ x1: 250, y1: 150, x2: 304, y2: 150, type: 'dashed' });
        return { abbr: 'Ac', formula: 'CH3CO' };
      }

      if (key === 'BN') {
        const ch2 = modalState.addAtom({ x: 270, y: 150, element: 'C', label: 'CH2' });
        const c1 = modalState.addAtom({ x: 308, y: 150, element: 'C' });
        const c2 = modalState.addAtom({ x: 327, y: 117, element: 'C' });
        const c3 = modalState.addAtom({ x: 365, y: 117, element: 'C' });
        const c4 = modalState.addAtom({ x: 384, y: 150, element: 'C' });
        const c5 = modalState.addAtom({ x: 365, y: 183, element: 'C' });
        const c6 = modalState.addAtom({ x: 327, y: 183, element: 'C' });
        modalState.addBond({ atom1: ch2.id, atom2: c1.id, type: 'single' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'double' });
        modalState.addBond({ atom1: c2.id, atom2: c3.id, type: 'single' });
        modalState.addBond({ atom1: c3.id, atom2: c4.id, type: 'double' });
        modalState.addBond({ atom1: c4.id, atom2: c5.id, type: 'single' });
        modalState.addBond({ atom1: c5.id, atom2: c6.id, type: 'double' });
        modalState.addBond({ atom1: c6.id, atom2: c1.id, type: 'single' });
        modalState.addArrow({ x1: 200, y1: 150, x2: 254, y2: 150, type: 'dashed' });
        return { abbr: 'Bn', formula: 'PhCH2' };
      }

      if (key === 'PH') {
        const c1 = modalState.addAtom({ x: 280, y: 150, element: 'C' });
        const c2 = modalState.addAtom({ x: 299, y: 117, element: 'C' });
        const c3 = modalState.addAtom({ x: 337, y: 117, element: 'C' });
        const c4 = modalState.addAtom({ x: 356, y: 150, element: 'C' });
        const c5 = modalState.addAtom({ x: 337, y: 183, element: 'C' });
        const c6 = modalState.addAtom({ x: 299, y: 183, element: 'C' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'double' });
        modalState.addBond({ atom1: c2.id, atom2: c3.id, type: 'single' });
        modalState.addBond({ atom1: c3.id, atom2: c4.id, type: 'double' });
        modalState.addBond({ atom1: c4.id, atom2: c5.id, type: 'single' });
        modalState.addBond({ atom1: c5.id, atom2: c6.id, type: 'double' });
        modalState.addBond({ atom1: c6.id, atom2: c1.id, type: 'single' });
        modalState.addArrow({ x1: 210, y1: 150, x2: 264, y2: 150, type: 'dashed' });
        return { abbr: 'Ph', formula: 'C6H5' };
      }

      if (key === 'TF') {
        const s = modalState.addAtom({ x: 300, y: 150, element: 'S', label: 'S', manualLabel: true });
        const o1 = modalState.addAtom({ x: 300, y: 114, element: 'O', label: 'O' });
        const o2 = modalState.addAtom({ x: 300, y: 186, element: 'O', label: 'O' });
        const c1 = modalState.addAtom({ x: 338, y: 150, element: 'C' });
        const f1 = modalState.addAtom({ x: 366, y: 126, element: 'F', label: 'F' });
        const f2 = modalState.addAtom({ x: 376, y: 150, element: 'F', label: 'F' });
        const f3 = modalState.addAtom({ x: 366, y: 174, element: 'F', label: 'F' });
        modalState.addBond({ atom1: s.id, atom2: o1.id, type: 'double' });
        modalState.addBond({ atom1: s.id, atom2: o2.id, type: 'double' });
        modalState.addBond({ atom1: s.id, atom2: c1.id, type: 'single' });
        modalState.addBond({ atom1: c1.id, atom2: f1.id, type: 'single' });
        modalState.addBond({ atom1: c1.id, atom2: f2.id, type: 'single' });
        modalState.addBond({ atom1: c1.id, atom2: f3.id, type: 'single' });
        modalState.addArrow({ x1: 230, y1: 150, x2: 284, y2: 150, type: 'dashed' });
        return { abbr: 'Tf', formula: 'CF3SO2' };
      }

      if (key === 'BZ') {
        const c1 = modalState.addAtom({ x: 280, y: 150, element: 'C' });
        const o = modalState.addAtom({ x: 280, y: 114, element: 'O', label: 'O' });
        const cPh1 = modalState.addAtom({ x: 318, y: 150, element: 'C' });
        const cPh2 = modalState.addAtom({ x: 337, y: 117, element: 'C' });
        const cPh3 = modalState.addAtom({ x: 375, y: 117, element: 'C' });
        const cPh4 = modalState.addAtom({ x: 394, y: 150, element: 'C' });
        const cPh5 = modalState.addAtom({ x: 375, y: 183, element: 'C' });
        const cPh6 = modalState.addAtom({ x: 337, y: 183, element: 'C' });
        modalState.addBond({ atom1: c1.id, atom2: o.id, type: 'double' });
        modalState.addBond({ atom1: c1.id, atom2: cPh1.id, type: 'single' });
        modalState.addBond({ atom1: cPh1.id, atom2: cPh2.id, type: 'double' });
        modalState.addBond({ atom1: cPh2.id, atom2: cPh3.id, type: 'single' });
        modalState.addBond({ atom1: cPh3.id, atom2: cPh4.id, type: 'double' });
        modalState.addBond({ atom1: cPh4.id, atom2: cPh5.id, type: 'single' });
        modalState.addBond({ atom1: cPh5.id, atom2: cPh6.id, type: 'double' });
        modalState.addBond({ atom1: cPh6.id, atom2: cPh1.id, type: 'single' });
        modalState.addArrow({ x1: 210, y1: 150, x2: 264, y2: 150, type: 'dashed' });
        return { abbr: 'Bz', formula: 'PhCO' };
      }

      if (key === 'BOC') {
        const c1 = modalState.addAtom({ x: 270, y: 150, element: 'C' });
        const o1 = modalState.addAtom({ x: 270, y: 114, element: 'O', label: 'O' });
        const o2 = modalState.addAtom({ x: 308, y: 150, element: 'O', label: 'O' });
        const cQuat = modalState.addAtom({ x: 346, y: 150, element: 'C' });
        const t1 = modalState.addAtom({ x: 374, y: 126, element: 'C', label: 'CH3' });
        const t2 = modalState.addAtom({ x: 384, y: 150, element: 'C', label: 'CH3' });
        const t3 = modalState.addAtom({ x: 374, y: 174, element: 'C', label: 'CH3' });
        modalState.addBond({ atom1: c1.id, atom2: o1.id, type: 'double' });
        modalState.addBond({ atom1: c1.id, atom2: o2.id, type: 'single' });
        modalState.addBond({ atom1: o2.id, atom2: cQuat.id, type: 'single' });
        modalState.addBond({ atom1: cQuat.id, atom2: t1.id, type: 'single' });
        modalState.addBond({ atom1: cQuat.id, atom2: t2.id, type: 'single' });
        modalState.addBond({ atom1: cQuat.id, atom2: t3.id, type: 'single' });
        modalState.addArrow({ x1: 200, y1: 150, x2: 254, y2: 150, type: 'dashed' });
        return { abbr: 'Boc', formula: 't-BuOCO' };
      }

      if (key === 'COOME') {
        const c1 = modalState.addAtom({ x: 300, y: 150, element: 'C' });
        const o1 = modalState.addAtom({ x: 300, y: 114, element: 'O', label: 'O' });
        const o2 = modalState.addAtom({ x: 338, y: 150, element: 'O', label: 'O' });
        const me = modalState.addAtom({ x: 376, y: 150, element: 'C', label: 'CH3' });
        modalState.addBond({ atom1: c1.id, atom2: o1.id, type: 'double' });
        modalState.addBond({ atom1: c1.id, atom2: o2.id, type: 'single' });
        modalState.addBond({ atom1: o2.id, atom2: me.id, type: 'single' });
        modalState.addArrow({ x1: 230, y1: 150, x2: 284, y2: 150, type: 'dashed' });
        return { abbr: 'COOMe', formula: 'CO2CH3' };
      }

      if (key === 'NO2') {
        const n = modalState.addAtom({ x: 310, y: 150, element: 'N', charge: 1, label: 'N+' });
        const o1 = modalState.addAtom({ x: 345, y: 126, element: 'O', label: 'O' });
        const o2 = modalState.addAtom({ x: 345, y: 174, element: 'O', charge: -1, label: 'O-' });
        modalState.addBond({ atom1: n.id, atom2: o1.id, type: 'double' });
        modalState.addBond({ atom1: n.id, atom2: o2.id, type: 'single' });
        modalState.addArrow({ x1: 240, y1: 150, x2: 294, y2: 150, type: 'dashed' });
        return { abbr: 'NO2', formula: 'NO2' };
      }

      return null;
    };

    // Centrar la estructura en el lienzo del modal
    const centerModalStructure = () => {
      const atoms = Array.from(modalState.atoms.values());
      if (atoms.length === 0) {
        modalState.pan = { x: 0, y: 0 };
        modalState.zoom = 1.0;
        modalRenderer.render();
        return;
      }
      const minX = Math.min(...atoms.map(a => a.x));
      const maxX = Math.max(...atoms.map(a => a.x));
      const minY = Math.min(...atoms.map(a => a.y));
      const maxY = Math.max(...atoms.map(a => a.y));
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      
      const rect = modalSvg.getBoundingClientRect();
      const cx = (rect.width || 800) / 2;
      const cy = (rect.height || 500) / 2;
      modalState.pan.x = cx - midX;
      modalState.pan.y = cy - midY;
      modalState.zoom = 1.0;
      modalRenderer.render();
    };

    // Cargar estructura existente si está presente en el ítem, o plantilla inicial
    if (item && item.structure) {
      modalState.loadFromObject(item.structure, false); // abrir no debe ser un paso de deshacer
      setTimeout(centerModalStructure, 50);
    } else if (initialAbbr) {
      const res = loadTemplateData(initialAbbr);
      if (res) {
        setTimeout(centerModalStructure, 50);
      }
    }

    modalRenderer.render();

    // Coordinadas y detección de objetivo en la pizarra del modal
    const getModalCoords = (e) => {
      const rect = modalSvg.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - modalState.pan.x) / modalState.zoom,
        y: (e.clientY - rect.top - modalState.pan.y) / modalState.zoom
      };
    };

    const getModalTargetInfo = (e) => {
      const target = e.target;
      const closest = (s) => target.closest(s);

      if (closest('.rotate-handle')) return { isRotateHandle: true };
      const guideDot = closest('.chair-guide-dot');
      if (guideDot) {
        return { isGuideDot: true, atomId: guideDot.dataset.atomId, guideType: guideDot.dataset.guideType };
      }
      const atomGroup = closest('.chem-atom');
      if (atomGroup) return { type: 'atom', id: atomGroup.dataset.id };

      const bondGroup = closest('.chem-bond');
      if (bondGroup) return { type: 'bond', id: bondGroup.dataset.id };

      // Si el cursor no cae exactamente sobre el dibujo pero un átomo/enlace está resaltado
      // por proximidad, el clic va a ese átomo/enlace (evita crear átomos encimados)
      if (modalSvg.contains(target)) {
        const near = this.findNearestStructureItem(modalState, getModalCoords(e));
        if (near) return near;
      }

      const arrowGroup = closest('.reaction-arrow');
      if (arrowGroup) return { type: 'arrow', id: arrowGroup.dataset.id };

      return null;
    };

    // Eventos interactivos en la pizarra del modal
    let isModalPanning = false;
    let modalPanStart = { x: 0, y: 0 };

    modalSvg.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    modalSvg.addEventListener('mousedown', (e) => {
      if (e.button === 2 || e.button === 1) {
        e.preventDefault();
        isModalPanning = true;
        modalPanStart = { x: e.clientX - modalState.pan.x, y: e.clientY - modalState.pan.y };
        modalSvg.style.cursor = 'grabbing';
        return;
      }

      if (e.button !== 0) return;

      const canvasPos = getModalCoords(e);
      const targetInfo = getModalTargetInfo(e);
      const tool = modalTools[activeModalToolKey];
      if (tool && tool.onMouseDown) {
        tool.onMouseDown(e, canvasPos, targetInfo);
      }
    });

    const handleModalMouseMove = (e) => {
      if (!overlay.parentNode) return;

      if (isModalPanning) {
        modalState.pan.x = e.clientX - modalPanStart.x;
        modalState.pan.y = e.clientY - modalPanStart.y;
        modalRenderer.render();
        return;
      }

      const rect = modalSvg.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const canvasPos = getModalCoords(e);
        const targetInfo = getModalTargetInfo(e);

        let hoveredAtomId = targetInfo && targetInfo.type === 'atom' ? targetInfo.id : null;
        let hoveredBondId = targetInfo && targetInfo.type === 'bond' ? targetInfo.id : null;

        // Detección por proximidad para facilitar la interacción con átomos y enlaces
        if (!hoveredAtomId) {
          let minAtomDist = 18;
          for (const a of modalState.atoms.values()) {
            const d = Math.hypot(canvasPos.x - a.x, canvasPos.y - a.y);
            if (d < minAtomDist) {
              minAtomDist = d;
              hoveredAtomId = a.id;
            }
          }
        }
        if (!hoveredAtomId && !hoveredBondId) {
          let minBondDist = 14;
          for (const b of modalState.bonds.values()) {
            const a1 = modalState.getAtom(b.atom1);
            const a2 = modalState.getAtom(b.atom2);
            if (a1 && a2) {
              const dx = a2.x - a1.x, dy = a2.y - a1.y;
              const lenSq = dx * dx + dy * dy;
              if (lenSq > 0) {
                const t = Math.max(0, Math.min(1, ((canvasPos.x - a1.x) * dx + (canvasPos.y - a1.y) * dy) / lenSq));
                const projX = a1.x + t * dx;
                const projY = a1.y + t * dy;
                const dist = Math.hypot(canvasPos.x - projX, canvasPos.y - projY);
                if (dist < minBondDist) {
                  minBondDist = dist;
                  hoveredBondId = b.id;
                }
              }
            }
          }
        }

        // Redibujar solo cuando cambia el resaltado, para que siga al cursor
        const hoverChanged = modalRenderer.hoveredAtomId !== hoveredAtomId || modalRenderer.hoveredBondId !== hoveredBondId;
        modalRenderer.hoveredAtomId = hoveredAtomId;
        modalRenderer.hoveredBondId = hoveredBondId;
        if (hoverChanged) modalRenderer.render();

        const tool = modalTools[activeModalToolKey];
        if (tool && tool.onMouseMove) {
          tool.onMouseMove(e, canvasPos, targetInfo);
        }
      }
    };

    const handleModalMouseUp = (e) => {
      if (!overlay.parentNode) return;

      if (isModalPanning) {
        isModalPanning = false;
        modalSvg.style.cursor = 'crosshair';
        return;
      }

      const rect = modalSvg.getBoundingClientRect();
      if (e.clientX >= rect.left - 60 && e.clientX <= rect.right + 60 && e.clientY >= rect.top - 60 && e.clientY <= rect.bottom + 60) {
        const canvasPos = getModalCoords(e);
        const targetInfo = getModalTargetInfo(e);
        const tool = modalTools[activeModalToolKey];
        if (tool && tool.onMouseUp) {
          tool.onMouseUp(e, canvasPos, targetInfo);
        }
      }
    };

    window.addEventListener('mousemove', handleModalMouseMove);
    window.addEventListener('mouseup', handleModalMouseUp);

    modalSvg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newZoom = Math.min(Math.max(0.4, modalState.zoom * zoomFactor), 3.0);
      const rect = modalSvg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      modalState.pan.x = mouseX - (mouseX - modalState.pan.x) * (newZoom / modalState.zoom);
      modalState.pan.y = mouseY - (mouseY - modalState.pan.y) * (newZoom / modalState.zoom);
      modalState.zoom = newZoom;
      modalRenderer.render();
    }, { passive: false });

    // Manejador completo de teclado dedicado al modal
    const handleModalKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const key = e.key.toLowerCase();
      const isCtrl = e.ctrlKey || e.metaKey;

      // 1. Borrar selección con Supr / Backspace / Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        modalState.saveSnapshot();
        for (const id of Array.from(modalState.selected.atoms)) modalState.removeAtom(id);
        for (const id of Array.from(modalState.selected.bonds)) modalState.removeBond(id);
        for (const id of Array.from(modalState.selected.arrows)) modalState.removeArrow(id);
        modalState.clearSelection();
        modalRenderer.render();
        return;
      }

      // 2. Deshacer / Rehacer
      if (isCtrl && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) modalState.redo();
        else modalState.undo();
        modalRenderer.render();
        return;
      }
      if (isCtrl && key === 'y') {
        e.preventDefault();
        modalState.redo();
        modalRenderer.render();
        return;
      }

      // 3. Atajos sobre enlaces (ciclar orden con tecla 1, o fijar con 2, 3, 4)
      if (key === '1' || key === '2' || key === '3' || key === '4') {
        if (modalRenderer.hoveredBondId) {
          const b = modalState.bonds.get(modalRenderer.hoveredBondId);
          if (b) {
            e.preventDefault();
            modalState.saveSnapshot();
            if (key === '1') {
              if (b.type === 'single') b.type = 'double';
              else if (b.type === 'double') b.type = 'triple';
              else if (b.type === 'triple') b.type = 'dashed';
              else b.type = 'single';
            } else if (key === '2') b.type = 'double';
            else if (key === '3') b.type = 'triple';
            else if (key === '4') b.type = 'dashed';
            modalState.updateValences();
            modalRenderer.render();
            return;
          }
        }
      }

      // 4. Brotar con tecla 1 sobre átomo (hovered o seleccionado)
      const sproutAtomId = modalRenderer.hoveredAtomId || (modalState.selected.atoms.size === 1 ? Array.from(modalState.selected.atoms)[0] : null);
      if (key === '1' && sproutAtomId && !modalRenderer.hoveredBondId) {
        const a = modalState.getAtom(sproutAtomId);
        if (a) {
          e.preventDefault();
          modalState.saveSnapshot();
          const nextAngle = calculateNextBondAngle(a, modalState);
          const rad = (nextAngle * Math.PI) / 180;
          const newAtom = modalState.addAtom({
            x: a.x + STANDARD_BOND_LENGTH * Math.cos(rad),
            y: a.y + STANDARD_BOND_LENGTH * Math.sin(rad),
            element: 'C'
          });
          modalState.addBond({ atom1: a.id, atom2: newAtom.id, type: modalState.bondType || 'single' });
          modalState.updateValences();
          modalRenderer.render();
          return;
        }
      }

      // 5. Cambiar elemento químico al presionar tecla de elemento
      const elemMap = {
        c: 'C', o: 'O', n: 'N', s: 'S', p: 'P', f: 'F', h: 'H',
        b: 'Br', i: 'I', l: 'Cl', k: 'Si'
      };
      const targetElemAtomId = modalRenderer.hoveredAtomId || (modalState.selected.atoms.size === 1 ? Array.from(modalState.selected.atoms)[0] : null);
      if (elemMap[key] && targetElemAtomId) {
        const a = modalState.getAtom(targetElemAtomId);
        if (a) {
          e.preventDefault();
          modalState.saveSnapshot();
          this.setStructureAtomElement(a, elemMap[key]);
          modalState.updateValences();
          modalRenderer.render();
          return;
        }
      }

      // 6. Atajos de herramientas rápidas
      if (!isCtrl) {
        if (key === 'v' || key === 's') selectModalTool('select');
        else if (key === 'b') selectModalTool('bond', 'single');
        else if (key === '2' && !modalRenderer.hoveredAtomId && !modalRenderer.hoveredBondId) selectModalTool('bond', 'double');
        else if (key === '3' && !modalRenderer.hoveredAtomId && !modalRenderer.hoveredBondId) selectModalTool('bond', 'triple');
        else if ((key === '4' || key === 'p') && !modalRenderer.hoveredAtomId && !modalRenderer.hoveredBondId) selectModalTool('bond', 'dashed');
        else if (key === 'e') selectModalTool('eraser');
        else if (key === 'u') selectModalTool('arrow', 'dashed');
        else if (key === 'a') selectModalTool('arrow', 'normal');
      }

      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);

    // Barra de herramientas del modal
    overlay.querySelectorAll('.modal-tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        selectModalTool(btn.dataset.tool, btn.dataset.sub);
      });
    });

    // Barra de elementos atómicos del modal (C, Si, O, N, S, etc.)
    overlay.querySelectorAll('.modal-elem-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        selectModalElement(btn.dataset.elem);
      });
    });

    // Botones de acción del lienzo (Deshacer, Rehacer, Centrar, Limpiar)
    overlay.querySelector('#modal-btn-undo')?.addEventListener('click', (e) => {
      e.preventDefault();
      modalState.undo();
      modalRenderer.render();
    });

    overlay.querySelector('#modal-btn-redo')?.addEventListener('click', (e) => {
      e.preventDefault();
      modalState.redo();
      modalRenderer.render();
    });

    overlay.querySelector('#modal-btn-center')?.addEventListener('click', (e) => {
      e.preventDefault();
      centerModalStructure();
    });

    overlay.querySelector('#modal-btn-clear')?.addEventListener('click', (e) => {
      e.preventDefault();
      modalState.clearAll(); // clearAll ya guarda su propio paso de deshacer
      modalRenderer.render();
    });

    // Botones de plantilla IChO
    overlay.querySelectorAll('.modal-template-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const abbr = btn.dataset.abbr;
        const res = loadTemplateData(abbr);
        if (res) {
          abbrInput.value = res.abbr;
          if (formulaInput) formulaInput.value = res.formula;
        } else {
          abbrInput.value = abbr;
          if (formulaInput) formulaInput.value = btn.dataset.formula;
        }
        setTimeout(centerModalStructure, 30);
      });
    });

    // Copiar la selección o moléculas del lienzo principal
    overlay.querySelector('#modal-struct-capture-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      const selAtomIds = Array.from(this.state.selected.atoms);
      const atomsToUse = selAtomIds.length > 0 
        ? selAtomIds.map(id => this.state.getAtom(id)).filter(Boolean)
        : Array.from(this.state.atoms.values());

      if (atomsToUse.length === 0) {
        showToast('No hay moléculas en el lienzo principal para copiar. Dibuja primero en la pizarra principal.');
        return;
      }

      modalState.clearAll(); // clearAll ya guarda su propio paso de deshacer
      const atomIdMap = new Map();
      for (const a of atomsToUse) {
        const newA = modalState.addAtom({
          x: a.x,
          y: a.y,
          element: a.element,
          charge: a.charge,
          lonePairs: a.lonePairs,
          label: a.label,
          manualLabel: a.manualLabel
        });
        atomIdMap.set(a.id, newA.id);
      }

      for (const b of this.state.bonds.values()) {
        if (atomIdMap.has(b.atom1) && atomIdMap.has(b.atom2)) {
          modalState.addBond({
            atom1: atomIdMap.get(b.atom1),
            atom2: atomIdMap.get(b.atom2),
            type: b.type
          });
        }
      }

      setTimeout(centerModalStructure, 30);
    });

    const closeModal = () => {
      window.removeEventListener('keydown', handleModalKeyDown);
      window.removeEventListener('mousemove', handleModalMouseMove);
      window.removeEventListener('mouseup', handleModalMouseUp);
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };

    overlay.querySelector('#modal-struct-cancel')?.addEventListener('click', closeModal);

    overlay.querySelector('#modal-struct-save')?.addEventListener('click', () => {
      const newAbbr = abbrInput.value.trim();
      const newFormula = formulaInput ? formulaInput.value.trim() : '';
      if (!newAbbr) {
        showToast('Por favor introduce un símbolo o nombre para la abreviatura (ej. TBS, -OMs, Ac).');
        return;
      }
      this.state.saveSnapshot();
      const serializedStructure = ChemSerializer.serialize(modalState);

      if (isNew) {
        if (!box.items) box.items = [];
        box.items.push({
          abbr: newAbbr,
          formula: newFormula || '',
          structure: serializedStructure
        });
      } else {
        item.abbr = newAbbr;
        item.formula = newFormula || '';
        item.structure = serializedStructure;
      }
      this.renderer.render();
      this.renderBoxItemsList(box);
      closeModal();
    });
  }

  openArrowStructureModal(arrow) {
    if (!arrow) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay chemstudio-modal-overlay';
    
    const reactionTemplates = [
      { name: '1,3-Butadieno', key: 'BUTADIENE', desc: 'Dieno s-cis clásico para Diels-Alder' },
      { name: 'Ciclopentadieno', key: 'CYCLOPENTADIENE', desc: 'Dieno cíclico altamente reactivo' },
      { name: 'Anhídrido Maleico', key: 'MALEIC_ANHYDRIDE', desc: 'Dienófilo clásico activado' },
      { name: 'Acroleína', key: 'ACROLEIN', desc: 'Dienófilo carbonílico α,β-insaturado' },
      { name: 'Etileno', key: 'ETHYLENE', desc: 'Alqueno simple CH2=CH2' },
      { name: 'Acetileno', key: 'ACETYLENE', desc: 'Alquino simple HC≡CH' },
      { name: 'Benceno', key: 'BENZENE', desc: 'Anillo aromático conjugado' },
      { name: 'Furano', key: 'FURAN', desc: 'Heterociclo oxigenado diénico' }
    ];

    const isDark = Boolean(this.state && this.state.isDarkMode);

    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); padding: 12px;';

    overlay.innerHTML = `
      <div class="modal-card modal-chemstudio-subwindow" style="width: 96vw; max-width: 1440px; height: 92vh; display: flex; flex-direction: column; background: ${isDark ? '#090d16' : '#ffffff'}; color: ${isDark ? '#f8fafc' : '#0f172a'}; border: 1px solid ${isDark ? '#1e293b' : '#cbd5e1'}; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); overflow: hidden; padding: 0;">
        
        <!-- Encabezado Superior Chem Studio -->
        <header class="header" style="height: auto; min-height: 48px; flex-shrink: 0; flex-wrap: wrap; gap: 6px 12px; border-bottom: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; background: ${isDark ? '#0f172a' : '#ffffff'}; display: flex; align-items: center; justify-content: space-between; padding: 6px 16px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span class="logo" style="font-size: 15px; font-weight: bold; color: ${isDark ? '#60a5fa' : '#2563eb'}; display: flex; align-items: center; gap: 6px;">
              ⬡ Chem Studio <span style="font-size: 12px; font-weight: normal; color: ${isDark ? '#94a3b8' : '#64748b'};">| Reactivo / Molécula sobre Flecha (ej. Diels-Alder)</span>
            </span>
            <div style="display: flex; align-items: center; gap: 8px; background: ${isDark ? '#1e293b' : '#f1f5f9'}; padding: 3px 10px; border-radius: 6px; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
              <span style="font-size: 11px; font-weight: bold; color: ${isDark ? '#60a5fa' : '#2563eb'};">➔ Flecha Seleccionada</span>
              <span style="font-size: 11px; color: ${isDark ? '#94a3b8' : '#64748b'};">Molécula se colocará en el centro superior del eje</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-sm" id="modal-arrow-undo" title="Deshacer (Ctrl+Z)">↶ Deshacer</button>
            <button class="btn btn-sm" id="modal-arrow-redo" title="Rehacer (Ctrl+Y)">↷ Rehacer</button>
            <button class="btn btn-sm" id="modal-arrow-center" title="Centrar estructura en la pizarra">⇥ Centrar</button>
            <button class="btn btn-sm" id="modal-arrow-clear" title="Limpiar pizarra">🗑 Limpiar</button>
            <div style="width: 1px; height: 24px; background: ${isDark ? '#334155' : '#e2e8f0'}; margin: 0 4px;"></div>
            <button class="btn btn-sm" id="modal-arrow-cancel">✕ Cancelar</button>
            <button class="btn btn-sm btn-primary" id="modal-arrow-save" style="font-weight: bold; background: #2563eb; color: #ffffff; padding: 5px 16px; font-size: 13px;">💾 Guardar Molécula en Flecha</button>
          </div>
        </header>

        <!-- Sub-workspace: Toolbar Left + Canvas Central + Sidebar Right -->
        <div style="display: flex; flex: 1; min-height: 0; position: relative; overflow: hidden;">
          
          <!-- Toolbar Left -->
          <aside class="toolbar-left" style="width: 54px; border-right: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; background: ${isDark ? '#0f172a' : '#f8fafc'}; display: flex; flex-direction: column; align-items: center; padding: 8px 0; gap: 4px; overflow-y: auto;">
            <button class="tool-btn modal-tool-btn active" data-tool="select" title="Seleccionar y Desplazar (V) [Supr/Backspace para borrar]">
              <span class="tool-icon">↖</span>
              <span class="tool-shortcut">V</span>
            </button>
            
            <div class="tool-sep" style="width: 32px; height: 1px; background: ${isDark ? '#334155' : '#cbd5e1'}; margin: 3px 0;"></div>

            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="single" title="Enlace Simple (Tecla 1)">
              <span class="tool-icon">╱</span>
              <span class="tool-shortcut">1</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="double" title="Enlace Doble (Tecla 2)">
              <span class="tool-icon">═</span>
              <span class="tool-shortcut">2</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="triple" title="Enlace Triple (Tecla 3)">
              <span class="tool-icon">≡</span>
              <span class="tool-shortcut">3</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="wedge" title="Cuña Sólida (Up)">
              <span class="tool-icon">▲</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="bond" data-sub="dash" title="Cuña a Trazos (Down)">
              <span class="tool-icon">▤</span>
            </button>

            <div class="tool-sep" style="width: 32px; height: 1px; background: ${isDark ? '#334155' : '#cbd5e1'}; margin: 3px 0;"></div>

            <button class="tool-btn modal-tool-btn" data-tool="template" data-sub="BENZENE" title="Anillo de Benceno">
              <span class="tool-icon">⌬</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="template" data-sub="CYCLOHEXANE" title="Ciclohexano">
              <span class="tool-icon">⬡</span>
            </button>
            <button class="tool-btn modal-tool-btn" data-tool="template" data-sub="CYCLOPENTANE" title="Ciclopentano">
              <span class="tool-icon">⬠</span>
            </button>

            <div class="tool-sep" style="width: 32px; height: 1px; background: ${isDark ? '#334155' : '#cbd5e1'}; margin: 3px 0;"></div>

            <button class="tool-btn modal-tool-btn" data-tool="eraser" title="Borrador: haz clic o arrastra sobre átomos o enlaces para borrarlos (Supr / Del)">
              <span class="tool-icon">⌫</span>
              <span class="tool-shortcut">Del</span>
            </button>
          </aside>

          <!-- Center Canvas Area -->
          <div id="modal-arrow-chem-canvas-container" style="flex: 1; height: 100%; position: relative; background: ${isDark ? '#090d16' : '#ffffff'}; overflow: hidden; cursor: crosshair;">
            <svg id="modal-arrow-chem-svg" width="100%" height="100%" style="display: block; width: 100%; height: 100%;"></svg>
            <div style="position: absolute; bottom: 10px; left: 14px; font-size: 11px; color: ${isDark ? '#94a3b8' : '#64748b'}; pointer-events: none; background: ${isDark ? 'rgba(15,23,42,0.88)' : 'rgba(255,255,255,0.9)'}; padding: 4px 10px; border-radius: 5px; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
              Atajos ChemStudio: <b>1</b> Ciclar enlace / Brotar C · <b>2</b> Doble enlace · <b>Supr / Backspace</b> Borrar selección · <b>⌫</b> Borrador arrastrable · <b>Clic der</b> Pan · <b>Rueda</b> Zoom
            </div>
          </div>

          <!-- Right Sidebar -->
          <aside style="width: 260px; border-left: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; background: ${isDark ? '#0f172a' : '#f8fafc'}; padding: 12px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto;">
            
            <div>
              <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${isDark ? '#94a3b8' : '#64748b'}; margin-bottom: 6px; letter-spacing: 0.5px;">
                Átomos y Elementos
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
                ${['C', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I', 'H', 'Si'].map(el => `
                  <button class="btn btn-sm modal-elem-btn ${el === 'C' ? 'active' : ''}" data-elem="${el}" style="font-weight: bold; justify-content: center; ${el === 'C' ? 'background: #2563eb; color: #ffffff; border-color: #2563eb;' : ''}">
                    ${el}
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${isDark ? '#94a3b8' : '#64748b'}; letter-spacing: 0.5px;">
                  Reactivos Diels-Alder
                </span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${reactionTemplates.map(t => `
                  <button class="btn btn-sm btn-outline modal-reaction-template-btn" data-key="${t.key}" style="font-size: 11px; font-weight: 600; padding: 5px 8px; justify-content: flex-start; text-align: left;" title="${t.desc}">
                    <span style="color: ${isDark ? '#60a5fa' : '#2563eb'}; margin-right: 6px;">⬡</span> ${t.name}
                  </button>
                `).join('')}
              </div>
            </div>

            <div style="border-top: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; padding-top: 10px; display: flex; flex-direction: column; gap: 6px;">
              <button id="modal-arrow-capture-btn" class="btn btn-sm btn-primary" style="width: 100%; justify-content: center; font-size: 11px; padding: 6px;" title="Copiar la molécula seleccionada del lienzo principal a esta pizarra">
                📥 Copiar Selección del Lienzo
              </button>
              <button id="modal-arrow-delete-btn" class="btn btn-sm btn-outline" style="width: 100%; justify-content: center; font-size: 11px; padding: 5px; color: #ef4444;" title="Eliminar completamente la molécula de la flecha">
                🗑️ Quitar Molécula de la Flecha
              </button>
            </div>

            <div style="background: ${isDark ? '#1e293b' : '#f1f5f9'}; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 6px; padding: 8px; font-size: 11px; color: ${isDark ? '#cbd5e1' : '#475569'}; line-height: 1.4; margin-top: auto;">
              <strong style="color: ${isDark ? '#60a5fa' : '#2563eb'};">💡 Reactivo sobre la Flecha:</strong><br/>
              Al hacer clic en <b>Guardar Molécula en Flecha</b>, esta estructura se dibujará vectorialmente arriba de la flecha. La longitud de la flecha se adaptará automáticamente para evitar colisiones.
            </div>

          </aside>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const modalSvg = overlay.querySelector('#modal-arrow-chem-svg');

    const modalState = new ChemState();
    modalState.isDarkMode = isDark;
    modalState.bondType = 'single';
    modalState.activeElement = 'C';
    modalState.currentTool = 'select';
    modalState.pan = { x: 0, y: 0 };
    modalState.zoom = 1.0;

    const modalRenderer = new SvgRenderer(modalSvg, modalState);

    const modalTools = {
      select: new SelectTool(modalState, modalRenderer),
      bond: new BondTool(modalState, modalRenderer),
      template: new TemplateTool(modalState, modalRenderer),
      arrow: new ArrowTool(modalState, modalRenderer),
      eraser: new EraserTool(modalState, modalRenderer)
    };

    let activeModalToolKey = 'select';

    const selectModalTool = (tool, sub = null) => {
      activeModalToolKey = tool;
      modalState.currentTool = tool;
      overlay.querySelectorAll('.modal-tool-btn').forEach(b => {
        const matchTool = b.dataset.tool === tool;
        const matchSub = !sub || String(b.dataset.sub).toUpperCase() === String(sub).toUpperCase();
        b.classList.toggle('active', matchTool && matchSub);
      });
      if (tool === 'bond' && sub) {
        modalState.bondType = sub;
        if (modalState.selected.bonds.size > 0) {
          modalState.saveSnapshot();
          for (const bId of modalState.selected.bonds) {
            const b = modalState.bonds.get(bId);
            if (b) b.type = sub;
          }
          modalState.updateValences();
          modalRenderer.render();
        }
      } else if (tool === 'template' && sub) {
        modalTools.template.setTemplate(String(sub).toUpperCase());
      }
    };

    const selectModalElement = (elem) => {
      modalState.activeElement = elem;
      overlay.querySelectorAll('.modal-elem-btn').forEach(b => {
        const isActive = b.dataset.elem === elem;
        b.classList.toggle('active', isActive);
        b.style.background = isActive ? '#2563eb' : '';
        b.style.color = isActive ? '#ffffff' : '';
        b.style.borderColor = isActive ? '#2563eb' : '';
      });
      if (modalState.selected.atoms.size > 0) {
        modalState.saveSnapshot();
        for (const id of modalState.selected.atoms) {
          const a = modalState.getAtom(id);
          if (a) this.setStructureAtomElement(a, elem);
        }
        modalState.updateValences();
        modalRenderer.render();
      }
    };

    const loadReactionTemplate = (key) => {
      modalState.clearAll(); // clearAll ya guarda su propio paso de deshacer
      const k = String(key || '').trim().toUpperCase();

      if (k === 'BUTADIENE') {
        const c1 = modalState.addAtom({ x: 305, y: 145, element: 'C' });
        const c2 = modalState.addAtom({ x: 338, y: 164, element: 'C' });
        const c3 = modalState.addAtom({ x: 338, y: 202, element: 'C' });
        const c4 = modalState.addAtom({ x: 305, y: 221, element: 'C' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'double' });
        modalState.addBond({ atom1: c2.id, atom2: c3.id, type: 'single' });
        modalState.addBond({ atom1: c3.id, atom2: c4.id, type: 'double' });
      } else if (k === 'CYCLOPENTADIENE') {
        const c5 = modalState.addAtom({ x: 330, y: 140, element: 'C' });
        const c1 = modalState.addAtom({ x: 362, y: 163, element: 'C' });
        const c2 = modalState.addAtom({ x: 350, y: 201, element: 'C' });
        const c3 = modalState.addAtom({ x: 310, y: 201, element: 'C' });
        const c4 = modalState.addAtom({ x: 298, y: 163, element: 'C' });
        modalState.addBond({ atom1: c5.id, atom2: c1.id, type: 'single' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'double' });
        modalState.addBond({ atom1: c2.id, atom2: c3.id, type: 'single' });
        modalState.addBond({ atom1: c3.id, atom2: c4.id, type: 'double' });
        modalState.addBond({ atom1: c4.id, atom2: c5.id, type: 'single' });
      } else if (k === 'MALEIC_ANHYDRIDE') {
        const oApex = modalState.addAtom({ x: 330, y: 138, element: 'O', label: 'O' });
        const c1 = modalState.addAtom({ x: 362, y: 161, element: 'C' });
        const o1 = modalState.addAtom({ x: 396, y: 154, element: 'O', label: 'O' });
        const c2 = modalState.addAtom({ x: 350, y: 199, element: 'C' });
        const c3 = modalState.addAtom({ x: 310, y: 199, element: 'C' });
        const c4 = modalState.addAtom({ x: 298, y: 161, element: 'C' });
        const o2 = modalState.addAtom({ x: 264, y: 154, element: 'O', label: 'O' });
        modalState.addBond({ atom1: oApex.id, atom2: c1.id, type: 'single' });
        modalState.addBond({ atom1: c1.id, atom2: o1.id, type: 'double' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'single' });
        modalState.addBond({ atom1: c2.id, atom2: c3.id, type: 'double' });
        modalState.addBond({ atom1: c3.id, atom2: c4.id, type: 'single' });
        modalState.addBond({ atom1: c4.id, atom2: o2.id, type: 'double' });
        modalState.addBond({ atom1: c4.id, atom2: oApex.id, type: 'single' });
      } else if (k === 'ACROLEIN') {
        const c1 = modalState.addAtom({ x: 290, y: 185, element: 'C' });
        const c2 = modalState.addAtom({ x: 323, y: 166, element: 'C' });
        const c3 = modalState.addAtom({ x: 356, y: 185, element: 'C' });
        const o = modalState.addAtom({ x: 356, y: 223, element: 'O', label: 'O' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'double' });
        modalState.addBond({ atom1: c2.id, atom2: c3.id, type: 'single' });
        modalState.addBond({ atom1: c3.id, atom2: o.id, type: 'double' });
      } else if (k === 'ETHYLENE') {
        const c1 = modalState.addAtom({ x: 311, y: 175, element: 'C' });
        const c2 = modalState.addAtom({ x: 349, y: 175, element: 'C' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'double' });
      } else if (k === 'ACETYLENE') {
        const c1 = modalState.addAtom({ x: 311, y: 175, element: 'C' });
        const c2 = modalState.addAtom({ x: 349, y: 175, element: 'C' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'triple' });
      } else if (k === 'BENZENE') {
        const c1 = modalState.addAtom({ x: 330, y: 137, element: 'C' });
        const c2 = modalState.addAtom({ x: 363, y: 156, element: 'C' });
        const c3 = modalState.addAtom({ x: 363, y: 194, element: 'C' });
        const c4 = modalState.addAtom({ x: 330, y: 213, element: 'C' });
        const c5 = modalState.addAtom({ x: 297, y: 194, element: 'C' });
        const c6 = modalState.addAtom({ x: 297, y: 156, element: 'C' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'double' });
        modalState.addBond({ atom1: c2.id, atom2: c3.id, type: 'single' });
        modalState.addBond({ atom1: c3.id, atom2: c4.id, type: 'double' });
        modalState.addBond({ atom1: c4.id, atom2: c5.id, type: 'single' });
        modalState.addBond({ atom1: c5.id, atom2: c6.id, type: 'double' });
        modalState.addBond({ atom1: c6.id, atom2: c1.id, type: 'single' });
      } else if (k === 'FURAN') {
        const o = modalState.addAtom({ x: 330, y: 140, element: 'O', label: 'O' });
        const c1 = modalState.addAtom({ x: 362, y: 163, element: 'C' });
        const c2 = modalState.addAtom({ x: 350, y: 201, element: 'C' });
        const c3 = modalState.addAtom({ x: 310, y: 201, element: 'C' });
        const c4 = modalState.addAtom({ x: 298, y: 163, element: 'C' });
        modalState.addBond({ atom1: o.id, atom2: c1.id, type: 'single' });
        modalState.addBond({ atom1: c1.id, atom2: c2.id, type: 'double' });
        modalState.addBond({ atom1: c2.id, atom2: c3.id, type: 'single' });
        modalState.addBond({ atom1: c3.id, atom2: c4.id, type: 'double' });
        modalState.addBond({ atom1: c4.id, atom2: o.id, type: 'single' });
      }
      modalState.updateValences();
      modalRenderer.render();
      setTimeout(centerModalStructure, 30);
    };

    const centerModalStructure = () => {
      const atoms = Array.from(modalState.atoms.values());
      if (atoms.length === 0) {
        modalState.pan = { x: 0, y: 0 };
        modalState.zoom = 1.0;
        modalRenderer.render();
        return;
      }
      const minX = Math.min(...atoms.map(a => a.x));
      const maxX = Math.max(...atoms.map(a => a.x));
      const minY = Math.min(...atoms.map(a => a.y));
      const maxY = Math.max(...atoms.map(a => a.y));
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      
      const rect = modalSvg.getBoundingClientRect();
      const cx = (rect.width || 800) / 2;
      const cy = (rect.height || 500) / 2;
      modalState.pan.x = cx - midX;
      modalState.pan.y = cy - midY;
      modalState.zoom = 1.0;
      modalRenderer.render();
    };

    // Cargar estructura existente en la flecha si la tiene
    if (arrow.structureTop) {
      modalState.loadFromObject(arrow.structureTop, false); // abrir no debe ser un paso de deshacer
      setTimeout(centerModalStructure, 50);
    }

    modalRenderer.render();

    const getModalCoords = (e) => {
      const rect = modalSvg.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - modalState.pan.x) / modalState.zoom,
        y: (e.clientY - rect.top - modalState.pan.y) / modalState.zoom
      };
    };

    const getModalTargetInfo = (e) => {
      const target = e.target;
      const closest = (s) => target.closest(s);

      if (closest('.rotate-handle')) return { isRotateHandle: true };
      const guideDot = closest('.chair-guide-dot');
      if (guideDot) {
        return { isGuideDot: true, atomId: guideDot.dataset.atomId, guideType: guideDot.dataset.guideType };
      }
      const atomGroup = closest('.chem-atom');
      if (atomGroup) return { type: 'atom', id: atomGroup.dataset.id };

      const bondGroup = closest('.chem-bond');
      if (bondGroup) return { type: 'bond', id: bondGroup.dataset.id };

      // Si el cursor no cae exactamente sobre el dibujo pero un átomo/enlace está resaltado
      // por proximidad, el clic va a ese átomo/enlace (evita crear átomos encimados)
      if (modalSvg.contains(target)) {
        const near = this.findNearestStructureItem(modalState, getModalCoords(e));
        if (near) return near;
      }

      return null;
    };

    let isModalPanning = false;
    let modalPanStart = { x: 0, y: 0 };

    modalSvg.addEventListener('contextmenu', (e) => e.preventDefault());

    modalSvg.addEventListener('mousedown', (e) => {
      if (e.button === 2 || e.button === 1) {
        e.preventDefault();
        isModalPanning = true;
        modalPanStart = { x: e.clientX - modalState.pan.x, y: e.clientY - modalState.pan.y };
        modalSvg.style.cursor = 'grabbing';
        return;
      }

      if (e.button !== 0) return;

      const canvasPos = getModalCoords(e);
      const targetInfo = getModalTargetInfo(e);
      const tool = modalTools[activeModalToolKey];
      if (tool && tool.onMouseDown) {
        tool.onMouseDown(e, canvasPos, targetInfo);
      }
    });

    const handleModalMouseMove = (e) => {
      if (!overlay.parentNode) return;

      if (isModalPanning) {
        modalState.pan.x = e.clientX - modalPanStart.x;
        modalState.pan.y = e.clientY - modalPanStart.y;
        modalRenderer.render();
        return;
      }

      const rect = modalSvg.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const canvasPos = getModalCoords(e);
        const targetInfo = getModalTargetInfo(e);

        let hoveredAtomId = targetInfo && targetInfo.type === 'atom' ? targetInfo.id : null;
        let hoveredBondId = targetInfo && targetInfo.type === 'bond' ? targetInfo.id : null;

        if (!hoveredAtomId) {
          let minAtomDist = 18;
          for (const a of modalState.atoms.values()) {
            const d = Math.hypot(canvasPos.x - a.x, canvasPos.y - a.y);
            if (d < minAtomDist) {
              minAtomDist = d;
              hoveredAtomId = a.id;
            }
          }
        }
        if (!hoveredAtomId && !hoveredBondId) {
          let minBondDist = 14;
          for (const b of modalState.bonds.values()) {
            const a1 = modalState.getAtom(b.atom1);
            const a2 = modalState.getAtom(b.atom2);
            if (a1 && a2) {
              const dx = a2.x - a1.x, dy = a2.y - a1.y;
              const lenSq = dx * dx + dy * dy;
              if (lenSq > 0) {
                const t = Math.max(0, Math.min(1, ((canvasPos.x - a1.x) * dx + (canvasPos.y - a1.y) * dy) / lenSq));
                const projX = a1.x + t * dx;
                const projY = a1.y + t * dy;
                const dist = Math.hypot(canvasPos.x - projX, canvasPos.y - projY);
                if (dist < minBondDist) {
                  minBondDist = dist;
                  hoveredBondId = b.id;
                }
              }
            }
          }
        }

        // Redibujar solo cuando cambia el resaltado, para que siga al cursor
        const hoverChanged = modalRenderer.hoveredAtomId !== hoveredAtomId || modalRenderer.hoveredBondId !== hoveredBondId;
        modalRenderer.hoveredAtomId = hoveredAtomId;
        modalRenderer.hoveredBondId = hoveredBondId;
        if (hoverChanged) modalRenderer.render();

        const tool = modalTools[activeModalToolKey];
        if (tool && tool.onMouseMove) {
          tool.onMouseMove(e, canvasPos, targetInfo);
        }
      }
    };

    const handleModalMouseUp = (e) => {
      if (!overlay.parentNode) return;

      if (isModalPanning) {
        isModalPanning = false;
        modalSvg.style.cursor = 'crosshair';
        return;
      }

      const canvasPos = getModalCoords(e);
      const targetInfo = getModalTargetInfo(e);
      const tool = modalTools[activeModalToolKey];
      if (tool && tool.onMouseUp) {
        tool.onMouseUp(e, canvasPos, targetInfo);
      }
    };

    window.addEventListener('mousemove', handleModalMouseMove);
    window.addEventListener('mouseup', handleModalMouseUp);

    modalSvg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      const mouse = { x: e.clientX, y: e.clientY };
      const rect = modalSvg.getBoundingClientRect();
      const mouseX = mouse.x - rect.left;
      const mouseY = mouse.y - rect.top;
      
      const newZoom = Math.min(3.5, Math.max(0.3, modalState.zoom * zoomFactor));
      modalState.pan.x = mouseX - (mouseX - modalState.pan.x) * (newZoom / modalState.zoom);
      modalState.pan.y = mouseY - (mouseY - modalState.pan.y) * (newZoom / modalState.zoom);
      modalState.zoom = newZoom;
      modalRenderer.render();
    }, { passive: false });

    const handleModalKeyDown = (e) => {
      if (!overlay.parentNode) return;
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const isCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (isCtrl && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        modalState.undo();
        modalRenderer.render();
        return;
      }
      if (isCtrl && (key === 'y' || (key === 'z' && e.shiftKey))) {
        e.preventDefault();
        modalState.redo();
        modalRenderer.render();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (modalState.selected.atoms.size > 0 || modalState.selected.bonds.size > 0) {
          modalState.saveSnapshot();
          for (const bId of modalState.selected.bonds) modalState.removeBond(bId);
          for (const aId of modalState.selected.atoms) modalState.removeAtom(aId);
          modalState.clearSelection();
          modalState.updateValences();
          modalRenderer.render();
          return;
        }
      }

      if (modalRenderer.hoveredBondId) {
        const bond = modalState.bonds.get(modalRenderer.hoveredBondId);
        if (bond) {
          let newType = null;
          if (key === '1') newType = 'single';
          else if (key === '2') newType = 'double';
          else if (key === '3') newType = 'triple';
          else if (key === '4' || key === 'p') newType = 'dashed';
          if (newType) {
            e.preventDefault();
            modalState.saveSnapshot();
            bond.type = newType;
            modalState.updateValences();
            modalRenderer.render();
            return;
          }
        }
      }

      const sproutAtomId = modalRenderer.hoveredAtomId || (modalState.selected.atoms.size === 1 ? Array.from(modalState.selected.atoms)[0] : null);
      if (key === '1' && sproutAtomId && !modalRenderer.hoveredBondId) {
        const a = modalState.getAtom(sproutAtomId);
        if (a) {
          e.preventDefault();
          modalState.saveSnapshot();
          const nextAngle = calculateNextBondAngle(a, modalState);
          const rad = (nextAngle * Math.PI) / 180;
          const newAtom = modalState.addAtom({
            x: a.x + STANDARD_BOND_LENGTH * Math.cos(rad),
            y: a.y + STANDARD_BOND_LENGTH * Math.sin(rad),
            element: 'C'
          });
          modalState.addBond({ atom1: a.id, atom2: newAtom.id, type: modalState.bondType || 'single' });
          modalState.updateValences();
          modalRenderer.render();
          return;
        }
      }

      const elemMap = {
        c: 'C', o: 'O', n: 'N', s: 'S', p: 'P', f: 'F', h: 'H',
        b: 'Br', i: 'I', l: 'Cl', k: 'Si'
      };
      const targetElemAtomId = modalRenderer.hoveredAtomId || (modalState.selected.atoms.size === 1 ? Array.from(modalState.selected.atoms)[0] : null);
      if (elemMap[key] && targetElemAtomId) {
        const a = modalState.getAtom(targetElemAtomId);
        if (a) {
          e.preventDefault();
          modalState.saveSnapshot();
          this.setStructureAtomElement(a, elemMap[key]);
          modalState.updateValences();
          modalRenderer.render();
          return;
        }
      }

      if (!isCtrl) {
        if (key === 'v' || key === 's') selectModalTool('select');
        else if (key === 'b') selectModalTool('bond', 'single');
        else if (key === '2' && !modalRenderer.hoveredAtomId && !modalRenderer.hoveredBondId) selectModalTool('bond', 'double');
        else if (key === '3' && !modalRenderer.hoveredAtomId && !modalRenderer.hoveredBondId) selectModalTool('bond', 'triple');
        else if (key === 'e') selectModalTool('eraser');
      }

      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);

    overlay.querySelectorAll('.modal-tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        selectModalTool(btn.dataset.tool, btn.dataset.sub);
      });
    });

    overlay.querySelectorAll('.modal-elem-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        selectModalElement(btn.dataset.elem);
      });
    });

    overlay.querySelector('#modal-arrow-undo')?.addEventListener('click', (e) => {
      e.preventDefault();
      modalState.undo();
      modalRenderer.render();
    });

    overlay.querySelector('#modal-arrow-redo')?.addEventListener('click', (e) => {
      e.preventDefault();
      modalState.redo();
      modalRenderer.render();
    });

    overlay.querySelector('#modal-arrow-center')?.addEventListener('click', (e) => {
      e.preventDefault();
      centerModalStructure();
    });

    overlay.querySelector('#modal-arrow-clear')?.addEventListener('click', (e) => {
      e.preventDefault();
      modalState.clearAll(); // clearAll ya guarda su propio paso de deshacer
      modalRenderer.render();
    });

    overlay.querySelectorAll('.modal-reaction-template-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        loadReactionTemplate(btn.dataset.key);
      });
    });

    overlay.querySelector('#modal-arrow-capture-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      const selAtomIds = Array.from(this.state.selected.atoms);
      const atomsToUse = selAtomIds.length > 0 
        ? selAtomIds.map(id => this.state.getAtom(id)).filter(Boolean)
        : Array.from(this.state.atoms.values());

      if (atomsToUse.length === 0) {
        showToast('No hay moléculas en el lienzo principal para copiar. Dibuja primero en la pizarra principal.');
        return;
      }

      modalState.clearAll(); // clearAll ya guarda su propio paso de deshacer
      const atomIdMap = new Map();
      for (const a of atomsToUse) {
        const newA = modalState.addAtom({
          x: a.x,
          y: a.y,
          element: a.element,
          charge: a.charge,
          lonePairs: a.lonePairs,
          label: a.label,
          manualLabel: a.manualLabel
        });
        atomIdMap.set(a.id, newA.id);
      }

      for (const b of this.state.bonds.values()) {
        if (atomIdMap.has(b.atom1) && atomIdMap.has(b.atom2)) {
          modalState.addBond({
            atom1: atomIdMap.get(b.atom1),
            atom2: atomIdMap.get(b.atom2),
            type: b.type
          });
        }
      }

      setTimeout(centerModalStructure, 30);
    });

    overlay.querySelector('#modal-arrow-delete-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      askConfirm('¿Eliminar la molécula sobre la flecha?', () => {
        this.state.saveSnapshot();
        arrow.structureTop = null;
        this.renderer.render();
        this.updateInspectors();
        closeModal();
      }, 'Eliminar');
    });

    const closeModal = () => {
      window.removeEventListener('keydown', handleModalKeyDown);
      window.removeEventListener('mousemove', handleModalMouseMove);
      window.removeEventListener('mouseup', handleModalMouseUp);
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };

    overlay.querySelector('#modal-arrow-cancel')?.addEventListener('click', closeModal);

    overlay.querySelector('#modal-arrow-save')?.addEventListener('click', () => {
      this.state.saveSnapshot();
      const atoms = Array.from(modalState.atoms.values());
      if (atoms.length === 0) {
        arrow.structureTop = null;
      } else {
        arrow.structureTop = ChemSerializer.serialize(modalState);
      }
      this.renderer.render();
      this.updateInspectors();
      closeModal();
    });
  }

  showArrowInspector(arrow) {
    this.updateInspectors();
    document.getElementById('arrow-reagents-top')?.focus();
  }

  openPeriodicTableModal() {
    const isDark = Boolean(this.state && this.state.isDarkMode);

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay periodic-table-overlay';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); display: flex; align-items: center; justify-content: center; z-index: 1050; backdrop-filter: blur(4px); padding: 12px;';

    const categoryColors = {
      'nonmetal': { bg: '#dcfce7', border: '#86efac', text: '#15803d', darkBg: '#064e3b', darkBorder: '#059669', darkText: '#6ee7b7', label: 'No Metales' },
      'noble': { bg: '#f3e8ff', border: '#d8b4fe', text: '#7e22ce', darkBg: '#581c87', darkBorder: '#7e22ce', darkText: '#d8b4fe', label: 'Gases Nobles' },
      'alkali': { bg: '#fee2e2', border: '#fca5a5', text: '#b91c1c', darkBg: '#7f1d1d', darkBorder: '#dc2626', darkText: '#fca5a5', label: 'Alcalinos' },
      'alkaline-earth': { bg: '#ffedd5', border: '#fdba74', text: '#c2410c', darkBg: '#7c2d12', darkBorder: '#ea580c', darkText: '#fdba74', label: 'Alcalinotérreos' },
      'metalloid': { bg: '#e0f2fe', border: '#7dd3fc', text: '#0369a1', darkBg: '#0c4a6e', darkBorder: '#0284c7', darkText: '#7dd3fc', label: 'Metaloides (Si, B...)' },
      'halogen': { bg: '#ccfbf1', border: '#5eead4', text: '#0f766e', darkBg: '#134e4a', darkBorder: '#0d9488', darkText: '#5eead4', label: 'Halógenos' },
      'transition': { bg: '#e0e7ff', border: '#a5b4fc', text: '#4338ca', darkBg: '#312e81', darkBorder: '#4f46e5', darkText: '#a5b4fc', label: 'Metales de Transición' },
      'post-transition': { bg: '#cffafe', border: '#67e8f9', text: '#0e7490', darkBg: '#164e63', darkBorder: '#0891b2', darkText: '#67e8f9', label: 'Post-transición' },
      'lanthanide': { bg: '#fce7f3', border: '#f472b6', text: '#be185d', darkBg: '#831843', darkBorder: '#db2777', darkText: '#f472b6', label: 'Lantánidos' },
      'actinide': { bg: '#fae8ff', border: '#e879f9', text: '#a21caf', darkBg: '#701a75', darkBorder: '#c026d3', darkText: '#e879f9', label: 'Actínidos' }
    };

    const getElemStyle = (elem) => {
      const c = categoryColors[elem.category] || categoryColors['transition'];
      const bg = isDark ? c.darkBg : c.bg;
      const border = isDark ? c.darkBorder : c.border;
      const text = isDark ? c.darkText : c.text;
      
      let gridRow = elem.period;
      let gridCol = elem.group;
      if (elem.isFBlock) {
        gridRow = elem.fRow === 1 ? 8 : 9;
        gridCol = elem.fCol + 3;
      }
      return `grid-row: ${gridRow}; grid-column: ${gridCol}; background: ${bg}; border: 1px solid ${border}; color: ${text};`;
    };

    overlay.innerHTML = `
      <div class="modal-card" style="width: 96vw; max-width: 1280px; max-height: 94vh; display: flex; flex-direction: column; background: ${isDark ? '#090d16' : '#ffffff'}; color: ${isDark ? '#f8fafc' : '#0f172a'}; border: 1px solid ${isDark ? '#1e293b' : '#cbd5e1'}; border-radius: 10px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); overflow: hidden; padding: 0;">
        
        <header style="height: 52px; border-bottom: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; background: ${isDark ? '#0f172a' : '#f8fafc'}; display: flex; align-items: center; justify-content: space-between; padding: 0 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 16px; font-weight: bold; color: ${isDark ? '#60a5fa' : '#2563eb'}; display: flex; align-items: center; gap: 6px;">
              🌐 Tabla Periódica de los Elementos
            </span>
            <span style="font-size: 12px; color: ${isDark ? '#94a3b8' : '#64748b'};">
              Haz clic en cualquier elemento para seleccionarlo o sustituir átomos en el lienzo
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="text" id="ptable-search-input" class="form-input" placeholder="🔍 Buscar elemento (ej. Si, Fe, Litio...)" style="width: 260px; height: 32px; font-size: 12px; padding: 4px 10px;" autofocus />
            <button class="btn btn-sm" id="ptable-btn-close" style="font-size: 14px; padding: 4px 10px;">✕</button>
          </div>
        </header>

        <!-- Leyenda de Categorías -->
        <div style="display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 16px; background: ${isDark ? '#0b1120' : '#f1f5f9'}; border-bottom: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; font-size: 10px;">
          ${Object.entries(categoryColors).map(([cat, c]) => `
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="width: 10px; height: 10px; border-radius: 2px; background: ${isDark ? c.darkBg : c.bg}; border: 1px solid ${isDark ? c.darkBorder : c.border}; display: inline-block;"></span>
              <span style="color: ${isDark ? '#cbd5e1' : '#475569'};">${c.label}</span>
            </div>
          `).join('')}
        </div>

        <!-- Cuadrícula 18x9 de la Tabla Periódica -->
        <div style="flex: 1; overflow: auto; padding: 14px 16px;">
          <div id="ptable-grid" style="display: grid; grid-template-columns: repeat(18, minmax(0, 1fr)); grid-template-rows: repeat(9, auto); gap: 4px; min-width: 980px;">
            ${PERIODIC_TABLE_DATA.map(elem => `
              <button class="ptable-elem-btn" data-symbol="${elem.symbol}" data-name="${elem.name.toLowerCase()}" data-number="${elem.number}" style="${getElemStyle(elem)} padding: 4px 2px; border-radius: 4px; cursor: pointer; text-align: center; transition: all 0.15s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 48px;" title="${elem.name} (Z=${elem.number}, Grupo ${elem.group || '-'}, Periodo ${elem.period})">
                <span style="font-size: 9px; opacity: 0.75; line-height: 1;">${elem.number}</span>
                <span style="font-size: 14px; font-weight: bold; line-height: 1.15; margin: 1px 0;">${elem.symbol}</span>
                <span style="font-size: 8px; max-width: 90%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1; opacity: 0.9;">${elem.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <footer style="height: 38px; border-top: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'}; background: ${isDark ? '#0f172a' : '#f8fafc'}; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; font-size: 11px; color: ${isDark ? '#94a3b8' : '#64748b'};">
          <span>💡 <b>Tip:</b> También puedes presionar la tecla <b>K</b> en el teclado sobre cualquier átomo del lienzo para convertirlo en <b>Silicio (Si)</b>.</span>
          <span>Presiona <b>Esc</b> para cerrar</span>
        </footer>

      </div>
    `;

    document.body.appendChild(overlay);

    const searchInput = overlay.querySelector('#ptable-search-input');
    const elemBtns = overlay.querySelectorAll('.ptable-elem-btn');

    const closeModal = () => {
      window.removeEventListener('keydown', handleKeyDown);
      overlay.remove();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);

    overlay.querySelector('#ptable-btn-close')?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      elemBtns.forEach(btn => {
        const sym = btn.dataset.symbol.toLowerCase();
        const nm = btn.dataset.name.toLowerCase();
        const num = btn.dataset.number;
        const matches = !q || sym === q || sym.startsWith(q) || nm.includes(q) || num === q;
        btn.style.opacity = matches ? '1' : '0.2';
        btn.style.filter = matches ? 'none' : 'grayscale(80%)';
        btn.style.transform = (matches && q) ? 'scale(1.06)' : 'none';
        btn.style.zIndex = (matches && q) ? '2' : '1';
      });
    });

    elemBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sym = btn.dataset.symbol;
        this.activateGroup(sym);
        closeModal();
      });
    });
  }

  showTextModal({ title, initialValue, callback }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">${escapeHtml(title)}</div>
        <input type="text" id="modal-text-input" class="form-input" value="${escapeHtml(initialValue || '')}" autofocus />
        <div class="modal-actions">
          <button class="btn btn-sm" id="modal-btn-cancel">Cancelar</button>
          <button class="btn btn-primary btn-sm" id="modal-btn-ok">Aceptar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#modal-text-input');
    input.select();

    const close = (val) => {
      overlay.remove();
      callback(val);
    };

    overlay.querySelector('#modal-btn-ok').onclick = () => close(input.value);
    overlay.querySelector('#modal-btn-cancel').onclick = () => close(null);
    input.onkeydown = (e) => {
      if (e.key === 'Enter') close(input.value);
      if (e.key === 'Escape') close(null);
    };
  }

  updateValenceStatus() {
    const badge = document.getElementById('valence-status-badge');
    const textElem = document.getElementById('valence-status-text');
    if (!badge || !textElem) return;

    let hasError = false;
    let errorMessage = '';
    let errorAtomId = null;

    for (const [atomId, info] of this.state.valenceErrors.entries()) {
      if (info.hasError) {
        hasError = true;
        errorMessage = info.message;
        errorAtomId = atomId;
        break;
      }
    }

    if (hasError) {
      badge.className = 'valence-badge error';
      if (errorMessage.includes('requiere carga positiva formal (+)')) {
        textElem.innerHTML = `${errorMessage} <button id="btn-quick-fix-charge" style="margin-left: 8px; padding: 2px 8px; font-size: 11px; background: #2563eb; color: #ffffff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">⚡ Asignar Carga (+)</button>`;
        const fixBtn = document.getElementById('btn-quick-fix-charge');
        if (fixBtn) {
          fixBtn.onclick = (e) => {
            e.stopPropagation();
            if (errorAtomId) {
              const atom = this.state.getAtom(errorAtomId);
              if (atom) {
                this.state.saveSnapshot();
                atom.charge = 1;
                atom.lonePairs = 0;
                this.state.updateValences();
                this.renderer.render();
                this.updateValenceStatus();
              }
            }
          };
        }
      } else {
        textElem.textContent = errorMessage;
      }
    } else {
      badge.className = 'valence-badge ok';
      textElem.textContent = 'Valencias y reglas químicas correctas (máx. 4 enlaces en C)';
    }
  }

  finishProblemMode() {
    this.state.saveSnapshot();
    // 1. Buscar si ya existe un recuadro de referencias en el lienzo
    let refBox = null;
    for (const b of this.state.referenceBoxes.values()) {
      if (b.boxType !== 'compound') {
        refBox = b;
        break;
      }
    }

    // 2. Si no existe, crear uno automáticamente debajo del esquema con reactivos de ejemplo
    if (!refBox) {
      let maxBottom = 380;
      let minLeft = 80;
      for (const b of this.state.referenceBoxes.values()) {
        maxBottom = Math.max(maxBottom, b.y + b.height);
        minLeft = Math.min(minLeft, b.x);
      }
      for (const a of this.state.atoms.values()) {
        maxBottom = Math.max(maxBottom, a.y + 60);
        minLeft = Math.min(minLeft, a.x);
      }

      refBox = this.state.addReferenceBox({
        boxType: 'reference',
        title: 'Abreviaturas / Reactivos IChO',
        x: Math.max(40, minLeft),
        y: maxBottom + 35,
        width: 270,
        height: 130,
        items: [
          { abbr: 'TBS', formula: 't-BuMe2Si' },
          { abbr: 'Ac', formula: 'CH3CO' },
          { abbr: 'Bn', formula: 'CH2Ph' }
        ]
      });
    }

    // 3. Seleccionar el recuadro de referencias y activar su inspector
    this.state.clearSelection();
    this.state.selected.boxes.add(refBox.id);
    this.state.showCompoundBoxes = true;
    this.renderer.render();
    this.updateInspectors();

    // Notificación en la barra de estado
    const statusText = document.getElementById('valence-status-text');
    if (statusText) {
      const orig = statusText.textContent;
      statusText.textContent = '🏁 ¡Esquema finalizado! Modo Abreviaciones activado. Añade o edita los reactivos.';
      setTimeout(() => { statusText.textContent = orig; }, 3500);
    }
  }

  /** Galería de ejemplos: tarjetas con nombre y descripción; clic para cargar el esquema. */
  openExamplesGallery() {
    if (document.querySelector('.examples-gallery-overlay')) return;
    const isDark = Boolean(this.state.isDarkMode);
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay examples-gallery-overlay';
    const cards = EXAMPLE_SCHEMES.map(ex => `
      <button class="example-card" data-key="${ex.key}" style="text-align: left; padding: 12px 14px; border-radius: 8px; cursor: pointer;
        border: 1px solid ${isDark ? '#334155' : '#cbd5e1'}; background: ${isDark ? '#0f172a' : '#f8fafc'}; color: inherit;">
        <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: ${isDark ? '#93c5fd' : '#1d4ed8'};">${ex.name}</div>
        <div style="font-size: 12px; line-height: 1.4; color: ${isDark ? '#cbd5e1' : '#475569'};">${ex.description}</div>
      </button>`).join('');
    overlay.innerHTML = `
      <div class="modal-card" style="width: min(760px, 94vw); max-height: 88vh; overflow-y: auto; padding: 18px;
        background: ${isDark ? '#090d16' : '#ffffff'}; color: ${isDark ? '#f8fafc' : '#0f172a'};">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="font-size: 16px; font-weight: bold;">✦ Ejemplos</div>
          <button class="btn btn-sm" id="examples-gallery-close">✕ Cerrar</button>
        </div>
        <div style="font-size: 12px; margin-bottom: 12px; color: ${isDark ? '#94a3b8' : '#64748b'};">
          Al cargar un ejemplo se reemplaza el lienzo (puedes volver con Deshacer).
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">${cards}</div>
      </div>`;
    document.body.appendChild(overlay);

    const close = () => {
      window.removeEventListener('keydown', onKey);
      overlay.remove();
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('#examples-gallery-close').addEventListener('click', close);
    overlay.querySelectorAll('.example-card').forEach(btn => {
      btn.addEventListener('click', () => {
        this.loadExampleScheme(btn.dataset.key, true);
        close();
      });
    });
  }

  /** Ajusta pan y zoom para que todo el contenido quepa en el lienzo visible. */
  fitViewToContent(padding = 40) {
    const xs = [], ys = [];
    for (const a of this.state.atoms.values()) { xs.push(a.x); ys.push(a.y); }
    for (const a of this.state.arrows.values()) { xs.push(a.x1, a.x2); ys.push(a.y1 - 30, a.y2 + 30); }
    for (const l of this.state.textLabels.values()) { xs.push(l.x - 40, l.x + 40); ys.push(l.y - 15, l.y + 10); }
    for (const b of this.state.referenceBoxes.values()) { xs.push(b.x, b.x + b.width); ys.push(b.y, b.y + b.height); }
    if (xs.length === 0) return;
    const minX = Math.min(...xs) - 30, maxX = Math.max(...xs) + 30;
    const minY = Math.min(...ys) - 30, maxY = Math.max(...ys) + 30;
    const rect = this.svgElement.getBoundingClientRect();
    const w = rect.width || 900, h = rect.height || 600;
    const zoom = Math.max(0.3, Math.min(1.3, (w - padding * 2) / (maxX - minX), (h - padding * 2) / (maxY - minY)));
    this.state.zoom = zoom;
    this.state.pan = { x: w / 2 - ((minX + maxX) / 2) * zoom, y: h / 2 - ((minY + maxY) / 2) * zoom };
  }

  loadExampleScheme(key = 'icho-glucose', fitView = false) {
    const ex = EXAMPLE_SCHEMES.find(e => e.key === key) || EXAMPLE_SCHEMES[0];
    this.state.loadFromObject(ex ? ex.build() : ICHO_GLUCOSE_SCHEME, true);
    if (fitView) this.fitViewToContent();
    this.renderer.render();
    this.updateValenceStatus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.chemApp = new ChemApp();
});


})();
