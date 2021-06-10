import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import PlotsView from './pages/PlotsView';

export default function AppRoutes() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={PlotsView} />
    </Switch>
  );
}
