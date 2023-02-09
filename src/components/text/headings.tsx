import { styled } from "stitches.config";
import { Montserrat } from "@next/font/google";

const font = Montserrat({
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

const H1styled = styled("h1", {
  fontSize: "48px",
  lineHeight: "60px",
  fontWeight: "700",

  "@sm": {
    fontSize: "60px",
    lineHeight: "72px",
  },
});

export function H1(props: any): JSX.Element {
  return <H1styled className={font.className}>{props.children}</H1styled>;
}

const H2styled = styled("h2", {
  fontSize: "40px",
  lineHeight: "48px",
  fontWeight: "700",

  "@sm": {
    fontSize: "48px",
    lineHeight: "64px",
  },
});

export function H2(props: any): JSX.Element {
  return <H2styled className={font.className}>{props.children}</H2styled>;
}

const H3styled = styled("h3", {
  fontSize: "32px",
  lineHeight: "40px",
  fontWeight: "500",

  "@sm": {
    fontSize: "40px",
    lineHeight: "48px",
  },
});

export function H3(props: any): JSX.Element {
  return <H3styled className={font.className}>{props.children}</H3styled>;
}

const H4styled = styled("h4", {
  fontSize: "24px",
  lineHeight: "32px",
  fontWeight: "400",

  "@sm": {
    fontSize: "28px",
    lineHeight: "40px",
  },
});

export function H4(props: any): JSX.Element {
  return <H4styled className={font.className}>{props.children}</H4styled>;
}

const H5styled = styled("h5", {
  fontSize: "18px",
  lineHeight: "28px",
  fontWeight: "700",
  textTransform: "uppercase",
});

export function H5(props: any): JSX.Element {
  return <H5styled className={font.className}>{props.children}</H5styled>;
}
