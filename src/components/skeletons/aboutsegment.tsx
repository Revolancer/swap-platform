import { Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { P } from '@revolancer/ui/text';

export const AboutSkeleton = () => (
  <>
    <Flex
      style={{
        justifyContent: 'flex-start',
        width: '100%',
      }}
    >
      <P css={{ color: '$neutral600' }}>About</P>
    </Flex>
    {Array(3)
      .fill(null)
      .map((item, idx) => (
        <SkeletonText type="p" key={`p-${idx}`} css={{ marginTop: '$2' }} />
      ))}
  </>
);
