import { styled } from 'stitches.config';
import { Flex } from './flex';
import { P } from '../text/text';

export const Divider = styled('hr', {
  borderWidth: '0',
  borderStyle: 'none',
  borderTopColor: '$neutral400',
  borderTopWidth: '2px',
  borderTopStyle: '$solid',
  marginBlock: '$2',
  flexGrow: '1',

  variants: {
    color: {
      white: {
        borderTopColor: '$white',
      },
      gray: {
        borderTopColor: '$neutral400',
      },
    },
  },
  defaultVariants: {
    color: 'gray',
  },
});

export const LabelledDivider = ({ label }: { label: string }) => {
  return (
    <Flex css={{ alignItems: 'center' }}>
      <Divider />
      <P
        css={{
          fontWeight: '$bold',
          color: '$neutral600',
        }}
      >
        {label}
      </P>
      <Divider />
    </Flex>
  );
};
