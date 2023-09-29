import Modal from 'react-modal';
import { ReactNode } from 'react';
import { Link, Button } from '@revolancer/ui/buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
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

export const AdminChangeRoleModal = ({
  onSave,
  RoleChangerComponent,
  modalIsOpen,
  closeModal,
}: {
  onSave: () => void;
  RoleChangerComponent: ReactNode;
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
            <strong>Change Role</strong>
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
        {RoleChangerComponent}
        <Flex gap="5" css={{ alignItems: 'center', marginTop: '$2' }}>
          <Button
            role="primary"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSave();
              closeModal();
            }}
          >
            Save
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
