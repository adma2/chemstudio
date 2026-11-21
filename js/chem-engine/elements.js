/**
 * elements.js - Diccionario químico de elementos, valencias y abreviaturas
 */

export const ELEMENTS = {
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

export const PERIODIC_TABLE_DATA = [
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
export const COMMON_GROUPS = {
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
export function parseChemicalRichText(str) {
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

  // 3. Cargas directas tras símbolo o corchete: ej. [Si3O9]6- o Fe3+ o Cl-
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
export function formatChemicalFormula(str, asHtml = false) {
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
export function renderFormattedSvgText(parentElem, str, options = {}) {
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
export function calculateMolecularFormula(atoms) {
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
export const GROUP_REVERSALS = {
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

export const REVERSE_GROUP_MAP = Object.fromEntries(
  Object.entries(GROUP_REVERSALS).map(([k, v]) => [v, k])
);

/**
 * Calcula la orientación del sustituyente según la dirección de los enlaces conectados
 */
export function getAtomAttachmentOrientation(atom, state) {
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

export function getBondOrder(bondType) {
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

export function getAtomBondOrderSum(atom, state) {
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
export function computeAutoAtomLabel(element, bondSum, charge = 0) {
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
export function getFormattedAtomDisplay(atom, state) {
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
export function getAtomBoundingBox(atom, state, margin = 3.0) {
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
export function getMoleculeBoundingBox(atoms, state, padding = 0) {
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
export function getConnectedMoleculeAtoms(startAtomId, state) {
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
export function getArrowBendCorner(arrow) {
  if (!arrow || !arrow.bend || arrow.type === 'fork' || arrow.type === 'converge') return null;
  if (Math.abs(arrow.x2 - arrow.x1) < 2 || Math.abs(arrow.y2 - arrow.y1) < 2) return null;
  return arrow.bend === 'vh' ? { x: arrow.x1, y: arrow.y2 } : { x: arrow.x2, y: arrow.y1 };
}

/**
 * Obtiene todas las moléculas individuales presentes en el estado
 */
export function getAllMolecules(state) {
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
export function getAtomLonePairAngles(atom, state, count = 1) {
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

