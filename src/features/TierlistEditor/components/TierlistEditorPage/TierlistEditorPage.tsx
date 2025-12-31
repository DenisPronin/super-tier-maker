import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Alert, Box, Center, Loader, Stack } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  selectCandidates,
  selectError,
  selectIsLoading,
  selectPlacements,
  selectTierlist,
  useTierlistEditorStore,
} from '../../store/TierlistEditor.store'
import {
  findContainer,
  getCandidatesInContainer,
  UNPLACED_CONTAINER_ID,
} from '../../utils/dnd.helpers'
import { CandidateBulkImportModal } from '../Candidates/CandidateBulkImportModal/CandidateBulkImportModal'
import { CandidateCard } from '../Candidates/CandidateCard/CandidateCard'
import { CandidateModal } from '../Candidates/CandidateModal/CandidateModal'
import { CandidateViewModal } from '../Candidates/CandidateViewModal/CandidateViewModal'
import { UnplacedCandidatesList } from '../Candidates/UnplacedCandidatesList/UnplacedCandidatesList'
import { CategoryList } from '../TierlistEditorCategories/CategoryList/CategoryList'
import { CategoryModal } from '../TierlistEditorCategories/CategoryModal/CategoryModal'
import { TierlistHeader } from '../TierlistHeader/TierlistHeader'
import { TierlistMetaModal } from '../TierlistMetaModal/TierlistMetaModal'
import { TierlistPlayHeader } from '../TierlistPlayHeader/TierlistPlayHeader'

interface TierlistEditorPageProps {
  viewMode?: boolean
}

export function TierlistEditorPage({ viewMode = false }: TierlistEditorPageProps) {
  const { id } = useParams<{ id: string }>()
  const tierlist = useTierlistEditorStore(selectTierlist)
  const candidates = useTierlistEditorStore(selectCandidates)
  const placements = useTierlistEditorStore(selectPlacements)
  const isLoading = useTierlistEditorStore(selectIsLoading)
  const error = useTierlistEditorStore(selectError)
  const loadEditor = useTierlistEditorStore((state) => state.loadEditor)
  const reset = useTierlistEditorStore((state) => state.reset)
  const updatePlacement = useTierlistEditorStore(
    (state) => state.updatePlacement
  )
  const reorderCandidatesInContainer = useTierlistEditorStore(
    (state) => state.reorderCandidatesInContainer
  )

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.WhileDragging,
    },
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = () => {
    // Visual feedback only, no API calls
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeContainer = findContainer(activeId, placements)

    let overContainer: string | null
    if (overId === UNPLACED_CONTAINER_ID) {
      overContainer = UNPLACED_CONTAINER_ID
    } else if (placements.has(overId)) {
      overContainer = findContainer(overId, placements)
    } else {
      overContainer = overId
    }

    if (!activeContainer || !overContainer) return

    if (activeContainer === overContainer) {
      const containerCandidates = getCandidatesInContainer(
        activeContainer,
        candidates.data || [],
        placements
      )

      const oldIndex = containerCandidates.findIndex(
        (candidate) => candidate.id === activeId
      )
      const newIndex = containerCandidates.findIndex(
        (candidate) => candidate.id === overId
      )

      if (oldIndex !== newIndex) {
        const reorderedCandidates = arrayMove(
          containerCandidates,
          oldIndex,
          newIndex
        )
        const orderedIds = reorderedCandidates.map((candidate) => candidate.id)

        const categoryId =
          activeContainer === UNPLACED_CONTAINER_ID ? null : activeContainer

        reorderCandidatesInContainer(categoryId, orderedIds)
      }
    } else {
      const overCandidates = getCandidatesInContainer(
        overContainer,
        candidates.data || [],
        placements
      )

      const overIndex = overCandidates.findIndex(
        (candidate) => candidate.id === overId
      )

      const newIndex = overIndex >= 0 ? overIndex : overCandidates.length

      const targetCategoryId =
        overContainer === UNPLACED_CONTAINER_ID ? null : overContainer

      updatePlacement(activeId, targetCategoryId, newIndex)
    }
  }

  useEffect(() => {
    if (id) {
      loadEditor(id)
    }

    return () => {
      reset()
    }
  }, [id, loadEditor, reset])

  const activeCandidate = activeId
    ? (candidates.data || []).find((candidate) => candidate.id === activeId)
    : null

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
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      measuring={measuringConfig}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box p="md">
        <Stack gap="lg">
          {viewMode ? <TierlistPlayHeader /> : <TierlistHeader />}

          <CategoryList viewMode={viewMode} />

          <UnplacedCandidatesList viewMode={viewMode} />
        </Stack>

        {!viewMode && (
          <>
            <TierlistMetaModal />
            <CategoryModal />
            <CandidateModal />
            <CandidateBulkImportModal />
          </>
        )}
        <CandidateViewModal />
      </Box>

      <DragOverlay>
        {activeCandidate ? (
          <CandidateCard candidate={activeCandidate} size="small" />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
