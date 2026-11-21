/**
 * text-tool.js - Rótulos de intermediarios (A, B, C...) y fórmulas químicas
 */

export class TextTool {
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
