import { type MouseEvent } from 'react'
import { ActionIcon } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconTrash } from '@tabler/icons-react'
import { useTierlistStore } from '../../store/Tierlist.store'

interface TierlistDeleteControlProps {
  tierlistId: string
  tierlistTitle: string
  onClick?: (e: MouseEvent) => void
}

export function TierlistDeleteControl({
  tierlistId,
  tierlistTitle,
  onClick,
}: TierlistDeleteControlProps) {
  const deleteTierlist = useTierlistStore((state) => state.deleteTierlist)

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    onClick?.(e)

    modals.openConfirmModal({
      title: 'Delete Tier List',
      children: `Are you sure you want to delete "${tierlistTitle}"? This action cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await deleteTierlist(tierlistId)
      },
    })
  }

  return (
    <ActionIcon variant="subtle" color="red" onClick={handleClick}>
      <IconTrash size={18} />
    </ActionIcon>
  )
}
