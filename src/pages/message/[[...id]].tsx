import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserProfileData } from '@/lib/types';
import { version as uuidVersion } from 'uuid';
import { axiosPrivate } from '@/lib/axios';
import { CurrentThreadAuthor } from '@/components/messaging/current-thread-author';
import { CurrentThread } from '@/components/messaging/current-thread';
import { ThreadList } from '@/components/messaging/thread-list';
import { MessageSideBar } from '../../components/layout/columns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@revolancer/ui/buttons';
import { MainContentWithSideBar, Divider, Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { ThreadAuthorSkeleton } from '@/components/skeletons/current-thread-author';
import { ThreadSkeleton } from '@/components/skeletons/current-thread';
import { threadListSkeleton } from '@/components/skeletons/thread-list-entry';

export default function MessageCenter() {
  const router = useRouter();
  const { id } = router.query;
  const [activeThreadProfile, setActiveThreadProfile] =
    useState<UserProfileData>();
  const [activeThread, setActiveThread] = useState('');
  const [allMessageCount, setAllMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async (id: string) => {
      if (id == '') return;
      await axiosPrivate
        .get(`user/profile/by_id/${id}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) === false) {
            setActiveThread('');
          } else {
            setActiveThreadProfile(data);
          }
        })
        .catch((err) => {
          setActiveThreadProfile(undefined);
          setActiveThread('');
        });
    };
    const checkIfAnyMessages = async () => {
      await axiosPrivate
        .get(`message/count_all`)
        .then((res) => res.data)
        .then((data) => {
          setAllMessageCount(data);
        })
        .catch((err) => {});
    };
    checkIfAnyMessages();
    if (typeof id !== 'undefined') {
      try {
        //If url param is a valid uuid, we can try to open a thread with that user
        uuidVersion(id[0] ?? '');
        setActiveThread(id[0]);
        loadProfile(id[0] ?? '');
      } catch (err) {}
    }
    setLoading(false);
  }, [id]);
  console.log(typeof activeThreadProfile);

  const Skeleton = () => (
    <>
      <MessageSideBar className="hello" hasThread={activeThread != ''}>
        {threadListSkeleton()}
      </MessageSideBar>
      <MainContentWithSideBar>
        <Flex column css={{ maxHeight: 'max(400px, 85dvh)', height: '100vh' }}>
          <Flex css={{ alignItems: 'center' }}>
            <ThreadAuthorSkeleton />
          </Flex>
          <Divider css={{ flexGrow: 0 }} />
          <ThreadSkeleton />
        </Flex>
      </MainContentWithSideBar>
    </>
  );

  const MainContent = () => (
    <>
      <MessageSideBar className="hello" hasThread={activeThread != ''}>
        <ThreadList activeThread={activeThread} loading={loading} />
      </MessageSideBar>
      <MainContentWithSideBar>
        {activeThreadProfile && (
          <Flex
            column
            css={{ maxHeight: 'max(400px, 85dvh)', height: '100vh' }}
          >
            <Flex css={{ alignItems: 'center' }}>
              <Link
                href="/message"
                css={{
                  display: 'block',
                  color: '$neutral600',
                  '@md': {
                    display: 'none',
                  },
                }}
              >
                <FontAwesomeIcon size="lg" icon={faAngleLeft} />
              </Link>
              <CurrentThreadAuthor data={activeThreadProfile} />
            </Flex>
            <Divider css={{ flexGrow: 0 }} />
            <CurrentThread uid={activeThread} loading={loading} />
          </Flex>
        )}
        {!activeThreadProfile && allMessageCount < 1 && (
          <P css={{ color: '$neutral600' }}>
            Looks like you haven&rsquo;t messaged anyone just yet
          </P>
        )}
        {!activeThreadProfile && allMessageCount >= 1 && (
          <P
            css={{
              color: '$neutral600',
              display: 'none',
              '@md': {
                display: 'block',
              },
            }}
          >
            Select a conversation
          </P>
        )}
      </MainContentWithSideBar>
    </>
  );

  return (
    <>
      <Title>Messages</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb
            href="/message"
            active={typeof activeThreadProfile == 'undefined'}
          >
            Messages
          </Crumb>
          {typeof activeThreadProfile != 'undefined' && (
            <Crumb href={`/message/${id}`} active>
              {activeThreadProfile.first_name} {activeThreadProfile.last_name}
            </Crumb>
          )}
        </CrumbBar>
        {loading ? <Skeleton /> : <MainContent />}
      </PrimaryLayout>
    </>
  );
}
