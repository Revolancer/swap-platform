import { axiosPrivate } from '@/lib/axios';
import { Message, UserProfileData } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import { MessageInput } from './message-input';
import { DateTime } from 'luxon';
import store from '@/redux/store';
import { MessageAuthor } from './message-author';
import { TertiaryButton } from '@revolancer/ui/buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import Linkify from 'linkify-react';
import { renderLinksInMessages } from './util-functions-for-messaging';
import { LabelledDivider, Div } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { ThreadSkeleton } from '../skeletons/current-thread';

export const CurrentThread = ({
  uid,
  loading,
  uidForAdmin,
}: {
  uid: string;
  loading: boolean;
  uidForAdmin?: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [myProfile, setMyProfile] = useState<UserProfileData>();
  const [theirProfile, setTheirProfile] = useState<UserProfileData>();
  const [messagesEnd, setMessagesEnd] = useState<HTMLDivElement>();
  const scrollToBottom = useCallback(() => {
    if (messagesEnd) messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }, [messagesEnd]);

  const loadActiveThread = useCallback(() => {
    if (uid == '') return;
    if (uidForAdmin) {
      axiosPrivate
        .get(`message/admin/${uidForAdmin}/messages/${uid}`, {
          id: `message-threads-${uid}`,
          cache: {
            ttl: 20 * 1000,
          },
        })
        .then((res) => res.data)
        .then((data) => {
          if (data.length != messages.length) {
            setMessages(data);
          }
        })
        .catch((err) => setMessages([]));
    } else {
      axiosPrivate
        .get(`message/${uid}`, {
          id: `message-threads-${uid}`,
          cache: {
            ttl: 20 * 1000,
          },
        })
        .then((res) => res.data)
        .then((data) => {
          if (data.length != messages.length) {
            scrollToBottom();
            setMessages(data);
          }
        })
        .catch((err) => setMessages([]));
    }
  }, [uid, messages, scrollToBottom, uidForAdmin]);

  useEffect(() => {
    const loadProfiles = async () => {
      if (uid == '') return;
      const own = store?.getState()?.userData?.user?.id ?? '';
      const self = uidForAdmin ? uidForAdmin : own;
      if (self == '') return;
      await axiosPrivate
        .get(`user/profile/by_id/${uid}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) === false) {
            setTheirProfile(undefined);
          } else {
            setTheirProfile(data);
          }
        })
        .catch((err) => {
          setTheirProfile(undefined);
        });
      await axiosPrivate
        .get(`user/profile/by_id/${self}`)
        .then((res) => res.data)
        .then((data) => {
          if ((data?.id ?? false) === false) {
            setMyProfile(undefined);
          } else {
            setMyProfile(data);
          }
        })
        .catch((err) => {
          setMyProfile(undefined);
        });
    };
    loadProfiles();
    loadActiveThread();
    if (!uidForAdmin) scrollToBottom();
    const refreshActiveThread = setInterval(loadActiveThread, 20 * 1000);
    return () => {
      clearInterval(refreshActiveThread);
    };
  }, [loadActiveThread, uid, scrollToBottom, uidForAdmin]);

  const sendReadReceipt = async (id: string) => {
    axiosPrivate.post(`message/acknowledge/${id}`).catch((err) => {});
  };

  const renderMessageArray = () => {
    const rendered = [];
    let lastSender = '';
    let lastTime = DateTime.fromMillis(0);
    let now = DateTime.now().toLocal();
    for (const message of messages) {
      if (!message.read && !uid) {
        sendReadReceipt(message.id);
      }
      const thisTime = DateTime.fromISO(message.created_at);
      //Divider for date
      if (lastTime.startOf('day') < thisTime.startOf('day')) {
        if (thisTime.plus({ days: 180 }) < now) {
          rendered.push(
            <LabelledDivider
              label={thisTime
                .toLocal()
                .startOf('day')
                .toFormat('cccc, LLLL d yyyy')}
              key={`divider-${message.id}`}
            />,
          );
        } else {
          rendered.push(
            <LabelledDivider
              label={thisTime.toLocal().startOf('day').toFormat('cccc, LLLL d')}
              key={`divider-${message.id}`}
            />,
          );
        }
      }
      //Sender chip
      if (
        lastTime.startOf('day') < thisTime.startOf('day') ||
        lastTime.plus({ hours: 6 }) < thisTime ||
        lastSender != message.sender
      ) {
        if (theirProfile?.user?.id == message.sender) {
          rendered.push(
            <MessageAuthor
              profile={theirProfile}
              time={thisTime}
              key={`authorchip-${message.id}`}
            />,
          );
        } else if (myProfile?.user?.id == message.sender) {
          rendered.push(
            <MessageAuthor
              profile={myProfile}
              time={thisTime}
              key={`authorchip-${message.id}`}
            />,
          );
        }
      }

      //Actual message body
      rendered.push(
        message.body.split('\n').map(function (item, idx) {
          return (
            <span key={`${message.id}-${idx}`}>
              <Linkify options={{ render: renderLinksInMessages }}>
                {item}
              </Linkify>
              <br />
            </span>
          );
        }),
      );

      //attachments
      if (message.attachment) {
        rendered.push(
          <P>
            <TertiaryButton
              key={message.attachment.id}
              href={message.attachment.url}
              target="_blank"
              download={message.attachment.filename}
              normalCase
            >
              <FontAwesomeIcon icon={faPaperclip} />
              {message.attachment.filename}
            </TertiaryButton>
          </P>,
        );
      }

      lastTime = thisTime;
      lastSender = message.sender;
    }
    return rendered;
  };

  if (loading) return <ThreadSkeleton />;

  return (
    <>
      <Div css={{ flexGrow: '1', overflowY: 'auto' }}>
        {renderMessageArray()}
        <div style={{ position: 'relative' }}>
          <div
            style={{ position: 'absolute', top: '0.1rem' }}
            ref={(el) => {
              if (el) setMessagesEnd(el);
            }}
          ></div>
        </div>
      </Div>
      {!uidForAdmin && <MessageInput uid={uid} refresh={loadActiveThread} />}
    </>
  );
};
