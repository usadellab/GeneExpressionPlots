import React from 'react';
import { Route, Switch } from 'react-router-dom';

import DataRoutes from './pages/data/data-routes';
import PlotsRoutes from './pages/plots/plots-routes';
import ToolsRoutes from './pages/tools/tools-routes';

const AppRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={DataRoutes} />
      <Route path="/data" component={DataRoutes} />
      <Route path="/plots" component={PlotsRoutes} />
      <Route path="/tools" component={ToolsRoutes} />
    </Switch>
  );
};

export default AppRoutes;
