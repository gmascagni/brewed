// Automated Build Metadata & Version Stamping Script
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getGitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (e) {
    return 'snapshot-' + Math.random().toString(36).substring(2, 8);
  }
}

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (e) {
    return 'main';
  }
}

function recordBuild() {
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const commit = getGitCommit();
  const branch = getGitBranch();
  const buildDate = new Date().toISOString();
  const buildId = `${pkg.version}-${commit}-${Date.now().toString(36)}`;

  const versionData = {
    version: pkg.version,
    buildId,
    commit,
    branch,
    buildDate,
    environment: process.env.NODE_ENV || 'production',
    appName: pkg.name || 'the-brew-app'
  };

  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const publicVersionPath = path.join(publicDir, 'version.json');
  fs.writeFileSync(publicVersionPath, JSON.stringify(versionData, null, 2), 'utf8');

  console.log('='.repeat(55));
  console.log(`📦 BUILD METADATA STAMPED: ${pkg.name} v${pkg.version}`);
  console.log(`🏷️  Commit:    ${commit} (${branch})`);
  console.log(`🕒 Timestamp: ${buildDate}`);
  console.log(`🆔 Build ID:  ${buildId}`);
  console.log('='.repeat(55));
}

recordBuild();
