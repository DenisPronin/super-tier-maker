import { ActionIcon, Box, Flex, Menu, Paper } from '@mantine/core'
import { IconDots, IconEdit } from '@tabler/icons-react'
import { useTierlistEditorStore } from '../../../store/TierlistEditor.store'
import type { Category } from '../../../TierlistEditor.types'
import { CategoryDeleteControl } from '../CategoryDeleteControl/CategoryDeleteControl'

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
          }}
        >
          <Menu shadow="md" width={160}>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDots size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
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
        </Box>
      </Flex>
    </Paper>
  )
}
