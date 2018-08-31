# webpack 4.x 入门

>webpack都更新到4.17.x了，官网的文档有一部分还停留在4.x以下，因此写下这篇文章，以便后续遇到坑的时候再次抓耳挠腮。

## 目录结构

```
├── dist                      打包输出目录
├── node_modules              npm安装的依赖包目录
├── public                    静态资源目录
│   ├── static                第三方静态文件目录
│   │   └── images            静态图片目录
│   ├── favicon.ico           网页图标
│   └── index.html            入口html
├── src                       开发源代码目录
│   ├── assets                静态文件目录
│   │   ├── css               样式文件目录
│   │   ├── fonts             字体目录
│   │   ├── img               静态图片目录
│   │   └── js                公共函数目录
│   ├── components            可以复用的模块目录
│   ├── pages                 页面存放目录
│   └── index.js              入口js
├── webpack-config            webpack配置目录
│   ├── common.js             配置文件入口
│   ├── dev.js                开发环境配置
│   └── prod.js               生产环境配置
├── .eslintignore             ESlint忽略文件配置信息
├── .eslintrc.js              ESlint配置信息
├── babel.config.js           babel配置信息
└── package.json              项目配置信息
```

## 初始化项目

>npm init

按照提示配置项目的基础信息后，即可在项目文件夹下到生成了`package.json`文件。

## 用ESlint检查语法规范

首先安装必要的package

>npm i -D eslint eslint-config-airbnb-base babel-eslint eslint-loader eslint-plugin-html eslint-plugin-import

由于airbnb的规范过于严格，创建`.eslintrc.js`，创建自定义配置文件。

``` javascript
module.exports = {
  extends: "airbnb-base", // 继承airbnb的语法检测规则
  root: true,
  env: {
    node: true,
    browser: true,        // 检测环境基于浏览器,避免在调用window对象的时候报错
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'strict': 0,
    'no-param-reassign': ["error", {
      "props": false,               // 允许给函数的参数重新赋值
    }],
    'max-len': ["error", {
      "code": 240,                  // 允许单行代码最长为240个字符
    }],
    'no-plusplus': ["error", {
      "allowForLoopAfterthoughts": true, // 允许在for循环中用 i++写法
    }],
    'no-new': 'off',                     // 允许new Object()
    'class-methods-use-this': 'off',     // 允许class中的function内不使用this
    'import/no-unresolved': 0,           // 避免webpack指定alias，后eslint报错
  },
  plugins: [
    'html'
  ],
  parser: 'babel-eslint'
};
```

接下来创建`.eslintignore`，忽略开发时源代码之外的文件。

```
/node_modules/
/webpack-config/
/dist/
/public/
/static/
/*.js
```

## 安装webpack、babel和必要的webpack loader及webpack plugin

>npm i -D webpack webpack-cli webpack-dev-server "@babel/core" "@babel/plugin-syntax-dynamic-import" "@babel/plugin-transform-async-to-generator" "@babel/plugin-transform-regenerator" "@babel/plugin-transform-runtime" "@babel/preset-env" "@babel/runtime" babel-loader css-loader file-loader html-loader@next html-webpack-plugin@next less less-loader regenerator-runtime style-loader url-loader

`html-webpack-plugin@next` 安装最新的alpha版本是为了解决以下bug：

>Fail to inject code-splitting script files when webpack 4 optimization.splitChunks.name: false

`html-loader@next` 安装最新的alpha版本是因为webpack 4.x已经禁用了html-loader的htmlLoader选项，安装alpha版可以Disable HTML Assets。

## 配置webpack的开发环境

首先安装必要的package

>npm i -D copy-webpack-plugin friendly-errors-webpack-plugin webpack-merge

* `copy-webpack-plugin` 用来拷贝静态资源
* `friendly-errors-webpack-plugin` 能够更好在终端看到webapck运行的警告和错误
* `webpack-merge` 用来合并多个webpack的配置文件

然后创建配置文件`common.js`、`dev.js`、`prod.js`，`common.js`存放开发环境和生产环境公用的配置:

``` javascript
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
```

接下来配置开发环境`dev.js`:

``` javascript
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
```

修改`package.json`，添加script脚本：

``` json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --open --progress --config webpack-config/common.js",
    "build": "webpack --mode production --progress --config webpack-config/common.js"
  },
}
```

执行`npm run dev`就会看到浏览器自动加载页面，如果现在修改和保存任意源文件，web 服务器就会自动重新加载编译后的代码，这意味着开发环境就配置完成了。

## 写几个页面跑起来

开始撸页面代码，略过......

## 配置webpack的生产环境

首先安装必要的package

>npm i -D mini-css-extract-plugin uglifyjs-webpack-plugin optimize-css-assets-webpack-plugin clean-webpack-plugin

* `mini-css-extract-plugin` 从 bundle 中提取css到单独的文件
* `optimize-css-assets-webpack-plugin` 优化css打包
* `uglifyjs-webpack-plugin` 控制项目中 UglifyJS
* `clean-webpack-plugin` 清除上次打包的文件

编辑`prod.js`：

``` javascript
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
    publicPath: './static/', // 使用相对路径而不是绝对路径可以避免在hybird App框架中因为找不到路径报错
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
      root: resolve(__dirname, '../'), // 指定root可以避免由于清理目录超出根目录而跳过清理
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
```

执行`npm run build`，打包生产环境的代码。
