import { Tabs } from '@revolancer/ui/navigation';

export const ProjectTabs = () => {
  const routes = {
    root: {
      projects: 'Dashboard',
    },
    paths: {
      active: 'Active Projects',
      needs: 'My Needs',
      proposals: 'Outgoing Proposals',
      completed: 'Completed Projects',
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
