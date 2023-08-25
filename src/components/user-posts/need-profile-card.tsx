import { PostData } from '@/lib/types';
import { OutputData } from '@editorjs/editorjs';
import { Tags } from './tags';
import { Button, TertiaryButton, UnstyledLink } from '@revolancer/ui/buttons';
import { Author } from './author';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/lib/axios';
import { useRouter } from 'next/router';
import { ConfirmationDialog } from '../navigation/confirmation-dialog';
import { styled } from '@revolancer/ui';
import { ProposalDialogWrap } from '../need/proposal-dialog-wrap';
import { P } from '@revolancer/ui/text';
import { Flex, Card } from '@revolancer/ui/layout';

export const NeedProfileCard = ({
  data,
  own = false,
  placeholder = false,
  withAuthor = false,
}: {
  data?: PostData;
  own?: boolean;
  placeholder?: boolean;
  withAuthor?: boolean;
}) => {
  const router = useRouter();
  const [proposalCount, setProposalCount] = useState(0);
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
    if (data?.id) {
      axiosPrivate
        .get(`need/proposals/count/${data.id}`)
        .then((res) => res.data)
        .then((count) => setProposalCount(count))
        .catch((err) => {});
      const getSummary = (data: OutputData): string => {
        const maxLength = 200;
        if (placeholder) return '';
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
      setLoading(false);
    }
  }, [data, placeholder]);

  const deleteNeed = () => {
    if (data?.id) {
      axiosPrivate.delete(`need/${data.id}`).then(() => router.reload());
    }
  };

  const PostImageContainer = styled('div', {
    backgroundColor: '$neutral300',
    overflow: 'hidden',
    width: `100%`,
    height: `200px`,
  });

  if (loading && !placeholder) {
    return (
      <Card unpadded>
        <PostImageContainer />
      </Card>
    );
  }

  return (
    <Card unpadded>
      <Flex column gap={4} css={{ padding: '$6' }}>
        {placeholder ? (
          <>
            <P css={{ fontWeight: '$bold' }}>Add a need</P>
            <P>
              Do you need to outsource some work? Share your project with the
              community and get help.
            </P>
            <Button href="/need/new">Add</Button>
          </>
        ) : (
          <>
            {data?.id && (
              <UnstyledLink href={`/n/${data.id}`}>
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
            {withAuthor && data?.user?.id && <Author uid={data.user.id} />}
            <Tags tags={data?.tags ?? []} />
            {summary.length > 0 && (
              <P css={{ color: '$neutral600' }}>{summary}</P>
            )}
            {data?.id && (
              <Flex gap={6} css={{ alignItems: 'center' }}>
                <ProposalDialogWrap id={data.id} />
                {own && (
                  <>
                    <Button href={`/n/${data.id}`}>
                      View Proposals ({proposalCount})
                    </Button>
                    <ConfirmationDialog
                      dangerous
                      onAccept={deleteNeed}
                      label="Delete"
                      title="Deleting A Need"
                      labelAccept="Delete"
                    />
                  </>
                )}
                {!own && (
                  <>
                    <TertiaryButton href={`/n/${data.id}`}>
                      Read More
                    </TertiaryButton>
                  </>
                )}
              </Flex>
            )}
          </>
        )}
      </Flex>
    </Card>
  );
};
