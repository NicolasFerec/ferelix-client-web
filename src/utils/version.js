/**
 * Version information utility for Ferelix frontend.
 * 
 * Reads version info from version.json file (generated during build).
 * version.json is generated before build by CI/CD or local build scripts.
 */

// Import version.json (generated before build)
// This file is created by:
// - CI/CD workflow before build
// - Local build script (generate-version) before build
import versionInfo from './version.json';

/**
 * Get version information.
 * Returns version info from version.json (generated at build time).
 * 
 * Note: Git commands don't work in browser runtime, so we rely on
 * version.json being generated during the build process.
 * 
 * @returns {Object} Object with 'commit' and 'branch' properties
 */
export function getVersionInfo() {
  return versionInfo;
}
