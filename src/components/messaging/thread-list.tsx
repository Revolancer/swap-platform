import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/lib/axios';
import { Message } from '@/lib/types';
import { ThreadListEntry } from './thread-list-entry';
import { Flex } from '@revolancer/ui/layout';
import { threadListSkeleton } from '../skeletons/thread-list-entry';

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
  const [threads, setThreads] = useState<Message[]>([]);

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
          adminMode
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
