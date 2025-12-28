import { Container, Paper, Stack, Title } from '@mantine/core'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPreviewUrl } from '../../Tierlist.storage'
import {
  selectPreviewUpload,
  selectTierlists,
  useTierlistStore,
} from '../../store/Tierlist.store'
import { TierlistPreviewUpload } from '../TierlistPreviewUpload/TierlistPreviewUpload'

export function EditTierlistPage() {
  const { id } = useParams<{ id: string }>()
  const tierlists = useTierlistStore(selectTierlists)
  const previewUpload = useTierlistStore(selectPreviewUpload)
  const uploadPreview = useTierlistStore((state) => state.uploadPreview)
  const resetPreviewUploadState = useTierlistStore(
    (state) => state.resetPreviewUploadState
  )

  const tierlist = tierlists.data?.find((t) => t.id === id)

  const currentPreviewUrl = tierlist
    ? getPreviewUrl(tierlist.preview_path, tierlist.preview_updated_at)
    : null

  const handleUpload = async (file: File | null) => {
    if (!id || !file) return

    try {
      await uploadPreview({ tierlistId: id, file })
    } catch {
      // Error handled by store
    }
  }

  useEffect(() => {
    return () => {
      resetPreviewUploadState()
    }
  }, [resetPreviewUploadState])

  if (!tierlist) {
    return <Container>Tierlist not found</Container>
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={2}>{tierlist.title}</Title>

        <Paper p="md" withBorder>
          <Stack gap="md">
            <Title order={4}>Preview Image</Title>
            <TierlistPreviewUpload
              tierlistId={tierlist.id}
              currentPreviewUrl={currentPreviewUrl}
              onUpload={handleUpload}
              isLoading={previewUpload.isLoading}
              error={previewUpload.error}
            />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
