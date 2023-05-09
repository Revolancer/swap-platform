import Link from "next/link";
import { styled } from "stitches.config";
import { Flex } from "../layout/flex";

const TabLink = styled(Link, {
  fontSize: "$body2",
  color: "$neutral600",
  textDecoration: "none",
  display: "block",
  paddingInline: "$5",
  paddingBlock: "$3",

  variants: {
    active: {
      true: {
        color: "$black",
        fontWeight: "$medium",
        borderStyle: "none",
        borderWidth: "$2",
        borderColor: "$black",
        borderBlockEndStyle: "solid",
      },
    },
  },
});

export const ProjectTabs = ({ active = 1 }: { active: number }) => {
  return (
    <Flex wrap gap={0}>
      <TabLink active href="/projects">
        Dashboard
      </TabLink>
      <TabLink href="/projects/active">Active Projects</TabLink>
      <TabLink href="/projects/requests">Project Requests</TabLink>
      <TabLink href="/projects/needs">My Needs</TabLink>
      <TabLink href="/projects/completed">Active Projects</TabLink>
    </Flex>
  );
};
