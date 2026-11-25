import fs from 'fs';
import path from 'path';

const filesInOrder = [
  'js/chem-engine/elements.js',
  'js/chem-engine/valence.js',
  'js/chem-engine/templates.js',
  'js/chem-engine/snapping.js',
  'js/chem-engine/ring-geometry.js',
  'js/chem-engine/aligner.js',
  'js/chem-engine/problem-builder.js',
  'js/chem-engine/icho-data.js',
  'js/chem-engine/examples.js',
  'js/state.js',
  'js/render/arrow-renderer.js',
  'js/render/reference-box.js',
  'js/render/svg-renderer.js',
  'js/tools/select-tool.js',
  'js/tools/bond-tool.js',
  'js/tools/arrow-tool.js',
  'js/tools/chair-tool.js',
  'js/tools/template-tool.js',
  'js/tools/text-tool.js',
  'js/tools/reference-tool.js',
  'js/tools/eraser-tool.js',
  'js/keyboard/shortcuts.js',
  'js/export/exporter.js',
  'js/export/serializer.js',
  'js/app.js'
];

let bundleContent = '(function() {\n';
bundleContent += '  "use strict";\n\n';

for (const relPath of filesInOrder) {
  let content = fs.readFileSync(relPath, 'utf8');
  // Remover sentencias import y export
  content = content.replace(/^import\s+.*?;?\s*$/gm, '');
  content = content.replace(/^export\s+(default\s+)?/gm, '');
  bundleContent += `  // --- ${relPath} ---\n`;
  bundleContent += content + '\n\n';
}

bundleContent += '})();\n';

fs.writeFileSync('js/bundle.js', bundleContent, 'utf8');
console.log('Bundle creado con éxito en js/bundle.js (' + bundleContent.length + ' bytes)');
