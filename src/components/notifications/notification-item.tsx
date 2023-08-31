import { Notification } from '@/lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { UnstyledLink } from '@revolancer/ui/buttons';
import { axiosPrivate } from '@/lib/axios';
import { P } from '@revolancer/ui/text';
import { Div } from '@revolancer/ui/layout';

export const NotificationItem = ({
  notification,
}: {
  notification: Notification;
}) => {
  axiosPrivate.post(`notifications/acknowledge/${notification.id}`);
  return (
    <UnstyledLink
      href={notification.url}
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
    </UnstyledLink>
  );
};
