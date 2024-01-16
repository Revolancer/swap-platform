import { Tag } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { styled } from '@revolancer/ui';
import { UnstyledLink } from '@revolancer/ui/buttons';
import { addTag, setTag } from '../dashboard/reducer';

const TagContainer = styled('div', {
  color: '$pink500',
  padding: '$1 $4',
  borderRadius: '100px',
  background: '$pink100',
});

export const TagElement = ({ tag }: { tag: Tag }) => {
  const tags = useAppSelector((state) => state.feedFilters.tag);
  const dispatch = useAppDispatch();
  return (
    <TagContainer key={tag.id}>
      <UnstyledLink
        href="/"
        onClick={() => {
          if (tags.some((id) => id === tag.id)) return;
          dispatch(addTag(tag.id));
        }}
      >
        {tag.text}
      </UnstyledLink>
    </TagContainer>
  );
};
