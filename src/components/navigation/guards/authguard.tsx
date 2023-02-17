import { FullWidth } from "@/components/layout/columns";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const AuthGuard = ({
  redirectTo,
  redirectIfAuthed = false,
  children,
}: {
  redirectTo?: string;
  redirectIfAuthed?: boolean;
  children?: any;
}) => {
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
  }, []);
  const authed = useSelector((state: RootState) => state.root.auth.authed);
  if (!didMount) {
    return <FullWidth placeholder />;
  }
  var defaultRedirect = "/";
  if (!redirectIfAuthed) {
    defaultRedirect = "/login";
  }
  if ((authed && redirectIfAuthed) || (!authed && !redirectIfAuthed)) {
    if (typeof window != "undefined") {
      window.location.href = redirectTo ?? defaultRedirect;
    }
    return <FullWidth placeholder />;
  } else {
    return <>{children}</>;
  }
};
