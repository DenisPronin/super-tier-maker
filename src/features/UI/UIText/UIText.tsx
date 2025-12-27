import { Text, type TextProps } from '@mantine/core'
import { type ReactNode } from 'react'

export function UIText({
  children,
  ...props
}: TextProps & { children: ReactNode }) {
  return <Text {...props}>{children}</Text>
}
