import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TertiaryFormButton } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';

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
        'linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,1))',
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
        borderWidth: '$2',
        borderStyle: '$solid',
        borderColor: '$neutral200',
        display: 'flex',
        alignItems: 'center',
        gap: '$3',

        '&:hover': {
          borderColor: '$neutral300',
          color: '$neutral500',
          opacity: 1,
        },

        '&:active': {
          textDecoration: 'none',
        },

        '@sm': {
          top: '3%',
        },
      }}
    >
      <FontAwesomeIcon icon={faAngleDoubleUp} />
      <P>Back to Top</P>
    </TertiaryFormButton>
  </Flex>
);
