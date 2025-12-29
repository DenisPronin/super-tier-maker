import { Button, Flex, Group, Stack, Text, Title } from '@mantine/core'
import { IconFileImport, IconPlus } from '@tabler/icons-react'
import { useShallow } from 'zustand/react/shallow'
import {
  selectUnplacedCandidates,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import type { Candidate } from '../../../TierlistEditor.types'
import { CandidateCard } from '../CandidateCard/CandidateCard'

export function UnplacedCandidatesList() {
  const unplacedCandidates = useTierlistEditorStore(
    useShallow(selectUnplacedCandidates)
  )
  const openCandidateModal = useTierlistEditorStore(
    (state) => state.openCandidateModal
  )
  const openCandidateViewModal = useTierlistEditorStore(
    (state) => state.openCandidateViewModal
  )
  const openBulkImportModal = useTierlistEditorStore(
    (state) => state.openBulkImportModal
  )

  const handleCandidateClick = (candidate: Candidate) => {
    openCandidateViewModal(candidate.id)
  }

  const handlePlayClick = (candidate: Candidate) => {
    if (candidate.url) {
      window.open(candidate.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Group gap="xs">
          <Title order={4}>Candidates</Title>
          <Text size="sm" c="dimmed">
            ({unplacedCandidates.length})
          </Text>
        </Group>

        <Group gap="xs">
          <Button
            leftSection={<IconFileImport size={18} />}
            onClick={() => openBulkImportModal()}
            size="sm"
            variant="light"
          >
            Import JSON
          </Button>

          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => openCandidateModal()}
            size="sm"
          >
            Add Candidate
          </Button>
        </Group>
      </Group>

      {unplacedCandidates.length > 0 && (
        <Flex wrap="wrap" gap="16px">
          {unplacedCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onClick={handleCandidateClick}
              onPlayClick={handlePlayClick}
            />
          ))}
        </Flex>
      )}

      {unplacedCandidates.length === 0 && (
        <Text c="dimmed" ta="center" py="xl">
          No unplaced candidates
        </Text>
      )}
    </Stack>
  )
}
