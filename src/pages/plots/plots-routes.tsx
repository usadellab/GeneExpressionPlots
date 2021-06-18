import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import PlotsHome from './plots-home';

const AppRoutes: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={PlotsHome} />
    </Switch>
  );
};

export default AppRoutes;
