import { Alert, Center, Container, Loader, Stack } from '@mantine/core'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  selectError,
  selectIsLoading,
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'
import { CandidateModal } from '../Candidates/CandidateModal/CandidateModal'
import { UnplacedCandidatesList } from '../Candidates/UnplacedCandidatesList/UnplacedCandidatesList'
import { CategoryList } from '../TierlistEditorCategories/CategoryList/CategoryList'
import { CategoryModal } from '../TierlistEditorCategories/CategoryModal/CategoryModal'
import { TierlistHeader } from '../TierlistHeader/TierlistHeader'
import { TierlistMetaModal } from '../TierlistMetaModal/TierlistMetaModal'

export function TierlistEditorPage() {
  const { id } = useParams<{ id: string }>()
  const tierlist = useTierlistEditorStore(selectTierlist)
  const isLoading = useTierlistEditorStore(selectIsLoading)
  const error = useTierlistEditorStore(selectError)
  const loadEditor = useTierlistEditorStore((state) => state.loadEditor)
  const reset = useTierlistEditorStore((state) => state.reset)

  useEffect(() => {
    if (id) {
      loadEditor(id)
    }

    return () => {
      reset()
    }
  }, [id, loadEditor, reset])

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

  if (!tierlist.data) {
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

        <CategoryList />

        <UnplacedCandidatesList />
      </Stack>

      <TierlistMetaModal />
      <CategoryModal />
      <CandidateModal />
    </Container>
  )
}
