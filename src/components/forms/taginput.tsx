import { Field, FieldProps } from "formik";
import { useEffect, useState } from "react";
import { Feedback } from "./feedback";
import { InputOuter } from "./input";
import { type Tag, WithContext as ReactTags } from "react-tag-input";
import { styled } from "stitches.config";
import { axiosPublic } from "@/lib/axios";

const KeyCodes = {
  comma: 188,
  enter: 13,
  tab: 9,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

export const TagField = ({
  name,
  placeholder,
}: {
  name: string;
  placeholder?: string;
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosPublic.get("tags").then((response) => {
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
        const updateTags = (tags: Tag[]) => {
          setTags(tags);
          setFieldValue(name, tags);
        };

        const handleDelete = (i: number) => {
          updateTags(tags.filter((tag, index) => index !== i));
        };

        const handleAddition = (tag: Tag) => {
          //No duplicates
          if (tags.includes(tag)) return;

          //No custom tags
          if (!suggestions.includes(tag)) return;

          updateTags([...tags, tag]);
        };

        const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
          const newTags = tags.slice();

          newTags.splice(currPos, 1);
          newTags.splice(newPos, 0, tag);

          // re-render
          updateTags(newTags);
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
                  suggestions={suggestions}
                  delimiters={delimiters}
                  autocomplete={true}
                  placeholder={placeholder}
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
      color: "$pink500",
      padding: "$1 $2 $1 $4",
      borderRadius: "100px",
      background: "$pink100",
      cursor: "move",

      "& .ReactTags__remove": {
        backgroundImage: "none",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "$pink500",
      },
    },

    "& .ReactTags__tagInput": {
      position: "relative",
    },

    "& .ReactTags__suggestions": {
      position: "absolute",
      top: "2rem",
      left: "0",
      padding: "0 $4",
      background: "$background",
      borderRadius: "$2",
      borderStyle: "solid",
      borderWidth: "$1",
      borderColor: "$neutral100",
      zIndex: "$2",
      boxShadow: "$2",

      "& ul": {
        listStyleType: "none",
        padding: "0",

        "& li": {
          color: "$pink500",
          padding: "$1 $4",
          margin: "$2 0",
          borderRadius: "100px",
          background: "$pink100",
          cursor: "pointer",

          "& mark": {
            background: "none",
            color: "inherit",
          },
        },
      },
    },
  },
});
