import React from 'react';
import { Route, Switch } from 'react-router-dom';

import DataHome from './modules/data/DataHome';
import PlotsHome from './modules/plotly/PlotsHome';
import ToolsModule from './modules/tools/ToolsModule';

export default function AppRoutes() {
  return (
    <Switch>
      <Route path="/plots" component={PlotsHome} />
      <Route path="/data" component={DataHome} />
      <Route path="/tools" component={ToolsModule} />
    </Switch>
  );
}
