import { Flex } from '@/components/layout/flex';
import { Div } from '@/components/layout/utils';
import { H5 } from '@/components/text/headings';
import { axiosPrivate } from '@/lib/axios';
import { faBarsStaggered, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { styled } from '@revolancer/ui';
import { Card } from '../layout/cards';

export const ActiveProjectsTile = () => {
  const [activeProjects, setActiveProjects] = useState(0);
  useEffect(() => {
    axiosPrivate
      .get('projects/active/count')
      .then((response) => {
        setActiveProjects(response.data);
      })
      .catch((e) => setActiveProjects(0));
  }, []);

  const Price = styled('span', {
    color: '$pink500',
    fontFamily: '$heading',
    fontWeight: '$bold',
  });

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
