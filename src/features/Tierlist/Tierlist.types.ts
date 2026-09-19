import type { HeaderThemeId } from './themes/HeaderTheme.types'

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
  theme?: HeaderThemeId
}

export interface CreateTierListRequest {
  title: string
  description: string
  theme: HeaderThemeId
  is_public: boolean
}

export interface UpdateTierListMetaRequest {
  title?: string
  description?: string
  theme?: HeaderThemeId
}
