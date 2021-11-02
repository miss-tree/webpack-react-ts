import { lazy } from 'react';
import pagesLoder from '@/pages/loader.jsx'
// import { RouteProps } from 'react-router-dom'

function importPath (path) {
  return lazy(() => import(/* @vite-ignore */"../" + path))
}
const routes = [
  {
    path: "/",
    // component: () => import('@/pages/loader.jsx'),
    component: pagesLoder,
    // component: importPath('pages/loader'),
    exact: true
  },
]

export default routes