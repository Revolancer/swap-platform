import { Card, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';

export const PortfoliosSkeleton = ({
  withAuthor = false,
}: {
  withAuthor?: boolean;
}) => (
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
      {withAuthor && (
        <Flex css={{ alignItems: 'center' }}>
          <SkeletonText
            css={{
              width: '$9',
              height: '$9',
              borderRadius: '$2',
            }}
          />
          <SkeletonText type="p" css={{ width: '33%' }} />
        </Flex>
      )}
      <Flex>
        {Array(4)
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

export const skeletonPortfoliosArray = (number = 15, withAuthor = false) =>
  Array(number).fill(<PortfoliosSkeleton withAuthor={withAuthor} />);
