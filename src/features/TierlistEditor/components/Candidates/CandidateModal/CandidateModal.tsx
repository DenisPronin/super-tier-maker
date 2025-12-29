import { Button, Modal, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import {
  selectCandidates,
  selectEditingCandidateId,
  selectIsCandidateModalOpen,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import type { CreateCandidateRequest } from '../../../TierlistEditor.types'

export function CandidateModal() {
  const isOpen = useTierlistEditorStore(selectIsCandidateModalOpen)
  const editingCandidateId = useTierlistEditorStore(selectEditingCandidateId)
  const candidates = useTierlistEditorStore(selectCandidates)
  const closeCandidateModal = useTierlistEditorStore(
    (state) => state.closeCandidateModal
  )
  const createCandidate = useTierlistEditorStore(
    (state) => state.createCandidate
  )
  const updateCandidate = useTierlistEditorStore(
    (state) => state.updateCandidate
  )

  const isEditMode = editingCandidateId !== null
  const editingCandidate = isEditMode
    ? (candidates.data || []).find((cand) => cand.id === editingCandidateId)
    : null

  const form = useForm<CreateCandidateRequest>({
    initialValues: {
      title: '',
      comment: '',
      year: undefined,
      preview_url: '',
      url: '',
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      year: (value) => {
        if (!value) return null
        const num = Number(value)
        return isNaN(num) || num < 1900 || num > 2100
          ? 'Invalid year'
          : null
      },
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (editingCandidate) {
        form.setValues({
          title: editingCandidate.title,
          comment: editingCandidate.comment || '',
          year: editingCandidate.year ?? undefined,
          preview_url: editingCandidate.preview_url || '',
          url: editingCandidate.url || '',
        })
      } else {
        form.reset()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingCandidate])

  const handleSubmit = async (values: CreateCandidateRequest) => {
    try {
      const data: CreateCandidateRequest = {
        title: values.title,
        comment: values.comment || undefined,
        year: values.year ? Number(values.year) : undefined,
        preview_url: values.preview_url || undefined,
        url: values.url || undefined,
      }

      if (isEditMode && editingCandidateId) {
        await updateCandidate(editingCandidateId, data)
      } else {
        await createCandidate(data)
      }
      handleClose()
    } catch (error) {
      // Error handled by store
    }
  }

  const handleClose = () => {
    closeCandidateModal()
    form.reset()
  }

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Candidate' : 'Create Candidate'}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Enter candidate title"
            required
            {...form.getInputProps('title')}
          />

          <Textarea
            label="Comment"
            placeholder="Optional comment"
            {...form.getInputProps('comment')}
          />

          <TextInput
            label="Year"
            placeholder="e.g. 2024"
            type="number"
            {...form.getInputProps('year')}
          />

          <TextInput
            label="Preview URL"
            placeholder="https://..."
            {...form.getInputProps('preview_url')}
          />

          <TextInput
            label="URL"
            placeholder="https://..."
            {...form.getInputProps('url')}
          />

          <Button type="submit" fullWidth>
            {isEditMode ? 'Save' : 'Create Candidate'}
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
