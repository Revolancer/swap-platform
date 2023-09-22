import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ManageUserLayout from '@/components/admin/user/layout';
import { H5, Span } from '@revolancer/ui/text';
import { axiosPrivate } from '@/lib/axios';
import { DataTable, TD, TH, TR } from '@revolancer/ui/project-hubs';
import { Project } from '@/lib/types';

export default function UserProjects() {
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    axiosPrivate
      .get(`admin/users/${id}/projects`)
      .then((res) => res.data)
      .then((data) => {
        setActiveProjects(data);
      })
      .catch(() => setActiveProjects([]));
  }, [id]);

  return (
    <ManageUserLayout>
      <H5>Active Projects: {activeProjects.length}</H5>
      <Span>Projects that you do and projects others do for you</Span>
      <DataTable
        roundedBottom
        roundedTop
        renderHeadRow={() => (
          <TR>
            <TH>Project Title</TH>
            <TH>Credits</TH>
            <TH>Deadline</TH>
            <TH>More Information</TH>
          </TR>
        )}
        renderBodyRows={() => (
          <>
            {activeProjects.map((project) => {
              return (
                <TR key={project.id}>
                  <TD>{project.need.title ?? 'Untitled Project'}</TD>
                  <TD>{project.credits}</TD>
                  <TD>{project.proposal.estimated_hours}</TD>
                  <TD>{project.status}</TD>
                </TR>
              );
            })}
          </>
        )}
      />
    </ManageUserLayout>
  );
}
