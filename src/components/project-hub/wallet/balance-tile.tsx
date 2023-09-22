import { axiosPrivate } from '@/lib/axios';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Card, Flex } from '@revolancer/ui/layout';
import { H5 } from '@revolancer/ui/text';
import { Price, CreditLabel } from '@revolancer/ui/project-hubs';
import { WalletTileSkeleton } from '@/components/skeletons/wallet-tile';

export const BalanceTile = ({ id }: { id?: string }) => {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      axiosPrivate
        .get(`credits/admin/${id}`)
        .then((response) => {
          setCredits(response.data);
          setLoading(false);
        })
        .catch((e) => setCredits(0));
    } else {
      axiosPrivate
        .get('credits')
        .then((response) => {
          setCredits(response.data);
          setLoading(false);
        })
        .catch((e) => setCredits(0));
    }
  }, [id]);

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
