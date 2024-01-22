import { useAppDispatch, useAppSelector } from '@/redux/store';
import { faCircleXmark, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TertiaryFormButton } from '@revolancer/ui/buttons';
import { InputInner, InputOuter } from '@revolancer/ui/forms';
import { Flex } from '@revolancer/ui/layout';
import { resetField, setTerm } from '../reducer';
import { useEffect, useState } from 'react';

export const SearchSegment = () => {
  const { term } = useAppSelector((state) => state.feedFilters);
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState(term ?? '');

  useEffect(() => setSearchTerm(term), [term]);

  return (
    <Flex css={{ height: '42px', width: '100%' }}>
      <InputOuter>
        <FontAwesomeIcon icon={faSearch} style={{ marginRight: '5px' }} />
        <InputInner
          type="text"
          name="searchTerm"
          placeholder="Search"
          onBlur={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm &&
          (term === searchTerm ? (
            <TertiaryFormButton
              onClick={() => {
                setSearchTerm('');
                dispatch(resetField('term'));
              }}
            >
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{ marginRight: '5px' }}
              ></FontAwesomeIcon>
            </TertiaryFormButton>
          ) : (
            <TertiaryFormButton
              type="submit"
              onClick={() => {
                dispatch(setTerm(searchTerm));
                dispatch(resetField('page'));
              }}
            >
              Search
            </TertiaryFormButton>
          ))}
      </InputOuter>
    </Flex>
  );
};
