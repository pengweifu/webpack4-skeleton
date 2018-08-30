/*
* @Author: pengweifu
* @Date:   2018-08-29 23:16:24
* @Last Modified by:   pengweifu
* @Last Modified time: 2018-08-30 00:15:44
*/
const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: resolve(__dirname, '../dist'),
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  performance: {
    hints: false,
  },
  stats: 'errors-only',
  devServer: {
    contentBase: '../dist',
    hot: true,
    host: 'localhost',
    port: 8050,
    stats: 'errors-only',
    overlay: true,
  }
};
