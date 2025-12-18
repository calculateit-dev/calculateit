import type * as React from 'react';

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'calculate-it': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          ref?: React.Ref<HTMLElement>;
          class?: string;
        },
        HTMLElement
      >;
    }
  }
}
