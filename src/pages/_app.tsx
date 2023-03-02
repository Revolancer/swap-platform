import store from "@/redux/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <div id="mainctx" className={"" /*darkTheme*/}>
          <Component {...pageProps} />
        </div>
      </ChakraProvider>
    </Provider>
  );
}
