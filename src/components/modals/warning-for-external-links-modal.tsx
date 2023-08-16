import Modal from 'react-modal';
import { Dispatch, SetStateAction } from 'react';
import { P } from '../text/text';
import { Card } from '../layout/cards';
import { Flex } from '../layout/flex';
import { Link, Button } from '@revolancer/ui/buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

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

export const WarningForExternalLinksModal = ({
  externalLink,
  setIsOpen,
  modalIsOpen,
  openModal,
  closeModal,
}: {
  externalLink: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  modalIsOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}) => {
  const router = useRouter();

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <Card css={{ color: '$neutral700', maxWidth: '550px' }}>
        <Flex css={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <P>
            <strong>🚨 You’re leaving Revolancer</strong>
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
        <P css={{ color: '#6C757D' }}>Please press Continue to visit: </P>
        <P css={{ maxHeight: '150px', overflow: 'auto' }}>{externalLink}</P>
        <Flex gap="5" css={{ alignItems: 'center', marginTop: '$2' }}>
          <Button
            css={{
              backgroundColor: '$White',
              color: '#212529',
              borderColor: '$borders',
              '&:hover': {
                color: 'white',
              },
              fontSize: '$small',
              fontWeight: '$normal',
            }}
            href={externalLink}
          >
            Continue
          </Button>
          <Button
            css={{
              backgroundColor: '$White',
              color: '#212529',
              borderColor: '$borders',
              '&:hover': {
                color: 'white',
              },
              fontSize: '$small',
              fontWeight: '$normal',
            }}
            onClick={(e) => {
              e.preventDefault();
              closeModal();
            }}
            href="#"
          >
            Back
          </Button>
        </Flex>
        <P css={{ color: '#6C757D' }}>
          Revolancer is not responsible for content on external websites.
        </P>
      </Card>
    </Modal>
  );
};
