
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css'
import './assets/scss/index.scss';
import './assets/less/index.less';

import App from '@/pages/App'
// import App from './pages/App.tsx'

// @log
// class A {
//   a = 1
// }
// const c = new A()
// console.log('c.a', c.a);
// function log (target) {
//   console.log('target:', target);
// }
// const App = () => {
//   console.log("渲染App");
//   return (<div>hello world</div>)
// }

ReactDOM.render(
  <App />,
  document.getElementById('App')
);