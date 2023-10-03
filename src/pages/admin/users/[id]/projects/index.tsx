import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ManageUserLayout from '@/components/admin/user/layout';
import { H5, P, Span } from '@revolancer/ui/text';
import { axiosPrivate } from '@/lib/axios';
import { DataTable, TD, TH, TR } from '@revolancer/ui/project-hubs';
import { Project } from '@/lib/types';
import { ProjectStatusEntry } from '@/components/project-hub/active/project-status-entry';
import { CollaboratorEntry } from '@/components/project-hub/active/collaborator-entry';
import { ProjectCreditEntry } from '@/components/project-hub/active/project-credit-entry';
import Link from 'next/link';

export default function UserProjects() {
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    axiosPrivate
      .get(`admin/users/${id}/projects/active`)
      .then((res) => res.data)
      .then((data) => {
        setActiveProjects(data);
      })
      .catch(() => setActiveProjects([]));

    axiosPrivate
      .get(`admin/users/${id}/projects/active/count`)
      .then((response) => {
        setActiveProjectsCount(response.data);
      })
      .catch((e) => setActiveProjectsCount(0));
  }, [id]);

  const NoProjects = () => <P>No active projects</P>;

  const MainContent = () => (
    <>
      <H5>Active Projects: {activeProjectsCount}</H5>
      <Span>Projects user is involved in</Span>
      <DataTable
        roundedBottom
        roundedTop
        renderHeadRow={() => (
          <TR>
            <TH>Project Title</TH>
            <TH>Collaborator</TH>
            <TH>Credits</TH>
            <TH>Project Status</TH>
          </TR>
        )}
        renderBodyRows={() => (
          <>
            {activeProjects.map((project) => {
              return (
                <TR key={project.id}>
                  <Link href={`/admin/users/${id}/projects/${project.id}`}>
                    <TD>{project.need.title ?? 'Untitled Project'}</TD>
                  </Link>
                  <TD>
                    <CollaboratorEntry project={project} id={id} />
                  </TD>
                  <TD>
                    <ProjectCreditEntry project={project} id={id} />
                  </TD>
                  <TD>
                    <ProjectStatusEntry project={project} />
                  </TD>
                </TR>
              );
            })}
          </>
        )}
      />
    </>
  );

  return (
    <ManageUserLayout>
      {activeProjectsCount > 0 ? <MainContent /> : <NoProjects />}
    </ManageUserLayout>
  );
}
