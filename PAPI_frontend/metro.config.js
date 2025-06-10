// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// allow `.cjs` files to be resolved
config.resolver.sourceExts.push('cjs');

// disable the new package-exports guard so old-style imports still work
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
