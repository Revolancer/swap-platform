import { Title } from '@/components/head/title';
import { FullWidth } from '@/components/layout/columns';
import { Flex } from '@/components/layout/flex';
import { PrimaryLayout } from '@/components/layout/layouts';
import { Crumb } from '@/components/navigation/crumbs/crumb';
import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
import { ChangeEmail } from '@/components/settings/change-email';
import { ChangeExperience } from '@/components/settings/change-experience';
import { ChangeHourlyRate } from '@/components/settings/change-hourly-rate';
import { ChangePassword } from '@/components/settings/change-password';
import { DeleteAccount } from '@/components/settings/delete-account';
import { SettingsTabs } from '@/components/settings/tabs';
import { H1 } from '@/components/text/headings';

export default function Settings() {
  return (
    <>
      <Title>Settings</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/settings">Settings</Crumb>
          <Crumb href="/settings" active>
            Account Details
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Flex column gap={6}>
            <H1>Settings</H1>
            <SettingsTabs />
            <ChangeEmail />
            <ChangePassword />
            <ChangeHourlyRate />
            <ChangeExperience />
            <DeleteAccount />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
