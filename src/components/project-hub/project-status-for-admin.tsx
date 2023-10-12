import { Flex, Divider } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { axiosPrivate } from '@/lib/axios';
import { Project, UserProfileData } from '@/lib/types';
import store from '@/redux/store';
import { useEffect, useState } from 'react';

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

export const ProjectStatusForAdmin = ({ project }: { project: Project }) => {
  const [client, setClient] = useState<UserProfileData>();
  const [contractor, setContractor] = useState<UserProfileData>();
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (project.client_approval) {
      setStatus('waiting_contractor');
    } else if (project.contractor_approval) {
      setStatus('waiting_client');
    }
    if (project.client_cancellation) {
      setStatus('waiting_cancel_contractor');
    } else if (project.contractor_cancellation) {
      setStatus('waiting_cancel_client');
    }

    const loadProfile = async (
      id: string,
      setProfile: (profile: any) => void,
    ) => {
      if (id == '') return;
      return await axiosPrivate
        .get(`user/profile/by_id/${id}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) !== false) {
            setProfile(data);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          return;
        });
    };
    loadProfile(project.client.id, setClient);
    loadProfile(project.contractor.id, setContractor);
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
  if (status == 'waiting_client') {
    return (
      <Wrapper>
        <P css={{ color: '$green500', fontWeight: 'bold' }}>
          {contractor?.first_name ?? 'The other user'} has marked this project
          as complete
        </P>
      </Wrapper>
    );
  }
  if (status == 'waiting_cancel_client') {
    return (
      <>
        <Wrapper>
          <P css={{ color: '$red500', fontWeight: 'bold' }}>
            {contractor?.first_name ?? 'The other user'} requested to cancel the
            project
          </P>
        </Wrapper>
      </>
    );
  }
  if (status == 'waiting_contractor') {
    return (
      <Wrapper>
        <P css={{ color: '$orange500', fontWeight: 'bold' }}>
          {client?.first_name ?? 'the other user'} has marked this project as
          complete
        </P>
      </Wrapper>
    );
  }
  if (status == 'waiting_cancel_contractor') {
    return (
      <Wrapper>
        <P css={{ color: '$orange500', fontWeight: 'bold' }}>
          {client?.first_name ?? 'The other user'} requested to cancel the
          project
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
