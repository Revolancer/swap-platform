import { Field, FieldProps } from "formik";
import { useState } from "react";
import { Feedback } from "./feedback";
import { InputOuter } from "./input";
import { type Tag, WithContext as ReactTags } from "react-tag-input";
import { styled } from "stitches.config";

const KeyCodes = {
  comma: 188,
  enter: 13,
  tab: 9,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

const allTags: Tag[] = [
  { id: "cats", text: "Cats" },
  { id: "dogs", text: "Dogs" },
  { id: "turtles", text: "Turtles" },
];

export const TagField = ({
  name,
  placeholder,
}: {
  name: string;
  placeholder?: string;
}) => {
  const [tags, setTags] = useState<Tag[]>([]);

  return (
    <Field name={name} id={`tags-${name}`}>
      {({
        field: { value },
        form: { setFieldValue, errors, touched },
      }: FieldProps) => {
        const handleDelete = (i: number) => {
          setTags(tags.filter((tag, index) => index !== i));
          setFieldValue(name, tags);
        };

        const handleAddition = (tag: Tag) => {
          setTags([...tags, tag]);
          setFieldValue(name, tags);
        };

        const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
          const newTags = tags.slice();

          newTags.splice(currPos, 1);
          newTags.splice(newPos, 0, tag);

          // re-render
          setTags(newTags);
        };
        return (
          <>
            <InputOuter error={touched[name] && !!errors[name]}>
              <TagsContainer>
                <ReactTags
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleDrag={handleDrag}
                  tags={tags}
                  suggestions={allTags}
                  autocomplete={true}
                />
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

const TagsContainer = styled("div", {
  "& .ReactTags__selected": {
    display: "flex",
    gap: "$3",
    flexWrap: "wrap",
    alignItems: "center",

    "& input": {
      border: "none",

      "&:focus, &:focus-visible": {
        outline: "none",
      },
    },

    "& .ReactTags__tag": {
      display: "flex",
      gap: "$2",
      border: "1px solid $pink500",
      color: "$pink500",
      padding: "$1 $2 $1 $4",
      borderRadius: "$3",
      background: "$background",

      "& .ReactTags__remove": {
        backgroundImage: "none",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "$pink500",
      },
    },
  },
});
