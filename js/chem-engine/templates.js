/**
 * templates.js - Plantillas de anillos: sillas de ciclohexano y piranosa (modelo de los
 * exámenes IChO), benceno, ciclohexano y ciclopentano.
 */

export const RING_TEMPLATES = {
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
