import React from 'react';
import { Route, Switch } from 'react-router-dom';

import DataRoutes from './pages/data/data-routes';
import InfoRoutes from './pages/info/info-routes';
import PlotsRoutes from './pages/plots/plots-routes';
import ToolsRoutes from './pages/tools/tools-routes';

const AppRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/data" component={DataRoutes} />
      <Route path="/plots" component={PlotsRoutes} />
      <Route path="/tools" component={ToolsRoutes} />
      <Route path="/docs" component={InfoRoutes} />
    </Switch>
  );
};

export default AppRoutes;
