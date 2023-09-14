import { useCallback, useEffect, useState } from 'react';
import { PostData } from '@/lib/types';
import { axiosPublic } from '@/lib/axios';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { NeedProfileCard } from '../user-posts/need-profile-card';
import { Flex } from '@revolancer/ui/layout';
import { H5 } from '@revolancer/ui/text';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { skeletonNeedsArray } from '../skeletons/needs-profile-card';

export const NeedsSegment = ({
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
      .get(`need/for_user/${uid}`, {
        id: `user-needs-${uid}`,
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
      <NeedProfileCard data={post} own={own} key={post?.id ?? ''} />,
    );
  }

  if (loading)
    return (
      <Flex column gap={4}>
        <SkeletonText type="h5" css={{ width: '50%' }} />
        <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1200: 2 }}>
          <Masonry gutter="0.8rem">{skeletonNeedsArray()}</Masonry>
        </ResponsiveMasonry>
      </Flex>
    );

  return own || staticPosts.length > 0 ? (
    <Flex column gap={4}>
      <H5>{name != '' ? `${name}'s` : 'My'} Needs</H5>
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1200: 2 }}>
        <Masonry gutter="0.8rem">
          {own && <NeedProfileCard placeholder />}
          {staticPosts}
        </Masonry>
      </ResponsiveMasonry>
    </Flex>
  ) : (
    <></>
  );
};
