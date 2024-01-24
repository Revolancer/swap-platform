import { useCallback, useEffect, useState } from 'react';
import { FeedPostData } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import {
  AddSomething,
  SearchBar,
  FeedCard,
  BackToTop,
  NoResultsFound,
} from './ui';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import {
  PortfoliosSkeleton,
  skeletonPortfoliosArray,
} from '../skeletons/portfolio-profile-card';
import { isInitialState } from './utils';
import { useInView } from 'react-intersection-observer';
import { nextPage } from './reducer';

export const FeedSegment = () => {
  const [posts, setPosts] = useState<FeedPostData[]>([]);
  const [element, setElement] = useState<HTMLDivElement>();
  const feedFilters = useAppSelector((state) => state.feedFilters);
  const dispatch = useAppDispatch();

  const loadPostsForUser = useCallback(async () => {
    // Creates the Request URL for discovery feed based from filter params.
    const { term, sort, order, datatype, tag, page } = feedFilters;
    const hasSearchTerm = term !== '' || tag.length > 0;

    // Actual fetching of data based from params.
    await axiosPrivate
      .get(hasSearchTerm ? 'search' : 'feed/v2', {
        id: 'feed-data',
        cache: {
          ttl: 1000, // 1 second.
        },
        params: {
          term,
          sort,
          order,
          datatype,
          tag: tag.map((tag) => tag.id),
          page,
        },
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
          if (page === 1) return data;
          return [...current, ...data];
        });
      })
      .catch(() => {
        return;
      });
  }, [feedFilters]);

  const { ref, inView } = useInView();
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    if (inView) {
      setShowScroll(true);
      dispatch(nextPage());
    }
  }, [dispatch, inView]);

  const scrollTop = useCallback(() => {
    if (element)
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    setShowScroll(false);
  }, [element]);

  // TO-DO(?): create a load new data button instead? similar to reddit's return to top button that loads new data
  useEffect(() => {
    const interval = setInterval(loadPostsForUser, 10 * 60 * 1000);
    loadPostsForUser();
    return () => {
      clearInterval(interval);
    };
  }, [loadPostsForUser]);

  const staticPosts = posts.map((post) => (
    <FeedCard key={post?.data?.id} data={post} />
  ));

  return (
    <>
      <BackToTop scroll={scrollTop} showScroll={showScroll} />
      <SearchBar
        refItem={(el: any) => {
          if (el) setElement(el);
        }}
      />
      {isInitialState(feedFilters) || posts.length ? (
        <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 650: 2, 900: 3 }}>
          <Masonry gutter="0.8rem">
            {isInitialState(feedFilters) && <AddSomething />}
            {staticPosts.length
              ? staticPosts
              : skeletonPortfoliosArray(15, true)}
            {staticPosts.length >= 20 && (
              <div ref={ref}>
                <PortfoliosSkeleton withAuthor />
              </div>
            )}
          </Masonry>
        </ResponsiveMasonry>
      ) : (
        <NoResultsFound term={feedFilters.term} tag={feedFilters.tag} />
      )}
    </>
  );
};
