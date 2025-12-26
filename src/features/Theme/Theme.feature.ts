import { type IFeature } from '@/types'
import { FEATURE_NAME } from './Theme.model'
import { ThemeProvider } from './Theme.provider'

export const ThemeFeature: IFeature = {
  title: FEATURE_NAME,

  provider: ThemeProvider,
}
