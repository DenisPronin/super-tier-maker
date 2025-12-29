import { ActionIcon, Badge, Group, Menu } from '@mantine/core'
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

  const handleDelete = async () => {
    if (!confirm(`Delete category "${category.title}"?`)) return

    setIsDeleting(true)
    try {
      await deleteCategory(category.id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete category')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Group justify="space-between" p="xs" style={{ borderRadius: 8 }}>
      <Group gap="sm">
        <Badge
          color={category.color || 'gray'}
          variant="filled"
          size="lg"
          style={{ minWidth: 80 }}
        >
          {category.title}
        </Badge>
      </Group>

      <Menu shadow="md" width={160}>
        <Menu.Target>
          <ActionIcon variant="subtle" loading={isDeleting}>
            <IconDots size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<IconEdit size={16} />} onClick={handleEdit}>
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
    </Group>
  )
}
