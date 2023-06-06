import { Title } from "@/components/head/title";
import { FullWidth } from "@/components/layout/columns";
import { Flex } from "@/components/layout/flex";
import { PrimaryLayout } from "@/components/layout/layouts";
import { Crumb } from "@/components/navigation/crumbs/crumb";
import { CrumbBar } from "@/components/navigation/crumbs/crumbbar";
import { ChangeEmailPreferences } from "@/components/settings/change-email-preferences";
import { SettingsTabs } from "@/components/settings/tabs";
import { H1 } from "@/components/text/headings";
import Head from "next/head";

export default function EmailSettings() {
  return (
    <>
      <Title>Settings</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/settings">Settings</Crumb>
          <Crumb href="/settings/email" active>
            Email Preferences
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Flex column gap={6}>
            <H1>Settings</H1>
            <SettingsTabs />
            <ChangeEmailPreferences />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
