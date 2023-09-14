import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { RoundedSquareImage } from '@revolancer/ui/user';

export const SocialsSkeleton = () => (
  <>
    <Flex
      style={{
        justifyContent: 'flex-start',
        width: '100%',
      }}
    >
      <P css={{ color: '$neutral600' }}>Socials</P>
    </Flex>
    <Flex gap={4}>
      {Array(4)
        .fill(null)
        .map((item, idx) => (
          <RoundedSquareImage loading size="small" key={idx.toString()} />
        ))}
    </Flex>
  </>
);
