import { useCallback, useEffect, useState } from 'react';
import { FeedPostData } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import { PortfolioProfileCard } from '../user-posts/portfolio-profile-card';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { NeedProfileCard } from '../user-posts/need-profile-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@revolancer/ui/buttons';
import { Flex, Card } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { skeletonPortfoliosArray } from '../skeletons/portfolio-profile-card';

const AddSomething = () => {
  return (
    <Card>
      <Flex
        column
        gap={3}
        css={{
          borderWidth: '$2',
          borderColor: '$neutral500',
          borderStyle: 'dashed',
          borderRadius: '$2',
          alignItems: 'center',
          padding: '$4',
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
        <P>
          <strong>Add something</strong>
        </P>
        <Flex gap={4}>
          <Button href="/portfolio/new" size="small">
            New Post
          </Button>
          <Button href="/need/new" size="small">
            I need...
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export const FeedSegment = () => {
  const [posts, setPosts] = useState<FeedPostData[]>([]);

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
  const staticPosts = [];
  for (const post of posts) {
    if (post.type == 'need') {
      staticPosts.push(
        <NeedProfileCard
          data={post.data}
          key={post.data?.id ?? ''}
          withAuthor
        />,
      );
    } else {
      staticPosts.push(
        <PortfolioProfileCard
          data={post.data}
          key={post.data?.id ?? ''}
          withAuthor
          hideIfEmpty
        />,
      );
    }
  }

  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 905: 2, 1440: 3 }}>
      <Masonry gutter="0.8rem">
        <AddSomething />
        {staticPosts.length === 0
          ? skeletonPortfoliosArray(15, true)
          : staticPosts}
      </Masonry>
    </ResponsiveMasonry>
  );
};
