import { Title } from '@/components/head/title';
import { PrimaryLayout } from '@/components/layout/layouts';
import { NotificationItem } from '@/components/notifications/notification-item';
import { axiosPrivate } from '@/lib/axios';
import { Notification } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FullWidth, Flex } from '@revolancer/ui/layout';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { P } from '@revolancer/ui/text';
import { SkeletonText } from '@revolancer/ui/skeleton';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPrivate
      .get('notifications')
      .then((res) => res.data)
      .then((data) => {
        setLoading(false);
        setNotifications(data);
      })
      .catch(() => setNotifications([]));
  }, []);

  const Skeleton = () => {
    return Array(4).fill(
      <SkeletonText
        css={{
          height: '80px',
          padding: '$8',
          margin: '$2',
          borderRadius: '$2',
        }}
      />,
    );
  };

  const MainContent = () => (
    <>
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
        <NotificationItem notification={notification} key={notification.id} />
      ))}
    </>
  );

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
        <FullWidth>{loading ? <Skeleton /> : <MainContent />}</FullWidth>
      </PrimaryLayout>
    </>
  );
}
