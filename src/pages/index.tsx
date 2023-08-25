import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import { FeedSegment } from '@/components/dashboard/feedsegment';
import { CrumbBar, Crumb } from '@revolancer/ui/navigation';
import { FullWidth } from '@revolancer/ui/layout';

export default function Home() {
  return (
    <>
      <Title>Discover</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/" active>
            Discovery
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <FeedSegment />
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
