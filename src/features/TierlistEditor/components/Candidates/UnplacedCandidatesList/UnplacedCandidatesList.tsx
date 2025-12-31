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
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import {
  selectUnplacedCandidates,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import type { Candidate } from '../../../TierlistEditor.types'
import { UNPLACED_CONTAINER_ID } from '../../../utils/dnd.helpers'
import { generateSeed, shuffleWithSeed } from '../../../utils/seeded-random'
import { SortableCandidateCard } from '../SortableCandidateCard/SortableCandidateCard'

type SortOption = 'name-asc' | 'name-desc' | 'year-asc' | 'year-desc' | 'random'

interface UnplacedCandidatesListProps {
  viewMode?: boolean
}

const sortOptions = [
  { value: 'name-asc', label: 'По имени (А-Я)' },
  { value: 'name-desc', label: 'По имени (Я-А)' },
  { value: 'year-asc', label: 'По году (старые)' },
  { value: 'year-desc', label: 'По году (новые)' },
  { value: 'random', label: 'Случайно' },
]

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

  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [randomSeed, setRandomSeed] = useState<number>(generateSeed())

  useEffect(() => {
    if (!tierlistId || !viewMode) return

    const storageKey = `tierlist-${tierlistId}-playmode-sort`
    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        const { sortBy: savedSort, seed } = JSON.parse(saved)
        setSortBy(savedSort)
        if (seed) setRandomSeed(seed)
      } catch {
        // ignore
      }
    }
  }, [tierlistId, viewMode])

  useEffect(() => {
    if (!tierlistId || !viewMode) return

    const storageKey = `tierlist-${tierlistId}-playmode-sort`
    localStorage.setItem(
      storageKey,
      JSON.stringify({ sortBy, seed: randomSeed })
    )
  }, [tierlistId, sortBy, randomSeed, viewMode])

  const sortedCandidates = useMemo(() => {
    const candidates = [...unplacedCandidates]

    switch (sortBy) {
      case 'name-asc':
        return candidates.sort((a, b) => a.title.localeCompare(b.title))
      case 'name-desc':
        return candidates.sort((a, b) => b.title.localeCompare(a.title))
      case 'year-asc':
        return candidates.sort((a, b) => {
          const yearA = a.year || 0
          const yearB = b.year || 0
          return yearA - yearB
        })
      case 'year-desc':
        return candidates.sort((a, b) => {
          const yearA = a.year || 0
          const yearB = b.year || 0
          return yearB - yearA
        })
      case 'random':
        return shuffleWithSeed(candidates, randomSeed)
      default:
        return candidates
    }
  }, [unplacedCandidates, sortBy, randomSeed])

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

  const handleSortChange = (value: string | null) => {
    if (value) {
      setSortBy(value as SortOption)
      if (value === 'random' && sortBy !== 'random') {
        setRandomSeed(generateSeed())
      }
    }
  }

  const handleRegenerateRandom = () => {
    setRandomSeed(generateSeed())
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
