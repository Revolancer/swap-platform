import { styled } from '@revolancer/ui';

export const MessageSideBar = styled('div', {
  gridColumn: 'auto / span 4',
  display: 'none',
  '@sm': {
    gridColumn: 'auto / span 8',
  },

  '@md': {
    gridColumn: 'auto / span 4',
  },

  variants: {
    hasThread: {
      true: {
        '@md': {
          display: 'block',
        },
      },
      false: {
        display: 'block',
      },
    },
  },
});
