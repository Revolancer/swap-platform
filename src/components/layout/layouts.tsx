import { RootState } from "@/redux/store";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, styled } from "stitches.config";
import { Logo } from "../branding/logo";
//import { TrialNagBar } from "../chargebee/nagbar";
import { CrumbBar } from "../navigation/crumbs/crumbbar";
import { AuthGuard } from "../navigation/guards/authguard";
import { MainNav } from "../navigation/main/main-nav";
import { contract } from "../navigation/main/nav-toggle";
import { ColumnLayout, FullWidth } from "./columns";
import { Flex } from "./flex";
import { OnboardingGuard } from "../navigation/guards/onboardingguard";
import { AdminGuard } from "../navigation/guards/adminguard";

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
  paddingBlockEnd: "$16",

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

export const PrimaryLayout = ({
  unguarded = false,
  children = <></>,
}: {
  unguarded?: boolean;
  children?: ReactNode;
}) => {
  const expanded = useSelector(
    (state: RootState) => state.navigation.toggle.expanded
  );
  const dispatch = useDispatch();

  let inner: ReactNode;

  if (!unguarded) {
    inner = (
      <AuthGuard>
        <OnboardingGuard>{children}</OnboardingGuard>
      </AuthGuard>
    );
  } else {
    inner = children;
  }

  return (
    <>
      <MainNav />
      <NavExpandedBodyHider
        expanded={expanded}
        onClick={() => dispatch(contract())}
      />
      <MainGridOuter>
        <MainGridInner expanded={expanded}>
          <ColumnLayout>{inner}</ColumnLayout>
        </MainGridInner>
      </MainGridOuter>
    </>
  );
};

export const AdminLayout = ({
  children = <></>,
}: {
  unguarded?: boolean;
  children?: ReactNode;
}) => {
  const expanded = useSelector(
    (state: RootState) => state.navigation.toggle.expanded
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
          <ColumnLayout>
            <AuthGuard>
              <AdminGuard>{children}</AdminGuard>
            </AuthGuard>
          </ColumnLayout>
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
        <AuthGuard redirectIfAuthed>{children}</AuthGuard>
      </ColumnLayout>
    </>
  );
};

/**
 * Layout for onboarding
 */
export const OnboardingLayout = ({ children }: { children?: any }) => {
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
        <AuthGuard>
          <OnboardingGuard>{children}</OnboardingGuard>
        </AuthGuard>
      </ColumnLayout>
    </>
  );
};
