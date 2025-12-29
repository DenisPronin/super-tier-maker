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
