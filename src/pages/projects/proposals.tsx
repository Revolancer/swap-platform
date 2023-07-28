import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import { FullWidth } from '@/components/layout/columns';
import { H1 } from '@/components/text/headings';
import { ProjectTabs } from '@/components/project-hub/tabs';
import { Flex } from '@/components/layout/flex';
import { NeedsSegment } from '@/components/user/needssegment';
import store from '@/redux/store';
import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
import { Crumb } from '@/components/navigation/crumbs/crumb';
import { ProposalsSegment } from '@/components/project-hub/proposalssegment';

export default function CreditDashboard() {
  const self = store?.getState()?.userData?.user?.id ?? '';

  return (
    <>
      <Title>Outgoing Proposals</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/projects">Project Hub</Crumb>
          <Crumb href="/projects/proposals" active>
            My Proposals
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Flex column>
            <H1>Project Hub</H1>
            <ProjectTabs />
            <ProposalsSegment uid={self} />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
