import { PostData } from '@/lib/types';
import { OutputData } from '@editorjs/editorjs';
import { Tags } from './tags';
import { Button, TertiaryButton, UnstyledLink } from '@revolancer/ui/buttons';
import { styled } from '@revolancer/ui';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { Author } from './author';
import { useEffect, useState } from 'react';
import { ConfirmationDialog } from '../navigation/confirmation-dialog';
import { axiosPrivate } from '@/lib/axios';
import { useRouter } from 'next/router';
import axios from 'axios';
import { P } from '@revolancer/ui/text';
import { Flex, Card, Div } from '@revolancer/ui/layout';
import { stringToJSX } from '@/lib/editorjs/renderer/util';
import { PortfoliosSkeleton } from '../skeletons/portfolio-profile-card';

export const PortfolioCardForAdmin = ({
  data,
  withAuthor = false,
  hideIfEmpty = false,
  select,
}: {
  data?: PostData;
  withAuthor?: boolean;
  hideIfEmpty?: boolean;
  select: () => void;
}) => {
  const [firstImage, setFirstImage] = useState<string>();
  const [imageUnoptimised, setImageUnoptimised] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const cleanData = () => {
      try {
        return JSON.parse(data?.data ?? '{}')?.version ?? false
          ? JSON.parse(data?.data ?? '{}')
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
    };
    const getVimeoThumbnail = async (url: string): Promise<string> => {
      const id = url.replace('https://vimeo.com/', '').split('?')[0];
      return await axios
        .get(`https://vimeo.com/api/v2/video/${id}.json`)
        .then((res) => res.data)
        .then((data) => data[0]?.thumbnail_large ?? '')
        .catch(() => '');
    };

    const getYoutubeThumbnail = (url: string): string => {
      const id = url
        .replace('https://www.youtube.com/embed/', '')
        .split('?')[0];
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    };

    const getFirstImage = async (data: OutputData) => {
      for (const block of data.blocks) {
        if (block.type == 'image') {
          setFirstImage(block.data.file.url);
          return;
        }
        if (block.type == 'embed') {
          if (block.data.service == 'vimeo') {
            setFirstImage(await getVimeoThumbnail(block.data.source));
            setImageUnoptimised(true);
            return;
          }
          if (block.data.service == 'youtube') {
            setFirstImage(await getYoutubeThumbnail(block.data.embed));
            setImageUnoptimised(true);
            return;
          }
        }
      }
    };
    getFirstImage(cleanData());
    const getSummary = (data: OutputData): string => {
      const maxLength = 200;
      let summary = '';
      if (data.blocks.length) {
        setHasContent(true);
      }
      for (const block of data.blocks) {
        if (summary.length >= maxLength) {
          return summary;
        }
        if (block.type == 'paragraph') {
          if (summary.length) {
            summary += ' ';
          }
          const lengthToAdd = maxLength - summary.length;
          summary += (block.data.text as string)
            .substring(0, maxLength - summary.length)
            .replace(/(<([^>]+)>)/gi, '')
            .replace(/(&([^>]+);)/gi, '');
          if (lengthToAdd < (block.data.text as string).length) {
            summary += '...';
          }
        }
      }
      return summary;
    };
    setSummary(getSummary(cleanData()));
    setLoading(false);
  }, [data]);

  const PostImageContainer = styled('div', {
    backgroundColor: '$neutral300',
    overflow: 'hidden',
    width: `360px`,
    height: `200px`,
  });

  const PostImage = styled(Image, {
    objectFit: 'cover',
    width: '100%',
  });

  const router = useRouter();

  const deletePost = async () => {
    if (data) {
      await axiosPrivate.delete(`portfolio/${data.id}`).catch((err) => {});
    }
    router.reload();
  };

  if (loading) {
    return <PortfoliosSkeleton withAuthor={withAuthor} />;
  }

  if (hideIfEmpty && !hasContent) {
    return <></>;
  }
  return (
    <Card css={{ maxWidth: 'max-content' }} unpadded>
      {firstImage && (
        <PostImageContainer>
          {firstImage && hasContent && data?.id && (
            <UnstyledLink href={`/p/${data.id}`}>
              <PostImage
                src={firstImage}
                alt="Cover Image for this post"
                width={360}
                height={200}
                unoptimized={imageUnoptimised}
              />
            </UnstyledLink>
          )}
        </PostImageContainer>
      )}
      <Flex column gap={4} css={{ padding: '$6' }}>
        <>
          {hasContent && data?.id && (
            <UnstyledLink href={`/p/${data.id}`}>
              <P
                css={{
                  fontWeight: '$bold',
                  fontSize: '$body1',
                  lineHeight: '$body1',
                }}
              >
                {data?.title}
              </P>
            </UnstyledLink>
          )}
          {!hasContent && <P css={{ fontWeight: '$bold' }}>{data?.title}</P>}
          {withAuthor && data?.user?.id && <Author uid={data.user.id} />}
          <Div css={{ maxWidth: '300px' }}>
            <Tags tags={data?.tags ?? []} />
          </Div>
          {summary.length > 0 && (
            <P css={{ color: '$neutral600' }}>{stringToJSX(summary)}</P>
          )}
          <Flex gap={6} css={{ alignItems: 'center' }}>
            {hasContent && data?.id && (
              <Button
                href="#"
                role="primary"
                onClick={(e) => {
                  e.preventDefault();
                  select();
                }}
              >
                View
              </Button>
            )}
          </Flex>
        </>
      </Flex>
    </Card>
  );
};
