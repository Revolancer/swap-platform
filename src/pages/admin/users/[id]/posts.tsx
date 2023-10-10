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
import { PortfolioCardForAdmin } from '@/components/user-posts/portfolio-card-for-admin';
import UserPortfolioForAdmin from '@/components/admin/user/user-posts/user-portfolio-for-admin';

export default function ManageUserPosts() {
  const [profile, setProfile] = useState<UserProfileData>();
  const router = useRouter();
  const { id } = router.query;
  const [posts, setPosts] = useState<PostData[]>();
  const [portfolios, setPortfolios] = useState<PostData[]>([]);
  const [own, setOwn] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isNotFound, setNotFound] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState<PostData | undefined>(
    undefined,
  );

  const [selectedPortfolio, setSelectedPortfolio] = useState<
    PostData | undefined
  >(undefined);

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
        await axiosPrivate
          .get(`/admin/user/${id}/portfolios`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if (response?.data?.length) {
                setNotFound(true);
              }
              setPortfolios(response.data);
              setHasLoaded(true);
            }
          })
          .catch((err) => setNotFound(true));
      }
    };

    getUserProfileData();
  }, [id]);

  const staticPosts = [];
  const staticPortfolios = [];

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

  if (portfolios) {
    for (const p of portfolios) {
      staticPortfolios.push(
        <PortfolioCardForAdmin
          data={p}
          key={p?.id ?? ''}
          select={() => setSelectedPortfolio(p)}
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
        {selectedPortfolio && (
          <UserPortfolioForAdmin
            post={selectedPortfolio}
            back={() => setSelectedPortfolio(undefined)}
            uid={typeof id != 'string' ? '' : id}
          />
        )}
        {selectedPortfolio == undefined && selectedNeed == undefined && (
          <Div>
            <H3>NEEDS</H3>
            <P css={{ color: '$neutral600' }}>View and edit user’s needs</P>
            <Flex wrap>{staticPosts}</Flex>
            <H3 css={{ margin: '$5 0 $3 0' }}>PORTFOLIO POSTS</H3>
            <P css={{ color: '$neutral600' }}>
              View and edit user’s portfolio posts
            </P>
            <Flex wrap>{staticPortfolios}</Flex>
          </Div>
        )}
      </FullWidth>
    </ManageUserLayout>
  );
}
