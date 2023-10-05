import { axiosPrivate } from '@/lib/axios';
import { faBarsStaggered, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { styled } from '@revolancer/ui';
import { Flex, Card } from '@revolancer/ui/layout';
import { H5, Span } from '@revolancer/ui/text';
import { WalletTileSkeleton } from '../skeletons/wallet-tile';
import { Link } from '@revolancer/ui/buttons';

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
      <Span
        css={{
          fontSize: '$body2',
          lineHeight: '$body2',
          color: '$neutral700',
        }}
      >
        💡 Learn more about service exchanges{' '}
        <Link
          href="https://support.revolancer.com/hc/en-gb/articles/13835195587229-How-Do-Service-Exchanges-Work-"
          target="_blank"
        >
          here
        </Link>
        .
      </Span>
    </Card>
  );
};
