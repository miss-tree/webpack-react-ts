const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


const Module = {
  /**
    // 不去解析jquery或lodash中的依赖库
  noParse: /jquery|lodash/,
  */
  rules: [
    {
      test: /\.(js|jsx)$/,
      use: 'babel-loader',
      include: [path.resolve(__dirname, 'src')],
    },
    {
      // 同时认识ts jsx js tsx 文件
      test: /\.(t|j)sx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [ // babel-loader 将ES6-->ES5
            "@babel/preset-env",
            "@babel/preset-react"
          ],
          plugins: [
            ['@babel/plugin-proposal-decorators', { 'legacy': true }]
          ]
        }
      },
      include: [path.resolve(__dirname, 'src')],
      exclude: /node_modules/,
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        // 'style-loader', // 把css 插入 header标签中
        'css-loader',  // 解析 @important 语法或路径
        'postcss-loader',
        // {  // 'postcss-loader', // 兼容浏览器
        //   loader: 'postcss-loader', // 跟MiniCssExtractPlugin.loader一起使用时 要添加 使用范围
        //   options: {
        //     plugins: [
        //       require('autoprefixer')({
        //         overrideBrowserslist: ['last 5 version', '>1%', 'ios 7']
        //       })
        //     ]
        //   }
        // },
      ]
    },
    {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader', // 把css 插入 header标签中
        },
        // 'postcss-loader', // 兼容浏览器
        'css-loader',  // 解析 @important 语法或路径
        'less-loader', // 先解析 less 成css，再处理后续
      ]
    },
    {
      test: /\.(sa|sc)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        // 'postcss-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          },
        },
      ],
      include: [path.resolve(__dirname, 'src')],
    },
    {
      test: /\.(png|jpe?g|svg|gif)$/,
      type: 'asset/inline', /** 已经内置不需要引入loader */
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: "img/",
            name: "[name]-[hash:6].[ext]"
          }
        },
        // 图片压缩
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 65
            },
            // optipng.enabled: false will disable optipng
            optipng: {
              enabled: false,
            },
            pngquant: {
              quality: '65-90',
              speed: 4
            },
            gifsicle: {
              interlaced: false,
            },
            // the webp option will enable WEBP
            webp: {
              quality: 75
            }
          }
        }
      ]
    },
    {
      test: /\.(eot|ttf|woff|woff2)$/,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[hash][ext][query]',
      },
    }
  ]
}


module.exports = Module