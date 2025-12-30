import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Button, Flex, Group, Stack, Text, Title } from '@mantine/core'
import { IconFileImport, IconPlus } from '@tabler/icons-react'
import { useShallow } from 'zustand/react/shallow'
import {
  selectUnplacedCandidates,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import type { Candidate } from '../../../TierlistEditor.types'
import { UNPLACED_CONTAINER_ID } from '../../../utils/dnd.helpers'
import { SortableCandidateCard } from '../SortableCandidateCard/SortableCandidateCard'

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

  const { setNodeRef, isOver } = useDroppable({
    id: UNPLACED_CONTAINER_ID,
  })

  const candidateIds = unplacedCandidates.map((candidate) => candidate.id)

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

      <div
        ref={setNodeRef}
        style={{
          backgroundColor: isOver
            ? 'var(--mantine-color-gray-1)'
            : 'transparent',
          transition: 'background-color 0.2s',
          borderRadius: '8px',
          padding: unplacedCandidates.length > 0 ? '0' : '16px',
          minHeight: '100px',
        }}
      >
        {unplacedCandidates.length > 0 && (
          <SortableContext items={candidateIds} strategy={rectSortingStrategy}>
            <Flex wrap="wrap" gap="16px">
              {unplacedCandidates.map((candidate) => (
                <SortableCandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onClick={handleCandidateClick}
                  onPlayClick={handlePlayClick}
                />
              ))}
            </Flex>
          </SortableContext>
        )}

        {unplacedCandidates.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            No unplaced candidates
          </Text>
        )}
      </div>
    </Stack>
  )
}
