import type { Candidate, Placement } from '../TierlistEditor.types'

export const UNPLACED_CONTAINER_ID = 'unplaced'

export function getCandidatesInContainer(
  containerId: string,
  candidates: Candidate[],
  placements: Map<string, Placement>
): Candidate[] {
  return candidates
    .filter((candidate) => {
      const placement = placements.get(candidate.id)
      if (containerId === UNPLACED_CONTAINER_ID) {
        return placement?.category_id === null
      }
      return placement?.category_id === containerId
    })
    .sort((a, b) => {
      const placementA = placements.get(a.id)
      const placementB = placements.get(b.id)
      return (placementA?.sort_order ?? 0) - (placementB?.sort_order ?? 0)
    })
}

export function findContainer(
  candidateId: string,
  placements: Map<string, Placement>
): string | null {
  const placement = placements.get(candidateId)
  if (!placement) return null
  return placement.category_id || UNPLACED_CONTAINER_ID
}
