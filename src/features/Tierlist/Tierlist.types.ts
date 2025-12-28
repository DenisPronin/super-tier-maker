export interface TierList {
  id: string
  owner_id: string
  title: string
  meta: TierListMeta
  is_public: boolean
  created_at: string
  updated_at: string
  preview_path: string | null
  preview_updated_at: string | null
}

export interface TierListMeta {
  description?: string
}

export interface CreateTierListRequest {
  title: string
  description: string
  is_public: boolean
}
