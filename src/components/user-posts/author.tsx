import { styled } from '@revolancer/ui';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { axiosPublic } from '@/lib/axios';
import { UserProfileData } from '@/lib/types';
import NextLink from 'next/link';
import { TertiaryButton } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';
import { H5, P } from '@revolancer/ui/text';
import { DateTime } from 'luxon';

export const Author = ({
  uid = '',
  hasDate,
}: {
  uid: string;
  hasDate?: string;
}) => {
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
    width: hasDate ? `48px` : `32px`,
    height: hasDate ? `48px` : `32px`,
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
              height={hasDate ? 48 : 32}
              width={hasDate ? 48 : 32}
              alt={"This user's profile picture"}
            ></ProfileImage>
          </NextLink>
        )}
      </ProfileImageContainer>
      <Flex column gap={0} css={{ justifyContent: 'start' }}>
        {profile?.first_name && (
          <TertiaryButton href={`/u/${profile.slug ?? ''}`}>
            {hasDate ? (
              <H5
                css={{ textTransform: 'none', fontFamily: '$body' }}
              >{`${profile?.first_name} ${profile?.last_name}`}</H5>
            ) : (
              <P>{`${profile?.first_name} ${profile?.last_name}`}</P>
            )}
          </TertiaryButton>
        )}
        {hasDate && (
          <P css={{ color: '$neutral600' }}>
            {DateTime.fromISO(hasDate).toFormat('DDD')}
          </P>
        )}
      </Flex>
    </Flex>
  );
};
