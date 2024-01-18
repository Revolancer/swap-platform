import { TertiaryFormButton } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';

export const BackToTop = ({
  scroll,
  showScroll,
}: {
  scroll: () => void;
  showScroll: boolean;
}) => (
  <Flex
    css={{
      backgroundImage:
        'linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0.66), rgba(255,255,255,0.75), rgba(255,255,255,1))',
      width: '100%',
      height: '10vh',
      top: '8%',
      left: 0,
      display: showScroll ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      '@sm': {
        top: 0,
      },
    }}
  >
    <TertiaryFormButton
      onClick={scroll}
      css={{
        backgroundColor: '$neutral100',
        color: '$neutral200',
        opacity: 0.75,
        padding: '$3 $5',
        borderRadius: '$2',

        '&:hover': {
          borderColor: '$neutral200',
          borderWidth: '$2',
          color: '$neutral600',
          opacity: 1,
        },

        '@sm': {
          top: '3%',
        },
      }}
    >
      Back to Top
    </TertiaryFormButton>
  </Flex>
);
