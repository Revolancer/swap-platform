import { styled } from "stitches.config";
import { Logo } from "../branding/logo";

const Container = styled("div", {
  backgroundColor: "$navy900",
  top: 0,
  left: 0,
  position: "sticky",
  color: "$white",
  variants: {
    expanded: {
      true: {
        "@sm": {
          width: "360px",
        },
      },
    },
  },
  zIndex: "$4",

  "@sm": {
    width: "72px",
    position: "fixed",
    transition: "height 0s",
  },
});

const DesktopItems = styled("div", {
  display: "none",

  "@sm": {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: "$5",
  },

  variants: {
    expanded: {
      true: {
        alignItems: "baseline",
      },
    },
  },
});

const MobileItems = styled("div", {
  display: "flex",
  padding: "$5",
  height: "56px",
  "@sm": {
    display: "none",
  },
});

export const MainNav = ({ expanded = false }) => {
  return (
    <Container expanded={expanded}>
      <DesktopItems expanded={expanded}>
        <Logo expanded={expanded} />
      </DesktopItems>
      <MobileItems>
        <Logo expanded />
      </MobileItems>
    </Container>
  );
};
