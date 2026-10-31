// Compila cada .mdx indicado con MDX 3 (+gfm, math) y reporta errores de sintaxis.
import { compile } from '/home/petervargas/Documents/divisioncero.com/node_modules/.pnpm/@mdx-js+mdx@3.1.1_supports-color@10.2.2/node_modules/@mdx-js/mdx/index.js';
import gfm from '/home/petervargas/Documents/divisioncero.com/node_modules/.pnpm/remark-gfm@4.0.1_supports-color@10.2.2/node_modules/remark-gfm/index.js';
import math from '/home/petervargas/Documents/divisioncero.com/node_modules/.pnpm/remark-math@6.0.0_supports-color@10.2.2/node_modules/remark-math/index.js';
import { readFileSync } from 'node:fs';
let bad = 0;
for (const f of process.argv.slice(2)) {
  const src = readFileSync(f, 'utf8').replace(/^---[\s\S]*?\n---\n/, '');
  try { await compile(src, { remarkPlugins: [gfm, math] }); }
  catch (e) { bad++; console.log('ERR', f, e.message.split('\n')[0]); }
}
console.log('checked', process.argv.length - 2, 'errors', bad);
