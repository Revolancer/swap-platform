import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { UserProfileData } from '@/lib/types';
import FourOhFour from '@/pages/404';
import { Card, Flex, FullWidth, TwoCols } from '@revolancer/ui/layout';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { Button } from '@revolancer/ui/buttons';
import { RoundedSquareImage } from '@revolancer/ui/user';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { validate as isUuid } from 'uuid';
import { axiosPrivate } from '@/lib/axios';
import { H1, P } from '@revolancer/ui/text';
import { ManageUserTabs } from './tabs';
import { DeleteUserButton } from './delete';
import { AdminChangeRoleModal } from '@/components/modals/admin-change-role-modal';
import { RoleSelector } from '@/pages/admin/users';
import { SuccessModal } from '@/components/modals/success-modal';

export default function ManageUserLayout({ children }: { children: any }) {
  const [profile, setProfile] = useState<UserProfileData>();
  const [roles, setRoles] = useState<{ role: string }[]>();
  const [changeRole, setChangeRole] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const isValidId = typeof id == 'string' && isUuid(id);

  useEffect(() => {
    if (isValidId) {
      axiosPrivate.get(`user/profile/by_id/${id}`).then((res) => {
        setProfile(res.data);
      });
      axiosPrivate.get(`admin/user/roles/${id}`).then((res) => {
        setRoles(res.data);
      });
    }
  }, [id, isValidId]);

  if (!isValidId && typeof id == 'string' && id.length > 0)
    return <FourOhFour />;

  return (
    <>
      <Title>
        {profile ? `${profile.first_name} ${profile.last_name}` : 'User'}
      </Title>
      <AdminLayout roles={['admin', 'moderator']}>
        <CrumbBar>
          <Crumb href="#">Admin</Crumb>
          <Crumb href="/admin/users">User Management</Crumb>
          <Crumb href={`/admin/user/${id}`} active>
            {profile ? (
              `${profile.first_name} ${profile.last_name}`
            ) : (
              <SkeletonText
                type="p"
                css={{
                  display: 'inline-block',
                  minWidth: '20ch',
                  marginBottom: '-0.3rem',
                }}
              />
            )}
          </Crumb>
        </CrumbBar>
        {!profile && (
          <FullWidth>
            <Flex css={{ justifyContent: 'space-between' }}>
              <Flex column>
                <Flex css={{ alignItems: 'center' }}>
                  <RoundedSquareImage loading size="large" />
                  <SkeletonText type="h3" />
                </Flex>
                <SkeletonText type="span" />
                <SkeletonText type="span" />
                <SkeletonText type="span" />
              </Flex>
              <Flex css={{ alignItems: 'center' }}>
                <Button loading href="#" />
                <Button loading href="#" />
              </Flex>
            </Flex>
          </FullWidth>
        )}
        {profile && (
          <FullWidth>
            <Flex column>
              <Flex css={{ justifyContent: 'space-between' }}>
                <Flex css={{ alignItems: 'center' }}>
                  <RoundedSquareImage
                    size="large"
                    url={profile.profile_image}
                  />
                  <H1>
                    {profile.first_name} {profile.last_name}
                  </H1>
                </Flex>
                <Flex css={{ alignItems: 'center' }}>
                  <Button
                    href="#"
                    role="secondary"
                    css={{ flexShrink: '0' }}
                    onClick={(e) => {
                      e.preventDefault();
                      setModalOpen(true);
                    }}
                  >
                    Change Role
                  </Button>
                  {id && typeof id == 'string' && <DeleteUserButton id={id} />}
                </Flex>
              </Flex>
              <P>Username: {profile.slug}</P>
              <P>Roles: {roles?.map((role) => role.role).join(', ')}</P>
              <P>ID: {id}</P>
              <ManageUserTabs />
            </Flex>
            <AdminChangeRoleModal
              modalIsOpen={modalOpen}
              closeModal={() => setModalOpen(false)}
              onSave={async () => {
                try {
                  await axiosPrivate.put(`admin/users/role`, {
                    usersToChangeRole: [id],
                    role: changeRole,
                  });
                } catch (err) {
                  return;
                }
                setSuccess(true);
                axiosPrivate
                  .get(`admin/user/roles/${id}`, {
                    id: `${new Date().getTime()}`,
                  })
                  .then((res) => {
                    setRoles(res.data);
                  });
              }}
              RoleChangerComponent={
                <RoleSelector
                  roles={['admin', 'moderator', 'stats_viewer', 'user']}
                  onSubmit={(role) => setChangeRole(role)}
                />
              }
            />
          </FullWidth>
        )}
        <FullWidth>{children}</FullWidth>
        {success && (
          <SuccessModal
            successMessage="Role has been updated."
            onClose={() => setSuccess(false)}
          />
        )}
      </AdminLayout>
    </>
  );
}
