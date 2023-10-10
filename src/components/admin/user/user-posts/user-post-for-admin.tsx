import { ProposalCardForAdmin } from '@/components/need/proposal-card-for-admin';
import { Tags } from '@/components/user-posts/tags';
import { axiosPrivate } from '@/lib/axios';
import { PostData, Proposal } from '@/lib/types';
import { OutputData } from '@editorjs/editorjs';
import { Button, UnstyledLink } from '@revolancer/ui/buttons';
import { Div, Flex } from '@revolancer/ui/layout';
import { H4, P } from '@revolancer/ui/text';
import { Masonry } from 'masonic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const UserPostForAdmin = ({
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
  useEffect(() => {
    const getProposals = async () => {
      if (uid != null) {
        await axiosPrivate
          .get(`/admin/user/${uid}/needs/${post.id}/proposals`)
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

    getProposals();

    const cleanData = () => {
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
    };
    if (post?.id) {
      const getSummary = (data: OutputData): string => {
        const maxLength = 200;
        let summary = '';
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
    }
  }, [post, uid]);

  const deleteNeed = () => {
    if (post?.id) {
      axiosPrivate
        .delete(`admin/user/${uid}/needs/${post?.id}`)
        .then(() => router.reload());
    }
  };

  return (
    <Flex column>
      <Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0 0 $5 0',
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
            deleteNeed();
          }}
        >
          Delete
        </Button>
      </Flex>
      {post?.id && (
        <UnstyledLink href={`/n/${post.id}`}>
          <P
            css={{
              fontWeight: '$bold',
              fontSize: '$body1',
              lineHeight: '$body1',
            }}
          >
            {post?.title}
          </P>
        </UnstyledLink>
      )}
      <Tags tags={post?.tags ?? []} />
      {summary.length > 0 && <P css={{ color: '$neutral600' }}>{summary}</P>}
      <H4>Bids</H4>
      <P css={{ color: '$neutral600' }}>Review candidates’ offers</P>
      {proposals.length > 0 ? (
        <Masonry
          items={proposals}
          render={ProposalCardForAdmin}
          columnGutter={16}
          maxColumnCount={3}
        />
      ) : (
        <P>There are no proposals yet</P>
      )}
    </Flex>
  );
};

export default UserPostForAdmin;
