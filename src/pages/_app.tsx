import store from "@/redux/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { darkTheme } from "stitches.config";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div id="mainctx" className={darkTheme}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}
