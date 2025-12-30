import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'
import { useState } from 'react'
import { useTierlistEditorStore } from '../../store/TierlistEditor.store'

export function TierlistResetControl() {
  const resetPlacements = useTierlistEditorStore(
    (state) => state.resetPlacements
  )

  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleResetClick = () => {
    setIsResetModalOpen(true)
  }

  const handleResetConfirm = async () => {
    setIsResetting(true)
    try {
      await resetPlacements()
      setIsResetModalOpen(false)
    } catch (error) {
      console.error('Failed to reset placements:', error)
    } finally {
      setIsResetting(false)
    }
  }

  const handleResetCancel = () => {
    setIsResetModalOpen(false)
  }

  return (
    <>
      <Button
        leftSection={<IconRefresh size={18} />}
        onClick={handleResetClick}
        variant="light"
        color="orange"
      >
        Reset Placements
      </Button>

      <Modal
        opened={isResetModalOpen}
        onClose={handleResetCancel}
        title="Reset Placements"
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to reset all placements? All candidates will
            be moved back to the unplaced pool. This action cannot be undone.
          </Text>

          <Group justify="flex-end" gap="xs">
            <Button variant="subtle" onClick={handleResetCancel}>
              Cancel
            </Button>
            <Button
              color="orange"
              onClick={handleResetConfirm}
              loading={isResetting}
            >
              Reset
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
