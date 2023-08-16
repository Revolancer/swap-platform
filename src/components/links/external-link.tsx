import { Link } from '@revolancer/ui/buttons';
import { useState } from 'react';
import { WarningForExternalLinksModal } from '../modals/warning-for-external-links-modal';

export const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Link
        href={href}
        rel="noopener noreferrer nofollow"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        {children}
      </Link>
      <WarningForExternalLinksModal
        externalLink={href}
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        openModal={openModal}
        closeModal={closeModal}
      />
    </>
  );
};
