import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { Link } from '@revolancer/ui/buttons';
import { DateTime } from 'luxon';
import { H1, P } from '@revolancer/ui/text';
import { FullWidth } from '@revolancer/ui/layout';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';

export default function Stats() {
  const [users, setUsers] = useState<{ slug: string; created_at: string }[]>(
    [],
  );

  const load = async () => {
    await axiosPrivate
      .get('admin/users')
      .then((response) => setUsers(response.data ?? []))
      .catch((err) => {});
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Title>Stats</Title>
      <AdminLayout>
        <CrumbBar>
          <Crumb href="/admin">Admin</Crumb>
          <Crumb href="/admin/users" active>
            List of Users
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <H1>All Users</H1>
          {users.map((user) => {
            return (
              <P key={user.slug}>
                <Link href={`/u/${user.slug}`} target="_blank">
                  {user.slug}
                </Link>{' '}
                ({DateTime.fromISO(user.created_at).toFormat('DDD t')})
              </P>
            );
          })}
        </FullWidth>
      </AdminLayout>
    </>
  );
}
