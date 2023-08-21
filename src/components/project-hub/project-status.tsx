import { Flex } from '@/components/layout/flex';
import { Button } from '@revolancer/ui/buttons';
import { P } from '@/components/text/text';
import { axiosPrivate } from '@/lib/axios';
import { Project, UserProfileData } from '@/lib/types';
import store from '@/redux/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Divider } from '../layout/divider';

const Wrapper = ({ children }: { children: any }) => {
  return (
    <Flex css={{ alignItems: 'center' }}>
      <Divider />
      <P css={{ color: '$neutral600' }}>Project Status:</P>
      {children}
      <Divider />
    </Flex>
  );
};

export const ProjectStatus = ({ project }: { project: Project }) => {
  const [otherProfile, setOtherProfile] = useState<UserProfileData>();
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const self = store?.getState()?.userData?.user?.id ?? '';
    const isClient = project.client.id == self;
    const hasApproved = isClient
      ? project.client_approval
      : project.contractor_approval;
    const otherHasApproved = !isClient
      ? project.client_approval
      : project.contractor_approval;
    const hasCancelled = isClient
      ? project.client_cancelled
      : project.contractor_cancelled;
    const otherHasCancelled = !isClient
      ? project.client_cancelled
      : project.contractor_cancelled;
    if (hasApproved) {
      setStatus('waiting_other');
    } else if (otherHasApproved) {
      setStatus('waiting_self');
    }
    if (hasCancelled) {
      setStatus('waiting_cancel_other');
    } else if (otherHasCancelled) {
      setStatus('waiting_cancel_self');
    }

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
      if (project.outcome == 'cancelled') {
        setStatus('cancelled');
      } else {
        setStatus('complete');
      }
      setIsLoading(false);
    }
  }, [project]);

  if (isLoading) return <></>;
  if (status == 'cancelled') {
    return (
      <Wrapper>
        <P css={{ color: '$red500', fontWeight: '$bold' }}>Project Cancelled</P>
      </Wrapper>
    );
  }
  if (status == 'complete') {
    return (
      <Wrapper>
        <P css={{ color: '$green500', fontWeight: '$bold' }}>Complete</P>
      </Wrapper>
    );
  }
  if (status == 'waiting_self') {
    return (
      <Wrapper>
        <P css={{ color: '$green500', fontWeight: 'bold' }}>
          {otherProfile?.first_name ?? 'The other user'} has marked this project
          as complete
        </P>
      </Wrapper>
    );
  }
  if (status == 'waiting_cancel_self') {
    return (
      <Wrapper>
        <P css={{ color: '$red500', fontWeight: 'bold' }}>
          {otherProfile?.first_name ?? 'The other user'} requested to cancel the
          project
        </P>
      </Wrapper>
    );
  }
  if (status == 'waiting_other') {
    return (
      <Wrapper>
        <P css={{ color: '$orange500', fontWeight: 'bold' }}>
          Waiting for {otherProfile?.first_name ?? 'the other user'} to mark as
          complete
        </P>
      </Wrapper>
    );
  }
  if (status == 'waiting_cancel_other') {
    return (
      <Wrapper>
        <P css={{ color: '$orange500', fontWeight: 'bold' }}>
          Waiting for {otherProfile?.first_name ?? 'the other user'} accept your
          cancellation request
        </P>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <P css={{ color: '$neutral600', fontWeight: 'bold' }}>In Progress</P>
    </Wrapper>
  );
};
