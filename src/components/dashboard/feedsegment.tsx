import { useCallback, useEffect, useState } from 'react';
import { FeedPostData, Tag } from '@/lib/types';
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
  Object.values(a).length === Object.values(b).length &&
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
  const [paramsArray, setParamsArray] = useState<[string, any][]>([]);

  useEffect(() => {
    const initState = Object.entries(feedInitialState);
    const changedFilters = Object.entries(feedFilters).filter(
      ([key, value], idx) => {
        if (typeof value === 'object') {
          compareArrays(Object.values(value), Object.values(initState[idx][1]));
        }
        return value !== initState[idx][1];
      },
    );
    setParamsArray(changedFilters);
  }, [feedFilters]);

  const loadPostsForUser = useCallback(async () => {
    // Creates the Request URL for discovery feed.
    const requestUrl = () => {
      if (paramsArray.length === 0) return 'feed';
      const paramsArr = paramsArray.map(([key, value], idx) => {
        const append = idx > 0 ? '&' : '';
        if (key === 'tags') {
          const tagsValue = value.map((tag: Tag) => tag.id).join(',');
          return `${append}${key}=${tagsValue}`;
        } else if (key === 'datatype') {
          const arrValue = value.join(',');
          return `${append}${key}=${arrValue}`;
        } else {
          return `${append}${key}=${value}`;
        }
      });
      const header = paramsArray.some(
        ([key, value]) => key === 'term' || key === 'tags',
      )
        ? 'search?'
        : 'feed/v2?';
      return header + paramsArr.join('');
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
  }, [paramsArray, posts]);

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
