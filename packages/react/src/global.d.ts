/// <reference types="react" />

import type { CalculateElement } from '@calculateit/web-component';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'calculate-it': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          ref?: React.Ref<CalculateElement>;
          class?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
