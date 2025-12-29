import {
  createAsyncAction,
  createLoadableData,
  createStore,
} from '@/features/Store'
import type { TierList } from '@/features/Tierlist/Tierlist.types'
import type { StateLoadableSlice } from '@/types'
import {
  apiBulkCreateCandidates,
  apiCreateCandidate,
  apiCreateCategory,
  apiDeleteCandidate,
  apiDeleteCategory,
  apiFetchCandidates,
  apiFetchCategories,
  apiFetchPlacements,
  apiFetchTierlist,
  apiUpdateCandidate,
  apiUpdateCategory,
  apiUpdatePlacement,
  apiUpdateTierlistMeta,
} from '../TierlistEditor.api'
import { FEATURE_NAME } from '../TierlistEditor.model'
import {
  type Candidate,
  type Category,
  CATEGORY_MOVE_DIRECTION,
  type CategoryMoveDirection,
  type CreateCandidateRequest,
  type CreateCategoryRequest,
  type Placement,
  type UpdateCandidateRequest,
  type UpdateCategoryRequest,
} from '../TierlistEditor.types'

type TierlistEditorState = {
  tierlistId: string | null
  tierlist: StateLoadableSlice<TierList>
  categories: StateLoadableSlice<Category[]>
  candidates: StateLoadableSlice<Candidate[]>
  placements: Map<string, Placement>

  isMetaModalOpen: boolean
  isCategoryModalOpen: boolean
  editingCategoryId: string | null
  isCandidateModalOpen: boolean
  editingCandidateId: string | null
  isCandidateViewModalOpen: boolean
  viewingCandidateId: string | null
  isBulkImportModalOpen: boolean

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

  fetchCandidates: () => Promise<void>
  fetchPlacements: () => Promise<void>
  createCandidate: (data: CreateCandidateRequest) => Promise<void>
  updateCandidate: (
    id: string,
    updates: UpdateCandidateRequest
  ) => Promise<void>
  deleteCandidate: (id: string) => Promise<void>
  updatePlacement: (
    candidateId: string,
    categoryId: string | null,
    sortOrder: number
  ) => Promise<void>

  openCandidateModal: (candidateId?: string) => void
  closeCandidateModal: () => void

  openCandidateViewModal: (candidateId: string) => void
  closeCandidateViewModal: () => void

  bulkCreateCandidates: (
    candidates: CreateCandidateRequest[]
  ) => Promise<void>
  openBulkImportModal: () => void
  closeBulkImportModal: () => void

  reset: () => void
}

const initialState = {
  tierlistId: null,
  tierlist: createLoadableData<TierList>(),
  categories: createLoadableData<Category[]>(),
  candidates: createLoadableData<Candidate[]>(),
  placements: new Map<string, Placement>(),
  isMetaModalOpen: false,
  isCategoryModalOpen: false,
  editingCategoryId: null,
  isCandidateModalOpen: false,
  editingCandidateId: null,
  isCandidateViewModalOpen: false,
  viewingCandidateId: null,
  isBulkImportModalOpen: false,
}

