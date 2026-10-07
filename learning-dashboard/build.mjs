import { mkdir, copyFile, readdir } from 'node:fs/promises';

// Publish only the frontend. Personal backups and calendar receipts never enter dist.
export const publicFiles = ['index.html', 'styles.css', 'app.mjs', 'core.mjs', 'roadmap.mjs'];
const output = new URL('./dist/', import.meta.url);
await mkdir(output, { recursive: true });
const existing = await readdir(output);
if (existing.some(name => !publicFiles.includes(name))) {
  throw new Error('Unexpected file in dist. Review and remove it before publishing.');
}
for (const name of publicFiles) {
  await copyFile(new URL(name, import.meta.url), new URL(name, output));
}
console.log(`Built ${publicFiles.length} public frontend files.`);
