import { darkTheme, styled } from "stitches.config";

export const InputOuter = styled("div", {
  backgroundColor: "$background",
  color: "$neutral900",
  borderColor: "$neutral400",
  borderStyle: "$solid",
  borderWidth: "$1",
  borderRadius: "$1",
  boxShadow: "$2",
  display: "flex",
  width: "100%",
  fontSize: "$body2",
  paddingBlock: "$3",
  paddingInline: "$5",

  [`.${darkTheme} &`]: {
    color: "$neutral100",
    borderColor: "$neutral700",
    backgroundColor: "$neutral800",
  },
});

export const InputInner = styled("input", {
  border: "none",
  background: "none",
  flexGrow: "1",
  color: "inherit",
});
