import { Button, Modal, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  selectIsCandidateModalOpen,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import type { CreateCandidateRequest } from '../../../TierlistEditor.types'

export function CandidateModal() {
  const isOpen = useTierlistEditorStore(selectIsCandidateModalOpen)
  const closeCandidateModal = useTierlistEditorStore(
    (state) => state.closeCandidateModal
  )
  const createCandidate = useTierlistEditorStore(
    (state) => state.createCandidate
  )

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

  const handleSubmit = async (values: CreateCandidateRequest) => {
    try {
      const data: CreateCandidateRequest = {
        title: values.title,
        comment: values.comment || undefined,
        year: values.year ? Number(values.year) : undefined,
        preview_url: values.preview_url || undefined,
        url: values.url || undefined,
      }
      await createCandidate(data)
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
      title="Create Candidate"
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
            Create Candidate
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
