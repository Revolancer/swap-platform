import { Flex } from "@/components/layout/flex";
import { Button } from "@/components/navigation/button";

export default function Home() {
  return (
    <>
      <Flex css={{ $$gap: "12px", $$wrap: "wrap" }}>
        <Button href="/home" size="small">
          Button
        </Button>
        <Button href="/home" size="medium">
          Button
        </Button>
        <Button href="/home" size="large">
          Button
        </Button>
      </Flex>
    </>
  );
}
