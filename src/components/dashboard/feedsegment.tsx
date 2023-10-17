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
    default: {
      return <UserProfileCard uid={data.data?.id ?? ''} />;
    }
  }
};

export const FeedSegment = () => {
  const [posts, setPosts] = useState<FeedPostData[]>([]);
  const [renderedPosts, setRenderedPosts] = useState<FeedPostData[]>(posts);

  const loadPostsForUser = useCallback(async () => {
    axiosPrivate
      .get(`feed`, {
        id: 'feed-data',
        cache: {
          ttl: 1000 * 60, // 1 minute.
        },
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

  const maybeLoadMore = useInfiniteLoader(
    async (startIndex, stopIndex, currentItems) => {
      const nextItems = await getRenderedItemsPromise(startIndex, stopIndex);
      setRenderedPosts((current) => [...current, ...nextItems]);
    },
    {
      isItemLoaded: (index, items) => !!items[index],
      minimumBatchSize: 32,
      threshold: 3,
    },
  );

  const getRenderedItemsPromise = (start: number, end: number) =>
    Promise.resolve(getRenderedItems(start, end));

  const getRenderedItems = (start = 0, end = 32) => {
    const renderedItems = [];
    for (let i = start; i < end; i++) renderedItems.push(posts[i]);
    return renderedItems;
  };

  return (
    <Mason
      onRender={maybeLoadMore}
      items={renderedPosts}
      render={FeedEntry}
      columnGutter={16}
      maxColumnCount={3}
      overscanBy={3}
    />
  );
};
