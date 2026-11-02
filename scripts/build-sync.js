import fs from 'fs';

// Synchronize dist build with root for GitHub Pages
if (fs.existsSync('dist/assets')) {
  fs.cpSync('dist/assets', 'assets', { recursive: true, force: true });
}
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'index.html');
}
if (fs.existsSync('landing.html')) {
  fs.copyFileSync('landing.html', 'dist/landing.html');
}
console.log('✓ Production assets synced to root for GitHub Pages.');
