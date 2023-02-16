import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, styled } from "stitches.config";
import { Logo } from "../branding/logo";
import { CrumbBar } from "../navigation/crumbs/crumbbar";
import { MainNav } from "../navigation/main/main-nav";
import { contract } from "../navigation/main/nav-toggle";
import { ColumnLayout, FullWidth } from "./columns";
import { Flex } from "./flex";

const MainGridOuter = styled("div", {
  overflowX: "hidden",
  overflowY: "auto",
  width: "100%",
  height: "100vh",
  position: "relative",
});

const NavExpandedBodyHider = styled("div", {
  display: "none",
  opacity: 0,
  width: "100vw",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  backgroundColor: "$background",

  variants: {
    expanded: {
      true: {
        display: "block",
        zIndex: "$3",
      },
    },
  },
});

const MainGridInner = styled("div", {
  width: "100vw",
  position: "absolute",
  top: 0,
  left: 0,

  "@sm": {
    width: "calc(100vw - 72px)",
    transition: "left 0.2s ease-in-out",
    left: "72px",
  },

  "@lg": {
    width: "100vw",
    left: 0,
  },

  variants: {
    expanded: {
      true: {
        "@sm": {
          left: "376px",
        },
      },
    },
  },
});

export const PrimaryLayout = ({ children }: { children: any }) => {
  const expanded = useSelector(
    (state: RootState) => state.root.navigation.toggle.expanded
  );
  const dispatch = useDispatch();

  return (
    <>
      <MainNav />
      <NavExpandedBodyHider
        expanded={expanded}
        onClick={() => dispatch(contract())}
      />
      <MainGridOuter>
        <MainGridInner expanded={expanded}>
          <CrumbBar />
          <ColumnLayout>{children}</ColumnLayout>
        </MainGridInner>
      </MainGridOuter>
    </>
  );
};

const LoginHeader = styled("div", {
  height: "56px",
  backgroundColor: "$navy900",
  [`.${darkTheme} &`]: {
    backgroundColor: "$black",
  },
});

/**
 * Layout for login, registration, reset password
 */
export const LoginLayout = ({ children }: { children?: any }) => {
  return (
    <>
      <LoginHeader>
        <ColumnLayout undecorated css={{ height: "100%" }}>
          <FullWidth css={{ height: "100%" }}>
            <Flex css={{ height: "100%", alignItems: "center" }}>
              <Logo expanded />
            </Flex>
          </FullWidth>
        </ColumnLayout>
      </LoginHeader>
      <ColumnLayout undecorated css={{ paddingBlock: "$7" }}>
        {children}
      </ColumnLayout>
    </>
  );
};
