import { Tag } from '@/lib/types';
import { styled } from '@revolancer/ui';

const TagContainer = styled('div', {
  color: '$pink500',
  padding: '$1 $4',
  borderRadius: '100px',
  background: '$pink100',
});

export const TagElement = ({ tag }: { tag: Tag }) => {
  return <TagContainer key={tag.id}>{tag.text}</TagContainer>;
};
