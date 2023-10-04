import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { Card, Flex } from '@revolancer/ui/layout';
import { H5 } from '@revolancer/ui/text';
import { Price, CreditLabel } from '@revolancer/ui/project-hubs';
import { WalletTileSkeleton } from '@/components/skeletons/wallet-tile';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getCredits } from '@/lib/user/wallet';

export const BalanceTile = ({ id }: { id?: string }) => {
  const { credits, loading } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getCredits(id));
    } else {
      dispatch(getCredits(''));
    }
  }, [id, dispatch]);

  if (loading && credits === 0) return <WalletTileSkeleton />;

  return (
    <Card>
      <H5>Current Balance</H5>
      <Flex css={{ alignItems: 'center', fontSize: '$h2' }}>
        <FontAwesomeIcon icon={faTicket} />
        <Flex css={{ alignItems: 'baseline' }}>
          <Price>{credits}</Price>
          <CreditLabel>credits</CreditLabel>
        </Flex>
      </Flex>
    </Card>
  );
};
