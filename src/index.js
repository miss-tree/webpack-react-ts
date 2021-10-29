
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css'
import './assets/scss/index.scss';

import App from '@/pages/App'

@log
class A {
  a = 1
}
const c = new A()
console.log('c.a', c.a);
function log (target) {
  console.log('target:', target);
}

ReactDOM.render(
  <App />,
  document.getElementById('App')
);