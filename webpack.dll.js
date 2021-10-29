const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    library: [
      'react',
      "react-dom",
      'react-router',
    ]
  },
  output: {
    filename: '[name]_dll.js',
    path: path.join(__dirname, 'DLL'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_dll', // 要与ouput的filename一致
      path: path.join(__dirname, 'DLL', '[name]_dll.json'),
      /** entryOnly为true,否则 DLL 中的 tree shaking 将无法工作，因为所有 exports 均可使用 */
      entryOnly: true,
    })
  ]
}

