import { Flex } from '@mantine/core'
import { useShallow } from 'zustand/react/shallow'
import {
  selectCandidatesInCategory,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import type { Candidate, Category } from '../../../TierlistEditor.types'
import { CandidateCard } from '../../Candidates/CandidateCard/CandidateCard'
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

        <Styled.Content $isEmpty={candidatesInCategory.length === 0}>
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

          <Flex wrap="wrap" gap="8px">
            {candidatesInCategory.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                size="small"
                onClick={handleCandidateClick}
                onPlayClick={handlePlayClick}
              />
            ))}
          </Flex>
        </Styled.Content>
      </Flex>
    </Styled.Container>
  )
}
