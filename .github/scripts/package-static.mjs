import { createHash } from 'node:crypto';
import { lstat, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = resolve('build');
const sha = process.env.GITHUB_SHA;
const runId = process.env.GITHUB_RUN_ID;
const runNumber = Number(process.env.GITHUB_RUN_NUMBER);
const runAttempt = Number(process.env.GITHUB_RUN_ATTEMPT || 1);
if (process.env.GITHUB_REPOSITORY !== 'troyeagle/larp-clues-presentation' ||
    !/^[a-f0-9]{40}$/.test(sha || '') || !/^[1-9][0-9]*$/.test(runId || '') ||
    !Number.isSafeInteger(runNumber) || runNumber < 1 ||
    !Number.isSafeInteger(runAttempt) || runAttempt < 1) {
  throw new Error('Missing or invalid GitHub build identity');
}

const files = [];
async function walk(relative = '') {
  for (const name of (await readdir(join(root, relative))).sort()) {
    if (name.startsWith('.') || /[\x00-\x1f\\]/.test(name)) {
      throw new Error('Unexpected filename in build output');
    }
    const path = relative ? `${relative}/${name}` : name;
    if (path === '_site-sync.json') continue;
    const info = await lstat(join(root, path));
    if (info.isDirectory()) await walk(path);
    else if (info.isFile()) {
      const data = await readFile(join(root, path));
      files.push({ path, size: data.length, sha256: createHash('sha256').update(data).digest('hex') });
    } else throw new Error('Build output must contain only regular files and directories');
  }
}
await walk();
if (!files.some(file => file.path === 'index.html')) throw new Error('Missing build/index.html');
await writeFile(join(root, '_site-sync.json'), JSON.stringify({
  schema: 1, app: 'clue', repository: process.env.GITHUB_REPOSITORY,
  sha, runId, runNumber, runAttempt, files,
}, null, 2) + '\n');
console.log(`Packaged ${files.length} static files for /clue/`);
