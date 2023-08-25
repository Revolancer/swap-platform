import { axiosPrivate } from '@/lib/axios';
import { Project, UserProfileData } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import store from '@/redux/store';
import { styled } from '@revolancer/ui';
import Image from 'next/image';
import { UnstyledLink } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';

export const ProjectOtherUserProfile = ({
  projectId,
}: {
  projectId: string;
}) => {
  const [project, setProject] = useState<Project>();
  const [theirProfile, setTheirProfile] = useState<UserProfileData>();

  const loadProject = useCallback(() => {
    axiosPrivate
      .get(`projects/${projectId}`)
      .then((response) => {
        if ((response?.data ?? null) != null) {
          if ((response?.data?.id ?? '') !== '') {
            setProject(response.data);
            console.log(response.data);
          }
        }
      })
      .catch((err) => {});
  }, [projectId]);

  const loadProfile = useCallback(() => {
    if (!project) return;
    const self = store?.getState()?.userData?.user?.id ?? '';
    if (self == '') return;
    const otherId =
      project?.contractor.id == self
        ? project.client.id
        : project?.contractor.id;
    axiosPrivate
      .get(`user/profile/by_id/${otherId}`)
      .then((res) => res.data)
      .then((data) => {
        if ((data?.id ?? false) === false) {
          setTheirProfile(undefined);
        } else {
          setTheirProfile(data);
        }
      })
      .catch((err) => {
        setTheirProfile(undefined);
      });
  }, [project]);

  useEffect(() => {
    loadProject();
    loadProfile();
  }, [loadProfile, loadProject, projectId]);

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
    <>
      <Flex css={{ alignItems: 'center' }}>
        <UnstyledLink href={`/u/${theirProfile?.slug}`}>
          <ProfileImageContainer>
            {theirProfile?.profile_image && (
              <ProfileImage
                src={theirProfile?.profile_image ?? ''}
                height={48}
                width={48}
                alt={`${theirProfile?.first_name} ${theirProfile?.last_name}`}
              ></ProfileImage>
            )}
          </ProfileImageContainer>
        </UnstyledLink>
        {theirProfile?.first_name && (
          <UnstyledLink href={`/u/${theirProfile?.slug}`}>
            <P
              css={{
                fontWeight: 'bold',
                fontSize: '$body1',
                lineHeight: '$body1',
              }}
            >{`${theirProfile?.first_name} ${theirProfile?.last_name}`}</P>
          </UnstyledLink>
        )}
      </Flex>
    </>
  );
};
