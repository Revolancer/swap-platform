import { Filters } from '@/lib/types';
import { Flex } from '@revolancer/ui/layout';
import { useEffect, useState } from 'react';
import { FormButton, TertiaryFormButton } from '@revolancer/ui/buttons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { resetField, setFilters } from '../reducer';
import {
  Dropdown,
  DropdownGroup,
  DropdownMenuCheckboxItem,
  DropdownSeparator,
} from '@revolancer/ui/collapsible';

export const FilterSegment = ({
  expand,
  setExpand,
}: {
  expand: 'filter' | 'sort' | false;
  setExpand: (arg0: any) => void;
}) => {
  const { datatype, term } = useAppSelector((state) => state.feedFilters);
  const dispatch = useAppDispatch();
  const mobileBP = window.innerWidth < 600;

  const [portfolios, setPortfolios] = useState(
    datatype?.includes('portfolio') || false,
  );
  const [needs, setNeeds] = useState(datatype?.includes('need') || false);
  const [users, setUsers] = useState(datatype?.includes('user') || false);

  useEffect(() => {
    if (!datatype) return;
    setPortfolios(datatype.includes('portfolio'));
    setNeeds(datatype.includes('need'));
    setUsers(datatype.includes('user'));
  }, [datatype]);

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
        placeholder="Filter"
        open={expand === 'filter'}
        onOpen={() => {
          if (expand == 'filter') setExpand(false);
          else setExpand('filter');
        }}
        portalCss={{
          top: '30vh',
        }}
        contentCss={mobileBP ? { ...mobileExpanderStyle } : {}}
      >
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
        </DropdownGroup>
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
                dispatch(resetField('datatype'));
                setExpand(false);
              }}
            >
              Clear All
            </TertiaryFormButton>
            <FormButton
              onClick={() => {
                const payload: Filters = [];
                if (portfolios) payload.push('portfolio');
                if (needs) payload.push('need');
                if (users) payload.push('user');
                dispatch(setFilters(payload));
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
