import { Div } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';

export const ThreadSkeleton = () => (
  <>
    <Div css={{ flexGrow: '1', overflowY: 'auto' }}>
      {Array(3).fill(<SkeletonText type="p" css={{ marginTop: '$3' }} />)}
      <SkeletonText type="p" css={{ marginTop: '$3', width: '33%' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '0.1rem' }}></div>
      </div>
    </Div>
  </>
);
