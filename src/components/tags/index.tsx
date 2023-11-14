import { Tag } from '@/lib/types';
import { useAppDispatch } from '@/redux/store';
import { styled } from '@revolancer/ui';
import { UnstyledLink } from '@revolancer/ui/buttons';
import { addTag } from '../dashboard/search/reducer';

const TagContainer = styled('div', {
  color: '$pink500',
  padding: '$1 $4',
  borderRadius: '100px',
  background: '$pink100',
});

export const TagElement = ({ tag }: { tag: Tag }) => {
  const dispatch = useAppDispatch();
  return (
    <TagContainer key={tag.id}>
      <UnstyledLink href="/" onClick={() => dispatch(addTag(tag.id))}>
        {tag.text}
      </UnstyledLink>
    </TagContainer>
  );
};
