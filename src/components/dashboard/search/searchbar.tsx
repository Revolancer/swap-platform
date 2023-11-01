import { Flex } from '@revolancer/ui/layout';
import { FilterSegment } from './filtersegment';
import { SearchSegment } from './searchsegment';
import { SortSegment } from './sortsegment';

export const SearchBar = ({ onSearch }: { onSearch: () => void }) => {
  return (
    <Flex
      gap={6}
      column
      css={{ alignItems: 'center', '@md': { flexDirection: 'row' } }}
    >
      <Flex css={{ width: '100%', '@md': { width: '60%' } }}>
        <SearchSegment onSearch={onSearch} />
      </Flex>
      <Flex
        css={{ width: '100%', alignItems: 'center', '@md': { width: '40%' } }}
      >
        <Flex css={{ width: '50%' }}>
          <SortSegment onSearch={onSearch} />
        </Flex>
        <Flex css={{ width: '50%' }}>
          <FilterSegment onSearch={onSearch} />
        </Flex>
      </Flex>
    </Flex>
  );
};
