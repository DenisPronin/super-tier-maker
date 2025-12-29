import {
  ActionIcon,
  Button,
  Group,
  Image,
  Modal,
  Stack,
  Text,
} from '@mantine/core'
import { IconEdit, IconPlayerPlay, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import {
  selectCandidates,
  selectIsCandidateViewModalOpen,
  selectViewingCandidateId,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'

export function CandidateViewModal() {
  const isOpen = useTierlistEditorStore(selectIsCandidateViewModalOpen)
  const viewingCandidateId = useTierlistEditorStore(selectViewingCandidateId)
  const candidates = useTierlistEditorStore(selectCandidates)
  const closeViewModal = useTierlistEditorStore(
    (state) => state.closeCandidateViewModal
  )
  const openCandidateModal = useTierlistEditorStore(
    (state) => state.openCandidateModal
  )
  const deleteCandidate = useTierlistEditorStore(
    (state) => state.deleteCandidate
  )

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const candidate =
    (candidates.data || []).find((cand) => cand.id === viewingCandidateId) ||
    null

  const handleEdit = () => {
    if (!candidate) return
    closeViewModal()
    openCandidateModal(candidate.id)
  }

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!candidate) return

    setIsDeleting(true)
    try {
      await deleteCandidate(candidate.id)
      setIsDeleteModalOpen(false)
      closeViewModal()
    } catch (error) {
      console.error('Failed to delete candidate:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
  }

  const handlePlayClick = () => {
    if (candidate?.url) {
      window.open(candidate.url, '_blank', 'noopener,noreferrer')
    }
  }

  if (!candidate) return null

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={closeViewModal}
        title={candidate.title}
        size="lg"
      >
        <Stack gap="md">
          <div style={{ position: 'relative' }}>
            {candidate.preview_url ? (
              <Image
                src={candidate.preview_url}
                alt={candidate.title}
                h={400}
                fit="cover"
                radius="md"
              />
            ) : (
              <div
                style={{
                  height: 400,
                  backgroundColor: '#e9ecef',
                  borderRadius: 8,
                }}
              />
            )}

            {candidate.url && (
              <ActionIcon
                onClick={handlePlayClick}
                size="xl"
                radius="xl"
                variant="filled"
                color="blue"
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                }}
              >
                <IconPlayerPlay size={24} />
              </ActionIcon>
            )}
          </div>

          {candidate.year && (
            <Text size="sm" c="dimmed">
              {candidate.comment && `${candidate.comment}, `}
              {candidate.year}
            </Text>
          )}

          <Group justify="space-between" mt="md">
            <Button
              leftSection={<IconEdit size={18} />}
              onClick={handleEdit}
              variant="light"
            >
              Edit
            </Button>

            <Button
              leftSection={<IconTrash size={18} />}
              onClick={handleDeleteClick}
              color="red"
              variant="light"
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete Candidate"
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to delete "{candidate.title}"? This action
            cannot be undone.
          </Text>

          <Group justify="flex-end" gap="xs">
            <Button variant="subtle" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDeleteConfirm}
              loading={isDeleting}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
