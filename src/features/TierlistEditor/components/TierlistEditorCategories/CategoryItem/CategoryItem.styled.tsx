import styled from '@emotion/styled'
import { Box, type BoxProps, Paper, type PaperProps } from '@mantine/core'
import type { PropsWithChildren } from 'react'

export const Container = styled(Paper)<PropsWithChildren<PaperProps>>`
  overflow: hidden;
`

export const Label = styled(Box, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<PropsWithChildren<BoxProps & { $color: string }>>`
  width: 120px;
  background-color: ${(props) => props.$color || 'gray'};
  padding: 12px 16px;
  font-weight: bold;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Content = styled(Box, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<PropsWithChildren<BoxProps & { $isEmpty: boolean }>>`
  flex: 1;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 100px;
  background-color: var(--mantine-color-dark-7);
  border: ${(props) =>
    props.$isEmpty ? '2px dashed var(--mantine-color-dark-4)' : 'none'};
  transition: background-color 0.2s ease;
`
