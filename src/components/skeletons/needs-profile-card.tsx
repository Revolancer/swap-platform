import { Card, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';

export const NeedsSkeleton = ({
  withAuthor = false,
}: {
  withAuthor?: boolean;
}) => (
  <Card unpadded>
    <Flex column gap={4} css={{ padding: '$6' }}>
      <SkeletonText
        type="p"
        css={{
          fontWeight: '$bold',
          fontSize: '$body1',
          lineHeight: '$body1',
        }}
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
          <SkeletonText type="p" />
        </Flex>
      )}
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

export const skeletonNeedsArray = (number = 5, withAuthor = false) =>
  Array(number).fill(<NeedsSkeleton withAuthor={withAuthor} />);
