import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import { WalletChart } from '@/components/project-hub/wallet/wallet-chart';
import { WalletTable } from '@/components/project-hub/wallet/wallet-table';
import { ProjectTabs } from '@/components/project-hub/tabs';
import { BalanceTile } from '@/components/project-hub/wallet/balance-tile';
import { ActiveProjectsTile } from '@/components/project-hub/active-projects-tile';
import { FullWidth, Flex, TwoCols } from '@revolancer/ui/layout';
import { H1, H5, P } from '@revolancer/ui/text';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';

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
