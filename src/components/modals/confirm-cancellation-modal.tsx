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

export const ConfirmCancellationModal = ({
  requestCancellation,
}: {
  requestCancellation: () => void;
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
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
            <strong>Do you want to cancel?</strong>
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
          To mutually close this project, click &ldquo;Cancel Project&rdquo; if
          you have no objections. For any disputes, please contact our support
          for assistance.
        </P>
        <Feedback state="warning">
          Cancelling projects can not be undone
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
          <Button href="https://support.revolancer.com/" role="secondary">
            Contact Support
          </Button>
        </Flex>
      </Card>
    </Modal>
  );
};
