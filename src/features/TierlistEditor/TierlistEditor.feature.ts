import { type IFeature } from '@/types'
import { FEATURE_NAME } from './TierlistEditor.model'
import { tierlistEditorRouter } from './TierlistEditor.router'

export const TierlistEditorFeature: IFeature = {
  title: FEATURE_NAME,
  router: tierlistEditorRouter,
}
