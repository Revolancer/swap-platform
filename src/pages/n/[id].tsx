import { PrimaryLayout } from '@/components/layout/layouts';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Title } from '@/components/head/title';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PostData, Proposal, UserProfileData } from '@/lib/types';
import Blocks from 'editorjs-blocks-react-renderer';
import { Tags } from '@/components/user-posts/tags';
import { Author } from '@/components/user-posts/author';
import store from '@/redux/store';
import FourOhFour from '../404';
import { DateTime } from 'luxon';
import { cleanBlockData } from '@/components/user-posts/styledblockscontainer';
import { Masonry } from 'masonic';
import { ProposalCard } from '@/components/need/proposal-card';
import { ProposalDialogWrap } from '@/components/need/proposal-dialog-wrap';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { StyledBlocksContainer, Flex, FullWidth } from '@revolancer/ui/layout';
import { H1, H3, H5, P } from '@revolancer/ui/text';
import { Header } from '@/lib/editorjs/renderer/header';
import { Table } from '@/lib/editorjs/renderer/table';
import { Text } from '@/lib/editorjs/renderer/text';
import { List } from '@/lib/editorjs/renderer/list';

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [postData, setPostData] = useState<PostData>();
  const [own, setOwn] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isNotFound, setNotFound] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [profile, setProfile] = useState<UserProfileData>({});

  useEffect(() => {
    const getUserProfileData = async () => {
      if (id != null) {
        await axiosPublic
          .get(`need/${id}`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if ((response?.data?.id ?? '') == '') {
                setNotFound(true);
              }
              const now = DateTime.now();
              const unpublish = DateTime.fromISO(response?.data?.unpublish_at);
              if (unpublish && now > unpublish) {
                setNotFound(true);
              }
              setPostData(response.data);
              const self = store?.getState()?.userData?.user?.id ?? 'guest';
              if ((response.data?.user?.id ?? '') == self) {
                setOwn(true);
              }
              axiosPublic
                .get(`user/profile/by_id/${response.data?.user?.id}`)
                .then((response) => setProfile(response.data ?? {}))
                .catch(() => setProfile({}));
              setHasLoaded(true);
            }
          })
          .catch((err) => setNotFound(true));
      }
    };
    const getProposals = async () => {
      if (id != null) {
        await axiosPrivate
          .get(`need/proposals/${id}`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if ((response?.data?.length ?? 0) > 0) {
                setProposals(response.data);
                console.log(response.data);
              }
            }
          })
          .catch((err) => {});
      }
    };
    getUserProfileData();
    getProposals();
  }, [id]);

  if (isNotFound) {
    return <FourOhFour />;
  }

  return (
    <>
      <Title>{postData?.title ? postData?.title : 'Need'}</Title>
      <PrimaryLayout>
        <CrumbBar>
          {!hasLoaded && <Crumb href="/">Discovery</Crumb>}
          {hasLoaded && !own && <Crumb href="/">Discovery</Crumb>}
          {hasLoaded && own && <Crumb href="/projects">Project Hub</Crumb>}
          {hasLoaded && own && <Crumb href="/projects/needs">My Needs</Crumb>}
          {hasLoaded && !own && (
            <Crumb href={`/u/${profile?.slug ?? ''}`}>
              {`${profile?.first_name} ${profile?.last_name}`}
            </Crumb>
          )}
          {hasLoaded && (
            <Crumb href={`/n/${id}`} active>
              {postData?.title ?? 'Loading...'}
            </Crumb>
          )}
        </CrumbBar>
        <FullWidth>
          <Flex column gap={3}>
            {postData?.title && <H3>I Need...</H3>}
            <H1>{postData?.title ?? 'Loading...'}</H1>
            {postData?.user && <Author uid={postData.user?.id ?? ''} />}
            {postData?.tags && <Tags tags={postData.tags} />}
            {postData?.unpublish_at && (
              <P css={{ color: '$neutral600' }}>
                Respond by{' '}
                {DateTime.fromISO(postData.unpublish_at).toFormat(
                  'cccc, LLLL d',
                )}
              </P>
            )}
            {postData?.id && <ProposalDialogWrap id={postData.id} />}
            {postData?.data && (
              <StyledBlocksContainer>
                <Blocks
                  data={cleanBlockData(postData.data)}
                  renderers={{
                    paragraph: Text,
                    header: Header,
                    list: List,
                    table: Table,
                  }}
                />
              </StyledBlocksContainer>
            )}
            {own && <P css={{ color: '$neutral600' }}></P>}
          </Flex>
          <H5>Proposals</H5>
          {proposals.length > 0 ? (
            <Masonry
              items={proposals}
              render={ProposalCard}
              columnGutter={16}
              maxColumnCount={3}
            />
          ) : own ? (
            <P>There are no proposals yet</P>
          ) : (
            <P>You haven&rsquo;t submitted a proposal yet</P>
          )}
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
