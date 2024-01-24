import { PrimaryLayout } from '@/components/layout/layouts';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Title } from '@/components/head/title';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { PostData, UserProfileData } from '@/lib/types';
import Blocks from 'editorjs-blocks-react-renderer';
import { Tags } from '@/components/user-posts/tags';
import { Author } from '@/components/user-posts/author';
import { styled } from '@revolancer/ui';
import store from '@/redux/store';
import { Button, FormButton } from '@revolancer/ui/buttons';
import FourOhFour from '../404';
import { ConfirmationDialog } from '@/components/navigation/confirmation-dialog';
import { FullWidth, Flex } from '@revolancer/ui/layout';
import { H1 } from '@revolancer/ui/text';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { Header } from '@/lib/editorjs/renderer/header';
import { Table } from '@/lib/editorjs/renderer/table';
import { Text } from '@/lib/editorjs/renderer/text';
import { List } from '@/lib/editorjs/renderer/list';
import { SkeletonText } from '@revolancer/ui/skeleton';

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [postData, setPostData] = useState<PostData>();
  const [own, setOwn] = useState(false);
  const [isNotFound, setNotFound] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfileData = async () => {
      if (id != null) {
        await axiosPublic
          .get(`portfolio/${id}`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if ((response?.data?.id ?? '') == '') {
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
            }
          })
          .catch((err) => setNotFound(true));
      }
    };
    getUserProfileData();
    setLoading(false);
  }, [id]);

  const cleanData = useMemo(() => {
    try {
      return JSON.parse(postData?.data ?? '{}')?.version ?? false
        ? JSON.parse(postData?.data ?? '{}')
        : {
            time: 1682956618189,
            blocks: [],
            version: '2.26.5',
          };
    } catch (err) {
      return {
        time: 1682956618189,
        blocks: [],
        version: '2.26.5',
      };
    }
  }, [postData]);

  const imageStyles = {
    '& figure': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '$2',
      gap: '$5',
      '& img': {
        overflow: 'hidden',
        borderRadius: '$2',
        width: '75%',
      },
    },
    '& .image-block--stretched': {
      '& img': { width: '100%' },
    },
    '& .image-block--with-border': {
      '& img': {
        border: '2px solid $neutral400',
      },
    },
    '& .image-block--with-background': {
      backgroundColor: '$neutral400',
      '& img': { margin: '$5 0 0' },
      '& figcaption': {
        color: '$neutral800',
      },
    },
    '& figcaption': {
      color: '$neutral700',
      fontSize: '$body2',
      textAlign: 'center',
    },
  };

  const tableStyles = {
    '& table': {
      width: '100%',
      borderSpacing: '0',
      borderCollapse: 'separate',
      overflow: 'hidden',
    },
    '& th, td': {
      border: '1px solid $neutral400',
      textAlign: 'start',
      padding: '$4',
    },
    '& th': {
      backgroundColor: '$neutral200',
    },
    '& tr:first-child th:first-child': {
      borderTopLeftRadius: '$2',
    },
    '& tr:first-child th:last-child': {
      borderTopRightRadius: '$2',
    },
    '& tr:last-child td:first-child': {
      borderBottomLeftRadius: '$2',
    },
    '& tr:last-child td:last-child': {
      borderBottomRightRadius: '$2',
    },
  };

  const codeStyles = {
    '& pre': {
      backgroundColor: '$neutral800',
      color: '$neutral100',
      padding: '$5',
      borderRadius: '$2',
      overflowX: 'scroll',
    },
  };

  const quoteStyles = {
    '& blockquote': {
      backgroundColor: '$neutral100',
      border: '1px solid $neutral400',
      borderRadius: '$2',
      boxShadow: '$2',
      padding: '$5',
      quotes: '“”‘’',
    },
    '& blockquote:before': {
      color: '$neutral900',
      content: 'open-quote',
      fontSize: '4em',
      lineHeight: '0.1em',
      marginRight: '0.25em',
      verticalAlign: '-0.4em',
    },
    '& blockquote p': {
      display: 'inline',
      color: '$neutral900',
    },
    '& blockquote footer': {
      textAlign: 'end',
      fontSize: '$body2',
      color: '$neutral700',
    },
  };

  const StyledBlocksContainer = styled('div', {
    fontSize: '$body1',
    lineHeight: '$body1',
    display: 'flex',
    flexDirection: 'column',
    gap: '$5',
    ...imageStyles,
    ...tableStyles,
    ...codeStyles,
    ...quoteStyles,
    '& iframe': {
      display: 'block',
      width: '100%',
      maxHeight: '560px',
      marginInline: 'auto',
    },
  });
  if (isNotFound) {
    return <FourOhFour />;
  }

  const deletePost = () => {
    axiosPrivate.delete(`portfolio/${postData?.id}`).catch((err) => {});
    router.push('/u/profile');
  };

  const Skeleton = () => (
    <>
      <SkeletonText type="h1" css={{ width: '66%' }} />
      <Flex css={{ alignItems: 'center' }}>
        {/*<RoundedSquareImage loading size="small" />*/}
        <SkeletonText
          css={{
            width: '$9',
            height: '$9',
            borderRadius: '$2',
          }}
        />
        <SkeletonText type="p" css={{ width: '20%' }} />
      </Flex>
      <Flex>
        {Array(4)
          .fill(null)
          .map((item, idx) => (
            <SkeletonText type="tag" key={`tag-${idx}`} />
          ))}
      </Flex>
      <StyledBlocksContainer>
        {Array(2)
          .fill(null)
          .map((item, idx) => (
            <SkeletonText type="p" key={`p-${idx}`} css={{ marginTop: '$2' }} />
          ))}
        <SkeletonText type="p" css={{ marginTop: '$2', width: '33%' }} />
        <SkeletonText type="image" />
        {Array(3)
          .fill(null)
          .map((item, idx) => (
            <SkeletonText type="p" key={`p-${idx}`} css={{ marginTop: '$2' }} />
          ))}
        <SkeletonText type="p" css={{ marginTop: '$2', width: '33%' }} />
      </StyledBlocksContainer>
    </>
  );

  const MainContent = () => (
    <>
      <H1>{postData?.title ?? 'Loading...'}</H1>
      {postData?.user && (
        <Author
          uid={postData.user?.id ?? ''}
          hasDate={postData?.published_at as string}
        />
      )}
      {postData?.tags && <Tags tags={postData.tags} />}
      {own && postData?.id && (
        <Flex css={{ padding: '$3 0 $5' }}>
          <Button
            role="secondary"
            href={`/portfolio/${postData.id}`}
            loading={loading}
          >
            Edit
          </Button>
          <ConfirmationDialog
            dangerous
            onAccept={deletePost}
            label="Delete"
            title="Deleting Portfolio Article"
            labelAccept="Delete"
          />
        </Flex>
      )}
      {postData?.data && (
        <StyledBlocksContainer>
          <Blocks
            data={cleanData}
            renderers={{
              paragraph: Text,
              header: Header,
              list: List,
              table: Table,
            }}
          />
        </StyledBlocksContainer>
      )}
    </>
  );

  return (
    <>
      <Title>{postData?.title ? postData?.title : 'Portfolio Post'}</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/">Discovery</Crumb>
          {!!profile && (
            <Crumb href={`/u/${profile?.slug ?? ''}`}>
              {`${profile?.first_name} ${profile?.last_name}`}
            </Crumb>
          )}
          {!!postData && (
            <Crumb href={`/p/${id}`} active>
              {postData?.title ?? 'Loading...'}
            </Crumb>
          )}
        </CrumbBar>
        <FullWidth>
          <Flex column gap={3} css={{ margin: '0 auto', maxWidth: '800px' }}>
            {!loading && postData ? <MainContent /> : <Skeleton />}
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
