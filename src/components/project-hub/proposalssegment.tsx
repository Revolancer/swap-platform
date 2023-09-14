import { useCallback, useEffect, useState } from 'react';
import { Proposal } from '@/lib/types';
import { axiosPrivate } from '@/lib/axios';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { NeedProfileCard } from '../user-posts/need-profile-card';
import Image from 'next/image';
import { Button } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';
import { H5, P } from '@revolancer/ui/text';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { skeletonNeedsArray } from '../skeletons/needs-profile-card';

export const ProposalsSegment = ({ uid = '' }: { uid: string }) => {
  const [posts, setPosts] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPostsForUser = useCallback(async () => {
    axiosPrivate
      .get(`need/proposals/own`, {
        id: `user-proposals-own`,
      })
      .then((response) => {
        setLoading(false);
        setPosts(response.data ?? []);
      })
      .catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    if (uid != '') {
      loadPostsForUser();
    }
  }, [uid, loadPostsForUser]);

  const staticPosts = [];

  for (const post of posts) {
    staticPosts.push(
      <NeedProfileCard withAuthor data={post.need} key={post?.id ?? ''} />,
    );
  }

  if (loading)
    return (
      <Flex column gap={4}>
        <SkeletonText type="h5" css={{ width: '50%' }} />
        <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1200: 2 }}>
          <Masonry gutter="0.8rem">{skeletonNeedsArray(5, true)}</Masonry>
        </ResponsiveMasonry>
      </Flex>
    );

  return staticPosts.length > 0 ? (
    <Flex column gap={4}>
      <H5>My Proposals</H5>
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1200: 2 }}>
        <Masonry gutter="0.8rem">{staticPosts}</Masonry>
      </ResponsiveMasonry>
    </Flex>
  ) : (
    <>
      <Flex
        column
        gap={3}
        css={{ width: '100%', alignItems: 'center', marginBlock: '$8' }}
      >
        <P>You don&rsquo;t currently have any outgoing proposals</P>
        <Image
          src="/img/revy/happy.png"
          alt="Revy, happy to guide you back to safety"
          width={210}
          height={314}
        />
        <P>Get started by finding needs that match your skills</P>
        <Button href="/">Get Started</Button>
      </Flex>
    </>
  );
};
