import { createTheme, MantineProvider } from '@mantine/core'
import { type ReactNode } from 'react'
import '@mantine/core/styles.css'
import '@/styles/main.css'

const theme = createTheme({})

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      {children}
    </MantineProvider>
  )
}
