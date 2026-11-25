/**
 * app.js - Orquestador principal de ChemStudio
 * Conecta la interfaz (barra superior, paleta, inspectores y ventanas modales) con el estado,
 * las herramientas y el renderer.
 */

import { ChemState } from './state.js';
import { SvgRenderer } from './render/svg-renderer.js';
import { SelectTool } from './tools/select-tool.js';
import { BondTool } from './tools/bond-tool.js';
import { ArrowTool } from './tools/arrow-tool.js';
import { ChairTool } from './tools/chair-tool.js';
import { TemplateTool } from './tools/template-tool.js';
import { TextTool } from './tools/text-tool.js';
import { ReferenceTool } from './tools/reference-tool.js';
import { EraserTool } from './tools/eraser-tool.js';
import { ChemShortcuts } from './keyboard/shortcuts.js';
import { ChemAligner } from './chem-engine/aligner.js';
import { ChemExporter } from './export/exporter.js';
import { ChemSerializer } from './export/serializer.js';
import { ICHO_GLUCOSE_SCHEME } from './chem-engine/icho-data.js';
import { EXAMPLE_SCHEMES } from './chem-engine/examples.js';
import { ProblemBuilder } from './chem-engine/problem-builder.js';
import { calculateNextBondAngle, STANDARD_BOND_LENGTH } from './chem-engine/snapping.js';
import { PERIODIC_TABLE_DATA, ELEMENTS, calculateMolecularFormula } from './chem-engine/elements.js';

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

