import { supabase } from '@/app/imports/App.services'
import type { CreateTierListRequest, TierList } from './Tierlist.types'

export async function apiFetchTierLists(userId: string): Promise<TierList[]> {
  const { data, error } = await supabase
    .from('tierlists')
    .select('*')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)

  return data as TierList[]
}

export async function apiCreateTierList(
  userId: string,
  request: CreateTierListRequest
): Promise<TierList> {
  const { data, error } = await supabase
    .from('tierlists')
    .insert({
      owner_id: userId,
      title: request.title,
      meta: { description: request.description },
      is_public: request.is_public,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data as TierList
}

export async function apiDeleteTierList(tierlistId: string): Promise<void> {
  const { error } = await supabase
    .from('tierlists')
    .delete()
    .eq('id', tierlistId)

  if (error) throw new Error(error.message)
}
