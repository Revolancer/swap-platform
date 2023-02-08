import { Flex } from "@/components/layout/flex";
import { Button } from "@/components/navigation/button";

export default function Home() {
  return (
    <>
      <Flex css={{ $$gap: "12px", $$direction: "column" }}>
        <Flex css={{ $$gap: "12px", $$wrap: "wrap", $$direction: "row" }}>
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
        <Flex css={{ $$gap: "12px", $$wrap: "wrap", $$direction: "row" }}>
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
    </>
  );
}
