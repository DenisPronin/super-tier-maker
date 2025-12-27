import type { FC, ReactNode } from 'react'
import type { IRouter } from './Route.types.ts'

export interface IFeature {
  title?: string

  router?: IRouter

  provider?: FC<{ children: ReactNode }>
}
