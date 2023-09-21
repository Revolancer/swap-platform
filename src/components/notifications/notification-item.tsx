import { Notification } from '@/lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { TertiaryButton } from '@revolancer/ui/buttons';
import { axiosPrivate } from '@/lib/axios';
import { P } from '@revolancer/ui/text';
import { Div } from '@revolancer/ui/layout';
import { useAppDispatch } from '@/redux/store';
import { getNotifications } from '@/lib/notifications';

export const NotificationItem = ({
  notification,
}: {
  notification: Notification;
}) => {
  const dispatch = useAppDispatch();

  const handleReadNotification = () => {
    axiosPrivate.post(`notifications/acknowledge/${notification.id}`);
    dispatch(getNotifications());
  };
  return (
    <TertiaryButton
      href={notification.url}
      onClick={() => handleReadNotification}
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: '$1',
        borderColor: '$neutral400',
        boxShadow: '$2',
        padding: '$8',
        margin: '$2',
        borderRadius: '$2',

        '&:hover': {
          boxShadow: '$1',
        },
      }}
    >
      <P>
        {notification.message}
        {!notification.read && (
          <Div css={{ position: 'relative', display: 'inline' }}>
            <Div
              css={{
                position: 'absolute',
                width: '$4',
                height: '$4',
                borderRadius: '100%',
                backgroundColor: '$pink500',
                top: '0.25rem',
                right: '-1rem',
              }}
            ></Div>
          </Div>
        )}
      </P>
      <FontAwesomeIcon icon={faChevronRight} />
    </TertiaryButton>
  );
};
