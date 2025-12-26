import { type IRouter } from '@/types'
import { AuthLayout } from './components/AuthLayout/AuthLayout'
import { AuthLogin } from './components/AuthLogin/AuthLogin'
import { AuthRegister } from './components/AuthRegister/AuthRegister'

export const authRouter: IRouter = {
  layout: {
    path: 'auth',
    element: AuthLayout,
  },
  routes: [
    {
      path: 'login',
      element: AuthLogin,
      private: false,
    },
    {
      path: 'register',
      element: AuthRegister,
      private: false,
    },
  ],
}
