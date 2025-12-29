import { createTheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { type ReactNode } from 'react'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@/styles/main.css'

const theme = createTheme({})

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <Notifications />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  )
}
