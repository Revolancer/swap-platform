import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserProfileData } from '@/lib/types';
import { version as uuidVersion } from 'uuid';
import { axiosPrivate } from '@/lib/axios';
import { MainContentWithSideBar, SideBar } from '@/components/layout/columns';
import { CurrentThreadAuthor } from '@/components/messaging/current-thread-author';
import { Divider } from '@/components/layout/divider';
import { Flex } from '@/components/layout/flex';
import { CurrentThread } from '@/components/messaging/current-thread';
import { ThreadList } from '@/components/messaging/thread-list';
import { P } from '@/components/text/text';
import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
import { Crumb } from '@/components/navigation/crumbs/crumb';

export default function MessageCenter() {
  const router = useRouter();
  const { id } = router.query;
  const [activeThreadProfile, setActiveThreadProfile] =
    useState<UserProfileData>();
  const [activeThread, setActiveThread] = useState('');
  const [allMessageCount, setAllMessageCount] = useState(0);

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
  }, [id]);
  console.log(typeof activeThreadProfile);

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
        <SideBar>
          <ThreadList activeThread={activeThread} />
        </SideBar>
        <MainContentWithSideBar>
          {activeThreadProfile && (
            <Flex
              column
              css={{ maxHeight: 'max(400px, 85dvh)', height: '100vh' }}
            >
              <CurrentThreadAuthor data={activeThreadProfile} />
              <Divider css={{ flexGrow: 0 }} />
              <CurrentThread uid={activeThread} />
            </Flex>
          )}
          {!activeThreadProfile && allMessageCount < 1 && (
            <P css={{ color: '$neutral600' }}>
              Looks like you haven&rsquo;t messaged anyone just yet
            </P>
          )}
          {!activeThreadProfile && allMessageCount >= 1 && (
            <P css={{ color: '$neutral600' }}>Select a conversation</P>
          )}
        </MainContentWithSideBar>
      </PrimaryLayout>
    </>
  );
}
