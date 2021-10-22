const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const portfinder = require('portfinder') // 防止端口被占用 
const TerserPlugin = require("terser-webpack-plugin");
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasureWebpackPlugin();

const isDev = process.env.NODE_ENV === 'development'
const PORT = process.env.PORT
console.log("process.ENV", process.env.NODE_ENV, PORT);

const Plugins = require('./webpack.plugin')
const Module = require('./webpack.module')
/**
 * 多线程构建插件：thread-loader,parallel-webpack,HappyPack(已经不再维护，建议使用第一个)
 * 预编译资源模块 DLLPlugin 使用 webapck内置的插件DLLPlugin 进行分包，DllReferencePlugin 对 manifest.json 引用。
 */

const baseConfig = {
  mode: isDev ? 'development' : 'production',
  entry: {
    index: './src/index.js',
    // library: [
    //   'vue',
    //   'vue-router'
    // ],
  },
  output: {
    filename: isDev ? "js/[name].js" : "js/[name]_[hash].js",
    path: path.resolve(__dirname, "dist"),
    // clean: !isDev
  },
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  devServer: {
    // static允许我们在DevServer下访问该目录的静态资源
    // 简单理解来说 当我们启动DevServer时相当于启动了一个本地服务器
    // 这个服务器会同时以static-directory目录作为跟路径启动
    // 这样的话就可以访问到static/directory下的资源了
    static: {
      directory: path.join(__dirname, './public'),
    },
    port: PORT || 8088,
    // 是否开启代码压缩
    compress: true,
    hot: true,
    open: !isDev
  },
  /** externals
   * 分包，不编译进打包文件
   * 在index.html正常的引入 cdn 资源即可
   * <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
   * 依然可以使用import的方式引入
   * 可以使用插件 html-webpack-externals-plugin
  */
  // externals: {
  //   'vue': 'Vue',
  //   'vue-router': 'VueRouter'
  // },
  // 抽取第三方模块
  optimization: {
    minimize: !isDev, // 开启代码压缩
    minimizer: [
      new TerserPlugin({
        // test: /\.js(\?.*)?$/i,
        include: './src',
        parallel: 4,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          test: /node_modules/,
          priority: 1
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    mainFiles: ['index', 'main'],
    // 解析后缀 由于 webpack 的解析顺序是从左到右，因此要将使用频率高的文件类型放在左侧
    extensions: ['.ts', '.tsx', '.scss', 'json', '.js'],
  },
  module: Module,
  plugins: Plugins
}
/** 判断端口是否被占用 */
// async function isOccupy () {
//   try {
//     // 端口被占用时候 portfinder.getPortPromise 返回一个新的端口(往上叠加)
//     const port = await portfinder.getPortPromise()
//     baseConfig.devServer.port = port
//     return baseConfig
//   } catch (e) {
//     throw new Error(e)
//   }
// }
// const exportConfig = isOccupy()

module.exports = smp.wrap(baseConfig);


