module.exports = (webpackConfig) => {
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    resolve: {
      fullySpecified: false,
    },
  });
};
