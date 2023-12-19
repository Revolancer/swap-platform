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

const FeedEntry = ({ data }: { data: FeedPostData }) => {
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
  const [posts, setPosts] = useState<FeedPostData[]>([]);
  const [renderedPosts, setRenderedPosts] = useState<FeedPostData[]>([
    addSomethingObj,
  ]);

  const loadPostsForUser = useCallback(async () => {
    const items = await axiosPrivate
      .get('feed', {
        id: 'feed-data',
        cache: { ttl: 1000 * 60 },
      })
      .then((response) => {
        const firstRendered = posts.length > 0 ? posts[0].data.id : '';
        const firstFetched =
          response.data.length > 0 ? response.data[0].data.id : '';
        if (firstRendered !== firstFetched) {
          setPosts(response.data ?? []);
        }
      })
      .catch(() => {
        return;
      });
  }, [posts]);

  useEffect(() => {
    const interval = setInterval(loadPostsForUser, 10 * 60 * 1000);
    loadPostsForUser();
    return () => {
      clearInterval(interval);
    };
  }, [loadPostsForUser]);

  const loadRenderedPosts = useCallback(
    (startIndex: number, stopIndex: number, currentItems: any[]) => {
      const nextItems = posts.slice(startIndex, stopIndex);
      setRenderedPosts((current) => [...current, ...nextItems]);
    },
    [posts],
  );

  const maybeLoadMore = useInfiniteLoader(loadRenderedPosts, {
    threshold: 15,
  });

  return (
    <Masonry
      onRender={maybeLoadMore}
      items={renderedPosts}
      render={FeedEntry}
      columnGutter={16}
      maxColumnCount={3}
      overscanBy={5}
    />
  );
};
