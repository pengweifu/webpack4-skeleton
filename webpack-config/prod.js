/*
* @Author: pengweifu
* @Date:   2018-08-29 23:16:24
* @Last Modified by:   pengweifu
* @Last Modified time: 2018-08-30 09:59:51
*/
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'none',
  output: {
    path: resolve(__dirname, '../dist/static'),
    publicPath: './static/',
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          'less-loader',
        ],
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*'], {
      root: resolve(__dirname, '../'),
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
      filename: '../index.html',
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[name].[chunkhash].css",
    }),
  ],
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      name: true,
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  performance: {
    hints: 'warning',
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.js') ||  assetFilename.endsWith('.css');
    },
  },
  stats: 'errors-only',
};
