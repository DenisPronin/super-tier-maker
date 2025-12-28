import {
  createAsyncAction,
  createLoadableData,
  createStore,
} from '@/features/Store'
import type { StateLoadableSlice } from '@/types'
import {
  apiCreateTierList,
  apiDeleteTierList,
  apiFetchTierLists,
  apiUpdateTierListPreview,
} from '../Tierlist.api'
import { FEATURE_NAME } from '../Tierlist.model'
import type { CreateTierListRequest, TierList } from '../Tierlist.types'

type TierlistState = {
  tierlists: StateLoadableSlice<TierList[]>
  newTierlist: StateLoadableSlice<TierList>
  previewUpload: StateLoadableSlice<TierList>
  isCreateModalOpen: boolean

  fetchTierLists: (userId: string) => Promise<void>
  createTierList: (request: {
    userId: string
    request: CreateTierListRequest
    previewFile?: File
  }) => Promise<void>
  deleteTierlist: (tierlistId: string) => Promise<void>
  uploadPreview: (request: { tierlistId: string; file: File }) => Promise<void>
  openCreateModal: () => void
  closeCreateModal: () => void
  resetCreateState: () => void
  resetPreviewUploadState: () => void
}

export const useTierlistStore = createStore<TierlistState>()(
  (set, get) => ({
    tierlists: createLoadableData<TierList[]>(),
    newTierlist: createLoadableData<TierList>(),
    previewUpload: createLoadableData<TierList>(),
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

    createTierList: createAsyncAction<
      TierlistState,
      TierList,
      { userId: string; request: CreateTierListRequest; previewFile?: File },
      'newTierlist'
    >({ getState: get, setState: set } as any, 'newTierlist', {
      fetchFunction: async ({ userId, request, previewFile }) => {
        let newTierlist = await apiCreateTierList(userId, request)

        if (previewFile) {
          newTierlist = await apiUpdateTierListPreview(
            newTierlist.id,
            previewFile
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

    uploadPreview: createAsyncAction<
      TierlistState,
      TierList,
      { tierlistId: string; file: File },
      'previewUpload'
    >({ getState: get, setState: set } as any, 'previewUpload', {
      fetchFunction: async ({ tierlistId, file }) => {
        const updatedTierlist = await apiUpdateTierListPreview(tierlistId, file)

        const currentLists = get().tierlists.data || []
        set({
          tierlists: {
            ...get().tierlists,
            data: currentLists.map((tierlist) =>
              tierlist.id === tierlistId ? updatedTierlist : tierlist
            ),
          },
        })

        return updatedTierlist
      },
    }),

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
    resetCreateState: () => set({ newTierlist: createLoadableData() }),
    resetPreviewUploadState: () => set({ previewUpload: createLoadableData() }),
  }),
  { name: FEATURE_NAME, resettable: true }
)

export const selectTierlists = (state: TierlistState) => state.tierlists
export const selectIsCreateModalOpen = (state: TierlistState) =>
  state.isCreateModalOpen
export const selectNewTierlist = (state: TierlistState) => state.newTierlist
export const selectPreviewUpload = (state: TierlistState) => state.previewUpload
