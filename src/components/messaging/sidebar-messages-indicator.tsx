import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { styled } from '@revolancer/ui';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { Div } from '@revolancer/ui/layout';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getMessagesUnread, setMessagesUnread } from '@/lib/notifications';

export const SidebarMessagesIndicator = ({
  expanded,
}: {
  expanded: boolean;
}) => {
  const countUnread = useAppSelector((state) => state.indicator.messagesUnread);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkUnreadMessageCount = () => {
      dispatch(getMessagesUnread());
    };
    checkUnreadMessageCount();
    const timer = setInterval(checkUnreadMessageCount, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, [dispatch]);

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
