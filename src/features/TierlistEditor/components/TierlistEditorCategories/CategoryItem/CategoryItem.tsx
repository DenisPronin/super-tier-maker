import { Flex } from '@mantine/core'
import type { Category } from '../../../TierlistEditor.types'
import { CategoryItemControls } from '../CategoryItemControls/CategoryItemControls'
import * as Styled from './CategoryItem.styled'

interface CategoryItemProps {
  category: Category
}

export function CategoryItem({ category }: CategoryItemProps) {
  const candidatesInCategory = []

  return (
    <Styled.Container shadow="sm" radius="md" withBorder>
      <Flex>
        <Styled.Label $color={category.color || ''}>
          {category.title}
        </Styled.Label>

        <Styled.Content $isEmpty={candidatesInCategory.length === 0}>
          <Flex wrap="wrap" gap="8px">
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
