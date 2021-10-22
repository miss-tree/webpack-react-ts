
import React from 'react';
import ReactDOM from 'react-dom';

import App from './pages/loader.jsx';
// import './assets/css/index.css';
// const App = () => {
//   console.log("你好，webpack ==22212312211");
//   return (
//     <div className="sjjh">你好呀</div>
//   )
// }

// 加快react运行速度的一个js文件
// import * as serviceWorker from './serviceWorker';
// import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
  <App />,
  document.getElementById('App')
);
// serviceWorker.unregister()