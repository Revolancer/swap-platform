import { axiosPrivate } from '@/lib/axios';
import { faBarsStaggered, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { styled } from '@revolancer/ui';
import { Flex, Card } from '@revolancer/ui/layout';
import { H5 } from '@revolancer/ui/text';
import { WalletTileSkeleton } from '../skeletons/wallet-tile';

export const ActiveProjectsTile = ({ id }: { id?: string }) => {
  const [activeProjects, setActiveProjects] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axiosPrivate
        .get(`admin/users/${id}/projects/active/count`)
        .then((response) => {
          setActiveProjects(response.data);
          setLoading(false);
        })
        .catch((e) => setActiveProjects(0));
    } else {
      axiosPrivate
        .get('projects/active/count')
        .then((response) => {
          setActiveProjects(response.data);
          setLoading(false);
        })
        .catch((e) => setActiveProjects(0));
    }
  }, [id]);

  const Price = styled('span', {
    color: '$pink500',
    fontFamily: '$heading',
    fontWeight: '$bold',
  });

  if (loading && activeProjects === 0) return <WalletTileSkeleton />;

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
