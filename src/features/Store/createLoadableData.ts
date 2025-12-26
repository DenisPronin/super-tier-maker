import type { StateLoadableSlice } from '@/types'

export function createLoadableData<T>(): StateLoadableSlice<T> {
  return {
    data: null,
    isLoading: false,
    isSuccess: false,
    error: null,
  }
}
