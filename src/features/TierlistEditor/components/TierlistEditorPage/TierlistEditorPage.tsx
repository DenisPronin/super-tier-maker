import { Alert, Center, Container, Loader, Stack } from '@mantine/core'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  selectError,
  selectIsLoading,
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'
import { TierlistHeader } from '../TierlistHeader/TierlistHeader'
import { TierlistMetaModal } from '../TierlistMetaModal/TierlistMetaModal'

export function TierlistEditorPage() {
  const { id } = useParams<{ id: string }>()
  const tierlist = useTierlistEditorStore(selectTierlist)
  const isLoading = useTierlistEditorStore(selectIsLoading)
  const error = useTierlistEditorStore(selectError)
  const loadTierlist = useTierlistEditorStore((state) => state.loadTierlist)
  const reset = useTierlistEditorStore((state) => state.reset)

  useEffect(() => {
    if (id) {
      loadTierlist(id)
    }

    return () => {
      reset()
    }
  }, [id, loadTierlist, reset])

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Error">
          {error}
        </Alert>
      </Container>
    )
  }

  if (!tierlist) {
    return (
      <Container size="md" py="xl">
        <Alert color="yellow" title="Not Found">
          Tierlist not found
        </Alert>
      </Container>
    )
  }

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        <TierlistHeader />
        {/* TODO: Add CategoryList */}
      </Stack>

      <TierlistMetaModal />
    </Container>
  )
}
