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

const compareArrays = (a: object, b: object) => {
  const arrA = Object.values(a);
  const arrB = Object.values(b);
  arrA.length === arrB.length &&
    arrA.every((element: any, index: number) => {
      if (typeof element === 'object') {
        return compareArrays(
          Object.values(element),
          Object.values(arrB[index]),
        );
      }
      return element === arrB[index];
    });
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
          return (
            value.length === 0 &&
            compareArrays(
              Object.values(value),
              Object.values(initState[idx][1]),
            )
          );
        }
        return value !== initState[idx][1];
      },
    );
    const transformFilters: [string, any][] = changedFilters.map(
      ([key, value]) => {
        if (key === 'tags') {
          const newVal = value.map((tag: Tag) => tag.id);
          return [key, newVal];
        }
        return [key, value];
      },
    );
    setParamsArray(transformFilters);
  }, [feedFilters]);

  const loadPostsForUser = useCallback(async () => {
    // Creates the Request URL for discovery feed.
    const requestUrl = () => {
      if (paramsArray.length === 0) return 'feed';
      return paramsArray.some(
        ([key, value]) => key === 'term' || key === 'tags',
      )
        ? 'search'
        : 'feed/v2';
    };

    const getFeedData = (res: any) => {
      const firstRendered = posts.length > 0 ? posts[0].data.id : '';
      const firstFetched = res.data.length > 0 ? res.data[0].data.id : '';
      if (firstRendered !== firstFetched) {
        setPosts(res.data ?? []);
      }
    };

    const getSearchResults = (res: any) => {
      const results = res.data[0];
      const searchResults: FeedPostData[] = results.map(
        async ({
          otherId,
          contentType,
        }: {
          otherId: string;
          contentType: string;
        }) => {
          const reqUrl = `${contentType}/${otherId}`;
          const item = await axiosPrivate.get(reqUrl).then((res) => res.data);
          console.log(item);
          return item;
        },
      );
      setPosts(searchResults ?? []);
    };

    axiosPrivate
      .get(requestUrl(), {
        id: 'feed-data',
        cache: {
          ttl: 1000, // 1 second.
        },
        params: Object.fromEntries(paramsArray),
      })
      .then((response) => {
        if (requestUrl() === 'feed') getFeedData(response);
        else getSearchResults(response);
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
          {paramsArray.length === 0 && <AddSomething />}
          {staticPosts.length === 0
            ? skeletonPortfoliosArray(15, true)
            : staticPosts}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
};
