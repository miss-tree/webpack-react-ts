import { lazy } from 'react';
import { RouteProps } from 'react-router-dom'

function importPath(path: String): any {
  return lazy(() => import("../" + path))
  // return () => import("../" + path)
}
const routes: RouteProps[] = [
  {
    path: "/",
    // component: () => import('../pages/loader'),
    component: importPath('pages/loader'),
    // redirect: '/react/',
    exact: true
  },
]

export default routes