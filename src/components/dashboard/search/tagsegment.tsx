import { useAppDispatch, useAppSelector } from '@/redux/store';
import { TertiaryFormButton } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { clearTags, removeTag } from './reducer';
import { styled } from '@revolancer/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export const TagSegment = () => {
  const tags = useAppSelector((state) => state.feedFilters.tags);
  const dispatch = useAppDispatch();

  const TagContainer = styled('div', {
    color: '$pink500',
    padding: '$1 $4',
    borderRadius: '100px',
    background: '$pink100',
  });

  const renderTags = tags.map((tag) => (
    <TagContainer key={tag.id}>
      {tag.text}
      <TertiaryFormButton
        onClick={() => dispatch(removeTag(tag.id))}
        css={{ marginLeft: '$3', color: '$pink500' }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </TertiaryFormButton>
    </TagContainer>
  ));

  return (
    tags.length > 0 && (
      <Flex column css={{ justifyContent: 'center', marginBottom: '$8' }}>
        <Flex css={{ justifyContent: 'space-between' }}>
          <P>Search results for:</P>
          <TertiaryFormButton onClick={() => dispatch(clearTags())}>
            Clear All
          </TertiaryFormButton>
        </Flex>
        <Flex wrap>{renderTags}</Flex>
      </Flex>
    )
  );
};
