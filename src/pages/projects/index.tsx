import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import { FullWidth, TwoCols } from '@/components/layout/columns';
import { P } from '@/components/text/text';
import { WalletChart } from '@/components/project-hub/wallet/wallet-chart';
import { WalletTable } from '@/components/project-hub/wallet/wallet-table';
import { H1, H5 } from '@/components/text/headings';
import { ProjectTabs } from '@/components/project-hub/tabs';
import { Flex } from '@/components/layout/flex';
import { BalanceTile } from '@/components/project-hub/wallet/balance-tile';
import { ActiveProjectsTile } from '@/components/project-hub/active-projects-tile';
import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
import { Crumb } from '@/components/navigation/crumbs/crumb';

export default function CreditDashboard() {
  return (
    <>
      <Title>Your Wallet</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/projects">Project Hub</Crumb>
          <Crumb href="/projects" active>
            Dashboard
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Flex column>
            <H1>Project Hub</H1>
            <ProjectTabs />
            <TwoCols>
              <BalanceTile />
              <ActiveProjectsTile />
            </TwoCols>
            <H5>Transaction History</H5>
            <P css={{ color: '$neutral800' }}>
              This is an overview of your transactions
            </P>
            <WalletChart />
            <WalletTable />
          </Flex>
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
