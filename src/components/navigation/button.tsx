import { Interactive } from "react-interactive";
import { styled } from "stitches.config";

export const Button = styled(Interactive.A, {
  variants: {
    role: {
      primary: {
        backgroundColor: "$pink500",
        color: "$white",
        border: "1px solid $pink500",

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
        border: "1px solid $neutral400",

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
        paddingBlock: "6px",
        paddingInline: "12px",
      },
      medium: {
        paddingBlock: "8px",
        paddingInline: "20px",
      },
      large: {
        paddingBlock: "12px",
        paddingInline: "24px",
      },
    },
  },
  display: "inline-block",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: "600",
  height: "max-content",
  width: "max-content",
  defaultVariants: {
    role: "primary",
    size: "medium",
  },
});
