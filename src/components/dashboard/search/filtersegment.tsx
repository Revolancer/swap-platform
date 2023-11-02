import { Filters } from '@/lib/types';
import { Flex } from '@revolancer/ui/layout';
import { useCallback, useState } from 'react';
import { FormButton, TertiaryFormButton } from '@revolancer/ui/buttons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearFilters, setFilters } from './reducer';
import {
  Dropdown,
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

  const toggle = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <>
      <Flex css={{ padding: '$7 0', height: '92px', width: '100%' }}>
        <Dropdown placeholder="Filter" open={expanded} onOpen={toggle}>
          <DropdownMenuCheckboxItem
            checked={portfolios}
            onCheckedChange={() => setPortfolios(!portfolios)}
          >
            Portfolio Posts
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={needs}
            onCheckedChange={() => setNeeds(!needs)}
          >
            Needs
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={users}
            onCheckedChange={() => setUsers(!users)}
            disabled={term !== undefined}
          >
            User Profiles
          </DropdownMenuCheckboxItem>
          <DropdownSeparator />
          <Flex
            gap={4}
            css={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: '$3 0',
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
        </Dropdown>
      </Flex>
      {/*<Formik
        initialValues={{
          portfolios: datatype?.includes('portfolios'),
          needs: datatype?.includes('needs'),
          users: datatype?.includes('users'),
        }}
        onSubmit={(values, actions) => {
          const filters: Filters = [];
          if (values.portfolios) filters.push('portfolios');
          if (values.needs) filters.push('needs');
          if (values.users) filters.push('users');
          dispatch(setFilters(filters));
          toggle();
          debouncedLoad();
        }}
      >
        {({ values, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Flex column gap={6} css={{ padding: '$7 0', height: '92px' }}>
              <Card
                css={{
                  justifyContent: 'center',
                  boxShadow: '$2',
                  borderColor: '$neutral400',
                  borderRadius: '$1',
                }}
              >
                <Flex
                  css={{
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}
                >
                  <P>Filters</P>
                  {!expanded && (
                    <TertiaryFormButton
                      onClick={(e) => {
                        e.preventDefault();
                        toggle();
                      }}
                    >
                      <FontAwesomeIcon icon={faAngleDown} />
                    </TertiaryFormButton>
                  )}
                </Flex>
              </Card>
            </Flex>
            {expanded && (
              <Card
                css={{
                  display: 'block',
                  position: 'relative',
                  bottom: '$8',
                }}
              >
                <Checkbox name="portfolios" checked={values.portfolios}>
                  Portfolio Posts
                </Checkbox>
                <Checkbox name="needs" checked={values.needs}>
                  Needs
                </Checkbox>
                <Checkbox name="users" checked={values.users}>
                  User Profiles
                </Checkbox>
                <Flex css={{ alignItems: 'center' }}>
                  <TertiaryFormButton
                    onClick={() => {
                      values.portfolios = false;
                      values.needs = false;
                      values.users = false;
                      dispatch(clearFilters());
                      toggle();
                    }}
                  >
                    Clear All
                  </TertiaryFormButton>
                  <FormButton type="submit">Apply</FormButton>
                </Flex>
              </Card>
            )}
          </Form>
        )}
      </Formik>*/}
    </>
  );
};
