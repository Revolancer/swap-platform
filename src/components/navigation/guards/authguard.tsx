import { FullWidth } from "@/components/layout/columns";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const AuthGuard = ({
  redirectTo,
  redirectIfAuthed = false,
  children,
}: {
  redirectTo?: string;
  redirectIfAuthed?: boolean;
  children?: any;
}) => {
  const router = useRouter();
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
  }, []);
  const authed = useAppSelector((state) => state.userData.user != null);
  if (!didMount) {
    return <FullWidth placeholder />;
  }
  var defaultRedirect = "/";
  if (!redirectIfAuthed) {
    defaultRedirect = "/login";
  }
  if ((authed && redirectIfAuthed) || (!authed && !redirectIfAuthed)) {
    router.replace(redirectTo ?? defaultRedirect);
    return <FullWidth placeholder />;
  } else {
    return <>{children}</>;
  }
};
