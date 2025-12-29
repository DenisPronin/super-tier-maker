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
}

export interface UpdateCategoryRequest {
  title?: string
  color?: string
}
