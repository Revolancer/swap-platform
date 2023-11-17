import { Flex } from '@revolancer/ui/layout';
import { FilterSegment } from './filtersegment';
import { SearchSegment } from './searchsegment';
import { SortSegment } from './sortsegment';
import { TagSegment } from './tagsegment';

export const SearchBar = () => {
  return (
    <>
      <Flex
        column
        css={{
          padding: '$5 0',
          alignItems: 'center',
          '@md': { flexDirection: 'row', padding: '$5 0 $7' },
        }}
      >
        <Flex
          css={{
            paddingBottom: '$2',
            width: '100%',
            '@md': { paddingBottom: '0', width: '60%' },
          }}
        >
          <SearchSegment />
        </Flex>
        <Flex
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
