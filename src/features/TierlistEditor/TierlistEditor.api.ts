import { supabase } from '@/app/imports/App.services'
import type { TierList } from '@/features/Tierlist/Tierlist.types'
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './TierlistEditor.types'

export async function apiFetchTierlistForEditor(tierlistId: string): Promise<{
  tierlist: TierList
  categories: Category[]
}> {
  const { data: tierlist, error: tierlistError } = await supabase
    .from('tierlists')
    .select('*')
    .eq('id', tierlistId)
    .single()

  if (tierlistError) throw new Error(tierlistError.message)

  const { data: categories, error: categoriesError } = await supabase
    .from('tierlist_categories')
    .select('*')
    .eq('tierlist_id', tierlistId)
    .order('sort_order', { ascending: true })

  if (categoriesError) throw new Error(categoriesError.message)

  return {
    tierlist: tierlist as TierList,
    categories: (categories as Category[]) || [],
  }
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
