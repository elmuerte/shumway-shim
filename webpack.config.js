const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = {
  mode: 'production',
  output: {
    filename: 'shumway-shim.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: 'node_modules/shumway-dist/build', to: 'shumway-dist/build' },
      {from: 'node_modules/shumway-dist/iframe', to: 'shumway-dist/iframe' }
    ], {}),
    new ZipPlugin({
      filename: 'shumway-shim.zip'
    })
  ],
  optimization: {
    minimize: false
  },
  performance: {
    hints: false
  }
};
