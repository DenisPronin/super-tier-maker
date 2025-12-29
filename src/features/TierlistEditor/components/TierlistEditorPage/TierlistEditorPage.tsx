import { Alert, Box, Center, Loader, Stack } from '@mantine/core'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  selectError,
  selectIsLoading,
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'
import { CandidateBulkImportModal } from '../Candidates/CandidateBulkImportModal/CandidateBulkImportModal'
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
      <Box p="md">
        <Alert color="red" title="Error">
          {error}
        </Alert>
      </Box>
    )
  }

  if (!tierlist.data) {
    return (
      <Box p="md">
        <Alert color="yellow" title="Not Found">
          Tierlist not found
        </Alert>
      </Box>
    )
  }

  return (
    <Box p="md">
      <Stack gap="lg">
        <TierlistHeader />

        <CategoryList />

        <UnplacedCandidatesList />
      </Stack>

      <TierlistMetaModal />
      <CategoryModal />
      <CandidateModal />
      <CandidateBulkImportModal />
    </Box>
  )
}
