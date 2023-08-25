import { styled } from '@revolancer/ui';
import Image from 'next/image';
import { UserProfileData } from '@/lib/types';
import NextLink from 'next/link';
import { UnstyledLink } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';

export const CurrentThreadAuthor = ({ data }: { data: UserProfileData }) => {
  const ProfileImageContainer = styled('div', {
    backgroundColor: '$neutral300',
    overflow: 'hidden',
    width: `48px`,
    height: `48px`,
    borderRadius: '$2',
  });

  const ProfileImage = styled(Image, {
    objectFit: 'cover',
  });

  return (
    <Flex css={{ alignItems: 'center' }}>
      <ProfileImageContainer>
        {data?.profile_image && (
          <NextLink href={`/u/${data?.slug ?? ''}`}>
            <ProfileImage
              src={data?.profile_image ?? ''}
              height={48}
              width={48}
              alt={`${data?.first_name} ${data?.last_name}`}
            ></ProfileImage>
          </NextLink>
        )}
      </ProfileImageContainer>
      {data?.first_name && (
        <UnstyledLink href={`/u/${data?.slug ?? ''}`}>
          <P
            css={{ fontWeight: 'bold' }}
          >{`${data?.first_name} ${data?.last_name}`}</P>
        </UnstyledLink>
      )}
    </Flex>
  );
};
