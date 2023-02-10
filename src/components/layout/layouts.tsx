import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "stitches.config";
import { MainNav } from "../navigation/main/main-nav";
import { contract } from "../navigation/main/nav-toggle";
import { ColumnLayout } from "./columns";

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
  backgroundColor: "$white",

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
          <ColumnLayout>{children}</ColumnLayout>
        </MainGridInner>
      </MainGridOuter>
    </>
  );
};
