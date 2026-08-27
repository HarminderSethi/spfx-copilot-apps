const path = require('node:path');

/**
 * Ensure the PhotoAlbum dependency uses the same React and Fluent UI module
 * instances as this SPFx component. Resolving these packages from the app
 * prevents duplicate contexts across the component and lightbox portal.
 */
module.exports = (webpackConfig) => {
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    resolve: {
      fullySpecified: false,
    },
  });

  webpackConfig.resolve = webpackConfig.resolve || {};
  webpackConfig.resolve.alias = {
    ...(webpackConfig.resolve.alias || {}),
    'react$': path.resolve(__dirname, '../node_modules/react'),
    'react-dom$': path.resolve(__dirname, '../node_modules/react-dom'),
    'react/jsx-runtime$': path.resolve(
      __dirname,
      '../node_modules/react/jsx-runtime',
    ),
    '@fluentui/react-components$': path.resolve(
      __dirname,
      '../node_modules/@fluentui/react-components',
    ),
    '@fluentui/react-shared-contexts$': path.resolve(
      __dirname,
      '../node_modules/@fluentui/react-shared-contexts',
    ),
    '@fluentui/react-provider$': path.resolve(
      __dirname,
      '../node_modules/@fluentui/react-provider',
    ),
    '@fluentui/react-portal$': path.resolve(
      __dirname,
      '../node_modules/@fluentui/react-portal',
    ),
    '@fluentui/react-dialog$': path.resolve(
      __dirname,
      '../node_modules/@fluentui/react-dialog',
    ),
    '@fluentui/react-theme$': path.resolve(
      __dirname,
      '../node_modules/@fluentui/react-theme',
    ),
    '@fluentui/react-utilities$': path.resolve(
      __dirname,
      '../node_modules/@fluentui/react-utilities',
    ),
    '@fluentui/react-icons$': path.resolve(
      __dirname,
      '../node_modules/@fluentui/react-icons',
    ),
  };
};
