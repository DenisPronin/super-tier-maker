import type { Nullish } from '@/types'

export const FEATURE_NAME = 'tierlist'

export function validateTitle(value: string): Nullish<string> {
  const trimmed = value.trim()
  if (trimmed.length < 3) return 'Title must be at least 3 characters'
  if (trimmed.length > 100) return 'Title must be at most 100 characters'
  return null
}
