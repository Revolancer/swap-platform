import { Tags } from './tags';
import { Button, TertiaryButton, UnstyledLink } from '@revolancer/ui/buttons';
import { styled } from '@revolancer/ui';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { axiosPublic } from '@/lib/axios';
import { P } from '@revolancer/ui/text';
import { Flex, Card } from '@revolancer/ui/layout';
import { stringToJSX } from '@/lib/editorjs/renderer/util';
import { PortfoliosSkeleton } from '../skeletons/portfolio-profile-card';
import type { UserProfileData } from '@/lib/types';

export const UserProfileCard = ({ uid }: { uid?: string }) => {
  const [profile, setProfile] = useState<UserProfileData>({});
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAuthor = useCallback(() => {
    axiosPublic
      .get(`user/profile/by_id/${uid}`)
      .then((response) => setProfile(response.data ?? {}))
      .catch(() => setProfile({}));
  }, [uid]);

  const loadAboutForUser = useCallback(async () => {
    axiosPublic
      .get(`user/about/${uid}`, { id: `user-about-${uid}` })
      .then((response) => {
        setLoading(false);
        setAbout(response.data?.about ?? '');
      })
      .catch(() => {
        setLoading(false);
        setAbout('');
      });
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadAboutForUser();
    }
  }, [uid, loadAboutForUser]);

  useEffect(() => {
    if (uid != '') {
      loadAuthor();
    }
  }, [uid, loadAuthor]);

  const ProfileImageContainer = styled('div', {
    backgroundColor: '$neutral300',
    overflow: 'hidden',
    width: `64px`,
    height: `64px`,
    borderRadius: '$2',
  });

  const ProfileImage = styled(Image, {
    objectFit: 'cover',
  });

  const ProfileName = styled('p', {
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '28px',
  });

  const truncateText = (text: string) => {
    const textArr = text.split(' ');
    const wordCount = textArr.length;
    if (wordCount > 15) {
      const truncText = textArr.slice(0, 14).join(' ');
      return `${truncText}...`;
    }
    return text;
  };

  if (loading) {
    return <PortfoliosSkeleton withAuthor />;
  }

  return (
    <Card css={{ padding: '$6' }}>
      <Flex gap={4} css={{ alignItems: 'center' }}>
        <ProfileImageContainer>
          {profile?.profile_image && (
            <UnstyledLink href={`/u/${profile.slug ?? ''}`}>
              <ProfileImage
                src={profile?.profile_image ?? ''}
                height={64}
                width={64}
                alt={"This user's profile picture"}
              />
            </UnstyledLink>
          )}
        </ProfileImageContainer>
        <TertiaryButton href={`/u/${profile.slug ?? ''}`}>
          <ProfileName>{`${profile?.first_name} ${profile?.last_name}`}</ProfileName>
        </TertiaryButton>
      </Flex>
      <Tags tags={profile?.skills ?? []} expander />
      <P css={{ color: '$neutral600' }}>{truncateText(about)}</P>
      <Flex gap={6} css={{ alignItems: 'center' }}>
        <Button href={`/message/${uid}`}>Message</Button>
        <Button href={`/u/${profile.slug ?? ''}`} role="secondary">
          View Profile
        </Button>
      </Flex>
    </Card>
  );
};
