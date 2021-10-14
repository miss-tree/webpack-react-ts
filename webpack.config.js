const path = require("path");
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV
// 打包编译进度
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasureWebpackPlugin();
console.log("process.ENV", process.env.NODE_ENV);

/**
 * 多线程构建插件：thread-loader,parallel-webpack,HappyPack(已经不再维护，建议使用第一个)
 * 预编译资源模块 DLLPlugin 使用 webapck内置的插件DLLPlugin 进行分包，DllReferencePlugin 对 manifest.json 引用。
 */

module.exports = smp.wrap({
  mode: NODE_ENV == 'development' ? 'development' : 'production',
  entry: {
    app: ['./src/index.js'],
    library: [
      'vue',
      'vue-router'
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: []
      }
    ]
  },
  devServer: {
    port: 3333,
    hot: true
  },
  /** externals
   * 分包，不编译进打包文件
   * 在index.html正常的引入 cdn 资源即可
   * <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
   * 依然可以使用import的方式引入
  */
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter'
  },
  plugins: [
    /** 将 vue、vue-router等 基础包打包成一个文件。  */
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.join(__dirname, './DLL/[name].json')
    })
  ]
});


