
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css'
import './assets/scss/index.scss';
const App = () => {
  return (
    <div className="title">你好呀111</div>
  )
}
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