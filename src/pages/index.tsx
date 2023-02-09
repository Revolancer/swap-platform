import { MainGrid, FullWidth } from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { Button, FormButton } from "@/components/navigation/button";
import { H1, H2, H3, H4, H5 } from "@/components/text/headings";

export default function Home() {
  return (
    <>
      <MainGrid undecorated>
        <FullWidth>
          <Flex column gap="3">
            <div>
              <H1>Revolancer</H1>
              <H2>Revolancer</H2>
              <H3>Revolancer</H3>
              <H4>Revolancer</H4>
              <H5>Revolancer</H5>
            </div>
            <Flex wrap gap="3">
              <FormButton size="small">Button</FormButton>
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
