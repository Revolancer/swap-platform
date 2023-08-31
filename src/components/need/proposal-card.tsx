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

export const ProposalCard = ({
  index,
  data,
}: {
  index: number;
  data: Proposal;
}) => {
  const router = useRouter();
  const own = (store?.getState().userData.user?.id ?? 'guest') == data.user.id;

  const [hasLoaded, setHasLoaded] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    axiosPrivate
      .get('credits')
      .then((response) => {
        setBalance(response.data);
        setHasLoaded(true);
      })
      .catch((e) => setBalance(0));
  }, []);

  const deleteProposal = async () => {
    await axiosPrivate.delete(`need/proposal/${data.id}`).catch((err) => {});
    router.reload();
  };

  const acceptProposal = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await axiosPrivate
      .put(`projects`, { need: data.need.id, proposal: data.id })
      .then((res) => res.data)
      .then((data) => router.replace(`/project/${data}`))
      .catch((err) => {});
  };

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
      {own && (
        <Flex gap={6} css={{ alignItems: 'center' }}>
          <ConfirmationDialog
            dangerous
            onAccept={deleteProposal}
            label="Delete"
            title="Deleting Proposal"
            labelAccept="Delete"
          />
        </Flex>
      )}
      {!own && hasLoaded && (
        <Flex gap={6} css={{ alignItems: 'center' }}>
          {balance >= data.price ? (
            <Button href="#" onClick={acceptProposal}>
              Accept
            </Button>
          ) : (
            <Flex column>
              <Button href="#" disabled>
                Accept
              </Button>
              <P css={{ color: '$neutral600' }}>
                You do not have enough credits for this. Please complete work
                for other users to earn more.
              </P>
            </Flex>
          )}
        </Flex>
      )}
    </Card>
  );
};
