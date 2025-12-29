import { LayoutMain } from '@/app/imports/App.components'
import { type IRouter } from '@/types'
import { TierlistEditorPage } from './components/TierlistEditorPage/TierlistEditorPage'

export const tierlistEditorRouter: IRouter = {
  layout: {
    path: 'app',
    element: LayoutMain,
  },
  routes: [
    {
      path: 'tierlist/:id/edit',
      element: TierlistEditorPage,
      private: true,
    },
  ],
}
