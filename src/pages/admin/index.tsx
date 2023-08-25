import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { Yup } from '@/lib/yup';
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
      <Title>Admin Tools</Title>
      <AdminLayout>
        <CrumbBar>
          <Crumb href="/admin" active>
            Admin
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <H1>Admin Tools</H1>
          <P>
            <Link href={`/admin/tags`}>Tags</Link>
          </P>
          <P>
            <Link href={`/admin/stats`}>Stats</Link>
          </P>
          <P>
            <Link href={`/admin/users`}>List Users</Link>
          </P>
          <P>
            <Link href={`/admin/credits`}>Add Credits</Link>
          </P>
          <P>
            <Link href={`/admin/delete`}>Delete User</Link>
          </P>
        </FullWidth>
      </AdminLayout>
    </>
  );
}