export class ChemApp {
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
    if (this.state.selected.boxes.size > 1) return null; // selección múltiple: no hay un rótulo único que editar
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
      return { isArrowStruct: true, arrowId: arrowStructGroup.dataset.arrowId, molecule: arrowStructGroup.dataset.molecule || null };
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
          this.openArrowStructureModal(arrow, targetInfo.molecule);
        }
        return;
      }

      const activeTool = this.tools[this.activeToolKey];
      if (activeTool && activeTool.onMouseDown) {
        // Arrastre en curso: el rótulo flotante no debe interceptar el ratón (ver app.css)
        this.canvasGesture = true;
        this.svgElement.parentElement.classList.add('canvas-gesture');
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

      // El botón se soltó donde no llegó el mouseup (p. ej. fuera de la ventana): terminar el arrastre
      if (this.canvasGesture && e.buttons === 0) {
        this.endCanvasGesture(e);
        return;
      }

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
      // Excepción: si el arrastre empezó en el lienzo hay que terminarlo aunque se suelte sobre la interfaz;
      // si no, lo seleccionado se queda pegado al cursor.
      const isUi = !this.canvasGesture && Boolean(e.target.closest('.sidebar-right, .toolbar-left, .header, .status-bar, .modal-overlay, .box-tag-editor'));
      if (isUi) {
        return;
      }

      this.endCanvasGesture(e);
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

  /** Termina la acción en curso de la herramienta activa (soltar el ratón) */
  endCanvasGesture(e) {
    this.canvasGesture = false;
    this.svgElement.parentElement.classList.remove('canvas-gesture');
    const activeTool = this.tools[this.activeToolKey];
    if (activeTool && activeTool.onMouseUp) {
      activeTool.onMouseUp(e, this.getCanvasCoordinates(e), this.getTargetInfo(e));
    }
    this.updateInspectors();
    this.updateValenceStatus();
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
        monoBtn.textContent = '◐ Blanco y\u00a0negro';
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
        problemModeBtn.textContent = 'Modo Problema';
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

    // Campo donde se insertará el nombre de una molécula al pulsarla en la lista
    this.lastReagentInput = topInput;
    for (const el of [topInput, bottomInput]) el?.addEventListener('focus', () => { this.lastReagentInput = el; });

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

      const name = this.state.nextMoleculeName();
      this.state.molecules.set(name, {
        atoms: atomsToCopy.map(a => ({ ...a })),
        bonds: bondsToCopy.map(b => ({ ...b }))
      });
      arrow.reagentsTop = [arrow.reagentsTop, name].filter(x => x && x.trim()).join('\n');

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

    // Siguiente paso con flecha doblada en L (abajo + derecha, etc.)
    document.querySelectorAll('[data-bent-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const box = this.state.referenceBoxes.get(Array.from(this.state.selected.boxes)[0]);
        if (!box) return;
        const [first, second] = btn.dataset.bentStep.split(' ');
        box.activeAxis = first;
        const step = ProblemBuilder.extendBentFromBox(box, first, second, this.state);
        this.state.clearSelection();
        this.state.selected.boxes.add(step.newBox.id);
        this.renderer.render();
        this.updateInspectors();
      });
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
        this.renderArrowMoleculeList(arrow);
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

  /** Lista de moléculas con nombre en el panel de la flecha: clic inserta el nombre, ✎ la edita */
  renderArrowMoleculeList(arrow) {
    const list = document.getElementById('arrow-molecule-list');
    if (!list) return;
    list.innerHTML = '';
    for (const name of this.state.molecules.keys()) {
      const add = document.createElement('button');
      add.className = 'btn btn-sm btn-outline';
      add.style.cssText = 'padding: 2px 6px; font-size: 11px; font-weight: bold;';
      add.textContent = name;
      add.title = `Poner ${name} en el último campo de reactivos usado`;
      add.addEventListener('click', () => {
        const el = this.lastReagentInput;
        if (!el) return;
        el.value = [el.value, name].filter(x => x && x.trim()).join('\n');
        el.dispatchEvent(new Event('input'));
      });
      const edit = document.createElement('button');
      edit.className = 'btn btn-sm btn-outline';
      edit.style.cssText = 'padding: 2px 5px; font-size: 11px;';
      edit.textContent = '✎';
      edit.title = `Editar ${name}`;
      edit.addEventListener('click', () => this.openArrowStructureModal(arrow, name));
      const item = document.createElement('span');
      item.style.cssText = 'display: inline-flex;';
      item.append(add, edit);
      list.appendChild(item);
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

  /** Editor de moléculas para flechas: crea una molécula con nombre, o edita la llamada 'molName' */
  openArrowStructureModal(arrow, molName = null) {
    if (!arrow) return;
    const editing = molName && this.state.molecules.has(molName) ? molName : null;
    const initialStructure = editing ? this.state.molecules.get(editing) : arrow.structureTop;
    const groups = ['OMe', 'OBn', 'OAc', 'OTs', 'OMs', 'OTBS', 'OTBDPS', 'OBz', 'Me', 'Et', 'iPr', 'tBu', 'Ph', 'Bn', 'Boc', 'Fmoc', 'NHBoc', 'NO2', 'CN', 'COOH', 'COOMe', 'CF3'];

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
              ⬡ Chem Studio <span style="font-size: 12px; font-weight: normal; color: ${isDark ? '#94a3b8' : '#64748b'};">| Molécula para Flecha</span>
            </span>
            <div style="display: flex; align-items: center; gap: 8px; background: ${isDark ? '#1e293b' : '#f1f5f9'}; padding: 3px 10px; border-radius: 6px; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
              <label for="modal-arrow-name" style="font-size: 11px; font-weight: bold; color: ${isDark ? '#60a5fa' : '#2563eb'};">Nombre:</label>
              <input type="text" id="modal-arrow-name" class="form-input" maxlength="12" spellcheck="false" value="${escapeHtml(editing || this.state.nextMoleculeName())}" style="width: 110px; height: 26px; font-size: 13px; font-weight: bold; text-align: center;" title="Nombre con el que la escribirás en los reactivos (letras, números y _)" />
              <span style="font-size: 11px; color: ${isDark ? '#94a3b8' : '#64748b'};">Escríbelo en los reactivos para dibujarla</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-sm" id="modal-arrow-undo" title="Deshacer (Ctrl+Z)">↶ Deshacer</button>
            <button class="btn btn-sm" id="modal-arrow-redo" title="Rehacer (Ctrl+Y)">↷ Rehacer</button>
            <button class="btn btn-sm" id="modal-arrow-center" title="Centrar estructura en la pizarra">⇥ Centrar</button>
            <button class="btn btn-sm" id="modal-arrow-clear" title="Limpiar pizarra">🗑 Limpiar</button>
            <div style="width: 1px; height: 24px; background: ${isDark ? '#334155' : '#e2e8f0'}; margin: 0 4px;"></div>
            <button class="btn btn-sm" id="modal-arrow-cancel">✕ Cancelar</button>
            <button class="btn btn-sm btn-primary" id="modal-arrow-save" style="font-weight: bold; background: #2563eb; color: #ffffff; padding: 5px 16px; font-size: 13px;">💾 Guardar Molécula</button>
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
              <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${isDark ? '#94a3b8' : '#64748b'}; margin-bottom: 6px; letter-spacing: 0.5px;">
                Grupos comunes
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 6px;">
                ${groups.map(g => `<button class="btn btn-sm btn-outline modal-elem-btn" data-elem="${g}" style="padding: 2px 6px; font-size: 11px;">${g}</button>`).join('')}
              </div>
              <div style="display: flex; gap: 4px;">
                <input type="text" id="modal-arrow-group" class="form-input" maxlength="14" spellcheck="false" placeholder="Otro (ej. OPMB)" style="flex: 1; min-width: 0; font-size: 12px;" />
                <button class="btn btn-sm btn-primary" id="modal-arrow-group-btn" style="font-size: 11px;">Usar</button>
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
              <button id="modal-arrow-delete-btn" class="btn btn-sm btn-outline" style="width: 100%; justify-content: center; font-size: 11px; padding: 5px; color: #ef4444;" title="Eliminar esta molécula">
                🗑️ Eliminar Molécula
              </button>
            </div>

            <div style="background: ${isDark ? '#1e293b' : '#f1f5f9'}; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 6px; padding: 8px; font-size: 11px; color: ${isDark ? '#cbd5e1' : '#475569'}; line-height: 1.4; margin-top: auto;">
              <strong style="color: ${isDark ? '#60a5fa' : '#2563eb'};">💡 Cómo usarla:</strong><br/>
              Ponle nombre (ej. <b>MO1</b>) y guárdala. Luego escribe <b>MO1</b> en los reactivos de arriba o de abajo, solo o con texto (ej. <b>1) MO1, NaH</b>), en cualquier flecha. Con <b>Encajar Esquema</b> la flecha se alarga para que quepa.
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
      // Un grupo se coloca dibujando: pasar a la herramienta de enlace, como en la pizarra principal
      if (groups.includes(elem) || !['C', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I', 'H', 'Si'].includes(elem)) {
        if (activeModalToolKey !== 'bond') selectModalTool('bond', 'single');
      }
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
    if (initialStructure) {
      modalState.loadFromObject(initialStructure, false); // abrir no debe ser un paso de deshacer
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

    const groupInput = overlay.querySelector('#modal-arrow-group');
    const useTypedGroup = () => {
      const g = groupInput.value.trim();
      if (!g) return;
      selectModalElement(g);
      groupInput.blur();
    };
    overlay.querySelector('#modal-arrow-group-btn')?.addEventListener('click', useTypedGroup);
    groupInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); useTypedGroup(); }
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
      askConfirm(editing ? `¿Eliminar la molécula ${editing}?` : '¿Eliminar la molécula sobre la flecha?', () => {
        this.state.saveSnapshot();
        if (editing) this.state.molecules.delete(editing);
        else arrow.structureTop = null;
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

    if (!initialStructure) {
      const delBtn = overlay.querySelector('#modal-arrow-delete-btn');
      if (delBtn) delBtn.style.display = 'none'; // molécula nueva: no hay nada que eliminar
    }

    overlay.querySelector('#modal-arrow-cancel')?.addEventListener('click', closeModal);

    overlay.querySelector('#modal-arrow-save')?.addEventListener('click', () => {
      const name = overlay.querySelector('#modal-arrow-name').value.trim();
      if (modalState.atoms.size === 0) {
        showToast('Dibuja primero la molécula.');
        return;
      }
      if (!/^\p{L}[\p{L}\p{N}_]+$/u.test(name)) {
        showToast('El nombre debe empezar por letra y tener al menos 2 caracteres: letras, números o _ (ej. MO1).');
        return;
      }
      if (name !== editing && this.state.molecules.has(name)) {
        showToast(`Ya existe una molécula llamada ${name}. Elige otro nombre.`);
        return;
      }
      this.state.saveSnapshot();
      if (editing) this.state.renameMolecule(editing, name);
      this.state.molecules.set(name, {
        atoms: Array.from(modalState.atoms.values()).map(x => ({ ...x })),
        bonds: Array.from(modalState.bonds.values()).map(x => ({ ...x }))
      });
      if (!editing && arrow.structureTop) {
        // Molécula antigua puesta directamente sobre la flecha: pasa a ser una con nombre en el mismo sitio
        arrow.structureTop = null;
        arrow.reagentsTop = [arrow.reagentsTop, name].filter(x => x && x.trim()).join('\n');
      } else if (!editing) {
        showToast(`Guardada como ${name}. Escribe ${name} en los reactivos de arriba o de abajo.`);
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
