import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import {
  selectCategories,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import { CategoryItem } from '../CategoryItem/CategoryItem'

export function CategoryList() {
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
    <Paper p="md" withBorder>
      <Stack gap="md">
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

        {isEmpty && (
          <Text c="dimmed" ta="center" py="xl">
            No categories yet. Add your first category to get started.
          </Text>
        )}

        {!isEmpty && (
          <Stack gap="xs">
            {categoriesData.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}
