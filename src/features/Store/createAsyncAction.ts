import type { StateLoadableSlice } from '@/types'

type StateWithSlice<SliceKey extends string | number | symbol, Response> = {
  [K in SliceKey]: StateLoadableSlice<Response>
}

interface AsyncActionOptions<Response, Request> {
  fetchFunction: (request: Request) => Promise<Response>
}

interface StoreHelpers<State> {
  getState: () => State
  setState: (
    partial: Partial<State> | ((state: State) => Partial<State>)
  ) => void
}

export function createAsyncAction<
  State extends StateWithSlice<SliceKey, Response>,
  Response,
  Request,
  SliceKey extends keyof State,
>(
  store: StoreHelpers<State>,
  sliceKey: SliceKey,
  options: AsyncActionOptions<Response, Request>
) {
  return async (request: Request) => {
    const { fetchFunction } = options
    const prevState = store.getState()
    if (prevState[sliceKey].isLoading) return

    store.setState((state) => ({
      ...state,
      [sliceKey]: { ...state[sliceKey], isLoading: true, error: null },
    }))

    try {
      const data = await fetchFunction(request)
      store.setState((state) => ({
        ...state,
        [sliceKey]: { data, isLoading: false, isSuccess: true, error: null },
      }))
    } catch (error) {
      store.setState((state) => ({
        ...state,
        [sliceKey]: {
          ...state[sliceKey],
          data: null,
          isLoading: false,
          isSuccess: false,
          error: String(error),
        },
      }))
    }
  }
}
