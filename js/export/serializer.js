/**
 * serializer.js - Guardado y carga de proyectos en formato JSON
 */

export class ChemSerializer {
  static serialize(state) {
    return {
      version: '1.1',
      created: new Date().toISOString(),
      showCompoundBoxes: state.showCompoundBoxes !== false,
      atoms: Array.from(state.atoms.values()),
      bonds: Array.from(state.bonds.values()),
      arrows: Array.from(state.arrows.values()),
      referenceBoxes: Array.from(state.referenceBoxes.values()),
      textLabels: Array.from(state.textLabels.values()),
      molecules: state.moleculeList ? state.moleculeList() : []
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
