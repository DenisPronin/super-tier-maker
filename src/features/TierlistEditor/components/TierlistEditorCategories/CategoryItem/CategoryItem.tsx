import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Flex } from '@mantine/core'
import { useShallow } from 'zustand/react/shallow'
import {
  selectCandidatesInCategory,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import type { Candidate, Category } from '../../../TierlistEditor.types'
import { SortableCandidateCard } from '../../Candidates/SortableCandidateCard/SortableCandidateCard'
import { CategoryItemControls } from '../CategoryItemControls/CategoryItemControls'
import * as Styled from './CategoryItem.styled'

interface CategoryItemProps {
  category: Category
}

export function CategoryItem({ category }: CategoryItemProps) {
  const candidatesInCategory = useTierlistEditorStore(
    useShallow(selectCandidatesInCategory(category.id))
  )
  const openCandidateViewModal = useTierlistEditorStore(
    (state) => state.openCandidateViewModal
  )

  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
  })

  const candidateIds = candidatesInCategory.map((candidate) => candidate.id)

  const handleCandidateClick = (candidate: Candidate) => {
    openCandidateViewModal(candidate.id)
  }

  const handlePlayClick = (candidate: Candidate) => {
    if (candidate.url) {
      window.open(candidate.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Styled.Container shadow="sm" radius="md" withBorder>
      <Flex>
        <Styled.Label $color={category.color || ''}>
          {category.title}
        </Styled.Label>

        <div
          ref={setNodeRef}
          style={{
            flex: 1,
          }}
        >
          <Styled.Content
            $isEmpty={candidatesInCategory.length === 0}
            style={{
              backgroundColor: isOver
                ? 'var(--mantine-color-dark-6)'
                : 'var(--mantine-color-dark-7)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
              }}
            >
              <CategoryItemControls
                categoryId={category.id}
                categoryTitle={category.title}
              />
            </div>

            <SortableContext items={candidateIds} strategy={rectSortingStrategy}>
              <Flex wrap="wrap" gap="8px">
                {candidatesInCategory.map((candidate) => (
                  <SortableCandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    size="small"
                    onClick={handleCandidateClick}
                    onPlayClick={handlePlayClick}
                  />
                ))}
              </Flex>
            </SortableContext>
          </Styled.Content>
        </div>
      </Flex>
    </Styled.Container>
  )
}
