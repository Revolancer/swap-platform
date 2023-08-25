import { axiosPrivate } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { styled } from '@revolancer/ui';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { Div } from '@revolancer/ui/layout';

export const SidebarMessagesIndicator = ({
  expanded,
}: {
  expanded: boolean;
}) => {
  const [countUnread, setCountUnread] = useState(0);
  useEffect(() => {
    const checkUnreadMessageCount = async () => {
      await axiosPrivate
        .get('message/unread', {
          id: 'unread-message-count',
          cache: { ttl: 30 * 60 },
        })
        .then((res) => res.data)
        .then((data) => setCountUnread((data as number) ?? 0))
        .catch((err) => {});
    };
    checkUnreadMessageCount();
    const timer = setInterval(checkUnreadMessageCount, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const MessageBadgeContainer = styled(Link, {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: expanded ? 'flex-start' : 'center',
    fontSize: '$body1',
    gap: '$4',
    color: '$white',
    textDecoration: 'none',
  });
  return (
    <MessageBadgeContainer href="/message">
      <Div
        css={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FontAwesomeIcon icon={faMessage} style={{ fontSize: '1.4rem' }} />
        {countUnread > 0 && (
          <Div
            css={{
              position: 'absolute',
              width: '$4',
              height: '$4',
              borderRadius: '100%',
              backgroundColor: '$pink500',
              top: '-0.4rem',
              right: '-0.4rem',
            }}
          ></Div>
        )}
      </Div>
      {expanded && <span>Messages</span>}
    </MessageBadgeContainer>
  );
};
