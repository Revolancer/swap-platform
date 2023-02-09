import { styled } from "stitches.config";

export const FullWidth = styled("div", {
  gridColumn: "auto / span 4",

  "@sm": {
    gridColumn: "auto / span 8",
  },
  "@md": {
    gridColumn: "auto / span 12",
  },
});

export const HalfWidth = styled("div", {
  gridColumn: "auto / span 4",

  "@md": {
    gridColumn: "auto / span 6",
  },
});

const MainGridInner = styled("div", {
  width: "100vw",
  position: "absolute",
  top: 0,
  left: 0,

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

const MainGridInnerInner = styled("div", {
  maxWidth: "328px",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  marginInline: "auto",
  gap: "$4",
  position: "relative",

  "@sm": {
    minWidth: "480px",
    maxWidth: "480px",
    gridTemplateColumns: "repeat(8, 1fr)",
  },
  "@md": {
    minWidth: "756px",
    maxWidth: "756px",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: "$3",
  },
  "@lg": {
    minWidth: "880px",
    maxWidth: "880px",
    paddingInlineStart: "0",
    gap: "$6",
  },
  "@xl": {
    minWidth: "1128px",
    maxWidth: "1128px",
  },

  variants: {
    undecorated: {
      true: {
        "@sm": {
          maxWidth: "536px",
          paddingInlineStart: "0",
        },
        "@md": {
          maxWidth: "857px",
          gap: "$6",
        },
        "@lg": {
          maxWidth: "880px",
        },
        "@xl": {
          maxWidth: "1128px",
        },
      },
    },
  },
});

const MainGridOuter = styled("div", {
  overflowX: "hidden",
  overflowY: "auto",
  width: "100%",
  height: "100vh",
  position: "relative",
});

export const MainGrid = ({
  expanded = false,
  undecorated = false,
  children,
}: {
  expanded?: boolean;
  undecorated?: boolean;
  children: any;
}) => {
  return (
    <MainGridOuter>
      <MainGridInner expanded={expanded}>
        <MainGridInnerInner undecorated={undecorated}>
          {children}
        </MainGridInnerInner>
      </MainGridInner>
    </MainGridOuter>
  );
};
