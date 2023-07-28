import { Card } from '@/components/layout/cards';
import { Flex } from '@/components/layout/flex';
import { Div } from '@/components/layout/utils';
import { H5 } from '@/components/text/headings';
import { axiosPrivate } from '@/lib/axios';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { styled } from 'stitches.config';

export const BalanceTile = () => {
  const [credits, setCredits] = useState(0);
  useEffect(() => {
    axiosPrivate
      .get('credits')
      .then((response) => {
        setCredits(response.data);
      })
      .catch((e) => setCredits(0));
  }, []);

  const Price = styled('span', {
    color: '$pink500',
    fontFamily: '$heading',
    fontWeight: '$bold',
  });
  const CreditLabel = styled('span', {
    fontSize: '$body1',
    fontFamily: '$heading',
    fontWeight: '$bold',
  });

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
