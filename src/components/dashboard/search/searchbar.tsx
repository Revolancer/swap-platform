import { Flex } from '@revolancer/ui/layout';
import { FilterSegment } from './filtersegment';
import { SearchSegment } from './searchsegment';
import { SortSegment } from './sortsegment';
import { TagSegment } from './tagsegment';

export const SearchBar = () => {
  return (
    <>
      <Flex
        gap={6}
        column
        css={{ alignItems: 'center', '@md': { flexDirection: 'row' } }}
      >
        <Flex css={{ width: '100%', '@md': { width: '60%' } }}>
          <SearchSegment />
        </Flex>
        <Flex
          gap={6}
          css={{ width: '100%', alignItems: 'center', '@md': { width: '40%' } }}
        >
          <Flex css={{ width: '50%' }}>
            <FilterSegment />
          </Flex>
          <Flex css={{ width: '50%' }}>
            <SortSegment />
          </Flex>
        </Flex>
      </Flex>
      <TagSegment />
    </>
  );
};
