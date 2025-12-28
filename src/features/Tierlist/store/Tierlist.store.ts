import {
  createAsyncAction,
  createLoadableData,
  createStore,
} from '@/features/Store'
import type { StateLoadableSlice } from '@/types'
import { apiCreateTierList, apiDeleteTierList, apiFetchTierLists } from '../Tierlist.api'
import { FEATURE_NAME } from '../Tierlist.model'
import type { CreateTierListRequest, TierList } from '../Tierlist.types'

type TierlistState = {
  tierlists: StateLoadableSlice<TierList[]>
  newTierlist: StateLoadableSlice<TierList>
  isCreateModalOpen: boolean

  fetchTierLists: (userId: string) => Promise<void>
  createTierListAction: (request: {
    userId: string
    request: CreateTierListRequest
  }) => Promise<void>
  deleteTierlist: (tierlistId: string) => Promise<void>
  openCreateModal: () => void
  closeCreateModal: () => void
  resetCreateState: () => void
}

export const useTierlistStore = createStore<TierlistState>()(
  (set, get) => ({
    tierlists: createLoadableData<TierList[]>(),
    newTierlist: createLoadableData<TierList>(),
    isCreateModalOpen: false,

    fetchTierLists: createAsyncAction<
      TierlistState,
      TierList[],
      string,
      'tierlists'
    >({ getState: get, setState: set } as any, 'tierlists', {
      fetchFunction: async (userId: string) => {
        return await apiFetchTierLists(userId)
      },
    }),

    createTierListAction: createAsyncAction<
      TierlistState,
      TierList,
      { userId: string; request: CreateTierListRequest },
      'newTierlist'
    >({ getState: get, setState: set } as any, 'newTierlist', {
      fetchFunction: async ({ userId, request }) => {
        const newTierlist = await apiCreateTierList(userId, request)

        const currentLists = get().tierlists.data || []
        set({
          tierlists: {
            ...get().tierlists,
            data: [newTierlist, ...currentLists],
          },
        })

        return newTierlist
      },
    }),

    deleteTierlist: async (tierlistId: string) => {
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
    resetCreateState: () => set({ newTierlist: createLoadableData() }),
  }),
  { name: FEATURE_NAME, resettable: true }
)

export const selectTierlists = (state: TierlistState) => state.tierlists
export const selectIsCreateModalOpen = (state: TierlistState) =>
  state.isCreateModalOpen
export const selectNewTierlist = (state: TierlistState) => state.newTierlist
