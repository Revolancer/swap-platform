import { useAppDispatch, useAppSelector } from '@/redux/store';
import { faCircleXmark, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TertiaryFormButton } from '@revolancer/ui/buttons';
import { Form, InputInner, InputOuter } from '@revolancer/ui/forms';
import { Flex } from '@revolancer/ui/layout';
import { Formik } from 'formik';
import { clearTerm, setTerm } from './reducer';
import { useEffect, useState } from 'react';

export const SearchSegment = () => {
  const { term } = useAppSelector((state) => state.feedFilters);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState(term ?? '');

  useEffect(() => setSearch(term), [term]);

  return (
    <Formik
      initialValues={{ searchTerm: search }}
      onSubmit={(values, actions) => {
        dispatch(setTerm(values.searchTerm));
      }}
    >
      {({ handleBlur, values, handleChange, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Flex css={{ height: '42px' }}>
            <InputOuter key={'term'}>
              <FontAwesomeIcon icon={faSearch} style={{ marginRight: '5px' }} />
              <InputInner
                type="text"
                name="searchTerm"
                placeholder="Search"
                onBlur={handleBlur}
                value={values.searchTerm}
                onChange={handleChange}
              />
              {values.searchTerm &&
                (term === values.searchTerm ? (
                  <TertiaryFormButton
                    onClick={() => {
                      values.searchTerm = '';
                      dispatch(clearTerm());
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      style={{ marginRight: '5px' }}
                    ></FontAwesomeIcon>
                  </TertiaryFormButton>
                ) : (
                  <TertiaryFormButton type="submit">Search</TertiaryFormButton>
                ))}
            </InputOuter>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
