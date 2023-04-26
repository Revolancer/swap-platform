import { styled } from "stitches.config";

export const FullWidth = styled("div", {
  gridColumn: "auto / span 4",

  "@sm": {
    gridColumn: "auto / span 8",
  },
  "@md": {
    gridColumn: "auto / span 12",
  },

  variants: {
    placeholder: {
      true: {
        height: "80vh",
        backgroundColor: "$neutral100",
        borderRadius: "$3",
        boxShadow: "$2",
      },
    },
  },
});

export const HalfWidth = styled("div", {
  gridColumn: "auto / span 4",

  "@md": {
    gridColumn: "auto / span 6",
  },
});

export const SideBar = styled("div", {
  padding: "$6",
  borderWidth: "$1",
  borderColor: "$neutral200",
  borderRadius: "$2",
  borderStyle: "$solid",
  gridColumn: "auto / span 4",

  "@sm": {
    gridColumn: "auto / span 3",
  },

  "@md": {
    gridColumn: "auto / span 4",
  },
});

export const MainContentWithSideBar = styled("div", {
  gridColumn: "auto / span 4",

  "@sm": {
    gridColumn: "auto / span 5",
  },

  "@md": {
    gridColumn: "auto / span 8",
  },
});

export const ColumnLayout = styled("div", {
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

export const TwoCols = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "$6",
  "@sm": {
    gridTemplateColumns: "1fr 1fr",
  },
});
