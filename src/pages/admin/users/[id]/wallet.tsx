import { useRouter } from 'next/router';
import ManageUserLayout from '@/components/admin/user/layout';
import { Flex, TwoCols } from '@revolancer/ui/layout';
import { BalanceTile } from '@/components/project-hub/wallet/balance-tile';
import { ActiveProjectsTile } from '@/components/project-hub/active-projects-tile';
import { H5, P } from '@revolancer/ui/text';
import { WalletChart } from '@/components/project-hub/wallet/wallet-chart';
import { WalletTable } from '@/components/project-hub/wallet/wallet-table';
import { EditBalance } from '@/components/modals/admin-edit-balance-modal';

export default function UserWallet() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <ManageUserLayout>
      <Flex column>
        <Flex css={{ justifyContent: 'flex-end' }}>
          <EditBalance id={id?.toString()} />
        </Flex>
        <TwoCols>
          <BalanceTile id={id?.toString()} />
          <ActiveProjectsTile id={id?.toString()} />
        </TwoCols>
        <H5>Transaction History</H5>
        <P css={{ color: '$neutral800' }}>
          This is an overview of your transactions
        </P>
        <WalletChart id={id?.toString()} />
        <WalletTable id={id?.toString()} />
      </Flex>
    </ManageUserLayout>
  );
}
