import { useCallback, useEffect, useState } from 'react';
import { PostData } from '@/lib/types';
import { axiosPublic } from '@/lib/axios';
import { PortfolioProfileCard } from '../user-posts/portfolio-profile-card';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Button } from '@revolancer/ui/buttons';
import { Flex, Card } from '@revolancer/ui/layout';
import { H5, P } from '@revolancer/ui/text';
import { skeletonPortfoliosArray } from '../skeletons/portfolio-profile-card';
import { SkeletonText } from '@revolancer/ui/skeleton';

export const PortfolioSegment = ({
  name = '',
  uid = '',
  own = false,
}: {
  name?: string;
  uid: string;
  own?: boolean;
}) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPostsForUser = useCallback(async () => {
    axiosPublic
      .get(`portfolio/for_user/${uid}`, {
        id: `user-portfolio-${uid}`,
      })
      .then((response) => {
        setLoading(false);
        setPosts(response.data ?? []);
      })
      .catch(() => setPosts([]));
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadPostsForUser();
    }
  }, [uid, loadPostsForUser]);
  const staticPosts = [];
  for (const post of posts) {
    staticPosts.push(
      <PortfolioProfileCard data={post} own={own} key={post?.id ?? ''} />,
    );
  }

  if (loading)
    return (
      <Flex column gap={4}>
        <SkeletonText type="h5" css={{ width: '50%' }} />
        <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1200: 2 }}>
          <Masonry gutter="0.8rem">{skeletonPortfoliosArray()}</Masonry>
        </ResponsiveMasonry>
      </Flex>
    );

  return own || staticPosts.length > 0 ? (
    <Flex column gap={4}>
      <H5>{name != '' ? `${name}'s` : 'My'} Portfolio</H5>
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1200: 2 }}>
        <Masonry gutter="0.8rem">
          {own && <PortfolioProfileCard placeholder />}
          {staticPosts}
        </Masonry>
      </ResponsiveMasonry>
    </Flex>
  ) : (
    <Flex column gap={4}>
      <H5>{name}&rsquo;s Portfolio</H5>
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1200: 2 }}>
        <Masonry gutter="0.8rem">
          <Card>
            <H5>Nothing to see here</H5>
            <P>
              {name} has no portfolio yet. Send them a message if you would like
              to see examples of their previous work.
            </P>
            <Button href={`/message/${uid}`}>Message {name}</Button>
          </Card>
        </Masonry>
      </ResponsiveMasonry>
    </Flex>
  );
};
