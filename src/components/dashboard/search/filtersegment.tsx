import { Filters } from '@/lib/types';
import { Divider, Flex } from '@revolancer/ui/layout';
import { useCallback, useEffect, useState } from 'react';
import { FormButton, TertiaryFormButton } from '@revolancer/ui/buttons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearFilters, resetField, setFilters } from './reducer';
import {
  Dropdown,
  DropdownGroup,
  DropdownMenuCheckboxItem,
  DropdownSeparator,
} from '@revolancer/ui/collapsible';
import { styled } from '@revolancer/ui';
import { P } from '@revolancer/ui/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Formik } from 'formik';
import { Checkbox, Form } from '@revolancer/ui/forms';

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

  const MobileFilter = () => {
    const buttonStyle = {
      width: '100%',
      height: '42px',
      padding: '$3 $5',
      display: 'inline-flex',
      fontWeight: '$normal',
      fontSize: '$body2',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    const MobileExpander = styled('div', {
      height: '$0',
      width: '100%',
      zIndex: '$4',
      position: 'fixed',
      top: '35dvh',
      left: '50%',
      transform: 'translate(-50%, 0)',
      backgroundColor: '$background',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      transition: 'height 0.4s ease-in-out',

      variants: {
        expanded: {
          true: {
            height: '65dvh',
            padding: '$3 $5',
          },
        },
      },
    });

    return (
      <>
        <Flex css={{ width: '100%' }}>
          <FormButton
            role="secondary"
            css={buttonStyle}
            onClick={() => {
              if (expand == 'filter') setExpand(false);
              else setExpand('filter');
            }}
          >
            <P>Filter</P>
            <P css={{ color: '$neutral500' }}>
              <FontAwesomeIcon
                icon={expand == 'filter' ? faChevronUp : faChevronDown}
              />
            </P>
          </FormButton>
        </Flex>
        <MobileExpander expanded={expand === 'filter'}>
          {expand === 'filter' && (
            <Flex
              css={{
                width: '100%',
                maxWidth: '420px',
                padding: '$5',
                height: '100%',
              }}
            >
              <Formik
                initialValues={{
                  portfolios: portfolios,
                  needs: needs,
                  users: users,
                }}
                onSubmit={(values) => {
                  const payload: Filters = [];
                  if (values.portfolios) payload.push('portfolios');
                  if (values.needs) payload.push('needs');
                  if (values.users) payload.push('users');
                  dispatch(setFilters(payload));
                  setExpand(false);
                }}
              >
                {(props) => {
                  return (
                    <Form
                      onSubmit={props.handleSubmit}
                      css={{
                        alignContent: 'space-between',
                      }}
                    >
                      <Flex column>
                        <Checkbox
                          id="portfolios"
                          name="portfolios"
                          checked={props.values.portfolios}
                        >
                          Portfolio Posts
                        </Checkbox>
                        <Divider />
                        <Checkbox
                          id="needs"
                          name="needs"
                          checked={props.values.needs}
                        >
                          Needs
                        </Checkbox>
                        <Divider />
                        <Checkbox
                          id="users"
                          name="users"
                          checked={props.values.users}
                        >
                          User Profiles
                        </Checkbox>
                      </Flex>
                      <Divider />
                      <Flex
                        column
                        css={{
                          width: '100%',
                        }}
                      >
                        <Divider />
                        <Flex
                          css={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <TertiaryFormButton
                            role="secondary"
                            onClick={() => {
                              dispatch(resetField('datatype'));
                              setExpand(false);
                            }}
                          >
                            Clear All
                          </TertiaryFormButton>
                          <FormButton
                            onClick={() => {
                              props.submitForm();
                            }}
                          >
                            Save
                          </FormButton>
                        </Flex>
                      </Flex>
                    </Form>
                  );
                }}
              </Formik>
            </Flex>
          )}
        </MobileExpander>
      </>
    );
  };

  const DesktopFilter = () => (
    <Flex css={{ width: '100%' }}>
      <Dropdown
        placeholder="Filter"
        open={expand === 'filter'}
        onOpen={() => {
          if (expand == 'filter') setExpand(false);
          else setExpand('filter');
        }}
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
                if (portfolios) payload.push('portfolios');
                if (needs) payload.push('needs');
                if (users) payload.push('users');
                dispatch(setFilters(payload));
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

  return mobileBP ? <MobileFilter /> : <DesktopFilter />;
};
