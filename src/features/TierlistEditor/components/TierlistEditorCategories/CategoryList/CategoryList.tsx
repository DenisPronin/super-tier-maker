import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import {
  selectCategories,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import { CategoryItem } from '../CategoryItem/CategoryItem'

interface CategoryListProps {
  viewMode?: boolean
}

export function CategoryList({ viewMode = false }: CategoryListProps) {
  const categories = useTierlistEditorStore(selectCategories)
  const openCategoryModal = useTierlistEditorStore(
    (state) => state.openCategoryModal
  )

  const handleAddCategory = () => {
    openCategoryModal()
  }

  const categoriesData = categories.data || []
  const isEmpty = categoriesData.length === 0

  return (
    <Stack gap="lg">
      {!viewMode && (
        <Group justify="space-between" align="center">
          <Title order={4}>Categories</Title>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={handleAddCategory}
            variant="light"
          >
            Add Category
          </Button>
        </Group>
      )}

      {isEmpty && (
        <Text c="dimmed" ta="center" py="xl">
          No categories yet. Add your first category to get started.
        </Text>
      )}

      {!isEmpty && (
        <Stack gap="md">
          {categoriesData.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              viewMode={viewMode}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
