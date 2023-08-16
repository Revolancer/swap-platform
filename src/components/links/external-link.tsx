import { Link } from '@revolancer/ui/buttons';
import { useState } from 'react';
import { WarningForExternalLinksModal } from '../modals/warning-for-external-links-modal';

const isInternalLink = (link: string) => {
  const whitelistHosts = ['revolancer.com', 'app.revolancer.com'];
  const linkHost = new URL(link).host;

  return whitelistHosts.includes(linkHost);
};

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
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={(e) => {
          if (!isInternalLink(href)) {
            e.preventDefault();
            setIsOpen(true);
          }
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
