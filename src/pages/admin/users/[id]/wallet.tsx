import { UserProfileData } from '@/lib/types';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ManageUserLayout from '@/components/admin/user/layout';
import { Flex, TwoCols } from '@revolancer/ui/layout';
import { BalanceTile } from '@/components/project-hub/wallet/balance-tile';
import { ActiveProjectsTile } from '@/components/project-hub/active-projects-tile';
import { H5, P } from '@revolancer/ui/text';
import { WalletChart } from '@/components/project-hub/wallet/wallet-chart';
import { WalletTable } from '@/components/project-hub/wallet/wallet-table';

export default function UserWallet() {
  const [profile, setProfile] = useState<UserProfileData>();
  const router = useRouter();
  const { id } = router.query;

  return (
    <ManageUserLayout>
      <Flex column>
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
    </ManageUserLayout>
  );
}
