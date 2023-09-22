import { useEffect } from 'react';
import { ThreadListEntry } from './thread-list-entry';
import { Flex } from '@revolancer/ui/layout';
import { threadListSkeleton } from '../skeletons/thread-list-entry';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getMessages } from '@/lib/notifications';

export const ThreadList = ({
  activeThread,
  loading,
}: {
  activeThread: string;
  loading: boolean;
}) => {
  const threads = useAppSelector((state) => state.indicator.messages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMessages = () => dispatch(getMessages());
    const refreshThreads = setInterval(fetchMessages, 40 * 1000);
    return () => {
      clearInterval(refreshThreads);
    };
  }, [dispatch, threads]);

  const displayThreads = () => {
    const rendered = [];
    for (const thread of threads) {
      rendered.push(
        <ThreadListEntry
          message={thread}
          key={thread.id}
          activeThread={activeThread}
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
