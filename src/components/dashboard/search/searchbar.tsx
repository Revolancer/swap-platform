import { Flex } from '@revolancer/ui/layout';
import { FilterSegment } from './filtersegment';
import { SearchSegment } from './searchsegment';
import { SortSegment } from './sortsegment';
import { TagSegment } from './tagsegment';
import { useState } from 'react';

export const SearchBar = () => {
  const [expand, setExpand] = useState<'filter' | 'sort' | false>(false);

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
            <FilterSegment expand={expand} setExpand={setExpand} />
          </Flex>
          <Flex css={{ width: '50%' }}>
            <SortSegment expand={expand} setExpand={setExpand} />
          </Flex>
        </Flex>
      </Flex>
      <TagSegment />
    </>
  );
};
