import { Title } from '@/components/head/title';
import { PrimaryLayout } from '@/components/layout/layouts';
import { ChangeEmailPreferences } from '@/components/settings/change-email-preferences';
import { SettingsTabs } from '@/components/settings/tabs';
import Head from 'next/head';
import { FullWidth, Flex } from '@revolancer/ui/layout';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { H1 } from '@revolancer/ui/text';

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
