import { PrimaryLayout } from "@/components/layout/layouts";
import { Title } from "@/components/head/title";
import { FeedSegment } from "@/components/dashboard/feedsegment";
import { FullWidth } from "@/components/layout/columns";
import { H1 } from "@/components/text/headings";
import { P } from "@/components/text/text";
import { Button } from "@/components/navigation/button";
import Image from "next/image";
import { Flex } from "@/components/layout/flex";

export default function FourOhFour() {
  return (
    <>
      <Title>Discover</Title>
      <PrimaryLayout>
        <FullWidth>
          <Flex column gap={3} css={{ width: "100%", alignItems: "center" }}>
            <H1>404</H1>
            <Image
              src="/img/revy/happy.png"
              alt="Revy, happy to guide you back to safety"
              width={210}
              height={314}
            />
            <P>Oops, looks like you&lsquo;re a little lost!</P>
            <Button href="/">Take me back</Button>
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
