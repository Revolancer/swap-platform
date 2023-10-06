import { Divider, Flex } from '@revolancer/ui/layout';
import { ProjectStatus } from '../project-hub/project-status';
import { ProjectOtherUserProfile } from '../messaging/project-messaging/project-other-user-profile';
import { Tags } from '../user-posts/tags';
import { H1, P } from '@revolancer/ui/text';
import { ParagraphBlock } from 'editorjs-blocks-react-renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { ProjectThread } from '../messaging/project-messaging/project-thread';
import { useMemo, useState } from 'react';
import { Project } from '@/lib/types';
import { OutputData } from '@editorjs/editorjs';
import { RevoModal as Modal } from '@revolancer/ui/modals';
import { FormButton, TertiaryFormButton } from '@revolancer/ui/buttons';

export const ViewProject = ({ id, project }: { id: any; project: Project }) => {
  const cleanData = useMemo(() => {
    try {
      return JSON.parse(project?.need?.data ?? '{}')?.version ?? false
        ? JSON.parse(project?.need?.data ?? '{}')
        : {
            time: 1682956618189,
            blocks: [],
            version: '2.26.5',
          };
    } catch (err) {
      return {
        time: 1682956618189,
        blocks: [],
        version: '2.26.5',
      };
    }
  }, [project]);

  const getSummary = (data: OutputData) => {
    for (const block of data.blocks) {
      if (block.type == 'paragraph') {
        return block.data;
      }
    }
  };
  const summary = getSummary(cleanData);

  return (
    <Modal
      openOnTrigger={false}
      css={{ width: '75vw' }}
      showModalOpenCTA
      renderCTA={({ open }) => (
        <TertiaryFormButton role="secondary" onClick={() => open()}>
          {project.need.title ?? 'Untitled Project'}
        </TertiaryFormButton>
      )}
      renderChildren={({ close }) => (
        <Flex column css={{ width: '70vw' }}>
          <FormButton role="secondary" onClick={() => close()}>
            Go Back
          </FormButton>
          {project && (
            <Flex column>
              <ProjectStatus project={project} />
              <Flex
                css={{
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Flex column>
                  <ProjectOtherUserProfile
                    projectId={project.id ?? ''}
                    uid={id}
                  />
                  <H1 css={{ fontSize: '$body1', lineHeight: '$body1' }}>
                    {project.need.title ?? 'Untitled Project'}
                  </H1>
                </Flex>
              </Flex>
              <Tags tags={project.need.tags ?? []} />
              {summary && <ParagraphBlock data={summary} />}
              <P css={{ color: '$neutral600' }}>
                <strong>
                  Price: <FontAwesomeIcon icon={faTicket} />
                </strong>{' '}
                {project.proposal.price}
              </P>
              <Divider />
              <ProjectThread projectId={project.id} uid={id} />
            </Flex>
          )}
        </Flex>
      )}
    />
  );
};
