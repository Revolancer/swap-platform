import { Button } from '@revolancer/ui/buttons';
import { axiosPrivate } from '@/lib/axios';
import { Project, UserProfileData } from '@/lib/types';
import store from '@/redux/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';

export const ProjectCompletionToggle = ({ project }: { project: Project }) => {
  const [otherProfile, setOtherProfile] = useState<UserProfileData>();
  const [hasApproved, setHasApproved] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [otherHasApproved, setOtherHasApproved] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const self = store?.getState()?.userData?.user?.id ?? '';
    const isClient = project.client.id == self;
    setHasApproved(
      isClient ? project.client_approval : project.contractor_approval,
    );
    setOtherHasApproved(
      !isClient ? project.client_approval : project.contractor_approval,
    );
    const otherUserID = isClient ? project.contractor.id : project.client.id;
    const loadProfile = async (id: string) => {
      if (id == '') return;
      return await axiosPrivate
        .get(`user/profile/by_id/${id}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) !== false) {
            setOtherProfile(data);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          return;
        });
    };
    loadProfile(otherUserID);
    if (project.status == 'complete') {
      setIsComplete(true);
      setIsLoading(false);
    }
  }, [project]);

  const markComplete = () => {
    axiosPrivate
      .put(`projects/approval/${project.id}`)
      .then(() => router.reload())
      .catch(() => {});
  };

  const markIncomplete = () => {
    axiosPrivate
      .delete(`projects/approval/${project.id}`)
      .then(() => router.reload())
      .catch(() => {});
  };

  if (isLoading) return <></>;
  if (isComplete) return <></>;
  if (!hasApproved)
    return (
      <Button
        href="#"
        role="secondary"
        size={'small'}
        onClick={(e) => {
          e.preventDefault();
          markComplete();
        }}
      >
        Mark Complete
      </Button>
    );

  return (
    <Button
      href="#"
      role="secondary"
      size={'small'}
      onClick={(e) => {
        e.preventDefault();
        markIncomplete();
      }}
    >
      Mark Not Complete
    </Button>
  );
};
