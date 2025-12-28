import { useAuthStore } from '@/app/imports/App.store'
import { Button, Checkbox, Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  selectIsCreateModalOpen,
  selectNewTierlist,
  useTierlistStore,
} from '../../store/Tierlist.store'
import { TierlistMetaForm } from '../TierlistMetaForm/TierlistMetaForm'

export function TierlistCreateModal() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const isOpen = useTierlistStore(selectIsCreateModalOpen)
  const newTierlist = useTierlistStore(selectNewTierlist)
  const closeModal = useTierlistStore((state) => state.closeCreateModal)
  const createAction = useTierlistStore((state) => state.createTierList)
  const resetCreateState = useTierlistStore((state) => state.resetCreateState)

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

    try {
      await createAction({
        userId: user.id,
        request: {
          title: values.title,
          description: values.description,
          is_public: publicForm.values.is_public,
        },
        previewFile: previewFile || undefined,
      })
    } catch {
      return
    }
  }

  const handleClose = useCallback(() => {
    closeModal()
    publicForm.reset()
    resetCreateState()
  }, [closeModal, publicForm, resetCreateState])

  useEffect(() => {
    if (newTierlist.isSuccess && newTierlist.data) {
      handleClose()
      navigate(`/app/tierlist/${newTierlist.data.id}/edit`)
    }
  }, [newTierlist.isSuccess, newTierlist.data, navigate, handleClose])

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title="Create New Tier List"
      size="md"
    >
      <TierlistMetaForm
        onSubmit={handleSubmit}
        isLoading={newTierlist.isLoading}
        error={newTierlist.error}
      >
        <Checkbox
          label="Make this tier list public"
          {...publicForm.getInputProps('is_public', { type: 'checkbox' })}
        />

        <Button type="submit" loading={newTierlist.isLoading} fullWidth>
          Create Tier List
        </Button>
      </TierlistMetaForm>
    </Modal>
  )
}
