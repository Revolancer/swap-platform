import { P, Span } from '@/components/text/text';

export const CrumbDivider = () => (
  <Span
    css={{
      color: '$neutral600',
      lineHeight: '$body2',
      fontSize: '$body2',
      paddingInline: '$4',
    }}
  >
    /
  </Span>
);
