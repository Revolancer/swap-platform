import { Title } from "@/components/head/title";
import { FullWidth } from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { PrimaryLayout } from "@/components/layout/layouts";
import { ChangeEmail } from "@/components/settings/change-email";
import { SettingsTabs } from "@/components/settings/tabs";
import { H1 } from "@/components/text/headings";

export default function Settings() {
  return (
    <>
      <Title>Settings</Title>
      <PrimaryLayout>
        <FullWidth>
          <Flex column gap={6}>
            <H1>Settings</H1>
            <SettingsTabs />
            <ChangeEmail />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
