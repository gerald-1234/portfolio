import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SITE_ROOT = process.cwd();
const pages = readdirSync(SITE_ROOT).filter((f) => f.endsWith('.html'));
const failures = [];

for (const page of pages) {
  const html = readFileSync(resolve(SITE_ROOT, page), 'utf8');
  const refs = [...html.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/g)].map((m) => m[1]);

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(ref)) continue;

    const clean = ref.split('#')[0].split('?')[0];
    if (!clean) continue;

    // Root-absolute refs are served from the site root, not the repo root.
    const target = clean.startsWith('/')
      ? resolve(SITE_ROOT, `.${clean}`)
      : resolve(dirname(resolve(SITE_ROOT, page)), clean);

    if (!existsSync(target)) {
      failures.push(`${page}: ${ref}`);
    }
  }
}

if (failures.length) {
  console.error('Broken internal references:');
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

console.log(`Checked ${pages.length} page(s), no broken internal references.`);
