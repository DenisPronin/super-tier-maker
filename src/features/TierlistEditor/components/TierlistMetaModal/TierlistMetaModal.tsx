import { TierlistMetaForm } from '@/app/imports/App.components'
import { apiUpdateTierListPreview } from '@/features/Tierlist/Tierlist.api'
import { Button, Modal, Stack } from '@mantine/core'
import { useCallback, useState } from 'react'
import {
  selectIsMetaModalOpen,
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'

function getPreviewUrl(
  previewPath: string | null,
  previewUpdatedAt: string | null
): string | null {
  if (!previewPath) return null

  const cacheBuster = previewUpdatedAt
    ? `?v=${new Date(previewUpdatedAt).getTime()}`
    : ''

  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/tierlist-previews/${previewPath}${cacheBuster}`
}

export function TierlistMetaModal() {
  const isOpen = useTierlistEditorStore(selectIsMetaModalOpen)
  const tierlist = useTierlistEditorStore(selectTierlist)
  const closeModal = useTierlistEditorStore((state) => state.closeMetaModal)
  const updateMeta = useTierlistEditorStore((state) => state.updateMeta)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    closeModal()
    setError(null)
  }, [closeModal])

  const handleSubmit = useCallback(
    async (
      values: { title: string; description: string },
      previewFile: File | null
    ) => {
      if (!tierlist.data) return

      setIsLoading(true)
      setError(null)

      try {
        await updateMeta({
          title: values.title,
          description: values.description,
        })

        if (previewFile) {
          await apiUpdateTierListPreview(tierlist.data.id, previewFile)
        }

        handleClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    },
    [tierlist, updateMeta, handleClose]
  )

  if (!tierlist.data) return null

  const previewUrl = getPreviewUrl(
    tierlist.data.preview_path,
    tierlist.data.preview_updated_at
  )

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title="Edit Tier List"
      size="md"
    >
      <TierlistMetaForm
        initialValues={{
          title: tierlist.data.title,
          description: tierlist.data.meta.description || '',
        }}
        currentPreviewUrl={previewUrl}
        tierlistId={tierlist.data.id}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      >
        <Stack gap="xs">
          <Button type="submit" loading={isLoading} fullWidth>
            Save
          </Button>
          <Button variant="subtle" onClick={handleClose} fullWidth>
            Cancel
          </Button>
        </Stack>
      </TierlistMetaForm>
    </Modal>
  )
}
