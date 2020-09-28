import React, { lazy } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';


const PlotsView = lazy(() => import('./pages/PlotsView'));

export default function AppRoutes() {

  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={ path } component={ PlotsView } />
    </Switch>
  );
}
