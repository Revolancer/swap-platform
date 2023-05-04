import { FullWidth } from "@/components/layout/columns";
import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const OnboardingGuard = ({ children }: { children?: any }) => {
  const router = useRouter();
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
  if (onboarding <= 3 && router.pathname != target) {
    router.replace(target);
    return <FullWidth placeholder />;
  } else if (
    onboarding > 3 &&
    router.pathname.substring(0, 12) == "/get-started"
  ) {
    router.replace("/");
    return <FullWidth placeholder />;
  } else {
    return <>{children}</>;
  }
};
