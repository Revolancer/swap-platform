import Modal from 'react-modal';
import { Link, Button } from '@revolancer/ui/buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClose,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { P } from '@revolancer/ui/text';
import { Card, Flex } from '@revolancer/ui/layout';

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

export const DeleteAccountModal = ({
  onDelete,
  selectedUsers,
  modalIsOpen,
  closeModal,
}: {
  onDelete: () => void;
  selectedUsers: string[];
  modalIsOpen: boolean;
  closeModal: () => void;
}) => {
  const router = useRouter();
  Modal.setAppElement('#__next');

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <Card css={{ color: '$neutral900', maxWidth: '550px' }}>
        <Flex css={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <P>
            <strong>Delete Account</strong>
          </P>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
            css={{ color: '$neutral600' }}
          >
            <FontAwesomeIcon icon={faClose} />
          </Link>
        </Flex>
        <P css={{ color: '$neutral700' }}>
          This action will affect the following users:
        </P>
        <P css={{ color: '$neutral700' }}>{selectedUsers.join(', ')}</P>
        <P css={{ color: '$red600', marginRight: '$2' }}>
          <FontAwesomeIcon icon={faTriangleExclamation} />
          Deleted accounts cannot be retrieved
        </P>
        <Flex gap="5" css={{ alignItems: 'center', marginTop: '$2' }}>
          <Button
            role="primary"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onDelete();
              closeModal();
            }}
          >
            Delete
          </Button>
          <Button
            role={'secondary'}
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
            href="#"
          >
            cancel
          </Button>
        </Flex>
      </Card>
    </Modal>
  );
};
