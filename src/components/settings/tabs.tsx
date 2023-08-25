import { Tabs } from '@revolancer/ui/navigation';

export const SettingsTabs = () => {
  const routes = {
    root: {
      settings: 'Account Details',
    },
    paths: {
      email: 'Email Preferences',
    },
  };

  return (
    <Tabs
      root={Object.keys(routes.root)[0]}
      rootName={Object.values(routes.root)[0]}
      routes={Object.keys(routes.paths)}
      routeNames={Object.values(routes.paths)}
    />
  );
};
