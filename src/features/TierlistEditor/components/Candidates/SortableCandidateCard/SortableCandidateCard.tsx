import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Candidate } from '../../../TierlistEditor.types'
import { CandidateCard } from '../CandidateCard/CandidateCard'

interface SortableCandidateCardProps {
  candidate: Candidate
  size?: 'small' | 'normal'
  onClick?: (candidate: Candidate) => void
  onPlayClick?: (candidate: Candidate) => void
}

export function SortableCandidateCard({
  candidate,
  size,
  onClick,
  onPlayClick,
}: SortableCandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <CandidateCard
        candidate={candidate}
        size={size}
        onClick={onClick}
        onPlayClick={onPlayClick}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
