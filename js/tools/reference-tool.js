/**
 * reference-tool.js - Herramienta para insertar y configurar el Recuadro de Referencias estilo IChO
 */

export class ReferenceTool {
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
