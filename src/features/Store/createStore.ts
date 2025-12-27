import { appEnv, EnvironmentType } from '@/features/Env'
import {
  create,
  type StateCreator,
  type StoreApi,
  type UseBoundStore,
} from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'

const storeResetFns = new Set<() => void>()

export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn()
  })
}

interface StoreOptions<T> {
  name: string
  resettable?: boolean
  persistOptions?: PersistOptions<T, Partial<T>>
  hasLogs?: boolean
}

export const createStore = <T>() => {
  return (
    stateCreator: StateCreator<T>,
    options?: StoreOptions<T>
  ): UseBoundStore<StoreApi<T>> => {
    let store = create(stateCreator)
    if (options?.persistOptions) {
      store = create(persist(stateCreator, options.persistOptions))
    }

    const initialState = store.getInitialState()
    if (options?.resettable) {
      storeResetFns.add(() => {
        store.setState(initialState, true)
      })
    }

    if (options?.hasLogs && appEnv === EnvironmentType.Local) {
      store.subscribe((state) => {
        console.info(options.name, state)
      })
    }

    return store
  }
}
