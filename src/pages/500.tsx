import { PrimaryLayout } from "@/components/layout/layouts";
import { Title } from "@/components/head/title";
import { FeedSegment } from "@/components/dashboard/feedsegment";
import { FullWidth } from "@/components/layout/columns";
import { H1 } from "@/components/text/headings";
import { P } from "@/components/text/text";
import { Button } from "@/components/navigation/button";
import Image from "next/image";
import { Flex } from "@/components/layout/flex";
import { CrumbBar } from "@/components/navigation/crumbs/crumbbar";
import { Crumb } from "@/components/navigation/crumbs/crumb";

export default function FiveHundred() {
  return (
    <>
      <Title>Uh-Oh</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/">Discovery</Crumb>
          <Crumb href="/" active>
            Oops!
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Flex column gap={3} css={{ width: "100%", alignItems: "center" }}>
            <H1>500</H1>
            <Image
              src="/img/revy/happy.png"
              alt="Revy, happy to guide you back to safety"
              width={210}
              height={314}
            />
            <P>Oh no! Something went wrong.</P>
            <Button href="/" replace>
              Take me back
            </Button>
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
