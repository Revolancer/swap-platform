import { darkTheme, styled } from "stitches.config";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useFormikContext } from "formik";
import { Interactive } from "react-interactive";
import { MouseEventHandler } from "react";
import * as RadixSlider from "@radix-ui/react-slider";

export const SliderRoot = styled(RadixSlider.Root, {
  position: "relative",
  display: "flex",
  alignItems: "center",
  userSelect: "none",
  touchAction: "none",
  width: "100%",
  height: "20px",
});
export const SliderTrack = styled(RadixSlider.Track, {
  backgroundColor: "$neutral500",
  position: "relative",
  flexGrow: 1,
  borderRadius: "9999px",
  height: "4px",
  overflow: "hidden",
});
export const SliderRange = styled(RadixSlider.Range, {
  position: "absolute",
  backgroundColor: "$pink500",
  borderRadius: "0",
  height: "100%",
});
export const SliderThumb = styled(RadixSlider.Thumb, {
  display: "block",
  width: "32px",
  height: "32px",
  backgroundColor: "$white",
  borderColor: "$neutral500",
  borderWidth: "$1",
  borderStyle: "$solid",
  boxShadow: "$2",
  borderRadius: "100%",

  "&:hover": {
    backgroundColor: "$neutral100",
  },

  "&:focus": {
    outline: "none",
  },
});

export const Slider = ({
  thumbs = 1,
  step = 1,
  min = 0,
  max = 100,
  name = "",
}: {
  thumbs?: number;
  step?: number;
  min?: number;
  max?: number;
  name?: string;
}) => {
  return (
    <SliderRoot name={name} min={min} max={max} step={step}>
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      {[...Array(thumbs)].map((_, i) => {
        return <SliderThumb key={i} />;
      })}
    </SliderRoot>
  );
};

export const InputOuter = styled("div", {
  backgroundColor: "$background",
  color: "$neutral900",
  borderColor: "$neutral400",
  borderStyle: "$solid",
  borderWidth: "$1",
  borderRadius: "$1",
  boxShadow: "$2",
  display: "flex",
  alignItems: "center",
  width: "100%",
  fontSize: "$body2",
  paddingBlock: "$3",
  paddingInline: "$5",

  [`.${darkTheme} &`]: {
    color: "$neutral100",
    borderColor: "$neutral700",
    backgroundColor: "$neutral800",
  },

  "&:focus-within": {
    borderColor: "$navy500",
    borderWidth: "$2",
  },

  variants: {
    error: {
      true: {
        borderColor: "$red500",
        borderWidth: "$2",
        [`.${darkTheme} &`]: {
          borderColor: "$red500",
        },
      },
    },
    warning: {
      true: {
        borderColor: "$orange500",
        borderWidth: "$2",
        [`.${darkTheme} &`]: {
          borderColor: "$orange500",
        },
      },
    },
  },
});

export const InputInner = styled("input", {
  border: "none",
  background: "none",
  flexGrow: "1",
  color: "inherit",

  "&:focus": {
    border: "none",
    outline: "none",
  },
});

export const PasswordReveal = ({
  onClick,
  revealed = false,
}: {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  revealed?: boolean;
}) => (
  <Interactive.A
    onClick={onClick}
    aria-label={revealed ? "Hide Password" : "Show Password"}
  >
    <FontAwesomeIcon icon={revealed ? faEyeSlash : faEye} />
  </Interactive.A>
);

/**
 * Checkboxes
 */

const CheckboxRoot = styled(RadixCheckbox.Root, {
  backgroundColor: "transparent",
  margin: "$1",
  width: "$7",
  height: "$7",
  borderRadius: "$1",
  borderWidth: "$1",
  borderColor: "$neutral400",
  borderStyle: "$solid",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "$2",
  color: "$white",
  transition: "$smoothly",
  cursor: "pointer",

  "&.focus": {
    outline: "none",
  },

  '&[aria-checked="true"]': {
    backgroundColor: "$pink500",
    borderColor: "$pink500",
    boxShadow: "none",
  },

  [`.${darkTheme} &`]: {
    borderColor: "$neutral700",
    backgroundColor: "$neutral800",
    '&[aria-checked="true"]': {
      borderColor: "$pink500",
      backgroundColor: "$pink500",
    },
  },
});
const CheckboxIndicator = styled(RadixCheckbox.Indicator, {});

const CheckboxWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
});

export const Checkbox = ({
  name,
  children,
  id,
  defaultChecked = false,
  checked = false,
  required = false,
}: {
  name?: string;
  children: any;
  id?: string;
  defaultChecked?: boolean | "indeterminate";
  checked?: boolean | "indeterminate";
  required?: boolean;
}) => {
  if (typeof id == "undefined") {
    id = `check-${Math.random()}`;
  }
  if (typeof name == "undefined") {
    name = id;
  }

  const { setFieldValue } = useFormikContext();
  return (
    <CheckboxWrapper>
      <CheckboxRoot
        defaultChecked={defaultChecked}
        checked={checked}
        id={id}
        required={required}
        name={name}
        onCheckedChange={(checked) =>
          setFieldValue(name ?? "", checked === true)
        }
      >
        <CheckboxIndicator>
          <FontAwesomeIcon icon={faCheck} />
        </CheckboxIndicator>
      </CheckboxRoot>
      {children && <label htmlFor={id}>{children}</label>}
    </CheckboxWrapper>
  );
};
