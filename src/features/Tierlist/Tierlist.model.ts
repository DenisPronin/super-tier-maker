import { supabase } from '@/app/imports/App.services'
import type { Nullish } from '@/types'

export const FEATURE_NAME = 'tierlist'
const BUCKET_NAME = 'tierlist-previews'

export function validateTitle(value: string): Nullish<string> {
  const trimmed = value.trim()
  if (trimmed.length < 3) return 'Title must be at least 3 characters'
  if (trimmed.length > 100) return 'Title must be at most 100 characters'
  return null
}

export function getPreviewUrl(
  previewPath: string | null,
  previewUpdatedAt: string | null
): string | null {
  if (!previewPath) return null

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(previewPath)

  if (!data.publicUrl) return null

  const cacheBuster = previewUpdatedAt
    ? `?v=${new Date(previewUpdatedAt).getTime()}`
    : ''

  return `${data.publicUrl}${cacheBuster}`
}
