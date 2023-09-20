import { Tabs } from '@revolancer/ui/navigation';
import { useRouter } from 'next/router';

export const ManageUserTabs = () => {
  const router = useRouter();
  const { id } = router.query;
  const routes = {
    root: {
      [`admin/users/${id}`]: 'User Profile',
    },
    paths: {
      settings: 'Account Settings',
      wallet: 'Wallet',
      posts: 'User Posts',
      email_prefs: 'Preferences',
      messages: 'Messages',
      projects: 'Active Projects',
      projects_completed: 'Completed Projects',
    },
  };

  return (
    <>
      <Tabs
        root={Object.keys(routes.root)[0]}
        rootName={Object.values(routes.root)[0]}
        routes={Object.keys(routes.paths)}
        routeNames={Object.values(routes.paths)}
      />
    </>
  );
};
