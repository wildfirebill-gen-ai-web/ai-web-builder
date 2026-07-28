/**
 * Desktop Build Script
 * 1. Builds the web app (Next.js standalone output)
 * 2. Copies standalone output to desktop's .next directory
 * 3. Copies public assets
 */
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const ROOT = path.resolve(__dirname, '..')
const WEB_DIR = path.join(ROOT, 'apps', 'web')
const DESKTOP_DIR = path.join(ROOT, 'apps', 'desktop')

function rmrf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

function cp(src, dest) {
  if (!fs.existsSync(src)) return
  fs.cpSync(src, dest, { recursive: true, force: true })
}

console.log('[build-desktop] Building web app (standalone)...')
execSync('pnpm --filter @awb/web build', { cwd: ROOT, stdio: 'inherit' })

const standaloneDir = path.join(WEB_DIR, '.next', 'standalone')
const webStandaloneDir = path.join(standaloneDir, 'apps', 'web')

console.log('[build-desktop] Copying standalone output to desktop/.next...')
rmrf(path.join(DESKTOP_DIR, '.next'))
cp(path.join(webStandaloneDir, '.next'), path.join(DESKTOP_DIR, '.next'))
cp(path.join(webStandaloneDir, 'public'), path.join(DESKTOP_DIR, 'public'))

console.log('[build-desktop] Done. Desktop .next ready for electron-builder.')
