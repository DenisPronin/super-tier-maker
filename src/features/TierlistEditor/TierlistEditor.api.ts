import { supabase } from '@/app/imports/App.services'
import type { TierList } from '@/features/Tierlist/Tierlist.types'
import type {
  Candidate,
  Category,
  CreateCandidateRequest,
  CreateCategoryRequest,
  Placement,
  UpdateCandidateRequest,
  UpdateCategoryRequest,
} from './TierlistEditor.types'

export async function apiFetchTierlist(tierlistId: string): Promise<TierList> {
  const { data, error } = await supabase
    .from('tierlists')
    .select('*')
    .eq('id', tierlistId)
    .single()

  if (error) throw new Error(error.message)

  return data as TierList
}

export async function apiFetchCategories(
  tierlistId: string
): Promise<Category[]> {
  const { data, error } = await supabase
    .from('tierlist_categories')
    .select('*')
    .eq('tierlist_id', tierlistId)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)

  return (data as Category[]) || []
}

export async function apiUpdateTierlistMeta(
  tierlistId: string,
  updates: { title?: string; description?: string }
): Promise<TierList> {
  const updateData: Record<string, unknown> = {}

  if (updates.title !== undefined) {
    updateData.title = updates.title
  }

  if (updates.description !== undefined) {
    updateData.meta = { description: updates.description }
  }

  const { data, error } = await supabase
    .from('tierlists')
    .update(updateData)
    .eq('id', tierlistId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data as TierList
}

export async function apiCreateCategory(
  tierlistId: string,
  data: CreateCategoryRequest
): Promise<Category> {
  const { data: category, error } = await supabase
    .from('tierlist_categories')
    .insert({
      tierlist_id: tierlistId,
      title: data.title,
      color: data.color || null,
      sort_order: data.sort_order,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  return category as Category
}

export async function apiUpdateCategory(
  categoryId: string,
  updates: UpdateCategoryRequest
): Promise<Category> {
  const { data, error } = await supabase
    .from('tierlist_categories')
    .update(updates)
    .eq('id', categoryId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data as Category
}

export async function apiDeleteCategory(categoryId: string): Promise<void> {
  const { error } = await supabase
    .from('tierlist_categories')
    .delete()
    .eq('id', categoryId)

  if (error) throw new Error(error.message)
}

export async function apiFetchCandidates(
  tierlistId: string
): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from('tierlist_candidates')
    .select('*')
    .eq('tierlist_id', tierlistId)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)

  return (data as Candidate[]) || []
}

export async function apiFetchPlacements(
  tierlistId: string
): Promise<Placement[]> {
  const { data, error } = await supabase
    .from('tierlist_placements')
    .select('*')
    .eq('tierlist_id', tierlistId)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)

  return (data as Placement[]) || []
}

export async function apiCreateCandidate(
  tierlistId: string,
  data: CreateCandidateRequest
): Promise<Candidate> {
  const { data: candidate, error } = await supabase
    .from('tierlist_candidates')
    .insert({
      tierlist_id: tierlistId,
      title: data.title,
      comment: data.comment || null,
      year: data.year || null,
      preview_url: data.preview_url || null,
      url: data.url || null,
      sort_order: data.sort_order ?? 0,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await supabase.from('tierlist_placements').insert({
    tierlist_id: tierlistId,
    candidate_id: candidate.id,
    category_id: null,
    sort_order: data.sort_order ?? 0,
  })

  return candidate as Candidate
}

export async function apiUpdateCandidate(
  candidateId: string,
  updates: UpdateCandidateRequest
): Promise<Candidate> {
  const { data, error } = await supabase
    .from('tierlist_candidates')
    .update(updates)
    .eq('id', candidateId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data as Candidate
}

export async function apiDeleteCandidate(candidateId: string): Promise<void> {
  const { error } = await supabase
    .from('tierlist_candidates')
    .delete()
    .eq('id', candidateId)

  if (error) throw new Error(error.message)
}

export async function apiUpdatePlacement(
  tierlistId: string,
  candidateId: string,
  categoryId: string | null,
  sortOrder: number
): Promise<Placement> {
  const { data, error } = await supabase
    .from('tierlist_placements')
    .update({
      category_id: categoryId,
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq('tierlist_id', tierlistId)
    .eq('candidate_id', candidateId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data as Placement
}
