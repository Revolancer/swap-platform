import { Card, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';

export const PortfoliosSkeleton = () => (
  <Card unpadded>
    <SkeletonText />
    <Flex column gap={4} css={{ padding: '$6' }}>
      <SkeletonText
        css={{
          fontWeight: '$bold',
          fontSize: '$body1',
          lineHeight: '$body1',
        }}
        type="p"
      />
      <Flex css={{ alignItems: 'center' }}>
        {/*<RoundedSquareImage loading size="small" />*/}
        <SkeletonText
          css={{
            width: '$9',
            height: '$9',
            borderRadius: '$2',
          }}
        />
        <SkeletonText type="p" />
      </Flex>
      <Flex>
        {Array(3)
          .fill(null)
          .map((item, idx) => (
            <SkeletonText type="tag" key={`tag-${idx}`} />
          ))}
      </Flex>
      {Array(3)
        .fill(null)
        .map((item, idx) => (
          <SkeletonText type="p" key={`p-${idx}`} />
        ))}
    </Flex>
  </Card>
);

export const skeletonPortfoliosArray = Array(15).fill(<PortfoliosSkeleton />);
