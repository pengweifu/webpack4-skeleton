/*
* @Author: pengweifu
* @Date:   2018-08-29 23:16:24
* @Last Modified by:   pengweifu
* @Last Modified time: 2018-08-30 22:56:49
*/
const { resolve } = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const merge = require('webpack-merge');

const prodConfig = require('./prod.js');
const devConfig  = require('./dev.js');

const commonConfig = {
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
        }, {
          loader: 'eslint-loader',
        }],
      }, {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            url: false,
          }
        }],
      }, {
        test: /\.(png|jpg|jpeg|gif|bmp)(\?.+)?$/,
        include: [resolve(__dirname, '../src/assets')],
        exclude: [resolve(__dirname, '../public/static')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20480,
              name: '[name].[ext]',
              outputPath: 'img',
              // publicPath: argv.mode === 'production' ? '/static/img/' : '',
            },
          },
        ],
      }, {
        test: /\.(eot|ttf|woff|woff2|svg)(\?.+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: resolve(__dirname, '../public/static'),
      to: resolve(__dirname, '../dist/static'),
    }]),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.NamedModulesPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.css', '.less'],
    alias: {
      '@': resolve(__dirname, '../src'),
      'assets': resolve(__dirname, '../src/assets'),
    },
  },
};

module.exports = function(env, argv) {
  const config = argv.mode === 'production' ? prodConfig : devConfig;
  return merge(commonConfig, config);
};
