import { type IFeature } from '@/types'
import { FEATURE_NAME } from './Tierlist.model'
import { tierlistRouter } from './Tierlist.router'

export const TierlistFeature: IFeature = {
  title: FEATURE_NAME,
  router: tierlistRouter,
}
