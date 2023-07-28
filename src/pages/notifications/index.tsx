import { Title } from '@/components/head/title';
import { FullWidth } from '@/components/layout/columns';
import { Flex } from '@/components/layout/flex';
import { PrimaryLayout } from '@/components/layout/layouts';
import { Div } from '@/components/layout/utils';
import { Crumb } from '@/components/navigation/crumbs/crumb';
import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
import { NotificationItem } from '@/components/notifications/notification-item';
import { P } from '@/components/text/text';
import { axiosPrivate } from '@/lib/axios';
import { Notification } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    axiosPrivate
      .get('notifications')
      .then((res) => res.data)
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]));
  }, []);

  return (
    <>
      <Title>Notifications</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/">Discovery</Crumb>
          <Crumb href="/notifications" active>
            Notifications
          </Crumb>
        </CrumbBar>
        <FullWidth>
          {notifications.length == 0 && (
            <Flex column gap={4} css={{ alignItems: 'center' }}>
              <Image
                src="/img/revy/happy.png"
                alt="Revy, happy to guide you back to safety"
                width={210}
                height={314}
              />
              <P>You have no notifications.</P>
            </Flex>
          )}
          {notifications.map((notification) => (
            <NotificationItem
              notification={notification}
              key={notification.id}
            />
          ))}
        </FullWidth>
      </PrimaryLayout>
    </>
  );
}
