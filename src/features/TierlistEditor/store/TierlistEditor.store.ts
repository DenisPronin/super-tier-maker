import {
  createAsyncAction,
  createLoadableData,
  createStore,
} from '@/features/Store'
import type { TierList } from '@/features/Tierlist/Tierlist.types'
import type { StateLoadableSlice } from '@/types'
import {
  apiCreateCategory,
  apiDeleteCategory,
  apiFetchTierlistForEditor,
  apiUpdateCategory,
  apiUpdateTierlistMeta,
} from '../TierlistEditor.api'
import { FEATURE_NAME } from '../TierlistEditor.model'
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../TierlistEditor.types'

type TierlistEditorState = {
  tierlistId: string | null
  tierlist: TierList | null
  categories: Category[]
  isLoading: boolean
  error: string | null

  isMetaModalOpen: boolean
  isCategoryModalOpen: boolean
  editingCategoryId: string | null

  metaUpdate: StateLoadableSlice<TierList>
  categoryCreate: StateLoadableSlice<Category>
  categoryUpdate: StateLoadableSlice<Category>

  loadTierlist: (id: string) => Promise<void>
  updateMeta: (updates: {
    title?: string
    description?: string
  }) => Promise<void>

  openMetaModal: () => void
  closeMetaModal: () => void

  openCategoryModal: (categoryId?: string) => void
  closeCategoryModal: () => void

  createCategory: (data: CreateCategoryRequest) => Promise<void>
  updateCategory: (request: {
    id: string
    updates: UpdateCategoryRequest
  }) => Promise<void>
  deleteCategory: (id: string) => Promise<void>

  reset: () => void
}

const initialState = {
  tierlistId: null,
  tierlist: null,
  categories: [],
  isLoading: false,
  error: null,
  isMetaModalOpen: false,
  isCategoryModalOpen: false,
  editingCategoryId: null,
  metaUpdate: createLoadableData<TierList>(),
  categoryCreate: createLoadableData<Category>(),
  categoryUpdate: createLoadableData<Category>(),
}

export const useTierlistEditorStore = createStore<TierlistEditorState>()(
  (set, get) => ({
    ...initialState,

    loadTierlist: async (id: string) => {
      set({ isLoading: true, error: null, tierlistId: id })

      try {
        const { tierlist, categories } = await apiFetchTierlistForEditor(id)
        set({
          tierlist,
          categories,
          isLoading: false,
        })
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false,
        })
      }
    },

    updateMeta: createAsyncAction<
      TierlistEditorState,
      TierList,
      { title?: string; description?: string },
      'metaUpdate'
    >({ getState: get, setState: set }, 'metaUpdate', {
      fetchFunction: async (updates) => {
        const { tierlistId } = get()
        if (!tierlistId) throw new Error('No tierlist loaded')

        const updatedTierlist = await apiUpdateTierlistMeta(tierlistId, updates)
        set({ tierlist: updatedTierlist })
        return updatedTierlist
      },
    }),

    openMetaModal: () => set({ isMetaModalOpen: true }),
    closeMetaModal: () => set({ isMetaModalOpen: false }),

    openCategoryModal: (categoryId?: string) =>
      set({
        isCategoryModalOpen: true,
        editingCategoryId: categoryId || null,
      }),

    closeCategoryModal: () =>
      set({
        isCategoryModalOpen: false,
        editingCategoryId: null,
      }),

    createCategory: createAsyncAction<
      TierlistEditorState,
      Category,
      CreateCategoryRequest,
      'categoryCreate'
    >({ getState: get, setState: set }, 'categoryCreate', {
      fetchFunction: async (data) => {
        const { tierlistId } = get()
        if (!tierlistId) throw new Error('No tierlist loaded')

        const newCategory = await apiCreateCategory(tierlistId, data)
        const currentCategories = get().categories
        set({ categories: [...currentCategories, newCategory] })
        return newCategory
      },
    }),

    updateCategory: createAsyncAction<
      TierlistEditorState,
      Category,
      { id: string; updates: UpdateCategoryRequest },
      'categoryUpdate'
    >({ getState: get, setState: set }, 'categoryUpdate', {
      fetchFunction: async ({ id, updates }) => {
        const updatedCategory = await apiUpdateCategory(id, updates)
        const currentCategories = get().categories
        set({
          categories: currentCategories.map((cat) =>
            cat.id === id ? updatedCategory : cat
          ),
        })
        return updatedCategory
      },
    }),

    deleteCategory: async (id: string) => {
      await apiDeleteCategory(id)
      const currentCategories = get().categories
      set({
        categories: currentCategories.filter((cat) => cat.id !== id),
      })
    },

    reset: () => set(initialState),
  }),
  { name: FEATURE_NAME, resettable: true }
)

export const selectTierlist = (state: TierlistEditorState) => state.tierlist
export const selectCategories = (state: TierlistEditorState) => state.categories
export const selectIsLoading = (state: TierlistEditorState) => state.isLoading
export const selectError = (state: TierlistEditorState) => state.error
export const selectIsMetaModalOpen = (state: TierlistEditorState) =>
  state.isMetaModalOpen
export const selectIsCategoryModalOpen = (state: TierlistEditorState) =>
  state.isCategoryModalOpen
export const selectEditingCategoryId = (state: TierlistEditorState) =>
  state.editingCategoryId
