module.exports = function (api) {
  api.cache(true);

  const targets = '> 5% in alt-AS, last 2 major versions, iOS >= 11, ie 11, not dead';
  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ],
    '@babel/preset-typescript',
    '@emotion/babel-preset-css-prop'
  ];
  const plugins = [
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-syntax-dynamic-import'],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    ['@babel/plugin-proposal-class-properties'],
    ['@emotion']
  ];

  const env = {};

  return {
    targets,
    presets,
    plugins,
    env
  };
};
