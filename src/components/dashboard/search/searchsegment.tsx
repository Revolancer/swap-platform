import { useAppDispatch, useAppSelector } from '@/redux/store';
import { faCircleXmark, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TertiaryFormButton } from '@revolancer/ui/buttons';
import { Form, InputInner, InputOuter } from '@revolancer/ui/forms';
import { Flex } from '@revolancer/ui/layout';
import { Formik } from 'formik';
import debounce from 'lodash.debounce';
import { clearTerm, setTerm } from './reducer';

export const SearchSegment = ({ onSearch }: { onSearch: () => void }) => {
  const { term } = useAppSelector((state) => state.feedFilters);
  const dispatch = useAppDispatch();

  const debouncedLoad = debounce(onSearch, 500);

  return (
    <Formik
      initialValues={{ searchTerm: term }}
      onSubmit={(values, actions) => {
        dispatch(setTerm(values.searchTerm));
        debouncedLoad();
      }}
    >
      {({ handleBlur, values, handleChange, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Flex gap={6} css={{ padding: '$7 0' }}>
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
