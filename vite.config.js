import { ViteDevServer, createServer, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import ractRefresh from '@vitejs/plugin-react-refresh'
import genericNames from 'generic-names'
import reactSvgPlugin from 'vite-plugin-react-svg'

// import vitePluginHtml from 'vite-plugin-html';
const resolve = (url) => path.resolve(__dirname, url)
// https://vitejs.dev/config/

export default defineConfig({
  mode: 'development',
  // root: resolve('src'),// './src/index.html',// 设置根目录文件位置，默认为当前目录下 index.html

  base: './',
  server: {
    host: '0.0.0.0',// 公开 ip 访问服务
    port: 3456,
    open: true,

    // 设置为 true 强制使依赖预构建，当依赖变化时，需要更新一下预构建依赖
    force: true
  },
  define: {// 定义全局变量
    'process.env': process.env, // 让客户端代码读取到 process.env
    'process.env.NODE_EVN': JSON.stringify('development')
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
      generateScopedName: function (name, fileName, css) {
        // css-loader 的hash算法和 postcss-module-scope 不一致，导致服务端渲染和客户端不一致
        // 对齐 css-loader 与 postcss-module 的生成 hash 方式
        return genericNames('[name]-[loacl]--[hash:base58:5]', {
          context: process.cwd()
        })(name, fileName)
      }
    }
  },
  esbuild: {
    loader: 'jsx',
    /** 在使用 VUE 项目要使用下面两个注释熟悉 */
    // jsxFactory: 'h',
    // jsxFragment: 'Fragment',

    include: /src.*\.jsx?$/,
    exclude: []
  },
  build: {
    outDir: './public/',
    brotliSize: false,
    chunkSizeWarningLimit: 100 * 1024,
  },
  plugins: [
    react(),
    // 为了各种打包报错，也没有热加载功能，  ==>html模板中增加引入 RefreshRuntime
    // 更改代码后整页刷新  ===> 客户端入口增加 import.meta.hot.accept()
    // ractRefresh(),

    // vite 支持 svg 组件
    reactSvgPlugin({
      // 使用 svg 组件方案
      defaultExport: 'component',
      // 和 webpack 对齐 不进行 svgo 压缩
      svgo: false,

      // 配置 start ，生成的 svg 标签才会传递 props 变量
      expandProps: 'start',
      // 可传入变量 ，通过 svg 标签支持 size、width、height、fill 属性
      svgProps: {
        height: '{props.size || props.height}',
        width: '{props.size || props.width}',
        fill: '{props.fill || "currentColor"}',
      }
    }),
    // 替代html-webpack-plugin
    // vitePluginHtml({
    //   minify: true,
    //   inject: {
    //     injectData: {
    //       title: 'vite-react-example',
    //       injectScript: '<script src="/configs.js"></script>', // publicDir作为根目录
    //     },
    //     injectOptions: {
    //       filename: './index.html', // 模板页
    //     }
    //   },
    // }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          // jsx 文件默认不走 jsx 编译，需要配置
          // https：//github.com/vitejs/vite/discussions/3448
          name: 'load-js-files-as-jsx',
          setup (build) {
            build.onLoad({ filter: /src.*\.jsx?$/ }, async args => {
              return {
                loader: 'jsx',
                contents: fs.readFileSync(args.path, 'utf-8')
              }
            })
          }
        }
      ]
    },

    entries: resolve('./src/index.js'),

    // 如果依赖项大(很多模块，commonJs)，要包含它
    include: [],

    // 排除构建可以直接让浏览器加载的
    exclude: []
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  // 关闭 vite 清屏
  clearScreen: false
})

// const viteExport = ViteDevServer(baseViteConfig)
// export default viteExport
