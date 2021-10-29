import { ViteDevServer, createServer, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// console.log('isDev:', process);
// const isDev = process.env.NODE_ENV ? 'development' : 'production'
// https://vitejs.dev/config/


const baseViteConfig = defineConfig({
  mode: 'development',
  root: './src/',// 设置根目录文件位置，默认为当前目录下 index.html
  base: './',
  // publicDir: './',
  plugins: [react()]
})

export default ViteDevServer(baseViteConfig)
