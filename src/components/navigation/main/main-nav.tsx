import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, styled } from "stitches.config";
import { Logo } from "../../branding/logo";
import { MobileNav } from "./mobile";
import { expand } from "./nav-toggle";

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
    transition: "width 0.2s ease-in-out",
  },

  [`.${darkTheme} &`]: {
    backgroundColor: "$black",
  },
});

const DesktopItemContainer = styled("div", {
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

export const MainNav = () => {
  const expanded = useSelector(
    (state: RootState) => state.root.navigation.toggle.expanded
  );
  const dispatch = useDispatch();

  return (
    <Container expanded={expanded}>
      <DesktopItemContainer
        expanded={expanded}
        onClick={() => dispatch(expand())}
      >
        <Logo expanded={expanded} />
      </DesktopItemContainer>
      <MobileNav />
    </Container>
  );
};
