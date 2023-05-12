import { PrimaryLayout } from "@/components/layout/layouts";
import { Title } from "@/components/head/title";
import { FullWidth } from "@/components/layout/columns";
import { H1 } from "@/components/text/headings";
import { ProjectTabs } from "@/components/project-hub/tabs";
import { Flex } from "@/components/layout/flex";
import { NeedsSegment } from "@/components/user/needssegment";
import store from "@/redux/store";

export default function CreditDashboard() {
  const self = store?.getState()?.userData?.user?.id ?? "";

  return (
    <>
      <Title>Your Wallet</Title>
      <PrimaryLayout>
        <FullWidth>
          <Flex column>
            <H1>Project Hub</H1>
            <ProjectTabs />
            <NeedsSegment uid={self} own />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
