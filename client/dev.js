import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const vite = join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');

const child = spawn(process.execPath, [vite], {
  cwd: __dirname,
  stdio: 'inherit',
});

child.on('exit', (code) => process.exit(code));
