import { AppShell } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import Snowfall from 'react-snowfall'

export function LayoutEmpty() {
  return (
    <AppShell padding="md">
      <Snowfall
        snowflakeCount={200}
        speed={[0.5, 1.0]}
        wind={[-0.5, 2.0]}
        radius={[0.5, 3.0]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      />
      <AppShell.Main pb="xl">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
