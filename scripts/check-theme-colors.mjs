import fs from 'node:fs';

const css = fs.readFileSync('src/App.components.css', 'utf8');
const start = css.indexOf('.detail-export-shell');
const end = css.indexOf('.detail-fallback-poster');
const block = start >= 0 && end > start ? css.slice(start, end) : '';
const hardcoded = block.match(/#[0-9a-fA-F]{3,8}\b/g) || [];

if (hardcoded.length) {
  console.error('Found hard-coded colors in detail export block:', [...new Set(hardcoded)].join(', '));
  process.exit(1);
}

console.log('Theme color check passed.');
