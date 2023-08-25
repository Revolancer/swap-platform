import { PrimaryLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { Title } from '@/components/head/title';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserProfileData } from '@/lib/types';
import { ProfileImage } from '@/components/user/profileimage';
import { SkillSegment } from '@/components/user/skillsegment';
import { Timezone } from '@/components/user/timezone';
import { Tagline } from '@/components/user/tagline';
import { AboutSegment } from '@/components/user/aboutsegment';
import { PortfolioSegment } from '@/components/user/portfoliosegment';
import store from '@/redux/store';
import { NeedsSegment } from '@/components/user/needssegment';
import FourOhFour from '../404';
import { Button } from '@revolancer/ui/buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { ProfileProgress } from '@/components/collapsible/profile-progress';
import { SocialSegment } from '@/components/user/socialsegment';
import { CrumbBar, Crumb } from '@revolancer/ui/navigation';
import {
  Card,
  Flex,
  MainContentWithSideBar,
  SideBar,
} from '@revolancer/ui/layout';
import { H1 } from '@revolancer/ui/text';

export default function UserProfile() {
  const router = useRouter();
  const { slug } = router.query;
  const [userProfile, setUserProfile] = useState<UserProfileData>({});
  const [own, setOwn] = useState(false);
  const [isNotFound, setNotFound] = useState(false);

  useEffect(() => {
    const getUserProfileData = async () => {
      if (slug === 'profile') {
        setOwn(true);
        await axiosPrivate
          .get(`user/profile`)
          .then((res) => {
            if ((res?.data ?? null) != null) {
              setUserProfile(res.data);
            }
          })
          .catch((err) => {
            setNotFound(true);
          });
      } else if (slug != null) {
        await axiosPrivate
          .get(`user/profile/${slug}`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if ((response?.data?.id ?? '') == '') {
                setNotFound(true);
              }
              setUserProfile(response.data);
              const self = store?.getState()?.userData?.user?.id ?? 'guest';
              if ((userProfile?.user?.id ?? '') == self) {
                setOwn(true);
              } else {
                setOwn(false);
              }
            }
          })
          .catch((err) => {
            setNotFound(true);
          });
      }
    };
    getUserProfileData();
  }, [slug, userProfile?.user?.id]);
  if (isNotFound) {
    return <FourOhFour />;
  }
  return (
    <>
      <Title>
        {userProfile?.first_name
          ? `${userProfile?.first_name} ${userProfile?.last_name}`
          : 'User Profile'}
      </Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/">Discovery</Crumb>
          <Crumb href={`/u/${slug}`} active>
            {userProfile?.first_name
              ? `${userProfile?.first_name} ${userProfile?.last_name}`
              : 'User Profile'}
          </Crumb>
        </CrumbBar>
        <SideBar>
          {own && <ProfileProgress position="mobile" />}
          <Card css={{ overflow: 'unset' }}>
            <Flex
              column
              gap={3}
              css={{
                alignItems: 'center',
              }}
            >
              <ProfileImage uid={userProfile?.user?.id ?? ''} own={own} />
              <H1 css={{ fontSize: '$h4', lineHeight: '$h4' }}>
                {userProfile?.first_name
                  ? `${userProfile?.first_name} ${userProfile?.last_name}`
                  : 'User Profile'}
              </H1>
              {!own && userProfile?.user?.id && (
                <Button
                  role="secondary"
                  href={`/message/${userProfile.user.id}`}
                >
                  <FontAwesomeIcon icon={faMessage} /> Message
                </Button>
              )}
            </Flex>
            <AboutSegment uid={userProfile?.user?.id ?? ''} own={own} />
            <Timezone uid={userProfile?.user?.id ?? ''} own={own} />
            <SocialSegment uid={userProfile?.user?.id ?? ''} own={own} />
            <SkillSegment uid={userProfile?.user?.id ?? ''} own={own} />
          </Card>
        </SideBar>
        <MainContentWithSideBar>
          <Flex column gap={8}>
            <Tagline uid={userProfile?.user?.id ?? ''} own={own} />
            {own && <ProfileProgress />}
            <NeedsSegment
              name={userProfile?.first_name ?? ''}
              uid={userProfile?.user?.id ?? ''}
              own={own}
            />
            <PortfolioSegment
              name={userProfile?.first_name ?? ''}
              uid={userProfile?.user?.id ?? ''}
              own={own}
            />
          </Flex>
        </MainContentWithSideBar>
      </PrimaryLayout>
    </>
  );
}
