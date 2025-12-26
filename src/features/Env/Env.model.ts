export const FEATURE_NAME = 'env'

export const EnvironmentType = {
  Prod: 'production',
  Dev: 'development',
  Local: 'local',
}

export type EnvironmentTypeValue =
  (typeof EnvironmentType)[keyof typeof EnvironmentType]

export const envVersion = import.meta.env.VITE_APP_VERSION
export const appEnv = import.meta.env.VITE_APP_ENV as EnvironmentTypeValue

export const isAppEnvLocal = appEnv === EnvironmentType.Local

export function showVersion() {
  console.info(`TierMaker version: ${envVersion} (${appEnv})`)
}
