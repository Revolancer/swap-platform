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
  return (
    arrA.length === arrB.length &&
    arrA.every((element: any, index: number) => {
      if (typeof element === 'object') {
        compareArrays(Object.values(element), Object.values(arrB[index]));
      }
      return element === arrB[index];
    })
  );
};

export const FeedSegment = () => {
  const [posts, setPosts] = useState<FeedPostData[]>([]);
  const feedFilters = useAppSelector((state) => state.feedFilters);

  const loadPostsForUser = useCallback(async () => {
    // Set up and find any filter params changed from initial state
    const initState = Object.entries(feedInitialState);
    const changedFilters = Object.entries(feedFilters).filter(
      ([key, value], idx) => {
        if (typeof value === 'object') {
          if (value.length === 0) return false;
          return !compareArrays(
            Object.values(value),
            Object.values(initState[idx][1]),
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

    // Creates the Request URL for discovery feed based from filter params.
    const requestUrl = () => {
      if (transformFilters.length === 0) return 'feed';
      return transformFilters.some(([key, value]) =>
        ['term', 'tags'].includes(key),
      )
        ? 'search'
        : 'feed/v2';
    };

    // Actual fetching of data based from params.
    await axiosPrivate
      .get(requestUrl(), {
        id: 'feed-data',
        cache: {
          ttl: 1000, // 1 second.
        },
        params: Object.fromEntries(transformFilters),
      })
      .then((response) => {
        return requestUrl() === 'feed' ? response.data : response.data[0];
      })
      .then((data) => {
        if (requestUrl() === 'feed') return data;
        else {
          return Promise.all(
            data.map(
              async ({
                otherId,
                contentType,
              }: {
                otherId: string;
                contentType: string;
              }) => {
                const reqUrl =
                  contentType === 'user'
                    ? `${contentType}/profile/by_id/${otherId}`
                    : `${contentType}/${otherId}`;
                return await axiosPrivate.get(reqUrl).then(({ data }) => {
                  return {
                    type: contentType as 'portfolio' | 'need' | 'user',
                    data,
                  };
                });
              },
            ),
          );
        }
      })
      .then((data) => {
        setPosts(data);
      })
      .catch(() => {
        return;
      });
  }, [feedFilters]);

  // TO-DO(?): create a load new data button instead? similar to reddit's return to top button(loads new data)
  useEffect(() => {
    const interval = setInterval(loadPostsForUser, 10 * 60 * 1000);
    loadPostsForUser();
    return () => {
      clearInterval(interval);
    };
  }, [loadPostsForUser]);

  const staticPosts = posts.map((post) => {
    switch (post.type) {
      case 'portfolio': {
        return (
          <PortfolioProfileCard
            data={post.data}
            key={post.data?.id ?? ''}
            withAuthor
            hideIfEmpty
          />
        );
      }
      case 'need': {
        return (
          <NeedProfileCard
            data={post.data}
            key={post.data?.id ?? ''}
            withAuthor
          />
        );
      }
      case 'user': {
        return (
          <UserProfileCard
            uid={post.data?.user?.id}
            key={post.data?.id ?? ''}
          />
        );
      }
    }
  });

  // TO-DO: remove Addsomething component when search is being done.
  // TO-DO: create no results found component.
  return (
    <>
      <SearchBar />
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 905: 2, 1440: 3 }}>
        <Masonry gutter="0.8rem">
          <AddSomething />
          {staticPosts.length === 0
            ? skeletonPortfoliosArray(15, true)
            : staticPosts}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
};
