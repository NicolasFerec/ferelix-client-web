/**
 * Generate version.json file from git information.
 * This script is run before build to generate version info.
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getGitInfo() {
  try {
    const commit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    return { commit, branch };
  } catch (error) {
    console.warn('Warning: Could not get git info, using defaults');
    return { commit: 'unknown', branch: 'unknown' };
  }
}

const versionInfo = getGitInfo();
const outputPath = join(__dirname, '../src/utils/version.json');
writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));
console.log(`Generated ${outputPath}:`, versionInfo);



