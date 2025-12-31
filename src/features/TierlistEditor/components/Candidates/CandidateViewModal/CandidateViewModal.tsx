import {
  ActionIcon,
  Box,
  Button,
  type ComboboxItem,
  Flex,
  Group,
  Image,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
} from '@mantine/core'
import { IconEdit, IconPlayerPlay, IconTrash } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import {
  selectCandidates,
  selectCategories,
  selectIsCandidateViewModalOpen,
  selectPlacements,
  selectViewingCandidateId,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'
import {
  findCategoryIndexByScore,
  SCORE_CONFIG,
} from '../../../utils/score-intervals'

interface CandidateViewModalProps {
  viewMode?: boolean
}

export function CandidateViewModal({
  viewMode = false,
}: CandidateViewModalProps) {
  const isOpen = useTierlistEditorStore(selectIsCandidateViewModalOpen)
  const viewingCandidateId = useTierlistEditorStore(selectViewingCandidateId)
  const candidates = useTierlistEditorStore(selectCandidates)
  const categories = useTierlistEditorStore(selectCategories)
  const placements = useTierlistEditorStore(selectPlacements)
  const closeViewModal = useTierlistEditorStore(
    (state) => state.closeCandidateViewModal
  )
  const openCandidateModal = useTierlistEditorStore(
    (state) => state.openCandidateModal
  )
  const deleteCandidate = useTierlistEditorStore(
    (state) => state.deleteCandidate
  )
  const updatePlacement = useTierlistEditorStore(
    (state) => state.updatePlacement
  )

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [score, setScore] = useState<number | string>('')

  const candidate =
    (candidates.data || []).find((cand) => cand.id === viewingCandidateId) ||
    null

  const currentPlacement = candidate ? placements.get(candidate.id) : null
  const currentCategoryId = currentPlacement?.category_id || null

  useEffect(() => {
    if (isOpen && candidate) {
      setSelectedCategory(currentCategoryId)
      setScore('')
    }
  }, [isOpen, candidate, currentCategoryId])

  const categoryOptions = useMemo(() => {
    return (categories.data || []).map((category) => ({
      value: category.id,
      label: category.title,
      color: category.color,
    }))
  }, [categories.data])

  const renderOption = ({ option }: { option: ComboboxItem }) => {
    const category = (categories.data || []).find(
      (cat) => cat.id === option.value
    )
    return (
      <Group gap="xs">
        <Box
          style={{
            width: 12,
            height: 12,
            backgroundColor: category?.color || '#e9ecef',
            borderRadius: 2,
          }}
        />
        <Text>{option.label}</Text>
      </Group>
    )
  }

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

  const handleScoreChange = (value: string | number) => {
    setScore(value)

    if (typeof value === 'number' && !isNaN(value)) {
      const categoriesCount = categories.data?.length || 0
      const categoryIndex = findCategoryIndexByScore(value, categoriesCount)

      if (
        categoryIndex !== null &&
        categories.data &&
        categories.data[categoryIndex]
      ) {
        setSelectedCategory(categories.data[categoryIndex].id)
      }
    }
  }

  const handleConfirm = async () => {
    if (!candidate || selectedCategory === null) return

    try {
      await updatePlacement(candidate.id, selectedCategory, 0)
      closeViewModal()
    } catch (error) {
      console.error('Failed to update placement:', error)
    }
  }

  if (!candidate) return null

  const selectedCategoryData = (categories.data || []).find(
    (cat) => cat.id === selectedCategory
  )

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={closeViewModal}
        title={
          <Stack gap={0}>
            <Text>{candidate.title}</Text>
            <Text size="xs" c="dimmed">
              {candidate.comment && `${candidate.comment}, `}
              {candidate.year}
            </Text>
          </Stack>
        }
        centered
        size="700px"
      >
        <Flex gap="md">
          <Box style={{ flexShrink: 0, position: 'relative' }}>
            {candidate.preview_url ? (
              <Image
                src={candidate.preview_url}
                alt={candidate.title}
                maw={300}
                fit="cover"
                radius="md"
              />
            ) : (
              <div
                style={{
                  width: 120,
                  height: 160,
                  backgroundColor: '#e9ecef',
                  borderRadius: 8,
                }}
              />
            )}

            {candidate.url && (
              <ActionIcon
                size="lg"
                variant="filled"
                color="dark"
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  opacity: 0.8,
                }}
                onClick={handlePlayClick}
              >
                <IconPlayerPlay size={20} />
              </ActionIcon>
            )}
          </Box>

          <Box style={{ flex: 1 }}>
            <Select
              label="Select Category"
              placeholder="Choose a category"
              data={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              renderOption={renderOption}
              mb={viewMode ? 'md' : undefined}
              styles={{
                label: {
                  marginBottom: '8px',
                },
              }}
              leftSection={
                selectedCategoryData ? (
                  <Box
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: selectedCategoryData.color || '#e9ecef',
                      borderRadius: 2,
                    }}
                  />
                ) : null
              }
            />

            {viewMode && (
              <NumberInput
                label={`Score (${SCORE_CONFIG.peopleCount} people, ${SCORE_CONFIG.minRating}-${SCORE_CONFIG.maxRating} rating)`}
                placeholder={`${SCORE_CONFIG.min}-${SCORE_CONFIG.max}`}
                value={score}
                onChange={handleScoreChange}
                min={SCORE_CONFIG.min}
                max={SCORE_CONFIG.max}
                styles={{
                  label: {
                    marginBottom: '8px',
                  },
                }}
              />
            )}
          </Box>
        </Flex>

        <Group justify="flex-end" mt="md">
          {!viewMode && (
            <>
              <Button
                leftSection={<IconEdit size={18} />}
                onClick={handleEdit}
                variant="light"
                size="sm"
              >
                Edit
              </Button>

              <Button
                leftSection={<IconTrash size={18} />}
                onClick={handleDeleteClick}
                color="red"
                variant="light"
                size="sm"
              >
                Delete
              </Button>

              <Box flex={1} />
            </>
          )}

          <Button
            variant="filled"
            color="blue"
            disabled={!selectedCategory}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Group>
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
