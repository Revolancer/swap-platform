import { Project } from '@/lib/types';
import { P } from '@revolancer/ui/text';

export const ProjectCreditEntry = ({
  project,
  id,
}: {
  project: Project;
  id: any;
}) => {
  const own = project.client.id === id;
  return (
    <P css={{ color: '$pink500' }}>
      {own ? '-C ' : '+C '}
      {project.credits}
    </P>
  );
};
