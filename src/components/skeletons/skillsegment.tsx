import { Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { P } from '@revolancer/ui/text';

export const SkillSkeleton = () => (
  <>
    <Flex
      style={{
        justifyContent: 'flex-start',
        width: '100%',
      }}
    >
      <P css={{ color: '$neutral600' }}>Skills</P>
    </Flex>
    <Flex>
      {Array(4)
        .fill(null)
        .map((item, idx) => (
          <SkeletonText type="tag" key={`tag-${idx}`} />
        ))}
    </Flex>
  </>
);
