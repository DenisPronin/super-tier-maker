import { LayoutMain } from '@/app/imports/App.components'
import { type IRouter } from '@/types'

export const tierlistRouter: IRouter = {
  layout: {
    path: 'app',
    element: LayoutMain,
  },
  routes: [
    {
      path: 'tierlist/:id/play',
      element: () => <div>Play Mode (TODO)</div>,
      private: true,
    },
  ],
}
