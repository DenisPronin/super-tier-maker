import { ActionIcon, Box, Flex, Menu, Paper } from '@mantine/core'
import { IconDots, IconEdit } from '@tabler/icons-react'
import { useTierlistEditorStore } from '../../../store/TierlistEditor.store'
import type { Category } from '../../../TierlistEditor.types'
import { CategoryDeleteControl } from '../CategoryDeleteControl/CategoryDeleteControl'
import { CategoryMoveControls } from '../CategoryMoveControls/CategoryMoveControls'

interface CategoryItemProps {
  category: Category
}

export function CategoryItem({ category }: CategoryItemProps) {
  const openCategoryModal = useTierlistEditorStore(
    (state) => state.openCategoryModal
  )

  const handleEdit = () => {
    openCategoryModal(category.id)
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
                <CategoryMoveControls categoryId={category.id} />

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
