import { supabase } from '@/app/imports/App.services'

const BUCKET_NAME = 'tierlist-previews'

export async function apiUploadPreview(
  tierlistId: string,
  file: File
): Promise<{ path: string; updatedAt: string }> {
  const filePath = `tierlists/${tierlistId}/preview.webp`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      upsert: true,
      contentType: 'image/webp',
    })

  if (error) throw new Error(error.message)

  const updatedAt = new Date().toISOString()

  return { path: filePath, updatedAt }
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
