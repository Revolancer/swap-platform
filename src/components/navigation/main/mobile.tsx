import { Logo } from "@/components/branding/logo";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "stitches.config";
import { toggle } from "./nav-toggle";

const MobileTopbarContainer = styled("div", {
  display: "flex",
  width: "100%",
  padding: "$5",
  height: "56px",
});

const MobileItemContainer = styled("div", {
  display: "flex",
  height: "56px",
  transition: "height 0.2s ease-in-out",
  backgroundColor: "$navy900",
  "@sm": {
    display: "none",
  },

  variants: {
    expanded: {
      true: {
        height: "100vh",
        width: "100vw",
        overflowY: "scroll",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: "$4",
      },
    },
  },
});

const MobileTopBar = () => {
  const dispatch = useDispatch();

  return (
    <MobileTopbarContainer onClick={() => dispatch(toggle())}>
      <Logo expanded />
    </MobileTopbarContainer>
  );
};

export const MobileNav = () => {
  const expanded = useSelector(
    (state: RootState) => state.root.navigation.toggle.expanded
  );

  return (
    <MobileItemContainer expanded={expanded}>
      <MobileTopBar />
    </MobileItemContainer>
  );
};
