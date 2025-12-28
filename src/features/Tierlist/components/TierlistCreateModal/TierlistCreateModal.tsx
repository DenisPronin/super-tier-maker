import { useAuthStore } from '@/app/imports/App.store'
import { Button, Checkbox, Modal, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateTitle } from '../../Tierlist.model'
import type { CreateTierListRequest } from '../../Tierlist.types'
import {
  selectIsCreateModalOpen,
  selectNewTierlist,
  useTierlistStore,
} from '../../store/Tierlist.store'

export function TierlistCreateModal() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const isOpen = useTierlistStore(selectIsCreateModalOpen)
  const newTierlist = useTierlistStore(selectNewTierlist)
  const closeModal = useTierlistStore((state) => state.closeCreateModal)
  const createAction = useTierlistStore((state) => state.createTierListAction)
  const resetCreateState = useTierlistStore((state) => state.resetCreateState)

  const form = useForm<CreateTierListRequest>({
    initialValues: {
      title: '',
      description: '',
      is_public: true,
    },
    validate: {
      title: validateTitle,
    },
  })

  const handleSubmit = async (values: CreateTierListRequest) => {
    if (!user) return

    try {
      await createAction({ userId: user.id, request: values })
    } catch {
      return
    }
  }

  const handleClose = () => {
    closeModal()
    form.reset()
    resetCreateState()
  }

  useEffect(() => {
    if (newTierlist.isSuccess && newTierlist.data) {
      handleClose()
      navigate(`/app/tierlist/${newTierlist.data.id}/edit`)
    }
  }, [newTierlist.isSuccess, newTierlist.data, navigate])

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title="Create New Tier List"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Enter tier list title"
            required
            {...form.getInputProps('title')}
          />

          <Textarea
            label="Description"
            placeholder="Enter description (optional)"
            minRows={3}
            {...form.getInputProps('description')}
          />

          <Checkbox
            label="Make this tier list public"
            {...form.getInputProps('is_public', { type: 'checkbox' })}
          />

          {newTierlist.error && (
            <Text size="sm" c="red">
              {newTierlist.error}
            </Text>
          )}

          <Button type="submit" loading={newTierlist.isLoading} fullWidth>
            Create Tier List
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
