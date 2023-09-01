import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { Button, TertiaryButton, UnstyledLink } from '@revolancer/ui/buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { P } from '@revolancer/ui/text';
import { Card, Flex } from '@revolancer/ui/layout';
import { Feedback } from '@revolancer/ui/forms';

const customStyles: Modal.Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'none',
    border: 'none',
    overflow: 'visible',
    padding: '0',
  },
};

export const RequestCancellationModal = ({
  requestCancellation,
  setOpen,
}: {
  requestCancellation: () => void;
  setOpen: (open: boolean) => void;
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setIsOpen(false);
  };
  useEffect(() => {
    openModal();
  }, []);
  Modal.setAppElement('#__next');
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <Card css={{ color: '$neutral700', maxWidth: '550px' }}>
        <Flex
          css={{
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <P>
            <strong>Are you sure?</strong>
          </P>
          <UnstyledLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
            css={{ color: '$neutral600' }}
          >
            <FontAwesomeIcon icon={faClose} />
          </UnstyledLink>
        </Flex>
        <P>
          We&rsquo;ll notify the other user and once they agree to cancel, the
          project will be permanently closed. Completing this project and any
          further communication within this chat will not be possible.
        </P>
        <Feedback state="warning">
          You will not be able to undo this action.
        </Feedback>
        <Flex gap="5" css={{ alignItems: 'center' }}>
          <Button
            href="#"
            role="dangerous"
            size={'small'}
            onClick={(e) => {
              e.preventDefault();
              requestCancellation();
            }}
          >
            Cancel Project
          </Button>
          <TertiaryButton
            href="#"
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
          >
            Dismiss
          </TertiaryButton>
        </Flex>
      </Card>
    </Modal>
  );
};
