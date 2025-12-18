/// <reference types="react" />

declare global {
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
