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

  if (portfolios) {
    for (const p of portfolios) {
      staticPosts.push(
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
        {selectedPortfolio && (
          <UserPortfolioForAdmin
            post={selectedPortfolio}
            back={() => setSelectedPortfolio(undefined)}
            uid={typeof id != 'string' ? '' : id}
          />
        )}
        {selectedPortfolio == undefined && selectedNeed == undefined && (
          <Div>
            <H3>PORTFOLIO POSTS</H3>
            <P css={{ color: '$neutral600' }}>
              View and edit user’s portfolio posts
            </P>
            <Flex wrap>{staticPosts}</Flex>
          </Div>
        )}
      </FullWidth>
    </ManageUserLayout>
  );
}
