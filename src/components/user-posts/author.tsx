import { styled } from '@revolancer/ui';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { axiosPublic } from '@/lib/axios';
import { Flex } from '../layout/flex';
import { UserProfileData } from '@/lib/types';
import NextLink from 'next/link';
import { P } from '../text/text';
import { TertiaryButton } from '@revolancer/ui/buttons';

export const Author = ({ uid = '' }: { uid: string }) => {
  const [profile, setProfile] = useState<UserProfileData>({});

  const loadAuthor = useCallback(() => {
    axiosPublic
      .get(`user/profile/by_id/${uid}`)
      .then((response) => setProfile(response.data ?? {}))
      .catch(() => setProfile({}));
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadAuthor();
    }
  }, [uid, loadAuthor]);

  const ProfileImageContainer = styled('div', {
    backgroundColor: '$neutral300',
    overflow: 'hidden',
    width: `32px`,
    height: `32px`,
    borderRadius: '$2',
  });

  const ProfileImage = styled(Image, {
    objectFit: 'cover',
  });

  return (
    <Flex css={{ alignItems: 'center' }}>
      <ProfileImageContainer>
        {profile?.profile_image && (
          <NextLink href={`/u/${profile.slug ?? ''}`}>
            <ProfileImage
              src={profile?.profile_image ?? ''}
              height={32}
              width={32}
              alt={"This user's profile picture"}
            ></ProfileImage>
          </NextLink>
        )}
      </ProfileImageContainer>
      {profile?.first_name && (
        <TertiaryButton href={`/u/${profile.slug ?? ''}`}>
          <P>{`${profile?.first_name} ${profile?.last_name}`}</P>
        </TertiaryButton>
      )}
    </Flex>
  );
};
