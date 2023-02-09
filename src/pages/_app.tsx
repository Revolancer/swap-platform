import type { AppProps } from "next/app";
import { Source_Sans_Pro } from "@next/font/google";

const sans = Source_Sans_Pro({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={sans.className}>
      <Component {...pageProps} />
    </main>
  );
}