export const useTierlistEditorStore = createStore<TierlistEditorState>()(
  (set, get) => ({
    ...initialState,

    loadEditor: async (id: string) => {
      set({ tierlistId: id })

      const { fetchTierlist, fetchCategories, fetchCandidates, fetchPlacements } =
        get()
      await Promise.all([
        fetchTierlist(),
        fetchCategories(),
        fetchCandidates(),
        fetchPlacements(),
      ])
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

    fetchCandidates: createAsyncAction<
      TierlistEditorState,
      Candidate[],
      void,
      'candidates'
    >({ getState: get, setState: set }, 'candidates', {
      fetchFunction: async () => {
        const { tierlistId } = get()
        if (!tierlistId) throw new Error('No tierlist ID')

        return await apiFetchCandidates(tierlistId)
      },
    }),

    fetchPlacements: async () => {
      const { tierlistId } = get()
      if (!tierlistId) throw new Error('No tierlist ID')

      const placements = await apiFetchPlacements(tierlistId)
      const placementsMap = new Map<string, Placement>()
      placements.forEach((placement) => {
        placementsMap.set(placement.candidate_id, placement)
      })

      set({ placements: placementsMap })
    },

    createCandidate: async (data: CreateCandidateRequest) => {
      const { tierlistId } = get()
      if (!tierlistId) throw new Error('No tierlist loaded')

      const currentCandidates = get().candidates.data || []
      const nextSortOrder = currentCandidates.length

      const newCandidate = await apiCreateCandidate(tierlistId, {
        ...data,
        sort_order: nextSortOrder,
      })

      set({
        candidates: {
          ...get().candidates,
          data: [...currentCandidates, newCandidate],
        },
      })

      await get().fetchPlacements()
    },

    updateCandidate: async (id: string, updates: UpdateCandidateRequest) => {
      const updatedCandidate = await apiUpdateCandidate(id, updates)
      const currentCandidates = get().candidates.data || []
      set({
        candidates: {
          ...get().candidates,
          data: currentCandidates.map((cand) =>
            cand.id === id ? updatedCandidate : cand
          ),
        },
      })
    },

    deleteCandidate: async (id: string) => {
      await apiDeleteCandidate(id)
      const currentCandidates = get().candidates.data || []
      set({
        candidates: {
          ...get().candidates,
          data: currentCandidates.filter((cand) => cand.id !== id),
        },
      })

      const currentPlacements = new Map(get().placements)
      currentPlacements.delete(id)
      set({ placements: currentPlacements })
    },

    updatePlacement: async (
      candidateId: string,
      categoryId: string | null,
      sortOrder: number
    ) => {
      const { tierlistId } = get()
      if (!tierlistId) throw new Error('No tierlist loaded')

      const updatedPlacement = await apiUpdatePlacement(
        tierlistId,
        candidateId,
        categoryId,
        sortOrder
      )

      const currentPlacements = new Map(get().placements)
      currentPlacements.set(candidateId, updatedPlacement)
      set({ placements: currentPlacements })
    },

    openCandidateModal: (candidateId?: string) =>
      set({
        isCandidateModalOpen: true,
        editingCandidateId: candidateId || null,
      }),

    closeCandidateModal: () =>
      set({
        isCandidateModalOpen: false,
        editingCandidateId: null,
      }),

    openCandidateViewModal: (candidateId: string) =>
      set({
        isCandidateViewModalOpen: true,
        viewingCandidateId: candidateId,
      }),

    closeCandidateViewModal: () =>
      set({
        isCandidateViewModalOpen: false,
        viewingCandidateId: null,
      }),

    bulkCreateCandidates: async (candidates: CreateCandidateRequest[]) => {
      const { tierlistId } = get()
      if (!tierlistId) throw new Error('No tierlist loaded')

      const newCandidates = await apiBulkCreateCandidates(
        tierlistId,
        candidates
      )

      const currentCandidates = get().candidates.data || []
      set({
        candidates: {
          ...get().candidates,
          data: [...currentCandidates, ...newCandidates],
        },
      })

      await get().fetchPlacements()
    },

    openBulkImportModal: () => set({ isBulkImportModalOpen: true }),
    closeBulkImportModal: () => set({ isBulkImportModalOpen: false }),

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

export const selectCandidates = (state: TierlistEditorState) => state.candidates
export const selectPlacements = (state: TierlistEditorState) => state.placements
export const selectIsCandidateModalOpen = (state: TierlistEditorState) =>
  state.isCandidateModalOpen
export const selectEditingCandidateId = (state: TierlistEditorState) =>
  state.editingCandidateId
export const selectIsCandidateViewModalOpen = (state: TierlistEditorState) =>
  state.isCandidateViewModalOpen
export const selectViewingCandidateId = (state: TierlistEditorState) =>
  state.viewingCandidateId
export const selectIsBulkImportModalOpen = (state: TierlistEditorState) =>
  state.isBulkImportModalOpen

export const selectCandidatesInCategory =
  (categoryId: string) => (state: TierlistEditorState) => {
    const candidates = state.candidates.data || []
    const placements = state.placements

    return candidates.filter((candidate) => {
      const placement = placements.get(candidate.id)
      return placement?.category_id === categoryId
    })
  }

export const selectUnplacedCandidates = (state: TierlistEditorState) => {
  const candidates = state.candidates.data || []
  const placements = state.placements

  return candidates.filter((candidate) => {
    const placement = placements.get(candidate.id)
    return placement?.category_id === null
  })
}
