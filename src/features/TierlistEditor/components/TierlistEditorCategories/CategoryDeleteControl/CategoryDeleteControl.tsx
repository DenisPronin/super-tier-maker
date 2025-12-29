import { Menu } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useTierlistEditorStore } from '../../../store/TierlistEditor.store'

interface CategoryDeleteControlProps {
  categoryId: string
  categoryTitle: string
}

export function CategoryDeleteControl({
  categoryId,
  categoryTitle,
}: CategoryDeleteControlProps) {
  const deleteCategory = useTierlistEditorStore((state) => state.deleteCategory)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Delete Category',
      children: `Are you sure you want to delete "${categoryTitle}"? This action cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        setIsDeleting(true)
        try {
          await deleteCategory(categoryId)
        } catch (err) {
          notifications.show({
            title: 'Error',
            message:
              err instanceof Error ? err.message : 'Failed to delete category',
            color: 'red',
          })
        } finally {
          setIsDeleting(false)
        }
      },
    })
  }

  return (
    <Menu.Item
      leftSection={<IconTrash size={16} />}
      onClick={handleDelete}
      color="red"
      disabled={isDeleting}
    >
      Delete
    </Menu.Item>
  )
}
