import { axiosPrivate } from '@/lib/axios';
import { faBarsStaggered, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { styled } from '@revolancer/ui';
import { Flex, Card } from '@revolancer/ui/layout';
import { H5 } from '@revolancer/ui/text';
import { WalletTileSkeleton } from '../skeletons/wallet-tile';

export const ActiveProjectsTile = () => {
  const [activeProjects, setActiveProjects] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPrivate
      .get('projects/active/count')
      .then((response) => {
        setActiveProjects(response.data);
      })
      .catch((e) => setActiveProjects(0));
    setLoading(false);
  }, []);

  const Price = styled('span', {
    color: '$pink500',
    fontFamily: '$heading',
    fontWeight: '$bold',
  });

  if (loading) return <WalletTileSkeleton />;

  return (
    <Card>
      <H5>Active Projects</H5>
      <Flex css={{ alignItems: 'center', fontSize: '$h2' }}>
        <FontAwesomeIcon icon={faBarsStaggered} />
        <Flex css={{ alignItems: 'baseline' }}>
          <Price>{activeProjects}</Price>
        </Flex>
      </Flex>
    </Card>
  );
};
