import type { JSXElementConstructor } from 'react'

export interface IRoute {
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element: JSXElementConstructor<any>
  private?: boolean
}

export interface IRouter {
  routes: IRoute[]
  layout?: IRoute
}
