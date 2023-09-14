import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { Button, Link } from '@revolancer/ui/buttons';
import { DateTime } from 'luxon';
import { H1, P } from '@revolancer/ui/text';
import { Flex, FullWidth } from '@revolancer/ui/layout';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { DataTable, TD, TH, TR } from '@revolancer/ui/project-hubs';
import { RoundedSquareImage } from '@revolancer/ui/user';

export default function Team() {
  const [users, setUsers] = useState<
    {
      id: string;
      email: string;
      slug: string;
      profile_image: string;
      first_name: string;
      last_name: string;
      role: string;
    }[]
  >([]);

  const load = async () => {
    await axiosPrivate
      .get('admin/users/withroles')
      .then((response) => setUsers(response.data ?? []))
      .catch((err) => {});
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Title>Team</Title>
      <AdminLayout roles={['admin']}>
        <CrumbBar>
          <Crumb href="/admin">Admin</Crumb>
          <Crumb href="/admin/team" active>
            Team Management
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <DataTable
            roundedTop
            roundedBottom
            renderHeadRow={() => (
              <TR>
                <TH>User</TH>
                <TH css={{ width: '45%' }}>Email</TH>
                <TH>Role</TH>
                <TH css={{ width: '1%' }}></TH>
              </TR>
            )}
            renderBodyRows={() => (
              <>
                {users.map((u) => (
                  <TR key={u.id}>
                    <TD>
                      <Flex css={{ alignItems: 'center' }}>
                        <RoundedSquareImage
                          url={u.profile_image}
                          size="small"
                        />{' '}
                        {u.first_name} {u.last_name}
                      </Flex>
                    </TD>
                    <TD>{u.email}</TD>
                    <TD>{u.role}</TD>
                    <TD>
                      <Flex css={{ alignItems: 'center' }}>
                        <Button href={`/admin/users/${u.id}`} role="secondary">
                          Edit User
                        </Button>
                        <Button href={`/u/${u.slug}`} role="secondary">
                          View Profile
                        </Button>
                      </Flex>
                    </TD>
                  </TR>
                ))}
              </>
            )}
          />
        </FullWidth>
      </AdminLayout>
    </>
  );
}
