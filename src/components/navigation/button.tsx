import { Interactive } from "react-interactive";
import { darkTheme, styled } from "stitches.config";
import NextLink from "next/link";

const styles = {
  variants: {
    role: {
      primary: {
        backgroundColor: "$pink500",
        color: "$white",
        borderWidth: "$1",
        borderStyle: "$solid",
        borderColor: "$pink500",

        "&.hover": {
          backgroundColor: "$pink700",
          borderColor: "$pink700",
        },
        "&.active": {
          backgroundColor: "$pink800",
          borderColor: "$pink800",
        },
      },
      secondary: {
        backgroundColor: "$white",
        color: "$neutral900",
        borderWidth: "$1",
        borderStyle: "$solid",
        borderColor: "$neutral400",

        "&.hover": {
          backgroundColor: "$neutral100",
        },
        "&.active": {
          backgroundColor: "$neutral300",
        },

        [`.${darkTheme} &`]: {
          backgroundColor: "$neutral900",
          color: "$neutral100",
          borderColor: "$neutral800",

          "&.hover": {
            borderColor: "$neutral700",
            backgroundColor: "$neutral800",
          },
          "&.active": {
            borderColor: "$neutral600",
            backgroundColor: "$neutral700",
          },
        },
      },
    },
    size: {
      small: {
        paddingBlock: "$2",
        paddingInline: "$4",
      },
      medium: {
        paddingBlock: "$3",
        paddingInline: "$6",
      },
      large: {
        paddingBlock: "$4",
        paddingInline: "$7",
      },
    },
    disabled: {
      true: {
        pointerEvents: "none",
        cursor: "inherit",
      },
    },
  },
  display: "inline-block",
  borderRadius: "$1",
  textDecoration: "none",
  fontSize: "$body1",
  fontWeight: "$semibold",
  height: "max-content",
  width: "max-content",
  boxShadow: "$2",
  textTransform: "capitalize",
  compoundVariants: [
    {
      role: "primary",
      disabled: true,
      css: {
        opacity: "$opacity$700",
        backgroundColor: "$pink200",
        borderColor: "$pink200",
      },
    },
    {
      role: "secondary",
      disabled: true,
      css: {
        opacity: "$opacity$500",
        [`.${darkTheme} &`]: {
          opacity: "$opacity$500",
        },
      },
    },
  ],
  defaultVariants: {
    role: "primary",
    size: "medium",
    disabled: false,
  },
};

const tertiaryStyles = {
  color: "$neutral700",
  display: "inline",
  background: "none",
  border: "none",
  textDecoration: "none",
  fontSize: "$body2",
  fontWeight: "$normal",
  height: "max-content",
  width: "max-content",
  transition: "none",
  textTransform: "capitalize",
  padding: 0,

  "&.hover": {
    color: "$navy500",
  },
  "&.active": {
    color: "$navy500",
    fontWeight: "$semibold",
    textDecoration: "underline",
  },
  "&.disabled": {
    color: "$neutral900",
    opacity: "$opacity$500",
  },

  [`.${darkTheme} &`]: {
    color: "$white",

    "&.hover": {
      color: "$navy500",
    },
    "&.active": {
      color: "$navy500",
      fontWeight: "$semibold",
      textDecoration: "underline",
    },
    "&.disabled": {
      color: "$neutral100",
      opacity: "$opacity$500",
    },
  },
};

const linkStyles = {
  color: "$pink500",
  display: "inline",
  background: "none",
  border: "none",
  textDecoration: "none",
  fontSize: "$body2",
  fontWeight: "$normal",
  height: "max-content",
  width: "max-content",
  transition: "none",
  padding: 0,

  "&.hover": {
    color: "$pink600",
    textDecoration: "underline",
  },
  "&.active": {
    color: "$pink600",
    fontWeight: "$semibold",
    textDecoration: "underline",
  },
  "&.disabled": {
    color: "$neutral900",
    opacity: "$opacity$500",
  },
};

const unstyledLinkStyles = {
  textDecoration: "none",
  color: "inherit",
};

export const Button = styled(NextLink, styles);
export const FormButton = styled(Interactive.Button, styles);
export const TertiaryButton = styled(NextLink, tertiaryStyles);
export const TertiaryFormButton = styled(Interactive.Button, tertiaryStyles);
export const Link = styled(NextLink, linkStyles);
export const UnstyledLink = styled(NextLink, unstyledLinkStyles);
