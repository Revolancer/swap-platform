import { Interactive } from "react-interactive";
import { styled } from "stitches.config";

const styles = {
  variants: {
    role: {
      primary: {
        backgroundColor: "$pink500",
        color: "$white",
        borderWidth: "$1",
        borderStyle: "$solid",
        borderColor: "$pink500",

        "&.hover": {
          backgroundColor: "$pink700",
          borderColor: "$pink700",
        },
        "&.active": {
          backgroundColor: "$pink800",
          borderColor: "$pink800",
        },
        "&.disabled": {
          opacity: "$opacity$700",
          backgroundColor: "$pink200",
          borderColor: "$pink200",
        },
      },
      secondary: {
        backgroundColor: "$white",
        color: "$neutral900",
        borderWidth: "$1",
        borderStyle: "$solid",
        borderColor: "$neutral400",

        "&.hover": {
          backgroundColor: "$neutral100",
        },
        "&.active": {
          backgroundColor: "$neutral300",
        },
        "&.disabled": {
          opacity: "$opacity$500",
        },
      },
    },
    size: {
      small: {
        paddingBlock: "$2",
        paddingInline: "$4",
      },
      medium: {
        paddingBlock: "$3",
        paddingInline: "$6",
      },
      large: {
        paddingBlock: "$4",
        paddingInline: "$7",
      },
    },
  },
  display: "inline-block",
  borderRadius: "$1",
  textDecoration: "none",
  fontSize: "$body1",
  fontWeight: "$semibold",
  height: "max-content",
  width: "max-content",
  boxShadow: "$2",
  defaultVariants: {
    role: "primary",
    size: "medium",
  },
};

export const Button = styled(Interactive.A, styles);
export const FormButton = styled(Interactive.Button, styles);
