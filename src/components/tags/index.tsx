import { Tag } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { styled } from '@revolancer/ui';
import { UnstyledLink } from '@revolancer/ui/buttons';
import { setTag } from '../dashboard/reducer';
import { useRouter } from 'next/router';

const TagContainer = styled('div', {
  color: '$pink500',
  padding: '$1 $4',
  borderRadius: '100px',
  background: '$pink100',
});

export const TagElement = ({ tag }: { tag: Tag }) => {
  const router = useRouter();
  const tags = useAppSelector((state) => state.feedFilters.tag);
  const dispatch = useAppDispatch();

  const handleClick = async (e: any) => {
    e.preventDefault();
    if (tags.some((a) => a.id === tag.id)) return;
    await dispatch(setTag(tag.id));
    await router.push(e.target.href);
  };

  return (
    <TagContainer key={tag.id}>
      <UnstyledLink href="/" onClick={handleClick}>
        {tag.text}
      </UnstyledLink>
    </TagContainer>
  );
};
