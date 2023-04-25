import { styled } from "stitches.config";
import { ColumnLayout, FullWidth } from "./columns";

export const Div = styled("div", {});

export const NagBarContainer = styled("div", {
  width: "100%",
  backgroundColor: "$orange100",
  color: "$neutral900",
  borderStyle: "$solid",
  borderWidth: "0 0 $1 0",
  borderColor: "$orange200",
  padding: "$1",
});

export const NagBar = ({ children }: { children?: any }) => {
  return (
    <NagBarContainer>
      <ColumnLayout>
        <FullWidth
          css={{ display: "flex", gap: "4px", justifyContent: "center" }}
        >
          {children}
        </FullWidth>
      </ColumnLayout>
    </NagBarContainer>
  );
};
