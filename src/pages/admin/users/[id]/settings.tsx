import { UserProfileData } from '@/lib/types';
// import FourOhFour from '@/pages/404';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { validate as isUuid } from 'uuid';
import ManageUserLayout from '@/components/admin/user/layout';
import EditEmailSegment from '@/components/admin/user/settings/edit-email-segment';
import { Div } from '@revolancer/ui/layout';
import EditYOESegment from '@/components/admin/user/settings/edit-yoe-segment';
import EditPasswordSegment from '@/components/admin/user/settings/edit-password-segment';
import EditRateSegment from '@/components/admin/user/settings/edit-rate-segment';
import EditDOBSegment from '@/components/admin/user/settings/edit-dob-segment';

export default function ManageUser() {
  const [profile, setProfile] = useState<UserProfileData>();
  const router = useRouter();
  const { id } = router.query;

  return (
    <ManageUserLayout>
      <Div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '$7' }}>
        <EditEmailSegment uid={id || ''} />
        <EditYOESegment uid={id || ''} />
        <EditPasswordSegment uid={id || ''} />
        <EditRateSegment uid={id || ''} />
        <EditDOBSegment uid={id || ''} />
      </Div>
    </ManageUserLayout>
  );
}
