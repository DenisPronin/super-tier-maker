import { Menu } from '@mantine/core'
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import { useState } from 'react'
import {
  selectCategories,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import {
  CATEGORY_MOVE_DIRECTION,
  type CategoryMoveDirection,
} from '../../../TierlistEditor.types'

interface CategoryMoveControlsProps {
  categoryId: string
}

export function CategoryMoveControls({
  categoryId,
}: CategoryMoveControlsProps) {
  const categories = useTierlistEditorStore(selectCategories)
  const moveCategory = useTierlistEditorStore((state) => state.moveCategory)
  const [isMoving, setIsMoving] = useState(false)

  const categoriesData = categories.data || []
  const currentIndex = categoriesData.findIndex((cat) => cat.id === categoryId)
  const totalCount = categoriesData.length

  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalCount - 1

  const handleMove = (direction: CategoryMoveDirection) => async () => {
    setIsMoving(true)
    try {
      await moveCategory(categoryId, direction)
    } finally {
      setIsMoving(false)
    }
  }

  return (
    <>
      <Menu.Item
        leftSection={<IconArrowUp size={16} />}
        onClick={handleMove(CATEGORY_MOVE_DIRECTION.UP)}
        disabled={isFirst || isMoving}
      >
        Move Up
      </Menu.Item>

      <Menu.Item
        leftSection={<IconArrowDown size={16} />}
        onClick={handleMove(CATEGORY_MOVE_DIRECTION.DOWN)}
        disabled={isLast || isMoving}
      >
        Move Down
      </Menu.Item>
    </>
  )
}
