import { lazy } from 'react';
import { RouteProps } from 'react-router-dom'

function importPath (path) {
  return lazy(() => import("../" + path))
  // return () => import("../" + path)
}
const routes = [
  {
    path: "/",
    // component: () => import('../pages/loader'),
    // component: importPath('pages/loader'),
    // redirect: '/react/',
    exact: true
  },
]

export default routes