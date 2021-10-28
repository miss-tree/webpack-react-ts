
const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 清除之前的打包文件
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 将public目录下的文件复制到dist文件夹
// 动态添加CDN
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
// 去除无用的样式
const glob = require('glob');
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩打包的css文件
// 打包编译进度
const isDev = process.env.NODE_ENV === 'development'

const BasePlugin = [
  /** 将 vue、vue-router等 基础包打包成一个文件。 https://webpack.docschina.org/plugins/dll-plugin/ */
  // new webpack.DllPlugin({
  //   name: '[name]_[hash]',
  //   path: path.join(__dirname, './DLL/[name].json'),
  //   /** entryOnly为true,否则 DLL 中的 tree shaking 将无法工作，因为所有 exports 均可使用 */
  //   entryOnly: true,
  // }),
  /** 获取动态链接的仓库 eg：vue、react ，没有就再次编译文件 */
  // new webpack.DllReferencePlugin({
  //   context: '.',
  //   manifest: path.resolve(__dirname, 'dist/dll/library_dll.json')
  // }),
  /** 将css文件处理 */
  new MiniCssExtractPlugin({
    filename: 'css/[name].css'
  }),
  // 生成html名称为index.html
  // 生成使用的模板为public/index.html
  new HtmlWebpackPlugin({
    title: 'webpack-react-ts',
    filename: 'index.html',
    inject: 'body',
    // publicPath: path.resolve(__dirname, './dist/'),
    template: path.resolve(__dirname, './src/index.html'),
  }),
  // 去除无用的样式
  new PurgecssWebpackPlugin({
    // paths表示指定要去解析的文件名数组路径
    // Purgecss会去解析这些文件然后把无用的样式移除
    // glob.sync('./src/**/*', {nodir: true}
    // 同步查找src目录下的任意文件夹下的任意文件
    // 返回一个数组，如['真实路径/src/css/style.css','真实路径/src/index.js',...]
    // {nodir: true}表示不包含文件夹，加快查找速度
    paths: glob.sync('./src/**/*', { nodir: true })
  }),
  /** 定义全局变量 可以在页面访问到 */
  // new webpack.DefinePlugin({
  //   DEV:JSON.stringify('development')
  // }),
  /** 热更新 */
  new webpack.HotModuleReplacementPlugin()
  /**
   new HtmlWebpackExternalsPlugin({
     externals: [
       {   // 引入的模块
         module: 'jquery',
         // cdn的地址
         entry: 'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js',
         // 挂载到了window上的名称
         // window.jQuery就可以全局使用
         global: 'jQuery'
       },
       {
         module: 'vue',
         entry: 'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
         global: 'Vue'
       }
     ]
   })
   */

]
if (!isDev) {
  const prodPlugins = [
    // 压缩样式
    new OptimizeCssPlugin({
      assetNameRegExp: /\.css$/g, /** 匹配css文件 */
      cssProcessor: require('cssnano'), /** 压缩插件 */
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true/** *配置插件是否可以将消息打印到控制台 */
    }),
    /** 要删除的正是output.path */
    new CleanWebpackPlugin(),
    // 将public下的文件复制,例如是静态资源，直接引入到index.html的
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '*.js',
          context: path.resolve(__dirname, "public/js"),
          to: path.resolve(__dirname, 'dist/js'),
        },
        // {
        //   from: '*.html',
        //   context: path.resolve(rootDir, "public/"),
        //   to: path.resolve(rootDir, 'dist/'),
        // }
      ],
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://cdn.bootcdn.net/ajax/libs/react/17.0.2/cjs/react.production.min.js',
          global: 'React'
        }
      ]
    })
  ]
  BasePlugin.concat(prodPlugins)
}


module.exports = BasePlugin