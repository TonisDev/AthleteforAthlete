import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const remote = 'https://github.com/TonisDev/AthleteforAthlete.git';

if (!existsSync(join(dist, 'index.html'))) {
  console.error('Λείπει το dist. Τρέξε πρώτα npm run build.');
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'afa-pages-'));
const git = (args) => execFileSync('git', args, { cwd: dir, stdio: 'inherit' });

try {
  execFileSync('git', ['clone', '--branch', 'gh-pages', '--single-branch', remote, dir], {
    stdio: 'inherit',
  });
  for (const entry of readdirSync(dir)) {
    if (entry === '.git') continue;
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
} catch {
  rmSync(dir, { recursive: true, force: true });
  execFileSync('git', ['init', dir], { stdio: 'inherit' });
  git(['checkout', '-B', 'gh-pages']);
  git(['remote', 'add', 'origin', remote]);
}

cpSync(dist, dir, { recursive: true });
writeFileSync(join(dir, '.nojekyll'), '');
git(['add', '-A']);
git(['commit', '-m', 'Δημοσίευση της σελίδας.']);
git(['push', '-u', 'origin', 'gh-pages']);
rmSync(dir, { recursive: true, force: true });
