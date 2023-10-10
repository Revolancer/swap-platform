import { AdminLayout, PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import { axiosPrivate } from '@/lib/axios';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Project, UserProfileData } from '@/lib/types';
import { validate as isValidUUID } from 'uuid';
import { ProjectCompletionToggle } from '@/components/project-hub/active/project-completion-toggle';
import { Tags } from '@/components/user-posts/tags';
import { OutputData } from '@editorjs/editorjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { ProjectThread } from '@/components/messaging/project-messaging/project-thread';
import { ParagraphBlock } from 'editorjs-blocks-react-renderer';
import { ProjectOtherUserProfile } from '@/components/messaging/project-messaging/project-other-user-profile';
import { ProjectStatus } from '@/components/project-hub/project-status';
import { H1, P } from '@revolancer/ui/text';
import { FullWidth, Flex, Divider, Card, Div } from '@revolancer/ui/layout';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import FourOhFour from '@/pages/404';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { validate as isUuid } from 'uuid';
import { Button } from '@revolancer/ui/buttons';

export default function ProjectPage() {
  const router = useRouter();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadedData, setLoadedData] = useState<Project | undefined>(undefined);
  const [isNotFound, setNotFound] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>();

  const { pid: id, id: uid } = router.query;
  const isValidId = typeof uid == 'string' && isUuid(uid);

  useEffect(() => {
    if (isValidId) {
      axiosPrivate.get(`user/profile/by_id/${uid}`).then((res) => {
        setProfile(res.data);
      });
    }
    const loadProject = async () => {
      if (id != null) {
        if (Array.isArray(id)) {
          setNotFound(true);
        } else if (!isValidUUID(id)) {
          setNotFound(true);
        } else {
          await axiosPrivate
            .get(`projects/${id}`)
            .then((response) => {
              if ((response?.data ?? null) != null) {
                if ((response?.data?.id ?? '') == '') {
                  setNotFound(true);
                }
                setLoadedData(response.data);
                setHasLoaded(true);
              }
            })
            .catch((err) => {
              setNotFound(true);
            });
        }
      }
    };
    loadProject();
  }, [id, uid, isValidId]);

  const cleanData = useMemo(() => {
    try {
      return JSON.parse(loadedData?.need?.data ?? '{}')?.version ?? false
        ? JSON.parse(loadedData?.need?.data ?? '{}')
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
  }, [loadedData]);

  const getSummary = (data: OutputData) => {
    for (const block of data.blocks) {
      if (block.type == 'paragraph') {
        return block.data;
      }
    }
  };
  const summary = getSummary(cleanData);

  if (isNotFound) {
    return <FourOhFour />;
  }

  return (
    <>
      <Title>
        {hasLoaded ? loadedData?.need?.title ?? 'Project' : 'Project'}
      </Title>
      <AdminLayout>
        <CrumbBar>
          <Crumb href="#">Admin</Crumb>
          <Crumb href="/admin/users">User Management</Crumb>
          <Crumb href={`/admin/users/${uid}`}>
            {profile ? (
              `${profile.first_name} ${profile.last_name}`
            ) : (
              <SkeletonText
                type="p"
                css={{
                  display: 'inline-block',
                  minWidth: '20ch',
                  marginBottom: '-0.3rem',
                }}
              />
            )}
          </Crumb>
          <Crumb href={`/admin/users/${uid}/projects`} active>
            Projects
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Div css={{ margin: '$5 0 $3 0' }}>
            <Button href={`/admin/users/${uid}/projects`} role="secondary">
              Go back
            </Button>
          </Div>
          <Card>
            {!hasLoaded && <H1>Loading...</H1>}
            {hasLoaded && loadedData && (
              <Flex column>
                <ProjectStatus project={loadedData} />
                <Flex
                  css={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Flex column>
                    <ProjectOtherUserProfile projectId={loadedData?.id ?? ''} />
                    <H1 css={{ fontSize: '$body1', lineHeight: '$body1' }}>
                      {loadedData?.need?.title ?? 'Untitled Project'}
                    </H1>
                  </Flex>
                </Flex>
                <Tags tags={loadedData?.need?.tags ?? []} />
                {summary && <ParagraphBlock data={summary} />}
                <P css={{ color: '$neutral600' }}>
                  <strong>
                    Price: <FontAwesomeIcon icon={faTicket} />
                  </strong>{' '}
                  {loadedData?.proposal.price}
                </P>
                <Divider />
                <ProjectThread
                  projectId={loadedData?.id ?? ''}
                  uid={typeof uid != 'string' ? '' : uid}
                />
              </Flex>
            )}
          </Card>
        </FullWidth>
      </AdminLayout>
    </>
  );
}
