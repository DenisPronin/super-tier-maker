import { type Nullish } from './Common.types'

export interface StateLoadableSlice<T> {
  data: Nullish<T>
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
