import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import { FullWidth } from '@/components/layout/columns';
import { H1, H5 } from '@/components/text/headings';
import { ProjectTabs } from '@/components/project-hub/tabs';
import { Flex } from '@/components/layout/flex';
import { ActiveProjectsTable } from '@/components/project-hub/active/active-projects-table';
import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
import { Crumb } from '@/components/navigation/crumbs/crumb';

export default function CreditDashboard() {
  return (
    <>
      <Title>Active Projects</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/projects">Project Hub</Crumb>
          <Crumb href="/projects/active" active>
            Active Projects
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Flex column>
            <H1>Project Hub</H1>
            <ProjectTabs />
            <H5>Active Projects</H5>
            <ActiveProjectsTable />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
