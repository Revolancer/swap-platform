import { MainGrid, FullWidth } from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { Button } from "@/components/navigation/button";
import { H1, H2, H3, H4, H5 } from "@/components/text/headings";

export default function Home() {
  return (
    <>
      <MainGrid undecorated>
        <FullWidth>
          <Flex column gap="3">
            <H1>Heading</H1>
            <H2>Heading</H2>
            <H3>Heading</H3>
            <H4>Heading</H4>
            <H5>Heading</H5>
            <Flex wrap gap="3">
              <Button href="#" size="small">
                Button
              </Button>
              <Button href="#" size="medium">
                Button
              </Button>
              <Button href="#" size="large">
                Button
              </Button>
              <Button href="#" size="large" disabled>
                Button
              </Button>
            </Flex>
            <Flex wrap gap="3">
              <Button href="#" size="small" role="secondary">
                Button
              </Button>
              <Button href="#" size="medium" role="secondary">
                Button
              </Button>
              <Button href="#" size="large" role="secondary">
                Button
              </Button>
              <Button href="#" size="large" role="secondary" disabled>
                Button
              </Button>
            </Flex>
          </Flex>
        </FullWidth>
      </MainGrid>
    </>
  );
}
