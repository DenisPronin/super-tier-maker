import { LayoutMain } from '@/app/imports/App.components'
import { type IRouter } from '@/types'
import { DashboardPage } from './pages/DashboardPage'

export const dashboardRouter: IRouter = {
  layout: {
    path: 'app',
    element: LayoutMain,
  },
  routes: [
    {
      path: 'dashboard',
      element: DashboardPage,
      private: true,
    },
  ],
}
