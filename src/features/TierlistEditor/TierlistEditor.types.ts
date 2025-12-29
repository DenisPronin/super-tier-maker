export const CATEGORY_MOVE_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
} as const

export type CategoryMoveDirection =
  (typeof CATEGORY_MOVE_DIRECTION)[keyof typeof CATEGORY_MOVE_DIRECTION]

export interface Category {
  id: string
  tierlist_id: string
  title: string
  color: string | null
  sort_order: number
}

export interface CreateCategoryRequest {
  title: string
  color?: string
  sort_order?: number
}

export interface UpdateCategoryRequest {
  title?: string
  color?: string
  sort_order?: number
}

export interface Candidate {
  id: string
  tierlist_id: string
  title: string
  comment: string | null
  year: number | null
  preview_url: string | null
  url: string | null
  sort_order: number
  meta: Record<string, unknown>
}

export interface Placement {
  tierlist_id: string
  candidate_id: string
  category_id: string | null
  sort_order: number
  updated_at: string
}

export interface CreateCandidateRequest {
  title: string
  comment?: string
  year?: number
  preview_url?: string
  url?: string
  sort_order?: number
}

export interface UpdateCandidateRequest {
  title?: string
  comment?: string
  year?: number
  preview_url?: string
  url?: string
}
