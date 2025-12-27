import { type IFeature } from '@/types'
import { FEATURE_NAME } from './Dashboard.model'
import { dashboardRouter } from './Dashboard.router'

export const DashboardFeature: IFeature = {
  title: FEATURE_NAME,
  router: dashboardRouter,
}
