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
import { H1, P } from '@revolancer/ui/text';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { RoundedSquareImage } from '@revolancer/ui/user';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Name } from '@/components/user/name';

export default function UserProfile() {
  const router = useRouter();
  const { slug } = router.query;
  const [userProfile, setUserProfile] = useState<UserProfileData>({});
  const [own, setOwn] = useState(false);
  const [isNotFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfileData = async () => {
      if (slug === 'profile') {
        setOwn(true);
        await axiosPrivate
          .get(`user/profile`)
          .then((res) => {
            if ((res?.data ?? null) != null) {
              setUserProfile(res.data);
              if (res.data?.slug) {
                router.replace(`/u/${res.data.slug}`);
              }
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
      setLoading(false);
    };
    getUserProfileData();
  }, [slug, userProfile?.user?.id, router]);
  if (isNotFound) {
    return <FourOhFour />;
  }

  const NeedsSkeleton = () => (
    <Card unpadded>
      <SkeletonText />
      <Flex column gap={4} css={{ padding: '$6' }}>
        <SkeletonText
          css={{
            fontWeight: '$bold',
            fontSize: '$body1',
            lineHeight: '$body1',
          }}
          type="p"
        />
        <Flex css={{ alignItems: 'center' }}>
          {/*<RoundedSquareImage loading size="small" />*/}
          <SkeletonText
            css={{
              width: '$9',
              height: '$9',
              borderRadius: '$2',
            }}
          />
          <SkeletonText type="p" />
        </Flex>
        <Flex>
          {Array(3)
            .fill(null)
            .map((item, idx) => (
              <SkeletonText type="tag" key={`tag-${idx}`} />
            ))}
        </Flex>
        {Array(3)
          .fill(null)
          .map((item, idx) => (
            <SkeletonText type="p" key={`p-${idx}`} />
          ))}
      </Flex>
    </Card>
  );

  const skeletonArray = Array(15).fill(<NeedsSkeleton />);

  const Skeleton = () => (
    <>
      <SideBar>
        <Card css={{ overflow: 'unset' }}>
          <Flex
            column
            gap={3}
            css={{
              alignItems: 'center',
            }}
          >
            <RoundedSquareImage loading size="xl" />
            <SkeletonText type="h1" />
          </Flex>
          <Flex
            style={{
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <P css={{ color: '$neutral600' }}>About</P>
          </Flex>
          {Array(3)
            .fill(null)
            .map((item, idx) => (
              <SkeletonText
                type="p"
                key={`p-${idx}`}
                css={{ marginTop: '$2' }}
              />
            ))}
          <SkeletonText type="p" css={{ width: '25%', marginTop: '$2' }} />
          <Flex
            style={{
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <P css={{ color: '$neutral600' }}>Socials</P>
          </Flex>
          <Flex gap={4}>
            {Array(4)
              .fill(null)
              .map((item, idx) => (
                <RoundedSquareImage loading size="small" key={idx.toString()} />
              ))}
          </Flex>
          <Flex
            style={{
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <P css={{ color: '$neutral600' }}>Skills</P>
          </Flex>
          <Flex>
            {Array(4)
              .fill(null)
              .map((item, idx) => (
                <SkeletonText type="tag" key={`tag-${idx}`} />
              ))}
          </Flex>
        </Card>
      </SideBar>
      <MainContentWithSideBar>
        <Flex column gap={8}>
          <SkeletonText type="h2" css={{ height: '$17' }} />
          <Flex column gap={4}>
            <SkeletonText type="h5" />
            <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1200: 2 }}>
              <Masonry gutter="0.8rem">{skeletonArray}</Masonry>
            </ResponsiveMasonry>
          </Flex>
        </Flex>
      </MainContentWithSideBar>
    </>
  );

  const MainContent = () => (
    <>
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
            <Name uid={userProfile?.user?.id ?? ''} own={own} />
            {!own && userProfile?.user?.id && (
              <Button role="secondary" href={`/message/${userProfile.user.id}`}>
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
    </>
  );

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
        {loading ? <Skeleton /> : <MainContent />}
      </PrimaryLayout>
    </>
  );
}
