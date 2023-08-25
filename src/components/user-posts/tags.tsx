import { Tag } from '@/lib/types';
import { TagElement } from '../tags';
import { Flex } from '@revolancer/ui/layout';

export const Tags = ({ tags = [] }: { tags: Tag[] }) => {
  const staticTags = [];
  for (const tag of tags) {
    staticTags.push(<TagElement tag={tag} key={tag.id} />);
  }
  return <Flex wrap>{staticTags}</Flex>;
};
