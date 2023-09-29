import { axiosPrivate } from '@/lib/axios';
import { Project, UserProfileData } from '@/lib/types';
import { UnstyledLink } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { RoundedSquareImage } from '@revolancer/ui/user';
import { useEffect, useState } from 'react';

export const CollaboratorEntry = ({
  project,
  id,
}: {
  project: Project;
  id: any;
}) => {
  const [collaborator, setCollaborator] = useState<UserProfileData>({});

  useEffect(() => {
    const collaboratorId = (id: any) => {
      return project.client.id === id
        ? project.contractor.id
        : project.client.id;
    };
    axiosPrivate.get(`user/profile/by_id/${collaboratorId(id)}`).then((res) => {
      setCollaborator(res.data);
    });
  }, [id, project]);

  return (
    <Flex css={{ alignItems: 'center' }}>
      <UnstyledLink href={`/u/${collaborator?.slug}`} replace>
        <RoundedSquareImage size="medium" url={collaborator?.profile_image} />
      </UnstyledLink>
      <P>
        {collaborator?.first_name} {collaborator?.last_name}
      </P>
      <P css={{ fontWeight: '$semibold' }}>
        ({project.client.id === id ? 'contractor' : 'client'})
      </P>
    </Flex>
  );
};
