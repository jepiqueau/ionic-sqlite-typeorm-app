var webpack = require('webpack');
var TerserPlugin = require('terser-webpack-plugin')

console.log('The custom config is used');
module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "crypto": false,
    },
  },
  externals: {
    'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  plugins: [
      new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
          result.request = result.request.replace(/typeorm/, "typeorm/browser");
      })
  ],
};
