import { Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { RoundedSquareImage } from '@revolancer/ui/user';

export const ThreadAuthorSkeleton = () => (
  <Flex css={{ alignItems: 'center' }}>
    <RoundedSquareImage loading size="medium" />
    <SkeletonText type="p" />
  </Flex>
);
