import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { selectAuthIsLoggedIn, useAuthStore } from '../../store/Auth.store'

export function AuthProtected({ children }: { children: ReactNode }) {
  const isLoggedIn = useAuthStore(selectAuthIsLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}
