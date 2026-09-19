import styled from '@emotion/styled'
import { Box, type BoxProps, Paper, type PaperProps } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import {
  getCategoryBackground,
  isRainbowColor,
} from '../../../utils/category-color'

export const Container = styled(Paper)<PropsWithChildren<PaperProps>>`
  overflow: hidden;
`

export const Label = styled(Box, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<PropsWithChildren<BoxProps & { $color: string }>>`
  width: 120px;
  background: ${(props) => getCategoryBackground(props.$color, 'gray')};
  padding: 12px 16px;
  font-weight: bold;
  color: white;
  ${(props) =>
    isRainbowColor(props.$color)
      ? 'text-shadow: 0 0 2px rgba(0, 0, 0, 0.9), 0 0 4px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.8);'
      : ''}
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Content = styled(Box, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<PropsWithChildren<BoxProps & { $isEmpty: boolean }>>`
  position: relative;
  padding: 12px 16px;
  min-height: 100px;
  background-color: var(--mantine-color-dark-7);
  transition: background-color 0.2s ease;
`
