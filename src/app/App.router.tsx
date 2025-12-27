import type { IRouter } from '@/types'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { appFeatures } from './App.features'
import { AuthProtected } from './imports/App.components'

function getRouters() {
  const routers: IRouter[] = []
  appFeatures.forEach((feature) => {
    if (feature.router) {
      routers.push(feature.router)
    }
  })

  return routers
}

const routers = getRouters()

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          {routers.map((router) => {
            const routes = router.routes.map((route) => {
              const element = route.private ? (
                <AuthProtected>
                  <route.element />
                </AuthProtected>
              ) : (
                <route.element />
              )

              return (
                <Route key={route.path} path={route.path} element={element} />
              )
            })

            if (!router.layout) {
              return routes
            }

            return (
              <Route
                key={router.layout.path}
                path={router.layout.path}
                element={<router.layout.element />}
              >
                {routes}
              </Route>
            )
          })}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
