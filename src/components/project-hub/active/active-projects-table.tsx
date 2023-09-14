import { useEffect, useState } from 'react';
import { Project } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import store from '@/redux/store';
import { Button } from '@revolancer/ui/buttons';
import { P } from '@revolancer/ui/text';
import { TH, TR, TD, DataTable } from '@revolancer/ui/project-hubs';
import { Div } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';

export const ActiveProjectsTable = () => {
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axiosPrivate
      .get('projects/active')
      .then((res) => res.data)
      .then((data) => {
        setActiveProjects(data);
        setLoading(false);
      })
      .catch((err) => setActiveProjects([]));
  }, []);

  if (loading)
    return (
      <SkeletonText
        css={{
          borderRadius: '$3',
          backgroundColor: '$neutral300',
          height: '400px',
        }}
      />
    );

  if (setActiveProjects.length < 1) return <P>No active projects</P>;

  const self = store?.getState()?.userData?.user?.id ?? '';

  return (
    <DataTable
      renderHeadRow={() => (
        <TR>
          <TH css={{ width: '100%' }}>Project</TH>
          <TH></TH>
        </TR>
      )}
      renderBodyRows={() => (
        <>
          {activeProjects.map((project) => {
            return (
              <TR key={project.id}>
                <TD>{project.need.title ?? 'Untitled Project'}</TD>
                <TD>
                  <Button href={`/project/${project.id}`}>View</Button>
                </TD>
              </TR>
            );
          })}
        </>
      )}
    />
  );
};
