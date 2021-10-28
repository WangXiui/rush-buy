/**
 * @name: webpack.config
 * @author: 72079750
 * @date: 2021/3/19 10:05
 * @description：webpack.config
 * @update: 2021/3/19 10:05
 */
const CopyPlugin = require('copy-webpack-plugin')
const ExtensionReloader = require('@drmikecrowe/webpack-extension-reloaderv5')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ejs = require('ejs')
const webpack = require('webpack')
const {
  VueLoaderPlugin
} = require('vue-loader')
const {
  version
} = require('./package.json')
const path = require('path')

const config = {
  mode: process.env.NODE_ENV,
  // context为上下文路径
  context: path.resolve(__dirname, './src'),
  // 单入口可以使用：entry：'./index.js',但是output.filename为默认名称。也可以设置output.filename=build.js
  // 多入口的话entry可以使用对象，output设置为filename: "[name].js",然后每个key都会自定义为output.filename的文件名称
  entry: {
    background: './background.js',
    'popup/content': './popup/content.js',
    // 注意左侧不仅为output输出文件名，还包含了文件输出路径
    'popup/popup': './popup/popup.js',
  },
  output: {
    // path必须是绝对路径
    path: path.resolve(__dirname, './dist'),
    // filename可以设置固定名称build.js，也可以设置为[name].js
    filename: '[name].js'
  },
  // 使用resolve可以省略文件书写后缀
  resolve: {
    extensions: ['.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader' // 如果有.babelrc 文件则参数 .babelrc 文件规则
        }
      },
      // 因为在.babelrc内添加了element插件相关的配置，所以需要css-loader、babel-loader、字体ttf\woff以及图片png\jpg\svg等相关的配置
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          outputPath: '/images/',
          emitFile: true,
          esModule: false
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          outputPath: '/fonts/',
          emitFile: true,
          esModule: false
        }
      }

    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      global: 'window'
    }),
    // 使用vue-loader需要先在此处注入实例
    new VueLoaderPlugin(),
    // scss转化css插件，未安装的话scss文件不生效
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'icons',
          to: 'icons',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['icon.xcf']
          }
        },
        {
          from: 'popup/popup.html',
          to: 'popup/popup.html',
          transform: transformHtml
        },
        {
          from: 'manifest.json',
          to: 'manifest.json',
          transform: (content) => {
            const jsonContent = JSON.parse(content)
            jsonContent.version = version

            if (config.mode === 'development') {
              jsonContent['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
            }

            return JSON.stringify(jsonContent, null, 2)
          }
        }
      ]
    })
  ]
}

if (config.mode === 'production') {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ])
}

if (process.env.HMR === 'true') {
  config.plugins = (config.plugins || []).concat([
    new ExtensionReloader({
      manifest: path.resolve(__dirname, './src/manifest.json')
    })
  ])
}

function transformHtml (content) {
  return ejs.render(content.toString(), {
    ...process.env
  })
}

module.exports = config
