import { AuthFeature } from '@/features/Auth'
import { DashboardFeature } from '@/features/Dashboard'
import { DbClientFeature } from '@/features/DbClient'
import { LayoutFeature } from '@/features/Layout'
import { ThemeFeature } from '@/features/Theme'
import { TierlistFeature } from '@/features/Tierlist'
import { TierlistEditorFeature } from '@/features/TierlistEditor'
import type { IFeature } from '@/types'

export const appFeatures: IFeature[] = [
  DbClientFeature, // Must be first - other features depend on it
  ThemeFeature,
  LayoutFeature,
  AuthFeature,
  TierlistFeature,
  TierlistEditorFeature,
  DashboardFeature,
]
