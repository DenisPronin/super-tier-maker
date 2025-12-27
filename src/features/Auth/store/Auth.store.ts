import { supabase } from '@/features/DbClient'
import { createStore, resetAllStores } from '@/features/Store'
import type { Session, User } from '@supabase/supabase-js'
import {
  apiAuthSignIn,
  apiAuthSignInWithGoogle,
  apiAuthSignOut,
  apiAuthSignUp,
} from '../Auth.api'
import { FEATURE_NAME } from '../Auth.model'
import type { AuthEmailLoginRequest, AuthRegisterRequest } from '../Auth.types'

type AuthState = {
  user: User | null
  session: Session | null
  loginError: string | null
  isLoginLoading: boolean

  login: (values: AuthEmailLoginRequest) => Promise<void>
  signUp: (values: AuthRegisterRequest) => Promise<void>
  signInWithGoogle: () => Promise<void>
}

export const useAuthStore = createStore<AuthState>()(
  (set) => ({
    user: null,
    session: null,
    loginError: null,
    isLoginLoading: false,

    login: async (request: AuthEmailLoginRequest) => {
      set({ isLoginLoading: true, loginError: null })
      try {
        const response = await apiAuthSignIn(request)
        if (response.error) {
          throw response.error
        }
        // Auth state will be updated via onAuthStateChange listener
      } catch (err: unknown) {
        if (err instanceof Error) {
          set({ loginError: err.message })
        }
        throw err
      } finally {
        set({ isLoginLoading: false })
      }
    },

    signUp: async (request: AuthRegisterRequest) => {
      set({ isLoginLoading: true, loginError: null })
      try {
        const response = await apiAuthSignUp(request)
        if (response.error) {
          throw response.error
        }
        // Auth state will be updated via onAuthStateChange listener
      } catch (err: unknown) {
        if (err instanceof Error) {
          set({ loginError: err.message })
        }
        throw err
      } finally {
        set({ isLoginLoading: false })
      }
    },

    signInWithGoogle: async () => {
      set({ isLoginLoading: true, loginError: null })
      try {
        await apiAuthSignInWithGoogle()
        // OAuth redirects, no need to update state here
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
    // No persistOptions - Supabase handles session persistence automatically
  }
)

// Initialize auth state from Supabase
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.setState({
    session,
    user: session?.user ?? null,
  })
})

// Listen to auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({
    session,
    user: session?.user ?? null,
  })
})

export const logout = async () => {
  await apiAuthSignOut()
  resetAllStores()
}

export const selectAuthIsLoggedIn = (state: AuthState) => !!state.user
