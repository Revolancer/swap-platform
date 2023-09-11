import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { H1, P } from '@revolancer/ui/text';
import { FullWidth } from '@revolancer/ui/layout';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';

export default function TopProfileSkills() {
  const [skills, setSkills] = useState<{ text: string; count: number }[]>();

  const load = async () => {
    await axiosPrivate
      .get('admin/stats/profile_top_skills')
      .then((response) => {
        setSkills(response.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Title>Stats</Title>
      <AdminLayout roles={['admin', 'moderator', 'stats_viewer']}>
        <CrumbBar>
          <Crumb href="/admin">Admin</Crumb>
          <Crumb href="/admin/stats">Stats</Crumb>
          <Crumb href="/admin/stats/top-profile-skills" active>
            Top Profile Skills
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <H1>Top Skills by Number of Profiles</H1>
          {skills && (
            <>
              {skills.map((skill) => (
                <P key={skill.text}>
                  {skill.text}: {skill.count}
                </P>
              ))}
            </>
          )}
        </FullWidth>
      </AdminLayout>
    </>
  );
}
