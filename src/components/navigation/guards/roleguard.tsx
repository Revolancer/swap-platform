import { useAppSelector } from '@/redux/store';
import { useEffect, useState } from 'react';
import { FullWidth } from '@revolancer/ui/layout';

export const RoleGuard = ({
  roles = ['admin'],
  children,
}: {
  roles?: string[];
  children?: any;
}) => {
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
  }, []);
  const admin = useAppSelector((state) =>
    roles.some((role) => state.userData.user?.roles?.includes(role) ?? false),
  );
  if (!didMount) {
    return <FullWidth placeholder />;
  }
  if (!admin) {
    if (typeof window != 'undefined') {
      window.location.href = '/';
    }
    return <FullWidth placeholder />;
  } else {
    return <>{children}</>;
  }
};
