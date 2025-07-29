const { withNxMetro } = require('@nx/react-native');
const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration for Nx + React Native + Expo
 * https://reactnative.dev/docs/metro
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs', 'mjs'],
    platforms: ['ios', 'android', 'native', 'web'],
    alias: {
      '@ec-mobile/shared-ui': path.resolve(__dirname, '../../shared-ui/src'),
      '@ec-mobile/shopify-sdk': path.resolve(__dirname, '../../shopify-sdk/src'),
    },
  },
  watchFolders: [
    path.resolve(__dirname, '../../shared-ui'),
    path.resolve(__dirname, '../../shopify-sdk'),
  ],
};

module.exports = withNxMetro(config, {
  debug: false,
  watchFolders: [
    path.resolve(__dirname, '../../shared-ui'),
    path.resolve(__dirname, '../../shopify-sdk'),
  ],
});
