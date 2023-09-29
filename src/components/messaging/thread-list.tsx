import { useEffect, useState } from 'react';
import { ThreadListEntry } from './thread-list-entry';
import { Flex } from '@revolancer/ui/layout';
import { threadListSkeleton } from '../skeletons/thread-list-entry';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getMessages } from '@/lib/notifications';
import { axiosPrivate } from '@/lib/axios';
import { Message } from '@/lib/types';

export const ThreadList = ({
  activeThread,
  loading,
  uid,
  adminMode = false,
}: {
  activeThread: string;
  loading: boolean;
  uid?: string;
  adminMode?: boolean;
}) => {
  //const threads = useAppSelector((state) => state.indicator.messages);
  const [threads, setThreads] = useState<Message[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadThreads = async () => {
      if (adminMode) {
        axiosPrivate
          .get(`message/admin/${uid}`, {
            id: `message-threads`,
            cache: {
              ttl: 20 * 1000,
            },
          })
          .then((res) => res.data)
          .then((data) => setThreads(data))
          .catch((err) => setThreads([]));
      } else {
        axiosPrivate
          .get('message', {
            id: `message-threads`,
            cache: {
              ttl: 20 * 1000,
            },
          })
          .then((res) => res.data)
          .then((data) => setThreads(data))
          .catch((err) => setThreads([]));
      }
    };
    loadThreads();
    const refreshThreads = setInterval(loadThreads, 40 * 1000);
    return () => {
      clearInterval(refreshThreads);
    };
  }, [uid, adminMode]);

  const displayThreads = () => {
    const rendered = [];
    for (const thread of threads) {
      rendered.push(
        <ThreadListEntry
          message={thread}
          key={thread.id}
          activeThread={activeThread}
          uid={uid}
        />,
      );
    }
    return rendered;
  };

  return (
    <Flex
      column
      css={{
        overflowY: 'auto',
        maxHeight: '85dvh',
        paddingBlockEnd: '$4',
      }}
      gap={0}
    >
      {!loading ? displayThreads() : threadListSkeleton()}
    </Flex>
  );
};
