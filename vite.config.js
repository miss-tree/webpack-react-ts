import { ViteDevServer, createServer, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const fs = require('fs')
const path = require('path')
const ractRefresh = require('@vitejs/plugin-react-refresh')
const genericNames = require('generic-names')
const reactSvgPlugin = require('vite-plugin-react-svg')
const resolve = (url)=>path.resolve(__dirname,url)
// console.log('isDev:', process);
// const isDev = process.env.NODE_ENV ? 'development' : 'production'
// https://vitejs.dev/config/


const baseViteConfig = defineConfig({
  mode: 'development',
  root: './src/',// 设置根目录文件位置，默认为当前目录下 index.html
  base: './',
  // publicDir: './',
  server:{
    host:'0.0.0.0',// 公开 ip 访问服务
    port:3456,
    // 设置为 true 强制使依赖预构建，当依赖变化时，需要更新一下预构建依赖
    force:true
  },
  define:{// 定义全局变量
    'process.env':process.env, // 让客户端代码读取到 process.env
    'process.env.NODE_EVN':JSON.stringify('development')
  },
  css:{
    modules:{
      scopeBehaviour:'local',
      generateScopedName:function(name,fileName,css){
        // css-loader 的hash算法和 postcss-module-scope 不一致，导致服务端渲染和客户端不一致
        // 对齐 css-loader 与 postcss-module 的生成 hash 方式
        return genericNames('[name]-[loacl]--[hash:base58:5]',{
          context:process.cwd()
        })(name,fileName)
      }
    }
  },
  esbuild:{
    loader:'jsx',

    include:/src.*\.jsx?$/,
    exclude:[]
  },
  plugins: [
    react(),
    // 为了各种打包报错，也没有热加载功能，  ==>html模板中增加引入 RefreshRuntime
    // 更改代码后整页刷新  ===> 客户端入口增加 import.meta.hot.accept()
    ractRefresh(),

    // vite 支持 svg 组件
    reactSvgPlugin({
      // 使用 svg 组件方案
      defaultExport:'component',
      // 和 webpack 对齐 不进行 svgo 压缩
      svgo:false,

      // 配置 start ，生成的 svg 标签才会传递 props 变量
      expandProps:'start',
      // 可传入变量 ，通过 svg 标签支持 size、width、height、fill 属性
      svgProps:{
        height:'{props.size || props.height}',
        width:'{props.size || props.width}',
        fill:'{props.fill || "currentColor"}',
      }
    })
  ],
  optimizeDeps:{
    esbuildOptions:{
      plugins:[
        {
          // jsx 文件默认不走 jsx 编译，需要配置
          // https：//github.com/vitejs/vite/discussions/3448
          name:'load-js-files-as-jsx',
          setup(build){
            build.onLoad({ filter:/src.*\.jsx?$/},async args =>{
              return {
                loader:'jsx',
                contents:fs.readFileSync(args.path,'utf-8')
              }
            })
          }
        }
      ]
    },

    entries:resolve('./src/index.js'),

    // 如果依赖项大(很多模块，commonJs)，要包含它
    include:[],

    // 排除构建可以直接让浏览器加载的
    exclude:[]
  },
  resolve:{
    extensions:['.jsx','.js']
  },
  // 关闭 vite 清屏
  clearScreen:false
})

const viteExport = ViteDevServer(baseViteConfig)
export default viteExport
