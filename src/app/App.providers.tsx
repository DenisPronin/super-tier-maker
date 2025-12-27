import { createElement, type ReactNode } from 'react'
import { appFeatures } from './App.features'

export function AppProviders({ children }: { children: ReactNode }) {
  const providers = appFeatures
    .filter((feature) => !!feature.provider)
    .map((feature) => feature.provider!)

  return (
    <>
      {providers.reverse().reduce((memo, provider) => {
        return createElement(provider!, null, memo)
      }, children)}
    </>
  )
}
