import { Center, Loader } from '@mantine/core'
import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { selectAuthIsLoggedIn, useAuthStore } from '../../store/Auth.store'

export function AuthProtected({ children }: { children: ReactNode }) {
  const isLoggedIn = useAuthStore(selectAuthIsLoggedIn)
  const isLoginLoading = useAuthStore((state) => state.isLoginLoading)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  if (!isInitialized || isLoginLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}
