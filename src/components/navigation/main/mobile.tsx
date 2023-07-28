import { Logo } from "@/components/branding/logo";
import { RootState, useAppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { darkTheme, styled } from "stitches.config";
import { contract, expand, toggle } from "./nav-toggle";
import { Div } from "@/components/layout/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAnglesUp } from "@fortawesome/free-solid-svg-icons";

const MobileTopbarContainer = styled("div", {
  display: "flex",
  width: "100%",
  padding: "$5",
  height: "56px",
  justifyContent: "space-between",
  alignItems: "center",
});

const MobileItemContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  height: "56px",
  transition: "height 0.2s ease-in-out",
  backgroundColor: "$navy900",
  "@sm": {
    display: "none",
  },

  variants: {
    expanded: {
      true: {
        height: "100dvh",
        width: "100vw",
        overflowY: "scroll",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: "$4",
      },
    },
  },
  [`.${darkTheme} &`]: {
    backgroundColor: "$black",
  },
});

const MobileTopBar = ({ expanded = false }: { expanded: boolean }) => {
  const dispatch = useDispatch();

  return (
    <MobileTopbarContainer onClick={() => dispatch(toggle())}>
      <Logo expanded />
      {expanded && (
        <FontAwesomeIcon icon={faAnglesUp} style={{ fontSize: "1.4rem" }} />
      )}
      {!expanded && (
        <FontAwesomeIcon icon={faAnglesDown} style={{ fontSize: "1.4rem" }} />
      )}
    </MobileTopbarContainer>
  );
};

export const MobileNav = ({ items }: { items: any }) => {
  const dispatch = useAppDispatch();
  const expanded = useSelector(
    (state: RootState) => state.navigation.toggle.expanded,
  );

  return (
    <MobileItemContainer expanded={expanded}>
      <MobileTopBar expanded={expanded} />
      {expanded && (
        <Div
          css={{ paddingInline: "$6", height: "100%", marginBlockEnd: "$10" }}
          id="container-113"
          onClick={(e) => {
            const id = (e.target as HTMLElement).id;
            if (id !== "container-113" && id !== "container-112") {
              if (expanded) dispatch(contract());
            }
          }}
        >
          {items}
        </Div>
      )}
    </MobileItemContainer>
  );
};
