import { FullWidth } from "@/components/layout/columns";
import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";

export const OnboardingGuard = ({ children }: { children?: any }) => {
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
  }, []);
  const onboarding = useAppSelector(
    (state) => state.userData.user?.onboardingStage ?? 1
  );
  if (!didMount) {
    return <FullWidth placeholder />;
  }
  const target = `/get-started/${onboarding}`;
  if (onboarding <= 3 && window.location.pathname != target) {
    if (typeof window != "undefined") {
      window.location.href = target;
    }
    return <FullWidth placeholder />;
  } else {
    return <>{children}</>;
  }
};
