import { Flex } from '@mantine/core'
import { useShallow } from 'zustand/react/shallow'
import {
  selectCandidatesInCategory,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import type { Category } from '../../../TierlistEditor.types'
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

  return (
    <Styled.Container shadow="sm" radius="md" withBorder>
      <Flex>
        <Styled.Label $color={category.color || ''}>
          {category.title}
        </Styled.Label>

        <Styled.Content $isEmpty={candidatesInCategory.length === 0}>
          <Flex wrap="wrap" gap="8px">
            {candidatesInCategory.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}

            <CategoryItemControls
              categoryId={category.id}
              categoryTitle={category.title}
            />
          </Flex>
        </Styled.Content>
      </Flex>
    </Styled.Container>
  )
}
