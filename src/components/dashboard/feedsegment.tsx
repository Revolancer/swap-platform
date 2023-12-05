import { useCallback, useEffect, useMemo, useState } from 'react';
import { FeedPostData } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import { PortfolioProfileCard } from '../user-posts/portfolio-profile-card';
//import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { NeedProfileCard } from '../user-posts/need-profile-card';
import { skeletonPortfoliosArray } from '../skeletons/portfolio-profile-card';
import { AddSomething } from './addsomething';
import { UserProfileCard } from '../user-posts/user-profile-card';
import { Masonry, useInfiniteLoader } from 'masonic';

const addSomethingObj: FeedPostData = { type: 'add', data: { id: 'add' } };

const FeedEntry = ({ index, data }: { index: number; data: FeedPostData }) => {
  switch (data.type) {
    case 'need': {
      return (
        <NeedProfileCard
          data={data.data}
          key={data.data?.id ?? ''}
          withAuthor
        />
      );
    }
    case 'portfolio': {
      return (
        <PortfolioProfileCard
          data={data.data}
          key={data.data?.id ?? ''}
          withAuthor
        />
      );
    }
    case 'user': {
      return <UserProfileCard uid={data.data?.id ?? ''} />;
    }
    default: {
      return <AddSomething />;
    }
  }
};

export const FeedSegment = () => {
  const [posts, setPosts] = useState<FeedPostData[]>([addSomethingObj]);
  const startIndex = useMemo(() => posts.length - 1, [posts]);
  const stopIndex = useMemo(() => startIndex + 16, [startIndex]);

  const loadPostsForUser = useCallback(async () => {
    const items = await axiosPrivate
      .get('feed', {
        id: 'feed-data',
        cache: { ttl: 1000 * 60 },
        params: { from: startIndex, to: stopIndex },
      })
      .then((res) => res.data);
    setPosts([...posts, ...items]);
  }, [posts, startIndex, stopIndex]);

  const maybeLoadMore = useInfiniteLoader(loadPostsForUser, {
    isItemLoaded: (index, items: FeedPostData[]) => {
      console.log(index, posts.includes(items[index]));
      return !!items[index];
    },
    minimumBatchSize: 16,
    threshold: 8,
  });

  return (
    <Masonry
      onRender={maybeLoadMore}
      items={posts}
      render={FeedEntry}
      columnGutter={16}
      maxColumnCount={3}
      overscanBy={3}
    />
  );
};
