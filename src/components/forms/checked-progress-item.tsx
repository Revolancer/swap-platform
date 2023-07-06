import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "stitches.config";
import { Flex } from "../layout/flex";

const CheckText = styled("p", {
  color: "$neutral900",

  variants: {
    checked: {
      true: {
        color: "$neutral600",
        textDecorationColor: "$neutral600",
        textDecorationLine: "line-through",
      },
    },
  },
});
const CheckIconBorder = styled("div", {
  borderRadius: "100%",
  borderStyle: "$solid",
  borderWidth: "$2",
  borderColor: "$neutral500",
  width: "$7",
  height: "$7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  variants: {
    checked: {
      true: {
        borderColor: "$green500",
        color: "$green500",
      },
    },
  },
});

export const CheckedProgressItem = ({
  checked = false,
  children,
}: {
  checked?: boolean;
  children?: any;
}) => {
  return (
    <Flex>
      <CheckIconBorder checked={checked}>
        {checked && <FontAwesomeIcon icon={faCheck} />}
      </CheckIconBorder>
      <CheckText checked={checked}>{children}</CheckText>
    </Flex>
  );
};
