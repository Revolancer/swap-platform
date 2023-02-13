import {
  faCircleCheck,
  faCircleInfo,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "stitches.config";

const FeedbackText = styled("span", {
  fontSize: "$body2",

  variants: {
    state: {
      feedback: {
        color: "$navy500",
      },
      warning: {
        color: "$orange500",
      },
      error: {
        color: "$red500",
      },
      success: {
        color: "$green500",
      },
    },
  },

  defaultVariants: {
    state: "feedback",
  },
});

export const Feedback = ({
  state = "warning",
  children,
}: {
  state?: "feedback" | "warning" | "error" | "success";
  children?: any;
}) => {
  let symbol = faCircleInfo;
  switch (state) {
    case "warning":
    case "error":
      symbol = faTriangleExclamation;
      break;
    case "success":
      symbol = faCircleCheck;
      break;
  }
  return (
    <FeedbackText state={state}>
      <FontAwesomeIcon icon={symbol} />
      {` `}
      {children}
    </FeedbackText>
  );
};
