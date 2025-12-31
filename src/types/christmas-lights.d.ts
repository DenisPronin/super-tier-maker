import type React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'christmas-lights': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

export {}
