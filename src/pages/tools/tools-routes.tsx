import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ToolsHome from './tools-home';
import GeneBrowser from './components/gene-browser';

const ToolsRoutes: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={ToolsHome} />
      <Route path={path + '/gene-browser'} component={GeneBrowser} />
    </Switch>
  );
};

export default ToolsRoutes;
