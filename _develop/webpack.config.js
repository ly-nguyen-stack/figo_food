const path = require('path');
const paths = require('./paths');
const TerserPlugin = require('terser-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const EventHooksPlugin = require('event-hooks-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const shouldUseSourceMap = false;

const colors = require('./npm_scripts/colors');

const noticeMessage = `
${colors.yellow}****************   ${colors.white}WATCH MODE${colors.yellow}   **********************${colors.red}
    process.env.NODE_ENV : development
    Don't forget ${colors.green}npm run build

    ${colors.yellowBg}${colors.black}【watchでのJSの書換を確認】${colors.reset}

    ${colors.red}アップロード/push前に必ず ${colors.green}npm run build${colors.red}
    を実行すること。
${colors.yellow}******************************************************${colors.reset}
`;

module.exports = (env) => {
  process.env.BABEL_ENV = env.production ? 'production' : 'development';
  process.env.NODE_ENV = env.production ? 'production' : 'development';
  return {
    target: ['web', 'es5'],
    mode: process.env.NODE_ENV,
    bail: false,
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
    entry: {
      bundle: ['core-js/stable', 'regenerator-runtime/runtime', 'whatwg-fetch', 'intersection-observer', './src/js/main.js']
    },
    output: {
      path: paths.appBuild,
      publicPath: '/' + paths.subDirectory,
      filename: `${paths.assetPath}/js/[name].js`,
      chunkFilename: (pathData) => {
        return pathData.chunk.name.includes('vendor') || pathData.chunk.name.includes('bundle')
          ? `${paths.assetPath}/js/[name].js`
          : `${paths.assetPath}/js/[name].[chunkhash:8].js`;
      }
    },
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename]
      },
      version: '1.0'
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              arrows: false
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          }
        })
      ],
      splitChunks: {
        name: 'vendor',
        chunks: 'all'
      },
      runtimeChunk: 'single'
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: __dirname,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                cacheCompression: true,
                compact: true
              }
            }
          ],
          exclude: [/\bcore-js\b/, /\bregenerator-runtime\b/, /\bobject-fit-images\b/]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    plugins: [
      new ESLintPlugin({
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        exclude: 'node_modules'
      }),
      new DuplicatePackageCheckerPlugin(),
      new FriendlyErrorsWebpackPlugin({
        clearConsole: true
      }),
      new EventHooksPlugin({
        done: () => {
          if (process.env.NODE_ENV === 'production') return;
          console.log(noticeMessage);
        }
      })
    ],
    performance: false
  };
};
