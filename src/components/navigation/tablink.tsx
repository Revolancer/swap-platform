import { styled } from 'stitches.config';
import Link from 'next/link';

export const TabLink = styled(Link, {
  fontSize: '$body2',
  color: '$neutral600',
  textDecoration: 'none',
  display: 'block',
  paddingInline: '$5',
  paddingBlock: '$3',

  variants: {
    active: {
      true: {
        color: '$black',
        fontWeight: '$medium',
        borderStyle: 'none',
        borderWidth: '$2',
        borderColor: '$black',
        borderBlockEndStyle: 'solid',
      },
    },
  },
});
