import {
  Box,
  Button,
  ColorPicker,
  Modal,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect, useState } from 'react'
import {
  selectCategories,
  selectEditingCategoryId,
  selectIsCategoryModalOpen,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import {
  isRainbowColor,
  RAINBOW_COLOR,
  RAINBOW_GRADIENT,
} from '../../../utils/category-color'

interface CategoryFormValues {
  title: string
  color: string
  rainbow: boolean
}

const DEFAULT_COLORS = [
  '#ff7875',
  '#ff9c6e',
  '#ffc069',
  '#fff566',
  '#95de64',
  '#5cdbd3',
  '#69c0ff',
  '#85a5ff',
  '#b37feb',
  '#ff85c0',
]

export function CategoryModal() {
  const isOpen = useTierlistEditorStore(selectIsCategoryModalOpen)
  const editingCategoryId = useTierlistEditorStore(selectEditingCategoryId)
  const categories = useTierlistEditorStore(selectCategories)
  const closeModal = useTierlistEditorStore((state) => state.closeCategoryModal)
  const createCategory = useTierlistEditorStore((state) => state.createCategory)
  const updateCategory = useTierlistEditorStore((state) => state.updateCategory)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = editingCategoryId !== null
  const editingCategory = isEditMode
    ? (categories.data || []).find((cat) => cat.id === editingCategoryId)
    : null

  const form = useForm<CategoryFormValues>({
    initialValues: {
      title: '',
      color: DEFAULT_COLORS[0],
      rainbow: false,
    },
    validate: {
      title: (value) => (value.trim() ? null : 'Title is required'),
      color: (value, values) => {
        if (values.rainbow) return null
        const hexRegex = /^#[0-9A-Fa-f]{6}$/
        return hexRegex.test(value) ? null : 'Invalid hex color (e.g. #ff0000)'
      },
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        const rainbow = isRainbowColor(editingCategory.color)
        form.setValues({
          title: editingCategory.title,
          color: rainbow
            ? DEFAULT_COLORS[0]
            : editingCategory.color || DEFAULT_COLORS[0],
          rainbow,
        })
      } else {
        form.reset()
      }
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingCategory])

  const handleSubmit = async (values: CategoryFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const request = {
        title: values.title,
        color: values.rainbow ? RAINBOW_COLOR : values.color,
      }

      if (isEditMode && editingCategoryId) {
        await updateCategory(editingCategoryId, request)
      } else {
        await createCategory(request)
      }
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    closeModal()
    form.reset()
    setError(null)
  }

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Category' : 'Create Category'}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter category title"
            required
            {...form.getInputProps('title')}
          />

          <Switch
            label="Rainbow"
            {...form.getInputProps('rainbow', { type: 'checkbox' })}
          />

          {form.values.rainbow ? (
            <Box
              h={24}
              style={{ background: RAINBOW_GRADIENT, borderRadius: 4 }}
            />
          ) : (
            <div>
              <TextInput
                label="Color"
                placeholder="#ff0000"
                {...form.getInputProps('color')}
              />
              <ColorPicker
                format="hex"
                swatches={DEFAULT_COLORS}
                {...form.getInputProps('color')}
                mt="xs"
                fullWidth
              />
            </div>
          )}

          {error && (
            <Text c="red" size="sm">
              {error}
            </Text>
          )}

          <Stack gap="xs">
            <Button type="submit" loading={isLoading} fullWidth>
              {isEditMode ? 'Save' : 'Create'}
            </Button>
            <Button variant="subtle" onClick={handleClose} fullWidth>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </Modal>
  )
}
