#!/usr/bin/env node
// Fixes datasworn monorepo GitHub installs: npm doesn't use gitSubdir when
// fetching, so each package gets the repo root instead of its subdirectory.
// This script copies the correct subpackage contents to the package root.

const { cpSync, existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const packages = [
  { dir: 'node_modules/@datasworn/core', subpath: 'pkg/nodejs/@datasworn/core' },
  { dir: 'node_modules/@datasworn/ironsworn-classic', subpath: 'pkg/nodejs/@datasworn/ironsworn-classic' },
  { dir: 'node_modules/@datasworn/ironsworn-classic-delve', subpath: 'pkg/nodejs/@datasworn/ironsworn-classic-delve' },
  { dir: 'node_modules/@datasworn/ironsworn-classic-lodestar', subpath: 'pkg/nodejs/@datasworn/ironsworn-classic-lodestar' },
  { dir: 'node_modules/@datasworn/starforged', subpath: 'pkg/nodejs/@datasworn/starforged' },
  { dir: 'node_modules/@datasworn/sundered-isles', subpath: 'pkg/nodejs/@datasworn/sundered-isles' },
  { dir: 'node_modules/@datasworn-community-content/fe-runners', subpath: 'pkg/nodejs/@datasworn-community-content/fe-runners' },
  { dir: 'node_modules/@datasworn-community-content/ironsmith', subpath: 'pkg/nodejs/@datasworn-community-content/ironsmith' },
  { dir: 'node_modules/@datasworn-community-content/starsmith', subpath: 'pkg/nodejs/@datasworn-community-content/starsmith' },
];

function exposeMigrationIdMap(pkgDir) {
  const idMapPath = join(pkgDir, 'migration/0.1.0/id_map.json');
  const packageJsonPath = join(pkgDir, 'package.json');

  if (!existsSync(idMapPath) || !existsSync(packageJsonPath)) {
    return false;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const exportsMap = packageJson.exports;

  if (
    exportsMap == null ||
    typeof exportsMap !== 'object' ||
    Array.isArray(exportsMap)
  ) {
    return false;
  }

  const migrationSpecifier = './migration/0.1.0/id_map.json';
  if (exportsMap[migrationSpecifier] === migrationSpecifier) {
    return false;
  }

  exportsMap[migrationSpecifier] = migrationSpecifier;
  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  return true;
}

let anyFixed = false;
for (const { dir, subpath } of packages) {
  const pkgDir = join(process.cwd(), dir);
  const subdirPath = join(pkgDir, subpath);

  if (!existsSync(subdirPath)) {
    console.log(`[fix-datasworn] skipping ${dir} (subpath not found)`);
    continue;
  }

  const rootPkg = require(join(pkgDir, 'package.json'));
  const expectedName = dir.replace('node_modules/', '');
  if (rootPkg.name !== expectedName) {
    console.log(`[fix-datasworn] fixing ${dir}`);
    cpSync(subdirPath, pkgDir, { recursive: true });
    anyFixed = true;
  }

  if (exposeMigrationIdMap(pkgDir)) {
    console.log(`[fix-datasworn] exposing migration ID map for ${dir}`);
    anyFixed = true;
  }
}

if (anyFixed) {
  console.log('[fix-datasworn] done');
}
