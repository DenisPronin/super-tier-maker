import type { Nullish } from '@/types'

export const FEATURE_NAME = 'auth'

export function validateUserNameOrEmail(value: string): Nullish<string> {
  const isUsernameValid = /^[a-zA-Z0-9_]+$/.test(value)
  const isEmailValid = /^\S+@\S+$/.test(value)
  if (!isUsernameValid && !isEmailValid) {
    return 'Invalid username or email'
  }

  return null
}

export function validatePassword(value: string): Nullish<string> {
  if (value.length < 3) {
    return 'Password is too short'
  }

  return null
}
