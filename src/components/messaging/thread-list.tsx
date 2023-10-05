import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/lib/axios';
import { Message } from '@/lib/types';
import { ThreadListEntry } from './thread-list-entry';
import { Flex } from '@revolancer/ui/layout';
import { threadListSkeleton } from '../skeletons/thread-list-entry';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getMessages } from '@/lib/notifications';

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
  const threads = useAppSelector((state) => state.indicator.messages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadThreads = async () => {
      dispatch(getMessages(uid ? uid : ''));
    };
    loadThreads();
    const refreshThreads = setInterval(loadThreads, 20 * 1000);
    return () => {
      clearInterval(refreshThreads);
    };
  }, [uid, adminMode, dispatch]);

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
