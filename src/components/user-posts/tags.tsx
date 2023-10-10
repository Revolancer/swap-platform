import { Tag } from '@/lib/types';
import { TagElement } from '../tags';
import { Flex } from '@revolancer/ui/layout';
import { useState } from 'react';
import { styled } from '@revolancer/ui';
import { TertiaryFormButton } from '@revolancer/ui/buttons';

export const Tags = ({
  tags = [],
  expander = true,
}: {
  tags: Tag[];
  expander?: boolean;
}) => {
  const [expand, setExpand] = useState(false);

  const TagContainer = styled('div', {
    color: '$pink500',
    padding: '$1 $4',
    borderRadius: '100px',
    background: '$pink100',
  });

  const renderTags = tags.map((tag, idx) => {
    if (idx < 4) {
      return <TagElement tag={tag} key={tag.id} />;
    } else {
      return expand && <TagElement tag={tag} key={tag.id} />;
    }
  });
  const showExpander = expander && !expand && tags.length > 5;
  return (
    <>
      <Flex wrap>
        {renderTags}
        {showExpander && (
          <TertiaryFormButton onClick={() => setExpand(true)}>
            <TagContainer>+{tags.length - 4}</TagContainer>
          </TertiaryFormButton>
        )}
      </Flex>
      {expand && (
        <TertiaryFormButton onClick={() => setExpand(false)}>
          Show Less
        </TertiaryFormButton>
      )}
    </>
  );
};
