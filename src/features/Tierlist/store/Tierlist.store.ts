import {
  createAsyncAction,
  createLoadableData,
  createStore,
} from '@/features/Store'
import type { StateLoadableSlice } from '@/types'
import {
  apiCreateTierList,
  apiDeletePreview,
  apiDeleteTierList,
  apiFetchTierLists,
  apiUpdateTierListPreview,
} from '../Tierlist.api'
import { FEATURE_NAME } from '../Tierlist.model'
import type { CreateTierListRequest, TierList } from '../Tierlist.types'

type TierlistState = {
  tierlists: StateLoadableSlice<TierList[]>
  isCreateModalOpen: boolean

  fetchTierLists: (userId: string) => Promise<void>
  createTierList: (request: {
    userId: string
    request: CreateTierListRequest
    previewFile?: File
  }) => Promise<TierList>
  deleteTierlist: (tierlistId: string) => Promise<void>
  openCreateModal: () => void
  closeCreateModal: () => void
}

export const useTierlistStore = createStore<TierlistState>()(
  (set, get) => ({
    tierlists: createLoadableData<TierList[]>(),
    isCreateModalOpen: false,

    fetchTierLists: createAsyncAction<
      TierlistState,
      TierList[],
      string,
      'tierlists'
    >({ getState: get, setState: set }, 'tierlists', {
      fetchFunction: async (userId: string) => {
        return await apiFetchTierLists(userId)
      },
    }),

    createTierList: async (request: {
      userId: string
      request: CreateTierListRequest
      previewFile?: File
    }) => {
      let newTierlist = await apiCreateTierList(
        request.userId,
        request.request
      )

      if (request.previewFile) {
        newTierlist = await apiUpdateTierListPreview(
          newTierlist.id,
          request.previewFile
        )
      }

      const currentLists = get().tierlists.data || []
      set({
        tierlists: {
          ...get().tierlists,
          data: [newTierlist, ...currentLists],
        },
      })

      return newTierlist
    },

    deleteTierlist: async (tierlistId: string) => {
      try {
        await apiDeletePreview(tierlistId)
      } catch {
        // Preview might not exist, continue with deletion
      }

      await apiDeleteTierList(tierlistId)

      const currentLists = get().tierlists.data || []
      set({
        tierlists: {
          ...get().tierlists,
          data: currentLists.filter((tierlist) => tierlist.id !== tierlistId),
        },
      })
    },

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
  }),
  { name: FEATURE_NAME, resettable: true }
)

export const selectTierlists = (state: TierlistState) => state.tierlists
export const selectIsCreateModalOpen = (state: TierlistState) =>
  state.isCreateModalOpen
