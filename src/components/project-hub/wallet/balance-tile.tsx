import { axiosPrivate } from '@/lib/axios';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Card, Flex } from '@revolancer/ui/layout';
import { H5 } from '@revolancer/ui/text';
import { Price, CreditLabel } from '@revolancer/ui/project-hubs';
import { WalletTileSkeleton } from '@/components/skeletons/wallet-tile';

export const BalanceTile = () => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axiosPrivate
      .get('credits')
      .then((response) => {
        setCredits(response.data);
      })
      .catch((e) => setCredits(0));
    setLoading(false);
  }, []);

  if (loading) return <WalletTileSkeleton />;

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
