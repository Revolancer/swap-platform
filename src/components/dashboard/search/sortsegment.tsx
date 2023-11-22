import { Order, Sort, SortType } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Divider, Flex } from '@revolancer/ui/layout';
import { useCallback, useEffect, useState } from 'react';
import { setSort } from './reducer';
import {
  Dropdown,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownSeparator,
} from './dropdown';
import { FormButton, TertiaryFormButton } from '@revolancer/ui/buttons';
import { styled } from '@revolancer/ui';
import { P } from '@revolancer/ui/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Formik } from 'formik';
import { Form } from '@revolancer/ui/forms';
import { Radio, RadioItem } from './radio';

export const SortSegment = () => {
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

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setSortOption(getSortOption(sort as Sort, order as Order));
  }, [sort, order]);

  const toggle = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const MobileSort = () => {
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
            onClick={() => toggle()}
          >
            <P>Sort</P>
            <P css={{ color: '$neutral500' }}>
              <FontAwesomeIcon icon={faChevronDown} />
            </P>
          </FormButton>
        </Flex>
        <MobileExpander expanded={expanded}>
          {expanded && (
            <Flex
              css={{
                width: '100%',
                maxWidth: '420px',
                height: '100%',
              }}
            >
              <Formik
                initialValues={{
                  sortOption: sortOption,
                }}
                onSubmit={(values) => {
                  dispatch(setSort(values.sortOption));
                }}
              >
                {(props) => {
                  return (
                    <Form
                      onSubmit={props.handleSubmit}
                      css={{
                        justifyContent: 'space-between',
                      }}
                    >
                      <Flex column>
                        <Radio
                          id="sortOption"
                          name="sortOption"
                          defaultValue="newest"
                          value={props.values.sortOption}
                        >
                          <RadioItem
                            value="newest"
                            label="Newest to Oldest"
                            divide
                          />
                          <RadioItem
                            value="oldest"
                            label="Oldest to Newest"
                            divide
                          />
                          <RadioItem
                            value="relevance"
                            label="Most Relevant"
                            divide
                          />
                        </Radio>
                      </Flex>
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
                              dispatch(setSort('newest'));
                            }}
                          >
                            Clear All
                          </TertiaryFormButton>
                          <FormButton
                            onClick={() => {
                              props.submitForm();
                              toggle();
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

  const DesktopSort = () => (
    <Flex css={{ width: '100%' }}>
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

  return mobileBP ? <MobileSort /> : <DesktopSort />;
};
