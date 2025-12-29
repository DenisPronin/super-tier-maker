import { ActionIcon, Box, Flex, Menu, Paper } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useTierlistEditorStore } from '../../../store/TierlistEditor.store'
import type { Category } from '../../../TierlistEditor.types'

interface CategoryItemProps {
  category: Category
}

export function CategoryItem({ category }: CategoryItemProps) {
  const openCategoryModal = useTierlistEditorStore(
    (state) => state.openCategoryModal
  )
  const deleteCategory = useTierlistEditorStore((state) => state.deleteCategory)

  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    openCategoryModal(category.id)
  }

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Delete Category',
      children: `Are you sure you want to delete "${category.title}"? This action cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        setIsDeleting(true)
        try {
          await deleteCategory(category.id)
        } catch (err) {
          notifications.show({
            title: 'Error',
            message: err instanceof Error ? err.message : 'Failed to delete category',
            color: 'red',
          })
        } finally {
          setIsDeleting(false)
        }
      },
    })
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
              <ActionIcon variant="subtle" loading={isDeleting}>
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
              <Menu.Item
                leftSection={<IconTrash size={16} />}
                onClick={handleDelete}
                color="red"
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>
      </Flex>
    </Paper>
  )
}
