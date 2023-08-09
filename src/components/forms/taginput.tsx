import { Field, FieldProps } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { Feedback } from './feedback';
import { InputOuter } from './input';
import { type Tag, WithContext as ReactTags } from 'react-tag-input';
import { styled } from '@revolancer/ui';
import { axiosPublic } from '@/lib/axios';
import { matchSorter } from 'match-sorter';
import { v4 as uuid } from 'uuid';

const KeyCodes = {
  comma: 188,
  enter: 13,
  tab: 9,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

export const TagField = ({
  name,
  placeholder = 'Graphic Design, Web Development, Copywriting...',
}: {
  name: string;
  placeholder?: string;
}) => {
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isLoading, setLoading] = useState(false);
  const id = useMemo(() => `tag-input-${name}-${uuid()}`, [name]);

  useEffect(() => {
    setLoading(true);
    axiosPublic.get('tags').then((response) => {
      setSuggestions(response.data);
    });
    setLoading(false);
  }, []);

  return (
    <Field name={name} id={`tags-${name}`}>
      {({
        field: { value },
        form: { setFieldValue, errors, touched },
      }: FieldProps) => {
        const handleDelete = (i: number) => {
          setFieldValue(
            name,
            (value as Tag[]).filter((tag, index) => index !== i),
          );
        };

        const handleAddition = (tag: Tag) => {
          //No duplicates
          if ((value as Tag[]).includes(tag)) return;

          //No custom tags
          if (!suggestions.includes(tag)) return;

          setFieldValue(name, [...(value as Tag[]), tag]);
        };

        const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
          const newTags = (value as Tag[]).slice();

          newTags.splice(currPos, 1);
          newTags.splice(newPos, 0, tag);

          // re-render
          setFieldValue(name, newTags);
        };

        const filterSuggestions = (query: string, suggestions: Tag[]) => {
          const matches = matchSorter(suggestions, query, { keys: ['text'] });
          return matches.slice(0, 6);
        };

        const focusInput = (e: React.MouseEvent<HTMLDivElement>) => {
          const targetId = (e.target as HTMLElement)?.id ?? '';
          if (targetId == id) {
            e.preventDefault();
            if (typeof document != 'undefined') {
              document
                .getElementById(id)
                ?.getElementsByTagName('input')[0]
                .focus();
            }
          }
        };
        return (
          <>
            <InputOuter
              error={touched[name] && !!errors[name]}
              onClick={focusInput}
              id={id}
            >
              <TagsContainer>
                {!isLoading && (
                  <ReactTags
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    tags={value}
                    suggestions={suggestions}
                    delimiters={delimiters}
                    autocomplete={true}
                    placeholder={placeholder}
                    handleFilterSuggestions={filterSuggestions}
                  />
                )}
              </TagsContainer>
            </InputOuter>
            {touched[name] && errors[name] && (
              <Feedback state="error">{errors[name]}</Feedback>
            )}
          </>
        );
      }}
    </Field>
  );
};

const TagsContainer = styled('div', {
  width: '100%',

  '& .ReactTags__selected': {
    display: 'flex',
    gap: '$3',
    flexWrap: 'wrap',
    alignItems: 'center',

    '& input': {
      border: 'none',
      width: '100%',

      '&:focus, &:focus-visible': {
        outline: 'none',
      },
    },

    '& .ReactTags__tag': {
      display: 'flex',
      gap: '$2',
      color: '$pink500',
      padding: '$1 $2 $1 $4',
      borderRadius: '100px',
      background: '$pink100',
      cursor: 'move',

      '& .ReactTags__remove': {
        backgroundImage: 'none',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '$pink500',
      },
    },

    '& .ReactTags__tagInput': {
      position: 'relative',
      flexGrow: '1',
    },

    '& .ReactTags__suggestions': {
      position: 'absolute',
      top: '2rem',
      left: '0',
      padding: '0 $4',
      background: '$background',
      borderRadius: '$2',
      borderStyle: 'solid',
      borderWidth: '$1',
      borderColor: '$neutral100',
      zIndex: '$2',
      boxShadow: '$2',

      '& ul': {
        listStyleType: 'none',
        padding: '0',

        '& li': {
          color: '$pink500',
          padding: '$1 $4',
          margin: '$2 0',
          borderRadius: '100px',
          background: '$pink100',
          cursor: 'pointer',

          '& mark': {
            background: 'none',
            color: 'inherit',
          },
        },
      },
    },
  },
});
