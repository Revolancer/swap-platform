import { FullWidth } from "@/components/layout/columns";
import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";

export const OnboardingGuard = ({ children }: { children?: any }) => {
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
  }, []);
  const onboarded = useAppSelector(
    (state) => state.userData.user?.onboardingComplete ?? false
  );
  if (!didMount) {
    return <FullWidth placeholder />;
  }
  console.log("onboarded?", onboarded);
  if (!onboarded) {
    if (typeof window != "undefined") {
      window.location.href = "/get-started/";
    }
    return <FullWidth placeholder />;
  } else {
    return <>{children}</>;
  }
};
