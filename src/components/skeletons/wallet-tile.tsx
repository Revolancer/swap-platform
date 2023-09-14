import { Card, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';

export const WalletTileSkeleton = () => (
  <Card css={{ height: '134px' }}>
    <SkeletonText type="h5" />
    <Flex css={{ alignItems: 'center', flexGrow: 1 }}>
      <SkeletonText type="h2" />
    </Flex>
  </Card>
);
