import { TierlistMetaForm } from '@/app/imports/App.components'
import { apiUpdateTierListPreview } from '@/features/Tierlist/Tierlist.api'
import { Button, Modal, Stack } from '@mantine/core'
import { useCallback, useEffect } from 'react'
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
  const metaUpdate = useTierlistEditorStore((state) => state.metaUpdate)

  const handleSubmit = useCallback(
    async (
      values: { title: string; description: string },
      previewFile: File | null
    ) => {
      if (!tierlist) return

      try {
        await updateMeta({
          title: values.title,
          description: values.description,
        })

        if (previewFile) {
          await apiUpdateTierListPreview(tierlist.id, previewFile)
        }
      } catch {
        return
      }
    },
    [tierlist, updateMeta]
  )

  const handleClose = useCallback(() => {
    closeModal()
  }, [closeModal])

  useEffect(() => {
    if (metaUpdate.isSuccess) {
      handleClose()
    }
  }, [metaUpdate.isSuccess, handleClose])

  if (!tierlist) return null

  const previewUrl = getPreviewUrl(
    tierlist.preview_path,
    tierlist.preview_updated_at
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
          title: tierlist.title,
          description: tierlist.meta.description || '',
        }}
        currentPreviewUrl={previewUrl}
        tierlistId={tierlist.id}
        onSubmit={handleSubmit}
        isLoading={metaUpdate.isLoading}
        error={metaUpdate.error}
      >
        <Stack gap="xs">
          <Button type="submit" loading={metaUpdate.isLoading} fullWidth>
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
