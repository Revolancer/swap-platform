import { Order, Sort, SortType } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Form, Select, SelectGroup, SelectItem } from '@revolancer/ui/forms';
import { Flex } from '@revolancer/ui/layout';
import { Formik } from 'formik';
import debounce from 'lodash.debounce';
import { useState } from 'react';
import { setSort } from './reducer';

export const SortSegment = ({ onSearch }: { onSearch: () => void }) => {
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

  const debouncedLoad = debounce(onSearch, 500);

  return (
    <Formik
      initialValues={{ sort: sortOption }}
      onSubmit={(values, actions) => {
        dispatch(setSort(values.sort));
        setSortOption(values.sort);
        debouncedLoad();
      }}
    >
      {({ submitForm }) => (
        <Form onChange={submitForm}>
          <Flex css={{ padding: '$7 0', height: '92px' }}>
            <Select placeholder="Sort By" name="sort">
              <SelectGroup id="sort">
                <SelectItem id="newest" value="newest">
                  Newest to Oldest
                </SelectItem>
                <SelectItem id="oldest" value="oldest">
                  Oldest to Newest
                </SelectItem>
                <SelectItem id="relevance" value="relevance">
                  Most Relevant
                </SelectItem>
              </SelectGroup>
            </Select>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
