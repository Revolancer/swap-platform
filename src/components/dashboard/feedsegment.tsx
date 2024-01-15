import { useCallback, useEffect, useRef, useState } from 'react';
import { FeedPostData, Tag } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import { PortfolioProfileCard } from '../user-posts/portfolio-profile-card';
import { NeedProfileCard } from '../user-posts/need-profile-card';
import { AddSomething } from './addsomething';
import { UserProfileCard } from '../user-posts/user-profile-card';
import { useAppSelector } from '@/redux/store';
import { SearchBar } from './search/searchbar';
import { feedInitialState } from './reducer';
import Image from 'next/image';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { Masonry as Masonic } from 'masonic';
import { compareArrays } from './utils';

const addSomethingObj: FeedPostData = { type: 'add', data: { id: 'add' } };

const FeedCard = ({ data }: { data: FeedPostData }) => {
  switch (data.type) {
    case 'add': {
      return <AddSomething />;
    }
    case 'portfolio': {
      return (
        <PortfolioProfileCard
          data={data.data}
          key={data.data?.id ?? ''}
          withAuthor
          hideIfEmpty
        />
      );
    }
    case 'need': {
      return (
        <NeedProfileCard
          data={data.data}
          key={data.data?.id ?? ''}
          withAuthor
        />
      );
    }
    case 'user': {
      return (
        <UserProfileCard uid={data.data?.user?.id} key={data.data?.id ?? ''} />
      );
    }
  }
};

export const FeedSegment = () => {
  const [posts, setPosts] = useState<FeedPostData[]>([addSomethingObj]);
  const feedFilters = useAppSelector((state) => state.feedFilters);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState(true);

  const loadPostsForUser = useCallback(async () => {
    setLoading(true);
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
      if (transformFilters.length === 0) {
        setFeed(true);
        return 'feed/v2';
      } else {
        setFeed(false);
        return transformFilters.some(([key, value]) =>
          ['term', 'tags'].includes(key),
        )
          ? 'search'
          : 'feed/v2';
      }
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
      .then(({ data }) => data[0])
      .then((data) => {
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
      })
      .then((data) => {
        setPosts((current) => {
          if (transformFilters.length === 0) return [...current, ...data];
          return [...current, ...data].filter((post) => post.type === 'add');
        });
        setLoading(false);
      })
      .catch(() => {
        return;
      });
  }, [feedFilters]);

  // TO-DO(?): create a load new data button instead? similar to reddit's return to top button that loads new data
  useEffect(() => {
    const interval = setInterval(loadPostsForUser, 10 * 60 * 1000);
    loadPostsForUser();
    return () => {
      clearInterval(interval);
    };
  }, [loadPostsForUser]);

  const NoResultsFound = () => (
    <Flex column gap={5} css={{ alignItems: 'center', textAlign: 'center' }}>
      <P>Sorry, we couldn’t find any results for “{feedFilters.term}”.</P>
      <Image
        src="/img/revy/Revy_Confused.png"
        alt="Revy, happy to guide you back to safety"
        width={210}
        height={314}
      />
      <P>
        Make sure all words are spelled correctly, or try searching for simpler
        terms.
      </P>
    </Flex>
  );

  return (
    <>
      <SearchBar />
      {posts.length > 0 ? (
        <Masonic
          items={posts}
          render={FeedCard}
          maxColumnCount={3}
          columnGutter={16}
          overscanBy={4}
        />
      ) : (
        <NoResultsFound />
      )}
    </>
  );
};
