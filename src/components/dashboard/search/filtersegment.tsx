import { Filters } from '@/lib/types';
import {
  Checkbox,
  Form,
  Select,
  SelectGroup,
  SelectItem,
} from '@revolancer/ui/forms';
import { Card, Flex } from '@revolancer/ui/layout';
import { Formik } from 'formik';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';
import { P } from '@revolancer/ui/text';
import { FormButton, TertiaryFormButton } from '@revolancer/ui/buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearFilters, setFilters } from './reducer';

export const FilterSegment = ({ onSearch }: { onSearch: () => void }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const { datatype, term } = useAppSelector((state) => state.feedFilters);
  const dispatch = useAppDispatch();

  const debouncedLoad = debounce(onSearch, 500);

  return (
    <>
      <Formik
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
      </Formik>
    </>
  );
};
