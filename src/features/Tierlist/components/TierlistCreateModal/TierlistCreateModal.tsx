import { useAuthStore } from '@/app/imports/App.store'
import { Button, Checkbox, Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  selectIsCreateModalOpen,
  useTierlistStore,
} from '../../store/Tierlist.store'
import { TierlistMetaForm } from '../TierlistMetaForm/TierlistMetaForm'

export function TierlistCreateModal() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const isOpen = useTierlistStore(selectIsCreateModalOpen)
  const closeModal = useTierlistStore((state) => state.closeCreateModal)
  const createAction = useTierlistStore((state) => state.createTierList)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const publicForm = useForm({
    initialValues: {
      is_public: true,
    },
  })

  const handleSubmit = async (
    values: { title: string; description: string },
    previewFile: File | null
  ) => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const newTierlist = await createAction({
        userId: user.id,
        request: {
          title: values.title,
          description: values.description,
          is_public: publicForm.values.is_public,
        },
        previewFile: previewFile || undefined,
      })

      handleClose()
      navigate(`/app/tierlist/${newTierlist.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = useCallback(() => {
    closeModal()
    publicForm.reset()
    setError(null)
  }, [closeModal, publicForm])

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title="Create New Tier List"
      size="md"
    >
      <TierlistMetaForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      >
        <Checkbox
          label="Make this tier list public"
          {...publicForm.getInputProps('is_public', { type: 'checkbox' })}
        />

        <Button type="submit" loading={isLoading} fullWidth>
          Create Tier List
        </Button>
      </TierlistMetaForm>
    </Modal>
  )
}
