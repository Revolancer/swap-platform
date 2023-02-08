import { Interactive } from "react-interactive";
import { styled } from "stitches.config";

export const Button = styled(Interactive.A, {
  variants: {
    role: {
      primary: {
        backgroundColor: "$pink500",
        color: "$white",
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
  flexGrow: "0",
  flexShrink: "0",
  height: "max-content",
  defaultVariants: {
    role: "primary",
    size: "medium",
  },
});
