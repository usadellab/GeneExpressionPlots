import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import DataView   from './pages/DataView';
import GroupView  from './pages/GroupView';
import SampleView from './pages/SampleView';

export default function AppRoutes() {

  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={ path } component={ DataView } />
      <Route path={ `${path}/group/:groupIndex/sample/:sampleIndex?` } component={ SampleView } />
      <Route path={ `${path}/group/:groupIndex?` } component={ GroupView } />
    </Switch>
  );
}
