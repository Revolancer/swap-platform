import { PostData, Proposal, UserProfileData } from '@/lib/types';
// import FourOhFour from '@/pages/404';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ManageUserLayout from '@/components/admin/user/layout';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { DateTime } from 'luxon';
import FourOhFour from '@/pages/404';
import { Div, Flex, FullWidth } from '@revolancer/ui/layout';
import { H3, P } from '@revolancer/ui/text';
import { NeedProfileCard } from '@/components/user-posts/need-profile-card';
import { NeedProfileCardForAdmin } from '@/components/user-posts/need-profile-card-for-admin';
import UserPostForAdmin from '@/components/admin/user/user-posts/user-post-for-admin';

export default function ManageUserPosts() {
  const [profile, setProfile] = useState<UserProfileData>();
  const router = useRouter();
  const { id } = router.query;
  const [posts, setPosts] = useState<PostData[]>();
  const [own, setOwn] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isNotFound, setNotFound] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState<PostData | undefined>(
    undefined,
  );
  console.log(posts);

  useEffect(() => {
    const getUserProfileData = async () => {
      if (id != null) {
        await axiosPrivate
          .get(`/admin/user/${id}/needs`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if (response?.data?.length) {
                setNotFound(true);
              }
              setPosts(response.data);
              setHasLoaded(true);
            }
          })
          .catch((err) => setNotFound(true));
      }
    };

    getUserProfileData();
  }, [id]);

  const staticPosts = [];

  if (posts) {
    for (const post of posts) {
      staticPosts.push(
        <NeedProfileCardForAdmin
          data={post}
          key={post?.id ?? ''}
          select={() => setSelectedNeed(post)}
        />,
      );
    }
  }

  return (
    <ManageUserLayout>
      <FullWidth>
        {selectedNeed && (
          <UserPostForAdmin
            post={selectedNeed}
            back={() => setSelectedNeed(undefined)}
            uid={typeof id != 'string' ? '' : id}
          />
        )}
        {selectedNeed == undefined && (
          <Div>
            <H3>NEED</H3>
            <P css={{ color: '$neutral600' }}>View and edit user’s needs</P>
            <Flex wrap>{staticPosts}</Flex>
          </Div>
        )}
      </FullWidth>
    </ManageUserLayout>
  );
}
