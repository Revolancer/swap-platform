import { useCallback, useEffect, useState } from 'react';
import { PostData } from '@/lib/types';
import { axiosPublic } from '@/lib/axios';
import { PortfolioProfileCard } from '../user-posts/portfolio-profile-card';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Flex } from '../layout/flex';
import { H5 } from '../text/headings';

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

  const loadPostsForUser = useCallback(async () => {
    axiosPublic
      .get(`portfolio/for_user/${uid}`, {
        id: `user-portfolio-${uid}`,
      })
      .then((response) => setPosts(response.data ?? []))
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
    <></>
  );
};
