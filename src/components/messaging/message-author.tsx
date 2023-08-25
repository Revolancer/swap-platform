import { styled } from '@revolancer/ui';
import Image from 'next/image';
import { UserProfileData } from '@/lib/types';
import { DateTime } from 'luxon';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';

export const MessageAuthor = ({
  profile,
  time,
}: {
  profile: UserProfileData;
  time: DateTime;
}) => {
  const ProfileImageContainer = styled('div', {
    backgroundColor: '$neutral300',
    overflow: 'hidden',
    width: `36px`,
    height: `36px`,
    borderRadius: '$2',
  });

  const ProfileImage = styled(Image, {
    objectFit: 'cover',
  });

  return (
    <Flex css={{ alignItems: 'center', paddingTop: '$3' }}>
      <ProfileImageContainer>
        {profile?.profile_image && (
          <ProfileImage
            src={profile?.profile_image ?? ''}
            height={36}
            width={36}
            alt={`${profile?.first_name} ${profile?.last_name}`}
          ></ProfileImage>
        )}
      </ProfileImageContainer>
      {profile?.first_name && (
        <P
          css={{ fontWeight: 'bold' }}
        >{`${profile?.first_name} ${profile?.last_name}`}</P>
      )}
      <P css={{ color: '$neutral600' }}>{time.toFormat('t')}</P>
    </Flex>
  );
};
