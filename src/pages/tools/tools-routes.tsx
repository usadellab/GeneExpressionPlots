import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ToolsHome from './tools-home';
import GeneBrowser from './components/gene-browser';
import EnrichmentTool from './components/enrichment-tool';

const ToolsRoutes: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={ToolsHome} />
      <Route path={path + '/gene-browser'} component={GeneBrowser} />
      <Route path={path + '/enrichment'} component={EnrichmentTool} />
    </Switch>
  );
};

export default ToolsRoutes;
