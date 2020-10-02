import React                       from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import DataHome  from './modules/data/DataHome';
import PlotsHome from './modules/plotly/PlotsHome';

export default function AppRoutes() {
  return (
    <Switch>
      <Route exact path='/'>
        <Redirect to='/data' />
      </Route>
      <Route path="/plots" component={ PlotsHome } />
      <Route path="/data"  component={ DataHome } />
    </Switch>
  );
}
