import { ColumnLayout } from "@/components/layout/columns";
import { styled } from "stitches.config";

const CrumbBarContainer = styled("div", {
  height: "$15",
});

export const CrumbBar = () => {
  return (
    <CrumbBarContainer>
      <ColumnLayout></ColumnLayout>
    </CrumbBarContainer>
  );
};
