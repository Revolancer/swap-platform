import { Button } from '@revolancer/ui/buttons';
import { axiosPrivate } from '@/lib/axios';
import { Project } from '@/lib/types';
import store from '@/redux/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Flex } from '@revolancer/ui/layout';
import { Span } from '@revolancer/ui/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
  faCirclePause,
} from '@fortawesome/free-regular-svg-icons';

const ApprovalButton = ({
  approved,
  disabled,
  project,
}: {
  approved: boolean;
  disabled: boolean;
  project: Project;
}) => {
  const router = useRouter();

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

  if (!approved) {
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
        <Span css={{ color: '$green500' }}>
          <FontAwesomeIcon icon={faCircleCheck} />
        </Span>{' '}
        Mark Complete
      </Button>
    );
  } else {
    return (
      <Button
        href="#"
        role="secondary"
        size={'small'}
        onClick={(e) => {
          e.preventDefault();
          markIncomplete();
        }}
        disabled={disabled}
      >
        <Span css={{ color: '$orange500' }}>
          <FontAwesomeIcon icon={faCirclePause} />
        </Span>{' '}
        Mark Incomplete
      </Button>
    );
  }
};

const CancelButton = ({
  pendingOwn,
  project,
}: {
  pendingOwn: boolean;
  project: Project;
}) => {
  const router = useRouter();

  const requestCancellation = () => {
    axiosPrivate
      .put(`projects/cancellation/${project.id}`)
      .then(() => router.reload())
      .catch(() => {});
  };

  if (pendingOwn) {
    return (
      <Button href="#" role="secondary" size={'small'} disabled>
        Cancellation Requested
      </Button>
    );
  } else {
    return (
      <Button
        href="#"
        role="secondary"
        size={'small'}
        onClick={(e) => {
          e.preventDefault();
          requestCancellation();
        }}
      >
        <Span css={{ color: '$red500' }}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </Span>{' '}
        Cancel
      </Button>
    );
  }
};

export const ProjectCompletionToggle = ({ project }: { project: Project }) => {
  const [hasApproved, setHasApproved] = useState(false);
  const [hasCancelled, setHasCancelled] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [otherHasCancelled, setOtherHasCancelled] = useState(false);

  useEffect(() => {
    const self = store?.getState()?.userData?.user?.id ?? '';
    const isClient = project.client.id == self;
    setHasApproved(
      isClient ? project.client_approval : project.contractor_approval,
    );
    setHasCancelled(
      isClient ? project.client_cancellation : project.contractor_cancellation,
    );
    setOtherHasCancelled(
      !isClient ? project.client_cancellation : project.contractor_cancellation,
    );
    if (project.status == 'complete') {
      setIsComplete(true);
    }
    setIsLoading(false);
  }, [project]);

  if (isLoading)
    return (
      <Flex>
        <Button href="#" loading />
        <Button href="#" loading />
      </Flex>
    );
  if (isComplete) return <></>;
  return (
    <Flex>
      <ApprovalButton
        project={project}
        approved={hasApproved}
        disabled={otherHasCancelled || hasCancelled}
      />
      <CancelButton project={project} pendingOwn={hasCancelled} />
    </Flex>
  );
};
