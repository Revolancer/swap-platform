import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import { ProjectTabs } from '@/components/project-hub/tabs';
import { ActiveProjectsTable } from '@/components/project-hub/active/active-projects-table';
import { FullWidth, Flex } from '@revolancer/ui/layout';
import { H1, H5 } from '@revolancer/ui/text';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';

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
