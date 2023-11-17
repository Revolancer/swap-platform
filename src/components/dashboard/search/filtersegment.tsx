import { Filters } from '@/lib/types';
import { Flex } from '@revolancer/ui/layout';
import { useCallback, useEffect, useState } from 'react';
import { FormButton, TertiaryFormButton } from '@revolancer/ui/buttons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearFilters, setFilters } from './reducer';
import {
  Dropdown,
  DropdownGroup,
  DropdownMenuCheckboxItem,
  DropdownSeparator,
} from './dropdown';

export const FilterSegment = () => {
  const { datatype, term } = useAppSelector((state) => state.feedFilters);
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState(false);
  const [portfolios, setPortfolios] = useState(
    datatype?.includes('portfolios') || false,
  );
  const [needs, setNeeds] = useState(datatype?.includes('needs') || false);
  const [users, setUsers] = useState(datatype?.includes('users') || false);

  useEffect(() => {
    if (!datatype) return;
    setPortfolios(datatype.includes('portfolios'));
    setNeeds(datatype.includes('needs'));
    setUsers(datatype.includes('users'));
  }, [datatype]);

  const toggle = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <Flex css={{ width: '100%' }}>
      <Dropdown placeholder="Filter" open={expanded} onOpen={toggle}>
        <DropdownGroup>
          <DropdownMenuCheckboxItem
            checked={portfolios}
            onCheckedChange={() => setPortfolios(!portfolios)}
          >
            Portfolio Posts
          </DropdownMenuCheckboxItem>
          <DropdownSeparator light />
          <DropdownMenuCheckboxItem
            checked={needs}
            onCheckedChange={() => setNeeds(!needs)}
          >
            Needs
          </DropdownMenuCheckboxItem>
          <DropdownSeparator light />
          <DropdownMenuCheckboxItem
            checked={users}
            onCheckedChange={() => setUsers(!users)}
            disabled={term === ''}
          >
            User Profiles
          </DropdownMenuCheckboxItem>
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
                setPortfolios(false);
                setNeeds(false);
                setUsers(false);
                dispatch(clearFilters());
              }}
            >
              Clear All
            </TertiaryFormButton>
            <FormButton
              onClick={() => {
                const payload: Filters = [];
                if (portfolios) payload.push('portfolios');
                if (needs) payload.push('needs');
                if (users) payload.push('users');
                dispatch(setFilters(payload));
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
