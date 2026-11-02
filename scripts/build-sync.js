import fs from 'fs';
import { execSync } from 'child_process';

console.log('1. Preparing source entrypoint index.html from template...');
fs.copyFileSync('index.template.html', 'index.html');

console.log('2. Running Vite production compilation on source code...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('3. Synchronizing compiled production bundle to root for GitHub Pages...');
if (fs.existsSync('dist/assets')) {
  fs.cpSync('dist/assets', 'assets', { recursive: true, force: true });
}
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'index.html');
}
if (fs.existsSync('landing.html')) {
  fs.copyFileSync('landing.html', 'dist/landing.html');
}

console.log('✓ SUCCESS: Fresh production build compiled and synced to root.');
