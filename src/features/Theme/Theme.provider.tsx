import { createTheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { type ReactNode } from 'react'
import '@mantine/core/styles.css'
import '@/styles/main.css'

const theme = createTheme({})

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  )
}
