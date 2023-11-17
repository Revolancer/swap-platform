import { useCallback, useEffect, useState } from 'react';
import { FeedPostData } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import { PortfolioProfileCard } from '../user-posts/portfolio-profile-card';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { NeedProfileCard } from '../user-posts/need-profile-card';
import { skeletonPortfoliosArray } from '../skeletons/portfolio-profile-card';
import { AddSomething } from './addsomething';
import { UserProfileCard } from '../user-posts/user-profile-card';
import { useAppSelector } from '@/redux/store';
import { SearchBar } from './search/searchbar';
import { feedInitialState } from './search/reducer';

const compareArrays = (a: any, b: any) =>
  a.length === b.length &&
  a.every((element: any, index: number) => {
    if (typeof element === 'object') {
      return compareArrays(Object.values(element), Object.values(b[index]));
    }
    return element === b[index];
  });

const isInitalState = (obj: typeof feedInitialState) => {
  const initVals = Object.values(feedInitialState);
  const testVals = Object.values(obj);
  return compareArrays(initVals, testVals);
};

export const FeedSegment = () => {
  const [posts, setPosts] = useState<FeedPostData[]>([]);
  const feedFilters = useAppSelector((state) => state.feedFilters);

  const loadPostsForUser = useCallback(async () => {
    // Creates the Request URL for discovery feed.
    const requestUrl = () => {
      if (isInitalState(feedFilters)) return 'feed';
      const { term, sort, order, page, datatype, tag } = feedFilters;
      const termQuery = term ? `term=${term}` : '';
      const sortQuery = sort ? `${term ? '&' : ''}sort=${sort}` : '';
      const orderQuery = order ? `&order=${order}` : '';
      const pageQuery = page ? `&page=${page}` : '';
      //const tagQuery = Object.keys(tag).includes('id') ? `tag=${tag.id}` : '';
      let filterQuery = '';
      datatype?.forEach((type) => (filterQuery += `&datatype=${type}`));
      return `${
        term ? 'search?' : 'feed/v2?'
      }${termQuery}${sortQuery}${orderQuery}${pageQuery}${filterQuery}`;
    };

    axiosPrivate
      .get(requestUrl(), {
        id: 'feed-data',
        cache: {
          ttl: 1000, // 1 second.
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
  }, [feedFilters, posts]);

  useEffect(() => {
    const interval = setInterval(loadPostsForUser, 10 * 60 * 1000);
    loadPostsForUser();
    return () => {
      clearInterval(interval);
    };
  }, [loadPostsForUser]);
  const staticPosts = [];
  for (const post of posts) {
    switch (post.type) {
      case 'portfolio': {
        staticPosts.push(
          <PortfolioProfileCard
            data={post.data}
            key={post.data?.id ?? ''}
            withAuthor
            hideIfEmpty
          />,
        );
        break;
      }
      case 'need': {
        staticPosts.push(
          <NeedProfileCard
            data={post.data}
            key={post.data?.id ?? ''}
            withAuthor
          />,
        );
        break;
      }
      case 'user': {
        staticPosts.push(
          <UserProfileCard
            uid={post.data?.user?.id}
            key={post.data?.id ?? ''}
          />,
        );
        break;
      }
    }
  }

  return (
    <>
      <SearchBar />
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 905: 2, 1440: 3 }}>
        <Masonry gutter="0.8rem">
          {isInitalState(feedFilters) && <AddSomething />}
          {staticPosts.length === 0
            ? skeletonPortfoliosArray(15, true)
            : staticPosts}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
};
