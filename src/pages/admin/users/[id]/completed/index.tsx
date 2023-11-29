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
import { ViewProject } from '@/components/modals/admin-view-project-modal';
import AdminViewProject from '@/components/admin/user/preojects/amin-view-project';

export default function UserProjects() {
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [completedProjectsCount, setCompletedProjectsCount] = useState(0);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    axiosPrivate
      .get(`admin/users/${id}/projects/completed`)
      .then((res) => res.data)
      .then((data) => {
        setCompletedProjects(data);
      })
      .catch(() => setCompletedProjects([]));

    axiosPrivate
      .get(`admin/users/${id}/projects/completed/count`)
      .then((response) => {
        setCompletedProjectsCount(response.data);
      })
      .catch((e) => setCompletedProjectsCount(0));
  }, [id]);

  const NoProjects = () => <P>No completed projects yet!</P>;

  const MainContent = () => (
    <>
      <H5>Completed Projects: {completedProjectsCount}</H5>
      <Span>Projects that have been completed</Span>
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
            {completedProjects.map((project) => {
              return (
                <TR key={project.id}>
                  <TD>
                    <AdminViewProject project={project} id={id} />
                  </TD>
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
      {completedProjectsCount > 0 ? <MainContent /> : <NoProjects />}
    </ManageUserLayout>
  );
}
