import { Div, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { RoundedSquareImage } from '@revolancer/ui/user';

export const ThreadListEntrySkeleton = () => (
  <>
    <Div
      css={{
        paddingBlock: '$3',
        paddingInline: '$2',
      }}
    >
      <Div
        css={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '$4',
          alignItems: 'center',
        }}
      >
        <RoundedSquareImage loading size="medium" />
        <Flex column css={{ flexGrow: '1' }}>
          <Flex css={{ justifyContent: 'space-between' }}>
            <SkeletonText type="p" css={{ width: '75%' }} />
          </Flex>
          <SkeletonText
            type="p"
            css={{
              color: '$neutral600',
              textOverflow: 'ellipsis',
              width: '33%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          />
        </Flex>
      </Div>
    </Div>
  </>
);

export const threadListSkeleton = () =>
  Array(5).fill(<ThreadListEntrySkeleton />);
