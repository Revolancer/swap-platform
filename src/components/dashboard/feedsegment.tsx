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
  const start = useMemo(() => posts.length - 1, [posts]);
  const end = useMemo(() => start + 16, [start]);

  const loadPostsForUser = useCallback(async () => {
    const items = await axiosPrivate
      .get('feed', {
        id: 'feed-data',
        cache: { ttl: 1000 * 60 },
        params: { start, end },
      })
      .then(({ data }) => {
        console.log(start, end, data);
        return data;
      });
    setPosts([...posts, ...items]);
  }, [end, posts, start]);

  const maybeLoadMore = useInfiniteLoader(loadPostsForUser, {
    isItemLoaded: (index, items: FeedPostData[]) => !!items[index],
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
      overscanBy={4}
    />
  );
};
