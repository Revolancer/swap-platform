import { Message, UserProfileData } from '@/lib/types';
import { styled } from '@revolancer/ui';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/lib/axios';
import store, { useAppDispatch } from '@/redux/store';
import { DateTime } from 'luxon';
import { UnstyledLink } from '@revolancer/ui/buttons';
import { Flex, Div } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { ThreadListEntrySkeleton } from '../skeletons/thread-list-entry';
import { markMessageAsRead } from '@/lib/notifications';

const UnreadIndicator = () => {
  const Container = styled('div', {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    padding: '0.2rem',
    paddingTop: '0.4rem',
    paddingBottom: '0',
  });

  const Dot = styled('div', {
    width: '100%',
    height: '100%',
    backgroundColor: '$pink500',
    borderRadius: '100%',
  });

  return (
    <Container>
      <Dot />
    </Container>
  );
};

export const ThreadListEntry = ({
  message,
  activeThread,
}: {
  message: Message;
  activeThread: string;
}) => {
  const [threadProfile, setThreadProfile] = useState<UserProfileData>();
  const [id, setId] = useState('');
  const [unread, setUnread] = useState(false);

  const dispatch = useAppDispatch();

  const ProfileImageContainer = styled('div', {
    backgroundColor: '$neutral300',
    overflow: 'hidden',
    width: `48px`,
    height: `48px`,
    borderRadius: '$2',
  });

  const ProfileImage = styled(Image, {
    objectFit: 'cover',
  });

  useEffect(() => {
    const loadProfile = async (id: string) => {
      if (id == '') return;
      await axiosPrivate
        .get(`user/profile/by_id/${id}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) === false) {
            setThreadProfile(undefined);
          } else {
            setThreadProfile(data);
          }
        })
        .catch((err) => {
          setThreadProfile(undefined);
        });
    };
    const self = store?.getState()?.userData?.user?.id ?? '';
    let id;
    if ((message.reciever as any as string) == self) {
      id = message.sender as any as string;
      if (!message.read) setUnread(true);
    } else {
      id = message.reciever as any as string;
    }
    loadProfile(id);
    setId(id);
  }, [message]);

  const time = DateTime.fromISO(message.created_at).toLocal();
  const now = DateTime.now().toLocal();

  let timeStr = '';
  if (!(time.startOf('day') < now.startOf('day'))) {
    timeStr = time.toFormat('t');
  } else if (time.startOf('year') < now.startOf('year')) {
    timeStr = time.toFormat('LLLL d yyyy');
  } else {
    timeStr = time.toFormat('LLLL d');
  }

  if (!id) return <ThreadListEntrySkeleton />;

  const handleReadMessage = () => {
    dispatch(markMessageAsRead(message.id));
  };

  return (
    <>
      <Div
        css={{
          backgroundColor: activeThread == id ? '$neutral100' : 'inherit',
          borderTopWidth: '$1',
          borderTopStyle: '$solid',
          borderTopColor: '$neutral600',
          paddingBlock: '$3',
          paddingInline: '$2',
        }}
      >
        <UnstyledLink
          href={`/message/${id}`}
          onClick={() => handleReadMessage()}
          replace
        >
          <Div
            css={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '$4',
              alignItems: 'center',
            }}
          >
            <ProfileImageContainer>
              {threadProfile?.profile_image && (
                <ProfileImage
                  src={threadProfile?.profile_image ?? ''}
                  height={48}
                  width={48}
                  alt={`${threadProfile?.first_name} ${threadProfile?.last_name}`}
                ></ProfileImage>
              )}
            </ProfileImageContainer>
            <Flex column css={{ flexGrow: '1' }}>
              <Flex css={{ justifyContent: 'space-between' }}>
                <P css={{ fontWeight: 'bold' }}>
                  {`${threadProfile?.first_name} ${threadProfile?.last_name}`}
                  {unread && <UnreadIndicator />}
                </P>
                <P css={{ color: '$neutral600' }}>{timeStr}</P>
              </Flex>
              <P
                css={{
                  color: '$neutral600',
                  textOverflow: 'ellipsis',
                  maxWidth: '26ch',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {message.body.substring(0, 30).replaceAll('\n', ' ')}
              </P>
            </Flex>
          </Div>
        </UnstyledLink>
      </Div>
    </>
  );
};
