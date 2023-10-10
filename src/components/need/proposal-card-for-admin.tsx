import { Button } from '@revolancer/ui/buttons';
import { Author } from '../user-posts/author';
import { Proposal } from '@/lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import store from '@/redux/store';
import { axiosPrivate } from '@/lib/axios';
import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useState } from 'react';
import { ConfirmationDialog } from '../navigation/confirmation-dialog';
import { P } from '@revolancer/ui/text';
import { Flex, Card } from '@revolancer/ui/layout';

export const ProposalCardForAdmin = ({
  index,
  data,
}: {
  index: number;
  data: Proposal;
}) => {
  const router = useRouter();

  return (
    <Card>
      <Author uid={data.user.id ?? ''} />
      <P css={{ fontSize: '$h5', fontWeight: '$bold' }}>
        <FontAwesomeIcon icon={faTicket} /> {data.price}
      </P>
      <P>
        {data.message.split('\n').map(function (item, idx) {
          return (
            <span key={`${data.id}-${idx}`}>
              {item}
              <br />
            </span>
          );
        })}
      </P>
      <Button href={`#`} role="primary">
        view more
      </Button>
    </Card>
  );
};
