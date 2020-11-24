import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import GeneBrowser from './pages/GeneBrowser';
import ToolsHome from './pages/ToolsHome';


class ToolsRoutes extends Component {
  render () {
    return (
      <Switch>
        <Route exact path={ '/tools' } component={ ToolsHome } />
        <Route path={ '/tools/gene-browser' } component={ GeneBrowser } />
      </Switch>
    );
  }
}

export default ToolsRoutes;