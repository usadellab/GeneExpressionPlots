import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PlotsHome from './modules/plotly/PlotsHome';
import ToolsModule from './modules/tools/ToolsModule';
import DataRoutes from './modules/data/data.routes';

const AppRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/data" component={DataRoutes} />
      <Route path="/plots" component={PlotsHome} />
      <Route path="/tools" component={ToolsModule} />
    </Switch>
  );
};

export default AppRoutes;
