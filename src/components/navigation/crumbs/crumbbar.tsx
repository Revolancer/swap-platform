import { ColumnLayout, FullWidth } from "@/components/layout/columns";
import { styled } from "stitches.config";
import { CrumbDivider } from "./crumbdivider";

const CrumbBarContainer = styled("div", {
  display: "flex",
  gap: "$4",
  padding: "$6",
  paddingBottom: "0",
});

export const CrumbBar = ({ children }: { children?: any }) => {
  const crumbs = [];
  if (!Array.isArray(children)) {
    crumbs.push(children);
  } else {
    let i = 0;
    while (i < children.length) {
      crumbs.push(children[i]);
      i++;
      if (i < children.length) {
        crumbs.push(<CrumbDivider />);
      }
    }
  }
  return (
    <FullWidth>
      <CrumbBarContainer>{crumbs}</CrumbBarContainer>
    </FullWidth>
  );
};
