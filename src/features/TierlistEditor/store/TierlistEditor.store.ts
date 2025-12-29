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
  apiFetchCategories,
  apiFetchTierlist,
  apiUpdateCategory,
  apiUpdateTierlistMeta,
} from '../TierlistEditor.api'
import { FEATURE_NAME } from '../TierlistEditor.model'
import {
  CATEGORY_MOVE_DIRECTION,
  type Category,
  type CategoryMoveDirection,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
} from '../TierlistEditor.types'

type TierlistEditorState = {
  tierlistId: string | null
  tierlist: StateLoadableSlice<TierList>
  categories: StateLoadableSlice<Category[]>

  isMetaModalOpen: boolean
  isCategoryModalOpen: boolean
  editingCategoryId: string | null

  loadEditor: (id: string) => Promise<void>
  fetchTierlist: () => Promise<void>
  fetchCategories: () => Promise<void>
  updateMeta: (updates: {
    title?: string
    description?: string
  }) => Promise<void>

  openMetaModal: () => void
  closeMetaModal: () => void

  openCategoryModal: (categoryId?: string) => void
  closeCategoryModal: () => void

  createCategory: (data: CreateCategoryRequest) => Promise<void>
  updateCategory: (id: string, updates: UpdateCategoryRequest) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  moveCategory: (id: string, direction: CategoryMoveDirection) => Promise<void>

  reset: () => void
}

const initialState = {
  tierlistId: null,
  tierlist: createLoadableData<TierList>(),
  categories: createLoadableData<Category[]>(),
  isMetaModalOpen: false,
  isCategoryModalOpen: false,
  editingCategoryId: null,
}

export const useTierlistEditorStore = createStore<TierlistEditorState>()(
  (set, get) => ({
    ...initialState,

    loadEditor: async (id: string) => {
      set({ tierlistId: id })

      const { fetchTierlist, fetchCategories } = get()
      await Promise.all([fetchTierlist(), fetchCategories()])
    },

    fetchTierlist: createAsyncAction<
      TierlistEditorState,
      TierList,
      void,
      'tierlist'
    >({ getState: get, setState: set }, 'tierlist', {
      fetchFunction: async () => {
        const { tierlistId } = get()
        if (!tierlistId) throw new Error('No tierlist ID')

        return await apiFetchTierlist(tierlistId)
      },
    }),

    fetchCategories: createAsyncAction<
      TierlistEditorState,
      Category[],
      void,
      'categories'
    >({ getState: get, setState: set }, 'categories', {
      fetchFunction: async () => {
        const { tierlistId } = get()
        if (!tierlistId) throw new Error('No tierlist ID')

        return await apiFetchCategories(tierlistId)
      },
    }),

    updateMeta: async (updates: { title?: string; description?: string }) => {
      const { tierlistId } = get()
      if (!tierlistId) throw new Error('No tierlist loaded')

      const updatedTierlist = await apiUpdateTierlistMeta(tierlistId, updates)
      set({
        tierlist: {
          ...get().tierlist,
          data: updatedTierlist,
        },
      })
    },

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

    createCategory: async (data: CreateCategoryRequest) => {
      const { tierlistId } = get()
      if (!tierlistId) throw new Error('No tierlist loaded')

      const currentCategories = get().categories.data || []
      const nextSortOrder = currentCategories.length

      const newCategory = await apiCreateCategory(tierlistId, {
        ...data,
        sort_order: nextSortOrder,
      })

      set({
        categories: {
          ...get().categories,
          data: [...currentCategories, newCategory],
        },
      })
    },

    updateCategory: async (id: string, updates: UpdateCategoryRequest) => {
      const updatedCategory = await apiUpdateCategory(id, updates)
      const currentCategories = get().categories.data || []
      set({
        categories: {
          ...get().categories,
          data: currentCategories.map((cat) =>
            cat.id === id ? updatedCategory : cat
          ),
        },
      })
    },

    deleteCategory: async (id: string) => {
      await apiDeleteCategory(id)
      const currentCategories = get().categories.data || []
      set({
        categories: {
          ...get().categories,
          data: currentCategories.filter((cat) => cat.id !== id),
        },
      })
    },

    moveCategory: async (id: string, direction: CategoryMoveDirection) => {
      const currentCategories = get().categories.data || []
      const currentIndex = currentCategories.findIndex((cat) => cat.id === id)

      const offset = direction === CATEGORY_MOVE_DIRECTION.UP ? -1 : 1
      const targetIndex = currentIndex + offset

      if (targetIndex < 0 || targetIndex >= currentCategories.length) return

      const currentCategory = currentCategories[currentIndex]
      const targetCategory = currentCategories[targetIndex]

      await Promise.all([
        apiUpdateCategory(currentCategory.id, {
          sort_order: targetCategory.sort_order,
        }),
        apiUpdateCategory(targetCategory.id, {
          sort_order: currentCategory.sort_order,
        }),
      ])

      const updatedCategories = [...currentCategories]
      updatedCategories[currentIndex] = {
        ...currentCategory,
        sort_order: targetCategory.sort_order,
      }
      updatedCategories[targetIndex] = {
        ...targetCategory,
        sort_order: currentCategory.sort_order,
      }

      set({
        categories: {
          ...get().categories,
          data: updatedCategories.sort((a, b) => a.sort_order - b.sort_order),
        },
      })
    },

    reset: () => set(initialState),
  }),
  { name: FEATURE_NAME, resettable: true }
)

export const selectTierlist = (state: TierlistEditorState) => state.tierlist
export const selectCategories = (state: TierlistEditorState) => state.categories
export const selectIsLoading = (state: TierlistEditorState) =>
  state.tierlist.isLoading || state.categories.isLoading
export const selectError = (state: TierlistEditorState) =>
  state.tierlist.error || state.categories.error
export const selectIsMetaModalOpen = (state: TierlistEditorState) =>
  state.isMetaModalOpen
export const selectIsCategoryModalOpen = (state: TierlistEditorState) =>
  state.isCategoryModalOpen
export const selectEditingCategoryId = (state: TierlistEditorState) =>
  state.editingCategoryId
