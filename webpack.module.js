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