import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { styled } from '@revolancer/ui';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { Div } from '@revolancer/ui/layout';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getNotificationsUnread } from '@/lib/notifications';

export const SidebarNotificationIndicator = ({
  expanded,
}: {
  expanded: boolean;
}) => {
  const countUnread = useAppSelector((state) => state.indicator.notifsUnread);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkUnreadNotificationCount = () => {
      dispatch(getNotificationsUnread());
    };
    checkUnreadNotificationCount();
    const timer = setInterval(checkUnreadNotificationCount, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, [dispatch]);

  const NotificationBadgeContainer = styled(Link, {
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
    <NotificationBadgeContainer href="/notifications">
      <Div
        css={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FontAwesomeIcon icon={faBell} style={{ fontSize: '1.4rem' }} />
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
          />
        )}
      </Div>
      {expanded && <span>Notifications</span>}
    </NotificationBadgeContainer>
  );
};
