import { Button } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import {
  selectCandidates,
  useTierlistEditorStore,
} from '../../../store/TierlistEditor.store'

export function CandidatesClearControl() {
  const candidates = useTierlistEditorStore(selectCandidates)
  const clearCandidates = useTierlistEditorStore(
    (state) => state.clearCandidates
  )
  const [isClearing, setIsClearing] = useState(false)

  const totalCount = candidates.data?.length ?? 0

  const handleClear = () => {
    modals.openConfirmModal({
      title: 'Clear Candidates',
      children: `This will delete all ${totalCount} candidates, including the ones already placed in categories. This action cannot be undone.`,
      labels: { confirm: 'Clear all', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        setIsClearing(true)
        try {
          await clearCandidates()
          notifications.show({
            title: 'Candidates cleared',
            message: `${totalCount} candidates deleted`,
            color: 'green',
          })
        } catch (err) {
          notifications.show({
            title: 'Error',
            message:
              err instanceof Error ? err.message : 'Failed to clear candidates',
            color: 'red',
          })
        } finally {
          setIsClearing(false)
        }
      },
    })
  }

  return (
    <Button
      leftSection={<IconTrash size={18} />}
      onClick={handleClear}
      size="sm"
      variant="light"
      color="red"
      loading={isClearing}
      disabled={totalCount === 0}
    >
      Clear
    </Button>
  )
}
