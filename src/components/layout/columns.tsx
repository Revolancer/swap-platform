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

export const MainGrid = styled("div", {
  maxWidth: "328px",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  marginInline: "auto",
  gap: "$4",

  "@sm": {
    maxWidth: "552px",
    paddingInlineStart: "72px",
    gridTemplateColumns: "repeat(8, 1fr)",
  },
  "@md": {
    maxWidth: "841px",
    paddingInlineStart: "85px",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: "$3",
  },
  "@lg": {
    maxWidth: "880px",
    paddingInlineStart: "0",
    gap: "$6",
  },
  "@xl": {
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
