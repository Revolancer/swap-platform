import { useAppDispatch, useAppSelector } from '@/redux/store';
import { TertiaryFormButton } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { styled } from '@revolancer/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  feedInitialState,
  removeFilter,
  removeTag,
  resetField,
  resetFilters,
} from '../reducer';
import { useEffect, useState } from 'react';
import { Tag } from '@/lib/types';

const compareArrays = (a: object, b: object) => {
  const arrA = Object.values(a);
  const arrB = Object.values(b);
  return (
    arrA.length === arrB.length &&
    arrA.every((element: any, index: number) => {
      if (typeof element === 'object') {
        compareArrays(Object.values(element), Object.values(arrB[index]));
      }
      return element === arrB[index];
    })
  );
};

export const TagSegment = () => {
  const feedFilter = useAppSelector((state) => state.feedFilters);
  const dispatch = useAppDispatch();

  const [tagArray, setTagArray] = useState<[string, any][]>([]);

  useEffect(() => {
    const initState = Object.entries(feedInitialState);
    const changedFilters = Object.entries(feedFilter).filter(
      ([key, value], idx) => {
        if (typeof value === 'object') {
          if (value.length === 0) return false;
          return !compareArrays(
            Object.values(value),
            Object.values(initState[idx][1]),
          );
        }
        return value !== initState[idx][1];
      },
    );
    setTagArray(changedFilters);
  }, [feedFilter]);

  const TagContainer = styled('div', {
    color: '$pink500',
    padding: '$1 $4',
    borderRadius: '100px',
    background: '$pink100',
  });

  const renderTags = tagArray.map(([key, value]) => {
    switch (key) {
      case 'tags': {
        return value.map((tag: Tag) => (
          <TagContainer key={tag.id}>
            {tag.text}
            <TertiaryFormButton
              onClick={() => {
                dispatch(removeTag(tag.id));
              }}
              css={{ marginLeft: '$3', color: '$pink500' }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </TertiaryFormButton>
          </TagContainer>
        ));
      }
      case 'datatype': {
        return value.map((item: 'portfolio' | 'need' | 'user') => (
          <TagContainer key={item}>
            {item}
            <TertiaryFormButton
              onClick={() => {
                dispatch(removeFilter(item));
              }}
              css={{ marginLeft: '$3', color: '$pink500' }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </TertiaryFormButton>
          </TagContainer>
        ));
      }
      default:
        return (
          <TagContainer key={key}>
            {value === 'relevance' && 'Most Relevant'}
            {value === 'ASC' && 'Oldest to Newest'}
            {key !== 'sort' && key !== 'order' && value}
            <TertiaryFormButton
              onClick={() => {
                dispatch(resetField(key));
              }}
              css={{ marginLeft: '$3', color: '$pink500' }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </TertiaryFormButton>
          </TagContainer>
        );
    }
  });

  return (
    tagArray.length > 0 && (
      <Flex column css={{ justifyContent: 'center', marginBottom: '$8' }}>
        <Flex css={{ justifyContent: 'space-between' }}>
          <P>Search results for:</P>
          <TertiaryFormButton
            onClick={() => {
              dispatch(resetFilters());
            }}
          >
            Clear All
          </TertiaryFormButton>
        </Flex>
        <Flex wrap>{renderTags}</Flex>
      </Flex>
    )
  );
};
