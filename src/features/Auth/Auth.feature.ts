import { type IFeature } from '@/types'
import { FEATURE_NAME } from './Auth.model'
import { authRouter } from './Auth.router'

export const AuthFeature: IFeature = {
  title: FEATURE_NAME,

  router: authRouter,
}
