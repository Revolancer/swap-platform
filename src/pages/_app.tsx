import store from "@/redux/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { darkTheme } from "stitches.config";
import { Analytics } from "@vercel/analytics/react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact, {
  BugsnagPluginReactResult,
} from "@bugsnag/plugin-react";
import React from "react";
import FiveHundred from "./500";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  if (router.query?.ref) {
    setCookie("referrer", router.query.ref, {
      domain:
        process.env.NODE_ENV == "production" ? "revolancer.com" : undefined,
    });
  }
  const WrapInErrorBoundary = ({ children }: { children: any }) => {
    if (process.env.NEXT_PUBLIC_BUGSNAG_KEY) {
      Bugsnag.start({
        apiKey: process.env.NEXT_PUBLIC_BUGSNAG_KEY ?? "",
        plugins: [new BugsnagPluginReact()],
        releaseStage:
          process.env.NEXT_PUBLIC_BUGSNAG_RELEASE_STAGE ?? "development",
      });
      const plugin = Bugsnag.getPlugin("react") as BugsnagPluginReactResult;
      const ErrorBoundary = plugin.createErrorBoundary(React);
      return (
        <ErrorBoundary FallbackComponent={FiveHundred}>
          {children}
        </ErrorBoundary>
      );
    } else {
      return <>{children}</>;
    }
  };
  return (
    <>
      <WrapInErrorBoundary>
        <Provider store={store}>
          <div id="mainctx" className={"" /*darkTheme*/}>
            <Component {...pageProps} />
          </div>
        </Provider>
        <Analytics />
      </WrapInErrorBoundary>
    </>
  );
}
