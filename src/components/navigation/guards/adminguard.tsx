import { useAppSelector } from '@/redux/store';
import { useEffect, useState } from 'react';
import { FullWidth } from '@revolancer/ui/layout';

export const AdminGuard = ({
  children,
}: {
  redirectTo?: string;
  redirectIfAuthed?: boolean;
  children?: any;
}) => {
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    setDidMount(true);
  }, []);
  const admin = useAppSelector(
    (state) => state.userData.user?.roles?.includes('admin') ?? false,
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
