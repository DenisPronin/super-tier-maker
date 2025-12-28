import { LayoutMain } from '@/app/imports/App.components'
import { type IRouter } from '@/types'
import { EditTierlistPage } from './components/EditTierlistPage/EditTierlistPage'

export const tierlistRouter: IRouter = {
  layout: {
    path: 'app',
    element: LayoutMain,
  },
  routes: [
    {
      path: 'tierlist/:id/edit',
      element: EditTierlistPage,
      private: true,
    },
    {
      path: 'tierlist/:id/play',
      element: () => <div>Play Mode (TODO)</div>,
      private: true,
    },
  ],
}
