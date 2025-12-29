import { ActionIcon, Menu } from '@mantine/core'
import { IconDots, IconEdit } from '@tabler/icons-react'
import { useTierlistEditorStore } from '../../../store/TierlistEditor.store'
import { CategoryDeleteControl } from '../CategoryDeleteControl/CategoryDeleteControl'
import { CategoryMoveControls } from '../CategoryMoveControls/CategoryMoveControls'

interface CategoryItemControlsProps {
  categoryId: string
  categoryTitle: string
}

export function CategoryItemControls({
  categoryId,
  categoryTitle,
}: CategoryItemControlsProps) {
  const openCategoryModal = useTierlistEditorStore(
    (state) => state.openCategoryModal
  )

  const handleEdit = () => {
    openCategoryModal(categoryId)
  }

  return (
    <Menu shadow="md" width={160}>
      <Menu.Target>
        <ActionIcon variant="subtle">
          <IconDots size={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <CategoryMoveControls categoryId={categoryId} />

        <Menu.Divider />

        <Menu.Item leftSection={<IconEdit size={16} />} onClick={handleEdit}>
          Edit
        </Menu.Item>

        <CategoryDeleteControl
          categoryId={categoryId}
          categoryTitle={categoryTitle}
        />
      </Menu.Dropdown>
    </Menu>
  )
}
