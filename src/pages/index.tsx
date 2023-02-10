import { FullWidth, HalfWidth } from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { PrimaryLayout } from "@/components/layout/layouts";
import {
  Button,
  FormButton,
  Link,
  TertiaryButton,
  TertiaryFormButton,
} from "@/components/navigation/button";
import { H1, H2, H3, H4, H5 } from "@/components/text/headings";

export default function Home() {
  return (
    <>
      <PrimaryLayout>
        <HalfWidth css={{ backgroundColor: "red", height: "200px" }} />
        <HalfWidth css={{ backgroundColor: "blue", height: "200px" }} />
        <FullWidth>
          <Flex column gap="3">
            <Flex column gap="3">
              <H2>Headings</H2>
              <H1>Revolancer</H1>
              <H2>Revolancer</H2>
              <H3>Revolancer</H3>
              <H4>Revolancer</H4>
              <H5>Revolancer</H5>
            </Flex>
            <Flex column gap="3">
              <H2>Buttons</H2>
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
              <Flex wrap gap="3">
                <TertiaryFormButton>Button</TertiaryFormButton>
                <TertiaryButton disabled>Button</TertiaryButton>
                <Link>Link</Link>
                <Link disabled>Link</Link>
              </Flex>
              <Flex wrap gap="3">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur sed leo ex. Ut vulputate eleifend dignissim. Cras
                  porttitor, arcu non accumsan pellentesque, felis erat
                  imperdiet urna, vitae ornare felis massa in enim. Cras et ex
                  diam. Fusce rhoncus erat eros, ut congue arcu tristique quis.
                  Sed a leo lobortis, aliquam orci mollis, condimentum augue.
                  Nam mattis ac ligula sit amet efficitur. Nunc nunc urna,
                  dapibus eu cursus vel, dictum et ligula. Vivamus mi nulla,
                  vulputate sit amet imperdiet eget, vulputate ut mauris. In in
                  tristique purus. Vivamus mauris ante, convallis at iaculis ut,
                  consequat eu justo.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur sed leo ex. Ut vulputate eleifend dignissim. Cras
                  porttitor, arcu non accumsan pellentesque, felis erat
                  imperdiet urna, vitae ornare felis massa in enim. Cras et ex
                  diam. Fusce rhoncus erat eros, ut congue arcu tristique quis.
                  Sed a leo lobortis, aliquam orci mollis, condimentum augue.
                  Nam mattis ac ligula sit amet efficitur. Nunc nunc urna,
                  dapibus eu cursus vel, dictum et ligula. Vivamus mi nulla,
                  vulputate sit amet imperdiet eget, vulputate ut mauris. In in
                  tristique purus. Vivamus mauris ante, convallis at iaculis ut,
                  consequat eu justo.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur sed leo ex. Ut vulputate eleifend dignissim. Cras
                  porttitor, arcu non accumsan pellentesque, felis erat
                  imperdiet urna, vitae ornare felis massa in enim. Cras et ex
                  diam. Fusce rhoncus erat eros, ut congue arcu tristique quis.
                  Sed a leo lobortis, aliquam orci mollis, condimentum augue.
                  Nam mattis ac ligula sit amet efficitur. Nunc nunc urna,
                  dapibus eu cursus vel, dictum et ligula. Vivamus mi nulla,
                  vulputate sit amet imperdiet eget, vulputate ut mauris. In in
                  tristique purus. Vivamus mauris ante, convallis at iaculis ut,
                  consequat eu justo.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur sed leo ex. Ut vulputate eleifend dignissim. Cras
                  porttitor, arcu non accumsan pellentesque, felis erat
                  imperdiet urna, vitae ornare felis massa in enim. Cras et ex
                  diam. Fusce rhoncus erat eros, ut congue arcu tristique quis.
                  Sed a leo lobortis, aliquam orci mollis, condimentum augue.
                  Nam mattis ac ligula sit amet efficitur. Nunc nunc urna,
                  dapibus eu cursus vel, dictum et ligula. Vivamus mi nulla,
                  vulputate sit amet imperdiet eget, vulputate ut mauris. In in
                  tristique purus. Vivamus mauris ante, convallis at iaculis ut,
                  consequat eu justo.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur sed leo ex. Ut vulputate eleifend dignissim. Cras
                  porttitor, arcu non accumsan pellentesque, felis erat
                  imperdiet urna, vitae ornare felis massa in enim. Cras et ex
                  diam. Fusce rhoncus erat eros, ut congue arcu tristique quis.
                  Sed a leo lobortis, aliquam orci mollis, condimentum augue.
                  Nam mattis ac ligula sit amet efficitur. Nunc nunc urna,
                  dapibus eu cursus vel, dictum et ligula. Vivamus mi nulla,
                  vulputate sit amet imperdiet eget, vulputate ut mauris. In in
                  tristique purus. Vivamus mauris ante, convallis at iaculis ut,
                  consequat eu justo.
                </p>
              </Flex>
            </Flex>
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
