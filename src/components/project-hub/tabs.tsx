import Link from "next/link";
import { styled } from "stitches.config";
import { Flex } from "../layout/flex";
import { useRouter } from "next/router";

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

export const ProjectTabs = () => {
  const router = useRouter();
  return (
    <Flex wrap gap={0}>
      <TabLink active={router.pathname == "/projects"} href="/projects">
        Dashboard
      </TabLink>
      <TabLink
        active={router.pathname == "/projects/active"}
        href="/projects/active"
      >
        Active Projects
      </TabLink>
      {/*
      <TabLink
        active={router.pathname == "/projects/requests"}
        href="/projects/requests"
      >
        Project Requests
  </TabLink>*/}
      <TabLink
        active={router.pathname == "/projects/needs"}
        href="/projects/needs"
      >
        My Needs
      </TabLink>
      <TabLink
        active={router.pathname == "/projects/completed"}
        href="/projects/completed"
      >
        Completed Projects
      </TabLink>
    </Flex>
  );
};
