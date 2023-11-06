import { Order, Sort, SortType } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Flex } from '@revolancer/ui/layout';
import { useCallback, useState } from 'react';
import { setSort } from './reducer';
import {
  Dropdown,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownSeparator,
} from './dropdown';
import { FormButton, TertiaryFormButton } from '@revolancer/ui/buttons';

export const SortSegment = () => {
  const { sort, order } = useAppSelector((state) => state.feedFilters);
  const dispatch = useAppDispatch();

  const getSortOption = (sort: Sort, order: Order): SortType => {
    if (sort === 'relevance') return 'relevance';
    if (order === 'ASC') return 'oldest';
    return 'newest';
  };

  const [sortOption, setSortOption] = useState<SortType>(
    getSortOption(sort as Sort, order as Order) || 'newest',
  );

  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <Flex css={{ padding: '$7 0', height: '92px', width: '100%' }}>
      <Dropdown placeholder="Sort" open={expanded} onOpen={toggle}>
        <DropdownMenuRadioGroup
          value={sortOption}
          onValueChange={(value) => setSortOption(value)}
        >
          <DropdownMenuRadioItem value="newest">
            Newest to Oldest
          </DropdownMenuRadioItem>
          <DropdownSeparator light />
          <DropdownMenuRadioItem value="oldest">
            Oldest to Newest
          </DropdownMenuRadioItem>
          <DropdownSeparator light />
          <DropdownMenuRadioItem value="relevance">
            Most Relevant
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownSeparator />
        <Flex
          gap={4}
          css={{
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '$3 $5',
          }}
        >
          <TertiaryFormButton
            onClick={() => {
              setSortOption('newest');
              dispatch(setSort('newest'));
            }}
          >
            Clear All
          </TertiaryFormButton>
          <FormButton onClick={() => dispatch(setSort(sortOption))}>
            Apply
          </FormButton>
        </Flex>
      </Dropdown>
    </Flex>
  );
};
