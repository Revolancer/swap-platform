import { Turnstile as CfTurnstile } from "@marsidev/react-turnstile";
import { darkTheme } from "stitches.config";

var isDarkModeTurnstile = false;

if (typeof document != "undefined") {
  const ctx = document.getElementById("mainctx");
  isDarkModeTurnstile = ctx?.classList.contains(darkTheme) ?? false;
}

export const Turnstile = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (token: string) => void;
  onError?: () => void;
}) => {
  return (
    <CfTurnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY ?? ""}
      options={{ theme: isDarkModeTurnstile ? "dark" : "light" }}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
};
