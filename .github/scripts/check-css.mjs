import { readdirSync, readFileSync } from 'node:fs';

const dir = 'assets';
let failures = 0;

for (const f of readdirSync(dir).filter((x) => x.endsWith('.css'))) {
  const s = readFileSync(`${dir}/${f}`, 'utf8');
  let bal = 0;
  for (const c of s) {
    if (c === '{') bal++;
    if (c === '}') bal--;
    if (bal < 0) {
      console.error(`${f}: unmatched closing brace`);
      process.exit(1);
    }
  }
  if (bal !== 0) {
    failures++;
    console.error(`${f}: ${bal} unclosed brace(s)`);
  }
}

if (failures) process.exit(1);
console.log('CSS braces balanced.');
