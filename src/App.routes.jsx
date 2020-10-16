import React             from 'react';
import { Route, Switch } from 'react-router-dom';

import DataHome  from './modules/data/DataHome';
import PlotsHome from './modules/plotly/PlotsHome';
import DocsHome  from './modules/docs/DocsHome';
import Api  from './modules/docs/Api';

export default function AppRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={ DocsHome }/>
      <Route path="/plots" component={ PlotsHome } />
      <Route path="/data"  component={ DataHome } />
      <Route path="/api" component={ Api } />
    </Switch>
  );
}
