const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin');
const portfinder = require('portfinder') //防止端口被占用 
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //清楚之前的打包文件
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 将public目录下的文件复制到dist文件夹
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin'); //压缩打包的css文件
const NODE_ENV = process.env.NODE_ENV
// 打包编译进度
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasureWebpackPlugin();
console.log("process.ENV", process.env.NODE_ENV);

/**
 * 多线程构建插件：thread-loader,parallel-webpack,HappyPack(已经不再维护，建议使用第一个)
 * 预编译资源模块 DLLPlugin 使用 webapck内置的插件DLLPlugin 进行分包，DllReferencePlugin 对 manifest.json 引用。
 */

const baseConfig = {
  mode: NODE_ENV == 'development' ? 'development' : 'production',
  entry: {
    app: ['./src/index.js'],
    library: [
      'vue',
      'vue-router'
    ],
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "dist")
  },
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      },
      {
        // 同时认识ts jsx js tsx 文件
        test: /\.(t|j)sx?$/,
        use: 'babel-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          {
            loader: 'resolve-url-loader',
            options: {
              keepQuery: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: 'asset/inline'
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      }
    ]
  },
  devServer: {
    // static允许我们在DevServer下访问该目录的静态资源
    // 简单理解来说 当我们启动DevServer时相当于启动了一个本地服务器
    // 这个服务器会同时以static-directory目录作为跟路径启动
    // 这样的话就可以访问到static/directory下的资源了
    static: {
      directory: path.join(__dirname, './public'),
    },
    port: 3333,
    // 是否开启代码压缩
    compress: true,
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    mainFiles: ['index', 'main'],
    // 由于 webpack 的解析顺序是从左到右，因此要将使用频率高的文件类型放在左侧
    extensions: ['.ts', '.tsx', '.scss', 'json', '.js'],
  },
  plugins: [
    /** 将 vue、vue-router等 基础包打包成一个文件。  */
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.join(__dirname, './DLL/[name].json')
    }),
    /** 将css文件处理 */
    new MiniCssExtractPlugin({
      filename: 'assets/[name].css',
    }),
    // 生成html名称为index.html
    // 生成使用的模板为public/index.html
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './public/index.html'),
    }),
    new CleanWebpackPlugin(),
    new OptimizeCssPlugin(),
    // 将public下的文件复制
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '*.js',
          context: path.resolve(rootDir, "public/js"),
          to: path.resolve(rootDir, 'dist/js'),
        },
        // {
        //   from: '*.html',
        //   context: path.resolve(rootDir, "public/"),
        //   to: path.resolve(rootDir, 'dist/'),
        // }
      ],
    })
  ]
}
/**判断端口是否被占用 */
async function isOccupy () {
  try {
    // 端口被占用时候 portfinder.getPortPromise 返回一个新的端口(往上叠加)
    const port = await portfinder.getPortPromise()
    baseConfig.devServer.port = port
    return baseConfig
  } catch (e) {
    throw new Error(e)
  }
}
let exportConfig = isOccupy()

module.exports = smp.wrap(exportConfig);


