import { type DraggableAttributes } from '@dnd-kit/core'
import { ActionIcon } from '@mantine/core'
import { IconGripVertical } from '@tabler/icons-react'
import { forwardRef, type SyntheticEvent } from 'react'

interface DragHandleProps {
  listeners?: Record<string, (event: SyntheticEvent) => void>
  attributes?: DraggableAttributes
}

export const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(
  ({ listeners, attributes }, ref) => {
    return (
      <ActionIcon
        ref={ref}
        variant="filled"
        color="dark"
        size="sm"
        radius="xl"
        style={{ cursor: 'grab', touchAction: 'none' }}
        {...attributes}
        {...listeners}
      >
        <IconGripVertical size={16} />
      </ActionIcon>
    )
  }
)

DragHandle.displayName = 'DragHandle'
