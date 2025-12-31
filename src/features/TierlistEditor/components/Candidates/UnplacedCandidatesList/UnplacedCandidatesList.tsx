import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconFileImport, IconPlus, IconRefresh } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import {
  sortOptions,
  usePlayModeCandidateSort,
} from '../../../hooks/usePlayModeCandidateSort'
import {
  selectUnplacedCandidates,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import type { Candidate } from '../../../TierlistEditor.types'
import { UNPLACED_CONTAINER_ID } from '../../../utils/dnd.helpers'
import { SortableCandidateCard } from '../SortableCandidateCard/SortableCandidateCard'

interface UnplacedCandidatesListProps {
  viewMode?: boolean
}

export function UnplacedCandidatesList({
  viewMode = false,
}: UnplacedCandidatesListProps) {
  const { id: tierlistId } = useParams<{ id: string }>()
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

  const {
    sortedCandidates,
    sortBy,
    handleSortChange,
    handleRegenerateRandom,
  } = usePlayModeCandidateSort({
    candidates: unplacedCandidates,
    tierlistId,
    enabled: viewMode,
  })

  const displayCandidates = viewMode ? sortedCandidates : unplacedCandidates

  const { setNodeRef, isOver } = useDroppable({
    id: UNPLACED_CONTAINER_ID,
  })

  const candidateIds = displayCandidates.map((candidate) => candidate.id)

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
            ({displayCandidates.length})
          </Text>
        </Group>

        {viewMode ? (
          <Group gap="xs">
            {sortBy === 'random' && (
              <ActionIcon
                variant="light"
                size="lg"
                onClick={handleRegenerateRandom}
              >
                <IconRefresh size={18} />
              </ActionIcon>
            )}
            <Select
              data={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
              size="sm"
              w={200}
            />
          </Group>
        ) : (
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
        )}
      </Group>

      <div
        ref={setNodeRef}
        style={{
          backgroundColor: isOver
            ? 'var(--mantine-color-gray-1)'
            : 'transparent',
          transition: 'background-color 0.2s',
          borderRadius: '8px',
          padding: displayCandidates.length > 0 ? '0' : '16px',
          minHeight: '100px',
        }}
      >
        {displayCandidates.length > 0 && (
          <SortableContext items={candidateIds} strategy={rectSortingStrategy}>
            <Flex wrap="wrap" gap="16px">
              {displayCandidates.map((candidate) => (
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

        {displayCandidates.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            No unplaced candidates
          </Text>
        )}
      </div>
    </Stack>
  )
}
