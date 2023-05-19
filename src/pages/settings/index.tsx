import { Title } from "@/components/head/title";
import { FullWidth } from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { PrimaryLayout } from "@/components/layout/layouts";
import { ChangeEmail } from "@/components/settings/change-email";
import { ChangeExperience } from "@/components/settings/change-experience";
import { ChangeHourlyRate } from "@/components/settings/change-hourly-rate";
import { ChangePassword } from "@/components/settings/change-password";
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
            <ChangePassword />
            <ChangeHourlyRate />
            <ChangeExperience />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
