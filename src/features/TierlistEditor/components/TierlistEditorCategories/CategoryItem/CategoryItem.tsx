import { ActionIcon, Box, Flex, Menu, Paper } from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconDots, IconEdit } from '@tabler/icons-react'
import { useState } from 'react'
import {
  selectCategories,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import {
  CATEGORY_MOVE_DIRECTION,
  type Category,
  type CategoryMoveDirection,
} from '../../../TierlistEditor.types'
import { CategoryDeleteControl } from '../CategoryDeleteControl/CategoryDeleteControl'

interface CategoryItemProps {
  category: Category
}

export function CategoryItem({ category }: CategoryItemProps) {
  const categories = useTierlistEditorStore(selectCategories)
  const openCategoryModal = useTierlistEditorStore(
    (state) => state.openCategoryModal
  )
  const moveCategory = useTierlistEditorStore((state) => state.moveCategory)

  const [isMoving, setIsMoving] = useState(false)

  const categoriesData = categories.data || []
  const currentIndex = categoriesData.findIndex((cat) => cat.id === category.id)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === categoriesData.length - 1

  const handleEdit = () => {
    openCategoryModal(category.id)
  }

  const handleMove = (direction: CategoryMoveDirection) => async () => {
    setIsMoving(true)
    try {
      await moveCategory(category.id, direction)
    } finally {
      setIsMoving(false)
    }
  }

  const candidatesInCategory = []

  return (
    <Paper shadow="sm" radius="md" withBorder style={{ overflow: 'hidden' }}>
      <Flex>
        <Box
          style={{
            width: '120px',
            backgroundColor: category.color || 'gray',
            padding: '12px 16px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {category.title}
        </Box>

        <Box
          style={{
            flex: 1,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            minHeight: '100px',
            backgroundColor: 'var(--mantine-color-dark-7)',
            border:
              candidatesInCategory.length === 0
                ? '2px dashed var(--mantine-color-dark-4)'
                : 'none',
            transition: 'background-color 0.2s ease',
          }}
        >
          <Flex wrap="wrap" gap="8px">
            <Menu shadow="md" width={160}>
              <Menu.Target>
                <ActionIcon variant="subtle">
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
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

                <Menu.Divider />

                <Menu.Item
                  leftSection={<IconEdit size={16} />}
                  onClick={handleEdit}
                >
                  Edit
                </Menu.Item>

                <CategoryDeleteControl
                  categoryId={category.id}
                  categoryTitle={category.title}
                />
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Box>
      </Flex>
    </Paper>
  )
}
