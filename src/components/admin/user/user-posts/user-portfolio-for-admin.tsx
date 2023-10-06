import { Author } from '@/components/user-posts/author';
import { Tags } from '@/components/user-posts/tags';
import { axiosPrivate } from '@/lib/axios';
import { Header } from '@/lib/editorjs/renderer/header';
import { List } from '@/lib/editorjs/renderer/list';
import { Table } from '@/lib/editorjs/renderer/table';
import { Text } from '@/lib/editorjs/renderer/text';
import { PostData, Proposal } from '@/lib/types';
import { OutputData } from '@editorjs/editorjs';
import { styled } from '@revolancer/ui';
import { Button, UnstyledLink } from '@revolancer/ui/buttons';
import { Div, Flex } from '@revolancer/ui/layout';
import { H3, H4, P } from '@revolancer/ui/text';
import axios from 'axios';
import Blocks from 'editorjs-blocks-react-renderer';
import { DateTime } from 'luxon';
import { Masonry } from 'masonic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

const PostImage = styled(Image, {
  objectFit: 'cover',
  width: '100%',
  borderRadius: '$3',
});

const UserPortfolioForAdmin = ({
  post,
  back,
  uid,
}: {
  post: PostData;
  back: () => void;
  uid: string;
}) => {
  const router = useRouter();
  const [summary, setSummary] = useState('');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [firstImage, setFirstImage] = useState('');

  const getVimeoThumbnail = async (url: string): Promise<string> => {
    const id = url.replace('https://vimeo.com/', '').split('?')[0];
    return await axios
      .get(`https://vimeo.com/api/v2/video/${id}.json`)
      .then((res) => res.data)
      .then((data) => data[0]?.thumbnail_large ?? '')
      .catch(() => '');
  };

  const getYoutubeThumbnail = (url: string): string => {
    const id = url.replace('https://www.youtube.com/embed/', '').split('?')[0];
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  };

  const cleanData = useMemo(() => {
    try {
      return JSON.parse(post?.data ?? '{}')?.version ?? false
        ? JSON.parse(post?.data ?? '{}')
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
  }, [post]);

  useEffect(() => {
    const getFirstImage = async (data: OutputData) => {
      for (const block of data.blocks) {
        if (block.type == 'image') {
          setFirstImage(block.data.file.url);
          return;
        }
        if (block.type == 'embed') {
          if (block.data.service == 'vimeo') {
            setFirstImage(await getVimeoThumbnail(block.data.source));
            return;
          }
          if (block.data.service == 'youtube') {
            setFirstImage(await getYoutubeThumbnail(block.data.embed));
            return;
          }
        }
      }
    };

    getFirstImage(cleanData);
  }, [cleanData, post.data]);

  const StyledBlocksContainer = styled('div', {
    width: '100%',
    maxWidth: '800px',
    marginInline: 'auto',
    fontSize: '$body1',
    lineHeight: '$body1',
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
    '& .image-block--stretched': {
      '& img': {
        width: '100%',
      },
    },
    '& figcaption': {
      color: '$neutral700',
      fontStyle: 'italic',
      textAlign: 'end',
    },
    '& table': {
      width: '100%',
      borderSpacing: '0',
      borderCollapse: 'collapse',
    },
    '& th': {
      border: '1px solid black',
      textAlign: 'center',
    },
    '& td': {
      border: '1px solid black',
      textAlign: 'center',
    },
    '& pre': {
      backgroundColor: '$neutral800',
      color: '$neutral100',
      padding: '$3',
    },
    '& blockquote': {
      background: '$neutral100',
      borderLeft: '10px solid $neutral600',
      marginInline: '10px',
      padding: '0.5em 10px',
      quotes: '“”‘’',
    },
    '& blockquote:before': {
      color: '$neutral800',
      content: 'open-quote',
      fontSize: '4em',
      lineHeight: '0.1em',
      marginRight: '0.25em',
      verticalAlign: '-0.4em',
    },
    '& blockquote p': {
      display: 'inline',
    },
    '& iframe': {
      display: 'block',
      width: '100%',
      maxHeight: '560px',
      marginInline: 'auto',
    },
  });

  const deletePortfolio = () => {
    if (post?.id) {
      axiosPrivate
        .delete(`admin/user/${uid}/portfolio/${post?.id}`)
        .then(() => router.reload());
    }
  };

  return (
    <Flex column>
      <Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '$5',
        }}
      >
        <Button
          href="#"
          role="secondary"
          onClick={(e) => {
            e.preventDefault();
            back();
          }}
        >
          Go back
        </Button>
        <Button
          href="#"
          role="dangerous"
          onClick={(e) => {
            e.preventDefault();
            deletePortfolio();
          }}
        >
          Delete
        </Button>
      </Flex>
      {firstImage && (
        <Div css={{ width: '100%' }}>
          <PostImage
            src={firstImage}
            alt="Cover Image for this post"
            width={400}
            height={400}
          />
        </Div>
      )}
      {post?.id && (
        <UnstyledLink href={`/n/${post.id}`}>
          <H3
            css={{
              fontWeight: '$bold',
              fontSize: '$body1',
              lineHeight: '$body1',
            }}
          >
            {post?.title}
          </H3>
        </UnstyledLink>
      )}
      {post?.user?.id && <Author uid={post?.user?.id} />}
      <P css={{ color: '$neutral600' }}>
        {/* @ts-ignore */}
        {DateTime.fromISO(post?.published_at).toFormat('dd LLLL, yyyy')}
      </P>
      <Tags tags={post?.tags ?? []} />
      {post?.data && (
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
    </Flex>
  );
};

export default UserPortfolioForAdmin;
