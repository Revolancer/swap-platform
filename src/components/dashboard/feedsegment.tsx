import { useCallback, useEffect, useState } from 'react';
import { FeedPostData } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import { PortfolioProfileCard } from '../user-posts/portfolio-profile-card';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { NeedProfileCard } from '../user-posts/need-profile-card';
import { skeletonPortfoliosArray } from '../skeletons/portfolio-profile-card';
import { AddSomething } from './addsomething';
import { UserProfileCard } from '../user-posts/user-profile-card';
import { Masonry as Mason, useInfiniteLoader } from 'masonic';

const addSomethingObj: FeedPostData = { type: 'add', data: { id: 'add' } };

const FeedEntry = ({ index, data }: { index: number; data: FeedPostData }) => {
  //if (index === 0) return <AddSomething />;
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

  const loadPostsForUser = async (
    startIndex: number,
    stopIndex: number,
    currentItems: any,
  ) => {
    console.log(startIndex, stopIndex);
    const nextItems = await axiosPrivate
      .get('feed', {
        id: 'feed-data',
        cache: { ttl: 1000 * 60 },
      })
      .then((res) => {
        const { data } = res;
        return data.slice(startIndex, stopIndex);
      })
      .catch(() => {
        return;
      });
    setPosts((current) => [...posts, ...nextItems]);
  };

  const maybeLoadMore = useInfiniteLoader(loadPostsForUser, {
    minimumBatchSize: 50,
    threshold: 10,
  });

  return (
    <Mason
      onRender={maybeLoadMore}
      items={posts}
      render={FeedEntry}
      columnGutter={16}
      maxColumnCount={3}
      overscanBy={3}
    />
  );
};
