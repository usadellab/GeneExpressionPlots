import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ToolsHome from './tools-home';

const ToolsRoutes: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={ToolsHome} />
    </Switch>
  );
};

export default ToolsRoutes;
