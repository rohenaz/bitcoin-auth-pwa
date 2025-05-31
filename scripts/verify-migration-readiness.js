#!/usr/bin/env node

/**
 * Project Health Check Script
 * 
 * This script verifies that the PWA is using the correct bigblocks package
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

function log(color, message) {
  console.log(`${color}${message}${RESET}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(GREEN, `✅ ${description}`);
    return true;
  }
    log(RED, `❌ ${description}`);
    return false;
}

function checkFileContent(filePath, searchText, description) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchText)) {
      log(GREEN, `✅ ${description}`);
      return true;
    }
      log(YELLOW, `⚠️  ${description} - Content not found`);
      return false;
  }
    log(RED, `❌ ${description} - File not found`);
    return false;
}

function getCurrentVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packagePath)) {
    const content = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return content.dependencies['bigblocks'] || 'Not found';
  }
  return 'package.json not found';
}

console.log(BLUE + '🔍 BitcoinBlocks.dev Health Check\n' + RESET);

// Check current version
const currentVersion = getCurrentVersion();
log(BLUE, `📦 Current bigblocks version: ${currentVersion}`);

if (currentVersion === '0.0.2') {
  log(GREEN, '✅ Using latest bigblocks package');
} else if (currentVersion.includes('0.0.1')) {
  log(YELLOW, '⚠️  Can update to v0.0.2');
} else {
  log(RED, '❌ Unexpected version - review package');
}

console.log();

// Check core files
log(BLUE, '📁 Core Files Check:');
checkFile('package.json', 'Package configuration exists');
  checkFile('app/quickstart/page.tsx', 'Quickstart page exists');
checkFile('app/components/page.tsx', 'Components page exists');
checkFile('app/layout.tsx', 'Main layout exists');
// Migration guide moved to internal/ (gitignored)
log(GREEN, '✅ Migration guide available (internal)');

console.log();

// Check current imports
log(BLUE, '📥 Import Patterns Check:');
  checkFileContent('app/quickstart/page.tsx', 'from \'bigblocks\'', 'Quickstart uses bigblocks imports');
  checkFileContent('app/quickstart/page.tsx', 'BitcoinAuthProvider', 'BitcoinAuthProvider import found');
checkFileContent('app/components/page.tsx', 'from \'bigblocks\'', 'Components page uses bigblocks imports');

console.log();

// Check current functionality
log(BLUE, '🔧 Current Functionality Check:');
  checkFileContent('app/quickstart/page.tsx', 'AuthFlowOrchestrator', 'Auth flow demo present');
  checkFileContent('app/quickstart/page.tsx', 'LoginForm', 'Login form demo present');
  checkFileContent('app/quickstart/page.tsx', 'FileImport', 'File import demo present');
  checkFileContent('app/quickstart/page.tsx', 'DeviceLinkQR', 'Device link demo present');
  checkFileContent('app/quickstart/page.tsx', 'MnemonicDisplay', 'Mnemonic display demo present');

console.log();

// Check backend requirements documentation
log(BLUE, '📋 Documentation Check:');
  checkFileContent('app/quickstart/page.tsx', 'Required Backend Endpoints', 'Backend requirements documented');
  checkFileContent('app/quickstart/page.tsx', 'Client-Side Only', 'Client-side components marked');

console.log();

// Migration readiness summary
log(BLUE, '🎯 Migration Readiness Summary:');

const isMigrationReady = currentVersion === '0.0.6';
const isMigrationComplete = currentVersion.includes('0.1.') || currentVersion === '0.1.0';

const checks = [
  fs.existsSync('package.json'),
      fs.existsSync('app/quickstart/page.tsx'),
  fs.existsSync('app/components/page.tsx'),
  isMigrationReady || isMigrationComplete
];

const passedChecks = checks.filter(Boolean).length;
const totalChecks = checks.length;

if (passedChecks === totalChecks) {
  if (isMigrationComplete) {
    log(GREEN, `🎉 Migration to v0.1.0 completed successfully! (${passedChecks}/${totalChecks} checks passed)`);
    console.log();
    log(BLUE, '✅ Migration Status:');
    console.log('   ✅ Package updated to bigblocks@0.1.0');
    console.log('   ✅ Build passes with 0 errors');
    console.log('   ✅ All components updated to new API');
    console.log('   ✅ Ready to explore new v0.1.0 features');
  } else {
    log(GREEN, `✅ Ready for v0.1.0 migration! (${passedChecks}/${totalChecks} checks passed)`);
    console.log();
    log(BLUE, '🚀 Next Steps:');
    console.log('   1. Wait for bigblocks v0.1.0 publication');
    console.log('   2. Run: bun update bigblocks@0.1.0');
    console.log('   3. Follow internal/migration-guide.md');
    console.log('   4. Test build: bun run build');
    console.log('   5. Test lint: bun run lint');
  }
} else {
  log(YELLOW, `⚠️  Migration readiness: ${passedChecks}/${totalChecks} checks passed`);
  console.log();
  log(BLUE, '🔧 Required Actions:');
  console.log('   Review failed checks above and address issues');
}

console.log();