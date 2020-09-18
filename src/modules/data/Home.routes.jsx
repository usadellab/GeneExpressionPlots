import React, { lazy } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';


const DataView = lazy(() => import('./pages/DataView'));
const GroupView = lazy(() => import('./pages/GroupView'));
const SampleView = lazy(() => import('./pages/SampleView'));

export default function AppRoutes() {

  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={ path } component={ DataView } />
      <Route path={ `${path}/group/:group/sample/:sample?` } component={ SampleView } />
      <Route path={ `${path}/group/:group?` } component={ GroupView } />
    </Switch>
  );
}
