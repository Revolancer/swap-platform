import { styled, darkTheme } from "stitches.config";

export const Card = styled("div", {
  borderWidth: "$1",
  borderStyle: "$solid",
  borderColor: "$borders",
  borderRadius: "$2",
  backgroundColor: "$background",
  boxShadow: "$1",
  padding: "$4",
  display: "flex",
  gap: "$3",
  flexDirection: "column",
});
