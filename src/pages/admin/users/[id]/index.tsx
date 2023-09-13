import { UserProfileData } from '@/lib/types';
import FourOhFour from '@/pages/404';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { validate as isUuid } from 'uuid';
import ManageUserLayout from '@/components/admin/user/layout';

export default function ManageUser() {
  const [profile, setProfile] = useState<UserProfileData>();
  const router = useRouter();
  const { id } = router.query;

  return <ManageUserLayout>{id}</ManageUserLayout>;
}
