import { AuthFeature } from '@/features/Auth'
import { DbClientFeature } from '@/features/DbClient'
import { ThemeFeature } from '@/features/Theme'
import type { IFeature } from '@/types'

export const appFeatures: IFeature[] = [
  DbClientFeature, // Must be first - other features depend on it
  ThemeFeature,
  AuthFeature,
]
