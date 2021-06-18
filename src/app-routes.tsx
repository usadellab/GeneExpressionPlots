import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ToolsModule from './modules/tools/ToolsModule';
import DataRoutes from './pages/data/data-routes';
import PlotsRoutes from './pages/plots/plots-routes';

const AppRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/data" component={DataRoutes} />
      <Route path="/plots" component={PlotsRoutes} />
      <Route path="/tools" component={ToolsModule} />
    </Switch>
  );
};

export default AppRoutes;
