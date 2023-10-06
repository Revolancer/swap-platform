import type { Project } from '@/lib/types';
import { styled } from '@revolancer/ui';
import { Flex } from '@revolancer/ui/layout';

export const ProjectStatusEntry = ({ project }: { project: Project }) => {
  const Indicator = styled('div', {
    width: '$4',
    height: '$4',
    borderRadius: '100%',
    variants: {
      status: {
        cancelled: {
          backgroundColor: '$red500',
        },
        active: {
          backgroundColor: '$orange500',
        },
        complete: {
          backgroundColor: '$green500',
        },
      },
    },
  });

  const Text = styled('p', {
    variants: {
      status: {
        cancelled: {
          color: '$red500',
        },
        active: {
          color: '$orange500',
        },
        complete: {
          color: '$green500',
        },
      },
    },
  });

  const status = () => {
    if (project.outcome) {
      return project.outcome === 'cancelled' ? 'cancelled' : 'complete';
    }
    return project.status;
  };

  const statusText = () => {
    if (project.outcome) {
      return project.outcome === 'cancelled' ? 'Cancelled' : 'Completed';
    }
    return project.status === 'active' ? 'In Progress' : 'Completed';
  };

  return (
    <Flex css={{ alignItems: 'center' }}>
      <Indicator status={status()} />
      <Text status={status()}>{statusText()}</Text>
    </Flex>
  );
};
