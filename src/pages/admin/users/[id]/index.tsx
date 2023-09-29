import { UserProfileData } from '@/lib/types';
// import FourOhFour from '@/pages/404';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { validate as isUuid } from 'uuid';
import ManageUserLayout from '@/components/admin/user/layout';
import EditNameSegment from '@/components/admin/user/user-profile/edit-name-segment';
import { Div, Divider } from '@revolancer/ui/layout';
import EditTaglineSegment from '@/components/admin/user/user-profile/edit-tagline-segment';
import EditTimeZoneSegment from '@/components/admin/user/user-profile/edit-timezone-segment';
import EditPictureSegment from '@/components/admin/user/user-profile/edit-picture-segment';
import EditSkillsSegment from '@/components/admin/user/user-profile/edit-skills-segment';
import EditAboutSegment from '@/components/admin/user/user-profile/edit-about-segement';
import EditSocialsSegment from '@/components/admin/user/user-profile/edit-socials-segment';

export default function ManageUser() {
  const [profile, setProfile] = useState<UserProfileData>();
  const router = useRouter();
  const { id } = router.query;

  return (
    <ManageUserLayout>
      <Div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '$7' }}>
        <EditNameSegment uid={id || ''} />
        <EditTaglineSegment uid={id || ''} />
        <EditTimeZoneSegment uid={id || ''} />
        <EditPictureSegment uid={id || ''} />
      </Div>
      <Divider css={{ margin: '$5 0' }} />
      <Div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '$7' }}>
        <EditAboutSegment uid={id || ''} />
        <EditSocialsSegment uid={id || ''} />
        <EditSkillsSegment uid={id || ''} />
      </Div>
    </ManageUserLayout>
  );
}
