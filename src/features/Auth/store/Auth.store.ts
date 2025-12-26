import { api } from '@/features/Network'
import { createStore, resetAllStores } from '@/features/Store'
import { apiAuthLogin } from '../Auth.api'
import { FEATURE_NAME } from '../Auth.model'
import { type AuthLoginRequest } from '../Auth.types'

type AuthState = {
  token: string | null
  loginError: string | null
  isLoginLoading: boolean

  login: (values: AuthLoginRequest) => Promise<void>
}

export const useAuthStore = createStore<AuthState>()(
  (set) => ({
    token: null,
    loginError: null,
    isLoginLoading: false,

    login: async (request: AuthLoginRequest) => {
      set({ isLoginLoading: true })
      try {
        const { token } = await apiAuthLogin(request)
        set({ token, loginError: null })
        api.setToken(token)
      } catch (err: unknown) {
        if (err instanceof Error) {
          set({ loginError: err.message })
        }
        throw err
      } finally {
        set({ isLoginLoading: false })
      }
    },
  }),
  {
    name: FEATURE_NAME,
    resettable: true,
    persistOptions: {
      name: FEATURE_NAME,
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state, error) => {
        if (error) return

        if (state?.token) {
          api.setToken(state.token)
        }
      },
    },
  }
)

export const logout = () => {
  resetAllStores()
  api.setToken(null)
}

api.setLogoutCallback(logout)

export const selectAuthIsLoggedIn = (state: AuthState) => !!state.token
