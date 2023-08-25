import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
//import { FullWidth } from '@/components/layout/columns';
//import { H1, H5 } from '@/components/text/headings';
import { ProjectTabs } from '@/components/project-hub/tabs';
//import { Flex } from '@/components/layout/flex';
import { CompletedProjectsTable } from '@/components/project-hub/active/completed-projects-table';
//import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
//import { Crumb } from '@/components/navigation/crumbs/crumb';
import { FullWidth, Flex } from '@revolancer/ui/layout';
import { H1, H5 } from '@revolancer/ui/text';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';

export default function CreditDashboard() {
  return (
    <>
      <Title>Completed Projects</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/projects">Project Hub</Crumb>
          <Crumb href="/projects/completed" active>
            Completed Projects
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Flex column>
            <H1>Project Hub</H1>
            <ProjectTabs />
            <H5>Completed Projects</H5>
            <CompletedProjectsTable />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
