
import React, { Suspense } from 'react';
import { HashRouter as Router, Route, } from "react-router-dom";
import routes from "@/router/index"
import loader from "./loader.jsx"
import ts from "./typeScript.jsx"

const App = () => {
  console.log('APP页面')
  return (
    // <div className="title">你好呀111</div>
    <Router>
      {/* 变更内容  实现多个优先级 */}
      <Suspense fallback={<div>
        加载中！请耐心等待。。。
      </div>}>
        <Route path='/' exact
          component={loader} />
        <Route path='/list' component={ts} />
        {/* {
          routes.map((route: any, key: any) => {
            if (route.exact) {
              return <Route key={key} exact path={route.path}
                render={(props: any) => (
                  <route.component {...props} routes={route.routes} />
                )}
              />
            } else {
              return <Route key={key} path={route.path}
                render={(props: any) => (
                  <route.component {...props} routes={route.routes} />
                )}
              />
            }
          })
        } */}
      </Suspense>
    </Router>

  )
}

export default App