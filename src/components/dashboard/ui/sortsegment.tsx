import { Order, Sort, SortType } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Flex } from '@revolancer/ui/layout';
import { useEffect, useState } from 'react';
import { resetField, setSort } from '../reducer';
import {
  Dropdown,
  DropdownGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownSeparator,
} from '@revolancer/ui/collapsible';
import { FormButton, TertiaryFormButton } from '@revolancer/ui/buttons';

export const SortSegment = ({
  expand,
  setExpand,
}: {
  expand: 'filter' | 'sort' | false;
  setExpand: (arg0: any) => void;
}) => {
  const { sort, order } = useAppSelector((state) => state.feedFilters);
  const dispatch = useAppDispatch();
  const mobileBP = window.innerWidth < 600;

  const getSortOption = (sort: Sort, order: Order): SortType => {
    if (sort === 'relevance') return 'relevance';
    if (order === 'ASC') return 'oldest';
    return 'newest';
  };

  const [sortOption, setSortOption] = useState<SortType>(
    getSortOption(sort as Sort, order as Order) || 'newest',
  );

  useEffect(() => {
    setSortOption(getSortOption(sort as Sort, order as Order));
  }, [sort, order]);

  const mobileExpanderStyle = {
    minWidth: '100vw',
    minHeight: '64vh',
    boxShadow: '$0',
    borderRadius: '$0',
    border: '$0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '$5',
  };

  return (
    <Flex css={{ width: '100%' }}>
      <Dropdown
        placeholder="Sort"
        open={expand === 'sort'}
        onOpen={() => {
          if (expand == 'sort') setExpand(false);
          else setExpand('sort');
        }}
        portalCss={{
          top: '30vh',
        }}
        contentCss={mobileBP ? { ...mobileExpanderStyle } : {}}
      >
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
        <DropdownGroup>
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
                dispatch(resetField('sort'));
                dispatch(resetField('order'));
                setExpand(false);
              }}
            >
              Clear All
            </TertiaryFormButton>
            <FormButton
              onClick={() => {
                dispatch(setSort(sortOption));
                dispatch(resetField('page'));
                setExpand(false);
              }}
            >
              Apply
            </FormButton>
          </Flex>
        </DropdownGroup>
      </Dropdown>
    </Flex>
  );
};
