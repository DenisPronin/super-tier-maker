import { LayoutMain } from '@/app/imports/App.components'
import { type IRouter } from '@/types'

export const tierlistRouter: IRouter = {
  layout: {
    path: 'app',
    element: LayoutMain,
  },
  routes: [
    {
      path: 'tierlist/:id/edit',
      element: () => <div>Editor Page (TODO)</div>,
      private: true,
    },
  ],
}
