import { mkdir, readFile, writeFile } from 'node:fs/promises';
// Emit real entry files so GitHub Pages serves case URLs without a 404 redirect.
const content = await readFile(new URL('../src/content.ts', import.meta.url), 'utf8');
const slugs = [...content.matchAll(/slug: '([^']+)'/g)].map(match => match[1]);
if (!slugs.length) throw new Error('No case routes found');
const html = await readFile('dist/index.html', 'utf8');
for (const slug of slugs) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Invalid case slug');
  await mkdir(`dist/cases/${slug}`, { recursive: true });
  await writeFile(`dist/cases/${slug}/index.html`, html);
}
await writeFile('dist/404.html', html);
await writeFile('dist/.nojekyll', '');
console.log(`Prepared ${slugs.length} case routes for GitHub Pages`);
